// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';

var https = require('https');
var clientId = '5ebc434bdfbe5f335ba1';
var clientSecret = '68d93781f6b0e4e9cd2bbcb77b9b9e983cdbeea8';
var redirectUri = 'http://www.suri.io/';

module.exports.authenticate = function authenticate(req, res) {
  // POST https://github.com/login/oauth/access_token
  var authRequest = https.request({
    hostname: 'github.com',
    path: '/login/oauth/access_token?client_id=' + clientId + '&client_secret=' + clientSecret + '&code=' + req.body.code + '&redirect_uri=' + redirectUri,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }, function(authResponse) {
    authResponse.on('data', function (chunk) {
      res.write(chunk, 'binary');
    });
    authResponse.on('end', function () {
      res.end();
    });
  });

  authRequest.end();

  authRequest.on('error', function(e) {
    res.end(e);
  });
};
