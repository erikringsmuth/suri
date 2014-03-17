// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';

var request = require('request');

// The API proxy forwards requests to the 'api-host' header
module.exports = function apiProxy(req, res, next) {

  var apiHost = req.get('api-host');

  // Don't proxy if the api-host is suri.io or localhost
  if(apiHost && apiHost.indexOf('suri.io') === -1 && apiHost.indexOf('localhost') === -1) {

    // Proxy to the API host!
    req.pipe(request({
      uri: apiHost + req.url, // API host + path
      timeout: 1200 // Timeout quickly so it doesn't take up server resources
    })).pipe(res);
  }
  else {
    // Not a proxy request, carry on.
    next();
  }
};
