// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define(function(require) {
  'use strict';
  var $ = require('jquery'),
      prettify = require('prettify');

  var utilities = {
    // True in a development environment
    development: window.location.hostname === 'localhost',

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
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
        .replace(/\//g, '&#x2f;');
    }
  };

  return utilities;
});
