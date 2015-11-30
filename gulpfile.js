'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    scss = require('gulp-sass'),
    webserver = require('gulp-webserver'),
    rename = require("gulp-rename"),
    clean = require("gulp-clean")

gulp.task('clean', function () {
    gulp.src('app/dev/templates', {read: false})
        .pipe(clean());
    gulp.src('app/dev/models', {read: false})
        .pipe(clean());
    gulp.src('app/dev/collections', {read: false})
      .pipe(clean());
    gulp.src('app/dev/views', {read: false})
        .pipe(clean());
//    gulp.src('app/dev/js', {read: false})
//        .pipe(clean());
    gulp.src('app/dev/css', {read: false})
        .pipe(clean());
});

gulp.task('js', function(){
    gulp.src([
        'bower_components/jquery/dist/jquery.js',
        'bower_components/jquery-cookie/jquery.cookie.js',
        'bower_components/underscore/underscore.js',
        'bower_components/backbone/backbone.js',
        'bower_components/marionette/lib/backbone.marionette.js',
        'bower_components/backbone.stickit/backbone.stickit.js',
        'bower_components/bootstrap/dist/js/bootstrap.js',
        'bower_components/jquery-file-upload/js/vendor/jquery.ui.widget.js',
        'bower_components/jquery-file-upload/js/jquery.iframe-transport.js',
        'bower_components/jquery-file-upload/js/jquery.fileupload.js',
        'bower_components/jquery-ui-sortable/jquery-ui-sortable.js',
        'bower_components/alertify/alertify.js',
        'bower_components/html2canvas/build/html2canvas.js',
        'bower_components/requirejs/require.js'
         ])
        .pipe(concat('libs.js'))
        .pipe(gulp.dest('app/dev/js'));


    gulp.src('app/src/js/*.js')
        .pipe(concat('app.js'))
        .pipe(gulp.dest('app/dev/js'));

    gulp.src('app/src/views/**/*.js')
        .pipe(gulp.dest('app/dev/views'));

    gulp.src('app/src/collections/**/*.js')
      .pipe(gulp.dest('app/dev/collections'));

    gulp.src('app/src/models/**/*.js')
      .pipe(gulp.dest('app/dev/models'));

    gulp.src('app/src/behaviors/**/*.js')
      .pipe(gulp.dest('app/dev/behaviors'));

    gulp.src('app/src/services/**/*.js')
      .pipe(gulp.dest('app/dev/services'));

    gulp.src('app/src/fonts/**/*')
      .pipe(gulp.dest('app/dev/fonts'));

    gulp.src('bower_components/text/text.js')
     .pipe(gulp.dest('app/dev/js/libs'));
});

gulp.task('html', function(){
    gulp.src('app/src/templates/**/*.html')
      .pipe(rename(function (path) {
          path.extname = ".js"
      }))
      .pipe(gulp.dest('app/dev/templates'));
});

gulp.task('css', function(){

    gulp.src([
        'bower_components/bootstrap/dist/css/bootstrap.css',
        'bower_components/bootstrap/dist/css/bootstrap-theme.css',
        'bower_components/alertify/themes/alertify.core.css',
        'bower_components/alertify/themes/alertify.bootstrap.css',
    ])
    .pipe(concat('libs.css'))
    .pipe(gulp.dest('app/dev/css'));

    gulp.src('app/src/**/*.css')
     //   .pipe(scss())
        .pipe(concat('app.css'))
        .pipe(gulp.dest('app/dev/css'));
})

gulp.task('watch', function(){
    gulp.watch('app/src/**/*.js', ['js']);
    gulp.watch('app/src/**/*.html', ['html']);
    gulp.watch('app/src/**/*.css', ['css']);
})


gulp.task('webserver', function(){
    gulp.src('builds/dev')
        .pipe(webserver({
            livereload:true
        }))
})


gulp.task('default', [
    //'clean',
    'js',
    'css',
    'html',
    'watch',
    'webserver'
])

gulp.task('prod', [
    'clean',
    'pjs',
    'pcss',
    'pwatch',
    'pwebserver'
])