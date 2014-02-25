/*global define*/
define([
  'jquery',
  'prettify'
], function($, prettify) {
  'use strict';

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
    }
  };

  return utilities;
});
