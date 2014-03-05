// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define(function(require) {
  'use strict';
  var Ractive = require('Ractive'),
      searchBoxTemplate = require('rv!./searchBoxTemplate'),
      XhrPanel = require('components/xhrPanel/xhrPanel'),
      $ = require('jquery');

  return Ractive.extend({
    template: searchBoxTemplate,

    data: {
      searchTerm: '',
      searchResults: []
    },

    init: function() {
      // Focus on the search box when you hit escape
      // Close the search box when you hit escape
      var keydownOnEscapeHandler = function(event) {
        if (event.keyCode === 27) {
          this.nodes.searchInput.focus();
          this.closeSearchResults();
        }
      };
      window.addEventListener('keydown', keydownOnEscapeHandler.bind(this), true);
      window.addEventListener('resize', this.setSearchResultsWidth.bind(this), true);

      this.observe({
        searchTerm: function(searchTerm) {
          if (searchTerm) {
            if (!this.get('searchResultsWidth')) {
              this.setSearchResultsWidth();
            }
            $.ajax('/xhr/_search?q=' + searchTerm.trim())
              .done(function(data) {
                this.set('searchResults', data);
              }.bind(this));
          } else {
            this.closeSearchResults();
          }
        }
      });

      this.on({
        // Navigate between the search box and search results when you hit the up and down arrows
        navigateOnArrow: function navigateOnArrow(event) {
          if (event.original.target.tabIndex && (event.original.keyCode === 38 || event.original.keyCode === 40)) {
            var nextTabIndex = event.original.target.tabIndex;
            if (event.original.keyCode === 38) {
              nextTabIndex = nextTabIndex - 1;
            } else if (event.original.keyCode === 40) {
              nextTabIndex = nextTabIndex + 1;
            }
            var targetItem = this.find('[tabindex="' + nextTabIndex + '"]');
            if (targetItem) targetItem.focus();
            event.original.preventDefault();
          }
        },

        openResult: function openResult(event, item) {
          this.closeSearchResults();
          new XhrPanel({data: item});
        },

        openResultOnEnter: function openResultOnEnter(event, item) {
          if (event.original.keyCode === 13) {
            this.fire('openResult', event, item);
          }
        },

        teardown: function() {
          window.removeEventListener('resize', this.setSearchResultsWidth, true);
          window.removeEventListener('keydown', keydownOnEscapeHandler, true);
        }
      });
    },

    // Set the width of the search results drop-down
    setSearchResultsWidth: function() {
      this.set('searchResultsWidth', this.el.offsetParent.offsetWidth - 2 * this.el.offsetLeft - 37);
    },

    closeSearchResults: function closeSearchResults() {
      this.set('searchTerm', null);
      this.set('searchResults', []);
    }
  });
});
