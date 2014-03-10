// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';

var https = require('https'),
    jwt = require('jwt-simple'),
    clientId = '838945892575-97eh2eka9prpaurmlibqft86if2r98cs.apps.googleusercontent.com',
    clientSecret = 'lrEzMLAc-JAnNr_Q-C3tbwxY';

module.exports.createOAuthToken = function createOAuthToken(req, res) {

  // The user has granted access to suri from Google and the callback returned a one-time authorization
  // code. We need to exchange the code for an OAuth access_token and OpenID Connect id_token.
  //
  // 4. https://developers.google.com/accounts/docs/OAuth2Login#exchangecode
  //
  // POST https://accounts.google.com/o/oauth2/token
  var requestOptions = {
    hostname: 'accounts.google.com',
    path: '/o/oauth2/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  var requestBody = 'client_id=' + clientId +
                    '&client_secret=' + clientSecret +
                    '&code=' + req.body.code +
                    '&grant_type=authorization_code' +
                    '&redirect_uri=' + req.body.redirectUri;

  var accessTokenRequest = https.request(requestOptions, function(authResponse) {

    var responseText = '';

    authResponse.on('data', function (chunk) {
      responseText = responseText + chunk;
    });

    authResponse.on('end', function () {
      // Obtain user information from the ID token
      //
      // 5. https://developers.google.com/accounts/docs/OAuth2Login#obtainuserinfo
      var responseJson = JSON.parse(responseText);

      // TODO: delete
      //var idTokenParts = responseJson.id_token.split('.');
      // responseJson.header = JSON.parse(new Buffer(idTokenParts[0], 'base64').toString('ascii'));
      // responseJson.payload = JSON.parse(new Buffer(idTokenParts[1], 'base64').toString('ascii'));
      // responseJson.signature = new Buffer(idTokenParts[2], 'base64').toString('ascii');

      responseJson.decoded_id_token = jwt.decode(responseJson.id_token, {}, true);

      // Validate that the aud (audience) is the client ID for suri
      if (responseJson.decoded_id_token.aud !== clientId) {
        res.send(401, { message: 'Authentication failed. The id_token.aud does not match the client ID.' });
      }

      // Create a suri session for the user
      //
      // 6. https://developers.google.com/accounts/docs/OAuth2Login#authuser
      //
      // TODO: ???

      res.send(201, JSON.stringify(responseJson));
    });
  });

  accessTokenRequest.write(requestBody);
  accessTokenRequest.end();

  accessTokenRequest.on('error', function(e) {
    res.send(401, e);
  });

};
