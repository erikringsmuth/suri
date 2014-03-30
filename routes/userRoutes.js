// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';
var userService = require('../services/userService');

// Get user profile
module.exports.getProfile = function(req, res) {
  userService
    .getProfile(req.params.id)
    .then(function (profile) {
      res.send(profile);
    })
    .fail(function (error) {
      res.status(error.status);
      res.send(error);
    });
};

// Set user display name
module.exports.updateDisplayName = function(req, res) {
  if (req.params.id !== req.session_state.userId) {
    res.status(401);
    res.send('Unauthorized. You can only change your own display name.');
    return;
  }

  userService
    .updateDisplayName(req.session_state.userId, req.body.displayName)
    .then(function () {
      req.session_state.displayName = req.body.displayName;
      res.send(req.body);
    })
    .fail(function (error) {
      res.status(error.status);
      res.send(error);
    });
};
