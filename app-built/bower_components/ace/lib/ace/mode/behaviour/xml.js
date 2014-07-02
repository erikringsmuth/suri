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

define(["require","exports","module","../../lib/oop","../behaviour","../../token_iterator"],function(e,t,n){function o(e,t){return e.type.lastIndexOf(t+".xml")>-1}var r=e("../../lib/oop"),i=e("../behaviour").Behaviour,s=e("../../token_iterator").TokenIterator,u=function(){this.add("string_dquotes","insertion",function(e,t,n,r,i){if(i=='"'||i=="'"){var u=i,a=r.doc.getTextRange(n.getSelectionRange());if(a!==""&&a!=="'"&&a!='"'&&n.getWrapBehavioursEnabled())return{text:u+a+u,selection:!1};var f=n.getCursorPosition(),l=r.doc.getLine(f.row),c=l.substring(f.column,f.column+1),h=new s(r,f.row,f.column),p=h.getCurrentToken();if(c==u&&(o(p,"attribute-value")||o(p,"string")))return{text:"",selection:[1,1]};p||(p=h.stepBackward());if(!p)return;while(o(p,"tag-whitespace")||o(p,"whitespace"))p=h.stepBackward();var d=!c||c.match(/\s/);if(o(p,"attribute-equals")&&(d||c==">")||o(p,"decl-attribute-equals")&&(d||c=="?"))return{text:u+u,selection:[1,1]}}}),this.add("string_dquotes","deletion",function(e,t,n,r,i){var s=r.doc.getTextRange(i);if(!i.isMultiLine()&&(s=='"'||s=="'")){var o=r.doc.getLine(i.start.row),u=o.substring(i.start.column+1,i.start.column+2);if(u==s)return i.end.column++,i}}),this.add("autoclosing","insertion",function(e,t,n,r,i){if(i==">"){var u=n.getCursorPosition(),a=new s(r,u.row,u.column),f=a.getCurrentToken()||a.stepBackward();if(!f||!(o(f,"tag-name")||o(f,"tag-whitespace")||o(f,"attribute-name")||o(f,"attribute-equals")||o(f,"attribute-value")))return;if(o(f,"reference.attribute-value"))return;if(o(f,"attribute-value")){var l=f.value.charAt(0);if(l=='"'||l=="'"){var c=f.value.charAt(f.value.length-1),h=a.getCurrentTokenColumn()+f.value.length;if(h>u.column||h==u.column&&l!=c)return}}while(!o(f,"tag-name"))f=a.stepBackward();var p=a.getCurrentTokenRow(),d=a.getCurrentTokenColumn();if(o(a.stepBackward(),"end-tag-open"))return;var v=f.value;p==u.row&&(v=v.substring(0,u.column-d));if(this.voidElements.hasOwnProperty(v.toLowerCase()))return;return{text:"></"+v+">",selection:[1,1]}}}),this.add("autoindent","insertion",function(e,t,n,r,i){if(i=="\n"){var s=n.getCursorPosition(),o=r.getLine(s.row),u=o.substring(s.column,s.column+2);if(u=="</"){var a=this.$getIndent(o),f=a+r.getTabString();return{text:"\n"+f+"\n"+a,selection:[1,f.length,1,f.length]}}}})};r.inherits(u,i),t.XmlBehaviour=u});