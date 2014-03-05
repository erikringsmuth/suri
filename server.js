// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';

// Heroku performance logging
require('newrelic');

var express   = require('express'),
    proxy     = require('./server/proxy'),
    search     = require('./server/search'),
    xhr     = require('./server/xhr'),
    app       = express();

// Don't add the X-Powered-By header
app.disable('x-powered-by');

app.configure(function() {
  // Proxy requests with 'api-host' header
  app.use(proxy);

  // Parse body to JSON which is available using req.body
  app.use(express.bodyParser());

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

// XHR
app.post('/xhr', xhr.create);
app.get('/xhr', xhr.readList);
app.get('/xhr/_search', xhr.search);
app.get('/xhr/:id', xhr.read);
app.put('/xhr/:id', xhr.update);
app.delete('/xhr/:id', xhr.delete);

// Browser's IP address
app.get('/ip', function(req, res) {
  res.write(req.connection.remoteAddress);
  res.end();
});

// Start server
var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log('Listening on ' + port);
});
