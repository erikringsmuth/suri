/* toSource by Marcello Bastea-Forte - zlib license */

define([],function(){function t(t){return/^[a-z_$][0-9a-z_$]*$/gi.test(t)&&!e.test(t)}var e=/^(abstract|boolean|break|byte|case|catch|char|class|const|continue|debugger|default|delete|do|double|else|enum|export|extends|false|final|finally|float|for|function|goto|if|implements|import|in|instanceof|int|interface|long|native|new|null|package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|throws|transient|true|try|typeof|undefined|var|void|volatile|while|with)$/;return function(e,n,r,i){function o(e,n,r,i){function a(e){return r.slice(1)+e.join(","+(r&&"\n")+u)+(r?" ":"")}var u=i+r;e=n?n(e):e;switch(typeof e){case"string":return JSON.stringify(e);case"boolean":case"number":case"function":case"undefined":return""+e}if(e===null)return"null";if(e instanceof RegExp)return e.toString();if(e instanceof Date)return"new Date("+e.getTime()+")";if(s.indexOf(e)>=0)return"{$circularReference:1}";s.push(e);if(Array.isArray(e))return"["+a(e.map(function(e){return o(e,n,r,u)}))+"]";var f=Object.keys(e);return f.length?"{"+a(f.map(function(i){return(t(i)?i:JSON.stringify(i))+":"+o(e[i],n,r,u)}))+"}":"{}"}var s=[];return o(e,n,r===undefined?"  ":r||"",i||"")}});