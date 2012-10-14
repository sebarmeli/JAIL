module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    test: {
      files: ['test/**/*_test.js']
    },
    lint: {
      files: ['grunt.js', 'tasks/**/*.js']
    },
    watch: {
      files: ['<config:jasmine.specs>','grunt.js','tasks/**/*js'],
      tasks: 'jasmine'
    },
    jasmine : {
      specs : 'spec/**/*.js',
      server : {
        port : 9900,
      }
    },
    'jasmine-server' : {
      browser : true
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        es5: true
      },
      globals: {}
    }
  });

  // Load local tasks.
  grunt.loadTasks('tasks');

  // Default task.
  grunt.registerTask('default', 'lint jasmine test');

};
