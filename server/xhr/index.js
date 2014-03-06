// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';
var elasticsearch = require('elasticsearch');

var client = elasticsearch.Client({
  host: process.env.ELASTICSEARCH_URL
});
var index = 'suri-ci',
    type = 'xhr';

module.exports.create = function(req, res) {
  client.create({
    index: index,
    type: type,
    body: req.body
  }).then(function (body) {
    res.send(body);
  }, function (error) {
    res.status(error.status);
    res.send(error);
  });
};

module.exports.readList = function(req, res) {
  client.get({
    index: index,
    type: type
  }).then(function (body) {
    res.send(body);
  }, function (error) {
    res.send(error);
  });
};

module.exports.read = function(req, res) {
  client.get({
    index: index,
    type: type,
    id: req.params.id
  }).then(function (body) {
    res.send(body);
  }, function (error) {
    res.status(error.status);
    res.send(error);
  });
};

module.exports.search = function(req, res) {
  client.search({
    index: index,
    type: type,
    body: {
      query: {
        bool: {
          should: [
            {
              prefix: {
                name: req.query.q
              }
            },
            {
              simple_query_string: {
                query: req.query.q
              }
            }
          ]
        },
        minimum_should_match: 1
      }
    }
  }).then(function (body) {
    var response = body.hits.hits.map(function(result) { return result._source; });
    res.send(response);
  }, function (error) {
    res.status(error.status);
    res.send(error);
  });
};

// module.exports.search = function(req, res) {
//   client.search({
//     index: index,
//     type: type,
//     //q: req.query.q // simple
//     body: {
//       query: {
//         simple_query_string: {
//           query: req.query.q
//         }
//       }
//     }
//   }).then(function (body) {
//     res.send(body);
//   }, function (error) {
//     res.status(error.status);
//     res.send(error);
//   });
// };

module.exports.update = function(req, res) {
  client.update({
    index: index,
    type: type,
    id: req.params.id,
    body: {
      doc: req.body
    }
  }).then(function (body) {
    res.send(body);
  }, function (error) {
    res.status(error.status);
    res.send(error);
  });
};

module.exports.delete = function(req, res) {
  client.delete({
    index: index,
    type: type,
    id: req.params.id
  }).then(function (body) {
    res.send(body);
  }, function (error) {
    res.status(error.status);
    res.send(error);
  });
};
