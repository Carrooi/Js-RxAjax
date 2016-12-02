var gulp = require('gulp');
var mochaPhantomJS = require('gulp-mocha-phantomjs');

var webpack = require('webpack-stream');


gulp.task('build:tests', function() {
	return gulp.src(__dirname + '/tests/index.ts')
		.pipe(webpack(require('./tests/webpack.config')))
		.pipe(gulp.dest(__dirname + '/tests/public'));
});


gulp.task('tests', function () {
	return gulp
		.src('./tests/index.html')
		.pipe(mochaPhantomJS({
			phantomjs: {
				useColors: true,
				settings: {
					webSecurityEnabled: false
				}
			}
		}));
});
