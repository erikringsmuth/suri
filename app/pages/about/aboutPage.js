// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define(function(require) {
  'use strict';
  var Ractive = require('ractive'),
      aboutTemplate = require('rv!./aboutTemplate'),
      Layout = require('layouts/simple/layout');

  var About = Ractive.extend({
    template: aboutTemplate,

    data: {
      url: window.location.href,
      hostname: window.location.hostname
    }
  });

  return Layout.extend({
    components: { 'content-placeholder': About }
  });
});
