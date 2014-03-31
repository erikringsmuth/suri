'use strict';
var gulp    = require('gulp'),
    jshint  = require('gulp-jshint');

gulp.task('lint', function() {
  gulp
    .src([
      'server.js',
      'routes/**/*.js',
      'services/**/*.js',
      'utilities/**/*.js',
      'app/*.js',
      'app/components/**/*.js',
      'app/pages/**/*.js',
      'app/layouts/**/*.js',
      'test/*.js'
    ])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('default', function(){
  gulp.run('lint');

  gulp.watch('**/*.js', function() {
    gulp.run('lint');
  });
});
