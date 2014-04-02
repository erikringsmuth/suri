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
  it('should call client.create() with the user', function (done) {
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
    done();
  });

  it('should return the client.create() promise', function (done) {
    // arrange
    var createDeferred = Q.defer();
    client.create = sinon.stub().returns(createDeferred.promise);

    // act
    var promise = userService.createUser({});

    // assert
    expect(promise).to.equal(createDeferred.promise);
    done();
  });
});


describe('userService.getGoogleUserByIssAndSub(iss, sub)', function () {
  it('should map the _id from the elasticsearch response to the body', function (done) {
    // arrange
    var searchDeferred = Q.defer();
    client.search = sinon.stub().returns(searchDeferred.promise);

    searchDeferred.resolve({
      hits: {
        hits: [
          {
            _id: '123',
            _source: {
              name: 'Jon'
            }
          }
        ]
      }
    });

    // act
    var promise = userService.getGoogleUserByIssAndSub('google', '123');

    // assert
    expect(promise).to.become({
      userId: '123',
      name: 'Jon'
    }).and.notify(done);
  });

  it('should return a 404 when the user is not found', function (done) {
    // arrange
    var searchDeferred = Q.defer();
    client.search = sinon.stub().returns(searchDeferred.promise);

    searchDeferred.resolve({
      hits: {
        hits: []
      }
    });

    // act
    userService
      .getGoogleUserByIssAndSub('google', '123')
      .then(null, function (error) {
        // assert
        expect(error).to.have.property('status', 404);
        done();
      })
      .done();
  });

  it('should pass through a rejected promise from the elasticsearch client', function (done) {
    // arrange
    var searchDeferred = Q.defer();
    client.search = sinon.stub().returns(searchDeferred.promise);
    searchDeferred.reject();

    // act
    var promise = userService.getGoogleUserByIssAndSub('google', '123');

    // assert
    expect(promise).to.be.rejected.and.notify(done);
  });
});


describe('userService.getProfile(id)', function () {
  it('should return the subset of data any user can see on a user\'s profile', function (done) {
    // arrange
    var getDeferred = Q.defer();
    client.get = sinon.stub().returns(getDeferred.promise);
    getDeferred.resolve({
      _id: '123',
      _source: {
        emailMd5: 'abc',
        displayName: 'Jon',
        otherProperty: '789'
      }
    });

    // act
    var promise = userService.getProfile('123');

    // assert
    expect(promise).to.become({
      userId: '123',
      emailMd5: 'abc',
      displayName: 'Jon'
    }).and.notify(done);
  });

  it('should return a 404 when the user does not exist', function (done) {
    // arrange
    var getDeferred = Q.defer();
    client.get = sinon.stub().returns(getDeferred.promise);
    getDeferred.reject();

    // act
    userService
      .getProfile('123')
      .then(null, function (error) {
        // assert
        expect(error).to.have.property('status', 404);
        done();
      })
      .done();
  });
});


describe('userService.getOrCreateUserProfile(options)', function () {
  it('should look up the user by iss and sub', function (done) {
    // arrange
    var deferred = Q.defer();
    var stub = sinon.stub(userService, 'getGoogleUserByIssAndSub').returns(deferred.promise);
    deferred.resolve({
      userId: '123',
      emailMd5: 'abc',
      displayName: 'Jon'
    });

    // act
    userService
      .getOrCreateUserProfile({
        googleIss: 'iss',
        googleSub: 'sub'
      })
      .then(function () {
        // assert
        expect(stub).to.have.been.called;
        done();
      })
      .done();
  });

  it('should return the user without any mapping if they exist', function (done) {
    // arrange
    var deferred = Q.defer();
    sinon.stub(userService, 'getGoogleUserByIssAndSub').returns(deferred.promise);
    deferred.resolve({
      userId: '123',
      emailMd5: 'abc',
      displayName: 'Jon'
    });

    // act
    var promise = userService
      .getOrCreateUserProfile({
        googleIss: 'iss',
        googleSub: 'sub'
      });

    // assert
    expect(promise).to.become({
      userId: '123',
      emailMd5: 'abc',
      displayName: 'Jon'
    }).and.notify(done);
  });

  it('should create a new user if they don\'t already exist', function (done) {
    // arrange
    var getUserDeferred = Q.defer();
    var createUserDeferred = Q.defer();
    sinon.stub(userService, 'getGoogleUserByIssAndSub').returns(getUserDeferred.promise);
    sinon.stub(userService, 'createUser').returns(getUserDeferred.promise);
    getUserDeferred.reject();
    createUserDeferred.resolve({
      _id: 'newUserId'
    });

    // act
    var promise = userService
      .getOrCreateUserProfile({
        googleIss: 'iss',
        googleSub: 'sub',
        emailMd5: 'abc',
        email: 'jon@gmail.com'
      });

    // assert
    expect(promise).to.become({
      userId: 'newUserId',
      googleIss: 'iss',
      googleSub: 'sub',
      emailMd5: 'abc',
      displayName: 'jon'
    }).and.notify(done);
  });

  it('should reject the promise if creating a user fails', function (done) {
    // arrange
    var getUserDeferred = Q.defer();
    var createUserDeferred = Q.defer();
    sinon.stub(userService, 'getGoogleUserByIssAndSub').returns(getUserDeferred.promise);
    sinon.stub(userService, 'createUser').returns(getUserDeferred.promise);
    getUserDeferred.reject();
    createUserDeferred.reject();

    // act
    var promise = userService
      .getOrCreateUserProfile({
        googleIss: 'iss',
        googleSub: 'sub',
        emailMd5: 'abc',
        email: 'jon@gmail.com'
      });

    // assert
    expect(promise).to.be.rejected.and.notify(done);
  });
});


describe('userService.updateDisplayName(userId, displayName)', function () {
  it('should enforce that the displayName is a string');
  it('should enforce that the displayName is between 3 and 30 characters');
  it('should return an object with the display name when done updating');
  it('should return a 500 if the update fails in elasticsearch');
});
