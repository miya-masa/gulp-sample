var gulp = require('gulp');
var browserSync = require('browser-sync');

gulp.task('default', function() {
    console.log('Hello World!!!');
});
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: './app'
        }
    });
});
