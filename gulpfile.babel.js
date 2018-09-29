var gulp   = require('gulp');
var uglify = require('gulp-uglify-es').default;
var concat = require('gulp-concat');
var gap    = require('gulp-append-prepend');
var mocha  = require('gulp-mocha');
var babel  = require('gulp-babel');
var addsrc = require('gulp-add-src');
var fs     = require('fs');
var ndemon = require('gulp-nodemon')
var sm     = require('gulp-sourcemaps');

var argv = require('yargs').argv;

// Get all JS file locations
function getJSPaths(dir) {
    function getJSPaths2(prepend, cur, arr, homeDir) {
        var dir = prepend+cur+"/";
        if (!fs.existsSync(homeDir+dir))
            return;
        var files = fs.readdirSync(homeDir+dir);
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            if (file.endsWith('.js')) // If js file
                arr.push(dir+file);
            else if (!files.includes('.')) // If a directory
                getJSPaths2(dir, file, arr, homeDir);
        }
    }
    var dirs = ['libraries', 'controllers', 'models', 'views'];
    var paths = [];
    for (var i = 0; i < dirs.length; i++)
        getJSPaths2('js/', dirs[i], paths, dir);
    return paths;
}
function getPaths() {
    return getJSPaths('site/public/');
}

var buildScripts = function(){
    return new Promise(function(resolve, reject){
        gulp.src(getPaths().map(function(f) { return 'site/public/' + f; }))
        .pipe(sm.init())
        .pipe(babel({presets: ['es2015']}))  
        // .pipe(uglify())
        .pipe(concat('combined-min.js'))
        .pipe(gulp.dest('public/javascripts'))
        .pipe(sm.write('.'))
        .pipe(gulp.dest('public/javascripts'));
        console.log("Uglified JS and sourcemap generated"); 
        resolve();
    })
}

gulp.task('scripts', function() {
    return buildScripts();
})

gulp.task('default', function() {
    buildScripts();
    gulp.watch('app/src/**', buildScripts);
    ndemon({
        script: 'bin/www'
      , ext: 'js html'
      , env: { 'NODE_ENV': 'development' }
    })
})
