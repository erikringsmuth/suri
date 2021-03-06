// Copyright (C) 2014 Erik Ringsmuth - MIT license
'use strict';

var nconf        = require('nconf'),
    googleOAuth2 = require('../services/googleOAuth2'),
    crypto       = require('crypto'),
    userService  = require('../services/userService'),
    guid         = require('../utilities/guid'),
    clientId     = nconf.get('CLIENT_ID'),
    clientSecret = nconf.get('CLIENT_SECRET');


var resetSession = function resetSession(session_state, message) {
  session_state.reset();
  session_state.signedIn = false;
  session_state.authenticationMessage = message;
};

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
  resetSession(req.session_state, 'Signed out.');
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
    resetSession(req.session_state, 'Authentication failed. The anti-forgery state token was forged.');
    res.redirect('/');
  }
  if (req.query.error) {
    resetSession(req.session_state, 'Authentication denied.');
    res.redirect('/');
  }

  var redirectUri = 'http://' + req.header('host') + '/oauth2callback';

  // Exchange an OAuth2 one-time authorization code for an OpenID Connect id_token
  googleOAuth2
    .createOpenIdConnectTokens({
      clientId: clientId,
      clientSecret: clientSecret,
      code: req.query.code,
      redirectUri: redirectUri
    })
    .then(function(oauthResult) {
      // Create a session
      //
      // 6. https://developers.google.com/accounts/docs/OAuth2Login#authuser
      req.session_state.email = oauthResult.decoded_id_token.email;
      req.session_state.emailMd5 = crypto.createHash('md5').update(req.session_state.email || '').digest('hex');
      req.session_state.signedIn = true;
      req.session_state.authenticationMessage = 'Signed in.';

      userService
        .getOrCreateUserProfile({
          googleIss: oauthResult.decoded_id_token.iss,
          googleSub: oauthResult.decoded_id_token.sub,
          email: req.session_state.email,
          emailMd5: req.session_state.emailMd5
        })
        .then(function(userProfileResult) {
          req.session_state.userId = userProfileResult.userId;
          req.session_state.displayName = userProfileResult.displayName;
          res.redirect('/');
        })
        .fail(function() {
          resetSession(req.session_state, 'Failed to create user profile.');
          res.redirect('/');
        });
    })
    .fail(function(error) {
      resetSession(req.session_state, error);
      res.redirect('/');
    });
};
