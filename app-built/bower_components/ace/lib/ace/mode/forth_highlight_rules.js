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

define(["require","exports","module","../lib/oop","./text_highlight_rules"],function(e,t,n){var r=e("../lib/oop"),i=e("./text_highlight_rules").TextHighlightRules,s=function(){this.$rules={start:[{include:"#forth"}],"#comment":[{token:"comment.line.double-dash.forth",regex:"(?:^|\\s)--\\s.*$",comment:"line comments for iForth"},{token:"comment.line.backslash.forth",regex:"(?:^|\\s)\\\\[\\s\\S]*$",comment:"ANSI line comment"},{token:"comment.line.backslash-g.forth",regex:"(?:^|\\s)\\\\[Gg] .*$",comment:"gForth line comment"},{token:"comment.block.forth",regex:"(?:^|\\s)\\(\\*(?=\\s|$)",push:[{token:"comment.block.forth",regex:"(?:^|\\s)\\*\\)(?=\\s|$)",next:"pop"},{defaultToken:"comment.block.forth"}],comment:"multiline comments for iForth"},{token:"comment.block.documentation.forth",regex:"\\bDOC\\b",caseInsensitive:!0,push:[{token:"comment.block.documentation.forth",regex:"\\bENDDOC\\b",caseInsensitive:!0,next:"pop"},{defaultToken:"comment.block.documentation.forth"}],comment:"documentation comments for iForth"},{token:"comment.line.parentheses.forth",regex:"(?:^|\\s)\\.?\\( [^)]*\\)",comment:"ANSI line comment"}],"#constant":[{token:"constant.language.forth",regex:"(?:^|\\s)(?:TRUE|FALSE|BL|PI|CELL|C/L|R/O|W/O|R/W)(?=\\s|$)",caseInsensitive:!0},{token:"constant.numeric.forth",regex:"(?:^|\\s)[$#%]?[-+]?[0-9]+(?:\\.[0-9]*e-?[0-9]+|\\.?[0-9a-fA-F]*)(?=\\s|$)"},{token:"constant.character.forth",regex:"(?:^|\\s)(?:[&^]\\S|(?:\"|')\\S(?:\"|'))(?=\\s|$)"}],"#forth":[{include:"#constant"},{include:"#comment"},{include:"#string"},{include:"#word"},{include:"#variable"},{include:"#storage"},{include:"#word-def"}],"#storage":[{token:"storage.type.forth",regex:"(?:^|\\s)(?:2CONSTANT|2VARIABLE|ALIAS|CONSTANT|CREATE-INTERPRET/COMPILE[:]?|CREATE|DEFER|FCONSTANT|FIELD|FVARIABLE|USER|VALUE|VARIABLE|VOCABULARY)(?=\\s|$)",caseInsensitive:!0}],"#string":[{token:"string.quoted.double.forth",regex:'(ABORT" |BREAK" |\\." |C" |0"|S\\\\?" )([^"]+")',caseInsensitive:!0},{token:"string.unquoted.forth",regex:"(?:INCLUDE|NEEDS|REQUIRE|USE)[ ]\\S+(?=\\s|$)",caseInsensitive:!0}],"#variable":[{token:"variable.language.forth",regex:"\\b(?:I|J)\\b",caseInsensitive:!0}],"#word":[{token:"keyword.control.immediate.forth",regex:"(?:^|\\s)\\[(?:\\?DO|\\+LOOP|AGAIN|BEGIN|DEFINED|DO|ELSE|ENDIF|FOR|IF|IFDEF|IFUNDEF|LOOP|NEXT|REPEAT|THEN|UNTIL|WHILE)\\](?=\\s|$)",caseInsensitive:!0},{token:"keyword.other.immediate.forth",regex:"(?:^|\\s)(?:COMPILE-ONLY|IMMEDIATE|IS|RESTRICT|TO|WHAT'S|])(?=\\s|$)",caseInsensitive:!0},{token:"keyword.control.compile-only.forth",regex:'(?:^|\\s)(?:-DO|\\-LOOP|\\?DO|\\?LEAVE|\\+DO|\\+LOOP|ABORT\\"|AGAIN|AHEAD|BEGIN|CASE|DO|ELSE|ENDCASE|ENDIF|ENDOF|ENDTRY\\-IFERROR|ENDTRY|FOR|IF|IFERROR|LEAVE|LOOP|NEXT|RECOVER|REPEAT|RESTORE|THEN|TRY|U\\-DO|U\\+DO|UNTIL|WHILE)(?=\\s|$)',caseInsensitive:!0},{token:"keyword.other.compile-only.forth",regex:"(?:^|\\s)(?:\\?DUP-0=-IF|\\?DUP-IF|\\)|\\[|\\['\\]|\\[CHAR\\]|\\[COMPILE\\]|\\[IS\\]|\\[TO\\]|<COMPILATION|<INTERPRETATION|ASSERT\\(|ASSERT0\\(|ASSERT1\\(|ASSERT2\\(|ASSERT3\\(|COMPILATION>|DEFERS|DOES>|INTERPRETATION>|OF|POSTPONE)(?=\\s|$)",caseInsensitive:!0},{token:"keyword.other.non-immediate.forth",regex:"(?:^|\\s)(?:'|<IS>|<TO>|CHAR|END-STRUCT|INCLUDE[D]?|LOAD|NEEDS|REQUIRE[D]?|REVISION|SEE|STRUCT|THRU|USE)(?=\\s|$)",caseInsensitive:!0},{token:"keyword.other.warning.forth",regex:'(?:^|\\s)(?:~~|BREAK:|BREAK"|DBG)(?=\\s|$)',caseInsensitive:!0}],"#word-def":[{token:["keyword.other.compile-only.forth","keyword.other.compile-only.forth","meta.block.forth","entity.name.function.forth"],regex:"(:NONAME)|(^:|\\s:)(\\s)(\\S+)(?=\\s|$)",caseInsensitive:!0,push:[{token:"keyword.other.compile-only.forth",regex:";(?:CODE)?",caseInsensitive:!0,next:"pop"},{include:"#constant"},{include:"#comment"},{include:"#string"},{include:"#word"},{include:"#variable"},{include:"#storage"},{defaultToken:"meta.block.forth"}]}]},this.normalizeRules()};s.metaData={fileTypes:["frt","fs","ldr"],foldingStartMarker:"/\\*\\*|\\{\\s*$",foldingStopMarker:"\\*\\*/|^\\s*\\}",keyEquivalent:"^~F",name:"Forth",scopeName:"source.forth"},r.inherits(s,i),t.ForthHighlightRules=s});