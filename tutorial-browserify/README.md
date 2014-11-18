# browserifyチュートリアル

## browserifyを動かす

最初にプロジェクトを作成しておく。

プロジェクトの作成は[ここ](../tutorial-gulp/README.html)を参照

#### browserifyの導入
browserifyをnpmでインストール
```sh 
// browserifyコマンドが利用できるようになる
npm install browserify -g
```

#### 公開されているモジュール使う

browserifyはnpmで公開されているモジュールを使うことが可能。
ここでは**uniq**というモジュールを使う。

``` sh
# 実行時に使うので--saveにするとnpmのパッケージに管理に基づくが、
# そうしなくても動作はする
npm install uniq --save
# ソースコードのディレクトリを作成
mkdir -p app/scripts
```
scripts以下にmain.jsを作成し、
モジュールを読み込み、利用するコードを記述する
```javascript
// main.js
// npmで取り込んだuniqというライブラリの利用宣言
// 配列からユニークなものを抽出し、ソートする関数
var uniq = require('uniq');
var nums = [ 5, 2, 1, 3, 2, 5, 4, 2, 0, 1 ];
console.log(uniq(nums));
```

browserifyで変換(バンドル)する。
```sh
browserify ./app/scripts/main.js > ./app/scripts/bundle.js
```

bundle.jsを読み込むhtmlを作成し、実行する。

ここではgulpのbrowser-syncを使って実行する
```sh
npm install gulp browser-sync run-sequence --save-dev
```
``` javascript
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
```
gulpを実行して確認する
```sh
gulp
```

#### モジュールを作成する

自作のモジュールを作成する。
./app/scripts/にfoo.jsを作成する

```
// module.exportsというオブジェクトに公開したいオブジェクトを紐づける
module.exports = function(name) {
    //"Hello 名前!!!!"を返す関数
    return 'Hello ' + name + '!!!!';
};
```

main.jsにfoo.jsを読み込む処理を追加する

```javascript
 var uniq = require('uniq');
 // ファイル名の相対パスを記述する
 var foo = require('./foo');
 var nums = [ 5, 2, 1, 3, 2, 5, 4, 2, 0, 1 ];
 console.log(uniq(nums));
 // 公開した関数を利用
 console.log(foo('Miya'));
```

バンドルして実行
``` sh 
browserify app/scripts/main.js > app/scripts/bundle.js
gulp
```

#### browserifyをgulpで利用する

gulpと統合して使いやすくする。

**注意!!!**
~~gulp-browserifyは非推奨なので使わずbrowserifyのライブラリを利用すること!!!!~~
もう使えないらしい

各種プラグインをnpmでインストール
```
gulp
browser-sync
run-sequence
gulp-sourcemaps
gulp-jshint
jshint-stylish
gulp-uglify
gulp-cached
browserify
watchify
vinyl-buffer
vinyl-source-stream
```
<dl>
<dh>watchify</dh>
<dd>browserifyをウォッチするモジュール</dd>
<dh>vinyl-source-stream</dh>
<dd>vinylのストリームを扱うモジュール。gulpはvinylというファイルストリームで扱う</dd>
</dl>

browserifyタスクの定義

1. 保存時に静的検査
1. Browserifyでバンドル
1. バンドルファイルの圧縮
1. ソースマップの設定
1. ブラウザ連携

```javascript
var gulp = require('gulp');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');
var cache = require('gulp-cached');
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
```

実行してみて以下の事柄を確認して見ましょう。

1. app以下のファイルを保存時にブラウザリロード
1. app以下のファイルを保存時にビルド
1. bundle.jsが圧縮されている
1. コンソールにjshintの実行結果が出力されている
1. ソースマップが有効になっている

以上。
