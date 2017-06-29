var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var minifycss = require('gulp-minify-css');
var del = require('del');
var browserSync = require('browser-sync');
var size = require('gulp-size');
var stripDebug = require('gulp-strip-debug'); // Remove debugging stuffs  
var uglify = require('gulp-uglify'); // Minify JavaScript  
var imagemin = require('gulp-imagemin'); // Minify images  
var minifyHTML = require('gulp-minify-html'); // Minify HTML  
var inject = require('gulp-inject');
var wiredep = require('wiredep').stream;

gulp.task('clean', function() {
    return del.sync('dist');
});

gulp.task('app-css', function() {
    return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss and children dirs
        .pipe(sass())
        .pipe(concat('app.css'))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/css'))
});
gulp.task('vendors-css', function() {
    return gulp.src([
            './node_modules/bootstrap/dist/css/bootstrap.min.css',
            './node_modules/font-awesome/css/font-awesome.min.css'
        ])
        .pipe(sass())
        .pipe(concat('vendors.css'))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('app-js', function() {
    gulp.src(['./app/js/*.js'])
        .pipe(concat('app.js'))
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js/'));
});
gulp.task('vendors-js', function() {
    gulp.src([
            './node_modules/jquery/dist/jquery.min.js',
            './node_modules/bootstrap/dist/js/bootstrap.min.js',
            './node_modules/angular/angular.min.js'
        ])
        .pipe(concat('vendors.js'))
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js/'));
});

var injectOptions = {
    addRootSlash: false,
    ignorePath: ['app', 'dist']
};

gulp.task('html', ['vendors-css', 'app-css', 'vendors-js', 'app-js'], function() {
    var injectFiles = gulp.src([
        'dist/css/app.css',
        'dist/css/vendors.css',
        'dist/js/app.js',
        'dist/js/vendors.js'
    ]);
    return gulp.src('app/index.html')
        .pipe(inject(injectFiles, injectOptions))
        .pipe(minifyHTML())
        .pipe(gulp.dest('dist'))
});

gulp.task('images', function() {
    gulp.src('./app/images/*')
        .pipe(imagemin({
            progressive: true,
        }))
        .pipe(gulp.dest('./dist/images'));
});

gulp.task('size', function() {
    gulp.src('./app/**')
        .pipe(size({
            showFiles: true,
        }));
});

gulp.task('serve', ['clean', 'html', 'images', 'size'], function() {
    browserSync.init({
        server: {
            baseDir: 'dist',
        },
    });
});

gulp.task('default', ['serve'], function() {
    gulp.watch('app/scss/**/*.scss', ['saas']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});