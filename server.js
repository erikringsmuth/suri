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
    auth        = require('./server/authentication'),
    proxy       = require('./server/proxy'),
    index       = require('./server/index'),
    xhrService  = require('./server/xhrService'),
    ipAddress   = require('./server/ipAddress'),
    handlebars  = require('express3-handlebars'),
    sessions    = require('client-sessions'),
    app         = express();


//// CONFIG

app.configure(function() {
  // Don't add the X-Powered-By header
  app.disable('x-powered-by');

  // gzip traffic
  app.use(express.compress());

  // Proxy requests with 'api-host' header
  app.use(xhrService.incrementCallCount);
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
  app.use(express.static(__dirname + '/app'));

  // Parse body to JSON which is available using req.body
  app.use(express.json());
});

app.configure('development', function() {
  console.log('BONSAI_URL: ' + nconf.get('BONSAI_URL'));

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

// Session
app.get('/login', auth.login);
app.get('/logout', auth.logout);
app.get('/oauth2callback', auth.oAuth2Callback);

// XHR
app.get('/xhr', xhrService.search);
app.post('/xhr', xhrService.create);
app.put('/xhr/:id', xhrService.update);
app.delete('/xhr/:id', xhrService.delete);

// Browser's IP address
app.get('/ip', ipAddress);

// All routes should load the index which bootstraps the JS app. This has to be loaded
// last or it will override the other routes.
app.get('/*', index);


//// START SERVER

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log('Listening on ' + port);
});
