define(["../core","../var/rnotwhite","../var/strundefined","../core/init"],function(e,t,n){var r=/[\t\r\n\f]/g;e.fn.extend({addClass:function(n){var i,s,o,u,a,f,l=0,c=this.length,h=typeof n=="string"&&n;if(e.isFunction(n))return this.each(function(t){e(this).addClass(n.call(this,t,this.className))});if(h){i=(n||"").match(t)||[];for(;l<c;l++){s=this[l],o=s.nodeType===1&&(s.className?(" "+s.className+" ").replace(r," "):" ");if(o){a=0;while(u=i[a++])o.indexOf(" "+u+" ")<0&&(o+=u+" ");f=e.trim(o),s.className!==f&&(s.className=f)}}}return this},removeClass:function(n){var i,s,o,u,a,f,l=0,c=this.length,h=arguments.length===0||typeof n=="string"&&n;if(e.isFunction(n))return this.each(function(t){e(this).removeClass(n.call(this,t,this.className))});if(h){i=(n||"").match(t)||[];for(;l<c;l++){s=this[l],o=s.nodeType===1&&(s.className?(" "+s.className+" ").replace(r," "):"");if(o){a=0;while(u=i[a++])while(o.indexOf(" "+u+" ")>=0)o=o.replace(" "+u+" "," ");f=n?e.trim(o):"",s.className!==f&&(s.className=f)}}}return this},toggleClass:function(r,i){var s=typeof r;return typeof i=="boolean"&&s==="string"?i?this.addClass(r):this.removeClass(r):e.isFunction(r)?this.each(function(t){e(this).toggleClass(r.call(this,t,this.className,i),i)}):this.each(function(){if(s==="string"){var i,o=0,u=e(this),a=r.match(t)||[];while(i=a[o++])u.hasClass(i)?u.removeClass(i):u.addClass(i)}else if(s===n||s==="boolean")this.className&&e._data(this,"__className__",this.className),this.className=this.className||r===!1?"":e._data(this,"__className__")||""})},hasClass:function(e){var t=" "+e+" ",n=0,i=this.length;for(;n<i;n++)if(this[n].nodeType===1&&(" "+this[n].className+" ").replace(r," ").indexOf(t)>=0)return!0;return!1}})});