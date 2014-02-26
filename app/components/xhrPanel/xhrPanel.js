// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define([
  'ractive',
  'text!./xhrPanelTemplate.html',
  'components/apiSequence/sequence',
  'components/util/utilities'
], function(Ractive, xhrPanelTemplate, sequence, utilities) {
  'use strict';

  return Ractive.extend({
    template: xhrPanelTemplate,

    el: '#api-sequence-placeholder',

    append: true,

    data: {
      name: 'XHR Panel'
    },

    init: function() {
      sequence.push(this);
      this.set('id', utilities.guid());

      this.on({
        close: function close() {
          this.detach();
          sequence.splice(sequence.indexOf(this), 1);
        }
      });
    }
  });
});
