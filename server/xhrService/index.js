// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';
var nconf         = require('nconf'),
    elasticsearch = require('elasticsearch'),
    shortId       = require('shortid');

var client = elasticsearch.Client({
  host: nconf.get('ELASTICSEARCH_URL')
});

var index = nconf.get('XHR_INDEX');
var type = nconf.get('XHR_TYPE');

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
      headerOptions: req.body.headerOptions,
      queryParameterOptions: req.body.queryParameterOptions,
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
          script: 'forkxhr',
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
        headerOptions: req.body.headerOptions,
        queryParameterOptions: req.body.queryParameterOptions,
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
  var search = {
    query: {
      filtered: {}
    }
  };

  // Start by defining the filter. The filter is positive. Results that match
  // the
  if (typeof(req.query.owner) === 'undefined') {
    // No owner specified, search for all items or items you own
    search.query.filtered.filter = {
      or: [
        { term: { isPublic: true } },
        { term: { owner: req.session_state.userId || '' } }
      ]
    };
  }
  else {
    // Owner specified
    if (req.query.owner === req.session_state.userId) {
      // Owner requesting their XHRs and starred XHRs
      search.query.filtered.filter = {
        or: [
          { term: { owner: req.query.owner } },
          { term: { stars: req.query.owner } }
        ]
      };
    }
    else {
      // User viewing someone else's profile
      search.query.filtered.filter = {
        and: [
          { term: { isPublic: true } },
          { term: { owner: req.query.owner } }
        ]
      };
    }
  }

  // Include the query if it's specified
  if (req.query.q) {
    search.query.filtered.query = {
      bool: {
        should: [
          { prefix: { name: req.query.q } },
          { simple_query_string: { query: req.query.q } }
        ]
      }
    };
  }
  else if (req.query.tags) {
    search.query.filtered.query = {
      terms: {
        tags: req.query.tags.split(',')
      }
    };
  }

  // Sort the response by number of stars and call count
  search.sort = [
    {
      starCount: {
        mode: 'max',
        order: 'desc'
      }
    },
    {
      callCount: {
        mode: 'max',
        order: 'desc'
      }
    },
    '_score'
  ];

  // Pagination
  var from = 0;
  var size = 10;
  if (req.query.from) {
    from = parseInt(req.query.from);
    search.from = from;
  }
  if (req.query.size) {
    size = parseInt(req.query.size);
    search.size = size;
  }

  client.search({
    index: index,
    type: type,
    body: search
  }).then(function (body) {
    // Map the response to an array with the _source field plus the ID
    var hits = body.hits.hits.map(function(result) {
      result._source.id = result._id;
      return result._source;
    });
    res.send({
      from: from,
      to: from + hits.length - 1,
      of: body.hits.total,
      page: Math.floor(from / size) + 1,
      hits: hits
    });
  }, function (error) {
    res.status(error.status);
    res.send(error);
  });
};

module.exports.tagsAggregation = function(req, res) {
  // fitler isPublic, start count gte 1
  var body = {
    filter: { term: { isPublic: true } },
    aggregations: {
      tags: { terms: { field: 'tags' } }
    }
  };

  client.search({
    index: index,
    type: type,
    body: body
  }).then(function (body) {
    res.send(body.aggregations);
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
        script: 'incrementxhrcallcount',
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
          script: 'starxhr',
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
          script: 'unstarxhr',
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
