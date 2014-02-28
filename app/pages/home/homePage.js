// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define([
  'ractive',
  'text!./homeTemplate.html',
  'components/apiSequence/apiSequence',
  'pages/layout/layout'
], function(Ractive, homeTemplate, ApiSequence, Layout) {
  'use strict';

  return {
    createView: function(selector, routeArguments) {
      var layout = new Layout({
        el: selector
      });

      var Home = Ractive.extend({
        template: homeTemplate,

        layout: Layout,

        init: function() {
          var apiSequence = new ApiSequence({el: this.nodes['api-sequence']});

          this.observe({
          });

          this.on({
            teardown: function() { apiSequence.teardown(); }
          });
        }

        // components: {
        //   '#api-sequence': ApiSequence
        // }
      });

      new Home({
        el: layout.contentPlaceholder
      });
    }
  };
});
