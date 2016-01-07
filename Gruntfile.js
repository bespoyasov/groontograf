/*
 * grunt-contrib-groontograf
 * http://groontograf.bespoyasov.ru
 *
 * Copyright (c) 2015 Alexander Bespoyasov
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	grunt.initConfig({
		jshint: {
			all: [
				//'tasks/*.js',
				'<%= nodeunit.tests %>'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		clean: {
			tests: ['tmp']
		},

		groontograf: {
			default_options: {
				options: {
					
				},
				files: {
					'tmp/default_options.html': ['test/fixtures/test.html']
				}
			},
			custom_options: {
				options: {
					hang: true,
					abbr: true,
					halfSpace: true,
					styles: 'class',
					abbrClassName: 'smallcaps',
					hangClassName: ['qtSpace', 'qt', 'brtSpace', 'brt'],
					halfSpaceClassName: 'halfspace'
				},
				files: {
					'tmp/custom_options.html': ['test/fixtures/test.html']
				}
			}
		},

		nodeunit: {
			tests: ['test/*_test.js']
		}

	});

	grunt.loadTasks('tasks');

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');

	grunt.registerTask('test', ['clean', 'groontograf', 'nodeunit']);
	grunt.registerTask('default', ['jshint', 'test']);

};
