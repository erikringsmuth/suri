// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';
var auth        = require('./authentication'),
    config      = require('./config'),
    xhrRoutes   = require('./xhrRoutes'),
    userRoutes  = require('./userRoutes'),
    ipAddress   = require('./ipAddress');

// Register routes
module.exports = function (app) {
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
  app.get('/users/:id', userRoutes.getProfile);
  app.put('/users/:id/displayname', userRoutes.updateDisplayName);

  // Browser's IP address
  app.get('/ip', ipAddress);

  // JS app configuration (session vars)
  app.get('/config.js', config);
};
