// Copyright (C) 2014 Erik Ringsmuth - MIT license
define(function(require) {
  'use strict';
  var config          = require('config'),
      Ractive         = require('ractive'),
      layoutTemplate  = require('rv!./layoutTemplate'),
      router          = require('router'),
      ProfileMenu     = require('components/profileMenu/profileMenu'),
      utilities       = require('components/util/utilities');

  return Ractive.extend({
    template: layoutTemplate,

    data: {
      routes: router.routes,
      development: utilities.development,
      session: config.session,
      myProfile: false
    },

    init: function() {
      this.set('myProfile', router.routes.user.active && router.routeArguments().id === config.session.userId);
    },

    components: {
      'profile-menu': ProfileMenu
    }
  });
});
