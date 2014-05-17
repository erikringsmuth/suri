// Copyright (C) 2014 Erik Ringsmuth - MIT license
'use strict';

// Render config.js
module.exports = function (req, res) {
  res.render('config', req.session_state);
};
