'use strict';

// Heroku performance logging
require('newrelic');

var express   = require('express'),
    proxy     = require('./server/proxy'),
    app       = express();

app.configure(function() {
  // Proxy requests with 'api-host' header
  app.use(proxy);

  // Serve /app dir as static content, it will look like the root dir
  app.use(express.static(__dirname + '/app'));
});

// Welcome text
app.get('/about.txt', function(req, res){
  var body = 'sURI, hands on access to the world\'s data!';
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', Buffer.byteLength(body));
  res.end(body);
});

app.get('/ip', function(req, res){
  res.write(req.connection.remoteAddress);
  res.end();
});

// Start server
var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log('Listening on ' + port);
});
