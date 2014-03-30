// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';
var nconf         = require('nconf'),
    elasticsearch = require('elasticsearch'),
    shortId       = require('shortid'),
    Q             = require('q');

var client = elasticsearch.Client({
  host: nconf.get('ELASTICSEARCH_URL')
});

var index = nconf.get('USER_INDEX');
var type = nconf.get('USER_TYPE');

// Create user
module.exports.createUser = function(user) {
  var data = {
    googleIss: user.googleIss,
    googleSub: user.googleSub,
    emailMd5: user.emailMd5,
    displayName: user.displayName || ''
  };

  // It's a promise
  return client.create({
    index: index,
    type: type,
    id: shortId.generate(),
    body: data
  });
};

// Get user with iss and sub
module.exports.getGoogleUserByIssAndSub = function(iss, sub) {
  var deferred = Q.defer();

  client
    .search({
      index: index,
      type: type,
      body: {
        query: {
          filtered: {
            filter: {
              and: [
                { term: { googleIss: iss } },
                { term: { googleSub: sub } }
              ]
            }
          }
        }
      }
    })
    .then(function (body) {
      var user = body.hits.hits[0];
      if (user) {
        user._source.userId = user._id;
        deferred.resolve(user._source);
      } else {
        deferred.reject('User not found.');
      }
    }, deferred.reject);

  return deferred.promise;
};

// Get user profile
module.exports.getProfile = function(id) {
  var deferred = Q.defer();

  client
    .get({
      index: index,
      type: type,
      id: id
    })
    .then(function (body) {
      deferred.resolve({
        userId: body._id,
        emailMd5: body._source.emailMd5,
        displayName: body._source.displayName
      });
    }, function () {
      deferred.reject({
        status: 404,
        message: 'Not found'
      });
    });

  return deferred.promise;
};

// The iss and sub must be set when this is called
module.exports.getOrCreateUserProfile = function(options) {
  var deferred = Q.defer();

  module.exports
    .getGoogleUserByIssAndSub(options.googleIss, options.googleSub)
    .then(deferred.resolve)
    .fail(function() {
      // Didn't find an existing user, create a new user
      var user = {
        googleIss: options.googleIss,
        googleSub: options.googleSub,
        emailMd5: options.emailMd5,
        displayName: options.email.split('@')[0]
      };
      module.exports
        .createUser(user)
        .then(function(body) {
          // User created, return the user
          user.userId = body._id;
          deferred.resolve(user);
        })
        .fail(deferred.reject);
    });

  return deferred.promise;
};

// Set user display name
module.exports.updateDisplayName = function(userId, displayName) {
  var deferred = Q.defer();

  if (typeof(displayName) !== 'string') {
    deferred.reject({
      status: 400,
      message: 'The display name must be a string'
    });
  }
  else if (displayName.length > 30) {
    deferred.reject({
      status: 400,
      message: 'The display name is a maximum of 30 characters'
    });
  }
  else {
    client
      .update({
        index: index,
        type: type,
        id: userId,
        body: {
          doc: {
            displayName: displayName
          }
        }
      })
      .then(function () {
        deferred.resolve({
          displayName: displayName
        });
      }, function () {
        deferred.reject({
          status: 500,
          message: 'Failed to update display name'
        });
      });
  }

  return deferred.promise;
};
