// RequireJS Router - A scalable, lazy loading, AMD router.
//
// Version: 0.7.3
// 
// The MIT License (MIT)
// Copyright (c) 2014 Erik Ringsmuth
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
// OR OTHER DEALINGS IN THE SOFTWARE.

define([],function(){var e={},t={statechange:[],routeload:[]},n="",r=function(){n!=window.location.href&&(n=window.location.href,i.fire("statechange"))},i={init:function(t){return typeof t=="undefined"&&(t={}),window.addEventListener?(window.addEventListener("popstate",r,!1),window.addEventListener("hashchange",r,!1)):(window.attachEvent("popstate",r),window.attachEvent("onhashchange",r)),t.loadCurrentRouteOnStateChange!==!1&&i.on("statechange",function(){i.loadCurrentRoute()}),t.fireInitialStateChange!==!1&&i.fire("statechange"),i},routes:{},activeRoute:{},registerRoutes:function(t){for(var n in t)t.hasOwnProperty(n)&&(i.routes[n]=t[n]);return i},on:function(n,r){return typeof t[n]=="undefined"&&(t[n]=[]),t[n].push(r),i},fire:function(n){if(t[n]){var r=Array.prototype.slice.call(arguments,1);for(var s=0;s<t[n].length;s++)t[n][s].apply(i,r)}return i},off:function(n,r){if(t[n]){var s=t[n].indexOf(r);s!==-1&&t[n].splice(s,1)}return i},loadCurrentRoute:function(){for(var t in i.routes)if(i.routes.hasOwnProperty(t)){var n=i.routes[t];if(i.testRoute(n)){i.activeRoute.active=!1,n.active=!0,i.activeRoute=n,require([n.moduleId],function(e){n.active&&i.fire("routeload",e,i.routeArguments(n,window.location.href))});break}}return i},urlPath:function(n){if(typeof e[n]!="undefined")return e[n];var r=n.split("/"),i="/"+r.splice(3,r.length-3).join("/"),s=i.split(/[\?#]/)[0],o=i.indexOf("#");if(o!==-1){var u=i.substring(o).split("?")[0];u.substring(0,2)==="#/"?s=u.substring(1):u.substring(0,3)==="#!/"&&(s=u.substring(2))}return e[n]=s,s},testRoute:function(t,n){var r=i.urlPath(n||window.location.href);if(t.path===r||t.path==="*")return!0;if(t.path instanceof RegExp)return t.path.test(r);if(t.path.indexOf("*")===-1&&t.path.indexOf(":")===-1)return!1;var s=r.split("/"),o=t.path.split("/");if(s.length!==o.length)return!1;for(var u in o)if(o.hasOwnProperty(u)){var a=o[u];if(a!==s[u]&&a!=="*"&&a.charAt(0)!==":")return!1}return!0},routeArguments:function(t,n){t||(t=i.activeRoute),n||(n=window.location.href);var r={},s=i.urlPath(n),o=s.split("/"),u=[];t&&t.path&&!(t.path instanceof RegExp)&&(u=t.path.split("/"));for(var a in u)if(u.hasOwnProperty(a)){var f=u[a];f.charAt(0)===":"&&(r[f.substring(1)]=o[a])}var l=n.indexOf("?"),c="";if(l!==-1){c=n.substring(l);var h=c.indexOf("#");h!==-1&&(c=c.substring(0,h))}var p=n.indexOf("#/"),d=n.indexOf("#!/");if(p!==-1||d!==-1){var v="";p!==-1?v=n.substring(p):v=n.substring(d),l=v.indexOf("?"),l!==-1&&(c=v.substring(l))}var m=c.substring(1).split("&");m.length===1&&m[0]===""&&(m=[]);for(var g in m)if(m.hasOwnProperty(g)){var y=m[g],b=y.split("=");r[b[0]]=b.splice(1,b.length-1).join("=")}for(var w in r){var E=r[w];E==="true"?r[w]=!0:E==="false"?r[w]=!1:!isNaN(E)&&E!==""?r[w]=+E:r[w]=decodeURIComponent(E)}return r}};return i});