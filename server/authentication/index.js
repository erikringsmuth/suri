// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';

var googleOAuth2 = require('./googleOAuth2'),
    clientId = '838945892575-97eh2eka9prpaurmlibqft86if2r98cs.apps.googleusercontent.com',
    clientSecret = 'lrEzMLAc-JAnNr_Q-C3tbwxY';


module.exports.createOAuthToken = function createOAuthToken(req, res) {

  // Exchange an OAuth2 one-time authorization code for an OpenID Connect id_token
  googleOAuth2.createOAuthToken({
    clientId: clientId,
    clientSecret: clientSecret,
    code: req.body.code,
    redirectUri: req.body.redirectUri
  }, function(result) {
    // Create a suri session for the user
    //
    // 6. https://developers.google.com/accounts/docs/OAuth2Login#authuser
    //
    // TODO: ???

    if (result.success) {
      res.send(result.status, JSON.stringify({ token: result.token, decodedIdToken: result.decodedIdToken }));
    } else {
      res.send(result.status, result.message);
    }
  });

};
