// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';

var googleOAuth2 = require('./googleOAuth2'),
    clientId     = '838945892575-97eh2eka9prpaurmlibqft86if2r98cs.apps.googleusercontent.com',
    clientSecret = 'lrEzMLAc-JAnNr_Q-C3tbwxY';


function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

module.exports.login = function login(req, res) {
  // Redirect to Google for authentication
  //
  // Build the OAuth authorize URL. Google will redirect the user to the redirect_uri when they
  // grant access. The user isn't signed in at that point.
  //
  // 1. https://developers.google.com/accounts/docs/OAuth2Login#createxsrftoken
  // 2. https://developers.google.com/accounts/docs/OAuth2Login#sendauthrequest
  //
  // Generate an anti-forgery state token for the OAuth2 Login URL. This needs to be persisted and
  // checked in in the callback in step 2.

  req.session_state.antiForgeryStateToken = guid();

  var redirectUri = 'http://' + req.header('host') + '/oauth2callback';

  res.redirect('https://accounts.google.com/o/oauth2/auth' +
                '?scope=openid email' +
                '&state=' + req.session_state.antiForgeryStateToken +
                '&client_id=' + clientId +
                '&response_type=code' +
                '&redirect_uri=' + redirectUri);
};

module.exports.logout = function logout(req, res) {
  req.session_state.reset();
  res.redirect('/');
};

module.exports.oAuth2Callback = function oAuth2Callback(req, res) {

  // In the Google sign-on callback.
  //
  // The user has granted access to suri. Now we need to validate the anti-forgery state token from the
  // sign-on URL in part 1. If it matches we can exchange the code in the callback for an OAuth access_token
  // and OpenID Connect id_token. The id_token contains the user information we need to create a session.
  //
  // 3. https://developers.google.com/accounts/docs/OAuth2Login#confirmxsrftoken

  if (req.query.state !== req.session_state.antiForgeryStateToken) {
    // This is a forged request, don't authenticate
    res.redirect('/');
  }

  var redirectUri = 'http://' + req.header('host') + '/oauth2callback';

  // Exchange an OAuth2 one-time authorization code for an OpenID Connect id_token
  googleOAuth2.createOpenIdConnectTokens({
    clientId: clientId,
    clientSecret: clientSecret,
    code: req.query.code,
    redirectUri: redirectUri
  }, function(result) {

    if (result.success) {
      // Create a session
      //
      // 6. https://developers.google.com/accounts/docs/OAuth2Login#authuser
      req.session_state.iss = result.decoded_id_token.iss;
      req.session_state.sub = result.decoded_id_token.sub;
      req.session_state.email = result.decoded_id_token.email;
      req.session_state.exp = result.decoded_id_token.exp;
    } else {
      req.session_state.reset();
    }
    res.redirect('/');
  });
};
