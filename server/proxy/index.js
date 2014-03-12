// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';

var http  = require('http'),
    https = require('https');

// The API proxy forwards requests to the 'api-host' header
module.exports = function apiProxy(req, res, next) {
  var apiHost = req.get('api-host');
  if(!apiHost) {
    // Not a proxy request, carry on.
    next();
  } else {
    // Proxy to the API host!

    // strip the protocol
    var protocol = http;
    var apiPort = 80;
    if (apiHost.substring(0, 'http://'.length) === 'http://') {
      apiHost = apiHost.substring('http://'.length);
    }
    if (apiHost.substring(0, 'https://'.length) === 'https://') {
      apiHost = apiHost.substring('https://'.length);
      protocol = https;
      apiPort = 443;
    }

    // strip the trailing slash
    if (apiHost.charAt(apiHost.length - 1) === '/') {
      apiHost = apiHost.substring(0, apiHost.length - 1);
    }

    // strip the port
    if (apiHost.indexOf(':') !== -1) {
      var targetHostParts = apiHost.split(':');
      apiHost = targetHostParts[0];
      apiPort = targetHostParts[1];
    }

    // headers to forward
    var proxyHeaders = {};
    for (var header in req.headers) {
      if (req.headers.hasOwnProperty(header)) {
        var headerValue = req.headers[header];

        // don't forward 'host' or 'api-host' headers
        if (header !== 'host' && header !== 'api-host') {
          proxyHeaders[header] = headerValue;
        }
      }
    }

    var proxyOptions = {
      host: apiHost,
      method: req.method,
      path: req.url,
      port: apiPort,
      headers: proxyHeaders
    };

    var proxyRequest = protocol.request(proxyOptions, function(proxyResponse) {
      // pipe the proxy response to the XHR response
      res.writeHead(proxyResponse.statusCode, proxyResponse.headers);
      proxyResponse.on('data', function (chunk) {
        res.write(chunk, 'binary');
      });
      proxyResponse.on('end', function () {
        res.end();
      });
    })
      .on('error', function(e) {
        res.end(e.message);
        console.log('Request errored: ' + e.message);
      });

    // Pipe the XHR request into the proxy request
    req.addListener('data', function(chunk) {
      proxyRequest.write(chunk, 'binary');
    });
    req.addListener('end', function() {
      proxyRequest.end();
    });

  }
};
