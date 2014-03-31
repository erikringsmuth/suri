'use strict';
var assert = require('assert'),
    guid   = require('../utilities/guid');

describe('guid', function(){
  it('should have 36 characters', function(){
    assert.equal(36, guid().length);
  });
});
