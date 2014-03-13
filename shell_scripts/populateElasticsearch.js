// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';

var elasticsearch = require('elasticsearch'),
    xhrs          = require('./xhrs'),
    shortId       = require('shortid'),
    nconf         = require('nconf'),
    index         = 'suri-ci',
    type          = 'xhr',
    bulkData      = [];

nconf
  .argv()
  .env()
  .file({ file: __dirname + './../config.json' });

for (var i = 0; i < xhrs.length; i++) {
  bulkData.push({ index:  { _index: index, _type: type, _id: shortId.generate() } });
  bulkData.push(xhrs[i]);
}

var elasticSearchHost = nconf.get('BONSAI_URL');
console.log('\nConnecting to ' + elasticSearchHost);
var client = elasticsearch.Client({
  host: elasticSearchHost
});

// Delete all existing items in the index
client.deleteByQuery({
  index: index,
  body: {
    query: {
      match_all: {}
    }
  }
})
  .then(function () {
    console.log('\nDeleted existing items');

    // Then add each of the new items
    client.bulk({
      body: bulkData
    })
      .then(function (body) {
        console.log('\nIndexed: ' + JSON.stringify(body));
        process.exit(0);
      }, function (error) {
        console.log('\nErrored: ' + error);
        process.exit(0);
      });

  }, function () {
    console.log('Failed to delete existing items.');
  });
