// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';

var Xhr = function(xhr) {
  this.name = xhr.name || 'XHR';
  this.method = xhr.method || 'GET';
  this.url = xhr.url || 'http://';
  this.info = xhr.info || null;
  this.createdDate = xhr.createdDate || Date.now();
  this.changedDate = xhr.changedDate || Date.now();
  this.callCount = xhr.callCount || 0;

  // headers: [
  //   {
  //     header: 'Content-Type',
  //     values: ['application/json', 'application/xml'],
  //     default: 'application/json',
  //     required: false
  //   }
  // ],
  this.headers = xhr.headers || [
    {
      header: 'Content-Type',
      values: ['application/json', 'application/xml'],
      default: 'application/json',
      required: false
    }
  ];
  this.body = xhr.body || '';
  this.corsEnabled = xhr.corsEnabled || false;
  this.depricated = xhr.depricated || false;
  this.isPublic = xhr.isPublic || true;
  this.tags = xhr.tags || [];

  // stars: [
  //   {
  //     user: '',
  //     date: Date.now()
  //   }
  // ]
  this.stars = xhr.stars || [];

  // user GUID
  this.owner = xhr.owner || null;


  // forks: [
  //   'forkedId'
  // ],
  this.forks = xhr.forks || [];
  this.forkedFrom = xhr.forkedFrom || null;
};


//// Data
var xhrs = [
  new Xhr({
    name: 'What\'s my IP?',
    method: 'GET',
    url: 'http://www.suri.io/ip',
    info: 'Get your local machine\'s IP address'
  }),
  new Xhr({
    name: 'Google Search',
    method: 'GET',
    url: 'https://ajax.googleapis.com/ajax/services/search/web?v=1.0&q={{searchTerm}}',
    info: null
  }),
  new Xhr({
    name: 'Google Typeahead',
    method: 'GET',
    url: 'http://suggestqueries.google.com/complete/search?client=firefox&q={{searchTerm}}',
    info: null
  })
];


//// Script
var elasticsearch = require('elasticsearch'),
    shortId = require('shortid'),
    index = 'suri-ci',
    type = 'xhr';

var client = elasticsearch.Client({
  host: 'localhost:9200'
});

// Delete all existing items in the index
client.deleteByQuery({
  index: index,
  type: type,
  body: {
    query: {
      match_all: {}
    }
  }
})
  .then(function () {
    console.log('Deleted existing items');

    // Then add each of the new items
    xhrs.forEach(function (xhr) {
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
    });

  }, function () {
    console.log('Failed to delete existing items.');
  });

//process.exit(0);
