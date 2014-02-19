'use strict';

// Heroku performance logging
require('newrelic');

var express   = require('express'),
    proxy     = require('http-proxy').createProxyServer(),
    app       = express();

var apiProxy = function apiProxy(req, res, next) {
  var apiHost = req.get('api-host');
  if(apiHost && apiHost !== 'suri.io') {
    proxy.web(req, res, {target: apiHost});
  } else {
    next();
  }
};

proxy.on('error', function (err, req, res) {
  res.writeHead(res.statusCode, res._headers);
  res.end('Connection failed.');
});

app.configure(function(){
  app.use(apiProxy); // Proxy routing
  app.use(express.static(__dirname + '/app')); // Static content
});

// Welcome text
app.get('/about.txt', function(req, res){
  var body = 'sURI, hands on access to the world\'s data!';
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', Buffer.byteLength(body));
  res.end(body);
});

// Start server
var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log('Listening on ' + port);
});
