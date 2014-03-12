// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';
var nconf         = require('nconf'),
    elasticsearch = require('elasticsearch'),
    shortId       = require('shortid'),
    index         = 'suri-ci',
    type          = 'user';

var client = elasticsearch.Client({
  host: nconf.get('BONSAI_URL')
});

// Create user
module.exports.createUser = function(user, callback) {
  var data = {
    googleIss: user.googleIss,
    googleSub: user.googleSub,
    id: user.id || shortId.generate(),
    displayName: user.displayName || ''
  };

  client.create({
    index: index,
    type: type,
    body: data
  }).then(function (body) {
    callback({ success: true, data: body });
  }, function (error) {
    callback({ success: false, data: error });
  });
};

// Get user with iss and sub
module.exports.getUserByIssAndSub = function(iss, sub, callback) {
};

// Get user by ID
module.exports.getUser = function(id, callback) {
  client.get({
    index: index,
    type: type,
    id: id
  }).then(function (body) {
    callback({ success: true, data: body });
  }, function (error) {
    callback({ success: false, data: error });
  });
};

// Set user display name
module.exports.updateDisplayName = function(id, displayName, callback) {
};

// Delete user
module.exports.delete = function(id, callback) {
  client.delete({
    index: index,
    type: type,
    id: id
  }).then(function (body) {
    callback({ success: true, data: body });
  }, function (error) {
    callback({ success: false, data: error });
  });
};
