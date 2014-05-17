// Copyright (C) 2014 Erik Ringsmuth - MIT license
'use strict';
var chai    = require('chai'),
    sinon   = require('sinon'),
    injectr = require('injectr');
    // Q       = require('q'),
    // expect  = chai.expect;

// configure chai
// jshint expr:true
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));


// set up the xhrService and stub it's dependencies
var xhrService, client;

beforeEach(function() {
  client = {};
  xhrService = injectr('services/xhrService.js', {
    // stub elasticsearch module
    'elasticsearch': {
      Client: sinon.stub().returns(client)
    }
  });
});


describe('xhrService.create(xhr, userId, emailMd5)', function () {
  it('should map the arguments to the xhr and call client.create()');
  it('should resolve the created xhr');
  it('should update forkedFrom on the forked XHR if it is a fork');
});


describe('xhrService.get(id, userId)', function () {
  it('should resolve the XHR when found');
  it('should reject with a 404 when the XHR is not public and the user is not the owner');
  it('should reject with a 500 when the elasticsearch search fails');
});


describe('xhrService.update(id, xhr, userId)', function () {
  it('should reject with a 401 when the user is not the owner');
  it('should map the arguments before updating');
  it('should resolve the elasticsearch promise');
});


describe('xhrService.incrementCallCount(xhrId)', function () {
  it('should update with the incrementcallcount script');
});


describe('xhrService.delete(id, userId)', function () {
  it('should reject with a 404 when not found');
  it('should reject with a 401 when the user is not the owner');
  it('should resolve the elasticsearch promise');
});


describe('xhrService.star(id, userId)', function () {
  it('should reject with a 400 when the user has already starred the XHR');
  it('should update the XHR with the starxhr script');
  it('should resolve the elasticsearch promise');
});


describe('xhrService.unstar(id, userId)', function () {
  it('should reject with a 400 when the user hasn\'t starred the XHR yet');
  it('should update the XHR with the unstarxhr script');
  it('should resolve the elasticsearch promise');
});
