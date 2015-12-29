var gulp = require('gulp');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minifyCss = require('gulp-minify-css');
var merge = require('merge-stream');
var del = require('del');

gulp.task('default', ['clean', 'build']);

gulp.task('clean', function(cb) {
  return del('./dist', cb);
});

gulp.task('build', ['styles', 'scripts']);

gulp.task('styles', ['clean'], function() {
  return gulp.src('./src/css/pageable.css')
    .pipe(minifyCss())
    .pipe(rename('pageable.min.css'))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('scripts', ['clean'], function() {
  var script = gulp.src('./src/scripts/pageable.js')
    .pipe(babel())
    .pipe(gulp.dest('./dist/scripts'));

  var minified = gulp.src('./src/scripts/pageable.js')
    .pipe(babel())
    .pipe(uglify())
    .pipe(rename('pageable.min.js'))
    .pipe(gulp.dest('./dist/scripts'));

  return merge(script, minified);
});