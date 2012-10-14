/* global module:false */
module.exports = function( grunt ) {

	grunt.loadNpmTasks('grunt-jasmine-runner');

	grunt.initConfig({
		pkg: '<json:package.json>',

	    meta: {
	      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
	        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
	        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
	        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
	        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
	    },

	    watch: {
		    files: '<config:lint.files>',
		    tasks: 'lint jasmine'
		},

	    min: {
	      dist: {
	        src: 'src/<%= pkg.name %>.js',
	        dest: 'dist/<%= pkg.name %>.min.js'
	      }
	    },

		jasmine : {
	      src: ['lib/**/*.js', 'src/jail.js'],
	      specs : 'spec/**/*Spec.js',
	      helpers: ['spec/helpers/jasmine-jquery.js', 'spec/helpers/specHelper.js']
	    },

	    lint: {
	      files: ['src/<%= pkg.name %>.js']
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
	        browser: true
	      },
	      globals: {
	        jQuery: true,
	        define: true
	      }
	    }
	});

	// Default task.
	grunt.registerTask('default', 'lint jasmine min');
	grunt.registerTask('travis', 'jasmine');
};