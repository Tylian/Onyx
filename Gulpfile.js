// Gulp Dependencies
var gulp = require('gulp');
var rename = require('gulp-rename');

// Build Dependencies
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

// Style Dependencies
var less = require('gulp-less');
var prefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');


gulp.task('browserify-client', function() {
	var b = browserify({
		entries: 'client/index.js',
		debug: true,
	});
	return b.bundle()
		.pipe(source("client.js"))
		.pipe(buffer())
		.pipe(gulp.dest('build'))
		.pipe(gulp.dest('public/js'));
});

gulp.task('watch', function() {
  gulp.watch('client/**/*.js', ['browserify-client']);
  gulp.watch('client/**/*.less', ['styles']);
});

gulp.task('styles', function() {
  return gulp.src('client/less/index.less')
    .pipe(less())
    .pipe(prefix({ cascade: true }))
    .pipe(rename('style.css'))
    .pipe(gulp.dest('build'))
    .pipe(gulp.dest('public/css'));
});

gulp.task('minify', ['styles'], function() {
  return gulp.src('build/style.css')
    .pipe(minifyCSS())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('public/css'));
});

gulp.task('uglify', ['browserify-client'], function() {
  return gulp.src('build/client.js')
    .pipe(uglify())
    .pipe(rename('client.min.js'))
    .pipe(gulp.dest('public/js'));
});

gulp.task('build', ['uglify', 'minify']);
gulp.task('default', ['build', 'watch']);