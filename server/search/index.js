// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';

module.exports = {
  typeahead: function typeahead(searchTerm) {
    return [
      {
        name: 'Google Search',
        method: 'GET',
        url: 'https://ajax.googleapis.com/ajax/services/search/web?v=1.0&q={{searchTerm}}',
        info: ''
      },
      {
        name: 'Google Typeahead',
        method: 'GET',
        url: 'http://suggestqueries.google.com/complete/search?client=firefox&q={{searchTerm}}',
        info: 'More information at http://shreyaschand.com/blog/2013/01/03/google-autocomplete-api/'
      }
    ];
  }
};
