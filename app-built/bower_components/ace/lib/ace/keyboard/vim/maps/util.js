define(["require","exports","module","../registers","../../../lib/dom"],function(e,t,n){var r=e("../registers"),i=e("../../../lib/dom");i.importCssString(".insert-mode .ace_cursor{    border-left: 2px solid #333333;}.ace_dark.insert-mode .ace_cursor{    border-left: 2px solid #eeeeee;}.normal-mode .ace_cursor{    border: 0!important;    background-color: red;    opacity: 0.5;}","vimMode"),n.exports={onVisualMode:!1,onVisualLineMode:!1,currentMode:"normal",noMode:function(e){e.unsetStyle("insert-mode"),e.unsetStyle("normal-mode"),e.commands.recording&&e.commands.toggleRecording(e),e.setOverwrite(!1)},insertMode:function(e){this.currentMode="insert",e.setStyle("insert-mode"),e.unsetStyle("normal-mode"),e.setOverwrite(!1),e.keyBinding.$data.buffer="",e.keyBinding.$data.vimState="insertMode",this.onVisualMode=!1,this.onVisualLineMode=!1,this.onInsertReplaySequence?(e.commands.macro=this.onInsertReplaySequence,e.commands.replay(e),this.onInsertReplaySequence=null,this.normalMode(e)):(e._emit("changeStatus"),e.commands.recording||e.commands.toggleRecording(e))},normalMode:function(e){this.currentMode="normal",e.unsetStyle("insert-mode"),e.setStyle("normal-mode"),e.clearSelection();var t;return e.getOverwrite()||(t=e.getCursorPosition(),t.column>0&&e.navigateLeft()),e.setOverwrite(!0),e.keyBinding.$data.buffer="",e.keyBinding.$data.vimState="start",this.onVisualMode=!1,this.onVisualLineMode=!1,e._emit("changeStatus"),e.commands.recording?(e.commands.toggleRecording(e),e.commands.macro):[]},visualMode:function(e,t){if(this.onVisualLineMode&&t||this.onVisualMode&&!t){this.normalMode(e);return}e.setStyle("insert-mode"),e.unsetStyle("normal-mode"),e._emit("changeStatus"),t?this.onVisualLineMode=!0:(this.onVisualMode=!0,this.onVisualLineMode=!1)},getRightNthChar:function(e,t,n,r){var i=e.getSession().getLine(t.row),s=i.substr(t.column+1).split(n);return r<s.length?s.slice(0,r).join(n).length:null},getLeftNthChar:function(e,t,n,r){var i=e.getSession().getLine(t.row),s=i.substr(0,t.column).split(n);return r<s.length?s.slice(-1*r).join(n).length:null},toRealChar:function(e){return e.length===1?e:/^shift-./.test(e)?e[e.length-1].toUpperCase():""},copyLine:function(e){var t=e.getCursorPosition();e.selection.moveTo(t.row,t.column),e.selection.selectLine(),r._default.isLine=!0,r._default.text=e.getCopyText().replace(/\n$/,""),e.selection.moveTo(t.row,t.column)}}});