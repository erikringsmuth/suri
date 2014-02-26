// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define([
  'nex',
  'handlebars',
  'text!./homeTemplate.html',
  'components/apiSequence/apiSequence',
  'pages/layout/layout'
], function(Nex, Handlebars, homeTemplate, ApiSequence, Layout) {
  'use strict';

  return Nex.defineComponent('home-page', {
    template: Handlebars.compile(homeTemplate),
    layout: Layout,
    render: function render() {
      this.html(this.template(this));
      new ApiSequence({el: this.querySelector('#api-sequence')});
    }
  });
});
