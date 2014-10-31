var gulp = require('gulp');
var minifyHtml = require('gulp-minify-html');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

gulp.task('browser-sync-app', function() {
    browserSync({
        server: {
            baseDir: './app'
        }
    });
});
gulp.task('browser-sync-dist', function() {
    browserSync({
        server: {
            baseDir: './dist'
        }
    });
});

gulp.task('lint', function() {
    return gulp.src(['./app/**/*.js','!./app/lib/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('del', function(cb) {
    del(['dist/**'], cb);
});

gulp.task('compress', function() {
    return gulp.src('app/**')
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.html', minifyHtml()))
        .pipe(gulp.dest('dist'));
});

gulp.task('build', function() {
    runSequence('del', ['compress', 'lint']);
});

gulp.task('default', ['build', 'browser-sync-app'], function() {

    gulp.watch('./app/**/*', ['build', browserSync.reload]);
});
