// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';

var https = require('https');

// The API proxy forwards requests to the 'api-host' header
module.exports = function authenticate(req, res, next) {
  if (req.query.code && req.query.state) {
    // Redirected from 'GET https://github.com/login/oauth/authorize'

    // POST https://github.com/login/oauth/access_token
    var authRequest = https.request({
      hostname: 'github.com',
      path: '/login/oauth/access_token?client_id=5ebc434bdfbe5f335ba1&client_secret=68d93781f6b0e4e9cd2bbcb77b9b9e983cdbeea8&code=' + req.query.code + '&redirect_uri=http://www.suri.io/',
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

  } else {
    next();
  }
};
