// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>

define(["require","Ractive","rv!./searchBoxTemplate","components/xhrPanel/xhrPanel","jquery"],function(e){var t=e("Ractive"),n=e("rv!./searchBoxTemplate"),r=e("components/xhrPanel/xhrPanel"),i=e("jquery");return t.extend({template:n,data:{searchTerm:""},init:function(){var e=this,t=function(t){t.keyCode===27&&(e.nodes.searchInput.focus(),e.closeSearchResults())},n=function(){e.set("searchResultsWidth",i("#search").width()-2*e.el.offsetLeft-37)};window.addEventListener("keydown",t,!0),window.addEventListener("resize",n,!0),this.observe({searchTerm:function(e){e?(this.get("searchResultsWidth")||n(),i.ajax("/xhr?q="+e.trim()).done(function(e){this.set("searchResults",e)}.bind(this))):this.closeSearchResults()}}),this.on({navigateOnArrow:function(t){if(t.original.target.tabIndex&&(t.original.keyCode===38||t.original.keyCode===40)){var n=t.original.target.tabIndex;t.original.keyCode===38?n-=1:t.original.keyCode===40&&(n+=1);var r=this.find('[tabindex="'+n+'"]');r&&r.focus(),t.original.preventDefault()}},openResult:function(t,n){this.closeSearchResults(),new r({data:n})},openResultOnEnter:function(t,n){t.original.keyCode===13&&this.fire("openResult",t,n)},searchOnEnter:function(e){e.original.keyCode===13&&(window.location.hash="/?q="+e.node.value)},teardown:function(){window.removeEventListener("resize",n,!0),window.removeEventListener("keydown",t,!0)}})},closeSearchResults:function(){this.set("searchTerm",null),this.set("searchResults",{})}})});