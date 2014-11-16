# browserify�`���[�g���A��

## browserify�𓮂���

�ŏ��Ƀv���W�F�N�g���쐬���Ă����B

�v���W�F�N�g�̍쐬��[����](https://github.com/miya-masa/gulp-sample#%E3%83%97%E3%83%AD%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E3%81%AE%E4%BD%9C%E6%88%90)���Q��

#### browserify�̓���
browserify��npm�ŃC���X�g�[��
```sh 
npm install browserify -g
```

#### ���J����Ă��郂�W���[���g��

browserify��npm�Ō��J����Ă��郂�W���[�����g�����Ƃ��\�B
�����ł�**uniq**�Ƃ������W���[�����g���B

``` sh
# ���s���Ɏg���̂�--save�ɂ����npm�̃p�b�P�[�W�ɊǗ��Ɋ�Â����A
# �������Ȃ��Ă�����͂���
npm install uniq --save
# �\�[�X�R�[�h�̃f�B���N�g�����쐬
mkdir -p app/scripts
```
scripts�ȉ���main.js���쐬���A
���W���[����ǂݍ��݁A���p����R�[�h���L�q����
```javascript
// main.js
// npm�Ŏ�荞��uniq�Ƃ������C�u�����̗��p�錾
// �z�񂩂烆�j�[�N�Ȃ��̂𒊏o���A�\�[�g����֐�
var uniq = require('uniq');
var nums = [ 5, 2, 1, 3, 2, 5, 4, 2, 0, 1 ];
console.log(uniq(nums));
```

browserify�ŕϊ�(�o���h��)����B
```sh
browserify ./app/scripts/main.js > ./app/scripts/bundle.js
```

bundle.js��ǂݍ���html���쐬���A���s����B

�����ł�gulp��browser-sync���g���Ď��s����
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
 
 //app�ȉ���browser�̃��[�g�Ƃ���
 gulp.task('browser-sync', function(cb) {
     browserSync({
         server: {
             baseDir: './app'
         }
     });
     cb();
 });
```
gulp�����s���Ċm�F����
```sh
gulp
```

#### ���W���[�����쐬����

����̃��W���[�����쐬����B
./app/scripts/��foo.js���쐬����

```
// module.exports�Ƃ����I�u�W�F�N�g�Ɍ��J�������I�u�W�F�N�g��R�Â���
module.exports = function(name) {
    //"Hello ���O!!!!"��Ԃ��֐�
    return 'Hello ' + name + '!!!!';
};
```

main.js��foo.js��ǂݍ��ޏ�����ǉ�����

```javascript
 var uniq = require('uniq');
 // �t�@�C�����̑��΃p�X���L�q����
 var foo = require('./foo.js');
 var nums = [ 5, 2, 1, 3, 2, 5, 4, 2, 0, 1 ];
 console.log(uniq(nums));
 // ���J�����֐��𗘗p
 console.log(foo('Miya'));
```

�o���h�����Ď��s
``` sh 
browserify app/scripts/main.js > app/scripts/bundle.js
gulp
```

#### browserify��gulp�ŗ��p����

gulp�Ɠ������Ďg���₷������B

**����!!!**
gulp-browserify�͔񐄏��Ȃ̂Ŏg�킸browserify�̃��C�u�����𗘗p���邱��!!!!

�e��v���O�C�����C���X�g�[��
```sh
npm install -g watchify
npm install browserify watchify vinyl-source-stream --save-dev
```
<dl>
<dh>watchify</dh>
<dd>browserify���E�H�b�`���郂�W���[��</dd>
<dh>vinyl-source-stream</dh>
<dd>vinyl�̃X�g���[�����������W���[���Bgulp��vinyl�Ƃ����t�@�C���X�g���[���ň���</dd>
</dl>

browserify�^�X�N�̒�`

```javascript
 var gulp = require('gulp');
 var browserSync = require('browser-sync');
 var runSequence = require('run-sequence');
 var source = require('vinyl-source-stream');
 var watchify = require('watchify');
 var browserify = require('browserify');
 
 //...�ȗ�
 
 gulp.task('browserify', function(cb) {
 
     // browserify�̃I�u�W�F�N�g�̐���
     // watchify.args�̓E�H�b�`���邽�߂̕K�{����
     var bsBundler = browserify({
         // �������� watchify���g�����߂̕K�{�v���p�e�B
         cache: {},
         packageCache: {},
         fullPaths: true,
         // �����܂� watchify���g�����߂̕K�{�v���p�e�B
         // debug �t���O�B�\�[�X�}�b�v�𗘗p����ꍇtrue�ɂ���
         debug: true,
         // �G���g���t�@�C��
         entries: './app/scripts/main.js'
     });
     // main.js���o���h������I�u�W�F�N�g�̐���
     var watchBundler = watchify(bsBundler);
 
     // �o���h������֐�
     function bundle() {
         return watchBundler
             // �o���h������
             .bundle()
             //�o���h�������������bundle.js�̏������݃X�g���[����
             // bundle()�̖߂肪vinyl�ł͂Ȃ��̂�source�ł��̍����z������
             .pipe(source('bundle.js'))
             // ���������vinyl-stream�̂����Ȃ̂ŁAgulp��dest�����p�ł���
             // ./app/scripts�ɏo�͂���
             .pipe(gulp.dest('./app/scripts'));
     }
 
     // update�C�x���g��bundle�Ɋ֘A����t�@�C���̍X�V���E�H�b�`����
     watchBundler.on('update', bundle);
     // �ʏ���s����bundle�̎��s���ʂ�Ԃ�(�ʏ��gulp�̃X�g���[����Ԃ�)
     return bundle();
 });
```

�����܂Őݒ肷��ƁAbrowserify�^�X�N�Ńo���h��������Ƃ���܂ł̓E�H�b�`�ł���B

#### gulp�Ƃ���ɗZ������

�����ł͂���ɁA

* jshint
* uglify
* browser-sync

������ɃE�H�b�`�Ώۂɒǉ�����B

##### jshint�̃^�X�N��ǉ�

```javascript
// ... �ȗ�
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
// ... �ȗ�

//jshint�̃^�X�N.
gulp.task('jshint', function() {
    return gulp.src(['./app/scripts/**/*.js'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter(stylish));
});
// ... �ȗ�
```
##### uglify(���k�̐ݒ�)

browserify����������bundle.js�ɑ΂��Ĉ��k��������B���̍ۂ�sourcemap������Ȃ��悤�ɐݒ��ǉ�����K�v������B

``` javascript
// ...�ȗ�
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

var buffer = require('vinyl-buffer');
// ...�ȗ�

gulp.task('browserify', function(cb) {

    // ...�ȗ�

    function bundle() {
        return watchBundler
            // �o���h������
            .bundle()
            //�o���h�������������bundle.js�̏������݃X�g���[����
            // bundle()�̖߂肪vinyl�ł͂Ȃ��̂�source�ł��̍����z������
            .pipe(source('bundle.js'))
            // sourcemaps��strema�`���͑Ή����Ă��Ȃ��̂�buffer�����ށB
            // �ڍׂ�node�̃X�g���[�����Q�Ƃ���
            .pipe(buffer())
            .pipe(sourcemaps.init({
                // loadMaps�͂��ł�sourcemap����`����Ă���ꍇ�A
                // ����𗘗p����ݒ�
                loadMaps: true
            }))
            .pipe(uglify())
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('./app/scripts'));
    }
    // ... �ȗ�
});
```

##### �^�X�N���܂Ƃ߂�

�Ō�Ƀr���h���܂Ƃ߂�

``` javascript
//�r���h�^�X�N �����ł�scripts���̃t�@�C�����W�߂�
//�A����minify��
gulp.task('build', ['jshint'], function() {
    runSequence('jshint', 'browserify')
});

//js�t�@�C�����Ď����A�u���E�U�̃����[�h�ƃr���h�����s
gulp.task('watch', ['browser-sync', 'build'], function() {
    gulp.watch('app/scripts/**/*.js', ['build', browserSync.reload]);
    gulp.watch('app/**/*.html', ['build', browserSync.reload]);
});

gulp.task('default', function() {
    runSequence('watch');
});
```

���s���Ă݂Ĉȉ��̎������m�F���Č��܂��傤�B

1. app�ȉ��̃t�@�C����ۑ����Ƀu���E�U�����[�h
1. app�ȉ��̃t�@�C����ۑ����Ƀr���h
1. bundle.js�����k����Ă���
1. �R���\�[����jshint�̎��s���ʂ��o�͂���Ă���
1. �\�[�X�}�b�v���L���ɂȂ��Ă���

�ȏ�B
