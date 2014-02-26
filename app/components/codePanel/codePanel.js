// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define([
  'ractive',
  'text!./codePanelTemplate.html',
  'components/apiSequence/sequence'
], function(Ractive, codePanelTemplate, sequence) {
  'use strict';

  return Ractive.extend({
    template: codePanelTemplate,

    append: true,

    data: {
      name: 'Code'
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
