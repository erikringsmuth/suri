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
module.exports.createUser = function(user, callback) {
  var data = {
    userId: shortId.generate(),
    googleIss: user.googleIss,
    googleSub: user.googleSub,
    emailMd5: user.emailMd5,
    displayName: user.displayName || ''
  };

  client.create({
    index: index,
    type: type,
    body: data
  }).then(function (body) {
    callback({ success: true, data: data });
  }, function (error) {
    callback({ success: false, data: error });
  });
};

// Get user with iss and sub
module.exports.getGoogleUserByIssAndSub = function(iss, sub, callback) {
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
      callback({ success: true, data: user });
    } else {
      callback({ success: false, data: 'User not found.' });
    }
  }, function (error) {
    callback({ success: false, data: error });
  });
};

// Get user by userId
module.exports.getUserById = function(userId, callback) {
  client.search({
    index: index,
    type: type,
    body: {
      query: {
        term: { userId: userId }
      }
    }
  }).then(function (body) {
    var user = body.hits.hits[0];
    if (user) {
      callback({ success: true, data: user });
    } else {
      callback({ success: false, data: 'User not found.' });
    }
  }, function (error) {
    callback({ success: false, data: error });
  });
};

// Set user display name
module.exports.updateDisplayName = function(id, displayName, callback) {
  client.update({
    index: index,
    type: type,
    id: id,
    body: {
      doc: {
        displayName: displayName
      }
    }
  }).then(function (body) {
    callback({ success: true, data: body });
  }, function (error) {
    callback({ success: false, data: error });
  });
};
