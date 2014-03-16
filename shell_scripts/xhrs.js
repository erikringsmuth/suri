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
    queryParameterOptions: [
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
  new Xhr({
    name: 'Google Typeahead',
    method: 'GET',
    url: 'http://suggestqueries.google.com/complete/search?client=firefox&q={{searchTerm}}',
    queryParameterOptions: [
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
    queryParameterOptions: [
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
    queryParameterOptions: [
      {
        parameter: 'q',
        values: [],
        default: 'Minneapolis,MN',
        required: true
      }
    ],
    tags: ['weather', 'forecast', 'temperature']
  }),
  new Xhr({
    name: 'Google RSS Feed Loader',
    method: 'GET',
    url: 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=http://www.digg.com/rss/index.xml',
    queryParameterOptions: [
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
  }),
  new Xhr({
    name: 'GitHub User',
    method: 'GET',
    url: 'https://api.github.com/user',
    headers: 'Authorization: token ',
    headerOptions: [
      {
        parameter: 'Content-Type',
        values: ['application/json'],
        default: 'application/json',
        required: false
      },
      {
        parameter: 'Authorization',
        values: ['token '],
        default: 'token ',
        required: true
      }
    ],
    tags: ['github', 'user', 'authentication']
  }),
  new Xhr({
    name: 'Hue Lights Discover',
    method: 'GET',
    url: 'http://www.meethue.com/api/nupnp',
    headers: 'Content-Type: application/json',
    headerOptions: [
      {
        parameter: 'Content-Type',
        values: ['application/json'],
        default: 'application/json',
        required: false
      }
    ]
  })
];

module.exports = xhrs;
