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
    auth        = require('./server/authentication'),
    proxy       = require('./server/proxy'),
    config      = require('./server/config'),
    xhrRoutes   = require('./routes/xhrRoutes.js'),
    userService = require('./server/userService'),
    ipAddress   = require('./server/ipAddress'),
    handlebars  = require('express3-handlebars'),
    sessions    = require('client-sessions'),
    app         = express();


//// CONFIG

// Don't add the X-Powered-By header
app.disable('x-powered-by');

// gzip traffic
app.use(compression());

// Proxy requests with 'api-host' header
app.use(xhrRoutes.incrementCallCount);
app.use(proxy);

// Client session
app.use(sessions({
  cookieName: 'session_state', // cookie name dictates the key name added to the request object
  secret: nconf.get('SESSION_SECRET'), // should be a large unguessable string
  duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
  activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
}));

// View engine
app.set('views', __dirname + '/views');
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');

// Serve /app dir as static content, it will look like the root dir
// user /app in development, /app-built in prod
if (nconf.get('ENV') === 'production') {
  app.use(express.static(__dirname + '/app-built'));
} else {
  app.use(express.static(__dirname + '/app'));
}

// Parse body to JSON which is available using req.body
app.use(bodyParser());

if (nconf.get('ENV') === 'production') {
  app.use(express.static(__dirname + '/app-built'));

  app.use(logger());

  // Error handling
  app.use(function(err, req, res, next) {
    res.send(500, { status:500, message: 'internal error' });
  });
} else {
  app.use(express.static(__dirname + '/app'));

  app.use(logger('dev'));

  // Error handling
  app.use(function(err, req, res, next) {
    console.error(err);
    res.send(500, { status:500, message: 'internal error', error: err });
  });

  console.log('ELASTICSEARCH_URL: ' + nconf.get('ELASTICSEARCH_URL'));
}


//// ROUTES

// Session
app.get('/login', auth.login);
app.get('/logout', auth.logout);
app.get('/oauth2callback', auth.oAuth2Callback);

// XHR
app.get('/xhr/:id', xhrRoutes.get);
app.get('/xhr', xhrRoutes.search);
app.post('/xhr', xhrRoutes.create);
app.put('/xhr/:id', xhrRoutes.update);
app.delete('/xhr/:id', xhrRoutes.delete);
app.post('/xhr/:id/stars', xhrRoutes.star);
app.delete('/xhr/:id/stars/:userId', xhrRoutes.unstar);
app.get('/tags', xhrRoutes.tagsAggregation);

// Users
app.get('/users/:id', userService.getProfile);
app.put('/users/:id/displayname', userService.updateDisplayName);

// Browser's IP address
app.get('/ip', ipAddress);

// JS app configuration (session vars)
app.get('/config.js', config);


//// START SERVER

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log('Listening on ' + port);
});
