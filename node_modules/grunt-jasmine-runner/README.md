# grunt-jasmine-runner

Grunt task for running jasmine specs via phantomjs.

[![Build Status](https://secure.travis-ci.org/jsoverson/grunt-jasmine-runner.png)](http://travis-ci.org/jsoverson/grunt-jasmine-runner)

## Getting Started

Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-jasmine-runner`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-jasmine-runner');
```

## Config
- jasmine
  - src : Your source files to test, loaded first
  - helpers : Any helpers files to aid in testing, loaded next
  - specs : Spec files that contain your jasmine tests
  - amd: If true the spec files will be loaded via an AMD `require` call.
  - timeout : The timeout where the tests are abandoned
  - template : Path to a custom template.
  - server :
    - port : The port to start the server on, defaults to 8888
  - junit :
    - output : The output directory for junit xml
  - phantomjs : A hash of options to pass to phantomjs eg {'ignore-ssl-errors' : true}

- jasmine-server
  - browser : Open user's default browser automatically? Default true

( all `jasmine` task configuration applies to `jasmine-server` )

```javascript
'jasmine' : {
  src : 'src/**/*.js',
  specs : 'specs/**/*Spec.js',
  helpers : 'specs/helpers/*.js',
  timeout : 10000,
  template : 'src/custom.tmpl',
  junit : {
    output : 'junit/'
  },
  phantomjs : {
    'ignore-ssl-errors' : true
  }
},
'jasmine-server' : {
  browser : false
}
```

## AMD Specs

If the `amd` flag is set in the config specs will be loaded via an AMD `require` call.  This does not make an assumption about the AMD library being used, you must specify the path to that in the helpers option e.g.

```javascript
helpers: [
  '/path/to/require.js',
  '/path/to/requireConfig.js'
],
```

Spec files should define the module(s) they are testing directly as the `src` config option will be ignored in this case e.g.

```javascript
define(['/src/myModule.js'], function(MyModule){
  describe('MyModule', function(){
    // etc...
  });
});
```

## PhantomJS

The base jasmine task requires phantomjs to be installed and in the executable path. Download [phantomjs here](http://phantomjs.org/)

## Running

After successful configuration, you can run your tests through phantomjs with :

```grunt jasmine```

Or open in a web browser with

```grunt jasmine-server```

## Example configuration

Here is an [example grunt jasmine configuration](https://github.com/jsoverson/grunt-jasmine-runner-example) based off the
 Pivotal Labs example app.

## Release History

* v0.6.0: Added basic support for AMD loading via requirejs
* v0.5.9: Fixed context issue ("Can't open 'null'")
* v0.5.8: Bugfixes
* v0.5.7: Fixed bug due to grunt 0.3.0/0.4.0 inconsistencies
* v0.5.6: Support for custom templates. Refactored in prep for grunt 0.4.0
* v0.5.5: Verbosity tweaks. Necessitated a push.
* v0.5.4: Added configuration to turn off the automatic browser open
* v0.5.3: Addressing issues #2 & #3. Added better error handling
* v0.5.2: Expanded to some more use cases.
* v0.5.1: First release.
* v0.5.0: (internal) Full rewrite again to dynamically generate specrunner.
* v0.4.1: (internal) Logging
* v0.4.0: (internal) Full rewrite in anticipation of grunt 0.4.0
* v0.3.0: (internal) Adding multiple reporters
* v0.2.5: (internal) Refactoring for performance
* v0.2.4: (internal) Fix phantom config
* v0.2.3: (internal) Update phantom runner, add error logging
* v0.2.2: forked from grunt-jasmine-task

## License
Copyright (c) 2012 Jarrod Overson
Licensed under the MIT license.

Portions adapted from grunt core tasks and are copyright Ben Alman and licensed under the MIT license

Forked from https://github.com/creynders/grunt-jasmine-task by Camille Reynders. No portions of the original code remain.
