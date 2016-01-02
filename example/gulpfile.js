'use strict';

var gulp = require('gulp');
var babel = require('gulp-babel');
var sass = require('gulp-sass');
var rev = require('gulp-rev');
var gulpif = require('gulp-if');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var inject = require('gulp-inject');
var streamify = require('gulp-streamify');
var cssBase64 = require('gulp-css-base64');
var connect = require('gulp-connect');
var watch = require('gulp-watch');

var browserify = require('browserify');
var babelify = require('babelify');
var del = require('del');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var resolve = require('resolve');
var series = require('stream-series');
var argv = require('yargs').argv;

var production = (process.env.NODE_ENV === 'production' || argv.production);

function bundle(name, b) {
  return b.bundle().pipe(source(name))
    .pipe(gulpif(production, streamify(uglify())))
    .pipe(rename(name.substring(0, name.lastIndexOf('.js')) + '.min.js'))
    .pipe(buffer())
    .pipe(rev())
    .pipe(gulp.dest('./public/scripts'));
}

function getNPMPackageIds() {
  // read package.json and get dependencies' package ids
  var packageManifest = {};
  try {
    packageManifest = require('./package.json');
  } catch (e) {
    // does not have a package.json manifest
  }
  return Object.keys(packageManifest.dependencies) || [];
}

gulp.task('default', ['clean', 'build']);

gulp.task('clean', function(cb) {
  return del('./public', cb);
});

gulp.task('build', ['vendor', 'scripts', 'sass', 'data'], function() {
  var vendor = gulp.src('./public/scripts/vendor*.js', {read: false});
  var scripts = gulp.src('./public/scripts/scripts*.js', {read: false});
  var styles = gulp.src('./public/styles/main*.css', {read: false});

  return gulp.src('./app/index.html')
    .pipe(inject(series(vendor, scripts, styles), {ignorePath: '/public'}))
    .pipe(gulp.dest('./public'));
});

gulp.task('data', ['clean'], function() {
  return gulp.src('./app/json/data.json')
    .pipe(gulp.dest('./public/data'));
});

gulp.task('vendor', ['clean'], function() {
  var b = browserify({debug: !production})
    .transform(babelify);

  getNPMPackageIds().forEach(function(id) {
    b.require(resolve.sync(id), {expose: id});
  });

  return bundle('vendor.js', b);
});

gulp.task('scripts', ['clean'], function() {
  var b = browserify({debug: !production})
    .require('./app/scripts/app.js', {entry: true})
    .transform(babelify);

  getNPMPackageIds().forEach(function(id) {
    b.external(id);
  });

  return bundle('scripts.js', b);
});

gulp.task('sass', ['clean'], function() {
  return gulp.src(['./app/styles/main.scss'], {base: './app'})
    .pipe(sass())
    //.pipe(gulpif(production, minifyCss()))
    //.pipe(rename(function(path) {
    //  path.basename += '.min';
    //  path.extname = '.css';
    //}))
    .pipe(cssBase64())
    .pipe(rev())
    .pipe(gulp.dest('./public'));
});

gulp.task('watch', function() {
  connect.server({
    port: 9000,
    root: 'public',
    livereload: true
  });

  gulp.watch(['../src/**/*.*', './app/**/*.*'], ['default']);
  watch('./public/**').pipe(connect.reload());
});