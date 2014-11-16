# browserifyチュートリアル

## browserifyを動かす

最初にプロジェクトを作成しておく。

プロジェクトの作成は[ここ](https://github.com/miya-masa/gulp-sample#%E3%83%97%E3%83%AD%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E3%81%AE%E4%BD%9C%E6%88%90)を参照

#### browserifyの導入
browserifyをnpmでインストール
```sh 
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
 var runSequence = require('run-sequence');
 
 gulp.task('default', function() {
     runSequence('browser-sync');
 });
 
 //app以下をbrowserのルートとする
 gulp.task('browser-sync', function(cb) {
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
 var foo = require('./foo.js');
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
gulp-browserifyは非推奨なので使わずbrowserifyのライブラリを利用すること!!!!

各種プラグインをインストール
```sh
npm install -g watchify
npm install browserify watchify vinyl-source-stream --save-dev
```
<dl>
<dh>watchify</dh>
<dd>browserifyをウォッチするモジュール</dd>
<dh>vinyl-source-stream</dh>
<dd>vinylのストリームを扱うモジュール。gulpはvinylというファイルストリームで扱う</dd>
</dl>

browserifyタスクの定義

```javascript
 var gulp = require('gulp');
 var browserSync = require('browser-sync');
 var runSequence = require('run-sequence');
 var source = require('vinyl-source-stream');
 var watchify = require('watchify');
 var browserify = require('browserify');
 
 //...省略
 
 gulp.task('browserify', function(cb) {
 
     // browserifyのオブジェクトの生成
     // watchify.argsはウォッチするための必須引数
     var bsBundler = browserify({
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
     var watchBundler = watchify(bsBundler);
 
     // バンドルする関数
     function bundle() {
         return watchBundler
             // バンドルする
             .bundle()
             //バンドルした文字列をbundle.jsの書き込みストリームへ
             // bundle()の戻りがvinylではないのでsourceでその差を吸収する
             .pipe(source('bundle.js'))
             // ここからはvinyl-streamのやり取りなので、gulpのdestが利用できる
             // ./app/scriptsに出力する
             .pipe(gulp.dest('./app/scripts'));
     }
 
     // updateイベントはbundleに関連するファイルの更新をウォッチする
     watchBundler.on('update', bundle);
     // 通常実行時はbundleの実行結果を返す(通常のgulpのストリームを返す)
     return bundle();
 });
```

ここまで設定すると、browserifyタスクでバンドルをするところまではウォッチできる。

#### gulpとさらに融合する

ここではさらに、

* jshint
* uglify
* browser-sync

をさらにウォッチ対象に追加する。

##### jshintのタスクを追加

```javascript
// ... 省略
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
// ... 省略

//jshintのタスク.
gulp.task('jshint', function() {
    return gulp.src(['./app/scripts/**/*.js'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter(stylish));
});
// ... 省略
```
##### uglify(圧縮の設定)

browserifyが生成したbundle.jsに対して圧縮をかける。その際にsourcemapが崩れないように設定を追加する必要がある。

``` javascript
// ...省略
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

var buffer = require('vinyl-buffer');
// ...省略

gulp.task('browserify', function(cb) {

    // ...省略

    function bundle() {
        return watchBundler
            // バンドルする
            .bundle()
            //バンドルした文字列をbundle.jsの書き込みストリームへ
            // bundle()の戻りがvinylではないのでsourceでその差を吸収する
            .pipe(source('bundle.js'))
            // sourcemapsはstrema形式は対応していないのでbufferを挟む。
            // 詳細はnodeのストリームを参照する
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
    // ... 省略
});
```

##### タスクをまとめる

最後にビルドをまとめる

``` javascript
//ビルドタスク ここではscripts内のファイルを集めて
//連結とminify化
gulp.task('build', ['jshint'], function() {
    runSequence('jshint', 'browserify')
});

//jsファイルを監視し、ブラウザのリロードとビルドを実行
gulp.task('watch', ['browser-sync', 'build'], function() {
    gulp.watch('app/scripts/**/*.js', ['build', browserSync.reload]);
    gulp.watch('app/**/*.html', ['build', browserSync.reload]);
});

gulp.task('default', function() {
    runSequence('watch');
});
```

実行してみて以下の事柄を確認して見ましょう。

1. app以下のファイルを保存時にブラウザリロード
1. app以下のファイルを保存時にビルド
1. bundle.jsが圧縮されている
1. コンソールにjshintの実行結果が出力されている
1. ソースマップが有効になっている

以上。
