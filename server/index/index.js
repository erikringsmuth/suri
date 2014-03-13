// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';

// Render views/index.html
module.exports = function (req, res) {
  res.render('index', req.session_state);
};
