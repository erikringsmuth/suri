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

define(["require","exports","module","../worker/worker_client","../lib/oop","./text","./text_highlight_rules","./xquery/jsoniq_lexer","../range","./behaviour/xquery","./folding/cstyle","../anchor","../ext/language_tools"],function(e,t,n){var r=e("../worker/worker_client").WorkerClient,i=e("../lib/oop"),s=e("./text").Mode,o=e("./text_highlight_rules").TextHighlightRules,u=e("./xquery/jsoniq_lexer").JSONiqLexer,a=e("../range").Range,f=e("./behaviour/xquery").XQueryBehaviour,l=e("./folding/cstyle").FoldMode,c=e("../anchor").Anchor,h=e("../ext/language_tools"),p=function(){this.$tokenizer=new u,this.$behaviour=new f,this.foldingRules=new l,this.$highlightRules=new o};i.inherits(p,s),function(){h.addCompleter({getCompletions:function(e,t,n,r,i){t.$worker.emit("complete",{data:{pos:n,prefix:r}}),t.$worker.on("complete",function(e){i(null,e.data)})}}),this.getNextLineIndent=function(e,t,n){var r=this.$getIndent(t),i=t.match(/\s*(?:then|else|return|[{\(]|<\w+>)\s*$/);return i&&(r+=n),r},this.checkOutdent=function(e,t,n){return/^\s+$/.test(t)?/^\s*[\}\)]/.test(n):!1},this.autoOutdent=function(e,t,n){var r=t.getLine(n),i=r.match(/^(\s*[\}\)])/);if(!i)return 0;var s=i[1].length,o=t.findMatchingBracket({row:n,column:s});if(!o||o.row==n)return 0;var u=this.$getIndent(t.getLine(o.row));t.replace(new a(n,0,n,s-1),u)},this.toggleCommentLines=function(e,t,n,r){var i,s,o=!0,u=/^\s*\(:(.*):\)/;for(i=n;i<=r;i++)if(!u.test(t.getLine(i))){o=!1;break}var f=new a(0,0,0,0);for(i=n;i<=r;i++)s=t.getLine(i),f.start.row=i,f.end.row=i,f.end.column=s.length,t.replace(f,o?s.match(u)[1]:"(:"+s+":)")},this.createWorker=function(e){var t=new r(["ace"],"ace/mode/xquery_worker","XQueryWorker"),n=this;return t.attachToDocument(e.getDocument()),t.on("ok",function(t){e.clearAnnotations()}),t.on("markers",function(t){e.clearAnnotations(),n.addMarkers(t.data,e)}),t},this.removeMarkers=function(e){var t=e.getMarkers(!1);for(var n in t)t[n].clazz.indexOf("language_highlight_")===0&&e.removeMarker(n);for(var r=0;r<e.markerAnchors.length;r++)e.markerAnchors[r].detach();e.markerAnchors=[]},this.addMarkers=function(e,t){var n=this;t.markerAnchors||(t.markerAnchors=[]),this.removeMarkers(t),t.languageAnnos=[],e.forEach(function(e){function u(i){r&&t.removeMarker(r),o.row=n.row;if(e.pos.sc!==undefined&&e.pos.ec!==undefined){var s=new a(e.pos.sl,e.pos.sc,e.pos.el,e.pos.ec);r=t.addMarker(s,"language_highlight_"+(e.type?e.type:"default"))}i&&t.setAnnotations(t.languageAnnos)}var n=new c(t.getDocument(),e.pos.sl,e.pos.sc||0);t.markerAnchors.push(n);var r,i=e.pos.ec-e.pos.sc,s=e.pos.el-e.pos.sl,o={guttertext:e.message,type:e.level||"warning",text:e.message};u(),n.on("change",function(){u(!0)}),e.message&&t.languageAnnos.push(o)}),t.setAnnotations(t.languageAnnos)},this.$id="ace/mode/jsoniq"}.call(p.prototype),t.Mode=p});