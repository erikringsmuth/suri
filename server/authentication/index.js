// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';

var nconf        = require('nconf'),
    googleOAuth2 = require('./googleOAuth2'),
    crypto       = require('crypto'),
    userService  = require('../userService'),
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


// The iss and sub must be set when this is called
var getUsersGoogleProfile = function getUsersGoogleProfile(session_state, callback) {
  userService.getGoogleUserByIssAndSub(session_state.googleIss, session_state.googleSub, function(userResult) {
    if (userResult.success) {

      // Found user
      callback({ success: true, data: { userId: userResult.data._id, displayName: userResult.data._source.displayName } });

    } else {

      // Need to create a new user
      var displayName = session_state.email.split('@')[0];
      userService.createUser({
        googleIss: session_state.googleIss,
        googleSub: session_state.googleSub,
        googleEmailMd5: session_state.emailMd5,
        displayName: displayName
      }, function(createUserResult) {
        if (createUserResult.success) {

          // User created
          callback({ success: true, data: { userId: createUserResult.data._id, displayName: displayName } });
        } else {

          // Failed to create user
          callback(createUserResult);
        }
      });
    }
  });
};


var resetSession = function resetSession(session_state, message) {
  session_state.reset();
  session_state.signedIn = false;
  session_state.authenticationMessage = message;
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

  var redirectUri = 'http://' + req.header('host') + '/oauth2callback';

  // Exchange an OAuth2 one-time authorization code for an OpenID Connect id_token
  googleOAuth2.createOpenIdConnectTokens({
    clientId: clientId,
    clientSecret: clientSecret,
    code: req.query.code,
    redirectUri: redirectUri
  }, function(oauthResult) {

    if (!oauthResult.success) {
      resetSession(req.session_state, oauthResult.message);
      res.redirect('/');
    }

    // Create a session
    //
    // 6. https://developers.google.com/accounts/docs/OAuth2Login#authuser
    req.session_state.googleIss = oauthResult.decoded_id_token.iss;
    req.session_state.googleSub = oauthResult.decoded_id_token.sub;
    req.session_state.email = oauthResult.decoded_id_token.email;
    req.session_state.emailMd5 = crypto.createHash('md5').update(req.session_state.email || '').digest('hex');
    req.session_state.exp = oauthResult.decoded_id_token.exp;
    req.session_state.signedIn = true;
    req.session_state.authenticationMessage = 'Signed in.';

    getUsersGoogleProfile(req.session_state, function(userProfileResult) {
      if (userProfileResult.success) {
        req.session_state.userId = userProfileResult.data.userId;
        req.session_state.displayName = userProfileResult.data.displayName;
      } else {
        resetSession(req.session_state, 'Failed to create user profile.');
      }
      res.redirect('/');
    });
  });
};
