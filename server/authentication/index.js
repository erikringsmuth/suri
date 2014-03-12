// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';

var nconf        = require('nconf'),
    googleOAuth2 = require('./googleOAuth2'),
    crypto       = require('crypto'),
    clientId     = nconf.get('CLIENT_ID'),
    clientSecret = nconf.get('CLIENT_SECRET');


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
  // checked in in the callback in step 3.

  req.session_state.xsrfToken = guid();

  var redirectUri = 'http://' + req.header('host') + '/oauth2callback';

  res.redirect('https://accounts.google.com/o/oauth2/auth' +
                '?scope=openid email' +
                '&state=' + req.session_state.xsrfToken +
                '&client_id=' + clientId +
                '&response_type=code' +
                '&redirect_uri=' + redirectUri);
};

module.exports.logout = function logout(req, res) {
  req.session_state.reset();
  req.session_state.signedIn = false;
  req.session_state.authenticationMessage = 'Signed out.';
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

  if (req.query.state !== req.session_state.xsrfToken) {
    // This is a forged request, don't authenticate
    req.session_state.signedIn = false;
    req.session_state.authenticationMessage = 'Authentication failed. The anti-forgery state token was forged.';
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
      req.session_state.signedIn = true;
      req.session_state.authenticationMessage = 'Signed in.';
      req.session_state.emailMd5 = crypto.createHash('md5').update(req.session_state.email || '').digest('hex');
    } else {
      req.session_state.reset();
      req.session_state.signedIn = false;
      req.session_state.authenticationMessage = result.message;
    }
    res.redirect('/');
  });
};
