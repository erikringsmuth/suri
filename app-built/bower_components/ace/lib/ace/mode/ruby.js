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

define(["require","exports","module","../lib/oop","./text","./ruby_highlight_rules","./matching_brace_outdent","../range","./folding/coffee"],function(e,t,n){var r=e("../lib/oop"),i=e("./text").Mode,s=e("./ruby_highlight_rules").RubyHighlightRules,o=e("./matching_brace_outdent").MatchingBraceOutdent,u=e("../range").Range,a=e("./folding/coffee").FoldMode,f=function(){this.HighlightRules=s,this.$outdent=new o,this.foldingRules=new a};r.inherits(f,i),function(){this.lineCommentStart="#",this.getNextLineIndent=function(e,t,n){var r=this.$getIndent(t),i=this.getTokenizer().getLineTokens(t,e),s=i.tokens;if(s.length&&s[s.length-1].type=="comment")return r;if(e=="start"){var o=t.match(/^.*[\{\(\[]\s*$/),u=t.match(/^\s*(class|def|module)\s.*$/),a=t.match(/.*do(\s*|\s+\|.*\|\s*)$/),f=t.match(/^\s*(if|else)\s*/);if(o||u||a||f)r+=n}return r},this.checkOutdent=function(e,t,n){return/^\s+(end|else)$/.test(t+n)||this.$outdent.checkOutdent(t,n)},this.autoOutdent=function(e,t,n){var r=t.getLine(n);if(/}/.test(r))return this.$outdent.autoOutdent(t,n);var i=this.$getIndent(r),s=t.getLine(n-1),o=this.$getIndent(s),a=t.getTabString();o.length<=i.length&&i.slice(-a.length)==a&&t.remove(new u(n,i.length-a.length,n,i.length))},this.$id="ace/mode/ruby"}.call(f.prototype),t.Mode=f});