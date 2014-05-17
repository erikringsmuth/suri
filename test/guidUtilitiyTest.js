// Copyright (C) 2014 Erik Ringsmuth - MIT license
'use strict';

var expect = require('chai').expect,
    guid   = require('../utilities/guid');

describe('guid', function() {
  it('should have 36 characters', function() {
    expect(guid().length).to.equal(36);
  });
});
