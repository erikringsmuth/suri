// Copyright (C) 2014 Erik Ringsmuth - MIT license
define(function(require) {
  'use strict';
  var config              = require('config'),
      Ractive             = require('ractive'),
      profileMenuTemplate = require('rv!./profileMenuTemplate');

  return Ractive.extend({
    template: profileMenuTemplate,

    data: {
      session: config.session
    }
  });
});
