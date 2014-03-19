// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define(function(require) {
  'use strict';
  var Ractive = require('Ractive'),
      searchTemplate = require('rv!./searchTemplate'),
      Layout = require('layouts/search/layout'),
      XhrPanel = require('components/xhrPanel/xhrPanel'),
      ApiSequence = require('components/apiSequence/apiSequence'),
      URI = require('bower_components/URIjs/src/URI'),
      $ = require('jquery');

  var UserPage = Ractive.extend({
    template: searchTemplate,

    init: function() {
      var uri = new URI(window.location.href);
      if (uri.fragment()) {
        // hash path '#/search'
        uri = new URI(uri.fragment());
      }

      $.ajax('/xhr' + uri.search())
        .done(function(data) {
          this.set('xhrs', data);
        }.bind(this));

      var apiSequence = new ApiSequence({ el: this.nodes['api-sequence'] });
      apiSequence.set('disableTutorial', true);

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
