// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';

var elasticsearch = require('elasticsearch'),
    xhrs          = require('./xhrs'),
    shortId       = require('shortid'),
    nconf         = require('nconf'),
    bulkData      = [];

// Load the configuration
nconf
  .argv()
  .env()
  .file({ file: __dirname + './../config.json' });

// Connect to elasticsearch
var elasticSearchHost = nconf.get('ELASTICSEARCH_URL');
console.log('\nConnecting to ' + elasticSearchHost);
var client = elasticsearch.Client({
  host: elasticSearchHost
});

// Build up the bulk request
var eriksUserId = 'eyekZd6Qo',
    eriksMd5    = '5491ac2e7c74eb1253df058e3d8d3e83';
for (var i = 0; i < xhrs.length; i++) {
  xhrs[i].owner = eriksUserId;
  xhrs[i].ownerMd5 = eriksMd5;
  bulkData.push({ index:  { _index: nconf.get('XHR_INDEX'), _type: nconf.get('XHR_TYPE'), _id: shortId.generate() } });
  bulkData.push(xhrs[i]);
}

// Create the users index
// client.indices.create({
//   index: nconf.get('USER_INDEX'),
//   body: {
//     mappings: {
//       users: {
//         properties: {
//           userId: { type: 'string', index: 'not_analyzed' },
//           googleIss: { type: 'string', index: 'not_analyzed' },
//           googleSub: { type: 'string', index: 'not_analyzed' },
//           emailMd5: { type: 'string', index: 'not_analyzed' },
//           displayName: { type: 'string', index: 'not_analyzed' }
//         }
//       }
//     }
//   }
// })
//   .then(function () {
//     console.log('\nCreated the suri-users index and put the mapping');

//     // Then add each of the new items
//     client.index({
//       index: nconf.get('USER_INDEX'),
//       type: nconf.get('USER_TYPE'),
//       id: eriksUserId,
//       body: {
//         displayName: 'erik.ringsmuth',
//         emailMd5: eriksMd5,
//         googleIss: 'accounts.google.com',
//         googleSub: '111414135525027275706'
//       }
//     })
//       .then(function (body) {
//         console.log('\nIndexed user: ' + JSON.stringify(body, null, 2));
//         process.exit(0);
//       }, function (error) {
//         console.log('\nIndex user errored: ' + error);
//         process.exit(0);
//       });

//   }, function (error) {
//     console.log('Failed to create the suri-users index.\nErrored: ' + error);
//   });


// Recreate the index and put mappings
client.indices.delete({
  index: nconf.get('XHR_INDEX')
}, function() {
  console.log('\nDeleted the index');

  client.indices.create({
    index: nconf.get('XHR_INDEX'),
    body: {
      mappings: {
        xhrs: {
          properties: {
            name: { type: 'string' },
            method: { type: 'string', null_value: 'GET' },
            url: { type: 'string', index: 'not_analyzed' },
            info: { type: 'string', index: 'not_analyzed' },
            callCount: { type: 'integer', null_value: 0 },
            headers: {
              index: 'not_analyzed',
              properties: {
                header: { type: 'string', index: 'not_analyzed' },
                options: { type: 'string', index: 'not_analyzed' }, // Array
                selected: { type: 'string', index: 'not_analyzed' },
                required: { type: 'boolean', null_value: false }
              }
            },
            queryParameters: {
              index: 'not_analyzed',
              properties: {
                queryParameter: { type: 'string', index: 'not_analyzed' },
                options: { type: 'string', index: 'not_analyzed' }, // Array
                selected: { type: 'string', index: 'not_analyzed' },
                required: { type: 'boolean', null_value: false }
              }
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
