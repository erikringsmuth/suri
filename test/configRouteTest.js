// Copyright (C) 2014 Erik Ringsmuth - MIT license
'use strict';
var chai    = require('chai'),
    sinon   = require('sinon'),
    config  = require('../routes/config'),
    expect  = chai.expect;

// configure chai
// jshint expr:true
chai.use(require('sinon-chai'));

describe('config(req, res)', function () {
  it('should render the config view and pass it the session state', function() {
    // arrange
    var req = {
      session_state: { signedIn: true }
    };
    var res = {
      type: sinon.stub(),
      render: sinon.stub()
    };

    // act
    config(req, res);

    // assert
    expect(res.type).to.have.been.calledWith('application/javascript');
    expect(res.render).to.have.been.calledWith('config', req.session_state);
  });
});
