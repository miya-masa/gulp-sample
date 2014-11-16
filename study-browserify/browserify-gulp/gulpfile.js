var gulp = require('gulp');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');
var cache = require('gulp-cached');
//ここから
var browserify = require('browserify');
var watchify = require('watchify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');


//jshintのタスク.ライブラリとソースが分離するため別タスクで切り出す
gulp.task('jshint', function () {
  return gulp.src(['./app/scripts/**/*.js'])
    .pipe(cache('jslint'))
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(stylish));
});

//ビルドタスク ここではscripts内のファイルを集めて
//連結とminify化
gulp.task('build', ['jshint'], function () {
  runSequence('jshint', 'browserify')
});

//jsファイルを監視し、ブラウザのリロードとビルドを実行
gulp.task('watch', ['browser-sync', 'build'], function () {
  gulp.watch('app/scripts/**/*.js', ['build', browserSync.reload]);
  gulp.watch('app/**/*.html', ['build', browserSync.reload]);
});

gulp.task('default', function () {
  runSequence('watch');
});

//app以下をbrowserのルートとする
gulp.task('browser-sync', function (cb) {
  browserSync({
    server: {
      baseDir: './app'
    }
  });
  cb();
});

gulp.task('browserify', function (cb) {

  // browserifyのオブジェクトの生成
  // watchify.argsはウォッチするための必須引数
  var b = browserify({
    // ここから watchifyを使うための必須プロパティ
    cache: {},
    packageCache: {},
    fullPaths: true,
    // ここまで watchifyを使うための必須プロパティ
    // debug フラグ。ソースマップを利用する場合trueにする
    debug: true,
    // エントリファイル
    entries: './app/scripts/main.js'
  });
  // main.jsをバンドルするオブジェクトの生成
  var w = watchify(b);

  function bundle() {
    return w
      // バンドルする
      .bundle()
      //バンドルした文字列をbundle.jsの書き込みストリームへ
      // bundle()の戻りがvinylではないのでsourceでその差を吸収する
      .pipe(source('bundle.js'))
      // ここからはvinyl-streamのやり取りなので、gulpのdestが利用できる
      // ./app/scriptsに出力する
      .pipe(buffer())
      .pipe(sourcemaps.init({
        // loadMapsはすでにsourcemapが定義されている場合、
        // それを利用する設定
        loadMaps: true
      }))
      .pipe(uglify())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./app/scripts'));
  }

  // updateイベントはbundleに関連するファイルの更新をウォッチする
  w.on('update', bundle);
  // 通常実行時はbundleの実行結果を返す(通常のgulpのストリームを返す)
  return bundle();
});
