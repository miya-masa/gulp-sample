# プロジェクトの作成

1. nodeをインストール

1. 適当なディレクトリを作成し、Gitリポジトリ管理
```sh
mkdir gulp-sample
cd gulp-sample
git init
```

1. package.jsonのひな形作成(適当に進んでOK)
```sh
npm init
```

# gulpを触ってみよう
1. gulpをインストール
```sh
# これでgulpコマンドを実行できるようになります
npm install --global gulp
# プロジェクト直下で実行
# これでgulpライブラリを使用できるようになります
npm install gulp --save-dev 
```
--save-devをつけるとpackage.jsonのdevDependenciesに追加してくれる。
--saveだとdependencies。

1. gulpfile.jsの作成
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
1. gulpの実行
```sh
# タスク名を指定しないとdefaultが実行される
gulp 
# タスク名を指定すると該当するタスクが実行される
gulp mytask
```

# gulpでビルド

gulpを利用して、

* javascriptの連結
* javascriptの圧縮
* 成果物の出力

をやってみる

1. プラグインの準備
1. タスクを書く
1. 実行

# gulpで開発

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
