define([], function() {
  'use strict';

  // Configure require.js paths and shims
  require.config({
    paths: {
      'text': 'bower_components/requirejs-text/text',
      'router': 'bower_components/requirejs-router/router',
      'amd-loader': 'bower_components/requirejs-ractive/amd-loader',
      'rv': 'bower_components/requirejs-ractive/rv',
      'Ractive': 'bower_components/ractive/Ractive',
      'jquery': 'bower_components/jquery/dist/jquery.min',
      'jquery.easing': '/bower_components/jquery-easing/jquery.easing.min',
      'bootstrap': 'bower_components/bootstrap/dist/js/bootstrap',
      'prettify': 'bower_components/google-code-prettify/src/prettify'
    },
    shim: {
      'bootstrap': {
        deps: ['jquery']
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
        notFound: { path: '*', moduleId: 'pages/notFound/notFoundPage' }
      })
      .on('routeload', function onRouteLoad(View) {
        // When a route loads, render the view and attach it to the document
        var render = function() {
          view = new View({ el: 'body' });
        };

        if (view) {
          view.teardown(render);
        } else {
          render();
        }
        scroll(0, 0);
      })
      .init(); // Run the app!
  });
});
