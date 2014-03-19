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
    queryParameterOptions: {
      v: {
        options: ['1.0'],
        default: '1.0',
        required: true
      },
      q: {
        options: [],
        default: '{{searchTerm}}',
        required: true
      }
    },
    tags: ['search', 'google']
  }),
  new Xhr({
    name: 'Google Typeahead',
    method: 'GET',
    url: 'http://suggestqueries.google.com/complete/search?client=firefox&q={{searchTerm}}',
    queryParameterOptions: {
      client: {
        options: ['firefox'],
        default: 'firefox',
        required: true
      },
      q: {
        options: [],
        default: '{{searchTerm}}',
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
    queryParameterOptions: {
      address: {
        options: [],
        default: '1600+Amphitheatre+Parkway,+Mountain+View,+CA',
        required: true
      },
      sensor: {
        options: ['true', 'false'],
        default: 'false',
        required: true
      },
      key: {
        options: [],
        default: 'API_KEY',
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
    queryParameterOptions: {
      q: {
        options: [],
        default: 'Minneapolis,MN',
        required: true
      }
    },
    tags: ['weather', 'forecast', 'temperature']
  }),
  new Xhr({
    name: 'Google RSS Feed Loader',
    method: 'GET',
    url: 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=http://www.digg.com/rss/index.xml',
    queryParameterOptions: {
      v: {
        options: ['1.0'],
        default: '1.0',
        required: true
      },
      q: {
        options: [],
        default: 'http://www.digg.com/rss/index.xml',
        required: true
      }
    },
    tags: ['rss', 'atom', 'feed', 'reader']
  }),
  new Xhr({
    name: 'GitHub User',
    method: 'GET',
    url: 'https://api.github.com/user',
    headers: 'Authorization: token ',
    headerOptions: {
      'Content-Type': {
        options: ['application/json'],
        default: 'application/json',
        required: false
      },
      Authorization: {
        options: ['token '],
        default: 'token ',
        required: true
      }
    },
    tags: ['github', 'user', 'authentication']
  }),
  new Xhr({
    name: 'Hue Lights Discover',
    method: 'GET',
    url: 'http://www.meethue.com/api/nupnp',
    headers: 'Content-Type: application/json',
    headerOptions: {
      'Content-Type': {
        options: ['application/json'],
        default: 'application/json',
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
