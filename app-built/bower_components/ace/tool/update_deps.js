function run(e,t){function s(n){n!==0&&(console.error(e+"::: process exited with code :::"+n),console.error(i)),t(i,r)}var n=process.platform=="win32"?spawn("cmd",["/c",e],{cwd:__dirname}):spawn("bash",["-c",e],{cwd:__dirname}),r="",i="";n.stderr.setEncoding("utf8"),n.stderr.on("data",function(e){i+=e}),n.stdout.setEncoding("utf8"),n.stdout.on("data",function(e){r+=e}),n.on("exit",s),n.on("close",s)}function unquote(e){return e.replace(/\\(.)/g,function(e,t){return t=="n"?"\n":t=="t"?"	":t=="r"?"\r":t})}function browserify(e,t){var n=this.browserify,r=Path.join("node_modules",n.path);run("npm install "+this.browserify.npmModule,function(){run("browserify "+r+" -s "+n.exports,function(e,n){n=n.replace(/^.*return\s*\(function/,"module.exports = (function").replace(/\}\);\s*$/,""),n=n.replace(/(\],|\{)((?:\d+|"\w+"):\[)/g,"$1\n$2").replace(/^(\},)(\{[^{}\[\]]*?\}\])/gm,"$1\n$2"),t(e,n)})})}var https=require("https"),http=require("http"),url=require("url"),fs=require("fs"),Path=require("path"),spawn=require("child_process").spawn,async=require("asyncjs"),rootDir=__dirname+"/../lib/ace/",deps={csslint:{path:"mode/css/csslint.js",url:"https://raw.github.com/stubbornella/csslint/master/release/csslint.js",needsFixup:!0},requirejs:{path:"../../demo/kitchen-sink/require.js",url:"https://raw.github.com/jrburke/requirejs/master/require.js",needsFixup:!1},luaparse:{path:"mode/lua/luaparse.js",url:"https://raw.github.com/oxyc/luaparse/master/luaparse.js",needsFixup:!0,postProcess:function(e){return e.replace(/\(function\s*\(root,\s*name,\s*factory\)\s*{[\s\S]*?}\(this,\s*'luaparse',/,"(function (root, name, factory) {\n   factory(exports)\n}(this, 'luaparse',")}},html5:{path:"mode/html/saxparser.js",browserify:{npmModule:"git+https://github.com/aredridel/html5.git#master",path:"html5/lib/sax/SAXParser.js",exports:"SAXParser"},fetch:browserify,needsFixup:!0,postProcess:function(e){return e}},xquery:{path:"mode/xquery/xquery_lexer.js",browserify:{npmModule:"git+https://github.com/wcandillon/xqlint.git#master",path:"xqlint/lib/lexers/xquery_lexer.js",exports:"XQueryLexer"},fetch:browserify,needsFixup:!0,postProcess:function(e){return e}},jsoniq:{path:"mode/xquery/jsoniq_lexer.js",browserify:{npmModule:"git+https://github.com/wcandillon/xqlint.git#master",path:"xqlint/lib/lexers/jsoniq_lexer.js",exports:"JSONiqLexer"},fetch:browserify,needsFixup:!0,postProcess:function(e){return e}},xqlint:{path:"mode/xquery/xqlint.js",browserify:{npmModule:"git+https://github.com/wcandillon/xqlint.git#0.0.8",path:"xqlint/lib/xqlint.js",exports:"XQLint"},fetch:browserify,needsFixup:!0,postProcess:function(e){return e}},jshint:{path:"mode/javascript/jshint.js",browserify:{npmModule:"git+https://github.com/ajaxorg/jshint.git#master",path:"jshint/src/jshint.js",exports:"jshint"},fetch:browserify,needsFixup:!0,postProcess:function(e){return e=e.replace(/"Expected a conditional expression and instead saw an assignment."/g,'"Assignment in conditional expression"'),e=e.replace(/var defaultMaxListeners = 10;/,function(e){return e.replace("10","200")}),e}},emmet:{path:"ext/emmet core.js",url:["https://raw.github.com/sergeche/emmet-sublime/master/emmet/emmet-app.js","https://raw.github.com/sergeche/emmet-sublime/master/emmet/snippets.json"],postProcess:function(e){return e[0].replace("define(emmet)","define('emmet', [], emmet)").replace(/(emmet.define\('bootstrap'.*)[\s\S]*$/,function(t,n){return n+"\n"+"var snippets = "+e[1]+";\n"+"var res = require('resources');\n"+"var userData = res.getVocabulary('user') || {};\n"+"res.setVocabulary(require('utils').deepMerge(userData, snippets), 'user');\n"+"});"})}},coffee:{fetch:function(){function o(){r.pop();var e=i.LICENSE.split("\n");e="/**\n * "+e.join("\n * ")+"\n */",r.forEach(function(t){var n=i[t.name];console.log(t.name),console.log(!n);if(!n)return;t.name=="parser.js"?n=n.replace("var parser = (function(){","").replace(/\nreturn (new Parser)[\s\S]*$/,"\n\nmodule.exports = $1;\n\n"):n=n.replace("(function() {","").replace(/\}\).call\(this\);\s*$/,""),n=e+"\n\n"+"define(function(require, exports, module) {\n"+n+"\n});",fs.writeFile(t.path,n,"utf-8",function(e){if(e)throw e;console.log("File "+t.name+" saved."),console.warn("mode/coffee/coffee-script file needs to updated manually"),console.warn("mode/coffee/parser.js: parseError function needs to be modified")})})}var e="https://raw.github.com/jashkenas/coffee-script/master/",t="mode/coffee/",n="lib/coffee-script/",r=["helpers.js","lexer.js","nodes.js","parser.js","rewriter.js","scope.js"].map(function(r){return{name:r,href:e+n+r,path:rootDir+t+r}});r.push({name:"LICENSE",href:e+"LICENSE"});var i={},s=0;r.forEach(function(e){download(e.href,function(t,n){s++,i[e.name]=n,s==r.length&&o()})})}}},download=function(e,t){if(Array.isArray(e))return async.map(e,download,t);var n=url.parse(e),r=n.protocol==="https:"?https:http;console.log("connecting to "+n.host+" "+n.path),r.get(n,function(e){var n="";e.setEncoding("utf-8"),e.on("data",function(e){n+=e}),e.on("end",function(){t(null,n)})})},getDep=function(e){e.fetch||(e.fetch=download),e.fetch(e.url,function(t,n){e.postProcess&&(n=e.postProcess(n)),e.needsFixup&&(n="define(function(require, exports, module) {\n"+n+"\n});"),fs.writeFile(rootDir+e.path,n,"utf-8",function(t){if(t)throw t;console.log("File "+e.path+" saved.")})})},args=process.argv.slice(2);args=args.filter(function(e){return e[0]!="-"}),args.length||(args=Object.keys(deps)),args.forEach(function(e){getDep(deps[e])});