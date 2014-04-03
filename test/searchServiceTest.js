// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
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


// set up the searchService and stub it's dependencies
var searchService, client;

beforeEach(function() {
  client = {};
  searchService = injectr('services/searchService.js', {
    // stub elasticsearch module
    'elasticsearch': {
      Client: sinon.stub().returns(client)
    }
  });
});


describe('searchService.search(q, tags, owner, userId, from, size)', function () {
  it('should default to 10 items per page');
  it('should start at item 1');
  it('should filter results owned by the current user or that are public when no owner is specified');
  it('should filter to a user\'s public results when viewing a user\'s profile');
  it('should filter to just the current user\'s items when viewing their own profile');
  it('should map the _id and highlight fields to the main search result response objects');
  it('should calculate the `to`, `from`, and `of` fields from the elasticsearch `from`, `size`, and `total` fields');
});


describe('searchService.tagsAggregation()', function () {
  it('should filter to public items then do an aggregation on the tags field');
  it('should resolve the search result aggregations field');
});
