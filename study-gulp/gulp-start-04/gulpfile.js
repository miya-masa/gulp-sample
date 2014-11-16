var gulp = require('gulp');
var browserSync = require('browser-sync');
//ここから追加分
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');
var del = require('del');
var es = require('event-stream');

//ビルドタスク ここではscripts内のファイルを集めて
//連結とminify化
gulp.task('scripts', function () {
  return es.merge(
    gulp.src(['./app/lib/**/*.js'])
    .pipe(gulp.dest('./dist/scripts/lib')),
    gulp.src(['./app/scripts/**/*.js'])
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/scripts'))
  );
});

//htmlをdistに移動
gulp.task('html', function () {
  return gulp.src(['./app/**/*.html'])
    .pipe(gulp.dest('./dist'));
});

//distを削除する
//cbを指定して、終了を通知
gulp.task('clean', function (cb) {
  del(['dist'], cb);
});

//各種ビルドを実行する
gulp.task('build', function () {
  runSequence('clean', ['scripts', 'html']);
});

//成果物先をbrowserのルートとする
gulp.task('browser-sync', function (cb) {
  browserSync({
    server: {
      baseDir: './dist'
    }
  });
  cb();
});

//jsファイルを監視し、ブラウザのリロードとビルドを実行
gulp.task('watch', ['browser-sync', 'build'], function () {
  gulp.watch('app/scripts/**/*.js', ['build', browserSync.reload]);
  gulp.watch('app/**/*.html', ['build', browserSync.reload]);
});

//ビルドとwatchをデフォルトタスクにしている。
gulp.task('default', function () {
  runSequence('watch');
});
