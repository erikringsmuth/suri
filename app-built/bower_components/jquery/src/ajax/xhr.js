define(["../core","../var/support","../ajax"],function(e,t){function s(){try{return new window.XMLHttpRequest}catch(e){}}function o(){try{return new window.ActiveXObject("Microsoft.XMLHTTP")}catch(e){}}e.ajaxSettings.xhr=window.ActiveXObject!==undefined?function(){return!this.isLocal&&/^(get|post|head|put|delete|options)$/i.test(this.type)&&s()||o()}:s;var n=0,r={},i=e.ajaxSettings.xhr();window.ActiveXObject&&e(window).on("unload",function(){for(var e in r)r[e](undefined,!0)}),t.cors=!!i&&"withCredentials"in i,i=t.ajax=!!i,i&&e.ajaxTransport(function(i){if(!i.crossDomain||t.cors){var s;return{send:function(t,o){var u,a=i.xhr(),f=++n;a.open(i.type,i.url,i.async,i.username,i.password);if(i.xhrFields)for(u in i.xhrFields)a[u]=i.xhrFields[u];i.mimeType&&a.overrideMimeType&&a.overrideMimeType(i.mimeType),!i.crossDomain&&!t["X-Requested-With"]&&(t["X-Requested-With"]="XMLHttpRequest");for(u in t)t[u]!==undefined&&a.setRequestHeader(u,t[u]+"");a.send(i.hasContent&&i.data||null),s=function(t,n){var u,l,c;if(s&&(n||a.readyState===4)){delete r[f],s=undefined,a.onreadystatechange=e.noop;if(n)a.readyState!==4&&a.abort();else{c={},u=a.status,typeof a.responseText=="string"&&(c.text=a.responseText);try{l=a.statusText}catch(h){l=""}!u&&i.isLocal&&!i.crossDomain?u=c.text?200:404:u===1223&&(u=204)}}c&&o(u,l,c,a.getAllResponseHeaders())},i.async?a.readyState===4?setTimeout(s):a.onreadystatechange=r[f]=s:s()},abort:function(){s&&s(undefined,!0)}}}})});