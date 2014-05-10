// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>

define(["require","ractive","rv!./notFoundTemplate","layouts/simple/layout"],function(e){var t=e("ractive"),n=e("rv!./notFoundTemplate"),r=e("layouts/simple/layout"),i=t.extend({template:n});return r.extend({components:{"content-placeholder":i}})});