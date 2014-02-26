// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define([
  'ractive',
  'components/apiSequence/sequence',
  'components/util/utilities'
], function(Ractive, sequence, utilities) {
  'use strict';

  return Ractive.extend({
    el: '#api-sequence-placeholder',

    append: true,

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
