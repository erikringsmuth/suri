// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define([
  'nex',
  'handlebars',
  'text!./notFoundTemplate.html',
  'pages/layout/layout'
], function(Nex, Handlebars, notFoundTemplate, Layout) {
  'use strict';

  return Nex.defineComponent('not-found-page', {
    template: Handlebars.compile(notFoundTemplate),
    layout: Layout
  });
});
