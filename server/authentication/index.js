// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';

var googleOAuth2 = require('./googleOAuth2'),
    clientId = '838945892575-97eh2eka9prpaurmlibqft86if2r98cs.apps.googleusercontent.com',
    clientSecret = 'lrEzMLAc-JAnNr_Q-C3tbwxY';


module.exports.createOAuthTokens = function createOAuthTokens(req, res) {

  // Exchange an OAuth2 one-time authorization code for an OpenID Connect id_token
  googleOAuth2.createOpenIdConnectTokens({
    clientId: clientId,
    clientSecret: clientSecret,
    code: req.body.code,
    redirectUri: req.body.redirectUri
  }, function(result) {

    if (result.success) {
      // Create a session
      // 6. https://developers.google.com/accounts/docs/OAuth2Login#authuser
      res.send(201, JSON.stringify({ tokens: result.tokens, decoded_id_token: result.decoded_id_token }));
    } else {
      res.send(401, result.message);
    }

  });
};
