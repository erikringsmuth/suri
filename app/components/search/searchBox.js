// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define([
  'ractive',
  'text!./searchBoxTemplate.html',
  'components/xhrPanel/xhrPanel',
  'jquery'
], function(Ractive, searchBoxTemplate, XhrPanel, $) {
  'use strict';

  return Ractive.extend({
    template: searchBoxTemplate,

    data: {
      searchTerm: '',
      searchResults: []
    },

    init: function() {
      window.addEventListener('resize', this.setSearchResultsWidth.bind(this), true);
      window.addEventListener('keydown', function(event) {
        if (event.keyCode === 27) {
          this.nodes.searchInput.focus();
          this.closeSearchResults();
        }
      }.bind(this), true);

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

        openResult: function openResult(event, item) {
          this.closeSearchResults();
          new XhrPanel({data: item});
        },

        openResultOnEnter: function openResultOnEnter(event, item) {
          if (event.original.keyCode === 13) {
            this.fire('openResult', event, item);
          }
        }
      });
    },

    setSearchResultsWidth: function() {
      this.set('searchResultsWidth', this.el.offsetParent.offsetWidth - 2 * this.el.offsetLeft - 37);
    },

    closeSearchResults: function closeSearchResults() {
      this.set('searchTerm', null);
      this.set('searchResults', []);
    }
  });
});
