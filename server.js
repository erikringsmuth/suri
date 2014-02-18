'use strict';

var express = require('express');
require('newrelic'); // Heroku performance logging

var app = express();

app.configure(function(){
  app.use('/', express.static(__dirname + '/app'));
});

app.get('/about.txt', function(req, res){
  var body = 'sURI, hands on access to the world\'s data!';
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', Buffer.byteLength(body));
  res.end(body);
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log('Listening on ' + port);
});
