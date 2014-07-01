'use strict';

module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		copy: {
			app: {
				files: [
					{
						expand: true,
						cwd: 'bower_components/bootstrap/fonts/',
						src: [ '**' ],
						dest: 'src/dist/fonts/',
						filter: 'isFile'
					}
				]
			}
		},

		less: {
			app: {
				options: {
					paths: [
						'src/css',
						'bower_components'
					],
				},

				files: {
					'src/dist/app.css': 'src/css/app.less'
				}
			}
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			app: [ 'src/js/*.js' ]
		},

		browserify: {
			app: {
				files: {
					'src/dist/app.js': [
						'src/js/index.js'
					]
				}
			}
		},

		connect: {
			app: {
				options: {
					port: 9001,
					base: 'src/'
				}
			}
		},

		watch: {
			app: {
				files: [
					'src/css/*.less',
					'src/js/**/*.js'
				],
				tasks: [ 'default' ]
			}
		}
	});

	grunt.registerTask(
		'default',
		[
			'jshint:app',
			'browserify:app',

			'copy:app',
			'less:app',
			// 'autoprefixer:app',
		]
	);

	grunt.registerTask(
		'serve',
		[
			'default',
			'connect:app',
			'watch:app'
		]
	);
};
