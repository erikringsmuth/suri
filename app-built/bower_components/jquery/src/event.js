define(["./core","./var/strundefined","./var/rnotwhite","./var/hasOwn","./var/slice","./event/support","./core/init","./data/accepts","./selector"],function(e,t,n,r,i,s){function c(){return!0}function h(){return!1}function p(){try{return document.activeElement}catch(e){}}var o=/^(?:input|select|textarea)$/i,u=/^key/,a=/^(?:mouse|contextmenu)|click/,f=/^(?:focusinfocus|focusoutblur)$/,l=/^([^.]*)(?:\.(.+)|)$/;return e.event={global:{},add:function(r,i,s,o,u){var a,f,c,h,p,d,v,m,g,y,b,w=e._data(r);if(!w)return;s.handler&&(h=s,s=h.handler,u=h.selector),s.guid||(s.guid=e.guid++),(f=w.events)||(f=w.events={}),(d=w.handle)||(d=w.handle=function(n){return typeof e===t||!!n&&e.event.triggered===n.type?undefined:e.event.dispatch.apply(d.elem,arguments)},d.elem=r),i=(i||"").match(n)||[""],c=i.length;while(c--){a=l.exec(i[c])||[],g=b=a[1],y=(a[2]||"").split(".").sort();if(!g)continue;p=e.event.special[g]||{},g=(u?p.delegateType:p.bindType)||g,p=e.event.special[g]||{},v=e.extend({type:g,origType:b,data:o,handler:s,guid:s.guid,selector:u,needsContext:u&&e.expr.match.needsContext.test(u),namespace:y.join(".")},h);if(!(m=f[g])){m=f[g]=[],m.delegateCount=0;if(!p.setup||p.setup.call(r,o,y,d)===!1)r.addEventListener?r.addEventListener(g,d,!1):r.attachEvent&&r.attachEvent("on"+g,d)}p.add&&(p.add.call(r,v),v.handler.guid||(v.handler.guid=s.guid)),u?m.splice(m.delegateCount++,0,v):m.push(v),e.event.global[g]=!0}r=null},remove:function(t,r,i,s,o){var u,a,f,c,h,p,d,v,m,g,y,b=e.hasData(t)&&e._data(t);if(!b||!(p=b.events))return;r=(r||"").match(n)||[""],h=r.length;while(h--){f=l.exec(r[h])||[],m=y=f[1],g=(f[2]||"").split(".").sort();if(!m){for(m in p)e.event.remove(t,m+r[h],i,s,!0);continue}d=e.event.special[m]||{},m=(s?d.delegateType:d.bindType)||m,v=p[m]||[],f=f[2]&&new RegExp("(^|\\.)"+g.join("\\.(?:.*\\.|)")+"(\\.|$)"),c=u=v.length;while(u--)a=v[u],(o||y===a.origType)&&(!i||i.guid===a.guid)&&(!f||f.test(a.namespace))&&(!s||s===a.selector||s==="**"&&a.selector)&&(v.splice(u,1),a.selector&&v.delegateCount--,d.remove&&d.remove.call(t,a));c&&!v.length&&((!d.teardown||d.teardown.call(t,g,b.handle)===!1)&&e.removeEvent(t,m,b.handle),delete p[m])}e.isEmptyObject(p)&&(delete b.handle,e._removeData(t,"events"))},trigger:function(t,n,i,s){var o,u,a,l,c,h,p,d=[i||document],v=r.call(t,"type")?t.type:t,m=r.call(t,"namespace")?t.namespace.split("."):[];a=h=i=i||document;if(i.nodeType===3||i.nodeType===8)return;if(f.test(v+e.event.triggered))return;v.indexOf(".")>=0&&(m=v.split("."),v=m.shift(),m.sort()),u=v.indexOf(":")<0&&"on"+v,t=t[e.expando]?t:new e.Event(v,typeof t=="object"&&t),t.isTrigger=s?2:3,t.namespace=m.join("."),t.namespace_re=t.namespace?new RegExp("(^|\\.)"+m.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,t.result=undefined,t.target||(t.target=i),n=n==null?[t]:e.makeArray(n,[t]),c=e.event.special[v]||{};if(!s&&c.trigger&&c.trigger.apply(i,n)===!1)return;if(!s&&!c.noBubble&&!e.isWindow(i)){l=c.delegateType||v,f.test(l+v)||(a=a.parentNode);for(;a;a=a.parentNode)d.push(a),h=a;h===(i.ownerDocument||document)&&d.push(h.defaultView||h.parentWindow||window)}p=0;while((a=d[p++])&&!t.isPropagationStopped())t.type=p>1?l:c.bindType||v,o=(e._data(a,"events")||{})[t.type]&&e._data(a,"handle"),o&&o.apply(a,n),o=u&&a[u],o&&o.apply&&e.acceptData(a)&&(t.result=o.apply(a,n),t.result===!1&&t.preventDefault());t.type=v;if(!s&&!t.isDefaultPrevented()&&(!c._default||c._default.apply(d.pop(),n)===!1)&&e.acceptData(i)&&u&&i[v]&&!e.isWindow(i)){h=i[u],h&&(i[u]=null),e.event.triggered=v;try{i[v]()}catch(g){}e.event.triggered=undefined,h&&(i[u]=h)}return t.result},dispatch:function(t){t=e.event.fix(t);var n,r,s,o,u,a=[],f=i.call(arguments),l=(e._data(this,"events")||{})[t.type]||[],c=e.event.special[t.type]||{};f[0]=t,t.delegateTarget=this;if(c.preDispatch&&c.preDispatch.call(this,t)===!1)return;a=e.event.handlers.call(this,t,l),n=0;while((o=a[n++])&&!t.isPropagationStopped()){t.currentTarget=o.elem,u=0;while((s=o.handlers[u++])&&!t.isImmediatePropagationStopped())if(!t.namespace_re||t.namespace_re.test(s.namespace))t.handleObj=s,t.data=s.data,r=((e.event.special[s.origType]||{}).handle||s.handler).apply(o.elem,f),r!==undefined&&(t.result=r)===!1&&(t.preventDefault(),t.stopPropagation())}return c.postDispatch&&c.postDispatch.call(this,t),t.result},handlers:function(t,n){var r,i,s,o,u=[],a=n.delegateCount,f=t.target;if(a&&f.nodeType&&(!t.button||t.type!=="click"))for(;f!=this;f=f.parentNode||this)if(f.nodeType===1&&(f.disabled!==!0||t.type!=="click")){s=[];for(o=0;o<a;o++)i=n[o],r=i.selector+" ",s[r]===undefined&&(s[r]=i.needsContext?e(r,this).index(f)>=0:e.find(r,this,null,[f]).length),s[r]&&s.push(i);s.length&&u.push({elem:f,handlers:s})}return a<n.length&&u.push({elem:this,handlers:n.slice(a)}),u},fix:function(t){if(t[e.expando])return t;var n,r,i,s=t.type,o=t,f=this.fixHooks[s];f||(this.fixHooks[s]=f=a.test(s)?this.mouseHooks:u.test(s)?this.keyHooks:{}),i=f.props?this.props.concat(f.props):this.props,t=new e.Event(o),n=i.length;while(n--)r=i[n],t[r]=o[r];return t.target||(t.target=o.srcElement||document),t.target.nodeType===3&&(t.target=t.target.parentNode),t.metaKey=!!t.metaKey,f.filter?f.filter(t,o):t},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(e,t){return e.which==null&&(e.which=t.charCode!=null?t.charCode:t.keyCode),e}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(e,t){var n,r,i,s=t.button,o=t.fromElement;return e.pageX==null&&t.clientX!=null&&(r=e.target.ownerDocument||document,i=r.documentElement,n=r.body,e.pageX=t.clientX+(i&&i.scrollLeft||n&&n.scrollLeft||0)-(i&&i.clientLeft||n&&n.clientLeft||0),e.pageY=t.clientY+(i&&i.scrollTop||n&&n.scrollTop||0)-(i&&i.clientTop||n&&n.clientTop||0)),!e.relatedTarget&&o&&(e.relatedTarget=o===e.target?t.toElement:o),!e.which&&s!==undefined&&(e.which=s&1?1:s&2?3:s&4?2:0),e}},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==p()&&this.focus)try{return this.focus(),!1}catch(e){}},delegateType:"focusin"},blur:{trigger:function(){if(this===p()&&this.blur)return this.blur(),!1},delegateType:"focusout"},click:{trigger:function(){if(e.nodeName(this,"input")&&this.type==="checkbox"&&this.click)return this.click(),!1},_default:function(t){return e.nodeName(t.target,"a")}},beforeunload:{postDispatch:function(e){e.result!==undefined&&(e.originalEvent.returnValue=e.result)}}},simulate:function(t,n,r,i){var s=e.extend(new e.Event,r,{type:t,isSimulated:!0,originalEvent:{}});i?e.event.trigger(s,null,n):e.event.dispatch.call(n,s),s.isDefaultPrevented()&&r.preventDefault()}},e.removeEvent=document.removeEventListener?function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n,!1)}:function(e,n,r){var i="on"+n;e.detachEvent&&(typeof e[i]===t&&(e[i]=null),e.detachEvent(i,r))},e.Event=function(t,n){if(!(this instanceof e.Event))return new e.Event(t,n);t&&t.type?(this.originalEvent=t,this.type=t.type,this.isDefaultPrevented=t.defaultPrevented||t.defaultPrevented===undefined&&(t.returnValue===!1||t.getPreventDefault&&t.getPreventDefault())?c:h):this.type=t,n&&e.extend(this,n),this.timeStamp=t&&t.timeStamp||e.now(),this[e.expando]=!0},e.Event.prototype={isDefaultPrevented:h,isPropagationStopped:h,isImmediatePropagationStopped:h,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=c;if(!e)return;e.preventDefault?e.preventDefault():e.returnValue=!1},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=c;if(!e)return;e.stopPropagation&&e.stopPropagation(),e.cancelBubble=!0},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=c,this.stopPropagation()}},e.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(t,n){e.event.special[t]={delegateType:n,bindType:n,handle:function(t){var r,i=this,s=t.relatedTarget,o=t.handleObj;if(!s||s!==i&&!e.contains(i,s))t.type=o.origType,r=o.handler.apply(this,arguments),t.type=n;return r}}}),s.submitBubbles||(e.event.special.submit={setup:function(){if(e.nodeName(this,"form"))return!1;e.event.add(this,"click._submit keypress._submit",function(t){var n=t.target,r=e.nodeName(n,"input")||e.nodeName(n,"button")?n.form:undefined;r&&!e._data(r,"submitBubbles")&&(e.event.add(r,"submit._submit",function(e){e._submit_bubble=!0}),e._data(r,"submitBubbles",!0))})},postDispatch:function(t){t._submit_bubble&&(delete t._submit_bubble,this.parentNode&&!t.isTrigger&&e.event.simulate("submit",this.parentNode,t,!0))},teardown:function(){if(e.nodeName(this,"form"))return!1;e.event.remove(this,"._submit")}}),s.changeBubbles||(e.event.special.change={setup:function(){if(o.test(this.nodeName)){if(this.type==="checkbox"||this.type==="radio")e.event.add(this,"propertychange._change",function(e){e.originalEvent.propertyName==="checked"&&(this._just_changed=!0)}),e.event.add(this,"click._change",function(t){this._just_changed&&!t.isTrigger&&(this._just_changed=!1),e.event.simulate("change",this,t,!0)});return!1}e.event.add(this,"beforeactivate._change",function(t){var n=t.target;o.test(n.nodeName)&&!e._data(n,"changeBubbles")&&(e.event.add(n,"change._change",function(t){this.parentNode&&!t.isSimulated&&!t.isTrigger&&e.event.simulate("change",this.parentNode,t,!0)}),e._data(n,"changeBubbles",!0))})},handle:function(e){var t=e.target;if(this!==t||e.isSimulated||e.isTrigger||t.type!=="radio"&&t.type!=="checkbox")return e.handleObj.handler.apply(this,arguments)},teardown:function(){return e.event.remove(this,"._change"),!o.test(this.nodeName)}}),s.focusinBubbles||e.each({focus:"focusin",blur:"focusout"},function(t,n){var r=function(t){e.event.simulate(n,t.target,e.event.fix(t),!0)};e.event.special[n]={setup:function(){var i=this.ownerDocument||this,s=e._data(i,n);s||i.addEventListener(t,r,!0),e._data(i,n,(s||0)+1)},teardown:function(){var i=this.ownerDocument||this,s=e._data(i,n)-1;s?e._data(i,n,s):(i.removeEventListener(t,r,!0),e._removeData(i,n))}}}),e.fn.extend({on:function(t,n,r,i,s){var o,u;if(typeof t=="object"){typeof n!="string"&&(r=r||n,n=undefined);for(o in t)this.on(o,n,r,t[o],s);return this}r==null&&i==null?(i=n,r=n=undefined):i==null&&(typeof n=="string"?(i=r,r=undefined):(i=r,r=n,n=undefined));if(i===!1)i=h;else if(!i)return this;return s===1&&(u=i,i=function(t){return e().off(t),u.apply(this,arguments)},i.guid=u.guid||(u.guid=e.guid++)),this.each(function(){e.event.add(this,t,i,r,n)})},one:function(e,t,n,r){return this.on(e,t,n,r,1)},off:function(t,n,r){var i,s;if(t&&t.preventDefault&&t.handleObj)return i=t.handleObj,e(t.delegateTarget).off(i.namespace?i.origType+"."+i.namespace:i.origType,i.selector,i.handler),this;if(typeof t=="object"){for(s in t)this.off(s,n,t[s]);return this}if(n===!1||typeof n=="function")r=n,n=undefined;return r===!1&&(r=h),this.each(function(){e.event.remove(this,t,r,n)})},trigger:function(t,n){return this.each(function(){e.event.trigger(t,n,this)})},triggerHandler:function(t,n){var r=this[0];if(r)return e.event.trigger(t,n,r,!0)}}),e});