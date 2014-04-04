// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';
var chai    = require('chai'),
    sinon   = require('sinon'),
    ipAddress  = require('../routes/ipAddress'),
    expect  = chai.expect;

// configure chai
// jshint expr:true
chai.use(require('sinon-chai'));

describe('ipAddress(req, res)', function () {
  it('should return the user\'s IP address', function() {
    // arrange
    var req = {
      connection: { remoteAddress: '192.168.1.1' }
    };
    var res = {
      write: sinon.stub(),
      end: sinon.stub()
    };

    // act
    ipAddress(req, res);

    // assert
    expect(res.write).to.have.been.calledWith('192.168.1.1');
    expect(res.end).to.have.been.called;
  });
});
