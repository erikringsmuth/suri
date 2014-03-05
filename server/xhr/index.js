// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';
var elasticsearch = require('elasticsearch');

var client = elasticsearch.Client({
  host: 'localhost:9200'
});
var index = 'suri-ci',
    type = 'xhr';

module.exports.create = function(req, res) {
  client.create({
    index: index,
    type: type,
    body: req.body
  }).then(function (body) {
    res.end(body);
  }, function (error) {
    res.end(error);
  });
};

module.exports.readList = function(req, res) {
  client.get({
    index: index,
    type: type
  }).then(function (body) {
    res.end(body);
  }, function (error) {
    res.end(error);
  });
};

module.exports.read = function(req, res) {
  client.get({
    index: index,
    type: type,
    id: req.params.id
  }).then(function (body) {
    res.end(body);
  }, function (error) {
    res.end(error);
  });
};

module.exports.search = function(req, res) {
  client.search({
    index: index,
    type: type,
    q: req.params.q
    //ignore: [404]
  }).then(function (body) {
    res.end(body);
  }, function (error) {
    res.end(error);
  });
};

module.exports.update = function(req, res) {
  client.update({
    index: index,
    type: type,
    id: req.params.id,
    body: {
      doc: req.body
    }
  }).then(function (body) {
    res.end(body);
  }, function (error) {
    res.end(error);
  });
};

module.exports.delete = function(req, res) {
  client.delete({
    index: index,
    type: type,
    id: req.params.id
  }).then(function (body) {
    res.end(body);
  }, function (error) {
    res.end(error);
  });
};
