var gulp = require('gulp');
var gutil = require('gulp-util');
var mochaPhantomJS = require('gulp-mocha-phantomjs');

var webpack = require('webpack');


gulp.task('compile-tests', function(done) {
	var webpackConfig = require('./tests/webpack.config');

	webpack(webpackConfig, function(err, stats) {
		if(err) {
			throw new gutil.PluginError('webpack', err);
		}

		gutil.log('[webpack]', stats.toString({
			colors: true
		}));

		done();
	});
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
