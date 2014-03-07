// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define(function(require) {
  'use strict';
  var Ractive = require('Ractive'),
      apiSequenceTemplate = require('rv!./apiSequenceTemplate'),
      sequence = require('components/apiSequence/sequence'),
      XhrPanel = require('components/xhrPanel/xhrPanel'),
      $ = require('jquery');
  require('jquery.easing');

  return Ractive.extend({
    template: apiSequenceTemplate,

    data: {
      apiSequence: sequence
    },

    init: function() {
      // Reset the API sequence on open
      // TODO: this should be done in teardown when it is correctly called when removed from the DOM
      this.get('apiSequence').clear();

      // Keep the menu aligned as you scroll
      var scrollEventHandler = function() {
        this.nodes['api-sequence-menu'].style.top = Math.max(0, window.pageYOffset - this.nodes['api-sequence-menu'].offsetParent.offsetTop) + 'px';
      }.bind(this);
      window.addEventListener('scroll', scrollEventHandler, true);

      this.observe({
        // Toggle the tutorial as panels are added and removed
        apiSequence: function(apiSequence) {
          if (apiSequence.length === 0) {
            this.nodes['suri-tutorial'].style.display = 'block';
          } else {
            this.nodes['suri-tutorial'].style.display = 'none';
          }
        }
      });

      this.on({
        // When you click an item in the menu, scroll to the panel
        scrollToPanel: function scrollToPanel(event, panel) {
          $('html,body').animate({
            scrollTop: document.getElementById(panel.get('uiId')).offsetTop + this.el.offsetTop - 10
          }, 200, 'easeOutQuint');
        },

        removePanel: function removePanel(event, panel) {
          panel.teardown();
        },

        newXhrPanel: function newXhrPanel() {
          new XhrPanel();
        },

        teardown: function() {
          window.removeEventListener('scroll', scrollEventHandler, true);
        }
      });
    }
  });
});
