/**
* vkBeautify - javascript plugin to pretty-print or minify text in XML, JSON, CSS and SQL formats.
*  
* Version - 0.99.00.beta 
* Copyright (c) 2012 Vadim Kiryukhin
* vkiryukhin @ gmail.com
* http://www.eslinstructor.net/vkbeautify/
* 
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*
*   Pretty print
*
*        vkbeautify.xml(text [,indent_pattern]);
*        vkbeautify.json(text [,indent_pattern]);
*        vkbeautify.css(text [,indent_pattern]);
*        vkbeautify.sql(text [,indent_pattern]);
*
*        @text - String; text to beatufy;
*        @indent_pattern - Integer | String;
*                Integer:  number of white spaces;
*                String:   character string to visualize indentation ( can also be a set of white spaces )
*   Minify
*
*        vkbeautify.xmlmin(text [,preserve_comments]);
*        vkbeautify.jsonmin(text);
*        vkbeautify.cssmin(text [,preserve_comments]);
*        vkbeautify.sqlmin(text);
*
*        @text - String; text to minify;
*        @preserve_comments - Bool; [optional];
*                Set this flag to true to prevent removing comments from @text ( minxml and mincss functions only. )
*
*   Examples:
*        vkbeautify.xml(text); // pretty print XML
*        vkbeautify.json(text, 4 ); // pretty print JSON
*        vkbeautify.css(text, '. . . .'); // pretty print CSS
*        vkbeautify.sql(text, '----'); // pretty print SQL
*
*        vkbeautify.xmlmin(text, true);// minify XML, preserve comments
*        vkbeautify.jsonmin(text);// minify JSON
*        vkbeautify.cssmin(text);// minify CSS, remove comments ( default )
*        vkbeautify.sqlmin(text);// minify SQL
*
*/

(function(){function e(e){var t="    ";if(isNaN(parseInt(e)))t=e;else switch(e){case 1:t=" ";break;case 2:t="  ";break;case 3:t="   ";break;case 4:t="    ";break;case 5:t="     ";break;case 6:t="      ";break;case 7:t="       ";break;case 8:t="        ";break;case 9:t="         ";break;case 10:t="          ";break;case 11:t="           ";break;case 12:t="            "}var n=["\n"];for(ix=0;ix<100;ix++)n.push(n[ix]+t);return n}function t(){this.step="    ",this.shift=e(this.step)}function n(e,t){return t-(e.replace(/\(/g,"").length-e.replace(/\)/g,"").length)}function r(e,t){return e.replace(/\s{1,}/g," ").replace(/ AND /ig,"~::~"+t+t+"AND ").replace(/ BETWEEN /ig,"~::~"+t+"BETWEEN ").replace(/ CASE /ig,"~::~"+t+"CASE ").replace(/ ELSE /ig,"~::~"+t+"ELSE ").replace(/ END /ig,"~::~"+t+"END ").replace(/ FROM /ig,"~::~FROM ").replace(/ GROUP\s{1,}BY/ig,"~::~GROUP BY ").replace(/ HAVING /ig,"~::~HAVING ").replace(/ IN /ig," IN ").replace(/ JOIN /ig,"~::~JOIN ").replace(/ CROSS~::~{1,}JOIN /ig,"~::~CROSS JOIN ").replace(/ INNER~::~{1,}JOIN /ig,"~::~INNER JOIN ").replace(/ LEFT~::~{1,}JOIN /ig,"~::~LEFT JOIN ").replace(/ RIGHT~::~{1,}JOIN /ig,"~::~RIGHT JOIN ").replace(/ ON /ig,"~::~"+t+"ON ").replace(/ OR /ig,"~::~"+t+t+"OR ").replace(/ ORDER\s{1,}BY/ig,"~::~ORDER BY ").replace(/ OVER /ig,"~::~"+t+"OVER ").replace(/\(\s{0,}SELECT /ig,"~::~(SELECT ").replace(/\)\s{0,}SELECT /ig,")~::~SELECT ").replace(/ THEN /ig," THEN~::~"+t+"").replace(/ UNION /ig,"~::~UNION~::~").replace(/ USING /ig,"~::~USING ").replace(/ WHEN /ig,"~::~"+t+"WHEN ").replace(/ WHERE /ig,"~::~WHERE ").replace(/ WITH /ig,"~::~WITH ").replace(/ ALL /ig," ALL ").replace(/ AS /ig," AS ").replace(/ ASC /ig," ASC ").replace(/ DESC /ig," DESC ").replace(/ DISTINCT /ig," DISTINCT ").replace(/ EXISTS /ig," EXISTS ").replace(/ NOT /ig," NOT ").replace(/ NULL /ig," NULL ").replace(/ LIKE /ig," LIKE ").replace(/\s{0,}SELECT /ig,"SELECT ").replace(/\s{0,}UPDATE /ig,"UPDATE ").replace(/ SET /ig," SET ").replace(/~::~{1,}/g,"~::~").split("~::~")}t.prototype.xml=function(t,n){var r=t.replace(/>\s{0,}</g,"><").replace(/</g,"~::~<").replace(/\s*xmlns\:/g,"~::~xmlns:").replace(/\s*xmlns\=/g,"~::~xmlns=").split("~::~"),i=r.length,s=!1,o=0,u="",a=0,f=n?e(n):this.shift;for(a=0;a<i;a++)if(r[a].search(/<!/)>-1){u+=f[o]+r[a],s=!0;if(r[a].search(/-->/)>-1||r[a].search(/\]>/)>-1||r[a].search(/!DOCTYPE/)>-1)s=!1}else r[a].search(/-->/)>-1||r[a].search(/\]>/)>-1?(u+=r[a],s=!1):/^<\w/.exec(r[a-1])&&/^<\/\w/.exec(r[a])&&/^<[\w:\-\.\,]+/.exec(r[a-1])==/^<\/[\w:\-\.\,]+/.exec(r[a])[0].replace("/","")?(u+=r[a],s||o--):r[a].search(/<\w/)>-1&&r[a].search(/<\//)==-1&&r[a].search(/\/>/)==-1?u=s?u+=r[a]:u+=f[o++]+r[a]:r[a].search(/<\w/)>-1&&r[a].search(/<\//)>-1?u=s?u+=r[a]:u+=f[o]+r[a]:r[a].search(/<\//)>-1?u=s?u+=r[a]:u+=f[--o]+r[a]:r[a].search(/\/>/)>-1?u=s?u+=r[a]:u+=f[o]+r[a]:r[a].search(/<\?/)>-1?u+=f[o]+r[a]:r[a].search(/xmlns\:/)>-1||r[a].search(/xmlns\=/)>-1?u+=f[o]+r[a]:u+=r[a];return u[0]=="\n"?u.slice(1):u},t.prototype.json=function(e,t){var t=t?t:this.step;return typeof JSON=="undefined"?e:typeof e=="string"?JSON.stringify(JSON.parse(e),null,t):typeof e=="object"?JSON.stringify(e,null,t):e},t.prototype.css=function(t,n){var r=t.replace(/\s{1,}/g," ").replace(/\{/g,"{~::~").replace(/\}/g,"~::~}~::~").replace(/\;/g,";~::~").replace(/\/\*/g,"~::~/*").replace(/\*\//g,"*/~::~").replace(/~::~\s{0,}~::~/g,"~::~").split("~::~"),i=r.length,s=0,o="",u=0,a=n?e(n):this.shift;for(u=0;u<i;u++)/\{/.exec(r[u])?o+=a[s++]+r[u]:/\}/.exec(r[u])?o+=a[--s]+r[u]:/\*\\/.exec(r[u])?o+=a[s]+r[u]:o+=a[s]+r[u];return o.replace(/^\n{1,}/,"")},t.prototype.sql=function(t,i){var s=t.replace(/\s{1,}/g," ").replace(/\'/ig,"~::~'").split("~::~"),o=s.length,u=[],a=0,f=this.step,l=!0,c=!1,h=0,p="",d=0,v=i?e(i):this.shift;for(d=0;d<o;d++)d%2?u=u.concat(s[d]):u=u.concat(r(s[d],f));o=u.length;for(d=0;d<o;d++){h=n(u[d],h),/\s{0,}\s{0,}SELECT\s{0,}/.exec(u[d])&&(u[d]=u[d].replace(/\,/g,",\n"+f+f+"")),/\s{0,}\s{0,}SET\s{0,}/.exec(u[d])&&(u[d]=u[d].replace(/\,/g,",\n"+f+f+"")),/\s{0,}\(\s{0,}SELECT\s{0,}/.exec(u[d])?(a++,p+=v[a]+u[d]):/\'/.exec(u[d])?(h<1&&a&&a--,p+=u[d]):(p+=v[a]+u[d],h<1&&a&&a--);var m=0}return p=p.replace(/^\n{1,}/,"").replace(/\n{1,}/g,"\n"),p},t.prototype.xmlmin=function(e,t){var n=t?e:e.replace(/\<![ \r\n\t]*(--([^\-]|[\r\n]|-[^\-])*--[ \r\n\t]*)\>/g,"").replace(/[ \r\n\t]{1,}xmlns/g," xmlns");return n.replace(/>\s{0,}</g,"><")},t.prototype.jsonmin=function(e){return typeof JSON=="undefined"?e:JSON.stringify(JSON.parse(e),null,0)},t.prototype.cssmin=function(e,t){var n=t?e:e.replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//g,"");return n.replace(/\s{1,}/g," ").replace(/\{\s{1,}/g,"{").replace(/\}\s{1,}/g,"}").replace(/\;\s{1,}/g,";").replace(/\/\*\s{1,}/g,"/*").replace(/\*\/\s{1,}/g,"*/")},t.prototype.sqlmin=function(e){return e.replace(/\s{1,}/g," ").replace(/\s{1,}\(/,"(").replace(/\s{1,}\)/,")")},window.vkbeautify=new t})();