// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>

define(["require","jquery","prettify"],function(e){var t=e("jquery"),n=e("prettify"),r={development:window.location.hostname==="localhost",formatCode:function(r){return t(r).find("code").each(function(){var e=t(this);e.hasClass("pln")||e.html(n.prettyPrintOne(e.html()))}),r},guid:function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var t=Math.random()*16|0,n=e=="x"?t:t&3|8;return n.toString(16)})},escape:function(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;").replace(/\//g,"&#x2f;")}};return r});