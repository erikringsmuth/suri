// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define([
  'nex',
  'handlebars',
  'text!./layoutTemplate.html',
  'router'
], function(Nex, Handlebars, layoutTemplate, router) {
  'use strict';

  return Nex.defineComponent('layout', {
    template: Handlebars.compile(layoutTemplate),
    model: {
      routes: router.routes
    }
  });
});
