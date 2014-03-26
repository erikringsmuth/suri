// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>

define(["require","Ractive","rv!./searchTemplate","layouts/search/layout","components/apiSequence/apiSequence","router","components/xhrPanel/xhrPanel","jquery"],function(e){var t=e("Ractive"),n=e("rv!./searchTemplate"),r=e("layouts/search/layout"),i=e("components/apiSequence/apiSequence"),s=e("router"),o=e("components/xhrPanel/xhrPanel"),u=e("jquery"),a=t.extend({template:n,data:{header:"Results",from:1,size:10},computed:{showPreviousButton:"${xhrs.from} > 1",showNextButton:"${xhrs.to} < ${xhrs.of}"},init:function(){var e=new i({el:this.nodes["api-sequence"]});e.set("disableTutorial",!0),this.on({teardown:function(){e.teardown()},openResult:function(t,n){new o({data:n})},setFrom:function(e,t){this.set("from",t),this.search()}}),this.search()},search:function(){var e=s.routeArguments();typeof e.q!="undefined"?u.ajax("/xhr?from="+this.get("from")+"&q="+e.q).done(function(e){this.set("xhrs",e)}.bind(this)):typeof e.tags!="undefined"&&(this.set("header",e.tags.split(",").join(", ")),u.ajax("/xhr?from="+this.get("from")+"&tags="+e.tags).done(function(e){this.set("xhrs",e)}.bind(this)))}});return r.extend({components:{"content-placeholder":a}})});