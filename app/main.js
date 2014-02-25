define([], function() {
  'use strict';

  // Configure require.js paths and shims
  require.config({
    paths: {
      'text': 'bower_components/requirejs-text/text',
      'router': 'bower_components/requirejs-router/router',
      'nex': 'bower_components/nex-js/nex',
      'handlebars': 'bower_components/handlebars/handlebars',
      'jquery': 'bower_components/jquery/jquery.min',
      'jquery.easing': '/bower_components/jquery-easing/jquery.easing.min',
      'bootstrap': 'bower_components/bootstrap/dist/js/bootstrap',
      'polyfill': 'bower_components/polyfills',
      'platform': '/bower_components/platform/platform',
      'prettify': 'bower_components/google-code-prettify/src/prettify'
    },
    shim: {
      'handlebars': {
        exports: 'Handlebars'
      },
      'bootstrap': {
        deps: ['jquery']
      }
    }
  });

  // Load the router, Bootstrap CSS JS
  require(['router', 'bootstrap'], function(router) {
    router
      .registerRoutes({
        home: { path: '/', moduleId: 'pages/home/homePage' },
        notFound: { path: '*', moduleId: 'pages/notFound/notFoundPage' }
      })
      .on('routeload', function onRouteLoad(Component, routeArguments) {
        new Component(routeArguments).attachTo('body');
        scroll(0, 0);
      })
      .init(); // Run the app!
  });
});
