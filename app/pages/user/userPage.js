// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define(function(require) {
  'use strict';
  var Ractive = require('Ractive'),
      userTemplate = require('rv!./userTemplate'),
      Layout = require('layouts/layout/layout'),
      router = require('router'),
      ApiSequence = require('components/apiSequence/apiSequence'),
      $ = require('jquery');

  var UserPage = Ractive.extend({
    template: userTemplate,

    init: function() {
      this.set('userId', router.routeArguments().id);
      this.set('myProfile', this.get('userId') === window.suri.session.userId);

      $.ajax('/users/' + this.get('userId'))
        .done(function(data) {
          this.set('emailMd5', data.emailMd5);
          this.set('displayName', data.displayName);
          $('.profile-image').tooltip();
        }.bind(this));

      $.ajax('/xhr?owner=' + this.get('userId'))
        .done(function(data) {
          this.set('xhrs', data);
        }.bind(this));

      var apiSequence = new ApiSequence({ el: this.nodes['api-sequence'] });
      apiSequence.set('disableTutorial', true);

      this.on('teardown', function() {
        apiSequence.teardown();
      });
    },

    components: {
    }
  });

  return Layout.extend({
    components: { 'content-placeholder': UserPage }
  });
});
