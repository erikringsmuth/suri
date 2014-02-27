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
      // Keep the menu aligned as you scroll
      var apiSequenceMenuEl = this.nodes['api-sequence-menu'];
      var scrollEventHandler = function() {
        apiSequenceMenuEl.style.top = Math.max(0, window.pageYOffset - apiSequenceMenuEl.offsetParent.offsetTop) + 'px';
      };
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
