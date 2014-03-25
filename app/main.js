define([], function() {
  'use strict';

  // Configure require.js paths and shims
  require.config({
    paths: {
      'text': 'bower_components/requirejs-text/text',
      'router': 'bower_components/requirejs-router/router',
      'amd-loader': 'bower_components/requirejs-ractive/amd-loader',
      'rv': 'bower_components/requirejs-ractive/rv',
      'Ractive': 'bower_components/ractive/build/Ractive0.4.0',
      'jquery': 'bower_components/jquery/dist/jquery',
      'jquery.easing': '/bower_components/jquery-easing/jquery.easing',
      'bootstrap': 'bower_components/bootstrap/dist/js/bootstrap',
      'prettify': 'bower_components/google-code-prettify/src/prettify',
      'vkbeautify': 'bower_components/vkBeautify/vkbeautify',
      'Ractive-transitions-slide': '/bower_components/ractive-transitions-slide/Ractive-transitions-slide',
      'ractive-events-tap': '/bower_components/ractive-events-tap/Ractive-events-tap'
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
  require(['router', 'bootstrap', 'ractive-events-tap'], function(router) {

    // Keep track of the currently loaded view so we can run teardown before loading the new view
    var view;

    router
      .registerRoutes({
        home: { path: '/', moduleId: 'pages/home/homePage' },
        api: { path: '/apis/:api', moduleId: 'pages/home/homePage' },
        search: { path: '/search', moduleId: 'pages/search/searchPage' },
        trending: { path: '/trending', moduleId: 'pages/trending/trendingPage' },
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
