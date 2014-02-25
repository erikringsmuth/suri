'use strict';
var gulp = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('lint', function() {
  gulp.src(['js/**/*.js', 'tests/spec/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

// The default task (called when you run `gulp`)
gulp.task('default', function(){
  gulp.run('lint');

  // Watch files and run tasks if they change
  gulp.watch(['js/**/*.js', 'tests/spec/*.js'], function() {
    gulp.run('lint');
  });
});

// CI build
gulp.task('ci', function(){
  gulp.run('lint');
});
