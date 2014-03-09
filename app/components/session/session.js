// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define(function(require) {
  'use strict';
  var utilities = require('components/util/utilities'),
      router = require('router'),
      $ = require('jquery');

  var sessionStorageKey = 'suri-session',
      clientId = '5ebc434bdfbe5f335ba1',
      redirectUri = 'http://www.suri.io/',
      scope = 'user:email';

  // Get the session from localStorage
  var session = JSON.parse(window.localStorage.getItem(sessionStorageKey)) || {};
  session.clientId = clientId;
  session.scope = scope;

  // Check if this is a OAuth 'GET https://github.com/login/oauth/authorize' callback before setting a new session state
  var routeArgs = router.routeArguments();

  // POST /authenticate
  // which calls
  // POST https://github.com/login/oauth/access_token
  if (routeArgs.code && routeArgs.state === session.state) {
    session.code = routeArgs.code;
    $.ajax('/authenticate', {
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(session)
    })
      .done(function(data) {
        var response = JSON.parse(data);
        session.accessToken = response.access_token;
        session.tokenType = response.token_type;
        session.scope = response.scope;

        // Persist the session to localStorage
        window.localStorage.setItem(sessionStorageKey, JSON.stringify(session));

        console.log(data);
      })
      .fail(function() {
        console.log('authentication failed');
      });
  }

  session.state = utilities.guid(); // Give the session a new state

  // Persist the session to localStorage
  window.localStorage.setItem(sessionStorageKey, JSON.stringify(session));

  // Build the OAuth authorize URL for the Sign-On button
  session.authUrl = 'https://github.com/login/oauth/authorize?scope=' + session.scope + '&state=' + session.state + '&client_id=' + session.clientId + '&redirect_uri=' + redirectUri;

  return session;
});
