// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define(function(require) {
  'use strict';
  var Ractive = require('Ractive'),
      aboutTemplate = require('rv!./aboutTemplate'),
      Layout = require('layouts/simple/layout');

  var About = Ractive.extend({
    template: aboutTemplate
  });

  return Layout.extend({
    components: { 'content-placeholder': About }
  });
});
