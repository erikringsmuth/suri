// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define(function(require) {
  'use strict';

  var utilities = require('components/util/utilities'),
      router = require('router'),
      $ = require('jquery'),
      sessionStorageKey = 'suri-session',
      clientId = '838945892575-97eh2eka9prpaurmlibqft86if2r98cs.apps.googleusercontent.com',
      redirectUri = 'http://' + window.location.host + '/',
      desiredScope = 'openid email',
      responseType = 'code';

  // Get the session from localStorage
  var session = JSON.parse(window.localStorage.getItem(sessionStorageKey)) || {};


  // In the Google sign-on callback.
  //
  // The user has granted access to suri. Now we need to validate the anti-forgery state token from the
  // sign-on URL in part 1. If it matches we can exchange the code in the callback for an OAuth access_token
  // and OpenID Connect id_token. The id_token contains the user information we need to create a session.
  //
  // 3. https://developers.google.com/accounts/docs/OAuth2Login#confirmxsrftoken
  // 4. https://developers.google.com/accounts/docs/OAuth2Login#exchangecode
  //
  // The exchange is handled by the suri server. This keeps the client secret on the server.
  var routeArgs = router.routeArguments();
  if (routeArgs.code && routeArgs.state === session.state) {

    $.ajax('/oauth/token', {
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        code: routeArgs.code,
        redirectUri: redirectUri
      })
    })
      .done(function(data) {
        var response = JSON.parse(data);
        session.accessToken = response.access_token;
        session.tokenType = response.token_type;
        session.expiresIn = response.expires_in;
        session.idToken = response.id_token;
        session.decodedIdToken = response.decoded_id_token;

        // Persist the session to localStorage
        window.localStorage.setItem(sessionStorageKey, JSON.stringify(session));

        // TODO: remove debug code
        console.log(data);
        window.session = session;
      })
      .fail(function() {
        // TODO: remove debug code and replace with failed message
        console.log('authentication failed');
      });
  }


  // The Sign-On button URL is generated.
  //
  // Build the OAuth authorize URL for the Sign-On button. This is used in the layout template for the sign-on
  // button URL. The user will be directed to Google to sign-in. The Google will redirect the user to the
  // redirect_uri when they grant access. The user isn't signed in at that point.
  //
  // 1. https://developers.google.com/accounts/docs/OAuth2Login#createxsrftoken
  // 2. https://developers.google.com/accounts/docs/OAuth2Login#sendauthrequest
  //
  // Generate an anti-forgery state token for the OAuth2 Login URL. This needs to be persisted in localStorage
  // and checked in in the callback in step 2.
  session.state = utilities.guid();
  session.authUrl = 'https://accounts.google.com/o/oauth2/auth' +
                    '?scope=' + desiredScope +
                    '&state=' + session.state +
                    '&client_id=' + clientId +
                    '&response_type=' + responseType +
                    '&redirect_uri=' + redirectUri;

  // Persist the session to localStorage
  window.localStorage.setItem(sessionStorageKey, JSON.stringify(session));

  return session;
});
