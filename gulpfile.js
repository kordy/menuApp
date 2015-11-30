'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    webserver = require('gulp-webserver'),
    rename = require("gulp-rename"),
    clean = require("gulp-clean"),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    minifyEJS = require('gulp-minify-ejs');

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

gulp.task('releaseClean', function () {
  gulp.src('app/release', {read: false, force: true})
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

gulp.task('releaseJS', function(){
    gulp.src([
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/jquery-cookie/jquery.cookie.js',
        'bower_components/underscore/underscore-min.js',
        'bower_components/backbone/backbone-min.js',
        'bower_components/marionette/lib/backbone.marionette.min.js',
        'bower_components/backbone.stickit/backbone.stickit.js',
        'bower_components/bootstrap/dist/js/bootstrap.min.js',
        'bower_components/jquery-file-upload/js/vendor/jquery.ui.widget.js',
        'bower_components/jquery-file-upload/js/jquery.iframe-transport.js',
        'bower_components/jquery-file-upload/js/jquery.fileupload.js',
        'bower_components/jquery-ui-sortable/jquery-ui-sortable.min.js',
        'bower_components/alertify/alertify.min.js',
        'bower_components/requirejs/require.js'
    ])
      .pipe(concat('libs.js'))
      .pipe(uglify())
      .pipe(gulp.dest('app/release/js'));


    gulp.src('app/src/js/*.js')
      .pipe(concat('app.js'))
      .pipe(uglify())
      .pipe(gulp.dest('app/release/js'));

    gulp.src('app/src/views/**/*.js')
      .pipe(uglify())
      .pipe(gulp.dest('app/release/views'));

    gulp.src('app/src/collections/**/*.js')
      .pipe(uglify())
      .pipe(gulp.dest('app/release/collections'));

    gulp.src('app/src/models/**/*.js')
      .pipe(uglify())
      .pipe(gulp.dest('app/release/models'));

    gulp.src('app/src/behaviors/**/*.js')
      .pipe(uglify())
      .pipe(gulp.dest('app/release/behaviors'));

    gulp.src('app/src/services/**/*.js')
      .pipe(uglify())
      .pipe(gulp.dest('app/release/services'));

    gulp.src('bower_components/text/text.js')
      .pipe(uglify())
      .pipe(gulp.dest('app/release/js/libs'));
});

gulp.task('html', function(){
    gulp.src('app/src/templates/**/*.html')
      .pipe(rename(function (path) {
          path.extname = ".js"
      }))
      .pipe(gulp.dest('app/dev/templates'));
});

gulp.task('releaseHTML', function(){
  gulp.src('app/src/templates/**/*.html')
    .pipe(minifyEJS())
    .pipe(rename(function (path) {
      path.extname = ".js"
    }))
    .pipe(gulp.dest('app/release/templates'));

  gulp.src('app/src/fonts/**/*')
    .pipe(gulp.dest('app/release/fonts'));
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
        .pipe(concat('app.css'))
        .pipe(gulp.dest('app/dev/css'));
});

gulp.task('releaseCSS', function(){

  gulp.src([
    'bower_components/bootstrap/dist/css/bootstrap.css',
    'bower_components/bootstrap/dist/css/bootstrap-theme.css',
    'bower_components/alertify/themes/alertify.core.css',
    'bower_components/alertify/themes/alertify.bootstrap.css'
  ])
    .pipe(concat('libs.css'))
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('app/release/css'));

  gulp.src('app/src/**/*.css')
    //   .pipe(scss())
    .pipe(concat('app.css'))
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('app/release/css'));
});

gulp.task('watch', function(){
    gulp.watch('app/src/**/*.js', ['js']);
    gulp.watch('app/src/**/*.html', ['html']);
    gulp.watch('app/src/**/*.css', ['css']);
});


gulp.task('webserver', function(){
    gulp.src('builds/dev')
        .pipe(webserver({
            livereload:true
        }))
});


gulp.task('default', [
    //'clean',
    'js',
    'css',
    'html',
    'watch',
    'webserver'
]);

gulp.task('release', [
    'releaseClean',
    'releaseJS',
    'releaseCSS',
    'releaseHTML'
]);