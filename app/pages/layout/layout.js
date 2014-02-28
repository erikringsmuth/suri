// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define([
  'ractive',
  'text!./layoutTemplate.html',
  'router',
  'components/search/searchBox'
], function(Ractive, layoutTemplate, router, SearchBox) {
  'use strict';

  return Ractive.extend({
    template: layoutTemplate,

    data: {
      routes: router.routes
    },

    init: function() {
      var searchBox = new SearchBox({el: this.nodes['search-box']});

      this.observe({
      });

      this.on({
        teardown: function() { searchBox.teardown(); }
      });
    },

    contentPlaceholder: '#content-placeholder'

    // components: {
    //   '#search-box': SearchBox
    // }
  });
});
