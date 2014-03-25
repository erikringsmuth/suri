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

    data: {
      xhrs: null,
      tags: null,
      from: 0,
      size: 10
    },

    computed: {
      showPreviousButton: '${xhrs.from} > 0',
      showNextButton: '${xhrs.to} < ${xhrs.of} - 1'
    },

    init: function() {
      var apiSequence = new ApiSequence({ el: this.nodes['api-sequence'] });
      apiSequence.set('disableTutorial', true);

      // Top tags
      $.ajax('/xhr/tags/_count')
        .done(function(data) {
          this.set('tags', data);
        }.bind(this));

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
      // Top APIs
      $.ajax('/xhr?from=' + this.get('from'))
        .done(function(data) {
          this.set('xhrs', data);
        }.bind(this));
    }
  });

  return Layout.extend({
    components: { 'content-placeholder': HomePage }
  });
});
