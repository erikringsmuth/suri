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

define([],function(){var e,t=function(t){var n,r,i;return n=t.split("/"),r=n.pop(),i=r.lastIndexOf("."),i!==-1&&(r=r.substr(0,i)),r},n=function(t){function r(e){return e.f}var n=/require\s*\(\s*(?:"([^"]+)"|'([^']+)')\s*\)/g;return function(s){var o,u,a,f,l,c,h,p,d,v;o=e.parse(s,{noStringify:!0,interpolateScripts:!1,interpolateStyles:!1}),u=[],f=[],c=[],p=[],d=o.length;while(d--)v=o[d],v&&v.t===7&&(v.e==="link"&&v.a&&v.a.rel[0]==="ractive"&&u.push(o.splice(d,1)[0]),v.e==="script"&&(!v.a||!v.a.type||v.a.type[0]==="text/javascript")&&f.push(o.splice(d,1)[0]),v.e==="style"&&(!v.a||!v.a.type||v.a.type[0]==="text/css")&&c.push(o.splice(d,1)[0]));a=u.map(function(e){var n,r;n=e.a.href&&e.a.href[0],r=e.a.name&&e.a.name[0]||t(n);if(typeof r!="string")throw new Error("Error parsing link tag");return{name:r,href:n}}),l=f.map(r).join(";");while(h=n.exec(l))p.push(h[1]||h[2]);return{template:o,imports:a,script:l,css:c.map(r).join(" "),modules:p}}}(t),r=function(t,n){var r,i,s;if(t.charAt(0)!==".")return t;r=(n||"").split("/"),i=t.split("/"),r.pop();while(s=i.shift())s===".."?r.pop():s!=="."&&r.push(s);return r.join("/")},i=function(t,n){return function(i,s,o){var u,a,f,l,c,h,p,d,v,m,g,y;s=s||{},a=s.baseUrl||"",l=s.loadImport,h=s.loadModule,m=s.onerror,u=n(i),f=function(){var t,n,r,i,a,f;t={template:u.template,css:u.css,components:c};if(u.script){try{n=new Function("component","require","Ractive",u.script)}catch(l){g="Error creating function from component script: "+l.message||l;if(!m)throw new Error(g);m(g)}try{n(r={},s.require,e)}catch(l){g="Error executing component script: "+l.message||l;if(!m)throw new Error(g);m(g)}i=r.exports;if(typeof i=="object")for(f in i)i.hasOwnProperty(f)&&(t[f]=i[f])}a=e.extend(t),o(a)},d=u.imports.length+u.modules.length;if(d){v=function(){--d||(y?f():setTimeout(f,0))};if(u.imports.length){if(!l)throw new Error('Component definition includes imports (e.g. `<link rel="ractive" href="'+u.imports[0].href+'">`) but no loadImport method was passed to rcu.make()');c={},u.imports.forEach(function(e){var n,r;n=e.name,r=t(a,e.href),l(n,r,function(e){c[n]=e,v()})})}if(u.modules.length){if(!h)throw new Error('Component definition includes modules (e.g. `require("'+u.imports[0].href+'")`) but no loadModule method was passed to rcu.make()');p={},u.modules.forEach(function(e){var n=t(e,a);h(e,n,function(t){p[e]=t,v()})})}}else setTimeout(f,0);y=!0}}(r,n),s=function(t,n,r,i){return{init:function(t){e=t},parse:t,make:n,resolve:r,getName:i}}(n,i,r,t);return s});