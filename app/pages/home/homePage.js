// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define(function(require) {
  'use strict';
  var Ractive = require('Ractive'),
      homeTemplate = require('rv!./homeTemplate'),
      Layout = require('layouts/layout/layout'),
      ApiSequence = require('components/apiSequence/apiSequence');

  var HomePage = Ractive.extend({
    template: homeTemplate,

    init: function() {
      var apiSequence = new ApiSequence({ el: this.nodes['api-sequence'] });

      this.on('teardown', function() {
        apiSequence.teardown();
      });
    }

    // Components remove info about el which breaks topOffset
    // components: {
    //   'api-sequence': ApiSequence
    // }
  });

  return Layout.extend({
    components: { 'content-placeholder': HomePage }
  });
});
