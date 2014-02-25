// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define([
  'nex',
  'handlebars',
  'text!./homeTemplate.html',
  'pages/layout/layout'
], function(Nex, Handlebars, homeTemplate, Layout) {
  'use strict';

  return Nex.defineComponent('home-page', {
    template: Handlebars.compile(homeTemplate),
    layout: Layout
  });
});
