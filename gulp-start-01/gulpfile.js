var gulp = require('gulp');
var browserSync = require('browser-sync');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');
var del = require('del');

//�r���h�^�X�N �����ł�scripts���̃t�@�C�����W�߂�
//�A����minify��
gulp.task('scripts', function() {
    return gulp.src(['./app/lib/**/*.js', './app/scripts/**/*.js'])
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/scripts'));
});
//html��dist�Ɉړ�
gulp.task('html', function() {
    return gulp.src(['./app/**/*.html']).pipe(gulp.dest('./dist'));
});

//dist���폜����
//cb���w�肵�āA�I����ʒm
gulp.task('clean', function(cb) {
    del(['dist'], cb);
});

//�e��r���h�����s����
gulp.task('build', function() {
    runSequence('clean', ['scripts', 'html']);
});

//���ʕ����browser�̃��[�g�Ƃ���
gulp.task('browser-sync', function(cb) {
    browserSync({
        server: {
            baseDir: './dist'
        }
    });
    cb();
});

//js�t�@�C�����Ď����A�u���E�U�̃����[�h�ƃr���h�����s
gulp.task('watch', ['browser-sync', 'build'], function() {
    gulp.watch('app/scripts/**/*.js', ['build', browserSync.reload]);
    gulp.watch('app/**/*.html', ['build', browserSync.reload]);
});

//�r���h��watch���f�t�H���g�^�X�N�ɂ��Ă���B
gulp.task('default', function() {
    runSequence('watch');
});
