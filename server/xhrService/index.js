// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';
var nconf         = require('nconf'),
    elasticsearch = require('elasticsearch'),
    shortId       = require('shortid'),
    index         = 'suri',
    type          = 'xhrs';

var client = elasticsearch.Client({
  host: nconf.get('BONSAI_URL')
});


// Index will create or update if it already exists
module.exports.create = function(req, res) {
  var id = shortId.generate();
  var xhr = {
    name: req.body.name,
    method: req.body.method,
    url: req.body.url,
    headers: req.body.headers,
    queryParameters: req.body.queryParameters,
    body: req.body.body,
    corsEnabled: req.body.corsEnabled,
    info: req.body.info,
    callCount: 0,
    isPublic: req.body.isPublic,
    depricated: req.body.depricated,
    tags: req.body.tags,
    stars: [],
    owner: req.session_state.userId,
    ownerMd5: req.session_state.emailMd5,
    forks: [],
    forkedFrom: req.body.forkedFrom
  };
  client.create({
    index: index,
    type: type,
    id: id,
    body: xhr
  }).then(function (body) {
    res.send(body);
  }, function (error) {
    res.status(error.status);
    res.send(error);
  });

  // If it's a fork update the forks array on the forked XHR
  if (xhr.forkedFrom) {
    client.update({
      index: index,
      type: type,
      id: xhr.forkedFrom,
      body: {
        script: 'ctx._source.forks += forkId',
        params: { forkId: id }
      }
    });
  }
};

module.exports.update = function(req, res) {
  var xhrId = req.params.id;
  client.get({
    index: index,
    type: type,
    id: xhrId
  }).then(function (body) {
    if (body._source && body._source.owner === req.session_state.userId) {

      // Update request by the owner, OK
      var xhr = {
        name: req.body.name,
        method: req.body.method,
        url: req.body.url,
        headers: req.body.headers,
        queryParameters: req.body.queryParameters,
        body: req.body.body,
        corsEnabled: req.body.corsEnabled,
        info: req.body.info,
        isPublic: req.body.isPublic,
        depricated: req.body.depricated,
        tags: req.body.tags
      };
      client.update({
        index: index,
        type: type,
        id: req.params.id,
        body: {
          doc: xhr
        }
      }).then(function () {
        res.status(204);
        res.send('Updated');
      }, function (error) {
        res.status(error.status);
        res.send(error);
      });
    } else {

      // Not the owner
      res.status(401);
      res.send('You have to be the owner to update an XHR');
    }
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
        filtered: {
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
            }
          },
          filter: {
            or: [
              {
                term: { isPublic: true }
              },
              {
                term: { owner: req.session_state.userId }
              }
            ]
          }
        }
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

module.exports.incrementCallCount = function(req, res, next) {
  var xhrId = req.get('api-id');
  if (xhrId) {
    client.update({
      index: index,
      type: type,
      id: xhrId,
      body: {
        script: 'ctx._source.callCount += count',
        params: { count: 1 },
        upsert: { callCount: 0 } // Set call count if it doesn't already exist
      }
    });
  }
  next();
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
