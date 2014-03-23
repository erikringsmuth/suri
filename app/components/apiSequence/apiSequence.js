// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define(function(require) {
  'use strict';
  var Ractive = require('Ractive'),
      apiSequenceTemplate = require('rv!./apiSequenceTemplate'),
      sequence = require('components/apiSequence/sequence'),
      XhrPanel = require('components/xhrPanel/xhrPanel'),
      router = require('router'),
      $ = require('jquery');
  require('jquery.easing');

  return Ractive.extend({
    template: apiSequenceTemplate,

    data: {
      apiSequence: sequence,
      displayTutorial: true,
      disableTutorial: false
    },

    init: function() {
      // Keep the menu aligned as you scroll
      var scrollEventHandler = function() {
        if (window.pageYOffset > $('#api-sequence').offset().top) {
          // Scrolled past the top of the api-sequence-menu
          this.nodes['api-sequence-menu'].classList.add('fixed');
        } else {
          // Header showing, keep the api-sequence-menu position relative
          this.nodes['api-sequence-menu'].classList.remove('fixed');
        }
      }.bind(this);
      window.addEventListener('scroll', scrollEventHandler, true);

      this.observe({
        // Toggle the tutorial as panels are added and removed
        apiSequence: function(apiSequence) {
          if (apiSequence.length === 0) {
            this.set('displayTutorial', true);
          } else {
            this.set('displayTutorial', false);
          }
        }
      });

      this.on({
        // When you click an item in the menu, scroll to the panel
        scrollToPanel: function scrollToPanel(event, panel) {
          panel.fire('scrollToPanel');
        },

        removePanel: function removePanel(event, panel) {
          panel.teardown();
        },

        newXhrPanel: function newXhrPanel() {
          new XhrPanel();
        },

        teardown: function() {
          window.removeEventListener('scroll', scrollEventHandler, true);
          this.get('apiSequence').clear();
        }
      });
    }
  });
});
