// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define(function(require) {
  'use strict';
  var config = require('config'),
      Ractive = require('Ractive'),
      userTemplate = require('rv!./userTemplate'),
      Layout = require('layouts/search/layout'),
      router = require('router'),
      XhrPanel = require('components/xhrPanel/xhrPanel'),
      ApiSequence = require('components/apiSequence/apiSequence'),
      $ = require('jquery');

  var UserPage = Ractive.extend({
    template: userTemplate,

    init: function() {
      this.set('userId', router.routeArguments().id);
      this.set('myProfile', this.get('userId') === config.session.userId);

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

      this.observe({
        filter: function(filter) {
          $.ajax('/xhr?owner=' + this.get('userId') + '&q=' + filter.trim())
            .done(function(data) {
              this.set('xhrs', data);
            }.bind(this));
        }
      });

      this.on({
        teardown: function() {
          apiSequence.teardown();
        },

        openResult: function openResult(event, item) {
          new XhrPanel({data: item});
        }
      });
    },

    components: {
    }
  });

  return Layout.extend({
    components: { 'content-placeholder': UserPage }
  });
});
