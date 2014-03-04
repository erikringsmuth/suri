// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define(function(require) {
  'use strict';
  var Ractive = require('Ractive'),
      codePanelTemplate = require('rv!./codePanelTemplate'),
      sequence = require('components/apiSequence/sequence'),
      utilities = require('components/util/utilities');

  return Ractive.extend({
    template: codePanelTemplate,

    el: '#api-sequence-placeholder',

    append: true,

    data: {
      name: 'Code'
    },

    init: function() {
      sequence.add(this);
      this.set('id', utilities.guid());

      this.on({
        teardown: function teardown(event) {
          this.detach();
          sequence.remove(this);
          if (event && event.original && event.original.stopPropagation) {
            event.original.stopPropagation();
          }
        }
      });
    }
  });
});
