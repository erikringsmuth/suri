// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define(function(require) {
  'use strict';
  var config = require('config'),
      Ractive = require('Ractive'),
      layoutTemplate = require('rv!./layoutTemplate'),
      router = require('router'),
      SearchBox = require('components/search/searchBox'),
      ProfileMenu = require('components/profileMenu/profileMenu'),
      utilities = require('components/util/utilities');

  return Ractive.extend({
    template: layoutTemplate,

    data: {
      routes: router.routes,
      development: utilities.development,
      session: config.session,
      myProfile: router.routes.user.active && router.routeArguments().id === config.session.userId
    },

    components: {
      'profile-menu': ProfileMenu,
      'search-box': SearchBox
    }
  });
});
