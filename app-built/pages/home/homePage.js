// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>

define(["require","Ractive","rv!./homeTemplate","layouts/search/layout","components/apiSequence/apiSequence","router","components/xhrPanel/xhrPanel","jquery"],function(e){var t=e("Ractive"),n=e("rv!./homeTemplate"),r=e("layouts/search/layout"),i=e("components/apiSequence/apiSequence"),s=e("router"),o=e("components/xhrPanel/xhrPanel"),u=e("jquery"),a=t.extend({template:n,init:function(){var e=new i({el:this.nodes["api-sequence"]});if(s.routes.search.active){var t=s.routeArguments();typeof t.q!="undefined"?u.ajax("/xhr?q="+t.q).done(function(e){this.set("xhrs",e)}.bind(this)):typeof t.tags!="undefined"&&u.ajax("/xhr?tags="+t.tags).done(function(e){this.set("xhrs",e)}.bind(this))}this.on({teardown:function(){e.teardown()},openResult:function(t,n){new o({data:n})}})}});return r.extend({components:{"content-placeholder":a}})});