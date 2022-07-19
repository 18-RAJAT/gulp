var gulp = require('gulp');
var rename=require('gulp-rename');


var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserSync = require('browser-sync').create();


const { buffer } = require('gulp-util');


var styleSRC = './src/scss/style.scss';
var styleDIST = '.dist/css/';
var styleWatch = './src/scss/**/*.scss';

var jsSRC = './src/js/script.js';
var jsFolder = './src/js/';
var jsDIST = '.dist/js/';
var jsWatch = './src/js/**/*.js';
var jsFILES = [jsSRC];


//browser sync
// gulp.task('browser-sync',function(){
//     browserSync.init({
//         server:{
//             // baseDir:"./dist"
//             baseDir:"./"
//         }
//     });
// });



gulp.task('browser-sync',function(){ //browser sync
    browserSync.init({
        // open: false,
        // injectChanges: true.valueOf,//inject CSS changes
        // proxy: "https://gulp.dev", //proxy server
        // https:{ 
            
        //     key: '/Users/alecaddd/.valet/Certificates/gulp.dev.key', //key.pem path
            
        //     cert: '/Users/alecaddd/.valet/Certificates/gulp.dev.crt' //cert.pem path
        // }

        server:{
            baseDir:"./"
        }
    });
});


gulp.task('style', function(){
    //compile
    gulp.src(styleSRC)
    .pipe(sourcemaps.init())
    .pipe(sass({
        errorLogToConsole: true,
        outputStyle: 'compressed'
    }))

    //listener
    .on('error',console.error.bind(console))
    .pipe(autoprefixer({
        browsers:['last 2 versions'],
        cascade: false
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(styleDIST));
 });


 //Entery point for the app 

 gulp.task('js',function(){
    jsFILES.map(function(entry){
        return browserify({
            entries: [jsFolder + entry]
        })
        .transform(babelify,{presets:['env']})
        .bundle()
        .pipe(source(entry))
        .pipe(rename({extname:'.min.js'}))
        .pipe(buffer())//custom
        .pipe(sourcemaps.init({loadMaps: true}))//custom to load sourcemaps from browserify output file 
        .pipe(uglify())//custom to uglify the output file 
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(jsDIST));
    });

    // gulp.src(jsSRC)
    // .pipe(gulp.dest(styleDIST));

    // browserify
    // transform babelify [env]
    //bundle
    //source
    //rename .min
    //buffer
    //uglify
    //write sourcemaps
    //dist

 });

//  gulp.task('default',['style','js'],function(){
//     //Do other things
    
//  });

gulp.task('default',['style','js']);

gulp.task('watch',['default'],function(){
    gulp.watch(styleWatch,['style']);//method
    gulp.watch(jsWatch,['js']);//method
});