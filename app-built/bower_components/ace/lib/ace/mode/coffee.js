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

define(["require","exports","module","./coffee_highlight_rules","./matching_brace_outdent","./folding/coffee","../range","./text","../worker/worker_client","../lib/oop"],function(e,t,n){function l(){this.HighlightRules=r,this.$outdent=new i,this.foldingRules=new s}var r=e("./coffee_highlight_rules").CoffeeHighlightRules,i=e("./matching_brace_outdent").MatchingBraceOutdent,s=e("./folding/coffee").FoldMode,o=e("../range").Range,u=e("./text").Mode,a=e("../worker/worker_client").WorkerClient,f=e("../lib/oop");f.inherits(l,u),function(){var e=/(?:[({[=:]|[-=]>|\b(?:else|try|(?:swi|ca)tch(?:\s+[$A-Za-z_\x7f-\uffff][$\w\x7f-\uffff]*)?|finally))\s*$|^\s*(else\b\s*)?(?:if|for|while|loop)\b(?!.*\bthen\b)/,t=/^(\s*)#/,n=/^\s*###(?!#)/,r=/^\s*/;this.getNextLineIndent=function(t,n,r){var i=this.$getIndent(n),s=this.getTokenizer().getLineTokens(n,t).tokens;return(!s.length||s[s.length-1].type!=="comment")&&t==="start"&&e.test(n)&&(i+=r),i},this.toggleCommentLines=function(e,i,s,u){console.log("toggle");var a=new o(0,0,0,0);for(var f=s;f<=u;++f){var l=i.getLine(f);if(n.test(l))continue;t.test(l)?l=l.replace(t,"$1"):l=l.replace(r,"$&#"),a.end.row=a.start.row=f,a.end.column=l.length+1,i.replace(a,l)}},this.checkOutdent=function(e,t,n){return this.$outdent.checkOutdent(t,n)},this.autoOutdent=function(e,t,n){this.$outdent.autoOutdent(t,n)},this.createWorker=function(e){var t=new a(["ace"],"ace/mode/coffee_worker","Worker");return t.attachToDocument(e.getDocument()),t.on("error",function(t){e.setAnnotations([t.data])}),t.on("ok",function(t){e.clearAnnotations()}),t},this.$id="ace/mode/coffee"}.call(l.prototype),t.Mode=l});