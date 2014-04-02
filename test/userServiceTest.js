// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';
var chai    = require('chai'),
    sinon   = require('sinon'),
    injectr = require('injectr'),
    Q       = require('q'),
    expect  = chai.expect;

// configure chai
// jshint expr:true
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));


// set up the userService and stub it's dependencies
var userService, client;

beforeEach(function() {
  client = {};
  userService = injectr('services/userService.js', {
    // stub elasticsearch module
    'elasticsearch': {
      Client: sinon.stub().returns(client)
    }
  });
});


describe('userService.createUser(user)', function () {
  it('should call client.create() with the user', function () {
    // arrange
    client.create = sinon.stub();
    var user = {
      googleIss: 'iss',
      googleSub: 'sub',
      emailMd5: 'md5',
      displayName: 'name'
    };

    // act
    userService.createUser(user);

    // assert
    expect(client.create).to.have.been.called;
    expect(client.create.getCall(0).args[0].id).to.exist;
    expect(client.create.getCall(0).args[0].body).to.deep.equal(user);
  });
});


describe('userService.getGoogleUserByIssAndSub(iss, sub)', function () {
  it('should get the user by issuer and subscriber', function () {
    // arrange
    var searchDeferred = Q.defer();
    client.search = sinon.stub().returns(searchDeferred.promise);

    var searchResult = {
      hits: {
        hits: [
          {
            _id: '123',
            source: {
              name: 'Jon'
            }
          }
        ]
      }
    };

    // act
    var promise = userService.getGoogleUserByIssAndSub('google', '123');
    searchDeferred.resolve(searchResult);

    // assert
    expect(promise).to.become({
      userId: '123',
      name: 'Jon'
    });
  });

  it('should return a 404 when the user is not found', function () {
    // arrange
    var searchDeferred = Q.defer();
    client.search = sinon.stub().returns(searchDeferred.promise);

    // act
    var promise = userService.getGoogleUserByIssAndSub('google', '123');
    searchDeferred.reject();

    // assert
    expect(promise).to.be.rejected;
  });
});
