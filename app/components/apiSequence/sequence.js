// Copyright (C) 2014 Erik Ringsmuth - MIT license
define(function() {
  'use strict';

  // The API sequence
  var sequence = {
    sequence: []
  };

  sequence.clear = function clear() {
    sequence.sequence.splice(0, sequence.sequence.length);
  };

  sequence.add = function add(item) {
    sequence.sequence.push(item);
  };

  sequence.remove = function remove(item) {
    sequence.sequence.splice(sequence.sequence.indexOf(item), 1);
  };

  return sequence;
});
