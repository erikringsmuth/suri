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
  }).then(function (body) {
    callback({ success: true, data: body });
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
      user._source.userId = user._id;
      callback({ success: true, data: user._source });
    } else {
      callback({ success: false, data: 'User not found.' });
    }
  }, function (error) {
    callback({ success: false, data: error });
  });
};

// Get user by userId
module.exports.getUserById = function(userId, callback) {
  client.get({
    index: index,
    type: type,
    id: userId
  }).then(function (body) {
    callback({ success: true, data: body._source });
  }, function () {
    callback({ success: false, data: 'User not found.' });
  });
};

// Get user profile
module.exports.getProfile = function(req, res) {
  client.get({
    index: index,
    type: type,
    id: req.params.id
  }).then(function (body) {
    var user = body._source;
    res.send({
      userId: req.params.id,
      emailMd5: user._source.emailMd5,
      displayName: user._source.displayName
    });
  }, function () {
    res.status(404);
    res.send('Not found');
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
