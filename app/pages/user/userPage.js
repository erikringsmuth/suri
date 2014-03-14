// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define(function(require) {
  'use strict';
  var Ractive = require('Ractive'),
      userTemplate = require('rv!./userTemplate'),
      Layout = require('layouts/layout/layout'),
      router = require('router'),
      $ = require('jquery');

  var UserPage = Ractive.extend({
    template: userTemplate,

    init: function() {
      this.set('userId', router.routeArguments().id);
      $.ajax('/users/' + this.get('userId'))
        .done(function(data) {
          this.set('emailMd5', data.emailMd5);
          this.set('displayName', data.displayName);
        }.bind(this));

      this.on('teardown', function() {
      });
    },

    components: {
    }
  });

  return Layout.extend({
    components: { 'content-placeholder': UserPage }
  });
});
