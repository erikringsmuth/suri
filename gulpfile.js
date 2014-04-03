'use strict';
var gulp    = require('gulp'),
    jshint  = require('gulp-jshint'),
    mocha   = require('gulp-mocha');

var codeFiles = [
  'server.js',
  'routes/**/*.js',
  'services/**/*.js',
  'middleware/**/*.js',
  'utilities/**/*.js',
  'app/*.js',
  'app/components/**/*.js',
  'app/pages/**/*.js',
  'app/layouts/**/*.js',
  'test/*.js'
];
var testFiles = 'test/**/*.js';

gulp.task('test', function () {
  gulp
    .src(testFiles)
    .pipe(mocha({ reporter: 'spec' }));
});

gulp.task('lint', function() {
  gulp
    .src(codeFiles)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('watch', function () {
  gulp.watch(codeFiles, function() {
    gulp.run('test', 'lint');
  });
});

gulp.task('default', ['test', 'lint', 'watch']);
