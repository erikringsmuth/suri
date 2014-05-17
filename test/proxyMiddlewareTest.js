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

describe('proxy middleware', function () {
  it('should increment the api call count if the `api-id` header is present');

  it('should call next if the `api-host` header is not present');

  it('should not proxy the request if the host is `suri.io` or `localhost`');

  it('should return an error if the domain and tld are the same (malformed URI)');

  it('should return an error if the domain is empty (malformed URI)');

  it('should return an error if the tld is empty (malformed URI)');

  it('should return an error if there is a space in the host (malformed URI)');

  it('should proxy the request');

  it('should catch proxy request errors and return a 500');
});
