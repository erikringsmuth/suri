// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
/* jshint expr:true */
'use strict';
var expect  = require('chai').expect,
    sinon   = require('sinon'),
    injectr = require('injectr');
    //Q       = require('q');

var client, userService;

beforeEach(function() {
  client = {
    create: sinon.stub(),
    search: sinon.stub()
  };
  userService = injectr('services/userService.js', {
    'elasticsearch': {
      Client: sinon.stub().returns(client)
    }
  });
});

describe('userService.createUser(user)', function () {
  it('should call client.create() with the user', function () {
    // arrange
    var user = {
      googleIss: 'iss',
      googleSub: 'sub',
      emailMd5: 'md5',
      displayName: 'name'
    };

    // act
    userService.createUser(user);

    // assert
    expect(client.create.called).to.be.true;
    expect(client.create.getCall(0).args[0].id).to.exist;
    expect(client.create.getCall(0).args[0].body).to.deep.equal(user);
  });
});

// describe('userService.getGoogleUserByIssAndSub(iss, sub)', function () {
//   it('should get the user by issuer and subscriber', function (done) {
//     // arrange
//     var searchDeferred = Q.defer();
//     client.search.returns(searchDeferred.promise);

//     var searchResult = {
//       hits: {
//         hits: [
//           {
//             _id: '123',
//             source: {
//               name: 'Jon'
//             }
//           }
//         ]
//       }
//     };

//     // act
//     userService
//       .getGoogleUserByIssAndSub('google', '123')
//       .then(function (user) {
//         // assert
//         expect(user).to.deep.equal({
//           userId: '123',
//           name: 'Jon'
//         });
//         done();
//       })
//       .fail(function(error) {
//         // Fail on purpose
//         expect('Couldn\'t resolve promise').to.be.null;
//         done();
//       })
//       .done();

//     searchDeferred.resolve(searchResult);
//   });
// });

// describe('userService.getGoogleUserByIssAndSub(iss, sub)', function () {
//   it('should return a 404 when the user is not found', function (done) {
//     // arrange
//     var searchDeferred = Q.defer();
//     client.search.returns(searchDeferred.promise);

//     // act
//     userService
//       .getGoogleUserByIssAndSub('google', '123')
//       .then(function (actual) {
//         // assert
//         expect(actual.status).to.equal(404);
//         done();
//       });

//     searchDeferred.reject();
//   });
// });
