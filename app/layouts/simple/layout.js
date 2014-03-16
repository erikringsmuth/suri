// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define(function(require) {
  'use strict';
  var Ractive = require('Ractive'),
      layoutTemplate = require('rv!./layoutTemplate'),
      router = require('router'),
      utilities = require('components/util/utilities');

  return Ractive.extend({
    template: layoutTemplate,

    data: {
      routes: router.routes,
      development: utilities.development,
      session: window.suri.session,
      myProfile: false
    },

    init: function() {
      if (router.routes.user.active && router.routeArguments().id === window.suri.session.userId) {
        this.set('myProfile', true);
      }
    }
  });
});
