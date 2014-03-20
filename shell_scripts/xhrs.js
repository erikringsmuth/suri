// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';

var Xhr = require('./Xhr');

//// Data
var xhrs = [
  new Xhr({
    name: 'What\'s my IP?',
    method: 'GET',
    url: 'http://www.suri.io/ip',
    info: 'Get your local machine\'s IP address'
  }),
  new Xhr({
    name: 'suri.io elasticsearch query with owner',
    method: 'GET',
    url: 'http://www.suri.io/xhr?owner=eyekZd6Qo&q=google',
    info: 'Search a user\'s APIs'
  }),
  new Xhr({
    name: 'Google Search',
    method: 'GET',
    url: 'https://ajax.googleapis.com/ajax/services/search/web?v=1.0&q={{searchTerm}}',
    headers: {
      'Content-Type': {
        options: ['application/json', 'application/xml'],
        selected: 'application/json',
        required: false
      }
    },
    queryParameters: {
      v: {
        options: ['1.0'],
        selected: '1.0',
        required: true
      },
      q: {
        options: [],
        selected: '{{searchTerm}}',
        required: true
      }
    },
    tags: ['search', 'google']
  }),
  new Xhr({
    name: 'Google Typeahead',
    method: 'GET',
    url: 'http://suggestqueries.google.com/complete/search?client=firefox&q={{searchTerm}}',
    headers: {
      'Content-Type': {
        options: ['application/json', 'application/xml'],
        selected: 'application/json',
        required: false
      }
    },
    queryParameters: {
      client: {
        options: ['firefox'],
        selected: 'firefox',
        required: true
      },
      q: {
        options: [],
        selected: '{{searchTerm}}',
        required: true
      }
    },
    tags: ['search', 'typeahead', 'google']
  }),
  new Xhr({
    name: 'CORS Test Endpoint',
    method: 'GET',
    url: 'https://cors-test.appspot.com/test',
    corsEnabled: true,
    info: 'Use this endpoint to test CORS functionality.',
    tags: ['cors', 'xss']
  }),
  new Xhr({
    name: 'Google Maps GeoCode',
    method: 'GET',
    url: 'https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&sensor=false',
    queryParameters: {
      address: {
        options: [],
        selected: '1600+Amphitheatre+Parkway,+Mountain+View,+CA',
        required: true
      },
      sensor: {
        options: ['true', 'false'],
        selected: 'false',
        required: true
      },
      key: {
        options: [],
        selected: 'API_KEY',
        required: false
      }
    },
    tags: ['maps', 'location', 'geolocation']
  }),
  new Xhr({
    name: 'ICNDB Internet Chuck Norris Database',
    method: 'GET',
    url: 'http://api.icndb.com/jokes/random',
    info: 'A roundhouse kick to the face!',
    tags: ['jokes']
  }),
  new Xhr({
    name: 'Weather Forecast',
    method: 'GET',
    url: 'http://api.openweathermap.org/data/2.5/weather?q=Minneapolis,MN',
    queryParameters: {
      q: {
        options: [],
        selected: 'Minneapolis,MN',
        required: true
      }
    },
    headers: {
      'Content-Type': {
        options: ['application/json'],
        selected: 'application/json',
        required: false
      }
    },
    tags: ['weather', 'forecast', 'temperature']
  }),
  new Xhr({
    name: 'Google RSS Feed Loader',
    method: 'GET',
    url: 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=http://www.digg.com/rss/index.xml',
    queryParameters: {
      v: {
        options: ['1.0'],
        selected: '1.0',
        required: true
      },
      q: {
        options: [],
        selected: 'http://www.digg.com/rss/index.xml',
        required: true
      }
    },
    tags: ['rss', 'atom', 'feed', 'reader']
  }),
  new Xhr({
    name: 'GitHub User',
    method: 'GET',
    url: 'https://api.github.com/user',
    headers: {
      'Content-Type': {
        options: ['application/json'],
        selected: 'application/json',
        required: false
      },
      Authorization: {
        options: ['token '],
        selected: 'token ',
        required: true
      }
    },
    tags: ['github', 'user', 'authentication']
  }),
  new Xhr({
    name: 'Hue Lights Discover',
    method: 'GET',
    url: 'http://www.meethue.com/api/nupnp',
    headers: {
      'Content-Type': {
        options: ['application/json'],
        selected: 'application/json',
        required: false
      }
    }
  }),
  new Xhr({
    name: 'Engadget RSS',
    method: 'GET',
    url: 'http://www.engadget.com/rss.xml',
    tags: ['atom', 'rss', 'feed']
  })
];

module.exports = xhrs;
