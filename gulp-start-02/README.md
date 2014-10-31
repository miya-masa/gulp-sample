  ４．buildの実行
  app/scripts/main.jsを圧縮して
  app/scripts/index.htmlを圧縮して
  dist/scripts/index.htmlに移動
  dist/scripts/main.min.jsに移動

  main.jsを作成する。
  中はconsole.logでも適当に吐いておけ
  index.htmlをまず作成する
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>title</title>
  </head>
  <body>
  Hello World!!
  <script src="/scripts/main.js" type="text/javascript" charset="utf-8"></script>
  </body>
</html>

まずリリースプロジェクトを削除するところから

削除
gulp.task('del', function(cb) {
    del(['dist/**']);
    cb();
});

次、圧縮して移動
gulp.task('compress', function() {
    return gulp.src('app/**')
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.html', minifyHtml()))
        .pipe(gulp.dest('dist'));
});
gulpIfの使い方

ビルドのエントリポイント
gulp.task('build', function() {
    runSequence('del', 'compress');
});

同期的に実行する方法
１．タスクでstreamを返す。
２．タスクの関数で仮引数にコールバックを指定し、それを呼び出す
３．プロミスを使う方法は省略

こんな感じ。

つぎ、公式おすすめインクリメンタルビルドのプラグイン
gulp-changed...変更があったファイルだけをビルド
gulp-cached...メモリにキャッシュさせる
gulp-remember...キャッシュと連携して使う
gulp-newer...新しいファイルのみ

gulpのwatch
開発時の話

開発してる時ブラウザを立ち上げ、保存と同時に自動的にリロードする。
あと、保存時にJSHintの構文チェックをする
gulp-jshint
jshint-stylish
をnpmインストール
プロジェクトルートに.jshintrcを置く

gulp.task('lint', function() {
  return gulp.src('./app/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});


