// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define(function(require) {
  'use strict';
  var config = require('config'),
      Ractive = require('Ractive'),
      layoutTemplate = require('rv!./layoutTemplate'),
      router = require('router'),
      utilities = require('components/util/utilities');

  return Ractive.extend({
    template: layoutTemplate,

    data: {
      routes: router.routes,
      development: utilities.development,
      session: config.session,
      myProfile: false
    },

    init: function() {
      if (router.routes.user.active && router.routeArguments().id === config.session.userId) {
        this.set('myProfile', true);
      }
    }
  });
});
