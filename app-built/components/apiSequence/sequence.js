// Copyright (C) 2014 Erik Ringsmuth - MIT license

define([],function(){var e={sequence:[]};return e.clear=function(){e.sequence.splice(0,e.sequence.length)},e.add=function(n){e.sequence.push(n)},e.remove=function(n){e.sequence.splice(e.sequence.indexOf(n),1)},e});