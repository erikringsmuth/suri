define(["../var/support"],function(e){return function(){var t,n,r,i,s=document.createElement("div");s.setAttribute("className","t"),s.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",t=s.getElementsByTagName("a")[0],r=document.createElement("select"),i=r.appendChild(document.createElement("option")),n=s.getElementsByTagName("input")[0],t.style.cssText="top:1px",e.getSetAttribute=s.className!=="t",e.style=/top/.test(t.getAttribute("style")),e.hrefNormalized=t.getAttribute("href")==="/a",e.checkOn=!!n.value,e.optSelected=i.selected,e.enctype=!!document.createElement("form").enctype,r.disabled=!0,e.optDisabled=!i.disabled,n=document.createElement("input"),n.setAttribute("value",""),e.input=n.getAttribute("value")==="",n.value="t",n.setAttribute("type","radio"),e.radioValue=n.value==="t",t=n=r=i=s=null}(),e});