// Copyright (C) 2014 Erik Ringsmuth - MIT license
'use strict';
var chai    = require('chai');
    // sinon   = require('sinon'),
    // injectr = require('injectr'),
    // Q       = require('q'),
    // expect  = chai.expect;

// configure chai
// jshint expr:true
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));


describe('authentication.resetSession(session_state, message)', function () {
  it('should reset the session state variables stored in the client session');
});


describe('authentication.login(req, res)', function () {
  it('should redirect the browser to the Google OAuth2 authentication endpoint');
});


describe('authentication.logout(req, res)', function () {
  it('should reset the session state and redirect to the root `/` route');
});


describe('authentication.oAuth2Callback(req, res)', function () {
  it('should validate the cross-site forgery request token');
  it('should handle authentication denied (error response)');
  it('should call google to create the OpenID Connect id_token once authorization is granted');
  it('should store the id_token information in the client session');
  it('should get or create the user profile');
  it('should store the user profile information in the client session');
  it('should reset the session state if finding the profile fails');
});
