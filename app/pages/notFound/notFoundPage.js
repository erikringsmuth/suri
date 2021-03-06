// Copyright (C) 2014 Erik Ringsmuth - MIT license
define(function(require) {
  'use strict';
  var Ractive           = require('ractive'),
      notFoundTemplate  = require('rv!./notFoundTemplate'),
      Layout            = require('layouts/simple/layout');

  var NotFoundPage = Ractive.extend({
    template: notFoundTemplate
  });

  return Layout.extend({
    components: { 'content-placeholder': NotFoundPage }
  });
});
