// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>

define(["require","Ractive","rv!./aboutTemplate","layouts/simple/layout"],function(e){var t=e("Ractive"),n=e("rv!./aboutTemplate"),r=e("layouts/simple/layout"),i=t.extend({template:n,data:{url:window.location.href,hostname:window.location.hostname}});return r.extend({components:{"content-placeholder":i}})});