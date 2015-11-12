'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    scss = require('gulp-sass'),
    webserver = require('gulp-webserver'),
    rename = require("gulp-rename")

gulp.task('js', function(){
    gulp.src([
        'bower_components/jquery/dist/jquery.js',
        'bower_components/underscore/underscore.js',
        'bower_components/backbone/backbone.js',
        'bower_components/marionette/marionette.js',
        'bower_components/backbone.stickit/backbone.stickit.js',
        'bower_components/bootstrap/dist/js/bootstrap.min.js',
        'bower_components/requirejs/require.js',
         ])
        .pipe(concat('libs.js'))
        .pipe(gulp.dest('builds/dev/static/js'));

    gulp.src([
        'bower_components/text/text.js'
    ])
        .pipe(gulp.dest('builds/dev/static/js/libs'));
    gulp.src('builds/dev/app/js/*.js')
        .pipe(concat('app.js'))
        .pipe(gulp.dest('builds/dev/static/js'));

    gulp.src('builds/dev/app/templates/*.html')
        .pipe(rename(function (path) {
            path.extname = ".js"
        }))
        .pipe(gulp.dest('builds/dev/static/templates'));
});

gulp.task('css', function(){

    gulp.src([
        'bower_components/bootstrap/dist/css/bootstrap.css',
        'bower_components/bootstrap/dist/css/bootstrap-theme.css',
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
    // gulp.watch('builds/dev/**/*.html', ['html']);
    gulp.watch('builds/dev/app/**/*.css', ['css']);
})


gulp.task('webserver', function(){
    gulp.src('builds/dev')
        .pipe(webserver({
            livereload:true
        }))
})


gulp.task('default', [
    'js',
    'css',
    'watch',
    'webserver'
])

gulp.task('prod', [
    'pjs',
    'pcss',
    'pwatch',
    'pwebserver'
])