// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';

// Heroku performance logging
require('newrelic');

// Set environment vars before loading modules that use them
process.env.ELASTICSEARCH_URL = process.env.BONSAI_URL || 'localhost:9200';

var express     = require('express'),
    proxy       = require('./server/proxy'),
    xhrService  = require('./server/xhrService'),
    app         = express();


//// CONFIG

app.configure(function() {
  // Don't add the X-Powered-By header
  app.disable('x-powered-by');

  // gzip traffic
  app.use(express.compress());

  // Proxy requests with 'api-host' header
  app.use(proxy);

  // Serve /app dir as static content, it will look like the root dir
  app.use(express.static(__dirname + '/app'));

  // Parse body to JSON which is available using req.body
  app.use(express.json());
});

app.configure('development', function() {
  console.log('ELASTICSEARCH_URL: ' + process.env.ELASTICSEARCH_URL);

  // Error handling
  app.use(function(err, req, res, next) {
    console.error(err);
    res.send(500, { status:500, message: 'internal error', error: err });
  });
});

app.configure('production', function() {
  // Error handling
  app.use(function(err, req, res, next) {
    //do logging and user-friendly error message display
    res.send(500, { status:500, message: 'internal error' });
  });
});


//// ROUTES

// XHR
app.post('/xhr', xhrService.index);
app.get('/xhr', xhrService.search);
app.delete('/xhr/:id', xhrService.delete);

// Browser's IP address
app.get('/ip', function(req, res) {
  res.write(req.connection.remoteAddress);
  res.end();
});


//// START SERVER

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log('Listening on ' + port);
});
