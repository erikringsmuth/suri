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

define(["require","exports","module","../lib/oop","./text_highlight_rules"],function(e,t,n){var r=e("../lib/oop"),i=e("./text_highlight_rules").TextHighlightRules,s=function(){this.$rules={start:[{token:"keyword.command.dosbatch",regex:"\\b(?:append|assoc|at|attrib|break|cacls|cd|chcp|chdir|chkdsk|chkntfs|cls|cmd|color|comp|compact|convert|copy|date|del|dir|diskcomp|diskcopy|doskey|echo|endlocal|erase|fc|find|findstr|format|ftype|graftabl|help|keyb|label|md|mkdir|mode|more|move|path|pause|popd|print|prompt|pushd|rd|recover|ren|rename|replace|restore|rmdir|set|setlocal|shift|sort|start|subst|time|title|tree|type|ver|verify|vol|xcopy)\\b",caseInsensitive:!0},{token:"keyword.control.statement.dosbatch",regex:"\\b(?:goto|call|exit)\\b",caseInsensitive:!0},{token:"keyword.control.conditional.if.dosbatch",regex:"\\bif\\s+not\\s+(?:exist|defined|errorlevel|cmdextversion)\\b",caseInsensitive:!0},{token:"keyword.control.conditional.dosbatch",regex:"\\b(?:if|else)\\b",caseInsensitive:!0},{token:"keyword.control.repeat.dosbatch",regex:"\\bfor\\b",caseInsensitive:!0},{token:"keyword.operator.dosbatch",regex:"\\b(?:EQU|NEQ|LSS|LEQ|GTR|GEQ)\\b"},{token:["doc.comment","comment"],regex:"(?:^|\\b)(rem)($|\\s.*$)",caseInsensitive:!0},{token:"comment.line.colons.dosbatch",regex:"::.*$"},{include:"variable"},{token:"punctuation.definition.string.begin.shell",regex:'"',push:[{token:"punctuation.definition.string.end.shell",regex:'"',next:"pop"},{include:"variable"},{defaultToken:"string.quoted.double.dosbatch"}]},{token:"keyword.operator.pipe.dosbatch",regex:"[|]"},{token:"keyword.operator.redirect.shell",regex:"&>|\\d*>&\\d*|\\d*(?:>>|>|<)|\\d*<&|\\d*<>"}],variable:[{token:"constant.numeric",regex:"%%\\w+|%[*\\d]|%\\w+%"},{token:"constant.numeric",regex:"%~\\d+"},{token:["markup.list","constant.other","markup.list"],regex:"(%)(\\w+)(%?)"}]},this.normalizeRules()};s.metaData={name:"Batch File",scopeName:"source.dosbatch",fileTypes:["bat"]},r.inherits(s,i),t.BatchFileHighlightRules=s});