// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define(function(require) {
  'use strict';
  var Ractive       = require('ractive'),
      homeTemplate  = require('rv!./homeTemplate'),
      Layout        = require('layouts/search/layout'),
      ApiSequence   = require('components/apiSequence/apiSequence'),
      router        = require('router'),
      XhrPanel      = require('components/xhrPanel/xhrPanel'),
      $             = require('jquery');

  var HomePage = Ractive.extend({
    template: homeTemplate,

    init: function() {
      var apiSequence = new ApiSequence({ el: this.nodes['api-sequence'] });

      // #/api/:api loads the XHR
      if (router.routes.api.active) {
        $.ajax('/xhr/' + router.routeArguments().api)
          .done(function(data) {
            new XhrPanel({data: data});
          });
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
