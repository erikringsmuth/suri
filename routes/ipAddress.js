// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';

// Return the user's IP address
module.exports = function(req, res) {
  res.write(req.connection.remoteAddress);
  res.end();
};
