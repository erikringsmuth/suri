// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>

define(["require","Ractive","rv!./trendingTemplate","layouts/search/layout","components/apiSequence/apiSequence","components/xhrPanel/xhrPanel","jquery"],function(e){var t=e("Ractive"),n=e("rv!./trendingTemplate"),r=e("layouts/search/layout"),i=e("components/apiSequence/apiSequence"),s=e("components/xhrPanel/xhrPanel"),o=e("jquery"),u=t.extend({template:n,data:{xhrs:null,tags:null,from:0,size:10},computed:{showPreviousButton:"${xhrs.from} > 0",showNextButton:"${xhrs.to} < ${xhrs.of} - 1"},init:function(){var e=new i({el:this.nodes["api-sequence"]});e.set("disableTutorial",!0),o.ajax("/tags").done(function(e){this.set("tags",e)}.bind(this)),this.on({teardown:function(){e.teardown()},openResult:function(t,n){new s({data:n})},setFrom:function(e,t){this.set("from",t),this.search()}}),this.search()},search:function(){o.ajax("/xhr?from="+this.get("from")).done(function(e){this.set("xhrs",e)}.bind(this))}});return r.extend({components:{"content-placeholder":u}})});