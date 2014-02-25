// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define([
  'nex',
  'handlebars',
  'text!./layoutTemplate.html',
  'components/search/searchBox',
  'router'
], function(Nex, Handlebars, layoutTemplate, SearchBox, router) {
  'use strict';

  return Nex.defineComponent('layout', {
    template: Handlebars.compile(layoutTemplate),
    model: {
      routes: router.routes
    },
    render: function render() {
      this.html(this.template(this));
      new SearchBox({el: this.querySelector('#search-box')});
    }
  });
});
