// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>

define(["require","config","Ractive","rv!./profileMenuTemplate"],function(e){var t=e("config"),n=e("Ractive"),r=e("rv!./profileMenuTemplate");return n.extend({template:r,data:{session:t.session}})});