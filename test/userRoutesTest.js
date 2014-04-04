// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
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


describe('userRoutes.getProfile(req, res)', function () {
  it('should call userServices.getProfile(id)');
});


describe('userRoutes.updateDisplayName(req, res)', function () {
  it('should return a 401 if the user is trying to change someone else\'s display name');
  it('should call userServices.updateDisplayName(userId, displayName)');
  it('should set the session displayName if the elasticsearch request succeeds');
  it('should return the updated displayName on success');
});
