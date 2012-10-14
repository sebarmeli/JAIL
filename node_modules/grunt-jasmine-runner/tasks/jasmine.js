/*
 * Copyright (c) 2012 Jarrod Overson
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

/*jshint node:true, curly:false*/

"use strict";

var fs = require('fs'),
    path = require('path'),
    URL = require('url'),
    sysopen = require('open'),
    grunt = require('grunt');

grunt.util = grunt.utils;

var server = require('./lib/server'),
    jasmine = require('./lib/jasmine'),
    phantomjs = require('./lib/phantomjs');

var baseDir = '.',
    tmpRunner = '_SpecRunner.html',
    options,
    defaultOptions = {
      timeout : 10000,
      specs   : [],
      src     : [],
      helpers : [],
      template: {
        src: __dirname + '/../jasmine/SpecRunner.tmpl',
        opts: {}
      },
      phantomjs : {}
};

module.exports = task;

function task(grunt){
  phantomjs = phantomjs.init(grunt);
  grunt.util = grunt.utils;

  grunt.registerTask('jasmine', 'Run jasmine specs headlessly through PhantomJS.', function() {
    options = grunt.config('jasmine');

    var done = this.async();

    task.phantomRunner(options, function(err,status) {
      if (status && status.failed > 0) {
        grunt.log.error(grunt.util._("%s of %s total specs failed").sprintf(status.failed, status.total));
      }
      if (err) grunt.log.error(err);
      done(!err && status.failed === 0);
    });

  });

  grunt.registerTask('jasmine-server', 'Run jasmine specs headlessly through PhantomJS.', function() {
    var done   = this.async();
    task.interactiveRunner(grunt.config('jasmine'));
  });

  phantomjs.on('fail.timeout',function(){
    grunt.log.writeln();
    grunt.warn('PhantomJS timed out, possibly due to an unfinished async spec.', 90);
  });

  phantomjs.on('console',console.log.bind(console));
  phantomjs.on('verbose',grunt.verbose.writeln.bind(grunt.verbose));
  phantomjs.on('debug', grunt.log.debug.bind(grunt.log, 'phantomjs'));
  phantomjs.on('write', grunt.log.write.bind(grunt.log));
  phantomjs.on('writeln', grunt.log.writeln.bind(grunt.log));
  phantomjs.on('onError',function(string, trace){
    if (trace && trace.stack) {
      console.log(trace.stack.red);
    } else {
      console.log(string.red);
    }
  });

  phantomjs.on('jasmine.*', function() {
    //var args = [this.event].concat(grunt.util.toArray(arguments));
    // grunt 0.4.0
    // grunt.event.emit.apply(grunt.event, args);
  });
}


task.phantomRunner = function(options,cb){
  options = grunt.util._.extend({},defaultOptions,options);

  var phantomReporters = [
      __dirname + '/jasmine/reporters/ConsoleReporter.js',
      __dirname + '/jasmine/reporters/JUnitReporter.js'
    ],
    port = (options.server && options.server.port) || 8888;

  var url = URL.format({
    protocol : 'http',
    hostname : '127.0.0.1',
    port : port + '',
    pathname : path.join(baseDir,tmpRunner)
  });

  grunt.verbose.subhead('Testing jasmine specs via phantom').or.writeln('Testing jasmine specs via phantom');
  jasmine.buildSpecrunner(baseDir, options, phantomReporters);
  var server = startServer(baseDir, port);

  runPhantom(url,options,phantomReporters.length,function(err,status){
    server.close();
    if (typeof cb === 'function') cb(err,status);
  });
};

task.interactiveRunner = function(options,cb){
  options = grunt.util._.extend({},defaultOptions,options);

  var port = (options.server && options.server.port) || 8888;

  var url = URL.format({
    protocol : 'http',
    hostname : '127.0.0.1',
    port : port + '',
    pathname : path.join(baseDir,tmpRunner)
  });

  jasmine.buildSpecrunner(baseDir, options, []);
  startServer(baseDir, port);
  grunt.log.writeln('Run your tests at ' + url);

  var serverSettings = grunt.config('jasmine-server') || {};
  if (serverSettings.browser !== false) sysopen(url);

  if (typeof cb === 'function') cb();
};

function startServer(base, port) {
  grunt.verbose.writeln('Starting static web server on port ' + port);
  return server.start(base, port, { debug : grunt.option('debug') });
}

function runPhantom(url,options,numReporters, cb) {
  var status;
  setupTestListeners(options,numReporters,function(testStatus){
    status = testStatus;
  });
  phantomjs.spawn(url, {
    failCode : 90,
    options  : options,
    done     : function(err){
      cb(err,status);
    }
  });
}

function setupTestListeners(options,numReporters, doneCallback) {
  var status = {
    specs    : 0,
    failed   : 0,
    passed   : 0,
    total    : 0,
    skipped  : 0,
    duration : 0
  };

  phantomjs.on('jasmine.begin',function(){
    grunt.verbose.writeln('Starting...');
  });

  phantomjs.on('jasmine.writeFile',function(type,filename, xml){
    var dir = options[type] && options[type].output;
    if (dir) {
      grunt.file.mkdir(dir);
      grunt.file.write(path.join(dir, filename), xml);
    }
  });

  phantomjs.on('jasmine.testDone',function(totalAssertions, passedAssertions, failedAssertions, skippedAssertions){
    status.specs++;
    status.failed  += failedAssertions;
    status.passed  += passedAssertions;
    status.total   += totalAssertions;
    status.skipped += skippedAssertions;
  });

  phantomjs.on('jasmine.done',function(elapsed){
    grunt.verbose.writeln('All reporters done.');
    phantomjs.halt();
    status.duration = elapsed;
    doneCallback(status);
  });

  var reportersDone = 0;
  phantomjs.on('jasmine.done.*',function(){
    reportersDone++;
    if (reportersDone === numReporters) phantomjs.emit('jasmine.done');
  });

  phantomjs.on('jasmine.done.ConsoleReporter',function(){
  });
  phantomjs.on('jasmine.done.JUnitReporter',function(){
  });

  phantomjs.on('jasmine.done_fail',function(url){
    grunt.log.error();
    grunt.warn('PhantomJS unable to load "' + url + '" URI.', 90);
  });
}




