// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';

var request = require('request'),
    URI     = require('URIjs'),
    strings = require('../services/strings.js');

// The API proxy forwards requests to the 'api-host' header
module.exports = function apiProxy(req, res, next) {

  var apiHost = req.get('api-host');

  // Proxy request
  if(apiHost) {
    // The api-host + the full path from the original request
    var uri = new URI(apiHost + req.url).normalize();

    // Requests to suri.io or localhost should not be proxied
    if (uri.hostname().indexOf('suri.io') !== -1 || uri.hostname().indexOf('localhost') !== -1) {
      next();
      return;
    }

    if (uri.domain() === uri.tld() ||
        uri.domain() === '' ||
        uri.tld() === '' ||
        apiHost.indexOf(' ') !== -1) {

      res.status(400);
      res.end(strings.error + '\n\nYou have to format the URI like [protocol://domain.tld/path?query#hash]');
      return;
    }

    // Proxy to the API host!
    var proxyRequest;
    req
      .pipe(proxyRequest = request({
        uri: uri.protocol() + '://' + uri.authority() + req.url, // API host + path
        timeout: 4000 // Timeout quickly so it doesn't take up server resources
      }))
      .pipe(res);

    proxyRequest.on('error', function() {
      res.status(500);
      res.end(strings.error + '\n\nsuri.io failed to proxy the request');
    });
  }
  else {
    // Not a proxy request, carry on.
    next();
  }
};
