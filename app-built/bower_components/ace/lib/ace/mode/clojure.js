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

define(["require","exports","module","../lib/oop","./text","./clojure_highlight_rules","./matching_parens_outdent"],function(e,t,n){var r=e("../lib/oop"),i=e("./text").Mode,s=e("./clojure_highlight_rules").ClojureHighlightRules,o=e("./matching_parens_outdent").MatchingParensOutdent,u=function(){this.HighlightRules=s,this.$outdent=new o};r.inherits(u,i),function(){this.lineCommentStart=";",this.minorIndentFunctions=["defn","defn-","defmacro","def","deftest","testing"],this.$toIndent=function(e){return e.split("").map(function(e){return/\s/.exec(e)?e:" "}).join("")},this.$calculateIndent=function(e,t){var n=this.$getIndent(e),r=0,i,s;for(var o=e.length-1;o>=0;o--){s=e[o],s==="("?(r--,i=!0):s==="("||s==="["||s==="{"?(r--,i=!1):(s===")"||s==="]"||s==="}")&&r++;if(r<0)break}if(!(r<0&&i))return r<0&&!i?this.$toIndent(e.substring(0,o+1)):r>0?(n=n.substring(0,n.length-t.length),n):n;o+=1;var u=o,a="";for(;;){s=e[o];if(s===" "||s==="	")return this.minorIndentFunctions.indexOf(a)!==-1?this.$toIndent(e.substring(0,u-1)+t):this.$toIndent(e.substring(0,o+1));if(s===undefined)return this.$toIndent(e.substring(0,u-1)+t);a+=e[o],o++}},this.getNextLineIndent=function(e,t,n){return this.$calculateIndent(t,n)},this.checkOutdent=function(e,t,n){return this.$outdent.checkOutdent(t,n)},this.autoOutdent=function(e,t,n){this.$outdent.autoOutdent(t,n)},this.$id="ace/mode/clojure"}.call(u.prototype),t.Mode=u});