// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';
var nconf         = require('nconf'),
    elasticsearch = require('elasticsearch'),
    shortId       = require('shortid'),
    index         = 'suri',
    type          = 'users';

var client = elasticsearch.Client({
  host: nconf.get('BONSAI_URL')
});

// Create user
module.exports.createUser = function(user, successCallback, errorCallback) {
  var data = {
    googleIss: user.googleIss,
    googleSub: user.googleSub,
    emailMd5: user.emailMd5,
    displayName: user.displayName || ''
  };

  client.create({
    index: index,
    type: type,
    id: shortId.generate(),
    body: data
  }).then(successCallback, errorCallback);
};

// Get user with iss and sub
module.exports.getGoogleUserByIssAndSub = function(iss, sub, successCallback, errorCallback) {
  client.search({
    index: index,
    type: type,
    body: {
      query: {
        bool: {
          must: [
            {
              term: { googleIss: iss }
            },
            {
              term: { googleSub: sub }
            }
          ]
        }
      }
    }
  }).then(function (body) {
    var user = body.hits.hits[0];
    if (user) {
      user._source.userId = user._id;
      successCallback(user._source);
    } else {
      errorCallback('User not found.');
    }
  }, errorCallback);
};

// Get user by userId
module.exports.getUserById = function(userId, successCallback, errorCallback) {
  client.get({
    index: index,
    type: type,
    id: userId
  }).then(function (body) {
    successCallback(body._source);
  }, function () {
    errorCallback('User not found.');
  });
};

// Get user profile
module.exports.getProfile = function(req, res) {
  client.get({
    index: index,
    type: type,
    id: req.params.id
  }).then(function (body) {
    res.send({
      userId: body._id,
      emailMd5: body._source.emailMd5,
      displayName: body._source.displayName
    });
  }, function () {
    res.status(404);
    res.send('Not found');
  });
};

// Set user display name
module.exports.updateDisplayName = function(id, displayName, successCallback, errorCallback) {
  client.update({
    index: index,
    type: type,
    id: id,
    body: {
      doc: {
        displayName: displayName
      }
    }
  }).then(successCallback, errorCallback);
};
