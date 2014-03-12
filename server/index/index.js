// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';

// Render views/index.html
module.exports = function (req, res) {
  res.render('index', {
    signedIn: req.session_state.iss && req.session_state.sub,
    email: req.session_state.email,
    emailMd5: req.session_state.emailMd5,
    authenticationMessage: req.session_state.authenticationMessage
  });
};
