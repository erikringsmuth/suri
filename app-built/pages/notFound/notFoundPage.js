// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>

define(["require","Ractive","rv!./notFoundTemplate","layouts/simple/layout"],function(e){var t=e("Ractive"),n=e("rv!./notFoundTemplate"),r=e("layouts/simple/layout"),i=t.extend({template:n});return r.extend({components:{"content-placeholder":i}})});