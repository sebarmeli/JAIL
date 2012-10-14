var grunt = require('grunt'),
fs = require('fs');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

var task = require('../tasks/jasmine');

exports['jasmine-runner'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'dynamic generation': function(test) {
    test.expect(4);
    // tests here

    var config = {
      timeout: 10000,
      src     : 'jasmine/lib/jasmine-core/example/src/**/*.js',
      helpers : 'jasmine/lib/jasmine-core/example/**/*Helper.js',
      specs   : ['jasmine/lib/jasmine-core/example/**/*Spec.js'], // array to test support
      server  : {
        port : 8888
      },
      junit : {
        output : 'junit'
      },
      phantomjs : {
        'ignore-ssl-errors' : true,
        'local-to-remote-url-access' : true,
        'web-security' : false
      }
    };

    function cb(err,status){
      test.equal(status.specs, 5, 'Found total specs from example');
      test.equal(status.total, 8, 'Ran all specs from example');
      test.equal(status.passed, 8, 'Passed all specs from example');
      test.ok(!err, 'No error received');
      test.done();
    }

    task.phantomRunner(config, cb);
  },
  'custom template': function(test) {
    test.expect(5);
    // tests here

    var config = {
      timeout: 10000,
      src     : 'jasmine/lib/jasmine-core/example/src/**/*.js',
      helpers : 'jasmine/lib/jasmine-core/example/**/*Helper.js',
      specs   : ['jasmine/lib/jasmine-core/example/**/*Spec.js'], // array to test support
      server  : {
        port : 8888
      },
      template: {
        src: 'test/fixtures/customTemplate/custom.tmpl',
        opts: {
          title: 'foo'
        }
      },
      junit : {
        output : 'junit'
      },
      phantomjs : {
        'ignore-ssl-errors' : true,
        'local-to-remote-url-access' : true,
        'web-security' : false
      }
    };

    function cb(err,status){
      test.equal(status.specs, 5, 'Found total specs from example');
      test.equal(status.total, 8, 'Ran all specs from example');
      test.equal(status.passed, 8, 'Passed all specs from example');
      test.ok(!err, 'No error received');

      var actual = grunt.file.read('_SpecRunner.html'),
      expected = grunt.file.read('test/expected/customTemplate/_SpecRunner.html');

      test.equal(expected, actual, 'generated spec runner with custom template');
      test.done();
    }

    task.phantomRunner(config, cb);
  }
};
