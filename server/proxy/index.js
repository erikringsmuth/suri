// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';

var request = require('request');

// The API proxy forwards requests to the 'api-host' header
module.exports = function apiProxy(req, res, next) {

  var apiHost = req.get('api-host');
  if(apiHost) {

    // Proxy to the API host!
    req.pipe(request({
      uri: apiHost + req.url,
      timeout: 1200
    })).pipe(res);
  }
  else {
    // Not a proxy request, carry on.
    next();
  }
};
