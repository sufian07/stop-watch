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
var htmlmin = require('gulp-htmlmin');
var inject = require('gulp-inject');
var wiredep = require('wiredep').stream;
var autoprefixer = require('gulp-autoprefixer');

gulp.task('clean', function() {
    return del.sync('dist');
});

gulp.task('app-css', function() {
    return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss and children dirs
        .pipe(sass())
        .pipe(concat('app.css'))
        .pipe(autoprefixer())
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
        // .pipe(stripDebug())
        // .pipe(uglify())
        .pipe(gulp.dest('./dist/js/'));
});
gulp.task('vendors-js', function() {
    gulp.src([
            './node_modules/jquery/dist/jquery.min.js',
            './node_modules/bootstrap/dist/js/bootstrap.min.js',
            './node_modules/angular/angular.min.js',
            './node_modules/ngstorage/ngstorage.min.js'
        ])
        .pipe(concat('vendors.js'))
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js/'));
});
gulp.task('fonts', function() {
    gulp.src([
            './node_modules/font-awesome/fonts/fontawesome-webfont.*',
            './app/fonts/*.*'
        ])
        .pipe(gulp.dest('./dist/fonts/'));
});
gulp.task('templates', function() {
    return gulp.src('app/templates/*.html')
        // .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist/templates/'))
});

gulp.task('html', ['app-css', 'app-js', 'templates'], function() {
    return gulp.src('app/index.html')
        // .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'))
});

gulp.task('vendor', ['fonts', 'vendors-css', 'vendors-js']);
gulp.task('build', ['clean', 'vendor', 'html']);

gulp.task('serve', ['build'], function() {
    browserSync.init({
        server: {
            baseDir: 'dist',
        },
    });
});

gulp.task('reload', ['html'], function() {
    browserSync.reload();
});

gulp.task('default', ['serve'], function() {
    gulp.watch(['app/scss/**/*.scss', 'app/*.html', 'app/js/**/*.js'], ['reload']);
});