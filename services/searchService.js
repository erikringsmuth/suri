// Copyright (C) 2014 Erik Ringsmuth - MIT license
'use strict';
var nconf         = require('nconf'),
    elasticsearch = require('elasticsearch'),
    Q             = require('q');

var client = elasticsearch.Client({
  host: nconf.get('ELASTICSEARCH_URL')
});

var index = nconf.get('XHR_INDEX');
var type = nconf.get('XHR_TYPE');

module.exports.search = function(q, tags, owner, userId, from, size) {
  var deferred = Q.defer();

  if (typeof from === 'undefined') {
    from = 1;
  } else if (typeof from === 'string') {
    from = parseInt(from);
  }
  if (typeof size === 'undefined') {
    size = 10;
  } else if (typeof size === 'string') {
    size = parseInt(size);
  }

  // Base search used for all searches
  var search = {
    query: {
      filtered: {}
    },
    from: from - 1,
    size: size,
    sort: [
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
    ],
    highlight: {
      fields: {
        name: {}
      },
      pre_tags: ['<strong>'],
      post_tags: ['</strong>']
    }
  };

  // Defining the filter. The filter is positive. Results that match the filter are returned.
  // An 'or' filter returns items that match either. An 'and' filter returns items that match
  // both.
  if (typeof owner === 'undefined') {
    // No owner specified, search for all public items and items you own
    search.query.filtered.filter = {
      or: [
        { term: { isPublic: true } },
        { term: { owner: userId || '' } }
      ]
    };
  }
  else {
    // Owner specified
    if (owner === userId) {
      // Owner requesting their XHRs and starred XHRs
      search.query.filtered.filter = {
        or: [
          { term: { owner: owner } },
          { term: { stars: owner } }
        ]
      };
    }
    else {
      // User viewing someone else's profile
      search.query.filtered.filter = {
        and: [
          { term: { isPublic: true } },
          { term: { owner: owner } }
        ]
      };
    }
  }

  // Include the query if it's specified
  if (q) {
    search.query.filtered.query = {
      bool: {
        should: [
          { prefix: { name: q } },
          { simple_query_string: { query: q } }
        ]
      }
    };
  }
  else if (tags) {
    search.query.filtered.query = {
      terms: {
        tags: tags.split(',')
      }
    };
  }

  client
    .search({
      index: index,
      type: type,
      body: search
    })
    .then(function (body) {
      // Map the response to an array with the _source field plus the ID
      var hits = body.hits.hits.map(function(result) {
        result._source.id = result._id;
        if (typeof result.highlight !== 'undefined' && typeof result.highlight.name !== 'undefined') {
          result._source.highlightedName = result.highlight.name[0];
        }
        return result._source;
      });

      deferred.resolve({
        from: from,
        to: hits.length === 0 ? from : from + hits.length - 1,
        of: body.hits.total,
        page: Math.floor(from / size) + 1,
        hits: hits
      });
    }, deferred.reject);

  return deferred.promise;
};

module.exports.tagsAggregation = function() {
  var deferred = Q.defer();

  // fitler isPublic, start count gte 1
  var body = {
    filter: { term: { isPublic: true } },
    aggregations: {
      tags: { terms: { field: 'tags' } }
    }
  };

  client
    .search({
      index: index,
      type: type,
      body: body
    })
    .then(function (body) {
      deferred.resolve(body.aggregations);
    }, deferred.reject);

  return deferred.promise;
};
