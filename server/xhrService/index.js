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


module.exports.create = function(req, res) {
  if(!req.session_state.signedIn) {
    res.status(401);
    res.send('You must be signed in to save an XHR');
  }
  else {
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
  }
};

module.exports.get = function(req, res) {
  client.get({
    index: index,
    type: type,
    id: req.params.id
  }).then(function (body) {
    if (body._source.isPublic || req.session_state.userId === body._source.owner) {
      body._source.id = body._id;
      res.send(body._source);
    } else {
      res.status(404);
      res.send('Not found');
    }
  }, function (error) {
    res.status(error.status);
    res.send(error);
  });
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

module.exports.search = function(req, res) {
  var search;
  if (typeof(req.query.owner) !== 'undefined') {
    // generic search with ?q=
    search = {
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
                term: { owner: req.session_state.userId || '' }
              }
            ]
          }
        }
      }
    };
  }

  if (typeof(req.query.owner) !== 'undefined') {
    if (req.query.owner === req.session_state.userId) {
      // owner requesting their XHRs and starred XHRs
      search = {
        query: {
          filtered: {
            filter: {
              or: [
                {
                  term: { owner: req.query.owner }
                },
                {
                  term: { stars: req.query.owner }
                }
              ]
            }
          }
        }
      };
    }
    else {
      // user viewing profile
      search = {
        query: {
          filtered: {
            filter: {
              and: [
                {
                  term: { isPublic: true }
                },
                {
                  term: { owner: req.query.owner }
                }
              ]
            }
          }
        }
      };
    }
  }

  client.search({
    index: index,
    type: type,
    body: search
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
  client.get({
    index: index,
    type: type,
    id: req.params.id
  }).then(function (body) {
    if (req.session_state.userId === body._source.owner) {
      // Found, delete it
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
    } else {
      // Found but the user is not the owner
      res.status(404);
      res.send('Not found');
    }
  }, function (error) {
    res.status(error.status);
    res.send(error);
  });
};

module.exports.star = function(req, res) {
  client.get({
    index: index,
    type: type,
    id: req.params.id
  }).then(function (body) {
    if (body._source.stars.indexOf(req.session_state.userId) === -1) {
      // Star it
      client.update({
        index: index,
        type: type,
        id: req.params.id,
        body: {
          script: 'ctx._source.stars += userId',
          params: { userId: req.session_state.userId }
        }
      })
      .then(function (body) {
        res.send(body);
      }, function (error) {
        res.status(error.status);
        res.send(error);
      });
    } else {
      // Found but the user has already starred it
      res.status(400);
      res.send('Already starred');
    }
  }, function (error) {
    res.status(error.status);
    res.send(error);
  });
};

module.exports.unstar = function(req, res) {
  client.get({
    index: index,
    type: type,
    id: req.params.id
  }).then(function (body) {
    if (body._source.stars.indexOf(req.session_state.userId) !== -1) {
      // Unstar it
      client.update({
        index: index,
        type: type,
        id: req.params.id,
        body: {
          script: 'ctx._source.stars.remove(userId)',
          params: { userId: req.session_state.userId }
        }
      })
      .then(function (body) {
        res.send(body);
      }, function (error) {
        res.status(error.status);
        res.send(error);
      });
    } else {
      // Found but the user hasn't starred it
      res.status(400);
      res.send('You haven\'t starred this');
    }
  }, function (error) {
    res.status(error.status);
    res.send(error);
  });
};
