var gulp = require('gulp');
var browserSync = require('browser-sync');

gulp.task('browser-sync', function (cb) {
  browserSync({
    server: {
      baseDir: './app'
    }
  });
  cb();
});

gulp.task('default', ['browser-sync'], function () {
  gulp.watch('app/scripts/**/*.js', [browserSync.reload]);
  gulp.watch('app/**/*.html', browserSync.reload);
});
