/*

	rvc.js - v0.1.5 - 2014-04-01
	==========================================================

	Next-generation DOM manipulation - http://ractivejs.org
	Follow @RactiveJS for updates

	----------------------------------------------------------

	Copyright 2014 Rich Harris

	Permission is hereby granted, free of charge, to any person
	obtaining a copy of this software and associated documentation
	files (the "Software"), to deal in the Software without
	restriction, including without limitation the rights to use,
	copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the
	Software is furnished to do so, subject to the following
	conditions:

	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	OTHER DEALINGS IN THE SOFTWARE.

*/

/*

	rcu (Ractive component utils) - 0.1.0 - 2014-04-01
	==============================================================

	Copyright 2014 Rich Harris and contributors

	Permission is hereby granted, free of charge, to any person
	obtaining a copy of this software and associated documentation
	files (the "Software"), to deal in the Software without
	restriction, including without limitation the rights to use,
	copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the
	Software is furnished to do so, subject to the following
	conditions:

	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	OTHER DEALINGS IN THE SOFTWARE.

*/

/* toSource by Marcello Bastea-Forte - zlib license */

define(["amd-loader","ractive"],function(e,t){var n=function(){var e,t=function(t){var n,r,i;return n=t.split("/"),r=n.pop(),i=r.lastIndexOf("."),i!==-1&&(r=r.substr(0,i)),r},n=function(t){function r(e){return e.f}var n=/require\s*\(\s*(?:"([^"]+)"|'([^']+)')\s*\)/g;return function(s){var o,u,a,f,l,c,h,p,d,v;o=e.parse(s,{noStringify:!0,interpolateScripts:!1,interpolateStyles:!1}),u=[],f=[],c=[],p=[],d=o.length;while(d--)v=o[d],v&&v.t===7&&(v.e==="link"&&v.a&&v.a.rel[0]==="ractive"&&u.push(o.splice(d,1)[0]),v.e==="script"&&(!v.a||!v.a.type||v.a.type[0]==="text/javascript")&&f.push(o.splice(d,1)[0]),v.e==="style"&&(!v.a||!v.a.type||v.a.type[0]==="text/css")&&c.push(o.splice(d,1)[0]));a=u.map(function(e){var n,r;n=e.a.href&&e.a.href[0],r=e.a.name&&e.a.name[0]||t(n);if(typeof r!="string")throw new Error("Error parsing link tag");return{name:r,href:n}}),l=f.map(r).join(";");while(h=n.exec(l))p.push(h[1]||h[2]);return{template:o,imports:a,script:l,css:c.map(r).join(" "),modules:p}}}(t),r=function(t,n){var r,i,s;if(t.charAt(0)!==".")return t;r=(n||"").split("/"),i=t.split("/"),r.pop();while(s=i.shift())s===".."?r.pop():s!=="."&&r.push(s);return r.join("/")},i=function(t,n){return function(i,s,o){var u,a,f,l,c,h,p,d,v,m,g,y;s=s||{},a=s.baseUrl||"",l=s.loadImport,h=s.loadModule,m=s.onerror,u=n(i),f=function(){var t,n,r,i,a,f;t={template:u.template,css:u.css,components:c};if(u.script){try{n=new Function("component","require","Ractive",u.script)}catch(l){g="Error creating function from component script: "+l.message||l;if(!m)throw new Error(g);m(g)}try{n(r={},s.require,e)}catch(l){g="Error executing component script: "+l.message||l;if(!m)throw new Error(g);m(g)}i=r.exports;if(typeof i=="object")for(f in i)i.hasOwnProperty(f)&&(t[f]=i[f])}a=e.extend(t),o(a)},d=u.imports.length+u.modules.length;if(d){v=function(){--d||(y?f():setTimeout(f,0))};if(u.imports.length){if(!l)throw new Error('Component definition includes imports (e.g. `<link rel="ractive" href="'+u.imports[0].href+'">`) but no loadImport method was passed to rcu.make()');c={},u.imports.forEach(function(e){var n,r;n=e.name,r=t(a,e.href),l(n,r,function(e){c[n]=e,v()})})}if(u.modules.length){if(!h)throw new Error('Component definition includes modules (e.g. `require("'+u.imports[0].href+'")`) but no loadModule method was passed to rcu.make()');p={},u.modules.forEach(function(e){var n=t(e,a);h(e,n,function(t){p[e]=t,v()})})}}else setTimeout(f,0);y=!0}}(r,n),s=function(t,n,r,i){return{init:function(t){e=t},parse:t,make:n,resolve:r,getName:i}}(n,i,r,t);return s}(),r=function(e){return e.init(t),function(n,r,i){e.make(r,{loadImport:function(e,t,r){n(["rvc!"+t.replace(/\.html$/,"")],r)},loadModule:function(e,t,r){n([t],r)},require:function(e){return n(e)}},i)}}(n),i=function(){function t(t){return/^[a-z_$][0-9a-z_$]*$/gi.test(t)&&!e.test(t)}var e=/^(abstract|boolean|break|byte|case|catch|char|class|const|continue|debugger|default|delete|do|double|else|enum|export|extends|false|final|finally|float|for|function|goto|if|implements|import|in|instanceof|int|interface|long|native|new|null|package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|throws|transient|true|try|typeof|undefined|var|void|volatile|while|with)$/;return function(e,n,r,i){function o(e,n,r,i){function a(e){return r.slice(1)+e.join(","+(r&&"\n")+u)+(r?" ":"")}var u=i+r;e=n?n(e):e;switch(typeof e){case"string":return JSON.stringify(e);case"boolean":case"number":case"function":case"undefined":return""+e}if(e===null)return"null";if(e instanceof RegExp)return e.toString();if(e instanceof Date)return"new Date("+e.getTime()+")";if(s.indexOf(e)>=0)return"{$circularReference:1}";s.push(e);if(Array.isArray(e))return"["+a(e.map(function(e){return o(e,n,r,u)}))+"]";var f=Object.keys(e);return f.length?"{"+a(f.map(function(i){return(t(i)?i:JSON.stringify(i))+":"+o(e[i],n,r,u)}))+"}":"{}"}var s=[];return o(e,n,r===undefined?"  ":r||"",i||"")}}(),s=function(e){return e.replace(/^\s+/gm,"")},o=function(e,t,n){return function(r,i,s){var o,u=["require","ractive"],a=["require","Ractive"],f=[],l;o=e.parse(i),o.imports.forEach(function(e,t){var n,r,i;n=e.href,r=e.name,i="_import_"+t,u.push("rvc!"+n.replace(/\.html$/,"")),a.push(i),f.push('"'+r+'":'+i)}),u=u.concat(o.modules),l='define("rvc!'+r+'",'+JSON.stringify(u)+",function("+a.join(",")+"){\n"+"  var __options__={\n    template:"+t(o.template,null,"","")+",\n"+(o.css?"    css:"+JSON.stringify(n(o.css))+",\n":"")+(o.imports.length?"    components:{"+f.join(",")+"}\n":"")+"  },\n"+"  component={};",o.script&&(l+="\n"+o.script+"\n"+'  if ( typeof component.exports === "object" ) {\n    '+"for ( __prop__ in component.exports ) {\n      "+"if ( component.exports.hasOwnProperty(__prop__) ) {\n        "+"__options__[__prop__] = component.exports[__prop__];\n      "+"}\n    "+"}\n  "+"}\n\n  "),l+="return Ractive.extend(__options__);\n});",s(l)}}(n,i,s),u=function(n,r,i){return n.init(t),e("rvc","html",function(e,t,n,s,o,u){u.isBuild?i(e,t,s):r(n,t,s)})}(n,r,o);return u});