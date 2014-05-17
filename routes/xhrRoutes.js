// Copyright (C) 2014 Erik Ringsmuth - MIT license
'use strict';
var xhrService    = require('../services/xhrService'),
    searchService = require('../services/searchService');

module.exports.create = function(req, res) {
  if(!req.session_state.signedIn) {
    res.status(401);
    res.send('You must be signed in to save an XHR');
    return;
  }

  xhrService
    .create(req.body, req.session_state.userId, req.session_state.emailMd5)
    .then(function (data) {
      res.send(data);
    })
    .fail(function (error) {
      res.status(error.status);
      res.send(error);
    });
};

module.exports.get = function(req, res) {
  xhrService
    .get(req.params.id, req.session_state.userId)
    .then(function (xhr) {
      res.send(xhr);
    })
    .fail(function (error) {
      res.status(error.status);
      res.send(error);
    });
};

module.exports.update = function(req, res) {
  xhrService
    .update(req.params.id, req.body, req.session_state.userId)
    .then(function () {
      res.status(204);
      res.send('Updated');
    })
    .fail(function (error) {
      res.status(error.status);
      res.send(error);
    });
};

module.exports.search = function(req, res) {
  searchService
    .search(req.query.q, req.query.tags, req.query.owner, req.session_state.userId, req.query.from, req.query.size)
    .then(function (results) {
      res.send(results);
    })
    .fail(function (error) {
      res.status(error.status);
      res.send(error);
    });
};

module.exports.tagsAggregation = function(req, res) {
  searchService
    .tagsAggregation()
    .then(function (results) {
      res.send(results);
    })
    .fail(function (error) {
      res.status(error.status);
      res.send(error);
    });
};

module.exports.delete = function(req, res) {
  xhrService
    .delete(req.params.id, req.session_state.userId)
    .then(function (data) {
      res.send(data);
    })
    .fail(function (error) {
      res.send(error.status);
      res.send(error);
    });
};

module.exports.star = function(req, res) {
  xhrService
    .star(req.params.id, req.session_state.userId)
    .then(function (data) {
      res.send(data);
    })
    .fail(function (error) {
      res.status(error.status);
      res.send(error);
    });
};

module.exports.unstar = function(req, res) {
  xhrService
    .unstar(req.params.id, req.session_state.userId)
    .then(function (data) {
      res.send(data);
    })
    .fail(function (error) {
      res.status(error.status);
      res.send(error);
    });
};
