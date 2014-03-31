// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';

// Set environment vars before loading modules that use them
var nconf = require('nconf');
nconf
  .argv()
  .env()
  .file({ file: __dirname + '/config.json' });

// Heroku performance logging
require('newrelic');

var express     = require('express'),
    compression = require('compression'),
    bodyParser  = require('body-parser'),
    logger      = require('morgan'),
    routes      = require('./routes/routes'),
    proxy       = require('./middleware/proxy'),
    handlebars  = require('express3-handlebars'),
    sessions    = require('client-sessions'),
    app         = express();


// Don't add the X-Powered-By header
app.disable('x-powered-by');

// gzip traffic
app.use(compression());

// Proxy requests with 'api-host' header
app.use(proxy);

// Client session
app.use(sessions({
  cookieName: 'session_state', // cookie name dictates the key name added to the request object
  secret: nconf.get('SESSION_SECRET'), // should be a large unguessable string
  duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
  activeDuration: 12 * 60 * 60 * 1000 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
}));

// View engine
app.set('views', __dirname + '/views');
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');

// Serve /app dir as static content, it will look like the root dir
// development: /app
// prod: /app-built
if (nconf.get('ENV') === 'production') {
  app.use(express.static(__dirname + '/app-built'));
} else {
  app.use(express.static(__dirname + '/app'));
}

// Parse body to JSON which is available using req.body
app.use(bodyParser());

if (nconf.get('ENV') === 'production') {
  app.use(logger());

  // Error handling
  app.use(function(err, req, res, next) {
    res.send(500, { status: 500, message: 'internal error' });
    next();
  });
} else {
  app.use(logger('dev'));

  // Error handling
  app.use(function(err, req, res, next) {
    console.error(err);
    res.send(500, { status: 500, message: 'internal error', error: err });
    next();
  });

  console.log('ELASTICSEARCH_URL: ' + nconf.get('ELASTICSEARCH_URL'));
}

// Register routes
routes(app);

// Start server
var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log('Listening on ' + port);
});
