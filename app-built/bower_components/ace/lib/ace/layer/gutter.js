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

define(["require","exports","module","../lib/dom","../lib/oop","../lib/lang","../lib/event_emitter"],function(e,t,n){var r=e("../lib/dom"),i=e("../lib/oop"),s=e("../lib/lang"),o=e("../lib/event_emitter").EventEmitter,u=function(e){this.element=r.createElement("div"),this.element.className="ace_layer ace_gutter-layer",e.appendChild(this.element),this.setShowFoldWidgets(this.$showFoldWidgets),this.gutterWidth=0,this.$annotations=[],this.$updateAnnotations=this.$updateAnnotations.bind(this),this.$cells=[]};(function(){i.implement(this,o),this.setSession=function(e){this.session&&this.session.removeEventListener("change",this.$updateAnnotations),this.session=e,e.on("change",this.$updateAnnotations)},this.addGutterDecoration=function(e,t){window.console&&console.warn&&console.warn("deprecated use session.addGutterDecoration"),this.session.addGutterDecoration(e,t)},this.removeGutterDecoration=function(e,t){window.console&&console.warn&&console.warn("deprecated use session.removeGutterDecoration"),this.session.removeGutterDecoration(e,t)},this.setAnnotations=function(e){this.$annotations=[];for(var t=0;t<e.length;t++){var n=e[t],r=n.row,i=this.$annotations[r];i||(i=this.$annotations[r]={text:[]});var o=n.text;o=o?s.escapeHTML(o):n.html||"",i.text.indexOf(o)===-1&&i.text.push(o);var u=n.type;u=="error"?i.className=" ace_error":u=="warning"&&i.className!=" ace_error"?i.className=" ace_warning":u=="info"&&!i.className&&(i.className=" ace_info")}},this.$updateAnnotations=function(e){if(!this.$annotations.length)return;var t=e.data,n=t.range,r=n.start.row,i=n.end.row-r;if(i!==0)if(t.action=="removeText"||t.action=="removeLines")this.$annotations.splice(r,i+1,null);else{var s=new Array(i+1);s.unshift(r,1),this.$annotations.splice.apply(this.$annotations,s)}},this.update=function(e){var t=this.session,n=e.firstRow,i=Math.min(e.lastRow+e.gutterOffset,t.getLength()-1),s=t.getNextFoldLine(n),o=s?s.start.row:Infinity,u=this.$showFoldWidgets&&t.foldWidgets,a=t.$breakpoints,f=t.$decorations,l=t.$firstLineNumber,c=0,h=t.gutterRenderer||this.$renderer,p=null,d=-1,v=n;for(;;){v>o&&(v=s.end.row+1,s=t.getNextFoldLine(v,s),o=s?s.start.row:Infinity);if(v>i){while(this.$cells.length>d+1)p=this.$cells.pop(),this.element.removeChild(p.element);break}p=this.$cells[++d],p||(p={element:null,textNode:null,foldWidget:null},p.element=r.createElement("div"),p.textNode=document.createTextNode(""),p.element.appendChild(p.textNode),this.element.appendChild(p.element),this.$cells[d]=p);var m="ace_gutter-cell ";a[v]&&(m+=a[v]),f[v]&&(m+=f[v]),this.$annotations[v]&&(m+=this.$annotations[v].className),p.element.className!=m&&(p.element.className=m);var g=t.getRowLength(v)*e.lineHeight+"px";g!=p.element.style.height&&(p.element.style.height=g);if(u){var y=u[v];y==null&&(y=u[v]=t.getFoldWidget(v))}if(y){p.foldWidget||(p.foldWidget=r.createElement("span"),p.element.appendChild(p.foldWidget));var m="ace_fold-widget ace_"+y;y=="start"&&v==o&&v<s.end.row?m+=" ace_closed":m+=" ace_open",p.foldWidget.className!=m&&(p.foldWidget.className=m);var g=e.lineHeight+"px";p.foldWidget.style.height!=g&&(p.foldWidget.style.height=g)}else p.foldWidget&&(p.element.removeChild(p.foldWidget),p.foldWidget=null);var b=c=h?h.getText(t,v):v+l;b!=p.textNode.data&&(p.textNode.data=b),v++}this.element.style.height=e.minHeight+"px";if(this.$fixedWidth||t.$useWrapMode)c=t.getLength()+l;var w=h?h.getWidth(t,c,e):c.toString().length*e.characterWidth,E=this.$padding||this.$computePadding();w+=E.left+E.right,w!==this.gutterWidth&&!isNaN(w)&&(this.gutterWidth=w,this.element.style.width=Math.ceil(this.gutterWidth)+"px",this._emit("changeGutterWidth",w))},this.$fixedWidth=!1,this.$showLineNumbers=!0,this.$renderer="",this.setShowLineNumbers=function(e){this.$renderer=!e&&{getWidth:function(){return""},getText:function(){return""}}},this.getShowLineNumbers=function(){return this.$showLineNumbers},this.$showFoldWidgets=!0,this.setShowFoldWidgets=function(e){e?r.addCssClass(this.element,"ace_folding-enabled"):r.removeCssClass(this.element,"ace_folding-enabled"),this.$showFoldWidgets=e,this.$padding=null},this.getShowFoldWidgets=function(){return this.$showFoldWidgets},this.$computePadding=function(){if(!this.element.firstChild)return{left:0,right:0};var e=r.computedStyle(this.element.firstChild);return this.$padding={},this.$padding.left=parseInt(e.paddingLeft)+1||0,this.$padding.right=parseInt(e.paddingRight)||0,this.$padding},this.getRegion=function(e){var t=this.$padding||this.$computePadding(),n=this.element.getBoundingClientRect();if(e.x<t.left+n.left)return"markers";if(this.$showFoldWidgets&&e.x>n.right-t.right)return"foldWidgets"}}).call(u.prototype),t.Gutter=u});