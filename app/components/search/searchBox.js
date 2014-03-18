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
      searchTerm: ''
    },

    init: function() {
      // Focus on the search box when you hit escape
      // Close the search box when you hit escape
      var that = this;
      var keydownOnEscapeHandler = function(event) {
        if (event.keyCode === 27) {
          that.nodes.searchInput.focus();
          that.closeSearchResults();
        }
      };
      var setSearchResultsWidth = function() {
        that.set('searchResultsWidth', $('#search').width() - 2 * that.el.offsetLeft - 37);
      };
      window.addEventListener('keydown', keydownOnEscapeHandler, true);
      window.addEventListener('resize', setSearchResultsWidth, true);

      this.observe({
        searchTerm: function(searchTerm) {
          if (searchTerm) {
            if (!this.get('searchResultsWidth')) {
              setSearchResultsWidth();
            }
            $.ajax('/xhr?q=' + searchTerm.trim())
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
          window.removeEventListener('resize', setSearchResultsWidth, true);
          window.removeEventListener('keydown', keydownOnEscapeHandler, true);
        }
      });
    },

    closeSearchResults: function closeSearchResults() {
      this.set('searchTerm', null);
      this.set('searchResults', {});
    }
  });
});
