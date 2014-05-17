// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define(function(require) {
  'use strict';
  var Ractive         = require('ractive'),
      searchTemplate  = require('rv!./searchTemplate'),
      Layout          = require('layouts/search/layout'),
      ApiSequence     = require('components/apiSequence/apiSequence'),
      router          = require('router'),
      XhrPanel        = require('components/xhrPanel/xhrPanel'),
      $               = require('jquery');

  var HomePage = Ractive.extend({
    template: searchTemplate,

    data: {
      header: 'Results',
      from: 1,
      size: 10
    },

    computed: {
      showPreviousButton: '${xhrs.from} > 1',
      showNextButton: '${xhrs.to} < ${xhrs.of}'
    },

    init: function() {
      var apiSequence = new ApiSequence({ el: this.nodes['api-sequence'] });
      apiSequence.set('disableTutorial', true);

      this.on({
        teardown: function() {
          apiSequence.teardown();
        },

        openResult: function openResult(event, item) {
          new XhrPanel({data: item});
        },

        setFrom: function(event, from) {
          this.set('from', from);
          this.search();
        }
      });

      this.search();
    },

    search: function() {
      var routeArgs = router.routeArguments();

      if (typeof(routeArgs.q) !== 'undefined') {
        // #/search?q={queryTerm}
        $.ajax('/xhr?from=' + this.get('from') + '&q=' + routeArgs.q)
          .done(function(data) {
            this.set('xhrs', data);
          }.bind(this));
      }
      else if (typeof(routeArgs.tags) !== 'undefined') {
        // #/search?tags={tags}
        this.set('header', routeArgs.tags.split(',').join(', '));
        $.ajax('/xhr?from=' + this.get('from') + '&tags=' + routeArgs.tags)
          .done(function(data) {
            this.set('xhrs', data);
          }.bind(this));
      }
    }
  });

  return Layout.extend({
    components: { 'content-placeholder': HomePage }
  });
});
