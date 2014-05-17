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

describe('xhrRoutes.create(req, res)', function () {
  it('should return a 401 if the user is not signed in');
  it('should call xhrService.create(xhr, userId, emailMd5)');
});


describe('xhrRoutes.get(req, res)', function () {
  it('should call xhrService.get(id, userId)');
});


describe('xhrRoutes.update(req, res)', function () {
  it('should call xhrService.update(id, xhr, userId)');
});


describe('xhrRoutes.search(req, res)', function () {
  it('should call searchService.search(q, tags, owner, userId, from, size)');
});


describe('xhrRoutes.tagsAggregation(req, res)', function () {
  it('should call searchService.tagsAggregation()');
});


describe('xhrRoutes.delete(req, res)', function () {
  it('should call xhrService.delete(id, userId)');
});


describe('xhrRoutes.star(req, res)', function () {
  it('should call xhrService.star(id, userId)');
});


describe('xhrRoutes.unstar(req, res)', function () {
  it('should call xhrService.unstar(id, userId)');
});
