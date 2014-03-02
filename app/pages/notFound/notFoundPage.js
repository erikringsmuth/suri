// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define(function(require) {
  'use strict';
  var Ractive = require('ractive'),
      notFoundTemplate = require('text!./notFoundTemplate.html'),
      Layout = require('layouts/layout/layout');

  var NotFoundPage = Ractive.extend({
    template: notFoundTemplate
  });

  return Layout.extend({
    components: { 'content-placeholder': NotFoundPage }
  });
});
