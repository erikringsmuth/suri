// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define([
  'ractive',
  'text!./xhrPanelTemplate.html',
  'components/apiSequence/sequence'
], function(Ractive, xhrPanelTemplate, sequence) {
  'use strict';

  return Ractive.extend({
    template: xhrPanelTemplate,

    data: {
      name: 'XHR Panel'
    },

    init: function() {
      sequence.push(this);

      this.on({
        close: function close() {
          this.detach();
          sequence.splice(sequence.indexOf(this), 1);
        }
      });
    }
  });
});
