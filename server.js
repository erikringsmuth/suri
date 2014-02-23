// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';

// Heroku performance logging
require('newrelic');

var express   = require('express'),
    proxy     = require('./server/proxy'),
    search     = require('./server/search'),
    app       = express();

// Don't add the X-Powered-By header
app.disable('x-powered-by');

app.configure(function() {
  // Proxy requests with 'api-host' header
  app.use(proxy);

  // Serve /app dir as static content, it will look like the root dir
  app.use(express.static(__dirname + '/app'));
});

// Welcome text
app.get('/search', function(req, res) {
  var result = search.typeahead(req.query.q);
  var body = JSON.stringify(result);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Length', Buffer.byteLength(body));
  res.end(body);
});

app.get('/ip', function(req, res) {
  res.write(req.connection.remoteAddress);
  res.end();
});

// Start server
var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log('Listening on ' + port);
});
