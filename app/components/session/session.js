// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define(function(require) {
  'use strict';
  var utilities = require('components/util/utilities');
  var sessionStorageKey = 'suri-session';

  var session = JSON.parse(window.localStorage.getItem(sessionStorageKey)) || {};
  session.clientId = '5ebc434bdfbe5f335ba1';
  session.scope = 'user:email';
  if (!session.state) session.state = utilities.guid();
  window.localStorage.setItem(sessionStorageKey, JSON.stringify(session));

  session.authUrl = 'https://github.com/login/oauth/authorize?scope=' + session.scope + '&state=' + session.state + '&client_id=' + session.clientId + '&redirect_uri=http://www.suri.io/';

  return session;
});
