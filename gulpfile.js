'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    scss = require('gulp-sass'),
    webserver = require('gulp-webserver'),
    rename = require("gulp-rename"),
    clean = require("gulp-clean")

gulp.task('clean', function () {
    gulp.src('builds/dev/static/templates', {read: false})
        .pipe(clean());
    gulp.src('builds/dev/static/models', {read: false})
        .pipe(clean());
    gulp.src('builds/dev/static/collections', {read: false})
      .pipe(clean());
    gulp.src('builds/dev/static/views', {read: false})
        .pipe(clean());
//    gulp.src('builds/dev/static/js', {read: false})
//        .pipe(clean());
    gulp.src('builds/dev/static/css', {read: false})
        .pipe(clean());
});

gulp.task('js', function(){
    gulp.src([
        'bower_components/jquery/dist/jquery.js',
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
        'bower_components/requirejs/require.js'
         ])
        .pipe(concat('libs.js'))
        .pipe(gulp.dest('builds/dev/static/js'));


    gulp.src('builds/dev/app/js/*.js')
        .pipe(concat('app.js'))
        .pipe(gulp.dest('builds/dev/static/js'));


    gulp.src('builds/dev/app/views/**/*.js')
        .pipe(gulp.dest('builds/dev/static/views'));

    gulp.src('builds/dev/app/collections/**/*.js')
      .pipe(gulp.dest('builds/dev/static/collections'));

    gulp.src('builds/dev/app/models/**/*.js')
      .pipe(gulp.dest('builds/dev/static/models'));

    gulp.src('builds/dev/app/behaviors/**/*.js')
      .pipe(gulp.dest('builds/dev/static/behaviors'));

    gulp.src('builds/dev/app/services/**/*.js')
      .pipe(gulp.dest('builds/dev/static/services'));

    gulp.src([
        'bower_components/text/text.js'
    ])
        .pipe(gulp.dest('builds/dev/static/js/libs'));
});

gulp.task('html', function(){
    gulp.src('builds/dev/app/templates/**/*.html')
      .pipe(rename(function (path) {
          path.extname = ".js"
      }))
      .pipe(gulp.dest('builds/dev/static/templates'));
});

gulp.task('css', function(){

    gulp.src([
        'bower_components/bootstrap/dist/css/bootstrap.css',
        'bower_components/bootstrap/dist/css/bootstrap-theme.css',
        'bower_components/alertify/themes/alertify.core.css',
        'bower_components/alertify/themes/alertify.bootstrap.css',
    ])
    .pipe(concat('libs.css'))
    .pipe(gulp.dest('builds/dev/static/css'));

    gulp.src('builds/dev/app/**/*.css')
     //   .pipe(scss())
        .pipe(concat('app.css'))
        .pipe(gulp.dest('builds/dev/static/css'));
})

gulp.task('watch', function(){
    gulp.watch('builds/dev/app/**/*.js', ['js']);
    gulp.watch('builds/dev/app/**/*.html', ['html']);
    gulp.watch('builds/dev/app/**/*.css', ['css']);
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