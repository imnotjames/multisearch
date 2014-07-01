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
						src: '**',
						dest: 'dist/assets/fonts/',
						filter: 'isFile'
					},
					{
						src: 'src/index.html',
						dest: 'dist/index.html'
					},
					{
						src: 'src/crossdomainrequest.user.js',
						dest: 'dist/crossdomainrequest.user.js'
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
					'dist/assets/css/app.css': 'src/css/app.less'
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
					'dist/assets/js/app.js': [
						'src/js/index.js'
					]
				}
			}
		},

		connect: {
			app: {
				options: {
					port: 9001,
					base: 'dist/'
				}
			}
		},

		watch: {
			app: {
				files: [
					'**'
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
