var gulp = require('gulp');
var browserSync = require('browser-sync');

//app以下をbrowserのルートとする
gulp.task('default', function(cb) {
    browserSync({
        server: {
            baseDir: './app'
        }
    });
    cb();
});
