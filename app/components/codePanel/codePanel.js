// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define([
  'ractive',
  'text!./codePanelTemplate.html',
  'components/apiSequence/sequence',
  'components/util/utilities'
], function(Ractive, codePanelTemplate, sequence, utilities) {
  'use strict';

  return Ractive.extend({
    template: codePanelTemplate,

    el: '#api-sequence-placeholder',

    append: true,

    data: {
      name: 'Code'
    },

    init: function() {
      sequence.push(this);
      this.set('id', utilities.guid());

      this.on({
        close: function close() {
          this.detach();
          sequence.splice(sequence.indexOf(this), 1);
          if (event && event.original && event.original.stopPropagation) {
            event.original.stopPropagation();
          }
        }
      });
    }
  });
});
