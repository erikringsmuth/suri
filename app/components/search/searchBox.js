// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define([
  'ractive',
  'text!./searchBoxTemplate.html',
  'jquery'
], function(Ractive, searchBoxTemplate, $) {
  'use strict';

  return Ractive.extend({
    template: searchBoxTemplate,

    data: {
      searchTerm: '',
      searchResults: []
    },

    init: function() {
      window.addEventListener('click', this.closeSearchResults.bind(this), true);
      window.addEventListener('resize', this.setSearchResultsWidth.bind(this), true);

      this.observe({
        searchTerm: function(searchTerm) {
          if (searchTerm) {
            if (!this.get('searchResultsWidth')) {
              this.setSearchResultsWidth();
            }
            $.ajax('/search?q=' + searchTerm.trim())
              .done(function(data) {
                this.set('searchResults', data);
              }.bind(this));
          }
        }
      });

      this.on({
        closeOnEscape: function closeOnEscape(event) {
          // Close on escape
          if (event.original.keyCode === 27) {
            this.closeSearchResults(event);
          }
        },

        navigateOnArrow: function navigateOnArrow(event) {
          if (event.original.target.tabIndex) {
            var nextTabIndex = event.original.target.tabIndex;
            if (event.original.keyCode === 38) {
              nextTabIndex = nextTabIndex - 1;
            } else if (event.original.keyCode === 40) {
              nextTabIndex = nextTabIndex + 1;
            }
            var targetItem = this.find('[tabindex="' + nextTabIndex + '"]');
            if (targetItem) targetItem.focus();
          }
        },

        openResult: function openResult(event) {
          this.closeSearchResults();
          window.dispatchEvent(new CustomEvent('new-xhr-panel', {detail: this.get('searchResults.' + event.original.target.dataset.index)}));
        },

        openResultOnEnter: function openResultOnEnter(event) {
          if (event.original.keyCode === 13) {
            this.fire('openResult', event);
          }
        }
      });
    },

    setSearchResultsWidth: function() {
      this.set('searchResultsWidth', this.el.offsetParent.offsetWidth - 2 * this.el.offsetLeft - 37);
    },

    closeSearchResults: function closeSearchResults(event) {
      if (!event || event.target !== this.nodes.searchInput) {
        this.set('searchTerm', null);
        this.set('searchResults', []);
      }
    }
  });
});
