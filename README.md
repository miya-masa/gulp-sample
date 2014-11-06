# プロジェクトの作成
---

#### nodeをインストール
nodeのWebサイトからインストール
#### プロジェクトの作成
適当なディレクトリを作成し、Gitリポジトリ管理する。
```sh
mkdir gulp-sample
cd gulp-sample
git init
```
.gitignoreにnode_modules/を加える
#### package.jsonのひな形作成
プロジェクトのルートで実行する。
対話があるが、適当でOK
```sh
npm init
```

# gulpを触ってみよう
---
#### gulpをインストール
\-globalはマシンで一回だけでOK
```sh
# これでgulpコマンドを実行できるようになります
npm install --global gulp
# プロジェクト直下で実行
# これでgulpライブラリを使用できるようになります
npm install gulp --save-dev 
```
--save-devをつけるとpackage.jsonのdevDependenciesに追加してくれる。

--saveだとdependencies。
#### gulpfile.jsの作成
ビルドの設定ファイルを記述する。プロジェクトのルートに**gulpfile.js**という名前で保存すること。
下記は、コンソールに文字列を表示するタスク。
```js
 var gulp = require('gulp');
 // defaultはデフォルトタスク
 gulp.task('default', function() {
   console.log('Hello World!!!!');
 });

 gulp.task('mytask', function() {
   console.log('Hello MyTask!!!!');
 });
```
#### gulpの実行
タスクを実行する。プロジェクトルートで下記コマンドを実行する
```sh
# タスク名を指定しないとdefaultが実行される
gulp 
# タスク名を指定すると該当するタスクが実行される
gulp mytask
```

# gulpで今までの開発
---

jquery.jsとmain.jsとfoo.jsとhtmlも用意。TODO

#### プラグインの準備
ブラウザで確認するため、browser-syncを導入。厳密には全然違うが簡易Webサーバーくらいの認識で良い。
```sh
# browser-syncを追加
npm install browser-sync --save-dev
```

#### gulpfile.jsの設定
以下のタスクを追加する。
```javascript
 var browserSync = require('browser-sync');
 //...省略
 gulp.task('browser-sync', function() {
     browserSync({
         server: {
           //アプリケーションルートのディレクトリ
             baseDir: './app'
         }
     });
 });
```

#### 実行
```sh
gulp browser-sync
```
#### watch
gulpにはファイルの保存を監視し、タスク(又は関数)を実行する**watch**という機能がある。

javascriptかhtmlの保存をフックして、ブラウザを更新するタスクを追加する。

```javascript
// 第二引数の配列で依存関係を追加できる
 gulp.task('watch', ['browser-sync'], function() {
     // ブラウザのリロードはbrowserSync.reload関数を利用する
     gulp.watch('app/scripts/**/*.js', browserSync.reload);
     gulp.watch('app/**/*.html', browserSync.reload);
 });
```
```sh
gulp watch
```
jsを保存してみて、画面が更新されたら成功。

# gulpでビルド
---

gulpを利用して、

* javascriptの連結
* javascriptの圧縮
* 成果物の出力

をやってみる

#### プラグインの準備 
プラグインをインストールする。基本的にはnpmコマンドでインストールする。
```sh
# プロジェクトディレクトリで実行
# 連結用のプラグインと圧縮用のプラグインと
# 同期実行用のプラグイン用意
npm install gulp-concat gulp-uglify run-sequence del --save-dev
```

#### タスクを書く
プラグインを読み込んで、ビルドするタスクの最小セット。
```javascript
//プラグイン読み込み部分
//詳細は各種プラグインのウェブサイト参照の事
var gulp = require('gulp');
var browserSync = require('browser-sync');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');
var del = require('del');

//ビルドタスク ここではscripts内のファイルを集めて
//連結とminify化
gulp.task('scripts', function() {
    return gulp.src(['./app/lib/**/*.js', './app/scripts/**/*.js'])
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/scripts'));
});
//htmlをdistに移動
gulp.task('html', function() {
    return gulp.src(['./app/**/*.html']).pipe(gulp.dest('./dist'));
});

//distを削除する
//cbを指定して、終了を通知
gulp.task('clean', function(cb) {
    del(['dist'], cb);
});

//各種ビルドを実行する
gulp.task('build', function() {
    runSequence('clean', ['scripts', 'html']);
});

//成果物先をbrowserのルートとする
gulp.task('browser-sync', function(cb) {
    browserSync({
        server: {
            baseDir: './dist'
        }
    });
    cb();
});

//jsファイルを監視し、ブラウザのリロードとビルドを実行
gulp.task('watch', ['browser-sync', 'build'], function() {
    gulp.watch('app/scripts/**/*.js', ['build', browserSync.reload]);
    gulp.watch('app/**/*.html', ['build', browserSync.reload]);
});

//ビルドとwatchをデフォルトタスクにしている。
gulp.task('default', function() {
    runSequence('watch');
});
```
#### 実行
```sh
gulp
```
ビルド出来ました？

# gulpで開発
---

#### より良くするために

圧縮された状態だとデバッグやりづらい(sourcemap)

静的検査とかもやりたい(JSHint)

というわけで
* sourcemapの出力
* JSHintの実行
を盛り込む

#### pluginの準備
```sh
npm install jshint-stylish gulp-sourcemaps --save-dev
```

２．CommonJSを試す
  ワークスページのディレクトリの作成
  mkdir app
  javascript用のディレクトリの作成
  mkdir scripts
  main.jsの作成
  console.log('Hello World!!!!');
  nodeで実行
  node main.js
  実行を確認
  app/scripts/foo.jsを作成
  module.exports = function(name){
    console.log('Hello ' +name+ '!!!!');
  };

  app/scripts/main.jsからfoo.jsを読み込み

var foo = require('./foo.js');
console.log(foo('MIYA'));

nodeで実行
これがCommonJSのモジュール化

３．gulpでタスク実行
  gulpのインストール
  npm install gulp -g

  gulpのライブラリのインストール
  npm install gulp --save-dev
  package.jsonにdevDependencyに記述される
  --save-dev => devDependency(開発時に必要になるモジュール)
  --save => dependency(実行時に必要になるモジュール)

  プロジェクトのルートディレクトリでgulpfile.jsを作成
  内容を記述
    var gulp = require('gulp');

    gulp.task('default', function() {
        console.log('Hello World!!!');
    });
  実行

  ４．buildの実行
  app/scripts/main.jsを圧縮して
  dist/scripts/main.min.jsに移動
