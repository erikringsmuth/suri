// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define(function() {
  'use strict';

  // The API sequence
  var sequence = [];

  sequence.clear = function clear() {
    sequence.splice(0, sequence.length);
  };

  sequence.add = function add(item) {
    sequence.push(item);
  };

  sequence.remove = function remove(item) {
    sequence.splice(sequence.indexOf(item), 1);
  };

  return sequence;
});
