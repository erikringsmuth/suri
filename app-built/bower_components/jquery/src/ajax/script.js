define(["../core","../ajax"],function(e){e.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(t){return e.globalEval(t),t}}}),e.ajaxPrefilter("script",function(e){e.cache===undefined&&(e.cache=!1),e.crossDomain&&(e.type="GET",e.global=!1)}),e.ajaxTransport("script",function(t){if(t.crossDomain){var n,r=document.head||e("head")[0]||document.documentElement;return{send:function(e,i){n=document.createElement("script"),n.async=!0,t.scriptCharset&&(n.charset=t.scriptCharset),n.src=t.url,n.onload=n.onreadystatechange=function(e,t){if(t||!n.readyState||/loaded|complete/.test(n.readyState))n.onload=n.onreadystatechange=null,n.parentNode&&n.parentNode.removeChild(n),n=null,t||i(200,"success")},r.insertBefore(n,r.firstChild)},abort:function(){n&&n.onload(undefined,!0)}}}})});