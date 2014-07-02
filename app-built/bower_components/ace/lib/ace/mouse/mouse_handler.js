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

define(["require","exports","module","../lib/event","../lib/useragent","./default_handlers","./default_gutter_handler","./mouse_event","./dragdrop_handler","../config"],function(e,t,n){var r=e("../lib/event"),i=e("../lib/useragent"),s=e("./default_handlers").DefaultHandlers,o=e("./default_gutter_handler").GutterHandler,u=e("./mouse_event").MouseEvent,a=e("./dragdrop_handler").DragdropHandler,f=e("../config"),l=function(e){var t=this;this.editor=e,new s(this),new o(this),new a(this);var n=function(t){!e.isFocused()&&e.textInput&&e.textInput.onContextMenu(t),e.focus()},u=e.renderer.getMouseEventTarget();r.addListener(u,"click",this.onMouseEvent.bind(this,"click")),r.addListener(u,"mousemove",this.onMouseMove.bind(this,"mousemove")),r.addMultiMouseDownListener(u,[400,300,250],this,"onMouseEvent"),e.renderer.scrollBarV&&(r.addMultiMouseDownListener(e.renderer.scrollBarV.inner,[400,300,250],this,"onMouseEvent"),r.addMultiMouseDownListener(e.renderer.scrollBarH.inner,[400,300,250],this,"onMouseEvent"),i.isIE&&(r.addListener(e.renderer.scrollBarV.element,"mousedown",n),r.addListener(e.renderer.scrollBarH.element,"mousemove",n))),r.addMouseWheelListener(e.container,this.onMouseWheel.bind(this,"mousewheel"));var f=e.renderer.$gutter;r.addListener(f,"mousedown",this.onMouseEvent.bind(this,"guttermousedown")),r.addListener(f,"click",this.onMouseEvent.bind(this,"gutterclick")),r.addListener(f,"dblclick",this.onMouseEvent.bind(this,"gutterdblclick")),r.addListener(f,"mousemove",this.onMouseEvent.bind(this,"guttermousemove")),r.addListener(u,"mousedown",n),r.addListener(f,"mousedown",function(t){return e.focus(),r.preventDefault(t)}),e.on("mousemove",function(n){if(t.state||t.$dragDelay||!t.$dragEnabled)return;var r=e.renderer.screenToTextCoordinates(n.x,n.y),i=e.session.selection.getRange(),s=e.renderer;!i.isEmpty()&&i.insideStart(r.row,r.column)?s.setCursorStyle("default"):s.setCursorStyle("")})};(function(){this.onMouseEvent=function(e,t){this.editor._emit(e,new u(t,this.editor))},this.onMouseMove=function(e,t){var n=this.editor._eventRegistry&&this.editor._eventRegistry.mousemove;if(!n||!n.length)return;this.editor._emit(e,new u(t,this.editor))},this.onMouseWheel=function(e,t){var n=new u(t,this.editor);n.speed=this.$scrollSpeed*2,n.wheelX=t.wheelX,n.wheelY=t.wheelY,this.editor._emit(e,n)},this.setState=function(e){this.state=e},this.captureMouse=function(e,t){this.x=e.x,this.y=e.y,this.isMousePressed=!0;var n=this.editor.renderer;n.$keepTextAreaAtCursor&&(n.$keepTextAreaAtCursor=null);var s=this,o=function(e){if(!e)return;if(i.isWebKit&&!e.which&&s.releaseMouse)return s.releaseMouse();s.x=e.clientX,s.y=e.clientY,t&&t(e),s.mouseEvent=new u(e,s.editor),s.$mouseMoved=!0},a=function(e){clearInterval(l),f(),s[s.state+"End"]&&s[s.state+"End"](e),s.state="",n.$keepTextAreaAtCursor==null&&(n.$keepTextAreaAtCursor=!0,n.$moveTextAreaToCursor()),s.isMousePressed=!1,s.$onCaptureMouseMove=s.releaseMouse=null,e&&s.onMouseEvent("mouseup",e)},f=function(){s[s.state]&&s[s.state](),s.$mouseMoved=!1};if(i.isOldIE&&e.domEvent.type=="dblclick")return setTimeout(function(){a(e)});s.$onCaptureMouseMove=o,s.releaseMouse=r.capture(this.editor.container,o,a);var l=setInterval(f,20)},this.releaseMouse=null,this.cancelContextMenu=function(){var e=function(t){if(t&&t.domEvent&&t.domEvent.type!="contextmenu")return;this.editor.off("nativecontextmenu",e),t&&t.domEvent&&r.stopEvent(t.domEvent)}.bind(this);setTimeout(e,10),this.editor.on("nativecontextmenu",e)}}).call(l.prototype),f.defineOptions(l.prototype,"mouseHandler",{scrollSpeed:{initialValue:2},dragDelay:{initialValue:i.isMac?150:0},dragEnabled:{initialValue:!0},focusTimout:{initialValue:0},tooltipFollowsMouse:{initialValue:!0}}),t.MouseHandler=l});