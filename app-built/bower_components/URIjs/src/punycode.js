/*! http://mths.be/punycode v1.2.3 by @mathias */

(function(e){function S(e){throw RangeError(g[e])}function x(e,t){var n=e.length;while(n--)e[n]=t(e[n]);return e}function T(e,t){return x(e.split(m),t).join(".")}function N(e){var t=[],n=0,r=e.length,i,s;while(n<r)i=e.charCodeAt(n++),i>=55296&&i<=56319&&n<r?(s=e.charCodeAt(n++),(s&64512)==56320?t.push(((i&1023)<<10)+(s&1023)+65536):(t.push(i),n--)):t.push(i);return t}function C(e){return x(e,function(e){var t="";return e>65535&&(e-=65536,t+=w(e>>>10&1023|55296),e=56320|e&1023),t+=w(e),t}).join("")}function k(e){return e-48<10?e-22:e-65<26?e-65:e-97<26?e-97:o}function L(e,t){return e+22+75*(e<26)-((t!=0)<<5)}function A(e,t,n){var r=0;e=n?b(e/l):e>>1,e+=b(e/t);for(;e>y*a>>1;r+=o)e=b(e/y);return b(r+(y+1)*e/(e+f))}function O(e){var t=[],n=e.length,r,i=0,f=h,l=c,d,v,m,g,y,w,E,x,T,N;d=e.lastIndexOf(p),d<0&&(d=0);for(v=0;v<d;++v)e.charCodeAt(v)>=128&&S("not-basic"),t.push(e.charCodeAt(v));for(m=d>0?d+1:0;m<n;){for(g=i,y=1,w=o;;w+=o){m>=n&&S("invalid-input"),E=k(e.charCodeAt(m++)),(E>=o||E>b((s-i)/y))&&S("overflow"),i+=E*y,x=w<=l?u:w>=l+a?a:w-l;if(E<x)break;N=o-x,y>b(s/N)&&S("overflow"),y*=N}r=t.length+1,l=A(i-g,r,g==0),b(i/r)>s-f&&S("overflow"),f+=b(i/r),i%=r,t.splice(i++,0,f)}return C(t)}function M(e){var t,n,r,i,f,l,d,v,m,g,y,E=[],x,T,C,k;e=N(e),x=e.length,t=h,n=0,f=c;for(l=0;l<x;++l)y=e[l],y<128&&E.push(w(y));r=i=E.length,i&&E.push(p);while(r<x){for(d=s,l=0;l<x;++l)y=e[l],y>=t&&y<d&&(d=y);T=r+1,d-t>b((s-n)/T)&&S("overflow"),n+=(d-t)*T,t=d;for(l=0;l<x;++l){y=e[l],y<t&&++n>s&&S("overflow");if(y==t){for(v=n,m=o;;m+=o){g=m<=f?u:m>=f+a?a:m-f;if(v<g)break;k=v-g,C=o-g,E.push(w(L(g+k%C,0))),v=b(k/C)}E.push(w(L(v,0))),f=A(n,T,r==i),n=0,++r}}++n,++t}return E.join("")}function _(e){return T(e,function(e){return d.test(e)?O(e.slice(4).toLowerCase()):e})}function D(e){return T(e,function(e){return v.test(e)?"xn--"+M(e):e})}var t=typeof exports=="object"&&exports,n=typeof module=="object"&&module&&module.exports==t&&module,r=typeof global=="object"&&global;if(r.global===r||r.window===r)e=r;var i,s=2147483647,o=36,u=1,a=26,f=38,l=700,c=72,h=128,p="-",d=/^xn--/,v=/[^ -~]/,m=/\x2E|\u3002|\uFF0E|\uFF61/g,g={overflow:"Overflow: input needs wider integers to process","not-basic":"Illegal input >= 0x80 (not a basic code point)","invalid-input":"Invalid input"},y=o-u,b=Math.floor,w=String.fromCharCode,E;i={version:"1.2.3",ucs2:{decode:N,encode:C},decode:O,encode:M,toASCII:D,toUnicode:_};if(typeof define=="function"&&typeof define.amd=="object"&&define.amd)define([],function(){return i});else if(t&&!t.nodeType)if(n)n.exports=i;else for(E in i)i.hasOwnProperty(E)&&(t[E]=i[E]);else e.punycode=i})(this);