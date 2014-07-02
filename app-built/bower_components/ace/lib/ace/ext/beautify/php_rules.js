/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2012, Ajax.org B.V.
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

define(["require","exports","module","ace/token_iterator"],function(e,t,n){var r=e("ace/token_iterator").TokenIterator;t.newLines=[{type:"support.php_tag",value:"<?php"},{type:"support.php_tag",value:"<?"},{type:"support.php_tag",value:"?>"},{type:"paren.lparen",value:"{",indent:!0},{type:"paren.rparen",breakBefore:!0,value:"}",indent:!1},{type:"paren.rparen",breakBefore:!0,value:"})",indent:!1,dontBreak:!0},{type:"comment"},{type:"text",value:";"},{type:"text",value:":",context:"php"},{type:"keyword",value:"case",indent:!0,dontBreak:!0},{type:"keyword",value:"default",indent:!0,dontBreak:!0},{type:"keyword",value:"break",indent:!1,dontBreak:!0},{type:"punctuation.doctype.end",value:">"},{type:"meta.tag.punctuation.end",value:">"},{type:"meta.tag.punctuation.begin",value:"<",blockTag:!0,indent:!0,dontBreak:!0},{type:"meta.tag.punctuation.begin",value:"</",indent:!1,breakBefore:!0,dontBreak:!0},{type:"punctuation.operator",value:";"}],t.spaces=[{type:"xml-pe",prepend:!0},{type:"entity.other.attribute-name",prepend:!0},{type:"storage.type",value:"var",append:!0},{type:"storage.type",value:"function",append:!0},{type:"keyword.operator",value:"="},{type:"keyword",value:"as",prepend:!0,append:!0},{type:"keyword",value:"function",append:!0},{type:"support.function",next:/[^\(]/,append:!0},{type:"keyword",value:"or",append:!0,prepend:!0},{type:"keyword",value:"and",append:!0,prepend:!0},{type:"keyword",value:"case",append:!0},{type:"keyword.operator",value:"||",append:!0,prepend:!0},{type:"keyword.operator",value:"&&",append:!0,prepend:!0}],t.singleTags=["!doctype","area","base","br","hr","input","img","link","meta"],t.transform=function(e,n,r){var i=e.getCurrentToken(),s=t.newLines,o=t.spaces,u=t.singleTags,a="",f=0,l=!1,c,h,p={},d,v={},m=!1,g="";while(i!==null){console.log(i);if(!i){i=e.stepForward();continue}i.type=="support.php_tag"&&i.value!="?>"?r="php":i.type=="support.php_tag"&&i.value=="?>"?r="html":i.type=="meta.tag.name.style"&&r!="css"?r="css":i.type=="meta.tag.name.style"&&r=="css"?r="html":i.type=="meta.tag.name.script"&&r!="js"?r="js":i.type=="meta.tag.name.script"&&r=="js"&&(r="html"),v=e.stepForward(),v&&v.type.indexOf("meta.tag.name")==0&&(d=v.value),p.type=="support.php_tag"&&p.value=="<?="&&(l=!0),i.type=="meta.tag.name"&&(i.value=i.value.toLowerCase()),i.type=="text"&&(i.value=i.value.trim());if(!i.value){i=v;continue}g=i.value;for(var y in o)i.type==o[y].type&&(!o[y].value||i.value==o[y].value)&&v&&(!o[y].next||o[y].next.test(v.value))&&(o[y].prepend&&(g=" "+i.value),o[y].append&&(g+=" "));i.type.indexOf("meta.tag.name")==0&&(c=i.value),m=!1;for(y in s)if(i.type==s[y].type&&(!s[y].value||i.value==s[y].value)&&(!s[y].blockTag||u.indexOf(d)===-1)&&(!s[y].context||s[y].context===r)){s[y].indent===!1&&f--;if(s[y].breakBefore&&(!s[y].prev||s[y].prev.test(p.value))){a+="\n",m=!0;for(y=0;y<f;y++)a+="	"}break}if(l===!1)for(y in s)if(p.type==s[y].type&&(!s[y].value||p.value==s[y].value)&&(!s[y].blockTag||u.indexOf(c)===-1)&&(!s[y].context||s[y].context===r)){s[y].indent===!0&&f++;if(!s[y].dontBreak&&!m){a+="\n";for(y=0;y<f;y++)a+="	"}break}a+=g,p.type=="support.php_tag"&&p.value=="?>"&&(l=!1),h=c,p=i,i=v;if(i===null)break}return a}});