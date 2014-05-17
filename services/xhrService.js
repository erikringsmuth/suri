// Copyright (C) 2014 Erik Ringsmuth - MIT license
'use strict';
var nconf         = require('nconf'),
    elasticsearch = require('elasticsearch'),
    shortId       = require('shortid'),
    Q             = require('q');

var client = elasticsearch.Client({
  host: nconf.get('ELASTICSEARCH_URL')
});

var index = nconf.get('XHR_INDEX');
var type = nconf.get('XHR_TYPE');

module.exports.create = function(xhr, userId, emailMd5) {
  var deferred = Q.defer();

  var id = shortId.generate();
  var newXhr = {
    name: xhr.name,
    method: xhr.method,
    url: xhr.url,
    headers: xhr.headers,
    headerOptions: xhr.headerOptions,
    queryParameterOptions: xhr.queryParameterOptions,
    body: xhr.body,
    corsEnabled: xhr.corsEnabled,
    info: xhr.info,
    callCount: 0,
    isPublic: xhr.isPublic,
    depricated: xhr.depricated,
    tags: xhr.tags,
    stars: [],
    owner: userId,
    ownerMd5: emailMd5,
    forks: [],
    forkedFrom: xhr.forkedFrom
  };

  client
    .create({
      index: index,
      type: type,
      id: id,
      body: newXhr
    })
    .then(deferred.resolve, deferred.reject);

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

  return deferred.promise;
};

module.exports.get = function(id, userId) {
  var deferred = Q.defer();

  client
    .get({
      index: index,
      type: type,
      id: id
    })
    .then(function (body) {
      // Verify the user has permission to read this XHR
      if (body._source.isPublic || userId === body._source.owner) {
        body._source.id = body._id;
        deferred.resolve(body._source);
      } else {
        deferred.reject({
          status: 404,
          message: 'Not found'
        });
      }
    }, function () {
      deferred.reject({
        status: 500,
        message: 'Failed to look up XHR in elasticsearch'
      });
    });

  return deferred.promise;
};

module.exports.update = function(id, xhr, userId) {
  var deferred = Q.defer();

  client
    .get({
      index: index,
      type: type,
      id: id
    })
    .then(function (body) {
      if (body._source && body._source.owner === userId) {

        // Update request by the owner, OK
        var updatedXhr = {
          name: xhr.name,
          method: xhr.method,
          url: xhr.url,
          headers: xhr.headers,
          headerOptions: xhr.headerOptions,
          queryParameterOptions: xhr.queryParameterOptions,
          body: xhr.body,
          corsEnabled: xhr.corsEnabled,
          info: xhr.info,
          isPublic: xhr.isPublic,
          depricated: xhr.depricated,
          tags: xhr.tags
        };
        client
          .update({
            index: index,
            type: type,
            id: id,
            body: {
              doc: updatedXhr
            }
          })
          .then(deferred.resolve, deferred.reject);

      } else {

        // Not the owner
        deferred.reject({
          status: 401,
          message: 'You have to be the owner to update an XHR'
        });
      }
    }, deferred.reject);

  return deferred.promise;
};

module.exports.incrementCallCount = function(xhrId) {
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
};

module.exports.delete = function(id, userId) {
  var deferred = Q.defer();

  client
    .get({
      index: index,
      type: type,
      id: id
    })
    .then(function (body) {
      if (userId === body._source.owner) {
        // Found, delete it
        client
          .delete({
            index: index,
            type: type,
            id: id
          })
          .then(deferred.resolve, deferred.reject);
      } else {
        // Found but the user is not the owner
        deferred.reject({
          status: 401,
          message: 'You have to be the owner to delete an XHR'
        });
      }
    }, function () {
      deferred.reject({
        status: 404,
        message: 'Not found'
      });
    });

  return deferred.promise;
};

module.exports.star = function(id, userId) {
  var deferred = Q.defer();

  client
    .get({
      index: index,
      type: type,
      id: id
    })
    .then(function (body) {
      if (body._source.stars.indexOf(userId) === -1) {
        // Star it
        client
          .update({
            index: index,
            type: type,
            id: id,
            body: {
              script: 'starxhr',
              params: { userId: userId }
            }
          })
          .then(deferred.resolve, deferred.reject);
      } else {
        // Found but the user has already starred it
        deferred.reject({
          status: 400,
          message: 'Already starred'
        });
      }
    }, deferred.reject);

  return deferred.promise;
};

module.exports.unstar = function(id, userId) {
  var deferred = Q.defer();

  client
    .get({
      index: index,
      type: type,
      id: id
    })
    .then(function (body) {
      if (body._source.stars.indexOf(userId) !== -1) {
        // Unstar it
        client
          .update({
            index: index,
            type: type,
            id: id,
            body: {
              script: 'unstarxhr',
              params: { userId: userId }
            }
          })
          .then(deferred.resolve, deferred.reject);
      } else {
        // Found but the user hasn't starred it
        deferred.reject({
          status: 400,
          message: 'You haven\'t starred this'
        });
      }
    }, deferred.reject);

  return deferred.promise;
};
