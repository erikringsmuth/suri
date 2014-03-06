// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';

// Heroku performance logging
require('newrelic');

var express   = require('express'),
    proxy     = require('./server/proxy'),
    xhr       = require('./server/xhr'),
    app       = express();


//// CONFIG

app.configure(function() {
  // Don't add the X-Powered-By header
  app.disable('x-powered-by');

  // GZip traffic
  app.use(express.compress());

  // Proxy requests with 'api-host' header
  app.use(proxy);

  // Serve /app dir as static content, it will look like the root dir
  app.use(express.static(__dirname + '/app'));

  // Parse body to JSON which is available using req.body
  app.use(express.json());

  process.env.ELASTICSEARCH_URL = process.env.BONSAI_URL || 'localhost:9200';
});

app.configure('development', function() {
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


//// START SERVER

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log('Listening on ' + port);
});
