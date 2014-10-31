１．プロジェクトの作成
  nodeのインストール
  適当なディレクトリにプロジェクト用のディレクトリを作成して、
  リポジトリ管理する
  mkdir ~\gulp-start\
  cd ~\gulp-start\
  git init
  package.jsonのひな形作成
  npm init
  適当に進む
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
