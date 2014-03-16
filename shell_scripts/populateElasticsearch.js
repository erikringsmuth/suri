// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';

var elasticsearch = require('elasticsearch'),
    xhrs          = require('./xhrs'),
    shortId       = require('shortid'),
    nconf         = require('nconf'),
    index         = 'suri',
    type          = 'xhrs',
    bulkData      = [];

nconf
  .argv()
  .env()
  .file({ file: __dirname + './../config.json' });

// Build up the bulk request
var eriksUserId = 'eyekZd6Qo';
for (var i = 0; i < xhrs.length; i++) {
  xhrs[i].owner = eriksUserId;
  bulkData.push({ index:  { _index: index, _type: type, _id: shortId.generate() } });
  bulkData.push(xhrs[i]);
}

// Add my user profile
bulkData.push({ index:  { _index: index, _type: 'users', _id: eriksUserId } });
bulkData.push({
  displayName: 'erik.ringsmuth',
  emailMd5: '5491ac2e7c74eb1253df058e3d8d3e83',
  googleIss: 'accounts.google.com',
  googleSub: '111414135525027275706'
});

var elasticSearchHost = nconf.get('ELASTICSEARCH_URL');
console.log('\nConnecting to ' + elasticSearchHost);
var client = elasticsearch.Client({
  host: elasticSearchHost
});

// Recreate the index and put mappings
client.indices.delete({
  index: index
}, function() {
  console.log('\nDeleted the index');

  client.indices.create({
    index: index,
    body: {
      mappings: {
        xhrs: {
          properties: {
            name: { type: 'string' },
            method: { type: 'string', null_value: 'GET' },
            url: { type: 'string', index: 'not_analyzed' },
            info: { type: 'string', index: 'not_analyzed' },
            callCount: { type: 'integer', null_value: 0 },
            headers: { type: 'string', index: 'not_analyzed' },
            headerOptions: { // Array
              properties: {
                header: { type: 'string' },
                values: { type: 'string' }, // Array
                default: { type: 'string' },
                required: { type: 'boolean', null_value: false }
              },
              index: 'not_analyzed'
            },
            queryParameters: { // Array
              properties: {
                parameter: { type: 'string' },
                values: { type: 'string' }, // Array
                default: { type: 'string' },
                required: { type: 'boolean', null_value: false }
              },
              index: 'not_analyzed'
            },
            body: { type: 'string', index: 'not_analyzed' },
            corsEnabled: { type: 'boolean', null_value: false, index: 'not_analyzed' },
            depricated: { type: 'boolean', null_value: false, index: 'not_analyzed' },
            isPublic: { type: 'boolean', null_value: false, index: 'not_analyzed' },
            tags: { type: 'string' }, // Array
            stars: { type: 'string', index: 'not_analyzed' }, // Array
            owner: {
              type: 'multi_field',
              fields: {
                owner: { type: 'string', index: 'not_analyzed' },
                indexed: { type: 'string' },
              }
            },
            ownerMd5: { type: 'string', index: 'not_analyzed' },
            forks: { type: 'string', index: 'not_analyzed' }, // Array
            forkedFrom: { type: 'string', index: 'not_analyzed' }
          }
        },
        users: {
          properties: {
            userId: { type: 'string', index: 'not_analyzed' },
            googleIss: { type: 'string', index: 'not_analyzed' },
            googleSub: { type: 'string', index: 'not_analyzed' },
            emailMd5: { type: 'string', index: 'not_analyzed' },
            displayName: { type: 'string', index: 'not_analyzed' }
          }
        }
      }
    }
  })
    .then(function () {
      console.log('\nRecreated the index and put new mappings');

      // Then add each of the new items
      client.bulk({
        body: bulkData
      })
        .then(function (body) {
          console.log('\nIndexed: ' + JSON.stringify(body, null, 2));
          process.exit(0);
        }, function (error) {
          console.log('\nErrored: ' + error);
          process.exit(0);
        });

    }, function (error) {
      console.log('Failed to recreated the index and put new mappings.\nErrored: ' + error);
      process.exit(0);
    });

});
