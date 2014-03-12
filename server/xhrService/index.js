// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';
var nconf         = require('nconf'),
    elasticsearch = require('elasticsearch'),
    shortId       = require('shortid'),
    index         = 'suri-ci',
    type          = 'xhr';

var client = elasticsearch.Client({
  host: nconf.get('BONSAI_URL')
});

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

module.exports.simpleSearch = function(req, res) {
  client.search({
    index: index,
    type: type,
    //q: req.query.q // simple
    body: {
      query: {
        simple_query_string: {
          query: req.query.q
        }
      }
    }
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
    // Map the response to an array with the _source field plus the ID
    var response = body.hits.hits.map(function(result) {
      result._source.id = result._id;
      return result._source;
    });
    res.send(response);
  }, function (error) {
    res.status(error.status);
    res.send(error);
  });
};

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

// Index will create or update if it already exists
module.exports.index = function(req, res) {
  // Server validation
  // TODO: guard on arrays and read only properties
  // TODO: select object with ID and fall back to existing properties
  var xhr = {
    name: req.body.name,
    method: req.body.method,
    url: req.body.url,
    headers: req.body.headers,
    queryParameters: req.body.queryParameters,
    body: req.body.body,
    corsEnabled: req.body.corsEnabled,
    info: req.body.info,
    createdDate: req.body.createdDate,
    changedDate: req.body.changedDate,
    callCount: req.body.callCount,
    isPublic: req.body.isPublic,
    depricated: req.body.depricated,
    tags: req.body.tags,
    stars: req.body.stars,
    owner: req.body.owner,
    forks: req.body.forks,
    forkedFrom: req.body.forkedFrom
  };
  client.index({
    index: index,
    type: type,
    id: req.body.id || shortId.generate(),
    body: xhr
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
