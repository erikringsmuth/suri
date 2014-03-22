/*!
 * Bootstrap Grunt task for parsing Less docstrings
 * http://getbootstrap.com
 * Copyright 2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

function markdown2html(e){return markdown.toHTML(e.trim()).slice(3,-4)}function Section(e,t){this.heading=e.trim(),this.id=this.heading.replace(/\s+/g,"-").toLowerCase(),this.customizable=t,this.docstring=null,this.subsections=[]}function SubSection(e){this.heading=e.trim(),this.id=this.heading.replace(/\s+/g,"-").toLowerCase(),this.variables=[]}function VarDocstring(e){this.html=markdown2html(e)}function SectionDocstring(e){this.html=markdown2html(e)}function Variable(e,t){this.name=e,this.defaultValue=t,this.docstring=null}function Tokenizer(e){this._lines=e.split("\n"),this._next=undefined}function Parser(e){this._tokenizer=new Tokenizer(e)}var markdown=require("markdown").markdown,CUSTOMIZABLE_HEADING=/^[/]{2}={2}(.*)$/,UNCUSTOMIZABLE_HEADING=/^[/]{2}-{2}(.*)$/,SUBSECTION_HEADING=/^[/]{2}={3}(.*)$/,SECTION_DOCSTRING=/^[/]{2}#{2}(.*)$/,VAR_ASSIGNMENT=/^(@[a-zA-Z0-9_-]+):[ ]*([^ ;][^;]+);[ ]*$/,VAR_DOCSTRING=/^[/]{2}[*]{2}(.*)$/;Section.prototype.addSubSection=function(e){this.subsections.push(e)},SubSection.prototype.addVar=function(e){this.variables.push(e)},Tokenizer.prototype.unshift=function(e){if(this._next!==undefined)throw new Error("Attempted to unshift twice!");this._next=e},Tokenizer.prototype._shift=function(){if(this._next!==undefined){var e=this._next;return this._next=undefined,e}if(this._lines.length<=0)return null;var t=this._lines.shift(),n=null;n=SUBSECTION_HEADING.exec(t);if(n!==null)return new SubSection(n[1]);n=CUSTOMIZABLE_HEADING.exec(t);if(n!==null)return new Section(n[1],!0);n=UNCUSTOMIZABLE_HEADING.exec(t);if(n!==null)return new Section(n[1],!1);n=SECTION_DOCSTRING.exec(t);if(n!==null)return new SectionDocstring(n[1]);n=VAR_DOCSTRING.exec(t);if(n!==null)return new VarDocstring(n[1]);var r=t.lastIndexOf("//"),i=r===-1?t:t.slice(0,r);return n=VAR_ASSIGNMENT.exec(i),n!==null?new Variable(n[1],n[2]):undefined},Tokenizer.prototype.shift=function(){for(;;){var e=this._shift();if(e===undefined)continue;return e}},Parser.prototype.parseFile=function(){var e=[];for(;;){var t=this.parseSection();if(t===null){if(this._tokenizer.shift()!==null)throw new Error("Unexpected unparsed section of file remains!");return e}e.push(t)}},Parser.prototype.parseSection=function(){var e=this._tokenizer.shift();if(e===null)return null;if(e instanceof Section){var t=this._tokenizer.shift();return t instanceof SectionDocstring?e.docstring=t:this._tokenizer.unshift(t),this.parseSubSections(e),e}throw new Error("Expected section heading; got: "+JSON.stringify(e))},Parser.prototype.parseSubSections=function(e){for(;;){var t=this.parseSubSection();if(t===null){if(e.subsections.length!==0)break;t=new SubSection(""),this.parseVars(t)}e.addSubSection(t)}e.subsections.length===1&&!e.subsections[0].heading&&e.subsections[0].variables.length===0&&(e.subsections=[])},Parser.prototype.parseSubSection=function(){var e=this._tokenizer.shift();return e instanceof SubSection?(this.parseVars(e),e):(this._tokenizer.unshift(e),null)},Parser.prototype.parseVars=function(e){for(;;){var t=this.parseVar();if(t===null)return;e.addVar(t)}},Parser.prototype.parseVar=function(){var e=this._tokenizer.shift();e instanceof VarDocstring||(this._tokenizer.unshift(e),e=null);var t=this._tokenizer.shift();return t instanceof Variable?(t.docstring=e,t):(this._tokenizer.unshift(t),null)},module.exports=Parser;