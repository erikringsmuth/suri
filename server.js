'use strict';

var express = require('express');
require('newrelic'); // Heroku performance logging

var server = express();

server.configure(function(){
  server.use('/', express.static(__dirname + '/app'));
});

server.get('/about.txt', function(req, res){
  var body = 'sURI, hands on access to the world\'s data!';
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', Buffer.byteLength(body));
  res.end(body);
});

server.listen(8002);
console.log('sURI started on port 8002');
