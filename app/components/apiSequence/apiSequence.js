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
      // Listen to new panel events
      window.addEventListener('scroll', function() {
        this.nodes['api-sequence-menu'].style.top = Math.max(0, window.pageYOffset - this.nodes['api-sequence-menu'].offsetParent.offsetTop) + 'px';
      }.bind(this));

      this.observe({
        apiSequence: function(apiSequence) {
          if (apiSequence.length === 0) {
            this.nodes.suriTutorial.style.display = 'block';
          } else {
            // Hide the info panel
            this.nodes.suriTutorial.style.display = 'none';
            this.nodes.contentPlaceholder.appendChild(apiSequence[apiSequence.length - 1].el);
          }
        }
      });

      this.on({
        scrollToPanel: function scrollToPanel(event, panel) {
          $('html,body').animate({
            scrollTop: panel.el.offsetTop + this.el.offsetParent.offsetTop - 10
          }, 200, 'easeOutQuint');
        },

        removePanel: function removePanel(event, panel) {
          panel.fire('close');
        },

        newXhrPanel: function newXhrPanel() {
          new XhrPanel();
        },

        newCodePanel: function newCodePanel() {
          new CodePanel();
        }
      });
    }
  });
});
