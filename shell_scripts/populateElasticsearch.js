// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';

var elasticsearch = require('elasticsearch'),
    shortId = require('shortid'),
    index = 'suri-ci',
    type = 'xhr';

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
  this.headers = xhr.headers || [];

  // queryParameters: [
  //   {
  //     parameter: 'key',
  //     values: [],
  //     default: 'API_KEY',
  //     required: false
  //   }
  // ]
  this.queryParameters = xhr.queryParameters || [];
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
  { index:  { _index: index, _type: type, _id: shortId.generate() } },
  new Xhr({
    name: 'What\'s my IP?',
    method: 'GET',
    url: 'http://www.suri.io/ip',
    info: 'Get your local machine\'s IP address'
  }),
  { index:  { _index: index, _type: type, _id: shortId.generate() } },
  new Xhr({
    name: 'Google Search',
    method: 'GET',
    url: 'https://ajax.googleapis.com/ajax/services/search/web?v=1.0&q={{searchTerm}}',
    queryParameters: [
      {
        parameter: 'v',
        values: ['1.0'],
        default: '1.0',
        required: true
      },
      {
        parameter: 'q',
        values: [],
        default: '{{searchTerm}}',
        required: true
      }
    ],
    tags: ['search', 'google']
  }),
  { index:  { _index: index, _type: type, _id: shortId.generate() } },
  new Xhr({
    name: 'Google Typeahead',
    method: 'GET',
    url: 'http://suggestqueries.google.com/complete/search?client=firefox&q={{searchTerm}}',
    queryParameters: [
      {
        parameter: 'client',
        values: ['firefox'],
        default: 'firefox',
        required: true
      },
      {
        parameter: 'q',
        values: [],
        default: '{{searchTerm}}',
        required: true
      }
    ],
    tags: ['search', 'typeahead', 'google']
  }),
  { index:  { _index: index, _type: type, _id: shortId.generate() } },
  new Xhr({
    name: 'CORS Test Endpoint',
    method: 'GET',
    url: 'https://cors-test.appspot.com/test',
    corsEnabled: true,
    info: 'Use this endpoint to test CORS functionality.',
    tags: ['cors', 'xss']
  }),
  { index:  { _index: index, _type: type, _id: shortId.generate() } },
  new Xhr({
    name: 'Google Maps GeoCode',
    method: 'GET',
    url: 'https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&sensor=false',
    queryParameters: [
      {
        parameter: 'address',
        values: [],
        default: '1600+Amphitheatre+Parkway,+Mountain+View,+CA',
        required: true
      },
      {
        parameter: 'sensor',
        values: ['true', 'false'],
        default: 'false',
        required: true
      },
      {
        parameter: 'key',
        values: [],
        default: 'API_KEY',
        required: false
      }
    ],
    tags: ['maps', 'location', 'geolocation']
  }),
  { index:  { _index: index, _type: type, _id: shortId.generate() } },
  new Xhr({
    name: 'ICNDB Internet Chuck Norris Database',
    method: 'GET',
    url: 'http://api.icndb.com/jokes/random',
    info: 'A roundhouse kick to the face!',
    tags: ['jokes']
  }),
  { index:  { _index: index, _type: type, _id: shortId.generate() } },
  new Xhr({
    name: 'Weather Forecast',
    method: 'GET',
    url: 'http://api.openweathermap.org/data/2.5/weather?q=Minneapolis,MN',
    queryParameters: [
      {
        parameter: 'q',
        values: [],
        default: 'Minneapolis,MN',
        required: true
      }
    ],
    tags: ['weather', 'forecast', 'temperature']
  }),
  { index:  { _index: index, _type: type, _id: shortId.generate() } },
  new Xhr({
    name: 'Google RSS Feed Loader',
    method: 'GET',
    url: 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=http://www.digg.com/rss/index.xml',
    queryParameters: [
      {
        parameter: 'v',
        values: ['1.0'],
        default: '1.0',
        required: true
      },
      {
        parameter: 'q',
        values: [],
        default: 'http://www.digg.com/rss/index.xml',
        required: true
      }
    ],
    tags: ['rss', 'atom', 'feed', 'reader']
  })
];


//// Script
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
    client.bulk({
      body: xhrs
    })
      .then(function (body) {
        console.log('\nIndexed: ' + JSON.stringify(body));
        process.exit(0);
      }, function (error) {
        console.log(error);
        process.exit(0);
      });

  }, function () {
    console.log('Failed to delete existing items.');
  });
