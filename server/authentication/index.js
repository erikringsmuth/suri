// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';

var https = require('https');
var clientId = '838945892575-97eh2eka9prpaurmlibqft86if2r98cs.apps.googleusercontent.com';
var clientSecret = 'lrEzMLAc-JAnNr_Q-C3tbwxY';

module.exports.authenticate = function authenticate(req, res) {
  // POST https://accounts.google.com/o/oauth2/token
  var authRequest = https.request({
    hostname: 'accounts.google.com',
    path: '/o/oauth2/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }, function(authResponse) {
    authResponse.on('data', function (chunk) {
      res.write(chunk, 'binary');
    });
    authResponse.on('end', function () {
      res.end();
    });
  });

  var body = 'client_id=' + clientId +
              '&client_secret=' + clientSecret +
              '&code=' + req.body.code +
              '&grant_type=authorization_code' +
              '&redirect_uri=' + req.body.redirectUri;

  authRequest.write(body);

  // authRequest.write(JSON.stringify({
  //   client_id: clientId,
  //   client_secret: clientSecret,
  //   code: req.body.code,
  //   grant_type: 'authorization_code',
  //   redirect_uri: req.body.redirectUri
  // }));

  authRequest.end();

  authRequest.on('error', function(e) {
    res.end(e);
  });
};
