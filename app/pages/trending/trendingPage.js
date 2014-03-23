// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define(function(require) {
  'use strict';
  var Ractive = require('Ractive'),
      trendingTemplate = require('rv!./trendingTemplate'),
      Layout = require('layouts/search/layout'),
      ApiSequence = require('components/apiSequence/apiSequence'),
      XhrPanel = require('components/xhrPanel/xhrPanel'),
      $ = require('jquery');

  var HomePage = Ractive.extend({
    template: trendingTemplate,

    init: function() {
      var apiSequence = new ApiSequence({ el: this.nodes['api-sequence'] });

      // #/trending
      $.ajax('/xhr')
        .done(function(data) {
          this.set('xhrs', data);
        }.bind(this));

      this.on({
        teardown: function() {
          apiSequence.teardown();
        },

        openResult: function openResult(event, item) {
          new XhrPanel({data: item});
        }
      });
    }
  });

  return Layout.extend({
    components: { 'content-placeholder': HomePage }
  });
});
