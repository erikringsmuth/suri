// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define(function(require) {
  'use strict';
  var Ractive = require('Ractive'),
      searchTemplate = require('rv!./searchTemplate'),
      Layout = require('layouts/search/layout'),
      ApiSequence = require('components/apiSequence/apiSequence'),
      router = require('router'),
      XhrPanel = require('components/xhrPanel/xhrPanel'),
      $ = require('jquery');

  var HomePage = Ractive.extend({
    template: searchTemplate,

    init: function() {
      var apiSequence = new ApiSequence({ el: this.nodes['api-sequence'] });
      apiSequence.set('disableTutorial', true);

      // #/search?q={queryTerm}
      var routeArgs = router.routeArguments();
      if (typeof(routeArgs.q) !== 'undefined') {
        $.ajax('/xhr?q=' + routeArgs.q)
          .done(function(data) {
            this.set('xhrs', data);
          }.bind(this));
      }
      else if (typeof(routeArgs.tags) !== 'undefined') {
        $.ajax('/xhr?tags=' + routeArgs.tags)
          .done(function(data) {
            this.set('xhrs', data);
          }.bind(this));
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
