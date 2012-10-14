
var grunt = require('grunt'),
    path = require('path');

var baseDir = '.';
var tmpRunner = '_SpecRunner.html';


exports.buildSpecrunner = function(dir, options, reporters){
  var jasmineCss = [
    __dirname + '/../../jasmine/lib/jasmine-core/jasmine.css'
  ];

  var jasmineCore = [
    __dirname + '/../../jasmine/lib/jasmine-core/jasmine.js',
    __dirname + '/../../jasmine/lib/jasmine-core/jasmine-html.js'
  ];

  var phantomHelper = __dirname + '/../jasmine/phantom-helper.js';
  var jasmineHelper = __dirname + '/../jasmine/jasmine-helper.js';

  var styles = getRelativeFileList(jasmineCss);

  if (options.amd) {
    var specs = getRelativeFileList(options.specs);
    var scripts = getRelativeFileList(jasmineCore, options.helpers, phantomHelper, reporters, jasmineHelper);
  } else {
    var scripts = getRelativeFileList(jasmineCore, options.src, options.helpers, options.specs, phantomHelper, reporters, jasmineHelper);
  }

  var specRunnerTemplate = typeof options.template === 'string' ? {
    src: options.template,
    opts: {}
  } : options.template;

  var source;
  grunt.file.copy(specRunnerTemplate.src, path.join(dir,tmpRunner), {
    process : function(src) {
      source = grunt.util._.template(src, grunt.util._.extend({
        scripts : scripts,
        specs: specs,
        css : styles
      }, specRunnerTemplate.opts));
      return source;
    }
  });
  return source;
};


function getRelativeFileList(/* args... */) {
  var list = Array.prototype.slice.call(arguments);
  var base = path.resolve(baseDir);
  var files = [];
  list.forEach(function(listItem){
    files = files.concat(grunt.file.expandFiles(listItem));
  });
  files = grunt.util._(files).map(function(file){
    return path.resolve(file).replace(base,'');
  });
  return files;
}

