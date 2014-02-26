// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define([
  'ractive',
  'text!./genericTemplate.html'
], function(Ractive, genericTemplate) {
  'use strict';

  return Ractive.extend({
    template: genericTemplate,

    data: {
    },

    init: function() {
      this.observe({
      });

      this.on({
      });
    }
  });
});
