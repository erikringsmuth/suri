// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define(function(require) {
  'use strict';
  var Ractive = require('ractive'),
      genericTemplate = require('rv!./genericTemplate');

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
