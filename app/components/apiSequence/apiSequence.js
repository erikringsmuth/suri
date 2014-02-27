// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define([
  'ractive',
  'text!./apiSequenceTemplate.html',
  'components/apiSequence/sequence',
  'components/xhrPanel/xhrPanel',
  'components/codePanel/codePanel',
  'jquery',
  'jquery.easing'
], function(Ractive, apiSequenceTemplate, sequence, XhrPanel, CodePanel, $) {
  'use strict';

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
            scrollTop: document.getElementById(panel.get('id')).offsetTop + this.el.offsetTop - 10
          }, 200, 'easeOutQuint');
        },

        removePanel: function removePanel(event, panel) {
          panel.teardown();
        },

        newXhrPanel: function newXhrPanel() {
          new XhrPanel();
        },

        newCodePanel: function newCodePanel() {
          new CodePanel();
        },

        teardown: function() {
          window.removeEventListener('scroll', scrollEventHandler, true);
        }
      });
    }
  });
});
