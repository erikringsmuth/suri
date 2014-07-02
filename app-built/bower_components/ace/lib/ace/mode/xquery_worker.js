/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

define(["require","exports","module","../lib/oop","../worker/mirror","./xquery/xqlint","./xquery/modules"],function(e,t,n){var r=e("../lib/oop"),i=e("../worker/mirror").Mirror,s=e("./xquery/xqlint"),o=s.XQLint,u=e("./xquery/modules").Modules,a=function(e){return function(t){var n=e,r=n[t],i={},s={};return r.functions.forEach(function(e){s[t+"#"+e.name+"#"+e.arity]={params:[]},e.parameters.forEach(function(n){s[t+"#"+e.name+"#"+e.arity].params.push("$"+n.name)})}),r.variables.forEach(function(e){var n=e.name.substring(e.name.indexOf(":")+1);i[t+"#"+n]={type:"VarDecl",annotations:[]}}),{variables:i,functions:s}}},f=t.XQueryWorker=function(e){i.call(this,e),this.setTimeout(200),this.opts={styleCheck:!1},this.availableModuleNamespaces=Object.keys(u),this.moduleResolver=a(u);var t=this;this.sender.on("complete",function(e){if(t.xqlint){var n={line:e.data.pos.row,col:e.data.pos.column},r=t.xqlint.getCompletions(n);t.sender.emit("complete",r)}}),this.sender.on("setAvailableModuleNamespaces",function(e){t.availableModuleNamespaces=e.data}),this.sender.on("setModuleResolver",function(e){t.moduleResolver=a(e.data)})};r.inherits(f,i),function(){this.onUpdate=function(){this.sender.emit("start");var e=this.doc.getValue(),t=s.createStaticContext();this.moduleResolver&&t.setModuleResolver(this.moduleResolver),this.availableModuleNamespaces&&(t.availableModuleNamespaces=this.availableModuleNamespaces);var n={styleCheck:this.styleCheck,staticContext:t};this.xqlint=new o(e,n),this.sender.emit("markers",this.xqlint.getMarkers())}}.call(f.prototype)});