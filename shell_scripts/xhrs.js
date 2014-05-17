// Copyright (C) 2014 Erik Ringsmuth - MIT license
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
    headers: [
      {
        header: 'Accept',
        options: ['application/json', 'application/xml'],
        selected: 'application/json',
        required: false
      }
    ],
    queryParameters: [
      {
        header: 'v',
        options: ['1.0'],
        selected: '1.0',
        required: true
      },
      {
        header: 'q',
        options: [],
        selected: '{{searchTerm}}',
        required: true
      }
    ],
    tags: ['search', 'google']
  }),
  new Xhr({
    name: 'Google Typeahead',
    method: 'GET',
    url: 'http://suggestqueries.google.com/complete/search?client=firefox&q={{searchTerm}}',
    headers: [
      {
        header: 'Accept',
        options: ['application/json', 'application/xml'],
        selected: 'application/json',
        required: false
      }
    ],
    queryParameters: [
      {
        queryParameter: 'client',
        options: ['firefox'],
        selected: 'firefox',
        required: true
      },
      {
        queryParameter: 'q',
        options: [],
        selected: '{{searchTerm}}',
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
    queryParameters: [
      {
        queryParameter: 'address',
        options: [],
        selected: '1600+Amphitheatre+Parkway,+Mountain+View,+CA',
        required: true
      },
      {
        queryParameter: 'sensor',
        options: ['true', 'false'],
        selected: 'false',
        required: true
      },
      {
        queryParameter: 'key',
        options: [],
        selected: 'API_KEY',
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
    queryParameters: [
      {
        queryParameter: 'q',
        options: [],
        selected: 'Minneapolis,MN',
        required: true
      }
    ],
    headers: [
      {
        header: 'Accept',
        options: ['application/json'],
        selected: 'application/json',
        required: false
      }
    ],
    tags: ['weather', 'forecast', 'temperature']
  }),
  new Xhr({
    name: 'Google RSS Feed Loader',
    method: 'GET',
    url: 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=http://www.digg.com/rss/index.xml',
    queryParameters: [
      {
        queryParameter: 'v',
        options: ['1.0'],
        selected: '1.0',
        required: true
      },
      {
        queryParameter: 'q',
        options: [],
        selected: 'http://www.digg.com/rss/index.xml',
        required: true
      }
    ],
    tags: ['rss', 'atom', 'feed', 'reader']
  }),
  new Xhr({
    name: 'GitHub User',
    method: 'GET',
    url: 'https://api.github.com/user',
    headers: [
      {
        header: 'Accept',
        options: ['application/json'],
        selected: 'application/json',
        required: false
      },
      {
        header: 'Authorization',
        options: ['token '],
        selected: 'token ',
        required: true
      }
    ],
    tags: ['github', 'user', 'authentication']
  }),
  new Xhr({
    name: 'Hue Lights Discover',
    method: 'GET',
    url: 'http://www.meethue.com/api/nupnp',
    headers: [
      {
        header: 'Accept',
        options: ['application/json'],
        selected: 'application/json',
        required: false
      }
    ]
  }),
  new Xhr({
    name: 'Engadget RSS',
    method: 'GET',
    url: 'http://www.engadget.com/rss.xml',
    tags: ['atom', 'rss', 'feed']
  }),
  new Xhr({
    name: 'XBox Live Profile',
    method: 'GET',
    url: 'http://www.xboxleaders.com/api/profile.json?gamertag={gamerTag}',
    queryParameters: [
      {
        header: 'gamertag',
        options: [],
        selected: '{gamerTag}',
        required: true
      }
    ],
    headers: [
      {
        header: 'Accept',
        options: ['application/json'],
        selected: 'application/json',
        required: false
      }
    ],
    tags: ['xbox', 'games', 'gamer']
  }),
  new Xhr({
    name: 'XBox Live Friends',
    method: 'GET',
    url: 'http://www.xboxleaders.com/api/friends.json?gamertag={gamerTag}',
    queryParameters: [
      {
        header: 'gamertag',
        options: [],
        selected: '{gamerTag}',
        required: true
      }
    ],
    headers: [
      {
        header: 'Accept',
        options: ['application/json'],
        selected: 'application/json',
        required: false
      }
    ],
    tags: ['xbox', 'games', 'gamer']
  }),
  new Xhr({
    name: 'XBox Live Games',
    method: 'GET',
    url: 'http://www.xboxleaders.com/api/games.json?gamertag={gamerTag}',
    queryParameters: [
      {
        header: 'gamertag',
        options: [],
        selected: '{gamerTag}',
        required: true
      }
    ],
    headers: [
      {
        header: 'Accept',
        options: ['application/json'],
        selected: 'application/json',
        required: false
      }
    ],
    tags: ['xbox', 'games', 'gamer']
  }),
  new Xhr({
    name: 'XBox Live Game Achievements',
    method: 'GET',
    url: 'http://www.xboxleaders.com/achievements.json?gamertag={gamerTag}&gameid={gameId}',
    queryParameters: [
      {
        header: 'gameid',
        options: [],
        selected: '{gameId}',
        required: true
      },
      {
        header: 'gamertag',
        options: [],
        selected: '{gamerTag}',
        required: true
      }
    ],
    headers: [
      {
        header: 'Accept',
        options: ['application/json'],
        selected: 'application/json',
        required: false
      }
    ],
    tags: ['xbox', 'games', 'gamer']
  }),
  new Xhr({
    name: 'Twitch TV',
    method: 'GET',
    url: 'https://api.twitch.tv/',
    headers: [
      {
        header: 'Accept',
        options: ['application/vnd.twitchtv.v2+json'],
        selected: 'application/vnd.twitchtv.v2+json',
        required: false
      }
    ],
    tags: ['games', 'gamer', 'streaming']
  })
];

module.exports = xhrs;
