// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';

// Render config.js
module.exports = function (req, res) {
  res.render('config', req.session_state);
};
