// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';

var elasticsearch = require('elasticsearch'),
    shortId = require('shortid');

var client = elasticsearch.Client({
  host: 'localhost:9200'
});
var index = 'suri-ci',
    type = 'xhr';

var addXhr = function(xhr) {
  client.index({
    index: index,
    type: type,
    id: shortId.generate(),
    body: xhr
  })
    .then(function (body) {
      console.log('\nCreated: ' + JSON.stringify(body));
    }, function (error) {
      console.log(error);
    });
};

client.deleteByQuery({
  index: index,
  type: type,
  body: {
    query: {
      match_all: {}
    }
  }
})
  .then(function (body) {
    console.log('Deleted existing items');

    addXhr({
      name: 'What\'s my IP?',
      url: 'http://www.suri.io/ip',
      method: 'GET',
      info: 'Get your local machine\'s IP address'
    });

    addXhr({
      name: 'Google Search',
      url: 'https://ajax.googleapis.com/ajax/services/search/web?v=1.0&q={{searchTerm}}',
      method: 'GET',
      info: ''
    });

    addXhr({
      name: 'Google Typeahead',
      url: 'http://suggestqueries.google.com/complete/search?client=firefox&q={{searchTerm}}',
      method: 'GET',
      info: ''
    });

  }, function (error) {
    console.log('Failed to delete existing items.');
  });

//process.exit(0);
