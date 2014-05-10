// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>

define(["require","config","ractive","rv!./profileMenuTemplate"],function(e){var t=e("config"),n=e("ractive"),r=e("rv!./profileMenuTemplate");return n.extend({template:r,data:{session:t.session}})});