(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();const Dy="modulepreload",Iy=function(t){return"/"+t},mm={},ru=function(e,n,i){let r=Promise.resolve();if(n&&n.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),c=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));r=Promise.allSettled(n.map(l=>{if(l=Iy(l),l in mm)return;mm[l]=!0;const f=l.endsWith(".css"),d=f?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${d}`))return;const a=document.createElement("link");if(a.rel=f?"stylesheet":Dy,f||(a.as="script"),a.crossOrigin="",a.href=l,c&&a.setAttribute("nonce",c),document.head.appendChild(a),f)return new Promise((u,h)=>{a.addEventListener("load",u),a.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${l}`)))})}))}function s(o){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=o,window.dispatchEvent(c),!c.defaultPrevented)throw o}return r.then(o=>{for(const c of o||[])c.status==="rejected"&&s(c.reason);return e().catch(s)})};var Co=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},p_={exports:{}},su={},m_={exports:{}},Ke={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ka=Symbol.for("react.element"),Ny=Symbol.for("react.portal"),Uy=Symbol.for("react.fragment"),Fy=Symbol.for("react.strict_mode"),Oy=Symbol.for("react.profiler"),ky=Symbol.for("react.provider"),By=Symbol.for("react.context"),zy=Symbol.for("react.forward_ref"),Vy=Symbol.for("react.suspense"),Hy=Symbol.for("react.memo"),Gy=Symbol.for("react.lazy"),gm=Symbol.iterator;function Wy(t){return t===null||typeof t!="object"?null:(t=gm&&t[gm]||t["@@iterator"],typeof t=="function"?t:null)}var g_={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},__=Object.assign,v_={};function Eo(t,e,n){this.props=t,this.context=e,this.refs=v_,this.updater=n||g_}Eo.prototype.isReactComponent={};Eo.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};Eo.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function x_(){}x_.prototype=Eo.prototype;function Xh(t,e,n){this.props=t,this.context=e,this.refs=v_,this.updater=n||g_}var jh=Xh.prototype=new x_;jh.constructor=Xh;__(jh,Eo.prototype);jh.isPureReactComponent=!0;var _m=Array.isArray,y_=Object.prototype.hasOwnProperty,$h={current:null},S_={key:!0,ref:!0,__self:!0,__source:!0};function M_(t,e,n){var i,r={},s=null,o=null;if(e!=null)for(i in e.ref!==void 0&&(o=e.ref),e.key!==void 0&&(s=""+e.key),e)y_.call(e,i)&&!S_.hasOwnProperty(i)&&(r[i]=e[i]);var c=arguments.length-2;if(c===1)r.children=n;else if(1<c){for(var l=Array(c),f=0;f<c;f++)l[f]=arguments[f+2];r.children=l}if(t&&t.defaultProps)for(i in c=t.defaultProps,c)r[i]===void 0&&(r[i]=c[i]);return{$$typeof:ka,type:t,key:s,ref:o,props:r,_owner:$h.current}}function Xy(t,e){return{$$typeof:ka,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function Yh(t){return typeof t=="object"&&t!==null&&t.$$typeof===ka}function jy(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var vm=/\/+/g;function Lu(t,e){return typeof t=="object"&&t!==null&&t.key!=null?jy(""+t.key):e.toString(36)}function ic(t,e,n,i,r){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var o=!1;if(t===null)o=!0;else switch(s){case"string":case"number":o=!0;break;case"object":switch(t.$$typeof){case ka:case Ny:o=!0}}if(o)return o=t,r=r(o),t=i===""?"."+Lu(o,0):i,_m(r)?(n="",t!=null&&(n=t.replace(vm,"$&/")+"/"),ic(r,e,n,"",function(f){return f})):r!=null&&(Yh(r)&&(r=Xy(r,n+(!r.key||o&&o.key===r.key?"":(""+r.key).replace(vm,"$&/")+"/")+t)),e.push(r)),1;if(o=0,i=i===""?".":i+":",_m(t))for(var c=0;c<t.length;c++){s=t[c];var l=i+Lu(s,c);o+=ic(s,e,n,l,r)}else if(l=Wy(t),typeof l=="function")for(t=l.call(t),c=0;!(s=t.next()).done;)s=s.value,l=i+Lu(s,c++),o+=ic(s,e,n,l,r);else if(s==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return o}function qa(t,e,n){if(t==null)return t;var i=[],r=0;return ic(t,i,"","",function(s){return e.call(n,s,r++)}),i}function $y(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var gn={current:null},rc={transition:null},Yy={ReactCurrentDispatcher:gn,ReactCurrentBatchConfig:rc,ReactCurrentOwner:$h};function w_(){throw Error("act(...) is not supported in production builds of React.")}Ke.Children={map:qa,forEach:function(t,e,n){qa(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return qa(t,function(){e++}),e},toArray:function(t){return qa(t,function(e){return e})||[]},only:function(t){if(!Yh(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};Ke.Component=Eo;Ke.Fragment=Uy;Ke.Profiler=Oy;Ke.PureComponent=Xh;Ke.StrictMode=Fy;Ke.Suspense=Vy;Ke.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Yy;Ke.act=w_;Ke.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var i=__({},t.props),r=t.key,s=t.ref,o=t._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,o=$h.current),e.key!==void 0&&(r=""+e.key),t.type&&t.type.defaultProps)var c=t.type.defaultProps;for(l in e)y_.call(e,l)&&!S_.hasOwnProperty(l)&&(i[l]=e[l]===void 0&&c!==void 0?c[l]:e[l])}var l=arguments.length-2;if(l===1)i.children=n;else if(1<l){c=Array(l);for(var f=0;f<l;f++)c[f]=arguments[f+2];i.children=c}return{$$typeof:ka,type:t.type,key:r,ref:s,props:i,_owner:o}};Ke.createContext=function(t){return t={$$typeof:By,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:ky,_context:t},t.Consumer=t};Ke.createElement=M_;Ke.createFactory=function(t){var e=M_.bind(null,t);return e.type=t,e};Ke.createRef=function(){return{current:null}};Ke.forwardRef=function(t){return{$$typeof:zy,render:t}};Ke.isValidElement=Yh;Ke.lazy=function(t){return{$$typeof:Gy,_payload:{_status:-1,_result:t},_init:$y}};Ke.memo=function(t,e){return{$$typeof:Hy,type:t,compare:e===void 0?null:e}};Ke.startTransition=function(t){var e=rc.transition;rc.transition={};try{t()}finally{rc.transition=e}};Ke.unstable_act=w_;Ke.useCallback=function(t,e){return gn.current.useCallback(t,e)};Ke.useContext=function(t){return gn.current.useContext(t)};Ke.useDebugValue=function(){};Ke.useDeferredValue=function(t){return gn.current.useDeferredValue(t)};Ke.useEffect=function(t,e){return gn.current.useEffect(t,e)};Ke.useId=function(){return gn.current.useId()};Ke.useImperativeHandle=function(t,e,n){return gn.current.useImperativeHandle(t,e,n)};Ke.useInsertionEffect=function(t,e){return gn.current.useInsertionEffect(t,e)};Ke.useLayoutEffect=function(t,e){return gn.current.useLayoutEffect(t,e)};Ke.useMemo=function(t,e){return gn.current.useMemo(t,e)};Ke.useReducer=function(t,e,n){return gn.current.useReducer(t,e,n)};Ke.useRef=function(t){return gn.current.useRef(t)};Ke.useState=function(t){return gn.current.useState(t)};Ke.useSyncExternalStore=function(t,e,n){return gn.current.useSyncExternalStore(t,e,n)};Ke.useTransition=function(){return gn.current.useTransition()};Ke.version="18.3.1";m_.exports=Ke;var Ie=m_.exports;/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var qy=Ie,Ky=Symbol.for("react.element"),Zy=Symbol.for("react.fragment"),Qy=Object.prototype.hasOwnProperty,Jy=qy.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,eS={key:!0,ref:!0,__self:!0,__source:!0};function E_(t,e,n){var i,r={},s=null,o=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(o=e.ref);for(i in e)Qy.call(e,i)&&!eS.hasOwnProperty(i)&&(r[i]=e[i]);if(t&&t.defaultProps)for(i in e=t.defaultProps,e)r[i]===void 0&&(r[i]=e[i]);return{$$typeof:Ky,type:t,key:s,ref:o,props:r,_owner:Jy.current}}su.Fragment=Zy;su.jsx=E_;su.jsxs=E_;p_.exports=su;var $=p_.exports,T_={exports:{}},kn={},b_={exports:{}},A_={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(z,X){var J=z.length;z.push(X);e:for(;0<J;){var Q=J-1>>>1,ie=z[Q];if(0<r(ie,X))z[Q]=X,z[J]=ie,J=Q;else break e}}function n(z){return z.length===0?null:z[0]}function i(z){if(z.length===0)return null;var X=z[0],J=z.pop();if(J!==X){z[0]=J;e:for(var Q=0,ie=z.length,Fe=ie>>>1;Q<Fe;){var Ze=2*(Q+1)-1,rt=z[Ze],Y=Ze+1,re=z[Y];if(0>r(rt,J))Y<ie&&0>r(re,rt)?(z[Q]=re,z[Y]=J,Q=Y):(z[Q]=rt,z[Ze]=J,Q=Ze);else if(Y<ie&&0>r(re,J))z[Q]=re,z[Y]=J,Q=Y;else break e}}return X}function r(z,X){var J=z.sortIndex-X.sortIndex;return J!==0?J:z.id-X.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;t.unstable_now=function(){return s.now()}}else{var o=Date,c=o.now();t.unstable_now=function(){return o.now()-c}}var l=[],f=[],d=1,a=null,u=3,h=!1,m=!1,v=!1,g=typeof setTimeout=="function"?setTimeout:null,p=typeof clearTimeout=="function"?clearTimeout:null,_=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function x(z){for(var X=n(f);X!==null;){if(X.callback===null)i(f);else if(X.startTime<=z)i(f),X.sortIndex=X.expirationTime,e(l,X);else break;X=n(f)}}function S(z){if(v=!1,x(z),!m)if(n(l)!==null)m=!0,O(b);else{var X=n(f);X!==null&&H(S,X.startTime-z)}}function b(z,X){m=!1,v&&(v=!1,p(y),y=-1),h=!0;var J=u;try{for(x(X),a=n(l);a!==null&&(!(a.expirationTime>X)||z&&!C());){var Q=a.callback;if(typeof Q=="function"){a.callback=null,u=a.priorityLevel;var ie=Q(a.expirationTime<=X);X=t.unstable_now(),typeof ie=="function"?a.callback=ie:a===n(l)&&i(l),x(X)}else i(l);a=n(l)}if(a!==null)var Fe=!0;else{var Ze=n(f);Ze!==null&&H(S,Ze.startTime-X),Fe=!1}return Fe}finally{a=null,u=J,h=!1}}var M=!1,T=null,y=-1,w=5,D=-1;function C(){return!(t.unstable_now()-D<w)}function N(){if(T!==null){var z=t.unstable_now();D=z;var X=!0;try{X=T(!0,z)}finally{X?P():(M=!1,T=null)}}else M=!1}var P;if(typeof _=="function")P=function(){_(N)};else if(typeof MessageChannel<"u"){var U=new MessageChannel,V=U.port2;U.port1.onmessage=N,P=function(){V.postMessage(null)}}else P=function(){g(N,0)};function O(z){T=z,M||(M=!0,P())}function H(z,X){y=g(function(){z(t.unstable_now())},X)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(z){z.callback=null},t.unstable_continueExecution=function(){m||h||(m=!0,O(b))},t.unstable_forceFrameRate=function(z){0>z||125<z?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):w=0<z?Math.floor(1e3/z):5},t.unstable_getCurrentPriorityLevel=function(){return u},t.unstable_getFirstCallbackNode=function(){return n(l)},t.unstable_next=function(z){switch(u){case 1:case 2:case 3:var X=3;break;default:X=u}var J=u;u=X;try{return z()}finally{u=J}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(z,X){switch(z){case 1:case 2:case 3:case 4:case 5:break;default:z=3}var J=u;u=z;try{return X()}finally{u=J}},t.unstable_scheduleCallback=function(z,X,J){var Q=t.unstable_now();switch(typeof J=="object"&&J!==null?(J=J.delay,J=typeof J=="number"&&0<J?Q+J:Q):J=Q,z){case 1:var ie=-1;break;case 2:ie=250;break;case 5:ie=1073741823;break;case 4:ie=1e4;break;default:ie=5e3}return ie=J+ie,z={id:d++,callback:X,priorityLevel:z,startTime:J,expirationTime:ie,sortIndex:-1},J>Q?(z.sortIndex=J,e(f,z),n(l)===null&&z===n(f)&&(v?(p(y),y=-1):v=!0,H(S,J-Q))):(z.sortIndex=ie,e(l,z),m||h||(m=!0,O(b))),z},t.unstable_shouldYield=C,t.unstable_wrapCallback=function(z){var X=u;return function(){var J=u;u=X;try{return z.apply(this,arguments)}finally{u=J}}}})(A_);b_.exports=A_;var tS=b_.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var nS=Ie,On=tS;function se(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var C_=new Set,ma={};function cs(t,e){co(t,e),co(t+"Capture",e)}function co(t,e){for(ma[t]=e,t=0;t<e.length;t++)C_.add(e[t])}var Xi=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),ed=Object.prototype.hasOwnProperty,iS=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,xm={},ym={};function rS(t){return ed.call(ym,t)?!0:ed.call(xm,t)?!1:iS.test(t)?ym[t]=!0:(xm[t]=!0,!1)}function sS(t,e,n,i){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return i?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function oS(t,e,n,i){if(e===null||typeof e>"u"||sS(t,e,n,i))return!0;if(i)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function _n(t,e,n,i,r,s,o){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=s,this.removeEmptyString=o}var Jt={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){Jt[t]=new _n(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];Jt[e]=new _n(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){Jt[t]=new _n(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){Jt[t]=new _n(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){Jt[t]=new _n(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){Jt[t]=new _n(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){Jt[t]=new _n(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){Jt[t]=new _n(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){Jt[t]=new _n(t,5,!1,t.toLowerCase(),null,!1,!1)});var qh=/[\-:]([a-z])/g;function Kh(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(qh,Kh);Jt[e]=new _n(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(qh,Kh);Jt[e]=new _n(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(qh,Kh);Jt[e]=new _n(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){Jt[t]=new _n(t,1,!1,t.toLowerCase(),null,!1,!1)});Jt.xlinkHref=new _n("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){Jt[t]=new _n(t,1,!1,t.toLowerCase(),null,!0,!0)});function Zh(t,e,n,i){var r=Jt.hasOwnProperty(e)?Jt[e]:null;(r!==null?r.type!==0:i||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(oS(e,n,r,i)&&(n=null),i||r===null?rS(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):r.mustUseProperty?t[r.propertyName]=n===null?r.type===3?!1:"":n:(e=r.attributeName,i=r.attributeNamespace,n===null?t.removeAttribute(e):(r=r.type,n=r===3||r===4&&n===!0?"":""+n,i?t.setAttributeNS(i,e,n):t.setAttribute(e,n))))}var Zi=nS.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Ka=Symbol.for("react.element"),zs=Symbol.for("react.portal"),Vs=Symbol.for("react.fragment"),Qh=Symbol.for("react.strict_mode"),td=Symbol.for("react.profiler"),R_=Symbol.for("react.provider"),P_=Symbol.for("react.context"),Jh=Symbol.for("react.forward_ref"),nd=Symbol.for("react.suspense"),id=Symbol.for("react.suspense_list"),ep=Symbol.for("react.memo"),cr=Symbol.for("react.lazy"),L_=Symbol.for("react.offscreen"),Sm=Symbol.iterator;function Ro(t){return t===null||typeof t!="object"?null:(t=Sm&&t[Sm]||t["@@iterator"],typeof t=="function"?t:null)}var Ct=Object.assign,Du;function Zo(t){if(Du===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);Du=e&&e[1]||""}return`
`+Du+t}var Iu=!1;function Nu(t,e){if(!t||Iu)return"";Iu=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(f){var i=f}Reflect.construct(t,[],e)}else{try{e.call()}catch(f){i=f}t.call(e.prototype)}else{try{throw Error()}catch(f){i=f}t()}}catch(f){if(f&&i&&typeof f.stack=="string"){for(var r=f.stack.split(`
`),s=i.stack.split(`
`),o=r.length-1,c=s.length-1;1<=o&&0<=c&&r[o]!==s[c];)c--;for(;1<=o&&0<=c;o--,c--)if(r[o]!==s[c]){if(o!==1||c!==1)do if(o--,c--,0>c||r[o]!==s[c]){var l=`
`+r[o].replace(" at new "," at ");return t.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",t.displayName)),l}while(1<=o&&0<=c);break}}}finally{Iu=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?Zo(t):""}function aS(t){switch(t.tag){case 5:return Zo(t.type);case 16:return Zo("Lazy");case 13:return Zo("Suspense");case 19:return Zo("SuspenseList");case 0:case 2:case 15:return t=Nu(t.type,!1),t;case 11:return t=Nu(t.type.render,!1),t;case 1:return t=Nu(t.type,!0),t;default:return""}}function rd(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case Vs:return"Fragment";case zs:return"Portal";case td:return"Profiler";case Qh:return"StrictMode";case nd:return"Suspense";case id:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case P_:return(t.displayName||"Context")+".Consumer";case R_:return(t._context.displayName||"Context")+".Provider";case Jh:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case ep:return e=t.displayName||null,e!==null?e:rd(t.type)||"Memo";case cr:e=t._payload,t=t._init;try{return rd(t(e))}catch{}}return null}function lS(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return rd(e);case 8:return e===Qh?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function br(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function D_(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function cS(t){var e=D_(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),i=""+t[e];if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var r=n.get,s=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return r.call(this)},set:function(o){i=""+o,s.call(this,o)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return i},setValue:function(o){i=""+o},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function Za(t){t._valueTracker||(t._valueTracker=cS(t))}function I_(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),i="";return t&&(i=D_(t)?t.checked?"true":"false":t.value),t=i,t!==n?(e.setValue(t),!0):!1}function Tc(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function sd(t,e){var n=e.checked;return Ct({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??t._wrapperState.initialChecked})}function Mm(t,e){var n=e.defaultValue==null?"":e.defaultValue,i=e.checked!=null?e.checked:e.defaultChecked;n=br(e.value!=null?e.value:n),t._wrapperState={initialChecked:i,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function N_(t,e){e=e.checked,e!=null&&Zh(t,"checked",e,!1)}function od(t,e){N_(t,e);var n=br(e.value),i=e.type;if(n!=null)i==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(i==="submit"||i==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?ad(t,e.type,n):e.hasOwnProperty("defaultValue")&&ad(t,e.type,br(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function wm(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var i=e.type;if(!(i!=="submit"&&i!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function ad(t,e,n){(e!=="number"||Tc(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var Qo=Array.isArray;function Js(t,e,n,i){if(t=t.options,e){e={};for(var r=0;r<n.length;r++)e["$"+n[r]]=!0;for(n=0;n<t.length;n++)r=e.hasOwnProperty("$"+t[n].value),t[n].selected!==r&&(t[n].selected=r),r&&i&&(t[n].defaultSelected=!0)}else{for(n=""+br(n),e=null,r=0;r<t.length;r++){if(t[r].value===n){t[r].selected=!0,i&&(t[r].defaultSelected=!0);return}e!==null||t[r].disabled||(e=t[r])}e!==null&&(e.selected=!0)}}function ld(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(se(91));return Ct({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function Em(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(se(92));if(Qo(n)){if(1<n.length)throw Error(se(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:br(n)}}function U_(t,e){var n=br(e.value),i=br(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),i!=null&&(t.defaultValue=""+i)}function Tm(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function F_(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function cd(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?F_(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var Qa,O_=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,n,i,r){MSApp.execUnsafeLocalFunction(function(){return t(e,n,i,r)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(Qa=Qa||document.createElement("div"),Qa.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=Qa.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function ga(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var ra={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},uS=["Webkit","ms","Moz","O"];Object.keys(ra).forEach(function(t){uS.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),ra[e]=ra[t]})});function k_(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||ra.hasOwnProperty(t)&&ra[t]?(""+e).trim():e+"px"}function B_(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var i=n.indexOf("--")===0,r=k_(n,e[n],i);n==="float"&&(n="cssFloat"),i?t.setProperty(n,r):t[n]=r}}var fS=Ct({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function ud(t,e){if(e){if(fS[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(se(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(se(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(se(61))}if(e.style!=null&&typeof e.style!="object")throw Error(se(62))}}function fd(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var dd=null;function tp(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var hd=null,eo=null,to=null;function bm(t){if(t=Va(t)){if(typeof hd!="function")throw Error(se(280));var e=t.stateNode;e&&(e=uu(e),hd(t.stateNode,t.type,e))}}function z_(t){eo?to?to.push(t):to=[t]:eo=t}function V_(){if(eo){var t=eo,e=to;if(to=eo=null,bm(t),e)for(t=0;t<e.length;t++)bm(e[t])}}function H_(t,e){return t(e)}function G_(){}var Uu=!1;function W_(t,e,n){if(Uu)return t(e,n);Uu=!0;try{return H_(t,e,n)}finally{Uu=!1,(eo!==null||to!==null)&&(G_(),V_())}}function _a(t,e){var n=t.stateNode;if(n===null)return null;var i=uu(n);if(i===null)return null;n=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(t=t.type,i=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!i;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(se(231,e,typeof n));return n}var pd=!1;if(Xi)try{var Po={};Object.defineProperty(Po,"passive",{get:function(){pd=!0}}),window.addEventListener("test",Po,Po),window.removeEventListener("test",Po,Po)}catch{pd=!1}function dS(t,e,n,i,r,s,o,c,l){var f=Array.prototype.slice.call(arguments,3);try{e.apply(n,f)}catch(d){this.onError(d)}}var sa=!1,bc=null,Ac=!1,md=null,hS={onError:function(t){sa=!0,bc=t}};function pS(t,e,n,i,r,s,o,c,l){sa=!1,bc=null,dS.apply(hS,arguments)}function mS(t,e,n,i,r,s,o,c,l){if(pS.apply(this,arguments),sa){if(sa){var f=bc;sa=!1,bc=null}else throw Error(se(198));Ac||(Ac=!0,md=f)}}function us(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function X_(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function Am(t){if(us(t)!==t)throw Error(se(188))}function gS(t){var e=t.alternate;if(!e){if(e=us(t),e===null)throw Error(se(188));return e!==t?null:t}for(var n=t,i=e;;){var r=n.return;if(r===null)break;var s=r.alternate;if(s===null){if(i=r.return,i!==null){n=i;continue}break}if(r.child===s.child){for(s=r.child;s;){if(s===n)return Am(r),t;if(s===i)return Am(r),e;s=s.sibling}throw Error(se(188))}if(n.return!==i.return)n=r,i=s;else{for(var o=!1,c=r.child;c;){if(c===n){o=!0,n=r,i=s;break}if(c===i){o=!0,i=r,n=s;break}c=c.sibling}if(!o){for(c=s.child;c;){if(c===n){o=!0,n=s,i=r;break}if(c===i){o=!0,i=s,n=r;break}c=c.sibling}if(!o)throw Error(se(189))}}if(n.alternate!==i)throw Error(se(190))}if(n.tag!==3)throw Error(se(188));return n.stateNode.current===n?t:e}function j_(t){return t=gS(t),t!==null?$_(t):null}function $_(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=$_(t);if(e!==null)return e;t=t.sibling}return null}var Y_=On.unstable_scheduleCallback,Cm=On.unstable_cancelCallback,_S=On.unstable_shouldYield,vS=On.unstable_requestPaint,It=On.unstable_now,xS=On.unstable_getCurrentPriorityLevel,np=On.unstable_ImmediatePriority,q_=On.unstable_UserBlockingPriority,Cc=On.unstable_NormalPriority,yS=On.unstable_LowPriority,K_=On.unstable_IdlePriority,ou=null,Mi=null;function SS(t){if(Mi&&typeof Mi.onCommitFiberRoot=="function")try{Mi.onCommitFiberRoot(ou,t,void 0,(t.current.flags&128)===128)}catch{}}var ci=Math.clz32?Math.clz32:ES,MS=Math.log,wS=Math.LN2;function ES(t){return t>>>=0,t===0?32:31-(MS(t)/wS|0)|0}var Ja=64,el=4194304;function Jo(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function Rc(t,e){var n=t.pendingLanes;if(n===0)return 0;var i=0,r=t.suspendedLanes,s=t.pingedLanes,o=n&268435455;if(o!==0){var c=o&~r;c!==0?i=Jo(c):(s&=o,s!==0&&(i=Jo(s)))}else o=n&~r,o!==0?i=Jo(o):s!==0&&(i=Jo(s));if(i===0)return 0;if(e!==0&&e!==i&&!(e&r)&&(r=i&-i,s=e&-e,r>=s||r===16&&(s&4194240)!==0))return e;if(i&4&&(i|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=i;0<e;)n=31-ci(e),r=1<<n,i|=t[n],e&=~r;return i}function TS(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function bS(t,e){for(var n=t.suspendedLanes,i=t.pingedLanes,r=t.expirationTimes,s=t.pendingLanes;0<s;){var o=31-ci(s),c=1<<o,l=r[o];l===-1?(!(c&n)||c&i)&&(r[o]=TS(c,e)):l<=e&&(t.expiredLanes|=c),s&=~c}}function gd(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function Z_(){var t=Ja;return Ja<<=1,!(Ja&4194240)&&(Ja=64),t}function Fu(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function Ba(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-ci(e),t[e]=n}function AS(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var i=t.eventTimes;for(t=t.expirationTimes;0<n;){var r=31-ci(n),s=1<<r;e[r]=0,i[r]=-1,t[r]=-1,n&=~s}}function ip(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var i=31-ci(n),r=1<<i;r&e|t[i]&e&&(t[i]|=e),n&=~r}}var dt=0;function Q_(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var J_,rp,ev,tv,nv,_d=!1,tl=[],vr=null,xr=null,yr=null,va=new Map,xa=new Map,dr=[],CS="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Rm(t,e){switch(t){case"focusin":case"focusout":vr=null;break;case"dragenter":case"dragleave":xr=null;break;case"mouseover":case"mouseout":yr=null;break;case"pointerover":case"pointerout":va.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":xa.delete(e.pointerId)}}function Lo(t,e,n,i,r,s){return t===null||t.nativeEvent!==s?(t={blockedOn:e,domEventName:n,eventSystemFlags:i,nativeEvent:s,targetContainers:[r]},e!==null&&(e=Va(e),e!==null&&rp(e)),t):(t.eventSystemFlags|=i,e=t.targetContainers,r!==null&&e.indexOf(r)===-1&&e.push(r),t)}function RS(t,e,n,i,r){switch(e){case"focusin":return vr=Lo(vr,t,e,n,i,r),!0;case"dragenter":return xr=Lo(xr,t,e,n,i,r),!0;case"mouseover":return yr=Lo(yr,t,e,n,i,r),!0;case"pointerover":var s=r.pointerId;return va.set(s,Lo(va.get(s)||null,t,e,n,i,r)),!0;case"gotpointercapture":return s=r.pointerId,xa.set(s,Lo(xa.get(s)||null,t,e,n,i,r)),!0}return!1}function iv(t){var e=qr(t.target);if(e!==null){var n=us(e);if(n!==null){if(e=n.tag,e===13){if(e=X_(n),e!==null){t.blockedOn=e,nv(t.priority,function(){ev(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function sc(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=vd(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var i=new n.constructor(n.type,n);dd=i,n.target.dispatchEvent(i),dd=null}else return e=Va(n),e!==null&&rp(e),t.blockedOn=n,!1;e.shift()}return!0}function Pm(t,e,n){sc(t)&&n.delete(e)}function PS(){_d=!1,vr!==null&&sc(vr)&&(vr=null),xr!==null&&sc(xr)&&(xr=null),yr!==null&&sc(yr)&&(yr=null),va.forEach(Pm),xa.forEach(Pm)}function Do(t,e){t.blockedOn===e&&(t.blockedOn=null,_d||(_d=!0,On.unstable_scheduleCallback(On.unstable_NormalPriority,PS)))}function ya(t){function e(r){return Do(r,t)}if(0<tl.length){Do(tl[0],t);for(var n=1;n<tl.length;n++){var i=tl[n];i.blockedOn===t&&(i.blockedOn=null)}}for(vr!==null&&Do(vr,t),xr!==null&&Do(xr,t),yr!==null&&Do(yr,t),va.forEach(e),xa.forEach(e),n=0;n<dr.length;n++)i=dr[n],i.blockedOn===t&&(i.blockedOn=null);for(;0<dr.length&&(n=dr[0],n.blockedOn===null);)iv(n),n.blockedOn===null&&dr.shift()}var no=Zi.ReactCurrentBatchConfig,Pc=!0;function LS(t,e,n,i){var r=dt,s=no.transition;no.transition=null;try{dt=1,sp(t,e,n,i)}finally{dt=r,no.transition=s}}function DS(t,e,n,i){var r=dt,s=no.transition;no.transition=null;try{dt=4,sp(t,e,n,i)}finally{dt=r,no.transition=s}}function sp(t,e,n,i){if(Pc){var r=vd(t,e,n,i);if(r===null)ju(t,e,i,Lc,n),Rm(t,i);else if(RS(r,t,e,n,i))i.stopPropagation();else if(Rm(t,i),e&4&&-1<CS.indexOf(t)){for(;r!==null;){var s=Va(r);if(s!==null&&J_(s),s=vd(t,e,n,i),s===null&&ju(t,e,i,Lc,n),s===r)break;r=s}r!==null&&i.stopPropagation()}else ju(t,e,i,null,n)}}var Lc=null;function vd(t,e,n,i){if(Lc=null,t=tp(i),t=qr(t),t!==null)if(e=us(t),e===null)t=null;else if(n=e.tag,n===13){if(t=X_(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return Lc=t,null}function rv(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(xS()){case np:return 1;case q_:return 4;case Cc:case yS:return 16;case K_:return 536870912;default:return 16}default:return 16}}var mr=null,op=null,oc=null;function sv(){if(oc)return oc;var t,e=op,n=e.length,i,r="value"in mr?mr.value:mr.textContent,s=r.length;for(t=0;t<n&&e[t]===r[t];t++);var o=n-t;for(i=1;i<=o&&e[n-i]===r[s-i];i++);return oc=r.slice(t,1<i?1-i:void 0)}function ac(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function nl(){return!0}function Lm(){return!1}function Bn(t){function e(n,i,r,s,o){this._reactName=n,this._targetInst=r,this.type=i,this.nativeEvent=s,this.target=o,this.currentTarget=null;for(var c in t)t.hasOwnProperty(c)&&(n=t[c],this[c]=n?n(s):s[c]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?nl:Lm,this.isPropagationStopped=Lm,this}return Ct(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=nl)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=nl)},persist:function(){},isPersistent:nl}),e}var To={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},ap=Bn(To),za=Ct({},To,{view:0,detail:0}),IS=Bn(za),Ou,ku,Io,au=Ct({},za,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:lp,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==Io&&(Io&&t.type==="mousemove"?(Ou=t.screenX-Io.screenX,ku=t.screenY-Io.screenY):ku=Ou=0,Io=t),Ou)},movementY:function(t){return"movementY"in t?t.movementY:ku}}),Dm=Bn(au),NS=Ct({},au,{dataTransfer:0}),US=Bn(NS),FS=Ct({},za,{relatedTarget:0}),Bu=Bn(FS),OS=Ct({},To,{animationName:0,elapsedTime:0,pseudoElement:0}),kS=Bn(OS),BS=Ct({},To,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),zS=Bn(BS),VS=Ct({},To,{data:0}),Im=Bn(VS),HS={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},GS={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},WS={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function XS(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=WS[t])?!!e[t]:!1}function lp(){return XS}var jS=Ct({},za,{key:function(t){if(t.key){var e=HS[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=ac(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?GS[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:lp,charCode:function(t){return t.type==="keypress"?ac(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?ac(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),$S=Bn(jS),YS=Ct({},au,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Nm=Bn(YS),qS=Ct({},za,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:lp}),KS=Bn(qS),ZS=Ct({},To,{propertyName:0,elapsedTime:0,pseudoElement:0}),QS=Bn(ZS),JS=Ct({},au,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),eM=Bn(JS),tM=[9,13,27,32],cp=Xi&&"CompositionEvent"in window,oa=null;Xi&&"documentMode"in document&&(oa=document.documentMode);var nM=Xi&&"TextEvent"in window&&!oa,ov=Xi&&(!cp||oa&&8<oa&&11>=oa),Um=" ",Fm=!1;function av(t,e){switch(t){case"keyup":return tM.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function lv(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var Hs=!1;function iM(t,e){switch(t){case"compositionend":return lv(e);case"keypress":return e.which!==32?null:(Fm=!0,Um);case"textInput":return t=e.data,t===Um&&Fm?null:t;default:return null}}function rM(t,e){if(Hs)return t==="compositionend"||!cp&&av(t,e)?(t=sv(),oc=op=mr=null,Hs=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return ov&&e.locale!=="ko"?null:e.data;default:return null}}var sM={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Om(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!sM[t.type]:e==="textarea"}function cv(t,e,n,i){z_(i),e=Dc(e,"onChange"),0<e.length&&(n=new ap("onChange","change",null,n,i),t.push({event:n,listeners:e}))}var aa=null,Sa=null;function oM(t){yv(t,0)}function lu(t){var e=Xs(t);if(I_(e))return t}function aM(t,e){if(t==="change")return e}var uv=!1;if(Xi){var zu;if(Xi){var Vu="oninput"in document;if(!Vu){var km=document.createElement("div");km.setAttribute("oninput","return;"),Vu=typeof km.oninput=="function"}zu=Vu}else zu=!1;uv=zu&&(!document.documentMode||9<document.documentMode)}function Bm(){aa&&(aa.detachEvent("onpropertychange",fv),Sa=aa=null)}function fv(t){if(t.propertyName==="value"&&lu(Sa)){var e=[];cv(e,Sa,t,tp(t)),W_(oM,e)}}function lM(t,e,n){t==="focusin"?(Bm(),aa=e,Sa=n,aa.attachEvent("onpropertychange",fv)):t==="focusout"&&Bm()}function cM(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return lu(Sa)}function uM(t,e){if(t==="click")return lu(e)}function fM(t,e){if(t==="input"||t==="change")return lu(e)}function dM(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var fi=typeof Object.is=="function"?Object.is:dM;function Ma(t,e){if(fi(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),i=Object.keys(e);if(n.length!==i.length)return!1;for(i=0;i<n.length;i++){var r=n[i];if(!ed.call(e,r)||!fi(t[r],e[r]))return!1}return!0}function zm(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function Vm(t,e){var n=zm(t);t=0;for(var i;n;){if(n.nodeType===3){if(i=t+n.textContent.length,t<=e&&i>=e)return{node:n,offset:e-t};t=i}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=zm(n)}}function dv(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?dv(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function hv(){for(var t=window,e=Tc();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=Tc(t.document)}return e}function up(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function hM(t){var e=hv(),n=t.focusedElem,i=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&dv(n.ownerDocument.documentElement,n)){if(i!==null&&up(n)){if(e=i.start,t=i.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var r=n.textContent.length,s=Math.min(i.start,r);i=i.end===void 0?s:Math.min(i.end,r),!t.extend&&s>i&&(r=i,i=s,s=r),r=Vm(n,s);var o=Vm(n,i);r&&o&&(t.rangeCount!==1||t.anchorNode!==r.node||t.anchorOffset!==r.offset||t.focusNode!==o.node||t.focusOffset!==o.offset)&&(e=e.createRange(),e.setStart(r.node,r.offset),t.removeAllRanges(),s>i?(t.addRange(e),t.extend(o.node,o.offset)):(e.setEnd(o.node,o.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var pM=Xi&&"documentMode"in document&&11>=document.documentMode,Gs=null,xd=null,la=null,yd=!1;function Hm(t,e,n){var i=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;yd||Gs==null||Gs!==Tc(i)||(i=Gs,"selectionStart"in i&&up(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),la&&Ma(la,i)||(la=i,i=Dc(xd,"onSelect"),0<i.length&&(e=new ap("onSelect","select",null,e,n),t.push({event:e,listeners:i}),e.target=Gs)))}function il(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var Ws={animationend:il("Animation","AnimationEnd"),animationiteration:il("Animation","AnimationIteration"),animationstart:il("Animation","AnimationStart"),transitionend:il("Transition","TransitionEnd")},Hu={},pv={};Xi&&(pv=document.createElement("div").style,"AnimationEvent"in window||(delete Ws.animationend.animation,delete Ws.animationiteration.animation,delete Ws.animationstart.animation),"TransitionEvent"in window||delete Ws.transitionend.transition);function cu(t){if(Hu[t])return Hu[t];if(!Ws[t])return t;var e=Ws[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in pv)return Hu[t]=e[n];return t}var mv=cu("animationend"),gv=cu("animationiteration"),_v=cu("animationstart"),vv=cu("transitionend"),xv=new Map,Gm="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Pr(t,e){xv.set(t,e),cs(e,[t])}for(var Gu=0;Gu<Gm.length;Gu++){var Wu=Gm[Gu],mM=Wu.toLowerCase(),gM=Wu[0].toUpperCase()+Wu.slice(1);Pr(mM,"on"+gM)}Pr(mv,"onAnimationEnd");Pr(gv,"onAnimationIteration");Pr(_v,"onAnimationStart");Pr("dblclick","onDoubleClick");Pr("focusin","onFocus");Pr("focusout","onBlur");Pr(vv,"onTransitionEnd");co("onMouseEnter",["mouseout","mouseover"]);co("onMouseLeave",["mouseout","mouseover"]);co("onPointerEnter",["pointerout","pointerover"]);co("onPointerLeave",["pointerout","pointerover"]);cs("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));cs("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));cs("onBeforeInput",["compositionend","keypress","textInput","paste"]);cs("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));cs("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));cs("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var ea="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),_M=new Set("cancel close invalid load scroll toggle".split(" ").concat(ea));function Wm(t,e,n){var i=t.type||"unknown-event";t.currentTarget=n,mS(i,e,void 0,t),t.currentTarget=null}function yv(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var i=t[n],r=i.event;i=i.listeners;e:{var s=void 0;if(e)for(var o=i.length-1;0<=o;o--){var c=i[o],l=c.instance,f=c.currentTarget;if(c=c.listener,l!==s&&r.isPropagationStopped())break e;Wm(r,c,f),s=l}else for(o=0;o<i.length;o++){if(c=i[o],l=c.instance,f=c.currentTarget,c=c.listener,l!==s&&r.isPropagationStopped())break e;Wm(r,c,f),s=l}}}if(Ac)throw t=md,Ac=!1,md=null,t}function Mt(t,e){var n=e[Td];n===void 0&&(n=e[Td]=new Set);var i=t+"__bubble";n.has(i)||(Sv(e,t,2,!1),n.add(i))}function Xu(t,e,n){var i=0;e&&(i|=4),Sv(n,t,i,e)}var rl="_reactListening"+Math.random().toString(36).slice(2);function wa(t){if(!t[rl]){t[rl]=!0,C_.forEach(function(n){n!=="selectionchange"&&(_M.has(n)||Xu(n,!1,t),Xu(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[rl]||(e[rl]=!0,Xu("selectionchange",!1,e))}}function Sv(t,e,n,i){switch(rv(e)){case 1:var r=LS;break;case 4:r=DS;break;default:r=sp}n=r.bind(null,e,n,t),r=void 0,!pd||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(r=!0),i?r!==void 0?t.addEventListener(e,n,{capture:!0,passive:r}):t.addEventListener(e,n,!0):r!==void 0?t.addEventListener(e,n,{passive:r}):t.addEventListener(e,n,!1)}function ju(t,e,n,i,r){var s=i;if(!(e&1)&&!(e&2)&&i!==null)e:for(;;){if(i===null)return;var o=i.tag;if(o===3||o===4){var c=i.stateNode.containerInfo;if(c===r||c.nodeType===8&&c.parentNode===r)break;if(o===4)for(o=i.return;o!==null;){var l=o.tag;if((l===3||l===4)&&(l=o.stateNode.containerInfo,l===r||l.nodeType===8&&l.parentNode===r))return;o=o.return}for(;c!==null;){if(o=qr(c),o===null)return;if(l=o.tag,l===5||l===6){i=s=o;continue e}c=c.parentNode}}i=i.return}W_(function(){var f=s,d=tp(n),a=[];e:{var u=xv.get(t);if(u!==void 0){var h=ap,m=t;switch(t){case"keypress":if(ac(n)===0)break e;case"keydown":case"keyup":h=$S;break;case"focusin":m="focus",h=Bu;break;case"focusout":m="blur",h=Bu;break;case"beforeblur":case"afterblur":h=Bu;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":h=Dm;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":h=US;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":h=KS;break;case mv:case gv:case _v:h=kS;break;case vv:h=QS;break;case"scroll":h=IS;break;case"wheel":h=eM;break;case"copy":case"cut":case"paste":h=zS;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":h=Nm}var v=(e&4)!==0,g=!v&&t==="scroll",p=v?u!==null?u+"Capture":null:u;v=[];for(var _=f,x;_!==null;){x=_;var S=x.stateNode;if(x.tag===5&&S!==null&&(x=S,p!==null&&(S=_a(_,p),S!=null&&v.push(Ea(_,S,x)))),g)break;_=_.return}0<v.length&&(u=new h(u,m,null,n,d),a.push({event:u,listeners:v}))}}if(!(e&7)){e:{if(u=t==="mouseover"||t==="pointerover",h=t==="mouseout"||t==="pointerout",u&&n!==dd&&(m=n.relatedTarget||n.fromElement)&&(qr(m)||m[ji]))break e;if((h||u)&&(u=d.window===d?d:(u=d.ownerDocument)?u.defaultView||u.parentWindow:window,h?(m=n.relatedTarget||n.toElement,h=f,m=m?qr(m):null,m!==null&&(g=us(m),m!==g||m.tag!==5&&m.tag!==6)&&(m=null)):(h=null,m=f),h!==m)){if(v=Dm,S="onMouseLeave",p="onMouseEnter",_="mouse",(t==="pointerout"||t==="pointerover")&&(v=Nm,S="onPointerLeave",p="onPointerEnter",_="pointer"),g=h==null?u:Xs(h),x=m==null?u:Xs(m),u=new v(S,_+"leave",h,n,d),u.target=g,u.relatedTarget=x,S=null,qr(d)===f&&(v=new v(p,_+"enter",m,n,d),v.target=x,v.relatedTarget=g,S=v),g=S,h&&m)t:{for(v=h,p=m,_=0,x=v;x;x=gs(x))_++;for(x=0,S=p;S;S=gs(S))x++;for(;0<_-x;)v=gs(v),_--;for(;0<x-_;)p=gs(p),x--;for(;_--;){if(v===p||p!==null&&v===p.alternate)break t;v=gs(v),p=gs(p)}v=null}else v=null;h!==null&&Xm(a,u,h,v,!1),m!==null&&g!==null&&Xm(a,g,m,v,!0)}}e:{if(u=f?Xs(f):window,h=u.nodeName&&u.nodeName.toLowerCase(),h==="select"||h==="input"&&u.type==="file")var b=aM;else if(Om(u))if(uv)b=fM;else{b=cM;var M=lM}else(h=u.nodeName)&&h.toLowerCase()==="input"&&(u.type==="checkbox"||u.type==="radio")&&(b=uM);if(b&&(b=b(t,f))){cv(a,b,n,d);break e}M&&M(t,u,f),t==="focusout"&&(M=u._wrapperState)&&M.controlled&&u.type==="number"&&ad(u,"number",u.value)}switch(M=f?Xs(f):window,t){case"focusin":(Om(M)||M.contentEditable==="true")&&(Gs=M,xd=f,la=null);break;case"focusout":la=xd=Gs=null;break;case"mousedown":yd=!0;break;case"contextmenu":case"mouseup":case"dragend":yd=!1,Hm(a,n,d);break;case"selectionchange":if(pM)break;case"keydown":case"keyup":Hm(a,n,d)}var T;if(cp)e:{switch(t){case"compositionstart":var y="onCompositionStart";break e;case"compositionend":y="onCompositionEnd";break e;case"compositionupdate":y="onCompositionUpdate";break e}y=void 0}else Hs?av(t,n)&&(y="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(y="onCompositionStart");y&&(ov&&n.locale!=="ko"&&(Hs||y!=="onCompositionStart"?y==="onCompositionEnd"&&Hs&&(T=sv()):(mr=d,op="value"in mr?mr.value:mr.textContent,Hs=!0)),M=Dc(f,y),0<M.length&&(y=new Im(y,t,null,n,d),a.push({event:y,listeners:M}),T?y.data=T:(T=lv(n),T!==null&&(y.data=T)))),(T=nM?iM(t,n):rM(t,n))&&(f=Dc(f,"onBeforeInput"),0<f.length&&(d=new Im("onBeforeInput","beforeinput",null,n,d),a.push({event:d,listeners:f}),d.data=T))}yv(a,e)})}function Ea(t,e,n){return{instance:t,listener:e,currentTarget:n}}function Dc(t,e){for(var n=e+"Capture",i=[];t!==null;){var r=t,s=r.stateNode;r.tag===5&&s!==null&&(r=s,s=_a(t,n),s!=null&&i.unshift(Ea(t,s,r)),s=_a(t,e),s!=null&&i.push(Ea(t,s,r))),t=t.return}return i}function gs(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function Xm(t,e,n,i,r){for(var s=e._reactName,o=[];n!==null&&n!==i;){var c=n,l=c.alternate,f=c.stateNode;if(l!==null&&l===i)break;c.tag===5&&f!==null&&(c=f,r?(l=_a(n,s),l!=null&&o.unshift(Ea(n,l,c))):r||(l=_a(n,s),l!=null&&o.push(Ea(n,l,c)))),n=n.return}o.length!==0&&t.push({event:e,listeners:o})}var vM=/\r\n?/g,xM=/\u0000|\uFFFD/g;function jm(t){return(typeof t=="string"?t:""+t).replace(vM,`
`).replace(xM,"")}function sl(t,e,n){if(e=jm(e),jm(t)!==e&&n)throw Error(se(425))}function Ic(){}var Sd=null,Md=null;function wd(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var Ed=typeof setTimeout=="function"?setTimeout:void 0,yM=typeof clearTimeout=="function"?clearTimeout:void 0,$m=typeof Promise=="function"?Promise:void 0,SM=typeof queueMicrotask=="function"?queueMicrotask:typeof $m<"u"?function(t){return $m.resolve(null).then(t).catch(MM)}:Ed;function MM(t){setTimeout(function(){throw t})}function $u(t,e){var n=e,i=0;do{var r=n.nextSibling;if(t.removeChild(n),r&&r.nodeType===8)if(n=r.data,n==="/$"){if(i===0){t.removeChild(r),ya(e);return}i--}else n!=="$"&&n!=="$?"&&n!=="$!"||i++;n=r}while(n);ya(e)}function Sr(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function Ym(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var bo=Math.random().toString(36).slice(2),yi="__reactFiber$"+bo,Ta="__reactProps$"+bo,ji="__reactContainer$"+bo,Td="__reactEvents$"+bo,wM="__reactListeners$"+bo,EM="__reactHandles$"+bo;function qr(t){var e=t[yi];if(e)return e;for(var n=t.parentNode;n;){if(e=n[ji]||n[yi]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=Ym(t);t!==null;){if(n=t[yi])return n;t=Ym(t)}return e}t=n,n=t.parentNode}return null}function Va(t){return t=t[yi]||t[ji],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function Xs(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(se(33))}function uu(t){return t[Ta]||null}var bd=[],js=-1;function Lr(t){return{current:t}}function wt(t){0>js||(t.current=bd[js],bd[js]=null,js--)}function St(t,e){js++,bd[js]=t.current,t.current=e}var Ar={},cn=Lr(Ar),Sn=Lr(!1),ns=Ar;function uo(t,e){var n=t.type.contextTypes;if(!n)return Ar;var i=t.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===e)return i.__reactInternalMemoizedMaskedChildContext;var r={},s;for(s in n)r[s]=e[s];return i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=r),r}function Mn(t){return t=t.childContextTypes,t!=null}function Nc(){wt(Sn),wt(cn)}function qm(t,e,n){if(cn.current!==Ar)throw Error(se(168));St(cn,e),St(Sn,n)}function Mv(t,e,n){var i=t.stateNode;if(e=e.childContextTypes,typeof i.getChildContext!="function")return n;i=i.getChildContext();for(var r in i)if(!(r in e))throw Error(se(108,lS(t)||"Unknown",r));return Ct({},n,i)}function Uc(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||Ar,ns=cn.current,St(cn,t),St(Sn,Sn.current),!0}function Km(t,e,n){var i=t.stateNode;if(!i)throw Error(se(169));n?(t=Mv(t,e,ns),i.__reactInternalMemoizedMergedChildContext=t,wt(Sn),wt(cn),St(cn,t)):wt(Sn),St(Sn,n)}var ki=null,fu=!1,Yu=!1;function wv(t){ki===null?ki=[t]:ki.push(t)}function TM(t){fu=!0,wv(t)}function Dr(){if(!Yu&&ki!==null){Yu=!0;var t=0,e=dt;try{var n=ki;for(dt=1;t<n.length;t++){var i=n[t];do i=i(!0);while(i!==null)}ki=null,fu=!1}catch(r){throw ki!==null&&(ki=ki.slice(t+1)),Y_(np,Dr),r}finally{dt=e,Yu=!1}}return null}var $s=[],Ys=0,Fc=null,Oc=0,Wn=[],Xn=0,is=null,Bi=1,zi="";function Xr(t,e){$s[Ys++]=Oc,$s[Ys++]=Fc,Fc=t,Oc=e}function Ev(t,e,n){Wn[Xn++]=Bi,Wn[Xn++]=zi,Wn[Xn++]=is,is=t;var i=Bi;t=zi;var r=32-ci(i)-1;i&=~(1<<r),n+=1;var s=32-ci(e)+r;if(30<s){var o=r-r%5;s=(i&(1<<o)-1).toString(32),i>>=o,r-=o,Bi=1<<32-ci(e)+r|n<<r|i,zi=s+t}else Bi=1<<s|n<<r|i,zi=t}function fp(t){t.return!==null&&(Xr(t,1),Ev(t,1,0))}function dp(t){for(;t===Fc;)Fc=$s[--Ys],$s[Ys]=null,Oc=$s[--Ys],$s[Ys]=null;for(;t===is;)is=Wn[--Xn],Wn[Xn]=null,zi=Wn[--Xn],Wn[Xn]=null,Bi=Wn[--Xn],Wn[Xn]=null}var Un=null,Nn=null,Et=!1,ii=null;function Tv(t,e){var n=jn(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function Zm(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,Un=t,Nn=Sr(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,Un=t,Nn=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=is!==null?{id:Bi,overflow:zi}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=jn(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,Un=t,Nn=null,!0):!1;default:return!1}}function Ad(t){return(t.mode&1)!==0&&(t.flags&128)===0}function Cd(t){if(Et){var e=Nn;if(e){var n=e;if(!Zm(t,e)){if(Ad(t))throw Error(se(418));e=Sr(n.nextSibling);var i=Un;e&&Zm(t,e)?Tv(i,n):(t.flags=t.flags&-4097|2,Et=!1,Un=t)}}else{if(Ad(t))throw Error(se(418));t.flags=t.flags&-4097|2,Et=!1,Un=t}}}function Qm(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;Un=t}function ol(t){if(t!==Un)return!1;if(!Et)return Qm(t),Et=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!wd(t.type,t.memoizedProps)),e&&(e=Nn)){if(Ad(t))throw bv(),Error(se(418));for(;e;)Tv(t,e),e=Sr(e.nextSibling)}if(Qm(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(se(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){Nn=Sr(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}Nn=null}}else Nn=Un?Sr(t.stateNode.nextSibling):null;return!0}function bv(){for(var t=Nn;t;)t=Sr(t.nextSibling)}function fo(){Nn=Un=null,Et=!1}function hp(t){ii===null?ii=[t]:ii.push(t)}var bM=Zi.ReactCurrentBatchConfig;function No(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(se(309));var i=n.stateNode}if(!i)throw Error(se(147,t));var r=i,s=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(o){var c=r.refs;o===null?delete c[s]:c[s]=o},e._stringRef=s,e)}if(typeof t!="string")throw Error(se(284));if(!n._owner)throw Error(se(290,t))}return t}function al(t,e){throw t=Object.prototype.toString.call(e),Error(se(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function Jm(t){var e=t._init;return e(t._payload)}function Av(t){function e(p,_){if(t){var x=p.deletions;x===null?(p.deletions=[_],p.flags|=16):x.push(_)}}function n(p,_){if(!t)return null;for(;_!==null;)e(p,_),_=_.sibling;return null}function i(p,_){for(p=new Map;_!==null;)_.key!==null?p.set(_.key,_):p.set(_.index,_),_=_.sibling;return p}function r(p,_){return p=Tr(p,_),p.index=0,p.sibling=null,p}function s(p,_,x){return p.index=x,t?(x=p.alternate,x!==null?(x=x.index,x<_?(p.flags|=2,_):x):(p.flags|=2,_)):(p.flags|=1048576,_)}function o(p){return t&&p.alternate===null&&(p.flags|=2),p}function c(p,_,x,S){return _===null||_.tag!==6?(_=tf(x,p.mode,S),_.return=p,_):(_=r(_,x),_.return=p,_)}function l(p,_,x,S){var b=x.type;return b===Vs?d(p,_,x.props.children,S,x.key):_!==null&&(_.elementType===b||typeof b=="object"&&b!==null&&b.$$typeof===cr&&Jm(b)===_.type)?(S=r(_,x.props),S.ref=No(p,_,x),S.return=p,S):(S=pc(x.type,x.key,x.props,null,p.mode,S),S.ref=No(p,_,x),S.return=p,S)}function f(p,_,x,S){return _===null||_.tag!==4||_.stateNode.containerInfo!==x.containerInfo||_.stateNode.implementation!==x.implementation?(_=nf(x,p.mode,S),_.return=p,_):(_=r(_,x.children||[]),_.return=p,_)}function d(p,_,x,S,b){return _===null||_.tag!==7?(_=ts(x,p.mode,S,b),_.return=p,_):(_=r(_,x),_.return=p,_)}function a(p,_,x){if(typeof _=="string"&&_!==""||typeof _=="number")return _=tf(""+_,p.mode,x),_.return=p,_;if(typeof _=="object"&&_!==null){switch(_.$$typeof){case Ka:return x=pc(_.type,_.key,_.props,null,p.mode,x),x.ref=No(p,null,_),x.return=p,x;case zs:return _=nf(_,p.mode,x),_.return=p,_;case cr:var S=_._init;return a(p,S(_._payload),x)}if(Qo(_)||Ro(_))return _=ts(_,p.mode,x,null),_.return=p,_;al(p,_)}return null}function u(p,_,x,S){var b=_!==null?_.key:null;if(typeof x=="string"&&x!==""||typeof x=="number")return b!==null?null:c(p,_,""+x,S);if(typeof x=="object"&&x!==null){switch(x.$$typeof){case Ka:return x.key===b?l(p,_,x,S):null;case zs:return x.key===b?f(p,_,x,S):null;case cr:return b=x._init,u(p,_,b(x._payload),S)}if(Qo(x)||Ro(x))return b!==null?null:d(p,_,x,S,null);al(p,x)}return null}function h(p,_,x,S,b){if(typeof S=="string"&&S!==""||typeof S=="number")return p=p.get(x)||null,c(_,p,""+S,b);if(typeof S=="object"&&S!==null){switch(S.$$typeof){case Ka:return p=p.get(S.key===null?x:S.key)||null,l(_,p,S,b);case zs:return p=p.get(S.key===null?x:S.key)||null,f(_,p,S,b);case cr:var M=S._init;return h(p,_,x,M(S._payload),b)}if(Qo(S)||Ro(S))return p=p.get(x)||null,d(_,p,S,b,null);al(_,S)}return null}function m(p,_,x,S){for(var b=null,M=null,T=_,y=_=0,w=null;T!==null&&y<x.length;y++){T.index>y?(w=T,T=null):w=T.sibling;var D=u(p,T,x[y],S);if(D===null){T===null&&(T=w);break}t&&T&&D.alternate===null&&e(p,T),_=s(D,_,y),M===null?b=D:M.sibling=D,M=D,T=w}if(y===x.length)return n(p,T),Et&&Xr(p,y),b;if(T===null){for(;y<x.length;y++)T=a(p,x[y],S),T!==null&&(_=s(T,_,y),M===null?b=T:M.sibling=T,M=T);return Et&&Xr(p,y),b}for(T=i(p,T);y<x.length;y++)w=h(T,p,y,x[y],S),w!==null&&(t&&w.alternate!==null&&T.delete(w.key===null?y:w.key),_=s(w,_,y),M===null?b=w:M.sibling=w,M=w);return t&&T.forEach(function(C){return e(p,C)}),Et&&Xr(p,y),b}function v(p,_,x,S){var b=Ro(x);if(typeof b!="function")throw Error(se(150));if(x=b.call(x),x==null)throw Error(se(151));for(var M=b=null,T=_,y=_=0,w=null,D=x.next();T!==null&&!D.done;y++,D=x.next()){T.index>y?(w=T,T=null):w=T.sibling;var C=u(p,T,D.value,S);if(C===null){T===null&&(T=w);break}t&&T&&C.alternate===null&&e(p,T),_=s(C,_,y),M===null?b=C:M.sibling=C,M=C,T=w}if(D.done)return n(p,T),Et&&Xr(p,y),b;if(T===null){for(;!D.done;y++,D=x.next())D=a(p,D.value,S),D!==null&&(_=s(D,_,y),M===null?b=D:M.sibling=D,M=D);return Et&&Xr(p,y),b}for(T=i(p,T);!D.done;y++,D=x.next())D=h(T,p,y,D.value,S),D!==null&&(t&&D.alternate!==null&&T.delete(D.key===null?y:D.key),_=s(D,_,y),M===null?b=D:M.sibling=D,M=D);return t&&T.forEach(function(N){return e(p,N)}),Et&&Xr(p,y),b}function g(p,_,x,S){if(typeof x=="object"&&x!==null&&x.type===Vs&&x.key===null&&(x=x.props.children),typeof x=="object"&&x!==null){switch(x.$$typeof){case Ka:e:{for(var b=x.key,M=_;M!==null;){if(M.key===b){if(b=x.type,b===Vs){if(M.tag===7){n(p,M.sibling),_=r(M,x.props.children),_.return=p,p=_;break e}}else if(M.elementType===b||typeof b=="object"&&b!==null&&b.$$typeof===cr&&Jm(b)===M.type){n(p,M.sibling),_=r(M,x.props),_.ref=No(p,M,x),_.return=p,p=_;break e}n(p,M);break}else e(p,M);M=M.sibling}x.type===Vs?(_=ts(x.props.children,p.mode,S,x.key),_.return=p,p=_):(S=pc(x.type,x.key,x.props,null,p.mode,S),S.ref=No(p,_,x),S.return=p,p=S)}return o(p);case zs:e:{for(M=x.key;_!==null;){if(_.key===M)if(_.tag===4&&_.stateNode.containerInfo===x.containerInfo&&_.stateNode.implementation===x.implementation){n(p,_.sibling),_=r(_,x.children||[]),_.return=p,p=_;break e}else{n(p,_);break}else e(p,_);_=_.sibling}_=nf(x,p.mode,S),_.return=p,p=_}return o(p);case cr:return M=x._init,g(p,_,M(x._payload),S)}if(Qo(x))return m(p,_,x,S);if(Ro(x))return v(p,_,x,S);al(p,x)}return typeof x=="string"&&x!==""||typeof x=="number"?(x=""+x,_!==null&&_.tag===6?(n(p,_.sibling),_=r(_,x),_.return=p,p=_):(n(p,_),_=tf(x,p.mode,S),_.return=p,p=_),o(p)):n(p,_)}return g}var ho=Av(!0),Cv=Av(!1),kc=Lr(null),Bc=null,qs=null,pp=null;function mp(){pp=qs=Bc=null}function gp(t){var e=kc.current;wt(kc),t._currentValue=e}function Rd(t,e,n){for(;t!==null;){var i=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),t===n)break;t=t.return}}function io(t,e){Bc=t,pp=qs=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(yn=!0),t.firstContext=null)}function Yn(t){var e=t._currentValue;if(pp!==t)if(t={context:t,memoizedValue:e,next:null},qs===null){if(Bc===null)throw Error(se(308));qs=t,Bc.dependencies={lanes:0,firstContext:t}}else qs=qs.next=t;return e}var Kr=null;function _p(t){Kr===null?Kr=[t]:Kr.push(t)}function Rv(t,e,n,i){var r=e.interleaved;return r===null?(n.next=n,_p(e)):(n.next=r.next,r.next=n),e.interleaved=n,$i(t,i)}function $i(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var ur=!1;function vp(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Pv(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function Hi(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function Mr(t,e,n){var i=t.updateQueue;if(i===null)return null;if(i=i.shared,et&2){var r=i.pending;return r===null?e.next=e:(e.next=r.next,r.next=e),i.pending=e,$i(t,n)}return r=i.interleaved,r===null?(e.next=e,_p(i)):(e.next=r.next,r.next=e),i.interleaved=e,$i(t,n)}function lc(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,ip(t,n)}}function eg(t,e){var n=t.updateQueue,i=t.alternate;if(i!==null&&(i=i.updateQueue,n===i)){var r=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?r=s=o:s=s.next=o,n=n.next}while(n!==null);s===null?r=s=e:s=s.next=e}else r=s=e;n={baseState:i.baseState,firstBaseUpdate:r,lastBaseUpdate:s,shared:i.shared,effects:i.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function zc(t,e,n,i){var r=t.updateQueue;ur=!1;var s=r.firstBaseUpdate,o=r.lastBaseUpdate,c=r.shared.pending;if(c!==null){r.shared.pending=null;var l=c,f=l.next;l.next=null,o===null?s=f:o.next=f,o=l;var d=t.alternate;d!==null&&(d=d.updateQueue,c=d.lastBaseUpdate,c!==o&&(c===null?d.firstBaseUpdate=f:c.next=f,d.lastBaseUpdate=l))}if(s!==null){var a=r.baseState;o=0,d=f=l=null,c=s;do{var u=c.lane,h=c.eventTime;if((i&u)===u){d!==null&&(d=d.next={eventTime:h,lane:0,tag:c.tag,payload:c.payload,callback:c.callback,next:null});e:{var m=t,v=c;switch(u=e,h=n,v.tag){case 1:if(m=v.payload,typeof m=="function"){a=m.call(h,a,u);break e}a=m;break e;case 3:m.flags=m.flags&-65537|128;case 0:if(m=v.payload,u=typeof m=="function"?m.call(h,a,u):m,u==null)break e;a=Ct({},a,u);break e;case 2:ur=!0}}c.callback!==null&&c.lane!==0&&(t.flags|=64,u=r.effects,u===null?r.effects=[c]:u.push(c))}else h={eventTime:h,lane:u,tag:c.tag,payload:c.payload,callback:c.callback,next:null},d===null?(f=d=h,l=a):d=d.next=h,o|=u;if(c=c.next,c===null){if(c=r.shared.pending,c===null)break;u=c,c=u.next,u.next=null,r.lastBaseUpdate=u,r.shared.pending=null}}while(!0);if(d===null&&(l=a),r.baseState=l,r.firstBaseUpdate=f,r.lastBaseUpdate=d,e=r.shared.interleaved,e!==null){r=e;do o|=r.lane,r=r.next;while(r!==e)}else s===null&&(r.shared.lanes=0);ss|=o,t.lanes=o,t.memoizedState=a}}function tg(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var i=t[e],r=i.callback;if(r!==null){if(i.callback=null,i=n,typeof r!="function")throw Error(se(191,r));r.call(i)}}}var Ha={},wi=Lr(Ha),ba=Lr(Ha),Aa=Lr(Ha);function Zr(t){if(t===Ha)throw Error(se(174));return t}function xp(t,e){switch(St(Aa,e),St(ba,t),St(wi,Ha),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:cd(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=cd(e,t)}wt(wi),St(wi,e)}function po(){wt(wi),wt(ba),wt(Aa)}function Lv(t){Zr(Aa.current);var e=Zr(wi.current),n=cd(e,t.type);e!==n&&(St(ba,t),St(wi,n))}function yp(t){ba.current===t&&(wt(wi),wt(ba))}var bt=Lr(0);function Vc(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var qu=[];function Sp(){for(var t=0;t<qu.length;t++)qu[t]._workInProgressVersionPrimary=null;qu.length=0}var cc=Zi.ReactCurrentDispatcher,Ku=Zi.ReactCurrentBatchConfig,rs=0,At=null,Bt=null,Xt=null,Hc=!1,ca=!1,Ca=0,AM=0;function tn(){throw Error(se(321))}function Mp(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!fi(t[n],e[n]))return!1;return!0}function wp(t,e,n,i,r,s){if(rs=s,At=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,cc.current=t===null||t.memoizedState===null?LM:DM,t=n(i,r),ca){s=0;do{if(ca=!1,Ca=0,25<=s)throw Error(se(301));s+=1,Xt=Bt=null,e.updateQueue=null,cc.current=IM,t=n(i,r)}while(ca)}if(cc.current=Gc,e=Bt!==null&&Bt.next!==null,rs=0,Xt=Bt=At=null,Hc=!1,e)throw Error(se(300));return t}function Ep(){var t=Ca!==0;return Ca=0,t}function vi(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Xt===null?At.memoizedState=Xt=t:Xt=Xt.next=t,Xt}function qn(){if(Bt===null){var t=At.alternate;t=t!==null?t.memoizedState:null}else t=Bt.next;var e=Xt===null?At.memoizedState:Xt.next;if(e!==null)Xt=e,Bt=t;else{if(t===null)throw Error(se(310));Bt=t,t={memoizedState:Bt.memoizedState,baseState:Bt.baseState,baseQueue:Bt.baseQueue,queue:Bt.queue,next:null},Xt===null?At.memoizedState=Xt=t:Xt=Xt.next=t}return Xt}function Ra(t,e){return typeof e=="function"?e(t):e}function Zu(t){var e=qn(),n=e.queue;if(n===null)throw Error(se(311));n.lastRenderedReducer=t;var i=Bt,r=i.baseQueue,s=n.pending;if(s!==null){if(r!==null){var o=r.next;r.next=s.next,s.next=o}i.baseQueue=r=s,n.pending=null}if(r!==null){s=r.next,i=i.baseState;var c=o=null,l=null,f=s;do{var d=f.lane;if((rs&d)===d)l!==null&&(l=l.next={lane:0,action:f.action,hasEagerState:f.hasEagerState,eagerState:f.eagerState,next:null}),i=f.hasEagerState?f.eagerState:t(i,f.action);else{var a={lane:d,action:f.action,hasEagerState:f.hasEagerState,eagerState:f.eagerState,next:null};l===null?(c=l=a,o=i):l=l.next=a,At.lanes|=d,ss|=d}f=f.next}while(f!==null&&f!==s);l===null?o=i:l.next=c,fi(i,e.memoizedState)||(yn=!0),e.memoizedState=i,e.baseState=o,e.baseQueue=l,n.lastRenderedState=i}if(t=n.interleaved,t!==null){r=t;do s=r.lane,At.lanes|=s,ss|=s,r=r.next;while(r!==t)}else r===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function Qu(t){var e=qn(),n=e.queue;if(n===null)throw Error(se(311));n.lastRenderedReducer=t;var i=n.dispatch,r=n.pending,s=e.memoizedState;if(r!==null){n.pending=null;var o=r=r.next;do s=t(s,o.action),o=o.next;while(o!==r);fi(s,e.memoizedState)||(yn=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),n.lastRenderedState=s}return[s,i]}function Dv(){}function Iv(t,e){var n=At,i=qn(),r=e(),s=!fi(i.memoizedState,r);if(s&&(i.memoizedState=r,yn=!0),i=i.queue,Tp(Fv.bind(null,n,i,t),[t]),i.getSnapshot!==e||s||Xt!==null&&Xt.memoizedState.tag&1){if(n.flags|=2048,Pa(9,Uv.bind(null,n,i,r,e),void 0,null),jt===null)throw Error(se(349));rs&30||Nv(n,e,r)}return r}function Nv(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=At.updateQueue,e===null?(e={lastEffect:null,stores:null},At.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function Uv(t,e,n,i){e.value=n,e.getSnapshot=i,Ov(e)&&kv(t)}function Fv(t,e,n){return n(function(){Ov(e)&&kv(t)})}function Ov(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!fi(t,n)}catch{return!0}}function kv(t){var e=$i(t,1);e!==null&&ui(e,t,1,-1)}function ng(t){var e=vi();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Ra,lastRenderedState:t},e.queue=t,t=t.dispatch=PM.bind(null,At,t),[e.memoizedState,t]}function Pa(t,e,n,i){return t={tag:t,create:e,destroy:n,deps:i,next:null},e=At.updateQueue,e===null?(e={lastEffect:null,stores:null},At.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(i=n.next,n.next=t,t.next=i,e.lastEffect=t)),t}function Bv(){return qn().memoizedState}function uc(t,e,n,i){var r=vi();At.flags|=t,r.memoizedState=Pa(1|e,n,void 0,i===void 0?null:i)}function du(t,e,n,i){var r=qn();i=i===void 0?null:i;var s=void 0;if(Bt!==null){var o=Bt.memoizedState;if(s=o.destroy,i!==null&&Mp(i,o.deps)){r.memoizedState=Pa(e,n,s,i);return}}At.flags|=t,r.memoizedState=Pa(1|e,n,s,i)}function ig(t,e){return uc(8390656,8,t,e)}function Tp(t,e){return du(2048,8,t,e)}function zv(t,e){return du(4,2,t,e)}function Vv(t,e){return du(4,4,t,e)}function Hv(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function Gv(t,e,n){return n=n!=null?n.concat([t]):null,du(4,4,Hv.bind(null,e,t),n)}function bp(){}function Wv(t,e){var n=qn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&Mp(e,i[1])?i[0]:(n.memoizedState=[t,e],t)}function Xv(t,e){var n=qn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&Mp(e,i[1])?i[0]:(t=t(),n.memoizedState=[t,e],t)}function jv(t,e,n){return rs&21?(fi(n,e)||(n=Z_(),At.lanes|=n,ss|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,yn=!0),t.memoizedState=n)}function CM(t,e){var n=dt;dt=n!==0&&4>n?n:4,t(!0);var i=Ku.transition;Ku.transition={};try{t(!1),e()}finally{dt=n,Ku.transition=i}}function $v(){return qn().memoizedState}function RM(t,e,n){var i=Er(t);if(n={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null},Yv(t))qv(e,n);else if(n=Rv(t,e,n,i),n!==null){var r=hn();ui(n,t,i,r),Kv(n,e,i)}}function PM(t,e,n){var i=Er(t),r={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null};if(Yv(t))qv(e,r);else{var s=t.alternate;if(t.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var o=e.lastRenderedState,c=s(o,n);if(r.hasEagerState=!0,r.eagerState=c,fi(c,o)){var l=e.interleaved;l===null?(r.next=r,_p(e)):(r.next=l.next,l.next=r),e.interleaved=r;return}}catch{}finally{}n=Rv(t,e,r,i),n!==null&&(r=hn(),ui(n,t,i,r),Kv(n,e,i))}}function Yv(t){var e=t.alternate;return t===At||e!==null&&e===At}function qv(t,e){ca=Hc=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function Kv(t,e,n){if(n&4194240){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,ip(t,n)}}var Gc={readContext:Yn,useCallback:tn,useContext:tn,useEffect:tn,useImperativeHandle:tn,useInsertionEffect:tn,useLayoutEffect:tn,useMemo:tn,useReducer:tn,useRef:tn,useState:tn,useDebugValue:tn,useDeferredValue:tn,useTransition:tn,useMutableSource:tn,useSyncExternalStore:tn,useId:tn,unstable_isNewReconciler:!1},LM={readContext:Yn,useCallback:function(t,e){return vi().memoizedState=[t,e===void 0?null:e],t},useContext:Yn,useEffect:ig,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,uc(4194308,4,Hv.bind(null,e,t),n)},useLayoutEffect:function(t,e){return uc(4194308,4,t,e)},useInsertionEffect:function(t,e){return uc(4,2,t,e)},useMemo:function(t,e){var n=vi();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var i=vi();return e=n!==void 0?n(e):e,i.memoizedState=i.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},i.queue=t,t=t.dispatch=RM.bind(null,At,t),[i.memoizedState,t]},useRef:function(t){var e=vi();return t={current:t},e.memoizedState=t},useState:ng,useDebugValue:bp,useDeferredValue:function(t){return vi().memoizedState=t},useTransition:function(){var t=ng(!1),e=t[0];return t=CM.bind(null,t[1]),vi().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var i=At,r=vi();if(Et){if(n===void 0)throw Error(se(407));n=n()}else{if(n=e(),jt===null)throw Error(se(349));rs&30||Nv(i,e,n)}r.memoizedState=n;var s={value:n,getSnapshot:e};return r.queue=s,ig(Fv.bind(null,i,s,t),[t]),i.flags|=2048,Pa(9,Uv.bind(null,i,s,n,e),void 0,null),n},useId:function(){var t=vi(),e=jt.identifierPrefix;if(Et){var n=zi,i=Bi;n=(i&~(1<<32-ci(i)-1)).toString(32)+n,e=":"+e+"R"+n,n=Ca++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=AM++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},DM={readContext:Yn,useCallback:Wv,useContext:Yn,useEffect:Tp,useImperativeHandle:Gv,useInsertionEffect:zv,useLayoutEffect:Vv,useMemo:Xv,useReducer:Zu,useRef:Bv,useState:function(){return Zu(Ra)},useDebugValue:bp,useDeferredValue:function(t){var e=qn();return jv(e,Bt.memoizedState,t)},useTransition:function(){var t=Zu(Ra)[0],e=qn().memoizedState;return[t,e]},useMutableSource:Dv,useSyncExternalStore:Iv,useId:$v,unstable_isNewReconciler:!1},IM={readContext:Yn,useCallback:Wv,useContext:Yn,useEffect:Tp,useImperativeHandle:Gv,useInsertionEffect:zv,useLayoutEffect:Vv,useMemo:Xv,useReducer:Qu,useRef:Bv,useState:function(){return Qu(Ra)},useDebugValue:bp,useDeferredValue:function(t){var e=qn();return Bt===null?e.memoizedState=t:jv(e,Bt.memoizedState,t)},useTransition:function(){var t=Qu(Ra)[0],e=qn().memoizedState;return[t,e]},useMutableSource:Dv,useSyncExternalStore:Iv,useId:$v,unstable_isNewReconciler:!1};function ti(t,e){if(t&&t.defaultProps){e=Ct({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}function Pd(t,e,n,i){e=t.memoizedState,n=n(i,e),n=n==null?e:Ct({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var hu={isMounted:function(t){return(t=t._reactInternals)?us(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var i=hn(),r=Er(t),s=Hi(i,r);s.payload=e,n!=null&&(s.callback=n),e=Mr(t,s,r),e!==null&&(ui(e,t,r,i),lc(e,t,r))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var i=hn(),r=Er(t),s=Hi(i,r);s.tag=1,s.payload=e,n!=null&&(s.callback=n),e=Mr(t,s,r),e!==null&&(ui(e,t,r,i),lc(e,t,r))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=hn(),i=Er(t),r=Hi(n,i);r.tag=2,e!=null&&(r.callback=e),e=Mr(t,r,i),e!==null&&(ui(e,t,i,n),lc(e,t,i))}};function rg(t,e,n,i,r,s,o){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(i,s,o):e.prototype&&e.prototype.isPureReactComponent?!Ma(n,i)||!Ma(r,s):!0}function Zv(t,e,n){var i=!1,r=Ar,s=e.contextType;return typeof s=="object"&&s!==null?s=Yn(s):(r=Mn(e)?ns:cn.current,i=e.contextTypes,s=(i=i!=null)?uo(t,r):Ar),e=new e(n,s),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=hu,t.stateNode=e,e._reactInternals=t,i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=r,t.__reactInternalMemoizedMaskedChildContext=s),e}function sg(t,e,n,i){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,i),e.state!==t&&hu.enqueueReplaceState(e,e.state,null)}function Ld(t,e,n,i){var r=t.stateNode;r.props=n,r.state=t.memoizedState,r.refs={},vp(t);var s=e.contextType;typeof s=="object"&&s!==null?r.context=Yn(s):(s=Mn(e)?ns:cn.current,r.context=uo(t,s)),r.state=t.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(Pd(t,e,s,n),r.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(e=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),e!==r.state&&hu.enqueueReplaceState(r,r.state,null),zc(t,n,r,i),r.state=t.memoizedState),typeof r.componentDidMount=="function"&&(t.flags|=4194308)}function mo(t,e){try{var n="",i=e;do n+=aS(i),i=i.return;while(i);var r=n}catch(s){r=`
Error generating stack: `+s.message+`
`+s.stack}return{value:t,source:e,stack:r,digest:null}}function Ju(t,e,n){return{value:t,source:null,stack:n??null,digest:e??null}}function Dd(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var NM=typeof WeakMap=="function"?WeakMap:Map;function Qv(t,e,n){n=Hi(-1,n),n.tag=3,n.payload={element:null};var i=e.value;return n.callback=function(){Xc||(Xc=!0,Hd=i),Dd(t,e)},n}function Jv(t,e,n){n=Hi(-1,n),n.tag=3;var i=t.type.getDerivedStateFromError;if(typeof i=="function"){var r=e.value;n.payload=function(){return i(r)},n.callback=function(){Dd(t,e)}}var s=t.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){Dd(t,e),typeof i!="function"&&(wr===null?wr=new Set([this]):wr.add(this));var o=e.stack;this.componentDidCatch(e.value,{componentStack:o!==null?o:""})}),n}function og(t,e,n){var i=t.pingCache;if(i===null){i=t.pingCache=new NM;var r=new Set;i.set(e,r)}else r=i.get(e),r===void 0&&(r=new Set,i.set(e,r));r.has(n)||(r.add(n),t=YM.bind(null,t,e,n),e.then(t,t))}function ag(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function lg(t,e,n,i,r){return t.mode&1?(t.flags|=65536,t.lanes=r,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=Hi(-1,1),e.tag=2,Mr(n,e,1))),n.lanes|=1),t)}var UM=Zi.ReactCurrentOwner,yn=!1;function dn(t,e,n,i){e.child=t===null?Cv(e,null,n,i):ho(e,t.child,n,i)}function cg(t,e,n,i,r){n=n.render;var s=e.ref;return io(e,r),i=wp(t,e,n,i,s,r),n=Ep(),t!==null&&!yn?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,Yi(t,e,r)):(Et&&n&&fp(e),e.flags|=1,dn(t,e,i,r),e.child)}function ug(t,e,n,i,r){if(t===null){var s=n.type;return typeof s=="function"&&!Np(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=s,ex(t,e,s,i,r)):(t=pc(n.type,null,i,e,e.mode,r),t.ref=e.ref,t.return=e,e.child=t)}if(s=t.child,!(t.lanes&r)){var o=s.memoizedProps;if(n=n.compare,n=n!==null?n:Ma,n(o,i)&&t.ref===e.ref)return Yi(t,e,r)}return e.flags|=1,t=Tr(s,i),t.ref=e.ref,t.return=e,e.child=t}function ex(t,e,n,i,r){if(t!==null){var s=t.memoizedProps;if(Ma(s,i)&&t.ref===e.ref)if(yn=!1,e.pendingProps=i=s,(t.lanes&r)!==0)t.flags&131072&&(yn=!0);else return e.lanes=t.lanes,Yi(t,e,r)}return Id(t,e,n,i,r)}function tx(t,e,n){var i=e.pendingProps,r=i.children,s=t!==null?t.memoizedState:null;if(i.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},St(Zs,Pn),Pn|=n;else{if(!(n&1073741824))return t=s!==null?s.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,St(Zs,Pn),Pn|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=s!==null?s.baseLanes:n,St(Zs,Pn),Pn|=i}else s!==null?(i=s.baseLanes|n,e.memoizedState=null):i=n,St(Zs,Pn),Pn|=i;return dn(t,e,r,n),e.child}function nx(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function Id(t,e,n,i,r){var s=Mn(n)?ns:cn.current;return s=uo(e,s),io(e,r),n=wp(t,e,n,i,s,r),i=Ep(),t!==null&&!yn?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,Yi(t,e,r)):(Et&&i&&fp(e),e.flags|=1,dn(t,e,n,r),e.child)}function fg(t,e,n,i,r){if(Mn(n)){var s=!0;Uc(e)}else s=!1;if(io(e,r),e.stateNode===null)fc(t,e),Zv(e,n,i),Ld(e,n,i,r),i=!0;else if(t===null){var o=e.stateNode,c=e.memoizedProps;o.props=c;var l=o.context,f=n.contextType;typeof f=="object"&&f!==null?f=Yn(f):(f=Mn(n)?ns:cn.current,f=uo(e,f));var d=n.getDerivedStateFromProps,a=typeof d=="function"||typeof o.getSnapshotBeforeUpdate=="function";a||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(c!==i||l!==f)&&sg(e,o,i,f),ur=!1;var u=e.memoizedState;o.state=u,zc(e,i,o,r),l=e.memoizedState,c!==i||u!==l||Sn.current||ur?(typeof d=="function"&&(Pd(e,n,d,i),l=e.memoizedState),(c=ur||rg(e,n,c,i,u,l,f))?(a||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(e.flags|=4194308)):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=l),o.props=i,o.state=l,o.context=f,i=c):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{o=e.stateNode,Pv(t,e),c=e.memoizedProps,f=e.type===e.elementType?c:ti(e.type,c),o.props=f,a=e.pendingProps,u=o.context,l=n.contextType,typeof l=="object"&&l!==null?l=Yn(l):(l=Mn(n)?ns:cn.current,l=uo(e,l));var h=n.getDerivedStateFromProps;(d=typeof h=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(c!==a||u!==l)&&sg(e,o,i,l),ur=!1,u=e.memoizedState,o.state=u,zc(e,i,o,r);var m=e.memoizedState;c!==a||u!==m||Sn.current||ur?(typeof h=="function"&&(Pd(e,n,h,i),m=e.memoizedState),(f=ur||rg(e,n,f,i,u,m,l)||!1)?(d||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(i,m,l),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(i,m,l)),typeof o.componentDidUpdate=="function"&&(e.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof o.componentDidUpdate!="function"||c===t.memoizedProps&&u===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||c===t.memoizedProps&&u===t.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=m),o.props=i,o.state=m,o.context=l,i=f):(typeof o.componentDidUpdate!="function"||c===t.memoizedProps&&u===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||c===t.memoizedProps&&u===t.memoizedState||(e.flags|=1024),i=!1)}return Nd(t,e,n,i,s,r)}function Nd(t,e,n,i,r,s){nx(t,e);var o=(e.flags&128)!==0;if(!i&&!o)return r&&Km(e,n,!1),Yi(t,e,s);i=e.stateNode,UM.current=e;var c=o&&typeof n.getDerivedStateFromError!="function"?null:i.render();return e.flags|=1,t!==null&&o?(e.child=ho(e,t.child,null,s),e.child=ho(e,null,c,s)):dn(t,e,c,s),e.memoizedState=i.state,r&&Km(e,n,!0),e.child}function ix(t){var e=t.stateNode;e.pendingContext?qm(t,e.pendingContext,e.pendingContext!==e.context):e.context&&qm(t,e.context,!1),xp(t,e.containerInfo)}function dg(t,e,n,i,r){return fo(),hp(r),e.flags|=256,dn(t,e,n,i),e.child}var Ud={dehydrated:null,treeContext:null,retryLane:0};function Fd(t){return{baseLanes:t,cachePool:null,transitions:null}}function rx(t,e,n){var i=e.pendingProps,r=bt.current,s=!1,o=(e.flags&128)!==0,c;if((c=o)||(c=t!==null&&t.memoizedState===null?!1:(r&2)!==0),c?(s=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(r|=1),St(bt,r&1),t===null)return Cd(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(o=i.children,t=i.fallback,s?(i=e.mode,s=e.child,o={mode:"hidden",children:o},!(i&1)&&s!==null?(s.childLanes=0,s.pendingProps=o):s=gu(o,i,0,null),t=ts(t,i,n,null),s.return=e,t.return=e,s.sibling=t,e.child=s,e.child.memoizedState=Fd(n),e.memoizedState=Ud,t):Ap(e,o));if(r=t.memoizedState,r!==null&&(c=r.dehydrated,c!==null))return FM(t,e,o,i,c,r,n);if(s){s=i.fallback,o=e.mode,r=t.child,c=r.sibling;var l={mode:"hidden",children:i.children};return!(o&1)&&e.child!==r?(i=e.child,i.childLanes=0,i.pendingProps=l,e.deletions=null):(i=Tr(r,l),i.subtreeFlags=r.subtreeFlags&14680064),c!==null?s=Tr(c,s):(s=ts(s,o,n,null),s.flags|=2),s.return=e,i.return=e,i.sibling=s,e.child=i,i=s,s=e.child,o=t.child.memoizedState,o=o===null?Fd(n):{baseLanes:o.baseLanes|n,cachePool:null,transitions:o.transitions},s.memoizedState=o,s.childLanes=t.childLanes&~n,e.memoizedState=Ud,i}return s=t.child,t=s.sibling,i=Tr(s,{mode:"visible",children:i.children}),!(e.mode&1)&&(i.lanes=n),i.return=e,i.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=i,e.memoizedState=null,i}function Ap(t,e){return e=gu({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function ll(t,e,n,i){return i!==null&&hp(i),ho(e,t.child,null,n),t=Ap(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function FM(t,e,n,i,r,s,o){if(n)return e.flags&256?(e.flags&=-257,i=Ju(Error(se(422))),ll(t,e,o,i)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(s=i.fallback,r=e.mode,i=gu({mode:"visible",children:i.children},r,0,null),s=ts(s,r,o,null),s.flags|=2,i.return=e,s.return=e,i.sibling=s,e.child=i,e.mode&1&&ho(e,t.child,null,o),e.child.memoizedState=Fd(o),e.memoizedState=Ud,s);if(!(e.mode&1))return ll(t,e,o,null);if(r.data==="$!"){if(i=r.nextSibling&&r.nextSibling.dataset,i)var c=i.dgst;return i=c,s=Error(se(419)),i=Ju(s,i,void 0),ll(t,e,o,i)}if(c=(o&t.childLanes)!==0,yn||c){if(i=jt,i!==null){switch(o&-o){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(i.suspendedLanes|o)?0:r,r!==0&&r!==s.retryLane&&(s.retryLane=r,$i(t,r),ui(i,t,r,-1))}return Ip(),i=Ju(Error(se(421))),ll(t,e,o,i)}return r.data==="$?"?(e.flags|=128,e.child=t.child,e=qM.bind(null,t),r._reactRetry=e,null):(t=s.treeContext,Nn=Sr(r.nextSibling),Un=e,Et=!0,ii=null,t!==null&&(Wn[Xn++]=Bi,Wn[Xn++]=zi,Wn[Xn++]=is,Bi=t.id,zi=t.overflow,is=e),e=Ap(e,i.children),e.flags|=4096,e)}function hg(t,e,n){t.lanes|=e;var i=t.alternate;i!==null&&(i.lanes|=e),Rd(t.return,e,n)}function ef(t,e,n,i,r){var s=t.memoizedState;s===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:n,tailMode:r}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=i,s.tail=n,s.tailMode=r)}function sx(t,e,n){var i=e.pendingProps,r=i.revealOrder,s=i.tail;if(dn(t,e,i.children,n),i=bt.current,i&2)i=i&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&hg(t,n,e);else if(t.tag===19)hg(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}i&=1}if(St(bt,i),!(e.mode&1))e.memoizedState=null;else switch(r){case"forwards":for(n=e.child,r=null;n!==null;)t=n.alternate,t!==null&&Vc(t)===null&&(r=n),n=n.sibling;n=r,n===null?(r=e.child,e.child=null):(r=n.sibling,n.sibling=null),ef(e,!1,r,n,s);break;case"backwards":for(n=null,r=e.child,e.child=null;r!==null;){if(t=r.alternate,t!==null&&Vc(t)===null){e.child=r;break}t=r.sibling,r.sibling=n,n=r,r=t}ef(e,!0,n,null,s);break;case"together":ef(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function fc(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function Yi(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),ss|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(se(153));if(e.child!==null){for(t=e.child,n=Tr(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=Tr(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function OM(t,e,n){switch(e.tag){case 3:ix(e),fo();break;case 5:Lv(e);break;case 1:Mn(e.type)&&Uc(e);break;case 4:xp(e,e.stateNode.containerInfo);break;case 10:var i=e.type._context,r=e.memoizedProps.value;St(kc,i._currentValue),i._currentValue=r;break;case 13:if(i=e.memoizedState,i!==null)return i.dehydrated!==null?(St(bt,bt.current&1),e.flags|=128,null):n&e.child.childLanes?rx(t,e,n):(St(bt,bt.current&1),t=Yi(t,e,n),t!==null?t.sibling:null);St(bt,bt.current&1);break;case 19:if(i=(n&e.childLanes)!==0,t.flags&128){if(i)return sx(t,e,n);e.flags|=128}if(r=e.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),St(bt,bt.current),i)break;return null;case 22:case 23:return e.lanes=0,tx(t,e,n)}return Yi(t,e,n)}var ox,Od,ax,lx;ox=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};Od=function(){};ax=function(t,e,n,i){var r=t.memoizedProps;if(r!==i){t=e.stateNode,Zr(wi.current);var s=null;switch(n){case"input":r=sd(t,r),i=sd(t,i),s=[];break;case"select":r=Ct({},r,{value:void 0}),i=Ct({},i,{value:void 0}),s=[];break;case"textarea":r=ld(t,r),i=ld(t,i),s=[];break;default:typeof r.onClick!="function"&&typeof i.onClick=="function"&&(t.onclick=Ic)}ud(n,i);var o;n=null;for(f in r)if(!i.hasOwnProperty(f)&&r.hasOwnProperty(f)&&r[f]!=null)if(f==="style"){var c=r[f];for(o in c)c.hasOwnProperty(o)&&(n||(n={}),n[o]="")}else f!=="dangerouslySetInnerHTML"&&f!=="children"&&f!=="suppressContentEditableWarning"&&f!=="suppressHydrationWarning"&&f!=="autoFocus"&&(ma.hasOwnProperty(f)?s||(s=[]):(s=s||[]).push(f,null));for(f in i){var l=i[f];if(c=r!=null?r[f]:void 0,i.hasOwnProperty(f)&&l!==c&&(l!=null||c!=null))if(f==="style")if(c){for(o in c)!c.hasOwnProperty(o)||l&&l.hasOwnProperty(o)||(n||(n={}),n[o]="");for(o in l)l.hasOwnProperty(o)&&c[o]!==l[o]&&(n||(n={}),n[o]=l[o])}else n||(s||(s=[]),s.push(f,n)),n=l;else f==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,c=c?c.__html:void 0,l!=null&&c!==l&&(s=s||[]).push(f,l)):f==="children"?typeof l!="string"&&typeof l!="number"||(s=s||[]).push(f,""+l):f!=="suppressContentEditableWarning"&&f!=="suppressHydrationWarning"&&(ma.hasOwnProperty(f)?(l!=null&&f==="onScroll"&&Mt("scroll",t),s||c===l||(s=[])):(s=s||[]).push(f,l))}n&&(s=s||[]).push("style",n);var f=s;(e.updateQueue=f)&&(e.flags|=4)}};lx=function(t,e,n,i){n!==i&&(e.flags|=4)};function Uo(t,e){if(!Et)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var i=null;n!==null;)n.alternate!==null&&(i=n),n=n.sibling;i===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:i.sibling=null}}function nn(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,i=0;if(e)for(var r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags&14680064,i|=r.flags&14680064,r.return=t,r=r.sibling;else for(r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags,i|=r.flags,r.return=t,r=r.sibling;return t.subtreeFlags|=i,t.childLanes=n,e}function kM(t,e,n){var i=e.pendingProps;switch(dp(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return nn(e),null;case 1:return Mn(e.type)&&Nc(),nn(e),null;case 3:return i=e.stateNode,po(),wt(Sn),wt(cn),Sp(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(t===null||t.child===null)&&(ol(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,ii!==null&&(Xd(ii),ii=null))),Od(t,e),nn(e),null;case 5:yp(e);var r=Zr(Aa.current);if(n=e.type,t!==null&&e.stateNode!=null)ax(t,e,n,i,r),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!i){if(e.stateNode===null)throw Error(se(166));return nn(e),null}if(t=Zr(wi.current),ol(e)){i=e.stateNode,n=e.type;var s=e.memoizedProps;switch(i[yi]=e,i[Ta]=s,t=(e.mode&1)!==0,n){case"dialog":Mt("cancel",i),Mt("close",i);break;case"iframe":case"object":case"embed":Mt("load",i);break;case"video":case"audio":for(r=0;r<ea.length;r++)Mt(ea[r],i);break;case"source":Mt("error",i);break;case"img":case"image":case"link":Mt("error",i),Mt("load",i);break;case"details":Mt("toggle",i);break;case"input":Mm(i,s),Mt("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!s.multiple},Mt("invalid",i);break;case"textarea":Em(i,s),Mt("invalid",i)}ud(n,s),r=null;for(var o in s)if(s.hasOwnProperty(o)){var c=s[o];o==="children"?typeof c=="string"?i.textContent!==c&&(s.suppressHydrationWarning!==!0&&sl(i.textContent,c,t),r=["children",c]):typeof c=="number"&&i.textContent!==""+c&&(s.suppressHydrationWarning!==!0&&sl(i.textContent,c,t),r=["children",""+c]):ma.hasOwnProperty(o)&&c!=null&&o==="onScroll"&&Mt("scroll",i)}switch(n){case"input":Za(i),wm(i,s,!0);break;case"textarea":Za(i),Tm(i);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(i.onclick=Ic)}i=r,e.updateQueue=i,i!==null&&(e.flags|=4)}else{o=r.nodeType===9?r:r.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=F_(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=o.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof i.is=="string"?t=o.createElement(n,{is:i.is}):(t=o.createElement(n),n==="select"&&(o=t,i.multiple?o.multiple=!0:i.size&&(o.size=i.size))):t=o.createElementNS(t,n),t[yi]=e,t[Ta]=i,ox(t,e,!1,!1),e.stateNode=t;e:{switch(o=fd(n,i),n){case"dialog":Mt("cancel",t),Mt("close",t),r=i;break;case"iframe":case"object":case"embed":Mt("load",t),r=i;break;case"video":case"audio":for(r=0;r<ea.length;r++)Mt(ea[r],t);r=i;break;case"source":Mt("error",t),r=i;break;case"img":case"image":case"link":Mt("error",t),Mt("load",t),r=i;break;case"details":Mt("toggle",t),r=i;break;case"input":Mm(t,i),r=sd(t,i),Mt("invalid",t);break;case"option":r=i;break;case"select":t._wrapperState={wasMultiple:!!i.multiple},r=Ct({},i,{value:void 0}),Mt("invalid",t);break;case"textarea":Em(t,i),r=ld(t,i),Mt("invalid",t);break;default:r=i}ud(n,r),c=r;for(s in c)if(c.hasOwnProperty(s)){var l=c[s];s==="style"?B_(t,l):s==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&O_(t,l)):s==="children"?typeof l=="string"?(n!=="textarea"||l!=="")&&ga(t,l):typeof l=="number"&&ga(t,""+l):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(ma.hasOwnProperty(s)?l!=null&&s==="onScroll"&&Mt("scroll",t):l!=null&&Zh(t,s,l,o))}switch(n){case"input":Za(t),wm(t,i,!1);break;case"textarea":Za(t),Tm(t);break;case"option":i.value!=null&&t.setAttribute("value",""+br(i.value));break;case"select":t.multiple=!!i.multiple,s=i.value,s!=null?Js(t,!!i.multiple,s,!1):i.defaultValue!=null&&Js(t,!!i.multiple,i.defaultValue,!0);break;default:typeof r.onClick=="function"&&(t.onclick=Ic)}switch(n){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return nn(e),null;case 6:if(t&&e.stateNode!=null)lx(t,e,t.memoizedProps,i);else{if(typeof i!="string"&&e.stateNode===null)throw Error(se(166));if(n=Zr(Aa.current),Zr(wi.current),ol(e)){if(i=e.stateNode,n=e.memoizedProps,i[yi]=e,(s=i.nodeValue!==n)&&(t=Un,t!==null))switch(t.tag){case 3:sl(i.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&sl(i.nodeValue,n,(t.mode&1)!==0)}s&&(e.flags|=4)}else i=(n.nodeType===9?n:n.ownerDocument).createTextNode(i),i[yi]=e,e.stateNode=i}return nn(e),null;case 13:if(wt(bt),i=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(Et&&Nn!==null&&e.mode&1&&!(e.flags&128))bv(),fo(),e.flags|=98560,s=!1;else if(s=ol(e),i!==null&&i.dehydrated!==null){if(t===null){if(!s)throw Error(se(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(se(317));s[yi]=e}else fo(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;nn(e),s=!1}else ii!==null&&(Xd(ii),ii=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(i=i!==null,i!==(t!==null&&t.memoizedState!==null)&&i&&(e.child.flags|=8192,e.mode&1&&(t===null||bt.current&1?zt===0&&(zt=3):Ip())),e.updateQueue!==null&&(e.flags|=4),nn(e),null);case 4:return po(),Od(t,e),t===null&&wa(e.stateNode.containerInfo),nn(e),null;case 10:return gp(e.type._context),nn(e),null;case 17:return Mn(e.type)&&Nc(),nn(e),null;case 19:if(wt(bt),s=e.memoizedState,s===null)return nn(e),null;if(i=(e.flags&128)!==0,o=s.rendering,o===null)if(i)Uo(s,!1);else{if(zt!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(o=Vc(t),o!==null){for(e.flags|=128,Uo(s,!1),i=o.updateQueue,i!==null&&(e.updateQueue=i,e.flags|=4),e.subtreeFlags=0,i=n,n=e.child;n!==null;)s=n,t=i,s.flags&=14680066,o=s.alternate,o===null?(s.childLanes=0,s.lanes=t,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=o.childLanes,s.lanes=o.lanes,s.child=o.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=o.memoizedProps,s.memoizedState=o.memoizedState,s.updateQueue=o.updateQueue,s.type=o.type,t=o.dependencies,s.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return St(bt,bt.current&1|2),e.child}t=t.sibling}s.tail!==null&&It()>go&&(e.flags|=128,i=!0,Uo(s,!1),e.lanes=4194304)}else{if(!i)if(t=Vc(o),t!==null){if(e.flags|=128,i=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),Uo(s,!0),s.tail===null&&s.tailMode==="hidden"&&!o.alternate&&!Et)return nn(e),null}else 2*It()-s.renderingStartTime>go&&n!==1073741824&&(e.flags|=128,i=!0,Uo(s,!1),e.lanes=4194304);s.isBackwards?(o.sibling=e.child,e.child=o):(n=s.last,n!==null?n.sibling=o:e.child=o,s.last=o)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=It(),e.sibling=null,n=bt.current,St(bt,i?n&1|2:n&1),e):(nn(e),null);case 22:case 23:return Dp(),i=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==i&&(e.flags|=8192),i&&e.mode&1?Pn&1073741824&&(nn(e),e.subtreeFlags&6&&(e.flags|=8192)):nn(e),null;case 24:return null;case 25:return null}throw Error(se(156,e.tag))}function BM(t,e){switch(dp(e),e.tag){case 1:return Mn(e.type)&&Nc(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return po(),wt(Sn),wt(cn),Sp(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return yp(e),null;case 13:if(wt(bt),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(se(340));fo()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return wt(bt),null;case 4:return po(),null;case 10:return gp(e.type._context),null;case 22:case 23:return Dp(),null;case 24:return null;default:return null}}var cl=!1,on=!1,zM=typeof WeakSet=="function"?WeakSet:Set,xe=null;function Ks(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(i){Pt(t,e,i)}else n.current=null}function kd(t,e,n){try{n()}catch(i){Pt(t,e,i)}}var pg=!1;function VM(t,e){if(Sd=Pc,t=hv(),up(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var i=n.getSelection&&n.getSelection();if(i&&i.rangeCount!==0){n=i.anchorNode;var r=i.anchorOffset,s=i.focusNode;i=i.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var o=0,c=-1,l=-1,f=0,d=0,a=t,u=null;t:for(;;){for(var h;a!==n||r!==0&&a.nodeType!==3||(c=o+r),a!==s||i!==0&&a.nodeType!==3||(l=o+i),a.nodeType===3&&(o+=a.nodeValue.length),(h=a.firstChild)!==null;)u=a,a=h;for(;;){if(a===t)break t;if(u===n&&++f===r&&(c=o),u===s&&++d===i&&(l=o),(h=a.nextSibling)!==null)break;a=u,u=a.parentNode}a=h}n=c===-1||l===-1?null:{start:c,end:l}}else n=null}n=n||{start:0,end:0}}else n=null;for(Md={focusedElem:t,selectionRange:n},Pc=!1,xe=e;xe!==null;)if(e=xe,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,xe=t;else for(;xe!==null;){e=xe;try{var m=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(m!==null){var v=m.memoizedProps,g=m.memoizedState,p=e.stateNode,_=p.getSnapshotBeforeUpdate(e.elementType===e.type?v:ti(e.type,v),g);p.__reactInternalSnapshotBeforeUpdate=_}break;case 3:var x=e.stateNode.containerInfo;x.nodeType===1?x.textContent="":x.nodeType===9&&x.documentElement&&x.removeChild(x.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(se(163))}}catch(S){Pt(e,e.return,S)}if(t=e.sibling,t!==null){t.return=e.return,xe=t;break}xe=e.return}return m=pg,pg=!1,m}function ua(t,e,n){var i=e.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var r=i=i.next;do{if((r.tag&t)===t){var s=r.destroy;r.destroy=void 0,s!==void 0&&kd(e,n,s)}r=r.next}while(r!==i)}}function pu(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var i=n.create;n.destroy=i()}n=n.next}while(n!==e)}}function Bd(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function cx(t){var e=t.alternate;e!==null&&(t.alternate=null,cx(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[yi],delete e[Ta],delete e[Td],delete e[wM],delete e[EM])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function ux(t){return t.tag===5||t.tag===3||t.tag===4}function mg(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||ux(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function zd(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=Ic));else if(i!==4&&(t=t.child,t!==null))for(zd(t,e,n),t=t.sibling;t!==null;)zd(t,e,n),t=t.sibling}function Vd(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(i!==4&&(t=t.child,t!==null))for(Vd(t,e,n),t=t.sibling;t!==null;)Vd(t,e,n),t=t.sibling}var Yt=null,ni=!1;function nr(t,e,n){for(n=n.child;n!==null;)fx(t,e,n),n=n.sibling}function fx(t,e,n){if(Mi&&typeof Mi.onCommitFiberUnmount=="function")try{Mi.onCommitFiberUnmount(ou,n)}catch{}switch(n.tag){case 5:on||Ks(n,e);case 6:var i=Yt,r=ni;Yt=null,nr(t,e,n),Yt=i,ni=r,Yt!==null&&(ni?(t=Yt,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):Yt.removeChild(n.stateNode));break;case 18:Yt!==null&&(ni?(t=Yt,n=n.stateNode,t.nodeType===8?$u(t.parentNode,n):t.nodeType===1&&$u(t,n),ya(t)):$u(Yt,n.stateNode));break;case 4:i=Yt,r=ni,Yt=n.stateNode.containerInfo,ni=!0,nr(t,e,n),Yt=i,ni=r;break;case 0:case 11:case 14:case 15:if(!on&&(i=n.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){r=i=i.next;do{var s=r,o=s.destroy;s=s.tag,o!==void 0&&(s&2||s&4)&&kd(n,e,o),r=r.next}while(r!==i)}nr(t,e,n);break;case 1:if(!on&&(Ks(n,e),i=n.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=n.memoizedProps,i.state=n.memoizedState,i.componentWillUnmount()}catch(c){Pt(n,e,c)}nr(t,e,n);break;case 21:nr(t,e,n);break;case 22:n.mode&1?(on=(i=on)||n.memoizedState!==null,nr(t,e,n),on=i):nr(t,e,n);break;default:nr(t,e,n)}}function gg(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new zM),e.forEach(function(i){var r=KM.bind(null,t,i);n.has(i)||(n.add(i),i.then(r,r))})}}function Zn(t,e){var n=e.deletions;if(n!==null)for(var i=0;i<n.length;i++){var r=n[i];try{var s=t,o=e,c=o;e:for(;c!==null;){switch(c.tag){case 5:Yt=c.stateNode,ni=!1;break e;case 3:Yt=c.stateNode.containerInfo,ni=!0;break e;case 4:Yt=c.stateNode.containerInfo,ni=!0;break e}c=c.return}if(Yt===null)throw Error(se(160));fx(s,o,r),Yt=null,ni=!1;var l=r.alternate;l!==null&&(l.return=null),r.return=null}catch(f){Pt(r,e,f)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)dx(e,t),e=e.sibling}function dx(t,e){var n=t.alternate,i=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(Zn(e,t),pi(t),i&4){try{ua(3,t,t.return),pu(3,t)}catch(v){Pt(t,t.return,v)}try{ua(5,t,t.return)}catch(v){Pt(t,t.return,v)}}break;case 1:Zn(e,t),pi(t),i&512&&n!==null&&Ks(n,n.return);break;case 5:if(Zn(e,t),pi(t),i&512&&n!==null&&Ks(n,n.return),t.flags&32){var r=t.stateNode;try{ga(r,"")}catch(v){Pt(t,t.return,v)}}if(i&4&&(r=t.stateNode,r!=null)){var s=t.memoizedProps,o=n!==null?n.memoizedProps:s,c=t.type,l=t.updateQueue;if(t.updateQueue=null,l!==null)try{c==="input"&&s.type==="radio"&&s.name!=null&&N_(r,s),fd(c,o);var f=fd(c,s);for(o=0;o<l.length;o+=2){var d=l[o],a=l[o+1];d==="style"?B_(r,a):d==="dangerouslySetInnerHTML"?O_(r,a):d==="children"?ga(r,a):Zh(r,d,a,f)}switch(c){case"input":od(r,s);break;case"textarea":U_(r,s);break;case"select":var u=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!s.multiple;var h=s.value;h!=null?Js(r,!!s.multiple,h,!1):u!==!!s.multiple&&(s.defaultValue!=null?Js(r,!!s.multiple,s.defaultValue,!0):Js(r,!!s.multiple,s.multiple?[]:"",!1))}r[Ta]=s}catch(v){Pt(t,t.return,v)}}break;case 6:if(Zn(e,t),pi(t),i&4){if(t.stateNode===null)throw Error(se(162));r=t.stateNode,s=t.memoizedProps;try{r.nodeValue=s}catch(v){Pt(t,t.return,v)}}break;case 3:if(Zn(e,t),pi(t),i&4&&n!==null&&n.memoizedState.isDehydrated)try{ya(e.containerInfo)}catch(v){Pt(t,t.return,v)}break;case 4:Zn(e,t),pi(t);break;case 13:Zn(e,t),pi(t),r=t.child,r.flags&8192&&(s=r.memoizedState!==null,r.stateNode.isHidden=s,!s||r.alternate!==null&&r.alternate.memoizedState!==null||(Pp=It())),i&4&&gg(t);break;case 22:if(d=n!==null&&n.memoizedState!==null,t.mode&1?(on=(f=on)||d,Zn(e,t),on=f):Zn(e,t),pi(t),i&8192){if(f=t.memoizedState!==null,(t.stateNode.isHidden=f)&&!d&&t.mode&1)for(xe=t,d=t.child;d!==null;){for(a=xe=d;xe!==null;){switch(u=xe,h=u.child,u.tag){case 0:case 11:case 14:case 15:ua(4,u,u.return);break;case 1:Ks(u,u.return);var m=u.stateNode;if(typeof m.componentWillUnmount=="function"){i=u,n=u.return;try{e=i,m.props=e.memoizedProps,m.state=e.memoizedState,m.componentWillUnmount()}catch(v){Pt(i,n,v)}}break;case 5:Ks(u,u.return);break;case 22:if(u.memoizedState!==null){vg(a);continue}}h!==null?(h.return=u,xe=h):vg(a)}d=d.sibling}e:for(d=null,a=t;;){if(a.tag===5){if(d===null){d=a;try{r=a.stateNode,f?(s=r.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(c=a.stateNode,l=a.memoizedProps.style,o=l!=null&&l.hasOwnProperty("display")?l.display:null,c.style.display=k_("display",o))}catch(v){Pt(t,t.return,v)}}}else if(a.tag===6){if(d===null)try{a.stateNode.nodeValue=f?"":a.memoizedProps}catch(v){Pt(t,t.return,v)}}else if((a.tag!==22&&a.tag!==23||a.memoizedState===null||a===t)&&a.child!==null){a.child.return=a,a=a.child;continue}if(a===t)break e;for(;a.sibling===null;){if(a.return===null||a.return===t)break e;d===a&&(d=null),a=a.return}d===a&&(d=null),a.sibling.return=a.return,a=a.sibling}}break;case 19:Zn(e,t),pi(t),i&4&&gg(t);break;case 21:break;default:Zn(e,t),pi(t)}}function pi(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if(ux(n)){var i=n;break e}n=n.return}throw Error(se(160))}switch(i.tag){case 5:var r=i.stateNode;i.flags&32&&(ga(r,""),i.flags&=-33);var s=mg(t);Vd(t,s,r);break;case 3:case 4:var o=i.stateNode.containerInfo,c=mg(t);zd(t,c,o);break;default:throw Error(se(161))}}catch(l){Pt(t,t.return,l)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function HM(t,e,n){xe=t,hx(t)}function hx(t,e,n){for(var i=(t.mode&1)!==0;xe!==null;){var r=xe,s=r.child;if(r.tag===22&&i){var o=r.memoizedState!==null||cl;if(!o){var c=r.alternate,l=c!==null&&c.memoizedState!==null||on;c=cl;var f=on;if(cl=o,(on=l)&&!f)for(xe=r;xe!==null;)o=xe,l=o.child,o.tag===22&&o.memoizedState!==null?xg(r):l!==null?(l.return=o,xe=l):xg(r);for(;s!==null;)xe=s,hx(s),s=s.sibling;xe=r,cl=c,on=f}_g(t)}else r.subtreeFlags&8772&&s!==null?(s.return=r,xe=s):_g(t)}}function _g(t){for(;xe!==null;){var e=xe;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:on||pu(5,e);break;case 1:var i=e.stateNode;if(e.flags&4&&!on)if(n===null)i.componentDidMount();else{var r=e.elementType===e.type?n.memoizedProps:ti(e.type,n.memoizedProps);i.componentDidUpdate(r,n.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&tg(e,s,i);break;case 3:var o=e.updateQueue;if(o!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}tg(e,o,n)}break;case 5:var c=e.stateNode;if(n===null&&e.flags&4){n=c;var l=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&n.focus();break;case"img":l.src&&(n.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var f=e.alternate;if(f!==null){var d=f.memoizedState;if(d!==null){var a=d.dehydrated;a!==null&&ya(a)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(se(163))}on||e.flags&512&&Bd(e)}catch(u){Pt(e,e.return,u)}}if(e===t){xe=null;break}if(n=e.sibling,n!==null){n.return=e.return,xe=n;break}xe=e.return}}function vg(t){for(;xe!==null;){var e=xe;if(e===t){xe=null;break}var n=e.sibling;if(n!==null){n.return=e.return,xe=n;break}xe=e.return}}function xg(t){for(;xe!==null;){var e=xe;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{pu(4,e)}catch(l){Pt(e,n,l)}break;case 1:var i=e.stateNode;if(typeof i.componentDidMount=="function"){var r=e.return;try{i.componentDidMount()}catch(l){Pt(e,r,l)}}var s=e.return;try{Bd(e)}catch(l){Pt(e,s,l)}break;case 5:var o=e.return;try{Bd(e)}catch(l){Pt(e,o,l)}}}catch(l){Pt(e,e.return,l)}if(e===t){xe=null;break}var c=e.sibling;if(c!==null){c.return=e.return,xe=c;break}xe=e.return}}var GM=Math.ceil,Wc=Zi.ReactCurrentDispatcher,Cp=Zi.ReactCurrentOwner,$n=Zi.ReactCurrentBatchConfig,et=0,jt=null,Ft=null,Zt=0,Pn=0,Zs=Lr(0),zt=0,La=null,ss=0,mu=0,Rp=0,fa=null,xn=null,Pp=0,go=1/0,Oi=null,Xc=!1,Hd=null,wr=null,ul=!1,gr=null,jc=0,da=0,Gd=null,dc=-1,hc=0;function hn(){return et&6?It():dc!==-1?dc:dc=It()}function Er(t){return t.mode&1?et&2&&Zt!==0?Zt&-Zt:bM.transition!==null?(hc===0&&(hc=Z_()),hc):(t=dt,t!==0||(t=window.event,t=t===void 0?16:rv(t.type)),t):1}function ui(t,e,n,i){if(50<da)throw da=0,Gd=null,Error(se(185));Ba(t,n,i),(!(et&2)||t!==jt)&&(t===jt&&(!(et&2)&&(mu|=n),zt===4&&hr(t,Zt)),wn(t,i),n===1&&et===0&&!(e.mode&1)&&(go=It()+500,fu&&Dr()))}function wn(t,e){var n=t.callbackNode;bS(t,e);var i=Rc(t,t===jt?Zt:0);if(i===0)n!==null&&Cm(n),t.callbackNode=null,t.callbackPriority=0;else if(e=i&-i,t.callbackPriority!==e){if(n!=null&&Cm(n),e===1)t.tag===0?TM(yg.bind(null,t)):wv(yg.bind(null,t)),SM(function(){!(et&6)&&Dr()}),n=null;else{switch(Q_(i)){case 1:n=np;break;case 4:n=q_;break;case 16:n=Cc;break;case 536870912:n=K_;break;default:n=Cc}n=Sx(n,px.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function px(t,e){if(dc=-1,hc=0,et&6)throw Error(se(327));var n=t.callbackNode;if(ro()&&t.callbackNode!==n)return null;var i=Rc(t,t===jt?Zt:0);if(i===0)return null;if(i&30||i&t.expiredLanes||e)e=$c(t,i);else{e=i;var r=et;et|=2;var s=gx();(jt!==t||Zt!==e)&&(Oi=null,go=It()+500,es(t,e));do try{jM();break}catch(c){mx(t,c)}while(!0);mp(),Wc.current=s,et=r,Ft!==null?e=0:(jt=null,Zt=0,e=zt)}if(e!==0){if(e===2&&(r=gd(t),r!==0&&(i=r,e=Wd(t,r))),e===1)throw n=La,es(t,0),hr(t,i),wn(t,It()),n;if(e===6)hr(t,i);else{if(r=t.current.alternate,!(i&30)&&!WM(r)&&(e=$c(t,i),e===2&&(s=gd(t),s!==0&&(i=s,e=Wd(t,s))),e===1))throw n=La,es(t,0),hr(t,i),wn(t,It()),n;switch(t.finishedWork=r,t.finishedLanes=i,e){case 0:case 1:throw Error(se(345));case 2:jr(t,xn,Oi);break;case 3:if(hr(t,i),(i&130023424)===i&&(e=Pp+500-It(),10<e)){if(Rc(t,0)!==0)break;if(r=t.suspendedLanes,(r&i)!==i){hn(),t.pingedLanes|=t.suspendedLanes&r;break}t.timeoutHandle=Ed(jr.bind(null,t,xn,Oi),e);break}jr(t,xn,Oi);break;case 4:if(hr(t,i),(i&4194240)===i)break;for(e=t.eventTimes,r=-1;0<i;){var o=31-ci(i);s=1<<o,o=e[o],o>r&&(r=o),i&=~s}if(i=r,i=It()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*GM(i/1960))-i,10<i){t.timeoutHandle=Ed(jr.bind(null,t,xn,Oi),i);break}jr(t,xn,Oi);break;case 5:jr(t,xn,Oi);break;default:throw Error(se(329))}}}return wn(t,It()),t.callbackNode===n?px.bind(null,t):null}function Wd(t,e){var n=fa;return t.current.memoizedState.isDehydrated&&(es(t,e).flags|=256),t=$c(t,e),t!==2&&(e=xn,xn=n,e!==null&&Xd(e)),t}function Xd(t){xn===null?xn=t:xn.push.apply(xn,t)}function WM(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var i=0;i<n.length;i++){var r=n[i],s=r.getSnapshot;r=r.value;try{if(!fi(s(),r))return!1}catch{return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function hr(t,e){for(e&=~Rp,e&=~mu,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-ci(e),i=1<<n;t[n]=-1,e&=~i}}function yg(t){if(et&6)throw Error(se(327));ro();var e=Rc(t,0);if(!(e&1))return wn(t,It()),null;var n=$c(t,e);if(t.tag!==0&&n===2){var i=gd(t);i!==0&&(e=i,n=Wd(t,i))}if(n===1)throw n=La,es(t,0),hr(t,e),wn(t,It()),n;if(n===6)throw Error(se(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,jr(t,xn,Oi),wn(t,It()),null}function Lp(t,e){var n=et;et|=1;try{return t(e)}finally{et=n,et===0&&(go=It()+500,fu&&Dr())}}function os(t){gr!==null&&gr.tag===0&&!(et&6)&&ro();var e=et;et|=1;var n=$n.transition,i=dt;try{if($n.transition=null,dt=1,t)return t()}finally{dt=i,$n.transition=n,et=e,!(et&6)&&Dr()}}function Dp(){Pn=Zs.current,wt(Zs)}function es(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,yM(n)),Ft!==null)for(n=Ft.return;n!==null;){var i=n;switch(dp(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&Nc();break;case 3:po(),wt(Sn),wt(cn),Sp();break;case 5:yp(i);break;case 4:po();break;case 13:wt(bt);break;case 19:wt(bt);break;case 10:gp(i.type._context);break;case 22:case 23:Dp()}n=n.return}if(jt=t,Ft=t=Tr(t.current,null),Zt=Pn=e,zt=0,La=null,Rp=mu=ss=0,xn=fa=null,Kr!==null){for(e=0;e<Kr.length;e++)if(n=Kr[e],i=n.interleaved,i!==null){n.interleaved=null;var r=i.next,s=n.pending;if(s!==null){var o=s.next;s.next=r,i.next=o}n.pending=i}Kr=null}return t}function mx(t,e){do{var n=Ft;try{if(mp(),cc.current=Gc,Hc){for(var i=At.memoizedState;i!==null;){var r=i.queue;r!==null&&(r.pending=null),i=i.next}Hc=!1}if(rs=0,Xt=Bt=At=null,ca=!1,Ca=0,Cp.current=null,n===null||n.return===null){zt=1,La=e,Ft=null;break}e:{var s=t,o=n.return,c=n,l=e;if(e=Zt,c.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var f=l,d=c,a=d.tag;if(!(d.mode&1)&&(a===0||a===11||a===15)){var u=d.alternate;u?(d.updateQueue=u.updateQueue,d.memoizedState=u.memoizedState,d.lanes=u.lanes):(d.updateQueue=null,d.memoizedState=null)}var h=ag(o);if(h!==null){h.flags&=-257,lg(h,o,c,s,e),h.mode&1&&og(s,f,e),e=h,l=f;var m=e.updateQueue;if(m===null){var v=new Set;v.add(l),e.updateQueue=v}else m.add(l);break e}else{if(!(e&1)){og(s,f,e),Ip();break e}l=Error(se(426))}}else if(Et&&c.mode&1){var g=ag(o);if(g!==null){!(g.flags&65536)&&(g.flags|=256),lg(g,o,c,s,e),hp(mo(l,c));break e}}s=l=mo(l,c),zt!==4&&(zt=2),fa===null?fa=[s]:fa.push(s),s=o;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var p=Qv(s,l,e);eg(s,p);break e;case 1:c=l;var _=s.type,x=s.stateNode;if(!(s.flags&128)&&(typeof _.getDerivedStateFromError=="function"||x!==null&&typeof x.componentDidCatch=="function"&&(wr===null||!wr.has(x)))){s.flags|=65536,e&=-e,s.lanes|=e;var S=Jv(s,c,e);eg(s,S);break e}}s=s.return}while(s!==null)}vx(n)}catch(b){e=b,Ft===n&&n!==null&&(Ft=n=n.return);continue}break}while(!0)}function gx(){var t=Wc.current;return Wc.current=Gc,t===null?Gc:t}function Ip(){(zt===0||zt===3||zt===2)&&(zt=4),jt===null||!(ss&268435455)&&!(mu&268435455)||hr(jt,Zt)}function $c(t,e){var n=et;et|=2;var i=gx();(jt!==t||Zt!==e)&&(Oi=null,es(t,e));do try{XM();break}catch(r){mx(t,r)}while(!0);if(mp(),et=n,Wc.current=i,Ft!==null)throw Error(se(261));return jt=null,Zt=0,zt}function XM(){for(;Ft!==null;)_x(Ft)}function jM(){for(;Ft!==null&&!_S();)_x(Ft)}function _x(t){var e=yx(t.alternate,t,Pn);t.memoizedProps=t.pendingProps,e===null?vx(t):Ft=e,Cp.current=null}function vx(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=BM(n,e),n!==null){n.flags&=32767,Ft=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{zt=6,Ft=null;return}}else if(n=kM(n,e,Pn),n!==null){Ft=n;return}if(e=e.sibling,e!==null){Ft=e;return}Ft=e=t}while(e!==null);zt===0&&(zt=5)}function jr(t,e,n){var i=dt,r=$n.transition;try{$n.transition=null,dt=1,$M(t,e,n,i)}finally{$n.transition=r,dt=i}return null}function $M(t,e,n,i){do ro();while(gr!==null);if(et&6)throw Error(se(327));n=t.finishedWork;var r=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(se(177));t.callbackNode=null,t.callbackPriority=0;var s=n.lanes|n.childLanes;if(AS(t,s),t===jt&&(Ft=jt=null,Zt=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||ul||(ul=!0,Sx(Cc,function(){return ro(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=$n.transition,$n.transition=null;var o=dt;dt=1;var c=et;et|=4,Cp.current=null,VM(t,n),dx(n,t),hM(Md),Pc=!!Sd,Md=Sd=null,t.current=n,HM(n),vS(),et=c,dt=o,$n.transition=s}else t.current=n;if(ul&&(ul=!1,gr=t,jc=r),s=t.pendingLanes,s===0&&(wr=null),SS(n.stateNode),wn(t,It()),e!==null)for(i=t.onRecoverableError,n=0;n<e.length;n++)r=e[n],i(r.value,{componentStack:r.stack,digest:r.digest});if(Xc)throw Xc=!1,t=Hd,Hd=null,t;return jc&1&&t.tag!==0&&ro(),s=t.pendingLanes,s&1?t===Gd?da++:(da=0,Gd=t):da=0,Dr(),null}function ro(){if(gr!==null){var t=Q_(jc),e=$n.transition,n=dt;try{if($n.transition=null,dt=16>t?16:t,gr===null)var i=!1;else{if(t=gr,gr=null,jc=0,et&6)throw Error(se(331));var r=et;for(et|=4,xe=t.current;xe!==null;){var s=xe,o=s.child;if(xe.flags&16){var c=s.deletions;if(c!==null){for(var l=0;l<c.length;l++){var f=c[l];for(xe=f;xe!==null;){var d=xe;switch(d.tag){case 0:case 11:case 15:ua(8,d,s)}var a=d.child;if(a!==null)a.return=d,xe=a;else for(;xe!==null;){d=xe;var u=d.sibling,h=d.return;if(cx(d),d===f){xe=null;break}if(u!==null){u.return=h,xe=u;break}xe=h}}}var m=s.alternate;if(m!==null){var v=m.child;if(v!==null){m.child=null;do{var g=v.sibling;v.sibling=null,v=g}while(v!==null)}}xe=s}}if(s.subtreeFlags&2064&&o!==null)o.return=s,xe=o;else e:for(;xe!==null;){if(s=xe,s.flags&2048)switch(s.tag){case 0:case 11:case 15:ua(9,s,s.return)}var p=s.sibling;if(p!==null){p.return=s.return,xe=p;break e}xe=s.return}}var _=t.current;for(xe=_;xe!==null;){o=xe;var x=o.child;if(o.subtreeFlags&2064&&x!==null)x.return=o,xe=x;else e:for(o=_;xe!==null;){if(c=xe,c.flags&2048)try{switch(c.tag){case 0:case 11:case 15:pu(9,c)}}catch(b){Pt(c,c.return,b)}if(c===o){xe=null;break e}var S=c.sibling;if(S!==null){S.return=c.return,xe=S;break e}xe=c.return}}if(et=r,Dr(),Mi&&typeof Mi.onPostCommitFiberRoot=="function")try{Mi.onPostCommitFiberRoot(ou,t)}catch{}i=!0}return i}finally{dt=n,$n.transition=e}}return!1}function Sg(t,e,n){e=mo(n,e),e=Qv(t,e,1),t=Mr(t,e,1),e=hn(),t!==null&&(Ba(t,1,e),wn(t,e))}function Pt(t,e,n){if(t.tag===3)Sg(t,t,n);else for(;e!==null;){if(e.tag===3){Sg(e,t,n);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(wr===null||!wr.has(i))){t=mo(n,t),t=Jv(e,t,1),e=Mr(e,t,1),t=hn(),e!==null&&(Ba(e,1,t),wn(e,t));break}}e=e.return}}function YM(t,e,n){var i=t.pingCache;i!==null&&i.delete(e),e=hn(),t.pingedLanes|=t.suspendedLanes&n,jt===t&&(Zt&n)===n&&(zt===4||zt===3&&(Zt&130023424)===Zt&&500>It()-Pp?es(t,0):Rp|=n),wn(t,e)}function xx(t,e){e===0&&(t.mode&1?(e=el,el<<=1,!(el&130023424)&&(el=4194304)):e=1);var n=hn();t=$i(t,e),t!==null&&(Ba(t,e,n),wn(t,n))}function qM(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),xx(t,n)}function KM(t,e){var n=0;switch(t.tag){case 13:var i=t.stateNode,r=t.memoizedState;r!==null&&(n=r.retryLane);break;case 19:i=t.stateNode;break;default:throw Error(se(314))}i!==null&&i.delete(e),xx(t,n)}var yx;yx=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||Sn.current)yn=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return yn=!1,OM(t,e,n);yn=!!(t.flags&131072)}else yn=!1,Et&&e.flags&1048576&&Ev(e,Oc,e.index);switch(e.lanes=0,e.tag){case 2:var i=e.type;fc(t,e),t=e.pendingProps;var r=uo(e,cn.current);io(e,n),r=wp(null,e,i,t,r,n);var s=Ep();return e.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,Mn(i)?(s=!0,Uc(e)):s=!1,e.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,vp(e),r.updater=hu,e.stateNode=r,r._reactInternals=e,Ld(e,i,t,n),e=Nd(null,e,i,!0,s,n)):(e.tag=0,Et&&s&&fp(e),dn(null,e,r,n),e=e.child),e;case 16:i=e.elementType;e:{switch(fc(t,e),t=e.pendingProps,r=i._init,i=r(i._payload),e.type=i,r=e.tag=QM(i),t=ti(i,t),r){case 0:e=Id(null,e,i,t,n);break e;case 1:e=fg(null,e,i,t,n);break e;case 11:e=cg(null,e,i,t,n);break e;case 14:e=ug(null,e,i,ti(i.type,t),n);break e}throw Error(se(306,i,""))}return e;case 0:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:ti(i,r),Id(t,e,i,r,n);case 1:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:ti(i,r),fg(t,e,i,r,n);case 3:e:{if(ix(e),t===null)throw Error(se(387));i=e.pendingProps,s=e.memoizedState,r=s.element,Pv(t,e),zc(e,i,null,n);var o=e.memoizedState;if(i=o.element,s.isDehydrated)if(s={element:i,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){r=mo(Error(se(423)),e),e=dg(t,e,i,n,r);break e}else if(i!==r){r=mo(Error(se(424)),e),e=dg(t,e,i,n,r);break e}else for(Nn=Sr(e.stateNode.containerInfo.firstChild),Un=e,Et=!0,ii=null,n=Cv(e,null,i,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(fo(),i===r){e=Yi(t,e,n);break e}dn(t,e,i,n)}e=e.child}return e;case 5:return Lv(e),t===null&&Cd(e),i=e.type,r=e.pendingProps,s=t!==null?t.memoizedProps:null,o=r.children,wd(i,r)?o=null:s!==null&&wd(i,s)&&(e.flags|=32),nx(t,e),dn(t,e,o,n),e.child;case 6:return t===null&&Cd(e),null;case 13:return rx(t,e,n);case 4:return xp(e,e.stateNode.containerInfo),i=e.pendingProps,t===null?e.child=ho(e,null,i,n):dn(t,e,i,n),e.child;case 11:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:ti(i,r),cg(t,e,i,r,n);case 7:return dn(t,e,e.pendingProps,n),e.child;case 8:return dn(t,e,e.pendingProps.children,n),e.child;case 12:return dn(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(i=e.type._context,r=e.pendingProps,s=e.memoizedProps,o=r.value,St(kc,i._currentValue),i._currentValue=o,s!==null)if(fi(s.value,o)){if(s.children===r.children&&!Sn.current){e=Yi(t,e,n);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var c=s.dependencies;if(c!==null){o=s.child;for(var l=c.firstContext;l!==null;){if(l.context===i){if(s.tag===1){l=Hi(-1,n&-n),l.tag=2;var f=s.updateQueue;if(f!==null){f=f.shared;var d=f.pending;d===null?l.next=l:(l.next=d.next,d.next=l),f.pending=l}}s.lanes|=n,l=s.alternate,l!==null&&(l.lanes|=n),Rd(s.return,n,e),c.lanes|=n;break}l=l.next}}else if(s.tag===10)o=s.type===e.type?null:s.child;else if(s.tag===18){if(o=s.return,o===null)throw Error(se(341));o.lanes|=n,c=o.alternate,c!==null&&(c.lanes|=n),Rd(o,n,e),o=s.sibling}else o=s.child;if(o!==null)o.return=s;else for(o=s;o!==null;){if(o===e){o=null;break}if(s=o.sibling,s!==null){s.return=o.return,o=s;break}o=o.return}s=o}dn(t,e,r.children,n),e=e.child}return e;case 9:return r=e.type,i=e.pendingProps.children,io(e,n),r=Yn(r),i=i(r),e.flags|=1,dn(t,e,i,n),e.child;case 14:return i=e.type,r=ti(i,e.pendingProps),r=ti(i.type,r),ug(t,e,i,r,n);case 15:return ex(t,e,e.type,e.pendingProps,n);case 17:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:ti(i,r),fc(t,e),e.tag=1,Mn(i)?(t=!0,Uc(e)):t=!1,io(e,n),Zv(e,i,r),Ld(e,i,r,n),Nd(null,e,i,!0,t,n);case 19:return sx(t,e,n);case 22:return tx(t,e,n)}throw Error(se(156,e.tag))};function Sx(t,e){return Y_(t,e)}function ZM(t,e,n,i){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function jn(t,e,n,i){return new ZM(t,e,n,i)}function Np(t){return t=t.prototype,!(!t||!t.isReactComponent)}function QM(t){if(typeof t=="function")return Np(t)?1:0;if(t!=null){if(t=t.$$typeof,t===Jh)return 11;if(t===ep)return 14}return 2}function Tr(t,e){var n=t.alternate;return n===null?(n=jn(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function pc(t,e,n,i,r,s){var o=2;if(i=t,typeof t=="function")Np(t)&&(o=1);else if(typeof t=="string")o=5;else e:switch(t){case Vs:return ts(n.children,r,s,e);case Qh:o=8,r|=8;break;case td:return t=jn(12,n,e,r|2),t.elementType=td,t.lanes=s,t;case nd:return t=jn(13,n,e,r),t.elementType=nd,t.lanes=s,t;case id:return t=jn(19,n,e,r),t.elementType=id,t.lanes=s,t;case L_:return gu(n,r,s,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case R_:o=10;break e;case P_:o=9;break e;case Jh:o=11;break e;case ep:o=14;break e;case cr:o=16,i=null;break e}throw Error(se(130,t==null?t:typeof t,""))}return e=jn(o,n,e,r),e.elementType=t,e.type=i,e.lanes=s,e}function ts(t,e,n,i){return t=jn(7,t,i,e),t.lanes=n,t}function gu(t,e,n,i){return t=jn(22,t,i,e),t.elementType=L_,t.lanes=n,t.stateNode={isHidden:!1},t}function tf(t,e,n){return t=jn(6,t,null,e),t.lanes=n,t}function nf(t,e,n){return e=jn(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function JM(t,e,n,i,r){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Fu(0),this.expirationTimes=Fu(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Fu(0),this.identifierPrefix=i,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function Up(t,e,n,i,r,s,o,c,l){return t=new JM(t,e,n,c,l),e===1?(e=1,s===!0&&(e|=8)):e=0,s=jn(3,null,null,e),t.current=s,s.stateNode=t,s.memoizedState={element:i,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},vp(s),t}function e1(t,e,n){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:zs,key:i==null?null:""+i,children:t,containerInfo:e,implementation:n}}function Mx(t){if(!t)return Ar;t=t._reactInternals;e:{if(us(t)!==t||t.tag!==1)throw Error(se(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(Mn(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(se(171))}if(t.tag===1){var n=t.type;if(Mn(n))return Mv(t,n,e)}return e}function wx(t,e,n,i,r,s,o,c,l){return t=Up(n,i,!0,t,r,s,o,c,l),t.context=Mx(null),n=t.current,i=hn(),r=Er(n),s=Hi(i,r),s.callback=e??null,Mr(n,s,r),t.current.lanes=r,Ba(t,r,i),wn(t,i),t}function _u(t,e,n,i){var r=e.current,s=hn(),o=Er(r);return n=Mx(n),e.context===null?e.context=n:e.pendingContext=n,e=Hi(s,o),e.payload={element:t},i=i===void 0?null:i,i!==null&&(e.callback=i),t=Mr(r,e,o),t!==null&&(ui(t,r,o,s),lc(t,r,o)),o}function Yc(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function Mg(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function Fp(t,e){Mg(t,e),(t=t.alternate)&&Mg(t,e)}function t1(){return null}var Ex=typeof reportError=="function"?reportError:function(t){console.error(t)};function Op(t){this._internalRoot=t}vu.prototype.render=Op.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(se(409));_u(t,e,null,null)};vu.prototype.unmount=Op.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;os(function(){_u(null,t,null,null)}),e[ji]=null}};function vu(t){this._internalRoot=t}vu.prototype.unstable_scheduleHydration=function(t){if(t){var e=tv();t={blockedOn:null,target:t,priority:e};for(var n=0;n<dr.length&&e!==0&&e<dr[n].priority;n++);dr.splice(n,0,t),n===0&&iv(t)}};function kp(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function xu(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function wg(){}function n1(t,e,n,i,r){if(r){if(typeof i=="function"){var s=i;i=function(){var f=Yc(o);s.call(f)}}var o=wx(e,i,t,0,null,!1,!1,"",wg);return t._reactRootContainer=o,t[ji]=o.current,wa(t.nodeType===8?t.parentNode:t),os(),o}for(;r=t.lastChild;)t.removeChild(r);if(typeof i=="function"){var c=i;i=function(){var f=Yc(l);c.call(f)}}var l=Up(t,0,!1,null,null,!1,!1,"",wg);return t._reactRootContainer=l,t[ji]=l.current,wa(t.nodeType===8?t.parentNode:t),os(function(){_u(e,l,n,i)}),l}function yu(t,e,n,i,r){var s=n._reactRootContainer;if(s){var o=s;if(typeof r=="function"){var c=r;r=function(){var l=Yc(o);c.call(l)}}_u(e,o,t,r)}else o=n1(n,e,t,r,i);return Yc(o)}J_=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=Jo(e.pendingLanes);n!==0&&(ip(e,n|1),wn(e,It()),!(et&6)&&(go=It()+500,Dr()))}break;case 13:os(function(){var i=$i(t,1);if(i!==null){var r=hn();ui(i,t,1,r)}}),Fp(t,1)}};rp=function(t){if(t.tag===13){var e=$i(t,134217728);if(e!==null){var n=hn();ui(e,t,134217728,n)}Fp(t,134217728)}};ev=function(t){if(t.tag===13){var e=Er(t),n=$i(t,e);if(n!==null){var i=hn();ui(n,t,e,i)}Fp(t,e)}};tv=function(){return dt};nv=function(t,e){var n=dt;try{return dt=t,e()}finally{dt=n}};hd=function(t,e,n){switch(e){case"input":if(od(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var i=n[e];if(i!==t&&i.form===t.form){var r=uu(i);if(!r)throw Error(se(90));I_(i),od(i,r)}}}break;case"textarea":U_(t,n);break;case"select":e=n.value,e!=null&&Js(t,!!n.multiple,e,!1)}};H_=Lp;G_=os;var i1={usingClientEntryPoint:!1,Events:[Va,Xs,uu,z_,V_,Lp]},Fo={findFiberByHostInstance:qr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},r1={bundleType:Fo.bundleType,version:Fo.version,rendererPackageName:Fo.rendererPackageName,rendererConfig:Fo.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Zi.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=j_(t),t===null?null:t.stateNode},findFiberByHostInstance:Fo.findFiberByHostInstance||t1,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var fl=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!fl.isDisabled&&fl.supportsFiber)try{ou=fl.inject(r1),Mi=fl}catch{}}kn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=i1;kn.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!kp(e))throw Error(se(200));return e1(t,e,null,n)};kn.createRoot=function(t,e){if(!kp(t))throw Error(se(299));var n=!1,i="",r=Ex;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onRecoverableError!==void 0&&(r=e.onRecoverableError)),e=Up(t,1,!1,null,null,n,!1,i,r),t[ji]=e.current,wa(t.nodeType===8?t.parentNode:t),new Op(e)};kn.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(se(188)):(t=Object.keys(t).join(","),Error(se(268,t)));return t=j_(e),t=t===null?null:t.stateNode,t};kn.flushSync=function(t){return os(t)};kn.hydrate=function(t,e,n){if(!xu(e))throw Error(se(200));return yu(null,t,e,!0,n)};kn.hydrateRoot=function(t,e,n){if(!kp(t))throw Error(se(405));var i=n!=null&&n.hydratedSources||null,r=!1,s="",o=Ex;if(n!=null&&(n.unstable_strictMode===!0&&(r=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(o=n.onRecoverableError)),e=wx(e,null,t,1,n??null,r,!1,s,o),t[ji]=e.current,wa(t),i)for(t=0;t<i.length;t++)n=i[t],r=n._getVersion,r=r(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,r]:e.mutableSourceEagerHydrationData.push(n,r);return new vu(e)};kn.render=function(t,e,n){if(!xu(e))throw Error(se(200));return yu(null,t,e,!1,n)};kn.unmountComponentAtNode=function(t){if(!xu(t))throw Error(se(40));return t._reactRootContainer?(os(function(){yu(null,null,t,!1,function(){t._reactRootContainer=null,t[ji]=null})}),!0):!1};kn.unstable_batchedUpdates=Lp;kn.unstable_renderSubtreeIntoContainer=function(t,e,n,i){if(!xu(n))throw Error(se(200));if(t==null||t._reactInternals===void 0)throw Error(se(38));return yu(t,e,n,!1,i)};kn.version="18.3.1-next-f1338f8080-20240426";function Tx(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Tx)}catch(t){console.error(t)}}Tx(),T_.exports=kn;var s1=T_.exports,bx,Eg=s1;bx=Eg.createRoot,Eg.hydrateRoot;class o1{constructor(){this.listeners=new Map}on(e,n){this.listeners.has(e)||this.listeners.set(e,new Set),this.listeners.get(e).add(n)}off(e,n){var i;(i=this.listeners.get(e))==null||i.delete(n)}emit(e,n){var i;(i=this.listeners.get(e))==null||i.forEach(r=>r(n))}clear(){this.listeners.clear()}}const ut=new o1;class mi{static process(e,n,i){if(i&&e.hook_event_name==="SessionStart"&&ut.emit("node:created",{sessionId:e.session_id,node:i}),i&&["PostToolUse","PostToolUseFailure"].includes(e.hook_event_name)&&e.tool_name&&ut.emit("tool:used",{sessionId:e.session_id,nodeKey:i.key,tool:e.tool_name,colorHex:i.colorHex,inbound:!1,agentId:null,toolInput:e.tool_input,toolResponse:e.tool_response}),e.hook_event_name==="UserPromptSubmit"&&e.prompt){const r=e.prompt.trim().split(/\s+/).filter(o=>o.length>0);r.length>0&&ut.emit("prompt:submitted",{sessionId:e.session_id,words:r,color:"#b0c8f0"})}if(e.hook_event_name==="Stop"&&e.last_assistant_message){const r=e.last_assistant_message.trim().split(/\s+/).filter(s=>s.length>0).slice(0,8);r.length>0&&ut.emit("response:received",{sessionId:e.session_id,words:r,color:"#aab8f0"})}e.hook_event_name==="SessionStart"&&ut.emit("cluster:created",{cluster:n}),e.hook_event_name==="SessionEnd"&&ut.emit("cluster:removed",{sessionId:e.session_id}),e.hook_event_name==="PreCompact"&&ut.emit("compact:pre",{sessionId:e.session_id}),e.hook_event_name==="PostCompact"&&ut.emit("compact:post",{sessionId:e.session_id}),e.hook_event_name==="PermissionRequest"&&ut.emit("permission:request",{sessionId:e.session_id}),e.hook_event_name==="SubagentStart"&&e.agent_id&&ut.emit("subagent:start",{sessionId:e.session_id,agentId:e.agent_id,agentType:e.agent_type||"agent"}),e.hook_event_name==="SubagentStop"&&e.agent_id&&ut.emit("subagent:stop",{sessionId:e.session_id,agentId:e.agent_id}),e.hook_event_name==="SessionEnd"&&ut.emit("session:end",{sessionId:e.session_id}),e.hook_event_name==="Notification"&&i&&ut.emit("notification",{sessionId:e.session_id,nodeKey:i.key,title:e.title||"notification"})}}const Fr=[70,120,175,225],dl=[4,8,18,20],Oo=[.0015,.001,6e-4,4e-4],jd={Read:"#4ade80",Edit:"#60a5fa",Write:"#60a5fa",Bash:"#f59e0b",Grep:"#a78bfa",Glob:"#a78bfa",WebFetch:"#f472b6",Stop:"#aaaaaa",Notification:"#34d399",prompt:"#b0c8f0",response:"#7eb8f0",compact:"#FFD060",error:"#f87171",SubagentStop:"#c084fc"},$d="#4ade80";function Bp(t){if(t<Fr.length)return Fr[t];const e=Fr[Fr.length-1]??200,n=Fr[Fr.length-2]??e-55,i=Math.max(40,e-n);return e+i*(t-(Fr.length-1))}function Tg(t){if(t<Oo.length)return Oo[t];const e=Oo[Oo.length-1]??4e-4,n=t-(Oo.length-1);return Math.max(e*Math.pow(.85,n),e*.2)}function a1(t){return t<dl.length?dl[t]:dl[dl.length-1]??20}function bg(t){const e=t.toLowerCase().replace("claude-","");return e.startsWith("opus")?"opus":e.startsWith("sonnet")?"sonnet":e.startsWith("haiku")?"haiku":"unknown"}const hl={opus:{base:[1,.45,.12],bright:[1,.75,.4],glow:15757344,core:16759654,brightHex:16764040},sonnet:{base:[.25,.5,1],bright:[.5,.75,1],glow:4227327,core:8433919,brightHex:11194623},haiku:{base:[.2,.85,.45],bright:[.5,1,.7],glow:3201136,core:7405488,brightHex:10551240},unknown:{base:[.78,.84,.94],bright:[.94,.96,1],glow:13161968,core:15791615,brightHex:16777215}};function Ag(t){let e=2166136261;for(let n=0;n<t.length;n++)e=Math.imul(e^t.charCodeAt(n),16777619);return(e>>>0)%15-7}const ha=6,l1={Read:"#4ade80",Edit:"#60a5fa",Write:"#60a5fa",Bash:"#f59e0b",Grep:"#a78bfa",Glob:"#a78bfa",WebFetch:"#f472b6",Stop:"#888888",Notification:"#34d399"},c1="#555555";function u1(t){const e=parseInt(t.slice(1,3),16),n=parseInt(t.slice(3,5),16),i=parseInt(t.slice(5,7),16),r=Math.round(e*.3+190*.7),s=Math.round(n*.3+190*.7),o=Math.round(i*.3+190*.7);return`#${r.toString(16).padStart(2,"0")}${s.toString(16).padStart(2,"0")}${o.toString(16).padStart(2,"0")}`}function Cg(t){return parseInt(t.replace("#",""),16)}const pl=typeof window<"u"?window.innerWidth:1280,ml=typeof window<"u"?window.innerHeight:800;function f1(t){for(let e=0;;e++)if(e>=t.ringCounts.length&&(t.ringCounts[e]=0),t.ringCounts[e]<a1(e))return e}function d1(t,e){const n=[...t.nodes.values()].filter(d=>d.orbitRing===e),i=n.length;if(i===0||i===1)return;const r=n.sort((d,a)=>{const u=d.targetOrbitAngle??d.orbitAngle,h=a.targetOrbitAngle??a.orbitAngle;return u-h}),s=Math.PI*2/i;let o=0,c=0;for(const d of r){const a=d.targetOrbitAngle??d.orbitAngle;o+=Math.sin(a),c+=Math.cos(a)}const f=Math.atan2(o/i,c/i)-s*(i-1)/2;r.forEach((d,a)=>{const u=f+a*s,h=d.targetOrbitAngle??d.orbitAngle,m=Math.atan2(Math.sin(u-h),Math.cos(u-h));Math.abs(m)>.05&&(d.targetOrbitAngle=u)})}function gl(t){var r;const e=String(t.id||`${t.session_id}-${t.timestamp}`),n=t.tool_name;if(!n)return t.hook_event_name==="Stop"?`session:stop:${e}`:t.hook_event_name==="Notification"?`notification:${(((r=t.tool_input)==null?void 0:r.message)||"").slice(0,20)}:${e}`:t.hook_event_name==="PermissionRequest"?`permission:${e}`:`hook:${t.hook_event_name}:${e}`;const i=t.tool_input;if(["Read","Edit","Write","Glob","Grep"].includes(n)){const s=(i==null?void 0:i.file_path)||(i==null?void 0:i.path)||null;return s?`file:${s}:${e}`:`file:unknown:${e}`}if(n==="Bash")return`bash:${(i==null?void 0:i.command)||""}:${e}`;if(n==="WebFetch")try{return`web:${new URL((i==null?void 0:i.url)||"").hostname}:${e}`}catch{return`web:unknown:${e}`}return`tool:${n}:${e}`}function Ax(t){if(t.startsWith("mcp_")){const e=t.split("__");return e[e.length-1].replace(/_/g," ")}return t}function h1(t){var i;const e=t.tool_name,n=t.tool_input;if(["Read","Edit","Write","Glob","Grep"].includes(e||"")){const r=(n==null?void 0:n.file_path)||(n==null?void 0:n.path)||"";return r.split("/").pop()||r}if(e==="Bash")return`$ ${((n==null?void 0:n.command)||"").slice(0,22)}`;if(e==="WebFetch")try{return`↗ ${new URL((n==null?void 0:n.url)||"").hostname}`}catch{return"↗ web"}return t.hook_event_name==="Stop"?"✓ done":t.hook_event_name==="Notification"?(((i=t.tool_input)==null?void 0:i.message)||"notification").slice(0,24):e&&e.startsWith("mcp_")?Ax(e).slice(0,20):e||t.hook_event_name||"?"}function Rg(t,e){var c,l;const n=t.tool_name||t.hook_event_name||"?",i=t.tool_input,r=t.tool_response,s=n.startsWith("mcp_")?Ax(n).slice(0,14):n,o=e?` ${e}`:"";if(t.hook_event_name==="PostToolUseFailure"&&t.is_interrupt)return`⏹ interrupted${o}`;if(t.hook_event_name==="PostToolUse"&&r){if(n==="Bash"){const f=r.exitCode??r.exit_code??r.code;if(f!=null)return f===0?`${s} ✓${o}`:`${s} ✗ ${f}${o}`}if(n==="Grep"){const f=r.count??r.numMatches??r.total;if(f!==void 0)return`${s} ${f} hits${o}`}if(n==="Glob"){const f=Array.isArray(r)?r.length:((c=r.files)==null?void 0:c.length)??r.count;if(f!==void 0)return`${s} ${f} files${o}`}}if(i){if(n==="Edit"){const f=i.new_string||"",d=i.old_string||"",a=f.split(`
`).length,u=d.split(`
`).length;return a!==u?`${s} +${a} -${u}${o}`:`${s} ${a}L${o}`}if(n==="Write"){const d=(i.content||"").split(`
`).length;return`${s} ${d}L${o}`}if(n==="Read"){const f=i.limit,d=i.offset;if(d)return`${s} @${d}${o}`;if(f)return`${s} ${f}L${o}`}if(n==="Bash")return`$ ${((l=(i.command||"").split(/\s+/)[0])==null?void 0:l.split("/").pop())||""}${o}`;if(n==="Grep")return`${s} /${(i.pattern||"").toString().slice(0,10)}/${o}`}return s+o}function p1(t){const e=t.tool_name;return["Read","Edit","Write","Glob","Grep"].includes(e||"")?"file":e==="Bash"?"bash":e==="WebFetch"?"web":t.hook_event_name==="Stop"?"stop":t.hook_event_name==="Notification"?"notification":"tool"}function rf(t){let e=0;for(let n=t.ringCounts.length-1;n>=0;n--)if(t.ringCounts[n]>0){e=n;break}return Bp(e)}function m1(t,e){const n=(o,c)=>{const l=rf(o),f=rf(c);return(l+f)*2+100};for(let o=0;o<24;o++){const c=(t+o/24)/Math.max(ha,1)*Math.PI*2,f=(e.length>0?e.reduce((m,v)=>m+rf(v),0)/e.length:Bp(0))*4/Math.sin(Math.PI/Math.max(ha,2)),d=Math.max(f,Math.min(pl,ml)*.38),a=pl/2+Math.cos(c)*d,u=ml/2+Math.sin(c)*d;if(!e.some(m=>{const v=n(m,{ringCounts:[]});return Math.hypot(m.centerX-a,m.centerY-u)<v}))return{x:a,y:u}}const r=t/Math.max(ha,1)*Math.PI*2,s=Math.min(pl,ml)*.38;return{x:pl/2+Math.cos(r)*s,y:ml/2+Math.sin(r)*s}}function g1(){const t=[],e=new Map,n=new Map,i=new Map;function r(){const l=new Map;for(let f=0;f<t.length;f++){const d=t[f],a=gl(d);a&&(l.has(d.session_id)||l.set(d.session_id,new Map),l.get(d.session_id).set(a,f))}for(const[f,d]of e){const a=l.get(f);for(const[u,h]of d.nodes){if(!(a!=null&&a.has(u)))continue;const m=a.get(u),v=t.length-1-m;h.age=d.stopping&&h.age>=80?h.age:v,h.lastEventIndex=m}d.stopping&&d.nodes.size===0&&e.delete(f)}}function s(l,f=!1){var S,b;if(t.push(l),!e.has(l.session_id)){if(e.size>=ha){const z=e.keys().next().value;z!==void 0&&e.delete(z)}const M=e.size,T=l.session_id,y=T.startsWith("unknown-")?`#${T.slice(8,12)}`:T.slice(0,8);let w=null;const D=T.match(/^([a-f0-9-]{36})[-_]sub[-_]/i)||T.match(/^([a-f0-9-]{36})\//i);if(D)w=D[1];else if(T.includes("_sub_")||T.includes("-sub-")){const z=T.indexOf("_sub_")!==-1?T.indexOf("_sub_"):T.indexOf("-sub-");w=T.slice(0,z)}const C=w?e.get(w)??null:null,N=C!==null,P=N?[...e.values()].filter(z=>z.parentSessionId===w).length:0;let U,V=M/Math.max(ha,1)*Math.PI*2;if(C){const z=P/3*Math.PI*2-Math.PI/4;U={x:C.centerX+Math.cos(z)*480,y:C.centerY+Math.sin(z)*480},V=z}else U=m1(M,[...e.values()]);const O={sessionId:l.session_id,label:y,centerX:U.x,centerY:U.y,nodes:new Map,edges:[],stopping:!1,lastFileKey:null,parentSessionId:w,ringCounts:[],layoutAngle:V,isChild:N,childIndex:P,compacting:0,compacted:0,promptSnakes:[],agentPositionMap:new Map},H=Ag(l.session_id);O.ringSpeedJitter=H,O.ringSpeeds=[],e.set(l.session_id,O)}const d=e.get(l.session_id);if(d.eventCount=(d.eventCount||0)+1,l.model&&l.model!==d.model&&(d.model=l.model),d.label.length<=8||d.label.startsWith("#")){let M="";if(l.cwd){const T=l.cwd.split("/").filter(Boolean);M=T[T.length-1]||""}if(!M){const T=((S=l.tool_input)==null?void 0:S.file_path)||((b=l.tool_input)==null?void 0:b.path)||"";if(T.includes("/")){const y=T.split("/").filter(Boolean),w=y.lastIndexOf("src");w>0?M=y[w-1]:y.length>=3&&(M=y[y.length-3])}}M&&M.length>1&&(d.label=M)}if(l.hook_event_name==="Stop"){d.stopping=!0;for(const M of d.nodes.values())M.age=Math.max(M.age,80)}if(l.hook_event_name==="PermissionRequest"&&(d.awaitingPermission=!0),(l.hook_event_name==="PostToolUse"||l.hook_event_name==="PreToolUse")&&(d.awaitingPermission=!1),l.hook_event_name==="PreToolUse"&&l.tool_use_id&&(n.set(l.tool_use_id,l.timestamp),i.set(l.tool_use_id,l.tool_input)),l.hook_event_name==="SubagentStart"){const M=l.agent_id||`${l.session_id}-sub`,T=`agent:${M}`;if(!d.nodes.has(T)){const y=Math.random()*Math.PI*2;d.nodes.set(T,{key:T,label:l.agent_type||"agent",nodeType:"agent",baseRadius:3,color:Cg("#c084fc"),colorHex:"#c084fc",x:d.centerX+Math.cos(y)*32,y:d.centerY+Math.sin(y)*32,vx:0,vy:0,age:0,lastEventIndex:t.length-1,lastTool:null,lastTimestamp:l.timestamp,eventCount:1,awaitingPermission:!1,orbitRing:-1,orbitAngle:y,orbitSpeed:.007,orbitRadius:32,life:1,entry:0,impactType:null,impactTime:0,actionLabel:null,actionFade:0,marks:[]});const w=d.nodes.get(T);d.agentPositionMap.set(M,{x:w.x,y:w.y}),console.log(`[Store] Agent ${M} registered at (${w.x.toFixed(0)}, ${w.y.toFixed(0)})`)}r(),f||mi.process(l,d,null);return}if(l.hook_event_name==="SubagentStop"){const M=l.agent_id||`${l.session_id}-sub`,T=`agent:${M}`,y=d.nodes.get(T);y&&(y.life=.08,y.impactType="fade",y.impactTime=1,d.agentPositionMap.delete(M)),r(),f||mi.process(l,d,null);return}if(l.hook_event_name==="SessionEnd"){e.delete(l.session_id),f||mi.process(l,d,null);return}if(l.hook_event_name==="UserPromptSubmit"){d.coreAct=1,r(),f||mi.process(l,d,null);return}if(l.hook_event_name==="ConfigChange"){l.model&&(d.model=l.model),d.coreAct=1,r(),f||mi.process(l,d,null);return}if(l.hook_event_name==="SessionStart"){l.model&&(d.model=l.model),l.source&&(d.source=l.source),d.coreAct=1,r(),f||mi.process(l,d,null);return}if(l.hook_event_name==="PreCompact"){d.coreAct=1,d.compacting=1,r(),f||mi.process(l,d,null);return}if(l.hook_event_name==="PostCompact"){d.coreAct=1,d.compacted=1,d.eventCount=Math.floor((d.eventCount||0)*.25),r(),f||mi.process(l,d,null);return}let a="";if((l.hook_event_name==="PostToolUse"||l.hook_event_name==="PostToolUseFailure")&&l.tool_use_id){const M=n.get(l.tool_use_id);if(M){const T=l.timestamp-M;a=T<1e3?`${T}ms`:`${(T/1e3).toFixed(1)}s`,n.delete(l.tool_use_id)}!l.tool_input&&i.has(l.tool_use_id)&&(l.tool_input=i.get(l.tool_use_id)??null,i.delete(l.tool_use_id))}const u=gl(l);if(!u){r();return}const h=l1[l.tool_name||l.hook_event_name]??c1,m=u1(h),v=Cg(m),g=p1(l),p=g==="file";if(d.nodes.has(u)){const M=d.nodes.get(u);if(M.lastTool=l.tool_name||l.hook_event_name||null,M.lastTimestamp=l.timestamp,M.eventCount++,M.colorHex=m,M.color=v,p&&(M.baseRadius=Math.min(8,M.baseRadius+.3)),l.hook_event_name==="PostToolUseFailure")M.impactType="fail",M.impactTime=1,l.is_interrupt?M.actionLabel="⏹ interrupted"+(a?` ${a}`:""):M.actionLabel="✗ error"+(a?` ${a}`:""),M.actionFade=0;else if(l.hook_event_name==="PostToolUse"){const T=l.tool_name||"";["Read","Grep","Glob"].includes(T)?M.impactType="scan":["Edit","Write"].includes(T)?M.impactType="morph":T==="Bash"?M.impactType="spark":M.impactType="scan",M.impactTime=1;const y=Rg(l,a||void 0);y!==T&&(M.actionLabel=y)}else{const T=l.tool_name||l.hook_event_name||"";["Read","Grep","Glob"].includes(T)?M.impactType="scan":["Edit","Write"].includes(T)?M.impactType="morph":T==="Bash"?M.impactType="spark":T==="Notification"?M.impactType="ping":T==="Stop"?M.impactType="fade":M.impactType="scan",M.impactTime=1,M.actionLabel=Rg(l),M.actionFade=l.hook_event_name==="Stop"||l.hook_event_name==="Notification"?1:0}}else{const M=f1(d);d.ringCounts[M]++;const T=d.ringSpeeds,y=d.ringSpeedJitter??Ag(l.session_id);let w=Tg(M);T&&(T[M]==null&&(T[M]=Tg(M)*(1+(y+(M*2-1))/7*.2)),w=T[M]);const D=Bp(M),C=[...d.nodes.values()].filter(P=>P.orbitRing===M);let N=Math.random()*Math.PI*2;if(C.length>0){const P=C.map(O=>O.targetOrbitAngle??O.orbitAngle).sort((O,H)=>O-H);let U=0,V=0;for(let O=0;O<P.length;O++){const z=(O+1<P.length?P[O+1]:P[0]+Math.PI*2)-P[O];z>U&&(U=z,V=P[O]+z/2)}N=V}if(d.nodes.set(u,{key:u,label:h1(l),nodeType:g,baseRadius:p?2.5+Math.min(9,1)*.45:4,color:v,colorHex:m,x:d.centerX+Math.cos(N)*D,y:d.centerY+Math.sin(N)*D,vx:0,vy:0,age:0,lastEventIndex:t.length-1,lastTool:l.tool_name||l.hook_event_name||null,lastTimestamp:l.timestamp,eventCount:1,awaitingPermission:!1,orbitRing:M,orbitAngle:N,orbitSpeed:w,orbitRadius:D,life:1,entry:0,impactType:null,impactTime:0,actionLabel:null,actionFade:0,marks:[]}),d1(d,M),l.hook_event_name==="PostToolUseFailure"){const P=d.nodes.get(u);P.impactType="fail",P.impactTime=1,l.is_interrupt?P.actionLabel="⏹ interrupted"+(a?` ${a}`:""):P.actionLabel="✗ error"+(a?` ${a}`:""),P.actionFade=0}else if(l.hook_event_name==="Stop"||l.hook_event_name==="Notification"){const P=d.nodes.get(u);P.actionLabel=l.tool_name||l.hook_event_name,P.actionFade=1}}u&&p&&(d.lastFileKey&&d.lastFileKey!==u&&d.nodes.has(d.lastFileKey)&&(d.edges.some(T=>T.fromKey===d.lastFileKey&&T.toKey===u)||d.edges.push({fromKey:d.lastFileKey,toKey:u,color:v,colorHex:m,age:0})),d.lastFileKey=u),r();const _=gl(l),x=_?d.nodes.get(_)??null:null;f||mi.process(l,d,x)}function o(l){for(const f of l){const d=e.get(f.session_id);if(!d)continue;const a=gl(f),u=a?d.nodes.get(a)??null:null;mi.process(f,d,u)}}function c(l){if(l){for(let f=t.length-1;f>=0;f--)t[f].session_id===l&&t.splice(f,1);e.delete(l),r()}}return{addEvent:s,clearSession:c,replayEvents:o,getBuffer:()=>[...t],getSessions:()=>e}}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const zp="183",so={ROTATE:0,DOLLY:1,PAN:2},Qs={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},_1=0,Pg=1,v1=2,mc=1,x1=2,ta=3,Cr=0,En=1,ri=2,Ei=0,oo=1,st=2,Lg=3,Dg=4,y1=5,$r=100,S1=101,M1=102,w1=103,E1=104,T1=200,b1=201,A1=202,C1=203,Yd=204,qd=205,R1=206,P1=207,L1=208,D1=209,I1=210,N1=211,U1=212,F1=213,O1=214,Kd=0,Zd=1,Qd=2,_o=3,Jd=4,eh=5,th=6,nh=7,Vp=0,k1=1,B1=2,Ti=0,Cx=1,Rx=2,Px=3,Lx=4,Dx=5,Ix=6,Nx=7,Ux=300,as=301,vo=302,sf=303,of=304,Su=306,ih=1e3,Vi=1001,rh=1002,Kt=1003,z1=1004,_l=1005,an=1006,af=1007,Qr=1008,Dn=1009,Fx=1010,Ox=1011,Da=1012,Hp=1013,Ai=1014,oi=1015,Fn=1016,Gp=1017,Wp=1018,Ia=1020,kx=35902,Bx=35899,zx=1021,Vx=1022,ai=1023,qi=1026,Jr=1027,Xp=1028,jp=1029,xo=1030,$p=1031,Yp=1033,gc=33776,_c=33777,vc=33778,xc=33779,sh=35840,oh=35841,ah=35842,lh=35843,ch=36196,uh=37492,fh=37496,dh=37488,hh=37489,ph=37490,mh=37491,gh=37808,_h=37809,vh=37810,xh=37811,yh=37812,Sh=37813,Mh=37814,wh=37815,Eh=37816,Th=37817,bh=37818,Ah=37819,Ch=37820,Rh=37821,Ph=36492,Lh=36494,Dh=36495,Ih=36283,Nh=36284,Uh=36285,Fh=36286,V1=3200,_P=3201,qp=0,H1=1,pr="",Gn="srgb",yo="srgb-linear",qc="linear",ct="srgb",_s=7680,Ig=519,G1=512,W1=513,X1=514,Kp=515,j1=516,$1=517,Zp=518,Y1=519,Oh=35044,q1=35048,Ng="300 es",Si=2e3,Na=2001;function K1(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function Kc(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function Z1(){const t=Kc("canvas");return t.style.display="block",t}const Ug={};function Zc(...t){const e="THREE."+t.shift();console.log(e,...t)}function Hx(t){const e=t[0];if(typeof e=="string"&&e.startsWith("TSL:")){const n=t[1];n&&n.isStackTrace?t[0]+=" "+n.getLocation():t[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return t}function Oe(...t){t=Hx(t);const e="THREE."+t.shift();{const n=t[0];n&&n.isStackTrace?console.warn(n.getError(e)):console.warn(e,...t)}}function Qe(...t){t=Hx(t);const e="THREE."+t.shift();{const n=t[0];n&&n.isStackTrace?console.error(n.getError(e)):console.error(e,...t)}}function Qc(...t){const e=t.join(" ");e in Ug||(Ug[e]=!0,Oe(...t))}function Q1(t,e,n){return new Promise(function(i,r){function s(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:r();break;case t.TIMEOUT_EXPIRED:setTimeout(s,n);break;default:i()}}setTimeout(s,n)})}const J1={[Kd]:Zd,[Qd]:th,[Jd]:nh,[_o]:eh,[Zd]:Kd,[th]:Qd,[nh]:Jd,[eh]:_o};class fs{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){const i=this._listeners;if(i===void 0)return;const r=i[e];if(r!==void 0){const s=r.indexOf(n);s!==-1&&r.splice(s,1)}}dispatchEvent(e){const n=this._listeners;if(n===void 0)return;const i=n[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const rn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Fg=1234567;const ao=Math.PI/180,Ua=180/Math.PI;function Gi(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(rn[t&255]+rn[t>>8&255]+rn[t>>16&255]+rn[t>>24&255]+"-"+rn[e&255]+rn[e>>8&255]+"-"+rn[e>>16&15|64]+rn[e>>24&255]+"-"+rn[n&63|128]+rn[n>>8&255]+"-"+rn[n>>16&255]+rn[n>>24&255]+rn[i&255]+rn[i>>8&255]+rn[i>>16&255]+rn[i>>24&255]).toLowerCase()}function $e(t,e,n){return Math.max(e,Math.min(n,t))}function Qp(t,e){return(t%e+e)%e}function ew(t,e,n,i,r){return i+(t-e)*(r-i)/(n-e)}function tw(t,e,n){return t!==e?(n-t)/(e-t):0}function pa(t,e,n){return(1-n)*t+n*e}function nw(t,e,n,i){return pa(t,e,1-Math.exp(-n*i))}function iw(t,e=1){return e-Math.abs(Qp(t,e*2)-e)}function rw(t,e,n){return t<=e?0:t>=n?1:(t=(t-e)/(n-e),t*t*(3-2*t))}function sw(t,e,n){return t<=e?0:t>=n?1:(t=(t-e)/(n-e),t*t*t*(t*(t*6-15)+10))}function ow(t,e){return t+Math.floor(Math.random()*(e-t+1))}function aw(t,e){return t+Math.random()*(e-t)}function lw(t){return t*(.5-Math.random())}function cw(t){t!==void 0&&(Fg=t);let e=Fg+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function uw(t){return t*ao}function fw(t){return t*Ua}function dw(t){return(t&t-1)===0&&t!==0}function hw(t){return Math.pow(2,Math.ceil(Math.log(t)/Math.LN2))}function pw(t){return Math.pow(2,Math.floor(Math.log(t)/Math.LN2))}function mw(t,e,n,i,r){const s=Math.cos,o=Math.sin,c=s(n/2),l=o(n/2),f=s((e+i)/2),d=o((e+i)/2),a=s((e-i)/2),u=o((e-i)/2),h=s((i-e)/2),m=o((i-e)/2);switch(r){case"XYX":t.set(c*d,l*a,l*u,c*f);break;case"YZY":t.set(l*u,c*d,l*a,c*f);break;case"ZXZ":t.set(l*a,l*u,c*d,c*f);break;case"XZX":t.set(c*d,l*m,l*h,c*f);break;case"YXY":t.set(l*h,c*d,l*m,c*f);break;case"ZYZ":t.set(l*m,l*h,c*d,c*f);break;default:Oe("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function si(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("Invalid component type.")}}function ft(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("Invalid component type.")}}const gw={DEG2RAD:ao,RAD2DEG:Ua,generateUUID:Gi,clamp:$e,euclideanModulo:Qp,mapLinear:ew,inverseLerp:tw,lerp:pa,damp:nw,pingpong:iw,smoothstep:rw,smootherstep:sw,randInt:ow,randFloat:aw,randFloatSpread:lw,seededRandom:cw,degToRad:uw,radToDeg:fw,isPowerOfTwo:dw,ceilPowerOfTwo:hw,floorPowerOfTwo:pw,setQuaternionFromProperEuler:mw,normalize:ft,denormalize:si};class _e{constructor(e=0,n=0){_e.prototype.isVector2=!0,this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,i=this.y,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=$e(this.x,e.x,n.x),this.y=$e(this.y,e.y,n.y),this}clampScalar(e,n){return this.x=$e(this.x,e,n),this.y=$e(this.y,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar($e(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos($e(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const i=Math.cos(n),r=Math.sin(n),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Rr{constructor(e=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=r}static slerpFlat(e,n,i,r,s,o,c){let l=i[r+0],f=i[r+1],d=i[r+2],a=i[r+3],u=s[o+0],h=s[o+1],m=s[o+2],v=s[o+3];if(a!==v||l!==u||f!==h||d!==m){let g=l*u+f*h+d*m+a*v;g<0&&(u=-u,h=-h,m=-m,v=-v,g=-g);let p=1-c;if(g<.9995){const _=Math.acos(g),x=Math.sin(_);p=Math.sin(p*_)/x,c=Math.sin(c*_)/x,l=l*p+u*c,f=f*p+h*c,d=d*p+m*c,a=a*p+v*c}else{l=l*p+u*c,f=f*p+h*c,d=d*p+m*c,a=a*p+v*c;const _=1/Math.sqrt(l*l+f*f+d*d+a*a);l*=_,f*=_,d*=_,a*=_}}e[n]=l,e[n+1]=f,e[n+2]=d,e[n+3]=a}static multiplyQuaternionsFlat(e,n,i,r,s,o){const c=i[r],l=i[r+1],f=i[r+2],d=i[r+3],a=s[o],u=s[o+1],h=s[o+2],m=s[o+3];return e[n]=c*m+d*a+l*h-f*u,e[n+1]=l*m+d*u+f*a-c*h,e[n+2]=f*m+d*h+c*u-l*a,e[n+3]=d*m-c*a-l*u-f*h,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,r){return this._x=e,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const i=e._x,r=e._y,s=e._z,o=e._order,c=Math.cos,l=Math.sin,f=c(i/2),d=c(r/2),a=c(s/2),u=l(i/2),h=l(r/2),m=l(s/2);switch(o){case"XYZ":this._x=u*d*a+f*h*m,this._y=f*h*a-u*d*m,this._z=f*d*m+u*h*a,this._w=f*d*a-u*h*m;break;case"YXZ":this._x=u*d*a+f*h*m,this._y=f*h*a-u*d*m,this._z=f*d*m-u*h*a,this._w=f*d*a+u*h*m;break;case"ZXY":this._x=u*d*a-f*h*m,this._y=f*h*a+u*d*m,this._z=f*d*m+u*h*a,this._w=f*d*a-u*h*m;break;case"ZYX":this._x=u*d*a-f*h*m,this._y=f*h*a+u*d*m,this._z=f*d*m-u*h*a,this._w=f*d*a+u*h*m;break;case"YZX":this._x=u*d*a+f*h*m,this._y=f*h*a+u*d*m,this._z=f*d*m-u*h*a,this._w=f*d*a-u*h*m;break;case"XZY":this._x=u*d*a-f*h*m,this._y=f*h*a-u*d*m,this._z=f*d*m+u*h*a,this._w=f*d*a+u*h*m;break;default:Oe("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const i=n/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,i=n[0],r=n[4],s=n[8],o=n[1],c=n[5],l=n[9],f=n[2],d=n[6],a=n[10],u=i+c+a;if(u>0){const h=.5/Math.sqrt(u+1);this._w=.25/h,this._x=(d-l)*h,this._y=(s-f)*h,this._z=(o-r)*h}else if(i>c&&i>a){const h=2*Math.sqrt(1+i-c-a);this._w=(d-l)/h,this._x=.25*h,this._y=(r+o)/h,this._z=(s+f)/h}else if(c>a){const h=2*Math.sqrt(1+c-i-a);this._w=(s-f)/h,this._x=(r+o)/h,this._y=.25*h,this._z=(l+d)/h}else{const h=2*Math.sqrt(1+a-i-c);this._w=(o-r)/h,this._x=(s+f)/h,this._y=(l+d)/h,this._z=.25*h}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs($e(this.dot(e),-1,1)))}rotateTowards(e,n){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,n/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const i=e._x,r=e._y,s=e._z,o=e._w,c=n._x,l=n._y,f=n._z,d=n._w;return this._x=i*d+o*c+r*f-s*l,this._y=r*d+o*l+s*c-i*f,this._z=s*d+o*f+i*l-r*c,this._w=o*d-i*c-r*l-s*f,this._onChangeCallback(),this}slerp(e,n){let i=e._x,r=e._y,s=e._z,o=e._w,c=this.dot(e);c<0&&(i=-i,r=-r,s=-s,o=-o,c=-c);let l=1-n;if(c<.9995){const f=Math.acos(c),d=Math.sin(f);l=Math.sin(l*f)/d,n=Math.sin(n*f)/d,this._x=this._x*l+i*n,this._y=this._y*l+r*n,this._z=this._z*l+s*n,this._w=this._w*l+o*n,this._onChangeCallback()}else this._x=this._x*l+i*n,this._y=this._y*l+r*n,this._z=this._z*l+s*n,this._w=this._w*l+o*n,this.normalize();return this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){const e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(n),s*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class R{constructor(e=0,n=0,i=0){R.prototype.isVector3=!0,this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(Og.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(Og.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6]*r,this.y=s[1]*n+s[4]*i+s[7]*r,this.z=s[2]*n+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*n+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*n+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*n+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*n+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const n=this.x,i=this.y,r=this.z,s=e.x,o=e.y,c=e.z,l=e.w,f=2*(o*r-c*i),d=2*(c*n-s*r),a=2*(s*i-o*n);return this.x=n+l*f+o*a-c*d,this.y=i+l*d+c*f-s*a,this.z=r+l*a+s*d-o*f,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[4]*i+s[8]*r,this.y=s[1]*n+s[5]*i+s[9]*r,this.z=s[2]*n+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=$e(this.x,e.x,n.x),this.y=$e(this.y,e.y,n.y),this.z=$e(this.z,e.z,n.z),this}clampScalar(e,n){return this.x=$e(this.x,e,n),this.y=$e(this.y,e,n),this.z=$e(this.z,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar($e(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const i=e.x,r=e.y,s=e.z,o=n.x,c=n.y,l=n.z;return this.x=r*l-s*c,this.y=s*o-i*l,this.z=i*c-r*o,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return lf.copy(this).projectOnVector(e),this.sub(lf)}reflect(e){return this.sub(lf.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos($e(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return n*n+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){const r=Math.sin(n)*e;return this.x=r*Math.sin(i),this.y=Math.cos(n)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const lf=new R,Og=new Rr;class We{constructor(e,n,i,r,s,o,c,l,f){We.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,c,l,f)}set(e,n,i,r,s,o,c,l,f){const d=this.elements;return d[0]=e,d[1]=r,d[2]=c,d[3]=n,d[4]=s,d[5]=l,d[6]=i,d[7]=o,d[8]=f,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,o=i[0],c=i[3],l=i[6],f=i[1],d=i[4],a=i[7],u=i[2],h=i[5],m=i[8],v=r[0],g=r[3],p=r[6],_=r[1],x=r[4],S=r[7],b=r[2],M=r[5],T=r[8];return s[0]=o*v+c*_+l*b,s[3]=o*g+c*x+l*M,s[6]=o*p+c*S+l*T,s[1]=f*v+d*_+a*b,s[4]=f*g+d*x+a*M,s[7]=f*p+d*S+a*T,s[2]=u*v+h*_+m*b,s[5]=u*g+h*x+m*M,s[8]=u*p+h*S+m*T,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],c=e[5],l=e[6],f=e[7],d=e[8];return n*o*d-n*c*f-i*s*d+i*c*l+r*s*f-r*o*l}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],c=e[5],l=e[6],f=e[7],d=e[8],a=d*o-c*f,u=c*l-d*s,h=f*s-o*l,m=n*a+i*u+r*h;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/m;return e[0]=a*v,e[1]=(r*f-d*i)*v,e[2]=(c*i-r*o)*v,e[3]=u*v,e[4]=(d*n-r*l)*v,e[5]=(r*s-c*n)*v,e[6]=h*v,e[7]=(i*l-f*n)*v,e[8]=(o*n-i*s)*v,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,r,s,o,c){const l=Math.cos(s),f=Math.sin(s);return this.set(i*l,i*f,-i*(l*o+f*c)+o+e,-r*f,r*l,-r*(-f*o+l*c)+c+n,0,0,1),this}scale(e,n){return this.premultiply(cf.makeScale(e,n)),this}rotate(e){return this.premultiply(cf.makeRotation(-e)),this}translate(e,n){return this.premultiply(cf.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const cf=new We,kg=new We().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Bg=new We().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function _w(){const t={enabled:!0,workingColorSpace:yo,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===ct&&(r.r=Wi(r.r),r.g=Wi(r.g),r.b=Wi(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===ct&&(r.r=lo(r.r),r.g=lo(r.g),r.b=lo(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===pr?qc:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return Qc("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),t.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return Qc("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),t.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],i=[.3127,.329];return t.define({[yo]:{primaries:e,whitePoint:i,transfer:qc,toXYZ:kg,fromXYZ:Bg,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Gn},outputColorSpaceConfig:{drawingBufferColorSpace:Gn}},[Gn]:{primaries:e,whitePoint:i,transfer:ct,toXYZ:kg,fromXYZ:Bg,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Gn}}}),t}const Je=_w();function Wi(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function lo(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}let vs;class vw{static getDataURL(e,n="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{vs===void 0&&(vs=Kc("canvas")),vs.width=e.width,vs.height=e.height;const r=vs.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=vs}return i.toDataURL(n)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=Kc("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=Wi(s[o]/255)*255;return i.putImageData(r,0,0),n}else if(e.data){const n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(Wi(n[i]/255)*255):n[i]=Wi(n[i]);return{data:n,width:e.width,height:e.height}}else return Oe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let xw=0;class Jp{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:xw++}),this.uuid=Gi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const n=this.data;return typeof HTMLVideoElement<"u"&&n instanceof HTMLVideoElement?e.set(n.videoWidth,n.videoHeight,0):typeof VideoFrame<"u"&&n instanceof VideoFrame?e.set(n.displayHeight,n.displayWidth,0):n!==null?e.set(n.width,n.height,n.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,c=r.length;o<c;o++)r[o].isDataTexture?s.push(uf(r[o].image)):s.push(uf(r[o]))}else s=uf(r);i.url=s}return n||(e.images[this.uuid]=i),i}}function uf(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?vw.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(Oe("Texture: Unable to serialize Texture."),{})}let yw=0;const ff=new R;class ln extends fs{constructor(e=ln.DEFAULT_IMAGE,n=ln.DEFAULT_MAPPING,i=Vi,r=Vi,s=an,o=Qr,c=ai,l=Dn,f=ln.DEFAULT_ANISOTROPY,d=pr){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:yw++}),this.uuid=Gi(),this.name="",this.source=new Jp(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=f,this.format=c,this.internalFormat=null,this.type=l,this.offset=new _e(0,0),this.repeat=new _e(1,1),this.center=new _e(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new We,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(ff).x}get height(){return this.source.getSize(ff).y}get depth(){return this.source.getSize(ff).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const n in e){const i=e[n];if(i===void 0){Oe(`Texture.setValues(): parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){Oe(`Texture.setValues(): property '${n}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Ux)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case ih:e.x=e.x-Math.floor(e.x);break;case Vi:e.x=e.x<0?0:1;break;case rh:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case ih:e.y=e.y-Math.floor(e.y);break;case Vi:e.y=e.y<0?0:1;break;case rh:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}ln.DEFAULT_IMAGE=null;ln.DEFAULT_MAPPING=Ux;ln.DEFAULT_ANISOTROPY=1;class Lt{constructor(e=0,n=0,i=0,r=1){Lt.prototype.isVector4=!0,this.x=e,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,r){return this.x=e,this.y=n,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*n+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*n+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*n+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*n+o[7]*i+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,r,s;const l=e.elements,f=l[0],d=l[4],a=l[8],u=l[1],h=l[5],m=l[9],v=l[2],g=l[6],p=l[10];if(Math.abs(d-u)<.01&&Math.abs(a-v)<.01&&Math.abs(m-g)<.01){if(Math.abs(d+u)<.1&&Math.abs(a+v)<.1&&Math.abs(m+g)<.1&&Math.abs(f+h+p-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const x=(f+1)/2,S=(h+1)/2,b=(p+1)/2,M=(d+u)/4,T=(a+v)/4,y=(m+g)/4;return x>S&&x>b?x<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(x),r=M/i,s=T/i):S>b?S<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(S),i=M/r,s=y/r):b<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(b),i=T/s,r=y/s),this.set(i,r,s,n),this}let _=Math.sqrt((g-m)*(g-m)+(a-v)*(a-v)+(u-d)*(u-d));return Math.abs(_)<.001&&(_=1),this.x=(g-m)/_,this.y=(a-v)/_,this.z=(u-d)/_,this.w=Math.acos((f+h+p-1)/2),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=$e(this.x,e.x,n.x),this.y=$e(this.y,e.y,n.y),this.z=$e(this.z,e.z,n.z),this.w=$e(this.w,e.w,n.w),this}clampScalar(e,n){return this.x=$e(this.x,e,n),this.y=$e(this.y,e,n),this.z=$e(this.z,e,n),this.w=$e(this.w,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar($e(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Sw extends fs{constructor(e=1,n=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:an,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=i.depth,this.scissor=new Lt(0,0,e,n),this.scissorTest=!1,this.viewport=new Lt(0,0,e,n),this.textures=[];const r={width:e,height:n,depth:i.depth},s=new ln(r),o=i.count;for(let c=0;c<o;c++)this.textures[c]=s.clone(),this.textures[c].isRenderTargetTexture=!0,this.textures[c].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const n={minFilter:an,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(n.mapping=e.mapping),e.wrapS!==void 0&&(n.wrapS=e.wrapS),e.wrapT!==void 0&&(n.wrapT=e.wrapT),e.wrapR!==void 0&&(n.wrapR=e.wrapR),e.magFilter!==void 0&&(n.magFilter=e.magFilter),e.minFilter!==void 0&&(n.minFilter=e.minFilter),e.format!==void 0&&(n.format=e.format),e.type!==void 0&&(n.type=e.type),e.anisotropy!==void 0&&(n.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(n.colorSpace=e.colorSpace),e.flipY!==void 0&&(n.flipY=e.flipY),e.generateMipmaps!==void 0&&(n.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(n.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(n)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=n,this.textures[r].image.depth=i,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++){this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0,this.textures[n].renderTarget=this;const r=Object.assign({},e.textures[n].image);this.textures[n].source=new Jp(r)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Tn extends Sw{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}}class Gx extends ln{constructor(e=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=Kt,this.minFilter=Kt,this.wrapR=Vi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Mw extends ln{constructor(e=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=Kt,this.minFilter=Kt,this.wrapR=Vi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ht{constructor(e,n,i,r,s,o,c,l,f,d,a,u,h,m,v,g){ht.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,c,l,f,d,a,u,h,m,v,g)}set(e,n,i,r,s,o,c,l,f,d,a,u,h,m,v,g){const p=this.elements;return p[0]=e,p[4]=n,p[8]=i,p[12]=r,p[1]=s,p[5]=o,p[9]=c,p[13]=l,p[2]=f,p[6]=d,p[10]=a,p[14]=u,p[3]=h,p[7]=m,p[11]=v,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ht().fromArray(this.elements)}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){const n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return this.determinant()===0?(e.set(1,0,0),n.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const n=this.elements,i=e.elements,r=1/xs.setFromMatrixColumn(e,0).length(),s=1/xs.setFromMatrixColumn(e,1).length(),o=1/xs.setFromMatrixColumn(e,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*s,n[5]=i[5]*s,n[6]=i[6]*s,n[7]=0,n[8]=i[8]*o,n[9]=i[9]*o,n[10]=i[10]*o,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),c=Math.sin(i),l=Math.cos(r),f=Math.sin(r),d=Math.cos(s),a=Math.sin(s);if(e.order==="XYZ"){const u=o*d,h=o*a,m=c*d,v=c*a;n[0]=l*d,n[4]=-l*a,n[8]=f,n[1]=h+m*f,n[5]=u-v*f,n[9]=-c*l,n[2]=v-u*f,n[6]=m+h*f,n[10]=o*l}else if(e.order==="YXZ"){const u=l*d,h=l*a,m=f*d,v=f*a;n[0]=u+v*c,n[4]=m*c-h,n[8]=o*f,n[1]=o*a,n[5]=o*d,n[9]=-c,n[2]=h*c-m,n[6]=v+u*c,n[10]=o*l}else if(e.order==="ZXY"){const u=l*d,h=l*a,m=f*d,v=f*a;n[0]=u-v*c,n[4]=-o*a,n[8]=m+h*c,n[1]=h+m*c,n[5]=o*d,n[9]=v-u*c,n[2]=-o*f,n[6]=c,n[10]=o*l}else if(e.order==="ZYX"){const u=o*d,h=o*a,m=c*d,v=c*a;n[0]=l*d,n[4]=m*f-h,n[8]=u*f+v,n[1]=l*a,n[5]=v*f+u,n[9]=h*f-m,n[2]=-f,n[6]=c*l,n[10]=o*l}else if(e.order==="YZX"){const u=o*l,h=o*f,m=c*l,v=c*f;n[0]=l*d,n[4]=v-u*a,n[8]=m*a+h,n[1]=a,n[5]=o*d,n[9]=-c*d,n[2]=-f*d,n[6]=h*a+m,n[10]=u-v*a}else if(e.order==="XZY"){const u=o*l,h=o*f,m=c*l,v=c*f;n[0]=l*d,n[4]=-a,n[8]=f*d,n[1]=u*a+v,n[5]=o*d,n[9]=h*a-m,n[2]=m*a-h,n[6]=c*d,n[10]=v*a+u}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(ww,e,Ew)}lookAt(e,n,i){const r=this.elements;return Cn.subVectors(e,n),Cn.lengthSq()===0&&(Cn.z=1),Cn.normalize(),ir.crossVectors(i,Cn),ir.lengthSq()===0&&(Math.abs(i.z)===1?Cn.x+=1e-4:Cn.z+=1e-4,Cn.normalize(),ir.crossVectors(i,Cn)),ir.normalize(),vl.crossVectors(Cn,ir),r[0]=ir.x,r[4]=vl.x,r[8]=Cn.x,r[1]=ir.y,r[5]=vl.y,r[9]=Cn.y,r[2]=ir.z,r[6]=vl.z,r[10]=Cn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,o=i[0],c=i[4],l=i[8],f=i[12],d=i[1],a=i[5],u=i[9],h=i[13],m=i[2],v=i[6],g=i[10],p=i[14],_=i[3],x=i[7],S=i[11],b=i[15],M=r[0],T=r[4],y=r[8],w=r[12],D=r[1],C=r[5],N=r[9],P=r[13],U=r[2],V=r[6],O=r[10],H=r[14],z=r[3],X=r[7],J=r[11],Q=r[15];return s[0]=o*M+c*D+l*U+f*z,s[4]=o*T+c*C+l*V+f*X,s[8]=o*y+c*N+l*O+f*J,s[12]=o*w+c*P+l*H+f*Q,s[1]=d*M+a*D+u*U+h*z,s[5]=d*T+a*C+u*V+h*X,s[9]=d*y+a*N+u*O+h*J,s[13]=d*w+a*P+u*H+h*Q,s[2]=m*M+v*D+g*U+p*z,s[6]=m*T+v*C+g*V+p*X,s[10]=m*y+v*N+g*O+p*J,s[14]=m*w+v*P+g*H+p*Q,s[3]=_*M+x*D+S*U+b*z,s[7]=_*T+x*C+S*V+b*X,s[11]=_*y+x*N+S*O+b*J,s[15]=_*w+x*P+S*H+b*Q,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[4],r=e[8],s=e[12],o=e[1],c=e[5],l=e[9],f=e[13],d=e[2],a=e[6],u=e[10],h=e[14],m=e[3],v=e[7],g=e[11],p=e[15],_=l*h-f*u,x=c*h-f*a,S=c*u-l*a,b=o*h-f*d,M=o*u-l*d,T=o*a-c*d;return n*(v*_-g*x+p*S)-i*(m*_-g*b+p*M)+r*(m*x-v*b+p*T)-s*(m*S-v*M+g*T)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=n,r[14]=i),this}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],c=e[5],l=e[6],f=e[7],d=e[8],a=e[9],u=e[10],h=e[11],m=e[12],v=e[13],g=e[14],p=e[15],_=n*c-i*o,x=n*l-r*o,S=n*f-s*o,b=i*l-r*c,M=i*f-s*c,T=r*f-s*l,y=d*v-a*m,w=d*g-u*m,D=d*p-h*m,C=a*g-u*v,N=a*p-h*v,P=u*p-h*g,U=_*P-x*N+S*C+b*D-M*w+T*y;if(U===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const V=1/U;return e[0]=(c*P-l*N+f*C)*V,e[1]=(r*N-i*P-s*C)*V,e[2]=(v*T-g*M+p*b)*V,e[3]=(u*M-a*T-h*b)*V,e[4]=(l*D-o*P-f*w)*V,e[5]=(n*P-r*D+s*w)*V,e[6]=(g*S-m*T-p*x)*V,e[7]=(d*T-u*S+h*x)*V,e[8]=(o*N-c*D+f*y)*V,e[9]=(i*D-n*N-s*y)*V,e[10]=(m*M-v*S+p*_)*V,e[11]=(a*S-d*M-h*_)*V,e[12]=(c*w-o*C-l*y)*V,e[13]=(n*C-i*w+r*y)*V,e[14]=(v*x-m*b-g*_)*V,e[15]=(d*b-a*x+u*_)*V,this}scale(e){const n=this.elements,i=e.x,r=e.y,s=e.z;return n[0]*=i,n[4]*=r,n[8]*=s,n[1]*=i,n[5]*=r,n[9]*=s,n[2]*=i,n[6]*=r,n[10]*=s,n[3]*=i,n[7]*=r,n[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const i=Math.cos(n),r=Math.sin(n),s=1-i,o=e.x,c=e.y,l=e.z,f=s*o,d=s*c;return this.set(f*o+i,f*c-r*l,f*l+r*c,0,f*c+r*l,d*c+i,d*l-r*o,0,f*l-r*c,d*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,n,r,1,0,0,0,0,1),this}compose(e,n,i){const r=this.elements,s=n._x,o=n._y,c=n._z,l=n._w,f=s+s,d=o+o,a=c+c,u=s*f,h=s*d,m=s*a,v=o*d,g=o*a,p=c*a,_=l*f,x=l*d,S=l*a,b=i.x,M=i.y,T=i.z;return r[0]=(1-(v+p))*b,r[1]=(h+S)*b,r[2]=(m-x)*b,r[3]=0,r[4]=(h-S)*M,r[5]=(1-(u+p))*M,r[6]=(g+_)*M,r[7]=0,r[8]=(m+x)*T,r[9]=(g-_)*T,r[10]=(1-(u+v))*T,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,n,i){const r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];const s=this.determinant();if(s===0)return i.set(1,1,1),n.identity(),this;let o=xs.set(r[0],r[1],r[2]).length();const c=xs.set(r[4],r[5],r[6]).length(),l=xs.set(r[8],r[9],r[10]).length();s<0&&(o=-o),Qn.copy(this);const f=1/o,d=1/c,a=1/l;return Qn.elements[0]*=f,Qn.elements[1]*=f,Qn.elements[2]*=f,Qn.elements[4]*=d,Qn.elements[5]*=d,Qn.elements[6]*=d,Qn.elements[8]*=a,Qn.elements[9]*=a,Qn.elements[10]*=a,n.setFromRotationMatrix(Qn),i.x=o,i.y=c,i.z=l,this}makePerspective(e,n,i,r,s,o,c=Si,l=!1){const f=this.elements,d=2*s/(n-e),a=2*s/(i-r),u=(n+e)/(n-e),h=(i+r)/(i-r);let m,v;if(l)m=s/(o-s),v=o*s/(o-s);else if(c===Si)m=-(o+s)/(o-s),v=-2*o*s/(o-s);else if(c===Na)m=-o/(o-s),v=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+c);return f[0]=d,f[4]=0,f[8]=u,f[12]=0,f[1]=0,f[5]=a,f[9]=h,f[13]=0,f[2]=0,f[6]=0,f[10]=m,f[14]=v,f[3]=0,f[7]=0,f[11]=-1,f[15]=0,this}makeOrthographic(e,n,i,r,s,o,c=Si,l=!1){const f=this.elements,d=2/(n-e),a=2/(i-r),u=-(n+e)/(n-e),h=-(i+r)/(i-r);let m,v;if(l)m=1/(o-s),v=o/(o-s);else if(c===Si)m=-2/(o-s),v=-(o+s)/(o-s);else if(c===Na)m=-1/(o-s),v=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+c);return f[0]=d,f[4]=0,f[8]=0,f[12]=u,f[1]=0,f[5]=a,f[9]=0,f[13]=h,f[2]=0,f[6]=0,f[10]=m,f[14]=v,f[3]=0,f[7]=0,f[11]=0,f[15]=1,this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}}const xs=new R,Qn=new ht,ww=new R(0,0,0),Ew=new R(1,1,1),ir=new R,vl=new R,Cn=new R,zg=new ht,Vg=new Rr;class di{constructor(e=0,n=0,i=0,r=di.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,r=this._order){return this._x=e,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],c=r[8],l=r[1],f=r[5],d=r[9],a=r[2],u=r[6],h=r[10];switch(n){case"XYZ":this._y=Math.asin($e(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,h),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(u,f),this._z=0);break;case"YXZ":this._x=Math.asin(-$e(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(c,h),this._z=Math.atan2(l,f)):(this._y=Math.atan2(-a,s),this._z=0);break;case"ZXY":this._x=Math.asin($e(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-a,h),this._z=Math.atan2(-o,f)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-$e(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,h),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,f));break;case"YZX":this._z=Math.asin($e(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,f),this._y=Math.atan2(-a,s)):(this._x=0,this._y=Math.atan2(c,h));break;case"XZY":this._z=Math.asin(-$e(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,f),this._y=Math.atan2(c,s)):(this._x=Math.atan2(-d,h),this._y=0);break;default:Oe("Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return zg.makeRotationFromQuaternion(e),this.setFromRotationMatrix(zg,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return Vg.setFromEuler(this),this.setFromQuaternion(Vg,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}di.DEFAULT_ORDER="XYZ";class Wx{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Tw=0;const Hg=new R,ys=new Rr,Li=new ht,xl=new R,ko=new R,bw=new R,Aw=new Rr,Gg=new R(1,0,0),Wg=new R(0,1,0),Xg=new R(0,0,1),jg={type:"added"},Cw={type:"removed"},Ss={type:"childadded",child:null},df={type:"childremoved",child:null};class Ot extends fs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Tw++}),this.uuid=Gi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ot.DEFAULT_UP.clone();const e=new R,n=new di,i=new Rr,r=new R(1,1,1);function s(){i.setFromEuler(n,!1)}function o(){n.setFromQuaternion(i,void 0,!1)}n._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ht},normalMatrix:{value:new We}}),this.matrix=new ht,this.matrixWorld=new ht,this.matrixAutoUpdate=Ot.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ot.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Wx,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return ys.setFromAxisAngle(e,n),this.quaternion.multiply(ys),this}rotateOnWorldAxis(e,n){return ys.setFromAxisAngle(e,n),this.quaternion.premultiply(ys),this}rotateX(e){return this.rotateOnAxis(Gg,e)}rotateY(e){return this.rotateOnAxis(Wg,e)}rotateZ(e){return this.rotateOnAxis(Xg,e)}translateOnAxis(e,n){return Hg.copy(e).applyQuaternion(this.quaternion),this.position.add(Hg.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(Gg,e)}translateY(e){return this.translateOnAxis(Wg,e)}translateZ(e){return this.translateOnAxis(Xg,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Li.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?xl.copy(e):xl.set(e,n,i);const r=this.parent;this.updateWorldMatrix(!0,!1),ko.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Li.lookAt(ko,xl,this.up):Li.lookAt(xl,ko,this.up),this.quaternion.setFromRotationMatrix(Li),r&&(Li.extractRotation(r.matrixWorld),ys.setFromRotationMatrix(Li),this.quaternion.premultiply(ys.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(Qe("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(jg),Ss.child=e,this.dispatchEvent(Ss),Ss.child=null):Qe("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(Cw),df.child=e,this.dispatchEvent(df),df.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Li.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Li.multiply(e.parent.matrixWorld)),e.applyMatrix4(Li),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(jg),Ss.child=e,this.dispatchEvent(Ss),Ss.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,n);if(o!==void 0)return o}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ko,e,bw),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ko,Aw,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const n=e.x,i=e.y,r=e.z,s=this.matrix.elements;s[12]+=n-s[0]*n-s[4]*i-s[8]*r,s[13]+=i-s[1]*n-s[5]*i-s[9]*r,s[14]+=r-s[2]*n-s[6]*i-s[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].updateMatrixWorld(e)}updateWorldMatrix(e,n){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),n===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),this.static!==!1&&(r.static=this.static),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(c=>({...c,boundingBox:c.boundingBox?c.boundingBox.toJSON():void 0,boundingSphere:c.boundingSphere?c.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(c=>({...c})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(c,l){return c[l.uuid]===void 0&&(c[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const c=this.geometry.parameters;if(c!==void 0&&c.shapes!==void 0){const l=c.shapes;if(Array.isArray(l))for(let f=0,d=l.length;f<d;f++){const a=l[f];s(e.shapes,a)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const c=[];for(let l=0,f=this.material.length;l<f;l++)c.push(s(e.materials,this.material[l]));r.material=c}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let c=0;c<this.children.length;c++)r.children.push(this.children[c].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let c=0;c<this.animations.length;c++){const l=this.animations[c];r.animations.push(s(e.animations,l))}}if(n){const c=o(e.geometries),l=o(e.materials),f=o(e.textures),d=o(e.images),a=o(e.shapes),u=o(e.skeletons),h=o(e.animations),m=o(e.nodes);c.length>0&&(i.geometries=c),l.length>0&&(i.materials=l),f.length>0&&(i.textures=f),d.length>0&&(i.images=d),a.length>0&&(i.shapes=a),u.length>0&&(i.skeletons=u),h.length>0&&(i.animations=h),m.length>0&&(i.nodes=m)}return i.object=r,i;function o(c){const l=[];for(const f in c){const d=c[f];delete d.metadata,l.push(d)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),e.pivot!==null&&(this.pivot=e.pivot.clone()),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}Ot.DEFAULT_UP=new R(0,1,0);Ot.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ot.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class li extends Ot{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Rw={type:"move"};class hf{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new li,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new li,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new li,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let r=null,s=null,o=null;const c=this._targetRay,l=this._grip,f=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(f&&e.hand){o=!0;for(const v of e.hand.values()){const g=n.getJointPose(v,i),p=this._getHandJoint(f,v);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const d=f.joints["index-finger-tip"],a=f.joints["thumb-tip"],u=d.position.distanceTo(a.position),h=.02,m=.005;f.inputState.pinching&&u>h+m?(f.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!f.inputState.pinching&&u<=h-m&&(f.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=n.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));c!==null&&(r=n.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,this.dispatchEvent(Rw)))}return c!==null&&(c.visible=r!==null),l!==null&&(l.visible=s!==null),f!==null&&(f.visible=o!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const i=new li;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}}const Xx={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},rr={h:0,s:0,l:0},yl={h:0,s:0,l:0};function pf(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}class te{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=Gn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Je.colorSpaceToWorking(this,n),this}setRGB(e,n,i,r=Je.workingColorSpace){return this.r=e,this.g=n,this.b=i,Je.colorSpaceToWorking(this,r),this}setHSL(e,n,i,r=Je.workingColorSpace){if(e=Qp(e,1),n=$e(n,0,1),i=$e(i,0,1),n===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+n):i+n-i*n,o=2*i-s;this.r=pf(o,s,e+1/3),this.g=pf(o,s,e),this.b=pf(o,s,e-1/3)}return Je.colorSpaceToWorking(this,r),this}setStyle(e,n=Gn){function i(s){s!==void 0&&parseFloat(s)<1&&Oe("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],c=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(c))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,n);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(c))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,n);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(c))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,n);break;default:Oe("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,n);if(o===6)return this.setHex(parseInt(s,16),n);Oe("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=Gn){const i=Xx[e.toLowerCase()];return i!==void 0?this.setHex(i,n):Oe("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Wi(e.r),this.g=Wi(e.g),this.b=Wi(e.b),this}copyLinearToSRGB(e){return this.r=lo(e.r),this.g=lo(e.g),this.b=lo(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Gn){return Je.workingToColorSpace(sn.copy(this),e),Math.round($e(sn.r*255,0,255))*65536+Math.round($e(sn.g*255,0,255))*256+Math.round($e(sn.b*255,0,255))}getHexString(e=Gn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=Je.workingColorSpace){Je.workingToColorSpace(sn.copy(this),n);const i=sn.r,r=sn.g,s=sn.b,o=Math.max(i,r,s),c=Math.min(i,r,s);let l,f;const d=(c+o)/2;if(c===o)l=0,f=0;else{const a=o-c;switch(f=d<=.5?a/(o+c):a/(2-o-c),o){case i:l=(r-s)/a+(r<s?6:0);break;case r:l=(s-i)/a+2;break;case s:l=(i-r)/a+4;break}l/=6}return e.h=l,e.s=f,e.l=d,e}getRGB(e,n=Je.workingColorSpace){return Je.workingToColorSpace(sn.copy(this),n),e.r=sn.r,e.g=sn.g,e.b=sn.b,e}getStyle(e=Gn){Je.workingToColorSpace(sn.copy(this),e);const n=sn.r,i=sn.g,r=sn.b;return e!==Gn?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,n,i){return this.getHSL(rr),this.setHSL(rr.h+e,rr.s+n,rr.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(rr),e.getHSL(yl);const i=pa(rr.h,yl.h,n),r=pa(rr.s,yl.s,n),s=pa(rr.l,yl.l,n);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*n+s[3]*i+s[6]*r,this.g=s[1]*n+s[4]*i+s[7]*r,this.b=s[2]*n+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const sn=new te;te.NAMES=Xx;class jx{constructor(e,n=25e-5){this.isFogExp2=!0,this.name="",this.color=new te(e),this.density=n}clone(){return new jx(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Pw extends Ot{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new di,this.environmentIntensity=1,this.environmentRotation=new di,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(n.object.environmentIntensity=this.environmentIntensity),n.object.environmentRotation=this.environmentRotation.toArray(),n}}const Jn=new R,Di=new R,mf=new R,Ii=new R,Ms=new R,ws=new R,$g=new R,gf=new R,_f=new R,vf=new R,xf=new Lt,yf=new Lt,Sf=new Lt;class In{constructor(e=new R,n=new R,i=new R){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,r){r.subVectors(i,n),Jn.subVectors(e,n),r.cross(Jn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,n,i,r,s){Jn.subVectors(r,n),Di.subVectors(i,n),mf.subVectors(e,n);const o=Jn.dot(Jn),c=Jn.dot(Di),l=Jn.dot(mf),f=Di.dot(Di),d=Di.dot(mf),a=o*f-c*c;if(a===0)return s.set(0,0,0),null;const u=1/a,h=(f*l-c*d)*u,m=(o*d-c*l)*u;return s.set(1-h-m,m,h)}static containsPoint(e,n,i,r){return this.getBarycoord(e,n,i,r,Ii)===null?!1:Ii.x>=0&&Ii.y>=0&&Ii.x+Ii.y<=1}static getInterpolation(e,n,i,r,s,o,c,l){return this.getBarycoord(e,n,i,r,Ii)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Ii.x),l.addScaledVector(o,Ii.y),l.addScaledVector(c,Ii.z),l)}static getInterpolatedAttribute(e,n,i,r,s,o){return xf.setScalar(0),yf.setScalar(0),Sf.setScalar(0),xf.fromBufferAttribute(e,n),yf.fromBufferAttribute(e,i),Sf.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(xf,s.x),o.addScaledVector(yf,s.y),o.addScaledVector(Sf,s.z),o}static isFrontFacing(e,n,i,r){return Jn.subVectors(i,n),Di.subVectors(e,n),Jn.cross(Di).dot(r)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,r){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,n,i,r){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Jn.subVectors(this.c,this.b),Di.subVectors(this.a,this.b),Jn.cross(Di).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return In.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return In.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,r,s){return In.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}containsPoint(e){return In.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return In.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const i=this.a,r=this.b,s=this.c;let o,c;Ms.subVectors(r,i),ws.subVectors(s,i),gf.subVectors(e,i);const l=Ms.dot(gf),f=ws.dot(gf);if(l<=0&&f<=0)return n.copy(i);_f.subVectors(e,r);const d=Ms.dot(_f),a=ws.dot(_f);if(d>=0&&a<=d)return n.copy(r);const u=l*a-d*f;if(u<=0&&l>=0&&d<=0)return o=l/(l-d),n.copy(i).addScaledVector(Ms,o);vf.subVectors(e,s);const h=Ms.dot(vf),m=ws.dot(vf);if(m>=0&&h<=m)return n.copy(s);const v=h*f-l*m;if(v<=0&&f>=0&&m<=0)return c=f/(f-m),n.copy(i).addScaledVector(ws,c);const g=d*m-h*a;if(g<=0&&a-d>=0&&h-m>=0)return $g.subVectors(s,r),c=(a-d)/(a-d+(h-m)),n.copy(r).addScaledVector($g,c);const p=1/(g+v+u);return o=v*p,c=u*p,n.copy(i).addScaledVector(Ms,o).addScaledVector(ws,c)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class ds{constructor(e=new R(1/0,1/0,1/0),n=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(ei.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(ei.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const i=ei.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(n===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,c=s.count;o<c;o++)e.isMesh===!0?e.getVertexPosition(o,ei):ei.fromBufferAttribute(s,o),ei.applyMatrix4(e.matrixWorld),this.expandByPoint(ei);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Sl.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Sl.copy(i.boundingBox)),Sl.applyMatrix4(e.matrixWorld),this.union(Sl)}const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ei),ei.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Bo),Ml.subVectors(this.max,Bo),Es.subVectors(e.a,Bo),Ts.subVectors(e.b,Bo),bs.subVectors(e.c,Bo),sr.subVectors(Ts,Es),or.subVectors(bs,Ts),Or.subVectors(Es,bs);let n=[0,-sr.z,sr.y,0,-or.z,or.y,0,-Or.z,Or.y,sr.z,0,-sr.x,or.z,0,-or.x,Or.z,0,-Or.x,-sr.y,sr.x,0,-or.y,or.x,0,-Or.y,Or.x,0];return!Mf(n,Es,Ts,bs,Ml)||(n=[1,0,0,0,1,0,0,0,1],!Mf(n,Es,Ts,bs,Ml))?!1:(wl.crossVectors(sr,or),n=[wl.x,wl.y,wl.z],Mf(n,Es,Ts,bs,Ml))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ei).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ei).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Ni[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Ni[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Ni[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Ni[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Ni[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Ni[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Ni[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Ni[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Ni),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Ni=[new R,new R,new R,new R,new R,new R,new R,new R],ei=new R,Sl=new ds,Es=new R,Ts=new R,bs=new R,sr=new R,or=new R,Or=new R,Bo=new R,Ml=new R,wl=new R,kr=new R;function Mf(t,e,n,i,r){for(let s=0,o=t.length-3;s<=o;s+=3){kr.fromArray(t,s);const c=r.x*Math.abs(kr.x)+r.y*Math.abs(kr.y)+r.z*Math.abs(kr.z),l=e.dot(kr),f=n.dot(kr),d=i.dot(kr);if(Math.max(-Math.max(l,f,d),Math.min(l,f,d))>c)return!1}return!0}const Ut=new R,El=new _e;let Lw=0;class He{constructor(e,n,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Lw++}),this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=Oh,this.updateRanges=[],this.gpuType=oi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=n.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)El.fromBufferAttribute(this,n),El.applyMatrix3(e),this.setXY(n,El.x,El.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)Ut.fromBufferAttribute(this,n),Ut.applyMatrix3(e),this.setXYZ(n,Ut.x,Ut.y,Ut.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)Ut.fromBufferAttribute(this,n),Ut.applyMatrix4(e),this.setXYZ(n,Ut.x,Ut.y,Ut.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)Ut.fromBufferAttribute(this,n),Ut.applyNormalMatrix(e),this.setXYZ(n,Ut.x,Ut.y,Ut.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)Ut.fromBufferAttribute(this,n),Ut.transformDirection(e),this.setXYZ(n,Ut.x,Ut.y,Ut.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=si(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=ft(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=si(n,this.array)),n}setX(e,n){return this.normalized&&(n=ft(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=si(n,this.array)),n}setY(e,n){return this.normalized&&(n=ft(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=si(n,this.array)),n}setZ(e,n){return this.normalized&&(n=ft(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=si(n,this.array)),n}setW(e,n){return this.normalized&&(n=ft(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=ft(n,this.array),i=ft(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,r){return e*=this.itemSize,this.normalized&&(n=ft(n,this.array),i=ft(i,this.array),r=ft(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e*=this.itemSize,this.normalized&&(n=ft(n,this.array),i=ft(i,this.array),r=ft(r,this.array),s=ft(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Oh&&(e.usage=this.usage),e}}class $x extends He{constructor(e,n,i){super(new Uint16Array(e),n,i)}}class Yx extends He{constructor(e,n,i){super(new Uint32Array(e),n,i)}}class it extends He{constructor(e,n,i){super(new Float32Array(e),n,i)}}const Dw=new ds,zo=new R,wf=new R;class hs{constructor(e=new R,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const i=this.center;n!==void 0?i.copy(n):Dw.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;zo.subVectors(e,this.center);const n=zo.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector(zo,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(wf.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(zo.copy(e.center).add(wf)),this.expandByPoint(zo.copy(e.center).sub(wf))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let Iw=0;const zn=new ht,Ef=new Ot,As=new R,Rn=new ds,Vo=new ds,Wt=new R;class Ve extends fs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Iw++}),this.uuid=Gi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(K1(e)?Yx:$x)(e,1):this.index=e,this}setIndirect(e,n=0){return this.indirect=e,this.indirectOffset=n,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new We().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return zn.makeRotationFromQuaternion(e),this.applyMatrix4(zn),this}rotateX(e){return zn.makeRotationX(e),this.applyMatrix4(zn),this}rotateY(e){return zn.makeRotationY(e),this.applyMatrix4(zn),this}rotateZ(e){return zn.makeRotationZ(e),this.applyMatrix4(zn),this}translate(e,n,i){return zn.makeTranslation(e,n,i),this.applyMatrix4(zn),this}scale(e,n,i){return zn.makeScale(e,n,i),this.applyMatrix4(zn),this}lookAt(e){return Ef.lookAt(e),Ef.updateMatrix(),this.applyMatrix4(Ef.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(As).negate(),this.translate(As.x,As.y,As.z),this}setFromPoints(e){const n=this.getAttribute("position");if(n===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const o=e[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new it(i,3))}else{const i=Math.min(e.length,n.count);for(let r=0;r<i;r++){const s=e[r];n.setXYZ(r,s.x,s.y,s.z||0)}e.length>n.count&&Oe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ds);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Qe("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,r=n.length;i<r;i++){const s=n[i];Rn.setFromBufferAttribute(s),this.morphTargetsRelative?(Wt.addVectors(this.boundingBox.min,Rn.min),this.boundingBox.expandByPoint(Wt),Wt.addVectors(this.boundingBox.max,Rn.max),this.boundingBox.expandByPoint(Wt)):(this.boundingBox.expandByPoint(Rn.min),this.boundingBox.expandByPoint(Rn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Qe('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new hs);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Qe("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new R,1/0);return}if(e){const i=this.boundingSphere.center;if(Rn.setFromBufferAttribute(e),n)for(let s=0,o=n.length;s<o;s++){const c=n[s];Vo.setFromBufferAttribute(c),this.morphTargetsRelative?(Wt.addVectors(Rn.min,Vo.min),Rn.expandByPoint(Wt),Wt.addVectors(Rn.max,Vo.max),Rn.expandByPoint(Wt)):(Rn.expandByPoint(Vo.min),Rn.expandByPoint(Vo.max))}Rn.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)Wt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Wt));if(n)for(let s=0,o=n.length;s<o;s++){const c=n[s],l=this.morphTargetsRelative;for(let f=0,d=c.count;f<d;f++)Wt.fromBufferAttribute(c,f),l&&(As.fromBufferAttribute(e,f),Wt.add(As)),r=Math.max(r,i.distanceToSquared(Wt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&Qe('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){Qe("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=n.position,r=n.normal,s=n.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new He(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),c=[],l=[];for(let y=0;y<i.count;y++)c[y]=new R,l[y]=new R;const f=new R,d=new R,a=new R,u=new _e,h=new _e,m=new _e,v=new R,g=new R;function p(y,w,D){f.fromBufferAttribute(i,y),d.fromBufferAttribute(i,w),a.fromBufferAttribute(i,D),u.fromBufferAttribute(s,y),h.fromBufferAttribute(s,w),m.fromBufferAttribute(s,D),d.sub(f),a.sub(f),h.sub(u),m.sub(u);const C=1/(h.x*m.y-m.x*h.y);isFinite(C)&&(v.copy(d).multiplyScalar(m.y).addScaledVector(a,-h.y).multiplyScalar(C),g.copy(a).multiplyScalar(h.x).addScaledVector(d,-m.x).multiplyScalar(C),c[y].add(v),c[w].add(v),c[D].add(v),l[y].add(g),l[w].add(g),l[D].add(g))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let y=0,w=_.length;y<w;++y){const D=_[y],C=D.start,N=D.count;for(let P=C,U=C+N;P<U;P+=3)p(e.getX(P+0),e.getX(P+1),e.getX(P+2))}const x=new R,S=new R,b=new R,M=new R;function T(y){b.fromBufferAttribute(r,y),M.copy(b);const w=c[y];x.copy(w),x.sub(b.multiplyScalar(b.dot(w))).normalize(),S.crossVectors(M,w);const C=S.dot(l[y])<0?-1:1;o.setXYZW(y,x.x,x.y,x.z,C)}for(let y=0,w=_.length;y<w;++y){const D=_[y],C=D.start,N=D.count;for(let P=C,U=C+N;P<U;P+=3)T(e.getX(P+0)),T(e.getX(P+1)),T(e.getX(P+2))}}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new He(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let u=0,h=i.count;u<h;u++)i.setXYZ(u,0,0,0);const r=new R,s=new R,o=new R,c=new R,l=new R,f=new R,d=new R,a=new R;if(e)for(let u=0,h=e.count;u<h;u+=3){const m=e.getX(u+0),v=e.getX(u+1),g=e.getX(u+2);r.fromBufferAttribute(n,m),s.fromBufferAttribute(n,v),o.fromBufferAttribute(n,g),d.subVectors(o,s),a.subVectors(r,s),d.cross(a),c.fromBufferAttribute(i,m),l.fromBufferAttribute(i,v),f.fromBufferAttribute(i,g),c.add(d),l.add(d),f.add(d),i.setXYZ(m,c.x,c.y,c.z),i.setXYZ(v,l.x,l.y,l.z),i.setXYZ(g,f.x,f.y,f.z)}else for(let u=0,h=n.count;u<h;u+=3)r.fromBufferAttribute(n,u+0),s.fromBufferAttribute(n,u+1),o.fromBufferAttribute(n,u+2),d.subVectors(o,s),a.subVectors(r,s),d.cross(a),i.setXYZ(u+0,d.x,d.y,d.z),i.setXYZ(u+1,d.x,d.y,d.z),i.setXYZ(u+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)Wt.fromBufferAttribute(e,n),Wt.normalize(),e.setXYZ(n,Wt.x,Wt.y,Wt.z)}toNonIndexed(){function e(c,l){const f=c.array,d=c.itemSize,a=c.normalized,u=new f.constructor(l.length*d);let h=0,m=0;for(let v=0,g=l.length;v<g;v++){c.isInterleavedBufferAttribute?h=l[v]*c.data.stride+c.offset:h=l[v]*d;for(let p=0;p<d;p++)u[m++]=f[h++]}return new He(u,d,a)}if(this.index===null)return Oe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new Ve,i=this.index.array,r=this.attributes;for(const c in r){const l=r[c],f=e(l,i);n.setAttribute(c,f)}const s=this.morphAttributes;for(const c in s){const l=[],f=s[c];for(let d=0,a=f.length;d<a;d++){const u=f[d],h=e(u,i);l.push(h)}n.morphAttributes[c]=l}n.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let c=0,l=o.length;c<l;c++){const f=o[c];n.addGroup(f.start,f.count,f.materialIndex)}return n}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const f in l)l[f]!==void 0&&(e[f]=l[f]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const l in i){const f=i[l];e.data.attributes[l]=f.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const f=this.morphAttributes[l],d=[];for(let a=0,u=f.length;a<u;a++){const h=f[a];d.push(h.toJSON(e.data))}d.length>0&&(r[l]=d,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const c=this.boundingSphere;return c!==null&&(e.data.boundingSphere=c.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const r=e.attributes;for(const f in r){const d=r[f];this.setAttribute(f,d.clone(n))}const s=e.morphAttributes;for(const f in s){const d=[],a=s[f];for(let u=0,h=a.length;u<h;u++)d.push(a[u].clone(n));this.morphAttributes[f]=d}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let f=0,d=o.length;f<d;f++){const a=o[f];this.addGroup(a.start,a.count,a.materialIndex)}const c=e.boundingBox;c!==null&&(this.boundingBox=c.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Nw{constructor(e,n){this.isInterleavedBuffer=!0,this.array=e,this.stride=n,this.count=e!==void 0?e.length/n:0,this.usage=Oh,this.updateRanges=[],this.version=0,this.uuid=Gi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,n,i){e*=this.stride,i*=n.stride;for(let r=0,s=this.stride;r<s;r++)this.array[e+r]=n.array[i+r];return this}set(e,n=0){return this.array.set(e,n),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Gi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const n=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(n,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Gi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const un=new R;class Jc{constructor(e,n,i,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=n,this.offset=i,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let n=0,i=this.data.count;n<i;n++)un.fromBufferAttribute(this,n),un.applyMatrix4(e),this.setXYZ(n,un.x,un.y,un.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)un.fromBufferAttribute(this,n),un.applyNormalMatrix(e),this.setXYZ(n,un.x,un.y,un.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)un.fromBufferAttribute(this,n),un.transformDirection(e),this.setXYZ(n,un.x,un.y,un.z);return this}getComponent(e,n){let i=this.array[e*this.data.stride+this.offset+n];return this.normalized&&(i=si(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=ft(i,this.array)),this.data.array[e*this.data.stride+this.offset+n]=i,this}setX(e,n){return this.normalized&&(n=ft(n,this.array)),this.data.array[e*this.data.stride+this.offset]=n,this}setY(e,n){return this.normalized&&(n=ft(n,this.array)),this.data.array[e*this.data.stride+this.offset+1]=n,this}setZ(e,n){return this.normalized&&(n=ft(n,this.array)),this.data.array[e*this.data.stride+this.offset+2]=n,this}setW(e,n){return this.normalized&&(n=ft(n,this.array)),this.data.array[e*this.data.stride+this.offset+3]=n,this}getX(e){let n=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(n=si(n,this.array)),n}getY(e){let n=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(n=si(n,this.array)),n}getZ(e){let n=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(n=si(n,this.array)),n}getW(e){let n=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(n=si(n,this.array)),n}setXY(e,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(n=ft(n,this.array),i=ft(i,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=i,this}setXYZ(e,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(n=ft(n,this.array),i=ft(i,this.array),r=ft(r,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=i,this.data.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e=e*this.data.stride+this.offset,this.normalized&&(n=ft(n,this.array),i=ft(i,this.array),r=ft(r,this.array),s=ft(s,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=i,this.data.array[e+2]=r,this.data.array[e+3]=s,this}clone(e){if(e===void 0){Zc("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const n=[];for(let i=0;i<this.count;i++){const r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)n.push(this.data.array[r+s])}return new He(new this.array.constructor(n),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Jc(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Zc("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const n=[];for(let i=0;i<this.count;i++){const r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)n.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:n,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}let Uw=0;class Qi extends fs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Uw++}),this.uuid=Gi(),this.name="",this.type="Material",this.blending=oo,this.side=Cr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Yd,this.blendDst=qd,this.blendEquation=$r,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new te(0,0,0),this.blendAlpha=0,this.depthFunc=_o,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ig,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=_s,this.stencilZFail=_s,this.stencilZPass=_s,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const i=e[n];if(i===void 0){Oe(`Material: parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){Oe(`Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==oo&&(i.blending=this.blending),this.side!==Cr&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Yd&&(i.blendSrc=this.blendSrc),this.blendDst!==qd&&(i.blendDst=this.blendDst),this.blendEquation!==$r&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==_o&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ig&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==_s&&(i.stencilFail=this.stencilFail),this.stencilZFail!==_s&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==_s&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const c in s){const l=s[c];delete l.metadata,o.push(l)}return o}if(n){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let i=null;if(n!==null){const r=n.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=n[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Mu extends Qi{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new te(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Cs;const Ho=new R,Rs=new R,Ps=new R,Ls=new _e,Go=new _e,qx=new ht,Tl=new R,Wo=new R,bl=new R,Yg=new _e,Tf=new _e,qg=new _e;class em extends Ot{constructor(e=new Mu){if(super(),this.isSprite=!0,this.type="Sprite",Cs===void 0){Cs=new Ve;const n=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new Nw(n,5);Cs.setIndex([0,1,2,0,2,3]),Cs.setAttribute("position",new Jc(i,3,0,!1)),Cs.setAttribute("uv",new Jc(i,2,3,!1))}this.geometry=Cs,this.material=e,this.center=new _e(.5,.5),this.count=1}raycast(e,n){e.camera===null&&Qe('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Rs.setFromMatrixScale(this.matrixWorld),qx.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Ps.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Rs.multiplyScalar(-Ps.z);const i=this.material.rotation;let r,s;i!==0&&(s=Math.cos(i),r=Math.sin(i));const o=this.center;Al(Tl.set(-.5,-.5,0),Ps,o,Rs,r,s),Al(Wo.set(.5,-.5,0),Ps,o,Rs,r,s),Al(bl.set(.5,.5,0),Ps,o,Rs,r,s),Yg.set(0,0),Tf.set(1,0),qg.set(1,1);let c=e.ray.intersectTriangle(Tl,Wo,bl,!1,Ho);if(c===null&&(Al(Wo.set(-.5,.5,0),Ps,o,Rs,r,s),Tf.set(0,1),c=e.ray.intersectTriangle(Tl,bl,Wo,!1,Ho),c===null))return;const l=e.ray.origin.distanceTo(Ho);l<e.near||l>e.far||n.push({distance:l,point:Ho.clone(),uv:In.getInterpolation(Ho,Tl,Wo,bl,Yg,Tf,qg,new _e),face:null,object:this})}copy(e,n){return super.copy(e,n),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Al(t,e,n,i,r,s){Ls.subVectors(t,n).addScalar(.5).multiply(i),r!==void 0?(Go.x=s*Ls.x-r*Ls.y,Go.y=r*Ls.x+s*Ls.y):Go.copy(Ls),t.copy(e),t.x+=Go.x,t.y+=Go.y,t.applyMatrix4(qx)}const Ui=new R,bf=new R,Cl=new R,ar=new R,Af=new R,Rl=new R,Cf=new R;class wu{constructor(e=new R,n=new R(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ui)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=Ui.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(Ui.copy(this.origin).addScaledVector(this.direction,n),Ui.distanceToSquared(e))}distanceSqToSegment(e,n,i,r){bf.copy(e).add(n).multiplyScalar(.5),Cl.copy(n).sub(e).normalize(),ar.copy(this.origin).sub(bf);const s=e.distanceTo(n)*.5,o=-this.direction.dot(Cl),c=ar.dot(this.direction),l=-ar.dot(Cl),f=ar.lengthSq(),d=Math.abs(1-o*o);let a,u,h,m;if(d>0)if(a=o*l-c,u=o*c-l,m=s*d,a>=0)if(u>=-m)if(u<=m){const v=1/d;a*=v,u*=v,h=a*(a+o*u+2*c)+u*(o*a+u+2*l)+f}else u=s,a=Math.max(0,-(o*u+c)),h=-a*a+u*(u+2*l)+f;else u=-s,a=Math.max(0,-(o*u+c)),h=-a*a+u*(u+2*l)+f;else u<=-m?(a=Math.max(0,-(-o*s+c)),u=a>0?-s:Math.min(Math.max(-s,-l),s),h=-a*a+u*(u+2*l)+f):u<=m?(a=0,u=Math.min(Math.max(-s,-l),s),h=u*(u+2*l)+f):(a=Math.max(0,-(o*s+c)),u=a>0?s:Math.min(Math.max(-s,-l),s),h=-a*a+u*(u+2*l)+f);else u=o>0?-s:s,a=Math.max(0,-(o*u+c)),h=-a*a+u*(u+2*l)+f;return i&&i.copy(this.origin).addScaledVector(this.direction,a),r&&r.copy(bf).addScaledVector(Cl,u),h}intersectSphere(e,n){Ui.subVectors(e.center,this.origin);const i=Ui.dot(this.direction),r=Ui.dot(Ui)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),c=i-o,l=i+o;return l<0?null:c<0?this.at(l,n):this.at(c,n)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){const i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,r,s,o,c,l;const f=1/this.direction.x,d=1/this.direction.y,a=1/this.direction.z,u=this.origin;return f>=0?(i=(e.min.x-u.x)*f,r=(e.max.x-u.x)*f):(i=(e.max.x-u.x)*f,r=(e.min.x-u.x)*f),d>=0?(s=(e.min.y-u.y)*d,o=(e.max.y-u.y)*d):(s=(e.max.y-u.y)*d,o=(e.min.y-u.y)*d),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),a>=0?(c=(e.min.z-u.z)*a,l=(e.max.z-u.z)*a):(c=(e.max.z-u.z)*a,l=(e.min.z-u.z)*a),i>l||c>r)||((c>i||i!==i)&&(i=c),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(e){return this.intersectBox(e,Ui)!==null}intersectTriangle(e,n,i,r,s){Af.subVectors(n,e),Rl.subVectors(i,e),Cf.crossVectors(Af,Rl);let o=this.direction.dot(Cf),c;if(o>0){if(r)return null;c=1}else if(o<0)c=-1,o=-o;else return null;ar.subVectors(this.origin,e);const l=c*this.direction.dot(Rl.crossVectors(ar,Rl));if(l<0)return null;const f=c*this.direction.dot(Af.cross(ar));if(f<0||l+f>o)return null;const d=-c*ar.dot(Cf);return d<0?null:this.at(d/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class So extends Qi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new te(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new di,this.combine=Vp,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Kg=new ht,Br=new wu,Pl=new hs,Zg=new R,Ll=new R,Dl=new R,Il=new R,Rf=new R,Nl=new R,Qg=new R,Ul=new R;class mn extends Ot{constructor(e=new Ve,n=new So){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const c=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[c]=s}}}}getVertexPosition(e,n){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;n.fromBufferAttribute(r,e);const c=this.morphTargetInfluences;if(s&&c){Nl.set(0,0,0);for(let l=0,f=s.length;l<f;l++){const d=c[l],a=s[l];d!==0&&(Rf.fromBufferAttribute(a,e),o?Nl.addScaledVector(Rf,d):Nl.addScaledVector(Rf.sub(n),d))}n.add(Nl)}return n}raycast(e,n){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Pl.copy(i.boundingSphere),Pl.applyMatrix4(s),Br.copy(e.ray).recast(e.near),!(Pl.containsPoint(Br.origin)===!1&&(Br.intersectSphere(Pl,Zg)===null||Br.origin.distanceToSquared(Zg)>(e.far-e.near)**2))&&(Kg.copy(s).invert(),Br.copy(e.ray).applyMatrix4(Kg),!(i.boundingBox!==null&&Br.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,Br)))}_computeIntersections(e,n,i){let r;const s=this.geometry,o=this.material,c=s.index,l=s.attributes.position,f=s.attributes.uv,d=s.attributes.uv1,a=s.attributes.normal,u=s.groups,h=s.drawRange;if(c!==null)if(Array.isArray(o))for(let m=0,v=u.length;m<v;m++){const g=u[m],p=o[g.materialIndex],_=Math.max(g.start,h.start),x=Math.min(c.count,Math.min(g.start+g.count,h.start+h.count));for(let S=_,b=x;S<b;S+=3){const M=c.getX(S),T=c.getX(S+1),y=c.getX(S+2);r=Fl(this,p,e,i,f,d,a,M,T,y),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=g.materialIndex,n.push(r))}}else{const m=Math.max(0,h.start),v=Math.min(c.count,h.start+h.count);for(let g=m,p=v;g<p;g+=3){const _=c.getX(g),x=c.getX(g+1),S=c.getX(g+2);r=Fl(this,o,e,i,f,d,a,_,x,S),r&&(r.faceIndex=Math.floor(g/3),n.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let m=0,v=u.length;m<v;m++){const g=u[m],p=o[g.materialIndex],_=Math.max(g.start,h.start),x=Math.min(l.count,Math.min(g.start+g.count,h.start+h.count));for(let S=_,b=x;S<b;S+=3){const M=S,T=S+1,y=S+2;r=Fl(this,p,e,i,f,d,a,M,T,y),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=g.materialIndex,n.push(r))}}else{const m=Math.max(0,h.start),v=Math.min(l.count,h.start+h.count);for(let g=m,p=v;g<p;g+=3){const _=g,x=g+1,S=g+2;r=Fl(this,o,e,i,f,d,a,_,x,S),r&&(r.faceIndex=Math.floor(g/3),n.push(r))}}}}function Fw(t,e,n,i,r,s,o,c){let l;if(e.side===En?l=i.intersectTriangle(o,s,r,!0,c):l=i.intersectTriangle(r,s,o,e.side===Cr,c),l===null)return null;Ul.copy(c),Ul.applyMatrix4(t.matrixWorld);const f=n.ray.origin.distanceTo(Ul);return f<n.near||f>n.far?null:{distance:f,point:Ul.clone(),object:t}}function Fl(t,e,n,i,r,s,o,c,l,f){t.getVertexPosition(c,Ll),t.getVertexPosition(l,Dl),t.getVertexPosition(f,Il);const d=Fw(t,e,n,i,Ll,Dl,Il,Qg);if(d){const a=new R;In.getBarycoord(Qg,Ll,Dl,Il,a),r&&(d.uv=In.getInterpolatedAttribute(r,c,l,f,a,new _e)),s&&(d.uv1=In.getInterpolatedAttribute(s,c,l,f,a,new _e)),o&&(d.normal=In.getInterpolatedAttribute(o,c,l,f,a,new R),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const u={a:c,b:l,c:f,normal:new R,materialIndex:0};In.getNormal(Ll,Dl,Il,u.normal),d.face=u,d.barycoord=a}return d}class Kx extends ln{constructor(e=null,n=1,i=1,r,s,o,c,l,f=Kt,d=Kt,a,u){super(null,o,c,l,f,d,r,s,a,u),this.isDataTexture=!0,this.image={data:e,width:n,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Jg extends He{constructor(e,n,i,r=1){super(e,n,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Ds=new ht,e0=new ht,Ol=[],t0=new ds,Ow=new ht,Xo=new mn,jo=new hs;class vP extends mn{constructor(e,n,i){super(e,n),this.isInstancedMesh=!0,this.instanceMatrix=new Jg(new Float32Array(i*16),16),this.previousInstanceMatrix=null,this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<i;r++)this.setMatrixAt(r,Ow)}computeBoundingBox(){const e=this.geometry,n=this.count;this.boundingBox===null&&(this.boundingBox=new ds),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<n;i++)this.getMatrixAt(i,Ds),t0.copy(e.boundingBox).applyMatrix4(Ds),this.boundingBox.union(t0)}computeBoundingSphere(){const e=this.geometry,n=this.count;this.boundingSphere===null&&(this.boundingSphere=new hs),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<n;i++)this.getMatrixAt(i,Ds),jo.copy(e.boundingSphere).applyMatrix4(Ds),this.boundingSphere.union(jo)}copy(e,n){return super.copy(e,n),this.instanceMatrix.copy(e.instanceMatrix),e.previousInstanceMatrix!==null&&(this.previousInstanceMatrix=e.previousInstanceMatrix.clone()),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,n){n.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,n){n.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,n){const i=n.morphTargetInfluences,r=this.morphTexture.source.data.data,s=i.length+1,o=e*s+1;for(let c=0;c<i.length;c++)i[c]=r[o+c]}raycast(e,n){const i=this.matrixWorld,r=this.count;if(Xo.geometry=this.geometry,Xo.material=this.material,Xo.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),jo.copy(this.boundingSphere),jo.applyMatrix4(i),e.ray.intersectsSphere(jo)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,Ds),e0.multiplyMatrices(i,Ds),Xo.matrixWorld=e0,Xo.raycast(e,Ol);for(let o=0,c=Ol.length;o<c;o++){const l=Ol[o];l.instanceId=s,l.object=this,n.push(l)}Ol.length=0}}setColorAt(e,n){this.instanceColor===null&&(this.instanceColor=new Jg(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),n.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,n){n.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,n){const i=n.morphTargetInfluences,r=i.length+1;this.morphTexture===null&&(this.morphTexture=new Kx(new Float32Array(r*this.count),r,this.count,Xp,oi));const s=this.morphTexture.source.data.data;let o=0;for(let f=0;f<i.length;f++)o+=i[f];const c=this.geometry.morphTargetsRelative?1:1-o,l=r*e;s[l]=c,s.set(i,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Pf=new R,kw=new R,Bw=new We;class fr{constructor(e=new R(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,r){return this.normal.set(e,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){const r=Pf.subVectors(i,n).cross(kw.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n){const i=e.delta(Pf),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:n.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const i=n||Bw.getNormalMatrix(e),r=this.coplanarPoint(Pf).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const zr=new hs,zw=new _e(.5,.5),kl=new R;class tm{constructor(e=new fr,n=new fr,i=new fr,r=new fr,s=new fr,o=new fr){this.planes=[e,n,i,r,s,o]}set(e,n,i,r,s,o){const c=this.planes;return c[0].copy(e),c[1].copy(n),c[2].copy(i),c[3].copy(r),c[4].copy(s),c[5].copy(o),this}copy(e){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=Si,i=!1){const r=this.planes,s=e.elements,o=s[0],c=s[1],l=s[2],f=s[3],d=s[4],a=s[5],u=s[6],h=s[7],m=s[8],v=s[9],g=s[10],p=s[11],_=s[12],x=s[13],S=s[14],b=s[15];if(r[0].setComponents(f-o,h-d,p-m,b-_).normalize(),r[1].setComponents(f+o,h+d,p+m,b+_).normalize(),r[2].setComponents(f+c,h+a,p+v,b+x).normalize(),r[3].setComponents(f-c,h-a,p-v,b-x).normalize(),i)r[4].setComponents(l,u,g,S).normalize(),r[5].setComponents(f-l,h-u,p-g,b-S).normalize();else if(r[4].setComponents(f-l,h-u,p-g,b-S).normalize(),n===Si)r[5].setComponents(f+l,h+u,p+g,b+S).normalize();else if(n===Na)r[5].setComponents(l,u,g,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),zr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),zr.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(zr)}intersectsSprite(e){zr.center.set(0,0,0);const n=zw.distanceTo(e.center);return zr.radius=.7071067811865476+n,zr.applyMatrix4(e.matrixWorld),this.intersectsSphere(zr)}intersectsSphere(e){const n=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(n[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const n=this.planes;for(let i=0;i<6;i++){const r=n[i];if(kl.x=r.normal.x>0?e.max.x:e.min.x,kl.y=r.normal.y>0?e.max.y:e.min.y,kl.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(kl)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class pn extends Qi{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new te(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const eu=new R,tu=new R,n0=new ht,$o=new wu,Bl=new hs,Lf=new R,i0=new R;class Qt extends Ot{constructor(e=new Ve,n=new pn){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[0];for(let r=1,s=n.count;r<s;r++)eu.fromBufferAttribute(n,r-1),tu.fromBufferAttribute(n,r),i[r]=i[r-1],i[r]+=eu.distanceTo(tu);e.setAttribute("lineDistance",new it(i,1))}else Oe("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,n){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Bl.copy(i.boundingSphere),Bl.applyMatrix4(r),Bl.radius+=s,e.ray.intersectsSphere(Bl)===!1)return;n0.copy(r).invert(),$o.copy(e.ray).applyMatrix4(n0);const c=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=c*c,f=this.isLineSegments?2:1,d=i.index,u=i.attributes.position;if(d!==null){const h=Math.max(0,o.start),m=Math.min(d.count,o.start+o.count);for(let v=h,g=m-1;v<g;v+=f){const p=d.getX(v),_=d.getX(v+1),x=zl(this,e,$o,l,p,_,v);x&&n.push(x)}if(this.isLineLoop){const v=d.getX(m-1),g=d.getX(h),p=zl(this,e,$o,l,v,g,m-1);p&&n.push(p)}}else{const h=Math.max(0,o.start),m=Math.min(u.count,o.start+o.count);for(let v=h,g=m-1;v<g;v+=f){const p=zl(this,e,$o,l,v,v+1,v);p&&n.push(p)}if(this.isLineLoop){const v=zl(this,e,$o,l,m-1,h,m-1);v&&n.push(v)}}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const c=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[c]=s}}}}}function zl(t,e,n,i,r,s,o){const c=t.geometry.attributes.position;if(eu.fromBufferAttribute(c,r),tu.fromBufferAttribute(c,s),n.distanceSqToSegment(eu,tu,Lf,i0)>i)return;Lf.applyMatrix4(t.matrixWorld);const f=e.ray.origin.distanceTo(Lf);if(!(f<e.near||f>e.far))return{distance:f,point:i0.clone().applyMatrix4(t.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:t}}const r0=new R,s0=new R;class nu extends Qt{constructor(e,n){super(e,n),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[];for(let r=0,s=n.count;r<s;r+=2)r0.fromBufferAttribute(n,r),s0.fromBufferAttribute(n,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+r0.distanceTo(s0);e.setAttribute("lineDistance",new it(i,1))}else Oe("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Ga extends Qi{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new te(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const o0=new ht,kh=new wu,Vl=new hs,Hl=new R;class ls extends Ot{constructor(e=new Ve,n=new Ga){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,n){const i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Vl.copy(i.boundingSphere),Vl.applyMatrix4(r),Vl.radius+=s,e.ray.intersectsSphere(Vl)===!1)return;o0.copy(r).invert(),kh.copy(e.ray).applyMatrix4(o0);const c=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=c*c,f=i.index,a=i.attributes.position;if(f!==null){const u=Math.max(0,o.start),h=Math.min(f.count,o.start+o.count);for(let m=u,v=h;m<v;m++){const g=f.getX(m);Hl.fromBufferAttribute(a,g),a0(Hl,g,l,r,e,n,this)}}else{const u=Math.max(0,o.start),h=Math.min(a.count,o.start+o.count);for(let m=u,v=h;m<v;m++)Hl.fromBufferAttribute(a,m),a0(Hl,m,l,r,e,n,this)}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const c=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[c]=s}}}}}function a0(t,e,n,i,r,s,o){const c=kh.distanceSqToPoint(t);if(c<n){const l=new R;kh.closestPointToPoint(t,l),l.applyMatrix4(i);const f=r.ray.origin.distanceTo(l);if(f<r.near||f>r.far)return;s.push({distance:f,distanceToRay:Math.sqrt(c),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}class Zx extends ln{constructor(e=[],n=as,i,r,s,o,c,l,f,d){super(e,n,i,r,s,o,c,l,f,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Ir extends ln{constructor(e,n,i,r,s,o,c,l,f){super(e,n,i,r,s,o,c,l,f),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Fa extends ln{constructor(e,n,i=Ai,r,s,o,c=Kt,l=Kt,f,d=qi,a=1){if(d!==qi&&d!==Jr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:e,height:n,depth:a};super(u,r,s,o,c,l,d,i,f),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Jp(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}class Vw extends Fa{constructor(e,n=Ai,i=as,r,s,o=Kt,c=Kt,l,f=qi){const d={width:e,height:e,depth:1},a=[d,d,d,d,d,d];super(e,e,n,i,r,s,o,c,l,f),this.image=a,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Qx extends ln{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Wa extends Ve{constructor(e=1,n=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const c=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],f=[],d=[],a=[];let u=0,h=0;m("z","y","x",-1,-1,i,n,e,o,s,0),m("z","y","x",1,-1,i,n,-e,o,s,1),m("x","z","y",1,1,e,i,n,r,o,2),m("x","z","y",1,-1,e,i,-n,r,o,3),m("x","y","z",1,-1,e,n,i,r,s,4),m("x","y","z",-1,-1,e,n,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new it(f,3)),this.setAttribute("normal",new it(d,3)),this.setAttribute("uv",new it(a,2));function m(v,g,p,_,x,S,b,M,T,y,w){const D=S/T,C=b/y,N=S/2,P=b/2,U=M/2,V=T+1,O=y+1;let H=0,z=0;const X=new R;for(let J=0;J<O;J++){const Q=J*C-P;for(let ie=0;ie<V;ie++){const Fe=ie*D-N;X[v]=Fe*_,X[g]=Q*x,X[p]=U,f.push(X.x,X.y,X.z),X[v]=0,X[g]=0,X[p]=M>0?1:-1,d.push(X.x,X.y,X.z),a.push(ie/T),a.push(1-J/y),H+=1}}for(let J=0;J<y;J++)for(let Q=0;Q<T;Q++){const ie=u+Q+V*J,Fe=u+Q+V*(J+1),Ze=u+(Q+1)+V*(J+1),rt=u+(Q+1)+V*J;l.push(ie,Fe,rt),l.push(Fe,Ze,rt),z+=6}c.addGroup(h,z,w),h+=z,u+=H}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Wa(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Jx extends Ve{constructor(e=1,n=32,i=0,r=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:n,thetaStart:i,thetaLength:r},n=Math.max(3,n);const s=[],o=[],c=[],l=[],f=new R,d=new _e;o.push(0,0,0),c.push(0,0,1),l.push(.5,.5);for(let a=0,u=3;a<=n;a++,u+=3){const h=i+a/n*r;f.x=e*Math.cos(h),f.y=e*Math.sin(h),o.push(f.x,f.y,f.z),c.push(0,0,1),d.x=(o[u]/e+1)/2,d.y=(o[u+1]/e+1)/2,l.push(d.x,d.y)}for(let a=1;a<=n;a++)s.push(a,a+1,0);this.setIndex(s),this.setAttribute("position",new it(o,3)),this.setAttribute("normal",new it(c,3)),this.setAttribute("uv",new it(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Jx(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class ey extends Ve{constructor(e=1,n=1,i=1,r=32,s=1,o=!1,c=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:n,height:i,radialSegments:r,heightSegments:s,openEnded:o,thetaStart:c,thetaLength:l};const f=this;r=Math.floor(r),s=Math.floor(s);const d=[],a=[],u=[],h=[];let m=0;const v=[],g=i/2;let p=0;_(),o===!1&&(e>0&&x(!0),n>0&&x(!1)),this.setIndex(d),this.setAttribute("position",new it(a,3)),this.setAttribute("normal",new it(u,3)),this.setAttribute("uv",new it(h,2));function _(){const S=new R,b=new R;let M=0;const T=(n-e)/i;for(let y=0;y<=s;y++){const w=[],D=y/s,C=D*(n-e)+e;for(let N=0;N<=r;N++){const P=N/r,U=P*l+c,V=Math.sin(U),O=Math.cos(U);b.x=C*V,b.y=-D*i+g,b.z=C*O,a.push(b.x,b.y,b.z),S.set(V,T,O).normalize(),u.push(S.x,S.y,S.z),h.push(P,1-D),w.push(m++)}v.push(w)}for(let y=0;y<r;y++)for(let w=0;w<s;w++){const D=v[w][y],C=v[w+1][y],N=v[w+1][y+1],P=v[w][y+1];(e>0||w!==0)&&(d.push(D,C,P),M+=3),(n>0||w!==s-1)&&(d.push(C,N,P),M+=3)}f.addGroup(p,M,0),p+=M}function x(S){const b=m,M=new _e,T=new R;let y=0;const w=S===!0?e:n,D=S===!0?1:-1;for(let N=1;N<=r;N++)a.push(0,g*D,0),u.push(0,D,0),h.push(.5,.5),m++;const C=m;for(let N=0;N<=r;N++){const U=N/r*l+c,V=Math.cos(U),O=Math.sin(U);T.x=w*O,T.y=g*D,T.z=w*V,a.push(T.x,T.y,T.z),u.push(0,D,0),M.x=V*.5+.5,M.y=O*.5*D+.5,h.push(M.x,M.y),m++}for(let N=0;N<r;N++){const P=b+N,U=C+N;S===!0?d.push(U,U+1,P):d.push(U+1,U,P),y+=3}f.addGroup(p,y,S===!0?1:2),p+=y}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ey(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class nm extends Ve{constructor(e=[],n=[],i=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:n,radius:i,detail:r};const s=[],o=[];c(r),f(i),d(),this.setAttribute("position",new it(s,3)),this.setAttribute("normal",new it(s.slice(),3)),this.setAttribute("uv",new it(o,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function c(_){const x=new R,S=new R,b=new R;for(let M=0;M<n.length;M+=3)h(n[M+0],x),h(n[M+1],S),h(n[M+2],b),l(x,S,b,_)}function l(_,x,S,b){const M=b+1,T=[];for(let y=0;y<=M;y++){T[y]=[];const w=_.clone().lerp(S,y/M),D=x.clone().lerp(S,y/M),C=M-y;for(let N=0;N<=C;N++)N===0&&y===M?T[y][N]=w:T[y][N]=w.clone().lerp(D,N/C)}for(let y=0;y<M;y++)for(let w=0;w<2*(M-y)-1;w++){const D=Math.floor(w/2);w%2===0?(u(T[y][D+1]),u(T[y+1][D]),u(T[y][D])):(u(T[y][D+1]),u(T[y+1][D+1]),u(T[y+1][D]))}}function f(_){const x=new R;for(let S=0;S<s.length;S+=3)x.x=s[S+0],x.y=s[S+1],x.z=s[S+2],x.normalize().multiplyScalar(_),s[S+0]=x.x,s[S+1]=x.y,s[S+2]=x.z}function d(){const _=new R;for(let x=0;x<s.length;x+=3){_.x=s[x+0],_.y=s[x+1],_.z=s[x+2];const S=g(_)/2/Math.PI+.5,b=p(_)/Math.PI+.5;o.push(S,1-b)}m(),a()}function a(){for(let _=0;_<o.length;_+=6){const x=o[_+0],S=o[_+2],b=o[_+4],M=Math.max(x,S,b),T=Math.min(x,S,b);M>.9&&T<.1&&(x<.2&&(o[_+0]+=1),S<.2&&(o[_+2]+=1),b<.2&&(o[_+4]+=1))}}function u(_){s.push(_.x,_.y,_.z)}function h(_,x){const S=_*3;x.x=e[S+0],x.y=e[S+1],x.z=e[S+2]}function m(){const _=new R,x=new R,S=new R,b=new R,M=new _e,T=new _e,y=new _e;for(let w=0,D=0;w<s.length;w+=9,D+=6){_.set(s[w+0],s[w+1],s[w+2]),x.set(s[w+3],s[w+4],s[w+5]),S.set(s[w+6],s[w+7],s[w+8]),M.set(o[D+0],o[D+1]),T.set(o[D+2],o[D+3]),y.set(o[D+4],o[D+5]),b.copy(_).add(x).add(S).divideScalar(3);const C=g(b);v(M,D+0,_,C),v(T,D+2,x,C),v(y,D+4,S,C)}}function v(_,x,S,b){b<0&&_.x===1&&(o[x]=_.x-1),S.x===0&&S.z===0&&(o[x]=b/2/Math.PI+.5)}function g(_){return Math.atan2(_.z,-_.x)}function p(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new nm(e.vertices,e.indices,e.radius,e.detail)}}const Gl=new R,Wl=new R,Df=new R,Xl=new In;class l0 extends Ve{constructor(e=null,n=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:n},e!==null){const r=Math.pow(10,4),s=Math.cos(ao*n),o=e.getIndex(),c=e.getAttribute("position"),l=o?o.count:c.count,f=[0,0,0],d=["a","b","c"],a=new Array(3),u={},h=[];for(let m=0;m<l;m+=3){o?(f[0]=o.getX(m),f[1]=o.getX(m+1),f[2]=o.getX(m+2)):(f[0]=m,f[1]=m+1,f[2]=m+2);const{a:v,b:g,c:p}=Xl;if(v.fromBufferAttribute(c,f[0]),g.fromBufferAttribute(c,f[1]),p.fromBufferAttribute(c,f[2]),Xl.getNormal(Df),a[0]=`${Math.round(v.x*r)},${Math.round(v.y*r)},${Math.round(v.z*r)}`,a[1]=`${Math.round(g.x*r)},${Math.round(g.y*r)},${Math.round(g.z*r)}`,a[2]=`${Math.round(p.x*r)},${Math.round(p.y*r)},${Math.round(p.z*r)}`,!(a[0]===a[1]||a[1]===a[2]||a[2]===a[0]))for(let _=0;_<3;_++){const x=(_+1)%3,S=a[_],b=a[x],M=Xl[d[_]],T=Xl[d[x]],y=`${S}_${b}`,w=`${b}_${S}`;w in u&&u[w]?(Df.dot(u[w].normal)<=s&&(h.push(M.x,M.y,M.z),h.push(T.x,T.y,T.z)),u[w]=null):y in u||(u[y]={index0:f[_],index1:f[x],normal:Df.clone()})}}for(const m in u)if(u[m]){const{index0:v,index1:g}=u[m];Gl.fromBufferAttribute(c,v),Wl.fromBufferAttribute(c,g),h.push(Gl.x,Gl.y,Gl.z),h.push(Wl.x,Wl.y,Wl.z)}this.setAttribute("position",new it(h,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class ty{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Oe("Curve: .getPoint() not implemented.")}getPointAt(e,n){const i=this.getUtoTmapping(e);return this.getPoint(i,n)}getPoints(e=5){const n=[];for(let i=0;i<=e;i++)n.push(this.getPoint(i/e));return n}getSpacedPoints(e=5){const n=[];for(let i=0;i<=e;i++)n.push(this.getPointAt(i/e));return n}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const n=[];let i,r=this.getPoint(0),s=0;n.push(0);for(let o=1;o<=e;o++)i=this.getPoint(o/e),s+=i.distanceTo(r),n.push(s),r=i;return this.cacheArcLengths=n,n}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,n=null){const i=this.getLengths();let r=0;const s=i.length;let o;n?o=n:o=e*i[s-1];let c=0,l=s-1,f;for(;c<=l;)if(r=Math.floor(c+(l-c)/2),f=i[r]-o,f<0)c=r+1;else if(f>0)l=r-1;else{l=r;break}if(r=l,i[r]===o)return r/(s-1);const d=i[r],u=i[r+1]-d,h=(o-d)/u;return(r+h)/(s-1)}getTangent(e,n){let r=e-1e-4,s=e+1e-4;r<0&&(r=0),s>1&&(s=1);const o=this.getPoint(r),c=this.getPoint(s),l=n||(o.isVector2?new _e:new R);return l.copy(c).sub(o).normalize(),l}getTangentAt(e,n){const i=this.getUtoTmapping(e);return this.getTangent(i,n)}computeFrenetFrames(e,n=!1){const i=new R,r=[],s=[],o=[],c=new R,l=new ht;for(let h=0;h<=e;h++){const m=h/e;r[h]=this.getTangentAt(m,new R)}s[0]=new R,o[0]=new R;let f=Number.MAX_VALUE;const d=Math.abs(r[0].x),a=Math.abs(r[0].y),u=Math.abs(r[0].z);d<=f&&(f=d,i.set(1,0,0)),a<=f&&(f=a,i.set(0,1,0)),u<=f&&i.set(0,0,1),c.crossVectors(r[0],i).normalize(),s[0].crossVectors(r[0],c),o[0].crossVectors(r[0],s[0]);for(let h=1;h<=e;h++){if(s[h]=s[h-1].clone(),o[h]=o[h-1].clone(),c.crossVectors(r[h-1],r[h]),c.length()>Number.EPSILON){c.normalize();const m=Math.acos($e(r[h-1].dot(r[h]),-1,1));s[h].applyMatrix4(l.makeRotationAxis(c,m))}o[h].crossVectors(r[h],s[h])}if(n===!0){let h=Math.acos($e(s[0].dot(s[e]),-1,1));h/=e,r[0].dot(c.crossVectors(s[0],s[e]))>0&&(h=-h);for(let m=1;m<=e;m++)s[m].applyMatrix4(l.makeRotationAxis(r[m],h*m)),o[m].crossVectors(r[m],s[m])}return{tangents:r,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}function im(){let t=0,e=0,n=0,i=0;function r(s,o,c,l){t=s,e=c,n=-3*s+3*o-2*c-l,i=2*s-2*o+c+l}return{initCatmullRom:function(s,o,c,l,f){r(o,c,f*(c-s),f*(l-o))},initNonuniformCatmullRom:function(s,o,c,l,f,d,a){let u=(o-s)/f-(c-s)/(f+d)+(c-o)/d,h=(c-o)/d-(l-o)/(d+a)+(l-c)/a;u*=d,h*=d,r(o,c,u,h)},calc:function(s){const o=s*s,c=o*s;return t+e*s+n*o+i*c}}}const jl=new R,If=new im,Nf=new im,Uf=new im;class xP extends ty{constructor(e=[],n=!1,i="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=n,this.curveType=i,this.tension=r}getPoint(e,n=new R){const i=n,r=this.points,s=r.length,o=(s-(this.closed?0:1))*e;let c=Math.floor(o),l=o-c;this.closed?c+=c>0?0:(Math.floor(Math.abs(c)/s)+1)*s:l===0&&c===s-1&&(c=s-2,l=1);let f,d;this.closed||c>0?f=r[(c-1)%s]:(jl.subVectors(r[0],r[1]).add(r[0]),f=jl);const a=r[c%s],u=r[(c+1)%s];if(this.closed||c+2<s?d=r[(c+2)%s]:(jl.subVectors(r[s-1],r[s-2]).add(r[s-1]),d=jl),this.curveType==="centripetal"||this.curveType==="chordal"){const h=this.curveType==="chordal"?.5:.25;let m=Math.pow(f.distanceToSquared(a),h),v=Math.pow(a.distanceToSquared(u),h),g=Math.pow(u.distanceToSquared(d),h);v<1e-4&&(v=1),m<1e-4&&(m=v),g<1e-4&&(g=v),If.initNonuniformCatmullRom(f.x,a.x,u.x,d.x,m,v,g),Nf.initNonuniformCatmullRom(f.y,a.y,u.y,d.y,m,v,g),Uf.initNonuniformCatmullRom(f.z,a.z,u.z,d.z,m,v,g)}else this.curveType==="catmullrom"&&(If.initCatmullRom(f.x,a.x,u.x,d.x,this.tension),Nf.initCatmullRom(f.y,a.y,u.y,d.y,this.tension),Uf.initCatmullRom(f.z,a.z,u.z,d.z,this.tension));return i.set(If.calc(l),Nf.calc(l),Uf.calc(l)),i}copy(e){super.copy(e),this.points=[];for(let n=0,i=e.points.length;n<i;n++){const r=e.points[n];this.points.push(r.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let n=0,i=this.points.length;n<i;n++){const r=this.points[n];e.points.push(r.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let n=0,i=e.points.length;n<i;n++){const r=e.points[n];this.points.push(new R().fromArray(r))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function Hw(t,e){const n=1-t;return n*n*e}function Gw(t,e){return 2*(1-t)*t*e}function Ww(t,e){return t*t*e}function Ff(t,e,n,i){return Hw(t,e)+Gw(t,n)+Ww(t,i)}class yP extends ty{constructor(e=new R,n=new R,i=new R){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=n,this.v2=i}getPoint(e,n=new R){const i=n,r=this.v0,s=this.v1,o=this.v2;return i.set(Ff(e,r.x,s.x,o.x),Ff(e,r.y,s.y,o.y),Ff(e,r.z,s.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Oa extends nm{constructor(e=1,n=0){const i=(1+Math.sqrt(5))/2,r=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(r,s,e,n),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:n}}static fromJSON(e){return new Oa(e.radius,e.detail)}}class Xa extends Ve{constructor(e=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:r};const s=e/2,o=n/2,c=Math.floor(i),l=Math.floor(r),f=c+1,d=l+1,a=e/c,u=n/l,h=[],m=[],v=[],g=[];for(let p=0;p<d;p++){const _=p*u-o;for(let x=0;x<f;x++){const S=x*a-s;m.push(S,-_,0),v.push(0,0,1),g.push(x/c),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let _=0;_<c;_++){const x=_+f*p,S=_+f*(p+1),b=_+1+f*(p+1),M=_+1+f*p;h.push(x,S,M),h.push(S,b,M)}this.setIndex(h),this.setAttribute("position",new it(m,3)),this.setAttribute("normal",new it(v,3)),this.setAttribute("uv",new it(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Xa(e.width,e.height,e.widthSegments,e.heightSegments)}}class ny extends Ve{constructor(e=.5,n=1,i=32,r=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:n,thetaSegments:i,phiSegments:r,thetaStart:s,thetaLength:o},i=Math.max(3,i),r=Math.max(1,r);const c=[],l=[],f=[],d=[];let a=e;const u=(n-e)/r,h=new R,m=new _e;for(let v=0;v<=r;v++){for(let g=0;g<=i;g++){const p=s+g/i*o;h.x=a*Math.cos(p),h.y=a*Math.sin(p),l.push(h.x,h.y,h.z),f.push(0,0,1),m.x=(h.x/n+1)/2,m.y=(h.y/n+1)/2,d.push(m.x,m.y)}a+=u}for(let v=0;v<r;v++){const g=v*(i+1);for(let p=0;p<i;p++){const _=p+g,x=_,S=_+i+1,b=_+i+2,M=_+1;c.push(x,S,M),c.push(S,b,M)}}this.setIndex(c),this.setAttribute("position",new it(l,3)),this.setAttribute("normal",new it(f,3)),this.setAttribute("uv",new it(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ny(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class iy extends Ve{constructor(e=1,n=32,i=16,r=0,s=Math.PI*2,o=0,c=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:n,heightSegments:i,phiStart:r,phiLength:s,thetaStart:o,thetaLength:c},n=Math.max(3,Math.floor(n)),i=Math.max(2,Math.floor(i));const l=Math.min(o+c,Math.PI);let f=0;const d=[],a=new R,u=new R,h=[],m=[],v=[],g=[];for(let p=0;p<=i;p++){const _=[],x=p/i;let S=0;p===0&&o===0?S=.5/n:p===i&&l===Math.PI&&(S=-.5/n);for(let b=0;b<=n;b++){const M=b/n;a.x=-e*Math.cos(r+M*s)*Math.sin(o+x*c),a.y=e*Math.cos(o+x*c),a.z=e*Math.sin(r+M*s)*Math.sin(o+x*c),m.push(a.x,a.y,a.z),u.copy(a).normalize(),v.push(u.x,u.y,u.z),g.push(M+S,1-x),_.push(f++)}d.push(_)}for(let p=0;p<i;p++)for(let _=0;_<n;_++){const x=d[p][_+1],S=d[p][_],b=d[p+1][_],M=d[p+1][_+1];(p!==0||o>0)&&h.push(x,S,M),(p!==i-1||l<Math.PI)&&h.push(S,b,M)}this.setIndex(h),this.setAttribute("position",new it(m,3)),this.setAttribute("normal",new it(v,3)),this.setAttribute("uv",new it(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new iy(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class ry extends Ve{constructor(e=1,n=.4,i=12,r=48,s=Math.PI*2,o=0,c=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:n,radialSegments:i,tubularSegments:r,arc:s,thetaStart:o,thetaLength:c},i=Math.floor(i),r=Math.floor(r);const l=[],f=[],d=[],a=[],u=new R,h=new R,m=new R;for(let v=0;v<=i;v++){const g=o+v/i*c;for(let p=0;p<=r;p++){const _=p/r*s;h.x=(e+n*Math.cos(g))*Math.cos(_),h.y=(e+n*Math.cos(g))*Math.sin(_),h.z=n*Math.sin(g),f.push(h.x,h.y,h.z),u.x=e*Math.cos(_),u.y=e*Math.sin(_),m.subVectors(h,u).normalize(),d.push(m.x,m.y,m.z),a.push(p/r),a.push(v/i)}}for(let v=1;v<=i;v++)for(let g=1;g<=r;g++){const p=(r+1)*v+g-1,_=(r+1)*(v-1)+g-1,x=(r+1)*(v-1)+g,S=(r+1)*v+g;l.push(p,_,S),l.push(_,x,S)}this.setIndex(l),this.setAttribute("position",new it(f,3)),this.setAttribute("normal",new it(d,3)),this.setAttribute("uv",new it(a,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ry(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}function Mo(t){const e={};for(const n in t){e[n]={};for(const i in t[n]){const r=t[n][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(Oe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=r.clone():Array.isArray(r)?e[n][i]=r.slice():e[n][i]=r}}return e}function fn(t){const e={};for(let n=0;n<t.length;n++){const i=Mo(t[n]);for(const r in i)e[r]=i[r]}return e}function Xw(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function sy(t){const e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Je.workingColorSpace}const iu={clone:Mo,merge:fn};var jw=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,$w=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Tt extends Qi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=jw,this.fragmentShader=$w,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Mo(e.uniforms),this.uniformsGroups=Xw(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?n.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?n.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?n.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?n.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?n.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?n.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?n.uniforms[r]={type:"m4",value:o.toArray()}:n.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}}class Yw extends Tt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class SP extends Qi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new te(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new te(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=qp,this.normalScale=new _e(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new di,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class MP extends Qi{constructor(e){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new te(16777215),this.specular=new te(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new te(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=qp,this.normalScale=new _e(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new di,this.combine=Vp,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class qw extends Qi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=V1,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Kw extends Qi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Eu extends Ot{constructor(e,n=1){super(),this.isLight=!0,this.type="Light",this.color=new te(e),this.intensity=n}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,n){return super.copy(e,n),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const n=super.toJSON(e);return n.object.color=this.color.getHex(),n.object.intensity=this.intensity,n}}class wP extends Eu{constructor(e,n,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ot.DEFAULT_UP),this.updateMatrix(),this.groundColor=new te(n)}copy(e,n){return super.copy(e,n),this.groundColor.copy(e.groundColor),this}toJSON(e){const n=super.toJSON(e);return n.object.groundColor=this.groundColor.getHex(),n}}const Of=new ht,c0=new R,u0=new R;class oy{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new _e(512,512),this.mapType=Dn,this.map=null,this.mapPass=null,this.matrix=new ht,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new tm,this._frameExtents=new _e(1,1),this._viewportCount=1,this._viewports=[new Lt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const n=this.camera,i=this.matrix;c0.setFromMatrixPosition(e.matrixWorld),n.position.copy(c0),u0.setFromMatrixPosition(e.target.matrixWorld),n.lookAt(u0),n.updateMatrixWorld(),Of.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Of,n.coordinateSystem,n.reversedDepth),n.coordinateSystem===Na||n.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Of)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const $l=new R,Yl=new Rr,gi=new R;class ay extends Ot{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ht,this.projectionMatrix=new ht,this.projectionMatrixInverse=new ht,this.coordinateSystem=Si,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose($l,Yl,gi),gi.x===1&&gi.y===1&&gi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose($l,Yl,gi.set(1,1,1)).invert()}updateWorldMatrix(e,n){super.updateWorldMatrix(e,n),this.matrixWorld.decompose($l,Yl,gi),gi.x===1&&gi.y===1&&gi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose($l,Yl,gi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const lr=new R,f0=new _e,d0=new _e;class Ln extends ay{constructor(e=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=Ua*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(ao*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ua*2*Math.atan(Math.tan(ao*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){lr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(lr.x,lr.y).multiplyScalar(-e/lr.z),lr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(lr.x,lr.y).multiplyScalar(-e/lr.z)}getViewSize(e,n){return this.getViewBounds(e,f0,d0),n.subVectors(d0,f0)}setViewOffset(e,n,i,r,s,o){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(ao*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,f=o.fullHeight;s+=o.offsetX*r/l,n-=o.offsetY*i/f,r*=o.width/l,i*=o.height/f}const c=this.filmOffset;c!==0&&(s+=e*c/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,n,n-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}class Zw extends oy{constructor(){super(new Ln(90,1,.5,500)),this.isPointLightShadow=!0}}class Qw extends Eu{constructor(e,n,i=0,r=2){super(e,n),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=r,this.shadow=new Zw}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,n){return super.copy(e,n),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const n=super.toJSON(e);return n.object.distance=this.distance,n.object.decay=this.decay,n.object.shadow=this.shadow.toJSON(),n}}class Tu extends ay{constructor(e=-1,n=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,c=r+n,l=r-n;if(this.view!==null&&this.view.enabled){const f=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=f*this.view.offsetX,o=s+f*this.view.width,c-=d*this.view.offsetY,l=c-d*this.view.height}this.projectionMatrix.makeOrthographic(s,o,c,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}class Jw extends oy{constructor(){super(new Tu(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class EP extends Eu{constructor(e,n){super(e,n),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ot.DEFAULT_UP),this.updateMatrix(),this.target=new Ot,this.shadow=new Jw}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const n=super.toJSON(e);return n.object.shadow=this.shadow.toJSON(),n.object.target=this.target.uuid,n}}class TP extends Eu{constructor(e,n){super(e,n),this.isAmbientLight=!0,this.type="AmbientLight"}}const Is=-90,Ns=1;class eE extends Ot{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Ln(Is,Ns,e,n);r.layers=this.layers,this.add(r);const s=new Ln(Is,Ns,e,n);s.layers=this.layers,this.add(s);const o=new Ln(Is,Ns,e,n);o.layers=this.layers,this.add(o);const c=new Ln(Is,Ns,e,n);c.layers=this.layers,this.add(c);const l=new Ln(Is,Ns,e,n);l.layers=this.layers,this.add(l);const f=new Ln(Is,Ns,e,n);f.layers=this.layers,this.add(f)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[i,r,s,o,c,l]=n;for(const f of n)this.remove(f);if(e===Si)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),c.up.set(0,1,0),c.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Na)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),c.up.set(0,-1,0),c.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const f of n)this.add(f),f.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,c,l,f,d]=this.children,a=e.getRenderTarget(),u=e.getActiveCubeFace(),h=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let g=!1;e.isWebGLRenderer===!0?g=e.state.buffers.depth.getReversed():g=e.reversedDepthBuffer,e.setRenderTarget(i,0,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(n,s),e.setRenderTarget(i,1,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(n,o),e.setRenderTarget(i,2,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(n,c),e.setRenderTarget(i,3,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(n,l),e.setRenderTarget(i,4,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(n,f),i.texture.generateMipmaps=v,e.setRenderTarget(i,5,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(n,d),e.setRenderTarget(a,u,h),e.xr.enabled=m,i.texture.needsPMREMUpdate=!0}}class tE extends Ln{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class nE{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=iE.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}}function iE(){this._document.hidden===!1&&this.reset()}class bP{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,Oe("THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.")}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const n=performance.now();e=(n-this.oldTime)/1e3,this.oldTime=n,this.elapsedTime+=e}return e}}class h0{constructor(e=1,n=0,i=0){this.radius=e,this.phi=n,this.theta=i}set(e,n,i){return this.radius=e,this.phi=n,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=$e(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,n,i){return this.radius=Math.sqrt(e*e+n*n+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos($e(n/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class rE extends fs{constructor(e,n=null){super(),this.object=e,this.domElement=n,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){Oe("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function p0(t,e,n,i){const r=sE(i);switch(n){case zx:return t*e;case Xp:return t*e/r.components*r.byteLength;case jp:return t*e/r.components*r.byteLength;case xo:return t*e*2/r.components*r.byteLength;case $p:return t*e*2/r.components*r.byteLength;case Vx:return t*e*3/r.components*r.byteLength;case ai:return t*e*4/r.components*r.byteLength;case Yp:return t*e*4/r.components*r.byteLength;case gc:case _c:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case vc:case xc:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case oh:case lh:return Math.max(t,16)*Math.max(e,8)/4;case sh:case ah:return Math.max(t,8)*Math.max(e,8)/2;case ch:case uh:case dh:case hh:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case fh:case ph:case mh:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case gh:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case _h:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case vh:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case xh:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case yh:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case Sh:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case Mh:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case wh:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case Eh:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case Th:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case bh:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case Ah:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case Ch:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case Rh:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case Ph:case Lh:case Dh:return Math.ceil(t/4)*Math.ceil(e/4)*16;case Ih:case Nh:return Math.ceil(t/4)*Math.ceil(e/4)*8;case Uh:case Fh:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function sE(t){switch(t){case Dn:case Fx:return{byteLength:1,components:1};case Da:case Ox:case Fn:return{byteLength:2,components:1};case Gp:case Wp:return{byteLength:2,components:4};case Ai:case Hp:case oi:return{byteLength:4,components:1};case kx:case Bx:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${t}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:zp}}));typeof window<"u"&&(window.__THREE__?Oe("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=zp);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function ly(){let t=null,e=!1,n=null,i=null;function r(s,o){n(s,o),i=t.requestAnimationFrame(r)}return{start:function(){e!==!0&&n!==null&&(i=t.requestAnimationFrame(r),e=!0)},stop:function(){t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){n=s},setContext:function(s){t=s}}}function oE(t){const e=new WeakMap;function n(c,l){const f=c.array,d=c.usage,a=f.byteLength,u=t.createBuffer();t.bindBuffer(l,u),t.bufferData(l,f,d),c.onUploadCallback();let h;if(f instanceof Float32Array)h=t.FLOAT;else if(typeof Float16Array<"u"&&f instanceof Float16Array)h=t.HALF_FLOAT;else if(f instanceof Uint16Array)c.isFloat16BufferAttribute?h=t.HALF_FLOAT:h=t.UNSIGNED_SHORT;else if(f instanceof Int16Array)h=t.SHORT;else if(f instanceof Uint32Array)h=t.UNSIGNED_INT;else if(f instanceof Int32Array)h=t.INT;else if(f instanceof Int8Array)h=t.BYTE;else if(f instanceof Uint8Array)h=t.UNSIGNED_BYTE;else if(f instanceof Uint8ClampedArray)h=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+f);return{buffer:u,type:h,bytesPerElement:f.BYTES_PER_ELEMENT,version:c.version,size:a}}function i(c,l,f){const d=l.array,a=l.updateRanges;if(t.bindBuffer(f,c),a.length===0)t.bufferSubData(f,0,d);else{a.sort((h,m)=>h.start-m.start);let u=0;for(let h=1;h<a.length;h++){const m=a[u],v=a[h];v.start<=m.start+m.count+1?m.count=Math.max(m.count,v.start+v.count-m.start):(++u,a[u]=v)}a.length=u+1;for(let h=0,m=a.length;h<m;h++){const v=a[h];t.bufferSubData(f,v.start*d.BYTES_PER_ELEMENT,d,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(c){return c.isInterleavedBufferAttribute&&(c=c.data),e.get(c)}function s(c){c.isInterleavedBufferAttribute&&(c=c.data);const l=e.get(c);l&&(t.deleteBuffer(l.buffer),e.delete(c))}function o(c,l){if(c.isInterleavedBufferAttribute&&(c=c.data),c.isGLBufferAttribute){const d=e.get(c);(!d||d.version<c.version)&&e.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}const f=e.get(c);if(f===void 0)e.set(c,n(c,l));else if(f.version<c.version){if(f.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(f.buffer,c,l),f.version=c.version}}return{get:r,remove:s,update:o}}var aE=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,lE=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,cE=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,uE=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,fE=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,dE=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,hE=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,pE=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,mE=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,gE=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,_E=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,vE=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,xE=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,yE=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,SE=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,ME=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,wE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,EE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,TE=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,bE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,AE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,CE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,RE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,PE=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,LE=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,DE=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,IE=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,NE=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,UE=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,FE=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,OE="gl_FragColor = linearToOutputTexel( gl_FragColor );",kE=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,BE=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,zE=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,VE=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,HE=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,GE=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,WE=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,XE=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,jE=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,$E=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,YE=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,qE=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,KE=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ZE=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,QE=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,JE=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,eT=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,tT=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,nT=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,iT=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,rT=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,sT=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return v;
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,oT=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,aT=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lT=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,cT=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,uT=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,fT=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,dT=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,hT=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,pT=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,mT=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,gT=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,_T=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,vT=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,xT=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,yT=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ST=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,MT=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,wT=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ET=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,TT=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,bT=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,AT=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,CT=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,RT=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,PT=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,LT=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,DT=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,IT=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,NT=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,UT=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,FT=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,OT=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,kT=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,BT=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,zT=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,VT=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,HT=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,GT=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,WT=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,XT=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,jT=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,$T=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,YT=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,qT=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,KT=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,ZT=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,QT=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,JT=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,eb=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,tb=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,nb=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ib=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,rb=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,sb=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const ob=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ab=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,lb=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cb=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ub=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,fb=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,db=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,hb=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,pb=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,mb=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,gb=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,_b=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vb=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,xb=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,yb=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Sb=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Mb=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,wb=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Eb=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Tb=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,bb=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Ab=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Cb=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Rb=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Pb=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Lb=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Db=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ib=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Nb=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Ub=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Fb=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ob=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,kb=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Bb=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,je={alphahash_fragment:aE,alphahash_pars_fragment:lE,alphamap_fragment:cE,alphamap_pars_fragment:uE,alphatest_fragment:fE,alphatest_pars_fragment:dE,aomap_fragment:hE,aomap_pars_fragment:pE,batching_pars_vertex:mE,batching_vertex:gE,begin_vertex:_E,beginnormal_vertex:vE,bsdfs:xE,iridescence_fragment:yE,bumpmap_pars_fragment:SE,clipping_planes_fragment:ME,clipping_planes_pars_fragment:wE,clipping_planes_pars_vertex:EE,clipping_planes_vertex:TE,color_fragment:bE,color_pars_fragment:AE,color_pars_vertex:CE,color_vertex:RE,common:PE,cube_uv_reflection_fragment:LE,defaultnormal_vertex:DE,displacementmap_pars_vertex:IE,displacementmap_vertex:NE,emissivemap_fragment:UE,emissivemap_pars_fragment:FE,colorspace_fragment:OE,colorspace_pars_fragment:kE,envmap_fragment:BE,envmap_common_pars_fragment:zE,envmap_pars_fragment:VE,envmap_pars_vertex:HE,envmap_physical_pars_fragment:JE,envmap_vertex:GE,fog_vertex:WE,fog_pars_vertex:XE,fog_fragment:jE,fog_pars_fragment:$E,gradientmap_pars_fragment:YE,lightmap_pars_fragment:qE,lights_lambert_fragment:KE,lights_lambert_pars_fragment:ZE,lights_pars_begin:QE,lights_toon_fragment:eT,lights_toon_pars_fragment:tT,lights_phong_fragment:nT,lights_phong_pars_fragment:iT,lights_physical_fragment:rT,lights_physical_pars_fragment:sT,lights_fragment_begin:oT,lights_fragment_maps:aT,lights_fragment_end:lT,logdepthbuf_fragment:cT,logdepthbuf_pars_fragment:uT,logdepthbuf_pars_vertex:fT,logdepthbuf_vertex:dT,map_fragment:hT,map_pars_fragment:pT,map_particle_fragment:mT,map_particle_pars_fragment:gT,metalnessmap_fragment:_T,metalnessmap_pars_fragment:vT,morphinstance_vertex:xT,morphcolor_vertex:yT,morphnormal_vertex:ST,morphtarget_pars_vertex:MT,morphtarget_vertex:wT,normal_fragment_begin:ET,normal_fragment_maps:TT,normal_pars_fragment:bT,normal_pars_vertex:AT,normal_vertex:CT,normalmap_pars_fragment:RT,clearcoat_normal_fragment_begin:PT,clearcoat_normal_fragment_maps:LT,clearcoat_pars_fragment:DT,iridescence_pars_fragment:IT,opaque_fragment:NT,packing:UT,premultiplied_alpha_fragment:FT,project_vertex:OT,dithering_fragment:kT,dithering_pars_fragment:BT,roughnessmap_fragment:zT,roughnessmap_pars_fragment:VT,shadowmap_pars_fragment:HT,shadowmap_pars_vertex:GT,shadowmap_vertex:WT,shadowmask_pars_fragment:XT,skinbase_vertex:jT,skinning_pars_vertex:$T,skinning_vertex:YT,skinnormal_vertex:qT,specularmap_fragment:KT,specularmap_pars_fragment:ZT,tonemapping_fragment:QT,tonemapping_pars_fragment:JT,transmission_fragment:eb,transmission_pars_fragment:tb,uv_pars_fragment:nb,uv_pars_vertex:ib,uv_vertex:rb,worldpos_vertex:sb,background_vert:ob,background_frag:ab,backgroundCube_vert:lb,backgroundCube_frag:cb,cube_vert:ub,cube_frag:fb,depth_vert:db,depth_frag:hb,distance_vert:pb,distance_frag:mb,equirect_vert:gb,equirect_frag:_b,linedashed_vert:vb,linedashed_frag:xb,meshbasic_vert:yb,meshbasic_frag:Sb,meshlambert_vert:Mb,meshlambert_frag:wb,meshmatcap_vert:Eb,meshmatcap_frag:Tb,meshnormal_vert:bb,meshnormal_frag:Ab,meshphong_vert:Cb,meshphong_frag:Rb,meshphysical_vert:Pb,meshphysical_frag:Lb,meshtoon_vert:Db,meshtoon_frag:Ib,points_vert:Nb,points_frag:Ub,shadow_vert:Fb,shadow_frag:Ob,sprite_vert:kb,sprite_frag:Bb},he={common:{diffuse:{value:new te(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new We}},envmap:{envMap:{value:null},envMapRotation:{value:new We},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new We}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new We}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new We},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new We},normalScale:{value:new _e(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new We},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new We}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new We}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new We}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new te(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new te(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0},uvTransform:{value:new We}},sprite:{diffuse:{value:new te(16777215)},opacity:{value:1},center:{value:new _e(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}}},xi={basic:{uniforms:fn([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.fog]),vertexShader:je.meshbasic_vert,fragmentShader:je.meshbasic_frag},lambert:{uniforms:fn([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new te(0)},envMapIntensity:{value:1}}]),vertexShader:je.meshlambert_vert,fragmentShader:je.meshlambert_frag},phong:{uniforms:fn([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new te(0)},specular:{value:new te(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:je.meshphong_vert,fragmentShader:je.meshphong_frag},standard:{uniforms:fn([he.common,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.roughnessmap,he.metalnessmap,he.fog,he.lights,{emissive:{value:new te(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:je.meshphysical_vert,fragmentShader:je.meshphysical_frag},toon:{uniforms:fn([he.common,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.gradientmap,he.fog,he.lights,{emissive:{value:new te(0)}}]),vertexShader:je.meshtoon_vert,fragmentShader:je.meshtoon_frag},matcap:{uniforms:fn([he.common,he.bumpmap,he.normalmap,he.displacementmap,he.fog,{matcap:{value:null}}]),vertexShader:je.meshmatcap_vert,fragmentShader:je.meshmatcap_frag},points:{uniforms:fn([he.points,he.fog]),vertexShader:je.points_vert,fragmentShader:je.points_frag},dashed:{uniforms:fn([he.common,he.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:je.linedashed_vert,fragmentShader:je.linedashed_frag},depth:{uniforms:fn([he.common,he.displacementmap]),vertexShader:je.depth_vert,fragmentShader:je.depth_frag},normal:{uniforms:fn([he.common,he.bumpmap,he.normalmap,he.displacementmap,{opacity:{value:1}}]),vertexShader:je.meshnormal_vert,fragmentShader:je.meshnormal_frag},sprite:{uniforms:fn([he.sprite,he.fog]),vertexShader:je.sprite_vert,fragmentShader:je.sprite_frag},background:{uniforms:{uvTransform:{value:new We},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:je.background_vert,fragmentShader:je.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new We}},vertexShader:je.backgroundCube_vert,fragmentShader:je.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:je.cube_vert,fragmentShader:je.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:je.equirect_vert,fragmentShader:je.equirect_frag},distance:{uniforms:fn([he.common,he.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:je.distance_vert,fragmentShader:je.distance_frag},shadow:{uniforms:fn([he.lights,he.fog,{color:{value:new te(0)},opacity:{value:1}}]),vertexShader:je.shadow_vert,fragmentShader:je.shadow_frag}};xi.physical={uniforms:fn([xi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new We},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new We},clearcoatNormalScale:{value:new _e(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new We},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new We},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new We},sheen:{value:0},sheenColor:{value:new te(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new We},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new We},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new We},transmissionSamplerSize:{value:new _e},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new We},attenuationDistance:{value:0},attenuationColor:{value:new te(0)},specularColor:{value:new te(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new We},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new We},anisotropyVector:{value:new _e},anisotropyMap:{value:null},anisotropyMapTransform:{value:new We}}]),vertexShader:je.meshphysical_vert,fragmentShader:je.meshphysical_frag};const ql={r:0,b:0,g:0},Vr=new di,zb=new ht;function Vb(t,e,n,i,r,s){const o=new te(0);let c=r===!0?0:1,l,f,d=null,a=0,u=null;function h(_){let x=_.isScene===!0?_.background:null;if(x&&x.isTexture){const S=_.backgroundBlurriness>0;x=e.get(x,S)}return x}function m(_){let x=!1;const S=h(_);S===null?g(o,c):S&&S.isColor&&(g(S,1),x=!0);const b=t.xr.getEnvironmentBlendMode();b==="additive"?n.buffers.color.setClear(0,0,0,1,s):b==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,s),(t.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function v(_,x){const S=h(x);S&&(S.isCubeTexture||S.mapping===Su)?(f===void 0&&(f=new mn(new Wa(1,1,1),new Tt({name:"BackgroundCubeMaterial",uniforms:Mo(xi.backgroundCube.uniforms),vertexShader:xi.backgroundCube.vertexShader,fragmentShader:xi.backgroundCube.fragmentShader,side:En,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),f.geometry.deleteAttribute("normal"),f.geometry.deleteAttribute("uv"),f.onBeforeRender=function(b,M,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(f.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(f)),Vr.copy(x.backgroundRotation),Vr.x*=-1,Vr.y*=-1,Vr.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(Vr.y*=-1,Vr.z*=-1),f.material.uniforms.envMap.value=S,f.material.uniforms.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,f.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,f.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,f.material.uniforms.backgroundRotation.value.setFromMatrix4(zb.makeRotationFromEuler(Vr)),f.material.toneMapped=Je.getTransfer(S.colorSpace)!==ct,(d!==S||a!==S.version||u!==t.toneMapping)&&(f.material.needsUpdate=!0,d=S,a=S.version,u=t.toneMapping),f.layers.enableAll(),_.unshift(f,f.geometry,f.material,0,0,null)):S&&S.isTexture&&(l===void 0&&(l=new mn(new Xa(2,2),new Tt({name:"BackgroundMaterial",uniforms:Mo(xi.background.uniforms),vertexShader:xi.background.vertexShader,fragmentShader:xi.background.fragmentShader,side:Cr,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=S,l.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,l.material.toneMapped=Je.getTransfer(S.colorSpace)!==ct,S.matrixAutoUpdate===!0&&S.updateMatrix(),l.material.uniforms.uvTransform.value.copy(S.matrix),(d!==S||a!==S.version||u!==t.toneMapping)&&(l.material.needsUpdate=!0,d=S,a=S.version,u=t.toneMapping),l.layers.enableAll(),_.unshift(l,l.geometry,l.material,0,0,null))}function g(_,x){_.getRGB(ql,sy(t)),n.buffers.color.setClear(ql.r,ql.g,ql.b,x,s)}function p(){f!==void 0&&(f.geometry.dispose(),f.material.dispose(),f=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(_,x=1){o.set(_),c=x,g(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(_){c=_,g(o,c)},render:m,addToRenderList:v,dispose:p}}function Hb(t,e){const n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},r=u(null);let s=r,o=!1;function c(C,N,P,U,V){let O=!1;const H=a(C,U,P,N);s!==H&&(s=H,f(s.object)),O=h(C,U,P,V),O&&m(C,U,P,V),V!==null&&e.update(V,t.ELEMENT_ARRAY_BUFFER),(O||o)&&(o=!1,S(C,N,P,U),V!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get(V).buffer))}function l(){return t.createVertexArray()}function f(C){return t.bindVertexArray(C)}function d(C){return t.deleteVertexArray(C)}function a(C,N,P,U){const V=U.wireframe===!0;let O=i[N.id];O===void 0&&(O={},i[N.id]=O);const H=C.isInstancedMesh===!0?C.id:0;let z=O[H];z===void 0&&(z={},O[H]=z);let X=z[P.id];X===void 0&&(X={},z[P.id]=X);let J=X[V];return J===void 0&&(J=u(l()),X[V]=J),J}function u(C){const N=[],P=[],U=[];for(let V=0;V<n;V++)N[V]=0,P[V]=0,U[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:P,attributeDivisors:U,object:C,attributes:{},index:null}}function h(C,N,P,U){const V=s.attributes,O=N.attributes;let H=0;const z=P.getAttributes();for(const X in z)if(z[X].location>=0){const Q=V[X];let ie=O[X];if(ie===void 0&&(X==="instanceMatrix"&&C.instanceMatrix&&(ie=C.instanceMatrix),X==="instanceColor"&&C.instanceColor&&(ie=C.instanceColor)),Q===void 0||Q.attribute!==ie||ie&&Q.data!==ie.data)return!0;H++}return s.attributesNum!==H||s.index!==U}function m(C,N,P,U){const V={},O=N.attributes;let H=0;const z=P.getAttributes();for(const X in z)if(z[X].location>=0){let Q=O[X];Q===void 0&&(X==="instanceMatrix"&&C.instanceMatrix&&(Q=C.instanceMatrix),X==="instanceColor"&&C.instanceColor&&(Q=C.instanceColor));const ie={};ie.attribute=Q,Q&&Q.data&&(ie.data=Q.data),V[X]=ie,H++}s.attributes=V,s.attributesNum=H,s.index=U}function v(){const C=s.newAttributes;for(let N=0,P=C.length;N<P;N++)C[N]=0}function g(C){p(C,0)}function p(C,N){const P=s.newAttributes,U=s.enabledAttributes,V=s.attributeDivisors;P[C]=1,U[C]===0&&(t.enableVertexAttribArray(C),U[C]=1),V[C]!==N&&(t.vertexAttribDivisor(C,N),V[C]=N)}function _(){const C=s.newAttributes,N=s.enabledAttributes;for(let P=0,U=N.length;P<U;P++)N[P]!==C[P]&&(t.disableVertexAttribArray(P),N[P]=0)}function x(C,N,P,U,V,O,H){H===!0?t.vertexAttribIPointer(C,N,P,V,O):t.vertexAttribPointer(C,N,P,U,V,O)}function S(C,N,P,U){v();const V=U.attributes,O=P.getAttributes(),H=N.defaultAttributeValues;for(const z in O){const X=O[z];if(X.location>=0){let J=V[z];if(J===void 0&&(z==="instanceMatrix"&&C.instanceMatrix&&(J=C.instanceMatrix),z==="instanceColor"&&C.instanceColor&&(J=C.instanceColor)),J!==void 0){const Q=J.normalized,ie=J.itemSize,Fe=e.get(J);if(Fe===void 0)continue;const Ze=Fe.buffer,rt=Fe.type,Y=Fe.bytesPerElement,re=rt===t.INT||rt===t.UNSIGNED_INT||J.gpuType===Hp;if(J.isInterleavedBufferAttribute){const ne=J.data,ue=ne.stride,Re=J.offset;if(ne.isInstancedInterleavedBuffer){for(let De=0;De<X.locationSize;De++)p(X.location+De,ne.meshPerAttribute);C.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let De=0;De<X.locationSize;De++)g(X.location+De);t.bindBuffer(t.ARRAY_BUFFER,Ze);for(let De=0;De<X.locationSize;De++)x(X.location+De,ie/X.locationSize,rt,Q,ue*Y,(Re+ie/X.locationSize*De)*Y,re)}else{if(J.isInstancedBufferAttribute){for(let ne=0;ne<X.locationSize;ne++)p(X.location+ne,J.meshPerAttribute);C.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let ne=0;ne<X.locationSize;ne++)g(X.location+ne);t.bindBuffer(t.ARRAY_BUFFER,Ze);for(let ne=0;ne<X.locationSize;ne++)x(X.location+ne,ie/X.locationSize,rt,Q,ie*Y,ie/X.locationSize*ne*Y,re)}}else if(H!==void 0){const Q=H[z];if(Q!==void 0)switch(Q.length){case 2:t.vertexAttrib2fv(X.location,Q);break;case 3:t.vertexAttrib3fv(X.location,Q);break;case 4:t.vertexAttrib4fv(X.location,Q);break;default:t.vertexAttrib1fv(X.location,Q)}}}}_()}function b(){w();for(const C in i){const N=i[C];for(const P in N){const U=N[P];for(const V in U){const O=U[V];for(const H in O)d(O[H].object),delete O[H];delete U[V]}}delete i[C]}}function M(C){if(i[C.id]===void 0)return;const N=i[C.id];for(const P in N){const U=N[P];for(const V in U){const O=U[V];for(const H in O)d(O[H].object),delete O[H];delete U[V]}}delete i[C.id]}function T(C){for(const N in i){const P=i[N];for(const U in P){const V=P[U];if(V[C.id]===void 0)continue;const O=V[C.id];for(const H in O)d(O[H].object),delete O[H];delete V[C.id]}}}function y(C){for(const N in i){const P=i[N],U=C.isInstancedMesh===!0?C.id:0,V=P[U];if(V!==void 0){for(const O in V){const H=V[O];for(const z in H)d(H[z].object),delete H[z];delete V[O]}delete P[U],Object.keys(P).length===0&&delete i[N]}}}function w(){D(),o=!0,s!==r&&(s=r,f(s.object))}function D(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:c,reset:w,resetDefaultState:D,dispose:b,releaseStatesOfGeometry:M,releaseStatesOfObject:y,releaseStatesOfProgram:T,initAttributes:v,enableAttribute:g,disableUnusedAttributes:_}}function Gb(t,e,n){let i;function r(f){i=f}function s(f,d){t.drawArrays(i,f,d),n.update(d,i,1)}function o(f,d,a){a!==0&&(t.drawArraysInstanced(i,f,d,a),n.update(d,i,a))}function c(f,d,a){if(a===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,f,0,d,0,a);let h=0;for(let m=0;m<a;m++)h+=d[m];n.update(h,i,1)}function l(f,d,a,u){if(a===0)return;const h=e.get("WEBGL_multi_draw");if(h===null)for(let m=0;m<f.length;m++)o(f[m],d[m],u[m]);else{h.multiDrawArraysInstancedWEBGL(i,f,0,d,0,u,0,a);let m=0;for(let v=0;v<a;v++)m+=d[v]*u[v];n.update(m,i,1)}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=c,this.renderMultiDrawInstances=l}function Wb(t,e,n,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const T=e.get("EXT_texture_filter_anisotropic");r=t.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(T){return!(T!==ai&&i.convert(T)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function c(T){const y=T===Fn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(T!==Dn&&i.convert(T)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==oi&&!y)}function l(T){if(T==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let f=n.precision!==void 0?n.precision:"highp";const d=l(f);d!==f&&(Oe("WebGLRenderer:",f,"not supported, using",d,"instead."),f=d);const a=n.logarithmicDepthBuffer===!0,u=n.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),h=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),m=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=t.getParameter(t.MAX_TEXTURE_SIZE),g=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),p=t.getParameter(t.MAX_VERTEX_ATTRIBS),_=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),x=t.getParameter(t.MAX_VARYING_VECTORS),S=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),b=t.getParameter(t.MAX_SAMPLES),M=t.getParameter(t.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:c,precision:f,logarithmicDepthBuffer:a,reversedDepthBuffer:u,maxTextures:h,maxVertexTextures:m,maxTextureSize:v,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:_,maxVaryings:x,maxFragmentUniforms:S,maxSamples:b,samples:M}}function Xb(t){const e=this;let n=null,i=0,r=!1,s=!1;const o=new fr,c=new We,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(a,u){const h=a.length!==0||u||i!==0||r;return r=u,i=a.length,h},this.beginShadows=function(){s=!0,d(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(a,u){n=d(a,u,0)},this.setState=function(a,u,h){const m=a.clippingPlanes,v=a.clipIntersection,g=a.clipShadows,p=t.get(a);if(!r||m===null||m.length===0||s&&!g)s?d(null):f();else{const _=s?0:i,x=_*4;let S=p.clippingState||null;l.value=S,S=d(m,u,x,h);for(let b=0;b!==x;++b)S[b]=n[b];p.clippingState=S,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=_}};function f(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function d(a,u,h,m){const v=a!==null?a.length:0;let g=null;if(v!==0){if(g=l.value,m!==!0||g===null){const p=h+v*4,_=u.matrixWorldInverse;c.getNormalMatrix(_),(g===null||g.length<p)&&(g=new Float32Array(p));for(let x=0,S=h;x!==v;++x,S+=4)o.copy(a[x]).applyMatrix4(_,c),o.normal.toArray(g,S),g[S+3]=o.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,g}}const _r=4,m0=[.125,.215,.35,.446,.526,.582],Yr=20,jb=256,Yo=new Tu,g0=new te;let kf=null,Bf=0,zf=0,Vf=!1;const $b=new R;class _0{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,n=0,i=.1,r=100,s={}){const{size:o=256,position:c=$b}=s;kf=this._renderer.getRenderTarget(),Bf=this._renderer.getActiveCubeFace(),zf=this._renderer.getActiveMipmapLevel(),Vf=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,r,l,c),n>0&&this._blur(l,0,0,n),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=y0(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=x0(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(kf,Bf,zf),this._renderer.xr.enabled=Vf,e.scissorTest=!1,Us(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===as||e.mapping===vo?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),kf=this._renderer.getRenderTarget(),Bf=this._renderer.getActiveCubeFace(),zf=this._renderer.getActiveMipmapLevel(),Vf=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:an,minFilter:an,generateMipmaps:!1,type:Fn,format:ai,colorSpace:yo,depthBuffer:!1},r=v0(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=v0(e,n,i);const{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=Yb(s)),this._blurMaterial=Kb(s,e,n),this._ggxMaterial=qb(s,e,n)}return r}_compileMaterial(e){const n=new mn(new Ve,e);this._renderer.compile(n,Yo)}_sceneToCubeUV(e,n,i,r,s){const l=new Ln(90,1,n,i),f=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],a=this._renderer,u=a.autoClear,h=a.toneMapping;a.getClearColor(g0),a.toneMapping=Ti,a.autoClear=!1,a.state.buffers.depth.getReversed()&&(a.setRenderTarget(r),a.clearDepth(),a.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new mn(new Wa,new So({name:"PMREM.Background",side:En,depthWrite:!1,depthTest:!1})));const v=this._backgroundBox,g=v.material;let p=!1;const _=e.background;_?_.isColor&&(g.color.copy(_),e.background=null,p=!0):(g.color.copy(g0),p=!0);for(let x=0;x<6;x++){const S=x%3;S===0?(l.up.set(0,f[x],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+d[x],s.y,s.z)):S===1?(l.up.set(0,0,f[x]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+d[x],s.z)):(l.up.set(0,f[x],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+d[x]));const b=this._cubeSize;Us(r,S*b,x>2?b:0,b,b),a.setRenderTarget(r),p&&a.render(v,l),a.render(e,l)}a.toneMapping=h,a.autoClear=u,e.background=_}_textureToCubeUV(e,n){const i=this._renderer,r=e.mapping===as||e.mapping===vo;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=y0()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=x0());const s=r?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=s;const c=s.uniforms;c.envMap.value=e;const l=this._cubeSize;Us(n,0,0,3*l,2*l),i.setRenderTarget(n),i.render(o,Yo)}_applyPMREM(e){const n=this._renderer,i=n.autoClear;n.autoClear=!1;const r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(e,s-1,s);n.autoClear=i}_applyGGXFilter(e,n,i){const r=this._renderer,s=this._pingPongRenderTarget,o=this._ggxMaterial,c=this._lodMeshes[i];c.material=o;const l=o.uniforms,f=i/(this._lodMeshes.length-1),d=n/(this._lodMeshes.length-1),a=Math.sqrt(f*f-d*d),u=0+f*1.25,h=a*u,{_lodMax:m}=this,v=this._sizeLods[i],g=3*v*(i>m-_r?i-m+_r:0),p=4*(this._cubeSize-v);l.envMap.value=e.texture,l.roughness.value=h,l.mipInt.value=m-n,Us(s,g,p,3*v,2*v),r.setRenderTarget(s),r.render(c,Yo),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=m-i,Us(e,g,p,3*v,2*v),r.setRenderTarget(e),r.render(c,Yo)}_blur(e,n,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,n,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,n,i,r,s,o,c){const l=this._renderer,f=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&Qe("blur direction must be either latitudinal or longitudinal!");const d=3,a=this._lodMeshes[r];a.material=f;const u=f.uniforms,h=this._sizeLods[i]-1,m=isFinite(s)?Math.PI/(2*h):2*Math.PI/(2*Yr-1),v=s/m,g=isFinite(s)?1+Math.floor(d*v):Yr;g>Yr&&Oe(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Yr}`);const p=[];let _=0;for(let T=0;T<Yr;++T){const y=T/v,w=Math.exp(-y*y/2);p.push(w),T===0?_+=w:T<g&&(_+=2*w)}for(let T=0;T<p.length;T++)p[T]=p[T]/_;u.envMap.value=e.texture,u.samples.value=g,u.weights.value=p,u.latitudinal.value=o==="latitudinal",c&&(u.poleAxis.value=c);const{_lodMax:x}=this;u.dTheta.value=m,u.mipInt.value=x-i;const S=this._sizeLods[r],b=3*S*(r>x-_r?r-x+_r:0),M=4*(this._cubeSize-S);Us(n,b,M,3*S,2*S),l.setRenderTarget(n),l.render(a,Yo)}}function Yb(t){const e=[],n=[],i=[];let r=t;const s=t-_r+1+m0.length;for(let o=0;o<s;o++){const c=Math.pow(2,r);e.push(c);let l=1/c;o>t-_r?l=m0[o-t+_r-1]:o===0&&(l=0),n.push(l);const f=1/(c-2),d=-f,a=1+f,u=[d,d,a,d,a,a,d,d,a,a,d,a],h=6,m=6,v=3,g=2,p=1,_=new Float32Array(v*m*h),x=new Float32Array(g*m*h),S=new Float32Array(p*m*h);for(let M=0;M<h;M++){const T=M%3*2/3-1,y=M>2?0:-1,w=[T,y,0,T+2/3,y,0,T+2/3,y+1,0,T,y,0,T+2/3,y+1,0,T,y+1,0];_.set(w,v*m*M),x.set(u,g*m*M);const D=[M,M,M,M,M,M];S.set(D,p*m*M)}const b=new Ve;b.setAttribute("position",new He(_,v)),b.setAttribute("uv",new He(x,g)),b.setAttribute("faceIndex",new He(S,p)),i.push(new mn(b,null)),r>_r&&r--}return{lodMeshes:i,sizeLods:e,sigmas:n}}function v0(t,e,n){const i=new Tn(t,e,n);return i.texture.mapping=Su,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Us(t,e,n,i,r){t.viewport.set(e,n,i,r),t.scissor.set(e,n,i,r)}function qb(t,e,n){return new Tt({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:jb,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:bu(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Ei,depthTest:!1,depthWrite:!1})}function Kb(t,e,n){const i=new Float32Array(Yr),r=new R(0,1,0);return new Tt({name:"SphericalGaussianBlur",defines:{n:Yr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:bu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Ei,depthTest:!1,depthWrite:!1})}function x0(){return new Tt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:bu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Ei,depthTest:!1,depthWrite:!1})}function y0(){return new Tt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:bu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ei,depthTest:!1,depthWrite:!1})}function bu(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class cy extends Tn{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new Zx(r),this._setTextureOptions(n),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Wa(5,5,5),s=new Tt({name:"CubemapFromEquirect",uniforms:Mo(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:En,blending:Ei});s.uniforms.tEquirect.value=n;const o=new mn(r,s),c=n.minFilter;return n.minFilter===Qr&&(n.minFilter=an),new eE(1,10,this).update(e,o),n.minFilter=c,o.geometry.dispose(),o.material.dispose(),this}clear(e,n=!0,i=!0,r=!0){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(n,i,r);e.setRenderTarget(s)}}function Zb(t){let e=new WeakMap,n=new WeakMap,i=null;function r(u,h=!1){return u==null?null:h?o(u):s(u)}function s(u){if(u&&u.isTexture){const h=u.mapping;if(h===sf||h===of)if(e.has(u)){const m=e.get(u).texture;return c(m,u.mapping)}else{const m=u.image;if(m&&m.height>0){const v=new cy(m.height);return v.fromEquirectangularTexture(t,u),e.set(u,v),u.addEventListener("dispose",f),c(v.texture,u.mapping)}else return null}}return u}function o(u){if(u&&u.isTexture){const h=u.mapping,m=h===sf||h===of,v=h===as||h===vo;if(m||v){let g=n.get(u);const p=g!==void 0?g.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==p)return i===null&&(i=new _0(t)),g=m?i.fromEquirectangular(u,g):i.fromCubemap(u,g),g.texture.pmremVersion=u.pmremVersion,n.set(u,g),g.texture;if(g!==void 0)return g.texture;{const _=u.image;return m&&_&&_.height>0||v&&_&&l(_)?(i===null&&(i=new _0(t)),g=m?i.fromEquirectangular(u):i.fromCubemap(u),g.texture.pmremVersion=u.pmremVersion,n.set(u,g),u.addEventListener("dispose",d),g.texture):null}}}return u}function c(u,h){return h===sf?u.mapping=as:h===of&&(u.mapping=vo),u}function l(u){let h=0;const m=6;for(let v=0;v<m;v++)u[v]!==void 0&&h++;return h===m}function f(u){const h=u.target;h.removeEventListener("dispose",f);const m=e.get(h);m!==void 0&&(e.delete(h),m.dispose())}function d(u){const h=u.target;h.removeEventListener("dispose",d);const m=n.get(h);m!==void 0&&(n.delete(h),m.dispose())}function a(){e=new WeakMap,n=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:r,dispose:a}}function Qb(t){const e={};function n(i){if(e[i]!==void 0)return e[i];const r=t.getExtension(i);return e[i]=r,r}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){const r=n(i);return r===null&&Qc("WebGLRenderer: "+i+" extension not supported."),r}}}function Jb(t,e,n,i){const r={},s=new WeakMap;function o(a){const u=a.target;u.index!==null&&e.remove(u.index);for(const m in u.attributes)e.remove(u.attributes[m]);u.removeEventListener("dispose",o),delete r[u.id];const h=s.get(u);h&&(e.remove(h),s.delete(u)),i.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,n.memory.geometries--}function c(a,u){return r[u.id]===!0||(u.addEventListener("dispose",o),r[u.id]=!0,n.memory.geometries++),u}function l(a){const u=a.attributes;for(const h in u)e.update(u[h],t.ARRAY_BUFFER)}function f(a){const u=[],h=a.index,m=a.attributes.position;let v=0;if(m===void 0)return;if(h!==null){const _=h.array;v=h.version;for(let x=0,S=_.length;x<S;x+=3){const b=_[x+0],M=_[x+1],T=_[x+2];u.push(b,M,M,T,T,b)}}else{const _=m.array;v=m.version;for(let x=0,S=_.length/3-1;x<S;x+=3){const b=x+0,M=x+1,T=x+2;u.push(b,M,M,T,T,b)}}const g=new(m.count>=65535?Yx:$x)(u,1);g.version=v;const p=s.get(a);p&&e.remove(p),s.set(a,g)}function d(a){const u=s.get(a);if(u){const h=a.index;h!==null&&u.version<h.version&&f(a)}else f(a);return s.get(a)}return{get:c,update:l,getWireframeAttribute:d}}function eA(t,e,n){let i;function r(u){i=u}let s,o;function c(u){s=u.type,o=u.bytesPerElement}function l(u,h){t.drawElements(i,h,s,u*o),n.update(h,i,1)}function f(u,h,m){m!==0&&(t.drawElementsInstanced(i,h,s,u*o,m),n.update(h,i,m))}function d(u,h,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,h,0,s,u,0,m);let g=0;for(let p=0;p<m;p++)g+=h[p];n.update(g,i,1)}function a(u,h,m,v){if(m===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<u.length;p++)f(u[p]/o,h[p],v[p]);else{g.multiDrawElementsInstancedWEBGL(i,h,0,s,u,0,v,0,m);let p=0;for(let _=0;_<m;_++)p+=h[_]*v[_];n.update(p,i,1)}}this.setMode=r,this.setIndex=c,this.render=l,this.renderInstances=f,this.renderMultiDraw=d,this.renderMultiDrawInstances=a}function tA(t){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,c){switch(n.calls++,o){case t.TRIANGLES:n.triangles+=c*(s/3);break;case t.LINES:n.lines+=c*(s/2);break;case t.LINE_STRIP:n.lines+=c*(s-1);break;case t.LINE_LOOP:n.lines+=c*s;break;case t.POINTS:n.points+=c*s;break;default:Qe("WebGLInfo: Unknown draw mode:",o);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:r,update:i}}function nA(t,e,n){const i=new WeakMap,r=new Lt;function s(o,c,l){const f=o.morphTargetInfluences,d=c.morphAttributes.position||c.morphAttributes.normal||c.morphAttributes.color,a=d!==void 0?d.length:0;let u=i.get(c);if(u===void 0||u.count!==a){let w=function(){T.dispose(),i.delete(c),c.removeEventListener("dispose",w)};u!==void 0&&u.texture.dispose();const h=c.morphAttributes.position!==void 0,m=c.morphAttributes.normal!==void 0,v=c.morphAttributes.color!==void 0,g=c.morphAttributes.position||[],p=c.morphAttributes.normal||[],_=c.morphAttributes.color||[];let x=0;h===!0&&(x=1),m===!0&&(x=2),v===!0&&(x=3);let S=c.attributes.position.count*x,b=1;S>e.maxTextureSize&&(b=Math.ceil(S/e.maxTextureSize),S=e.maxTextureSize);const M=new Float32Array(S*b*4*a),T=new Gx(M,S,b,a);T.type=oi,T.needsUpdate=!0;const y=x*4;for(let D=0;D<a;D++){const C=g[D],N=p[D],P=_[D],U=S*b*4*D;for(let V=0;V<C.count;V++){const O=V*y;h===!0&&(r.fromBufferAttribute(C,V),M[U+O+0]=r.x,M[U+O+1]=r.y,M[U+O+2]=r.z,M[U+O+3]=0),m===!0&&(r.fromBufferAttribute(N,V),M[U+O+4]=r.x,M[U+O+5]=r.y,M[U+O+6]=r.z,M[U+O+7]=0),v===!0&&(r.fromBufferAttribute(P,V),M[U+O+8]=r.x,M[U+O+9]=r.y,M[U+O+10]=r.z,M[U+O+11]=P.itemSize===4?r.w:1)}}u={count:a,texture:T,size:new _e(S,b)},i.set(c,u),c.addEventListener("dispose",w)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(t,"morphTexture",o.morphTexture,n);else{let h=0;for(let v=0;v<f.length;v++)h+=f[v];const m=c.morphTargetsRelative?1:1-h;l.getUniforms().setValue(t,"morphTargetBaseInfluence",m),l.getUniforms().setValue(t,"morphTargetInfluences",f)}l.getUniforms().setValue(t,"morphTargetsTexture",u.texture,n),l.getUniforms().setValue(t,"morphTargetsTextureSize",u.size)}return{update:s}}function iA(t,e,n,i,r){let s=new WeakMap;function o(f){const d=r.render.frame,a=f.geometry,u=e.get(f,a);if(s.get(u)!==d&&(e.update(u),s.set(u,d)),f.isInstancedMesh&&(f.hasEventListener("dispose",l)===!1&&f.addEventListener("dispose",l),s.get(f)!==d&&(n.update(f.instanceMatrix,t.ARRAY_BUFFER),f.instanceColor!==null&&n.update(f.instanceColor,t.ARRAY_BUFFER),s.set(f,d))),f.isSkinnedMesh){const h=f.skeleton;s.get(h)!==d&&(h.update(),s.set(h,d))}return u}function c(){s=new WeakMap}function l(f){const d=f.target;d.removeEventListener("dispose",l),i.releaseStatesOfObject(d),n.remove(d.instanceMatrix),d.instanceColor!==null&&n.remove(d.instanceColor)}return{update:o,dispose:c}}const rA={[Cx]:"LINEAR_TONE_MAPPING",[Rx]:"REINHARD_TONE_MAPPING",[Px]:"CINEON_TONE_MAPPING",[Lx]:"ACES_FILMIC_TONE_MAPPING",[Ix]:"AGX_TONE_MAPPING",[Nx]:"NEUTRAL_TONE_MAPPING",[Dx]:"CUSTOM_TONE_MAPPING"};function sA(t,e,n,i,r){const s=new Tn(e,n,{type:t,depthBuffer:i,stencilBuffer:r}),o=new Tn(e,n,{type:Fn,depthBuffer:!1,stencilBuffer:!1}),c=new Ve;c.setAttribute("position",new it([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new it([0,2,0,0,2,0],2));const l=new Yw({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),f=new mn(c,l),d=new Tu(-1,1,1,-1,0,1);let a=null,u=null,h=!1,m,v=null,g=[],p=!1;this.setSize=function(_,x){s.setSize(_,x),o.setSize(_,x);for(let S=0;S<g.length;S++){const b=g[S];b.setSize&&b.setSize(_,x)}},this.setEffects=function(_){g=_,p=g.length>0&&g[0].isRenderPass===!0;const x=s.width,S=s.height;for(let b=0;b<g.length;b++){const M=g[b];M.setSize&&M.setSize(x,S)}},this.begin=function(_,x){if(h||_.toneMapping===Ti&&g.length===0)return!1;if(v=x,x!==null){const S=x.width,b=x.height;(s.width!==S||s.height!==b)&&this.setSize(S,b)}return p===!1&&_.setRenderTarget(s),m=_.toneMapping,_.toneMapping=Ti,!0},this.hasRenderPass=function(){return p},this.end=function(_,x){_.toneMapping=m,h=!0;let S=s,b=o;for(let M=0;M<g.length;M++){const T=g[M];if(T.enabled!==!1&&(T.render(_,b,S,x),T.needsSwap!==!1)){const y=S;S=b,b=y}}if(a!==_.outputColorSpace||u!==_.toneMapping){a=_.outputColorSpace,u=_.toneMapping,l.defines={},Je.getTransfer(a)===ct&&(l.defines.SRGB_TRANSFER="");const M=rA[u];M&&(l.defines[M]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=S.texture,_.setRenderTarget(v),_.render(f,d),v=null,h=!1},this.isCompositing=function(){return h},this.dispose=function(){s.dispose(),o.dispose(),c.dispose(),l.dispose()}}const uy=new ln,Bh=new Fa(1,1),fy=new Gx,dy=new Mw,hy=new Zx,S0=[],M0=[],w0=new Float32Array(16),E0=new Float32Array(9),T0=new Float32Array(4);function Ao(t,e,n){const i=t[0];if(i<=0||i>0)return t;const r=e*n;let s=S0[r];if(s===void 0&&(s=new Float32Array(r),S0[r]=s),e!==0){i.toArray(s,0);for(let o=1,c=0;o!==e;++o)c+=n,t[o].toArray(s,c)}return s}function Vt(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function Ht(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function Au(t,e){let n=M0[e];n===void 0&&(n=new Int32Array(e),M0[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function oA(t,e){const n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function aA(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Vt(n,e))return;t.uniform2fv(this.addr,e),Ht(n,e)}}function lA(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(Vt(n,e))return;t.uniform3fv(this.addr,e),Ht(n,e)}}function cA(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Vt(n,e))return;t.uniform4fv(this.addr,e),Ht(n,e)}}function uA(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Vt(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),Ht(n,e)}else{if(Vt(n,i))return;T0.set(i),t.uniformMatrix2fv(this.addr,!1,T0),Ht(n,i)}}function fA(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Vt(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),Ht(n,e)}else{if(Vt(n,i))return;E0.set(i),t.uniformMatrix3fv(this.addr,!1,E0),Ht(n,i)}}function dA(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Vt(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),Ht(n,e)}else{if(Vt(n,i))return;w0.set(i),t.uniformMatrix4fv(this.addr,!1,w0),Ht(n,i)}}function hA(t,e){const n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function pA(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Vt(n,e))return;t.uniform2iv(this.addr,e),Ht(n,e)}}function mA(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Vt(n,e))return;t.uniform3iv(this.addr,e),Ht(n,e)}}function gA(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Vt(n,e))return;t.uniform4iv(this.addr,e),Ht(n,e)}}function _A(t,e){const n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function vA(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Vt(n,e))return;t.uniform2uiv(this.addr,e),Ht(n,e)}}function xA(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Vt(n,e))return;t.uniform3uiv(this.addr,e),Ht(n,e)}}function yA(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Vt(n,e))return;t.uniform4uiv(this.addr,e),Ht(n,e)}}function SA(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r);let s;this.type===t.SAMPLER_2D_SHADOW?(Bh.compareFunction=n.isReversedDepthBuffer()?Zp:Kp,s=Bh):s=uy,n.setTexture2D(e||s,r)}function MA(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(e||dy,r)}function wA(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(e||hy,r)}function EA(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(e||fy,r)}function TA(t){switch(t){case 5126:return oA;case 35664:return aA;case 35665:return lA;case 35666:return cA;case 35674:return uA;case 35675:return fA;case 35676:return dA;case 5124:case 35670:return hA;case 35667:case 35671:return pA;case 35668:case 35672:return mA;case 35669:case 35673:return gA;case 5125:return _A;case 36294:return vA;case 36295:return xA;case 36296:return yA;case 35678:case 36198:case 36298:case 36306:case 35682:return SA;case 35679:case 36299:case 36307:return MA;case 35680:case 36300:case 36308:case 36293:return wA;case 36289:case 36303:case 36311:case 36292:return EA}}function bA(t,e){t.uniform1fv(this.addr,e)}function AA(t,e){const n=Ao(e,this.size,2);t.uniform2fv(this.addr,n)}function CA(t,e){const n=Ao(e,this.size,3);t.uniform3fv(this.addr,n)}function RA(t,e){const n=Ao(e,this.size,4);t.uniform4fv(this.addr,n)}function PA(t,e){const n=Ao(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function LA(t,e){const n=Ao(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function DA(t,e){const n=Ao(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function IA(t,e){t.uniform1iv(this.addr,e)}function NA(t,e){t.uniform2iv(this.addr,e)}function UA(t,e){t.uniform3iv(this.addr,e)}function FA(t,e){t.uniform4iv(this.addr,e)}function OA(t,e){t.uniform1uiv(this.addr,e)}function kA(t,e){t.uniform2uiv(this.addr,e)}function BA(t,e){t.uniform3uiv(this.addr,e)}function zA(t,e){t.uniform4uiv(this.addr,e)}function VA(t,e,n){const i=this.cache,r=e.length,s=Au(n,r);Vt(i,s)||(t.uniform1iv(this.addr,s),Ht(i,s));let o;this.type===t.SAMPLER_2D_SHADOW?o=Bh:o=uy;for(let c=0;c!==r;++c)n.setTexture2D(e[c]||o,s[c])}function HA(t,e,n){const i=this.cache,r=e.length,s=Au(n,r);Vt(i,s)||(t.uniform1iv(this.addr,s),Ht(i,s));for(let o=0;o!==r;++o)n.setTexture3D(e[o]||dy,s[o])}function GA(t,e,n){const i=this.cache,r=e.length,s=Au(n,r);Vt(i,s)||(t.uniform1iv(this.addr,s),Ht(i,s));for(let o=0;o!==r;++o)n.setTextureCube(e[o]||hy,s[o])}function WA(t,e,n){const i=this.cache,r=e.length,s=Au(n,r);Vt(i,s)||(t.uniform1iv(this.addr,s),Ht(i,s));for(let o=0;o!==r;++o)n.setTexture2DArray(e[o]||fy,s[o])}function XA(t){switch(t){case 5126:return bA;case 35664:return AA;case 35665:return CA;case 35666:return RA;case 35674:return PA;case 35675:return LA;case 35676:return DA;case 5124:case 35670:return IA;case 35667:case 35671:return NA;case 35668:case 35672:return UA;case 35669:case 35673:return FA;case 5125:return OA;case 36294:return kA;case 36295:return BA;case 36296:return zA;case 35678:case 36198:case 36298:case 36306:case 35682:return VA;case 35679:case 36299:case 36307:return HA;case 35680:case 36300:case 36308:case 36293:return GA;case 36289:case 36303:case 36311:case 36292:return WA}}class jA{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=TA(n.type)}}class $A{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=XA(n.type)}}class YA{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const c=r[s];c.setValue(e,n[c.id],i)}}}const Hf=/(\w+)(\])?(\[|\.)?/g;function b0(t,e){t.seq.push(e),t.map[e.id]=e}function qA(t,e,n){const i=t.name,r=i.length;for(Hf.lastIndex=0;;){const s=Hf.exec(i),o=Hf.lastIndex;let c=s[1];const l=s[2]==="]",f=s[3];if(l&&(c=c|0),f===void 0||f==="["&&o+2===r){b0(n,f===void 0?new jA(c,t,e):new $A(c,t,e));break}else{let a=n.map[c];a===void 0&&(a=new YA(c),b0(n,a)),n=a}}}class yc{constructor(e,n){this.seq=[],this.map={};const i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){const c=e.getActiveUniform(n,o),l=e.getUniformLocation(n,c.name);qA(c,l,this)}const r=[],s=[];for(const o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(o):s.push(o);r.length>0&&(this.seq=r.concat(s))}setValue(e,n,i,r){const s=this.map[n];s!==void 0&&s.setValue(e,i,r)}setOptional(e,n,i){const r=n[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,n,i,r){for(let s=0,o=n.length;s!==o;++s){const c=n[s],l=i[c.id];l.needsUpdate!==!1&&c.setValue(e,l.value,r)}}static seqWithValue(e,n){const i=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in n&&i.push(o)}return i}}function A0(t,e,n){const i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}const KA=37297;let ZA=0;function QA(t,e){const n=t.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,n.length);for(let o=r;o<s;o++){const c=o+1;i.push(`${c===e?">":" "} ${c}: ${n[o]}`)}return i.join(`
`)}const C0=new We;function JA(t){Je._getMatrix(C0,Je.workingColorSpace,t);const e=`mat3( ${C0.elements.map(n=>n.toFixed(4))} )`;switch(Je.getTransfer(t)){case qc:return[e,"LinearTransferOETF"];case ct:return[e,"sRGBTransferOETF"];default:return Oe("WebGLProgram: Unsupported color space: ",t),[e,"LinearTransferOETF"]}}function R0(t,e,n){const i=t.getShaderParameter(e,t.COMPILE_STATUS),s=(t.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";const o=/ERROR: 0:(\d+)/.exec(s);if(o){const c=parseInt(o[1]);return n.toUpperCase()+`

`+s+`

`+QA(t.getShaderSource(e),c)}else return s}function eC(t,e){const n=JA(e);return[`vec4 ${t}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}const tC={[Cx]:"Linear",[Rx]:"Reinhard",[Px]:"Cineon",[Lx]:"ACESFilmic",[Ix]:"AgX",[Nx]:"Neutral",[Dx]:"Custom"};function nC(t,e){const n=tC[e];return n===void 0?(Oe("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+t+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const Kl=new R;function iC(){Je.getLuminanceCoefficients(Kl);const t=Kl.x.toFixed(4),e=Kl.y.toFixed(4),n=Kl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function rC(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(na).join(`
`)}function sC(t){const e=[];for(const n in t){const i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function oC(t,e){const n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=t.getActiveAttrib(e,r),o=s.name;let c=1;s.type===t.FLOAT_MAT2&&(c=2),s.type===t.FLOAT_MAT3&&(c=3),s.type===t.FLOAT_MAT4&&(c=4),n[o]={type:s.type,location:t.getAttribLocation(e,o),locationSize:c}}return n}function na(t){return t!==""}function P0(t,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function L0(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const aC=/^[ \t]*#include +<([\w\d./]+)>/gm;function zh(t){return t.replace(aC,cC)}const lC=new Map;function cC(t,e){let n=je[e];if(n===void 0){const i=lC.get(e);if(i!==void 0)n=je[i],Oe('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return zh(n)}const uC=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function D0(t){return t.replace(uC,fC)}function fC(t,e,n,i){let r="";for(let s=parseInt(e);s<parseInt(n);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function I0(t){let e=`precision ${t.precision} float;
	precision ${t.precision} int;
	precision ${t.precision} sampler2D;
	precision ${t.precision} samplerCube;
	precision ${t.precision} sampler3D;
	precision ${t.precision} sampler2DArray;
	precision ${t.precision} sampler2DShadow;
	precision ${t.precision} samplerCubeShadow;
	precision ${t.precision} sampler2DArrayShadow;
	precision ${t.precision} isampler2D;
	precision ${t.precision} isampler3D;
	precision ${t.precision} isamplerCube;
	precision ${t.precision} isampler2DArray;
	precision ${t.precision} usampler2D;
	precision ${t.precision} usampler3D;
	precision ${t.precision} usamplerCube;
	precision ${t.precision} usampler2DArray;
	`;return t.precision==="highp"?e+=`
#define HIGH_PRECISION`:t.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:t.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const dC={[mc]:"SHADOWMAP_TYPE_PCF",[ta]:"SHADOWMAP_TYPE_VSM"};function hC(t){return dC[t.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const pC={[as]:"ENVMAP_TYPE_CUBE",[vo]:"ENVMAP_TYPE_CUBE",[Su]:"ENVMAP_TYPE_CUBE_UV"};function mC(t){return t.envMap===!1?"ENVMAP_TYPE_CUBE":pC[t.envMapMode]||"ENVMAP_TYPE_CUBE"}const gC={[vo]:"ENVMAP_MODE_REFRACTION"};function _C(t){return t.envMap===!1?"ENVMAP_MODE_REFLECTION":gC[t.envMapMode]||"ENVMAP_MODE_REFLECTION"}const vC={[Vp]:"ENVMAP_BLENDING_MULTIPLY",[k1]:"ENVMAP_BLENDING_MIX",[B1]:"ENVMAP_BLENDING_ADD"};function xC(t){return t.envMap===!1?"ENVMAP_BLENDING_NONE":vC[t.combine]||"ENVMAP_BLENDING_NONE"}function yC(t){const e=t.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),7*16)),texelHeight:i,maxMip:n}}function SC(t,e,n,i){const r=t.getContext(),s=n.defines;let o=n.vertexShader,c=n.fragmentShader;const l=hC(n),f=mC(n),d=_C(n),a=xC(n),u=yC(n),h=rC(n),m=sC(s),v=r.createProgram();let g,p,_=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(g=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,m].filter(na).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,m].filter(na).join(`
`),p.length>0&&(p+=`
`)):(g=[I0(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,m,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+d:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(na).join(`
`),p=[I0(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,m,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+f:"",n.envMap?"#define "+d:"",n.envMap?"#define "+a:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor?"#define USE_COLOR":"",n.vertexAlphas||n.batchingColor?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==Ti?"#define TONE_MAPPING":"",n.toneMapping!==Ti?je.tonemapping_pars_fragment:"",n.toneMapping!==Ti?nC("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",je.colorspace_pars_fragment,eC("linearToOutputTexel",n.outputColorSpace),iC(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(na).join(`
`)),o=zh(o),o=P0(o,n),o=L0(o,n),c=zh(c),c=P0(c,n),c=L0(c,n),o=D0(o),c=D0(c),n.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,g=[h,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",n.glslVersion===Ng?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===Ng?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const x=_+g+o,S=_+p+c,b=A0(r,r.VERTEX_SHADER,x),M=A0(r,r.FRAGMENT_SHADER,S);r.attachShader(v,b),r.attachShader(v,M),n.index0AttributeName!==void 0?r.bindAttribLocation(v,0,n.index0AttributeName):n.morphTargets===!0&&r.bindAttribLocation(v,0,"position"),r.linkProgram(v);function T(C){if(t.debug.checkShaderErrors){const N=r.getProgramInfoLog(v)||"",P=r.getShaderInfoLog(b)||"",U=r.getShaderInfoLog(M)||"",V=N.trim(),O=P.trim(),H=U.trim();let z=!0,X=!0;if(r.getProgramParameter(v,r.LINK_STATUS)===!1)if(z=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(r,v,b,M);else{const J=R0(r,b,"vertex"),Q=R0(r,M,"fragment");Qe("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(v,r.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+V+`
`+J+`
`+Q)}else V!==""?Oe("WebGLProgram: Program Info Log:",V):(O===""||H==="")&&(X=!1);X&&(C.diagnostics={runnable:z,programLog:V,vertexShader:{log:O,prefix:g},fragmentShader:{log:H,prefix:p}})}r.deleteShader(b),r.deleteShader(M),y=new yc(r,v),w=oC(r,v)}let y;this.getUniforms=function(){return y===void 0&&T(this),y};let w;this.getAttributes=function(){return w===void 0&&T(this),w};let D=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return D===!1&&(D=r.getProgramParameter(v,KA)),D},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(v),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=ZA++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=b,this.fragmentShader=M,this}let MC=0;class wC{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const n=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(n),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){const n=this.shaderCache;let i=n.get(e);return i===void 0&&(i=new EC(e),n.set(e,i)),i}}class EC{constructor(e){this.id=MC++,this.code=e,this.usedTimes=0}}function TC(t,e,n,i,r,s){const o=new Wx,c=new wC,l=new Set,f=[],d=new Map,a=i.logarithmicDepthBuffer;let u=i.precision;const h={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(y){return l.add(y),y===0?"uv":`uv${y}`}function v(y,w,D,C,N){const P=C.fog,U=N.geometry,V=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?C.environment:null,O=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap,H=e.get(y.envMap||V,O),z=H&&H.mapping===Su?H.image.height:null,X=h[y.type];y.precision!==null&&(u=i.getMaxPrecision(y.precision),u!==y.precision&&Oe("WebGLProgram.getParameters:",y.precision,"not supported, using",u,"instead."));const J=U.morphAttributes.position||U.morphAttributes.normal||U.morphAttributes.color,Q=J!==void 0?J.length:0;let ie=0;U.morphAttributes.position!==void 0&&(ie=1),U.morphAttributes.normal!==void 0&&(ie=2),U.morphAttributes.color!==void 0&&(ie=3);let Fe,Ze,rt,Y;if(X){const lt=xi[X];Fe=lt.vertexShader,Ze=lt.fragmentShader}else Fe=y.vertexShader,Ze=y.fragmentShader,c.update(y),rt=c.getVertexShaderID(y),Y=c.getFragmentShaderID(y);const re=t.getRenderTarget(),ne=t.state.buffers.depth.getReversed(),ue=N.isInstancedMesh===!0,Re=N.isBatchedMesh===!0,De=!!y.map,pt=!!y.matcap,Xe=!!H,tt=!!y.aoMap,Be=!!y.lightMap,Ue=!!y.bumpMap,ot=!!y.normalMap,I=!!y.displacementMap,Nt=!!y.emissiveMap,at=!!y.metalnessMap,xt=!!y.roughnessMap,Ae=y.anisotropy>0,L=y.clearcoat>0,E=y.dispersion>0,k=y.iridescence>0,Z=y.sheen>0,ee=y.transmission>0,K=Ae&&!!y.anisotropyMap,Me=L&&!!y.clearcoatMap,fe=L&&!!y.clearcoatNormalMap,Ne=L&&!!y.clearcoatRoughnessMap,ke=k&&!!y.iridescenceMap,oe=k&&!!y.iridescenceThicknessMap,le=Z&&!!y.sheenColorMap,we=Z&&!!y.sheenRoughnessMap,Te=!!y.specularMap,ge=!!y.specularColorMap,Ye=!!y.specularIntensityMap,F=ee&&!!y.transmissionMap,de=ee&&!!y.thicknessMap,ce=!!y.gradientMap,ye=!!y.alphaMap,ae=y.alphaTest>0,q=!!y.alphaHash,Ee=!!y.extensions;let ze=Ti;y.toneMapped&&(re===null||re.isXRRenderTarget===!0)&&(ze=t.toneMapping);const yt={shaderID:X,shaderType:y.type,shaderName:y.name,vertexShader:Fe,fragmentShader:Ze,defines:y.defines,customVertexShaderID:rt,customFragmentShaderID:Y,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:u,batching:Re,batchingColor:Re&&N._colorsTexture!==null,instancing:ue,instancingColor:ue&&N.instanceColor!==null,instancingMorph:ue&&N.morphTexture!==null,outputColorSpace:re===null?t.outputColorSpace:re.isXRRenderTarget===!0?re.texture.colorSpace:yo,alphaToCoverage:!!y.alphaToCoverage,map:De,matcap:pt,envMap:Xe,envMapMode:Xe&&H.mapping,envMapCubeUVHeight:z,aoMap:tt,lightMap:Be,bumpMap:Ue,normalMap:ot,displacementMap:I,emissiveMap:Nt,normalMapObjectSpace:ot&&y.normalMapType===H1,normalMapTangentSpace:ot&&y.normalMapType===qp,metalnessMap:at,roughnessMap:xt,anisotropy:Ae,anisotropyMap:K,clearcoat:L,clearcoatMap:Me,clearcoatNormalMap:fe,clearcoatRoughnessMap:Ne,dispersion:E,iridescence:k,iridescenceMap:ke,iridescenceThicknessMap:oe,sheen:Z,sheenColorMap:le,sheenRoughnessMap:we,specularMap:Te,specularColorMap:ge,specularIntensityMap:Ye,transmission:ee,transmissionMap:F,thicknessMap:de,gradientMap:ce,opaque:y.transparent===!1&&y.blending===oo&&y.alphaToCoverage===!1,alphaMap:ye,alphaTest:ae,alphaHash:q,combine:y.combine,mapUv:De&&m(y.map.channel),aoMapUv:tt&&m(y.aoMap.channel),lightMapUv:Be&&m(y.lightMap.channel),bumpMapUv:Ue&&m(y.bumpMap.channel),normalMapUv:ot&&m(y.normalMap.channel),displacementMapUv:I&&m(y.displacementMap.channel),emissiveMapUv:Nt&&m(y.emissiveMap.channel),metalnessMapUv:at&&m(y.metalnessMap.channel),roughnessMapUv:xt&&m(y.roughnessMap.channel),anisotropyMapUv:K&&m(y.anisotropyMap.channel),clearcoatMapUv:Me&&m(y.clearcoatMap.channel),clearcoatNormalMapUv:fe&&m(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ne&&m(y.clearcoatRoughnessMap.channel),iridescenceMapUv:ke&&m(y.iridescenceMap.channel),iridescenceThicknessMapUv:oe&&m(y.iridescenceThicknessMap.channel),sheenColorMapUv:le&&m(y.sheenColorMap.channel),sheenRoughnessMapUv:we&&m(y.sheenRoughnessMap.channel),specularMapUv:Te&&m(y.specularMap.channel),specularColorMapUv:ge&&m(y.specularColorMap.channel),specularIntensityMapUv:Ye&&m(y.specularIntensityMap.channel),transmissionMapUv:F&&m(y.transmissionMap.channel),thicknessMapUv:de&&m(y.thicknessMap.channel),alphaMapUv:ye&&m(y.alphaMap.channel),vertexTangents:!!U.attributes.tangent&&(ot||Ae),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!U.attributes.color&&U.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!U.attributes.uv&&(De||ye),fog:!!P,useFog:y.fog===!0,fogExp2:!!P&&P.isFogExp2,flatShading:y.wireframe===!1&&(y.flatShading===!0||U.attributes.normal===void 0&&ot===!1&&(y.isMeshLambertMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isMeshPhysicalMaterial)),sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:a,reversedDepthBuffer:ne,skinning:N.isSkinnedMesh===!0,morphTargets:U.morphAttributes.position!==void 0,morphNormals:U.morphAttributes.normal!==void 0,morphColors:U.morphAttributes.color!==void 0,morphTargetsCount:Q,morphTextureStride:ie,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:y.dithering,shadowMapEnabled:t.shadowMap.enabled&&D.length>0,shadowMapType:t.shadowMap.type,toneMapping:ze,decodeVideoTexture:De&&y.map.isVideoTexture===!0&&Je.getTransfer(y.map.colorSpace)===ct,decodeVideoTextureEmissive:Nt&&y.emissiveMap.isVideoTexture===!0&&Je.getTransfer(y.emissiveMap.colorSpace)===ct,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===ri,flipSided:y.side===En,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:Ee&&y.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ee&&y.extensions.multiDraw===!0||Re)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return yt.vertexUv1s=l.has(1),yt.vertexUv2s=l.has(2),yt.vertexUv3s=l.has(3),l.clear(),yt}function g(y){const w=[];if(y.shaderID?w.push(y.shaderID):(w.push(y.customVertexShaderID),w.push(y.customFragmentShaderID)),y.defines!==void 0)for(const D in y.defines)w.push(D),w.push(y.defines[D]);return y.isRawShaderMaterial===!1&&(p(w,y),_(w,y),w.push(t.outputColorSpace)),w.push(y.customProgramCacheKey),w.join()}function p(y,w){y.push(w.precision),y.push(w.outputColorSpace),y.push(w.envMapMode),y.push(w.envMapCubeUVHeight),y.push(w.mapUv),y.push(w.alphaMapUv),y.push(w.lightMapUv),y.push(w.aoMapUv),y.push(w.bumpMapUv),y.push(w.normalMapUv),y.push(w.displacementMapUv),y.push(w.emissiveMapUv),y.push(w.metalnessMapUv),y.push(w.roughnessMapUv),y.push(w.anisotropyMapUv),y.push(w.clearcoatMapUv),y.push(w.clearcoatNormalMapUv),y.push(w.clearcoatRoughnessMapUv),y.push(w.iridescenceMapUv),y.push(w.iridescenceThicknessMapUv),y.push(w.sheenColorMapUv),y.push(w.sheenRoughnessMapUv),y.push(w.specularMapUv),y.push(w.specularColorMapUv),y.push(w.specularIntensityMapUv),y.push(w.transmissionMapUv),y.push(w.thicknessMapUv),y.push(w.combine),y.push(w.fogExp2),y.push(w.sizeAttenuation),y.push(w.morphTargetsCount),y.push(w.morphAttributeCount),y.push(w.numDirLights),y.push(w.numPointLights),y.push(w.numSpotLights),y.push(w.numSpotLightMaps),y.push(w.numHemiLights),y.push(w.numRectAreaLights),y.push(w.numDirLightShadows),y.push(w.numPointLightShadows),y.push(w.numSpotLightShadows),y.push(w.numSpotLightShadowsWithMaps),y.push(w.numLightProbes),y.push(w.shadowMapType),y.push(w.toneMapping),y.push(w.numClippingPlanes),y.push(w.numClipIntersection),y.push(w.depthPacking)}function _(y,w){o.disableAll(),w.instancing&&o.enable(0),w.instancingColor&&o.enable(1),w.instancingMorph&&o.enable(2),w.matcap&&o.enable(3),w.envMap&&o.enable(4),w.normalMapObjectSpace&&o.enable(5),w.normalMapTangentSpace&&o.enable(6),w.clearcoat&&o.enable(7),w.iridescence&&o.enable(8),w.alphaTest&&o.enable(9),w.vertexColors&&o.enable(10),w.vertexAlphas&&o.enable(11),w.vertexUv1s&&o.enable(12),w.vertexUv2s&&o.enable(13),w.vertexUv3s&&o.enable(14),w.vertexTangents&&o.enable(15),w.anisotropy&&o.enable(16),w.alphaHash&&o.enable(17),w.batching&&o.enable(18),w.dispersion&&o.enable(19),w.batchingColor&&o.enable(20),w.gradientMap&&o.enable(21),y.push(o.mask),o.disableAll(),w.fog&&o.enable(0),w.useFog&&o.enable(1),w.flatShading&&o.enable(2),w.logarithmicDepthBuffer&&o.enable(3),w.reversedDepthBuffer&&o.enable(4),w.skinning&&o.enable(5),w.morphTargets&&o.enable(6),w.morphNormals&&o.enable(7),w.morphColors&&o.enable(8),w.premultipliedAlpha&&o.enable(9),w.shadowMapEnabled&&o.enable(10),w.doubleSided&&o.enable(11),w.flipSided&&o.enable(12),w.useDepthPacking&&o.enable(13),w.dithering&&o.enable(14),w.transmission&&o.enable(15),w.sheen&&o.enable(16),w.opaque&&o.enable(17),w.pointsUvs&&o.enable(18),w.decodeVideoTexture&&o.enable(19),w.decodeVideoTextureEmissive&&o.enable(20),w.alphaToCoverage&&o.enable(21),y.push(o.mask)}function x(y){const w=h[y.type];let D;if(w){const C=xi[w];D=iu.clone(C.uniforms)}else D=y.uniforms;return D}function S(y,w){let D=d.get(w);return D!==void 0?++D.usedTimes:(D=new SC(t,w,y,r),f.push(D),d.set(w,D)),D}function b(y){if(--y.usedTimes===0){const w=f.indexOf(y);f[w]=f[f.length-1],f.pop(),d.delete(y.cacheKey),y.destroy()}}function M(y){c.remove(y)}function T(){c.dispose()}return{getParameters:v,getProgramCacheKey:g,getUniforms:x,acquireProgram:S,releaseProgram:b,releaseShaderCache:M,programs:f,dispose:T}}function bC(){let t=new WeakMap;function e(o){return t.has(o)}function n(o){let c=t.get(o);return c===void 0&&(c={},t.set(o,c)),c}function i(o){t.delete(o)}function r(o,c,l){t.get(o)[c]=l}function s(){t=new WeakMap}return{has:e,get:n,remove:i,update:r,dispose:s}}function AC(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.materialVariant!==e.materialVariant?t.materialVariant-e.materialVariant:t.z!==e.z?t.z-e.z:t.id-e.id}function N0(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function U0(){const t=[];let e=0;const n=[],i=[],r=[];function s(){e=0,n.length=0,i.length=0,r.length=0}function o(u){let h=0;return u.isInstancedMesh&&(h+=2),u.isSkinnedMesh&&(h+=1),h}function c(u,h,m,v,g,p){let _=t[e];return _===void 0?(_={id:u.id,object:u,geometry:h,material:m,materialVariant:o(u),groupOrder:v,renderOrder:u.renderOrder,z:g,group:p},t[e]=_):(_.id=u.id,_.object=u,_.geometry=h,_.material=m,_.materialVariant=o(u),_.groupOrder=v,_.renderOrder=u.renderOrder,_.z=g,_.group=p),e++,_}function l(u,h,m,v,g,p){const _=c(u,h,m,v,g,p);m.transmission>0?i.push(_):m.transparent===!0?r.push(_):n.push(_)}function f(u,h,m,v,g,p){const _=c(u,h,m,v,g,p);m.transmission>0?i.unshift(_):m.transparent===!0?r.unshift(_):n.unshift(_)}function d(u,h){n.length>1&&n.sort(u||AC),i.length>1&&i.sort(h||N0),r.length>1&&r.sort(h||N0)}function a(){for(let u=e,h=t.length;u<h;u++){const m=t[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:n,transmissive:i,transparent:r,init:s,push:l,unshift:f,finish:a,sort:d}}function CC(){let t=new WeakMap;function e(i,r){const s=t.get(i);let o;return s===void 0?(o=new U0,t.set(i,[o])):r>=s.length?(o=new U0,s.push(o)):o=s[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}function RC(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new R,color:new te};break;case"SpotLight":n={position:new R,direction:new R,color:new te,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new R,color:new te,distance:0,decay:0};break;case"HemisphereLight":n={direction:new R,skyColor:new te,groundColor:new te};break;case"RectAreaLight":n={color:new te,position:new R,halfWidth:new R,halfHeight:new R};break}return t[e.id]=n,n}}}function PC(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _e};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _e};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _e,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}let LC=0;function DC(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function IC(t){const e=new RC,n=PC(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let f=0;f<9;f++)i.probe.push(new R);const r=new R,s=new ht,o=new ht;function c(f){let d=0,a=0,u=0;for(let w=0;w<9;w++)i.probe[w].set(0,0,0);let h=0,m=0,v=0,g=0,p=0,_=0,x=0,S=0,b=0,M=0,T=0;f.sort(DC);for(let w=0,D=f.length;w<D;w++){const C=f[w],N=C.color,P=C.intensity,U=C.distance;let V=null;if(C.shadow&&C.shadow.map&&(C.shadow.map.texture.format===xo?V=C.shadow.map.texture:V=C.shadow.map.depthTexture||C.shadow.map.texture),C.isAmbientLight)d+=N.r*P,a+=N.g*P,u+=N.b*P;else if(C.isLightProbe){for(let O=0;O<9;O++)i.probe[O].addScaledVector(C.sh.coefficients[O],P);T++}else if(C.isDirectionalLight){const O=e.get(C);if(O.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const H=C.shadow,z=n.get(C);z.shadowIntensity=H.intensity,z.shadowBias=H.bias,z.shadowNormalBias=H.normalBias,z.shadowRadius=H.radius,z.shadowMapSize=H.mapSize,i.directionalShadow[h]=z,i.directionalShadowMap[h]=V,i.directionalShadowMatrix[h]=C.shadow.matrix,_++}i.directional[h]=O,h++}else if(C.isSpotLight){const O=e.get(C);O.position.setFromMatrixPosition(C.matrixWorld),O.color.copy(N).multiplyScalar(P),O.distance=U,O.coneCos=Math.cos(C.angle),O.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),O.decay=C.decay,i.spot[v]=O;const H=C.shadow;if(C.map&&(i.spotLightMap[b]=C.map,b++,H.updateMatrices(C),C.castShadow&&M++),i.spotLightMatrix[v]=H.matrix,C.castShadow){const z=n.get(C);z.shadowIntensity=H.intensity,z.shadowBias=H.bias,z.shadowNormalBias=H.normalBias,z.shadowRadius=H.radius,z.shadowMapSize=H.mapSize,i.spotShadow[v]=z,i.spotShadowMap[v]=V,S++}v++}else if(C.isRectAreaLight){const O=e.get(C);O.color.copy(N).multiplyScalar(P),O.halfWidth.set(C.width*.5,0,0),O.halfHeight.set(0,C.height*.5,0),i.rectArea[g]=O,g++}else if(C.isPointLight){const O=e.get(C);if(O.color.copy(C.color).multiplyScalar(C.intensity),O.distance=C.distance,O.decay=C.decay,C.castShadow){const H=C.shadow,z=n.get(C);z.shadowIntensity=H.intensity,z.shadowBias=H.bias,z.shadowNormalBias=H.normalBias,z.shadowRadius=H.radius,z.shadowMapSize=H.mapSize,z.shadowCameraNear=H.camera.near,z.shadowCameraFar=H.camera.far,i.pointShadow[m]=z,i.pointShadowMap[m]=V,i.pointShadowMatrix[m]=C.shadow.matrix,x++}i.point[m]=O,m++}else if(C.isHemisphereLight){const O=e.get(C);O.skyColor.copy(C.color).multiplyScalar(P),O.groundColor.copy(C.groundColor).multiplyScalar(P),i.hemi[p]=O,p++}}g>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=he.LTC_FLOAT_1,i.rectAreaLTC2=he.LTC_FLOAT_2):(i.rectAreaLTC1=he.LTC_HALF_1,i.rectAreaLTC2=he.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=a,i.ambient[2]=u;const y=i.hash;(y.directionalLength!==h||y.pointLength!==m||y.spotLength!==v||y.rectAreaLength!==g||y.hemiLength!==p||y.numDirectionalShadows!==_||y.numPointShadows!==x||y.numSpotShadows!==S||y.numSpotMaps!==b||y.numLightProbes!==T)&&(i.directional.length=h,i.spot.length=v,i.rectArea.length=g,i.point.length=m,i.hemi.length=p,i.directionalShadow.length=_,i.directionalShadowMap.length=_,i.pointShadow.length=x,i.pointShadowMap.length=x,i.spotShadow.length=S,i.spotShadowMap.length=S,i.directionalShadowMatrix.length=_,i.pointShadowMatrix.length=x,i.spotLightMatrix.length=S+b-M,i.spotLightMap.length=b,i.numSpotLightShadowsWithMaps=M,i.numLightProbes=T,y.directionalLength=h,y.pointLength=m,y.spotLength=v,y.rectAreaLength=g,y.hemiLength=p,y.numDirectionalShadows=_,y.numPointShadows=x,y.numSpotShadows=S,y.numSpotMaps=b,y.numLightProbes=T,i.version=LC++)}function l(f,d){let a=0,u=0,h=0,m=0,v=0;const g=d.matrixWorldInverse;for(let p=0,_=f.length;p<_;p++){const x=f[p];if(x.isDirectionalLight){const S=i.directional[a];S.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(g),a++}else if(x.isSpotLight){const S=i.spot[h];S.position.setFromMatrixPosition(x.matrixWorld),S.position.applyMatrix4(g),S.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(g),h++}else if(x.isRectAreaLight){const S=i.rectArea[m];S.position.setFromMatrixPosition(x.matrixWorld),S.position.applyMatrix4(g),o.identity(),s.copy(x.matrixWorld),s.premultiply(g),o.extractRotation(s),S.halfWidth.set(x.width*.5,0,0),S.halfHeight.set(0,x.height*.5,0),S.halfWidth.applyMatrix4(o),S.halfHeight.applyMatrix4(o),m++}else if(x.isPointLight){const S=i.point[u];S.position.setFromMatrixPosition(x.matrixWorld),S.position.applyMatrix4(g),u++}else if(x.isHemisphereLight){const S=i.hemi[v];S.direction.setFromMatrixPosition(x.matrixWorld),S.direction.transformDirection(g),v++}}}return{setup:c,setupView:l,state:i}}function F0(t){const e=new IC(t),n=[],i=[];function r(d){f.camera=d,n.length=0,i.length=0}function s(d){n.push(d)}function o(d){i.push(d)}function c(){e.setup(n)}function l(d){e.setupView(n,d)}const f={lightsArray:n,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:f,setupLights:c,setupLightsView:l,pushLight:s,pushShadow:o}}function NC(t){let e=new WeakMap;function n(r,s=0){const o=e.get(r);let c;return o===void 0?(c=new F0(t),e.set(r,[c])):s>=o.length?(c=new F0(t),o.push(c)):c=o[s],c}function i(){e=new WeakMap}return{get:n,dispose:i}}const UC=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,FC=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,OC=[new R(1,0,0),new R(-1,0,0),new R(0,1,0),new R(0,-1,0),new R(0,0,1),new R(0,0,-1)],kC=[new R(0,-1,0),new R(0,-1,0),new R(0,0,1),new R(0,0,-1),new R(0,-1,0),new R(0,-1,0)],O0=new ht,qo=new R,Gf=new R;function BC(t,e,n){let i=new tm;const r=new _e,s=new _e,o=new Lt,c=new qw,l=new Kw,f={},d=n.maxTextureSize,a={[Cr]:En,[En]:Cr,[ri]:ri},u=new Tt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new _e},radius:{value:4}},vertexShader:UC,fragmentShader:FC}),h=u.clone();h.defines.HORIZONTAL_PASS=1;const m=new Ve;m.setAttribute("position",new He(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new mn(m,u),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=mc;let p=this.type;this.render=function(M,T,y){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||M.length===0)return;this.type===x1&&(Oe("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=mc);const w=t.getRenderTarget(),D=t.getActiveCubeFace(),C=t.getActiveMipmapLevel(),N=t.state;N.setBlending(Ei),N.buffers.depth.getReversed()===!0?N.buffers.color.setClear(0,0,0,0):N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);const P=p!==this.type;P&&T.traverse(function(U){U.material&&(Array.isArray(U.material)?U.material.forEach(V=>V.needsUpdate=!0):U.material.needsUpdate=!0)});for(let U=0,V=M.length;U<V;U++){const O=M[U],H=O.shadow;if(H===void 0){Oe("WebGLShadowMap:",O,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;r.copy(H.mapSize);const z=H.getFrameExtents();r.multiply(z),s.copy(H.mapSize),(r.x>d||r.y>d)&&(r.x>d&&(s.x=Math.floor(d/z.x),r.x=s.x*z.x,H.mapSize.x=s.x),r.y>d&&(s.y=Math.floor(d/z.y),r.y=s.y*z.y,H.mapSize.y=s.y));const X=t.state.buffers.depth.getReversed();if(H.camera._reversedDepth=X,H.map===null||P===!0){if(H.map!==null&&(H.map.depthTexture!==null&&(H.map.depthTexture.dispose(),H.map.depthTexture=null),H.map.dispose()),this.type===ta){if(O.isPointLight){Oe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}H.map=new Tn(r.x,r.y,{format:xo,type:Fn,minFilter:an,magFilter:an,generateMipmaps:!1}),H.map.texture.name=O.name+".shadowMap",H.map.depthTexture=new Fa(r.x,r.y,oi),H.map.depthTexture.name=O.name+".shadowMapDepth",H.map.depthTexture.format=qi,H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Kt,H.map.depthTexture.magFilter=Kt}else O.isPointLight?(H.map=new cy(r.x),H.map.depthTexture=new Vw(r.x,Ai)):(H.map=new Tn(r.x,r.y),H.map.depthTexture=new Fa(r.x,r.y,Ai)),H.map.depthTexture.name=O.name+".shadowMap",H.map.depthTexture.format=qi,this.type===mc?(H.map.depthTexture.compareFunction=X?Zp:Kp,H.map.depthTexture.minFilter=an,H.map.depthTexture.magFilter=an):(H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Kt,H.map.depthTexture.magFilter=Kt);H.camera.updateProjectionMatrix()}const J=H.map.isWebGLCubeRenderTarget?6:1;for(let Q=0;Q<J;Q++){if(H.map.isWebGLCubeRenderTarget)t.setRenderTarget(H.map,Q),t.clear();else{Q===0&&(t.setRenderTarget(H.map),t.clear());const ie=H.getViewport(Q);o.set(s.x*ie.x,s.y*ie.y,s.x*ie.z,s.y*ie.w),N.viewport(o)}if(O.isPointLight){const ie=H.camera,Fe=H.matrix,Ze=O.distance||ie.far;Ze!==ie.far&&(ie.far=Ze,ie.updateProjectionMatrix()),qo.setFromMatrixPosition(O.matrixWorld),ie.position.copy(qo),Gf.copy(ie.position),Gf.add(OC[Q]),ie.up.copy(kC[Q]),ie.lookAt(Gf),ie.updateMatrixWorld(),Fe.makeTranslation(-qo.x,-qo.y,-qo.z),O0.multiplyMatrices(ie.projectionMatrix,ie.matrixWorldInverse),H._frustum.setFromProjectionMatrix(O0,ie.coordinateSystem,ie.reversedDepth)}else H.updateMatrices(O);i=H.getFrustum(),S(T,y,H.camera,O,this.type)}H.isPointLightShadow!==!0&&this.type===ta&&_(H,y),H.needsUpdate=!1}p=this.type,g.needsUpdate=!1,t.setRenderTarget(w,D,C)};function _(M,T){const y=e.update(v);u.defines.VSM_SAMPLES!==M.blurSamples&&(u.defines.VSM_SAMPLES=M.blurSamples,h.defines.VSM_SAMPLES=M.blurSamples,u.needsUpdate=!0,h.needsUpdate=!0),M.mapPass===null&&(M.mapPass=new Tn(r.x,r.y,{format:xo,type:Fn})),u.uniforms.shadow_pass.value=M.map.depthTexture,u.uniforms.resolution.value=M.mapSize,u.uniforms.radius.value=M.radius,t.setRenderTarget(M.mapPass),t.clear(),t.renderBufferDirect(T,null,y,u,v,null),h.uniforms.shadow_pass.value=M.mapPass.texture,h.uniforms.resolution.value=M.mapSize,h.uniforms.radius.value=M.radius,t.setRenderTarget(M.map),t.clear(),t.renderBufferDirect(T,null,y,h,v,null)}function x(M,T,y,w){let D=null;const C=y.isPointLight===!0?M.customDistanceMaterial:M.customDepthMaterial;if(C!==void 0)D=C;else if(D=y.isPointLight===!0?l:c,t.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0||T.alphaToCoverage===!0){const N=D.uuid,P=T.uuid;let U=f[N];U===void 0&&(U={},f[N]=U);let V=U[P];V===void 0&&(V=D.clone(),U[P]=V,T.addEventListener("dispose",b)),D=V}if(D.visible=T.visible,D.wireframe=T.wireframe,w===ta?D.side=T.shadowSide!==null?T.shadowSide:T.side:D.side=T.shadowSide!==null?T.shadowSide:a[T.side],D.alphaMap=T.alphaMap,D.alphaTest=T.alphaToCoverage===!0?.5:T.alphaTest,D.map=T.map,D.clipShadows=T.clipShadows,D.clippingPlanes=T.clippingPlanes,D.clipIntersection=T.clipIntersection,D.displacementMap=T.displacementMap,D.displacementScale=T.displacementScale,D.displacementBias=T.displacementBias,D.wireframeLinewidth=T.wireframeLinewidth,D.linewidth=T.linewidth,y.isPointLight===!0&&D.isMeshDistanceMaterial===!0){const N=t.properties.get(D);N.light=y}return D}function S(M,T,y,w,D){if(M.visible===!1)return;if(M.layers.test(T.layers)&&(M.isMesh||M.isLine||M.isPoints)&&(M.castShadow||M.receiveShadow&&D===ta)&&(!M.frustumCulled||i.intersectsObject(M))){M.modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,M.matrixWorld);const P=e.update(M),U=M.material;if(Array.isArray(U)){const V=P.groups;for(let O=0,H=V.length;O<H;O++){const z=V[O],X=U[z.materialIndex];if(X&&X.visible){const J=x(M,X,w,D);M.onBeforeShadow(t,M,T,y,P,J,z),t.renderBufferDirect(y,null,P,J,M,z),M.onAfterShadow(t,M,T,y,P,J,z)}}}else if(U.visible){const V=x(M,U,w,D);M.onBeforeShadow(t,M,T,y,P,V,null),t.renderBufferDirect(y,null,P,V,M,null),M.onAfterShadow(t,M,T,y,P,V,null)}}const N=M.children;for(let P=0,U=N.length;P<U;P++)S(N[P],T,y,w,D)}function b(M){M.target.removeEventListener("dispose",b);for(const y in f){const w=f[y],D=M.target.uuid;D in w&&(w[D].dispose(),delete w[D])}}}function zC(t,e){function n(){let F=!1;const de=new Lt;let ce=null;const ye=new Lt(0,0,0,0);return{setMask:function(ae){ce!==ae&&!F&&(t.colorMask(ae,ae,ae,ae),ce=ae)},setLocked:function(ae){F=ae},setClear:function(ae,q,Ee,ze,yt){yt===!0&&(ae*=ze,q*=ze,Ee*=ze),de.set(ae,q,Ee,ze),ye.equals(de)===!1&&(t.clearColor(ae,q,Ee,ze),ye.copy(de))},reset:function(){F=!1,ce=null,ye.set(-1,0,0,0)}}}function i(){let F=!1,de=!1,ce=null,ye=null,ae=null;return{setReversed:function(q){if(de!==q){const Ee=e.get("EXT_clip_control");q?Ee.clipControlEXT(Ee.LOWER_LEFT_EXT,Ee.ZERO_TO_ONE_EXT):Ee.clipControlEXT(Ee.LOWER_LEFT_EXT,Ee.NEGATIVE_ONE_TO_ONE_EXT),de=q;const ze=ae;ae=null,this.setClear(ze)}},getReversed:function(){return de},setTest:function(q){q?re(t.DEPTH_TEST):ne(t.DEPTH_TEST)},setMask:function(q){ce!==q&&!F&&(t.depthMask(q),ce=q)},setFunc:function(q){if(de&&(q=J1[q]),ye!==q){switch(q){case Kd:t.depthFunc(t.NEVER);break;case Zd:t.depthFunc(t.ALWAYS);break;case Qd:t.depthFunc(t.LESS);break;case _o:t.depthFunc(t.LEQUAL);break;case Jd:t.depthFunc(t.EQUAL);break;case eh:t.depthFunc(t.GEQUAL);break;case th:t.depthFunc(t.GREATER);break;case nh:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}ye=q}},setLocked:function(q){F=q},setClear:function(q){ae!==q&&(ae=q,de&&(q=1-q),t.clearDepth(q))},reset:function(){F=!1,ce=null,ye=null,ae=null,de=!1}}}function r(){let F=!1,de=null,ce=null,ye=null,ae=null,q=null,Ee=null,ze=null,yt=null;return{setTest:function(lt){F||(lt?re(t.STENCIL_TEST):ne(t.STENCIL_TEST))},setMask:function(lt){de!==lt&&!F&&(t.stencilMask(lt),de=lt)},setFunc:function(lt,Ri,Pi){(ce!==lt||ye!==Ri||ae!==Pi)&&(t.stencilFunc(lt,Ri,Pi),ce=lt,ye=Ri,ae=Pi)},setOp:function(lt,Ri,Pi){(q!==lt||Ee!==Ri||ze!==Pi)&&(t.stencilOp(lt,Ri,Pi),q=lt,Ee=Ri,ze=Pi)},setLocked:function(lt){F=lt},setClear:function(lt){yt!==lt&&(t.clearStencil(lt),yt=lt)},reset:function(){F=!1,de=null,ce=null,ye=null,ae=null,q=null,Ee=null,ze=null,yt=null}}}const s=new n,o=new i,c=new r,l=new WeakMap,f=new WeakMap;let d={},a={},u=new WeakMap,h=[],m=null,v=!1,g=null,p=null,_=null,x=null,S=null,b=null,M=null,T=new te(0,0,0),y=0,w=!1,D=null,C=null,N=null,P=null,U=null;const V=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let O=!1,H=0;const z=t.getParameter(t.VERSION);z.indexOf("WebGL")!==-1?(H=parseFloat(/^WebGL (\d)/.exec(z)[1]),O=H>=1):z.indexOf("OpenGL ES")!==-1&&(H=parseFloat(/^OpenGL ES (\d)/.exec(z)[1]),O=H>=2);let X=null,J={};const Q=t.getParameter(t.SCISSOR_BOX),ie=t.getParameter(t.VIEWPORT),Fe=new Lt().fromArray(Q),Ze=new Lt().fromArray(ie);function rt(F,de,ce,ye){const ae=new Uint8Array(4),q=t.createTexture();t.bindTexture(F,q),t.texParameteri(F,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(F,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let Ee=0;Ee<ce;Ee++)F===t.TEXTURE_3D||F===t.TEXTURE_2D_ARRAY?t.texImage3D(de,0,t.RGBA,1,1,ye,0,t.RGBA,t.UNSIGNED_BYTE,ae):t.texImage2D(de+Ee,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,ae);return q}const Y={};Y[t.TEXTURE_2D]=rt(t.TEXTURE_2D,t.TEXTURE_2D,1),Y[t.TEXTURE_CUBE_MAP]=rt(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[t.TEXTURE_2D_ARRAY]=rt(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),Y[t.TEXTURE_3D]=rt(t.TEXTURE_3D,t.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),c.setClear(0),re(t.DEPTH_TEST),o.setFunc(_o),Ue(!1),ot(Pg),re(t.CULL_FACE),tt(Ei);function re(F){d[F]!==!0&&(t.enable(F),d[F]=!0)}function ne(F){d[F]!==!1&&(t.disable(F),d[F]=!1)}function ue(F,de){return a[F]!==de?(t.bindFramebuffer(F,de),a[F]=de,F===t.DRAW_FRAMEBUFFER&&(a[t.FRAMEBUFFER]=de),F===t.FRAMEBUFFER&&(a[t.DRAW_FRAMEBUFFER]=de),!0):!1}function Re(F,de){let ce=h,ye=!1;if(F){ce=u.get(de),ce===void 0&&(ce=[],u.set(de,ce));const ae=F.textures;if(ce.length!==ae.length||ce[0]!==t.COLOR_ATTACHMENT0){for(let q=0,Ee=ae.length;q<Ee;q++)ce[q]=t.COLOR_ATTACHMENT0+q;ce.length=ae.length,ye=!0}}else ce[0]!==t.BACK&&(ce[0]=t.BACK,ye=!0);ye&&t.drawBuffers(ce)}function De(F){return m!==F?(t.useProgram(F),m=F,!0):!1}const pt={[$r]:t.FUNC_ADD,[S1]:t.FUNC_SUBTRACT,[M1]:t.FUNC_REVERSE_SUBTRACT};pt[w1]=t.MIN,pt[E1]=t.MAX;const Xe={[T1]:t.ZERO,[b1]:t.ONE,[A1]:t.SRC_COLOR,[Yd]:t.SRC_ALPHA,[I1]:t.SRC_ALPHA_SATURATE,[L1]:t.DST_COLOR,[R1]:t.DST_ALPHA,[C1]:t.ONE_MINUS_SRC_COLOR,[qd]:t.ONE_MINUS_SRC_ALPHA,[D1]:t.ONE_MINUS_DST_COLOR,[P1]:t.ONE_MINUS_DST_ALPHA,[N1]:t.CONSTANT_COLOR,[U1]:t.ONE_MINUS_CONSTANT_COLOR,[F1]:t.CONSTANT_ALPHA,[O1]:t.ONE_MINUS_CONSTANT_ALPHA};function tt(F,de,ce,ye,ae,q,Ee,ze,yt,lt){if(F===Ei){v===!0&&(ne(t.BLEND),v=!1);return}if(v===!1&&(re(t.BLEND),v=!0),F!==y1){if(F!==g||lt!==w){if((p!==$r||S!==$r)&&(t.blendEquation(t.FUNC_ADD),p=$r,S=$r),lt)switch(F){case oo:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case st:t.blendFunc(t.ONE,t.ONE);break;case Lg:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case Dg:t.blendFuncSeparate(t.DST_COLOR,t.ONE_MINUS_SRC_ALPHA,t.ZERO,t.ONE);break;default:Qe("WebGLState: Invalid blending: ",F);break}else switch(F){case oo:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case st:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE,t.ONE,t.ONE);break;case Lg:Qe("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Dg:Qe("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Qe("WebGLState: Invalid blending: ",F);break}_=null,x=null,b=null,M=null,T.set(0,0,0),y=0,g=F,w=lt}return}ae=ae||de,q=q||ce,Ee=Ee||ye,(de!==p||ae!==S)&&(t.blendEquationSeparate(pt[de],pt[ae]),p=de,S=ae),(ce!==_||ye!==x||q!==b||Ee!==M)&&(t.blendFuncSeparate(Xe[ce],Xe[ye],Xe[q],Xe[Ee]),_=ce,x=ye,b=q,M=Ee),(ze.equals(T)===!1||yt!==y)&&(t.blendColor(ze.r,ze.g,ze.b,yt),T.copy(ze),y=yt),g=F,w=!1}function Be(F,de){F.side===ri?ne(t.CULL_FACE):re(t.CULL_FACE);let ce=F.side===En;de&&(ce=!ce),Ue(ce),F.blending===oo&&F.transparent===!1?tt(Ei):tt(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),o.setFunc(F.depthFunc),o.setTest(F.depthTest),o.setMask(F.depthWrite),s.setMask(F.colorWrite);const ye=F.stencilWrite;c.setTest(ye),ye&&(c.setMask(F.stencilWriteMask),c.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),c.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),Nt(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?re(t.SAMPLE_ALPHA_TO_COVERAGE):ne(t.SAMPLE_ALPHA_TO_COVERAGE)}function Ue(F){D!==F&&(F?t.frontFace(t.CW):t.frontFace(t.CCW),D=F)}function ot(F){F!==_1?(re(t.CULL_FACE),F!==C&&(F===Pg?t.cullFace(t.BACK):F===v1?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):ne(t.CULL_FACE),C=F}function I(F){F!==N&&(O&&t.lineWidth(F),N=F)}function Nt(F,de,ce){F?(re(t.POLYGON_OFFSET_FILL),(P!==de||U!==ce)&&(P=de,U=ce,o.getReversed()&&(de=-de),t.polygonOffset(de,ce))):ne(t.POLYGON_OFFSET_FILL)}function at(F){F?re(t.SCISSOR_TEST):ne(t.SCISSOR_TEST)}function xt(F){F===void 0&&(F=t.TEXTURE0+V-1),X!==F&&(t.activeTexture(F),X=F)}function Ae(F,de,ce){ce===void 0&&(X===null?ce=t.TEXTURE0+V-1:ce=X);let ye=J[ce];ye===void 0&&(ye={type:void 0,texture:void 0},J[ce]=ye),(ye.type!==F||ye.texture!==de)&&(X!==ce&&(t.activeTexture(ce),X=ce),t.bindTexture(F,de||Y[F]),ye.type=F,ye.texture=de)}function L(){const F=J[X];F!==void 0&&F.type!==void 0&&(t.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function E(){try{t.compressedTexImage2D(...arguments)}catch(F){Qe("WebGLState:",F)}}function k(){try{t.compressedTexImage3D(...arguments)}catch(F){Qe("WebGLState:",F)}}function Z(){try{t.texSubImage2D(...arguments)}catch(F){Qe("WebGLState:",F)}}function ee(){try{t.texSubImage3D(...arguments)}catch(F){Qe("WebGLState:",F)}}function K(){try{t.compressedTexSubImage2D(...arguments)}catch(F){Qe("WebGLState:",F)}}function Me(){try{t.compressedTexSubImage3D(...arguments)}catch(F){Qe("WebGLState:",F)}}function fe(){try{t.texStorage2D(...arguments)}catch(F){Qe("WebGLState:",F)}}function Ne(){try{t.texStorage3D(...arguments)}catch(F){Qe("WebGLState:",F)}}function ke(){try{t.texImage2D(...arguments)}catch(F){Qe("WebGLState:",F)}}function oe(){try{t.texImage3D(...arguments)}catch(F){Qe("WebGLState:",F)}}function le(F){Fe.equals(F)===!1&&(t.scissor(F.x,F.y,F.z,F.w),Fe.copy(F))}function we(F){Ze.equals(F)===!1&&(t.viewport(F.x,F.y,F.z,F.w),Ze.copy(F))}function Te(F,de){let ce=f.get(de);ce===void 0&&(ce=new WeakMap,f.set(de,ce));let ye=ce.get(F);ye===void 0&&(ye=t.getUniformBlockIndex(de,F.name),ce.set(F,ye))}function ge(F,de){const ye=f.get(de).get(F);l.get(de)!==ye&&(t.uniformBlockBinding(de,ye,F.__bindingPointIndex),l.set(de,ye))}function Ye(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),o.setReversed(!1),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),d={},X=null,J={},a={},u=new WeakMap,h=[],m=null,v=!1,g=null,p=null,_=null,x=null,S=null,b=null,M=null,T=new te(0,0,0),y=0,w=!1,D=null,C=null,N=null,P=null,U=null,Fe.set(0,0,t.canvas.width,t.canvas.height),Ze.set(0,0,t.canvas.width,t.canvas.height),s.reset(),o.reset(),c.reset()}return{buffers:{color:s,depth:o,stencil:c},enable:re,disable:ne,bindFramebuffer:ue,drawBuffers:Re,useProgram:De,setBlending:tt,setMaterial:Be,setFlipSided:Ue,setCullFace:ot,setLineWidth:I,setPolygonOffset:Nt,setScissorTest:at,activeTexture:xt,bindTexture:Ae,unbindTexture:L,compressedTexImage2D:E,compressedTexImage3D:k,texImage2D:ke,texImage3D:oe,updateUBOMapping:Te,uniformBlockBinding:ge,texStorage2D:fe,texStorage3D:Ne,texSubImage2D:Z,texSubImage3D:ee,compressedTexSubImage2D:K,compressedTexSubImage3D:Me,scissor:le,viewport:we,reset:Ye}}function VC(t,e,n,i,r,s,o){const c=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),f=new _e,d=new WeakMap;let a;const u=new WeakMap;let h=!1;try{h=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(L,E){return h?new OffscreenCanvas(L,E):Kc("canvas")}function v(L,E,k){let Z=1;const ee=Ae(L);if((ee.width>k||ee.height>k)&&(Z=k/Math.max(ee.width,ee.height)),Z<1)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap||typeof VideoFrame<"u"&&L instanceof VideoFrame){const K=Math.floor(Z*ee.width),Me=Math.floor(Z*ee.height);a===void 0&&(a=m(K,Me));const fe=E?m(K,Me):a;return fe.width=K,fe.height=Me,fe.getContext("2d").drawImage(L,0,0,K,Me),Oe("WebGLRenderer: Texture has been resized from ("+ee.width+"x"+ee.height+") to ("+K+"x"+Me+")."),fe}else return"data"in L&&Oe("WebGLRenderer: Image in DataTexture is too big ("+ee.width+"x"+ee.height+")."),L;return L}function g(L){return L.generateMipmaps}function p(L){t.generateMipmap(L)}function _(L){return L.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:L.isWebGL3DRenderTarget?t.TEXTURE_3D:L.isWebGLArrayRenderTarget||L.isCompressedArrayTexture?t.TEXTURE_2D_ARRAY:t.TEXTURE_2D}function x(L,E,k,Z,ee=!1){if(L!==null){if(t[L]!==void 0)return t[L];Oe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let K=E;if(E===t.RED&&(k===t.FLOAT&&(K=t.R32F),k===t.HALF_FLOAT&&(K=t.R16F),k===t.UNSIGNED_BYTE&&(K=t.R8)),E===t.RED_INTEGER&&(k===t.UNSIGNED_BYTE&&(K=t.R8UI),k===t.UNSIGNED_SHORT&&(K=t.R16UI),k===t.UNSIGNED_INT&&(K=t.R32UI),k===t.BYTE&&(K=t.R8I),k===t.SHORT&&(K=t.R16I),k===t.INT&&(K=t.R32I)),E===t.RG&&(k===t.FLOAT&&(K=t.RG32F),k===t.HALF_FLOAT&&(K=t.RG16F),k===t.UNSIGNED_BYTE&&(K=t.RG8)),E===t.RG_INTEGER&&(k===t.UNSIGNED_BYTE&&(K=t.RG8UI),k===t.UNSIGNED_SHORT&&(K=t.RG16UI),k===t.UNSIGNED_INT&&(K=t.RG32UI),k===t.BYTE&&(K=t.RG8I),k===t.SHORT&&(K=t.RG16I),k===t.INT&&(K=t.RG32I)),E===t.RGB_INTEGER&&(k===t.UNSIGNED_BYTE&&(K=t.RGB8UI),k===t.UNSIGNED_SHORT&&(K=t.RGB16UI),k===t.UNSIGNED_INT&&(K=t.RGB32UI),k===t.BYTE&&(K=t.RGB8I),k===t.SHORT&&(K=t.RGB16I),k===t.INT&&(K=t.RGB32I)),E===t.RGBA_INTEGER&&(k===t.UNSIGNED_BYTE&&(K=t.RGBA8UI),k===t.UNSIGNED_SHORT&&(K=t.RGBA16UI),k===t.UNSIGNED_INT&&(K=t.RGBA32UI),k===t.BYTE&&(K=t.RGBA8I),k===t.SHORT&&(K=t.RGBA16I),k===t.INT&&(K=t.RGBA32I)),E===t.RGB&&(k===t.UNSIGNED_INT_5_9_9_9_REV&&(K=t.RGB9_E5),k===t.UNSIGNED_INT_10F_11F_11F_REV&&(K=t.R11F_G11F_B10F)),E===t.RGBA){const Me=ee?qc:Je.getTransfer(Z);k===t.FLOAT&&(K=t.RGBA32F),k===t.HALF_FLOAT&&(K=t.RGBA16F),k===t.UNSIGNED_BYTE&&(K=Me===ct?t.SRGB8_ALPHA8:t.RGBA8),k===t.UNSIGNED_SHORT_4_4_4_4&&(K=t.RGBA4),k===t.UNSIGNED_SHORT_5_5_5_1&&(K=t.RGB5_A1)}return(K===t.R16F||K===t.R32F||K===t.RG16F||K===t.RG32F||K===t.RGBA16F||K===t.RGBA32F)&&e.get("EXT_color_buffer_float"),K}function S(L,E){let k;return L?E===null||E===Ai||E===Ia?k=t.DEPTH24_STENCIL8:E===oi?k=t.DEPTH32F_STENCIL8:E===Da&&(k=t.DEPTH24_STENCIL8,Oe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===Ai||E===Ia?k=t.DEPTH_COMPONENT24:E===oi?k=t.DEPTH_COMPONENT32F:E===Da&&(k=t.DEPTH_COMPONENT16),k}function b(L,E){return g(L)===!0||L.isFramebufferTexture&&L.minFilter!==Kt&&L.minFilter!==an?Math.log2(Math.max(E.width,E.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?E.mipmaps.length:1}function M(L){const E=L.target;E.removeEventListener("dispose",M),y(E),E.isVideoTexture&&d.delete(E)}function T(L){const E=L.target;E.removeEventListener("dispose",T),D(E)}function y(L){const E=i.get(L);if(E.__webglInit===void 0)return;const k=L.source,Z=u.get(k);if(Z){const ee=Z[E.__cacheKey];ee.usedTimes--,ee.usedTimes===0&&w(L),Object.keys(Z).length===0&&u.delete(k)}i.remove(L)}function w(L){const E=i.get(L);t.deleteTexture(E.__webglTexture);const k=L.source,Z=u.get(k);delete Z[E.__cacheKey],o.memory.textures--}function D(L){const E=i.get(L);if(L.depthTexture&&(L.depthTexture.dispose(),i.remove(L.depthTexture)),L.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(E.__webglFramebuffer[Z]))for(let ee=0;ee<E.__webglFramebuffer[Z].length;ee++)t.deleteFramebuffer(E.__webglFramebuffer[Z][ee]);else t.deleteFramebuffer(E.__webglFramebuffer[Z]);E.__webglDepthbuffer&&t.deleteRenderbuffer(E.__webglDepthbuffer[Z])}else{if(Array.isArray(E.__webglFramebuffer))for(let Z=0;Z<E.__webglFramebuffer.length;Z++)t.deleteFramebuffer(E.__webglFramebuffer[Z]);else t.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&t.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&t.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let Z=0;Z<E.__webglColorRenderbuffer.length;Z++)E.__webglColorRenderbuffer[Z]&&t.deleteRenderbuffer(E.__webglColorRenderbuffer[Z]);E.__webglDepthRenderbuffer&&t.deleteRenderbuffer(E.__webglDepthRenderbuffer)}const k=L.textures;for(let Z=0,ee=k.length;Z<ee;Z++){const K=i.get(k[Z]);K.__webglTexture&&(t.deleteTexture(K.__webglTexture),o.memory.textures--),i.remove(k[Z])}i.remove(L)}let C=0;function N(){C=0}function P(){const L=C;return L>=r.maxTextures&&Oe("WebGLTextures: Trying to use "+L+" texture units while this GPU supports only "+r.maxTextures),C+=1,L}function U(L){const E=[];return E.push(L.wrapS),E.push(L.wrapT),E.push(L.wrapR||0),E.push(L.magFilter),E.push(L.minFilter),E.push(L.anisotropy),E.push(L.internalFormat),E.push(L.format),E.push(L.type),E.push(L.generateMipmaps),E.push(L.premultiplyAlpha),E.push(L.flipY),E.push(L.unpackAlignment),E.push(L.colorSpace),E.join()}function V(L,E){const k=i.get(L);if(L.isVideoTexture&&at(L),L.isRenderTargetTexture===!1&&L.isExternalTexture!==!0&&L.version>0&&k.__version!==L.version){const Z=L.image;if(Z===null)Oe("WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)Oe("WebGLRenderer: Texture marked for update but image is incomplete");else{Y(k,L,E);return}}else L.isExternalTexture&&(k.__webglTexture=L.sourceTexture?L.sourceTexture:null);n.bindTexture(t.TEXTURE_2D,k.__webglTexture,t.TEXTURE0+E)}function O(L,E){const k=i.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&k.__version!==L.version){Y(k,L,E);return}else L.isExternalTexture&&(k.__webglTexture=L.sourceTexture?L.sourceTexture:null);n.bindTexture(t.TEXTURE_2D_ARRAY,k.__webglTexture,t.TEXTURE0+E)}function H(L,E){const k=i.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&k.__version!==L.version){Y(k,L,E);return}n.bindTexture(t.TEXTURE_3D,k.__webglTexture,t.TEXTURE0+E)}function z(L,E){const k=i.get(L);if(L.isCubeDepthTexture!==!0&&L.version>0&&k.__version!==L.version){re(k,L,E);return}n.bindTexture(t.TEXTURE_CUBE_MAP,k.__webglTexture,t.TEXTURE0+E)}const X={[ih]:t.REPEAT,[Vi]:t.CLAMP_TO_EDGE,[rh]:t.MIRRORED_REPEAT},J={[Kt]:t.NEAREST,[z1]:t.NEAREST_MIPMAP_NEAREST,[_l]:t.NEAREST_MIPMAP_LINEAR,[an]:t.LINEAR,[af]:t.LINEAR_MIPMAP_NEAREST,[Qr]:t.LINEAR_MIPMAP_LINEAR},Q={[G1]:t.NEVER,[Y1]:t.ALWAYS,[W1]:t.LESS,[Kp]:t.LEQUAL,[X1]:t.EQUAL,[Zp]:t.GEQUAL,[j1]:t.GREATER,[$1]:t.NOTEQUAL};function ie(L,E){if(E.type===oi&&e.has("OES_texture_float_linear")===!1&&(E.magFilter===an||E.magFilter===af||E.magFilter===_l||E.magFilter===Qr||E.minFilter===an||E.minFilter===af||E.minFilter===_l||E.minFilter===Qr)&&Oe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(L,t.TEXTURE_WRAP_S,X[E.wrapS]),t.texParameteri(L,t.TEXTURE_WRAP_T,X[E.wrapT]),(L===t.TEXTURE_3D||L===t.TEXTURE_2D_ARRAY)&&t.texParameteri(L,t.TEXTURE_WRAP_R,X[E.wrapR]),t.texParameteri(L,t.TEXTURE_MAG_FILTER,J[E.magFilter]),t.texParameteri(L,t.TEXTURE_MIN_FILTER,J[E.minFilter]),E.compareFunction&&(t.texParameteri(L,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(L,t.TEXTURE_COMPARE_FUNC,Q[E.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===Kt||E.minFilter!==_l&&E.minFilter!==Qr||E.type===oi&&e.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||i.get(E).__currentAnisotropy){const k=e.get("EXT_texture_filter_anisotropic");t.texParameterf(L,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,r.getMaxAnisotropy())),i.get(E).__currentAnisotropy=E.anisotropy}}}function Fe(L,E){let k=!1;L.__webglInit===void 0&&(L.__webglInit=!0,E.addEventListener("dispose",M));const Z=E.source;let ee=u.get(Z);ee===void 0&&(ee={},u.set(Z,ee));const K=U(E);if(K!==L.__cacheKey){ee[K]===void 0&&(ee[K]={texture:t.createTexture(),usedTimes:0},o.memory.textures++,k=!0),ee[K].usedTimes++;const Me=ee[L.__cacheKey];Me!==void 0&&(ee[L.__cacheKey].usedTimes--,Me.usedTimes===0&&w(E)),L.__cacheKey=K,L.__webglTexture=ee[K].texture}return k}function Ze(L,E,k){return Math.floor(Math.floor(L/k)/E)}function rt(L,E,k,Z){const K=L.updateRanges;if(K.length===0)n.texSubImage2D(t.TEXTURE_2D,0,0,0,E.width,E.height,k,Z,E.data);else{K.sort((oe,le)=>oe.start-le.start);let Me=0;for(let oe=1;oe<K.length;oe++){const le=K[Me],we=K[oe],Te=le.start+le.count,ge=Ze(we.start,E.width,4),Ye=Ze(le.start,E.width,4);we.start<=Te+1&&ge===Ye&&Ze(we.start+we.count-1,E.width,4)===ge?le.count=Math.max(le.count,we.start+we.count-le.start):(++Me,K[Me]=we)}K.length=Me+1;const fe=t.getParameter(t.UNPACK_ROW_LENGTH),Ne=t.getParameter(t.UNPACK_SKIP_PIXELS),ke=t.getParameter(t.UNPACK_SKIP_ROWS);t.pixelStorei(t.UNPACK_ROW_LENGTH,E.width);for(let oe=0,le=K.length;oe<le;oe++){const we=K[oe],Te=Math.floor(we.start/4),ge=Math.ceil(we.count/4),Ye=Te%E.width,F=Math.floor(Te/E.width),de=ge,ce=1;t.pixelStorei(t.UNPACK_SKIP_PIXELS,Ye),t.pixelStorei(t.UNPACK_SKIP_ROWS,F),n.texSubImage2D(t.TEXTURE_2D,0,Ye,F,de,ce,k,Z,E.data)}L.clearUpdateRanges(),t.pixelStorei(t.UNPACK_ROW_LENGTH,fe),t.pixelStorei(t.UNPACK_SKIP_PIXELS,Ne),t.pixelStorei(t.UNPACK_SKIP_ROWS,ke)}}function Y(L,E,k){let Z=t.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(Z=t.TEXTURE_2D_ARRAY),E.isData3DTexture&&(Z=t.TEXTURE_3D);const ee=Fe(L,E),K=E.source;n.bindTexture(Z,L.__webglTexture,t.TEXTURE0+k);const Me=i.get(K);if(K.version!==Me.__version||ee===!0){n.activeTexture(t.TEXTURE0+k);const fe=Je.getPrimaries(Je.workingColorSpace),Ne=E.colorSpace===pr?null:Je.getPrimaries(E.colorSpace),ke=E.colorSpace===pr||fe===Ne?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,E.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,E.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,ke);let oe=v(E.image,!1,r.maxTextureSize);oe=xt(E,oe);const le=s.convert(E.format,E.colorSpace),we=s.convert(E.type);let Te=x(E.internalFormat,le,we,E.colorSpace,E.isVideoTexture);ie(Z,E);let ge;const Ye=E.mipmaps,F=E.isVideoTexture!==!0,de=Me.__version===void 0||ee===!0,ce=K.dataReady,ye=b(E,oe);if(E.isDepthTexture)Te=S(E.format===Jr,E.type),de&&(F?n.texStorage2D(t.TEXTURE_2D,1,Te,oe.width,oe.height):n.texImage2D(t.TEXTURE_2D,0,Te,oe.width,oe.height,0,le,we,null));else if(E.isDataTexture)if(Ye.length>0){F&&de&&n.texStorage2D(t.TEXTURE_2D,ye,Te,Ye[0].width,Ye[0].height);for(let ae=0,q=Ye.length;ae<q;ae++)ge=Ye[ae],F?ce&&n.texSubImage2D(t.TEXTURE_2D,ae,0,0,ge.width,ge.height,le,we,ge.data):n.texImage2D(t.TEXTURE_2D,ae,Te,ge.width,ge.height,0,le,we,ge.data);E.generateMipmaps=!1}else F?(de&&n.texStorage2D(t.TEXTURE_2D,ye,Te,oe.width,oe.height),ce&&rt(E,oe,le,we)):n.texImage2D(t.TEXTURE_2D,0,Te,oe.width,oe.height,0,le,we,oe.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){F&&de&&n.texStorage3D(t.TEXTURE_2D_ARRAY,ye,Te,Ye[0].width,Ye[0].height,oe.depth);for(let ae=0,q=Ye.length;ae<q;ae++)if(ge=Ye[ae],E.format!==ai)if(le!==null)if(F){if(ce)if(E.layerUpdates.size>0){const Ee=p0(ge.width,ge.height,E.format,E.type);for(const ze of E.layerUpdates){const yt=ge.data.subarray(ze*Ee/ge.data.BYTES_PER_ELEMENT,(ze+1)*Ee/ge.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,ae,0,0,ze,ge.width,ge.height,1,le,yt)}E.clearLayerUpdates()}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,ae,0,0,0,ge.width,ge.height,oe.depth,le,ge.data)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,ae,Te,ge.width,ge.height,oe.depth,0,ge.data,0,0);else Oe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else F?ce&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,ae,0,0,0,ge.width,ge.height,oe.depth,le,we,ge.data):n.texImage3D(t.TEXTURE_2D_ARRAY,ae,Te,ge.width,ge.height,oe.depth,0,le,we,ge.data)}else{F&&de&&n.texStorage2D(t.TEXTURE_2D,ye,Te,Ye[0].width,Ye[0].height);for(let ae=0,q=Ye.length;ae<q;ae++)ge=Ye[ae],E.format!==ai?le!==null?F?ce&&n.compressedTexSubImage2D(t.TEXTURE_2D,ae,0,0,ge.width,ge.height,le,ge.data):n.compressedTexImage2D(t.TEXTURE_2D,ae,Te,ge.width,ge.height,0,ge.data):Oe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):F?ce&&n.texSubImage2D(t.TEXTURE_2D,ae,0,0,ge.width,ge.height,le,we,ge.data):n.texImage2D(t.TEXTURE_2D,ae,Te,ge.width,ge.height,0,le,we,ge.data)}else if(E.isDataArrayTexture)if(F){if(de&&n.texStorage3D(t.TEXTURE_2D_ARRAY,ye,Te,oe.width,oe.height,oe.depth),ce)if(E.layerUpdates.size>0){const ae=p0(oe.width,oe.height,E.format,E.type);for(const q of E.layerUpdates){const Ee=oe.data.subarray(q*ae/oe.data.BYTES_PER_ELEMENT,(q+1)*ae/oe.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,q,oe.width,oe.height,1,le,we,Ee)}E.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,oe.width,oe.height,oe.depth,le,we,oe.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,Te,oe.width,oe.height,oe.depth,0,le,we,oe.data);else if(E.isData3DTexture)F?(de&&n.texStorage3D(t.TEXTURE_3D,ye,Te,oe.width,oe.height,oe.depth),ce&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,oe.width,oe.height,oe.depth,le,we,oe.data)):n.texImage3D(t.TEXTURE_3D,0,Te,oe.width,oe.height,oe.depth,0,le,we,oe.data);else if(E.isFramebufferTexture){if(de)if(F)n.texStorage2D(t.TEXTURE_2D,ye,Te,oe.width,oe.height);else{let ae=oe.width,q=oe.height;for(let Ee=0;Ee<ye;Ee++)n.texImage2D(t.TEXTURE_2D,Ee,Te,ae,q,0,le,we,null),ae>>=1,q>>=1}}else if(Ye.length>0){if(F&&de){const ae=Ae(Ye[0]);n.texStorage2D(t.TEXTURE_2D,ye,Te,ae.width,ae.height)}for(let ae=0,q=Ye.length;ae<q;ae++)ge=Ye[ae],F?ce&&n.texSubImage2D(t.TEXTURE_2D,ae,0,0,le,we,ge):n.texImage2D(t.TEXTURE_2D,ae,Te,le,we,ge);E.generateMipmaps=!1}else if(F){if(de){const ae=Ae(oe);n.texStorage2D(t.TEXTURE_2D,ye,Te,ae.width,ae.height)}ce&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,le,we,oe)}else n.texImage2D(t.TEXTURE_2D,0,Te,le,we,oe);g(E)&&p(Z),Me.__version=K.version,E.onUpdate&&E.onUpdate(E)}L.__version=E.version}function re(L,E,k){if(E.image.length!==6)return;const Z=Fe(L,E),ee=E.source;n.bindTexture(t.TEXTURE_CUBE_MAP,L.__webglTexture,t.TEXTURE0+k);const K=i.get(ee);if(ee.version!==K.__version||Z===!0){n.activeTexture(t.TEXTURE0+k);const Me=Je.getPrimaries(Je.workingColorSpace),fe=E.colorSpace===pr?null:Je.getPrimaries(E.colorSpace),Ne=E.colorSpace===pr||Me===fe?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,E.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,E.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ne);const ke=E.isCompressedTexture||E.image[0].isCompressedTexture,oe=E.image[0]&&E.image[0].isDataTexture,le=[];for(let q=0;q<6;q++)!ke&&!oe?le[q]=v(E.image[q],!0,r.maxCubemapSize):le[q]=oe?E.image[q].image:E.image[q],le[q]=xt(E,le[q]);const we=le[0],Te=s.convert(E.format,E.colorSpace),ge=s.convert(E.type),Ye=x(E.internalFormat,Te,ge,E.colorSpace),F=E.isVideoTexture!==!0,de=K.__version===void 0||Z===!0,ce=ee.dataReady;let ye=b(E,we);ie(t.TEXTURE_CUBE_MAP,E);let ae;if(ke){F&&de&&n.texStorage2D(t.TEXTURE_CUBE_MAP,ye,Ye,we.width,we.height);for(let q=0;q<6;q++){ae=le[q].mipmaps;for(let Ee=0;Ee<ae.length;Ee++){const ze=ae[Ee];E.format!==ai?Te!==null?F?ce&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+q,Ee,0,0,ze.width,ze.height,Te,ze.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+q,Ee,Ye,ze.width,ze.height,0,ze.data):Oe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):F?ce&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+q,Ee,0,0,ze.width,ze.height,Te,ge,ze.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+q,Ee,Ye,ze.width,ze.height,0,Te,ge,ze.data)}}}else{if(ae=E.mipmaps,F&&de){ae.length>0&&ye++;const q=Ae(le[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,ye,Ye,q.width,q.height)}for(let q=0;q<6;q++)if(oe){F?ce&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,0,0,le[q].width,le[q].height,Te,ge,le[q].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,Ye,le[q].width,le[q].height,0,Te,ge,le[q].data);for(let Ee=0;Ee<ae.length;Ee++){const yt=ae[Ee].image[q].image;F?ce&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+q,Ee+1,0,0,yt.width,yt.height,Te,ge,yt.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+q,Ee+1,Ye,yt.width,yt.height,0,Te,ge,yt.data)}}else{F?ce&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,0,0,Te,ge,le[q]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,Ye,Te,ge,le[q]);for(let Ee=0;Ee<ae.length;Ee++){const ze=ae[Ee];F?ce&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+q,Ee+1,0,0,Te,ge,ze.image[q]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+q,Ee+1,Ye,Te,ge,ze.image[q])}}}g(E)&&p(t.TEXTURE_CUBE_MAP),K.__version=ee.version,E.onUpdate&&E.onUpdate(E)}L.__version=E.version}function ne(L,E,k,Z,ee,K){const Me=s.convert(k.format,k.colorSpace),fe=s.convert(k.type),Ne=x(k.internalFormat,Me,fe,k.colorSpace),ke=i.get(E),oe=i.get(k);if(oe.__renderTarget=E,!ke.__hasExternalTextures){const le=Math.max(1,E.width>>K),we=Math.max(1,E.height>>K);ee===t.TEXTURE_3D||ee===t.TEXTURE_2D_ARRAY?n.texImage3D(ee,K,Ne,le,we,E.depth,0,Me,fe,null):n.texImage2D(ee,K,Ne,le,we,0,Me,fe,null)}n.bindFramebuffer(t.FRAMEBUFFER,L),Nt(E)?c.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,Z,ee,oe.__webglTexture,0,I(E)):(ee===t.TEXTURE_2D||ee>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&ee<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,Z,ee,oe.__webglTexture,K),n.bindFramebuffer(t.FRAMEBUFFER,null)}function ue(L,E,k){if(t.bindRenderbuffer(t.RENDERBUFFER,L),E.depthBuffer){const Z=E.depthTexture,ee=Z&&Z.isDepthTexture?Z.type:null,K=S(E.stencilBuffer,ee),Me=E.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;Nt(E)?c.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,I(E),K,E.width,E.height):k?t.renderbufferStorageMultisample(t.RENDERBUFFER,I(E),K,E.width,E.height):t.renderbufferStorage(t.RENDERBUFFER,K,E.width,E.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,Me,t.RENDERBUFFER,L)}else{const Z=E.textures;for(let ee=0;ee<Z.length;ee++){const K=Z[ee],Me=s.convert(K.format,K.colorSpace),fe=s.convert(K.type),Ne=x(K.internalFormat,Me,fe,K.colorSpace);Nt(E)?c.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,I(E),Ne,E.width,E.height):k?t.renderbufferStorageMultisample(t.RENDERBUFFER,I(E),Ne,E.width,E.height):t.renderbufferStorage(t.RENDERBUFFER,Ne,E.width,E.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function Re(L,E,k){const Z=E.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(t.FRAMEBUFFER,L),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ee=i.get(E.depthTexture);if(ee.__renderTarget=E,(!ee.__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),Z){if(ee.__webglInit===void 0&&(ee.__webglInit=!0,E.depthTexture.addEventListener("dispose",M)),ee.__webglTexture===void 0){ee.__webglTexture=t.createTexture(),n.bindTexture(t.TEXTURE_CUBE_MAP,ee.__webglTexture),ie(t.TEXTURE_CUBE_MAP,E.depthTexture);const ke=s.convert(E.depthTexture.format),oe=s.convert(E.depthTexture.type);let le;E.depthTexture.format===qi?le=t.DEPTH_COMPONENT24:E.depthTexture.format===Jr&&(le=t.DEPTH24_STENCIL8);for(let we=0;we<6;we++)t.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+we,0,le,E.width,E.height,0,ke,oe,null)}}else V(E.depthTexture,0);const K=ee.__webglTexture,Me=I(E),fe=Z?t.TEXTURE_CUBE_MAP_POSITIVE_X+k:t.TEXTURE_2D,Ne=E.depthTexture.format===Jr?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;if(E.depthTexture.format===qi)Nt(E)?c.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,Ne,fe,K,0,Me):t.framebufferTexture2D(t.FRAMEBUFFER,Ne,fe,K,0);else if(E.depthTexture.format===Jr)Nt(E)?c.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,Ne,fe,K,0,Me):t.framebufferTexture2D(t.FRAMEBUFFER,Ne,fe,K,0);else throw new Error("Unknown depthTexture format")}function De(L){const E=i.get(L),k=L.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==L.depthTexture){const Z=L.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),Z){const ee=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,Z.removeEventListener("dispose",ee)};Z.addEventListener("dispose",ee),E.__depthDisposeCallback=ee}E.__boundDepthTexture=Z}if(L.depthTexture&&!E.__autoAllocateDepthBuffer)if(k)for(let Z=0;Z<6;Z++)Re(E.__webglFramebuffer[Z],L,Z);else{const Z=L.texture.mipmaps;Z&&Z.length>0?Re(E.__webglFramebuffer[0],L,0):Re(E.__webglFramebuffer,L,0)}else if(k){E.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(n.bindFramebuffer(t.FRAMEBUFFER,E.__webglFramebuffer[Z]),E.__webglDepthbuffer[Z]===void 0)E.__webglDepthbuffer[Z]=t.createRenderbuffer(),ue(E.__webglDepthbuffer[Z],L,!1);else{const ee=L.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,K=E.__webglDepthbuffer[Z];t.bindRenderbuffer(t.RENDERBUFFER,K),t.framebufferRenderbuffer(t.FRAMEBUFFER,ee,t.RENDERBUFFER,K)}}else{const Z=L.texture.mipmaps;if(Z&&Z.length>0?n.bindFramebuffer(t.FRAMEBUFFER,E.__webglFramebuffer[0]):n.bindFramebuffer(t.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=t.createRenderbuffer(),ue(E.__webglDepthbuffer,L,!1);else{const ee=L.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,K=E.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,K),t.framebufferRenderbuffer(t.FRAMEBUFFER,ee,t.RENDERBUFFER,K)}}n.bindFramebuffer(t.FRAMEBUFFER,null)}function pt(L,E,k){const Z=i.get(L);E!==void 0&&ne(Z.__webglFramebuffer,L,L.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),k!==void 0&&De(L)}function Xe(L){const E=L.texture,k=i.get(L),Z=i.get(E);L.addEventListener("dispose",T);const ee=L.textures,K=L.isWebGLCubeRenderTarget===!0,Me=ee.length>1;if(Me||(Z.__webglTexture===void 0&&(Z.__webglTexture=t.createTexture()),Z.__version=E.version,o.memory.textures++),K){k.__webglFramebuffer=[];for(let fe=0;fe<6;fe++)if(E.mipmaps&&E.mipmaps.length>0){k.__webglFramebuffer[fe]=[];for(let Ne=0;Ne<E.mipmaps.length;Ne++)k.__webglFramebuffer[fe][Ne]=t.createFramebuffer()}else k.__webglFramebuffer[fe]=t.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){k.__webglFramebuffer=[];for(let fe=0;fe<E.mipmaps.length;fe++)k.__webglFramebuffer[fe]=t.createFramebuffer()}else k.__webglFramebuffer=t.createFramebuffer();if(Me)for(let fe=0,Ne=ee.length;fe<Ne;fe++){const ke=i.get(ee[fe]);ke.__webglTexture===void 0&&(ke.__webglTexture=t.createTexture(),o.memory.textures++)}if(L.samples>0&&Nt(L)===!1){k.__webglMultisampledFramebuffer=t.createFramebuffer(),k.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let fe=0;fe<ee.length;fe++){const Ne=ee[fe];k.__webglColorRenderbuffer[fe]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,k.__webglColorRenderbuffer[fe]);const ke=s.convert(Ne.format,Ne.colorSpace),oe=s.convert(Ne.type),le=x(Ne.internalFormat,ke,oe,Ne.colorSpace,L.isXRRenderTarget===!0),we=I(L);t.renderbufferStorageMultisample(t.RENDERBUFFER,we,le,L.width,L.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+fe,t.RENDERBUFFER,k.__webglColorRenderbuffer[fe])}t.bindRenderbuffer(t.RENDERBUFFER,null),L.depthBuffer&&(k.__webglDepthRenderbuffer=t.createRenderbuffer(),ue(k.__webglDepthRenderbuffer,L,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(K){n.bindTexture(t.TEXTURE_CUBE_MAP,Z.__webglTexture),ie(t.TEXTURE_CUBE_MAP,E);for(let fe=0;fe<6;fe++)if(E.mipmaps&&E.mipmaps.length>0)for(let Ne=0;Ne<E.mipmaps.length;Ne++)ne(k.__webglFramebuffer[fe][Ne],L,E,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+fe,Ne);else ne(k.__webglFramebuffer[fe],L,E,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0);g(E)&&p(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(Me){for(let fe=0,Ne=ee.length;fe<Ne;fe++){const ke=ee[fe],oe=i.get(ke);let le=t.TEXTURE_2D;(L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(le=L.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(le,oe.__webglTexture),ie(le,ke),ne(k.__webglFramebuffer,L,ke,t.COLOR_ATTACHMENT0+fe,le,0),g(ke)&&p(le)}n.unbindTexture()}else{let fe=t.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(fe=L.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(fe,Z.__webglTexture),ie(fe,E),E.mipmaps&&E.mipmaps.length>0)for(let Ne=0;Ne<E.mipmaps.length;Ne++)ne(k.__webglFramebuffer[Ne],L,E,t.COLOR_ATTACHMENT0,fe,Ne);else ne(k.__webglFramebuffer,L,E,t.COLOR_ATTACHMENT0,fe,0);g(E)&&p(fe),n.unbindTexture()}L.depthBuffer&&De(L)}function tt(L){const E=L.textures;for(let k=0,Z=E.length;k<Z;k++){const ee=E[k];if(g(ee)){const K=_(L),Me=i.get(ee).__webglTexture;n.bindTexture(K,Me),p(K),n.unbindTexture()}}}const Be=[],Ue=[];function ot(L){if(L.samples>0){if(Nt(L)===!1){const E=L.textures,k=L.width,Z=L.height;let ee=t.COLOR_BUFFER_BIT;const K=L.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Me=i.get(L),fe=E.length>1;if(fe)for(let ke=0;ke<E.length;ke++)n.bindFramebuffer(t.FRAMEBUFFER,Me.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ke,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,Me.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+ke,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,Me.__webglMultisampledFramebuffer);const Ne=L.texture.mipmaps;Ne&&Ne.length>0?n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Me.__webglFramebuffer[0]):n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Me.__webglFramebuffer);for(let ke=0;ke<E.length;ke++){if(L.resolveDepthBuffer&&(L.depthBuffer&&(ee|=t.DEPTH_BUFFER_BIT),L.stencilBuffer&&L.resolveStencilBuffer&&(ee|=t.STENCIL_BUFFER_BIT)),fe){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,Me.__webglColorRenderbuffer[ke]);const oe=i.get(E[ke]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,oe,0)}t.blitFramebuffer(0,0,k,Z,0,0,k,Z,ee,t.NEAREST),l===!0&&(Be.length=0,Ue.length=0,Be.push(t.COLOR_ATTACHMENT0+ke),L.depthBuffer&&L.resolveDepthBuffer===!1&&(Be.push(K),Ue.push(K),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,Ue)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,Be))}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),fe)for(let ke=0;ke<E.length;ke++){n.bindFramebuffer(t.FRAMEBUFFER,Me.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ke,t.RENDERBUFFER,Me.__webglColorRenderbuffer[ke]);const oe=i.get(E[ke]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,Me.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+ke,t.TEXTURE_2D,oe,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Me.__webglMultisampledFramebuffer)}else if(L.depthBuffer&&L.resolveDepthBuffer===!1&&l){const E=L.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[E])}}}function I(L){return Math.min(r.maxSamples,L.samples)}function Nt(L){const E=i.get(L);return L.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function at(L){const E=o.render.frame;d.get(L)!==E&&(d.set(L,E),L.update())}function xt(L,E){const k=L.colorSpace,Z=L.format,ee=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||k!==yo&&k!==pr&&(Je.getTransfer(k)===ct?(Z!==ai||ee!==Dn)&&Oe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Qe("WebGLTextures: Unsupported texture color space:",k)),E}function Ae(L){return typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement?(f.width=L.naturalWidth||L.width,f.height=L.naturalHeight||L.height):typeof VideoFrame<"u"&&L instanceof VideoFrame?(f.width=L.displayWidth,f.height=L.displayHeight):(f.width=L.width,f.height=L.height),f}this.allocateTextureUnit=P,this.resetTextureUnits=N,this.setTexture2D=V,this.setTexture2DArray=O,this.setTexture3D=H,this.setTextureCube=z,this.rebindTextures=pt,this.setupRenderTarget=Xe,this.updateRenderTargetMipmap=tt,this.updateMultisampleRenderTarget=ot,this.setupDepthRenderbuffer=De,this.setupFrameBufferTexture=ne,this.useMultisampledRTT=Nt,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function HC(t,e){function n(i,r=pr){let s;const o=Je.getTransfer(r);if(i===Dn)return t.UNSIGNED_BYTE;if(i===Gp)return t.UNSIGNED_SHORT_4_4_4_4;if(i===Wp)return t.UNSIGNED_SHORT_5_5_5_1;if(i===kx)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===Bx)return t.UNSIGNED_INT_10F_11F_11F_REV;if(i===Fx)return t.BYTE;if(i===Ox)return t.SHORT;if(i===Da)return t.UNSIGNED_SHORT;if(i===Hp)return t.INT;if(i===Ai)return t.UNSIGNED_INT;if(i===oi)return t.FLOAT;if(i===Fn)return t.HALF_FLOAT;if(i===zx)return t.ALPHA;if(i===Vx)return t.RGB;if(i===ai)return t.RGBA;if(i===qi)return t.DEPTH_COMPONENT;if(i===Jr)return t.DEPTH_STENCIL;if(i===Xp)return t.RED;if(i===jp)return t.RED_INTEGER;if(i===xo)return t.RG;if(i===$p)return t.RG_INTEGER;if(i===Yp)return t.RGBA_INTEGER;if(i===gc||i===_c||i===vc||i===xc)if(o===ct)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===gc)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===_c)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===vc)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===xc)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===gc)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===_c)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===vc)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===xc)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===sh||i===oh||i===ah||i===lh)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===sh)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===oh)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===ah)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===lh)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===ch||i===uh||i===fh||i===dh||i===hh||i===ph||i===mh)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===ch||i===uh)return o===ct?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===fh)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(i===dh)return s.COMPRESSED_R11_EAC;if(i===hh)return s.COMPRESSED_SIGNED_R11_EAC;if(i===ph)return s.COMPRESSED_RG11_EAC;if(i===mh)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===gh||i===_h||i===vh||i===xh||i===yh||i===Sh||i===Mh||i===wh||i===Eh||i===Th||i===bh||i===Ah||i===Ch||i===Rh)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===gh)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===_h)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===vh)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===xh)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===yh)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Sh)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Mh)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===wh)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Eh)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Th)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===bh)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Ah)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Ch)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Rh)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Ph||i===Lh||i===Dh)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===Ph)return o===ct?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Lh)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Dh)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Ih||i===Nh||i===Uh||i===Fh)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===Ih)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Nh)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Uh)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Fh)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Ia?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:n}}const GC=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,WC=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class XC{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n){if(this.texture===null){const i=new Qx(e.texture);(e.depthNear!==n.depthNear||e.depthFar!==n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const n=e.cameras[0].viewport,i=new Tt({vertexShader:GC,fragmentShader:WC,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new mn(new Xa(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class jC extends fs{constructor(e,n){super();const i=this;let r=null,s=1,o=null,c="local-floor",l=1,f=null,d=null,a=null,u=null,h=null,m=null;const v=typeof XRWebGLBinding<"u",g=new XC,p={},_=n.getContextAttributes();let x=null,S=null;const b=[],M=[],T=new _e;let y=null;const w=new Ln;w.viewport=new Lt;const D=new Ln;D.viewport=new Lt;const C=[w,D],N=new tE;let P=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let re=b[Y];return re===void 0&&(re=new hf,b[Y]=re),re.getTargetRaySpace()},this.getControllerGrip=function(Y){let re=b[Y];return re===void 0&&(re=new hf,b[Y]=re),re.getGripSpace()},this.getHand=function(Y){let re=b[Y];return re===void 0&&(re=new hf,b[Y]=re),re.getHandSpace()};function V(Y){const re=M.indexOf(Y.inputSource);if(re===-1)return;const ne=b[re];ne!==void 0&&(ne.update(Y.inputSource,Y.frame,f||o),ne.dispatchEvent({type:Y.type,data:Y.inputSource}))}function O(){r.removeEventListener("select",V),r.removeEventListener("selectstart",V),r.removeEventListener("selectend",V),r.removeEventListener("squeeze",V),r.removeEventListener("squeezestart",V),r.removeEventListener("squeezeend",V),r.removeEventListener("end",O),r.removeEventListener("inputsourceschange",H);for(let Y=0;Y<b.length;Y++){const re=M[Y];re!==null&&(M[Y]=null,b[Y].disconnect(re))}P=null,U=null,g.reset();for(const Y in p)delete p[Y];e.setRenderTarget(x),h=null,u=null,a=null,r=null,S=null,rt.stop(),i.isPresenting=!1,e.setPixelRatio(y),e.setSize(T.width,T.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){s=Y,i.isPresenting===!0&&Oe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){c=Y,i.isPresenting===!0&&Oe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return f||o},this.setReferenceSpace=function(Y){f=Y},this.getBaseLayer=function(){return u!==null?u:h},this.getBinding=function(){return a===null&&v&&(a=new XRWebGLBinding(r,n)),a},this.getFrame=function(){return m},this.getSession=function(){return r},this.setSession=async function(Y){if(r=Y,r!==null){if(x=e.getRenderTarget(),r.addEventListener("select",V),r.addEventListener("selectstart",V),r.addEventListener("selectend",V),r.addEventListener("squeeze",V),r.addEventListener("squeezestart",V),r.addEventListener("squeezeend",V),r.addEventListener("end",O),r.addEventListener("inputsourceschange",H),_.xrCompatible!==!0&&await n.makeXRCompatible(),y=e.getPixelRatio(),e.getSize(T),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let ne=null,ue=null,Re=null;_.depth&&(Re=_.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,ne=_.stencil?Jr:qi,ue=_.stencil?Ia:Ai);const De={colorFormat:n.RGBA8,depthFormat:Re,scaleFactor:s};a=this.getBinding(),u=a.createProjectionLayer(De),r.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),S=new Tn(u.textureWidth,u.textureHeight,{format:ai,type:Dn,depthTexture:new Fa(u.textureWidth,u.textureHeight,ue,void 0,void 0,void 0,void 0,void 0,void 0,ne),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{const ne={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:s};h=new XRWebGLLayer(r,n,ne),r.updateRenderState({baseLayer:h}),e.setPixelRatio(1),e.setSize(h.framebufferWidth,h.framebufferHeight,!1),S=new Tn(h.framebufferWidth,h.framebufferHeight,{format:ai,type:Dn,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(l),f=null,o=await r.requestReferenceSpace(c),rt.setContext(r),rt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function H(Y){for(let re=0;re<Y.removed.length;re++){const ne=Y.removed[re],ue=M.indexOf(ne);ue>=0&&(M[ue]=null,b[ue].disconnect(ne))}for(let re=0;re<Y.added.length;re++){const ne=Y.added[re];let ue=M.indexOf(ne);if(ue===-1){for(let De=0;De<b.length;De++)if(De>=M.length){M.push(ne),ue=De;break}else if(M[De]===null){M[De]=ne,ue=De;break}if(ue===-1)break}const Re=b[ue];Re&&Re.connect(ne)}}const z=new R,X=new R;function J(Y,re,ne){z.setFromMatrixPosition(re.matrixWorld),X.setFromMatrixPosition(ne.matrixWorld);const ue=z.distanceTo(X),Re=re.projectionMatrix.elements,De=ne.projectionMatrix.elements,pt=Re[14]/(Re[10]-1),Xe=Re[14]/(Re[10]+1),tt=(Re[9]+1)/Re[5],Be=(Re[9]-1)/Re[5],Ue=(Re[8]-1)/Re[0],ot=(De[8]+1)/De[0],I=pt*Ue,Nt=pt*ot,at=ue/(-Ue+ot),xt=at*-Ue;if(re.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(xt),Y.translateZ(at),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Re[10]===-1)Y.projectionMatrix.copy(re.projectionMatrix),Y.projectionMatrixInverse.copy(re.projectionMatrixInverse);else{const Ae=pt+at,L=Xe+at,E=I-xt,k=Nt+(ue-xt),Z=tt*Xe/L*Ae,ee=Be*Xe/L*Ae;Y.projectionMatrix.makePerspective(E,k,Z,ee,Ae,L),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function Q(Y,re){re===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(re.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(r===null)return;let re=Y.near,ne=Y.far;g.texture!==null&&(g.depthNear>0&&(re=g.depthNear),g.depthFar>0&&(ne=g.depthFar)),N.near=D.near=w.near=re,N.far=D.far=w.far=ne,(P!==N.near||U!==N.far)&&(r.updateRenderState({depthNear:N.near,depthFar:N.far}),P=N.near,U=N.far),N.layers.mask=Y.layers.mask|6,w.layers.mask=N.layers.mask&-5,D.layers.mask=N.layers.mask&-3;const ue=Y.parent,Re=N.cameras;Q(N,ue);for(let De=0;De<Re.length;De++)Q(Re[De],ue);Re.length===2?J(N,w,D):N.projectionMatrix.copy(w.projectionMatrix),ie(Y,N,ue)};function ie(Y,re,ne){ne===null?Y.matrix.copy(re.matrixWorld):(Y.matrix.copy(ne.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(re.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(re.projectionMatrix),Y.projectionMatrixInverse.copy(re.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Ua*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return N},this.getFoveation=function(){if(!(u===null&&h===null))return l},this.setFoveation=function(Y){l=Y,u!==null&&(u.fixedFoveation=Y),h!==null&&h.fixedFoveation!==void 0&&(h.fixedFoveation=Y)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(N)},this.getCameraTexture=function(Y){return p[Y]};let Fe=null;function Ze(Y,re){if(d=re.getViewerPose(f||o),m=re,d!==null){const ne=d.views;h!==null&&(e.setRenderTargetFramebuffer(S,h.framebuffer),e.setRenderTarget(S));let ue=!1;ne.length!==N.cameras.length&&(N.cameras.length=0,ue=!0);for(let Xe=0;Xe<ne.length;Xe++){const tt=ne[Xe];let Be=null;if(h!==null)Be=h.getViewport(tt);else{const ot=a.getViewSubImage(u,tt);Be=ot.viewport,Xe===0&&(e.setRenderTargetTextures(S,ot.colorTexture,ot.depthStencilTexture),e.setRenderTarget(S))}let Ue=C[Xe];Ue===void 0&&(Ue=new Ln,Ue.layers.enable(Xe),Ue.viewport=new Lt,C[Xe]=Ue),Ue.matrix.fromArray(tt.transform.matrix),Ue.matrix.decompose(Ue.position,Ue.quaternion,Ue.scale),Ue.projectionMatrix.fromArray(tt.projectionMatrix),Ue.projectionMatrixInverse.copy(Ue.projectionMatrix).invert(),Ue.viewport.set(Be.x,Be.y,Be.width,Be.height),Xe===0&&(N.matrix.copy(Ue.matrix),N.matrix.decompose(N.position,N.quaternion,N.scale)),ue===!0&&N.cameras.push(Ue)}const Re=r.enabledFeatures;if(Re&&Re.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&v){a=i.getBinding();const Xe=a.getDepthInformation(ne[0]);Xe&&Xe.isValid&&Xe.texture&&g.init(Xe,r.renderState)}if(Re&&Re.includes("camera-access")&&v){e.state.unbindTexture(),a=i.getBinding();for(let Xe=0;Xe<ne.length;Xe++){const tt=ne[Xe].camera;if(tt){let Be=p[tt];Be||(Be=new Qx,p[tt]=Be);const Ue=a.getCameraImage(tt);Be.sourceTexture=Ue}}}}for(let ne=0;ne<b.length;ne++){const ue=M[ne],Re=b[ne];ue!==null&&Re!==void 0&&Re.update(ue,re,f||o)}Fe&&Fe(Y,re),re.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:re}),m=null}const rt=new ly;rt.setAnimationLoop(Ze),this.setAnimationLoop=function(Y){Fe=Y},this.dispose=function(){}}}const Hr=new di,$C=new ht;function YC(t,e){function n(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function i(g,p){p.color.getRGB(g.fogColor.value,sy(t)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function r(g,p,_,x,S){p.isMeshBasicMaterial?s(g,p):p.isMeshLambertMaterial?(s(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(s(g,p),a(g,p)):p.isMeshPhongMaterial?(s(g,p),d(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(s(g,p),u(g,p),p.isMeshPhysicalMaterial&&h(g,p,S)):p.isMeshMatcapMaterial?(s(g,p),m(g,p)):p.isMeshDepthMaterial?s(g,p):p.isMeshDistanceMaterial?(s(g,p),v(g,p)):p.isMeshNormalMaterial?s(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&c(g,p)):p.isPointsMaterial?l(g,p,_,x):p.isSpriteMaterial?f(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,n(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,n(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,n(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===En&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,n(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===En&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,n(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,n(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,n(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const _=e.get(p),x=_.envMap,S=_.envMapRotation;x&&(g.envMap.value=x,Hr.copy(S),Hr.x*=-1,Hr.y*=-1,Hr.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(Hr.y*=-1,Hr.z*=-1),g.envMapRotation.value.setFromMatrix4($C.makeRotationFromEuler(Hr)),g.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,n(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,n(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,n(p.map,g.mapTransform))}function c(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,_,x){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*_,g.scale.value=x*.5,p.map&&(g.map.value=p.map,n(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,n(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function f(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,n(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,n(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function d(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function a(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function u(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,n(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,n(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function h(g,p,_){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,n(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,n(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,n(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,n(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,n(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===En&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,n(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,n(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=_.texture,g.transmissionSamplerSize.value.set(_.width,_.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,n(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,n(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,n(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,n(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,n(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function v(g,p){const _=e.get(p).light;g.referencePosition.value.setFromMatrixPosition(_.matrixWorld),g.nearDistance.value=_.shadow.camera.near,g.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function qC(t,e,n,i){let r={},s={},o=[];const c=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function l(_,x){const S=x.program;i.uniformBlockBinding(_,S)}function f(_,x){let S=r[_.id];S===void 0&&(m(_),S=d(_),r[_.id]=S,_.addEventListener("dispose",g));const b=x.program;i.updateUBOMapping(_,b);const M=e.render.frame;s[_.id]!==M&&(u(_),s[_.id]=M)}function d(_){const x=a();_.__bindingPointIndex=x;const S=t.createBuffer(),b=_.__size,M=_.usage;return t.bindBuffer(t.UNIFORM_BUFFER,S),t.bufferData(t.UNIFORM_BUFFER,b,M),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,x,S),S}function a(){for(let _=0;_<c;_++)if(o.indexOf(_)===-1)return o.push(_),_;return Qe("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(_){const x=r[_.id],S=_.uniforms,b=_.__cache;t.bindBuffer(t.UNIFORM_BUFFER,x);for(let M=0,T=S.length;M<T;M++){const y=Array.isArray(S[M])?S[M]:[S[M]];for(let w=0,D=y.length;w<D;w++){const C=y[w];if(h(C,M,w,b)===!0){const N=C.__offset,P=Array.isArray(C.value)?C.value:[C.value];let U=0;for(let V=0;V<P.length;V++){const O=P[V],H=v(O);typeof O=="number"||typeof O=="boolean"?(C.__data[0]=O,t.bufferSubData(t.UNIFORM_BUFFER,N+U,C.__data)):O.isMatrix3?(C.__data[0]=O.elements[0],C.__data[1]=O.elements[1],C.__data[2]=O.elements[2],C.__data[3]=0,C.__data[4]=O.elements[3],C.__data[5]=O.elements[4],C.__data[6]=O.elements[5],C.__data[7]=0,C.__data[8]=O.elements[6],C.__data[9]=O.elements[7],C.__data[10]=O.elements[8],C.__data[11]=0):(O.toArray(C.__data,U),U+=H.storage/Float32Array.BYTES_PER_ELEMENT)}t.bufferSubData(t.UNIFORM_BUFFER,N,C.__data)}}}t.bindBuffer(t.UNIFORM_BUFFER,null)}function h(_,x,S,b){const M=_.value,T=x+"_"+S;if(b[T]===void 0)return typeof M=="number"||typeof M=="boolean"?b[T]=M:b[T]=M.clone(),!0;{const y=b[T];if(typeof M=="number"||typeof M=="boolean"){if(y!==M)return b[T]=M,!0}else if(y.equals(M)===!1)return y.copy(M),!0}return!1}function m(_){const x=_.uniforms;let S=0;const b=16;for(let T=0,y=x.length;T<y;T++){const w=Array.isArray(x[T])?x[T]:[x[T]];for(let D=0,C=w.length;D<C;D++){const N=w[D],P=Array.isArray(N.value)?N.value:[N.value];for(let U=0,V=P.length;U<V;U++){const O=P[U],H=v(O),z=S%b,X=z%H.boundary,J=z+X;S+=X,J!==0&&b-J<H.storage&&(S+=b-J),N.__data=new Float32Array(H.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=S,S+=H.storage}}}const M=S%b;return M>0&&(S+=b-M),_.__size=S,_.__cache={},this}function v(_){const x={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(x.boundary=4,x.storage=4):_.isVector2?(x.boundary=8,x.storage=8):_.isVector3||_.isColor?(x.boundary=16,x.storage=12):_.isVector4?(x.boundary=16,x.storage=16):_.isMatrix3?(x.boundary=48,x.storage=48):_.isMatrix4?(x.boundary=64,x.storage=64):_.isTexture?Oe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):Oe("WebGLRenderer: Unsupported uniform value type.",_),x}function g(_){const x=_.target;x.removeEventListener("dispose",g);const S=o.indexOf(x.__bindingPointIndex);o.splice(S,1),t.deleteBuffer(r[x.id]),delete r[x.id],delete s[x.id]}function p(){for(const _ in r)t.deleteBuffer(r[_]);o=[],r={},s={}}return{bind:l,update:f,dispose:p}}const KC=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let _i=null;function ZC(){return _i===null&&(_i=new Kx(KC,16,16,xo,Fn),_i.name="DFG_LUT",_i.minFilter=an,_i.magFilter=an,_i.wrapS=Vi,_i.wrapT=Vi,_i.generateMipmaps=!1,_i.needsUpdate=!0),_i}class QC{constructor(e={}){const{canvas:n=Z1(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:c=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:f=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:a=!1,reversedDepthBuffer:u=!1,outputBufferType:h=Dn}=e;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=o;const v=h,g=new Set([Yp,$p,jp]),p=new Set([Dn,Ai,Da,Ia,Gp,Wp]),_=new Uint32Array(4),x=new Int32Array(4);let S=null,b=null;const M=[],T=[];let y=null;this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ti,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const w=this;let D=!1;this._outputColorSpace=Gn;let C=0,N=0,P=null,U=-1,V=null;const O=new Lt,H=new Lt;let z=null;const X=new te(0);let J=0,Q=n.width,ie=n.height,Fe=1,Ze=null,rt=null;const Y=new Lt(0,0,Q,ie),re=new Lt(0,0,Q,ie);let ne=!1;const ue=new tm;let Re=!1,De=!1;const pt=new ht,Xe=new R,tt=new Lt,Be={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ue=!1;function ot(){return P===null?Fe:1}let I=i;function Nt(A,B){return n.getContext(A,B)}try{const A={alpha:!0,depth:r,stencil:s,antialias:c,premultipliedAlpha:l,preserveDrawingBuffer:f,powerPreference:d,failIfMajorPerformanceCaveat:a};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${zp}`),n.addEventListener("webglcontextlost",Ee,!1),n.addEventListener("webglcontextrestored",ze,!1),n.addEventListener("webglcontextcreationerror",yt,!1),I===null){const B="webgl2";if(I=Nt(B,A),I===null)throw Nt(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw Qe("WebGLRenderer: "+A.message),A}let at,xt,Ae,L,E,k,Z,ee,K,Me,fe,Ne,ke,oe,le,we,Te,ge,Ye,F,de,ce,ye;function ae(){at=new Qb(I),at.init(),de=new HC(I,at),xt=new Wb(I,at,e,de),Ae=new zC(I,at),xt.reversedDepthBuffer&&u&&Ae.buffers.depth.setReversed(!0),L=new tA(I),E=new bC,k=new VC(I,at,Ae,E,xt,de,L),Z=new Zb(w),ee=new oE(I),ce=new Hb(I,ee),K=new Jb(I,ee,L,ce),Me=new iA(I,K,ee,ce,L),ge=new nA(I,xt,k),le=new Xb(E),fe=new TC(w,Z,at,xt,ce,le),Ne=new YC(w,E),ke=new CC,oe=new NC(at),Te=new Vb(w,Z,Ae,Me,m,l),we=new BC(w,Me,xt),ye=new qC(I,L,xt,Ae),Ye=new Gb(I,at,L),F=new eA(I,at,L),L.programs=fe.programs,w.capabilities=xt,w.extensions=at,w.properties=E,w.renderLists=ke,w.shadowMap=we,w.state=Ae,w.info=L}ae(),v!==Dn&&(y=new sA(v,n.width,n.height,r,s));const q=new jC(w,I);this.xr=q,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){const A=at.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=at.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return Fe},this.setPixelRatio=function(A){A!==void 0&&(Fe=A,this.setSize(Q,ie,!1))},this.getSize=function(A){return A.set(Q,ie)},this.setSize=function(A,B,j=!0){if(q.isPresenting){Oe("WebGLRenderer: Can't change size while VR device is presenting.");return}Q=A,ie=B,n.width=Math.floor(A*Fe),n.height=Math.floor(B*Fe),j===!0&&(n.style.width=A+"px",n.style.height=B+"px"),y!==null&&y.setSize(n.width,n.height),this.setViewport(0,0,A,B)},this.getDrawingBufferSize=function(A){return A.set(Q*Fe,ie*Fe).floor()},this.setDrawingBufferSize=function(A,B,j){Q=A,ie=B,Fe=j,n.width=Math.floor(A*j),n.height=Math.floor(B*j),this.setViewport(0,0,A,B)},this.setEffects=function(A){if(v===Dn){console.error("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(A){for(let B=0;B<A.length;B++)if(A[B].isOutputPass===!0){console.warn("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}y.setEffects(A||[])},this.getCurrentViewport=function(A){return A.copy(O)},this.getViewport=function(A){return A.copy(Y)},this.setViewport=function(A,B,j,W){A.isVector4?Y.set(A.x,A.y,A.z,A.w):Y.set(A,B,j,W),Ae.viewport(O.copy(Y).multiplyScalar(Fe).round())},this.getScissor=function(A){return A.copy(re)},this.setScissor=function(A,B,j,W){A.isVector4?re.set(A.x,A.y,A.z,A.w):re.set(A,B,j,W),Ae.scissor(H.copy(re).multiplyScalar(Fe).round())},this.getScissorTest=function(){return ne},this.setScissorTest=function(A){Ae.setScissorTest(ne=A)},this.setOpaqueSort=function(A){Ze=A},this.setTransparentSort=function(A){rt=A},this.getClearColor=function(A){return A.copy(Te.getClearColor())},this.setClearColor=function(){Te.setClearColor(...arguments)},this.getClearAlpha=function(){return Te.getClearAlpha()},this.setClearAlpha=function(){Te.setClearAlpha(...arguments)},this.clear=function(A=!0,B=!0,j=!0){let W=0;if(A){let G=!1;if(P!==null){const pe=P.texture.format;G=g.has(pe)}if(G){const pe=P.texture.type,ve=p.has(pe),me=Te.getClearColor(),be=Te.getClearAlpha(),Pe=me.r,Ge=me.g,qe=me.b;ve?(_[0]=Pe,_[1]=Ge,_[2]=qe,_[3]=be,I.clearBufferuiv(I.COLOR,0,_)):(x[0]=Pe,x[1]=Ge,x[2]=qe,x[3]=be,I.clearBufferiv(I.COLOR,0,x))}else W|=I.COLOR_BUFFER_BIT}B&&(W|=I.DEPTH_BUFFER_BIT),j&&(W|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),W!==0&&I.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener("webglcontextlost",Ee,!1),n.removeEventListener("webglcontextrestored",ze,!1),n.removeEventListener("webglcontextcreationerror",yt,!1),Te.dispose(),ke.dispose(),oe.dispose(),E.dispose(),Z.dispose(),Me.dispose(),ce.dispose(),ye.dispose(),fe.dispose(),q.dispose(),q.removeEventListener("sessionstart",am),q.removeEventListener("sessionend",lm),Nr.stop()};function Ee(A){A.preventDefault(),Zc("WebGLRenderer: Context Lost."),D=!0}function ze(){Zc("WebGLRenderer: Context Restored."),D=!1;const A=L.autoReset,B=we.enabled,j=we.autoUpdate,W=we.needsUpdate,G=we.type;ae(),L.autoReset=A,we.enabled=B,we.autoUpdate=j,we.needsUpdate=W,we.type=G}function yt(A){Qe("WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function lt(A){const B=A.target;B.removeEventListener("dispose",lt),Ri(B)}function Ri(A){Pi(A),E.remove(A)}function Pi(A){const B=E.get(A).programs;B!==void 0&&(B.forEach(function(j){fe.releaseProgram(j)}),A.isShaderMaterial&&fe.releaseShaderCache(A))}this.renderBufferDirect=function(A,B,j,W,G,pe){B===null&&(B=Be);const ve=G.isMesh&&G.matrixWorld.determinant()<0,me=by(A,B,j,W,G);Ae.setMaterial(W,ve);let be=j.index,Pe=1;if(W.wireframe===!0){if(be=K.getWireframeAttribute(j),be===void 0)return;Pe=2}const Ge=j.drawRange,qe=j.attributes.position;let Le=Ge.start*Pe,mt=(Ge.start+Ge.count)*Pe;pe!==null&&(Le=Math.max(Le,pe.start*Pe),mt=Math.min(mt,(pe.start+pe.count)*Pe)),be!==null?(Le=Math.max(Le,0),mt=Math.min(mt,be.count)):qe!=null&&(Le=Math.max(Le,0),mt=Math.min(mt,qe.count));const Dt=mt-Le;if(Dt<0||Dt===1/0)return;ce.setup(G,W,me,j,be);let Rt,gt=Ye;if(be!==null&&(Rt=ee.get(be),gt=F,gt.setIndex(Rt)),G.isMesh)W.wireframe===!0?(Ae.setLineWidth(W.wireframeLinewidth*ot()),gt.setMode(I.LINES)):gt.setMode(I.TRIANGLES);else if(G.isLine){let en=W.linewidth;en===void 0&&(en=1),Ae.setLineWidth(en*ot()),G.isLineSegments?gt.setMode(I.LINES):G.isLineLoop?gt.setMode(I.LINE_LOOP):gt.setMode(I.LINE_STRIP)}else G.isPoints?gt.setMode(I.POINTS):G.isSprite&&gt.setMode(I.TRIANGLES);if(G.isBatchedMesh)if(G._multiDrawInstances!==null)Qc("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),gt.renderMultiDrawInstances(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount,G._multiDrawInstances);else if(at.get("WEBGL_multi_draw"))gt.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{const en=G._multiDrawStarts,Ce=G._multiDrawCounts,An=G._multiDrawCount,nt=be?ee.get(be).bytesPerElement:1,Kn=E.get(W).currentProgram.getUniforms();for(let hi=0;hi<An;hi++)Kn.setValue(I,"_gl_DrawID",hi),gt.render(en[hi]/nt,Ce[hi])}else if(G.isInstancedMesh)gt.renderInstances(Le,Dt,G.count);else if(j.isInstancedBufferGeometry){const en=j._maxInstanceCount!==void 0?j._maxInstanceCount:1/0,Ce=Math.min(j.instanceCount,en);gt.renderInstances(Le,Dt,Ce)}else gt.render(Le,Dt)};function om(A,B,j){A.transparent===!0&&A.side===ri&&A.forceSinglePass===!1?(A.side=En,A.needsUpdate=!0,Ya(A,B,j),A.side=Cr,A.needsUpdate=!0,Ya(A,B,j),A.side=ri):Ya(A,B,j)}this.compile=function(A,B,j=null){j===null&&(j=A),b=oe.get(j),b.init(B),T.push(b),j.traverseVisible(function(G){G.isLight&&G.layers.test(B.layers)&&(b.pushLight(G),G.castShadow&&b.pushShadow(G))}),A!==j&&A.traverseVisible(function(G){G.isLight&&G.layers.test(B.layers)&&(b.pushLight(G),G.castShadow&&b.pushShadow(G))}),b.setupLights();const W=new Set;return A.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;const pe=G.material;if(pe)if(Array.isArray(pe))for(let ve=0;ve<pe.length;ve++){const me=pe[ve];om(me,j,G),W.add(me)}else om(pe,j,G),W.add(pe)}),b=T.pop(),W},this.compileAsync=function(A,B,j=null){const W=this.compile(A,B,j);return new Promise(G=>{function pe(){if(W.forEach(function(ve){E.get(ve).currentProgram.isReady()&&W.delete(ve)}),W.size===0){G(A);return}setTimeout(pe,10)}at.get("KHR_parallel_shader_compile")!==null?pe():setTimeout(pe,10)})};let Ru=null;function Ty(A){Ru&&Ru(A)}function am(){Nr.stop()}function lm(){Nr.start()}const Nr=new ly;Nr.setAnimationLoop(Ty),typeof self<"u"&&Nr.setContext(self),this.setAnimationLoop=function(A){Ru=A,q.setAnimationLoop(A),A===null?Nr.stop():Nr.start()},q.addEventListener("sessionstart",am),q.addEventListener("sessionend",lm),this.render=function(A,B){if(B!==void 0&&B.isCamera!==!0){Qe("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;const j=q.enabled===!0&&q.isPresenting===!0,W=y!==null&&(P===null||j)&&y.begin(w,P);if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),q.enabled===!0&&q.isPresenting===!0&&(y===null||y.isCompositing()===!1)&&(q.cameraAutoUpdate===!0&&q.updateCamera(B),B=q.getCamera()),A.isScene===!0&&A.onBeforeRender(w,A,B,P),b=oe.get(A,T.length),b.init(B),T.push(b),pt.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),ue.setFromProjectionMatrix(pt,Si,B.reversedDepth),De=this.localClippingEnabled,Re=le.init(this.clippingPlanes,De),S=ke.get(A,M.length),S.init(),M.push(S),q.enabled===!0&&q.isPresenting===!0){const ve=w.xr.getDepthSensingMesh();ve!==null&&Pu(ve,B,-1/0,w.sortObjects)}Pu(A,B,0,w.sortObjects),S.finish(),w.sortObjects===!0&&S.sort(Ze,rt),Ue=q.enabled===!1||q.isPresenting===!1||q.hasDepthSensing()===!1,Ue&&Te.addToRenderList(S,A),this.info.render.frame++,Re===!0&&le.beginShadows();const G=b.state.shadowsArray;if(we.render(G,A,B),Re===!0&&le.endShadows(),this.info.autoReset===!0&&this.info.reset(),(W&&y.hasRenderPass())===!1){const ve=S.opaque,me=S.transmissive;if(b.setupLights(),B.isArrayCamera){const be=B.cameras;if(me.length>0)for(let Pe=0,Ge=be.length;Pe<Ge;Pe++){const qe=be[Pe];um(ve,me,A,qe)}Ue&&Te.render(A);for(let Pe=0,Ge=be.length;Pe<Ge;Pe++){const qe=be[Pe];cm(S,A,qe,qe.viewport)}}else me.length>0&&um(ve,me,A,B),Ue&&Te.render(A),cm(S,A,B)}P!==null&&N===0&&(k.updateMultisampleRenderTarget(P),k.updateRenderTargetMipmap(P)),W&&y.end(w),A.isScene===!0&&A.onAfterRender(w,A,B),ce.resetDefaultState(),U=-1,V=null,T.pop(),T.length>0?(b=T[T.length-1],Re===!0&&le.setGlobalState(w.clippingPlanes,b.state.camera)):b=null,M.pop(),M.length>0?S=M[M.length-1]:S=null};function Pu(A,B,j,W){if(A.visible===!1)return;if(A.layers.test(B.layers)){if(A.isGroup)j=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(B);else if(A.isLight)b.pushLight(A),A.castShadow&&b.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||ue.intersectsSprite(A)){W&&tt.setFromMatrixPosition(A.matrixWorld).applyMatrix4(pt);const ve=Me.update(A),me=A.material;me.visible&&S.push(A,ve,me,j,tt.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||ue.intersectsObject(A))){const ve=Me.update(A),me=A.material;if(W&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),tt.copy(A.boundingSphere.center)):(ve.boundingSphere===null&&ve.computeBoundingSphere(),tt.copy(ve.boundingSphere.center)),tt.applyMatrix4(A.matrixWorld).applyMatrix4(pt)),Array.isArray(me)){const be=ve.groups;for(let Pe=0,Ge=be.length;Pe<Ge;Pe++){const qe=be[Pe],Le=me[qe.materialIndex];Le&&Le.visible&&S.push(A,ve,Le,j,tt.z,qe)}}else me.visible&&S.push(A,ve,me,j,tt.z,null)}}const pe=A.children;for(let ve=0,me=pe.length;ve<me;ve++)Pu(pe[ve],B,j,W)}function cm(A,B,j,W){const{opaque:G,transmissive:pe,transparent:ve}=A;b.setupLightsView(j),Re===!0&&le.setGlobalState(w.clippingPlanes,j),W&&Ae.viewport(O.copy(W)),G.length>0&&$a(G,B,j),pe.length>0&&$a(pe,B,j),ve.length>0&&$a(ve,B,j),Ae.buffers.depth.setTest(!0),Ae.buffers.depth.setMask(!0),Ae.buffers.color.setMask(!0),Ae.setPolygonOffset(!1)}function um(A,B,j,W){if((j.isScene===!0?j.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[W.id]===void 0){const Le=at.has("EXT_color_buffer_half_float")||at.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[W.id]=new Tn(1,1,{generateMipmaps:!0,type:Le?Fn:Dn,minFilter:Qr,samples:Math.max(4,xt.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Je.workingColorSpace})}const pe=b.state.transmissionRenderTarget[W.id],ve=W.viewport||O;pe.setSize(ve.z*w.transmissionResolutionScale,ve.w*w.transmissionResolutionScale);const me=w.getRenderTarget(),be=w.getActiveCubeFace(),Pe=w.getActiveMipmapLevel();w.setRenderTarget(pe),w.getClearColor(X),J=w.getClearAlpha(),J<1&&w.setClearColor(16777215,.5),w.clear(),Ue&&Te.render(j);const Ge=w.toneMapping;w.toneMapping=Ti;const qe=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),b.setupLightsView(W),Re===!0&&le.setGlobalState(w.clippingPlanes,W),$a(A,j,W),k.updateMultisampleRenderTarget(pe),k.updateRenderTargetMipmap(pe),at.has("WEBGL_multisampled_render_to_texture")===!1){let Le=!1;for(let mt=0,Dt=B.length;mt<Dt;mt++){const Rt=B[mt],{object:gt,geometry:en,material:Ce,group:An}=Rt;if(Ce.side===ri&&gt.layers.test(W.layers)){const nt=Ce.side;Ce.side=En,Ce.needsUpdate=!0,fm(gt,j,W,en,Ce,An),Ce.side=nt,Ce.needsUpdate=!0,Le=!0}}Le===!0&&(k.updateMultisampleRenderTarget(pe),k.updateRenderTargetMipmap(pe))}w.setRenderTarget(me,be,Pe),w.setClearColor(X,J),qe!==void 0&&(W.viewport=qe),w.toneMapping=Ge}function $a(A,B,j){const W=B.isScene===!0?B.overrideMaterial:null;for(let G=0,pe=A.length;G<pe;G++){const ve=A[G],{object:me,geometry:be,group:Pe}=ve;let Ge=ve.material;Ge.allowOverride===!0&&W!==null&&(Ge=W),me.layers.test(j.layers)&&fm(me,B,j,be,Ge,Pe)}}function fm(A,B,j,W,G,pe){A.onBeforeRender(w,B,j,W,G,pe),A.modelViewMatrix.multiplyMatrices(j.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),G.onBeforeRender(w,B,j,W,A,pe),G.transparent===!0&&G.side===ri&&G.forceSinglePass===!1?(G.side=En,G.needsUpdate=!0,w.renderBufferDirect(j,B,W,G,A,pe),G.side=Cr,G.needsUpdate=!0,w.renderBufferDirect(j,B,W,G,A,pe),G.side=ri):w.renderBufferDirect(j,B,W,G,A,pe),A.onAfterRender(w,B,j,W,G,pe)}function Ya(A,B,j){B.isScene!==!0&&(B=Be);const W=E.get(A),G=b.state.lights,pe=b.state.shadowsArray,ve=G.state.version,me=fe.getParameters(A,G.state,pe,B,j),be=fe.getProgramCacheKey(me);let Pe=W.programs;W.environment=A.isMeshStandardMaterial||A.isMeshLambertMaterial||A.isMeshPhongMaterial?B.environment:null,W.fog=B.fog;const Ge=A.isMeshStandardMaterial||A.isMeshLambertMaterial&&!A.envMap||A.isMeshPhongMaterial&&!A.envMap;W.envMap=Z.get(A.envMap||W.environment,Ge),W.envMapRotation=W.environment!==null&&A.envMap===null?B.environmentRotation:A.envMapRotation,Pe===void 0&&(A.addEventListener("dispose",lt),Pe=new Map,W.programs=Pe);let qe=Pe.get(be);if(qe!==void 0){if(W.currentProgram===qe&&W.lightsStateVersion===ve)return hm(A,me),qe}else me.uniforms=fe.getUniforms(A),A.onBeforeCompile(me,w),qe=fe.acquireProgram(me,be),Pe.set(be,qe),W.uniforms=me.uniforms;const Le=W.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Le.clippingPlanes=le.uniform),hm(A,me),W.needsLights=Cy(A),W.lightsStateVersion=ve,W.needsLights&&(Le.ambientLightColor.value=G.state.ambient,Le.lightProbe.value=G.state.probe,Le.directionalLights.value=G.state.directional,Le.directionalLightShadows.value=G.state.directionalShadow,Le.spotLights.value=G.state.spot,Le.spotLightShadows.value=G.state.spotShadow,Le.rectAreaLights.value=G.state.rectArea,Le.ltc_1.value=G.state.rectAreaLTC1,Le.ltc_2.value=G.state.rectAreaLTC2,Le.pointLights.value=G.state.point,Le.pointLightShadows.value=G.state.pointShadow,Le.hemisphereLights.value=G.state.hemi,Le.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Le.spotLightMatrix.value=G.state.spotLightMatrix,Le.spotLightMap.value=G.state.spotLightMap,Le.pointShadowMatrix.value=G.state.pointShadowMatrix),W.currentProgram=qe,W.uniformsList=null,qe}function dm(A){if(A.uniformsList===null){const B=A.currentProgram.getUniforms();A.uniformsList=yc.seqWithValue(B.seq,A.uniforms)}return A.uniformsList}function hm(A,B){const j=E.get(A);j.outputColorSpace=B.outputColorSpace,j.batching=B.batching,j.batchingColor=B.batchingColor,j.instancing=B.instancing,j.instancingColor=B.instancingColor,j.instancingMorph=B.instancingMorph,j.skinning=B.skinning,j.morphTargets=B.morphTargets,j.morphNormals=B.morphNormals,j.morphColors=B.morphColors,j.morphTargetsCount=B.morphTargetsCount,j.numClippingPlanes=B.numClippingPlanes,j.numIntersection=B.numClipIntersection,j.vertexAlphas=B.vertexAlphas,j.vertexTangents=B.vertexTangents,j.toneMapping=B.toneMapping}function by(A,B,j,W,G){B.isScene!==!0&&(B=Be),k.resetTextureUnits();const pe=B.fog,ve=W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial?B.environment:null,me=P===null?w.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:yo,be=W.isMeshStandardMaterial||W.isMeshLambertMaterial&&!W.envMap||W.isMeshPhongMaterial&&!W.envMap,Pe=Z.get(W.envMap||ve,be),Ge=W.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,qe=!!j.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Le=!!j.morphAttributes.position,mt=!!j.morphAttributes.normal,Dt=!!j.morphAttributes.color;let Rt=Ti;W.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(Rt=w.toneMapping);const gt=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,en=gt!==void 0?gt.length:0,Ce=E.get(W),An=b.state.lights;if(Re===!0&&(De===!0||A!==V)){const Gt=A===V&&W.id===U;le.setState(W,A,Gt)}let nt=!1;W.version===Ce.__version?(Ce.needsLights&&Ce.lightsStateVersion!==An.state.version||Ce.outputColorSpace!==me||G.isBatchedMesh&&Ce.batching===!1||!G.isBatchedMesh&&Ce.batching===!0||G.isBatchedMesh&&Ce.batchingColor===!0&&G.colorTexture===null||G.isBatchedMesh&&Ce.batchingColor===!1&&G.colorTexture!==null||G.isInstancedMesh&&Ce.instancing===!1||!G.isInstancedMesh&&Ce.instancing===!0||G.isSkinnedMesh&&Ce.skinning===!1||!G.isSkinnedMesh&&Ce.skinning===!0||G.isInstancedMesh&&Ce.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&Ce.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&Ce.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&Ce.instancingMorph===!1&&G.morphTexture!==null||Ce.envMap!==Pe||W.fog===!0&&Ce.fog!==pe||Ce.numClippingPlanes!==void 0&&(Ce.numClippingPlanes!==le.numPlanes||Ce.numIntersection!==le.numIntersection)||Ce.vertexAlphas!==Ge||Ce.vertexTangents!==qe||Ce.morphTargets!==Le||Ce.morphNormals!==mt||Ce.morphColors!==Dt||Ce.toneMapping!==Rt||Ce.morphTargetsCount!==en)&&(nt=!0):(nt=!0,Ce.__version=W.version);let Kn=Ce.currentProgram;nt===!0&&(Kn=Ya(W,B,G));let hi=!1,Ur=!1,ps=!1;const vt=Kn.getUniforms(),$t=Ce.uniforms;if(Ae.useProgram(Kn.program)&&(hi=!0,Ur=!0,ps=!0),W.id!==U&&(U=W.id,Ur=!0),hi||V!==A){Ae.buffers.depth.getReversed()&&A.reversedDepth!==!0&&(A._reversedDepth=!0,A.updateProjectionMatrix()),vt.setValue(I,"projectionMatrix",A.projectionMatrix),vt.setValue(I,"viewMatrix",A.matrixWorldInverse);const tr=vt.map.cameraPosition;tr!==void 0&&tr.setValue(I,Xe.setFromMatrixPosition(A.matrixWorld)),xt.logarithmicDepthBuffer&&vt.setValue(I,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&vt.setValue(I,"isOrthographic",A.isOrthographicCamera===!0),V!==A&&(V=A,Ur=!0,ps=!0)}if(Ce.needsLights&&(An.state.directionalShadowMap.length>0&&vt.setValue(I,"directionalShadowMap",An.state.directionalShadowMap,k),An.state.spotShadowMap.length>0&&vt.setValue(I,"spotShadowMap",An.state.spotShadowMap,k),An.state.pointShadowMap.length>0&&vt.setValue(I,"pointShadowMap",An.state.pointShadowMap,k)),G.isSkinnedMesh){vt.setOptional(I,G,"bindMatrix"),vt.setOptional(I,G,"bindMatrixInverse");const Gt=G.skeleton;Gt&&(Gt.boneTexture===null&&Gt.computeBoneTexture(),vt.setValue(I,"boneTexture",Gt.boneTexture,k))}G.isBatchedMesh&&(vt.setOptional(I,G,"batchingTexture"),vt.setValue(I,"batchingTexture",G._matricesTexture,k),vt.setOptional(I,G,"batchingIdTexture"),vt.setValue(I,"batchingIdTexture",G._indirectTexture,k),vt.setOptional(I,G,"batchingColorTexture"),G._colorsTexture!==null&&vt.setValue(I,"batchingColorTexture",G._colorsTexture,k));const er=j.morphAttributes;if((er.position!==void 0||er.normal!==void 0||er.color!==void 0)&&ge.update(G,j,Kn),(Ur||Ce.receiveShadow!==G.receiveShadow)&&(Ce.receiveShadow=G.receiveShadow,vt.setValue(I,"receiveShadow",G.receiveShadow)),(W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial)&&W.envMap===null&&B.environment!==null&&($t.envMapIntensity.value=B.environmentIntensity),$t.dfgLUT!==void 0&&($t.dfgLUT.value=ZC()),Ur&&(vt.setValue(I,"toneMappingExposure",w.toneMappingExposure),Ce.needsLights&&Ay($t,ps),pe&&W.fog===!0&&Ne.refreshFogUniforms($t,pe),Ne.refreshMaterialUniforms($t,W,Fe,ie,b.state.transmissionRenderTarget[A.id]),yc.upload(I,dm(Ce),$t,k)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(yc.upload(I,dm(Ce),$t,k),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&vt.setValue(I,"center",G.center),vt.setValue(I,"modelViewMatrix",G.modelViewMatrix),vt.setValue(I,"normalMatrix",G.normalMatrix),vt.setValue(I,"modelMatrix",G.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){const Gt=W.uniformsGroups;for(let tr=0,ms=Gt.length;tr<ms;tr++){const pm=Gt[tr];ye.update(pm,Kn),ye.bind(pm,Kn)}}return Kn}function Ay(A,B){A.ambientLightColor.needsUpdate=B,A.lightProbe.needsUpdate=B,A.directionalLights.needsUpdate=B,A.directionalLightShadows.needsUpdate=B,A.pointLights.needsUpdate=B,A.pointLightShadows.needsUpdate=B,A.spotLights.needsUpdate=B,A.spotLightShadows.needsUpdate=B,A.rectAreaLights.needsUpdate=B,A.hemisphereLights.needsUpdate=B}function Cy(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return N},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(A,B,j){const W=E.get(A);W.__autoAllocateDepthBuffer=A.resolveDepthBuffer===!1,W.__autoAllocateDepthBuffer===!1&&(W.__useRenderToTexture=!1),E.get(A.texture).__webglTexture=B,E.get(A.depthTexture).__webglTexture=W.__autoAllocateDepthBuffer?void 0:j,W.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(A,B){const j=E.get(A);j.__webglFramebuffer=B,j.__useDefaultFramebuffer=B===void 0};const Ry=I.createFramebuffer();this.setRenderTarget=function(A,B=0,j=0){P=A,C=B,N=j;let W=null,G=!1,pe=!1;if(A){const me=E.get(A);if(me.__useDefaultFramebuffer!==void 0){Ae.bindFramebuffer(I.FRAMEBUFFER,me.__webglFramebuffer),O.copy(A.viewport),H.copy(A.scissor),z=A.scissorTest,Ae.viewport(O),Ae.scissor(H),Ae.setScissorTest(z),U=-1;return}else if(me.__webglFramebuffer===void 0)k.setupRenderTarget(A);else if(me.__hasExternalTextures)k.rebindTextures(A,E.get(A.texture).__webglTexture,E.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const Ge=A.depthTexture;if(me.__boundDepthTexture!==Ge){if(Ge!==null&&E.has(Ge)&&(A.width!==Ge.image.width||A.height!==Ge.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");k.setupDepthRenderbuffer(A)}}const be=A.texture;(be.isData3DTexture||be.isDataArrayTexture||be.isCompressedArrayTexture)&&(pe=!0);const Pe=E.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Pe[B])?W=Pe[B][j]:W=Pe[B],G=!0):A.samples>0&&k.useMultisampledRTT(A)===!1?W=E.get(A).__webglMultisampledFramebuffer:Array.isArray(Pe)?W=Pe[j]:W=Pe,O.copy(A.viewport),H.copy(A.scissor),z=A.scissorTest}else O.copy(Y).multiplyScalar(Fe).floor(),H.copy(re).multiplyScalar(Fe).floor(),z=ne;if(j!==0&&(W=Ry),Ae.bindFramebuffer(I.FRAMEBUFFER,W)&&Ae.drawBuffers(A,W),Ae.viewport(O),Ae.scissor(H),Ae.setScissorTest(z),G){const me=E.get(A.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+B,me.__webglTexture,j)}else if(pe){const me=B;for(let be=0;be<A.textures.length;be++){const Pe=E.get(A.textures[be]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+be,Pe.__webglTexture,j,me)}}else if(A!==null&&j!==0){const me=E.get(A.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,me.__webglTexture,j)}U=-1},this.readRenderTargetPixels=function(A,B,j,W,G,pe,ve,me=0){if(!(A&&A.isWebGLRenderTarget)){Qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let be=E.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&ve!==void 0&&(be=be[ve]),be){Ae.bindFramebuffer(I.FRAMEBUFFER,be);try{const Pe=A.textures[me],Ge=Pe.format,qe=Pe.type;if(A.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+me),!xt.textureFormatReadable(Ge)){Qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!xt.textureTypeReadable(qe)){Qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=A.width-W&&j>=0&&j<=A.height-G&&I.readPixels(B,j,W,G,de.convert(Ge),de.convert(qe),pe)}finally{const Pe=P!==null?E.get(P).__webglFramebuffer:null;Ae.bindFramebuffer(I.FRAMEBUFFER,Pe)}}},this.readRenderTargetPixelsAsync=async function(A,B,j,W,G,pe,ve,me=0){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let be=E.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&ve!==void 0&&(be=be[ve]),be)if(B>=0&&B<=A.width-W&&j>=0&&j<=A.height-G){Ae.bindFramebuffer(I.FRAMEBUFFER,be);const Pe=A.textures[me],Ge=Pe.format,qe=Pe.type;if(A.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+me),!xt.textureFormatReadable(Ge))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!xt.textureTypeReadable(qe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Le=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,Le),I.bufferData(I.PIXEL_PACK_BUFFER,pe.byteLength,I.STREAM_READ),I.readPixels(B,j,W,G,de.convert(Ge),de.convert(qe),0);const mt=P!==null?E.get(P).__webglFramebuffer:null;Ae.bindFramebuffer(I.FRAMEBUFFER,mt);const Dt=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await Q1(I,Dt,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,Le),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,pe),I.deleteBuffer(Le),I.deleteSync(Dt),pe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(A,B=null,j=0){const W=Math.pow(2,-j),G=Math.floor(A.image.width*W),pe=Math.floor(A.image.height*W),ve=B!==null?B.x:0,me=B!==null?B.y:0;k.setTexture2D(A,0),I.copyTexSubImage2D(I.TEXTURE_2D,j,0,0,ve,me,G,pe),Ae.unbindTexture()};const Py=I.createFramebuffer(),Ly=I.createFramebuffer();this.copyTextureToTexture=function(A,B,j=null,W=null,G=0,pe=0){let ve,me,be,Pe,Ge,qe,Le,mt,Dt;const Rt=A.isCompressedTexture?A.mipmaps[pe]:A.image;if(j!==null)ve=j.max.x-j.min.x,me=j.max.y-j.min.y,be=j.isBox3?j.max.z-j.min.z:1,Pe=j.min.x,Ge=j.min.y,qe=j.isBox3?j.min.z:0;else{const $t=Math.pow(2,-G);ve=Math.floor(Rt.width*$t),me=Math.floor(Rt.height*$t),A.isDataArrayTexture?be=Rt.depth:A.isData3DTexture?be=Math.floor(Rt.depth*$t):be=1,Pe=0,Ge=0,qe=0}W!==null?(Le=W.x,mt=W.y,Dt=W.z):(Le=0,mt=0,Dt=0);const gt=de.convert(B.format),en=de.convert(B.type);let Ce;B.isData3DTexture?(k.setTexture3D(B,0),Ce=I.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(k.setTexture2DArray(B,0),Ce=I.TEXTURE_2D_ARRAY):(k.setTexture2D(B,0),Ce=I.TEXTURE_2D),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,B.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,B.unpackAlignment);const An=I.getParameter(I.UNPACK_ROW_LENGTH),nt=I.getParameter(I.UNPACK_IMAGE_HEIGHT),Kn=I.getParameter(I.UNPACK_SKIP_PIXELS),hi=I.getParameter(I.UNPACK_SKIP_ROWS),Ur=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,Rt.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,Rt.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Pe),I.pixelStorei(I.UNPACK_SKIP_ROWS,Ge),I.pixelStorei(I.UNPACK_SKIP_IMAGES,qe);const ps=A.isDataArrayTexture||A.isData3DTexture,vt=B.isDataArrayTexture||B.isData3DTexture;if(A.isDepthTexture){const $t=E.get(A),er=E.get(B),Gt=E.get($t.__renderTarget),tr=E.get(er.__renderTarget);Ae.bindFramebuffer(I.READ_FRAMEBUFFER,Gt.__webglFramebuffer),Ae.bindFramebuffer(I.DRAW_FRAMEBUFFER,tr.__webglFramebuffer);for(let ms=0;ms<be;ms++)ps&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,E.get(A).__webglTexture,G,qe+ms),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,E.get(B).__webglTexture,pe,Dt+ms)),I.blitFramebuffer(Pe,Ge,ve,me,Le,mt,ve,me,I.DEPTH_BUFFER_BIT,I.NEAREST);Ae.bindFramebuffer(I.READ_FRAMEBUFFER,null),Ae.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(G!==0||A.isRenderTargetTexture||E.has(A)){const $t=E.get(A),er=E.get(B);Ae.bindFramebuffer(I.READ_FRAMEBUFFER,Py),Ae.bindFramebuffer(I.DRAW_FRAMEBUFFER,Ly);for(let Gt=0;Gt<be;Gt++)ps?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,$t.__webglTexture,G,qe+Gt):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,$t.__webglTexture,G),vt?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,er.__webglTexture,pe,Dt+Gt):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,er.__webglTexture,pe),G!==0?I.blitFramebuffer(Pe,Ge,ve,me,Le,mt,ve,me,I.COLOR_BUFFER_BIT,I.NEAREST):vt?I.copyTexSubImage3D(Ce,pe,Le,mt,Dt+Gt,Pe,Ge,ve,me):I.copyTexSubImage2D(Ce,pe,Le,mt,Pe,Ge,ve,me);Ae.bindFramebuffer(I.READ_FRAMEBUFFER,null),Ae.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else vt?A.isDataTexture||A.isData3DTexture?I.texSubImage3D(Ce,pe,Le,mt,Dt,ve,me,be,gt,en,Rt.data):B.isCompressedArrayTexture?I.compressedTexSubImage3D(Ce,pe,Le,mt,Dt,ve,me,be,gt,Rt.data):I.texSubImage3D(Ce,pe,Le,mt,Dt,ve,me,be,gt,en,Rt):A.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,pe,Le,mt,ve,me,gt,en,Rt.data):A.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,pe,Le,mt,Rt.width,Rt.height,gt,Rt.data):I.texSubImage2D(I.TEXTURE_2D,pe,Le,mt,ve,me,gt,en,Rt);I.pixelStorei(I.UNPACK_ROW_LENGTH,An),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,nt),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Kn),I.pixelStorei(I.UNPACK_SKIP_ROWS,hi),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Ur),pe===0&&B.generateMipmaps&&I.generateMipmap(Ce),Ae.unbindTexture()},this.initRenderTarget=function(A){E.get(A).__webglFramebuffer===void 0&&k.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?k.setTextureCube(A,0):A.isData3DTexture?k.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?k.setTexture2DArray(A,0):k.setTexture2D(A,0),Ae.unbindTexture()},this.resetState=function(){C=0,N=0,P=null,Ae.reset(),ce.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Si}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorSpace=Je._getDrawingBufferColorSpace(e),n.unpackColorSpace=Je._getUnpackColorSpace()}}const Sc={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class ja{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const JC=new Tu(-1,1,1,-1,0,1);class eR extends Ve{constructor(){super(),this.setAttribute("position",new it([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new it([0,2,0,0,2,0],2))}}const tR=new eR;class py{constructor(e){this._mesh=new mn(tR,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,JC)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class nR extends ja{constructor(e,n="tDiffuse"){super(),this.textureID=n,this.uniforms=null,this.material=null,e instanceof Tt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=iu.clone(e.uniforms),this.material=new Tt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new py(this.material)}render(e,n,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(n),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class k0 extends ja{constructor(e,n){super(),this.scene=e,this.camera=n,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,n,i){const r=e.getContext(),s=e.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0);let o,c;this.inverse?(o=0,c=1):(o=1,c=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),s.buffers.stencil.setFunc(r.ALWAYS,o,4294967295),s.buffers.stencil.setClear(c),s.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(r.EQUAL,1,4294967295),s.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),s.buffers.stencil.setLocked(!0)}}class iR extends ja{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class rR{constructor(e,n){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),n===void 0){const i=e.getSize(new _e);this._width=i.width,this._height=i.height,n=new Tn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Fn}),n.texture.name="EffectComposer.rt1"}else this._width=n.width,this._height=n.height;this.renderTarget1=n,this.renderTarget2=n.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new nR(Sc),this.copyPass.material.blending=Ei,this.timer=new nE}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,n){this.passes.splice(n,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const n=this.passes.indexOf(e);n!==-1&&this.passes.splice(n,1)}isLastEnabledPass(e){for(let n=e+1;n<this.passes.length;n++)if(this.passes[n].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());const n=this.renderer.getRenderTarget();let i=!1;for(let r=0,s=this.passes.length;r<s;r++){const o=this.passes[r];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(r),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),o.needsSwap){if(i){const c=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(c.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(c.EQUAL,1,4294967295)}this.swapBuffers()}k0!==void 0&&(o instanceof k0?i=!0:o instanceof iR&&(i=!1))}}this.renderer.setRenderTarget(n)}reset(e){if(e===void 0){const n=this.renderer.getSize(new _e);this._pixelRatio=this.renderer.getPixelRatio(),this._width=n.width,this._height=n.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,n){this._width=e,this._height=n;const i=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(i,r),this.renderTarget2.setSize(i,r);for(let s=0;s<this.passes.length;s++)this.passes[s].setSize(i,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class sR extends ja{constructor(e,n,i=null,r=null,s=null){super(),this.scene=e,this.camera=n,this.overrideMaterial=i,this.clearColor=r,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new te}render(e,n,i){const r=e.autoClear;e.autoClear=!1;let s,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(s=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(s),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=r}}const oR={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new te(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class wo extends ja{constructor(e,n=1,i,r){super(),this.strength=n,this.radius=i,this.threshold=r,this.resolution=e!==void 0?new _e(e.x,e.y):new _e(256,256),this.clearColor=new te(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let s=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new Tn(s,o,{type:Fn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){const a=new Tn(s,o,{type:Fn});a.texture.name="UnrealBloomPass.h"+d,a.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(a);const u=new Tn(s,o,{type:Fn});u.texture.name="UnrealBloomPass.v"+d,u.texture.generateMipmaps=!1,this.renderTargetsVertical.push(u),s=Math.round(s/2),o=Math.round(o/2)}const c=oR;this.highPassUniforms=iu.clone(c.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Tt({uniforms:this.highPassUniforms,vertexShader:c.vertexShader,fragmentShader:c.fragmentShader}),this.separableBlurMaterials=[];const l=[6,10,14,18,22];s=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new _e(1/s,1/o),s=Math.round(s/2),o=Math.round(o/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=n,this.compositeMaterial.uniforms.bloomRadius.value=.1;const f=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=f,this.bloomTintColors=[new R(1,1,1),new R(1,1,1),new R(1,1,1),new R(1,1,1),new R(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=iu.clone(Sc.uniforms),this.blendMaterial=new Tt({uniforms:this.copyUniforms,vertexShader:Sc.vertexShader,fragmentShader:Sc.fragmentShader,premultipliedAlpha:!0,blending:st,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new te,this._oldClearAlpha=1,this._basic=new So,this._fsQuad=new py(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,n){let i=Math.round(e/2),r=Math.round(n/2);this.renderTargetBright.setSize(i,r);for(let s=0;s<this.nMips;s++)this.renderTargetsHorizontal[s].setSize(i,r),this.renderTargetsVertical[s].setSize(i,r),this.separableBlurMaterials[s].uniforms.invSize.value=new _e(1/i,1/r),i=Math.round(i/2),r=Math.round(r/2)}render(e,n,i,r,s){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),s&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=i.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let c=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=c.texture,this.separableBlurMaterials[l].uniforms.direction.value=wo.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=wo.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this._fsQuad.render(e),c=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,s&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=o}_getSeparableBlurMaterial(e){const n=[],i=e/3;for(let r=0;r<e;r++)n.push(.39894*Math.exp(-.5*r*r/(i*i))/i);return new Tt({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new _e(.5,.5)},direction:{value:new _e(.5,.5)},gaussianCoefficients:{value:n}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {

					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;

					for ( int i = 1; i < KERNEL_RADIUS; i ++ ) {

						float x = float( i );
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * w;

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new Tt({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}}wo.BlurDirectionX=new _e(1,0);wo.BlurDirectionY=new _e(0,1);const B0={type:"change"},rm={type:"start"},my={type:"end"},Zl=new wu,z0=new fr,aR=Math.cos(70*gw.DEG2RAD),kt=new R,vn=2*Math.PI,_t={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Wf=1e-6;class lR extends rE{constructor(e,n=null){super(e,n),this.state=_t.NONE,this.target=new R,this.cursor=new R,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:so.ROTATE,MIDDLE:so.DOLLY,RIGHT:so.PAN},this.touches={ONE:Qs.ROTATE,TWO:Qs.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new R,this._lastQuaternion=new Rr,this._lastTargetPosition=new R,this._quat=new Rr().setFromUnitVectors(e.up,new R(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new h0,this._sphericalDelta=new h0,this._scale=1,this._panOffset=new R,this._rotateStart=new _e,this._rotateEnd=new _e,this._rotateDelta=new _e,this._panStart=new _e,this._panEnd=new _e,this._panDelta=new _e,this._dollyStart=new _e,this._dollyEnd=new _e,this._dollyDelta=new _e,this._dollyDirection=new R,this._mouse=new _e,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=uR.bind(this),this._onPointerDown=cR.bind(this),this._onPointerUp=fR.bind(this),this._onContextMenu=vR.bind(this),this._onMouseWheel=pR.bind(this),this._onKeyDown=mR.bind(this),this._onTouchStart=gR.bind(this),this._onTouchMove=_R.bind(this),this._onMouseDown=dR.bind(this),this._onMouseMove=hR.bind(this),this._interceptControlDown=xR.bind(this),this._interceptControlUp=yR.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(B0),this.update(),this.state=_t.NONE}pan(e,n){this._pan(e,n),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){const n=this.object.position;kt.copy(n).sub(this.target),kt.applyQuaternion(this._quat),this._spherical.setFromVector3(kt),this.autoRotate&&this.state===_t.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(i)&&isFinite(r)&&(i<-Math.PI?i+=vn:i>Math.PI&&(i-=vn),r<-Math.PI?r+=vn:r>Math.PI&&(r-=vn),i<=r?this._spherical.theta=Math.max(i,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+r)/2?Math.max(i,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let s=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),s=o!=this._spherical.radius}if(kt.setFromSpherical(this._spherical),kt.applyQuaternion(this._quatInverse),n.copy(this.target).add(kt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const c=kt.length();o=this._clampDistance(c*this._scale);const l=c-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),s=!!l}else if(this.object.isOrthographicCamera){const c=new R(this._mouse.x,this._mouse.y,0);c.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),s=l!==this.object.zoom;const f=new R(this._mouse.x,this._mouse.y,0);f.unproject(this.object),this.object.position.sub(f).add(c),this.object.updateMatrixWorld(),o=kt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Zl.origin.copy(this.object.position),Zl.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Zl.direction))<aR?this.object.lookAt(this.target):(z0.setFromNormalAndCoplanarPoint(this.object.up,this.target),Zl.intersectPlane(z0,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),s=!0)}return this._scale=1,this._performCursorZoom=!1,s||this._lastPosition.distanceToSquared(this.object.position)>Wf||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Wf||this._lastTargetPosition.distanceToSquared(this.target)>Wf?(this.dispatchEvent(B0),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?vn/60*this.autoRotateSpeed*e:vn/60/60*this.autoRotateSpeed}_getZoomScale(e){const n=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*n)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,n){kt.setFromMatrixColumn(n,0),kt.multiplyScalar(-e),this._panOffset.add(kt)}_panUp(e,n){this.screenSpacePanning===!0?kt.setFromMatrixColumn(n,1):(kt.setFromMatrixColumn(n,0),kt.crossVectors(this.object.up,kt)),kt.multiplyScalar(e),this._panOffset.add(kt)}_pan(e,n){const i=this.domElement;if(this.object.isPerspectiveCamera){const r=this.object.position;kt.copy(r).sub(this.target);let s=kt.length();s*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*s/i.clientHeight,this.object.matrix),this._panUp(2*n*s/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(n*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,n){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),r=e-i.left,s=n-i.top,o=i.width,c=i.height;this._mouse.x=r/o*2-1,this._mouse.y=-(s/c)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(vn*this._rotateDelta.x/n.clientHeight),this._rotateUp(vn*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let n=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(vn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),n=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-vn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),n=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(vn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),n=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-vn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),n=!0;break}n&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateStart.set(i,r)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._panStart.set(i,r)}}_handleTouchStartDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,r=e.pageY-n.y,s=Math.sqrt(i*i+r*r);this._dollyStart.set(0,s)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),r=.5*(e.pageX+i.x),s=.5*(e.pageY+i.y);this._rotateEnd.set(r,s)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(vn*this._rotateDelta.x/n.clientHeight),this._rotateUp(vn*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._panEnd.set(i,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,r=e.pageY-n.y,s=Math.sqrt(i*i+r*r);this._dollyEnd.set(0,s),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(e.pageX+n.x)*.5,c=(e.pageY+n.y)*.5;this._updateZoomParameters(o,c)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId){this._pointers.splice(n,1);return}}_isTrackingPointer(e){for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId)return!0;return!1}_trackPointer(e){let n=this._pointerPositions[e.pointerId];n===void 0&&(n=new _e,this._pointerPositions[e.pointerId]=n),n.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const n=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[n]}_customWheelEvent(e){const n=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(n){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function cR(t){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(t.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(t)&&(this._addPointer(t),t.pointerType==="touch"?this._onTouchStart(t):this._onMouseDown(t),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function uR(t){this.enabled!==!1&&(t.pointerType==="touch"?this._onTouchMove(t):this._onMouseMove(t))}function fR(t){switch(this._removePointer(t),this._pointers.length){case 0:this.domElement.releasePointerCapture(t.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(my),this.state=_t.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const e=this._pointers[0],n=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:n.x,pageY:n.y});break}}function dR(t){let e;switch(t.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case so.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(t),this.state=_t.DOLLY;break;case so.ROTATE:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=_t.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=_t.ROTATE}break;case so.PAN:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=_t.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=_t.PAN}break;default:this.state=_t.NONE}this.state!==_t.NONE&&this.dispatchEvent(rm)}function hR(t){switch(this.state){case _t.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(t);break;case _t.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(t);break;case _t.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(t);break}}function pR(t){this.enabled===!1||this.enableZoom===!1||this.state!==_t.NONE||(t.preventDefault(),this.dispatchEvent(rm),this._handleMouseWheel(this._customWheelEvent(t)),this.dispatchEvent(my))}function mR(t){this.enabled!==!1&&this._handleKeyDown(t)}function gR(t){switch(this._trackPointer(t),this._pointers.length){case 1:switch(this.touches.ONE){case Qs.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(t),this.state=_t.TOUCH_ROTATE;break;case Qs.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(t),this.state=_t.TOUCH_PAN;break;default:this.state=_t.NONE}break;case 2:switch(this.touches.TWO){case Qs.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(t),this.state=_t.TOUCH_DOLLY_PAN;break;case Qs.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(t),this.state=_t.TOUCH_DOLLY_ROTATE;break;default:this.state=_t.NONE}break;default:this.state=_t.NONE}this.state!==_t.NONE&&this.dispatchEvent(rm)}function _R(t){switch(this._trackPointer(t),this.state){case _t.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(t),this.update();break;case _t.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(t),this.update();break;case _t.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(t),this.update();break;case _t.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(t),this.update();break;default:this.state=_t.NONE}}function vR(t){this.enabled!==!1&&t.preventDefault()}function xR(t){t.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function yR(t){t.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const SR={},MR=SR;function wR(t){return t.endsWith("/")?t.slice(0,-1):t}function ER(){const t=MR.VITE_BACKEND_URL;return typeof t=="string"&&t?wR(t):""}function gy(t){const e=t.startsWith("/")?t:`/${t}`,n=ER();return n?`${n}${e}`:e}function _y(t,e){return fetch(gy(t),e)}function TR(t){return new EventSource(gy(t))}async function bR(t){const e=await t.text(),n=t.headers.get("content-type")||"",i=e.trimStart().startsWith("<");if(!t.ok){if(n.includes("application/json")&&e){const r=JSON.parse(e);throw new Error(r.error||`HTTP ${t.status}`)}throw i?new Error(`Expected JSON from ${t.url}, got HTML instead.`):new Error(`HTTP ${t.status}`)}if(!e)return null;if(n.includes("application/json"))return JSON.parse(e);if(i)throw new Error(`Expected JSON from ${t.url}, got HTML instead.`);return JSON.parse(e)}async function Vh(t,e){const n=await _y(t,e);return bR(n)}function AR(t,e,n,i,r=.6){const s=document.createElement("canvas");s.width=s.height=i;const o=s.getContext("2d"),c=i/2,l=o.createRadialGradient(c,c,0,c,c,c);return l.addColorStop(0,`rgba(${t},${e},${n},${r})`),l.addColorStop(.2,`rgba(${t},${e},${n},${r*.6})`),l.addColorStop(.5,`rgba(${t},${e},${n},${r*.2})`),l.addColorStop(1,`rgba(${t},${e},${n},0)`),o.fillStyle=l,o.fillRect(0,0,i,i),new Ir(s)}function CR(t,e,n,i,r=.4,s=.6){const l=document.createElement("canvas");l.width=48,l.height=800;const f=l.getContext("2d"),d=f.createImageData(48,800),a=d.data,u=48/2;for(let h=0;h<800;h++){const m=h/800;let v;if(m<r){const g=m/r;v=g*g}else if(m>s){const g=(m-s)/(1-s);v=(1-g)*(1-g)}else v=1;for(let g=0;g<48;g++){const p=(g-u)/24,_=Math.exp(-p*p*3),x=v*_*i,S=(h*48+g)*4;a[S]=t,a[S+1]=e,a[S+2]=n,a[S+3]=Math.round(x*255)}}return f.putImageData(d,0,0),new Ir(l)}function RR(){const e=document.createElement("canvas");e.width=e.height=8;const n=e.getContext("2d"),i=8/2,r=n.createRadialGradient(i,i,0,i,i,i);return r.addColorStop(0,"rgba(180,190,220,0.9)"),r.addColorStop(.4,"rgba(180,190,220,0.3)"),r.addColorStop(1,"rgba(180,190,220,0)"),n.fillStyle=r,n.fillRect(0,0,8,8),new Ir(e)}function AP(t,e,n,i=64){const r=document.createElement("canvas");r.width=r.height=i;const s=r.getContext("2d"),o=i/2,c=s.createRadialGradient(o,o,0,o,o,o);c.addColorStop(0,`rgba(${t},${e},${n},0.8)`),c.addColorStop(.1,`rgba(${t},${e},${n},0.5)`),c.addColorStop(.25,`rgba(${t},${e},${n},0.15)`),c.addColorStop(.5,`rgba(${t},${e},${n},0.03)`),c.addColorStop(1,`rgba(${t},${e},${n},0)`),s.fillStyle=c,s.fillRect(0,0,i,i);const l=s.createRadialGradient(o,o,0,o,o,o*.12);return l.addColorStop(0,"rgba(255,255,255,1)"),l.addColorStop(.5,"rgba(255,255,255,0.7)"),l.addColorStop(1,"rgba(255,255,255,0)"),s.fillStyle=l,s.fillRect(0,0,i,i),new Ir(r)}const Xf=[{r:0,g:180,b:160,peakAlpha:.25,peakStart:.35,peakEnd:.55},{r:40,g:80,b:200,peakAlpha:.2,peakStart:.4,peakEnd:.6},{r:100,g:40,b:180,peakAlpha:.18,peakStart:.45,peakEnd:.65},{r:0,g:200,b:100,peakAlpha:.15,peakStart:.38,peakEnd:.58},{r:180,g:40,b:80,peakAlpha:.12,peakStart:.42,peakEnd:.62},{r:30,g:120,b:190,peakAlpha:.16,peakStart:.36,peakEnd:.56}];function vy(t){return[t>>16&255,t>>8&255,t&255]}function CP(t){const e=parseInt(t.replace("#",""),16);return vy(e)}function Vn(t,e){return Math.random()*(e-t)+t}class PR{constructor(){this.auroras=[],this.elapsed=0,this.group=new li,this.buildStarSphere(),this.buildAuroraCurtains()}buildStarSphere(){const i=new Float32Array(2400),r=new Float32Array(800);for(let l=0;l<800;l++){const f=Math.random()*Math.PI*2,d=Math.acos(2*Math.random()-1);i[l*3]=1500*Math.sin(d)*Math.cos(f),i[l*3+1]=1500*Math.sin(d)*Math.sin(f),i[l*3+2]=1500*Math.cos(d),r[l]=l<30?Vn(2.5,4.5):Vn(1,2.5)}const s=new Ve;s.setAttribute("position",new He(i,3)),s.setAttribute("size",new He(r,1));const o=RR();this.starsMat=new Ga({map:o,transparent:!0,blending:st,depthWrite:!1,size:3,sizeAttenuation:!1,opacity:.7});const c=new ls(s,this.starsMat);this.group.add(c)}buildAuroraCurtains(){for(let e=0;e<Xf.length;e++){const n=Xf[e],i=CR(n.r,n.g,n.b,n.peakAlpha,n.peakStart,n.peakEnd),r=Vn(120,250),s=Vn(500,800),o=new Xa(r,s),c=new So({map:i,transparent:!0,blending:st,depthWrite:!1,side:ri}),l=new mn(o,c),f=Vn(.08,.18);c.opacity=f;const d=(e/Xf.length-.5)*Math.PI*1.2,a=Vn(500,800);l.position.set(Math.sin(d)*a,Vn(-100,150),-Math.cos(d)*a),l.lookAt(0,l.position.y*.5,0),l.rotation.z+=Vn(-.15,.15),this.group.add(l),this.auroras.push({mesh:l,material:c,baseAlpha:f,phase:Vn(0,Math.PI*2),alphaPhase:Vn(0,Math.PI*2),swayAxis:new R(Vn(-1,1),1,Vn(-.5,.5)).normalize()})}}tick(e){this.elapsed+=Math.min(e,.05);const n=this.elapsed;for(const i of this.auroras){const r=Math.sin(n*.06+i.phase)*5;i.mesh.position.addScaledVector(i.swayAxis,r*e),i.material.opacity=i.baseAlpha*(.92+.08*Math.sin(n*.1+i.alphaPhase))}this.starsMat.opacity=.6+.15*Math.sin(n*.25)}dispose(){this.group.traverse(e=>{(e instanceof mn||e instanceof ls)&&(e.geometry.dispose(),Array.isArray(e.material)?e.material.forEach(n=>n.dispose()):e.material.dispose())})}}class LR{constructor(e="unknown"){this.activity=0,this.group=new li,this.seed=Math.random()*100;const n=bg(e),i=hl[n]||hl.unknown;this.color=new te(i.glow);const r=new Oa(8,1),s=new l0(r),o=new pn({color:this.color,transparent:!0,opacity:.4});this.icoWire=new nu(s,o),this.group.add(this.icoWire);const c=new Oa(5,1),l=new l0(c),f=new pn({color:new te(1,1,1),transparent:!0,opacity:.25});this.icoWireInner=new nu(l,f),this.group.add(this.icoWireInner);const[d,a,u]=vy(i.glow),h=AR(d,a,u,128,.3);this.glowMaterial=new Mu({map:h,blending:st,transparent:!0,depthWrite:!1}),this.glowSprite=new em(this.glowMaterial),this.glowSprite.scale.set(25,25,1),this.group.add(this.glowSprite),this.coreLight=new Qw(i.glow,2,80,2),this.group.add(this.coreLight)}triggerActivity(){this.activity=Math.min(1,this.activity+.5)}setModel(e){const n=bg(e),i=hl[n]||hl.unknown;this.color=new te(i.glow),this.icoWire.material.color.copy(this.color),this.coreLight.color.copy(this.color)}tick(e,n){this.activity=Math.max(0,this.activity-e*.6),this.icoWire.rotation.y+=e*.12,this.icoWire.rotation.x+=e*.05,this.icoWireInner.rotation.y-=e*.18,this.icoWireInner.rotation.z+=e*.08,this.icoWire.rotation.y+=e*.3*this.activity,this.icoWireInner.rotation.y-=e*.5*this.activity;const i=1+.08*Math.sin(n*.5+this.seed),r=1+this.activity*.4;this.glowSprite.scale.set(25*i*r,25*i*r,1),this.glowMaterial.opacity=.3+this.activity*.3,this.coreLight.intensity=2+this.activity*4+Math.sin(n*.8)*.3,this.icoWire.material.opacity=.4+this.activity*.3,this.icoWireInner.material.opacity=.25+this.activity*.25}dispose(){var e;this.icoWire.geometry.dispose(),this.icoWire.material.dispose(),this.icoWireInner.geometry.dispose(),this.icoWireInner.material.dispose(),(e=this.glowMaterial.map)==null||e.dispose(),this.glowMaterial.dispose()}}function Se(t,e){return Math.random()*(e-t)+t}function sm(){const t=Math.random()*Math.PI*2,e=Math.acos(2*Math.random()-1);return new R(Math.sin(e)*Math.cos(t),Math.sin(e)*Math.sin(t),Math.cos(e))}function bn(t,e){const n=(Math.random()-.5)*2,i=(Math.random()-.5)*2,r=(Math.random()-.5)*2,s=t+(e-t)*Math.pow(Math.random(),.6),o=t+(e-t)*Math.pow(Math.random(),.6),c=t+(e-t)*Math.pow(Math.random(),.6);return new R(n*s*Se(.4,2.5),i*o*Se(.1,.5),r*c*Se(.4,2.5))}function Ki(t){return(Math.abs(t.y)<.9?new R(0,1,0):new R(1,0,0)).clone().cross(t).normalize()}const Ci=new R(0,0,0);function Ji(t=4){return new R((Math.random()-.5)*t,(Math.random()-.5)*t,(Math.random()-.5)*t)}function DR(t,e,n){const i=(t==null?void 0:t.clone())??bn(40,100),r=Ji(),s=new R().addVectors(i,r).multiplyScalar(.5),o=new R(s.x+(Math.random()-.5)*80,s.y+(Math.random()-.5)*80,s.z+(Math.random()-.5)*80);return{origin:i,target:r,color:new te("#fcd34d"),colorEnd:new te("#fef9c3"),travelTime:Se(2.8,4),trailLength:Se(.2,.3),trailBrightness:Se(2,2.6),trailFadeTime:Se(22,28),headSize:0,pathConfig:{type:"quadratic",easing:"easeInCubic",c1:o},_tool:"Read"}}function IR(t,e,n){const i=(t==null?void 0:t.clone())??bn(40,80),r=i.clone().normalize(),s=i.length(),o=Ki(r),c=r.clone().multiplyScalar(s*1.6).add(o.clone().multiplyScalar(Se(12,22))),l=i.clone().add(r.clone().multiplyScalar(-10)),f={origin:i.clone(),target:Ji(),color:new te("#a0d0ff"),colorEnd:new te("#ffffff"),travelTime:Se(.9,1.4),trailLength:.32,trailBrightness:.9,trailFadeTime:10,headSize:3,pathConfig:{type:"linear",easing:"easeInCubic"},_tool:"Edit:return"};return{origin:Ci.clone(),target:i,color:new te("#60a5fa"),colorEnd:new te("#a0d0ff"),travelTime:Se(1.8,2.5),trailLength:.28,trailBrightness:1.3,trailFadeTime:8,headSize:4,pathConfig:{type:"cubic",easing:"easeInOut",c1:c,c2:l},pendingSpawn:f,_tool:"Edit"}}function NR(t,e,n){const i=(t==null?void 0:t.clone())??bn(90,190),r=i.clone().normalize(),s=i.length(),o=r.clone().multiplyScalar(s*.45).add(Ki(r).multiplyScalar(Se(0,6)));return Array.from({length:5},(c,l)=>{const f=sm();return f.y*=.3,f.normalize(),{origin:i.clone().add(new R(Se(-1,1),Se(-1,1),Se(-1,1))),target:i.clone().add(f.multiplyScalar(Se(8,22))),color:new te("#b0d4ff"),colorEnd:new te("#b0d4ff"),travelTime:Se(.5,1),trailLength:.5,trailBrightness:1.1,trailFadeTime:14,headSize:3,spawnDelay:l*.04,pathConfig:{type:"linear",easing:"easeOutCubic"},_tool:"Write:scatter"}}),{origin:Ci.clone(),target:i,color:new te("#60a5fa"),colorEnd:new te("#bfdbfe"),travelTime:Se(2.8,4),trailLength:.55,trailBrightness:2.2,trailFadeTime:Se(22,28),headSize:0,pathConfig:{type:"quadratic",easing:"easeInCubic",c1:o},_tool:"Write"}}function UR(t,e,n){const i=bn(20,90),r=i.clone().normalize(),s=i.length();return{origin:new R(Se(-2,2),Se(-2,2),Se(-2,2)),target:i,color:new te("#f59e0b"),colorEnd:new te("#f97316"),travelTime:Se(2.2,3.2),trailLength:.45,trailBrightness:2,trailFadeTime:Se(20,28),headSize:0,pathConfig:{type:"noise",easing:"easeOutCubic",c1:r.clone().multiplyScalar(s*.5).add(Ki(r).multiplyScalar(Se(-20,20))),noiseAmp:Se(8,20),noiseFreq:Se(3,8),noisePhase:Se(0,Math.PI*2)},_tool:t===0?"Bash:first":"Bash"}}function xy(t=0){const e=sm();e.y*=.1,e.normalize();const n=Se(55,130),i=e.clone().multiplyScalar(n);i.y*=.15;const r=Ki(e),s=e.clone().multiplyScalar(n*.5).add(r.clone().multiplyScalar(Se(-15,15)));return{origin:Ci.clone(),target:i,color:new te("#c4b5fd"),colorEnd:new te("#e9d5ff"),travelTime:Se(.9,1.4),trailLength:0,trailBrightness:0,trailFadeTime:Se(14,20),headSize:0,pathConfig:{type:"quadratic",easing:"easeInOut",c1:s},_tool:"Glob"}}function FR(t,e,n){const i=(t==null?void 0:t.clone())??void 0,r=i?i.length()*Se(.85,1.1):Se(55,115),s=Se(Math.PI/3,Math.PI*.75),o=i?i.clone().normalize().applyAxisAngle(new R(0,1,0),Se(-.4,.4)):(()=>{const u=sm();return u.y*=.1,u.normalize()})(),l=Ki(o).clone().multiplyScalar(r),f=Math.atan2(-l.z,-l.x),d=i??new R(l.x+Math.cos(f+s)*r,l.y*Se(.08,.25),l.z+Math.sin(f+s)*r),a={origin:d.clone(),target:Ji(),color:new te("#e879f9"),colorEnd:new te("#ffffff"),travelTime:Se(.7,1.1),trailLength:.25,trailBrightness:1.5,trailFadeTime:8,headSize:5,pathConfig:{type:"linear",easing:"easeInCubic"},_tool:"Grep:return"};return{origin:Ci.clone(),target:d,color:new te("#e879f9"),colorEnd:new te("#e879f9"),travelTime:Se(6,9),trailLength:.9,trailBrightness:1,trailFadeTime:16,headSize:0,pathConfig:{type:"arc",easing:"linear",arcCenter:l,arcStartAngle:f,arcSweepAngle:s,arcRadius:r},pendingSpawn:a,_tool:"Grep"}}function OR(t,e){const n=bn(200,350),i=n.clone().normalize(),r=n.length(),s=Ki(i),o=i.clone().cross(s).normalize(),c=i.clone().multiplyScalar(r*.2).addScaledVector(s,Se(60,120)).addScaledVector(o,Se(-40,40)),l=i.clone().multiplyScalar(r*.7).addScaledVector(s,Se(-30,60)).addScaledVector(o,Se(-20,20)),f=Ki(i.clone().negate()),d={origin:n.clone(),target:Ji(),color:new te("#f43f5e"),colorEnd:new te("#fb7185"),travelTime:Se(4,7),trailLength:.7,trailBrightness:1.2,trailFadeTime:20,headSize:3,pathConfig:{type:"cubic",easing:"easeOutCubic",c1:n.clone().add(i.clone().negate().multiplyScalar(r*.3)).addScaledVector(f,Se(-80,80)),c2:n.clone().add(i.clone().negate().multiplyScalar(r*.7)).addScaledVector(f,Se(-40,40))},_tool:"WebFetch:echo"};return{origin:Ci.clone(),target:n,color:new te("#fb7185"),colorEnd:new te("#fda4af"),travelTime:Se(6,10),trailLength:.92,trailBrightness:.8,trailFadeTime:25,headSize:4,pathConfig:{type:"cubic",easing:"easeOutCubic",c1:c,c2:l},pendingSpawn:d,_tool:"WebFetch"}}function kR(t){return{origin:bn(250,400),target:Ji(),color:new te("#c8e0ff"),colorEnd:new te("#ffffff"),travelTime:Se(2,3.5),trailLength:.06,trailBrightness:1.8,trailFadeTime:18,headSize:0,pathConfig:{type:"linear",easing:"easeInCubic"},_tool:"prompt"}}function BR(t){return{origin:Ji(),target:bn(80,180),color:new te("#7eb8f0"),colorEnd:new te("#aad4ff"),travelTime:Se(2,3.5),trailLength:0,trailBrightness:0,trailFadeTime:12,headSize:0,pathConfig:{type:"linear",easing:"easeOutQuart"},_tool:"response"}}function zR(){const t=bn(15,45),e=Ji(),n=t.clone().lerp(e,.5);return n.y-=Se(12,25),{origin:t,target:e,color:new te("#777777"),colorEnd:new te("#222222"),travelTime:Se(7,11),trailLength:.2,trailBrightness:.35,trailFadeTime:12,headSize:3,pathConfig:{type:"quadratic",easing:"easeOutThenIn",c1:n},_tool:"Stop"}}function VR(){return{origin:bn(80,150),target:Ji(),color:new te("#FFD060"),colorEnd:new te("#ffffff"),travelTime:Se(.8,1.5),trailLength:0,trailBrightness:0,trailFadeTime:5,headSize:0,pathConfig:{type:"linear",easing:"easeInPow25"},_tool:"compact:pre"}}function HR(t){return{origin:Ji(),target:bn(70,160),color:new te("#FFE080"),colorEnd:new te("#FFE080"),travelTime:Se(2.5,4),trailLength:0,trailBrightness:0,trailFadeTime:15,headSize:0,pathConfig:{type:"linear",easing:"easeOutQuart"},_tool:"compact:post"}}function GR(){const t=bn(25,50),e=t.clone().normalize(),n=t.length(),i=e.clone().multiplyScalar(n*.5).add(Ki(e).multiplyScalar(Se(-12,12)));return{origin:Ci.clone(),target:t,color:new te("#f87171"),colorEnd:new te("#991111"),travelTime:Se(1.2,2),trailLength:.42,trailBrightness:2.5,trailFadeTime:8,headSize:6,stallAt:Se(.55,.65),stallDuration:Se(.3,.6),pathConfig:{type:"noise",easing:"linear",c1:i,noiseAmp:Se(4,8),noiseFreq:Se(12,20),noisePhase:Se(0,Math.PI*2)},_tool:"error"}}function WR(){return{origin:Ci.clone(),target:Ci.clone(),color:new te("#34d399"),colorEnd:new te("#34d399"),travelTime:999,trailLength:0,trailBrightness:0,trailFadeTime:8,headSize:0,pathConfig:{type:"linear",easing:"linear"},_tool:"Notification"}}function XR(){const t=bn(80,165),e=bn(6,18),n=t.clone().lerp(Ci,.4).add(Ki(t.clone().normalize()).multiplyScalar(Se(14,32)));return{origin:t,target:e,color:new te("#c084fc"),colorEnd:new te("#c084fc"),travelTime:Se(5,7.5),trailLength:.48,trailBrightness:1,trailFadeTime:14,headSize:5,pathConfig:{type:"quadratic",easing:"easeOutThenIn",c1:n},_tool:"SubagentStop"}}function jR(t){return{origin:Ci.clone(),target:bn(30,90),color:new te(t),colorEnd:new te(t),travelTime:Se(3,5),trailLength:.45,trailBrightness:1,trailFadeTime:10,headSize:5,pathConfig:{type:"linear",easing:"easeOutCubic"},_tool:"default"}}function V0(t,e,n=0,i,r,s){switch(t){case"Read":return DR(i);case"Edit":return IR(i);case"Write":return NR(i);case"Bash":return UR(n);case"Glob":return xy();case"Grep":return FR(i);case"WebFetch":return OR();case"prompt":return kR();case"response":return BR();case"Stop":return zR();case"compact:pre":return VR();case"compact:post":return HR();case"error":return GR();case"Notification":return WR();case"SubagentStop":return XR();default:return jR(e)}}function Mc(t,e){switch(t){case"easeOutCubic":return 1-Math.pow(1-e,3);case"easeOutQuart":return 1-Math.pow(1-e,4);case"easeInQuad":return e*e;case"easeInCubic":return e*e*e;case"easeInPow25":return Math.pow(e,2.5);case"easeInOut":return e<.5?2*e*e:1-Math.pow(-2*e+2,2)/2;case"easeOutThenIn":return e<.45?1-Math.pow(1-e/.45,2.5):1-Math.pow(1-e,3);case"linear":default:return e}}function bi(t,e,n,i){const r=1-i,s=new R;switch(t.type){case"linear":s.lerpVectors(e,n,i);break;case"quadratic":{const o=t.c1,c=r*r,l=i*i;s.set(c*e.x+2*r*i*o.x+l*n.x,c*e.y+2*r*i*o.y+l*n.y,c*e.z+2*r*i*o.z+l*n.z);break}case"cubic":{const o=t.c1,c=t.c2,l=r*r,f=l*r,d=i*i,a=d*i;s.set(f*e.x+3*l*i*o.x+3*r*d*c.x+a*n.x,f*e.y+3*l*i*o.y+3*r*d*c.y+a*n.y,f*e.z+3*l*i*o.z+3*r*d*c.z+a*n.z);break}case"arc":{const o=t.arcStartAngle+i*t.arcSweepAngle,c=t.arcCenter,l=t.arcRadius;s.set(c.x+Math.cos(o)*l,c.y+Math.sin(o)*l*.12,c.z+Math.sin(o)*l);break}case"noise":{if(t.c1){const f=t.c1,d=r*r,a=i*i;s.set(d*e.x+2*r*i*f.x+a*n.x,d*e.y+2*r*i*f.y+a*n.y,d*e.z+2*r*i*f.z+a*n.z)}else s.lerpVectors(e,n,i);const o=t.noiseAmp*(1-i*.75),c=t.noiseFreq,l=t.noisePhase;s.x+=Math.sin(i*c+l)*Math.sin(i*2.3)*o,s.y+=Math.cos(i*c*1.4+l)*.35*o*(1-i),s.z+=Math.sin(i*c*.8+l+2.1)*Math.sin(i*3.1)*o;break}}return s}function $R(t){return 1-Math.pow(1-t,3)}function ia(t,e){return Math.random()*(e-t)+t}function YR(t){return t*t*t}function H0(t){return 1-Math.pow(1-t,3)}function qR(t,e){const n=e.target.clone(),i=e.target.clone().sub(e.origin).normalize(),r=new Float32Array([n.x,n.y+20,n.z,n.x,n.y+20,n.z]),s=new Ve;s.setAttribute("position",new He(r,3));const o=new pn({color:new te("#ffffff"),transparent:!0,opacity:0,blending:st,depthWrite:!1}),c=new Qt(s,o);c.visible=!1,t.add(c);const l=new Float32Array([n.x,n.y,n.z,n.x,n.y,n.z]),f=new Ve;f.setAttribute("position",new He(l,3));const d=new pn({color:new te("#60a5fa"),transparent:!0,opacity:0,blending:st,depthWrite:!1}),a=new Qt(f,d);a.visible=!1,t.add(a);const u=[{obj:c,mat:o,meta:{}},{obj:a,mat:d,meta:{}}];let h=!1,m=0;return{entries:u,tick(v,g,p,_,x){if(!h)return;m+=g;const S=m;if(S<.35){c.visible=!0,o.opacity=1;const b=Math.min(1,S/.15),M=n.y+20*(1-YR(b));r[3]=M,s.attributes.position.needsUpdate=!0}if(S>.12&&S<.6){a.visible=!0;const b=Math.min(1,(S-.12)/.33),M=H0(b)*6;l[0]=n.x-i.x*M,l[1]=n.y-i.y*M,l[2]=n.z-i.z*M,l[3]=n.x+i.x*M,l[4]=n.y+i.y*M,l[5]=n.z+i.z*M,f.attributes.position.needsUpdate=!0,d.opacity=Math.min(1,(S-.12)/.1)}if(S>.4){const b=Math.min(1,(S-.4)/.25),M=n.y+20*H0(b);r[3]=M,s.attributes.position.needsUpdate=!0,o.opacity=Math.max(0,1-b),d.opacity=Math.max(0,1-(S-.4)/.3)}S>.8&&(c.visible=!1,a.visible=!1)},onLand(){h=!0},applyFade(v){o.opacity=Math.min(o.opacity,v),d.opacity=Math.min(d.opacity,v)}}}function KR(t,e){const n=[];let i=!1;for(let o=0;o<4;o++){const c=o/4*Math.PI*2,l=new R(Math.cos(c)*6,0,Math.sin(c)*6).add(e.origin),f=new Ve().setFromPoints([e.origin.clone(),l]),d=new pn({color:new te("#fb7185"),transparent:!0,opacity:.7,blending:st,depthWrite:!1}),a=new Qt(f,d);t.add(a),n.push({obj:a,mat:d,meta:{type:"launch"}})}const r=bi(e.pathConfig,e.origin,e.target,.5);for(let o=0;o<3;o++){const c=o/3*Math.PI*2,l=new R(Math.cos(c)*4,(o-1)*1.5,Math.sin(c)*4).add(r),f=new Ve().setFromPoints([r.clone(),l]),d=new pn({color:new te("#fda4af"),transparent:!0,opacity:0,blending:st,depthWrite:!1}),a=new Qt(f,d);t.add(a),n.push({obj:a,mat:d,meta:{type:"relay"}})}const s=[];return{entries:n,tick(o,c,l,f,d){for(const a of n)if(a.meta.type==="launch"&&(a.mat.opacity=Math.max(0,.7-l*1.4)),a.meta.type==="relay"){const u=o>.43&&o<.57,h=u?(o-.43)/.07:0;a.mat.opacity=u?Math.sin(h*Math.PI)*.6:0}if(i)for(const a of s)a.mat.opacity=Math.max(0,a.mat.opacity-c/a.fadeTime)},onLand(){i=!0;for(let o=0;o<6;o++){const c=o/6*Math.PI*2+ia(0,.3),l=ia(8,14),f=e.target.clone().add(new R(Math.cos(c)*l,ia(-1,1),Math.sin(c)*l)),d=new Ve().setFromPoints([e.target.clone(),f]),a=new pn({color:new te("#fb7185"),transparent:!0,opacity:.8,blending:st,depthWrite:!1}),u=new Qt(d,a);t.add(u);const h=ia(.5,.9);s.push({mat:a,fadeTime:h}),n.push({obj:u,mat:a,meta:{type:"landing"}})}},applyFade(o){for(const c of n){const l=c.mat;l.opacity=Math.min(l.opacity,o)}}}}const Gr=120,jf=8,ZR=`
  attribute float aT;
  varying float vT;
  void main() { vT = aT; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`,QR=`
  uniform float uTime;
  uniform float uOpacity;
  uniform float uPhase;
  varying float vT;
  void main() {
    float flicker = 0.8 + 0.2 * sin(vT * 20.0 + uTime * 1.5);
    float pulsePos = mod(uPhase + uTime * 0.08, 1.0);
    float pulse    = exp(-pow((vT - pulsePos) / 0.08, 2.0)) * 0.8;
    float base = pow(vT, 0.4) * 0.4;
    float b    = (base + pulse) * flicker;
    vec3 blue  = vec3(0.05, 0.2, 1.0);
    vec3 cyan  = vec3(0.2,  0.9, 1.0);
    vec3 white = vec3(1.0,  1.0, 1.0);
    vec3 col   = mix(blue, cyan, vT);
    col = mix(col, white, clamp(pulse / 0.8, 0.0, 1.0));
    gl_FragColor = vec4(min(col * b, 1.0), min(b, 1.0) * uOpacity);
  }
`;function JR(t,e){const n=Array.from({length:jf},(r,s)=>{const o=new Float32Array(Gr*3),c=new Float32Array(Gr);for(let x=0;x<Gr;x++)c[x]=x/(Gr-1);const l=new Ve;l.setAttribute("position",new He(o,3)),l.setAttribute("aT",new He(c,1));const f=new Tt({vertexShader:ZR,fragmentShader:QR,uniforms:{uTime:{value:0},uOpacity:{value:0},uPhase:{value:s/jf}},blending:st,transparent:!0,depthWrite:!1});t.add(new Qt(l,f));const d=1.2+Math.random()*1.5,a=3.5+Math.random()*3,u=Math.random()*Math.PI*2,h=Math.random()*Math.PI*2,m=25+Math.random()*25,v=new R(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize(),g=new R((Math.random()-.5)*200,(Math.random()-.5)*200,(Math.random()-.5)*200),p=-(s/jf)*3.5-Math.random()*.2,_=.8+Math.random()*.6;return{posArr:o,geo:l,mat:f,f1:d,f2:a,ph1:u,ph2:h,amp:m,perp:v,scatter:g,windowStart:p,rollSpeed:_,window:p}}),i={entries:n.map(r=>({obj:new Qt(r.geo,r.mat),mat:r.mat,meta:{}})),suppressDefaultTrail:!0,trailTick(r,s,o){const c=.3+o*.01;let l=!0;for(const f of n){const d=f.window>=1?1/(4*f.rollSpeed):(1-f.windowStart)/e.travelTime;f.window=Math.min(2,f.window+s*d);const a=f.window;if(a<=0){f.geo.setDrawRange(0,0),l=!1;continue}if(a>=2){f.mat.uniforms.uOpacity.value=0,f.geo.setDrawRange(0,0);continue}l=!1;const u=Math.round(Math.min(1,a)*(Gr-1)),h=Math.round(Math.max(0,a-1)*(Gr-1)),m=u-h;if(m<1){f.geo.setDrawRange(0,0);continue}for(let v=h;v<=u;v++){const g=v/(Gr-1),p=Mc(e.pathConfig.easing,g),_=bi(e.pathConfig,e.origin,e.target,p),x=Math.max(0,1-g/.5),S=Math.min(1,g/.5),b=1-Math.pow(g,8),M=(Math.sin(g*f.f1*Math.PI*2+f.ph1+o*c)*f.amp+Math.sin(g*f.f2*Math.PI*2+f.ph2+o*c*1.4)*f.amp*.3)*S*b;f.posArr[v*3]=_.x+f.scatter.x*x+f.perp.x*M,f.posArr[v*3+1]=_.y+f.scatter.y*x+f.perp.y*M,f.posArr[v*3+2]=_.z+f.scatter.z*x+f.perp.z*M}f.geo.attributes.position.needsUpdate=!0,f.geo.setDrawRange(h,m),f.mat.uniforms.uOpacity.value=.7,f.mat.uniforms.uTime.value=o}l&&(i.shouldMarkDone=!0)},tick(){},onLand(){},applyFade(r){},shouldMarkDone:!1};return i}function e2(t,e,n){const i=[t.clone()],r=6;for(let s=1;s<r;s++){const o=s/r,c=t.clone().lerp(e,o),l=new R(Math.random()-.5,(Math.random()-.5)*.3,Math.random()-.5).normalize();c.addScaledVector(l,(Math.random()-.5)*n),i.push(c)}return i.push(e.clone()),new Ve().setFromPoints(i)}function t2(t,e){const n=[];for(let i=0;i<3;i++){const r=new Ve().setFromPoints([new R(0,0,0),new R(0,0,0)]),s=new pn({color:new te("#f87171"),transparent:!0,opacity:0,blending:st,depthWrite:!1}),o=new Qt(r,s);o.visible=!1,t.add(o),n.push({obj:o,mat:s,meta:{visible:!1,stallElapsed:0,dir:new R(Math.random()-.5,(Math.random()-.5)*.4,Math.random()-.5).normalize().multiplyScalar(ia(8,18))}})}return{entries:n,tick(i,r,s,o,c){for(const l of n){if(!l.meta.visible)continue;l.meta.stallElapsed+=r;const f=l.meta.stallElapsed,d=l.mat;if(f<.4)d.opacity=Math.sin(f*40)*.3+.7;else if(f<.7){const a=(f-.4)/.3;d.opacity=Math.max(0,1-a)}else d.opacity=0,l.obj.visible=!1}},onStall(i){for(const r of n){const s=i.clone().add(r.meta.dir),o=e2(i,s,3.5);r.obj.geometry.dispose(),r.obj.geometry=o,r.obj.visible=!0,r.meta.visible=!0,r.meta.stallElapsed=0,r.mat.opacity=1}},applyFade(i){for(const r of n){const s=r.mat;s.opacity=Math.min(s.opacity,i)}}}}function n2(t){const e=[];for(let n=0;n<t;n++){const i=n/t*Math.PI*2,r=(n+.55)/t*Math.PI*2;e.push(new R(Math.cos(i),0,Math.sin(i))),e.push(new R(Math.cos(r),0,Math.sin(r)))}return new Ve().setFromPoints(e)}function i2(t){const e=[20,35,52],n=[0,.12,.24],i=[.9,.6,.32],r=["#34d399","#6ee7b7","#a7f3d0"],s=[];for(let c=0;c<3;c++){const l=n2(12),f=new pn({color:new te(r[c]),transparent:!0,opacity:0,blending:st,depthWrite:!1}),d=new nu(l,f);d.rotation.x=Math.PI/2,t.add(d),s.push({obj:d,mat:f,meta:{maxRadius:e[c],delay:n[c],baseOpacity:i[c],expandTime:.9+c*.15}})}const o={entries:s,tick(c,l,f,d,a){let u=!0;for(const h of s){const{maxRadius:m,delay:v,baseOpacity:g,expandTime:p}=h.meta,_=Math.max(0,f-v),x=Math.min(1,_/p),S=$R(x)*m;h.obj.scale.set(S,S,S);const b=Math.max(0,_-p)/.5;h.mat.opacity=g*Math.max(0,1-b),b<1&&(u=!1),b>=1&&(h.obj.visible=!1)}u&&f>.5&&(o.shouldMarkDone=!0)},applyFade(c){},shouldMarkDone:!1};return o}let Ql=null;function r2(){if(Ql)return Ql;const t=document.createElement("canvas");t.width=t.height=32;const e=t.getContext("2d"),n=e.createRadialGradient(16,16,0,16,16,16);return n.addColorStop(0,"rgba(232,121,249,1)"),n.addColorStop(.3,"rgba(232,121,249,0.6)"),n.addColorStop(1,"rgba(232,121,249,0)"),e.fillStyle=n,e.fillRect(0,0,32,32),Ql=new Ir(t),Ql}function s2(){return new Ve().setFromPoints([new R(0,1,0),new R(1,0,0),new R(0,-1,0),new R(-1,0,0),new R(0,1,0)])}function o2(t,e){const n=e.pathConfig;if(n.type!=="arc")return null;const i=61,r=[];for(let b=0;b<=60;b++){const M=b/60,T=n.arcStartAngle+M*n.arcSweepAngle;r.push(new R(n.arcCenter.x+Math.cos(T)*n.arcRadius,n.arcCenter.y+Math.sin(T)*n.arcRadius*.12,n.arcCenter.z+Math.sin(T)*n.arcRadius))}const s=new Float32Array(i*3),o=new He(s,3),c=new Ve().setFromPoints(r);c.setAttribute("color",o);const l=new pn({vertexColors:!0,transparent:!0,opacity:.85,blending:st,depthWrite:!1}),f=new Qt(c,l);t.add(f);const d={obj:f,mat:l,meta:{}},a=new Mu({map:r2(),color:new te("#e879f9"),blending:st,transparent:!0,depthWrite:!1,opacity:0}),u=new em(a);u.position.copy(e.target),u.scale.set(8,8,1),u.visible=!1,t.add(u);const h={obj:u,mat:a,meta:{blipElapsed:0,blipActive:!1}},m=new te("#e879f9"),v=[];let g=null,p=null,_=0,x=!1;const S=[d,h];return{entries:S,suppressDefaultTrail:!0,tick(b,M,T,y,w){for(let D=0;D<i;D++){const C=D/60,N=Math.abs(C-b);let P;C>b?P=Math.max(.03,.08-(C-b)*.5):P=Math.max(.05,1-N*8);const U=m.clone().multiplyScalar(P);s[D*3]=U.r,s[D*3+1]=U.g,s[D*3+2]=U.b}if(o.needsUpdate=!0,h.meta.blipActive){h.meta.blipElapsed+=M;const D=h.meta.blipElapsed;a.opacity=Math.max(0,1-D/.5);const C=8*(1+D*4);u.scale.set(C,C,1)}if(x){_+=M;for(const D of v)if(D.elapsed+=M,D.elapsed>=D.spawnDelay){D.active=!0;const C=D.elapsed-D.spawnDelay;D.mat.opacity=Math.max(0,.8-C/.5)}if(p&&g){const D=_;if(D<.35){const C=D/.35*15;p.scale.set(C,C,C),g.opacity=Math.max(0,.9-(D-.15)/.2)}else g.opacity=Math.max(0,1-(D-.35)/.2)}}},onLand(){u.visible=!0,a.opacity=1,h.meta.blipActive=!0,h.meta.blipElapsed=0,x=!0,_=0;const b=[-3,-1,1,3];for(let w=0;w<4;w++){const D=b[w],C=new R(e.target.x-4,e.target.y+D,e.target.z),N=new R(e.target.x+4,e.target.y+D,e.target.z),P=new Ve().setFromPoints([C,N]),U=new pn({color:new te("#e879f9"),transparent:!0,opacity:0,blending:st,depthWrite:!1}),V=new Qt(P,U);t.add(V),S.push({obj:V,mat:U,meta:{type:"matchLine"}}),v.push({mat:U,spawnDelay:w*.06,elapsed:0,active:!1})}const M=s2(),T=new pn({color:new te("#e879f9"),transparent:!0,opacity:.9,blending:st,depthWrite:!1}),y=new Qt(M,T);y.position.copy(e.target),y.scale.set(.1,.1,.1),t.add(y),S.push({obj:y,mat:T,meta:{type:"diamond"}}),p=y,g=T},applyFade(b){l.opacity=Math.min(l.opacity,b),a.opacity=Math.min(a.opacity,b);for(const M of v)M.mat.opacity=Math.min(M.mat.opacity,b);g&&(g.opacity=Math.min(g.opacity,b))}}}let $f=null;function a2(){if($f)return $f;const t=document.createElement("canvas");t.width=t.height=64;const e=t.getContext("2d"),n=e.createRadialGradient(32,32,0,32,32,32);return n.addColorStop(0,"rgba(255,255,255,1.0)"),n.addColorStop(.25,"rgba(255,255,255,0.8)"),n.addColorStop(.6,"rgba(255,255,255,0.2)"),n.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=n,e.fillRect(0,0,64,64),$f=new Ir(t)}function l2(t,e){const r=new Uint8Array(256);for(let x=0;x<256;x++)r[x]=Math.random()>.45?1:0;const s=800,o=[],c=[0];for(let x=0;x<s;x++)o.push(bi(e.pathConfig,e.origin,e.target,x/(s-1))),x>0&&c.push(c[x-1]+o[x].distanceTo(o[x-1]));const l=c[s-1],f=new Array(100),d=new Float32Array(100);let a=0;for(let x=0;x<100;x++){const S=x/99*l;for(;a<s-1&&c[a]<S;)a++;f[x]=o[a].clone(),d[x]=a/(s-1)}const u=new Float32Array(100*3),h=new Float32Array(100*3);for(let x=0;x<100;x++)u[x*3]=f[x].x,u[x*3+1]=f[x].y,u[x*3+2]=f[x].z;const m=new Ve;m.setAttribute("position",new He(u,3)),m.setAttribute("color",new He(h,3));const v=new Ga({size:2.8,vertexColors:!0,map:a2(),blending:st,transparent:!0,depthWrite:!1,sizeAttenuation:!0,opacity:.9}),g=new ls(m,v);t.add(g);const p=[{obj:g,mat:v,meta:{}}];let _=1;return{entries:p,suppressDefaultTrail:!0,onLand(){},trailTick(x,S,b,M){const y=b*12;for(let w=0;w<100;w++){if(d[w]>x){h[w*3]=h[w*3+1]=h[w*3+2]=0;continue}const D=w/99,C=(Math.floor(w-y)%256+256)%256,N=r[C]?1:.06,P=(.2+.8*D)*N*_;h[w*3]=P,h[w*3+1]=(.83+.12*D)*P,h[w*3+2]=(.3+.1*D)*P}m.attributes.color.needsUpdate=!0,v.opacity=.93*_},tick(){},applyFade(x){_=x}}}let Yf=null;function c2(){if(Yf)return Yf;const t=document.createElement("canvas");t.width=t.height=64;const e=t.getContext("2d"),n=e.createRadialGradient(32,32,0,32,32,32);return n.addColorStop(0,"rgba(255,255,255,1.0)"),n.addColorStop(.25,"rgba(255,255,255,0.8)"),n.addColorStop(.6,"rgba(255,255,255,0.2)"),n.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=n,e.fillRect(0,0,64,64),Yf=new Ir(t)}function u2(t,e){const s=[0],o=[12],c=Array.from({length:1},()=>{const M=new Uint8Array(256);for(let T=0;T<256;T++)M[T]=Math.random()>.45?1:0;return M}),l=800,f=[],d=[0];for(let M=0;M<l;M++)f.push(bi(e.pathConfig,e.origin,e.target,M/(l-1))),M>0&&d.push(d[M-1]+f[M].distanceTo(f[M-1]));const a=d[l-1],u=[],h=new Float32Array(100);let m=0;for(let M=0;M<100;M++){const T=M/99*a;for(;m<l-1&&d[m]<T;)m++;u.push(f[m].clone()),h[M]=m/(l-1)}const v=bi(e.pathConfig,e.origin,e.target,.49),g=bi(e.pathConfig,e.origin,e.target,.51),p=new R().copy(g).sub(v).normalize(),_=new R().crossVectors(p,new R(0,1,0));_.lengthSq()<.01&&_.set(1,0,0),_.normalize();const x=s.map((M,T)=>{const y=new Float32Array(300),w=new Float32Array(100*3),D=new Ve;D.setAttribute("position",new He(y,3)),D.setAttribute("color",new He(w,3));for(let P=0;P<100;P++)y[P*3]=u[P].x+_.x*M,y[P*3+1]=u[P].y+_.y*M,y[P*3+2]=u[P].z+_.z*M;const C=new Ga({size:2.4,vertexColors:!0,map:c2(),blending:st,transparent:!0,depthWrite:!1,sizeAttenuation:!0,opacity:.9}),N=new ls(D,C);return t.add(N),{posArr:y,colArr:w,geo:D,mat:C,pts:N,bs:c[T],spd:o[T],center:M===0?1:.7}}),S=x.map(M=>({obj:M.pts,mat:M.mat,meta:{}}));let b=1;return{entries:S,suppressDefaultTrail:!0,onLand(){},trailTick(M,T,y){for(const w of x){const D=y*w.spd;for(let C=0;C<100;C++){if(h[C]>M){w.colArr[C*3]=w.colArr[C*3+1]=w.colArr[C*3+2]=0;continue}const N=C/99,P=(Math.floor(C-D)%256+256)%256,U=w.bs[P]?1:.06,V=(.2+.8*N)*U*w.center*b;w.colArr[C*3]=(.376+.4*N)*V,w.colArr[C*3+1]=(.647+.25*N)*V,w.colArr[C*3+2]=V}w.geo.attributes.color.needsUpdate=!0,w.mat.opacity=.9*b}},tick(){},applyFade(M){b=M}}}new te("#00ff41");new te("#00ffcc");new te("#39d353");new te("#1a6b2a");function f2(t,e){const n=Math.acos(1-2*(t+.5)/e),i=Math.PI*(1+Math.sqrt(5))*t;return new R(Math.sin(n)*Math.cos(i),Math.cos(n),Math.sin(n)*Math.sin(i)).normalize()}const d2=`
  attribute float aT;
  varying float vT;
  void main() {
    vT = aT;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,h2=`
  uniform float uOpacity;
  uniform float uPulse;
  varying float vT;
  void main() {
    vec3 core = vec3(0.6, 0.9, 0.5);
    vec3 tip  = vec3(0.0, 0.10, 0.02);
    vec3 col  = mix(core, tip, vT);
    float bright = pow(1.0 - vT, 0.8) * 0.5;
    float pulse  = uPulse * 0.3;
    float alpha  = (bright + pulse) * uOpacity;
    gl_FragColor = vec4(col * (bright + pulse + 0.05), alpha);
  }
`;function p2(t){const e=new Float32Array(t*3),n=new Float32Array(t);for(let r=0;r<t;r++)n[r]=r/(t-1);const i=new Ve;return i.setAttribute("position",new He(e,3)),i.setAttribute("aT",new He(n,1)),i}function m2(){return new Tt({vertexShader:d2,fragmentShader:h2,uniforms:{uOpacity:{value:0},uPulse:{value:0}},blending:st,transparent:!0,depthWrite:!1})}const g2=`
  attribute float aT;
  attribute float aFade;
  varying float vT;
  varying float vFade;
  void main() {
    vT    = aT;
    vFade = aFade;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,_2=`
  uniform float uTime;
  uniform float uOpacity;
  varying float vT;
  varying float vFade;
  void main() {
    vec3 white     = vec3(1.0,  1.0,  0.95);
    vec3 acidGreen = vec3(0.3,  1.0,  0.25);
    vec3 midGreen  = vec3(0.0,  0.55, 0.12);
    vec3 darkGreen = vec3(0.0,  0.10, 0.02);
    vec3 col = vT < 0.15
      ? mix(white, acidGreen, vT / 0.15)
      : mix(midGreen, darkGreen, (vT - 0.15) / 0.85);
    float headFlare = pow(max(0.0, 1.0 - vT * 5.0), 2.0);
    float trail     = pow(max(0.0, 1.0 - vT), 1.1) * 0.9;
    float b         = headFlare + trail;
    float ripple       = sin(vT * 60.0 - uTime * 28.0) * 0.5 + 0.5;
    float rippleWeight = smoothstep(0.05, 0.20, vT) * pow(1.0 - vT, 1.2);
    b += ripple * rippleWeight * 0.25;
    b *= 0.88 + 0.12 * sin(uTime * 5.0 + vT * 4.0);
    b *= vFade;
    gl_FragColor = vec4(col * b, b * uOpacity);
  }
`;function v2(t){const e=new Float32Array(t*3),n=new Float32Array(t),i=new Float32Array(t).fill(1);for(let s=0;s<t;s++)n[s]=s/(t-1);const r=new Ve;return r.setAttribute("position",new He(e,3)),r.setAttribute("aT",new He(n,1)),r.setAttribute("aFade",new He(i,1)),r}function x2(){return new Tt({vertexShader:g2,fragmentShader:_2,uniforms:{uTime:{value:0},uOpacity:{value:1}},blending:st,transparent:!0,depthWrite:!1})}const Jl=28,qf=10;function y2(t){const r=Array.from({length:Jl},()=>{const f=p2(qf),d=m2(),a=new Qt(f,d);return t.add(a),{geo:f,mat:d,line:a,spawnTime:-999,dir:new R(1,0,0),active:!1,grown:!1,len:0}});let s=0;function o(f){const d=r[s%Jl];d.dir=f2(Math.floor(Math.random()*Jl*8),Jl*8),d.spawnTime=f,d.active=!0,d.grown=!1,d.len=0,d.mat.uniforms.uOpacity.value=1,d.mat.uniforms.uPulse.value=1,s++}function c(f){for(const d of r){if(!d.active){d.mat.uniforms.uOpacity.value=0;continue}const a=f-d.spawnTime;d.grown||(d.len=Math.min(11,a/.25*11),d.len>=11&&(d.grown=!0)),d.mat.uniforms.uPulse.value=Math.max(0,1-a/.4),d.mat.uniforms.uOpacity.value=1;const u=d.geo.attributes.position;for(let h=0;h<qf;h++){const v=1.5+h/(qf-1)*d.len;u.setXYZ(h,d.dir.x*v,d.dir.y*v,d.dir.z*v)}u.needsUpdate=!0}}function l(){for(const f of r)f.active=!1,f.mat.uniforms.uOpacity.value=0}return{spawn:o,tick:c,killAll:l,allMats:r.map(f=>f.mat)}}function S2(t,e){const s=new R().addVectors(e.origin,e.target).multiplyScalar(.5),o=Array.from({length:4},()=>{const h=30+Math.random()*80;return{type:"quadratic",easing:"linear",c1:new R(s.x+(Math.random()-.5)*h,s.y+(Math.random()-.5)*h,s.z+(Math.random()-.5)*h)}}),c=Array.from({length:4},(h,m)=>m*.35),l=Array.from({length:4},()=>{const h=v2(160),m=x2(),v=new Qt(h,m);return t.add(v),{geo:h,mat:m,line:v}}),f=3.5;let d=-1;const a=e.travelTime;function u(h,m,v,g,p){const _=m/a;for(let x=0;x<4;x++){const{geo:S,mat:b}=l[x],M=o[x],T=Math.max(0,Math.min(1,_-c[x])),y=T>0;if(b.uniforms.uTime.value=m,b.uniforms.uOpacity.value=y?1:0,!y)continue;x===3&&T>=1&&d<0&&(d=m);const w=d>=0?m-d:0,D=d>=0?Math.max(0,1-w/f):1;b.uniforms.uOpacity.value=D;const C=S.attributes.position,N=S.attributes.aFade;for(let P=0;P<160;P++){const U=P/159,V=T-U*.85,O=Math.max(0,V),H=V<0?0:1,z=bi(M,e.origin,e.target,O);C.setXYZ(P,z.x,z.y,z.z),N.setX(P,H)}C.needsUpdate=!0,N.needsUpdate=!0}}return{lines:l.map(h=>h.line),allMats:l.map(h=>h.mat),tick:u}}function G0(t,e){const n=S2(t,e),i=new li;i.position.copy(e.target),t.add(i);const r=y2(i),s=[...n.lines.map(l=>({obj:l,mat:new So,meta:{}})),{obj:i,mat:new So,meta:{}}];let o=!1,c=0;return{entries:s,suppressDefaultTrail:!0,trailTick(l,f,d,a){l>=1&&!o&&(o=!0,c=d);const u=o?d-c:0;n.tick(l,d,o,u,()=>{}),i.rotation.y=d*.05},tick(){},applyFade(l){if(l<=0){r.killAll();for(const f of n.allMats)f.uniforms.uOpacity.value=0}}}}function qt(t,e){return Math.random()*(e-t)+t}const yy=`
  attribute float aT;
  varying float vT;
  void main() {
    vT = aT;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Sy=`
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3  uBaseColor;
  uniform vec3  uTipColor;
  uniform float uPhase;
  varying float vT;

  void main() {
    vec3 col = mix(uBaseColor, uTipColor, vT);

    float flow = sin((vT * 8.0 - uTime * 2.0 + uPhase) * 3.14159);
    flow = pow(max(0.0, flow), 3.0) * 0.3;
    col += uTipColor * flow;

    float head = smoothstep(0.9, 1.0, vT);
    col = mix(col, uTipColor * 1.5, head * 0.7);

    float bright = 0.4 + vT * 0.3 + flow * 0.3 + head * 0.8;
    float alpha  = uOpacity * (0.3 + vT * 0.3 + flow * 0.15 + head * 0.4);

    gl_FragColor = vec4(min(col * bright, 1.0), min(alpha, 1.0));
  }
`,Kf=50;function M2(t){const e=new Float32Array(Kf*3),n=new Float32Array(Kf),i=new Ve;i.setAttribute("position",new He(e,3)),i.setAttribute("aT",new He(n,1)),i.setDrawRange(0,0);const r=new Tt({vertexShader:yy,fragmentShader:Sy,uniforms:{uTime:{value:0},uOpacity:{value:.9},uBaseColor:{value:new R(.2,.12,.4)},uTipColor:{value:new R(.6,.4,1)},uPhase:{value:qt(0,6.28)}},blending:st,transparent:!0,depthWrite:!1}),s=new Qt(i,r);t.add(s);const o=[];let c=0,l=!1,f=0;function d(m){o.push(m.clone());const v=Math.min(o.length,Kf),g=o.length-v;for(let p=0;p<v;p++){const _=o[g+p];e[p*3]=_.x,e[p*3+1]=_.y,e[p*3+2]=_.z,n[p]=p/(v-1||1)}f=v,i.attributes.position.needsUpdate=!0,i.attributes.aT.needsUpdate=!0,i.setDrawRange(0,f)}function a(){l=!0,c=0}function u(m){if(!l)return!1;c=Math.min(f-1,c+m*30);const v=Math.round(c),g=f-v;if(g<=1)return i.setDrawRange(0,0),!0;i.setDrawRange(v,g);for(let p=v;p<f;p++)n[p]=(p-v)/(g-1);return i.attributes.aT.needsUpdate=!0,!1}function h(m){r.uniforms.uTime.value+=m}return{line:s,geo:i,mat:r,pushPoint:d,startEating:a,tickEat:u,tickTime:h}}const Hh=80,Zf=10,w2=.35;function E2(t,e,n,i){const r=1-i;return new R(r*r*t.x+2*r*i*e.x+i*i*n.x,r*r*t.y+2*r*i*e.y+i*i*n.y,r*r*t.z+2*r*i*e.z+i*i*n.z)}function T2(t,e,n,i,r){const s=qt(0,Math.PI*2),o=qt(-.6,.6),l=new R(Math.cos(s)*Math.cos(o),Math.sin(o),Math.sin(s)*Math.cos(o)).normalize().clone().multiplyScalar(qt(14,22)),f=new Float32Array(Hh*3),d=new Float32Array(Hh),a=new Ve;a.setAttribute("position",new He(f,3)),a.setAttribute("aT",new He(d,1)),a.setDrawRange(0,0);const u=new Tt({vertexShader:yy,fragmentShader:Sy,uniforms:{uTime:{value:0},uOpacity:{value:.85},uBaseColor:{value:new R(.2,.12,.4)},uTipColor:{value:new R(.5,.35,.9)},uPhase:{value:qt(0,6.28)}},blending:st,transparent:!0,depthWrite:!1}),h=new Qt(a,u);h.visible=!1,t.add(h),f[0]=e.x,f[1]=e.y,f[2]=e.z,d[0]=0;const m={origin:e.clone(),isHit:i,fireDelay:n,pos:e.clone(),vel:l,searchDist:qt(20,45),gravity:new R(qt(-1.5,1.5),qt(-3,-1),qt(-1.5,1.5)),drift:new R(qt(-2,2),qt(-.5,.5),qt(-2,2)),returnStart:new R,returnArc:new R,returnT:0,returnDur:qt(1.2,2),points:[e.clone()],posArr:f,tArr:d,geo:a,mat:u,line:h,ptCount:1,state:"waiting",elapsed:0,stateTime:0,tailIdx:0};return r.push(m),m}function W0(t){const e=Math.min(t.points.length,Hh),n=t.points.length-e;for(let i=0;i<e;i++){const r=t.points[n+i];t.posArr[i*3]=r.x,t.posArr[i*3+1]=r.y,t.posArr[i*3+2]=r.z,t.tArr[i]=i/(e-1||1)}t.ptCount=e,t.geo.attributes.position.needsUpdate=!0,t.geo.attributes.aT.needsUpdate=!0}function b2(t,e){if(t.elapsed+=e,t.mat.uniforms.uTime.value=t.elapsed,t.state==="waiting"){t.elapsed>=t.fireDelay&&(t.state="seeking",t.stateTime=0,t.line.visible=!0);return}if(t.stateTime+=e,t.state==="seeking"){if(t.vel.addScaledVector(t.gravity,e),t.vel.addScaledVector(t.drift,e),t.vel.multiplyScalar(1-e*.3),t.pos.addScaledVector(t.vel,e),t.points.push(t.pos.clone()),W0(t),t.geo.setDrawRange(0,t.ptCount),t.pos.distanceTo(t.origin)>=t.searchDist)if(t.isHit){t.state="hit_returning",t.stateTime=0,t.returnStart.copy(t.pos);const n=t.pos.clone().add(t.origin).multiplyScalar(.5);t.returnArc.set(n.x+qt(-18,18),n.y+qt(8,25),n.z+qt(-18,18)),t.returnT=0,t.mat.uniforms.uBaseColor.value.set(.05,.35,.15),t.mat.uniforms.uTipColor.value.set(.3,1,.5)}else t.state="miss_dying",t.stateTime=0,t.tailIdx=0,t.mat.uniforms.uBaseColor.value.set(.3,.05,.05),t.mat.uniforms.uTipColor.value.set(.5,.1,.08)}else if(t.state==="hit_returning"){t.returnT=Math.min(1,t.returnT+e/t.returnDur);const n=t.returnT<.5?2*t.returnT*t.returnT:1-Math.pow(-2*t.returnT+2,2)/2;t.pos.copy(E2(t.returnStart,t.returnArc,t.origin,n)),t.points.push(t.pos.clone()),W0(t),t.geo.setDrawRange(0,t.ptCount),t.returnT>=1&&(t.state="miss_dying",t.stateTime=0,t.tailIdx=0)}else if(t.state==="miss_dying"){const n=t.isHit?25:15;t.tailIdx=Math.min(t.ptCount-1,t.tailIdx+e*n);const i=Math.round(t.tailIdx),r=t.ptCount-i;if(r<=1){t.state="done",t.geo.setDrawRange(0,0),t.line.visible=!1;return}t.geo.setDrawRange(i,r);for(let s=i;s<t.ptCount;s++)t.tArr[s]=(s-i)/(r-1);t.geo.attributes.aT.needsUpdate=!0,t.isHit||(t.mat.uniforms.uOpacity.value=Math.max(0,.85-t.stateTime*.4))}}function A2(t,e){const n=[],i=M2(t),r=[],s=Array.from({length:Zf},(f,d)=>d);for(let f=s.length-1;f>0;f--){const d=Math.floor(Math.random()*(f+1));[s[f],s[d]]=[s[d],s[f]]}for(let f=0;f<Zf;f++)r.push(T2(t,e.target,qt(.1,3),s[f]<Zf*w2,n));let o=!1,c=!1;const l={entries:[],suppressDefaultTrail:!0,trailTick(f,d,a,u){if(i.tickTime(d),f<1&&i.pushPoint(u.position),f>=1&&!o&&(o=!0,i.pushPoint(u.position),i.startEating()),o){c||(c=i.tickEat(d));for(const h of r)b2(h,d)}o&&c&&n.every(h=>h.state==="done")&&(l.shouldMarkDone=!0)},tick(){},onLand(){},applyFade(f){},shouldMarkDone:!1,dispose(){i.geo.dispose(),i.mat.dispose();for(const f of n)f.geo.dispose(),f.mat.dispose()}};return l}function Qf(t,e){return Math.random()*(e-t)+t}const Fs=8;function X0(t,e){const n=[];for(let d=0;d<Fs;d++){const a=d/Fs*Math.PI*2,u=Qf(-.3,.3),h=new R(Math.cos(a)*Math.cos(u),Math.sin(u),Math.sin(a)*Math.cos(u)).normalize();n.push({pos:new R(0,0,0),vel:h.multiplyScalar(Qf(80,140)),life:1,maxLife:Qf(1.5,2.5)})}const i=new Float32Array(Fs*3),r=new Float32Array(Fs),s=new Float32Array(Fs);for(let d=0;d<Fs;d++)i[d*3]=n[d].pos.x,i[d*3+1]=n[d].pos.y,i[d*3+2]=n[d].pos.z,r[d]=n[d].life,s[d]=n[d].maxLife;const o=new Ve;o.setAttribute("position",new He(i,3)),o.setAttribute("aLife",new He(r,1)),o.setAttribute("aMaxLife",new He(s,1));const c=new Tt({vertexShader:`
      attribute float aLife;
      attribute float aMaxLife;
      varying float vLife;
      void main() {
        vLife = aLife / aMaxLife;
        gl_PointSize = 3.0 * vLife * vLife;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      varying float vLife;
      void main() {
        float d = length(gl_PointCoord - 0.5) * 2.0;
        float a = (1.0 - d * d) * vLife;
        gl_FragColor = vec4(0.7, 0.8, 1.0, a);
      }
    `,blending:st,transparent:!0,depthWrite:!1}),l=new ls(o,c);t.add(l);const f={entries:[{obj:l,mat:c,meta:{}}],suppressDefaultTrail:!1,trailTick(d,a){let u=!0;for(let h=0;h<n.length;h++){const m=n[h];m.life-=a/m.maxLife,m.life>0&&(u=!1,m.vel.multiplyScalar(.98),m.pos.addScaledVector(m.vel,a),i[h*3]=m.pos.x,i[h*3+1]=m.pos.y,i[h*3+2]=m.pos.z,r[h]=m.life)}o.attributes.position.needsUpdate=!0,o.attributes.aLife.needsUpdate=!0,u&&(f.shouldMarkDone=!0)},tick(){},onLand(){},applyFade(d){},shouldMarkDone:!1,dispose(){o.dispose(),c.dispose()}};return f}function ec(t,e){return Math.random()*(e-t)+t}const Os=6;function C2(t,e){const n=[];for(let d=0;d<Os;d++){const a=d/Os*Math.PI*2,u=ec(-.4,.4),h=new R(Math.cos(a)*Math.cos(u),Math.sin(u),Math.sin(a)*Math.cos(u)).normalize(),m=ec(80,120),v=h.clone().multiplyScalar(m),g=v.clone().negate().normalize().multiplyScalar(ec(140,200));n.push({pos:v,vel:g,life:1,maxLife:ec(.8,1.4)})}const i=new Float32Array(Os*3),r=new Float32Array(Os),s=new Float32Array(Os);for(let d=0;d<Os;d++)i[d*3]=n[d].pos.x,i[d*3+1]=n[d].pos.y,i[d*3+2]=n[d].pos.z,r[d]=n[d].life,s[d]=n[d].maxLife;const o=new Ve;o.setAttribute("position",new He(i,3)),o.setAttribute("aLife",new He(r,1)),o.setAttribute("aMaxLife",new He(s,1));const c=new Tt({vertexShader:`
      attribute float aLife;
      attribute float aMaxLife;
      varying float vLife;
      void main() {
        vLife = aLife / aMaxLife;
        gl_PointSize = 4.0 * vLife;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      varying float vLife;
      void main() {
        float d = length(gl_PointCoord - 0.5) * 2.0;
        float a = (1.0 - d * d) * vLife;
        gl_FragColor = vec4(1.0, 0.8, 0.37, a);
      }
    `,blending:st,transparent:!0,depthWrite:!1}),l=new ls(o,c);t.add(l);const f={entries:[{obj:l,mat:c,meta:{}}],suppressDefaultTrail:!0,trailTick(d,a){let u=!0;for(let h=0;h<n.length;h++){const m=n[h];m.life-=a/m.maxLife,m.life>0&&(u=!1,m.pos.addScaledVector(m.vel,a),i[h*3]=m.pos.x,i[h*3+1]=m.pos.y,i[h*3+2]=m.pos.z,r[h]=m.life)}o.attributes.position.needsUpdate=!0,o.attributes.aLife.needsUpdate=!0,u&&(f.shouldMarkDone=!0)},tick(){},onLand(){},applyFade(d){},shouldMarkDone:!1,dispose(){o.dispose(),c.dispose()}};return f}const j0=60,Ko=40,$0=12,Y0=4,R2=3,q0=30,K0=.05,Z0=1.2,P2=new R;function Q0(t,e){const n=[];for(let g=0;g<j0;g++){let p=0,_=0,x=0;do p=(Math.random()*2-1)*Ko,_=(Math.random()*2-1)*Ko,x=(Math.random()*2-1)*Ko;while(p*p+_*_+x*x>Ko*Ko);n.push({pos:new R(p,_,x),active:!0})}const i=[{pos:new R(0,0,0),parentIdx:null}],r=new Float32Array(q0*2*3),s=new Ve,o=new He(r,3);o.setUsage(q1),s.setAttribute("position",o),s.setDrawRange(0,0);const c=new pn({color:new te("#FFD060"),transparent:!0,opacity:1,blending:st,depthWrite:!1}),l=new nu(s,c);t.add(l);let f=0,d=0,a=!0,u=0,h=j0;function m(){if(h===0)return!1;const g=new Map,p=$0*$0;for(const D of n){if(!D.active)continue;let C=-1,N=p;for(let P=0;P<i.length;P++){const U=i[P].pos.distanceToSquared(D.pos);U<N&&(N=U,C=P)}if(C>=0){const P=g.get(C)??[];P.push(D.pos),g.set(C,P)}}if(g.size===0)return!1;let _=-1,x=0;for(const[D,C]of g)(C.length>x||C.length===x&&D>_)&&(_=D,x=C.length);if(_<0)return!1;const S=i[_],b=g.get(_),M=new R;for(const D of b)M.add(P2.subVectors(D,S.pos).normalize());M.divideScalar(b.length).normalize(),M.x+=(Math.random()-.5)*.3,M.y+=(Math.random()-.5)*.3,M.z+=(Math.random()-.5)*.3,M.normalize();const T=S.pos.clone().addScaledVector(M,R2);i.push({pos:T,parentIdx:_});const y=Y0*Y0;for(const D of n)D.active&&T.distanceToSquared(D.pos)<y&&(D.active=!1,h--);const w=f*2*3;return r[w]=S.pos.x,r[w+1]=S.pos.y,r[w+2]=S.pos.z,r[w+3]=T.x,r[w+4]=T.y,r[w+5]=T.z,f++,o.needsUpdate=!0,s.setDrawRange(0,f*2),!0}const v={entries:[{obj:l,mat:c,meta:{}}],suppressDefaultTrail:!0,trailTick(g,p,_,x){if(a){for(d+=p;d>=K0;)if(d-=K0,!m()||f>=q0||h===0){a=!1;break}}else u+=p,c.opacity=Math.max(0,1-u/Z0),u>=Z0&&(v.shouldMarkDone=!0)},tick(g,p,_,x,S){},onLand(){},applyFade(g){},shouldMarkDone:!1,dispose(){s.dispose(),c.dispose()}};return v}function L2(t,e,n){switch(t){case"Bash:first":return G0(e,n);case"Bash":return G0(e,n);case"response":return X0(e);case"response:first":return X0(e);case"compact:pre":return C2(e);case"compact:post":return Q0(e);case"compact:post:first":return Q0(e);case"Edit":return qR(e,n);case"Write":return u2(e,n);case"WebFetch":return KR(e,n);case"prompt":return JR(e,n);case"error":return t2(e);case"Notification":return i2(e);case"Grep":return o2(e,n);case"Glob":return A2(e,n);case"Read":return l2(e,n);default:return null}}const ks=40;let tc=null;function D2(){if(tc)return tc;const t=64,e=document.createElement("canvas");e.width=e.height=t;const n=e.getContext("2d"),i=t/2,r=n.createRadialGradient(i,i,0,i,i,i);return r.addColorStop(0,"rgba(255,255,255,1)"),r.addColorStop(.18,"rgba(255,255,255,0.8)"),r.addColorStop(.45,"rgba(255,255,255,0.25)"),r.addColorStop(1,"rgba(255,255,255,0)"),n.fillStyle=r,n.fillRect(0,0,t,t),tc=new Ir(e),tc}class I2{constructor(e,n){this.done=!1,this.settled=null,this.midPendingSpawns=null,this.progress=0,this.elapsed=0,this.stallTimer=0,this.trailFade=1,this.stallPos=new R,this.midSpawnFired=!1,this.effects=[],this.p=e,this.group=new li,this.state=e.spawnDelay&&e.spawnDelay>0?"waiting":"traveling";const i=e.headSize===0;this.headMat=new Mu({map:D2(),color:e.color.clone(),blending:st,transparent:!0,depthWrite:!1,opacity:i?0:1}),this.head=new em(this.headMat);const r=Math.max(.01,e.headSize);this.head.scale.set(r,r,1),this.head.position.copy(e.origin),this.group.add(this.head),this.trailPosArr=new Float32Array(ks*3);const s=new Float32Array(ks*3);for(let f=0;f<ks;f++){this.trailPosArr[f*3]=e.origin.x,this.trailPosArr[f*3+1]=e.origin.y,this.trailPosArr[f*3+2]=e.origin.z;const d=f/(ks-1),a=Math.pow(1-d,2.2)*e.trailBrightness;s[f*3]=e.color.r*a,s[f*3+1]=e.color.g*a,s[f*3+2]=e.color.b*a}const o=new Ve;o.setAttribute("position",new He(this.trailPosArr,3)),o.setAttribute("color",new He(s,3)),this.trailMat=new pn({vertexColors:!0,transparent:!0,opacity:1,blending:st,depthWrite:!1}),this.trail=new Qt(o,this.trailMat),this.group.add(this.trail);const l=(n??L2)(e._tool??"",this.group,e);l&&(this.effects.push(l),l.suppressDefaultTrail&&(this.trailMat.opacity=0,this.trailMat.visible=!1))}tick(e){if(this.state!=="done"){if(this.elapsed+=e,this.state==="waiting")if(this.elapsed>=(this.p.spawnDelay??0))this.state="traveling";else return;this.state==="traveling"?this._tickTravel(e):this.state==="stalled"?this._tickStall(e):this.state==="fading"&&this._tickFade(e)}}_tickTravel(e){var c,l;const n=this.p;this.progress=Math.min(1,this.progress+e/n.travelTime);const i=this.progress;if(!this.midSpawnFired&&n.midSpawnFrac!=null&&i>=n.midSpawnFrac&&(this.midSpawnFired=!0,(c=n.pendingSpawns)!=null&&c.length&&(this.midPendingSpawns=n.pendingSpawns,n.pendingSpawns=void 0)),n.stallAt!=null&&i>=n.stallAt&&this.state==="traveling"){this._triggerStall();return}const r=Mc(n.pathConfig.easing,i),s=bi(n.pathConfig,n.origin,n.target,r);this.head.position.copy(s);const o=this.effects.find(f=>f.suppressDefaultTrail);if(o)(l=o.trailTick)==null||l.call(o,i,e,this.elapsed,this.head);else{for(let f=0;f<ks;f++){const d=f/(ks-1)*.45*n.trailLength,a=Math.max(0,i-d),u=Mc(n.pathConfig.easing,a),h=bi(n.pathConfig,n.origin,n.target,u);this.trailPosArr[f*3]=h.x,this.trailPosArr[f*3+1]=h.y,this.trailPosArr[f*3+2]=h.z}this.trail.geometry.attributes.position.needsUpdate=!0}if(i>.7&&n.headSize>0){const f=(i-.7)/.3;this.headMat.color.lerpColors(n.color,n.colorEnd,f)}if(n.headSize>0){const f=Math.max(0,1-i*5),d=n.headSize*(1+f*2.2);this.head.scale.set(d,d,1)}this._tickSecondaries(i,e),i>=1&&this._onLand()}_tickStall(e){this.stallTimer+=e;const n=2.5*(1-this.stallTimer/(this.p.stallDuration??.5)),i=Math.sin(this.elapsed*28)*n,r=Math.cos(this.elapsed*21)*n;this.head.position.set(this.stallPos.x+i,this.stallPos.y,this.stallPos.z+r),this.stallTimer>=(this.p.stallDuration??.5)&&this._onLand()}_triggerStall(){var i;this.state="stalled";const e=this.p.stallAt,n=Mc(this.p.pathConfig.easing,e);this.stallPos.copy(bi(this.p.pathConfig,this.p.origin,this.p.target,n)),this.head.position.copy(this.stallPos);for(const r of this.effects)(i=r.onStall)==null||i.call(r,this.stallPos)}_onLand(){var n;const e=this.state==="stalled";this.state="fading",this.settled={position:(e?this.stallPos:this.p.target).clone(),color:this.p.colorEnd.clone()};for(const i of this.effects)(n=i.onLand)==null||n.call(i)}_tickFade(e){var r;this.trailFade=Math.max(0,this.trailFade-e/Math.max(.05,this.p.trailFadeTime));const n=this.trailFade*this.trailFade;this.trailMat.opacity=n,this.headMat.opacity=n;const i=this.effects.find(s=>s.suppressDefaultTrail);i&&((r=i.trailTick)==null||r.call(i,1,e,this.elapsed,this.head));for(const s of this.effects)s.applyFade(n);for(const s of this.effects)if(s.shouldMarkDone){this.state="done";break}this.trailFade<=0&&(this.state="done"),this.done=this.state==="done"}_tickSecondaries(e,n){for(const i of this.effects)i.tick(e,n,this.elapsed,this.state,this.head),i.shouldMarkDone&&!i.suppressDefaultTrail&&(this.state="done",this.done=!0)}dispose(){var e;this.trail.geometry.dispose(),this.trailMat.dispose(),this.headMat.dispose();for(const n of this.effects){for(const i of n.entries)i.obj.geometry&&i.obj.geometry.dispose(),i.mat.dispose();(e=n.dispose)==null||e.call(n)}}}const Jf=600;class N2{constructor(){this.traveling=[],this.pendingDelayed=[],this.stars=[],this.group=new li,this.starPosArr=new Float32Array(Jf*3),this.starColArr=new Float32Array(Jf*3),this.starGeo=new Ve,this.starGeo.setAttribute("position",new He(this.starPosArr,3)),this.starGeo.setAttribute("color",new He(this.starColArr,3)),this.starGeo.setDrawRange(0,0),this.starMat=new Ga({vertexColors:!0,blending:st,depthWrite:!1,transparent:!0,opacity:.75,size:2,sizeAttenuation:!1}),this.group.add(new ls(this.starGeo,this.starMat))}spawn(e,n,i,r,s,o){const c=jd[e]||n||$d,l=V0(e,c,0,i);this._launch(l,o)}spawnBurst(e,n,i,r,s,o,c){const l=jd[e]||i||$d;for(let f=0;f<n;f++){const d=V0(e,l,f,r);this._launch(d,c)}}spawnRaw(e,n){this._launch(e,n)}_launch(e,n){const i=new I2(e);this.group.add(i.group),this.traveling.push({node:i,filePath:n})}tick(e){var n,i,r;for(let s=this.pendingDelayed.length-1;s>=0;s--){const o=this.pendingDelayed[s];o.waited+=e,o.waited>=o.delay&&(this._launch(o.params,o.filePath),this.pendingDelayed.splice(s,1))}for(let s=this.traveling.length-1;s>=0;s--){const o=this.traveling[s],c=o.node;if(c.tick(e),c.midPendingSpawns){for(const l of c.midPendingSpawns){const f=l.spawnDelay??0;f>0?this.pendingDelayed.push({params:l,delay:f,waited:0}):this._launch(l)}c.midPendingSpawns=null}if(c.settled){this._addStar(c.settled.position,c.settled.color),(n=this.onSettle)==null||n.call(this,c.settled.position,c.settled.color,o.filePath);const l=(i=c.p)==null?void 0:i.pendingSpawn;if(l){const d=l.spawnDelay??0;d>0?this.pendingDelayed.push({params:l,delay:d,waited:0}):this._launch(l),c.p.pendingSpawn=void 0}const f=(r=c.p)==null?void 0:r.pendingSpawns;if(f!=null&&f.length){for(const d of f){const a=d.spawnDelay??0;a>0?this.pendingDelayed.push({params:d,delay:a,waited:0}):this._launch(d)}c.p.pendingSpawns=void 0}c.settled=null}c.done&&(this.group.remove(c.group),c.dispose(),this.traveling.splice(s,1))}}addHistoryStar(e,n){this._addStar(e,n)}_addStar(e,n){this.stars.length>=Jf&&this.stars.shift();let i=e.clone();if(i.length()<20){const s=(Math.random()-.5)*2*(15+Math.pow(Math.random(),.6)*100)*(.4+Math.random()*2.1),o=(Math.random()-.5)*2*(15+Math.pow(Math.random(),.6)*100)*(.1+Math.random()*.4),c=(Math.random()-.5)*2*(15+Math.pow(Math.random(),.6)*100)*(.4+Math.random()*2.1);i=new R(s,o,c)}this.stars.push({pos:i,col:n.clone()});const r=this.stars.length;for(let s=0;s<r;s++){const o=this.stars[s];this.starPosArr[s*3]=o.pos.x,this.starPosArr[s*3+1]=o.pos.y,this.starPosArr[s*3+2]=o.pos.z,this.starColArr[s*3]=o.col.r,this.starColArr[s*3+1]=o.col.g,this.starColArr[s*3+2]=o.col.b}this.starGeo.attributes.position.needsUpdate=!0,this.starGeo.attributes.color.needsUpdate=!0,this.starGeo.setDrawRange(0,r)}dispose(){for(const{node:e}of this.traveling)this.group.remove(e.group),e.dispose();this.starGeo.dispose(),this.starMat.dispose()}}const U2=new Oa(3.5,32).toNonIndexed();class F2{constructor(){this.activity=0,this.group=new li,this.orbitRadius=18+Math.random()*12,this.orbitSpeed=.4+Math.random()*.4,this.orbitAngle=Math.random()*Math.PI*2,this.mat=new Tt({uniforms:{uTime:{value:0},uActivity:{value:0}},vertexShader:`
        uniform float uTime; uniform float uActivity;
        varying vec3 vWorldPos;
        
        float getWarp(vec3 p) {
          // Absolute sine waves create sharp folds and spikes instead of smooth curves
          float n1 = 1.0 - abs(sin(p.x * 3.0 + uTime));
          float n2 = 1.0 - abs(cos(p.y * 4.0 - uTime * 1.5));
          float n3 = 1.0 - abs(sin(p.z * 5.0 + uTime * 0.5));
          return pow(n1 * n2 * n3, 2.0) * 3.0; // Pushed out aggressively
        }
        void main() {
          vec3 pos = position + normal * getWarp(position) * (0.8 + uActivity);
          vec4 wPos = modelMatrix * vec4(pos, 1.0);
          vWorldPos = wPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * wPos;
        }
      `,fragmentShader:`
        uniform float uActivity;
        varying vec3 vWorldPos;
        void main() {
          // Flat shading calculation (inherent to dFdx/dFdy on non-indexed geometry)
          vec3 n = normalize(cross(dFdx(vWorldPos), dFdy(vWorldPos)));
          vec3 v = normalize(cameraPosition - vWorldPos);
          float fresnel = 1.0 - max(dot(v, n), 0.0);
          
          vec3 col = vec3(0.01, 0.05, 0.05); // Deep green/cyan base
          col += pow(fresnel, 2.0) * vec3(0.1, 0.8, 0.4) * (1.0 + uActivity); // Harsher glow on flat edges
          
          gl_FragColor = vec4(col, min(1.0, 0.4 + pow(fresnel, 2.0) * 0.6));
        }
      `,transparent:!0,depthWrite:!1,blending:st,side:ri}),this.meshref=new mn(U2,this.mat),this.meshref.scale.setScalar(.7),this.group.add(this.meshref)}triggerActivity(){this.activity=1}tick(e,n){this.activity=Math.max(0,this.activity-e*2),this.mat.uniforms.uTime.value=n,this.mat.uniforms.uActivity.value=this.activity,this.orbitAngle+=e*this.orbitSpeed*(1+this.activity),this.meshref.position.set(Math.cos(this.orbitAngle)*this.orbitRadius,Math.sin(n*1.5+this.orbitAngle)*3,Math.sin(this.orbitAngle)*this.orbitRadius),this.meshref.rotation.x=n*.4,this.meshref.rotation.y=n*.6}dispose(){this.mat.dispose()}}class O2{constructor(e,n){this.sessions=new Map,this.elapsed=0,this.eventUnsubs=[],this._autofit=!0,this._autoRotate=!0,this._docVisible=!document.hidden,this.onResize=()=>{const c=window.innerWidth,l=window.innerHeight;this.renderer.setSize(c,l),this.composer.setSize(c,l),this.camera.aspect=c/l,this.camera.updateProjectionMatrix()},this.onVisibilityChange=()=>{this._docVisible=!document.hidden},this.container=e,this.clustersRef=n;const i=window.innerWidth,r=window.innerHeight;this.renderer=new QC({antialias:!0,alpha:!1}),this.renderer.setSize(i,r),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setClearColor(0),this.renderer.sortObjects=!0,e.appendChild(this.renderer.domElement),this.scene=new Pw,this.camera=new Ln(60,i/r,1,5e3),this.camera.position.set(0,80,300),this.controls=new lR(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.05,this.controls.autoRotate=!0,this.controls.autoRotateSpeed=.3,this.controls.minDistance=50,this.controls.maxDistance=800,this.controls.target.set(0,0,0),this.bgLayer=new PR,this.scene.add(this.bgLayer.group),this.composer=new rR(this.renderer);const s=new sR(this.scene,this.camera);this.composer.addPass(s);const o=new wo(new _e(i/2,r/2),1.2,.4,.15);this.composer.addPass(o),this.scene.updateMatrixWorld(!0),window.addEventListener("resize",this.onResize),document.addEventListener("visibilitychange",this.onVisibilityChange),this.setupEventListeners()}setupEventListeners(){const e=f=>{var a;if(!this._docVisible)return;const d=this.sessions.get(f.sessionId);if(d)if(f.agentId&&d.subagents.has(f.agentId)?d.subagents.get(f.agentId).triggerActivity():d.core.triggerActivity(),f.tool==="Glob"){const h=(typeof((a=f.toolResponse)==null?void 0:a.content)=="string"?f.toolResponse.content:"").split(`
`).filter(v=>{const g=v.trim();return g.length>0&&!g.startsWith("Found")&&!g.startsWith("No files")&&!g.startsWith("Error")}).length,m=xy(h);d.particles.spawnRaw(m)}else d.particles.spawn(f.tool,f.colorHex,void 0,f.toolInput,f.toolResponse)},n=f=>{if(!this._docVisible)return;const d=this.sessions.get(f.sessionId);d&&(d.core.triggerActivity(),d.particles.spawn("prompt","#b0c8f0"))},i=f=>{if(!this._docVisible)return;const d=this.sessions.get(f.sessionId);d&&(d.core.triggerActivity(),d.particles.spawn("response","#aad4ff"))},r=f=>{if(!this._docVisible)return;const d=this.sessions.get(f.sessionId);d&&(d.core.triggerActivity(),d.particles.spawn("compact:pre","#FFD060"))},s=f=>{if(!this._docVisible)return;const d=this.sessions.get(f.sessionId);d&&(d.core.triggerActivity(),d.particles.spawn("compact:post","#FFE080"))},o=f=>{if(!this._docVisible)return;const d=this.sessions.get(f.sessionId);d&&d.particles.spawn("Stop")},c=f=>{const d=this.sessions.get(f.sessionId);if(d&&!d.subagents.has(f.agentId)){const a=new F2;d.subagents.set(f.agentId,a),d.group.add(a.group),a.triggerActivity()}},l=f=>{const d=this.sessions.get(f.sessionId);if(!d)return;const a=d.subagents.get(f.agentId);a&&(d.group.remove(a.group),a.dispose(),d.subagents.delete(f.agentId))};ut.on("tool:used",e),ut.on("prompt:submitted",n),ut.on("response:received",i),ut.on("compact:pre",r),ut.on("compact:post",s),ut.on("session:end",o),ut.on("subagent:start",c),ut.on("subagent:stop",l),this.eventUnsubs.push(()=>ut.off("tool:used",e),()=>ut.off("prompt:submitted",n),()=>ut.off("response:received",i),()=>ut.off("compact:pre",r),()=>ut.off("compact:post",s),()=>ut.off("session:end",o),()=>ut.off("subagent:start",c),()=>ut.off("subagent:stop",l))}syncSessions(e){for(const[n,i]of e)if(this.sessions.has(n)){const r=this.sessions.get(n);i.model&&r.core.setModel(i.model)}else{const r=i.model||"unknown",s=new li,o=new LR(r),c=new N2;s.add(o.group),s.add(c.group);const f=this.sessions.size/Math.max(1,e.size)*Math.PI*2,d=e.size>1?150:0;s.position.set(Math.cos(f)*d,k2(-20,20),Math.sin(f)*d),this.scene.add(s),this.sessions.set(n,{group:s,core:o,particles:c,subagents:new Map}),this.loadSessionHistory(n,c)}for(const[n,i]of this.sessions)if(!e.has(n)){this.scene.remove(i.group),i.core.dispose(),i.particles.dispose();for(const r of i.subagents.values())r.dispose();i.subagents.clear(),this.sessions.delete(n)}}loadSessionHistory(e,n){Vh(`/api/history?session=${encodeURIComponent(e)}`).then(i=>{if(i.length===0)return;const r=Math.min(i.length,250),s=i.length/r;for(let o=0;o<r;o++){const c=i[Math.floor(o*s)],l=c.tool_name||c.hook_event_name||"Read",f=jd[l]||$d,d=new te(f),a=(Math.random()-.5)*2*(20+Math.pow(Math.random(),.6)*120)*(.4+Math.random()*2.1),u=(Math.random()-.5)*2*(20+Math.pow(Math.random(),.6)*120)*(.1+Math.random()*.4),h=(Math.random()-.5)*2*(20+Math.pow(Math.random(),.6)*120)*(.4+Math.random()*2.1),m=new R(a,u,h);n.addHistoryStar(m,d)}console.log(`[Three] Session ${e.slice(0,8)}: ${r} history stars from ${i.length} events`)}).catch(()=>{})}setAutofit(e){this._autofit=e}setAutoRotate(e){this._autoRotate=e,this.controls.autoRotate=e}_fitCamera(){if(this.sessions.size===0)return;let e=1/0,n=-1/0,i=1/0,r=-1/0,s=1/0,o=-1/0;for(const v of this.sessions.values()){const g=v.group.position,p=140;e=Math.min(e,g.x-p),n=Math.max(n,g.x+p),i=Math.min(i,g.y-p),r=Math.max(r,g.y+p),s=Math.min(s,g.z-p),o=Math.max(o,g.z+p)}const c=(e+n)/2,l=(i+r)/2,f=(s+o)/2,d=Math.max(n-e,r-i,o-s),a=this.camera.fov*(Math.PI/180),u=Math.max(d/2/Math.tan(a/2)*1.3,80);this.controls.target.lerp(new R(c,l,f),.02);const h=this.camera.position.clone().sub(this.controls.target).normalize(),m=this.controls.target.clone().addScaledVector(h,u);this.camera.position.lerp(m,.02)}tick(e){const n=Math.min(e,.05);this.elapsed+=n,this.syncSessions(this.clustersRef.current),this.bgLayer.tick(n),this._autofit&&this._fitCamera(),this.controls.update();for(const i of this.sessions.values()){i.core.tick(n,this.elapsed),i.particles.tick(n);for(const r of i.subagents.values())r.tick(n,this.elapsed)}try{this.composer.render()}catch{}}destroy(){window.removeEventListener("resize",this.onResize),document.removeEventListener("visibilitychange",this.onVisibilityChange);for(const e of this.eventUnsubs)e();this.eventUnsubs=[];for(const e of this.sessions.values()){e.core.dispose(),e.particles.dispose();for(const n of e.subagents.values())n.dispose()}this.sessions.clear(),this.bgLayer.dispose(),this.controls.dispose(),this.renderer.dispose(),this.container.removeChild(this.renderer.domElement)}}function k2(t,e){return Math.random()*(e-t)+t}function B2({clusters:t,onHover:e,onSelect:n,autofitEnabled:i,autoRotateEnabled:r}){const s=Ie.useRef(null),o=Ie.useRef(null),c=Ie.useRef(t);return c.current=t,Ie.useEffect(()=>{o.current&&o.current.setAutofit(i)},[i]),Ie.useEffect(()=>{o.current&&o.current.setAutoRotate(r)},[r]),Ie.useEffect(()=>{const l=s.current;if(!l)return;let f=null,d=performance.now();const a=new O2(l,c);a.setAutofit(i),a.setAutoRotate(r),o.current=a;const u=()=>{document.hidden||(d=performance.now())};document.addEventListener("visibilitychange",u);const h=()=>{const m=performance.now(),v=(m-d)/1e3;d=m,a.tick(v),f=requestAnimationFrame(h)};return f=requestAnimationFrame(h),()=>{document.removeEventListener("visibilitychange",u),f!==null&&cancelAnimationFrame(f),a.destroy(),o.current=null}},[]),$.jsx("div",{ref:s,style:{position:"relative",width:"100vw",height:"100vh",background:"#000000"}})}const J0=["/src/App.tsx","/src/store.ts","/src/types.ts","/src/canvas/renderer.ts","/src/canvas/graph.ts","/server/index.js","/package.json","/client/vite.config.ts","/src/main.tsx","/src/index.css","/src/DebugPanel.tsx","/tests/store.test.ts","/bin/claude-live.js"],e_=["npm run build","git status","ls -la src/","npx tsc --noEmit","npm test","git diff --stat"];function t_(){return"debug-"+Math.random().toString(36).slice(2,8)}async function Hn(t){await _y("/hook",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)})}function z2({sessionIds:t,isOpen:e,onClose:n,onLoadHistory:i}){const[r,s]=Ie.useState(t_),[o,c]=Ie.useState([]),[l,f]=Ie.useState(!1),[d,a]=Ie.useState(null),[u,h]=Ie.useState(null),m=Ie.useRef(0),v=Ie.useRef(0),g=Ie.useRef(0),p=Ie.useRef([]);function _(){const P="agent-"+Math.random().toString(36).slice(2,7);return p.current.push(P),P}function x(){return p.current.pop()||"none"}function S(){return J0[m.current++%J0.length]}function b(){return e_[v.current++%e_.length]}function M(){return g.current+=1,`${Date.now().toString(36)}${g.current.toString(36)}`}function T(P,U){return`${P}@${U}`}Ie.useEffect(()=>{e&&y()},[e]);async function y(){f(!0),h(null);try{const P=await Vh("/api/history"),U=new Map;if(Array.isArray(P))for(const O of P){const H=O==null?void 0:O.session_id;if(!H)continue;const z=typeof O.timestamp=="number"?O.timestamp:Date.now(),X=U.get(H);(!X||z>X)&&U.set(H,z)}const V=[...U.entries()].map(([O,H])=>({id:O,ts:H})).sort((O,H)=>H.ts-O.ts).slice(0,10);c(V)}catch(P){h((P==null?void 0:P.message)||"Failed to fetch history")}finally{f(!1)}}async function w(P){a(P),h(null);try{const U=await Vh(`/api/history?session=${encodeURIComponent(P)}`);Array.isArray(U)&&(i==null||i(P,U),s(P))}catch(U){h((U==null?void 0:U.message)||"Failed to load session history")}finally{a(null)}}function D(P,U,V={}){return Hn({session_id:r,hook_event_name:"PostToolUse",tool_name:P,tool_input:U,tool_response:V})}const C=[{label:"Read",color:"#4ade80",fn:()=>{const P=M(),U=T(S(),P);D("Read",{file_path:U},{type:"text",file:{filePath:U,content:"Response data from file read operation with individual letters streaming outward"}})}},{label:"Edit",color:"#60a5fa",fn:()=>{const P=M();D("Edit",{file_path:T(S(),P)})}},{label:"Write",color:"#60a5fa",fn:()=>{const P=M();D("Write",{file_path:T(S(),P),content:"Writing content to file with response snake animation showing letters outward"},{})}},{label:"Grep",color:"#a78bfa",fn:()=>{const P=M();D("Grep",{pattern:"useState",path:`/tmp/${P}`},{count:12})}},{label:"Glob",color:"#a78bfa",fn:()=>{const P=M();D("Glob",{pattern:"**/*.tsx",path:`/tmp/${P}`},{files:["a.tsx","b.tsx"]})}},{label:"Bash",color:"#f59e0b",fn:()=>{const P=M();D("Bash",{command:`${b()} #${P}`},{stdout:"bash command output with response letters flowing outward in straight animation paths",stderr:"",interrupted:!1,exitCode:0})}},{label:"WebFetch",color:"#f472b6",fn:()=>{const P=M();D("WebFetch",{url:`https://debug-${P}.local`},{status:200})}},{label:"Notification",color:"#34d399",fn:()=>{const P=M();Hn({session_id:r,hook_event_name:"Notification",tool_input:{message:`Task complete! All files updated. #${P}`}})}},{label:"Permission",color:"#fbbf24",fn:()=>{const P=M();Hn({session_id:r,hook_event_name:"PermissionRequest",tool_input:{message:`Allow bash command execution? #${P}`}})}},{label:"Stop",color:"#888888",fn:()=>Hn({session_id:r,hook_event_name:"Stop"})},{label:"SubStart",color:"#c084fc",fn:()=>Hn({session_id:r,hook_event_name:"SubagentStart",agent_id:_(),agent_type:"general-purpose"})},{label:"SubStop",color:"#7c3aed",fn:()=>Hn({session_id:r,hook_event_name:"SubagentStop",agent_id:x()})},{label:"SessEnd",color:"#ef4444",fn:()=>Hn({session_id:r,hook_event_name:"SessionEnd"})},{label:"Fail",color:"#f87171",fn:()=>Hn({session_id:r,hook_event_name:"PostToolUseFailure",tool_name:"Read",tool_input:{file_path:S()},error:"File not found"})},{label:"Compact↓",color:"#94a3b8",fn:()=>Hn({session_id:r,hook_event_name:"PreCompact",trigger:"manual"})},{label:"Compact↑",color:"#38bdf8",fn:()=>Hn({session_id:r,hook_event_name:"PostCompact"})},{label:"Prompt",color:"#b0c8f0",fn:()=>Hn({session_id:r,hook_event_name:"UserPromptSubmit",prompt:`Fix the login bug on the dashboard page #${M()}`})},{label:"Response",color:"#7eb8f0",fn:()=>Hn({session_id:r,hook_event_name:"Stop",last_assistant_message:"Here is the fix for the login bug. Updated auth middleware to handle token refresh correctly."})}];if(!e)return null;const N=t.includes(r)?t:[...t,r];return $.jsxs("div",{className:"panel-overlay",children:[$.jsxs("div",{className:"debug-panel-header",children:[$.jsx("span",{className:"debug-panel-title",children:"debug"}),$.jsx("button",{className:"debug-close",onClick:n,children:"×"})]}),$.jsxs("div",{className:"debug-section",children:[$.jsx("div",{className:"debug-section-label",children:"session"}),$.jsxs("div",{className:"debug-session-row",children:[$.jsx("select",{className:"debug-select",value:r,onChange:P=>s(P.target.value),children:N.map(P=>$.jsx("option",{value:P,children:P.slice(0,18)},P))}),$.jsx("button",{className:"debug-new-btn",onClick:()=>s(t_()),children:"+ new"})]}),$.jsxs("div",{className:"debug-history-row",style:{marginTop:10},children:[$.jsx("button",{className:"debug-new-btn",onClick:y,disabled:l,children:l?"loading…":"pull history"}),u&&$.jsx("span",{className:"debug-hint",style:{marginLeft:8},children:u})]}),o.length>0&&$.jsx("div",{className:"debug-history-list",style:{marginTop:8},children:o.map(P=>$.jsx("button",{className:"debug-history-btn",onClick:()=>w(P.id),title:P.id,children:d===P.id?"loading…":P.id.slice(0,18)},P.id))})]}),$.jsxs("div",{className:"debug-section",children:[$.jsx("div",{className:"debug-section-label",children:"fire event"}),$.jsx("div",{className:"debug-tool-grid",children:C.map(({label:P,color:U,fn:V})=>$.jsx("button",{className:"debug-tool-btn",style:{"--tool-color":U},onClick:V,children:P},P))})]})]})}const V2=[{badge:"#",name:"Read",description:"file operations",color:"#22c55e"},{badge:"E",name:"Edit / Write",description:"editing tools",color:"#3b82f6"},{badge:"B",name:"Bash",description:"shell commands",color:"#f97316"},{badge:"G",name:"Grep / Glob",description:"search tools",color:"#a855f7"},{badge:"↗",name:"WebFetch",description:"HTTP requests",color:"#ec4899"},{badge:"!",name:"Notification",description:"notifications",color:"#06b6d4"},{badge:"✓",name:"Stop",description:"tool completion",color:"#666666"},{badge:"⬡",name:"Subagent",description:"subagent execution",color:"#a855f7"}],H2=[{name:"Slide-in bounce",description:"New event arrives at top of log"},{name:"Dot pop",description:"Emphasis animation on new entry (scale/rotate)"},{name:"Scan shimmer",description:"Left-to-right scan effect (processing effect)"},{name:"Fade with time",description:"Entry visibility decreases after 5 seconds"}];function G2({isOpen:t,onClose:e}){return t?$.jsxs("div",{className:"panel-overlay operations-panel",children:[$.jsx("button",{className:"panel-close-btn",onClick:e,children:"×"}),$.jsxs("div",{className:"panel-section",children:[$.jsx("h3",{children:"Node Types"}),$.jsx("div",{className:"node-types-grid",children:V2.map(n=>$.jsxs("div",{className:"node-type-item",children:[$.jsx("div",{className:"node-type-badge",style:{background:n.color},children:n.badge}),$.jsxs("div",{className:"node-type-info",children:[$.jsx("div",{className:"node-type-name",children:n.name}),$.jsx("div",{className:"node-type-description",children:n.description})]})]},n.name))})]}),$.jsxs("div",{className:"panel-section",children:[$.jsx("h3",{children:"Animation Styles"}),$.jsx("div",{className:"animations-list",children:H2.map(n=>$.jsxs("div",{className:"animation-item",children:[$.jsx("div",{className:"animation-name",children:n.name}),$.jsx("div",{className:"animation-description",children:n.description})]},n.name))})]})]}):null}var My={};/*!
 *  howler.js v2.2.4
 *  howlerjs.com
 *
 *  (c) 2013-2020, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */(function(t){(function(){var e=function(){this.init()};e.prototype={init:function(){var a=this||n;return a._counter=1e3,a._html5AudioPool=[],a.html5PoolSize=10,a._codecs={},a._howls=[],a._muted=!1,a._volume=1,a._canPlayEvent="canplaythrough",a._navigator=typeof window<"u"&&window.navigator?window.navigator:null,a.masterGain=null,a.noAudio=!1,a.usingWebAudio=!0,a.autoSuspend=!0,a.ctx=null,a.autoUnlock=!0,a._setup(),a},volume:function(a){var u=this||n;if(a=parseFloat(a),u.ctx||d(),typeof a<"u"&&a>=0&&a<=1){if(u._volume=a,u._muted)return u;u.usingWebAudio&&u.masterGain.gain.setValueAtTime(a,n.ctx.currentTime);for(var h=0;h<u._howls.length;h++)if(!u._howls[h]._webAudio)for(var m=u._howls[h]._getSoundIds(),v=0;v<m.length;v++){var g=u._howls[h]._soundById(m[v]);g&&g._node&&(g._node.volume=g._volume*a)}return u}return u._volume},mute:function(a){var u=this||n;u.ctx||d(),u._muted=a,u.usingWebAudio&&u.masterGain.gain.setValueAtTime(a?0:u._volume,n.ctx.currentTime);for(var h=0;h<u._howls.length;h++)if(!u._howls[h]._webAudio)for(var m=u._howls[h]._getSoundIds(),v=0;v<m.length;v++){var g=u._howls[h]._soundById(m[v]);g&&g._node&&(g._node.muted=a?!0:g._muted)}return u},stop:function(){for(var a=this||n,u=0;u<a._howls.length;u++)a._howls[u].stop();return a},unload:function(){for(var a=this||n,u=a._howls.length-1;u>=0;u--)a._howls[u].unload();return a.usingWebAudio&&a.ctx&&typeof a.ctx.close<"u"&&(a.ctx.close(),a.ctx=null,d()),a},codecs:function(a){return(this||n)._codecs[a.replace(/^x-/,"")]},_setup:function(){var a=this||n;if(a.state=a.ctx&&a.ctx.state||"suspended",a._autoSuspend(),!a.usingWebAudio)if(typeof Audio<"u")try{var u=new Audio;typeof u.oncanplaythrough>"u"&&(a._canPlayEvent="canplay")}catch{a.noAudio=!0}else a.noAudio=!0;try{var u=new Audio;u.muted&&(a.noAudio=!0)}catch{}return a.noAudio||a._setupCodecs(),a},_setupCodecs:function(){var a=this||n,u=null;try{u=typeof Audio<"u"?new Audio:null}catch{return a}if(!u||typeof u.canPlayType!="function")return a;var h=u.canPlayType("audio/mpeg;").replace(/^no$/,""),m=a._navigator?a._navigator.userAgent:"",v=m.match(/OPR\/(\d+)/g),g=v&&parseInt(v[0].split("/")[1],10)<33,p=m.indexOf("Safari")!==-1&&m.indexOf("Chrome")===-1,_=m.match(/Version\/(.*?) /),x=p&&_&&parseInt(_[1],10)<15;return a._codecs={mp3:!!(!g&&(h||u.canPlayType("audio/mp3;").replace(/^no$/,""))),mpeg:!!h,opus:!!u.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/,""),ogg:!!u.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),oga:!!u.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),wav:!!(u.canPlayType('audio/wav; codecs="1"')||u.canPlayType("audio/wav")).replace(/^no$/,""),aac:!!u.canPlayType("audio/aac;").replace(/^no$/,""),caf:!!u.canPlayType("audio/x-caf;").replace(/^no$/,""),m4a:!!(u.canPlayType("audio/x-m4a;")||u.canPlayType("audio/m4a;")||u.canPlayType("audio/aac;")).replace(/^no$/,""),m4b:!!(u.canPlayType("audio/x-m4b;")||u.canPlayType("audio/m4b;")||u.canPlayType("audio/aac;")).replace(/^no$/,""),mp4:!!(u.canPlayType("audio/x-mp4;")||u.canPlayType("audio/mp4;")||u.canPlayType("audio/aac;")).replace(/^no$/,""),weba:!!(!x&&u.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/,"")),webm:!!(!x&&u.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/,"")),dolby:!!u.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/,""),flac:!!(u.canPlayType("audio/x-flac;")||u.canPlayType("audio/flac;")).replace(/^no$/,"")},a},_unlockAudio:function(){var a=this||n;if(!(a._audioUnlocked||!a.ctx)){a._audioUnlocked=!1,a.autoUnlock=!1,!a._mobileUnloaded&&a.ctx.sampleRate!==44100&&(a._mobileUnloaded=!0,a.unload()),a._scratchBuffer=a.ctx.createBuffer(1,1,22050);var u=function(h){for(;a._html5AudioPool.length<a.html5PoolSize;)try{var m=new Audio;m._unlocked=!0,a._releaseHtml5Audio(m)}catch{a.noAudio=!0;break}for(var v=0;v<a._howls.length;v++)if(!a._howls[v]._webAudio)for(var g=a._howls[v]._getSoundIds(),p=0;p<g.length;p++){var _=a._howls[v]._soundById(g[p]);_&&_._node&&!_._node._unlocked&&(_._node._unlocked=!0,_._node.load())}a._autoResume();var x=a.ctx.createBufferSource();x.buffer=a._scratchBuffer,x.connect(a.ctx.destination),typeof x.start>"u"?x.noteOn(0):x.start(0),typeof a.ctx.resume=="function"&&a.ctx.resume(),x.onended=function(){x.disconnect(0),a._audioUnlocked=!0,document.removeEventListener("touchstart",u,!0),document.removeEventListener("touchend",u,!0),document.removeEventListener("click",u,!0),document.removeEventListener("keydown",u,!0);for(var S=0;S<a._howls.length;S++)a._howls[S]._emit("unlock")}};return document.addEventListener("touchstart",u,!0),document.addEventListener("touchend",u,!0),document.addEventListener("click",u,!0),document.addEventListener("keydown",u,!0),a}},_obtainHtml5Audio:function(){var a=this||n;if(a._html5AudioPool.length)return a._html5AudioPool.pop();var u=new Audio().play();return u&&typeof Promise<"u"&&(u instanceof Promise||typeof u.then=="function")&&u.catch(function(){console.warn("HTML5 Audio pool exhausted, returning potentially locked audio object.")}),new Audio},_releaseHtml5Audio:function(a){var u=this||n;return a._unlocked&&u._html5AudioPool.push(a),u},_autoSuspend:function(){var a=this;if(!(!a.autoSuspend||!a.ctx||typeof a.ctx.suspend>"u"||!n.usingWebAudio)){for(var u=0;u<a._howls.length;u++)if(a._howls[u]._webAudio){for(var h=0;h<a._howls[u]._sounds.length;h++)if(!a._howls[u]._sounds[h]._paused)return a}return a._suspendTimer&&clearTimeout(a._suspendTimer),a._suspendTimer=setTimeout(function(){if(a.autoSuspend){a._suspendTimer=null,a.state="suspending";var m=function(){a.state="suspended",a._resumeAfterSuspend&&(delete a._resumeAfterSuspend,a._autoResume())};a.ctx.suspend().then(m,m)}},3e4),a}},_autoResume:function(){var a=this;if(!(!a.ctx||typeof a.ctx.resume>"u"||!n.usingWebAudio))return a.state==="running"&&a.ctx.state!=="interrupted"&&a._suspendTimer?(clearTimeout(a._suspendTimer),a._suspendTimer=null):a.state==="suspended"||a.state==="running"&&a.ctx.state==="interrupted"?(a.ctx.resume().then(function(){a.state="running";for(var u=0;u<a._howls.length;u++)a._howls[u]._emit("resume")}),a._suspendTimer&&(clearTimeout(a._suspendTimer),a._suspendTimer=null)):a.state==="suspending"&&(a._resumeAfterSuspend=!0),a}};var n=new e,i=function(a){var u=this;if(!a.src||a.src.length===0){console.error("An array of source files must be passed with any new Howl.");return}u.init(a)};i.prototype={init:function(a){var u=this;return n.ctx||d(),u._autoplay=a.autoplay||!1,u._format=typeof a.format!="string"?a.format:[a.format],u._html5=a.html5||!1,u._muted=a.mute||!1,u._loop=a.loop||!1,u._pool=a.pool||5,u._preload=typeof a.preload=="boolean"||a.preload==="metadata"?a.preload:!0,u._rate=a.rate||1,u._sprite=a.sprite||{},u._src=typeof a.src!="string"?a.src:[a.src],u._volume=a.volume!==void 0?a.volume:1,u._xhr={method:a.xhr&&a.xhr.method?a.xhr.method:"GET",headers:a.xhr&&a.xhr.headers?a.xhr.headers:null,withCredentials:a.xhr&&a.xhr.withCredentials?a.xhr.withCredentials:!1},u._duration=0,u._state="unloaded",u._sounds=[],u._endTimers={},u._queue=[],u._playLock=!1,u._onend=a.onend?[{fn:a.onend}]:[],u._onfade=a.onfade?[{fn:a.onfade}]:[],u._onload=a.onload?[{fn:a.onload}]:[],u._onloaderror=a.onloaderror?[{fn:a.onloaderror}]:[],u._onplayerror=a.onplayerror?[{fn:a.onplayerror}]:[],u._onpause=a.onpause?[{fn:a.onpause}]:[],u._onplay=a.onplay?[{fn:a.onplay}]:[],u._onstop=a.onstop?[{fn:a.onstop}]:[],u._onmute=a.onmute?[{fn:a.onmute}]:[],u._onvolume=a.onvolume?[{fn:a.onvolume}]:[],u._onrate=a.onrate?[{fn:a.onrate}]:[],u._onseek=a.onseek?[{fn:a.onseek}]:[],u._onunlock=a.onunlock?[{fn:a.onunlock}]:[],u._onresume=[],u._webAudio=n.usingWebAudio&&!u._html5,typeof n.ctx<"u"&&n.ctx&&n.autoUnlock&&n._unlockAudio(),n._howls.push(u),u._autoplay&&u._queue.push({event:"play",action:function(){u.play()}}),u._preload&&u._preload!=="none"&&u.load(),u},load:function(){var a=this,u=null;if(n.noAudio){a._emit("loaderror",null,"No audio support.");return}typeof a._src=="string"&&(a._src=[a._src]);for(var h=0;h<a._src.length;h++){var m,v;if(a._format&&a._format[h])m=a._format[h];else{if(v=a._src[h],typeof v!="string"){a._emit("loaderror",null,"Non-string found in selected audio sources - ignoring.");continue}m=/^data:audio\/([^;,]+);/i.exec(v),m||(m=/\.([^.]+)$/.exec(v.split("?",1)[0])),m&&(m=m[1].toLowerCase())}if(m||console.warn('No file extension was found. Consider using the "format" property or specify an extension.'),m&&n.codecs(m)){u=a._src[h];break}}if(!u){a._emit("loaderror",null,"No codec support for selected audio sources.");return}return a._src=u,a._state="loading",window.location.protocol==="https:"&&u.slice(0,5)==="http:"&&(a._html5=!0,a._webAudio=!1),new r(a),a._webAudio&&o(a),a},play:function(a,u){var h=this,m=null;if(typeof a=="number")m=a,a=null;else{if(typeof a=="string"&&h._state==="loaded"&&!h._sprite[a])return null;if(typeof a>"u"&&(a="__default",!h._playLock)){for(var v=0,g=0;g<h._sounds.length;g++)h._sounds[g]._paused&&!h._sounds[g]._ended&&(v++,m=h._sounds[g]._id);v===1?a=null:m=null}}var p=m?h._soundById(m):h._inactiveSound();if(!p)return null;if(m&&!a&&(a=p._sprite||"__default"),h._state!=="loaded"){p._sprite=a,p._ended=!1;var _=p._id;return h._queue.push({event:"play",action:function(){h.play(_)}}),_}if(m&&!p._paused)return u||h._loadQueue("play"),p._id;h._webAudio&&n._autoResume();var x=Math.max(0,p._seek>0?p._seek:h._sprite[a][0]/1e3),S=Math.max(0,(h._sprite[a][0]+h._sprite[a][1])/1e3-x),b=S*1e3/Math.abs(p._rate),M=h._sprite[a][0]/1e3,T=(h._sprite[a][0]+h._sprite[a][1])/1e3;p._sprite=a,p._ended=!1;var y=function(){p._paused=!1,p._seek=x,p._start=M,p._stop=T,p._loop=!!(p._loop||h._sprite[a][2])};if(x>=T){h._ended(p);return}var w=p._node;if(h._webAudio){var D=function(){h._playLock=!1,y(),h._refreshBuffer(p);var U=p._muted||h._muted?0:p._volume;w.gain.setValueAtTime(U,n.ctx.currentTime),p._playStart=n.ctx.currentTime,typeof w.bufferSource.start>"u"?p._loop?w.bufferSource.noteGrainOn(0,x,86400):w.bufferSource.noteGrainOn(0,x,S):p._loop?w.bufferSource.start(0,x,86400):w.bufferSource.start(0,x,S),b!==1/0&&(h._endTimers[p._id]=setTimeout(h._ended.bind(h,p),b)),u||setTimeout(function(){h._emit("play",p._id),h._loadQueue()},0)};n.state==="running"&&n.ctx.state!=="interrupted"?D():(h._playLock=!0,h.once("resume",D),h._clearTimer(p._id))}else{var C=function(){w.currentTime=x,w.muted=p._muted||h._muted||n._muted||w.muted,w.volume=p._volume*n.volume(),w.playbackRate=p._rate;try{var U=w.play();if(U&&typeof Promise<"u"&&(U instanceof Promise||typeof U.then=="function")?(h._playLock=!0,y(),U.then(function(){h._playLock=!1,w._unlocked=!0,u?h._loadQueue():h._emit("play",p._id)}).catch(function(){h._playLock=!1,h._emit("playerror",p._id,"Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction."),p._ended=!0,p._paused=!0})):u||(h._playLock=!1,y(),h._emit("play",p._id)),w.playbackRate=p._rate,w.paused){h._emit("playerror",p._id,"Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction.");return}a!=="__default"||p._loop?h._endTimers[p._id]=setTimeout(h._ended.bind(h,p),b):(h._endTimers[p._id]=function(){h._ended(p),w.removeEventListener("ended",h._endTimers[p._id],!1)},w.addEventListener("ended",h._endTimers[p._id],!1))}catch(V){h._emit("playerror",p._id,V)}};w.src==="data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA"&&(w.src=h._src,w.load());var N=window&&window.ejecta||!w.readyState&&n._navigator.isCocoonJS;if(w.readyState>=3||N)C();else{h._playLock=!0,h._state="loading";var P=function(){h._state="loaded",C(),w.removeEventListener(n._canPlayEvent,P,!1)};w.addEventListener(n._canPlayEvent,P,!1),h._clearTimer(p._id)}}return p._id},pause:function(a){var u=this;if(u._state!=="loaded"||u._playLock)return u._queue.push({event:"pause",action:function(){u.pause(a)}}),u;for(var h=u._getSoundIds(a),m=0;m<h.length;m++){u._clearTimer(h[m]);var v=u._soundById(h[m]);if(v&&!v._paused&&(v._seek=u.seek(h[m]),v._rateSeek=0,v._paused=!0,u._stopFade(h[m]),v._node))if(u._webAudio){if(!v._node.bufferSource)continue;typeof v._node.bufferSource.stop>"u"?v._node.bufferSource.noteOff(0):v._node.bufferSource.stop(0),u._cleanBuffer(v._node)}else(!isNaN(v._node.duration)||v._node.duration===1/0)&&v._node.pause();arguments[1]||u._emit("pause",v?v._id:null)}return u},stop:function(a,u){var h=this;if(h._state!=="loaded"||h._playLock)return h._queue.push({event:"stop",action:function(){h.stop(a)}}),h;for(var m=h._getSoundIds(a),v=0;v<m.length;v++){h._clearTimer(m[v]);var g=h._soundById(m[v]);g&&(g._seek=g._start||0,g._rateSeek=0,g._paused=!0,g._ended=!0,h._stopFade(m[v]),g._node&&(h._webAudio?g._node.bufferSource&&(typeof g._node.bufferSource.stop>"u"?g._node.bufferSource.noteOff(0):g._node.bufferSource.stop(0),h._cleanBuffer(g._node)):(!isNaN(g._node.duration)||g._node.duration===1/0)&&(g._node.currentTime=g._start||0,g._node.pause(),g._node.duration===1/0&&h._clearSound(g._node))),u||h._emit("stop",g._id))}return h},mute:function(a,u){var h=this;if(h._state!=="loaded"||h._playLock)return h._queue.push({event:"mute",action:function(){h.mute(a,u)}}),h;if(typeof u>"u")if(typeof a=="boolean")h._muted=a;else return h._muted;for(var m=h._getSoundIds(u),v=0;v<m.length;v++){var g=h._soundById(m[v]);g&&(g._muted=a,g._interval&&h._stopFade(g._id),h._webAudio&&g._node?g._node.gain.setValueAtTime(a?0:g._volume,n.ctx.currentTime):g._node&&(g._node.muted=n._muted?!0:a),h._emit("mute",g._id))}return h},volume:function(){var a=this,u=arguments,h,m;if(u.length===0)return a._volume;if(u.length===1||u.length===2&&typeof u[1]>"u"){var v=a._getSoundIds(),g=v.indexOf(u[0]);g>=0?m=parseInt(u[0],10):h=parseFloat(u[0])}else u.length>=2&&(h=parseFloat(u[0]),m=parseInt(u[1],10));var p;if(typeof h<"u"&&h>=0&&h<=1){if(a._state!=="loaded"||a._playLock)return a._queue.push({event:"volume",action:function(){a.volume.apply(a,u)}}),a;typeof m>"u"&&(a._volume=h),m=a._getSoundIds(m);for(var _=0;_<m.length;_++)p=a._soundById(m[_]),p&&(p._volume=h,u[2]||a._stopFade(m[_]),a._webAudio&&p._node&&!p._muted?p._node.gain.setValueAtTime(h,n.ctx.currentTime):p._node&&!p._muted&&(p._node.volume=h*n.volume()),a._emit("volume",p._id))}else return p=m?a._soundById(m):a._sounds[0],p?p._volume:0;return a},fade:function(a,u,h,m){var v=this;if(v._state!=="loaded"||v._playLock)return v._queue.push({event:"fade",action:function(){v.fade(a,u,h,m)}}),v;a=Math.min(Math.max(0,parseFloat(a)),1),u=Math.min(Math.max(0,parseFloat(u)),1),h=parseFloat(h),v.volume(a,m);for(var g=v._getSoundIds(m),p=0;p<g.length;p++){var _=v._soundById(g[p]);if(_){if(m||v._stopFade(g[p]),v._webAudio&&!_._muted){var x=n.ctx.currentTime,S=x+h/1e3;_._volume=a,_._node.gain.setValueAtTime(a,x),_._node.gain.linearRampToValueAtTime(u,S)}v._startFadeInterval(_,a,u,h,g[p],typeof m>"u")}}return v},_startFadeInterval:function(a,u,h,m,v,g){var p=this,_=u,x=h-u,S=Math.abs(x/.01),b=Math.max(4,S>0?m/S:m),M=Date.now();a._fadeTo=h,a._interval=setInterval(function(){var T=(Date.now()-M)/m;M=Date.now(),_+=x*T,_=Math.round(_*100)/100,x<0?_=Math.max(h,_):_=Math.min(h,_),p._webAudio?a._volume=_:p.volume(_,a._id,!0),g&&(p._volume=_),(h<u&&_<=h||h>u&&_>=h)&&(clearInterval(a._interval),a._interval=null,a._fadeTo=null,p.volume(h,a._id),p._emit("fade",a._id))},b)},_stopFade:function(a){var u=this,h=u._soundById(a);return h&&h._interval&&(u._webAudio&&h._node.gain.cancelScheduledValues(n.ctx.currentTime),clearInterval(h._interval),h._interval=null,u.volume(h._fadeTo,a),h._fadeTo=null,u._emit("fade",a)),u},loop:function(){var a=this,u=arguments,h,m,v;if(u.length===0)return a._loop;if(u.length===1)if(typeof u[0]=="boolean")h=u[0],a._loop=h;else return v=a._soundById(parseInt(u[0],10)),v?v._loop:!1;else u.length===2&&(h=u[0],m=parseInt(u[1],10));for(var g=a._getSoundIds(m),p=0;p<g.length;p++)v=a._soundById(g[p]),v&&(v._loop=h,a._webAudio&&v._node&&v._node.bufferSource&&(v._node.bufferSource.loop=h,h&&(v._node.bufferSource.loopStart=v._start||0,v._node.bufferSource.loopEnd=v._stop,a.playing(g[p])&&(a.pause(g[p],!0),a.play(g[p],!0)))));return a},rate:function(){var a=this,u=arguments,h,m;if(u.length===0)m=a._sounds[0]._id;else if(u.length===1){var v=a._getSoundIds(),g=v.indexOf(u[0]);g>=0?m=parseInt(u[0],10):h=parseFloat(u[0])}else u.length===2&&(h=parseFloat(u[0]),m=parseInt(u[1],10));var p;if(typeof h=="number"){if(a._state!=="loaded"||a._playLock)return a._queue.push({event:"rate",action:function(){a.rate.apply(a,u)}}),a;typeof m>"u"&&(a._rate=h),m=a._getSoundIds(m);for(var _=0;_<m.length;_++)if(p=a._soundById(m[_]),p){a.playing(m[_])&&(p._rateSeek=a.seek(m[_]),p._playStart=a._webAudio?n.ctx.currentTime:p._playStart),p._rate=h,a._webAudio&&p._node&&p._node.bufferSource?p._node.bufferSource.playbackRate.setValueAtTime(h,n.ctx.currentTime):p._node&&(p._node.playbackRate=h);var x=a.seek(m[_]),S=(a._sprite[p._sprite][0]+a._sprite[p._sprite][1])/1e3-x,b=S*1e3/Math.abs(p._rate);(a._endTimers[m[_]]||!p._paused)&&(a._clearTimer(m[_]),a._endTimers[m[_]]=setTimeout(a._ended.bind(a,p),b)),a._emit("rate",p._id)}}else return p=a._soundById(m),p?p._rate:a._rate;return a},seek:function(){var a=this,u=arguments,h,m;if(u.length===0)a._sounds.length&&(m=a._sounds[0]._id);else if(u.length===1){var v=a._getSoundIds(),g=v.indexOf(u[0]);g>=0?m=parseInt(u[0],10):a._sounds.length&&(m=a._sounds[0]._id,h=parseFloat(u[0]))}else u.length===2&&(h=parseFloat(u[0]),m=parseInt(u[1],10));if(typeof m>"u")return 0;if(typeof h=="number"&&(a._state!=="loaded"||a._playLock))return a._queue.push({event:"seek",action:function(){a.seek.apply(a,u)}}),a;var p=a._soundById(m);if(p)if(typeof h=="number"&&h>=0){var _=a.playing(m);_&&a.pause(m,!0),p._seek=h,p._ended=!1,a._clearTimer(m),!a._webAudio&&p._node&&!isNaN(p._node.duration)&&(p._node.currentTime=h);var x=function(){_&&a.play(m,!0),a._emit("seek",m)};if(_&&!a._webAudio){var S=function(){a._playLock?setTimeout(S,0):x()};setTimeout(S,0)}else x()}else if(a._webAudio){var b=a.playing(m)?n.ctx.currentTime-p._playStart:0,M=p._rateSeek?p._rateSeek-p._seek:0;return p._seek+(M+b*Math.abs(p._rate))}else return p._node.currentTime;return a},playing:function(a){var u=this;if(typeof a=="number"){var h=u._soundById(a);return h?!h._paused:!1}for(var m=0;m<u._sounds.length;m++)if(!u._sounds[m]._paused)return!0;return!1},duration:function(a){var u=this,h=u._duration,m=u._soundById(a);return m&&(h=u._sprite[m._sprite][1]/1e3),h},state:function(){return this._state},unload:function(){for(var a=this,u=a._sounds,h=0;h<u.length;h++)u[h]._paused||a.stop(u[h]._id),a._webAudio||(a._clearSound(u[h]._node),u[h]._node.removeEventListener("error",u[h]._errorFn,!1),u[h]._node.removeEventListener(n._canPlayEvent,u[h]._loadFn,!1),u[h]._node.removeEventListener("ended",u[h]._endFn,!1),n._releaseHtml5Audio(u[h]._node)),delete u[h]._node,a._clearTimer(u[h]._id);var m=n._howls.indexOf(a);m>=0&&n._howls.splice(m,1);var v=!0;for(h=0;h<n._howls.length;h++)if(n._howls[h]._src===a._src||a._src.indexOf(n._howls[h]._src)>=0){v=!1;break}return s&&v&&delete s[a._src],n.noAudio=!1,a._state="unloaded",a._sounds=[],a=null,null},on:function(a,u,h,m){var v=this,g=v["_on"+a];return typeof u=="function"&&g.push(m?{id:h,fn:u,once:m}:{id:h,fn:u}),v},off:function(a,u,h){var m=this,v=m["_on"+a],g=0;if(typeof u=="number"&&(h=u,u=null),u||h)for(g=0;g<v.length;g++){var p=h===v[g].id;if(u===v[g].fn&&p||!u&&p){v.splice(g,1);break}}else if(a)m["_on"+a]=[];else{var _=Object.keys(m);for(g=0;g<_.length;g++)_[g].indexOf("_on")===0&&Array.isArray(m[_[g]])&&(m[_[g]]=[])}return m},once:function(a,u,h){var m=this;return m.on(a,u,h,1),m},_emit:function(a,u,h){for(var m=this,v=m["_on"+a],g=v.length-1;g>=0;g--)(!v[g].id||v[g].id===u||a==="load")&&(setTimeout((function(p){p.call(this,u,h)}).bind(m,v[g].fn),0),v[g].once&&m.off(a,v[g].fn,v[g].id));return m._loadQueue(a),m},_loadQueue:function(a){var u=this;if(u._queue.length>0){var h=u._queue[0];h.event===a&&(u._queue.shift(),u._loadQueue()),a||h.action()}return u},_ended:function(a){var u=this,h=a._sprite;if(!u._webAudio&&a._node&&!a._node.paused&&!a._node.ended&&a._node.currentTime<a._stop)return setTimeout(u._ended.bind(u,a),100),u;var m=!!(a._loop||u._sprite[h][2]);if(u._emit("end",a._id),!u._webAudio&&m&&u.stop(a._id,!0).play(a._id),u._webAudio&&m){u._emit("play",a._id),a._seek=a._start||0,a._rateSeek=0,a._playStart=n.ctx.currentTime;var v=(a._stop-a._start)*1e3/Math.abs(a._rate);u._endTimers[a._id]=setTimeout(u._ended.bind(u,a),v)}return u._webAudio&&!m&&(a._paused=!0,a._ended=!0,a._seek=a._start||0,a._rateSeek=0,u._clearTimer(a._id),u._cleanBuffer(a._node),n._autoSuspend()),!u._webAudio&&!m&&u.stop(a._id,!0),u},_clearTimer:function(a){var u=this;if(u._endTimers[a]){if(typeof u._endTimers[a]!="function")clearTimeout(u._endTimers[a]);else{var h=u._soundById(a);h&&h._node&&h._node.removeEventListener("ended",u._endTimers[a],!1)}delete u._endTimers[a]}return u},_soundById:function(a){for(var u=this,h=0;h<u._sounds.length;h++)if(a===u._sounds[h]._id)return u._sounds[h];return null},_inactiveSound:function(){var a=this;a._drain();for(var u=0;u<a._sounds.length;u++)if(a._sounds[u]._ended)return a._sounds[u].reset();return new r(a)},_drain:function(){var a=this,u=a._pool,h=0,m=0;if(!(a._sounds.length<u)){for(m=0;m<a._sounds.length;m++)a._sounds[m]._ended&&h++;for(m=a._sounds.length-1;m>=0;m--){if(h<=u)return;a._sounds[m]._ended&&(a._webAudio&&a._sounds[m]._node&&a._sounds[m]._node.disconnect(0),a._sounds.splice(m,1),h--)}}},_getSoundIds:function(a){var u=this;if(typeof a>"u"){for(var h=[],m=0;m<u._sounds.length;m++)h.push(u._sounds[m]._id);return h}else return[a]},_refreshBuffer:function(a){var u=this;return a._node.bufferSource=n.ctx.createBufferSource(),a._node.bufferSource.buffer=s[u._src],a._panner?a._node.bufferSource.connect(a._panner):a._node.bufferSource.connect(a._node),a._node.bufferSource.loop=a._loop,a._loop&&(a._node.bufferSource.loopStart=a._start||0,a._node.bufferSource.loopEnd=a._stop||0),a._node.bufferSource.playbackRate.setValueAtTime(a._rate,n.ctx.currentTime),u},_cleanBuffer:function(a){var u=this,h=n._navigator&&n._navigator.vendor.indexOf("Apple")>=0;if(!a.bufferSource)return u;if(n._scratchBuffer&&a.bufferSource&&(a.bufferSource.onended=null,a.bufferSource.disconnect(0),h))try{a.bufferSource.buffer=n._scratchBuffer}catch{}return a.bufferSource=null,u},_clearSound:function(a){var u=/MSIE |Trident\//.test(n._navigator&&n._navigator.userAgent);u||(a.src="data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA")}};var r=function(a){this._parent=a,this.init()};r.prototype={init:function(){var a=this,u=a._parent;return a._muted=u._muted,a._loop=u._loop,a._volume=u._volume,a._rate=u._rate,a._seek=0,a._paused=!0,a._ended=!0,a._sprite="__default",a._id=++n._counter,u._sounds.push(a),a.create(),a},create:function(){var a=this,u=a._parent,h=n._muted||a._muted||a._parent._muted?0:a._volume;return u._webAudio?(a._node=typeof n.ctx.createGain>"u"?n.ctx.createGainNode():n.ctx.createGain(),a._node.gain.setValueAtTime(h,n.ctx.currentTime),a._node.paused=!0,a._node.connect(n.masterGain)):n.noAudio||(a._node=n._obtainHtml5Audio(),a._errorFn=a._errorListener.bind(a),a._node.addEventListener("error",a._errorFn,!1),a._loadFn=a._loadListener.bind(a),a._node.addEventListener(n._canPlayEvent,a._loadFn,!1),a._endFn=a._endListener.bind(a),a._node.addEventListener("ended",a._endFn,!1),a._node.src=u._src,a._node.preload=u._preload===!0?"auto":u._preload,a._node.volume=h*n.volume(),a._node.load()),a},reset:function(){var a=this,u=a._parent;return a._muted=u._muted,a._loop=u._loop,a._volume=u._volume,a._rate=u._rate,a._seek=0,a._rateSeek=0,a._paused=!0,a._ended=!0,a._sprite="__default",a._id=++n._counter,a},_errorListener:function(){var a=this;a._parent._emit("loaderror",a._id,a._node.error?a._node.error.code:0),a._node.removeEventListener("error",a._errorFn,!1)},_loadListener:function(){var a=this,u=a._parent;u._duration=Math.ceil(a._node.duration*10)/10,Object.keys(u._sprite).length===0&&(u._sprite={__default:[0,u._duration*1e3]}),u._state!=="loaded"&&(u._state="loaded",u._emit("load"),u._loadQueue()),a._node.removeEventListener(n._canPlayEvent,a._loadFn,!1)},_endListener:function(){var a=this,u=a._parent;u._duration===1/0&&(u._duration=Math.ceil(a._node.duration*10)/10,u._sprite.__default[1]===1/0&&(u._sprite.__default[1]=u._duration*1e3),u._ended(a)),a._node.removeEventListener("ended",a._endFn,!1)}};var s={},o=function(a){var u=a._src;if(s[u]){a._duration=s[u].duration,f(a);return}if(/^data:[^;]+;base64,/.test(u)){for(var h=atob(u.split(",")[1]),m=new Uint8Array(h.length),v=0;v<h.length;++v)m[v]=h.charCodeAt(v);l(m.buffer,a)}else{var g=new XMLHttpRequest;g.open(a._xhr.method,u,!0),g.withCredentials=a._xhr.withCredentials,g.responseType="arraybuffer",a._xhr.headers&&Object.keys(a._xhr.headers).forEach(function(p){g.setRequestHeader(p,a._xhr.headers[p])}),g.onload=function(){var p=(g.status+"")[0];if(p!=="0"&&p!=="2"&&p!=="3"){a._emit("loaderror",null,"Failed loading audio file with status: "+g.status+".");return}l(g.response,a)},g.onerror=function(){a._webAudio&&(a._html5=!0,a._webAudio=!1,a._sounds=[],delete s[u],a.load())},c(g)}},c=function(a){try{a.send()}catch{a.onerror()}},l=function(a,u){var h=function(){u._emit("loaderror",null,"Decoding audio data failed.")},m=function(v){v&&u._sounds.length>0?(s[u._src]=v,f(u,v)):h()};typeof Promise<"u"&&n.ctx.decodeAudioData.length===1?n.ctx.decodeAudioData(a).then(m).catch(h):n.ctx.decodeAudioData(a,m,h)},f=function(a,u){u&&!a._duration&&(a._duration=u.duration),Object.keys(a._sprite).length===0&&(a._sprite={__default:[0,a._duration*1e3]}),a._state!=="loaded"&&(a._state="loaded",a._emit("load"),a._loadQueue())},d=function(){if(n.usingWebAudio){try{typeof AudioContext<"u"?n.ctx=new AudioContext:typeof webkitAudioContext<"u"?n.ctx=new webkitAudioContext:n.usingWebAudio=!1}catch{n.usingWebAudio=!1}n.ctx||(n.usingWebAudio=!1);var a=/iP(hone|od|ad)/.test(n._navigator&&n._navigator.platform),u=n._navigator&&n._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/),h=u?parseInt(u[1],10):null;if(a&&h&&h<9){var m=/safari/.test(n._navigator&&n._navigator.userAgent.toLowerCase());n._navigator&&!m&&(n.usingWebAudio=!1)}n.usingWebAudio&&(n.masterGain=typeof n.ctx.createGain>"u"?n.ctx.createGainNode():n.ctx.createGain(),n.masterGain.gain.setValueAtTime(n._muted?0:n._volume,n.ctx.currentTime),n.masterGain.connect(n.ctx.destination)),n._setup()}};t.Howler=n,t.Howl=i,typeof Co<"u"?(Co.HowlerGlobal=e,Co.Howler=n,Co.Howl=i,Co.Sound=r):typeof window<"u"&&(window.HowlerGlobal=e,window.Howler=n,window.Howl=i,window.Sound=r)})();/*!
 *  Spatial Plugin - Adds support for stereo and 3D audio where Web Audio is supported.
 *  
 *  howler.js v2.2.4
 *  howlerjs.com
 *
 *  (c) 2013-2020, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */(function(){HowlerGlobal.prototype._pos=[0,0,0],HowlerGlobal.prototype._orientation=[0,0,-1,0,1,0],HowlerGlobal.prototype.stereo=function(n){var i=this;if(!i.ctx||!i.ctx.listener)return i;for(var r=i._howls.length-1;r>=0;r--)i._howls[r].stereo(n);return i},HowlerGlobal.prototype.pos=function(n,i,r){var s=this;if(!s.ctx||!s.ctx.listener)return s;if(i=typeof i!="number"?s._pos[1]:i,r=typeof r!="number"?s._pos[2]:r,typeof n=="number")s._pos=[n,i,r],typeof s.ctx.listener.positionX<"u"?(s.ctx.listener.positionX.setTargetAtTime(s._pos[0],Howler.ctx.currentTime,.1),s.ctx.listener.positionY.setTargetAtTime(s._pos[1],Howler.ctx.currentTime,.1),s.ctx.listener.positionZ.setTargetAtTime(s._pos[2],Howler.ctx.currentTime,.1)):s.ctx.listener.setPosition(s._pos[0],s._pos[1],s._pos[2]);else return s._pos;return s},HowlerGlobal.prototype.orientation=function(n,i,r,s,o,c){var l=this;if(!l.ctx||!l.ctx.listener)return l;var f=l._orientation;if(i=typeof i!="number"?f[1]:i,r=typeof r!="number"?f[2]:r,s=typeof s!="number"?f[3]:s,o=typeof o!="number"?f[4]:o,c=typeof c!="number"?f[5]:c,typeof n=="number")l._orientation=[n,i,r,s,o,c],typeof l.ctx.listener.forwardX<"u"?(l.ctx.listener.forwardX.setTargetAtTime(n,Howler.ctx.currentTime,.1),l.ctx.listener.forwardY.setTargetAtTime(i,Howler.ctx.currentTime,.1),l.ctx.listener.forwardZ.setTargetAtTime(r,Howler.ctx.currentTime,.1),l.ctx.listener.upX.setTargetAtTime(s,Howler.ctx.currentTime,.1),l.ctx.listener.upY.setTargetAtTime(o,Howler.ctx.currentTime,.1),l.ctx.listener.upZ.setTargetAtTime(c,Howler.ctx.currentTime,.1)):l.ctx.listener.setOrientation(n,i,r,s,o,c);else return f;return l},Howl.prototype.init=function(n){return function(i){var r=this;return r._orientation=i.orientation||[1,0,0],r._stereo=i.stereo||null,r._pos=i.pos||null,r._pannerAttr={coneInnerAngle:typeof i.coneInnerAngle<"u"?i.coneInnerAngle:360,coneOuterAngle:typeof i.coneOuterAngle<"u"?i.coneOuterAngle:360,coneOuterGain:typeof i.coneOuterGain<"u"?i.coneOuterGain:0,distanceModel:typeof i.distanceModel<"u"?i.distanceModel:"inverse",maxDistance:typeof i.maxDistance<"u"?i.maxDistance:1e4,panningModel:typeof i.panningModel<"u"?i.panningModel:"HRTF",refDistance:typeof i.refDistance<"u"?i.refDistance:1,rolloffFactor:typeof i.rolloffFactor<"u"?i.rolloffFactor:1},r._onstereo=i.onstereo?[{fn:i.onstereo}]:[],r._onpos=i.onpos?[{fn:i.onpos}]:[],r._onorientation=i.onorientation?[{fn:i.onorientation}]:[],n.call(this,i)}}(Howl.prototype.init),Howl.prototype.stereo=function(n,i){var r=this;if(!r._webAudio)return r;if(r._state!=="loaded")return r._queue.push({event:"stereo",action:function(){r.stereo(n,i)}}),r;var s=typeof Howler.ctx.createStereoPanner>"u"?"spatial":"stereo";if(typeof i>"u")if(typeof n=="number")r._stereo=n,r._pos=[n,0,0];else return r._stereo;for(var o=r._getSoundIds(i),c=0;c<o.length;c++){var l=r._soundById(o[c]);if(l)if(typeof n=="number")l._stereo=n,l._pos=[n,0,0],l._node&&(l._pannerAttr.panningModel="equalpower",(!l._panner||!l._panner.pan)&&e(l,s),s==="spatial"?typeof l._panner.positionX<"u"?(l._panner.positionX.setValueAtTime(n,Howler.ctx.currentTime),l._panner.positionY.setValueAtTime(0,Howler.ctx.currentTime),l._panner.positionZ.setValueAtTime(0,Howler.ctx.currentTime)):l._panner.setPosition(n,0,0):l._panner.pan.setValueAtTime(n,Howler.ctx.currentTime)),r._emit("stereo",l._id);else return l._stereo}return r},Howl.prototype.pos=function(n,i,r,s){var o=this;if(!o._webAudio)return o;if(o._state!=="loaded")return o._queue.push({event:"pos",action:function(){o.pos(n,i,r,s)}}),o;if(i=typeof i!="number"?0:i,r=typeof r!="number"?-.5:r,typeof s>"u")if(typeof n=="number")o._pos=[n,i,r];else return o._pos;for(var c=o._getSoundIds(s),l=0;l<c.length;l++){var f=o._soundById(c[l]);if(f)if(typeof n=="number")f._pos=[n,i,r],f._node&&((!f._panner||f._panner.pan)&&e(f,"spatial"),typeof f._panner.positionX<"u"?(f._panner.positionX.setValueAtTime(n,Howler.ctx.currentTime),f._panner.positionY.setValueAtTime(i,Howler.ctx.currentTime),f._panner.positionZ.setValueAtTime(r,Howler.ctx.currentTime)):f._panner.setPosition(n,i,r)),o._emit("pos",f._id);else return f._pos}return o},Howl.prototype.orientation=function(n,i,r,s){var o=this;if(!o._webAudio)return o;if(o._state!=="loaded")return o._queue.push({event:"orientation",action:function(){o.orientation(n,i,r,s)}}),o;if(i=typeof i!="number"?o._orientation[1]:i,r=typeof r!="number"?o._orientation[2]:r,typeof s>"u")if(typeof n=="number")o._orientation=[n,i,r];else return o._orientation;for(var c=o._getSoundIds(s),l=0;l<c.length;l++){var f=o._soundById(c[l]);if(f)if(typeof n=="number")f._orientation=[n,i,r],f._node&&(f._panner||(f._pos||(f._pos=o._pos||[0,0,-.5]),e(f,"spatial")),typeof f._panner.orientationX<"u"?(f._panner.orientationX.setValueAtTime(n,Howler.ctx.currentTime),f._panner.orientationY.setValueAtTime(i,Howler.ctx.currentTime),f._panner.orientationZ.setValueAtTime(r,Howler.ctx.currentTime)):f._panner.setOrientation(n,i,r)),o._emit("orientation",f._id);else return f._orientation}return o},Howl.prototype.pannerAttr=function(){var n=this,i=arguments,r,s,o;if(!n._webAudio)return n;if(i.length===0)return n._pannerAttr;if(i.length===1)if(typeof i[0]=="object")r=i[0],typeof s>"u"&&(r.pannerAttr||(r.pannerAttr={coneInnerAngle:r.coneInnerAngle,coneOuterAngle:r.coneOuterAngle,coneOuterGain:r.coneOuterGain,distanceModel:r.distanceModel,maxDistance:r.maxDistance,refDistance:r.refDistance,rolloffFactor:r.rolloffFactor,panningModel:r.panningModel}),n._pannerAttr={coneInnerAngle:typeof r.pannerAttr.coneInnerAngle<"u"?r.pannerAttr.coneInnerAngle:n._coneInnerAngle,coneOuterAngle:typeof r.pannerAttr.coneOuterAngle<"u"?r.pannerAttr.coneOuterAngle:n._coneOuterAngle,coneOuterGain:typeof r.pannerAttr.coneOuterGain<"u"?r.pannerAttr.coneOuterGain:n._coneOuterGain,distanceModel:typeof r.pannerAttr.distanceModel<"u"?r.pannerAttr.distanceModel:n._distanceModel,maxDistance:typeof r.pannerAttr.maxDistance<"u"?r.pannerAttr.maxDistance:n._maxDistance,refDistance:typeof r.pannerAttr.refDistance<"u"?r.pannerAttr.refDistance:n._refDistance,rolloffFactor:typeof r.pannerAttr.rolloffFactor<"u"?r.pannerAttr.rolloffFactor:n._rolloffFactor,panningModel:typeof r.pannerAttr.panningModel<"u"?r.pannerAttr.panningModel:n._panningModel});else return o=n._soundById(parseInt(i[0],10)),o?o._pannerAttr:n._pannerAttr;else i.length===2&&(r=i[0],s=parseInt(i[1],10));for(var c=n._getSoundIds(s),l=0;l<c.length;l++)if(o=n._soundById(c[l]),o){var f=o._pannerAttr;f={coneInnerAngle:typeof r.coneInnerAngle<"u"?r.coneInnerAngle:f.coneInnerAngle,coneOuterAngle:typeof r.coneOuterAngle<"u"?r.coneOuterAngle:f.coneOuterAngle,coneOuterGain:typeof r.coneOuterGain<"u"?r.coneOuterGain:f.coneOuterGain,distanceModel:typeof r.distanceModel<"u"?r.distanceModel:f.distanceModel,maxDistance:typeof r.maxDistance<"u"?r.maxDistance:f.maxDistance,refDistance:typeof r.refDistance<"u"?r.refDistance:f.refDistance,rolloffFactor:typeof r.rolloffFactor<"u"?r.rolloffFactor:f.rolloffFactor,panningModel:typeof r.panningModel<"u"?r.panningModel:f.panningModel};var d=o._panner;d||(o._pos||(o._pos=n._pos||[0,0,-.5]),e(o,"spatial"),d=o._panner),d.coneInnerAngle=f.coneInnerAngle,d.coneOuterAngle=f.coneOuterAngle,d.coneOuterGain=f.coneOuterGain,d.distanceModel=f.distanceModel,d.maxDistance=f.maxDistance,d.refDistance=f.refDistance,d.rolloffFactor=f.rolloffFactor,d.panningModel=f.panningModel}return n},Sound.prototype.init=function(n){return function(){var i=this,r=i._parent;i._orientation=r._orientation,i._stereo=r._stereo,i._pos=r._pos,i._pannerAttr=r._pannerAttr,n.call(this),i._stereo?r.stereo(i._stereo):i._pos&&r.pos(i._pos[0],i._pos[1],i._pos[2],i._id)}}(Sound.prototype.init),Sound.prototype.reset=function(n){return function(){var i=this,r=i._parent;return i._orientation=r._orientation,i._stereo=r._stereo,i._pos=r._pos,i._pannerAttr=r._pannerAttr,i._stereo?r.stereo(i._stereo):i._pos?r.pos(i._pos[0],i._pos[1],i._pos[2],i._id):i._panner&&(i._panner.disconnect(0),i._panner=void 0,r._refreshBuffer(i)),n.call(this)}}(Sound.prototype.reset);var e=function(n,i){i=i||"spatial",i==="spatial"?(n._panner=Howler.ctx.createPanner(),n._panner.coneInnerAngle=n._pannerAttr.coneInnerAngle,n._panner.coneOuterAngle=n._pannerAttr.coneOuterAngle,n._panner.coneOuterGain=n._pannerAttr.coneOuterGain,n._panner.distanceModel=n._pannerAttr.distanceModel,n._panner.maxDistance=n._pannerAttr.maxDistance,n._panner.refDistance=n._pannerAttr.refDistance,n._panner.rolloffFactor=n._pannerAttr.rolloffFactor,n._panner.panningModel=n._pannerAttr.panningModel,typeof n._panner.positionX<"u"?(n._panner.positionX.setValueAtTime(n._pos[0],Howler.ctx.currentTime),n._panner.positionY.setValueAtTime(n._pos[1],Howler.ctx.currentTime),n._panner.positionZ.setValueAtTime(n._pos[2],Howler.ctx.currentTime)):n._panner.setPosition(n._pos[0],n._pos[1],n._pos[2]),typeof n._panner.orientationX<"u"?(n._panner.orientationX.setValueAtTime(n._orientation[0],Howler.ctx.currentTime),n._panner.orientationY.setValueAtTime(n._orientation[1],Howler.ctx.currentTime),n._panner.orientationZ.setValueAtTime(n._orientation[2],Howler.ctx.currentTime)):n._panner.setOrientation(n._orientation[0],n._orientation[1],n._orientation[2])):(n._panner=Howler.ctx.createStereoPanner(),n._panner.pan.setValueAtTime(n._stereo,Howler.ctx.currentTime)),n._panner.connect(n._node),n._paused||n._parent.pause(n._id,!0).play(n._id,!0)}})()})(My);const Gh=["/chords/chord_01.ogg","/chords/chord_02.ogg","/chords/chord_03.ogg","/chords/chord_04.ogg","/chords/chord_05.ogg","/chords/chord_06.ogg","/chords/chord_07.ogg","/chords/chord_08.ogg","/chords/chord_09.ogg","/chords/chord_10.ogg","/chords/chord_11.ogg","/chords/chord_12.ogg","/chords/chord_13.ogg","/chords/chord_14.ogg","/chords/chord_15.ogg","/chords/chord_16.ogg"];let Cu=!1,wc=[],n_=!1;const i_=new Map;let wy=document.hidden,Ey=document.hidden?0:Date.now();const W2=500,X2=[];function j2(){if(n_)return;n_=!0;const t=localStorage.getItem("claude-live-audio-enabled");t!==null&&(Cu=t==="true");let e=0;wc=Gh.map(n=>new My.Howl({src:[n],volume:.2,preload:!0,onload:()=>{e++,X2.forEach(i=>i(e,Gh.length))}})),document.addEventListener("visibilitychange",()=>{wy=document.hidden,document.hidden||(Ey=Date.now())})}function $2(t,e){return t==="Read"?0:t==="Edit"||t==="Write"?1:t==="Bash"?2:t==="Grep"||t==="Glob"?3:t==="WebFetch"?4:e==="Notification"||e==="PermissionRequest"?5:e==="SubagentStart"?6:e==="SubagentStop"?7:e==="UserPromptSubmit"?8:e==="SessionStart"?9:e==="SessionEnd"?10:Math.floor(Math.random()*Gh.length)}function r_(t,e){if(!Cu||wc.length===0||wy||Date.now()-Ey<W2)return;const n=t||e||"unknown",i=Date.now();if(i-(i_.get(n)||0)<150)return;i_.set(n,i);const r=$2(t,e),s=wc[r%wc.length];s.state()==="loaded"&&s.play()}function Y2(t){Cu=t,localStorage.setItem("claude-live-audio-enabled",t?"true":"false")}function q2(){return Cu}function K2({enabled:t}){return t?$.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[$.jsx("polygon",{points:"11 5 6 9 2 9 2 15 6 15 11 19 11 5"}),$.jsx("path",{d:"M15.54 8.46a7 7 0 0 1 0 9.9M19.07 4.93a11 11 0 0 1 0 15.66"})]}):$.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[$.jsx("polygon",{points:"11 5 6 9 2 9 2 15 6 15 11 19 11 5"}),$.jsx("line",{x1:"23",y1:"9",x2:"17",y2:"15"}),$.jsx("line",{x1:"17",y1:"9",x2:"23",y2:"15"})]})}function Z2({enabled:t}){const e=t?"#38bdf8":"#666666",n=t?1:.6;return $.jsx("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:$.jsxs("g",{opacity:n,stroke:e,strokeWidth:t?2:1.5,fill:"none",children:[$.jsx("path",{d:"M 3 3 L 3 7 M 3 3 L 7 3"}),$.jsx("path",{d:"M 17 3 L 17 7 M 17 3 L 13 3"}),$.jsx("path",{d:"M 3 17 L 3 13 M 3 17 L 7 17"}),$.jsx("path",{d:"M 17 17 L 17 13 M 17 17 L 13 17"})]})})}const s_=5e3,o_=4e3,Q2=1e3,J2=100;function eP(t){return t.split("/").pop()??t}function tP({entries:t}){const[e,n]=Ie.useState(Date.now()),[i,r]=Ie.useState(!1);Ie.useEffect(()=>{let f,d=Date.now();const a=()=>{const u=Date.now();u-d>=J2&&(n(u),d=u),f=requestAnimationFrame(a)};return f=requestAnimationFrame(a),()=>cancelAnimationFrame(f)},[]);const s=f=>{const d=e-f.createdAt;return d>=s_?0:d<o_?1:1-(d-o_)/Q2},o=Ie.useMemo(()=>t.filter(f=>e-f.createdAt<s_).slice(-6),[t,e]),c=Ie.useMemo(()=>[...t].reverse(),[t]),l=(f,d)=>{const a=d?s(f):.7,u=f.file?eP(f.file):null;return $.jsxs("div",{className:`elog-row ${d?"":"elog-row--static"}`,style:{opacity:a,"--entry-color":f.colorHex},children:[$.jsx("span",{className:"elog-dot",style:{background:f.colorHex,boxShadow:`0 0 6px ${f.colorHex}55`}}),$.jsx("span",{className:"elog-tool",style:{color:f.colorHex},children:f.tool}),u&&$.jsx("span",{className:"elog-file",children:u}),$.jsx("span",{className:"elog-id",children:f.id.slice(-6)})]},`${d?"live":"hist"}-${f.id}`)};return $.jsxs("div",{className:"elog",children:[!i&&o.length>0&&$.jsx("div",{className:"elog-live",children:o.map(f=>l(f,!0))}),$.jsx("button",{className:"elog-hist-btn",onClick:()=>r(!i),children:i?"× close":`▸ history ${t.length>0?`(${t.length})`:""}`}),i&&$.jsxs("div",{className:"elog-hist",children:[$.jsxs("div",{className:"elog-hist-header",children:[$.jsx("span",{className:"elog-hist-title",children:"event history"}),$.jsx("span",{className:"elog-hist-count",children:t.length}),$.jsx("button",{className:"elog-hist-close",onClick:()=>r(!1),children:"×"})]}),$.jsx("div",{className:"elog-hist-scroll",children:c.map(f=>l(f,!1))})]})]})}const nP=["Read","Edit","Write","Bash","Grep","Glob","WebFetch"],nc=["server/index.js","bin/hook.js","bin/cli.js","bin/hook-wrapper.sh","client/src/App.tsx","client/src/store.ts","client/src/types.ts","client/src/canvas-three/ThreeApp.ts","client/src/canvas-three/ThreeScene.tsx","client/src/canvas-three/layers/BackgroundLayer.ts","client/src/events/EventBus.ts","package.json","README.md","CLAUDE.md","client/vite.config.ts"],iP=["npm test","npm run build","npm run dev","git status","npx tsc --noEmit","grep -r TODO client/src/","ls -la node_modules/","cat .gitignore"],rP=["https://nodejs.org/api/http.html","https://api.github.com/repos","https://www.npmjs.com/package/claude-live"],sP=["refactor the auth module to use JWT tokens","add error handling to the SSE endpoint","fix the failing typecheck in App.tsx","implement the event filtering feature","write tests for the hook handler"];let a_=0,l_=0;function oP(){return"xxxxxxxx-xxxx-4xxx".replace(/x/g,()=>Math.floor(Math.random()*16).toString(16))}function Fi(t){return t[Math.floor(Math.random()*t.length)]}function aP(){return oP()}function Wr(t,e,n,i,r){return{id:`demo-${a_++}`,session_id:t,hook_event_name:e,tool_name:n,tool_input:i,tool_response:r??null,timestamp:Date.now(),cwd:"/home/user/claude-live",tool_use_id:`tu-${a_}`}}function lP(t){const e=[];let n=0;function i(){const d=aP();l_++;const a=`demo-session-${l_}`;return e.push({id:d,label:a,active:!0,eventsSent:0}),t({type:"event",data:Wr(d,"SessionStart",null,null)}),d}function r(d){const a=Fi(nP);let u={},h={};switch(a){case"Read":u={file_path:Fi(nc)},h={content:`file contents...
`.repeat(20)};break;case"Edit":u={file_path:Fi(nc),old_string:"old code",new_string:`new code
with changes`};break;case"Write":u={file_path:Fi(nc),content:`// new file
`.repeat(10)};break;case"Bash":u={command:Fi(iP)},h={exitCode:Math.random()>.9?1:0,output:"command output"};break;case"Grep":u={pattern:Fi(["TODO","FIXME","async fn","impl "]),path:"src/"},h={numMatches:Math.floor(Math.random()*20)};break;case"Glob":u={pattern:Fi(["**/*.js","**/*.ts","**/*.tsx"]),path:"."},h={files:nc.slice(0,Math.floor(Math.random()*10))};break;case"WebFetch":u={url:Fi(rP)},h={status:200};break}t({type:"event",data:Wr(d.id,"PreToolUse",a,u)}),setTimeout(()=>{const m=Math.random()>.92;t({type:"event",data:Wr(d.id,m?"PostToolUseFailure":"PostToolUse",a,u,h)}),d.eventsSent++},200+Math.random()*800)}function s(d){const a=Fi(sP);t({type:"event",data:{...Wr(d.id,"UserPromptSubmit",null,null),prompt:a}})}function o(d){t({type:"event",data:{...Wr(d.id,"Stop",null,null),stop_reason:"end_turn"}})}function c(d){t({type:"event",data:Wr(d.id,"PreCompact",null,{trigger:"auto"})}),setTimeout(()=>{t({type:"event",data:Wr(d.id,"PostCompact",null,{summary:"Context compacted"})})},3500)}const l=i();setTimeout(()=>{const d=e.find(a=>a.id===l);d&&s(d)},500);const f=setInterval(()=>{if(n++,n===30&&e.length<2){const d=i();setTimeout(()=>{const a=e.find(u=>u.id===d);a&&s(a)},500)}for(const d of e){if(!d.active)continue;const a=Math.random();a<.6?r(d):a<.7?s(d):a<.75?o(d):a<.76&&d.eventsSent>40&&c(d)}},1200);return()=>clearInterval(f)}function cP(){const t=window.location.hostname;return!!(t.includes("github.io")||t.includes("pages.dev")||new URLSearchParams(window.location.search).has("demo"))}const Bs=g1(),Ec={Read:"#4ade80",Edit:"#60a5fa",Write:"#60a5fa",Bash:"#f59e0b",Grep:"#a78bfa",Glob:"#a78bfa",WebFetch:"#f472b6",Stop:"#888888",Notification:"#34d399",SubagentStart:"#c084fc",SubagentStop:"#7c3aed",PostToolUseFailure:"#f87171",SessionEnd:"#ef4444",UserPromptSubmit:"#38bdf8",PreCompact:"#94a3b8",PostCompact:"#94a3b8",SessionStart:"#22d3ee",InstructionsLoaded:"#a3a3a3",WorktreeCreate:"#86efac",WorktreeRemove:"#fca5a5"};function Wh(t){var i;const e=t.tool_input,n=t.tool_name;if(n==="Edit"){const r=(e==null?void 0:e.file_path)||"",s=((e==null?void 0:e.new_string)||"").split(`
`).length,o=((e==null?void 0:e.old_string)||"").split(`
`).length,c=r.split("/").pop()||"";return s!==o?`${c} +${s}−${o}`:`${c} ${s}L`}if(n==="Write"){const r=(e==null?void 0:e.file_path)||"",s=((e==null?void 0:e.content)||"").split(`
`).length;return`${r.split("/").pop()||""} ${s}L`}if(n==="Read"){const r=(e==null?void 0:e.file_path)||"",s=e==null?void 0:e.limit,o=e==null?void 0:e.offset,c=r.split("/").pop()||"";return o?`${c} @${o}`:s?`${c} ${s}L`:c}if(["Grep","Glob"].includes(n||""))return(e==null?void 0:e.pattern)||((i=e==null?void 0:e.file_path)==null?void 0:i.split("/").pop())||"";if(n==="Bash")return((e==null?void 0:e.command)||"").slice(0,22);if(n==="WebFetch")try{return new URL((e==null?void 0:e.url)||"").hostname}catch{return""}return t.hook_event_name==="UserPromptSubmit"?(t.prompt||"").slice(0,30):t.hook_event_name==="PreCompact"?t.trigger||"compacting...":t.hook_event_name==="PostCompact"?"context compacted":t.hook_event_name==="SessionStart"?t.model||t.source||"started":t.hook_event_name==="InstructionsLoaded"?t.memory_type||"instructions":""}function c_(t){var r,s;const e=t.tool_name,n=t.tool_input,i=t.tool_response;if(e==="Read"&&i){const c=((n==null?void 0:n.file_path)||"").split("/").pop()||"",l=i.content??i.text??i.output;if(typeof l=="string"){const f=l.split(`
`).length;return`${c} ${f}L`}return c}if(e==="Grep"&&i){const o=i.count??i.numMatches??i.total;return o!==void 0?`${(n==null?void 0:n.pattern)||""} ${o} hits`:(n==null?void 0:n.pattern)||""}if(e==="Glob"&&i){const o=Array.isArray(i)?i.length:((r=i.files)==null?void 0:r.length)??i.count;return o!==void 0?`${(n==null?void 0:n.pattern)||""} ${o} files`:(n==null?void 0:n.pattern)||""}if(e==="Bash"&&i){const o=i.exitCode??i.exit_code??i.code;return o!==void 0?`$ ${((s=((n==null?void 0:n.command)||"").split(/\s+/)[0])==null?void 0:s.split("/").pop())||""} ${o===0?"✓":`✗ ${o}`}`:((n==null?void 0:n.command)||"").slice(0,22)}return Wh(t)}const u_=100;function uP(t){return!t||!t.lastTool?"#888":Ec[t.lastTool]??"#888"}function f_(t){if(!t)return"—";const e=Math.floor((Date.now()-t)/1e3);return e<3?"just now":e<60?`${e}s ago`:e<3600?`${Math.floor(e/60)}m ago`:`${Math.floor(e/3600)}h ago`}function d_(t){if(!t)return"";const e=t.split("/").filter(Boolean);return e[e.length-1]??""}function fP(){const[t,e]=Ie.useState(Bs.getSessions()),[n,i]=Ie.useState(null),[r,s]=Ie.useState(0),[o,c]=Ie.useState(null),[l,f]=Ie.useState(null),[d,a]=Ie.useState(null),[u,h]=Ie.useState(0),[m,v]=Ie.useState(0),[g,p]=Ie.useState(new Map),[_,x]=Ie.useState([]),[S,b]=Ie.useState(!1),[M,T]=Ie.useState(!1),[y,w]=Ie.useState("connecting"),[D,C]=Ie.useState(()=>localStorage.getItem("claude-live-audio-enabled")==="true"),[N,P]=Ie.useState(()=>localStorage.getItem("claude-live-autofit-enabled")==="true"),[U,V]=Ie.useState(()=>localStorage.getItem("claude-live-autorotate-enabled")!=="false");Ie.useEffect(()=>{j2(),C(q2())},[]),Ie.useEffect(()=>{localStorage.setItem("claude-live-autofit-enabled",N?"true":"false")},[N]),Ie.useEffect(()=>{localStorage.setItem("claude-live-autorotate-enabled",U?"true":"false")},[U]),Ie.useEffect(()=>{const Q=ie=>{h(ie.clientX),v(ie.clientY)};return window.addEventListener("mousemove",Q),()=>window.removeEventListener("mousemove",Q)},[]),Ie.useEffect(()=>{if(cP()){const Y=lP(re=>{if(re.type==="event"){const ne=re.data;Bs.addEvent(ne),e(new Map(Bs.getSessions())),i(ne.tool_name??ne.hook_event_name??null),s(De=>De+1),r_(ne.tool_name??void 0,ne.hook_event_name??void 0);const ue=["Read","Edit","Write","Grep","Glob","Bash"].includes(ne.tool_name||"");if(!(ne.hook_event_name==="PostToolUse"&&!ue)){const De=Bs.getSessions().get(ne.session_id);let pt=ne.tool_name||ne.hook_event_name||"?";if(pt.startsWith("mcp_")){const Xe=pt.split("__");pt=Xe[Xe.length-1].replace(/_/g," ")}x(Xe=>{const tt={id:ne.id,tool:pt,file:ne.hook_event_name==="PostToolUse"?c_(ne):Wh(ne),sessionLabel:(De==null?void 0:De.label)??ne.session_id.slice(0,8),project:d_(ne.cwd),colorHex:Ec[pt]??"#888",createdAt:Date.now()};return[...Xe,tt].slice(-u_)})}}});return()=>Y()}let Q=null,ie=!1;const Fe=new Map,Ze=5e3;function rt(){ie||(Q=TR("/events"),Q.onopen=()=>{console.log("[claude-live] SSE connected"),w("connected")},Q.onmessage=Y=>{var re;try{const ne=JSON.parse(Y.data);if(ne.type==="event"){const ue=ne.data;if(ue.hook_event_name==="Diagnostic")return;let Re=null;if(ue.tool_use_id?Re=`${ue.session_id}:${ue.hook_event_name}:${ue.tool_use_id}`:ue.hook_event_name==="UserPromptSubmit"&&ue.prompt?Re=`${ue.session_id}:prompt:${ue.prompt.slice(0,80)}`:ue.hook_event_name==="SessionStart"&&(Re=`${ue.session_id}:start`),Re){const Be=Date.now();if(Fe.has(Re))return;if(Fe.set(Re,Be),Fe.size>500)for(const[Ue,ot]of Fe)Be-ot>Ze&&Fe.delete(Ue)}const De=document.hidden;Bs.addEvent(ue,De);const pt=Bs.getSessions();e(new Map(pt)),i(ue.tool_name??ue.hook_event_name??null),s(Be=>Be+1),De||r_(ue.tool_name??void 0,ue.hook_event_name??void 0);const Xe=["Read","Edit","Write","Grep","Glob","Bash"].includes(ue.tool_name||"");if(!(ue.hook_event_name==="PostToolUse"&&!Xe)&&!De){const Be=pt.get(ue.session_id);let Ue=ue.tool_name||ue.hook_event_name||"?";if(Ue.startsWith("mcp_")){const ot=Ue.split("__");Ue=ot[ot.length-1].replace(/_/g," ")}x(ot=>{const I={id:ue.id,tool:Ue,file:ue.hook_event_name==="PostToolUse"?c_(ue):Wh(ue),sessionLabel:(Be==null?void 0:Be.label)??ue.session_id.slice(0,8),project:d_(ue.cwd),colorHex:Ec[Ue]??"#888",createdAt:Date.now()};return[...ot,I].slice(-u_)})}if(ue.hook_event_name==="Notification"||ue.hook_event_name==="PermissionRequest"){const Be=pt.get(ue.session_id),Ue=((re=ue.tool_input)==null?void 0:re.message)??"awaiting input";p(ot=>{const I=new Map(ot);return I.set(ue.session_id,{sessionId:ue.session_id,sessionLabel:(Be==null?void 0:Be.label)??ue.session_id.slice(0,8),message:Ue,timestamp:ue.timestamp}),I})}(ue.tool_name||ue.hook_event_name==="UserPromptSubmit")&&p(Be=>{if(!Be.has(ue.session_id))return Be;const Ue=new Map(Be);return Ue.delete(ue.session_id),Ue})}}catch{}},Q.onerror=()=>{console.warn("[claude-live] SSE error, reconnecting..."),w("disconnected")})}return rt(),()=>{ie=!0,Q==null||Q.close()}},[]);const O=(Q,ie)=>c(Q),H=(Q,ie)=>{f(Q),a(ie)},z=()=>{const Q=!D;C(Q),Y2(Q)},X=()=>{const Q=!N;P(Q),localStorage.setItem("claude-live-autofit-enabled",Q?"true":"false")},J=()=>{const Q=!U;V(Q),localStorage.setItem("claude-live-autorotate-enabled",Q?"true":"false")};return $.jsxs("div",{style:{position:"relative",width:"100%",height:"100%"},children:[$.jsx(B2,{clusters:t,onHover:O,onSelect:H,autofitEnabled:N,autoRotateEnabled:U}),$.jsxs("div",{className:"hud-bar",children:[$.jsx("span",{className:`hud-dot ${y==="connected"?"hud-dot--on":y==="error"?"hud-dot--err":"hud-dot--warn"}`}),$.jsxs("span",{className:"hud-chip",children:[r,$.jsx("span",{className:"hud-chip-label",children:"ev"})]}),$.jsxs("span",{className:"hud-chip",children:[t.size,$.jsx("span",{className:"hud-chip-label",children:"ses"})]}),$.jsx("span",{className:"hud-chip hud-tool",style:{color:Ec[n??""]??"#555"},children:n??"—"}),$.jsx("div",{className:"hud-ctrl-sep"}),$.jsx("button",{className:"hud-ctrl-btn",onClick:z,title:D?"Mute":"Unmute","aria-label":D?"Mute audio":"Unmute audio",children:$.jsx(K2,{enabled:D})}),$.jsx("button",{className:"hud-ctrl-btn",onClick:X,title:N?"Disable autofit":"Enable autofit","aria-label":N?"Disable autofit":"Enable autofit",children:$.jsx(Z2,{enabled:N})}),$.jsx("button",{className:"hud-ctrl-btn",onClick:J,title:U?"Stop rotation":"Start rotation","aria-label":U?"Stop rotation":"Start rotation",style:{opacity:U?1:.4},children:"⟳"}),$.jsx("button",{className:"hud-ctrl-btn",onClick:()=>b(!0),title:"Operations","aria-label":"Operations",children:"?"}),$.jsx("button",{className:"hud-ctrl-btn",onClick:()=>T(!0),title:"Debug","aria-label":"Debug",children:"⚙"})]}),g.size>0&&$.jsxs("div",{className:"perm-notifications",children:[$.jsx("div",{className:"perm-notifications-title",children:"awaiting input"}),[...g.values()].map(Q=>$.jsxs("div",{className:"perm-notification-item",children:[$.jsx("div",{className:"perm-notification-dot"}),$.jsxs("div",{className:"perm-notification-body",children:[$.jsxs("div",{className:"perm-notification-session",children:["session:",Q.sessionLabel]}),$.jsx("div",{className:"perm-notification-msg",children:Q.message.slice(0,60)})]})]},Q.sessionId))]}),$.jsx(tP,{entries:_}),$.jsxs("div",{className:"tooltip",style:{left:u+14,top:m-10,opacity:o?1:0},children:[$.jsx("div",{className:"tooltip-label",children:(o==null?void 0:o.label)??""}),$.jsx("div",{className:"tooltip-type",children:(o==null?void 0:o.nodeType)??""}),$.jsxs("div",{className:"tooltip-meta",children:[(o==null?void 0:o.lastTool)??"—"," · ",f_(o==null?void 0:o.lastTimestamp)]}),$.jsxs("div",{className:"tooltip-count",children:[(o==null?void 0:o.eventCount)??0," events"]}),(o==null?void 0:o.awaitingPermission)&&$.jsxs("div",{className:"perm-badge",children:[$.jsx("div",{className:"perm-dot"}),"waiting for permission"]})]}),$.jsx(z2,{sessionIds:[...t.keys()],isOpen:M,onClose:()=>T(!1)}),$.jsx(G2,{isOpen:S,onClose:()=>b(!1)}),$.jsxs("div",{className:`sidebar ${l?"sidebar--open":""}`,children:[$.jsxs("div",{className:"sidebar-header",children:[$.jsx("div",{className:"sidebar-close",onClick:()=>{f(null),a(null)},children:"×"}),$.jsx("div",{className:"sidebar-title",children:(l==null?void 0:l.label)??""}),$.jsx("div",{className:"sidebar-type",children:(l==null?void 0:l.nodeType)??""}),(l==null?void 0:l.awaitingPermission)&&$.jsxs("div",{className:"perm-badge",style:{marginTop:8},children:[$.jsx("div",{className:"perm-dot"}),"awaiting permission"]})]}),$.jsxs("div",{className:"sidebar-section",children:[$.jsx("div",{className:"sidebar-section-label",children:"Last action"}),$.jsx("div",{className:"sidebar-action",style:{color:uP(l)},children:(l==null?void 0:l.lastTool)??"—"}),$.jsx("div",{className:"sidebar-time",children:f_(l==null?void 0:l.lastTimestamp)})]}),$.jsxs("div",{className:"sidebar-section",children:[$.jsx("div",{className:"sidebar-section-label",children:"Total interactions"}),$.jsx("div",{className:"sidebar-count",children:(l==null?void 0:l.eventCount)??0})]}),$.jsxs("div",{className:"sidebar-section",children:[$.jsx("div",{className:"sidebar-section-label",children:"Session"}),$.jsx("div",{className:"sidebar-session",children:(d==null?void 0:d.label)??"—"})]})]})]})}const dP=Ie.lazy(()=>ru(()=>import("./EffectDemoScene-BXqCMwER.js"),[]).then(t=>({default:t.EffectDemoScene}))),hP=Ie.lazy(()=>ru(()=>import("./AgentDemoScene-CXlvncAb.js"),[]).then(t=>({default:t.AgentDemoScene}))),pP=Ie.lazy(()=>ru(()=>import("./SakuraPage-BfD0y3D9.js"),[]).then(t=>({default:t.SakuraPage}))),mP=Ie.lazy(()=>ru(()=>import("./ColonizationDemoScene-Cils_y13.js"),[]).then(t=>({default:t.ColonizationDemoScene})));function h_(){return window.location.hash.replace(/^#\/?/,"")||""}function gP(){const[t,e]=Ie.useState(h_);return Ie.useEffect(()=>{const n=()=>e(h_());return window.addEventListener("hashchange",n),()=>window.removeEventListener("hashchange",n)},[]),t==="effect-demo"?$.jsx(Ie.Suspense,{fallback:$.jsx("div",{style:{background:"#030308",width:"100vw",height:"100vh"}}),children:$.jsx(dP,{})}):t==="colonization-demo"?$.jsx(Ie.Suspense,{fallback:$.jsx("div",{style:{background:"#04050b",width:"100vw",height:"100vh"}}),children:$.jsx(mP,{})}):t==="demo"?$.jsx(Ie.Suspense,{fallback:$.jsx("div",{style:{background:"#030308",width:"100vw",height:"100vh"}}),children:$.jsx(hP,{})}):t==="sakura"?$.jsx(Ie.Suspense,{fallback:$.jsx("div",{style:{background:"#0e0a08",width:"100vw",height:"100vh"}}),children:$.jsx(pP,{})}):$.jsx(fP,{})}bx(document.getElementById("root")).render($.jsx(Ie.StrictMode,{children:$.jsx(gP,{})}));export{Ot as $,st as A,PR as B,bP as C,ri as D,rR as E,py as F,li as G,Fn as H,Oa as I,Ir as J,ih as K,pn as L,So as M,Kt as N,lR as O,Ln as P,yP as Q,sR as R,Pw as S,I2 as T,wo as U,_e as V,QC as W,q1 as X,vP as Y,ht as Z,em as _,R as a,Xa as a0,SP as a1,Jg as a2,Ga as a3,ls as a4,Mu as a5,Gn as a6,x1 as a7,jx as a8,TP as a9,wP as aa,EP as ab,Qw as ac,En as ad,Jx as ae,Vh as af,TR as ag,_y as ah,bR as ai,Lx as aj,MP as ak,ry as al,ey as am,CP as an,AP as ao,iy as b,te as c,mn as d,ny as e,L2 as f,Ve as g,Qt as h,He as i,Mc as j,Tt as k,$ as l,ja as m,Tn as n,qw as o,_P as p,Ei as q,Ie as r,bi as s,iu as t,nR as u,gw as v,di as w,Rr as x,xP as y,oo as z};
