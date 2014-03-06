// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define(function(require) {
  'use strict';
  var $ = require('jquery'),
      prettify = require('prettify');

  var utilities = {
    // Format code for readability. This will look for every code block in the element and format it.
    formatCode: function formatCode(element) {
      $(element).find('code').each(function() {
        var $el = $(this);
        // If the code block has class 'pln' don't format the code
        if (!$el.hasClass('pln')) {
          $el.html(prettify.prettyPrintOne($el.html()));
        }
      });
      return element;
    },

    // GUID generator
    guid: function guid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });
    },

    // Escape text being added to the DOM
    escape: function escape(string) {
      return string
        .replace(/&/g,  '&amp;' )
        .replace(/</g,  '&lt;'  )
        .replace(/>/g,  '&gt;'  )
        .replace(/"/g,  '&quot;')
        .replace(/'/g,  '&apos;')
        .replace(/\//g, '&#x2f;');
    },

    formatXml: function formatXml(xml) {
      var formatted = '';
      var reg = /(>)(<)(\/*)/g;
      xml = xml.replace(reg, '$1\r\n$2$3');
      var pad = 0;
      $.each(xml.split('\r\n'), function(index, node) {
        var indent = 0;
        if (node.match( /.+<\/\w[^>]*>$/ )) {
          indent = 0;
        } else if (node.match( /^<\/\w/ )) {
          if (pad !== 0) {
            pad -= 1;
          }
        } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
          indent = 1;
        } else {
          indent = 0;
        }

        var padding = '';
        for (var i = 0; i < pad; i++) {
          padding += '  ';
        }

        formatted += padding + node + '\r\n';
        pad += indent;
      });

      return formatted;
    }
  };

  return utilities;
});
