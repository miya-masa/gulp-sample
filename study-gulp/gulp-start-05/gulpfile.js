var gulp = require('gulp');
var browserSync = require('browser-sync');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');
var del = require('del');
var es = require('event-stream');
// ここから追加分
var sourcemaps = require('gulp-sourcemaps');
var jshint = require('gulp-jshint');
var cache = require('gulp-cached');
var stylish = require('jshint-stylish');

//jshintのタスク.ライブラリとソースが分離するため別タスクで切り出す
gulp.task('jshint', function () {
  return gulp.src(['./app/scripts/**/*.js'])
    .pipe(cache('jslint'))
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(stylish));
});

//ビルドタスク ここではscripts内のファイルを集めて
//連結とminify化
gulp.task('scripts', ['jshint'], function () {
  return es.merge(
    gulp.src(['./app/lib/**/*.js'])
    .pipe(gulp.dest('./dist/scripts/lib')),

    gulp.src(['./app/scripts/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/scripts'))
  );
});
//htmlをdistに移動
gulp.task('html', function () {
  return gulp.src(['./app/**/*.html']).pipe(gulp.dest('./dist'));
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
