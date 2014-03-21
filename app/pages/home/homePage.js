// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define(function(require) {
  'use strict';
  var Ractive = require('Ractive'),
      homeTemplate = require('rv!./homeTemplate'),
      Layout = require('layouts/search/layout'),
      ApiSequence = require('components/apiSequence/apiSequence'),
      XhrPanel = require('components/xhrPanel/xhrPanel'),
      URI = require('bower_components/URIjs/src/URI'),
      $ = require('jquery');

  var HomePage = Ractive.extend({
    template: homeTemplate,

    init: function() {
      var apiSequence = new ApiSequence({ el: this.nodes['api-sequence'] });

      var uri = new URI(window.location.href);
      if (uri.fragment()) {
        // hash path '#/?q=...'
        uri = new URI(uri.fragment());
        if (uri.toString() !== '/') {
          $.ajax('/xhr' + uri.search())
            .done(function(data) {
              this.set('xhrs', data);
            }.bind(this));
        }
      }

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
