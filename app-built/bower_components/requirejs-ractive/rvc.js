/*

	rvc.js - v0.1.3 - 2014-02-25
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

define(["amd-loader","Ractive"],function(e,t){var n=function(t){var n,r,i;return n=t.split("/"),r=n.pop(),i=r.lastIndexOf("."),i!==-1&&(r=r.substr(0,i)),r},r=function(t){return t.f},i=function(e,n){var r=/require\s*\(\s*(?:"([^"]+)"|'([^']+)')\s*\)/g;return function(s){var o,u,a,f,l,c,h,p,d,v;o=t.parse(s,{noStringify:!0,interpolateScripts:!1,interpolateStyles:!1}),u=[],f=[],c=[],p=[],d=o.length;while(d--)v=o[d],v&&v.t===7&&(v.e==="link"&&v.a&&v.a.rel[0]==="ractive"&&u.push(o.splice(d,1)[0]),v.e==="script"&&(!v.a||!v.a.type||v.a.type[0]==="text/javascript")&&f.push(o.splice(d,1)[0]),v.e==="style"&&(!v.a||!v.a.type||v.a.type[0]==="text/css")&&c.push(o.splice(d,1)[0]));a=u.map(function(t){var n,r;n=t.a.href&&t.a.href[0],r=t.a.name&&t.a.name[0]||e(n);if(typeof r!="string")throw new Error("Error parsing link tag");return{name:r,href:n}}),l=f.map(n).join(";");while(h=r.exec(l))p.push(h[1]||h[2]);return{template:o,imports:a,script:l,css:c.map(n).join(" "),modules:p}}}(n,r),s=function(){return console&&typeof console.warn=="function"?function(){console.warn.apply(console,arguments)}:function(){}}(),o=function(n,r){return new t.Promise(function(e,t){var i={},s=r.imports.length;if(!s){e(i);return}r.imports.forEach(function(r){n(["rvc!"+r.href.replace(/\.html$/,"")],function(t){i[r.name]=t,--s||e(i)},t)})})},u=function(n,r){return new t.Promise(function(e,t){var i={};if(!r.modules.length){e(i);return}n(r.modules,function(){var t=Array.prototype.slice.call(arguments);r.modules.forEach(function(e,n){i[e]=t[n]}),e(i)},t)})},a=function(e,n,r){var i={},s;return typeof document!="undefined"&&(s=document.getElementsByTagName("head")[0]),function(u,a,f){t.Promise.all([n(u,a),r(u,a)]).then(function(n){var r,o,u,l,c,h,p;r=n[0],o=n[1],u={template:a.template,css:a.css,components:r};if(a.script){c=document.createElement("script"),c.innerHTML="(function (component, Ractive, require) {"+a.script+"}(component, Ractive, require));",i.component=window.component,i.Ractive=window.Ractive,i.require=window.require,window.component=u,window.Ractive=t,window.require=function(e){if(e in o)return o[e];throw new Error('Module "'+e+'" is not available')},s.appendChild(c),h=window.component.exports;if(typeof h=="function")e("The function form has been deprecated. Use `component.exports = {...}` instead. You can access the `Ractive` variable if you need to."),p=h(t),p.css=a.css;else if(typeof h=="object"){for(l in h)h.hasOwnProperty(l)&&(u[l]=h[l]);p=t.extend(u)}s.removeChild(c),window.component=i.component,window.Ractive=i.Ractive,window.require=i.require}else p=t.extend({template:a.template,css:a.css,components:r});f(p)})}}(s,o,u),f=function(e,t,n){var r=["require","Ractive"],i=["require","Ractive"],s=[],o;t.imports.forEach(function(e,t){var n,o,u;n=e.href,o=e.name,u="_import_"+t,r.push("rvc!"+n.replace(/\.html$/,"")),i.push(u),s.push('"'+o+'":'+u)}),r=r.concat(t.modules),o='define("rvc!'+e+'",'+JSON.stringify(r)+",function("+i.join(",")+"){"+"var __options__={template:"+JSON.stringify(t.template)+",css:"+JSON.stringify(t.css)+",components:{"+s.join(",")+"}},component={};",t.script&&(o+="\n"+t.script+"\n"+'if(typeof component.exports === "object"){'+"for(__prop__ in component.exports){"+"if(component.exports.hasOwnProperty(__prop__)){"+"__options__[__prop__]=component.exports[__prop__];"+"}"+"}"+"}"),o+="return Ractive.extend(__options__);});",n(o)},l=function(t,n,r){return e("rvc","html",function(e,i,s,o,u,a){var f=t(i);a.isBuild?r(e,f,o):n(s,f,o)})}(i,a,f);return l});