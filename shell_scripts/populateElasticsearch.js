// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';

var elasticsearch = require('elasticsearch'),
    xhrs = require('./xhrs'),
    shortId = require('shortid'),
    index = 'suri-ci',
    type = 'xhr',
    bulkData = [];

for (var i = 0; i < xhrs.length; i++) {
  bulkData.push({ index:  { _index: index, _type: type, _id: shortId.generate() } });
  bulkData.push(xhrs[i]);
}

var elasticSearchHost = process.argv[2] || 'localhost:9200';
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
