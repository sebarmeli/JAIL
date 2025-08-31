module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    connect: {
      server: {
        options: {
          port: 8000,
          base: '.'
        }
      }
    },

    jshint: {
      files: ['src/jail.js'],
      options: {
        globals: {
          jQuery: true,
          define: true
        }
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
          '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
          '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
          ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n'
      },
      dist: {
        files: {
          'dist/jail.min.js': ['src/jail.js']
        }
      }
    },

    jasmine: {
      pivotal: {
        src: 'src/jail.js',
        options: {
          specs: 'spec/jailSpec.js',
          helpers: [
            'spec/helpers/jasmine-jquery.js',
            'spec/helpers/specHelper.js'
          ],
          vendor: [
            'lib/jquery.js',
            'lib/require.js'
          ],
          host: 'http://127.0.0.1:8000'
        }
      }
    },

    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'jasmine']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint', 'connect', 'jasmine', 'uglify']);
  grunt.registerTask('travis', ['jshint', 'connect', 'jasmine']);
  grunt.registerTask('test', ['connect', 'jasmine']);
};
