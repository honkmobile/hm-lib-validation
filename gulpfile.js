'use strict'

var gulp   = require('gulp'),
    uglify = require('gulp-uglify');

gulp.task('default', function () {
  gulp.src('./src/validation.js')
      .pipe(uglify())
      .pipe(gulp.dest('./dist/'));
});
