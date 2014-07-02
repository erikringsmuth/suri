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

define(["require","exports","module","../snippets","../autocomplete","../config","../autocomplete/util","../autocomplete/text_completer","../editor","../config"],function(e,t,n){function v(e){var t=e.getCursorPosition(),n=e.session.getLine(t.row),r=o.retrievePrecedingIdentifier(n,t.column);return e.completers.forEach(function(e){e.identifierRegexps&&e.identifierRegexps.forEach(function(e){!r&&e&&(r=o.retrievePrecedingIdentifier(n,t.column,e))})}),r}var r=e("../snippets").snippetManager,i=e("../autocomplete").Autocomplete,s=e("../config"),o=e("../autocomplete/util"),u=e("../autocomplete/text_completer"),a={getCompletions:function(e,t,n,r,i){var s=e.session.getState(n.row),o=t.$mode.getCompletions(s,t,n,r);i(null,o)}},f={getCompletions:function(e,t,n,i,s){var o=r.snippetMap,u=[];r.getActiveScopes(e).forEach(function(e){var t=o[e]||[];for(var n=t.length;n--;){var r=t[n],i=r.name||r.tabTrigger;if(!i)continue;u.push({caption:i,snippet:r.content,meta:r.tabTrigger&&!r.name?r.tabTrigger+"⇥ ":"snippet"})}},this),s(null,u)}},l=[f,u,a];t.addCompleter=function(e){l.push(e)},t.textCompleter=u,t.keyWordCompleter=a,t.snippetCompleter=f;var c={name:"expandSnippet",exec:function(e){var t=r.expandWithTab(e);t||e.execCommand("indent")},bindKey:"Tab"},h=function(e,t){p(t.session.$mode)},p=function(e){var t=e.$id;r.files||(r.files={}),d(t),e.modes&&e.modes.forEach(p)},d=function(e){if(!e||r.files[e])return;var t=e.replace("mode","snippets");r.files[e]={},s.loadModule(t,function(t){t&&(r.files[e]=t,!t.snippets&&t.snippetText&&(t.snippets=r.parseSnippetFile(t.snippetText)),r.register(t.snippets||[],t.scope),t.includeScopes&&(r.snippetMap[t.scope].includeScopes=t.includeScopes,t.includeScopes.forEach(function(e){d("ace/mode/"+e)})))})},m=function(e){var t=e.editor,n=e.args||"",r=t.completer&&t.completer.activated;if(e.command.name==="backspace")r&&!v(t)&&t.completer.detach();else if(e.command.name==="insertstring"){var s=v(t);s&&!r?(t.completer||(t.completer=new i),t.completer.autoSelect=!1,t.completer.autoInsert=!1,t.completer.showPopup(t)):!s&&r&&t.completer.detach()}},g=e("../editor").Editor;e("../config").defineOptions(g.prototype,"editor",{enableBasicAutocompletion:{set:function(e){e?(this.completers||(this.completers=Array.isArray(e)?e:l),this.commands.addCommand(i.startCommand)):this.commands.removeCommand(i.startCommand)},value:!1},enableLiveAutocompletion:{set:function(e){e?(this.completers||(this.completers=Array.isArray(e)?e:l),this.commands.on("afterExec",m)):this.commands.removeListener("afterExec",m)},value:!1},enableSnippets:{set:function(e){e?(this.commands.addCommand(c),this.on("changeMode",h),h(null,this)):(this.commands.removeCommand(c),this.off("changeMode",h))},value:!1}})});