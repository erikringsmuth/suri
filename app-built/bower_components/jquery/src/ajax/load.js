define(["../core","../core/parseHTML","../ajax","../traversing","../manipulation","../selector","../event/alias"],function(e){var t=e.fn.load;e.fn.load=function(n,r,i){if(typeof n!="string"&&t)return t.apply(this,arguments);var s,o,u,a=this,f=n.indexOf(" ");return f>=0&&(s=e.trim(n.slice(f,n.length)),n=n.slice(0,f)),e.isFunction(r)?(i=r,r=undefined):r&&typeof r=="object"&&(u="POST"),a.length>0&&e.ajax({url:n,type:u,dataType:"html",data:r}).done(function(t){o=arguments,a.html(s?e("<div>").append(e.parseHTML(t)).find(s):t)}).complete(i&&function(e,t){a.each(i,o||[e.responseText,t,e])}),this}});