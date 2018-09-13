var gulp   = require('gulp');
var uglify = require('gulp-uglify-es').default;
var concat = require('gulp-concat');
var gap    = require('gulp-append-prepend');
var mocha  = require('gulp-mocha');
var babel  = require('gulp-babel');
var addsrc = require('gulp-add-src');
var fs     = require('fs');
var sm     = require('gulp-sourcemaps');

var argv = require('yargs').argv;

gulp.task('scripts', function() {
    return new Promise(function(resolve, reject) {
        gulp.src(['app/src/**/*.js'])
        .pipe(sm.init())
        .pipe(babel({presets: ['es2015']}))
        .pipe(uglify())
        .pipe(concat('combined-min.js'))
        .pipe(gulp.dest('dist'))
        .pipe(sm.write('.'))
        .pipe(gulp.dest('dist'));
        console.log("Production scripts built");
        resolve();
    });
})

gulp.task('default', function() {
    gulp.run('scripts');
})
