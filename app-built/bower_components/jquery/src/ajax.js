define(["./core","./var/rnotwhite","./ajax/var/nonce","./ajax/var/rquery","./core/init","./ajax/parseJSON","./ajax/parseXML","./deferred"],function(e,t,n,r){function g(n){return function(r,i){typeof r!="string"&&(i=r,r="*");var s,o=0,u=r.toLowerCase().match(t)||[];if(e.isFunction(i))while(s=u[o++])s.charAt(0)==="+"?(s=s.slice(1)||"*",(n[s]=n[s]||[]).unshift(i)):(n[s]=n[s]||[]).push(i)}}function y(t,n,r,i){function u(a){var f;return s[a]=!0,e.each(t[a]||[],function(e,t){var a=t(n,r,i);if(typeof a=="string"&&!o&&!s[a])return n.dataTypes.unshift(a),u(a),!1;if(o)return!(f=a)}),f}var s={},o=t===d;return u(n.dataTypes[0])||!s["*"]&&u("*")}function b(t,n){var r,i,s=e.ajaxSettings.flatOptions||{};for(i in n)n[i]!==undefined&&((s[i]?t:r||(r={}))[i]=n[i]);return r&&e.extend(!0,t,r),t}function w(e,t,n){var r,i,s,o,u=e.contents,a=e.dataTypes;while(a[0]==="*")a.shift(),i===undefined&&(i=e.mimeType||t.getResponseHeader("Content-Type"));if(i)for(o in u)if(u[o]&&u[o].test(i)){a.unshift(o);break}if(a[0]in n)s=a[0];else{for(o in n){if(!a[0]||e.converters[o+" "+a[0]]){s=o;break}r||(r=o)}s=s||r}if(s)return s!==a[0]&&a.unshift(s),n[s]}function E(e,t,n,r){var i,s,o,u,a,f={},l=e.dataTypes.slice();if(l[1])for(o in e.converters)f[o.toLowerCase()]=e.converters[o];s=l.shift();while(s){e.responseFields[s]&&(n[e.responseFields[s]]=t),!a&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),a=s,s=l.shift();if(s)if(s==="*")s=a;else if(a!=="*"&&a!==s){o=f[a+" "+s]||f["* "+s];if(!o)for(i in f){u=i.split(" ");if(u[1]===s){o=f[a+" "+u[0]]||f["* "+u[0]];if(o){o===!0?o=f[i]:f[i]!==!0&&(s=u[0],l.unshift(u[1]));break}}}if(o!==!0)if(o&&e["throws"])t=o(t);else try{t=o(t)}catch(c){return{state:"parsererror",error:o?c:"No conversion from "+a+" to "+s}}}}return{state:"success",data:t}}var i,s,o=/#.*$/,u=/([?&])_=[^&]*/,a=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,f=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,l=/^(?:GET|HEAD)$/,c=/^\/\//,h=/^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,p={},d={},v="*/".concat("*");try{s=location.href}catch(m){s=document.createElement("a"),s.href="",s=s.href}return i=h.exec(s.toLowerCase())||[],e.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:s,type:"GET",isLocal:f.test(i[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":v,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":e.parseJSON,"text xml":e.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(t,n){return n?b(b(t,e.ajaxSettings),n):b(e.ajaxSettings,t)},ajaxPrefilter:g(p),ajaxTransport:g(d),ajax:function(f,m){function q(t,n,r,i){var s,o,u,a,f,l=n;if(B===2)return;B=2,T&&clearTimeout(T),C=undefined,x=i||"",F.readyState=t>0?4:0,s=t>=200&&t<300||t===304,r&&(a=w(L,F,r)),a=E(L,a,F,s);if(s)L.ifModified&&(f=F.getResponseHeader("Last-Modified"),f&&(e.lastModified[S]=f),f=F.getResponseHeader("etag"),f&&(e.etag[S]=f)),t===204||L.type==="HEAD"?l="nocontent":t===304?l="notmodified":(l=a.state,o=a.data,u=a.error,s=!u);else{u=l;if(t||!l)l="error",t<0&&(t=0)}F.status=t,F.statusText=(n||l)+"",s?M.resolveWith(A,[o,l,F]):M.rejectWith(A,[F,l,u]),F.statusCode(D),D=undefined,N&&O.trigger(s?"ajaxSuccess":"ajaxError",[F,L,s?o:u]),_.fireWith(A,[F,l]),N&&(O.trigger("ajaxComplete",[F,L]),--e.active||e.event.trigger("ajaxStop"))}typeof f=="object"&&(m=f,f=undefined),m=m||{};var g,b,S,x,T,N,C,k,L=e.ajaxSetup({},m),A=L.context||L,O=L.context&&(A.nodeType||A.jquery)?e(A):e.event,M=e.Deferred(),_=e.Callbacks("once memory"),D=L.statusCode||{},P={},H={},B=0,j="canceled",F={readyState:0,getResponseHeader:function(e){var t;if(B===2){if(!k){k={};while(t=a.exec(x))k[t[1].toLowerCase()]=t[2]}t=k[e.toLowerCase()]}return t==null?null:t},getAllResponseHeaders:function(){return B===2?x:null},setRequestHeader:function(e,t){var n=e.toLowerCase();return B||(e=H[n]=H[n]||e,P[e]=t),this},overrideMimeType:function(e){return B||(L.mimeType=e),this},statusCode:function(e){var t;if(e)if(B<2)for(t in e)D[t]=[D[t],e[t]];else F.always(e[F.status]);return this},abort:function(e){var t=e||j;return C&&C.abort(t),q(0,t),this}};M.promise(F).complete=_.add,F.success=F.done,F.error=F.fail,L.url=((f||L.url||s)+"").replace(o,"").replace(c,i[1]+"//"),L.type=m.method||m.type||L.method||L.type,L.dataTypes=e.trim(L.dataType||"*").toLowerCase().match(t)||[""],L.crossDomain==null&&(g=h.exec(L.url.toLowerCase()),L.crossDomain=!(!g||g[1]===i[1]&&g[2]===i[2]&&(g[3]||(g[1]==="http:"?"80":"443"))===(i[3]||(i[1]==="http:"?"80":"443")))),L.data&&L.processData&&typeof L.data!="string"&&(L.data=e.param(L.data,L.traditional)),y(p,L,m,F);if(B===2)return F;N=L.global,N&&e.active++===0&&e.event.trigger("ajaxStart"),L.type=L.type.toUpperCase(),L.hasContent=!l.test(L.type),S=L.url,L.hasContent||(L.data&&(S=L.url+=(r.test(S)?"&":"?")+L.data,delete L.data),L.cache===!1&&(L.url=u.test(S)?S.replace(u,"$1_="+n++):S+(r.test(S)?"&":"?")+"_="+n++)),L.ifModified&&(e.lastModified[S]&&F.setRequestHeader("If-Modified-Since",e.lastModified[S]),e.etag[S]&&F.setRequestHeader("If-None-Match",e.etag[S])),(L.data&&L.hasContent&&L.contentType!==!1||m.contentType)&&F.setRequestHeader("Content-Type",L.contentType),F.setRequestHeader("Accept",L.dataTypes[0]&&L.accepts[L.dataTypes[0]]?L.accepts[L.dataTypes[0]]+(L.dataTypes[0]!=="*"?", "+v+"; q=0.01":""):L.accepts["*"]);for(b in L.headers)F.setRequestHeader(b,L.headers[b]);if(!L.beforeSend||L.beforeSend.call(A,F,L)!==!1&&B!==2){j="abort";for(b in{success:1,error:1,complete:1})F[b](L[b]);C=y(d,L,m,F);if(!C)q(-1,"No Transport");else{F.readyState=1,N&&O.trigger("ajaxSend",[F,L]),L.async&&L.timeout>0&&(T=setTimeout(function(){F.abort("timeout")},L.timeout));try{B=1,C.send(P,q)}catch(I){if(!(B<2))throw I;q(-1,I)}}return F}return F.abort()},getJSON:function(t,n,r){return e.get(t,n,r,"json")},getScript:function(t,n){return e.get(t,undefined,n,"script")}}),e.each(["get","post"],function(t,n){e[n]=function(t,r,i,s){return e.isFunction(r)&&(s=s||i,i=r,r=undefined),e.ajax({url:t,type:n,dataType:s,data:r,success:i})}}),e.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(t,n){e.fn[n]=function(e){return this.on(n,e)}}),e});