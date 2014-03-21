define([], function() {
  'use strict';

  // Configure require.js paths and shims
  require.config({
    paths: {
      'text': 'bower_components/requirejs-text/text',
      'router': 'bower_components/requirejs-router/router.min',
      'amd-loader': 'bower_components/requirejs-ractive/amd-loader',
      'rv': 'bower_components/requirejs-ractive/rv',
      'Ractive': 'bower_components/ractive/build/Ractive.min',
      'jquery': 'bower_components/jquery/dist/jquery.min',
      'jquery.easing': '/bower_components/jquery-easing/jquery.easing.min',
      'bootstrap': 'bower_components/bootstrap/dist/js/bootstrap.min',
      'prettify': 'bower_components/google-code-prettify/src/prettify',
      'vkbeautify': 'bower_components/vkBeautify/vkbeautify',
      'Ractive-transitions-slide': '/bower_components/ractive-transitions-slide/Ractive-transitions-slide.min'
    },
    shim: {
      'bootstrap': {
        deps: ['jquery']
      },
      'vkbeautify': {
        exports: 'vkbeautify'
      }
    }
  });

  // Load the router, Bootstrap CSS JS
  require(['router', 'bootstrap'], function(router) {

    // Keep track of the currently loaded view so we can run teardown before loading the new view
    var view;

    router
      .registerRoutes({
        home: { path: '/', moduleId: 'pages/home/homePage' },
        about: { path: '/about', moduleId: 'pages/about/aboutPage' },
        user: { path: '/users/:id', moduleId: 'pages/user/userPage' },
        notFound: { path: '*', moduleId: 'pages/notFound/notFoundPage' }
      })
      .on('routeload', function onRouteLoad(View) {
        // When a route loads, render the view and attach it to the document
        if (view && typeof(view.teardown) === 'function') {
          view.teardown();
        }
        view = new View({ el: 'body' });
        scroll(0, 0);
      })
      .init(); // Run the app!
  });
});
