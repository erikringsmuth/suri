// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>

define(["require","config","Ractive","rv!./xhrPanelTemplate","components/apiSequence/sequence","components/util/utilities","prettify","bower_components/URIjs/src/URI","vkbeautify","jquery","Ractive-transitions-slide"],function(e){var t=e("config"),n=e("Ractive"),r=e("rv!./xhrPanelTemplate"),i=e("components/apiSequence/sequence"),s=e("components/util/utilities"),o=e("prettify"),u=e("bower_components/URIjs/src/URI"),a=e("vkbeautify"),f=e("jquery");e("Ractive-transitions-slide");var l=n.extend({template:r,el:"#api-sequence-placeholder",append:!0,data:{starred:!1,signedIn:t.session.signedIn,responseBody:"",showOptions:!1,saveButtonClass:"default",sendButtonClass:"default",sendButtonDisabled:!1,showMoreButton:!1,fullScreen:!1,formatNumber:function(e){return e.toLocaleString()},formatDate:function(e){var t=new Date(e);return t.getFullYear()+"-"+t.getMonth()+"-"+t.getDay()+" "+t.getHours()+":"+t.getMinutes()}},init:function(){this.set("panelId",s.guid()),typeof this.get("name")=="undefined"&&this.set("name","XHR"),typeof this.get("method")=="undefined"&&this.set("method","GET"),typeof this.get("url")=="undefined"&&this.set("url","http://www.suri.io/"),typeof this.get("headers")=="undefined"&&this.set("headers",[]),typeof this.get("queryParameters")=="undefined"&&this.set("queryParameters",[]),typeof this.get("body")=="undefined"&&this.set("body",""),typeof this.get("corsEnabled")=="undefined"&&this.set("corsEnabled",!1),typeof this.get("isPublic")=="undefined"&&this.set("isPublic",!0),typeof this.get("callCount")=="undefined"&&this.set("callCount",0),typeof this.get("tags")=="undefined"&&this.set("tags",[]),typeof this.get("stars")=="undefined"&&this.set("stars",[]),typeof this.get("starCount")=="undefined"&&this.set("starCount",0),typeof this.get("forks")=="undefined"&&this.set("forks",[]),typeof this.get("forkCount")=="undefined"&&this.set("forkCount",0),typeof this.get("owner")=="undefined"&&this.set("owner",t.session.userId),this.set("isOwner",!this.get("id")||t.session.userId===this.get("owner")),this.get("stars").indexOf(t.session.userId)!==-1&&this.set("starred",!0),i.add(this),this.on({teardown:function(t){this.detach(),i.remove(this),t&&t.original&&t.original.stopPropagation&&t.original.stopPropagation()},scrollToPanel:function(){f("html,body").animate({scrollTop:document.getElementById(this.get("panelId")).offsetTop+f("#api-sequence").offset().top-15},200,"easeOutQuint")},setupTooltips:function(){f(".bs-tooltip").tooltip()},toggleOptions:function(){this.set("showOptions",!this.get("showOptions")),this.fire("setupTooltips")},toggleFullscreen:function(){this.set("fullScreen",!this.get("fullScreen"))},star:function(){this.get("starred")?f.ajax("/xhr/"+this.get("id")+"/stars/"+t.session.userId,{method:"DELETE"}).done(function(){this.data.stars.splice(i.indexOf(t.session.userId),1),this.set("starred",!1)}.bind(this)):f.ajax("/xhr/"+this.get("id")+"/stars",{method:"POST",data:t.session.userId}).done(function(){this.data.stars.push(t.session.userId),this.set("starred",!0)}.bind(this))},save:function(){this.set("saveButtonClass","default");if(!this.get("signedIn"))return;this.get("id")?f.ajax("/xhr/"+this.get("id"),{type:"PUT",contentType:"application/json",data:JSON.stringify(this.data)}).done(function(){this.set("saveButtonClass","success")}.bind(this)).fail(function(){this.set("saveButtonClass","danger")}.bind(this)):f.ajax("/xhr",{type:"POST",contentType:"application/json",data:JSON.stringify(this.data)}).done(function(e){this.set("saveButtonClass","success"),this.set("id",e._id)}.bind(this)).fail(function(){this.set("saveButtonClass","danger")}.bind(this))},"delete":function(){this.get("id")?f.ajax("/xhr/"+this.get("id"),{type:"DELETE"}).done(function(){this.teardown()}.bind(this)):this.teardown()},fork:function(){var e=new l({data:this.data});e.set("id",null),e.set("isOwner",!0),e.set("owner",t.session.userId),e.set("callCount",0),e.set("forks",[]),e.set("forkedFrom",this.get("id")),e.fire("save"),this.data.forks.push("")},addTagOnEnter:function(e){if(e.original.keyCode===13){var t=e.node.value.replace(/\s/g,"").toLowerCase();this.get("tags").indexOf(t)===-1&&(this.get("tags").push(t),e.node.value="")}},deleteTag:function(e,t){this.get("tags").splice(this.get("tags").indexOf(t),1),e.original.preventDefault()},addBlankHeader:function(){this.get("headers").push({header:"",options:[],selected:"",required:!1})},removeHeader:function(e,t){this.get("headers").splice(this.get("headers").indexOf(t),1)},sendOnEnter:function(t){t.original.keyCode===13&&this.fire("send")},send:function(){this.set("sendButtonClass","default"),this.set("sendButtonDisabled",!0),this.set("callCount",this.get("callCount")+1);var t=this.get("headers"),n={};t.forEach(function(e){n[e.header]=e.selected});var r=this.get("url");r.indexOf("://")===-1&&(r="http://"+r);var i=new u(r),s=(new u(window.location.href)).host();!this.get("corsEnabled")&&i.host()!==s&&(n["api-host"]=i.protocol()+"://"+i.authority(),i.authority(s),i.protocol(window.location.protocol)),n["api-id"]=this.get("id"),f.ajax({type:this.get("method"),url:i,headers:n,data:this.get("body")}).done(function(e,t,n){this.fire("displayResponse",n)}.bind(this)).fail(function(e){this.fire("displayResponse",e)}.bind(this))},displayResponse:function(t){this.set("sendButtonDisabled",!1),t.status>=200&&t.status<300?this.set("sendButtonClass","success"):this.set("sendButtonClass","danger"),this.set("responseHeaders","HTTP/1.1 "+t.status+" "+t.statusText+"\n"+t.getAllResponseHeaders()),this.set("responseBody","");if(typeof t.responseJSON!="undefined")this.set("responseBody",s.escape(JSON.stringify(t.responseJSON,null,2)));else if(typeof t.responseXML!="undefined")this.set("responseBody",s.escape(a.xml((new XMLSerializer).serializeToString(t.responseXML),2)));else{var n=t.getResponseHeader("content-type");if(n&&n.indexOf("javascript")!==-1){var r;try{r=JSON.stringify(JSON.parse(t.responseText),null,2)}catch(i){r=t.responseText}this.set("responseBody",s.escape(r))}else this.set("responseBody",s.escape(t.responseText))}this.get("responseBody").length>3e3?(this.nodes.responseBody.innerHTML=o.prettyPrintOne(this.get("responseBody").substring(0,3e3)),this.set("showMoreButton",!0)):this.fire("displayEntireResponse")},displayEntireResponse:function(){this.nodes.responseBody.innerHTML=o.prettyPrintOne(this.get("responseBody")),this.set("showMoreButton",!1)}}),this.fire("scrollToPanel"),this.fire("setupTooltips")}});return l});