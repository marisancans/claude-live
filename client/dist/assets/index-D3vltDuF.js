(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();const Sy="modulepreload",My=function(n){return"/"+n},hm={},Wh=function(e,t,i){let r=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),c=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));r=Promise.allSettled(t.map(l=>{if(l=My(l),l in hm)return;hm[l]=!0;const u=l.endsWith(".css"),d=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${d}`))return;const a=document.createElement("link");if(a.rel=u?"stylesheet":Sy,u||(a.as="script"),a.crossOrigin="",a.href=l,c&&a.setAttribute("nonce",c),document.head.appendChild(a),u)return new Promise((f,h)=>{a.addEventListener("load",f),a.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${l}`)))})}))}function s(o){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=o,window.dispatchEvent(c),!c.defaultPrevented)throw o}return r.then(o=>{for(const c of o||[])c.status==="rejected"&&s(c.reason);return e().catch(s)})};var Po=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},o0={exports:{}},ru={},a0={exports:{}},Ke={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ba=Symbol.for("react.element"),wy=Symbol.for("react.portal"),Ey=Symbol.for("react.fragment"),Ty=Symbol.for("react.strict_mode"),Ay=Symbol.for("react.profiler"),by=Symbol.for("react.provider"),Cy=Symbol.for("react.context"),Ry=Symbol.for("react.forward_ref"),Py=Symbol.for("react.suspense"),Ly=Symbol.for("react.memo"),Dy=Symbol.for("react.lazy"),pm=Symbol.iterator;function Iy(n){return n===null||typeof n!="object"?null:(n=pm&&n[pm]||n["@@iterator"],typeof n=="function"?n:null)}var l0={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},c0=Object.assign,u0={};function Ao(n,e,t){this.props=n,this.context=e,this.refs=u0,this.updater=t||l0}Ao.prototype.isReactComponent={};Ao.prototype.setState=function(n,e){if(typeof n!="object"&&typeof n!="function"&&n!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,n,e,"setState")};Ao.prototype.forceUpdate=function(n){this.updater.enqueueForceUpdate(this,n,"forceUpdate")};function f0(){}f0.prototype=Ao.prototype;function Xh(n,e,t){this.props=n,this.context=e,this.refs=u0,this.updater=t||l0}var jh=Xh.prototype=new f0;jh.constructor=Xh;c0(jh,Ao.prototype);jh.isPureReactComponent=!0;var mm=Array.isArray,d0=Object.prototype.hasOwnProperty,$h={current:null},h0={key:!0,ref:!0,__self:!0,__source:!0};function p0(n,e,t){var i,r={},s=null,o=null;if(e!=null)for(i in e.ref!==void 0&&(o=e.ref),e.key!==void 0&&(s=""+e.key),e)d0.call(e,i)&&!h0.hasOwnProperty(i)&&(r[i]=e[i]);var c=arguments.length-2;if(c===1)r.children=t;else if(1<c){for(var l=Array(c),u=0;u<c;u++)l[u]=arguments[u+2];r.children=l}if(n&&n.defaultProps)for(i in c=n.defaultProps,c)r[i]===void 0&&(r[i]=c[i]);return{$$typeof:Ba,type:n,key:s,ref:o,props:r,_owner:$h.current}}function Ny(n,e){return{$$typeof:Ba,type:n.type,key:e,ref:n.ref,props:n.props,_owner:n._owner}}function Yh(n){return typeof n=="object"&&n!==null&&n.$$typeof===Ba}function Uy(n){var e={"=":"=0",":":"=2"};return"$"+n.replace(/[=:]/g,function(t){return e[t]})}var gm=/\/+/g;function Pu(n,e){return typeof n=="object"&&n!==null&&n.key!=null?Uy(""+n.key):e.toString(36)}function rc(n,e,t,i,r){var s=typeof n;(s==="undefined"||s==="boolean")&&(n=null);var o=!1;if(n===null)o=!0;else switch(s){case"string":case"number":o=!0;break;case"object":switch(n.$$typeof){case Ba:case wy:o=!0}}if(o)return o=n,r=r(o),n=i===""?"."+Pu(o,0):i,mm(r)?(t="",n!=null&&(t=n.replace(gm,"$&/")+"/"),rc(r,e,t,"",function(u){return u})):r!=null&&(Yh(r)&&(r=Ny(r,t+(!r.key||o&&o.key===r.key?"":(""+r.key).replace(gm,"$&/")+"/")+n)),e.push(r)),1;if(o=0,i=i===""?".":i+":",mm(n))for(var c=0;c<n.length;c++){s=n[c];var l=i+Pu(s,c);o+=rc(s,e,t,l,r)}else if(l=Iy(n),typeof l=="function")for(n=l.call(n),c=0;!(s=n.next()).done;)s=s.value,l=i+Pu(s,c++),o+=rc(s,e,t,l,r);else if(s==="object")throw e=String(n),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return o}function Ka(n,e,t){if(n==null)return n;var i=[],r=0;return rc(n,i,"","",function(s){return e.call(t,s,r++)}),i}function Fy(n){if(n._status===-1){var e=n._result;e=e(),e.then(function(t){(n._status===0||n._status===-1)&&(n._status=1,n._result=t)},function(t){(n._status===0||n._status===-1)&&(n._status=2,n._result=t)}),n._status===-1&&(n._status=0,n._result=e)}if(n._status===1)return n._result.default;throw n._result}var gn={current:null},sc={transition:null},Oy={ReactCurrentDispatcher:gn,ReactCurrentBatchConfig:sc,ReactCurrentOwner:$h};function m0(){throw Error("act(...) is not supported in production builds of React.")}Ke.Children={map:Ka,forEach:function(n,e,t){Ka(n,function(){e.apply(this,arguments)},t)},count:function(n){var e=0;return Ka(n,function(){e++}),e},toArray:function(n){return Ka(n,function(e){return e})||[]},only:function(n){if(!Yh(n))throw Error("React.Children.only expected to receive a single React element child.");return n}};Ke.Component=Ao;Ke.Fragment=Ey;Ke.Profiler=Ay;Ke.PureComponent=Xh;Ke.StrictMode=Ty;Ke.Suspense=Py;Ke.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Oy;Ke.act=m0;Ke.cloneElement=function(n,e,t){if(n==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+n+".");var i=c0({},n.props),r=n.key,s=n.ref,o=n._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,o=$h.current),e.key!==void 0&&(r=""+e.key),n.type&&n.type.defaultProps)var c=n.type.defaultProps;for(l in e)d0.call(e,l)&&!h0.hasOwnProperty(l)&&(i[l]=e[l]===void 0&&c!==void 0?c[l]:e[l])}var l=arguments.length-2;if(l===1)i.children=t;else if(1<l){c=Array(l);for(var u=0;u<l;u++)c[u]=arguments[u+2];i.children=c}return{$$typeof:Ba,type:n.type,key:r,ref:s,props:i,_owner:o}};Ke.createContext=function(n){return n={$$typeof:Cy,_currentValue:n,_currentValue2:n,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},n.Provider={$$typeof:by,_context:n},n.Consumer=n};Ke.createElement=p0;Ke.createFactory=function(n){var e=p0.bind(null,n);return e.type=n,e};Ke.createRef=function(){return{current:null}};Ke.forwardRef=function(n){return{$$typeof:Ry,render:n}};Ke.isValidElement=Yh;Ke.lazy=function(n){return{$$typeof:Dy,_payload:{_status:-1,_result:n},_init:Fy}};Ke.memo=function(n,e){return{$$typeof:Ly,type:n,compare:e===void 0?null:e}};Ke.startTransition=function(n){var e=sc.transition;sc.transition={};try{n()}finally{sc.transition=e}};Ke.unstable_act=m0;Ke.useCallback=function(n,e){return gn.current.useCallback(n,e)};Ke.useContext=function(n){return gn.current.useContext(n)};Ke.useDebugValue=function(){};Ke.useDeferredValue=function(n){return gn.current.useDeferredValue(n)};Ke.useEffect=function(n,e){return gn.current.useEffect(n,e)};Ke.useId=function(){return gn.current.useId()};Ke.useImperativeHandle=function(n,e,t){return gn.current.useImperativeHandle(n,e,t)};Ke.useInsertionEffect=function(n,e){return gn.current.useInsertionEffect(n,e)};Ke.useLayoutEffect=function(n,e){return gn.current.useLayoutEffect(n,e)};Ke.useMemo=function(n,e){return gn.current.useMemo(n,e)};Ke.useReducer=function(n,e,t){return gn.current.useReducer(n,e,t)};Ke.useRef=function(n){return gn.current.useRef(n)};Ke.useState=function(n){return gn.current.useState(n)};Ke.useSyncExternalStore=function(n,e,t){return gn.current.useSyncExternalStore(n,e,t)};Ke.useTransition=function(){return gn.current.useTransition()};Ke.version="18.3.1";a0.exports=Ke;var Ue=a0.exports;/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ky=Ue,By=Symbol.for("react.element"),zy=Symbol.for("react.fragment"),Vy=Object.prototype.hasOwnProperty,Hy=ky.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Gy={key:!0,ref:!0,__self:!0,__source:!0};function g0(n,e,t){var i,r={},s=null,o=null;t!==void 0&&(s=""+t),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(o=e.ref);for(i in e)Vy.call(e,i)&&!Gy.hasOwnProperty(i)&&(r[i]=e[i]);if(n&&n.defaultProps)for(i in e=n.defaultProps,e)r[i]===void 0&&(r[i]=e[i]);return{$$typeof:By,type:n,key:s,ref:o,props:r,_owner:Hy.current}}ru.Fragment=zy;ru.jsx=g0;ru.jsxs=g0;o0.exports=ru;var q=o0.exports,_0={exports:{}},kn={},v0={exports:{}},x0={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(n){function e(k,X){var Q=k.length;k.push(X);e:for(;0<Q;){var J=Q-1>>>1,te=k[J];if(0<r(te,X))k[J]=X,k[Q]=te,Q=J;else break e}}function t(k){return k.length===0?null:k[0]}function i(k){if(k.length===0)return null;var X=k[0],Q=k.pop();if(Q!==X){k[0]=Q;e:for(var J=0,te=k.length,Oe=te>>>1;J<Oe;){var qe=2*(J+1)-1,rt=k[qe],Y=qe+1,se=k[Y];if(0>r(rt,Q))Y<te&&0>r(se,rt)?(k[J]=se,k[Y]=Q,J=Y):(k[J]=rt,k[qe]=Q,J=qe);else if(Y<te&&0>r(se,Q))k[J]=se,k[Y]=Q,J=Y;else break e}}return X}function r(k,X){var Q=k.sortIndex-X.sortIndex;return Q!==0?Q:k.id-X.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;n.unstable_now=function(){return s.now()}}else{var o=Date,c=o.now();n.unstable_now=function(){return o.now()-c}}var l=[],u=[],d=1,a=null,f=3,h=!1,m=!1,v=!1,g=typeof setTimeout=="function"?setTimeout:null,p=typeof clearTimeout=="function"?clearTimeout:null,_=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function x(k){for(var X=t(u);X!==null;){if(X.callback===null)i(u);else if(X.startTime<=k)i(u),X.sortIndex=X.expirationTime,e(l,X);else break;X=t(u)}}function S(k){if(v=!1,x(k),!m)if(t(l)!==null)m=!0,V(A);else{var X=t(u);X!==null&&H(S,X.startTime-k)}}function A(k,X){m=!1,v&&(v=!1,p(y),y=-1),h=!0;var Q=f;try{for(x(X),a=t(l);a!==null&&(!(a.expirationTime>X)||k&&!C());){var J=a.callback;if(typeof J=="function"){a.callback=null,f=a.priorityLevel;var te=J(a.expirationTime<=X);X=n.unstable_now(),typeof te=="function"?a.callback=te:a===t(l)&&i(l),x(X)}else i(l);a=t(l)}if(a!==null)var Oe=!0;else{var qe=t(u);qe!==null&&H(S,qe.startTime-X),Oe=!1}return Oe}finally{a=null,f=Q,h=!1}}var M=!1,T=null,y=-1,E=5,D=-1;function C(){return!(n.unstable_now()-D<E)}function F(){if(T!==null){var k=n.unstable_now();D=k;var X=!0;try{X=T(!0,k)}finally{X?L():(M=!1,T=null)}}else M=!1}var L;if(typeof _=="function")L=function(){_(F)};else if(typeof MessageChannel<"u"){var U=new MessageChannel,z=U.port2;U.port1.onmessage=F,L=function(){z.postMessage(null)}}else L=function(){g(F,0)};function V(k){T=k,M||(M=!0,L())}function H(k,X){y=g(function(){k(n.unstable_now())},X)}n.unstable_IdlePriority=5,n.unstable_ImmediatePriority=1,n.unstable_LowPriority=4,n.unstable_NormalPriority=3,n.unstable_Profiling=null,n.unstable_UserBlockingPriority=2,n.unstable_cancelCallback=function(k){k.callback=null},n.unstable_continueExecution=function(){m||h||(m=!0,V(A))},n.unstable_forceFrameRate=function(k){0>k||125<k?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):E=0<k?Math.floor(1e3/k):5},n.unstable_getCurrentPriorityLevel=function(){return f},n.unstable_getFirstCallbackNode=function(){return t(l)},n.unstable_next=function(k){switch(f){case 1:case 2:case 3:var X=3;break;default:X=f}var Q=f;f=X;try{return k()}finally{f=Q}},n.unstable_pauseExecution=function(){},n.unstable_requestPaint=function(){},n.unstable_runWithPriority=function(k,X){switch(k){case 1:case 2:case 3:case 4:case 5:break;default:k=3}var Q=f;f=k;try{return X()}finally{f=Q}},n.unstable_scheduleCallback=function(k,X,Q){var J=n.unstable_now();switch(typeof Q=="object"&&Q!==null?(Q=Q.delay,Q=typeof Q=="number"&&0<Q?J+Q:J):Q=J,k){case 1:var te=-1;break;case 2:te=250;break;case 5:te=1073741823;break;case 4:te=1e4;break;default:te=5e3}return te=Q+te,k={id:d++,callback:X,priorityLevel:k,startTime:Q,expirationTime:te,sortIndex:-1},Q>J?(k.sortIndex=Q,e(u,k),t(l)===null&&k===t(u)&&(v?(p(y),y=-1):v=!0,H(S,Q-J))):(k.sortIndex=te,e(l,k),m||h||(m=!0,V(A))),k},n.unstable_shouldYield=C,n.unstable_wrapCallback=function(k){var X=f;return function(){var Q=f;f=X;try{return k.apply(this,arguments)}finally{f=Q}}}})(x0);v0.exports=x0;var Wy=v0.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Xy=Ue,On=Wy;function ie(n){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+n,t=1;t<arguments.length;t++)e+="&args[]="+encodeURIComponent(arguments[t]);return"Minified React error #"+n+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var y0=new Set,ga={};function ls(n,e){fo(n,e),fo(n+"Capture",e)}function fo(n,e){for(ga[n]=e,n=0;n<e.length;n++)y0.add(e[n])}var Xi=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Jf=Object.prototype.hasOwnProperty,jy=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,_m={},vm={};function $y(n){return Jf.call(vm,n)?!0:Jf.call(_m,n)?!1:jy.test(n)?vm[n]=!0:(_m[n]=!0,!1)}function Yy(n,e,t,i){if(t!==null&&t.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return i?!1:t!==null?!t.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function qy(n,e,t,i){if(e===null||typeof e>"u"||Yy(n,e,t,i))return!0;if(i)return!1;if(t!==null)switch(t.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function _n(n,e,t,i,r,s,o){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=t,this.propertyName=n,this.type=e,this.sanitizeURL=s,this.removeEmptyString=o}var Jt={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){Jt[n]=new _n(n,0,!1,n,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var e=n[0];Jt[e]=new _n(e,1,!1,n[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(n){Jt[n]=new _n(n,2,!1,n.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){Jt[n]=new _n(n,2,!1,n,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){Jt[n]=new _n(n,3,!1,n.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(n){Jt[n]=new _n(n,3,!0,n,null,!1,!1)});["capture","download"].forEach(function(n){Jt[n]=new _n(n,4,!1,n,null,!1,!1)});["cols","rows","size","span"].forEach(function(n){Jt[n]=new _n(n,6,!1,n,null,!1,!1)});["rowSpan","start"].forEach(function(n){Jt[n]=new _n(n,5,!1,n.toLowerCase(),null,!1,!1)});var qh=/[\-:]([a-z])/g;function Kh(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var e=n.replace(qh,Kh);Jt[e]=new _n(e,1,!1,n,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var e=n.replace(qh,Kh);Jt[e]=new _n(e,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(n){var e=n.replace(qh,Kh);Jt[e]=new _n(e,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(n){Jt[n]=new _n(n,1,!1,n.toLowerCase(),null,!1,!1)});Jt.xlinkHref=new _n("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(n){Jt[n]=new _n(n,1,!1,n.toLowerCase(),null,!0,!0)});function Zh(n,e,t,i){var r=Jt.hasOwnProperty(e)?Jt[e]:null;(r!==null?r.type!==0:i||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(qy(e,t,r,i)&&(t=null),i||r===null?$y(e)&&(t===null?n.removeAttribute(e):n.setAttribute(e,""+t)):r.mustUseProperty?n[r.propertyName]=t===null?r.type===3?!1:"":t:(e=r.attributeName,i=r.attributeNamespace,t===null?n.removeAttribute(e):(r=r.type,t=r===3||r===4&&t===!0?"":""+t,i?n.setAttributeNS(i,e,t):n.setAttribute(e,t))))}var Zi=Xy.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Za=Symbol.for("react.element"),Hs=Symbol.for("react.portal"),Gs=Symbol.for("react.fragment"),Qh=Symbol.for("react.strict_mode"),ed=Symbol.for("react.profiler"),S0=Symbol.for("react.provider"),M0=Symbol.for("react.context"),Jh=Symbol.for("react.forward_ref"),td=Symbol.for("react.suspense"),nd=Symbol.for("react.suspense_list"),ep=Symbol.for("react.memo"),lr=Symbol.for("react.lazy"),w0=Symbol.for("react.offscreen"),xm=Symbol.iterator;function Lo(n){return n===null||typeof n!="object"?null:(n=xm&&n[xm]||n["@@iterator"],typeof n=="function"?n:null)}var Rt=Object.assign,Lu;function Qo(n){if(Lu===void 0)try{throw Error()}catch(t){var e=t.stack.trim().match(/\n( *(at )?)/);Lu=e&&e[1]||""}return`
`+Lu+n}var Du=!1;function Iu(n,e){if(!n||Du)return"";Du=!0;var t=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(u){var i=u}Reflect.construct(n,[],e)}else{try{e.call()}catch(u){i=u}n.call(e.prototype)}else{try{throw Error()}catch(u){i=u}n()}}catch(u){if(u&&i&&typeof u.stack=="string"){for(var r=u.stack.split(`
`),s=i.stack.split(`
`),o=r.length-1,c=s.length-1;1<=o&&0<=c&&r[o]!==s[c];)c--;for(;1<=o&&0<=c;o--,c--)if(r[o]!==s[c]){if(o!==1||c!==1)do if(o--,c--,0>c||r[o]!==s[c]){var l=`
`+r[o].replace(" at new "," at ");return n.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",n.displayName)),l}while(1<=o&&0<=c);break}}}finally{Du=!1,Error.prepareStackTrace=t}return(n=n?n.displayName||n.name:"")?Qo(n):""}function Ky(n){switch(n.tag){case 5:return Qo(n.type);case 16:return Qo("Lazy");case 13:return Qo("Suspense");case 19:return Qo("SuspenseList");case 0:case 2:case 15:return n=Iu(n.type,!1),n;case 11:return n=Iu(n.type.render,!1),n;case 1:return n=Iu(n.type,!0),n;default:return""}}function id(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case Gs:return"Fragment";case Hs:return"Portal";case ed:return"Profiler";case Qh:return"StrictMode";case td:return"Suspense";case nd:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case M0:return(n.displayName||"Context")+".Consumer";case S0:return(n._context.displayName||"Context")+".Provider";case Jh:var e=n.render;return n=n.displayName,n||(n=e.displayName||e.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case ep:return e=n.displayName||null,e!==null?e:id(n.type)||"Memo";case lr:e=n._payload,n=n._init;try{return id(n(e))}catch{}}return null}function Zy(n){var e=n.type;switch(n.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=e.render,n=n.displayName||n.name||"",e.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return id(e);case 8:return e===Qh?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function Tr(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function E0(n){var e=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function Qy(n){var e=E0(n)?"checked":"value",t=Object.getOwnPropertyDescriptor(n.constructor.prototype,e),i=""+n[e];if(!n.hasOwnProperty(e)&&typeof t<"u"&&typeof t.get=="function"&&typeof t.set=="function"){var r=t.get,s=t.set;return Object.defineProperty(n,e,{configurable:!0,get:function(){return r.call(this)},set:function(o){i=""+o,s.call(this,o)}}),Object.defineProperty(n,e,{enumerable:t.enumerable}),{getValue:function(){return i},setValue:function(o){i=""+o},stopTracking:function(){n._valueTracker=null,delete n[e]}}}}function Qa(n){n._valueTracker||(n._valueTracker=Qy(n))}function T0(n){if(!n)return!1;var e=n._valueTracker;if(!e)return!0;var t=e.getValue(),i="";return n&&(i=E0(n)?n.checked?"true":"false":n.value),n=i,n!==t?(e.setValue(n),!0):!1}function Ac(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function rd(n,e){var t=e.checked;return Rt({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:t??n._wrapperState.initialChecked})}function ym(n,e){var t=e.defaultValue==null?"":e.defaultValue,i=e.checked!=null?e.checked:e.defaultChecked;t=Tr(e.value!=null?e.value:t),n._wrapperState={initialChecked:i,initialValue:t,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function A0(n,e){e=e.checked,e!=null&&Zh(n,"checked",e,!1)}function sd(n,e){A0(n,e);var t=Tr(e.value),i=e.type;if(t!=null)i==="number"?(t===0&&n.value===""||n.value!=t)&&(n.value=""+t):n.value!==""+t&&(n.value=""+t);else if(i==="submit"||i==="reset"){n.removeAttribute("value");return}e.hasOwnProperty("value")?od(n,e.type,t):e.hasOwnProperty("defaultValue")&&od(n,e.type,Tr(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(n.defaultChecked=!!e.defaultChecked)}function Sm(n,e,t){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var i=e.type;if(!(i!=="submit"&&i!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+n._wrapperState.initialValue,t||e===n.value||(n.value=e),n.defaultValue=e}t=n.name,t!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,t!==""&&(n.name=t)}function od(n,e,t){(e!=="number"||Ac(n.ownerDocument)!==n)&&(t==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+t&&(n.defaultValue=""+t))}var Jo=Array.isArray;function to(n,e,t,i){if(n=n.options,e){e={};for(var r=0;r<t.length;r++)e["$"+t[r]]=!0;for(t=0;t<n.length;t++)r=e.hasOwnProperty("$"+n[t].value),n[t].selected!==r&&(n[t].selected=r),r&&i&&(n[t].defaultSelected=!0)}else{for(t=""+Tr(t),e=null,r=0;r<n.length;r++){if(n[r].value===t){n[r].selected=!0,i&&(n[r].defaultSelected=!0);return}e!==null||n[r].disabled||(e=n[r])}e!==null&&(e.selected=!0)}}function ad(n,e){if(e.dangerouslySetInnerHTML!=null)throw Error(ie(91));return Rt({},e,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function Mm(n,e){var t=e.value;if(t==null){if(t=e.children,e=e.defaultValue,t!=null){if(e!=null)throw Error(ie(92));if(Jo(t)){if(1<t.length)throw Error(ie(93));t=t[0]}e=t}e==null&&(e=""),t=e}n._wrapperState={initialValue:Tr(t)}}function b0(n,e){var t=Tr(e.value),i=Tr(e.defaultValue);t!=null&&(t=""+t,t!==n.value&&(n.value=t),e.defaultValue==null&&n.defaultValue!==t&&(n.defaultValue=t)),i!=null&&(n.defaultValue=""+i)}function wm(n){var e=n.textContent;e===n._wrapperState.initialValue&&e!==""&&e!==null&&(n.value=e)}function C0(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function ld(n,e){return n==null||n==="http://www.w3.org/1999/xhtml"?C0(e):n==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var Ja,R0=function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,t,i,r){MSApp.execUnsafeLocalFunction(function(){return n(e,t,i,r)})}:n}(function(n,e){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=e;else{for(Ja=Ja||document.createElement("div"),Ja.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=Ja.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;e.firstChild;)n.appendChild(e.firstChild)}});function _a(n,e){if(e){var t=n.firstChild;if(t&&t===n.lastChild&&t.nodeType===3){t.nodeValue=e;return}}n.textContent=e}var sa={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Jy=["Webkit","ms","Moz","O"];Object.keys(sa).forEach(function(n){Jy.forEach(function(e){e=e+n.charAt(0).toUpperCase()+n.substring(1),sa[e]=sa[n]})});function P0(n,e,t){return e==null||typeof e=="boolean"||e===""?"":t||typeof e!="number"||e===0||sa.hasOwnProperty(n)&&sa[n]?(""+e).trim():e+"px"}function L0(n,e){n=n.style;for(var t in e)if(e.hasOwnProperty(t)){var i=t.indexOf("--")===0,r=P0(t,e[t],i);t==="float"&&(t="cssFloat"),i?n.setProperty(t,r):n[t]=r}}var eS=Rt({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function cd(n,e){if(e){if(eS[n]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(ie(137,n));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(ie(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(ie(61))}if(e.style!=null&&typeof e.style!="object")throw Error(ie(62))}}function ud(n,e){if(n.indexOf("-")===-1)return typeof e.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var fd=null;function tp(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var dd=null,no=null,io=null;function Em(n){if(n=Ha(n)){if(typeof dd!="function")throw Error(ie(280));var e=n.stateNode;e&&(e=cu(e),dd(n.stateNode,n.type,e))}}function D0(n){no?io?io.push(n):io=[n]:no=n}function I0(){if(no){var n=no,e=io;if(io=no=null,Em(n),e)for(n=0;n<e.length;n++)Em(e[n])}}function N0(n,e){return n(e)}function U0(){}var Nu=!1;function F0(n,e,t){if(Nu)return n(e,t);Nu=!0;try{return N0(n,e,t)}finally{Nu=!1,(no!==null||io!==null)&&(U0(),I0())}}function va(n,e){var t=n.stateNode;if(t===null)return null;var i=cu(t);if(i===null)return null;t=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(n=n.type,i=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!i;break e;default:n=!1}if(n)return null;if(t&&typeof t!="function")throw Error(ie(231,e,typeof t));return t}var hd=!1;if(Xi)try{var Do={};Object.defineProperty(Do,"passive",{get:function(){hd=!0}}),window.addEventListener("test",Do,Do),window.removeEventListener("test",Do,Do)}catch{hd=!1}function tS(n,e,t,i,r,s,o,c,l){var u=Array.prototype.slice.call(arguments,3);try{e.apply(t,u)}catch(d){this.onError(d)}}var oa=!1,bc=null,Cc=!1,pd=null,nS={onError:function(n){oa=!0,bc=n}};function iS(n,e,t,i,r,s,o,c,l){oa=!1,bc=null,tS.apply(nS,arguments)}function rS(n,e,t,i,r,s,o,c,l){if(iS.apply(this,arguments),oa){if(oa){var u=bc;oa=!1,bc=null}else throw Error(ie(198));Cc||(Cc=!0,pd=u)}}function cs(n){var e=n,t=n;if(n.alternate)for(;e.return;)e=e.return;else{n=e;do e=n,e.flags&4098&&(t=e.return),n=e.return;while(n)}return e.tag===3?t:null}function O0(n){if(n.tag===13){var e=n.memoizedState;if(e===null&&(n=n.alternate,n!==null&&(e=n.memoizedState)),e!==null)return e.dehydrated}return null}function Tm(n){if(cs(n)!==n)throw Error(ie(188))}function sS(n){var e=n.alternate;if(!e){if(e=cs(n),e===null)throw Error(ie(188));return e!==n?null:n}for(var t=n,i=e;;){var r=t.return;if(r===null)break;var s=r.alternate;if(s===null){if(i=r.return,i!==null){t=i;continue}break}if(r.child===s.child){for(s=r.child;s;){if(s===t)return Tm(r),n;if(s===i)return Tm(r),e;s=s.sibling}throw Error(ie(188))}if(t.return!==i.return)t=r,i=s;else{for(var o=!1,c=r.child;c;){if(c===t){o=!0,t=r,i=s;break}if(c===i){o=!0,i=r,t=s;break}c=c.sibling}if(!o){for(c=s.child;c;){if(c===t){o=!0,t=s,i=r;break}if(c===i){o=!0,i=s,t=r;break}c=c.sibling}if(!o)throw Error(ie(189))}}if(t.alternate!==i)throw Error(ie(190))}if(t.tag!==3)throw Error(ie(188));return t.stateNode.current===t?n:e}function k0(n){return n=sS(n),n!==null?B0(n):null}function B0(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var e=B0(n);if(e!==null)return e;n=n.sibling}return null}var z0=On.unstable_scheduleCallback,Am=On.unstable_cancelCallback,oS=On.unstable_shouldYield,aS=On.unstable_requestPaint,Nt=On.unstable_now,lS=On.unstable_getCurrentPriorityLevel,np=On.unstable_ImmediatePriority,V0=On.unstable_UserBlockingPriority,Rc=On.unstable_NormalPriority,cS=On.unstable_LowPriority,H0=On.unstable_IdlePriority,su=null,Si=null;function uS(n){if(Si&&typeof Si.onCommitFiberRoot=="function")try{Si.onCommitFiberRoot(su,n,void 0,(n.current.flags&128)===128)}catch{}}var ci=Math.clz32?Math.clz32:hS,fS=Math.log,dS=Math.LN2;function hS(n){return n>>>=0,n===0?32:31-(fS(n)/dS|0)|0}var el=64,tl=4194304;function ea(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function Pc(n,e){var t=n.pendingLanes;if(t===0)return 0;var i=0,r=n.suspendedLanes,s=n.pingedLanes,o=t&268435455;if(o!==0){var c=o&~r;c!==0?i=ea(c):(s&=o,s!==0&&(i=ea(s)))}else o=t&~r,o!==0?i=ea(o):s!==0&&(i=ea(s));if(i===0)return 0;if(e!==0&&e!==i&&!(e&r)&&(r=i&-i,s=e&-e,r>=s||r===16&&(s&4194240)!==0))return e;if(i&4&&(i|=t&16),e=n.entangledLanes,e!==0)for(n=n.entanglements,e&=i;0<e;)t=31-ci(e),r=1<<t,i|=n[t],e&=~r;return i}function pS(n,e){switch(n){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function mS(n,e){for(var t=n.suspendedLanes,i=n.pingedLanes,r=n.expirationTimes,s=n.pendingLanes;0<s;){var o=31-ci(s),c=1<<o,l=r[o];l===-1?(!(c&t)||c&i)&&(r[o]=pS(c,e)):l<=e&&(n.expiredLanes|=c),s&=~c}}function md(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function G0(){var n=el;return el<<=1,!(el&4194240)&&(el=64),n}function Uu(n){for(var e=[],t=0;31>t;t++)e.push(n);return e}function za(n,e,t){n.pendingLanes|=e,e!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,e=31-ci(e),n[e]=t}function gS(n,e){var t=n.pendingLanes&~e;n.pendingLanes=e,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=e,n.mutableReadLanes&=e,n.entangledLanes&=e,e=n.entanglements;var i=n.eventTimes;for(n=n.expirationTimes;0<t;){var r=31-ci(t),s=1<<r;e[r]=0,i[r]=-1,n[r]=-1,t&=~s}}function ip(n,e){var t=n.entangledLanes|=e;for(n=n.entanglements;t;){var i=31-ci(t),r=1<<i;r&e|n[i]&e&&(n[i]|=e),t&=~r}}var ft=0;function W0(n){return n&=-n,1<n?4<n?n&268435455?16:536870912:4:1}var X0,rp,j0,$0,Y0,gd=!1,nl=[],_r=null,vr=null,xr=null,xa=new Map,ya=new Map,fr=[],_S="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function bm(n,e){switch(n){case"focusin":case"focusout":_r=null;break;case"dragenter":case"dragleave":vr=null;break;case"mouseover":case"mouseout":xr=null;break;case"pointerover":case"pointerout":xa.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":ya.delete(e.pointerId)}}function Io(n,e,t,i,r,s){return n===null||n.nativeEvent!==s?(n={blockedOn:e,domEventName:t,eventSystemFlags:i,nativeEvent:s,targetContainers:[r]},e!==null&&(e=Ha(e),e!==null&&rp(e)),n):(n.eventSystemFlags|=i,e=n.targetContainers,r!==null&&e.indexOf(r)===-1&&e.push(r),n)}function vS(n,e,t,i,r){switch(e){case"focusin":return _r=Io(_r,n,e,t,i,r),!0;case"dragenter":return vr=Io(vr,n,e,t,i,r),!0;case"mouseover":return xr=Io(xr,n,e,t,i,r),!0;case"pointerover":var s=r.pointerId;return xa.set(s,Io(xa.get(s)||null,n,e,t,i,r)),!0;case"gotpointercapture":return s=r.pointerId,ya.set(s,Io(ya.get(s)||null,n,e,t,i,r)),!0}return!1}function q0(n){var e=qr(n.target);if(e!==null){var t=cs(e);if(t!==null){if(e=t.tag,e===13){if(e=O0(t),e!==null){n.blockedOn=e,Y0(n.priority,function(){j0(t)});return}}else if(e===3&&t.stateNode.current.memoizedState.isDehydrated){n.blockedOn=t.tag===3?t.stateNode.containerInfo:null;return}}}n.blockedOn=null}function oc(n){if(n.blockedOn!==null)return!1;for(var e=n.targetContainers;0<e.length;){var t=_d(n.domEventName,n.eventSystemFlags,e[0],n.nativeEvent);if(t===null){t=n.nativeEvent;var i=new t.constructor(t.type,t);fd=i,t.target.dispatchEvent(i),fd=null}else return e=Ha(t),e!==null&&rp(e),n.blockedOn=t,!1;e.shift()}return!0}function Cm(n,e,t){oc(n)&&t.delete(e)}function xS(){gd=!1,_r!==null&&oc(_r)&&(_r=null),vr!==null&&oc(vr)&&(vr=null),xr!==null&&oc(xr)&&(xr=null),xa.forEach(Cm),ya.forEach(Cm)}function No(n,e){n.blockedOn===e&&(n.blockedOn=null,gd||(gd=!0,On.unstable_scheduleCallback(On.unstable_NormalPriority,xS)))}function Sa(n){function e(r){return No(r,n)}if(0<nl.length){No(nl[0],n);for(var t=1;t<nl.length;t++){var i=nl[t];i.blockedOn===n&&(i.blockedOn=null)}}for(_r!==null&&No(_r,n),vr!==null&&No(vr,n),xr!==null&&No(xr,n),xa.forEach(e),ya.forEach(e),t=0;t<fr.length;t++)i=fr[t],i.blockedOn===n&&(i.blockedOn=null);for(;0<fr.length&&(t=fr[0],t.blockedOn===null);)q0(t),t.blockedOn===null&&fr.shift()}var ro=Zi.ReactCurrentBatchConfig,Lc=!0;function yS(n,e,t,i){var r=ft,s=ro.transition;ro.transition=null;try{ft=1,sp(n,e,t,i)}finally{ft=r,ro.transition=s}}function SS(n,e,t,i){var r=ft,s=ro.transition;ro.transition=null;try{ft=4,sp(n,e,t,i)}finally{ft=r,ro.transition=s}}function sp(n,e,t,i){if(Lc){var r=_d(n,e,t,i);if(r===null)Xu(n,e,i,Dc,t),bm(n,i);else if(vS(r,n,e,t,i))i.stopPropagation();else if(bm(n,i),e&4&&-1<_S.indexOf(n)){for(;r!==null;){var s=Ha(r);if(s!==null&&X0(s),s=_d(n,e,t,i),s===null&&Xu(n,e,i,Dc,t),s===r)break;r=s}r!==null&&i.stopPropagation()}else Xu(n,e,i,null,t)}}var Dc=null;function _d(n,e,t,i){if(Dc=null,n=tp(i),n=qr(n),n!==null)if(e=cs(n),e===null)n=null;else if(t=e.tag,t===13){if(n=O0(e),n!==null)return n;n=null}else if(t===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;n=null}else e!==n&&(n=null);return Dc=n,null}function K0(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(lS()){case np:return 1;case V0:return 4;case Rc:case cS:return 16;case H0:return 536870912;default:return 16}default:return 16}}var pr=null,op=null,ac=null;function Z0(){if(ac)return ac;var n,e=op,t=e.length,i,r="value"in pr?pr.value:pr.textContent,s=r.length;for(n=0;n<t&&e[n]===r[n];n++);var o=t-n;for(i=1;i<=o&&e[t-i]===r[s-i];i++);return ac=r.slice(n,1<i?1-i:void 0)}function lc(n){var e=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&e===13&&(n=13)):n=e,n===10&&(n=13),32<=n||n===13?n:0}function il(){return!0}function Rm(){return!1}function Bn(n){function e(t,i,r,s,o){this._reactName=t,this._targetInst=r,this.type=i,this.nativeEvent=s,this.target=o,this.currentTarget=null;for(var c in n)n.hasOwnProperty(c)&&(t=n[c],this[c]=t?t(s):s[c]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?il:Rm,this.isPropagationStopped=Rm,this}return Rt(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var t=this.nativeEvent;t&&(t.preventDefault?t.preventDefault():typeof t.returnValue!="unknown"&&(t.returnValue=!1),this.isDefaultPrevented=il)},stopPropagation:function(){var t=this.nativeEvent;t&&(t.stopPropagation?t.stopPropagation():typeof t.cancelBubble!="unknown"&&(t.cancelBubble=!0),this.isPropagationStopped=il)},persist:function(){},isPersistent:il}),e}var bo={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},ap=Bn(bo),Va=Rt({},bo,{view:0,detail:0}),MS=Bn(Va),Fu,Ou,Uo,ou=Rt({},Va,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:lp,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==Uo&&(Uo&&n.type==="mousemove"?(Fu=n.screenX-Uo.screenX,Ou=n.screenY-Uo.screenY):Ou=Fu=0,Uo=n),Fu)},movementY:function(n){return"movementY"in n?n.movementY:Ou}}),Pm=Bn(ou),wS=Rt({},ou,{dataTransfer:0}),ES=Bn(wS),TS=Rt({},Va,{relatedTarget:0}),ku=Bn(TS),AS=Rt({},bo,{animationName:0,elapsedTime:0,pseudoElement:0}),bS=Bn(AS),CS=Rt({},bo,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),RS=Bn(CS),PS=Rt({},bo,{data:0}),Lm=Bn(PS),LS={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},DS={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},IS={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function NS(n){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(n):(n=IS[n])?!!e[n]:!1}function lp(){return NS}var US=Rt({},Va,{key:function(n){if(n.key){var e=LS[n.key]||n.key;if(e!=="Unidentified")return e}return n.type==="keypress"?(n=lc(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?DS[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:lp,charCode:function(n){return n.type==="keypress"?lc(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?lc(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),FS=Bn(US),OS=Rt({},ou,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Dm=Bn(OS),kS=Rt({},Va,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:lp}),BS=Bn(kS),zS=Rt({},bo,{propertyName:0,elapsedTime:0,pseudoElement:0}),VS=Bn(zS),HS=Rt({},ou,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),GS=Bn(HS),WS=[9,13,27,32],cp=Xi&&"CompositionEvent"in window,aa=null;Xi&&"documentMode"in document&&(aa=document.documentMode);var XS=Xi&&"TextEvent"in window&&!aa,Q0=Xi&&(!cp||aa&&8<aa&&11>=aa),Im=" ",Nm=!1;function J0(n,e){switch(n){case"keyup":return WS.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function ev(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var Ws=!1;function jS(n,e){switch(n){case"compositionend":return ev(e);case"keypress":return e.which!==32?null:(Nm=!0,Im);case"textInput":return n=e.data,n===Im&&Nm?null:n;default:return null}}function $S(n,e){if(Ws)return n==="compositionend"||!cp&&J0(n,e)?(n=Z0(),ac=op=pr=null,Ws=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return Q0&&e.locale!=="ko"?null:e.data;default:return null}}var YS={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Um(n){var e=n&&n.nodeName&&n.nodeName.toLowerCase();return e==="input"?!!YS[n.type]:e==="textarea"}function tv(n,e,t,i){D0(i),e=Ic(e,"onChange"),0<e.length&&(t=new ap("onChange","change",null,t,i),n.push({event:t,listeners:e}))}var la=null,Ma=null;function qS(n){dv(n,0)}function au(n){var e=$s(n);if(T0(e))return n}function KS(n,e){if(n==="change")return e}var nv=!1;if(Xi){var Bu;if(Xi){var zu="oninput"in document;if(!zu){var Fm=document.createElement("div");Fm.setAttribute("oninput","return;"),zu=typeof Fm.oninput=="function"}Bu=zu}else Bu=!1;nv=Bu&&(!document.documentMode||9<document.documentMode)}function Om(){la&&(la.detachEvent("onpropertychange",iv),Ma=la=null)}function iv(n){if(n.propertyName==="value"&&au(Ma)){var e=[];tv(e,Ma,n,tp(n)),F0(qS,e)}}function ZS(n,e,t){n==="focusin"?(Om(),la=e,Ma=t,la.attachEvent("onpropertychange",iv)):n==="focusout"&&Om()}function QS(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return au(Ma)}function JS(n,e){if(n==="click")return au(e)}function eM(n,e){if(n==="input"||n==="change")return au(e)}function tM(n,e){return n===e&&(n!==0||1/n===1/e)||n!==n&&e!==e}var fi=typeof Object.is=="function"?Object.is:tM;function wa(n,e){if(fi(n,e))return!0;if(typeof n!="object"||n===null||typeof e!="object"||e===null)return!1;var t=Object.keys(n),i=Object.keys(e);if(t.length!==i.length)return!1;for(i=0;i<t.length;i++){var r=t[i];if(!Jf.call(e,r)||!fi(n[r],e[r]))return!1}return!0}function km(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function Bm(n,e){var t=km(n);n=0;for(var i;t;){if(t.nodeType===3){if(i=n+t.textContent.length,n<=e&&i>=e)return{node:t,offset:e-n};n=i}e:{for(;t;){if(t.nextSibling){t=t.nextSibling;break e}t=t.parentNode}t=void 0}t=km(t)}}function rv(n,e){return n&&e?n===e?!0:n&&n.nodeType===3?!1:e&&e.nodeType===3?rv(n,e.parentNode):"contains"in n?n.contains(e):n.compareDocumentPosition?!!(n.compareDocumentPosition(e)&16):!1:!1}function sv(){for(var n=window,e=Ac();e instanceof n.HTMLIFrameElement;){try{var t=typeof e.contentWindow.location.href=="string"}catch{t=!1}if(t)n=e.contentWindow;else break;e=Ac(n.document)}return e}function up(n){var e=n&&n.nodeName&&n.nodeName.toLowerCase();return e&&(e==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||e==="textarea"||n.contentEditable==="true")}function nM(n){var e=sv(),t=n.focusedElem,i=n.selectionRange;if(e!==t&&t&&t.ownerDocument&&rv(t.ownerDocument.documentElement,t)){if(i!==null&&up(t)){if(e=i.start,n=i.end,n===void 0&&(n=e),"selectionStart"in t)t.selectionStart=e,t.selectionEnd=Math.min(n,t.value.length);else if(n=(e=t.ownerDocument||document)&&e.defaultView||window,n.getSelection){n=n.getSelection();var r=t.textContent.length,s=Math.min(i.start,r);i=i.end===void 0?s:Math.min(i.end,r),!n.extend&&s>i&&(r=i,i=s,s=r),r=Bm(t,s);var o=Bm(t,i);r&&o&&(n.rangeCount!==1||n.anchorNode!==r.node||n.anchorOffset!==r.offset||n.focusNode!==o.node||n.focusOffset!==o.offset)&&(e=e.createRange(),e.setStart(r.node,r.offset),n.removeAllRanges(),s>i?(n.addRange(e),n.extend(o.node,o.offset)):(e.setEnd(o.node,o.offset),n.addRange(e)))}}for(e=[],n=t;n=n.parentNode;)n.nodeType===1&&e.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof t.focus=="function"&&t.focus(),t=0;t<e.length;t++)n=e[t],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var iM=Xi&&"documentMode"in document&&11>=document.documentMode,Xs=null,vd=null,ca=null,xd=!1;function zm(n,e,t){var i=t.window===t?t.document:t.nodeType===9?t:t.ownerDocument;xd||Xs==null||Xs!==Ac(i)||(i=Xs,"selectionStart"in i&&up(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),ca&&wa(ca,i)||(ca=i,i=Ic(vd,"onSelect"),0<i.length&&(e=new ap("onSelect","select",null,e,t),n.push({event:e,listeners:i}),e.target=Xs)))}function rl(n,e){var t={};return t[n.toLowerCase()]=e.toLowerCase(),t["Webkit"+n]="webkit"+e,t["Moz"+n]="moz"+e,t}var js={animationend:rl("Animation","AnimationEnd"),animationiteration:rl("Animation","AnimationIteration"),animationstart:rl("Animation","AnimationStart"),transitionend:rl("Transition","TransitionEnd")},Vu={},ov={};Xi&&(ov=document.createElement("div").style,"AnimationEvent"in window||(delete js.animationend.animation,delete js.animationiteration.animation,delete js.animationstart.animation),"TransitionEvent"in window||delete js.transitionend.transition);function lu(n){if(Vu[n])return Vu[n];if(!js[n])return n;var e=js[n],t;for(t in e)if(e.hasOwnProperty(t)&&t in ov)return Vu[n]=e[t];return n}var av=lu("animationend"),lv=lu("animationiteration"),cv=lu("animationstart"),uv=lu("transitionend"),fv=new Map,Vm="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Pr(n,e){fv.set(n,e),ls(e,[n])}for(var Hu=0;Hu<Vm.length;Hu++){var Gu=Vm[Hu],rM=Gu.toLowerCase(),sM=Gu[0].toUpperCase()+Gu.slice(1);Pr(rM,"on"+sM)}Pr(av,"onAnimationEnd");Pr(lv,"onAnimationIteration");Pr(cv,"onAnimationStart");Pr("dblclick","onDoubleClick");Pr("focusin","onFocus");Pr("focusout","onBlur");Pr(uv,"onTransitionEnd");fo("onMouseEnter",["mouseout","mouseover"]);fo("onMouseLeave",["mouseout","mouseover"]);fo("onPointerEnter",["pointerout","pointerover"]);fo("onPointerLeave",["pointerout","pointerover"]);ls("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));ls("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));ls("onBeforeInput",["compositionend","keypress","textInput","paste"]);ls("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));ls("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));ls("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var ta="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),oM=new Set("cancel close invalid load scroll toggle".split(" ").concat(ta));function Hm(n,e,t){var i=n.type||"unknown-event";n.currentTarget=t,rS(i,e,void 0,n),n.currentTarget=null}function dv(n,e){e=(e&4)!==0;for(var t=0;t<n.length;t++){var i=n[t],r=i.event;i=i.listeners;e:{var s=void 0;if(e)for(var o=i.length-1;0<=o;o--){var c=i[o],l=c.instance,u=c.currentTarget;if(c=c.listener,l!==s&&r.isPropagationStopped())break e;Hm(r,c,u),s=l}else for(o=0;o<i.length;o++){if(c=i[o],l=c.instance,u=c.currentTarget,c=c.listener,l!==s&&r.isPropagationStopped())break e;Hm(r,c,u),s=l}}}if(Cc)throw n=pd,Cc=!1,pd=null,n}function wt(n,e){var t=e[Ed];t===void 0&&(t=e[Ed]=new Set);var i=n+"__bubble";t.has(i)||(hv(e,n,2,!1),t.add(i))}function Wu(n,e,t){var i=0;e&&(i|=4),hv(t,n,i,e)}var sl="_reactListening"+Math.random().toString(36).slice(2);function Ea(n){if(!n[sl]){n[sl]=!0,y0.forEach(function(t){t!=="selectionchange"&&(oM.has(t)||Wu(t,!1,n),Wu(t,!0,n))});var e=n.nodeType===9?n:n.ownerDocument;e===null||e[sl]||(e[sl]=!0,Wu("selectionchange",!1,e))}}function hv(n,e,t,i){switch(K0(e)){case 1:var r=yS;break;case 4:r=SS;break;default:r=sp}t=r.bind(null,e,t,n),r=void 0,!hd||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(r=!0),i?r!==void 0?n.addEventListener(e,t,{capture:!0,passive:r}):n.addEventListener(e,t,!0):r!==void 0?n.addEventListener(e,t,{passive:r}):n.addEventListener(e,t,!1)}function Xu(n,e,t,i,r){var s=i;if(!(e&1)&&!(e&2)&&i!==null)e:for(;;){if(i===null)return;var o=i.tag;if(o===3||o===4){var c=i.stateNode.containerInfo;if(c===r||c.nodeType===8&&c.parentNode===r)break;if(o===4)for(o=i.return;o!==null;){var l=o.tag;if((l===3||l===4)&&(l=o.stateNode.containerInfo,l===r||l.nodeType===8&&l.parentNode===r))return;o=o.return}for(;c!==null;){if(o=qr(c),o===null)return;if(l=o.tag,l===5||l===6){i=s=o;continue e}c=c.parentNode}}i=i.return}F0(function(){var u=s,d=tp(t),a=[];e:{var f=fv.get(n);if(f!==void 0){var h=ap,m=n;switch(n){case"keypress":if(lc(t)===0)break e;case"keydown":case"keyup":h=FS;break;case"focusin":m="focus",h=ku;break;case"focusout":m="blur",h=ku;break;case"beforeblur":case"afterblur":h=ku;break;case"click":if(t.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":h=Pm;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":h=ES;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":h=BS;break;case av:case lv:case cv:h=bS;break;case uv:h=VS;break;case"scroll":h=MS;break;case"wheel":h=GS;break;case"copy":case"cut":case"paste":h=RS;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":h=Dm}var v=(e&4)!==0,g=!v&&n==="scroll",p=v?f!==null?f+"Capture":null:f;v=[];for(var _=u,x;_!==null;){x=_;var S=x.stateNode;if(x.tag===5&&S!==null&&(x=S,p!==null&&(S=va(_,p),S!=null&&v.push(Ta(_,S,x)))),g)break;_=_.return}0<v.length&&(f=new h(f,m,null,t,d),a.push({event:f,listeners:v}))}}if(!(e&7)){e:{if(f=n==="mouseover"||n==="pointerover",h=n==="mouseout"||n==="pointerout",f&&t!==fd&&(m=t.relatedTarget||t.fromElement)&&(qr(m)||m[ji]))break e;if((h||f)&&(f=d.window===d?d:(f=d.ownerDocument)?f.defaultView||f.parentWindow:window,h?(m=t.relatedTarget||t.toElement,h=u,m=m?qr(m):null,m!==null&&(g=cs(m),m!==g||m.tag!==5&&m.tag!==6)&&(m=null)):(h=null,m=u),h!==m)){if(v=Pm,S="onMouseLeave",p="onMouseEnter",_="mouse",(n==="pointerout"||n==="pointerover")&&(v=Dm,S="onPointerLeave",p="onPointerEnter",_="pointer"),g=h==null?f:$s(h),x=m==null?f:$s(m),f=new v(S,_+"leave",h,t,d),f.target=g,f.relatedTarget=x,S=null,qr(d)===u&&(v=new v(p,_+"enter",m,t,d),v.target=x,v.relatedTarget=g,S=v),g=S,h&&m)t:{for(v=h,p=m,_=0,x=v;x;x=gs(x))_++;for(x=0,S=p;S;S=gs(S))x++;for(;0<_-x;)v=gs(v),_--;for(;0<x-_;)p=gs(p),x--;for(;_--;){if(v===p||p!==null&&v===p.alternate)break t;v=gs(v),p=gs(p)}v=null}else v=null;h!==null&&Gm(a,f,h,v,!1),m!==null&&g!==null&&Gm(a,g,m,v,!0)}}e:{if(f=u?$s(u):window,h=f.nodeName&&f.nodeName.toLowerCase(),h==="select"||h==="input"&&f.type==="file")var A=KS;else if(Um(f))if(nv)A=eM;else{A=QS;var M=ZS}else(h=f.nodeName)&&h.toLowerCase()==="input"&&(f.type==="checkbox"||f.type==="radio")&&(A=JS);if(A&&(A=A(n,u))){tv(a,A,t,d);break e}M&&M(n,f,u),n==="focusout"&&(M=f._wrapperState)&&M.controlled&&f.type==="number"&&od(f,"number",f.value)}switch(M=u?$s(u):window,n){case"focusin":(Um(M)||M.contentEditable==="true")&&(Xs=M,vd=u,ca=null);break;case"focusout":ca=vd=Xs=null;break;case"mousedown":xd=!0;break;case"contextmenu":case"mouseup":case"dragend":xd=!1,zm(a,t,d);break;case"selectionchange":if(iM)break;case"keydown":case"keyup":zm(a,t,d)}var T;if(cp)e:{switch(n){case"compositionstart":var y="onCompositionStart";break e;case"compositionend":y="onCompositionEnd";break e;case"compositionupdate":y="onCompositionUpdate";break e}y=void 0}else Ws?J0(n,t)&&(y="onCompositionEnd"):n==="keydown"&&t.keyCode===229&&(y="onCompositionStart");y&&(Q0&&t.locale!=="ko"&&(Ws||y!=="onCompositionStart"?y==="onCompositionEnd"&&Ws&&(T=Z0()):(pr=d,op="value"in pr?pr.value:pr.textContent,Ws=!0)),M=Ic(u,y),0<M.length&&(y=new Lm(y,n,null,t,d),a.push({event:y,listeners:M}),T?y.data=T:(T=ev(t),T!==null&&(y.data=T)))),(T=XS?jS(n,t):$S(n,t))&&(u=Ic(u,"onBeforeInput"),0<u.length&&(d=new Lm("onBeforeInput","beforeinput",null,t,d),a.push({event:d,listeners:u}),d.data=T))}dv(a,e)})}function Ta(n,e,t){return{instance:n,listener:e,currentTarget:t}}function Ic(n,e){for(var t=e+"Capture",i=[];n!==null;){var r=n,s=r.stateNode;r.tag===5&&s!==null&&(r=s,s=va(n,t),s!=null&&i.unshift(Ta(n,s,r)),s=va(n,e),s!=null&&i.push(Ta(n,s,r))),n=n.return}return i}function gs(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function Gm(n,e,t,i,r){for(var s=e._reactName,o=[];t!==null&&t!==i;){var c=t,l=c.alternate,u=c.stateNode;if(l!==null&&l===i)break;c.tag===5&&u!==null&&(c=u,r?(l=va(t,s),l!=null&&o.unshift(Ta(t,l,c))):r||(l=va(t,s),l!=null&&o.push(Ta(t,l,c)))),t=t.return}o.length!==0&&n.push({event:e,listeners:o})}var aM=/\r\n?/g,lM=/\u0000|\uFFFD/g;function Wm(n){return(typeof n=="string"?n:""+n).replace(aM,`
`).replace(lM,"")}function ol(n,e,t){if(e=Wm(e),Wm(n)!==e&&t)throw Error(ie(425))}function Nc(){}var yd=null,Sd=null;function Md(n,e){return n==="textarea"||n==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var wd=typeof setTimeout=="function"?setTimeout:void 0,cM=typeof clearTimeout=="function"?clearTimeout:void 0,Xm=typeof Promise=="function"?Promise:void 0,uM=typeof queueMicrotask=="function"?queueMicrotask:typeof Xm<"u"?function(n){return Xm.resolve(null).then(n).catch(fM)}:wd;function fM(n){setTimeout(function(){throw n})}function ju(n,e){var t=e,i=0;do{var r=t.nextSibling;if(n.removeChild(t),r&&r.nodeType===8)if(t=r.data,t==="/$"){if(i===0){n.removeChild(r),Sa(e);return}i--}else t!=="$"&&t!=="$?"&&t!=="$!"||i++;t=r}while(t);Sa(e)}function yr(n){for(;n!=null;n=n.nextSibling){var e=n.nodeType;if(e===1||e===3)break;if(e===8){if(e=n.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return n}function jm(n){n=n.previousSibling;for(var e=0;n;){if(n.nodeType===8){var t=n.data;if(t==="$"||t==="$!"||t==="$?"){if(e===0)return n;e--}else t==="/$"&&e++}n=n.previousSibling}return null}var Co=Math.random().toString(36).slice(2),xi="__reactFiber$"+Co,Aa="__reactProps$"+Co,ji="__reactContainer$"+Co,Ed="__reactEvents$"+Co,dM="__reactListeners$"+Co,hM="__reactHandles$"+Co;function qr(n){var e=n[xi];if(e)return e;for(var t=n.parentNode;t;){if(e=t[ji]||t[xi]){if(t=e.alternate,e.child!==null||t!==null&&t.child!==null)for(n=jm(n);n!==null;){if(t=n[xi])return t;n=jm(n)}return e}n=t,t=n.parentNode}return null}function Ha(n){return n=n[xi]||n[ji],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function $s(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(ie(33))}function cu(n){return n[Aa]||null}var Td=[],Ys=-1;function Lr(n){return{current:n}}function Et(n){0>Ys||(n.current=Td[Ys],Td[Ys]=null,Ys--)}function yt(n,e){Ys++,Td[Ys]=n.current,n.current=e}var Ar={},cn=Lr(Ar),Sn=Lr(!1),ns=Ar;function ho(n,e){var t=n.type.contextTypes;if(!t)return Ar;var i=n.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===e)return i.__reactInternalMemoizedMaskedChildContext;var r={},s;for(s in t)r[s]=e[s];return i&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=e,n.__reactInternalMemoizedMaskedChildContext=r),r}function Mn(n){return n=n.childContextTypes,n!=null}function Uc(){Et(Sn),Et(cn)}function $m(n,e,t){if(cn.current!==Ar)throw Error(ie(168));yt(cn,e),yt(Sn,t)}function pv(n,e,t){var i=n.stateNode;if(e=e.childContextTypes,typeof i.getChildContext!="function")return t;i=i.getChildContext();for(var r in i)if(!(r in e))throw Error(ie(108,Zy(n)||"Unknown",r));return Rt({},t,i)}function Fc(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||Ar,ns=cn.current,yt(cn,n),yt(Sn,Sn.current),!0}function Ym(n,e,t){var i=n.stateNode;if(!i)throw Error(ie(169));t?(n=pv(n,e,ns),i.__reactInternalMemoizedMergedChildContext=n,Et(Sn),Et(cn),yt(cn,n)):Et(Sn),yt(Sn,t)}var ki=null,uu=!1,$u=!1;function mv(n){ki===null?ki=[n]:ki.push(n)}function pM(n){uu=!0,mv(n)}function Dr(){if(!$u&&ki!==null){$u=!0;var n=0,e=ft;try{var t=ki;for(ft=1;n<t.length;n++){var i=t[n];do i=i(!0);while(i!==null)}ki=null,uu=!1}catch(r){throw ki!==null&&(ki=ki.slice(n+1)),z0(np,Dr),r}finally{ft=e,$u=!1}}return null}var qs=[],Ks=0,Oc=null,kc=0,Wn=[],Xn=0,is=null,Bi=1,zi="";function Xr(n,e){qs[Ks++]=kc,qs[Ks++]=Oc,Oc=n,kc=e}function gv(n,e,t){Wn[Xn++]=Bi,Wn[Xn++]=zi,Wn[Xn++]=is,is=n;var i=Bi;n=zi;var r=32-ci(i)-1;i&=~(1<<r),t+=1;var s=32-ci(e)+r;if(30<s){var o=r-r%5;s=(i&(1<<o)-1).toString(32),i>>=o,r-=o,Bi=1<<32-ci(e)+r|t<<r|i,zi=s+n}else Bi=1<<s|t<<r|i,zi=n}function fp(n){n.return!==null&&(Xr(n,1),gv(n,1,0))}function dp(n){for(;n===Oc;)Oc=qs[--Ks],qs[Ks]=null,kc=qs[--Ks],qs[Ks]=null;for(;n===is;)is=Wn[--Xn],Wn[Xn]=null,zi=Wn[--Xn],Wn[Xn]=null,Bi=Wn[--Xn],Wn[Xn]=null}var Un=null,Nn=null,At=!1,ii=null;function _v(n,e){var t=jn(5,null,null,0);t.elementType="DELETED",t.stateNode=e,t.return=n,e=n.deletions,e===null?(n.deletions=[t],n.flags|=16):e.push(t)}function qm(n,e){switch(n.tag){case 5:var t=n.type;return e=e.nodeType!==1||t.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(n.stateNode=e,Un=n,Nn=yr(e.firstChild),!0):!1;case 6:return e=n.pendingProps===""||e.nodeType!==3?null:e,e!==null?(n.stateNode=e,Un=n,Nn=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(t=is!==null?{id:Bi,overflow:zi}:null,n.memoizedState={dehydrated:e,treeContext:t,retryLane:1073741824},t=jn(18,null,null,0),t.stateNode=e,t.return=n,n.child=t,Un=n,Nn=null,!0):!1;default:return!1}}function Ad(n){return(n.mode&1)!==0&&(n.flags&128)===0}function bd(n){if(At){var e=Nn;if(e){var t=e;if(!qm(n,e)){if(Ad(n))throw Error(ie(418));e=yr(t.nextSibling);var i=Un;e&&qm(n,e)?_v(i,t):(n.flags=n.flags&-4097|2,At=!1,Un=n)}}else{if(Ad(n))throw Error(ie(418));n.flags=n.flags&-4097|2,At=!1,Un=n}}}function Km(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;Un=n}function al(n){if(n!==Un)return!1;if(!At)return Km(n),At=!0,!1;var e;if((e=n.tag!==3)&&!(e=n.tag!==5)&&(e=n.type,e=e!=="head"&&e!=="body"&&!Md(n.type,n.memoizedProps)),e&&(e=Nn)){if(Ad(n))throw vv(),Error(ie(418));for(;e;)_v(n,e),e=yr(e.nextSibling)}if(Km(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(ie(317));e:{for(n=n.nextSibling,e=0;n;){if(n.nodeType===8){var t=n.data;if(t==="/$"){if(e===0){Nn=yr(n.nextSibling);break e}e--}else t!=="$"&&t!=="$!"&&t!=="$?"||e++}n=n.nextSibling}Nn=null}}else Nn=Un?yr(n.stateNode.nextSibling):null;return!0}function vv(){for(var n=Nn;n;)n=yr(n.nextSibling)}function po(){Nn=Un=null,At=!1}function hp(n){ii===null?ii=[n]:ii.push(n)}var mM=Zi.ReactCurrentBatchConfig;function Fo(n,e,t){if(n=t.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(t._owner){if(t=t._owner,t){if(t.tag!==1)throw Error(ie(309));var i=t.stateNode}if(!i)throw Error(ie(147,n));var r=i,s=""+n;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(o){var c=r.refs;o===null?delete c[s]:c[s]=o},e._stringRef=s,e)}if(typeof n!="string")throw Error(ie(284));if(!t._owner)throw Error(ie(290,n))}return n}function ll(n,e){throw n=Object.prototype.toString.call(e),Error(ie(31,n==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":n))}function Zm(n){var e=n._init;return e(n._payload)}function xv(n){function e(p,_){if(n){var x=p.deletions;x===null?(p.deletions=[_],p.flags|=16):x.push(_)}}function t(p,_){if(!n)return null;for(;_!==null;)e(p,_),_=_.sibling;return null}function i(p,_){for(p=new Map;_!==null;)_.key!==null?p.set(_.key,_):p.set(_.index,_),_=_.sibling;return p}function r(p,_){return p=Er(p,_),p.index=0,p.sibling=null,p}function s(p,_,x){return p.index=x,n?(x=p.alternate,x!==null?(x=x.index,x<_?(p.flags|=2,_):x):(p.flags|=2,_)):(p.flags|=1048576,_)}function o(p){return n&&p.alternate===null&&(p.flags|=2),p}function c(p,_,x,S){return _===null||_.tag!==6?(_=ef(x,p.mode,S),_.return=p,_):(_=r(_,x),_.return=p,_)}function l(p,_,x,S){var A=x.type;return A===Gs?d(p,_,x.props.children,S,x.key):_!==null&&(_.elementType===A||typeof A=="object"&&A!==null&&A.$$typeof===lr&&Zm(A)===_.type)?(S=r(_,x.props),S.ref=Fo(p,_,x),S.return=p,S):(S=mc(x.type,x.key,x.props,null,p.mode,S),S.ref=Fo(p,_,x),S.return=p,S)}function u(p,_,x,S){return _===null||_.tag!==4||_.stateNode.containerInfo!==x.containerInfo||_.stateNode.implementation!==x.implementation?(_=tf(x,p.mode,S),_.return=p,_):(_=r(_,x.children||[]),_.return=p,_)}function d(p,_,x,S,A){return _===null||_.tag!==7?(_=ts(x,p.mode,S,A),_.return=p,_):(_=r(_,x),_.return=p,_)}function a(p,_,x){if(typeof _=="string"&&_!==""||typeof _=="number")return _=ef(""+_,p.mode,x),_.return=p,_;if(typeof _=="object"&&_!==null){switch(_.$$typeof){case Za:return x=mc(_.type,_.key,_.props,null,p.mode,x),x.ref=Fo(p,null,_),x.return=p,x;case Hs:return _=tf(_,p.mode,x),_.return=p,_;case lr:var S=_._init;return a(p,S(_._payload),x)}if(Jo(_)||Lo(_))return _=ts(_,p.mode,x,null),_.return=p,_;ll(p,_)}return null}function f(p,_,x,S){var A=_!==null?_.key:null;if(typeof x=="string"&&x!==""||typeof x=="number")return A!==null?null:c(p,_,""+x,S);if(typeof x=="object"&&x!==null){switch(x.$$typeof){case Za:return x.key===A?l(p,_,x,S):null;case Hs:return x.key===A?u(p,_,x,S):null;case lr:return A=x._init,f(p,_,A(x._payload),S)}if(Jo(x)||Lo(x))return A!==null?null:d(p,_,x,S,null);ll(p,x)}return null}function h(p,_,x,S,A){if(typeof S=="string"&&S!==""||typeof S=="number")return p=p.get(x)||null,c(_,p,""+S,A);if(typeof S=="object"&&S!==null){switch(S.$$typeof){case Za:return p=p.get(S.key===null?x:S.key)||null,l(_,p,S,A);case Hs:return p=p.get(S.key===null?x:S.key)||null,u(_,p,S,A);case lr:var M=S._init;return h(p,_,x,M(S._payload),A)}if(Jo(S)||Lo(S))return p=p.get(x)||null,d(_,p,S,A,null);ll(_,S)}return null}function m(p,_,x,S){for(var A=null,M=null,T=_,y=_=0,E=null;T!==null&&y<x.length;y++){T.index>y?(E=T,T=null):E=T.sibling;var D=f(p,T,x[y],S);if(D===null){T===null&&(T=E);break}n&&T&&D.alternate===null&&e(p,T),_=s(D,_,y),M===null?A=D:M.sibling=D,M=D,T=E}if(y===x.length)return t(p,T),At&&Xr(p,y),A;if(T===null){for(;y<x.length;y++)T=a(p,x[y],S),T!==null&&(_=s(T,_,y),M===null?A=T:M.sibling=T,M=T);return At&&Xr(p,y),A}for(T=i(p,T);y<x.length;y++)E=h(T,p,y,x[y],S),E!==null&&(n&&E.alternate!==null&&T.delete(E.key===null?y:E.key),_=s(E,_,y),M===null?A=E:M.sibling=E,M=E);return n&&T.forEach(function(C){return e(p,C)}),At&&Xr(p,y),A}function v(p,_,x,S){var A=Lo(x);if(typeof A!="function")throw Error(ie(150));if(x=A.call(x),x==null)throw Error(ie(151));for(var M=A=null,T=_,y=_=0,E=null,D=x.next();T!==null&&!D.done;y++,D=x.next()){T.index>y?(E=T,T=null):E=T.sibling;var C=f(p,T,D.value,S);if(C===null){T===null&&(T=E);break}n&&T&&C.alternate===null&&e(p,T),_=s(C,_,y),M===null?A=C:M.sibling=C,M=C,T=E}if(D.done)return t(p,T),At&&Xr(p,y),A;if(T===null){for(;!D.done;y++,D=x.next())D=a(p,D.value,S),D!==null&&(_=s(D,_,y),M===null?A=D:M.sibling=D,M=D);return At&&Xr(p,y),A}for(T=i(p,T);!D.done;y++,D=x.next())D=h(T,p,y,D.value,S),D!==null&&(n&&D.alternate!==null&&T.delete(D.key===null?y:D.key),_=s(D,_,y),M===null?A=D:M.sibling=D,M=D);return n&&T.forEach(function(F){return e(p,F)}),At&&Xr(p,y),A}function g(p,_,x,S){if(typeof x=="object"&&x!==null&&x.type===Gs&&x.key===null&&(x=x.props.children),typeof x=="object"&&x!==null){switch(x.$$typeof){case Za:e:{for(var A=x.key,M=_;M!==null;){if(M.key===A){if(A=x.type,A===Gs){if(M.tag===7){t(p,M.sibling),_=r(M,x.props.children),_.return=p,p=_;break e}}else if(M.elementType===A||typeof A=="object"&&A!==null&&A.$$typeof===lr&&Zm(A)===M.type){t(p,M.sibling),_=r(M,x.props),_.ref=Fo(p,M,x),_.return=p,p=_;break e}t(p,M);break}else e(p,M);M=M.sibling}x.type===Gs?(_=ts(x.props.children,p.mode,S,x.key),_.return=p,p=_):(S=mc(x.type,x.key,x.props,null,p.mode,S),S.ref=Fo(p,_,x),S.return=p,p=S)}return o(p);case Hs:e:{for(M=x.key;_!==null;){if(_.key===M)if(_.tag===4&&_.stateNode.containerInfo===x.containerInfo&&_.stateNode.implementation===x.implementation){t(p,_.sibling),_=r(_,x.children||[]),_.return=p,p=_;break e}else{t(p,_);break}else e(p,_);_=_.sibling}_=tf(x,p.mode,S),_.return=p,p=_}return o(p);case lr:return M=x._init,g(p,_,M(x._payload),S)}if(Jo(x))return m(p,_,x,S);if(Lo(x))return v(p,_,x,S);ll(p,x)}return typeof x=="string"&&x!==""||typeof x=="number"?(x=""+x,_!==null&&_.tag===6?(t(p,_.sibling),_=r(_,x),_.return=p,p=_):(t(p,_),_=ef(x,p.mode,S),_.return=p,p=_),o(p)):t(p,_)}return g}var mo=xv(!0),yv=xv(!1),Bc=Lr(null),zc=null,Zs=null,pp=null;function mp(){pp=Zs=zc=null}function gp(n){var e=Bc.current;Et(Bc),n._currentValue=e}function Cd(n,e,t){for(;n!==null;){var i=n.alternate;if((n.childLanes&e)!==e?(n.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),n===t)break;n=n.return}}function so(n,e){zc=n,pp=Zs=null,n=n.dependencies,n!==null&&n.firstContext!==null&&(n.lanes&e&&(yn=!0),n.firstContext=null)}function Yn(n){var e=n._currentValue;if(pp!==n)if(n={context:n,memoizedValue:e,next:null},Zs===null){if(zc===null)throw Error(ie(308));Zs=n,zc.dependencies={lanes:0,firstContext:n}}else Zs=Zs.next=n;return e}var Kr=null;function _p(n){Kr===null?Kr=[n]:Kr.push(n)}function Sv(n,e,t,i){var r=e.interleaved;return r===null?(t.next=t,_p(e)):(t.next=r.next,r.next=t),e.interleaved=t,$i(n,i)}function $i(n,e){n.lanes|=e;var t=n.alternate;for(t!==null&&(t.lanes|=e),t=n,n=n.return;n!==null;)n.childLanes|=e,t=n.alternate,t!==null&&(t.childLanes|=e),t=n,n=n.return;return t.tag===3?t.stateNode:null}var cr=!1;function vp(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Mv(n,e){n=n.updateQueue,e.updateQueue===n&&(e.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function Hi(n,e){return{eventTime:n,lane:e,tag:0,payload:null,callback:null,next:null}}function Sr(n,e,t){var i=n.updateQueue;if(i===null)return null;if(i=i.shared,tt&2){var r=i.pending;return r===null?e.next=e:(e.next=r.next,r.next=e),i.pending=e,$i(n,t)}return r=i.interleaved,r===null?(e.next=e,_p(i)):(e.next=r.next,r.next=e),i.interleaved=e,$i(n,t)}function cc(n,e,t){if(e=e.updateQueue,e!==null&&(e=e.shared,(t&4194240)!==0)){var i=e.lanes;i&=n.pendingLanes,t|=i,e.lanes=t,ip(n,t)}}function Qm(n,e){var t=n.updateQueue,i=n.alternate;if(i!==null&&(i=i.updateQueue,t===i)){var r=null,s=null;if(t=t.firstBaseUpdate,t!==null){do{var o={eventTime:t.eventTime,lane:t.lane,tag:t.tag,payload:t.payload,callback:t.callback,next:null};s===null?r=s=o:s=s.next=o,t=t.next}while(t!==null);s===null?r=s=e:s=s.next=e}else r=s=e;t={baseState:i.baseState,firstBaseUpdate:r,lastBaseUpdate:s,shared:i.shared,effects:i.effects},n.updateQueue=t;return}n=t.lastBaseUpdate,n===null?t.firstBaseUpdate=e:n.next=e,t.lastBaseUpdate=e}function Vc(n,e,t,i){var r=n.updateQueue;cr=!1;var s=r.firstBaseUpdate,o=r.lastBaseUpdate,c=r.shared.pending;if(c!==null){r.shared.pending=null;var l=c,u=l.next;l.next=null,o===null?s=u:o.next=u,o=l;var d=n.alternate;d!==null&&(d=d.updateQueue,c=d.lastBaseUpdate,c!==o&&(c===null?d.firstBaseUpdate=u:c.next=u,d.lastBaseUpdate=l))}if(s!==null){var a=r.baseState;o=0,d=u=l=null,c=s;do{var f=c.lane,h=c.eventTime;if((i&f)===f){d!==null&&(d=d.next={eventTime:h,lane:0,tag:c.tag,payload:c.payload,callback:c.callback,next:null});e:{var m=n,v=c;switch(f=e,h=t,v.tag){case 1:if(m=v.payload,typeof m=="function"){a=m.call(h,a,f);break e}a=m;break e;case 3:m.flags=m.flags&-65537|128;case 0:if(m=v.payload,f=typeof m=="function"?m.call(h,a,f):m,f==null)break e;a=Rt({},a,f);break e;case 2:cr=!0}}c.callback!==null&&c.lane!==0&&(n.flags|=64,f=r.effects,f===null?r.effects=[c]:f.push(c))}else h={eventTime:h,lane:f,tag:c.tag,payload:c.payload,callback:c.callback,next:null},d===null?(u=d=h,l=a):d=d.next=h,o|=f;if(c=c.next,c===null){if(c=r.shared.pending,c===null)break;f=c,c=f.next,f.next=null,r.lastBaseUpdate=f,r.shared.pending=null}}while(!0);if(d===null&&(l=a),r.baseState=l,r.firstBaseUpdate=u,r.lastBaseUpdate=d,e=r.shared.interleaved,e!==null){r=e;do o|=r.lane,r=r.next;while(r!==e)}else s===null&&(r.shared.lanes=0);ss|=o,n.lanes=o,n.memoizedState=a}}function Jm(n,e,t){if(n=e.effects,e.effects=null,n!==null)for(e=0;e<n.length;e++){var i=n[e],r=i.callback;if(r!==null){if(i.callback=null,i=t,typeof r!="function")throw Error(ie(191,r));r.call(i)}}}var Ga={},Mi=Lr(Ga),ba=Lr(Ga),Ca=Lr(Ga);function Zr(n){if(n===Ga)throw Error(ie(174));return n}function xp(n,e){switch(yt(Ca,e),yt(ba,n),yt(Mi,Ga),n=e.nodeType,n){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:ld(null,"");break;default:n=n===8?e.parentNode:e,e=n.namespaceURI||null,n=n.tagName,e=ld(e,n)}Et(Mi),yt(Mi,e)}function go(){Et(Mi),Et(ba),Et(Ca)}function wv(n){Zr(Ca.current);var e=Zr(Mi.current),t=ld(e,n.type);e!==t&&(yt(ba,n),yt(Mi,t))}function yp(n){ba.current===n&&(Et(Mi),Et(ba))}var bt=Lr(0);function Hc(n){for(var e=n;e!==null;){if(e.tag===13){var t=e.memoizedState;if(t!==null&&(t=t.dehydrated,t===null||t.data==="$?"||t.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===n)break;for(;e.sibling===null;){if(e.return===null||e.return===n)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var Yu=[];function Sp(){for(var n=0;n<Yu.length;n++)Yu[n]._workInProgressVersionPrimary=null;Yu.length=0}var uc=Zi.ReactCurrentDispatcher,qu=Zi.ReactCurrentBatchConfig,rs=0,Ct=null,Bt=null,Xt=null,Gc=!1,ua=!1,Ra=0,gM=0;function tn(){throw Error(ie(321))}function Mp(n,e){if(e===null)return!1;for(var t=0;t<e.length&&t<n.length;t++)if(!fi(n[t],e[t]))return!1;return!0}function wp(n,e,t,i,r,s){if(rs=s,Ct=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,uc.current=n===null||n.memoizedState===null?yM:SM,n=t(i,r),ua){s=0;do{if(ua=!1,Ra=0,25<=s)throw Error(ie(301));s+=1,Xt=Bt=null,e.updateQueue=null,uc.current=MM,n=t(i,r)}while(ua)}if(uc.current=Wc,e=Bt!==null&&Bt.next!==null,rs=0,Xt=Bt=Ct=null,Gc=!1,e)throw Error(ie(300));return n}function Ep(){var n=Ra!==0;return Ra=0,n}function _i(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Xt===null?Ct.memoizedState=Xt=n:Xt=Xt.next=n,Xt}function qn(){if(Bt===null){var n=Ct.alternate;n=n!==null?n.memoizedState:null}else n=Bt.next;var e=Xt===null?Ct.memoizedState:Xt.next;if(e!==null)Xt=e,Bt=n;else{if(n===null)throw Error(ie(310));Bt=n,n={memoizedState:Bt.memoizedState,baseState:Bt.baseState,baseQueue:Bt.baseQueue,queue:Bt.queue,next:null},Xt===null?Ct.memoizedState=Xt=n:Xt=Xt.next=n}return Xt}function Pa(n,e){return typeof e=="function"?e(n):e}function Ku(n){var e=qn(),t=e.queue;if(t===null)throw Error(ie(311));t.lastRenderedReducer=n;var i=Bt,r=i.baseQueue,s=t.pending;if(s!==null){if(r!==null){var o=r.next;r.next=s.next,s.next=o}i.baseQueue=r=s,t.pending=null}if(r!==null){s=r.next,i=i.baseState;var c=o=null,l=null,u=s;do{var d=u.lane;if((rs&d)===d)l!==null&&(l=l.next={lane:0,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),i=u.hasEagerState?u.eagerState:n(i,u.action);else{var a={lane:d,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null};l===null?(c=l=a,o=i):l=l.next=a,Ct.lanes|=d,ss|=d}u=u.next}while(u!==null&&u!==s);l===null?o=i:l.next=c,fi(i,e.memoizedState)||(yn=!0),e.memoizedState=i,e.baseState=o,e.baseQueue=l,t.lastRenderedState=i}if(n=t.interleaved,n!==null){r=n;do s=r.lane,Ct.lanes|=s,ss|=s,r=r.next;while(r!==n)}else r===null&&(t.lanes=0);return[e.memoizedState,t.dispatch]}function Zu(n){var e=qn(),t=e.queue;if(t===null)throw Error(ie(311));t.lastRenderedReducer=n;var i=t.dispatch,r=t.pending,s=e.memoizedState;if(r!==null){t.pending=null;var o=r=r.next;do s=n(s,o.action),o=o.next;while(o!==r);fi(s,e.memoizedState)||(yn=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),t.lastRenderedState=s}return[s,i]}function Ev(){}function Tv(n,e){var t=Ct,i=qn(),r=e(),s=!fi(i.memoizedState,r);if(s&&(i.memoizedState=r,yn=!0),i=i.queue,Tp(Cv.bind(null,t,i,n),[n]),i.getSnapshot!==e||s||Xt!==null&&Xt.memoizedState.tag&1){if(t.flags|=2048,La(9,bv.bind(null,t,i,r,e),void 0,null),jt===null)throw Error(ie(349));rs&30||Av(t,e,r)}return r}function Av(n,e,t){n.flags|=16384,n={getSnapshot:e,value:t},e=Ct.updateQueue,e===null?(e={lastEffect:null,stores:null},Ct.updateQueue=e,e.stores=[n]):(t=e.stores,t===null?e.stores=[n]:t.push(n))}function bv(n,e,t,i){e.value=t,e.getSnapshot=i,Rv(e)&&Pv(n)}function Cv(n,e,t){return t(function(){Rv(e)&&Pv(n)})}function Rv(n){var e=n.getSnapshot;n=n.value;try{var t=e();return!fi(n,t)}catch{return!0}}function Pv(n){var e=$i(n,1);e!==null&&ui(e,n,1,-1)}function eg(n){var e=_i();return typeof n=="function"&&(n=n()),e.memoizedState=e.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Pa,lastRenderedState:n},e.queue=n,n=n.dispatch=xM.bind(null,Ct,n),[e.memoizedState,n]}function La(n,e,t,i){return n={tag:n,create:e,destroy:t,deps:i,next:null},e=Ct.updateQueue,e===null?(e={lastEffect:null,stores:null},Ct.updateQueue=e,e.lastEffect=n.next=n):(t=e.lastEffect,t===null?e.lastEffect=n.next=n:(i=t.next,t.next=n,n.next=i,e.lastEffect=n)),n}function Lv(){return qn().memoizedState}function fc(n,e,t,i){var r=_i();Ct.flags|=n,r.memoizedState=La(1|e,t,void 0,i===void 0?null:i)}function fu(n,e,t,i){var r=qn();i=i===void 0?null:i;var s=void 0;if(Bt!==null){var o=Bt.memoizedState;if(s=o.destroy,i!==null&&Mp(i,o.deps)){r.memoizedState=La(e,t,s,i);return}}Ct.flags|=n,r.memoizedState=La(1|e,t,s,i)}function tg(n,e){return fc(8390656,8,n,e)}function Tp(n,e){return fu(2048,8,n,e)}function Dv(n,e){return fu(4,2,n,e)}function Iv(n,e){return fu(4,4,n,e)}function Nv(n,e){if(typeof e=="function")return n=n(),e(n),function(){e(null)};if(e!=null)return n=n(),e.current=n,function(){e.current=null}}function Uv(n,e,t){return t=t!=null?t.concat([n]):null,fu(4,4,Nv.bind(null,e,n),t)}function Ap(){}function Fv(n,e){var t=qn();e=e===void 0?null:e;var i=t.memoizedState;return i!==null&&e!==null&&Mp(e,i[1])?i[0]:(t.memoizedState=[n,e],n)}function Ov(n,e){var t=qn();e=e===void 0?null:e;var i=t.memoizedState;return i!==null&&e!==null&&Mp(e,i[1])?i[0]:(n=n(),t.memoizedState=[n,e],n)}function kv(n,e,t){return rs&21?(fi(t,e)||(t=G0(),Ct.lanes|=t,ss|=t,n.baseState=!0),e):(n.baseState&&(n.baseState=!1,yn=!0),n.memoizedState=t)}function _M(n,e){var t=ft;ft=t!==0&&4>t?t:4,n(!0);var i=qu.transition;qu.transition={};try{n(!1),e()}finally{ft=t,qu.transition=i}}function Bv(){return qn().memoizedState}function vM(n,e,t){var i=wr(n);if(t={lane:i,action:t,hasEagerState:!1,eagerState:null,next:null},zv(n))Vv(e,t);else if(t=Sv(n,e,t,i),t!==null){var r=hn();ui(t,n,i,r),Hv(t,e,i)}}function xM(n,e,t){var i=wr(n),r={lane:i,action:t,hasEagerState:!1,eagerState:null,next:null};if(zv(n))Vv(e,r);else{var s=n.alternate;if(n.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var o=e.lastRenderedState,c=s(o,t);if(r.hasEagerState=!0,r.eagerState=c,fi(c,o)){var l=e.interleaved;l===null?(r.next=r,_p(e)):(r.next=l.next,l.next=r),e.interleaved=r;return}}catch{}finally{}t=Sv(n,e,r,i),t!==null&&(r=hn(),ui(t,n,i,r),Hv(t,e,i))}}function zv(n){var e=n.alternate;return n===Ct||e!==null&&e===Ct}function Vv(n,e){ua=Gc=!0;var t=n.pending;t===null?e.next=e:(e.next=t.next,t.next=e),n.pending=e}function Hv(n,e,t){if(t&4194240){var i=e.lanes;i&=n.pendingLanes,t|=i,e.lanes=t,ip(n,t)}}var Wc={readContext:Yn,useCallback:tn,useContext:tn,useEffect:tn,useImperativeHandle:tn,useInsertionEffect:tn,useLayoutEffect:tn,useMemo:tn,useReducer:tn,useRef:tn,useState:tn,useDebugValue:tn,useDeferredValue:tn,useTransition:tn,useMutableSource:tn,useSyncExternalStore:tn,useId:tn,unstable_isNewReconciler:!1},yM={readContext:Yn,useCallback:function(n,e){return _i().memoizedState=[n,e===void 0?null:e],n},useContext:Yn,useEffect:tg,useImperativeHandle:function(n,e,t){return t=t!=null?t.concat([n]):null,fc(4194308,4,Nv.bind(null,e,n),t)},useLayoutEffect:function(n,e){return fc(4194308,4,n,e)},useInsertionEffect:function(n,e){return fc(4,2,n,e)},useMemo:function(n,e){var t=_i();return e=e===void 0?null:e,n=n(),t.memoizedState=[n,e],n},useReducer:function(n,e,t){var i=_i();return e=t!==void 0?t(e):e,i.memoizedState=i.baseState=e,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:e},i.queue=n,n=n.dispatch=vM.bind(null,Ct,n),[i.memoizedState,n]},useRef:function(n){var e=_i();return n={current:n},e.memoizedState=n},useState:eg,useDebugValue:Ap,useDeferredValue:function(n){return _i().memoizedState=n},useTransition:function(){var n=eg(!1),e=n[0];return n=_M.bind(null,n[1]),_i().memoizedState=n,[e,n]},useMutableSource:function(){},useSyncExternalStore:function(n,e,t){var i=Ct,r=_i();if(At){if(t===void 0)throw Error(ie(407));t=t()}else{if(t=e(),jt===null)throw Error(ie(349));rs&30||Av(i,e,t)}r.memoizedState=t;var s={value:t,getSnapshot:e};return r.queue=s,tg(Cv.bind(null,i,s,n),[n]),i.flags|=2048,La(9,bv.bind(null,i,s,t,e),void 0,null),t},useId:function(){var n=_i(),e=jt.identifierPrefix;if(At){var t=zi,i=Bi;t=(i&~(1<<32-ci(i)-1)).toString(32)+t,e=":"+e+"R"+t,t=Ra++,0<t&&(e+="H"+t.toString(32)),e+=":"}else t=gM++,e=":"+e+"r"+t.toString(32)+":";return n.memoizedState=e},unstable_isNewReconciler:!1},SM={readContext:Yn,useCallback:Fv,useContext:Yn,useEffect:Tp,useImperativeHandle:Uv,useInsertionEffect:Dv,useLayoutEffect:Iv,useMemo:Ov,useReducer:Ku,useRef:Lv,useState:function(){return Ku(Pa)},useDebugValue:Ap,useDeferredValue:function(n){var e=qn();return kv(e,Bt.memoizedState,n)},useTransition:function(){var n=Ku(Pa)[0],e=qn().memoizedState;return[n,e]},useMutableSource:Ev,useSyncExternalStore:Tv,useId:Bv,unstable_isNewReconciler:!1},MM={readContext:Yn,useCallback:Fv,useContext:Yn,useEffect:Tp,useImperativeHandle:Uv,useInsertionEffect:Dv,useLayoutEffect:Iv,useMemo:Ov,useReducer:Zu,useRef:Lv,useState:function(){return Zu(Pa)},useDebugValue:Ap,useDeferredValue:function(n){var e=qn();return Bt===null?e.memoizedState=n:kv(e,Bt.memoizedState,n)},useTransition:function(){var n=Zu(Pa)[0],e=qn().memoizedState;return[n,e]},useMutableSource:Ev,useSyncExternalStore:Tv,useId:Bv,unstable_isNewReconciler:!1};function ti(n,e){if(n&&n.defaultProps){e=Rt({},e),n=n.defaultProps;for(var t in n)e[t]===void 0&&(e[t]=n[t]);return e}return e}function Rd(n,e,t,i){e=n.memoizedState,t=t(i,e),t=t==null?e:Rt({},e,t),n.memoizedState=t,n.lanes===0&&(n.updateQueue.baseState=t)}var du={isMounted:function(n){return(n=n._reactInternals)?cs(n)===n:!1},enqueueSetState:function(n,e,t){n=n._reactInternals;var i=hn(),r=wr(n),s=Hi(i,r);s.payload=e,t!=null&&(s.callback=t),e=Sr(n,s,r),e!==null&&(ui(e,n,r,i),cc(e,n,r))},enqueueReplaceState:function(n,e,t){n=n._reactInternals;var i=hn(),r=wr(n),s=Hi(i,r);s.tag=1,s.payload=e,t!=null&&(s.callback=t),e=Sr(n,s,r),e!==null&&(ui(e,n,r,i),cc(e,n,r))},enqueueForceUpdate:function(n,e){n=n._reactInternals;var t=hn(),i=wr(n),r=Hi(t,i);r.tag=2,e!=null&&(r.callback=e),e=Sr(n,r,i),e!==null&&(ui(e,n,i,t),cc(e,n,i))}};function ng(n,e,t,i,r,s,o){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(i,s,o):e.prototype&&e.prototype.isPureReactComponent?!wa(t,i)||!wa(r,s):!0}function Gv(n,e,t){var i=!1,r=Ar,s=e.contextType;return typeof s=="object"&&s!==null?s=Yn(s):(r=Mn(e)?ns:cn.current,i=e.contextTypes,s=(i=i!=null)?ho(n,r):Ar),e=new e(t,s),n.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=du,n.stateNode=e,e._reactInternals=n,i&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=r,n.__reactInternalMemoizedMaskedChildContext=s),e}function ig(n,e,t,i){n=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(t,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(t,i),e.state!==n&&du.enqueueReplaceState(e,e.state,null)}function Pd(n,e,t,i){var r=n.stateNode;r.props=t,r.state=n.memoizedState,r.refs={},vp(n);var s=e.contextType;typeof s=="object"&&s!==null?r.context=Yn(s):(s=Mn(e)?ns:cn.current,r.context=ho(n,s)),r.state=n.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(Rd(n,e,s,t),r.state=n.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(e=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),e!==r.state&&du.enqueueReplaceState(r,r.state,null),Vc(n,t,r,i),r.state=n.memoizedState),typeof r.componentDidMount=="function"&&(n.flags|=4194308)}function _o(n,e){try{var t="",i=e;do t+=Ky(i),i=i.return;while(i);var r=t}catch(s){r=`
Error generating stack: `+s.message+`
`+s.stack}return{value:n,source:e,stack:r,digest:null}}function Qu(n,e,t){return{value:n,source:null,stack:t??null,digest:e??null}}function Ld(n,e){try{console.error(e.value)}catch(t){setTimeout(function(){throw t})}}var wM=typeof WeakMap=="function"?WeakMap:Map;function Wv(n,e,t){t=Hi(-1,t),t.tag=3,t.payload={element:null};var i=e.value;return t.callback=function(){jc||(jc=!0,Vd=i),Ld(n,e)},t}function Xv(n,e,t){t=Hi(-1,t),t.tag=3;var i=n.type.getDerivedStateFromError;if(typeof i=="function"){var r=e.value;t.payload=function(){return i(r)},t.callback=function(){Ld(n,e)}}var s=n.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(t.callback=function(){Ld(n,e),typeof i!="function"&&(Mr===null?Mr=new Set([this]):Mr.add(this));var o=e.stack;this.componentDidCatch(e.value,{componentStack:o!==null?o:""})}),t}function rg(n,e,t){var i=n.pingCache;if(i===null){i=n.pingCache=new wM;var r=new Set;i.set(e,r)}else r=i.get(e),r===void 0&&(r=new Set,i.set(e,r));r.has(t)||(r.add(t),n=OM.bind(null,n,e,t),e.then(n,n))}function sg(n){do{var e;if((e=n.tag===13)&&(e=n.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return n;n=n.return}while(n!==null);return null}function og(n,e,t,i,r){return n.mode&1?(n.flags|=65536,n.lanes=r,n):(n===e?n.flags|=65536:(n.flags|=128,t.flags|=131072,t.flags&=-52805,t.tag===1&&(t.alternate===null?t.tag=17:(e=Hi(-1,1),e.tag=2,Sr(t,e,1))),t.lanes|=1),n)}var EM=Zi.ReactCurrentOwner,yn=!1;function dn(n,e,t,i){e.child=n===null?yv(e,null,t,i):mo(e,n.child,t,i)}function ag(n,e,t,i,r){t=t.render;var s=e.ref;return so(e,r),i=wp(n,e,t,i,s,r),t=Ep(),n!==null&&!yn?(e.updateQueue=n.updateQueue,e.flags&=-2053,n.lanes&=~r,Yi(n,e,r)):(At&&t&&fp(e),e.flags|=1,dn(n,e,i,r),e.child)}function lg(n,e,t,i,r){if(n===null){var s=t.type;return typeof s=="function"&&!Np(s)&&s.defaultProps===void 0&&t.compare===null&&t.defaultProps===void 0?(e.tag=15,e.type=s,jv(n,e,s,i,r)):(n=mc(t.type,null,i,e,e.mode,r),n.ref=e.ref,n.return=e,e.child=n)}if(s=n.child,!(n.lanes&r)){var o=s.memoizedProps;if(t=t.compare,t=t!==null?t:wa,t(o,i)&&n.ref===e.ref)return Yi(n,e,r)}return e.flags|=1,n=Er(s,i),n.ref=e.ref,n.return=e,e.child=n}function jv(n,e,t,i,r){if(n!==null){var s=n.memoizedProps;if(wa(s,i)&&n.ref===e.ref)if(yn=!1,e.pendingProps=i=s,(n.lanes&r)!==0)n.flags&131072&&(yn=!0);else return e.lanes=n.lanes,Yi(n,e,r)}return Dd(n,e,t,i,r)}function $v(n,e,t){var i=e.pendingProps,r=i.children,s=n!==null?n.memoizedState:null;if(i.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},yt(Js,Pn),Pn|=t;else{if(!(t&1073741824))return n=s!==null?s.baseLanes|t:t,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:n,cachePool:null,transitions:null},e.updateQueue=null,yt(Js,Pn),Pn|=n,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=s!==null?s.baseLanes:t,yt(Js,Pn),Pn|=i}else s!==null?(i=s.baseLanes|t,e.memoizedState=null):i=t,yt(Js,Pn),Pn|=i;return dn(n,e,r,t),e.child}function Yv(n,e){var t=e.ref;(n===null&&t!==null||n!==null&&n.ref!==t)&&(e.flags|=512,e.flags|=2097152)}function Dd(n,e,t,i,r){var s=Mn(t)?ns:cn.current;return s=ho(e,s),so(e,r),t=wp(n,e,t,i,s,r),i=Ep(),n!==null&&!yn?(e.updateQueue=n.updateQueue,e.flags&=-2053,n.lanes&=~r,Yi(n,e,r)):(At&&i&&fp(e),e.flags|=1,dn(n,e,t,r),e.child)}function cg(n,e,t,i,r){if(Mn(t)){var s=!0;Fc(e)}else s=!1;if(so(e,r),e.stateNode===null)dc(n,e),Gv(e,t,i),Pd(e,t,i,r),i=!0;else if(n===null){var o=e.stateNode,c=e.memoizedProps;o.props=c;var l=o.context,u=t.contextType;typeof u=="object"&&u!==null?u=Yn(u):(u=Mn(t)?ns:cn.current,u=ho(e,u));var d=t.getDerivedStateFromProps,a=typeof d=="function"||typeof o.getSnapshotBeforeUpdate=="function";a||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(c!==i||l!==u)&&ig(e,o,i,u),cr=!1;var f=e.memoizedState;o.state=f,Vc(e,i,o,r),l=e.memoizedState,c!==i||f!==l||Sn.current||cr?(typeof d=="function"&&(Rd(e,t,d,i),l=e.memoizedState),(c=cr||ng(e,t,c,i,f,l,u))?(a||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(e.flags|=4194308)):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=l),o.props=i,o.state=l,o.context=u,i=c):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{o=e.stateNode,Mv(n,e),c=e.memoizedProps,u=e.type===e.elementType?c:ti(e.type,c),o.props=u,a=e.pendingProps,f=o.context,l=t.contextType,typeof l=="object"&&l!==null?l=Yn(l):(l=Mn(t)?ns:cn.current,l=ho(e,l));var h=t.getDerivedStateFromProps;(d=typeof h=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(c!==a||f!==l)&&ig(e,o,i,l),cr=!1,f=e.memoizedState,o.state=f,Vc(e,i,o,r);var m=e.memoizedState;c!==a||f!==m||Sn.current||cr?(typeof h=="function"&&(Rd(e,t,h,i),m=e.memoizedState),(u=cr||ng(e,t,u,i,f,m,l)||!1)?(d||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(i,m,l),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(i,m,l)),typeof o.componentDidUpdate=="function"&&(e.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof o.componentDidUpdate!="function"||c===n.memoizedProps&&f===n.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||c===n.memoizedProps&&f===n.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=m),o.props=i,o.state=m,o.context=l,i=u):(typeof o.componentDidUpdate!="function"||c===n.memoizedProps&&f===n.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||c===n.memoizedProps&&f===n.memoizedState||(e.flags|=1024),i=!1)}return Id(n,e,t,i,s,r)}function Id(n,e,t,i,r,s){Yv(n,e);var o=(e.flags&128)!==0;if(!i&&!o)return r&&Ym(e,t,!1),Yi(n,e,s);i=e.stateNode,EM.current=e;var c=o&&typeof t.getDerivedStateFromError!="function"?null:i.render();return e.flags|=1,n!==null&&o?(e.child=mo(e,n.child,null,s),e.child=mo(e,null,c,s)):dn(n,e,c,s),e.memoizedState=i.state,r&&Ym(e,t,!0),e.child}function qv(n){var e=n.stateNode;e.pendingContext?$m(n,e.pendingContext,e.pendingContext!==e.context):e.context&&$m(n,e.context,!1),xp(n,e.containerInfo)}function ug(n,e,t,i,r){return po(),hp(r),e.flags|=256,dn(n,e,t,i),e.child}var Nd={dehydrated:null,treeContext:null,retryLane:0};function Ud(n){return{baseLanes:n,cachePool:null,transitions:null}}function Kv(n,e,t){var i=e.pendingProps,r=bt.current,s=!1,o=(e.flags&128)!==0,c;if((c=o)||(c=n!==null&&n.memoizedState===null?!1:(r&2)!==0),c?(s=!0,e.flags&=-129):(n===null||n.memoizedState!==null)&&(r|=1),yt(bt,r&1),n===null)return bd(e),n=e.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?(e.mode&1?n.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(o=i.children,n=i.fallback,s?(i=e.mode,s=e.child,o={mode:"hidden",children:o},!(i&1)&&s!==null?(s.childLanes=0,s.pendingProps=o):s=mu(o,i,0,null),n=ts(n,i,t,null),s.return=e,n.return=e,s.sibling=n,e.child=s,e.child.memoizedState=Ud(t),e.memoizedState=Nd,n):bp(e,o));if(r=n.memoizedState,r!==null&&(c=r.dehydrated,c!==null))return TM(n,e,o,i,c,r,t);if(s){s=i.fallback,o=e.mode,r=n.child,c=r.sibling;var l={mode:"hidden",children:i.children};return!(o&1)&&e.child!==r?(i=e.child,i.childLanes=0,i.pendingProps=l,e.deletions=null):(i=Er(r,l),i.subtreeFlags=r.subtreeFlags&14680064),c!==null?s=Er(c,s):(s=ts(s,o,t,null),s.flags|=2),s.return=e,i.return=e,i.sibling=s,e.child=i,i=s,s=e.child,o=n.child.memoizedState,o=o===null?Ud(t):{baseLanes:o.baseLanes|t,cachePool:null,transitions:o.transitions},s.memoizedState=o,s.childLanes=n.childLanes&~t,e.memoizedState=Nd,i}return s=n.child,n=s.sibling,i=Er(s,{mode:"visible",children:i.children}),!(e.mode&1)&&(i.lanes=t),i.return=e,i.sibling=null,n!==null&&(t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)),e.child=i,e.memoizedState=null,i}function bp(n,e){return e=mu({mode:"visible",children:e},n.mode,0,null),e.return=n,n.child=e}function cl(n,e,t,i){return i!==null&&hp(i),mo(e,n.child,null,t),n=bp(e,e.pendingProps.children),n.flags|=2,e.memoizedState=null,n}function TM(n,e,t,i,r,s,o){if(t)return e.flags&256?(e.flags&=-257,i=Qu(Error(ie(422))),cl(n,e,o,i)):e.memoizedState!==null?(e.child=n.child,e.flags|=128,null):(s=i.fallback,r=e.mode,i=mu({mode:"visible",children:i.children},r,0,null),s=ts(s,r,o,null),s.flags|=2,i.return=e,s.return=e,i.sibling=s,e.child=i,e.mode&1&&mo(e,n.child,null,o),e.child.memoizedState=Ud(o),e.memoizedState=Nd,s);if(!(e.mode&1))return cl(n,e,o,null);if(r.data==="$!"){if(i=r.nextSibling&&r.nextSibling.dataset,i)var c=i.dgst;return i=c,s=Error(ie(419)),i=Qu(s,i,void 0),cl(n,e,o,i)}if(c=(o&n.childLanes)!==0,yn||c){if(i=jt,i!==null){switch(o&-o){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(i.suspendedLanes|o)?0:r,r!==0&&r!==s.retryLane&&(s.retryLane=r,$i(n,r),ui(i,n,r,-1))}return Ip(),i=Qu(Error(ie(421))),cl(n,e,o,i)}return r.data==="$?"?(e.flags|=128,e.child=n.child,e=kM.bind(null,n),r._reactRetry=e,null):(n=s.treeContext,Nn=yr(r.nextSibling),Un=e,At=!0,ii=null,n!==null&&(Wn[Xn++]=Bi,Wn[Xn++]=zi,Wn[Xn++]=is,Bi=n.id,zi=n.overflow,is=e),e=bp(e,i.children),e.flags|=4096,e)}function fg(n,e,t){n.lanes|=e;var i=n.alternate;i!==null&&(i.lanes|=e),Cd(n.return,e,t)}function Ju(n,e,t,i,r){var s=n.memoizedState;s===null?n.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:t,tailMode:r}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=i,s.tail=t,s.tailMode=r)}function Zv(n,e,t){var i=e.pendingProps,r=i.revealOrder,s=i.tail;if(dn(n,e,i.children,t),i=bt.current,i&2)i=i&1|2,e.flags|=128;else{if(n!==null&&n.flags&128)e:for(n=e.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&fg(n,t,e);else if(n.tag===19)fg(n,t,e);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break e;for(;n.sibling===null;){if(n.return===null||n.return===e)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}i&=1}if(yt(bt,i),!(e.mode&1))e.memoizedState=null;else switch(r){case"forwards":for(t=e.child,r=null;t!==null;)n=t.alternate,n!==null&&Hc(n)===null&&(r=t),t=t.sibling;t=r,t===null?(r=e.child,e.child=null):(r=t.sibling,t.sibling=null),Ju(e,!1,r,t,s);break;case"backwards":for(t=null,r=e.child,e.child=null;r!==null;){if(n=r.alternate,n!==null&&Hc(n)===null){e.child=r;break}n=r.sibling,r.sibling=t,t=r,r=n}Ju(e,!0,t,null,s);break;case"together":Ju(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function dc(n,e){!(e.mode&1)&&n!==null&&(n.alternate=null,e.alternate=null,e.flags|=2)}function Yi(n,e,t){if(n!==null&&(e.dependencies=n.dependencies),ss|=e.lanes,!(t&e.childLanes))return null;if(n!==null&&e.child!==n.child)throw Error(ie(153));if(e.child!==null){for(n=e.child,t=Er(n,n.pendingProps),e.child=t,t.return=e;n.sibling!==null;)n=n.sibling,t=t.sibling=Er(n,n.pendingProps),t.return=e;t.sibling=null}return e.child}function AM(n,e,t){switch(e.tag){case 3:qv(e),po();break;case 5:wv(e);break;case 1:Mn(e.type)&&Fc(e);break;case 4:xp(e,e.stateNode.containerInfo);break;case 10:var i=e.type._context,r=e.memoizedProps.value;yt(Bc,i._currentValue),i._currentValue=r;break;case 13:if(i=e.memoizedState,i!==null)return i.dehydrated!==null?(yt(bt,bt.current&1),e.flags|=128,null):t&e.child.childLanes?Kv(n,e,t):(yt(bt,bt.current&1),n=Yi(n,e,t),n!==null?n.sibling:null);yt(bt,bt.current&1);break;case 19:if(i=(t&e.childLanes)!==0,n.flags&128){if(i)return Zv(n,e,t);e.flags|=128}if(r=e.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),yt(bt,bt.current),i)break;return null;case 22:case 23:return e.lanes=0,$v(n,e,t)}return Yi(n,e,t)}var Qv,Fd,Jv,ex;Qv=function(n,e){for(var t=e.child;t!==null;){if(t.tag===5||t.tag===6)n.appendChild(t.stateNode);else if(t.tag!==4&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return;t=t.return}t.sibling.return=t.return,t=t.sibling}};Fd=function(){};Jv=function(n,e,t,i){var r=n.memoizedProps;if(r!==i){n=e.stateNode,Zr(Mi.current);var s=null;switch(t){case"input":r=rd(n,r),i=rd(n,i),s=[];break;case"select":r=Rt({},r,{value:void 0}),i=Rt({},i,{value:void 0}),s=[];break;case"textarea":r=ad(n,r),i=ad(n,i),s=[];break;default:typeof r.onClick!="function"&&typeof i.onClick=="function"&&(n.onclick=Nc)}cd(t,i);var o;t=null;for(u in r)if(!i.hasOwnProperty(u)&&r.hasOwnProperty(u)&&r[u]!=null)if(u==="style"){var c=r[u];for(o in c)c.hasOwnProperty(o)&&(t||(t={}),t[o]="")}else u!=="dangerouslySetInnerHTML"&&u!=="children"&&u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&u!=="autoFocus"&&(ga.hasOwnProperty(u)?s||(s=[]):(s=s||[]).push(u,null));for(u in i){var l=i[u];if(c=r!=null?r[u]:void 0,i.hasOwnProperty(u)&&l!==c&&(l!=null||c!=null))if(u==="style")if(c){for(o in c)!c.hasOwnProperty(o)||l&&l.hasOwnProperty(o)||(t||(t={}),t[o]="");for(o in l)l.hasOwnProperty(o)&&c[o]!==l[o]&&(t||(t={}),t[o]=l[o])}else t||(s||(s=[]),s.push(u,t)),t=l;else u==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,c=c?c.__html:void 0,l!=null&&c!==l&&(s=s||[]).push(u,l)):u==="children"?typeof l!="string"&&typeof l!="number"||(s=s||[]).push(u,""+l):u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&(ga.hasOwnProperty(u)?(l!=null&&u==="onScroll"&&wt("scroll",n),s||c===l||(s=[])):(s=s||[]).push(u,l))}t&&(s=s||[]).push("style",t);var u=s;(e.updateQueue=u)&&(e.flags|=4)}};ex=function(n,e,t,i){t!==i&&(e.flags|=4)};function Oo(n,e){if(!At)switch(n.tailMode){case"hidden":e=n.tail;for(var t=null;e!==null;)e.alternate!==null&&(t=e),e=e.sibling;t===null?n.tail=null:t.sibling=null;break;case"collapsed":t=n.tail;for(var i=null;t!==null;)t.alternate!==null&&(i=t),t=t.sibling;i===null?e||n.tail===null?n.tail=null:n.tail.sibling=null:i.sibling=null}}function nn(n){var e=n.alternate!==null&&n.alternate.child===n.child,t=0,i=0;if(e)for(var r=n.child;r!==null;)t|=r.lanes|r.childLanes,i|=r.subtreeFlags&14680064,i|=r.flags&14680064,r.return=n,r=r.sibling;else for(r=n.child;r!==null;)t|=r.lanes|r.childLanes,i|=r.subtreeFlags,i|=r.flags,r.return=n,r=r.sibling;return n.subtreeFlags|=i,n.childLanes=t,e}function bM(n,e,t){var i=e.pendingProps;switch(dp(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return nn(e),null;case 1:return Mn(e.type)&&Uc(),nn(e),null;case 3:return i=e.stateNode,go(),Et(Sn),Et(cn),Sp(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(n===null||n.child===null)&&(al(e)?e.flags|=4:n===null||n.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,ii!==null&&(Wd(ii),ii=null))),Fd(n,e),nn(e),null;case 5:yp(e);var r=Zr(Ca.current);if(t=e.type,n!==null&&e.stateNode!=null)Jv(n,e,t,i,r),n.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!i){if(e.stateNode===null)throw Error(ie(166));return nn(e),null}if(n=Zr(Mi.current),al(e)){i=e.stateNode,t=e.type;var s=e.memoizedProps;switch(i[xi]=e,i[Aa]=s,n=(e.mode&1)!==0,t){case"dialog":wt("cancel",i),wt("close",i);break;case"iframe":case"object":case"embed":wt("load",i);break;case"video":case"audio":for(r=0;r<ta.length;r++)wt(ta[r],i);break;case"source":wt("error",i);break;case"img":case"image":case"link":wt("error",i),wt("load",i);break;case"details":wt("toggle",i);break;case"input":ym(i,s),wt("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!s.multiple},wt("invalid",i);break;case"textarea":Mm(i,s),wt("invalid",i)}cd(t,s),r=null;for(var o in s)if(s.hasOwnProperty(o)){var c=s[o];o==="children"?typeof c=="string"?i.textContent!==c&&(s.suppressHydrationWarning!==!0&&ol(i.textContent,c,n),r=["children",c]):typeof c=="number"&&i.textContent!==""+c&&(s.suppressHydrationWarning!==!0&&ol(i.textContent,c,n),r=["children",""+c]):ga.hasOwnProperty(o)&&c!=null&&o==="onScroll"&&wt("scroll",i)}switch(t){case"input":Qa(i),Sm(i,s,!0);break;case"textarea":Qa(i),wm(i);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(i.onclick=Nc)}i=r,e.updateQueue=i,i!==null&&(e.flags|=4)}else{o=r.nodeType===9?r:r.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=C0(t)),n==="http://www.w3.org/1999/xhtml"?t==="script"?(n=o.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof i.is=="string"?n=o.createElement(t,{is:i.is}):(n=o.createElement(t),t==="select"&&(o=n,i.multiple?o.multiple=!0:i.size&&(o.size=i.size))):n=o.createElementNS(n,t),n[xi]=e,n[Aa]=i,Qv(n,e,!1,!1),e.stateNode=n;e:{switch(o=ud(t,i),t){case"dialog":wt("cancel",n),wt("close",n),r=i;break;case"iframe":case"object":case"embed":wt("load",n),r=i;break;case"video":case"audio":for(r=0;r<ta.length;r++)wt(ta[r],n);r=i;break;case"source":wt("error",n),r=i;break;case"img":case"image":case"link":wt("error",n),wt("load",n),r=i;break;case"details":wt("toggle",n),r=i;break;case"input":ym(n,i),r=rd(n,i),wt("invalid",n);break;case"option":r=i;break;case"select":n._wrapperState={wasMultiple:!!i.multiple},r=Rt({},i,{value:void 0}),wt("invalid",n);break;case"textarea":Mm(n,i),r=ad(n,i),wt("invalid",n);break;default:r=i}cd(t,r),c=r;for(s in c)if(c.hasOwnProperty(s)){var l=c[s];s==="style"?L0(n,l):s==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&R0(n,l)):s==="children"?typeof l=="string"?(t!=="textarea"||l!=="")&&_a(n,l):typeof l=="number"&&_a(n,""+l):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(ga.hasOwnProperty(s)?l!=null&&s==="onScroll"&&wt("scroll",n):l!=null&&Zh(n,s,l,o))}switch(t){case"input":Qa(n),Sm(n,i,!1);break;case"textarea":Qa(n),wm(n);break;case"option":i.value!=null&&n.setAttribute("value",""+Tr(i.value));break;case"select":n.multiple=!!i.multiple,s=i.value,s!=null?to(n,!!i.multiple,s,!1):i.defaultValue!=null&&to(n,!!i.multiple,i.defaultValue,!0);break;default:typeof r.onClick=="function"&&(n.onclick=Nc)}switch(t){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return nn(e),null;case 6:if(n&&e.stateNode!=null)ex(n,e,n.memoizedProps,i);else{if(typeof i!="string"&&e.stateNode===null)throw Error(ie(166));if(t=Zr(Ca.current),Zr(Mi.current),al(e)){if(i=e.stateNode,t=e.memoizedProps,i[xi]=e,(s=i.nodeValue!==t)&&(n=Un,n!==null))switch(n.tag){case 3:ol(i.nodeValue,t,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&ol(i.nodeValue,t,(n.mode&1)!==0)}s&&(e.flags|=4)}else i=(t.nodeType===9?t:t.ownerDocument).createTextNode(i),i[xi]=e,e.stateNode=i}return nn(e),null;case 13:if(Et(bt),i=e.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(At&&Nn!==null&&e.mode&1&&!(e.flags&128))vv(),po(),e.flags|=98560,s=!1;else if(s=al(e),i!==null&&i.dehydrated!==null){if(n===null){if(!s)throw Error(ie(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(ie(317));s[xi]=e}else po(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;nn(e),s=!1}else ii!==null&&(Wd(ii),ii=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=t,e):(i=i!==null,i!==(n!==null&&n.memoizedState!==null)&&i&&(e.child.flags|=8192,e.mode&1&&(n===null||bt.current&1?zt===0&&(zt=3):Ip())),e.updateQueue!==null&&(e.flags|=4),nn(e),null);case 4:return go(),Fd(n,e),n===null&&Ea(e.stateNode.containerInfo),nn(e),null;case 10:return gp(e.type._context),nn(e),null;case 17:return Mn(e.type)&&Uc(),nn(e),null;case 19:if(Et(bt),s=e.memoizedState,s===null)return nn(e),null;if(i=(e.flags&128)!==0,o=s.rendering,o===null)if(i)Oo(s,!1);else{if(zt!==0||n!==null&&n.flags&128)for(n=e.child;n!==null;){if(o=Hc(n),o!==null){for(e.flags|=128,Oo(s,!1),i=o.updateQueue,i!==null&&(e.updateQueue=i,e.flags|=4),e.subtreeFlags=0,i=t,t=e.child;t!==null;)s=t,n=i,s.flags&=14680066,o=s.alternate,o===null?(s.childLanes=0,s.lanes=n,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=o.childLanes,s.lanes=o.lanes,s.child=o.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=o.memoizedProps,s.memoizedState=o.memoizedState,s.updateQueue=o.updateQueue,s.type=o.type,n=o.dependencies,s.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),t=t.sibling;return yt(bt,bt.current&1|2),e.child}n=n.sibling}s.tail!==null&&Nt()>vo&&(e.flags|=128,i=!0,Oo(s,!1),e.lanes=4194304)}else{if(!i)if(n=Hc(o),n!==null){if(e.flags|=128,i=!0,t=n.updateQueue,t!==null&&(e.updateQueue=t,e.flags|=4),Oo(s,!0),s.tail===null&&s.tailMode==="hidden"&&!o.alternate&&!At)return nn(e),null}else 2*Nt()-s.renderingStartTime>vo&&t!==1073741824&&(e.flags|=128,i=!0,Oo(s,!1),e.lanes=4194304);s.isBackwards?(o.sibling=e.child,e.child=o):(t=s.last,t!==null?t.sibling=o:e.child=o,s.last=o)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=Nt(),e.sibling=null,t=bt.current,yt(bt,i?t&1|2:t&1),e):(nn(e),null);case 22:case 23:return Dp(),i=e.memoizedState!==null,n!==null&&n.memoizedState!==null!==i&&(e.flags|=8192),i&&e.mode&1?Pn&1073741824&&(nn(e),e.subtreeFlags&6&&(e.flags|=8192)):nn(e),null;case 24:return null;case 25:return null}throw Error(ie(156,e.tag))}function CM(n,e){switch(dp(e),e.tag){case 1:return Mn(e.type)&&Uc(),n=e.flags,n&65536?(e.flags=n&-65537|128,e):null;case 3:return go(),Et(Sn),Et(cn),Sp(),n=e.flags,n&65536&&!(n&128)?(e.flags=n&-65537|128,e):null;case 5:return yp(e),null;case 13:if(Et(bt),n=e.memoizedState,n!==null&&n.dehydrated!==null){if(e.alternate===null)throw Error(ie(340));po()}return n=e.flags,n&65536?(e.flags=n&-65537|128,e):null;case 19:return Et(bt),null;case 4:return go(),null;case 10:return gp(e.type._context),null;case 22:case 23:return Dp(),null;case 24:return null;default:return null}}var ul=!1,on=!1,RM=typeof WeakSet=="function"?WeakSet:Set,ve=null;function Qs(n,e){var t=n.ref;if(t!==null)if(typeof t=="function")try{t(null)}catch(i){Lt(n,e,i)}else t.current=null}function Od(n,e,t){try{t()}catch(i){Lt(n,e,i)}}var dg=!1;function PM(n,e){if(yd=Lc,n=sv(),up(n)){if("selectionStart"in n)var t={start:n.selectionStart,end:n.selectionEnd};else e:{t=(t=n.ownerDocument)&&t.defaultView||window;var i=t.getSelection&&t.getSelection();if(i&&i.rangeCount!==0){t=i.anchorNode;var r=i.anchorOffset,s=i.focusNode;i=i.focusOffset;try{t.nodeType,s.nodeType}catch{t=null;break e}var o=0,c=-1,l=-1,u=0,d=0,a=n,f=null;t:for(;;){for(var h;a!==t||r!==0&&a.nodeType!==3||(c=o+r),a!==s||i!==0&&a.nodeType!==3||(l=o+i),a.nodeType===3&&(o+=a.nodeValue.length),(h=a.firstChild)!==null;)f=a,a=h;for(;;){if(a===n)break t;if(f===t&&++u===r&&(c=o),f===s&&++d===i&&(l=o),(h=a.nextSibling)!==null)break;a=f,f=a.parentNode}a=h}t=c===-1||l===-1?null:{start:c,end:l}}else t=null}t=t||{start:0,end:0}}else t=null;for(Sd={focusedElem:n,selectionRange:t},Lc=!1,ve=e;ve!==null;)if(e=ve,n=e.child,(e.subtreeFlags&1028)!==0&&n!==null)n.return=e,ve=n;else for(;ve!==null;){e=ve;try{var m=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(m!==null){var v=m.memoizedProps,g=m.memoizedState,p=e.stateNode,_=p.getSnapshotBeforeUpdate(e.elementType===e.type?v:ti(e.type,v),g);p.__reactInternalSnapshotBeforeUpdate=_}break;case 3:var x=e.stateNode.containerInfo;x.nodeType===1?x.textContent="":x.nodeType===9&&x.documentElement&&x.removeChild(x.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(ie(163))}}catch(S){Lt(e,e.return,S)}if(n=e.sibling,n!==null){n.return=e.return,ve=n;break}ve=e.return}return m=dg,dg=!1,m}function fa(n,e,t){var i=e.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var r=i=i.next;do{if((r.tag&n)===n){var s=r.destroy;r.destroy=void 0,s!==void 0&&Od(e,t,s)}r=r.next}while(r!==i)}}function hu(n,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var t=e=e.next;do{if((t.tag&n)===n){var i=t.create;t.destroy=i()}t=t.next}while(t!==e)}}function kd(n){var e=n.ref;if(e!==null){var t=n.stateNode;switch(n.tag){case 5:n=t;break;default:n=t}typeof e=="function"?e(n):e.current=n}}function tx(n){var e=n.alternate;e!==null&&(n.alternate=null,tx(e)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(e=n.stateNode,e!==null&&(delete e[xi],delete e[Aa],delete e[Ed],delete e[dM],delete e[hM])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function nx(n){return n.tag===5||n.tag===3||n.tag===4}function hg(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||nx(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function Bd(n,e,t){var i=n.tag;if(i===5||i===6)n=n.stateNode,e?t.nodeType===8?t.parentNode.insertBefore(n,e):t.insertBefore(n,e):(t.nodeType===8?(e=t.parentNode,e.insertBefore(n,t)):(e=t,e.appendChild(n)),t=t._reactRootContainer,t!=null||e.onclick!==null||(e.onclick=Nc));else if(i!==4&&(n=n.child,n!==null))for(Bd(n,e,t),n=n.sibling;n!==null;)Bd(n,e,t),n=n.sibling}function zd(n,e,t){var i=n.tag;if(i===5||i===6)n=n.stateNode,e?t.insertBefore(n,e):t.appendChild(n);else if(i!==4&&(n=n.child,n!==null))for(zd(n,e,t),n=n.sibling;n!==null;)zd(n,e,t),n=n.sibling}var qt=null,ni=!1;function tr(n,e,t){for(t=t.child;t!==null;)ix(n,e,t),t=t.sibling}function ix(n,e,t){if(Si&&typeof Si.onCommitFiberUnmount=="function")try{Si.onCommitFiberUnmount(su,t)}catch{}switch(t.tag){case 5:on||Qs(t,e);case 6:var i=qt,r=ni;qt=null,tr(n,e,t),qt=i,ni=r,qt!==null&&(ni?(n=qt,t=t.stateNode,n.nodeType===8?n.parentNode.removeChild(t):n.removeChild(t)):qt.removeChild(t.stateNode));break;case 18:qt!==null&&(ni?(n=qt,t=t.stateNode,n.nodeType===8?ju(n.parentNode,t):n.nodeType===1&&ju(n,t),Sa(n)):ju(qt,t.stateNode));break;case 4:i=qt,r=ni,qt=t.stateNode.containerInfo,ni=!0,tr(n,e,t),qt=i,ni=r;break;case 0:case 11:case 14:case 15:if(!on&&(i=t.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){r=i=i.next;do{var s=r,o=s.destroy;s=s.tag,o!==void 0&&(s&2||s&4)&&Od(t,e,o),r=r.next}while(r!==i)}tr(n,e,t);break;case 1:if(!on&&(Qs(t,e),i=t.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=t.memoizedProps,i.state=t.memoizedState,i.componentWillUnmount()}catch(c){Lt(t,e,c)}tr(n,e,t);break;case 21:tr(n,e,t);break;case 22:t.mode&1?(on=(i=on)||t.memoizedState!==null,tr(n,e,t),on=i):tr(n,e,t);break;default:tr(n,e,t)}}function pg(n){var e=n.updateQueue;if(e!==null){n.updateQueue=null;var t=n.stateNode;t===null&&(t=n.stateNode=new RM),e.forEach(function(i){var r=BM.bind(null,n,i);t.has(i)||(t.add(i),i.then(r,r))})}}function Zn(n,e){var t=e.deletions;if(t!==null)for(var i=0;i<t.length;i++){var r=t[i];try{var s=n,o=e,c=o;e:for(;c!==null;){switch(c.tag){case 5:qt=c.stateNode,ni=!1;break e;case 3:qt=c.stateNode.containerInfo,ni=!0;break e;case 4:qt=c.stateNode.containerInfo,ni=!0;break e}c=c.return}if(qt===null)throw Error(ie(160));ix(s,o,r),qt=null,ni=!1;var l=r.alternate;l!==null&&(l.return=null),r.return=null}catch(u){Lt(r,e,u)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)rx(e,n),e=e.sibling}function rx(n,e){var t=n.alternate,i=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(Zn(e,n),hi(n),i&4){try{fa(3,n,n.return),hu(3,n)}catch(v){Lt(n,n.return,v)}try{fa(5,n,n.return)}catch(v){Lt(n,n.return,v)}}break;case 1:Zn(e,n),hi(n),i&512&&t!==null&&Qs(t,t.return);break;case 5:if(Zn(e,n),hi(n),i&512&&t!==null&&Qs(t,t.return),n.flags&32){var r=n.stateNode;try{_a(r,"")}catch(v){Lt(n,n.return,v)}}if(i&4&&(r=n.stateNode,r!=null)){var s=n.memoizedProps,o=t!==null?t.memoizedProps:s,c=n.type,l=n.updateQueue;if(n.updateQueue=null,l!==null)try{c==="input"&&s.type==="radio"&&s.name!=null&&A0(r,s),ud(c,o);var u=ud(c,s);for(o=0;o<l.length;o+=2){var d=l[o],a=l[o+1];d==="style"?L0(r,a):d==="dangerouslySetInnerHTML"?R0(r,a):d==="children"?_a(r,a):Zh(r,d,a,u)}switch(c){case"input":sd(r,s);break;case"textarea":b0(r,s);break;case"select":var f=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!s.multiple;var h=s.value;h!=null?to(r,!!s.multiple,h,!1):f!==!!s.multiple&&(s.defaultValue!=null?to(r,!!s.multiple,s.defaultValue,!0):to(r,!!s.multiple,s.multiple?[]:"",!1))}r[Aa]=s}catch(v){Lt(n,n.return,v)}}break;case 6:if(Zn(e,n),hi(n),i&4){if(n.stateNode===null)throw Error(ie(162));r=n.stateNode,s=n.memoizedProps;try{r.nodeValue=s}catch(v){Lt(n,n.return,v)}}break;case 3:if(Zn(e,n),hi(n),i&4&&t!==null&&t.memoizedState.isDehydrated)try{Sa(e.containerInfo)}catch(v){Lt(n,n.return,v)}break;case 4:Zn(e,n),hi(n);break;case 13:Zn(e,n),hi(n),r=n.child,r.flags&8192&&(s=r.memoizedState!==null,r.stateNode.isHidden=s,!s||r.alternate!==null&&r.alternate.memoizedState!==null||(Pp=Nt())),i&4&&pg(n);break;case 22:if(d=t!==null&&t.memoizedState!==null,n.mode&1?(on=(u=on)||d,Zn(e,n),on=u):Zn(e,n),hi(n),i&8192){if(u=n.memoizedState!==null,(n.stateNode.isHidden=u)&&!d&&n.mode&1)for(ve=n,d=n.child;d!==null;){for(a=ve=d;ve!==null;){switch(f=ve,h=f.child,f.tag){case 0:case 11:case 14:case 15:fa(4,f,f.return);break;case 1:Qs(f,f.return);var m=f.stateNode;if(typeof m.componentWillUnmount=="function"){i=f,t=f.return;try{e=i,m.props=e.memoizedProps,m.state=e.memoizedState,m.componentWillUnmount()}catch(v){Lt(i,t,v)}}break;case 5:Qs(f,f.return);break;case 22:if(f.memoizedState!==null){gg(a);continue}}h!==null?(h.return=f,ve=h):gg(a)}d=d.sibling}e:for(d=null,a=n;;){if(a.tag===5){if(d===null){d=a;try{r=a.stateNode,u?(s=r.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(c=a.stateNode,l=a.memoizedProps.style,o=l!=null&&l.hasOwnProperty("display")?l.display:null,c.style.display=P0("display",o))}catch(v){Lt(n,n.return,v)}}}else if(a.tag===6){if(d===null)try{a.stateNode.nodeValue=u?"":a.memoizedProps}catch(v){Lt(n,n.return,v)}}else if((a.tag!==22&&a.tag!==23||a.memoizedState===null||a===n)&&a.child!==null){a.child.return=a,a=a.child;continue}if(a===n)break e;for(;a.sibling===null;){if(a.return===null||a.return===n)break e;d===a&&(d=null),a=a.return}d===a&&(d=null),a.sibling.return=a.return,a=a.sibling}}break;case 19:Zn(e,n),hi(n),i&4&&pg(n);break;case 21:break;default:Zn(e,n),hi(n)}}function hi(n){var e=n.flags;if(e&2){try{e:{for(var t=n.return;t!==null;){if(nx(t)){var i=t;break e}t=t.return}throw Error(ie(160))}switch(i.tag){case 5:var r=i.stateNode;i.flags&32&&(_a(r,""),i.flags&=-33);var s=hg(n);zd(n,s,r);break;case 3:case 4:var o=i.stateNode.containerInfo,c=hg(n);Bd(n,c,o);break;default:throw Error(ie(161))}}catch(l){Lt(n,n.return,l)}n.flags&=-3}e&4096&&(n.flags&=-4097)}function LM(n,e,t){ve=n,sx(n)}function sx(n,e,t){for(var i=(n.mode&1)!==0;ve!==null;){var r=ve,s=r.child;if(r.tag===22&&i){var o=r.memoizedState!==null||ul;if(!o){var c=r.alternate,l=c!==null&&c.memoizedState!==null||on;c=ul;var u=on;if(ul=o,(on=l)&&!u)for(ve=r;ve!==null;)o=ve,l=o.child,o.tag===22&&o.memoizedState!==null?_g(r):l!==null?(l.return=o,ve=l):_g(r);for(;s!==null;)ve=s,sx(s),s=s.sibling;ve=r,ul=c,on=u}mg(n)}else r.subtreeFlags&8772&&s!==null?(s.return=r,ve=s):mg(n)}}function mg(n){for(;ve!==null;){var e=ve;if(e.flags&8772){var t=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:on||hu(5,e);break;case 1:var i=e.stateNode;if(e.flags&4&&!on)if(t===null)i.componentDidMount();else{var r=e.elementType===e.type?t.memoizedProps:ti(e.type,t.memoizedProps);i.componentDidUpdate(r,t.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&Jm(e,s,i);break;case 3:var o=e.updateQueue;if(o!==null){if(t=null,e.child!==null)switch(e.child.tag){case 5:t=e.child.stateNode;break;case 1:t=e.child.stateNode}Jm(e,o,t)}break;case 5:var c=e.stateNode;if(t===null&&e.flags&4){t=c;var l=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&t.focus();break;case"img":l.src&&(t.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var u=e.alternate;if(u!==null){var d=u.memoizedState;if(d!==null){var a=d.dehydrated;a!==null&&Sa(a)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(ie(163))}on||e.flags&512&&kd(e)}catch(f){Lt(e,e.return,f)}}if(e===n){ve=null;break}if(t=e.sibling,t!==null){t.return=e.return,ve=t;break}ve=e.return}}function gg(n){for(;ve!==null;){var e=ve;if(e===n){ve=null;break}var t=e.sibling;if(t!==null){t.return=e.return,ve=t;break}ve=e.return}}function _g(n){for(;ve!==null;){var e=ve;try{switch(e.tag){case 0:case 11:case 15:var t=e.return;try{hu(4,e)}catch(l){Lt(e,t,l)}break;case 1:var i=e.stateNode;if(typeof i.componentDidMount=="function"){var r=e.return;try{i.componentDidMount()}catch(l){Lt(e,r,l)}}var s=e.return;try{kd(e)}catch(l){Lt(e,s,l)}break;case 5:var o=e.return;try{kd(e)}catch(l){Lt(e,o,l)}}}catch(l){Lt(e,e.return,l)}if(e===n){ve=null;break}var c=e.sibling;if(c!==null){c.return=e.return,ve=c;break}ve=e.return}}var DM=Math.ceil,Xc=Zi.ReactCurrentDispatcher,Cp=Zi.ReactCurrentOwner,$n=Zi.ReactCurrentBatchConfig,tt=0,jt=null,Ft=null,Qt=0,Pn=0,Js=Lr(0),zt=0,Da=null,ss=0,pu=0,Rp=0,da=null,xn=null,Pp=0,vo=1/0,Oi=null,jc=!1,Vd=null,Mr=null,fl=!1,mr=null,$c=0,ha=0,Hd=null,hc=-1,pc=0;function hn(){return tt&6?Nt():hc!==-1?hc:hc=Nt()}function wr(n){return n.mode&1?tt&2&&Qt!==0?Qt&-Qt:mM.transition!==null?(pc===0&&(pc=G0()),pc):(n=ft,n!==0||(n=window.event,n=n===void 0?16:K0(n.type)),n):1}function ui(n,e,t,i){if(50<ha)throw ha=0,Hd=null,Error(ie(185));za(n,t,i),(!(tt&2)||n!==jt)&&(n===jt&&(!(tt&2)&&(pu|=t),zt===4&&dr(n,Qt)),wn(n,i),t===1&&tt===0&&!(e.mode&1)&&(vo=Nt()+500,uu&&Dr()))}function wn(n,e){var t=n.callbackNode;mS(n,e);var i=Pc(n,n===jt?Qt:0);if(i===0)t!==null&&Am(t),n.callbackNode=null,n.callbackPriority=0;else if(e=i&-i,n.callbackPriority!==e){if(t!=null&&Am(t),e===1)n.tag===0?pM(vg.bind(null,n)):mv(vg.bind(null,n)),uM(function(){!(tt&6)&&Dr()}),t=null;else{switch(W0(i)){case 1:t=np;break;case 4:t=V0;break;case 16:t=Rc;break;case 536870912:t=H0;break;default:t=Rc}t=hx(t,ox.bind(null,n))}n.callbackPriority=e,n.callbackNode=t}}function ox(n,e){if(hc=-1,pc=0,tt&6)throw Error(ie(327));var t=n.callbackNode;if(oo()&&n.callbackNode!==t)return null;var i=Pc(n,n===jt?Qt:0);if(i===0)return null;if(i&30||i&n.expiredLanes||e)e=Yc(n,i);else{e=i;var r=tt;tt|=2;var s=lx();(jt!==n||Qt!==e)&&(Oi=null,vo=Nt()+500,es(n,e));do try{UM();break}catch(c){ax(n,c)}while(!0);mp(),Xc.current=s,tt=r,Ft!==null?e=0:(jt=null,Qt=0,e=zt)}if(e!==0){if(e===2&&(r=md(n),r!==0&&(i=r,e=Gd(n,r))),e===1)throw t=Da,es(n,0),dr(n,i),wn(n,Nt()),t;if(e===6)dr(n,i);else{if(r=n.current.alternate,!(i&30)&&!IM(r)&&(e=Yc(n,i),e===2&&(s=md(n),s!==0&&(i=s,e=Gd(n,s))),e===1))throw t=Da,es(n,0),dr(n,i),wn(n,Nt()),t;switch(n.finishedWork=r,n.finishedLanes=i,e){case 0:case 1:throw Error(ie(345));case 2:jr(n,xn,Oi);break;case 3:if(dr(n,i),(i&130023424)===i&&(e=Pp+500-Nt(),10<e)){if(Pc(n,0)!==0)break;if(r=n.suspendedLanes,(r&i)!==i){hn(),n.pingedLanes|=n.suspendedLanes&r;break}n.timeoutHandle=wd(jr.bind(null,n,xn,Oi),e);break}jr(n,xn,Oi);break;case 4:if(dr(n,i),(i&4194240)===i)break;for(e=n.eventTimes,r=-1;0<i;){var o=31-ci(i);s=1<<o,o=e[o],o>r&&(r=o),i&=~s}if(i=r,i=Nt()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*DM(i/1960))-i,10<i){n.timeoutHandle=wd(jr.bind(null,n,xn,Oi),i);break}jr(n,xn,Oi);break;case 5:jr(n,xn,Oi);break;default:throw Error(ie(329))}}}return wn(n,Nt()),n.callbackNode===t?ox.bind(null,n):null}function Gd(n,e){var t=da;return n.current.memoizedState.isDehydrated&&(es(n,e).flags|=256),n=Yc(n,e),n!==2&&(e=xn,xn=t,e!==null&&Wd(e)),n}function Wd(n){xn===null?xn=n:xn.push.apply(xn,n)}function IM(n){for(var e=n;;){if(e.flags&16384){var t=e.updateQueue;if(t!==null&&(t=t.stores,t!==null))for(var i=0;i<t.length;i++){var r=t[i],s=r.getSnapshot;r=r.value;try{if(!fi(s(),r))return!1}catch{return!1}}}if(t=e.child,e.subtreeFlags&16384&&t!==null)t.return=e,e=t;else{if(e===n)break;for(;e.sibling===null;){if(e.return===null||e.return===n)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function dr(n,e){for(e&=~Rp,e&=~pu,n.suspendedLanes|=e,n.pingedLanes&=~e,n=n.expirationTimes;0<e;){var t=31-ci(e),i=1<<t;n[t]=-1,e&=~i}}function vg(n){if(tt&6)throw Error(ie(327));oo();var e=Pc(n,0);if(!(e&1))return wn(n,Nt()),null;var t=Yc(n,e);if(n.tag!==0&&t===2){var i=md(n);i!==0&&(e=i,t=Gd(n,i))}if(t===1)throw t=Da,es(n,0),dr(n,e),wn(n,Nt()),t;if(t===6)throw Error(ie(345));return n.finishedWork=n.current.alternate,n.finishedLanes=e,jr(n,xn,Oi),wn(n,Nt()),null}function Lp(n,e){var t=tt;tt|=1;try{return n(e)}finally{tt=t,tt===0&&(vo=Nt()+500,uu&&Dr())}}function os(n){mr!==null&&mr.tag===0&&!(tt&6)&&oo();var e=tt;tt|=1;var t=$n.transition,i=ft;try{if($n.transition=null,ft=1,n)return n()}finally{ft=i,$n.transition=t,tt=e,!(tt&6)&&Dr()}}function Dp(){Pn=Js.current,Et(Js)}function es(n,e){n.finishedWork=null,n.finishedLanes=0;var t=n.timeoutHandle;if(t!==-1&&(n.timeoutHandle=-1,cM(t)),Ft!==null)for(t=Ft.return;t!==null;){var i=t;switch(dp(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&Uc();break;case 3:go(),Et(Sn),Et(cn),Sp();break;case 5:yp(i);break;case 4:go();break;case 13:Et(bt);break;case 19:Et(bt);break;case 10:gp(i.type._context);break;case 22:case 23:Dp()}t=t.return}if(jt=n,Ft=n=Er(n.current,null),Qt=Pn=e,zt=0,Da=null,Rp=pu=ss=0,xn=da=null,Kr!==null){for(e=0;e<Kr.length;e++)if(t=Kr[e],i=t.interleaved,i!==null){t.interleaved=null;var r=i.next,s=t.pending;if(s!==null){var o=s.next;s.next=r,i.next=o}t.pending=i}Kr=null}return n}function ax(n,e){do{var t=Ft;try{if(mp(),uc.current=Wc,Gc){for(var i=Ct.memoizedState;i!==null;){var r=i.queue;r!==null&&(r.pending=null),i=i.next}Gc=!1}if(rs=0,Xt=Bt=Ct=null,ua=!1,Ra=0,Cp.current=null,t===null||t.return===null){zt=1,Da=e,Ft=null;break}e:{var s=n,o=t.return,c=t,l=e;if(e=Qt,c.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var u=l,d=c,a=d.tag;if(!(d.mode&1)&&(a===0||a===11||a===15)){var f=d.alternate;f?(d.updateQueue=f.updateQueue,d.memoizedState=f.memoizedState,d.lanes=f.lanes):(d.updateQueue=null,d.memoizedState=null)}var h=sg(o);if(h!==null){h.flags&=-257,og(h,o,c,s,e),h.mode&1&&rg(s,u,e),e=h,l=u;var m=e.updateQueue;if(m===null){var v=new Set;v.add(l),e.updateQueue=v}else m.add(l);break e}else{if(!(e&1)){rg(s,u,e),Ip();break e}l=Error(ie(426))}}else if(At&&c.mode&1){var g=sg(o);if(g!==null){!(g.flags&65536)&&(g.flags|=256),og(g,o,c,s,e),hp(_o(l,c));break e}}s=l=_o(l,c),zt!==4&&(zt=2),da===null?da=[s]:da.push(s),s=o;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var p=Wv(s,l,e);Qm(s,p);break e;case 1:c=l;var _=s.type,x=s.stateNode;if(!(s.flags&128)&&(typeof _.getDerivedStateFromError=="function"||x!==null&&typeof x.componentDidCatch=="function"&&(Mr===null||!Mr.has(x)))){s.flags|=65536,e&=-e,s.lanes|=e;var S=Xv(s,c,e);Qm(s,S);break e}}s=s.return}while(s!==null)}ux(t)}catch(A){e=A,Ft===t&&t!==null&&(Ft=t=t.return);continue}break}while(!0)}function lx(){var n=Xc.current;return Xc.current=Wc,n===null?Wc:n}function Ip(){(zt===0||zt===3||zt===2)&&(zt=4),jt===null||!(ss&268435455)&&!(pu&268435455)||dr(jt,Qt)}function Yc(n,e){var t=tt;tt|=2;var i=lx();(jt!==n||Qt!==e)&&(Oi=null,es(n,e));do try{NM();break}catch(r){ax(n,r)}while(!0);if(mp(),tt=t,Xc.current=i,Ft!==null)throw Error(ie(261));return jt=null,Qt=0,zt}function NM(){for(;Ft!==null;)cx(Ft)}function UM(){for(;Ft!==null&&!oS();)cx(Ft)}function cx(n){var e=dx(n.alternate,n,Pn);n.memoizedProps=n.pendingProps,e===null?ux(n):Ft=e,Cp.current=null}function ux(n){var e=n;do{var t=e.alternate;if(n=e.return,e.flags&32768){if(t=CM(t,e),t!==null){t.flags&=32767,Ft=t;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{zt=6,Ft=null;return}}else if(t=bM(t,e,Pn),t!==null){Ft=t;return}if(e=e.sibling,e!==null){Ft=e;return}Ft=e=n}while(e!==null);zt===0&&(zt=5)}function jr(n,e,t){var i=ft,r=$n.transition;try{$n.transition=null,ft=1,FM(n,e,t,i)}finally{$n.transition=r,ft=i}return null}function FM(n,e,t,i){do oo();while(mr!==null);if(tt&6)throw Error(ie(327));t=n.finishedWork;var r=n.finishedLanes;if(t===null)return null;if(n.finishedWork=null,n.finishedLanes=0,t===n.current)throw Error(ie(177));n.callbackNode=null,n.callbackPriority=0;var s=t.lanes|t.childLanes;if(gS(n,s),n===jt&&(Ft=jt=null,Qt=0),!(t.subtreeFlags&2064)&&!(t.flags&2064)||fl||(fl=!0,hx(Rc,function(){return oo(),null})),s=(t.flags&15990)!==0,t.subtreeFlags&15990||s){s=$n.transition,$n.transition=null;var o=ft;ft=1;var c=tt;tt|=4,Cp.current=null,PM(n,t),rx(t,n),nM(Sd),Lc=!!yd,Sd=yd=null,n.current=t,LM(t),aS(),tt=c,ft=o,$n.transition=s}else n.current=t;if(fl&&(fl=!1,mr=n,$c=r),s=n.pendingLanes,s===0&&(Mr=null),uS(t.stateNode),wn(n,Nt()),e!==null)for(i=n.onRecoverableError,t=0;t<e.length;t++)r=e[t],i(r.value,{componentStack:r.stack,digest:r.digest});if(jc)throw jc=!1,n=Vd,Vd=null,n;return $c&1&&n.tag!==0&&oo(),s=n.pendingLanes,s&1?n===Hd?ha++:(ha=0,Hd=n):ha=0,Dr(),null}function oo(){if(mr!==null){var n=W0($c),e=$n.transition,t=ft;try{if($n.transition=null,ft=16>n?16:n,mr===null)var i=!1;else{if(n=mr,mr=null,$c=0,tt&6)throw Error(ie(331));var r=tt;for(tt|=4,ve=n.current;ve!==null;){var s=ve,o=s.child;if(ve.flags&16){var c=s.deletions;if(c!==null){for(var l=0;l<c.length;l++){var u=c[l];for(ve=u;ve!==null;){var d=ve;switch(d.tag){case 0:case 11:case 15:fa(8,d,s)}var a=d.child;if(a!==null)a.return=d,ve=a;else for(;ve!==null;){d=ve;var f=d.sibling,h=d.return;if(tx(d),d===u){ve=null;break}if(f!==null){f.return=h,ve=f;break}ve=h}}}var m=s.alternate;if(m!==null){var v=m.child;if(v!==null){m.child=null;do{var g=v.sibling;v.sibling=null,v=g}while(v!==null)}}ve=s}}if(s.subtreeFlags&2064&&o!==null)o.return=s,ve=o;else e:for(;ve!==null;){if(s=ve,s.flags&2048)switch(s.tag){case 0:case 11:case 15:fa(9,s,s.return)}var p=s.sibling;if(p!==null){p.return=s.return,ve=p;break e}ve=s.return}}var _=n.current;for(ve=_;ve!==null;){o=ve;var x=o.child;if(o.subtreeFlags&2064&&x!==null)x.return=o,ve=x;else e:for(o=_;ve!==null;){if(c=ve,c.flags&2048)try{switch(c.tag){case 0:case 11:case 15:hu(9,c)}}catch(A){Lt(c,c.return,A)}if(c===o){ve=null;break e}var S=c.sibling;if(S!==null){S.return=c.return,ve=S;break e}ve=c.return}}if(tt=r,Dr(),Si&&typeof Si.onPostCommitFiberRoot=="function")try{Si.onPostCommitFiberRoot(su,n)}catch{}i=!0}return i}finally{ft=t,$n.transition=e}}return!1}function xg(n,e,t){e=_o(t,e),e=Wv(n,e,1),n=Sr(n,e,1),e=hn(),n!==null&&(za(n,1,e),wn(n,e))}function Lt(n,e,t){if(n.tag===3)xg(n,n,t);else for(;e!==null;){if(e.tag===3){xg(e,n,t);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(Mr===null||!Mr.has(i))){n=_o(t,n),n=Xv(e,n,1),e=Sr(e,n,1),n=hn(),e!==null&&(za(e,1,n),wn(e,n));break}}e=e.return}}function OM(n,e,t){var i=n.pingCache;i!==null&&i.delete(e),e=hn(),n.pingedLanes|=n.suspendedLanes&t,jt===n&&(Qt&t)===t&&(zt===4||zt===3&&(Qt&130023424)===Qt&&500>Nt()-Pp?es(n,0):Rp|=t),wn(n,e)}function fx(n,e){e===0&&(n.mode&1?(e=tl,tl<<=1,!(tl&130023424)&&(tl=4194304)):e=1);var t=hn();n=$i(n,e),n!==null&&(za(n,e,t),wn(n,t))}function kM(n){var e=n.memoizedState,t=0;e!==null&&(t=e.retryLane),fx(n,t)}function BM(n,e){var t=0;switch(n.tag){case 13:var i=n.stateNode,r=n.memoizedState;r!==null&&(t=r.retryLane);break;case 19:i=n.stateNode;break;default:throw Error(ie(314))}i!==null&&i.delete(e),fx(n,t)}var dx;dx=function(n,e,t){if(n!==null)if(n.memoizedProps!==e.pendingProps||Sn.current)yn=!0;else{if(!(n.lanes&t)&&!(e.flags&128))return yn=!1,AM(n,e,t);yn=!!(n.flags&131072)}else yn=!1,At&&e.flags&1048576&&gv(e,kc,e.index);switch(e.lanes=0,e.tag){case 2:var i=e.type;dc(n,e),n=e.pendingProps;var r=ho(e,cn.current);so(e,t),r=wp(null,e,i,n,r,t);var s=Ep();return e.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,Mn(i)?(s=!0,Fc(e)):s=!1,e.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,vp(e),r.updater=du,e.stateNode=r,r._reactInternals=e,Pd(e,i,n,t),e=Id(null,e,i,!0,s,t)):(e.tag=0,At&&s&&fp(e),dn(null,e,r,t),e=e.child),e;case 16:i=e.elementType;e:{switch(dc(n,e),n=e.pendingProps,r=i._init,i=r(i._payload),e.type=i,r=e.tag=VM(i),n=ti(i,n),r){case 0:e=Dd(null,e,i,n,t);break e;case 1:e=cg(null,e,i,n,t);break e;case 11:e=ag(null,e,i,n,t);break e;case 14:e=lg(null,e,i,ti(i.type,n),t);break e}throw Error(ie(306,i,""))}return e;case 0:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:ti(i,r),Dd(n,e,i,r,t);case 1:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:ti(i,r),cg(n,e,i,r,t);case 3:e:{if(qv(e),n===null)throw Error(ie(387));i=e.pendingProps,s=e.memoizedState,r=s.element,Mv(n,e),Vc(e,i,null,t);var o=e.memoizedState;if(i=o.element,s.isDehydrated)if(s={element:i,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){r=_o(Error(ie(423)),e),e=ug(n,e,i,t,r);break e}else if(i!==r){r=_o(Error(ie(424)),e),e=ug(n,e,i,t,r);break e}else for(Nn=yr(e.stateNode.containerInfo.firstChild),Un=e,At=!0,ii=null,t=yv(e,null,i,t),e.child=t;t;)t.flags=t.flags&-3|4096,t=t.sibling;else{if(po(),i===r){e=Yi(n,e,t);break e}dn(n,e,i,t)}e=e.child}return e;case 5:return wv(e),n===null&&bd(e),i=e.type,r=e.pendingProps,s=n!==null?n.memoizedProps:null,o=r.children,Md(i,r)?o=null:s!==null&&Md(i,s)&&(e.flags|=32),Yv(n,e),dn(n,e,o,t),e.child;case 6:return n===null&&bd(e),null;case 13:return Kv(n,e,t);case 4:return xp(e,e.stateNode.containerInfo),i=e.pendingProps,n===null?e.child=mo(e,null,i,t):dn(n,e,i,t),e.child;case 11:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:ti(i,r),ag(n,e,i,r,t);case 7:return dn(n,e,e.pendingProps,t),e.child;case 8:return dn(n,e,e.pendingProps.children,t),e.child;case 12:return dn(n,e,e.pendingProps.children,t),e.child;case 10:e:{if(i=e.type._context,r=e.pendingProps,s=e.memoizedProps,o=r.value,yt(Bc,i._currentValue),i._currentValue=o,s!==null)if(fi(s.value,o)){if(s.children===r.children&&!Sn.current){e=Yi(n,e,t);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var c=s.dependencies;if(c!==null){o=s.child;for(var l=c.firstContext;l!==null;){if(l.context===i){if(s.tag===1){l=Hi(-1,t&-t),l.tag=2;var u=s.updateQueue;if(u!==null){u=u.shared;var d=u.pending;d===null?l.next=l:(l.next=d.next,d.next=l),u.pending=l}}s.lanes|=t,l=s.alternate,l!==null&&(l.lanes|=t),Cd(s.return,t,e),c.lanes|=t;break}l=l.next}}else if(s.tag===10)o=s.type===e.type?null:s.child;else if(s.tag===18){if(o=s.return,o===null)throw Error(ie(341));o.lanes|=t,c=o.alternate,c!==null&&(c.lanes|=t),Cd(o,t,e),o=s.sibling}else o=s.child;if(o!==null)o.return=s;else for(o=s;o!==null;){if(o===e){o=null;break}if(s=o.sibling,s!==null){s.return=o.return,o=s;break}o=o.return}s=o}dn(n,e,r.children,t),e=e.child}return e;case 9:return r=e.type,i=e.pendingProps.children,so(e,t),r=Yn(r),i=i(r),e.flags|=1,dn(n,e,i,t),e.child;case 14:return i=e.type,r=ti(i,e.pendingProps),r=ti(i.type,r),lg(n,e,i,r,t);case 15:return jv(n,e,e.type,e.pendingProps,t);case 17:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:ti(i,r),dc(n,e),e.tag=1,Mn(i)?(n=!0,Fc(e)):n=!1,so(e,t),Gv(e,i,r),Pd(e,i,r,t),Id(null,e,i,!0,n,t);case 19:return Zv(n,e,t);case 22:return $v(n,e,t)}throw Error(ie(156,e.tag))};function hx(n,e){return z0(n,e)}function zM(n,e,t,i){this.tag=n,this.key=t,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function jn(n,e,t,i){return new zM(n,e,t,i)}function Np(n){return n=n.prototype,!(!n||!n.isReactComponent)}function VM(n){if(typeof n=="function")return Np(n)?1:0;if(n!=null){if(n=n.$$typeof,n===Jh)return 11;if(n===ep)return 14}return 2}function Er(n,e){var t=n.alternate;return t===null?(t=jn(n.tag,e,n.key,n.mode),t.elementType=n.elementType,t.type=n.type,t.stateNode=n.stateNode,t.alternate=n,n.alternate=t):(t.pendingProps=e,t.type=n.type,t.flags=0,t.subtreeFlags=0,t.deletions=null),t.flags=n.flags&14680064,t.childLanes=n.childLanes,t.lanes=n.lanes,t.child=n.child,t.memoizedProps=n.memoizedProps,t.memoizedState=n.memoizedState,t.updateQueue=n.updateQueue,e=n.dependencies,t.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},t.sibling=n.sibling,t.index=n.index,t.ref=n.ref,t}function mc(n,e,t,i,r,s){var o=2;if(i=n,typeof n=="function")Np(n)&&(o=1);else if(typeof n=="string")o=5;else e:switch(n){case Gs:return ts(t.children,r,s,e);case Qh:o=8,r|=8;break;case ed:return n=jn(12,t,e,r|2),n.elementType=ed,n.lanes=s,n;case td:return n=jn(13,t,e,r),n.elementType=td,n.lanes=s,n;case nd:return n=jn(19,t,e,r),n.elementType=nd,n.lanes=s,n;case w0:return mu(t,r,s,e);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case S0:o=10;break e;case M0:o=9;break e;case Jh:o=11;break e;case ep:o=14;break e;case lr:o=16,i=null;break e}throw Error(ie(130,n==null?n:typeof n,""))}return e=jn(o,t,e,r),e.elementType=n,e.type=i,e.lanes=s,e}function ts(n,e,t,i){return n=jn(7,n,i,e),n.lanes=t,n}function mu(n,e,t,i){return n=jn(22,n,i,e),n.elementType=w0,n.lanes=t,n.stateNode={isHidden:!1},n}function ef(n,e,t){return n=jn(6,n,null,e),n.lanes=t,n}function tf(n,e,t){return e=jn(4,n.children!==null?n.children:[],n.key,e),e.lanes=t,e.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},e}function HM(n,e,t,i,r){this.tag=e,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Uu(0),this.expirationTimes=Uu(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Uu(0),this.identifierPrefix=i,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function Up(n,e,t,i,r,s,o,c,l){return n=new HM(n,e,t,c,l),e===1?(e=1,s===!0&&(e|=8)):e=0,s=jn(3,null,null,e),n.current=s,s.stateNode=n,s.memoizedState={element:i,isDehydrated:t,cache:null,transitions:null,pendingSuspenseBoundaries:null},vp(s),n}function GM(n,e,t){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Hs,key:i==null?null:""+i,children:n,containerInfo:e,implementation:t}}function px(n){if(!n)return Ar;n=n._reactInternals;e:{if(cs(n)!==n||n.tag!==1)throw Error(ie(170));var e=n;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(Mn(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(ie(171))}if(n.tag===1){var t=n.type;if(Mn(t))return pv(n,t,e)}return e}function mx(n,e,t,i,r,s,o,c,l){return n=Up(t,i,!0,n,r,s,o,c,l),n.context=px(null),t=n.current,i=hn(),r=wr(t),s=Hi(i,r),s.callback=e??null,Sr(t,s,r),n.current.lanes=r,za(n,r,i),wn(n,i),n}function gu(n,e,t,i){var r=e.current,s=hn(),o=wr(r);return t=px(t),e.context===null?e.context=t:e.pendingContext=t,e=Hi(s,o),e.payload={element:n},i=i===void 0?null:i,i!==null&&(e.callback=i),n=Sr(r,e,o),n!==null&&(ui(n,r,o,s),cc(n,r,o)),o}function qc(n){if(n=n.current,!n.child)return null;switch(n.child.tag){case 5:return n.child.stateNode;default:return n.child.stateNode}}function yg(n,e){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var t=n.retryLane;n.retryLane=t!==0&&t<e?t:e}}function Fp(n,e){yg(n,e),(n=n.alternate)&&yg(n,e)}function WM(){return null}var gx=typeof reportError=="function"?reportError:function(n){console.error(n)};function Op(n){this._internalRoot=n}_u.prototype.render=Op.prototype.render=function(n){var e=this._internalRoot;if(e===null)throw Error(ie(409));gu(n,e,null,null)};_u.prototype.unmount=Op.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var e=n.containerInfo;os(function(){gu(null,n,null,null)}),e[ji]=null}};function _u(n){this._internalRoot=n}_u.prototype.unstable_scheduleHydration=function(n){if(n){var e=$0();n={blockedOn:null,target:n,priority:e};for(var t=0;t<fr.length&&e!==0&&e<fr[t].priority;t++);fr.splice(t,0,n),t===0&&q0(n)}};function kp(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function vu(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function Sg(){}function XM(n,e,t,i,r){if(r){if(typeof i=="function"){var s=i;i=function(){var u=qc(o);s.call(u)}}var o=mx(e,i,n,0,null,!1,!1,"",Sg);return n._reactRootContainer=o,n[ji]=o.current,Ea(n.nodeType===8?n.parentNode:n),os(),o}for(;r=n.lastChild;)n.removeChild(r);if(typeof i=="function"){var c=i;i=function(){var u=qc(l);c.call(u)}}var l=Up(n,0,!1,null,null,!1,!1,"",Sg);return n._reactRootContainer=l,n[ji]=l.current,Ea(n.nodeType===8?n.parentNode:n),os(function(){gu(e,l,t,i)}),l}function xu(n,e,t,i,r){var s=t._reactRootContainer;if(s){var o=s;if(typeof r=="function"){var c=r;r=function(){var l=qc(o);c.call(l)}}gu(e,o,n,r)}else o=XM(t,e,n,r,i);return qc(o)}X0=function(n){switch(n.tag){case 3:var e=n.stateNode;if(e.current.memoizedState.isDehydrated){var t=ea(e.pendingLanes);t!==0&&(ip(e,t|1),wn(e,Nt()),!(tt&6)&&(vo=Nt()+500,Dr()))}break;case 13:os(function(){var i=$i(n,1);if(i!==null){var r=hn();ui(i,n,1,r)}}),Fp(n,1)}};rp=function(n){if(n.tag===13){var e=$i(n,134217728);if(e!==null){var t=hn();ui(e,n,134217728,t)}Fp(n,134217728)}};j0=function(n){if(n.tag===13){var e=wr(n),t=$i(n,e);if(t!==null){var i=hn();ui(t,n,e,i)}Fp(n,e)}};$0=function(){return ft};Y0=function(n,e){var t=ft;try{return ft=n,e()}finally{ft=t}};dd=function(n,e,t){switch(e){case"input":if(sd(n,t),e=t.name,t.type==="radio"&&e!=null){for(t=n;t.parentNode;)t=t.parentNode;for(t=t.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<t.length;e++){var i=t[e];if(i!==n&&i.form===n.form){var r=cu(i);if(!r)throw Error(ie(90));T0(i),sd(i,r)}}}break;case"textarea":b0(n,t);break;case"select":e=t.value,e!=null&&to(n,!!t.multiple,e,!1)}};N0=Lp;U0=os;var jM={usingClientEntryPoint:!1,Events:[Ha,$s,cu,D0,I0,Lp]},ko={findFiberByHostInstance:qr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},$M={bundleType:ko.bundleType,version:ko.version,rendererPackageName:ko.rendererPackageName,rendererConfig:ko.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Zi.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=k0(n),n===null?null:n.stateNode},findFiberByHostInstance:ko.findFiberByHostInstance||WM,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var dl=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!dl.isDisabled&&dl.supportsFiber)try{su=dl.inject($M),Si=dl}catch{}}kn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=jM;kn.createPortal=function(n,e){var t=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!kp(e))throw Error(ie(200));return GM(n,e,null,t)};kn.createRoot=function(n,e){if(!kp(n))throw Error(ie(299));var t=!1,i="",r=gx;return e!=null&&(e.unstable_strictMode===!0&&(t=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onRecoverableError!==void 0&&(r=e.onRecoverableError)),e=Up(n,1,!1,null,null,t,!1,i,r),n[ji]=e.current,Ea(n.nodeType===8?n.parentNode:n),new Op(e)};kn.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var e=n._reactInternals;if(e===void 0)throw typeof n.render=="function"?Error(ie(188)):(n=Object.keys(n).join(","),Error(ie(268,n)));return n=k0(e),n=n===null?null:n.stateNode,n};kn.flushSync=function(n){return os(n)};kn.hydrate=function(n,e,t){if(!vu(e))throw Error(ie(200));return xu(null,n,e,!0,t)};kn.hydrateRoot=function(n,e,t){if(!kp(n))throw Error(ie(405));var i=t!=null&&t.hydratedSources||null,r=!1,s="",o=gx;if(t!=null&&(t.unstable_strictMode===!0&&(r=!0),t.identifierPrefix!==void 0&&(s=t.identifierPrefix),t.onRecoverableError!==void 0&&(o=t.onRecoverableError)),e=mx(e,null,n,1,t??null,r,!1,s,o),n[ji]=e.current,Ea(n),i)for(n=0;n<i.length;n++)t=i[n],r=t._getVersion,r=r(t._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[t,r]:e.mutableSourceEagerHydrationData.push(t,r);return new _u(e)};kn.render=function(n,e,t){if(!vu(e))throw Error(ie(200));return xu(null,n,e,!1,t)};kn.unmountComponentAtNode=function(n){if(!vu(n))throw Error(ie(40));return n._reactRootContainer?(os(function(){xu(null,null,n,!1,function(){n._reactRootContainer=null,n[ji]=null})}),!0):!1};kn.unstable_batchedUpdates=Lp;kn.unstable_renderSubtreeIntoContainer=function(n,e,t,i){if(!vu(t))throw Error(ie(200));if(n==null||n._reactInternals===void 0)throw Error(ie(38));return xu(n,e,t,!1,i)};kn.version="18.3.1-next-f1338f8080-20240426";function _x(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(_x)}catch(n){console.error(n)}}_x(),_0.exports=kn;var YM=_0.exports,vx,Mg=YM;vx=Mg.createRoot,Mg.hydrateRoot;class qM{constructor(){this.listeners=new Map}on(e,t){this.listeners.has(e)||this.listeners.set(e,new Set),this.listeners.get(e).add(t)}off(e,t){var i;(i=this.listeners.get(e))==null||i.delete(t)}emit(e,t){var i;(i=this.listeners.get(e))==null||i.forEach(r=>r(t))}clear(){this.listeners.clear()}}const ct=new qM;class pi{static process(e,t,i){if(i&&e.hook_event_name==="SessionStart"&&ct.emit("node:created",{sessionId:e.session_id,node:i}),i&&["PostToolUse","PostToolUseFailure"].includes(e.hook_event_name)&&e.tool_name&&ct.emit("tool:used",{sessionId:e.session_id,nodeKey:i.key,tool:e.tool_name,colorHex:i.colorHex,inbound:!1,agentId:null,toolInput:e.tool_input,toolResponse:e.tool_response}),e.hook_event_name==="UserPromptSubmit"&&e.prompt){const r=e.prompt.trim().split(/\s+/).filter(o=>o.length>0);r.length>0&&ct.emit("prompt:submitted",{sessionId:e.session_id,words:r,color:"#b0c8f0"})}if(e.hook_event_name==="Stop"&&e.last_assistant_message){const r=e.last_assistant_message.trim().split(/\s+/).filter(s=>s.length>0).slice(0,8);r.length>0&&ct.emit("response:received",{sessionId:e.session_id,words:r,color:"#aab8f0"})}e.hook_event_name==="SessionStart"&&ct.emit("cluster:created",{cluster:t}),e.hook_event_name==="SessionEnd"&&ct.emit("cluster:removed",{sessionId:e.session_id}),e.hook_event_name==="PreCompact"&&ct.emit("compact:pre",{sessionId:e.session_id}),e.hook_event_name==="PostCompact"&&ct.emit("compact:post",{sessionId:e.session_id}),e.hook_event_name==="PermissionRequest"&&ct.emit("permission:request",{sessionId:e.session_id}),e.hook_event_name==="SubagentStart"&&e.agent_id&&ct.emit("subagent:start",{sessionId:e.session_id,agentId:e.agent_id,agentType:e.agent_type||"agent"}),e.hook_event_name==="SubagentStop"&&e.agent_id&&ct.emit("subagent:stop",{sessionId:e.session_id,agentId:e.agent_id}),e.hook_event_name==="SessionEnd"&&ct.emit("session:end",{sessionId:e.session_id}),e.hook_event_name==="Notification"&&i&&ct.emit("notification",{sessionId:e.session_id,nodeKey:i.key,title:e.title||"notification"})}}const Fr=[70,120,175,225],hl=[4,8,18,20],Bo=[.0015,.001,6e-4,4e-4],Xd={Read:"#4ade80",Edit:"#60a5fa",Write:"#60a5fa",Bash:"#f59e0b",Grep:"#a78bfa",Glob:"#a78bfa",WebFetch:"#f472b6",Stop:"#aaaaaa",Notification:"#34d399",prompt:"#b0c8f0",response:"#7eb8f0",compact:"#FFD060",error:"#f87171",SubagentStop:"#c084fc"},jd="#4ade80";function Bp(n){if(n<Fr.length)return Fr[n];const e=Fr[Fr.length-1]??200,t=Fr[Fr.length-2]??e-55,i=Math.max(40,e-t);return e+i*(n-(Fr.length-1))}function wg(n){if(n<Bo.length)return Bo[n];const e=Bo[Bo.length-1]??4e-4,t=n-(Bo.length-1);return Math.max(e*Math.pow(.85,t),e*.2)}function KM(n){return n<hl.length?hl[n]:hl[hl.length-1]??20}function Eg(n){const e=n.toLowerCase().replace("claude-","");return e.startsWith("opus")?"opus":e.startsWith("sonnet")?"sonnet":e.startsWith("haiku")?"haiku":"unknown"}const pl={opus:{base:[1,.45,.12],bright:[1,.75,.4],glow:15757344,core:16759654,brightHex:16764040},sonnet:{base:[.25,.5,1],bright:[.5,.75,1],glow:4227327,core:8433919,brightHex:11194623},haiku:{base:[.2,.85,.45],bright:[.5,1,.7],glow:3201136,core:7405488,brightHex:10551240},unknown:{base:[.78,.84,.94],bright:[.94,.96,1],glow:13161968,core:15791615,brightHex:16777215}};function Tg(n){let e=2166136261;for(let t=0;t<n.length;t++)e=Math.imul(e^n.charCodeAt(t),16777619);return(e>>>0)%15-7}const pa=6,ZM={Read:"#4ade80",Edit:"#60a5fa",Write:"#60a5fa",Bash:"#f59e0b",Grep:"#a78bfa",Glob:"#a78bfa",WebFetch:"#f472b6",Stop:"#888888",Notification:"#34d399"},QM="#555555";function JM(n){const e=parseInt(n.slice(1,3),16),t=parseInt(n.slice(3,5),16),i=parseInt(n.slice(5,7),16),r=Math.round(e*.3+190*.7),s=Math.round(t*.3+190*.7),o=Math.round(i*.3+190*.7);return`#${r.toString(16).padStart(2,"0")}${s.toString(16).padStart(2,"0")}${o.toString(16).padStart(2,"0")}`}function Ag(n){return parseInt(n.replace("#",""),16)}const ml=typeof window<"u"?window.innerWidth:1280,gl=typeof window<"u"?window.innerHeight:800;function e1(n){for(let e=0;;e++)if(e>=n.ringCounts.length&&(n.ringCounts[e]=0),n.ringCounts[e]<KM(e))return e}function t1(n,e){const t=[...n.nodes.values()].filter(d=>d.orbitRing===e),i=t.length;if(i===0||i===1)return;const r=t.sort((d,a)=>{const f=d.targetOrbitAngle??d.orbitAngle,h=a.targetOrbitAngle??a.orbitAngle;return f-h}),s=Math.PI*2/i;let o=0,c=0;for(const d of r){const a=d.targetOrbitAngle??d.orbitAngle;o+=Math.sin(a),c+=Math.cos(a)}const u=Math.atan2(o/i,c/i)-s*(i-1)/2;r.forEach((d,a)=>{const f=u+a*s,h=d.targetOrbitAngle??d.orbitAngle,m=Math.atan2(Math.sin(f-h),Math.cos(f-h));Math.abs(m)>.05&&(d.targetOrbitAngle=f)})}function _l(n){var r;const e=String(n.id||`${n.session_id}-${n.timestamp}`),t=n.tool_name;if(!t)return n.hook_event_name==="Stop"?`session:stop:${e}`:n.hook_event_name==="Notification"?`notification:${(((r=n.tool_input)==null?void 0:r.message)||"").slice(0,20)}:${e}`:n.hook_event_name==="PermissionRequest"?`permission:${e}`:`hook:${n.hook_event_name}:${e}`;const i=n.tool_input;if(["Read","Edit","Write","Glob","Grep"].includes(t)){const s=(i==null?void 0:i.file_path)||(i==null?void 0:i.path)||null;return s?`file:${s}:${e}`:`file:unknown:${e}`}if(t==="Bash")return`bash:${(i==null?void 0:i.command)||""}:${e}`;if(t==="WebFetch")try{return`web:${new URL((i==null?void 0:i.url)||"").hostname}:${e}`}catch{return`web:unknown:${e}`}return`tool:${t}:${e}`}function xx(n){if(n.startsWith("mcp_")){const e=n.split("__");return e[e.length-1].replace(/_/g," ")}return n}function n1(n){var i;const e=n.tool_name,t=n.tool_input;if(["Read","Edit","Write","Glob","Grep"].includes(e||"")){const r=(t==null?void 0:t.file_path)||(t==null?void 0:t.path)||"";return r.split("/").pop()||r}if(e==="Bash")return`$ ${((t==null?void 0:t.command)||"").slice(0,22)}`;if(e==="WebFetch")try{return`↗ ${new URL((t==null?void 0:t.url)||"").hostname}`}catch{return"↗ web"}return n.hook_event_name==="Stop"?"✓ done":n.hook_event_name==="Notification"?(((i=n.tool_input)==null?void 0:i.message)||"notification").slice(0,24):e&&e.startsWith("mcp_")?xx(e).slice(0,20):e||n.hook_event_name||"?"}function bg(n,e){var c,l;const t=n.tool_name||n.hook_event_name||"?",i=n.tool_input,r=n.tool_response,s=t.startsWith("mcp_")?xx(t).slice(0,14):t,o=e?` ${e}`:"";if(n.hook_event_name==="PostToolUseFailure"&&n.is_interrupt)return`⏹ interrupted${o}`;if(n.hook_event_name==="PostToolUse"&&r){if(t==="Bash"){const u=r.exitCode??r.exit_code??r.code;if(u!=null)return u===0?`${s} ✓${o}`:`${s} ✗ ${u}${o}`}if(t==="Grep"){const u=r.count??r.numMatches??r.total;if(u!==void 0)return`${s} ${u} hits${o}`}if(t==="Glob"){const u=Array.isArray(r)?r.length:((c=r.files)==null?void 0:c.length)??r.count;if(u!==void 0)return`${s} ${u} files${o}`}}if(i){if(t==="Edit"){const u=i.new_string||"",d=i.old_string||"",a=u.split(`
`).length,f=d.split(`
`).length;return a!==f?`${s} +${a} -${f}${o}`:`${s} ${a}L${o}`}if(t==="Write"){const d=(i.content||"").split(`
`).length;return`${s} ${d}L${o}`}if(t==="Read"){const u=i.limit,d=i.offset;if(d)return`${s} @${d}${o}`;if(u)return`${s} ${u}L${o}`}if(t==="Bash")return`$ ${((l=(i.command||"").split(/\s+/)[0])==null?void 0:l.split("/").pop())||""}${o}`;if(t==="Grep")return`${s} /${(i.pattern||"").toString().slice(0,10)}/${o}`}return s+o}function i1(n){const e=n.tool_name;return["Read","Edit","Write","Glob","Grep"].includes(e||"")?"file":e==="Bash"?"bash":e==="WebFetch"?"web":n.hook_event_name==="Stop"?"stop":n.hook_event_name==="Notification"?"notification":"tool"}function nf(n){let e=0;for(let t=n.ringCounts.length-1;t>=0;t--)if(n.ringCounts[t]>0){e=t;break}return Bp(e)}function r1(n,e){const t=(o,c)=>{const l=nf(o),u=nf(c);return(l+u)*2+100};for(let o=0;o<24;o++){const c=(n+o/24)/Math.max(pa,1)*Math.PI*2,u=(e.length>0?e.reduce((m,v)=>m+nf(v),0)/e.length:Bp(0))*4/Math.sin(Math.PI/Math.max(pa,2)),d=Math.max(u,Math.min(ml,gl)*.38),a=ml/2+Math.cos(c)*d,f=gl/2+Math.sin(c)*d;if(!e.some(m=>{const v=t(m,{ringCounts:[]});return Math.hypot(m.centerX-a,m.centerY-f)<v}))return{x:a,y:f}}const r=n/Math.max(pa,1)*Math.PI*2,s=Math.min(ml,gl)*.38;return{x:ml/2+Math.cos(r)*s,y:gl/2+Math.sin(r)*s}}function s1(){const n=[],e=new Map,t=new Map,i=new Map;function r(){const l=new Map;for(let u=0;u<n.length;u++){const d=n[u],a=_l(d);a&&(l.has(d.session_id)||l.set(d.session_id,new Map),l.get(d.session_id).set(a,u))}for(const[u,d]of e){const a=l.get(u);for(const[f,h]of d.nodes){if(!(a!=null&&a.has(f)))continue;const m=a.get(f),v=n.length-1-m;h.age=d.stopping&&h.age>=80?h.age:v,h.lastEventIndex=m}d.stopping&&d.nodes.size===0&&e.delete(u)}}function s(l,u=!1){var S,A;if(n.push(l),!e.has(l.session_id)){if(e.size>=pa){const k=e.keys().next().value;k!==void 0&&e.delete(k)}const M=e.size,T=l.session_id,y=T.startsWith("unknown-")?`#${T.slice(8,12)}`:T.slice(0,8);let E=null;const D=T.match(/^([a-f0-9-]{36})[-_]sub[-_]/i)||T.match(/^([a-f0-9-]{36})\//i);if(D)E=D[1];else if(T.includes("_sub_")||T.includes("-sub-")){const k=T.indexOf("_sub_")!==-1?T.indexOf("_sub_"):T.indexOf("-sub-");E=T.slice(0,k)}const C=E?e.get(E)??null:null,F=C!==null,L=F?[...e.values()].filter(k=>k.parentSessionId===E).length:0;let U,z=M/Math.max(pa,1)*Math.PI*2;if(C){const k=L/3*Math.PI*2-Math.PI/4;U={x:C.centerX+Math.cos(k)*480,y:C.centerY+Math.sin(k)*480},z=k}else U=r1(M,[...e.values()]);const V={sessionId:l.session_id,label:y,centerX:U.x,centerY:U.y,nodes:new Map,edges:[],stopping:!1,lastFileKey:null,parentSessionId:E,ringCounts:[],layoutAngle:z,isChild:F,childIndex:L,compacting:0,compacted:0,promptSnakes:[],agentPositionMap:new Map},H=Tg(l.session_id);V.ringSpeedJitter=H,V.ringSpeeds=[],e.set(l.session_id,V)}const d=e.get(l.session_id);if(d.eventCount=(d.eventCount||0)+1,l.model&&l.model!==d.model&&(d.model=l.model),d.label.length<=8||d.label.startsWith("#")){let M="";if(l.cwd){const T=l.cwd.split("/").filter(Boolean);M=T[T.length-1]||""}if(!M){const T=((S=l.tool_input)==null?void 0:S.file_path)||((A=l.tool_input)==null?void 0:A.path)||"";if(T.includes("/")){const y=T.split("/").filter(Boolean),E=y.lastIndexOf("src");E>0?M=y[E-1]:y.length>=3&&(M=y[y.length-3])}}M&&M.length>1&&(d.label=M)}if(l.hook_event_name==="Stop"){d.stopping=!0;for(const M of d.nodes.values())M.age=Math.max(M.age,80)}if(l.hook_event_name==="PermissionRequest"&&(d.awaitingPermission=!0),(l.hook_event_name==="PostToolUse"||l.hook_event_name==="PreToolUse")&&(d.awaitingPermission=!1),l.hook_event_name==="PreToolUse"&&l.tool_use_id&&(t.set(l.tool_use_id,l.timestamp),i.set(l.tool_use_id,l.tool_input)),l.hook_event_name==="SubagentStart"){const M=l.agent_id||`${l.session_id}-sub`,T=`agent:${M}`;if(!d.nodes.has(T)){const y=Math.random()*Math.PI*2;d.nodes.set(T,{key:T,label:l.agent_type||"agent",nodeType:"agent",baseRadius:3,color:Ag("#c084fc"),colorHex:"#c084fc",x:d.centerX+Math.cos(y)*32,y:d.centerY+Math.sin(y)*32,vx:0,vy:0,age:0,lastEventIndex:n.length-1,lastTool:null,lastTimestamp:l.timestamp,eventCount:1,awaitingPermission:!1,orbitRing:-1,orbitAngle:y,orbitSpeed:.007,orbitRadius:32,life:1,entry:0,impactType:null,impactTime:0,actionLabel:null,actionFade:0,marks:[]});const E=d.nodes.get(T);d.agentPositionMap.set(M,{x:E.x,y:E.y}),console.log(`[Store] Agent ${M} registered at (${E.x.toFixed(0)}, ${E.y.toFixed(0)})`)}r(),u||pi.process(l,d,null);return}if(l.hook_event_name==="SubagentStop"){const M=l.agent_id||`${l.session_id}-sub`,T=`agent:${M}`,y=d.nodes.get(T);y&&(y.life=.08,y.impactType="fade",y.impactTime=1,d.agentPositionMap.delete(M)),r(),u||pi.process(l,d,null);return}if(l.hook_event_name==="SessionEnd"){e.delete(l.session_id),u||pi.process(l,d,null);return}if(l.hook_event_name==="UserPromptSubmit"){d.coreAct=1,r(),u||pi.process(l,d,null);return}if(l.hook_event_name==="ConfigChange"){l.model&&(d.model=l.model),d.coreAct=1,r(),u||pi.process(l,d,null);return}if(l.hook_event_name==="SessionStart"){l.model&&(d.model=l.model),l.source&&(d.source=l.source),d.coreAct=1,r(),u||pi.process(l,d,null);return}if(l.hook_event_name==="PreCompact"){d.coreAct=1,d.compacting=1,r(),u||pi.process(l,d,null);return}if(l.hook_event_name==="PostCompact"){d.coreAct=1,d.compacted=1,d.eventCount=Math.floor((d.eventCount||0)*.25),r(),u||pi.process(l,d,null);return}const a=_l(l);if(!a){r();return}const f=ZM[l.tool_name||l.hook_event_name]??QM,h=JM(f),m=Ag(h),v=i1(l),g=v==="file";let p="";if((l.hook_event_name==="PostToolUse"||l.hook_event_name==="PostToolUseFailure")&&l.tool_use_id){const M=t.get(l.tool_use_id);if(M){const T=l.timestamp-M;p=T<1e3?`${T}ms`:`${(T/1e3).toFixed(1)}s`,t.delete(l.tool_use_id)}!l.tool_input&&i.has(l.tool_use_id)&&(l.tool_input=i.get(l.tool_use_id)??null,i.delete(l.tool_use_id))}if(d.nodes.has(a)){const M=d.nodes.get(a);if(M.lastTool=l.tool_name||l.hook_event_name||null,M.lastTimestamp=l.timestamp,M.eventCount++,M.colorHex=h,M.color=m,g&&(M.baseRadius=Math.min(8,M.baseRadius+.3)),l.hook_event_name==="PostToolUseFailure")M.impactType="fail",M.impactTime=1,l.is_interrupt?M.actionLabel="⏹ interrupted"+(p?` ${p}`:""):M.actionLabel="✗ error"+(p?` ${p}`:""),M.actionFade=0;else if(l.hook_event_name==="PostToolUse"){const T=l.tool_name||"";["Read","Grep","Glob"].includes(T)?M.impactType="scan":["Edit","Write"].includes(T)?M.impactType="morph":T==="Bash"?M.impactType="spark":M.impactType="scan",M.impactTime=1;const y=bg(l,p||void 0);y!==T&&(M.actionLabel=y)}else{const T=l.tool_name||l.hook_event_name||"";["Read","Grep","Glob"].includes(T)?M.impactType="scan":["Edit","Write"].includes(T)?M.impactType="morph":T==="Bash"?M.impactType="spark":T==="Notification"?M.impactType="ping":T==="Stop"?M.impactType="fade":M.impactType="scan",M.impactTime=1,M.actionLabel=bg(l),M.actionFade=l.hook_event_name==="Stop"||l.hook_event_name==="Notification"?1:0}}else{const M=e1(d);d.ringCounts[M]++;const T=d.ringSpeeds,y=d.ringSpeedJitter??Tg(l.session_id);let E=wg(M);T&&(T[M]==null&&(T[M]=wg(M)*(1+(y+(M*2-1))/7*.2)),E=T[M]);const D=Bp(M),C=[...d.nodes.values()].filter(L=>L.orbitRing===M);let F=Math.random()*Math.PI*2;if(C.length>0){const L=C.map(V=>V.targetOrbitAngle??V.orbitAngle).sort((V,H)=>V-H);let U=0,z=0;for(let V=0;V<L.length;V++){const k=(V+1<L.length?L[V+1]:L[0]+Math.PI*2)-L[V];k>U&&(U=k,z=L[V]+k/2)}F=z}if(d.nodes.set(a,{key:a,label:n1(l),nodeType:v,baseRadius:g?2.5+Math.min(9,1)*.45:4,color:m,colorHex:h,x:d.centerX+Math.cos(F)*D,y:d.centerY+Math.sin(F)*D,vx:0,vy:0,age:0,lastEventIndex:n.length-1,lastTool:l.tool_name||l.hook_event_name||null,lastTimestamp:l.timestamp,eventCount:1,awaitingPermission:!1,orbitRing:M,orbitAngle:F,orbitSpeed:E,orbitRadius:D,life:1,entry:0,impactType:null,impactTime:0,actionLabel:null,actionFade:0,marks:[]}),t1(d,M),l.hook_event_name==="PostToolUseFailure"){const L=d.nodes.get(a);L.impactType="fail",L.impactTime=1,l.is_interrupt?L.actionLabel="⏹ interrupted"+(p?` ${p}`:""):L.actionLabel="✗ error"+(p?` ${p}`:""),L.actionFade=0}else if(l.hook_event_name==="Stop"||l.hook_event_name==="Notification"){const L=d.nodes.get(a);L.actionLabel=l.tool_name||l.hook_event_name,L.actionFade=1}}a&&g&&(d.lastFileKey&&d.lastFileKey!==a&&d.nodes.has(d.lastFileKey)&&(d.edges.some(T=>T.fromKey===d.lastFileKey&&T.toKey===a)||d.edges.push({fromKey:d.lastFileKey,toKey:a,color:m,colorHex:h,age:0})),d.lastFileKey=a),r();const _=_l(l),x=_?d.nodes.get(_)??null:null;u||pi.process(l,d,x)}function o(l){for(const u of l){const d=e.get(u.session_id);if(!d)continue;const a=_l(u),f=a?d.nodes.get(a)??null:null;pi.process(u,d,f)}}function c(l){if(l){for(let u=n.length-1;u>=0;u--)n[u].session_id===l&&n.splice(u,1);e.delete(l),r()}}return{addEvent:s,clearSession:c,replayEvents:o,getBuffer:()=>[...n],getSessions:()=>e}}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const zp="183",ao={ROTATE:0,DOLLY:1,PAN:2},eo={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},o1=0,Cg=1,a1=2,gc=1,l1=2,na=3,br=0,En=1,ri=2,wi=0,lo=1,it=2,Rg=3,Pg=4,c1=5,$r=100,u1=101,f1=102,d1=103,h1=104,p1=200,m1=201,g1=202,_1=203,$d=204,Yd=205,v1=206,x1=207,y1=208,S1=209,M1=210,w1=211,E1=212,T1=213,A1=214,qd=0,Kd=1,Zd=2,xo=3,Qd=4,Jd=5,eh=6,th=7,yx=0,b1=1,C1=2,Ei=0,Sx=1,Mx=2,wx=3,Ex=4,Tx=5,Ax=6,bx=7,Cx=300,as=301,yo=302,rf=303,sf=304,yu=306,nh=1e3,Vi=1001,ih=1002,Zt=1003,R1=1004,vl=1005,an=1006,of=1007,Qr=1008,Dn=1009,Rx=1010,Px=1011,Ia=1012,Vp=1013,Ai=1014,oi=1015,Fn=1016,Hp=1017,Gp=1018,Na=1020,Lx=35902,Dx=35899,Ix=1021,Nx=1022,ai=1023,qi=1026,Jr=1027,Wp=1028,Xp=1029,So=1030,jp=1031,$p=1033,_c=33776,vc=33777,xc=33778,yc=33779,rh=35840,sh=35841,oh=35842,ah=35843,lh=36196,ch=37492,uh=37496,fh=37488,dh=37489,hh=37490,ph=37491,mh=37808,gh=37809,_h=37810,vh=37811,xh=37812,yh=37813,Sh=37814,Mh=37815,wh=37816,Eh=37817,Th=37818,Ah=37819,bh=37820,Ch=37821,Rh=36492,Ph=36494,Lh=36495,Dh=36283,Ih=36284,Nh=36285,Uh=36286,P1=3200,Q2=3201,Ux=0,L1=1,hr="",Gn="srgb",Mo="srgb-linear",Kc="linear",lt="srgb",_s=7680,Lg=519,D1=512,I1=513,N1=514,Yp=515,U1=516,F1=517,qp=518,O1=519,Fh=35044,J2=35048,Dg="300 es",yi=2e3,Ua=2001;function k1(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Zc(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function B1(){const n=Zc("canvas");return n.style.display="block",n}const Ig={};function Qc(...n){const e="THREE."+n.shift();console.log(e,...n)}function Fx(n){const e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Fe(...n){n=Fx(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function Je(...n){n=Fx(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function Jc(...n){const e=n.join(" ");e in Ig||(Ig[e]=!0,Fe(...n))}function z1(n,e,t){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}const V1={[qd]:Kd,[Zd]:eh,[Qd]:th,[xo]:Jd,[Kd]:qd,[eh]:Zd,[th]:Qd,[Jd]:xo};class us{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const r=i[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const rn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Ng=1234567;const co=Math.PI/180,Fa=180/Math.PI;function Gi(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(rn[n&255]+rn[n>>8&255]+rn[n>>16&255]+rn[n>>24&255]+"-"+rn[e&255]+rn[e>>8&255]+"-"+rn[e>>16&15|64]+rn[e>>24&255]+"-"+rn[t&63|128]+rn[t>>8&255]+"-"+rn[t>>16&255]+rn[t>>24&255]+rn[i&255]+rn[i>>8&255]+rn[i>>16&255]+rn[i>>24&255]).toLowerCase()}function je(n,e,t){return Math.max(e,Math.min(t,n))}function Kp(n,e){return(n%e+e)%e}function H1(n,e,t,i,r){return i+(n-e)*(r-i)/(t-e)}function G1(n,e,t){return n!==e?(t-n)/(e-n):0}function ma(n,e,t){return(1-t)*n+t*e}function W1(n,e,t,i){return ma(n,e,1-Math.exp(-t*i))}function X1(n,e=1){return e-Math.abs(Kp(n,e*2)-e)}function j1(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function $1(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function Y1(n,e){return n+Math.floor(Math.random()*(e-n+1))}function q1(n,e){return n+Math.random()*(e-n)}function K1(n){return n*(.5-Math.random())}function Z1(n){n!==void 0&&(Ng=n);let e=Ng+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Q1(n){return n*co}function J1(n){return n*Fa}function ew(n){return(n&n-1)===0&&n!==0}function tw(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function nw(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function iw(n,e,t,i,r){const s=Math.cos,o=Math.sin,c=s(t/2),l=o(t/2),u=s((e+i)/2),d=o((e+i)/2),a=s((e-i)/2),f=o((e-i)/2),h=s((i-e)/2),m=o((i-e)/2);switch(r){case"XYX":n.set(c*d,l*a,l*f,c*u);break;case"YZY":n.set(l*f,c*d,l*a,c*u);break;case"ZXZ":n.set(l*a,l*f,c*d,c*u);break;case"XZX":n.set(c*d,l*m,l*h,c*u);break;case"YXY":n.set(l*h,c*d,l*m,c*u);break;case"ZYZ":n.set(l*m,l*h,c*d,c*u);break;default:Fe("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function si(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function ut(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const rw={DEG2RAD:co,RAD2DEG:Fa,generateUUID:Gi,clamp:je,euclideanModulo:Kp,mapLinear:H1,inverseLerp:G1,lerp:ma,damp:W1,pingpong:X1,smoothstep:j1,smootherstep:$1,randInt:Y1,randFloat:q1,randFloatSpread:K1,seededRandom:Z1,degToRad:Q1,radToDeg:J1,isPowerOfTwo:ew,ceilPowerOfTwo:tw,floorPowerOfTwo:nw,setQuaternionFromProperEuler:iw,normalize:ut,denormalize:si};class xe{constructor(e=0,t=0){xe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=je(this.x,e.x,t.x),this.y=je(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=je(this.x,e,t),this.y=je(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(je(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(je(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Cr{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,o,c){let l=i[r+0],u=i[r+1],d=i[r+2],a=i[r+3],f=s[o+0],h=s[o+1],m=s[o+2],v=s[o+3];if(a!==v||l!==f||u!==h||d!==m){let g=l*f+u*h+d*m+a*v;g<0&&(f=-f,h=-h,m=-m,v=-v,g=-g);let p=1-c;if(g<.9995){const _=Math.acos(g),x=Math.sin(_);p=Math.sin(p*_)/x,c=Math.sin(c*_)/x,l=l*p+f*c,u=u*p+h*c,d=d*p+m*c,a=a*p+v*c}else{l=l*p+f*c,u=u*p+h*c,d=d*p+m*c,a=a*p+v*c;const _=1/Math.sqrt(l*l+u*u+d*d+a*a);l*=_,u*=_,d*=_,a*=_}}e[t]=l,e[t+1]=u,e[t+2]=d,e[t+3]=a}static multiplyQuaternionsFlat(e,t,i,r,s,o){const c=i[r],l=i[r+1],u=i[r+2],d=i[r+3],a=s[o],f=s[o+1],h=s[o+2],m=s[o+3];return e[t]=c*m+d*a+l*h-u*f,e[t+1]=l*m+d*f+u*a-c*h,e[t+2]=u*m+d*h+c*f-l*a,e[t+3]=d*m-c*a-l*f-u*h,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,s=e._z,o=e._order,c=Math.cos,l=Math.sin,u=c(i/2),d=c(r/2),a=c(s/2),f=l(i/2),h=l(r/2),m=l(s/2);switch(o){case"XYZ":this._x=f*d*a+u*h*m,this._y=u*h*a-f*d*m,this._z=u*d*m+f*h*a,this._w=u*d*a-f*h*m;break;case"YXZ":this._x=f*d*a+u*h*m,this._y=u*h*a-f*d*m,this._z=u*d*m-f*h*a,this._w=u*d*a+f*h*m;break;case"ZXY":this._x=f*d*a-u*h*m,this._y=u*h*a+f*d*m,this._z=u*d*m+f*h*a,this._w=u*d*a-f*h*m;break;case"ZYX":this._x=f*d*a-u*h*m,this._y=u*h*a+f*d*m,this._z=u*d*m-f*h*a,this._w=u*d*a+f*h*m;break;case"YZX":this._x=f*d*a+u*h*m,this._y=u*h*a+f*d*m,this._z=u*d*m-f*h*a,this._w=u*d*a-f*h*m;break;case"XZY":this._x=f*d*a-u*h*m,this._y=u*h*a-f*d*m,this._z=u*d*m+f*h*a,this._w=u*d*a+f*h*m;break;default:Fe("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],s=t[8],o=t[1],c=t[5],l=t[9],u=t[2],d=t[6],a=t[10],f=i+c+a;if(f>0){const h=.5/Math.sqrt(f+1);this._w=.25/h,this._x=(d-l)*h,this._y=(s-u)*h,this._z=(o-r)*h}else if(i>c&&i>a){const h=2*Math.sqrt(1+i-c-a);this._w=(d-l)/h,this._x=.25*h,this._y=(r+o)/h,this._z=(s+u)/h}else if(c>a){const h=2*Math.sqrt(1+c-i-a);this._w=(s-u)/h,this._x=(r+o)/h,this._y=.25*h,this._z=(l+d)/h}else{const h=2*Math.sqrt(1+a-i-c);this._w=(o-r)/h,this._x=(s+u)/h,this._y=(l+d)/h,this._z=.25*h}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(je(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,s=e._z,o=e._w,c=t._x,l=t._y,u=t._z,d=t._w;return this._x=i*d+o*c+r*u-s*l,this._y=r*d+o*l+s*c-i*u,this._z=s*d+o*u+i*l-r*c,this._w=o*d-i*c-r*l-s*u,this._onChangeCallback(),this}slerp(e,t){let i=e._x,r=e._y,s=e._z,o=e._w,c=this.dot(e);c<0&&(i=-i,r=-r,s=-s,o=-o,c=-c);let l=1-t;if(c<.9995){const u=Math.acos(c),d=Math.sin(u);l=Math.sin(l*u)/d,t=Math.sin(t*u)/d,this._x=this._x*l+i*t,this._y=this._y*l+r*t,this._z=this._z*l+s*t,this._w=this._w*l+o*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+r*t,this._z=this._z*l+s*t,this._w=this._w*l+o*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(e=0,t=0,i=0){P.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Ug.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Ug.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,s=e.x,o=e.y,c=e.z,l=e.w,u=2*(o*r-c*i),d=2*(c*t-s*r),a=2*(s*i-o*t);return this.x=t+l*u+o*a-c*d,this.y=i+l*d+c*u-s*a,this.z=r+l*a+s*d-o*u,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=je(this.x,e.x,t.x),this.y=je(this.y,e.y,t.y),this.z=je(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=je(this.x,e,t),this.y=je(this.y,e,t),this.z=je(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(je(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,s=e.z,o=t.x,c=t.y,l=t.z;return this.x=r*l-s*c,this.y=s*o-i*l,this.z=i*c-r*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return af.copy(this).projectOnVector(e),this.sub(af)}reflect(e){return this.sub(af.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(je(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const af=new P,Ug=new Cr;class We{constructor(e,t,i,r,s,o,c,l,u){We.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,c,l,u)}set(e,t,i,r,s,o,c,l,u){const d=this.elements;return d[0]=e,d[1]=r,d[2]=c,d[3]=t,d[4]=s,d[5]=l,d[6]=i,d[7]=o,d[8]=u,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],c=i[3],l=i[6],u=i[1],d=i[4],a=i[7],f=i[2],h=i[5],m=i[8],v=r[0],g=r[3],p=r[6],_=r[1],x=r[4],S=r[7],A=r[2],M=r[5],T=r[8];return s[0]=o*v+c*_+l*A,s[3]=o*g+c*x+l*M,s[6]=o*p+c*S+l*T,s[1]=u*v+d*_+a*A,s[4]=u*g+d*x+a*M,s[7]=u*p+d*S+a*T,s[2]=f*v+h*_+m*A,s[5]=f*g+h*x+m*M,s[8]=f*p+h*S+m*T,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],c=e[5],l=e[6],u=e[7],d=e[8];return t*o*d-t*c*u-i*s*d+i*c*l+r*s*u-r*o*l}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],c=e[5],l=e[6],u=e[7],d=e[8],a=d*o-c*u,f=c*l-d*s,h=u*s-o*l,m=t*a+i*f+r*h;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/m;return e[0]=a*v,e[1]=(r*u-d*i)*v,e[2]=(c*i-r*o)*v,e[3]=f*v,e[4]=(d*t-r*l)*v,e[5]=(r*s-c*t)*v,e[6]=h*v,e[7]=(i*l-u*t)*v,e[8]=(o*t-i*s)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,o,c){const l=Math.cos(s),u=Math.sin(s);return this.set(i*l,i*u,-i*(l*o+u*c)+o+e,-r*u,r*l,-r*(-u*o+l*c)+c+t,0,0,1),this}scale(e,t){return this.premultiply(lf.makeScale(e,t)),this}rotate(e){return this.premultiply(lf.makeRotation(-e)),this}translate(e,t){return this.premultiply(lf.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const lf=new We,Fg=new We().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Og=new We().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function sw(){const n={enabled:!0,workingColorSpace:Mo,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===lt&&(r.r=Wi(r.r),r.g=Wi(r.g),r.b=Wi(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===lt&&(r.r=uo(r.r),r.g=uo(r.g),r.b=uo(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===hr?Kc:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return Jc("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return Jc("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Mo]:{primaries:e,whitePoint:i,transfer:Kc,toXYZ:Fg,fromXYZ:Og,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Gn},outputColorSpaceConfig:{drawingBufferColorSpace:Gn}},[Gn]:{primaries:e,whitePoint:i,transfer:lt,toXYZ:Fg,fromXYZ:Og,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Gn}}}),n}const et=sw();function Wi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function uo(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let vs;class ow{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{vs===void 0&&(vs=Zc("canvas")),vs.width=e.width,vs.height=e.height;const r=vs.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=vs}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Zc("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=Wi(s[o]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Wi(t[i]/255)*255):t[i]=Wi(t[i]);return{data:t,width:e.width,height:e.height}}else return Fe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let aw=0;class Zp{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:aw++}),this.uuid=Gi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,c=r.length;o<c;o++)r[o].isDataTexture?s.push(cf(r[o].image)):s.push(cf(r[o]))}else s=cf(r);i.url=s}return t||(e.images[this.uuid]=i),i}}function cf(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?ow.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Fe("Texture: Unable to serialize Texture."),{})}let lw=0;const uf=new P;class ln extends us{constructor(e=ln.DEFAULT_IMAGE,t=ln.DEFAULT_MAPPING,i=Vi,r=Vi,s=an,o=Qr,c=ai,l=Dn,u=ln.DEFAULT_ANISOTROPY,d=hr){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:lw++}),this.uuid=Gi(),this.name="",this.source=new Zp(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=u,this.format=c,this.internalFormat=null,this.type=l,this.offset=new xe(0,0),this.repeat=new xe(1,1),this.center=new xe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new We,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(uf).x}get height(){return this.source.getSize(uf).y}get depth(){return this.source.getSize(uf).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){Fe(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){Fe(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Cx)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case nh:e.x=e.x-Math.floor(e.x);break;case Vi:e.x=e.x<0?0:1;break;case ih:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case nh:e.y=e.y-Math.floor(e.y);break;case Vi:e.y=e.y<0?0:1;break;case ih:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}ln.DEFAULT_IMAGE=null;ln.DEFAULT_MAPPING=Cx;ln.DEFAULT_ANISOTROPY=1;class Dt{constructor(e=0,t=0,i=0,r=1){Dt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*t+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*t+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*t+o[7]*i+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s;const l=e.elements,u=l[0],d=l[4],a=l[8],f=l[1],h=l[5],m=l[9],v=l[2],g=l[6],p=l[10];if(Math.abs(d-f)<.01&&Math.abs(a-v)<.01&&Math.abs(m-g)<.01){if(Math.abs(d+f)<.1&&Math.abs(a+v)<.1&&Math.abs(m+g)<.1&&Math.abs(u+h+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const x=(u+1)/2,S=(h+1)/2,A=(p+1)/2,M=(d+f)/4,T=(a+v)/4,y=(m+g)/4;return x>S&&x>A?x<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(x),r=M/i,s=T/i):S>A?S<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(S),i=M/r,s=y/r):A<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(A),i=T/s,r=y/s),this.set(i,r,s,t),this}let _=Math.sqrt((g-m)*(g-m)+(a-v)*(a-v)+(f-d)*(f-d));return Math.abs(_)<.001&&(_=1),this.x=(g-m)/_,this.y=(a-v)/_,this.z=(f-d)/_,this.w=Math.acos((u+h+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=je(this.x,e.x,t.x),this.y=je(this.y,e.y,t.y),this.z=je(this.z,e.z,t.z),this.w=je(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=je(this.x,e,t),this.y=je(this.y,e,t),this.z=je(this.z,e,t),this.w=je(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(je(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class cw extends us{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:an,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Dt(0,0,e,t),this.scissorTest=!1,this.viewport=new Dt(0,0,e,t),this.textures=[];const r={width:e,height:t,depth:i.depth},s=new ln(r),o=i.count;for(let c=0;c<o;c++)this.textures[c]=s.clone(),this.textures[c].isRenderTargetTexture=!0,this.textures[c].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:an,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const r=Object.assign({},e.textures[t].image);this.textures[t].source=new Zp(r)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Tn extends cw{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Ox extends ln{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Zt,this.minFilter=Zt,this.wrapR=Vi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class uw extends ln{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Zt,this.minFilter=Zt,this.wrapR=Vi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class dt{constructor(e,t,i,r,s,o,c,l,u,d,a,f,h,m,v,g){dt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,c,l,u,d,a,f,h,m,v,g)}set(e,t,i,r,s,o,c,l,u,d,a,f,h,m,v,g){const p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=r,p[1]=s,p[5]=o,p[9]=c,p[13]=l,p[2]=u,p[6]=d,p[10]=a,p[14]=f,p[3]=h,p[7]=m,p[11]=v,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new dt().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const t=this.elements,i=e.elements,r=1/xs.setFromMatrixColumn(e,0).length(),s=1/xs.setFromMatrixColumn(e,1).length(),o=1/xs.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),c=Math.sin(i),l=Math.cos(r),u=Math.sin(r),d=Math.cos(s),a=Math.sin(s);if(e.order==="XYZ"){const f=o*d,h=o*a,m=c*d,v=c*a;t[0]=l*d,t[4]=-l*a,t[8]=u,t[1]=h+m*u,t[5]=f-v*u,t[9]=-c*l,t[2]=v-f*u,t[6]=m+h*u,t[10]=o*l}else if(e.order==="YXZ"){const f=l*d,h=l*a,m=u*d,v=u*a;t[0]=f+v*c,t[4]=m*c-h,t[8]=o*u,t[1]=o*a,t[5]=o*d,t[9]=-c,t[2]=h*c-m,t[6]=v+f*c,t[10]=o*l}else if(e.order==="ZXY"){const f=l*d,h=l*a,m=u*d,v=u*a;t[0]=f-v*c,t[4]=-o*a,t[8]=m+h*c,t[1]=h+m*c,t[5]=o*d,t[9]=v-f*c,t[2]=-o*u,t[6]=c,t[10]=o*l}else if(e.order==="ZYX"){const f=o*d,h=o*a,m=c*d,v=c*a;t[0]=l*d,t[4]=m*u-h,t[8]=f*u+v,t[1]=l*a,t[5]=v*u+f,t[9]=h*u-m,t[2]=-u,t[6]=c*l,t[10]=o*l}else if(e.order==="YZX"){const f=o*l,h=o*u,m=c*l,v=c*u;t[0]=l*d,t[4]=v-f*a,t[8]=m*a+h,t[1]=a,t[5]=o*d,t[9]=-c*d,t[2]=-u*d,t[6]=h*a+m,t[10]=f-v*a}else if(e.order==="XZY"){const f=o*l,h=o*u,m=c*l,v=c*u;t[0]=l*d,t[4]=-a,t[8]=u*d,t[1]=f*a+v,t[5]=o*d,t[9]=h*a-m,t[2]=m*a-h,t[6]=c*d,t[10]=v*a+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(fw,e,dw)}lookAt(e,t,i){const r=this.elements;return Cn.subVectors(e,t),Cn.lengthSq()===0&&(Cn.z=1),Cn.normalize(),nr.crossVectors(i,Cn),nr.lengthSq()===0&&(Math.abs(i.z)===1?Cn.x+=1e-4:Cn.z+=1e-4,Cn.normalize(),nr.crossVectors(i,Cn)),nr.normalize(),xl.crossVectors(Cn,nr),r[0]=nr.x,r[4]=xl.x,r[8]=Cn.x,r[1]=nr.y,r[5]=xl.y,r[9]=Cn.y,r[2]=nr.z,r[6]=xl.z,r[10]=Cn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],c=i[4],l=i[8],u=i[12],d=i[1],a=i[5],f=i[9],h=i[13],m=i[2],v=i[6],g=i[10],p=i[14],_=i[3],x=i[7],S=i[11],A=i[15],M=r[0],T=r[4],y=r[8],E=r[12],D=r[1],C=r[5],F=r[9],L=r[13],U=r[2],z=r[6],V=r[10],H=r[14],k=r[3],X=r[7],Q=r[11],J=r[15];return s[0]=o*M+c*D+l*U+u*k,s[4]=o*T+c*C+l*z+u*X,s[8]=o*y+c*F+l*V+u*Q,s[12]=o*E+c*L+l*H+u*J,s[1]=d*M+a*D+f*U+h*k,s[5]=d*T+a*C+f*z+h*X,s[9]=d*y+a*F+f*V+h*Q,s[13]=d*E+a*L+f*H+h*J,s[2]=m*M+v*D+g*U+p*k,s[6]=m*T+v*C+g*z+p*X,s[10]=m*y+v*F+g*V+p*Q,s[14]=m*E+v*L+g*H+p*J,s[3]=_*M+x*D+S*U+A*k,s[7]=_*T+x*C+S*z+A*X,s[11]=_*y+x*F+S*V+A*Q,s[15]=_*E+x*L+S*H+A*J,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],o=e[1],c=e[5],l=e[9],u=e[13],d=e[2],a=e[6],f=e[10],h=e[14],m=e[3],v=e[7],g=e[11],p=e[15],_=l*h-u*f,x=c*h-u*a,S=c*f-l*a,A=o*h-u*d,M=o*f-l*d,T=o*a-c*d;return t*(v*_-g*x+p*S)-i*(m*_-g*A+p*M)+r*(m*x-v*A+p*T)-s*(m*S-v*M+g*T)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],c=e[5],l=e[6],u=e[7],d=e[8],a=e[9],f=e[10],h=e[11],m=e[12],v=e[13],g=e[14],p=e[15],_=t*c-i*o,x=t*l-r*o,S=t*u-s*o,A=i*l-r*c,M=i*u-s*c,T=r*u-s*l,y=d*v-a*m,E=d*g-f*m,D=d*p-h*m,C=a*g-f*v,F=a*p-h*v,L=f*p-h*g,U=_*L-x*F+S*C+A*D-M*E+T*y;if(U===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const z=1/U;return e[0]=(c*L-l*F+u*C)*z,e[1]=(r*F-i*L-s*C)*z,e[2]=(v*T-g*M+p*A)*z,e[3]=(f*M-a*T-h*A)*z,e[4]=(l*D-o*L-u*E)*z,e[5]=(t*L-r*D+s*E)*z,e[6]=(g*S-m*T-p*x)*z,e[7]=(d*T-f*S+h*x)*z,e[8]=(o*F-c*D+u*y)*z,e[9]=(i*D-t*F-s*y)*z,e[10]=(m*M-v*S+p*_)*z,e[11]=(a*S-d*M-h*_)*z,e[12]=(c*E-o*C-l*y)*z,e[13]=(t*C-i*E+r*y)*z,e[14]=(v*x-m*A-g*_)*z,e[15]=(d*A-a*x+f*_)*z,this}scale(e){const t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),s=1-i,o=e.x,c=e.y,l=e.z,u=s*o,d=s*c;return this.set(u*o+i,u*c-r*l,u*l+r*c,0,u*c+r*l,d*c+i,d*l-r*o,0,u*l-r*c,d*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,s=t._x,o=t._y,c=t._z,l=t._w,u=s+s,d=o+o,a=c+c,f=s*u,h=s*d,m=s*a,v=o*d,g=o*a,p=c*a,_=l*u,x=l*d,S=l*a,A=i.x,M=i.y,T=i.z;return r[0]=(1-(v+p))*A,r[1]=(h+S)*A,r[2]=(m-x)*A,r[3]=0,r[4]=(h-S)*M,r[5]=(1-(f+p))*M,r[6]=(g+_)*M,r[7]=0,r[8]=(m+x)*T,r[9]=(g-_)*T,r[10]=(1-(f+v))*T,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];const s=this.determinant();if(s===0)return i.set(1,1,1),t.identity(),this;let o=xs.set(r[0],r[1],r[2]).length();const c=xs.set(r[4],r[5],r[6]).length(),l=xs.set(r[8],r[9],r[10]).length();s<0&&(o=-o),Qn.copy(this);const u=1/o,d=1/c,a=1/l;return Qn.elements[0]*=u,Qn.elements[1]*=u,Qn.elements[2]*=u,Qn.elements[4]*=d,Qn.elements[5]*=d,Qn.elements[6]*=d,Qn.elements[8]*=a,Qn.elements[9]*=a,Qn.elements[10]*=a,t.setFromRotationMatrix(Qn),i.x=o,i.y=c,i.z=l,this}makePerspective(e,t,i,r,s,o,c=yi,l=!1){const u=this.elements,d=2*s/(t-e),a=2*s/(i-r),f=(t+e)/(t-e),h=(i+r)/(i-r);let m,v;if(l)m=s/(o-s),v=o*s/(o-s);else if(c===yi)m=-(o+s)/(o-s),v=-2*o*s/(o-s);else if(c===Ua)m=-o/(o-s),v=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+c);return u[0]=d,u[4]=0,u[8]=f,u[12]=0,u[1]=0,u[5]=a,u[9]=h,u[13]=0,u[2]=0,u[6]=0,u[10]=m,u[14]=v,u[3]=0,u[7]=0,u[11]=-1,u[15]=0,this}makeOrthographic(e,t,i,r,s,o,c=yi,l=!1){const u=this.elements,d=2/(t-e),a=2/(i-r),f=-(t+e)/(t-e),h=-(i+r)/(i-r);let m,v;if(l)m=1/(o-s),v=o/(o-s);else if(c===yi)m=-2/(o-s),v=-(o+s)/(o-s);else if(c===Ua)m=-1/(o-s),v=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+c);return u[0]=d,u[4]=0,u[8]=0,u[12]=f,u[1]=0,u[5]=a,u[9]=0,u[13]=h,u[2]=0,u[6]=0,u[10]=m,u[14]=v,u[3]=0,u[7]=0,u[11]=0,u[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const xs=new P,Qn=new dt,fw=new P(0,0,0),dw=new P(1,1,1),nr=new P,xl=new P,Cn=new P,kg=new dt,Bg=new Cr;class bi{constructor(e=0,t=0,i=0,r=bi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],c=r[8],l=r[1],u=r[5],d=r[9],a=r[2],f=r[6],h=r[10];switch(t){case"XYZ":this._y=Math.asin(je(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,h),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(f,u),this._z=0);break;case"YXZ":this._x=Math.asin(-je(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(c,h),this._z=Math.atan2(l,u)):(this._y=Math.atan2(-a,s),this._z=0);break;case"ZXY":this._x=Math.asin(je(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-a,h),this._z=Math.atan2(-o,u)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-je(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,h),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,u));break;case"YZX":this._z=Math.asin(je(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,u),this._y=Math.atan2(-a,s)):(this._x=0,this._y=Math.atan2(c,h));break;case"XZY":this._z=Math.asin(-je(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,u),this._y=Math.atan2(c,s)):(this._x=Math.atan2(-d,h),this._y=0);break;default:Fe("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return kg.makeRotationFromQuaternion(e),this.setFromRotationMatrix(kg,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Bg.setFromEuler(this),this.setFromQuaternion(Bg,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}bi.DEFAULT_ORDER="XYZ";class kx{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let hw=0;const zg=new P,ys=new Cr,Li=new dt,yl=new P,zo=new P,pw=new P,mw=new Cr,Vg=new P(1,0,0),Hg=new P(0,1,0),Gg=new P(0,0,1),Wg={type:"added"},gw={type:"removed"},Ss={type:"childadded",child:null},ff={type:"childremoved",child:null};class Ot extends us{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:hw++}),this.uuid=Gi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ot.DEFAULT_UP.clone();const e=new P,t=new bi,i=new Cr,r=new P(1,1,1);function s(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new dt},normalMatrix:{value:new We}}),this.matrix=new dt,this.matrixWorld=new dt,this.matrixAutoUpdate=Ot.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ot.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new kx,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ys.setFromAxisAngle(e,t),this.quaternion.multiply(ys),this}rotateOnWorldAxis(e,t){return ys.setFromAxisAngle(e,t),this.quaternion.premultiply(ys),this}rotateX(e){return this.rotateOnAxis(Vg,e)}rotateY(e){return this.rotateOnAxis(Hg,e)}rotateZ(e){return this.rotateOnAxis(Gg,e)}translateOnAxis(e,t){return zg.copy(e).applyQuaternion(this.quaternion),this.position.add(zg.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Vg,e)}translateY(e){return this.translateOnAxis(Hg,e)}translateZ(e){return this.translateOnAxis(Gg,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Li.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?yl.copy(e):yl.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),zo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Li.lookAt(zo,yl,this.up):Li.lookAt(yl,zo,this.up),this.quaternion.setFromRotationMatrix(Li),r&&(Li.extractRotation(r.matrixWorld),ys.setFromRotationMatrix(Li),this.quaternion.premultiply(ys.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Je("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Wg),Ss.child=e,this.dispatchEvent(Ss),Ss.child=null):Je("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(gw),ff.child=e,this.dispatchEvent(ff),ff.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Li.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Li.multiply(e.parent.matrixWorld)),e.applyMatrix4(Li),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Wg),Ss.child=e,this.dispatchEvent(Ss),Ss.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(zo,e,pw),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(zo,mw,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,r=e.z,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*i-s[8]*r,s[13]+=i-s[1]*t-s[5]*i-s[9]*r,s[14]+=r-s[2]*t-s[6]*i-s[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),this.static!==!1&&(r.static=this.static),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(c=>({...c,boundingBox:c.boundingBox?c.boundingBox.toJSON():void 0,boundingSphere:c.boundingSphere?c.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(c=>({...c})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(c,l){return c[l.uuid]===void 0&&(c[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const c=this.geometry.parameters;if(c!==void 0&&c.shapes!==void 0){const l=c.shapes;if(Array.isArray(l))for(let u=0,d=l.length;u<d;u++){const a=l[u];s(e.shapes,a)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const c=[];for(let l=0,u=this.material.length;l<u;l++)c.push(s(e.materials,this.material[l]));r.material=c}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let c=0;c<this.children.length;c++)r.children.push(this.children[c].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let c=0;c<this.animations.length;c++){const l=this.animations[c];r.animations.push(s(e.animations,l))}}if(t){const c=o(e.geometries),l=o(e.materials),u=o(e.textures),d=o(e.images),a=o(e.shapes),f=o(e.skeletons),h=o(e.animations),m=o(e.nodes);c.length>0&&(i.geometries=c),l.length>0&&(i.materials=l),u.length>0&&(i.textures=u),d.length>0&&(i.images=d),a.length>0&&(i.shapes=a),f.length>0&&(i.skeletons=f),h.length>0&&(i.animations=h),m.length>0&&(i.nodes=m)}return i.object=r,i;function o(c){const l=[];for(const u in c){const d=c[u];delete d.metadata,l.push(d)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),e.pivot!==null&&(this.pivot=e.pivot.clone()),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}Ot.DEFAULT_UP=new P(0,1,0);Ot.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ot.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class li extends Ot{constructor(){super(),this.isGroup=!0,this.type="Group"}}const _w={type:"move"};class df{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new li,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new li,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new li,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,o=null;const c=this._targetRay,l=this._grip,u=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(u&&e.hand){o=!0;for(const v of e.hand.values()){const g=t.getJointPose(v,i),p=this._getHandJoint(u,v);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const d=u.joints["index-finger-tip"],a=u.joints["thumb-tip"],f=d.position.distanceTo(a.position),h=.02,m=.005;u.inputState.pinching&&f>h+m?(u.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!u.inputState.pinching&&f<=h-m&&(u.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));c!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,this.dispatchEvent(_w)))}return c!==null&&(c.visible=r!==null),l!==null&&(l.visible=s!==null),u!==null&&(u.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new li;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const Bx={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ir={h:0,s:0,l:0},Sl={h:0,s:0,l:0};function hf(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class ne{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Gn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,et.colorSpaceToWorking(this,t),this}setRGB(e,t,i,r=et.workingColorSpace){return this.r=e,this.g=t,this.b=i,et.colorSpaceToWorking(this,r),this}setHSL(e,t,i,r=et.workingColorSpace){if(e=Kp(e,1),t=je(t,0,1),i=je(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,o=2*i-s;this.r=hf(o,s,e+1/3),this.g=hf(o,s,e),this.b=hf(o,s,e-1/3)}return et.colorSpaceToWorking(this,r),this}setStyle(e,t=Gn){function i(s){s!==void 0&&parseFloat(s)<1&&Fe("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],c=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(c))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(c))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(c))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:Fe("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);Fe("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Gn){const i=Bx[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Fe("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Wi(e.r),this.g=Wi(e.g),this.b=Wi(e.b),this}copyLinearToSRGB(e){return this.r=uo(e.r),this.g=uo(e.g),this.b=uo(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Gn){return et.workingToColorSpace(sn.copy(this),e),Math.round(je(sn.r*255,0,255))*65536+Math.round(je(sn.g*255,0,255))*256+Math.round(je(sn.b*255,0,255))}getHexString(e=Gn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=et.workingColorSpace){et.workingToColorSpace(sn.copy(this),t);const i=sn.r,r=sn.g,s=sn.b,o=Math.max(i,r,s),c=Math.min(i,r,s);let l,u;const d=(c+o)/2;if(c===o)l=0,u=0;else{const a=o-c;switch(u=d<=.5?a/(o+c):a/(2-o-c),o){case i:l=(r-s)/a+(r<s?6:0);break;case r:l=(s-i)/a+2;break;case s:l=(i-r)/a+4;break}l/=6}return e.h=l,e.s=u,e.l=d,e}getRGB(e,t=et.workingColorSpace){return et.workingToColorSpace(sn.copy(this),t),e.r=sn.r,e.g=sn.g,e.b=sn.b,e}getStyle(e=Gn){et.workingToColorSpace(sn.copy(this),e);const t=sn.r,i=sn.g,r=sn.b;return e!==Gn?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(ir),this.setHSL(ir.h+e,ir.s+t,ir.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(ir),e.getHSL(Sl);const i=ma(ir.h,Sl.h,t),r=ma(ir.s,Sl.s,t),s=ma(ir.l,Sl.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const sn=new ne;ne.NAMES=Bx;class zx{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new ne(e),this.density=t}clone(){return new zx(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class vw extends Ot{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new bi,this.environmentIntensity=1,this.environmentRotation=new bi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Jn=new P,Di=new P,pf=new P,Ii=new P,Ms=new P,ws=new P,Xg=new P,mf=new P,gf=new P,_f=new P,vf=new Dt,xf=new Dt,yf=new Dt;class In{constructor(e=new P,t=new P,i=new P){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),Jn.subVectors(e,t),r.cross(Jn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){Jn.subVectors(r,t),Di.subVectors(i,t),pf.subVectors(e,t);const o=Jn.dot(Jn),c=Jn.dot(Di),l=Jn.dot(pf),u=Di.dot(Di),d=Di.dot(pf),a=o*u-c*c;if(a===0)return s.set(0,0,0),null;const f=1/a,h=(u*l-c*d)*f,m=(o*d-c*l)*f;return s.set(1-h-m,m,h)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,Ii)===null?!1:Ii.x>=0&&Ii.y>=0&&Ii.x+Ii.y<=1}static getInterpolation(e,t,i,r,s,o,c,l){return this.getBarycoord(e,t,i,r,Ii)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Ii.x),l.addScaledVector(o,Ii.y),l.addScaledVector(c,Ii.z),l)}static getInterpolatedAttribute(e,t,i,r,s,o){return vf.setScalar(0),xf.setScalar(0),yf.setScalar(0),vf.fromBufferAttribute(e,t),xf.fromBufferAttribute(e,i),yf.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(vf,s.x),o.addScaledVector(xf,s.y),o.addScaledVector(yf,s.z),o}static isFrontFacing(e,t,i,r){return Jn.subVectors(i,t),Di.subVectors(e,t),Jn.cross(Di).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Jn.subVectors(this.c,this.b),Di.subVectors(this.a,this.b),Jn.cross(Di).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return In.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return In.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,s){return In.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return In.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return In.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,s=this.c;let o,c;Ms.subVectors(r,i),ws.subVectors(s,i),mf.subVectors(e,i);const l=Ms.dot(mf),u=ws.dot(mf);if(l<=0&&u<=0)return t.copy(i);gf.subVectors(e,r);const d=Ms.dot(gf),a=ws.dot(gf);if(d>=0&&a<=d)return t.copy(r);const f=l*a-d*u;if(f<=0&&l>=0&&d<=0)return o=l/(l-d),t.copy(i).addScaledVector(Ms,o);_f.subVectors(e,s);const h=Ms.dot(_f),m=ws.dot(_f);if(m>=0&&h<=m)return t.copy(s);const v=h*u-l*m;if(v<=0&&u>=0&&m<=0)return c=u/(u-m),t.copy(i).addScaledVector(ws,c);const g=d*m-h*a;if(g<=0&&a-d>=0&&h-m>=0)return Xg.subVectors(s,r),c=(a-d)/(a-d+(h-m)),t.copy(r).addScaledVector(Xg,c);const p=1/(g+v+f);return o=v*p,c=f*p,t.copy(i).addScaledVector(Ms,o).addScaledVector(ws,c)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class fs{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(ei.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(ei.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=ei.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,c=s.count;o<c;o++)e.isMesh===!0?e.getVertexPosition(o,ei):ei.fromBufferAttribute(s,o),ei.applyMatrix4(e.matrixWorld),this.expandByPoint(ei);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ml.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Ml.copy(i.boundingBox)),Ml.applyMatrix4(e.matrixWorld),this.union(Ml)}const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ei),ei.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Vo),wl.subVectors(this.max,Vo),Es.subVectors(e.a,Vo),Ts.subVectors(e.b,Vo),As.subVectors(e.c,Vo),rr.subVectors(Ts,Es),sr.subVectors(As,Ts),Or.subVectors(Es,As);let t=[0,-rr.z,rr.y,0,-sr.z,sr.y,0,-Or.z,Or.y,rr.z,0,-rr.x,sr.z,0,-sr.x,Or.z,0,-Or.x,-rr.y,rr.x,0,-sr.y,sr.x,0,-Or.y,Or.x,0];return!Sf(t,Es,Ts,As,wl)||(t=[1,0,0,0,1,0,0,0,1],!Sf(t,Es,Ts,As,wl))?!1:(El.crossVectors(rr,sr),t=[El.x,El.y,El.z],Sf(t,Es,Ts,As,wl))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ei).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ei).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Ni[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Ni[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Ni[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Ni[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Ni[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Ni[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Ni[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Ni[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Ni),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Ni=[new P,new P,new P,new P,new P,new P,new P,new P],ei=new P,Ml=new fs,Es=new P,Ts=new P,As=new P,rr=new P,sr=new P,Or=new P,Vo=new P,wl=new P,El=new P,kr=new P;function Sf(n,e,t,i,r){for(let s=0,o=n.length-3;s<=o;s+=3){kr.fromArray(n,s);const c=r.x*Math.abs(kr.x)+r.y*Math.abs(kr.y)+r.z*Math.abs(kr.z),l=e.dot(kr),u=t.dot(kr),d=i.dot(kr);if(Math.max(-Math.max(l,u,d),Math.min(l,u,d))>c)return!1}return!0}const Ut=new P,Tl=new xe;let xw=0;class Be{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:xw++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Fh,this.updateRanges=[],this.gpuType=oi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Tl.fromBufferAttribute(this,t),Tl.applyMatrix3(e),this.setXY(t,Tl.x,Tl.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Ut.fromBufferAttribute(this,t),Ut.applyMatrix3(e),this.setXYZ(t,Ut.x,Ut.y,Ut.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Ut.fromBufferAttribute(this,t),Ut.applyMatrix4(e),this.setXYZ(t,Ut.x,Ut.y,Ut.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Ut.fromBufferAttribute(this,t),Ut.applyNormalMatrix(e),this.setXYZ(t,Ut.x,Ut.y,Ut.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Ut.fromBufferAttribute(this,t),Ut.transformDirection(e),this.setXYZ(t,Ut.x,Ut.y,Ut.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=si(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=ut(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=si(t,this.array)),t}setX(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=si(t,this.array)),t}setY(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=si(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=si(t,this.array)),t}setW(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=ut(t,this.array),i=ut(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=ut(t,this.array),i=ut(i,this.array),r=ut(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=ut(t,this.array),i=ut(i,this.array),r=ut(r,this.array),s=ut(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Fh&&(e.usage=this.usage),e}}class Vx extends Be{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Hx extends Be{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class St extends Be{constructor(e,t,i){super(new Float32Array(e),t,i)}}const yw=new fs,Ho=new P,Mf=new P;class ds{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):yw.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ho.subVectors(e,this.center);const t=Ho.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(Ho,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Mf.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ho.copy(e.center).add(Mf)),this.expandByPoint(Ho.copy(e.center).sub(Mf))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let Sw=0;const zn=new dt,wf=new Ot,bs=new P,Rn=new fs,Go=new fs,Wt=new P;class He extends us{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Sw++}),this.uuid=Gi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(k1(e)?Hx:Vx)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new We().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return zn.makeRotationFromQuaternion(e),this.applyMatrix4(zn),this}rotateX(e){return zn.makeRotationX(e),this.applyMatrix4(zn),this}rotateY(e){return zn.makeRotationY(e),this.applyMatrix4(zn),this}rotateZ(e){return zn.makeRotationZ(e),this.applyMatrix4(zn),this}translate(e,t,i){return zn.makeTranslation(e,t,i),this.applyMatrix4(zn),this}scale(e,t,i){return zn.makeScale(e,t,i),this.applyMatrix4(zn),this}lookAt(e){return wf.lookAt(e),wf.updateMatrix(),this.applyMatrix4(wf.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(bs).negate(),this.translate(bs.x,bs.y,bs.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const o=e[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new St(i,3))}else{const i=Math.min(e.length,t.count);for(let r=0;r<i;r++){const s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&Fe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new fs);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Je("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const s=t[i];Rn.setFromBufferAttribute(s),this.morphTargetsRelative?(Wt.addVectors(this.boundingBox.min,Rn.min),this.boundingBox.expandByPoint(Wt),Wt.addVectors(this.boundingBox.max,Rn.max),this.boundingBox.expandByPoint(Wt)):(this.boundingBox.expandByPoint(Rn.min),this.boundingBox.expandByPoint(Rn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Je('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ds);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Je("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){const i=this.boundingSphere.center;if(Rn.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){const c=t[s];Go.setFromBufferAttribute(c),this.morphTargetsRelative?(Wt.addVectors(Rn.min,Go.min),Rn.expandByPoint(Wt),Wt.addVectors(Rn.max,Go.max),Rn.expandByPoint(Wt)):(Rn.expandByPoint(Go.min),Rn.expandByPoint(Go.max))}Rn.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)Wt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Wt));if(t)for(let s=0,o=t.length;s<o;s++){const c=t[s],l=this.morphTargetsRelative;for(let u=0,d=c.count;u<d;u++)Wt.fromBufferAttribute(c,u),l&&(bs.fromBufferAttribute(e,u),Wt.add(bs)),r=Math.max(r,i.distanceToSquared(Wt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&Je('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Je("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Be(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),c=[],l=[];for(let y=0;y<i.count;y++)c[y]=new P,l[y]=new P;const u=new P,d=new P,a=new P,f=new xe,h=new xe,m=new xe,v=new P,g=new P;function p(y,E,D){u.fromBufferAttribute(i,y),d.fromBufferAttribute(i,E),a.fromBufferAttribute(i,D),f.fromBufferAttribute(s,y),h.fromBufferAttribute(s,E),m.fromBufferAttribute(s,D),d.sub(u),a.sub(u),h.sub(f),m.sub(f);const C=1/(h.x*m.y-m.x*h.y);isFinite(C)&&(v.copy(d).multiplyScalar(m.y).addScaledVector(a,-h.y).multiplyScalar(C),g.copy(a).multiplyScalar(h.x).addScaledVector(d,-m.x).multiplyScalar(C),c[y].add(v),c[E].add(v),c[D].add(v),l[y].add(g),l[E].add(g),l[D].add(g))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let y=0,E=_.length;y<E;++y){const D=_[y],C=D.start,F=D.count;for(let L=C,U=C+F;L<U;L+=3)p(e.getX(L+0),e.getX(L+1),e.getX(L+2))}const x=new P,S=new P,A=new P,M=new P;function T(y){A.fromBufferAttribute(r,y),M.copy(A);const E=c[y];x.copy(E),x.sub(A.multiplyScalar(A.dot(E))).normalize(),S.crossVectors(M,E);const C=S.dot(l[y])<0?-1:1;o.setXYZW(y,x.x,x.y,x.z,C)}for(let y=0,E=_.length;y<E;++y){const D=_[y],C=D.start,F=D.count;for(let L=C,U=C+F;L<U;L+=3)T(e.getX(L+0)),T(e.getX(L+1)),T(e.getX(L+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Be(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let f=0,h=i.count;f<h;f++)i.setXYZ(f,0,0,0);const r=new P,s=new P,o=new P,c=new P,l=new P,u=new P,d=new P,a=new P;if(e)for(let f=0,h=e.count;f<h;f+=3){const m=e.getX(f+0),v=e.getX(f+1),g=e.getX(f+2);r.fromBufferAttribute(t,m),s.fromBufferAttribute(t,v),o.fromBufferAttribute(t,g),d.subVectors(o,s),a.subVectors(r,s),d.cross(a),c.fromBufferAttribute(i,m),l.fromBufferAttribute(i,v),u.fromBufferAttribute(i,g),c.add(d),l.add(d),u.add(d),i.setXYZ(m,c.x,c.y,c.z),i.setXYZ(v,l.x,l.y,l.z),i.setXYZ(g,u.x,u.y,u.z)}else for(let f=0,h=t.count;f<h;f+=3)r.fromBufferAttribute(t,f+0),s.fromBufferAttribute(t,f+1),o.fromBufferAttribute(t,f+2),d.subVectors(o,s),a.subVectors(r,s),d.cross(a),i.setXYZ(f+0,d.x,d.y,d.z),i.setXYZ(f+1,d.x,d.y,d.z),i.setXYZ(f+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Wt.fromBufferAttribute(e,t),Wt.normalize(),e.setXYZ(t,Wt.x,Wt.y,Wt.z)}toNonIndexed(){function e(c,l){const u=c.array,d=c.itemSize,a=c.normalized,f=new u.constructor(l.length*d);let h=0,m=0;for(let v=0,g=l.length;v<g;v++){c.isInterleavedBufferAttribute?h=l[v]*c.data.stride+c.offset:h=l[v]*d;for(let p=0;p<d;p++)f[m++]=u[h++]}return new Be(f,d,a)}if(this.index===null)return Fe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new He,i=this.index.array,r=this.attributes;for(const c in r){const l=r[c],u=e(l,i);t.setAttribute(c,u)}const s=this.morphAttributes;for(const c in s){const l=[],u=s[c];for(let d=0,a=u.length;d<a;d++){const f=u[d],h=e(f,i);l.push(h)}t.morphAttributes[c]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let c=0,l=o.length;c<l;c++){const u=o[c];t.addGroup(u.start,u.count,u.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const u in l)l[u]!==void 0&&(e[u]=l[u]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const u=i[l];e.data.attributes[l]=u.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const u=this.morphAttributes[l],d=[];for(let a=0,f=u.length;a<f;a++){const h=u[a];d.push(h.toJSON(e.data))}d.length>0&&(r[l]=d,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const c=this.boundingSphere;return c!==null&&(e.data.boundingSphere=c.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const r=e.attributes;for(const u in r){const d=r[u];this.setAttribute(u,d.clone(t))}const s=e.morphAttributes;for(const u in s){const d=[],a=s[u];for(let f=0,h=a.length;f<h;f++)d.push(a[f].clone(t));this.morphAttributes[u]=d}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let u=0,d=o.length;u<d;u++){const a=o[u];this.addGroup(a.start,a.count,a.materialIndex)}const c=e.boundingBox;c!==null&&(this.boundingBox=c.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Mw{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Fh,this.updateRanges=[],this.version=0,this.uuid=Gi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let r=0,s=this.stride;r<s;r++)this.array[e+r]=t.array[i+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Gi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Gi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const un=new P;class eu{constructor(e,t,i,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)un.fromBufferAttribute(this,t),un.applyMatrix4(e),this.setXYZ(t,un.x,un.y,un.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)un.fromBufferAttribute(this,t),un.applyNormalMatrix(e),this.setXYZ(t,un.x,un.y,un.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)un.fromBufferAttribute(this,t),un.transformDirection(e),this.setXYZ(t,un.x,un.y,un.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=si(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=ut(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=si(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=si(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=si(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=si(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=ut(t,this.array),i=ut(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=ut(t,this.array),i=ut(i,this.array),r=ut(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=ut(t,this.array),i=ut(i,this.array),r=ut(r,this.array),s=ut(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=r,this.data.array[e+3]=s,this}clone(e){if(e===void 0){Qc("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return new Be(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new eu(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Qc("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}let ww=0;class Ir extends us{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ww++}),this.uuid=Gi(),this.name="",this.type="Material",this.blending=lo,this.side=br,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=$d,this.blendDst=Yd,this.blendEquation=$r,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ne(0,0,0),this.blendAlpha=0,this.depthFunc=xo,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Lg,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=_s,this.stencilZFail=_s,this.stencilZPass=_s,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){Fe(`Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){Fe(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==lo&&(i.blending=this.blending),this.side!==br&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==$d&&(i.blendSrc=this.blendSrc),this.blendDst!==Yd&&(i.blendDst=this.blendDst),this.blendEquation!==$r&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==xo&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Lg&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==_s&&(i.stencilFail=this.stencilFail),this.stencilZFail!==_s&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==_s&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const c in s){const l=s[c];delete l.metadata,o.push(l)}return o}if(t){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Su extends Ir{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new ne(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Cs;const Wo=new P,Rs=new P,Ps=new P,Ls=new xe,Xo=new xe,Gx=new dt,Al=new P,jo=new P,bl=new P,jg=new xe,Ef=new xe,$g=new xe;class Qp extends Ot{constructor(e=new Su){if(super(),this.isSprite=!0,this.type="Sprite",Cs===void 0){Cs=new He;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new Mw(t,5);Cs.setIndex([0,1,2,0,2,3]),Cs.setAttribute("position",new eu(i,3,0,!1)),Cs.setAttribute("uv",new eu(i,2,3,!1))}this.geometry=Cs,this.material=e,this.center=new xe(.5,.5),this.count=1}raycast(e,t){e.camera===null&&Je('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Rs.setFromMatrixScale(this.matrixWorld),Gx.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Ps.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Rs.multiplyScalar(-Ps.z);const i=this.material.rotation;let r,s;i!==0&&(s=Math.cos(i),r=Math.sin(i));const o=this.center;Cl(Al.set(-.5,-.5,0),Ps,o,Rs,r,s),Cl(jo.set(.5,-.5,0),Ps,o,Rs,r,s),Cl(bl.set(.5,.5,0),Ps,o,Rs,r,s),jg.set(0,0),Ef.set(1,0),$g.set(1,1);let c=e.ray.intersectTriangle(Al,jo,bl,!1,Wo);if(c===null&&(Cl(jo.set(-.5,.5,0),Ps,o,Rs,r,s),Ef.set(0,1),c=e.ray.intersectTriangle(Al,bl,jo,!1,Wo),c===null))return;const l=e.ray.origin.distanceTo(Wo);l<e.near||l>e.far||t.push({distance:l,point:Wo.clone(),uv:In.getInterpolation(Wo,Al,jo,bl,jg,Ef,$g,new xe),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Cl(n,e,t,i,r,s){Ls.subVectors(n,t).addScalar(.5).multiply(i),r!==void 0?(Xo.x=s*Ls.x-r*Ls.y,Xo.y=r*Ls.x+s*Ls.y):Xo.copy(Ls),n.copy(e),n.x+=Xo.x,n.y+=Xo.y,n.applyMatrix4(Gx)}const Ui=new P,Tf=new P,Rl=new P,or=new P,Af=new P,Pl=new P,bf=new P;class Mu{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ui)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Ui.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ui.copy(this.origin).addScaledVector(this.direction,t),Ui.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){Tf.copy(e).add(t).multiplyScalar(.5),Rl.copy(t).sub(e).normalize(),or.copy(this.origin).sub(Tf);const s=e.distanceTo(t)*.5,o=-this.direction.dot(Rl),c=or.dot(this.direction),l=-or.dot(Rl),u=or.lengthSq(),d=Math.abs(1-o*o);let a,f,h,m;if(d>0)if(a=o*l-c,f=o*c-l,m=s*d,a>=0)if(f>=-m)if(f<=m){const v=1/d;a*=v,f*=v,h=a*(a+o*f+2*c)+f*(o*a+f+2*l)+u}else f=s,a=Math.max(0,-(o*f+c)),h=-a*a+f*(f+2*l)+u;else f=-s,a=Math.max(0,-(o*f+c)),h=-a*a+f*(f+2*l)+u;else f<=-m?(a=Math.max(0,-(-o*s+c)),f=a>0?-s:Math.min(Math.max(-s,-l),s),h=-a*a+f*(f+2*l)+u):f<=m?(a=0,f=Math.min(Math.max(-s,-l),s),h=f*(f+2*l)+u):(a=Math.max(0,-(o*s+c)),f=a>0?s:Math.min(Math.max(-s,-l),s),h=-a*a+f*(f+2*l)+u);else f=o>0?-s:s,a=Math.max(0,-(o*f+c)),h=-a*a+f*(f+2*l)+u;return i&&i.copy(this.origin).addScaledVector(this.direction,a),r&&r.copy(Tf).addScaledVector(Rl,f),h}intersectSphere(e,t){Ui.subVectors(e.center,this.origin);const i=Ui.dot(this.direction),r=Ui.dot(Ui)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),c=i-o,l=i+o;return l<0?null:c<0?this.at(l,t):this.at(c,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,o,c,l;const u=1/this.direction.x,d=1/this.direction.y,a=1/this.direction.z,f=this.origin;return u>=0?(i=(e.min.x-f.x)*u,r=(e.max.x-f.x)*u):(i=(e.max.x-f.x)*u,r=(e.min.x-f.x)*u),d>=0?(s=(e.min.y-f.y)*d,o=(e.max.y-f.y)*d):(s=(e.max.y-f.y)*d,o=(e.min.y-f.y)*d),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),a>=0?(c=(e.min.z-f.z)*a,l=(e.max.z-f.z)*a):(c=(e.max.z-f.z)*a,l=(e.min.z-f.z)*a),i>l||c>r)||((c>i||i!==i)&&(i=c),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,Ui)!==null}intersectTriangle(e,t,i,r,s){Af.subVectors(t,e),Pl.subVectors(i,e),bf.crossVectors(Af,Pl);let o=this.direction.dot(bf),c;if(o>0){if(r)return null;c=1}else if(o<0)c=-1,o=-o;else return null;or.subVectors(this.origin,e);const l=c*this.direction.dot(Pl.crossVectors(or,Pl));if(l<0)return null;const u=c*this.direction.dot(Af.cross(or));if(u<0||l+u>o)return null;const d=-c*or.dot(bf);return d<0?null:this.at(d/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class wo extends Ir{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ne(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bi,this.combine=yx,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Yg=new dt,Br=new Mu,Ll=new ds,qg=new P,Dl=new P,Il=new P,Nl=new P,Cf=new P,Ul=new P,Kg=new P,Fl=new P;class mn extends Ot{constructor(e=new He,t=new wo){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const c=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[c]=s}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const c=this.morphTargetInfluences;if(s&&c){Ul.set(0,0,0);for(let l=0,u=s.length;l<u;l++){const d=c[l],a=s[l];d!==0&&(Cf.fromBufferAttribute(a,e),o?Ul.addScaledVector(Cf,d):Ul.addScaledVector(Cf.sub(t),d))}t.add(Ul)}return t}raycast(e,t){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ll.copy(i.boundingSphere),Ll.applyMatrix4(s),Br.copy(e.ray).recast(e.near),!(Ll.containsPoint(Br.origin)===!1&&(Br.intersectSphere(Ll,qg)===null||Br.origin.distanceToSquared(qg)>(e.far-e.near)**2))&&(Yg.copy(s).invert(),Br.copy(e.ray).applyMatrix4(Yg),!(i.boundingBox!==null&&Br.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Br)))}_computeIntersections(e,t,i){let r;const s=this.geometry,o=this.material,c=s.index,l=s.attributes.position,u=s.attributes.uv,d=s.attributes.uv1,a=s.attributes.normal,f=s.groups,h=s.drawRange;if(c!==null)if(Array.isArray(o))for(let m=0,v=f.length;m<v;m++){const g=f[m],p=o[g.materialIndex],_=Math.max(g.start,h.start),x=Math.min(c.count,Math.min(g.start+g.count,h.start+h.count));for(let S=_,A=x;S<A;S+=3){const M=c.getX(S),T=c.getX(S+1),y=c.getX(S+2);r=Ol(this,p,e,i,u,d,a,M,T,y),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=g.materialIndex,t.push(r))}}else{const m=Math.max(0,h.start),v=Math.min(c.count,h.start+h.count);for(let g=m,p=v;g<p;g+=3){const _=c.getX(g),x=c.getX(g+1),S=c.getX(g+2);r=Ol(this,o,e,i,u,d,a,_,x,S),r&&(r.faceIndex=Math.floor(g/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let m=0,v=f.length;m<v;m++){const g=f[m],p=o[g.materialIndex],_=Math.max(g.start,h.start),x=Math.min(l.count,Math.min(g.start+g.count,h.start+h.count));for(let S=_,A=x;S<A;S+=3){const M=S,T=S+1,y=S+2;r=Ol(this,p,e,i,u,d,a,M,T,y),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=g.materialIndex,t.push(r))}}else{const m=Math.max(0,h.start),v=Math.min(l.count,h.start+h.count);for(let g=m,p=v;g<p;g+=3){const _=g,x=g+1,S=g+2;r=Ol(this,o,e,i,u,d,a,_,x,S),r&&(r.faceIndex=Math.floor(g/3),t.push(r))}}}}function Ew(n,e,t,i,r,s,o,c){let l;if(e.side===En?l=i.intersectTriangle(o,s,r,!0,c):l=i.intersectTriangle(r,s,o,e.side===br,c),l===null)return null;Fl.copy(c),Fl.applyMatrix4(n.matrixWorld);const u=t.ray.origin.distanceTo(Fl);return u<t.near||u>t.far?null:{distance:u,point:Fl.clone(),object:n}}function Ol(n,e,t,i,r,s,o,c,l,u){n.getVertexPosition(c,Dl),n.getVertexPosition(l,Il),n.getVertexPosition(u,Nl);const d=Ew(n,e,t,i,Dl,Il,Nl,Kg);if(d){const a=new P;In.getBarycoord(Kg,Dl,Il,Nl,a),r&&(d.uv=In.getInterpolatedAttribute(r,c,l,u,a,new xe)),s&&(d.uv1=In.getInterpolatedAttribute(s,c,l,u,a,new xe)),o&&(d.normal=In.getInterpolatedAttribute(o,c,l,u,a,new P),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const f={a:c,b:l,c:u,normal:new P,materialIndex:0};In.getNormal(Dl,Il,Nl,f.normal),d.face=f,d.barycoord=a}return d}class Wx extends ln{constructor(e=null,t=1,i=1,r,s,o,c,l,u=Zt,d=Zt,a,f){super(null,o,c,l,u,d,r,s,a,f),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Zg extends Be{constructor(e,t,i,r=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Ds=new dt,Qg=new dt,kl=[],Jg=new fs,Tw=new dt,$o=new mn,Yo=new ds;class eP extends mn{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Zg(new Float32Array(i*16),16),this.previousInstanceMatrix=null,this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<i;r++)this.setMatrixAt(r,Tw)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new fs),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Ds),Jg.copy(e.boundingBox).applyMatrix4(Ds),this.boundingBox.union(Jg)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new ds),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Ds),Yo.copy(e.boundingSphere).applyMatrix4(Ds),this.boundingSphere.union(Yo)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.previousInstanceMatrix!==null&&(this.previousInstanceMatrix=e.previousInstanceMatrix.clone()),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,r=this.morphTexture.source.data.data,s=i.length+1,o=e*s+1;for(let c=0;c<i.length;c++)i[c]=r[o+c]}raycast(e,t){const i=this.matrixWorld,r=this.count;if($o.geometry=this.geometry,$o.material=this.material,$o.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Yo.copy(this.boundingSphere),Yo.applyMatrix4(i),e.ray.intersectsSphere(Yo)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,Ds),Qg.multiplyMatrices(i,Ds),$o.matrixWorld=Qg,$o.raycast(e,kl);for(let o=0,c=kl.length;o<c;o++){const l=kl[o];l.instanceId=s,l.object=this,t.push(l)}kl.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Zg(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const i=t.morphTargetInfluences,r=i.length+1;this.morphTexture===null&&(this.morphTexture=new Wx(new Float32Array(r*this.count),r,this.count,Wp,oi));const s=this.morphTexture.source.data.data;let o=0;for(let u=0;u<i.length;u++)o+=i[u];const c=this.geometry.morphTargetsRelative?1:1-o,l=r*e;s[l]=c,s.set(i,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Rf=new P,Aw=new P,bw=new We;class ur{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=Rf.subVectors(i,t).cross(Aw.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Rf),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||bw.getNormalMatrix(e),r=this.coplanarPoint(Rf).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const zr=new ds,Cw=new xe(.5,.5),Bl=new P;class Jp{constructor(e=new ur,t=new ur,i=new ur,r=new ur,s=new ur,o=new ur){this.planes=[e,t,i,r,s,o]}set(e,t,i,r,s,o){const c=this.planes;return c[0].copy(e),c[1].copy(t),c[2].copy(i),c[3].copy(r),c[4].copy(s),c[5].copy(o),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=yi,i=!1){const r=this.planes,s=e.elements,o=s[0],c=s[1],l=s[2],u=s[3],d=s[4],a=s[5],f=s[6],h=s[7],m=s[8],v=s[9],g=s[10],p=s[11],_=s[12],x=s[13],S=s[14],A=s[15];if(r[0].setComponents(u-o,h-d,p-m,A-_).normalize(),r[1].setComponents(u+o,h+d,p+m,A+_).normalize(),r[2].setComponents(u+c,h+a,p+v,A+x).normalize(),r[3].setComponents(u-c,h-a,p-v,A-x).normalize(),i)r[4].setComponents(l,f,g,S).normalize(),r[5].setComponents(u-l,h-f,p-g,A-S).normalize();else if(r[4].setComponents(u-l,h-f,p-g,A-S).normalize(),t===yi)r[5].setComponents(u+l,h+f,p+g,A+S).normalize();else if(t===Ua)r[5].setComponents(l,f,g,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),zr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),zr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(zr)}intersectsSprite(e){zr.center.set(0,0,0);const t=Cw.distanceTo(e.center);return zr.radius=.7071067811865476+t,zr.applyMatrix4(e.matrixWorld),this.intersectsSphere(zr)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(Bl.x=r.normal.x>0?e.max.x:e.min.x,Bl.y=r.normal.y>0?e.max.y:e.min.y,Bl.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Bl)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class pn extends Ir{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ne(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const tu=new P,nu=new P,e_=new dt,qo=new Mu,zl=new ds,Pf=new P,t_=new P;class $t extends Ot{constructor(e=new He,t=new pn){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let r=1,s=t.count;r<s;r++)tu.fromBufferAttribute(t,r-1),nu.fromBufferAttribute(t,r),i[r]=i[r-1],i[r]+=tu.distanceTo(nu);e.setAttribute("lineDistance",new St(i,1))}else Fe("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),zl.copy(i.boundingSphere),zl.applyMatrix4(r),zl.radius+=s,e.ray.intersectsSphere(zl)===!1)return;e_.copy(r).invert(),qo.copy(e.ray).applyMatrix4(e_);const c=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=c*c,u=this.isLineSegments?2:1,d=i.index,f=i.attributes.position;if(d!==null){const h=Math.max(0,o.start),m=Math.min(d.count,o.start+o.count);for(let v=h,g=m-1;v<g;v+=u){const p=d.getX(v),_=d.getX(v+1),x=Vl(this,e,qo,l,p,_,v);x&&t.push(x)}if(this.isLineLoop){const v=d.getX(m-1),g=d.getX(h),p=Vl(this,e,qo,l,v,g,m-1);p&&t.push(p)}}else{const h=Math.max(0,o.start),m=Math.min(f.count,o.start+o.count);for(let v=h,g=m-1;v<g;v+=u){const p=Vl(this,e,qo,l,v,v+1,v);p&&t.push(p)}if(this.isLineLoop){const v=Vl(this,e,qo,l,m-1,h,m-1);v&&t.push(v)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const c=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[c]=s}}}}}function Vl(n,e,t,i,r,s,o){const c=n.geometry.attributes.position;if(tu.fromBufferAttribute(c,r),nu.fromBufferAttribute(c,s),t.distanceSqToSegment(tu,nu,Pf,t_)>i)return;Pf.applyMatrix4(n.matrixWorld);const u=e.ray.origin.distanceTo(Pf);if(!(u<e.near||u>e.far))return{distance:u,point:t_.clone().applyMatrix4(n.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:n}}const n_=new P,i_=new P;class Oh extends $t{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let r=0,s=t.count;r<s;r+=2)n_.fromBufferAttribute(t,r),i_.fromBufferAttribute(t,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+n_.distanceTo(i_);e.setAttribute("lineDistance",new St(i,1))}else Fe("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Rw extends $t{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class Wa extends Ir{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ne(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const r_=new dt,kh=new Mu,Hl=new ds,Gl=new P;class Rr extends Ot{constructor(e=new He,t=new Wa){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Hl.copy(i.boundingSphere),Hl.applyMatrix4(r),Hl.radius+=s,e.ray.intersectsSphere(Hl)===!1)return;r_.copy(r).invert(),kh.copy(e.ray).applyMatrix4(r_);const c=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=c*c,u=i.index,a=i.attributes.position;if(u!==null){const f=Math.max(0,o.start),h=Math.min(u.count,o.start+o.count);for(let m=f,v=h;m<v;m++){const g=u.getX(m);Gl.fromBufferAttribute(a,g),s_(Gl,g,l,r,e,t,this)}}else{const f=Math.max(0,o.start),h=Math.min(a.count,o.start+o.count);for(let m=f,v=h;m<v;m++)Gl.fromBufferAttribute(a,m),s_(Gl,m,l,r,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const c=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[c]=s}}}}}function s_(n,e,t,i,r,s,o){const c=kh.distanceSqToPoint(n);if(c<t){const l=new P;kh.closestPointToPoint(n,l),l.applyMatrix4(i);const u=r.ray.origin.distanceTo(l);if(u<r.near||u>r.far)return;s.push({distance:u,distanceToRay:Math.sqrt(c),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}class Xx extends ln{constructor(e=[],t=as,i,r,s,o,c,l,u,d){super(e,t,i,r,s,o,c,l,u,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class hs extends ln{constructor(e,t,i,r,s,o,c,l,u){super(e,t,i,r,s,o,c,l,u),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Oa extends ln{constructor(e,t,i=Ai,r,s,o,c=Zt,l=Zt,u,d=qi,a=1){if(d!==qi&&d!==Jr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:e,height:t,depth:a};super(f,r,s,o,c,l,d,i,u),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Zp(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Pw extends Oa{constructor(e,t=Ai,i=as,r,s,o=Zt,c=Zt,l,u=qi){const d={width:e,height:e,depth:1},a=[d,d,d,d,d,d];super(e,e,t,i,r,s,o,c,l,u),this.image=a,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class jx extends ln{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Xa extends He{constructor(e=1,t=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const c=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],u=[],d=[],a=[];let f=0,h=0;m("z","y","x",-1,-1,i,t,e,o,s,0),m("z","y","x",1,-1,i,t,-e,o,s,1),m("x","z","y",1,1,e,i,t,r,o,2),m("x","z","y",1,-1,e,i,-t,r,o,3),m("x","y","z",1,-1,e,t,i,r,s,4),m("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new St(u,3)),this.setAttribute("normal",new St(d,3)),this.setAttribute("uv",new St(a,2));function m(v,g,p,_,x,S,A,M,T,y,E){const D=S/T,C=A/y,F=S/2,L=A/2,U=M/2,z=T+1,V=y+1;let H=0,k=0;const X=new P;for(let Q=0;Q<V;Q++){const J=Q*C-L;for(let te=0;te<z;te++){const Oe=te*D-F;X[v]=Oe*_,X[g]=J*x,X[p]=U,u.push(X.x,X.y,X.z),X[v]=0,X[g]=0,X[p]=M>0?1:-1,d.push(X.x,X.y,X.z),a.push(te/T),a.push(1-Q/y),H+=1}}for(let Q=0;Q<y;Q++)for(let J=0;J<T;J++){const te=f+J+z*Q,Oe=f+J+z*(Q+1),qe=f+(J+1)+z*(Q+1),rt=f+(J+1)+z*Q;l.push(te,Oe,rt),l.push(Oe,qe,rt),k+=6}c.addGroup(h,k,E),h+=k,f+=H}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Xa(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class $x extends He{constructor(e=1,t=32,i=0,r=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:r},t=Math.max(3,t);const s=[],o=[],c=[],l=[],u=new P,d=new xe;o.push(0,0,0),c.push(0,0,1),l.push(.5,.5);for(let a=0,f=3;a<=t;a++,f+=3){const h=i+a/t*r;u.x=e*Math.cos(h),u.y=e*Math.sin(h),o.push(u.x,u.y,u.z),c.push(0,0,1),d.x=(o[f]/e+1)/2,d.y=(o[f+1]/e+1)/2,l.push(d.x,d.y)}for(let a=1;a<=t;a++)s.push(a,a+1,0);this.setIndex(s),this.setAttribute("position",new St(o,3)),this.setAttribute("normal",new St(c,3)),this.setAttribute("uv",new St(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new $x(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class em extends He{constructor(e=[],t=[],i=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:r};const s=[],o=[];c(r),u(i),d(),this.setAttribute("position",new St(s,3)),this.setAttribute("normal",new St(s.slice(),3)),this.setAttribute("uv",new St(o,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function c(_){const x=new P,S=new P,A=new P;for(let M=0;M<t.length;M+=3)h(t[M+0],x),h(t[M+1],S),h(t[M+2],A),l(x,S,A,_)}function l(_,x,S,A){const M=A+1,T=[];for(let y=0;y<=M;y++){T[y]=[];const E=_.clone().lerp(S,y/M),D=x.clone().lerp(S,y/M),C=M-y;for(let F=0;F<=C;F++)F===0&&y===M?T[y][F]=E:T[y][F]=E.clone().lerp(D,F/C)}for(let y=0;y<M;y++)for(let E=0;E<2*(M-y)-1;E++){const D=Math.floor(E/2);E%2===0?(f(T[y][D+1]),f(T[y+1][D]),f(T[y][D])):(f(T[y][D+1]),f(T[y+1][D+1]),f(T[y+1][D]))}}function u(_){const x=new P;for(let S=0;S<s.length;S+=3)x.x=s[S+0],x.y=s[S+1],x.z=s[S+2],x.normalize().multiplyScalar(_),s[S+0]=x.x,s[S+1]=x.y,s[S+2]=x.z}function d(){const _=new P;for(let x=0;x<s.length;x+=3){_.x=s[x+0],_.y=s[x+1],_.z=s[x+2];const S=g(_)/2/Math.PI+.5,A=p(_)/Math.PI+.5;o.push(S,1-A)}m(),a()}function a(){for(let _=0;_<o.length;_+=6){const x=o[_+0],S=o[_+2],A=o[_+4],M=Math.max(x,S,A),T=Math.min(x,S,A);M>.9&&T<.1&&(x<.2&&(o[_+0]+=1),S<.2&&(o[_+2]+=1),A<.2&&(o[_+4]+=1))}}function f(_){s.push(_.x,_.y,_.z)}function h(_,x){const S=_*3;x.x=e[S+0],x.y=e[S+1],x.z=e[S+2]}function m(){const _=new P,x=new P,S=new P,A=new P,M=new xe,T=new xe,y=new xe;for(let E=0,D=0;E<s.length;E+=9,D+=6){_.set(s[E+0],s[E+1],s[E+2]),x.set(s[E+3],s[E+4],s[E+5]),S.set(s[E+6],s[E+7],s[E+8]),M.set(o[D+0],o[D+1]),T.set(o[D+2],o[D+3]),y.set(o[D+4],o[D+5]),A.copy(_).add(x).add(S).divideScalar(3);const C=g(A);v(M,D+0,_,C),v(T,D+2,x,C),v(y,D+4,S,C)}}function v(_,x,S,A){A<0&&_.x===1&&(o[x]=_.x-1),S.x===0&&S.z===0&&(o[x]=A/2/Math.PI+.5)}function g(_){return Math.atan2(_.z,-_.x)}function p(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new em(e.vertices,e.indices,e.radius,e.detail)}}const Wl=new P,Xl=new P,Lf=new P,jl=new In;class o_ extends He{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const r=Math.pow(10,4),s=Math.cos(co*t),o=e.getIndex(),c=e.getAttribute("position"),l=o?o.count:c.count,u=[0,0,0],d=["a","b","c"],a=new Array(3),f={},h=[];for(let m=0;m<l;m+=3){o?(u[0]=o.getX(m),u[1]=o.getX(m+1),u[2]=o.getX(m+2)):(u[0]=m,u[1]=m+1,u[2]=m+2);const{a:v,b:g,c:p}=jl;if(v.fromBufferAttribute(c,u[0]),g.fromBufferAttribute(c,u[1]),p.fromBufferAttribute(c,u[2]),jl.getNormal(Lf),a[0]=`${Math.round(v.x*r)},${Math.round(v.y*r)},${Math.round(v.z*r)}`,a[1]=`${Math.round(g.x*r)},${Math.round(g.y*r)},${Math.round(g.z*r)}`,a[2]=`${Math.round(p.x*r)},${Math.round(p.y*r)},${Math.round(p.z*r)}`,!(a[0]===a[1]||a[1]===a[2]||a[2]===a[0]))for(let _=0;_<3;_++){const x=(_+1)%3,S=a[_],A=a[x],M=jl[d[_]],T=jl[d[x]],y=`${S}_${A}`,E=`${A}_${S}`;E in f&&f[E]?(Lf.dot(f[E].normal)<=s&&(h.push(M.x,M.y,M.z),h.push(T.x,T.y,T.z)),f[E]=null):y in f||(f[y]={index0:u[_],index1:u[x],normal:Lf.clone()})}}for(const m in f)if(f[m]){const{index0:v,index1:g}=f[m];Wl.fromBufferAttribute(c,v),Xl.fromBufferAttribute(c,g),h.push(Wl.x,Wl.y,Wl.z),h.push(Xl.x,Xl.y,Xl.z)}this.setAttribute("position",new St(h,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class Yx{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Fe("Curve: .getPoint() not implemented.")}getPointAt(e,t){const i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let i,r=this.getPoint(0),s=0;t.push(0);for(let o=1;o<=e;o++)i=this.getPoint(o/e),s+=i.distanceTo(r),t.push(s),r=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const i=this.getLengths();let r=0;const s=i.length;let o;t?o=t:o=e*i[s-1];let c=0,l=s-1,u;for(;c<=l;)if(r=Math.floor(c+(l-c)/2),u=i[r]-o,u<0)c=r+1;else if(u>0)l=r-1;else{l=r;break}if(r=l,i[r]===o)return r/(s-1);const d=i[r],f=i[r+1]-d,h=(o-d)/f;return(r+h)/(s-1)}getTangent(e,t){let r=e-1e-4,s=e+1e-4;r<0&&(r=0),s>1&&(s=1);const o=this.getPoint(r),c=this.getPoint(s),l=t||(o.isVector2?new xe:new P);return l.copy(c).sub(o).normalize(),l}getTangentAt(e,t){const i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){const i=new P,r=[],s=[],o=[],c=new P,l=new dt;for(let h=0;h<=e;h++){const m=h/e;r[h]=this.getTangentAt(m,new P)}s[0]=new P,o[0]=new P;let u=Number.MAX_VALUE;const d=Math.abs(r[0].x),a=Math.abs(r[0].y),f=Math.abs(r[0].z);d<=u&&(u=d,i.set(1,0,0)),a<=u&&(u=a,i.set(0,1,0)),f<=u&&i.set(0,0,1),c.crossVectors(r[0],i).normalize(),s[0].crossVectors(r[0],c),o[0].crossVectors(r[0],s[0]);for(let h=1;h<=e;h++){if(s[h]=s[h-1].clone(),o[h]=o[h-1].clone(),c.crossVectors(r[h-1],r[h]),c.length()>Number.EPSILON){c.normalize();const m=Math.acos(je(r[h-1].dot(r[h]),-1,1));s[h].applyMatrix4(l.makeRotationAxis(c,m))}o[h].crossVectors(r[h],s[h])}if(t===!0){let h=Math.acos(je(s[0].dot(s[e]),-1,1));h/=e,r[0].dot(c.crossVectors(s[0],s[e]))>0&&(h=-h);for(let m=1;m<=e;m++)s[m].applyMatrix4(l.makeRotationAxis(r[m],h*m)),o[m].crossVectors(r[m],s[m])}return{tangents:r,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}function tm(){let n=0,e=0,t=0,i=0;function r(s,o,c,l){n=s,e=c,t=-3*s+3*o-2*c-l,i=2*s-2*o+c+l}return{initCatmullRom:function(s,o,c,l,u){r(o,c,u*(c-s),u*(l-o))},initNonuniformCatmullRom:function(s,o,c,l,u,d,a){let f=(o-s)/u-(c-s)/(u+d)+(c-o)/d,h=(c-o)/d-(l-o)/(d+a)+(l-c)/a;f*=d,h*=d,r(o,c,f,h)},calc:function(s){const o=s*s,c=o*s;return n+e*s+t*o+i*c}}}const $l=new P,Df=new tm,If=new tm,Nf=new tm;class tP extends Yx{constructor(e=[],t=!1,i="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=r}getPoint(e,t=new P){const i=t,r=this.points,s=r.length,o=(s-(this.closed?0:1))*e;let c=Math.floor(o),l=o-c;this.closed?c+=c>0?0:(Math.floor(Math.abs(c)/s)+1)*s:l===0&&c===s-1&&(c=s-2,l=1);let u,d;this.closed||c>0?u=r[(c-1)%s]:($l.subVectors(r[0],r[1]).add(r[0]),u=$l);const a=r[c%s],f=r[(c+1)%s];if(this.closed||c+2<s?d=r[(c+2)%s]:($l.subVectors(r[s-1],r[s-2]).add(r[s-1]),d=$l),this.curveType==="centripetal"||this.curveType==="chordal"){const h=this.curveType==="chordal"?.5:.25;let m=Math.pow(u.distanceToSquared(a),h),v=Math.pow(a.distanceToSquared(f),h),g=Math.pow(f.distanceToSquared(d),h);v<1e-4&&(v=1),m<1e-4&&(m=v),g<1e-4&&(g=v),Df.initNonuniformCatmullRom(u.x,a.x,f.x,d.x,m,v,g),If.initNonuniformCatmullRom(u.y,a.y,f.y,d.y,m,v,g),Nf.initNonuniformCatmullRom(u.z,a.z,f.z,d.z,m,v,g)}else this.curveType==="catmullrom"&&(Df.initCatmullRom(u.x,a.x,f.x,d.x,this.tension),If.initCatmullRom(u.y,a.y,f.y,d.y,this.tension),Nf.initCatmullRom(u.z,a.z,f.z,d.z,this.tension));return i.set(Df.calc(l),If.calc(l),Nf.calc(l)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(r.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const r=this.points[t];e.points.push(r.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(new P().fromArray(r))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function Lw(n,e){const t=1-n;return t*t*e}function Dw(n,e){return 2*(1-n)*n*e}function Iw(n,e){return n*n*e}function Uf(n,e,t,i){return Lw(n,e)+Dw(n,t)+Iw(n,i)}class nP extends Yx{constructor(e=new P,t=new P,i=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new P){const i=t,r=this.v0,s=this.v1,o=this.v2;return i.set(Uf(e,r.x,s.x,o.x),Uf(e,r.y,s.y,o.y),Uf(e,r.z,s.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class ka extends em{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,r=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(r,s,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new ka(e.radius,e.detail)}}class ja extends He{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const s=e/2,o=t/2,c=Math.floor(i),l=Math.floor(r),u=c+1,d=l+1,a=e/c,f=t/l,h=[],m=[],v=[],g=[];for(let p=0;p<d;p++){const _=p*f-o;for(let x=0;x<u;x++){const S=x*a-s;m.push(S,-_,0),v.push(0,0,1),g.push(x/c),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let _=0;_<c;_++){const x=_+u*p,S=_+u*(p+1),A=_+1+u*(p+1),M=_+1+u*p;h.push(x,S,M),h.push(S,A,M)}this.setIndex(h),this.setAttribute("position",new St(m,3)),this.setAttribute("normal",new St(v,3)),this.setAttribute("uv",new St(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ja(e.width,e.height,e.widthSegments,e.heightSegments)}}class qx extends He{constructor(e=.5,t=1,i=32,r=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:r,thetaStart:s,thetaLength:o},i=Math.max(3,i),r=Math.max(1,r);const c=[],l=[],u=[],d=[];let a=e;const f=(t-e)/r,h=new P,m=new xe;for(let v=0;v<=r;v++){for(let g=0;g<=i;g++){const p=s+g/i*o;h.x=a*Math.cos(p),h.y=a*Math.sin(p),l.push(h.x,h.y,h.z),u.push(0,0,1),m.x=(h.x/t+1)/2,m.y=(h.y/t+1)/2,d.push(m.x,m.y)}a+=f}for(let v=0;v<r;v++){const g=v*(i+1);for(let p=0;p<i;p++){const _=p+g,x=_,S=_+i+1,A=_+i+2,M=_+1;c.push(x,S,M),c.push(S,A,M)}}this.setIndex(c),this.setAttribute("position",new St(l,3)),this.setAttribute("normal",new St(u,3)),this.setAttribute("uv",new St(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new qx(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Kx extends He{constructor(e=1,t=32,i=16,r=0,s=Math.PI*2,o=0,c=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:r,phiLength:s,thetaStart:o,thetaLength:c},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(o+c,Math.PI);let u=0;const d=[],a=new P,f=new P,h=[],m=[],v=[],g=[];for(let p=0;p<=i;p++){const _=[],x=p/i;let S=0;p===0&&o===0?S=.5/t:p===i&&l===Math.PI&&(S=-.5/t);for(let A=0;A<=t;A++){const M=A/t;a.x=-e*Math.cos(r+M*s)*Math.sin(o+x*c),a.y=e*Math.cos(o+x*c),a.z=e*Math.sin(r+M*s)*Math.sin(o+x*c),m.push(a.x,a.y,a.z),f.copy(a).normalize(),v.push(f.x,f.y,f.z),g.push(M+S,1-x),_.push(u++)}d.push(_)}for(let p=0;p<i;p++)for(let _=0;_<t;_++){const x=d[p][_+1],S=d[p][_],A=d[p+1][_],M=d[p+1][_+1];(p!==0||o>0)&&h.push(x,S,M),(p!==i-1||l<Math.PI)&&h.push(S,A,M)}this.setIndex(h),this.setAttribute("position",new St(m,3)),this.setAttribute("normal",new St(v,3)),this.setAttribute("uv",new St(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Kx(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}function Eo(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(Fe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone():Array.isArray(r)?e[t][i]=r.slice():e[t][i]=r}}return e}function fn(n){const e={};for(let t=0;t<n.length;t++){const i=Eo(n[t]);for(const r in i)e[r]=i[r]}return e}function Nw(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Zx(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:et.workingColorSpace}const iu={clone:Eo,merge:fn};var Uw=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Fw=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Tt extends Ir{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Uw,this.fragmentShader=Fw,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Eo(e.uniforms),this.uniformsGroups=Nw(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?t.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[r]={type:"m4",value:o.toArray()}:t.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class Ow extends Tt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class iP extends Ir{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ne(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ne(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ux,this.normalScale=new xe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class kw extends Ir{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=P1,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Bw extends Ir{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class wu extends Ot{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ne(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class rP extends wu{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ot.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ne(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const Ff=new dt,a_=new P,l_=new P;class Qx{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new xe(512,512),this.mapType=Dn,this.map=null,this.mapPass=null,this.matrix=new dt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Jp,this._frameExtents=new xe(1,1),this._viewportCount=1,this._viewports=[new Dt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;a_.setFromMatrixPosition(e.matrixWorld),t.position.copy(a_),l_.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(l_),t.updateMatrixWorld(),Ff.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ff,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===Ua||t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Ff)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Yl=new P,ql=new Cr,mi=new P;class Jx extends Ot{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new dt,this.projectionMatrix=new dt,this.projectionMatrixInverse=new dt,this.coordinateSystem=yi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Yl,ql,mi),mi.x===1&&mi.y===1&&mi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Yl,ql,mi.set(1,1,1)).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorld.decompose(Yl,ql,mi),mi.x===1&&mi.y===1&&mi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Yl,ql,mi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const ar=new P,c_=new xe,u_=new xe;class Ln extends Jx{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Fa*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(co*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Fa*2*Math.atan(Math.tan(co*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){ar.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ar.x,ar.y).multiplyScalar(-e/ar.z),ar.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ar.x,ar.y).multiplyScalar(-e/ar.z)}getViewSize(e,t){return this.getViewBounds(e,c_,u_),t.subVectors(u_,c_)}setViewOffset(e,t,i,r,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(co*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,u=o.fullHeight;s+=o.offsetX*r/l,t-=o.offsetY*i/u,r*=o.width/l,i*=o.height/u}const c=this.filmOffset;c!==0&&(s+=e*c/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class zw extends Qx{constructor(){super(new Ln(90,1,.5,500)),this.isPointLightShadow=!0}}class Vw extends wu{constructor(e,t,i=0,r=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=r,this.shadow=new zw}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class Eu extends Jx{constructor(e=-1,t=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,c=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const u=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=u*this.view.offsetX,o=s+u*this.view.width,c-=d*this.view.offsetY,l=c-d*this.view.height}this.projectionMatrix.makeOrthographic(s,o,c,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Hw extends Qx{constructor(){super(new Eu(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class sP extends wu{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ot.DEFAULT_UP),this.updateMatrix(),this.target=new Ot,this.shadow=new Hw}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class oP extends wu{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}const Is=-90,Ns=1;class Gw extends Ot{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Ln(Is,Ns,e,t);r.layers=this.layers,this.add(r);const s=new Ln(Is,Ns,e,t);s.layers=this.layers,this.add(s);const o=new Ln(Is,Ns,e,t);o.layers=this.layers,this.add(o);const c=new Ln(Is,Ns,e,t);c.layers=this.layers,this.add(c);const l=new Ln(Is,Ns,e,t);l.layers=this.layers,this.add(l);const u=new Ln(Is,Ns,e,t);u.layers=this.layers,this.add(u)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,s,o,c,l]=t;for(const u of t)this.remove(u);if(e===yi)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),c.up.set(0,1,0),c.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ua)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),c.up.set(0,-1,0),c.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const u of t)this.add(u),u.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,c,l,u,d]=this.children,a=e.getRenderTarget(),f=e.getActiveCubeFace(),h=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let g=!1;e.isWebGLRenderer===!0?g=e.state.buffers.depth.getReversed():g=e.reversedDepthBuffer,e.setRenderTarget(i,0,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(i,1,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,2,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(i,3,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(i,4,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),i.texture.generateMipmaps=v,e.setRenderTarget(i,5,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,d),e.setRenderTarget(a,f,h),e.xr.enabled=m,i.texture.needsPMREMUpdate=!0}}class Ww extends Ln{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class Xw{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=jw.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}}function jw(){this._document.hidden===!1&&this.reset()}class aP{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,Fe("THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.")}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}class f_{constructor(e=1,t=0,i=0){this.radius=e,this.phi=t,this.theta=i}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=je(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(je(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class $w extends us{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){Fe("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function d_(n,e,t,i){const r=Yw(i);switch(t){case Ix:return n*e;case Wp:return n*e/r.components*r.byteLength;case Xp:return n*e/r.components*r.byteLength;case So:return n*e*2/r.components*r.byteLength;case jp:return n*e*2/r.components*r.byteLength;case Nx:return n*e*3/r.components*r.byteLength;case ai:return n*e*4/r.components*r.byteLength;case $p:return n*e*4/r.components*r.byteLength;case _c:case vc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case xc:case yc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case sh:case ah:return Math.max(n,16)*Math.max(e,8)/4;case rh:case oh:return Math.max(n,8)*Math.max(e,8)/2;case lh:case ch:case fh:case dh:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case uh:case hh:case ph:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case mh:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case gh:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case _h:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case vh:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case xh:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case yh:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Sh:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Mh:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case wh:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Eh:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Th:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Ah:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case bh:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Ch:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Rh:case Ph:case Lh:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Dh:case Ih:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Nh:case Uh:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Yw(n){switch(n){case Dn:case Rx:return{byteLength:1,components:1};case Ia:case Px:case Fn:return{byteLength:2,components:1};case Hp:case Gp:return{byteLength:2,components:4};case Ai:case Vp:case oi:return{byteLength:4,components:1};case Lx:case Dx:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:zp}}));typeof window<"u"&&(window.__THREE__?Fe("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=zp);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function ey(){let n=null,e=!1,t=null,i=null;function r(s,o){t(s,o),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function qw(n){const e=new WeakMap;function t(c,l){const u=c.array,d=c.usage,a=u.byteLength,f=n.createBuffer();n.bindBuffer(l,f),n.bufferData(l,u,d),c.onUploadCallback();let h;if(u instanceof Float32Array)h=n.FLOAT;else if(typeof Float16Array<"u"&&u instanceof Float16Array)h=n.HALF_FLOAT;else if(u instanceof Uint16Array)c.isFloat16BufferAttribute?h=n.HALF_FLOAT:h=n.UNSIGNED_SHORT;else if(u instanceof Int16Array)h=n.SHORT;else if(u instanceof Uint32Array)h=n.UNSIGNED_INT;else if(u instanceof Int32Array)h=n.INT;else if(u instanceof Int8Array)h=n.BYTE;else if(u instanceof Uint8Array)h=n.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)h=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:f,type:h,bytesPerElement:u.BYTES_PER_ELEMENT,version:c.version,size:a}}function i(c,l,u){const d=l.array,a=l.updateRanges;if(n.bindBuffer(u,c),a.length===0)n.bufferSubData(u,0,d);else{a.sort((h,m)=>h.start-m.start);let f=0;for(let h=1;h<a.length;h++){const m=a[f],v=a[h];v.start<=m.start+m.count+1?m.count=Math.max(m.count,v.start+v.count-m.start):(++f,a[f]=v)}a.length=f+1;for(let h=0,m=a.length;h<m;h++){const v=a[h];n.bufferSubData(u,v.start*d.BYTES_PER_ELEMENT,d,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(c){return c.isInterleavedBufferAttribute&&(c=c.data),e.get(c)}function s(c){c.isInterleavedBufferAttribute&&(c=c.data);const l=e.get(c);l&&(n.deleteBuffer(l.buffer),e.delete(c))}function o(c,l){if(c.isInterleavedBufferAttribute&&(c=c.data),c.isGLBufferAttribute){const d=e.get(c);(!d||d.version<c.version)&&e.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}const u=e.get(c);if(u===void 0)e.set(c,t(c,l));else if(u.version<c.version){if(u.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(u.buffer,c,l),u.version=c.version}}return{get:r,remove:s,update:o}}var Kw=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Zw=`#ifdef USE_ALPHAHASH
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
#endif`,Qw=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Jw=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,eE=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,tE=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,nE=`#ifdef USE_AOMAP
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
#endif`,iE=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,rE=`#ifdef USE_BATCHING
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
#endif`,sE=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,oE=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,aE=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,lE=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,cE=`#ifdef USE_IRIDESCENCE
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
#endif`,uE=`#ifdef USE_BUMPMAP
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
#endif`,fE=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,dE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,hE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,pE=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,mE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,gE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,_E=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,vE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,xE=`#define PI 3.141592653589793
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
} // validated`,yE=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,SE=`vec3 transformedNormal = objectNormal;
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
#endif`,ME=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,wE=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,EE=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,TE=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,AE="gl_FragColor = linearToOutputTexel( gl_FragColor );",bE=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,CE=`#ifdef USE_ENVMAP
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
#endif`,RE=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,PE=`#ifdef USE_ENVMAP
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
#endif`,LE=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,DE=`#ifdef USE_ENVMAP
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
#endif`,IE=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,NE=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,UE=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,FE=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,OE=`#ifdef USE_GRADIENTMAP
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
}`,kE=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,BE=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,zE=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,VE=`uniform bool receiveShadow;
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
#endif`,HE=`#ifdef USE_ENVMAP
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
#endif`,GE=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,WE=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,XE=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,jE=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,$E=`PhysicalMaterial material;
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
#endif`,YE=`uniform sampler2D dfgLUT;
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
}`,qE=`
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
#endif`,KE=`#if defined( RE_IndirectDiffuse )
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
#endif`,ZE=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,QE=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,JE=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,eT=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,tT=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,nT=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,iT=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,rT=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,sT=`#if defined( USE_POINTS_UV )
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
#endif`,oT=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,aT=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,lT=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,cT=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,uT=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,fT=`#ifdef USE_MORPHTARGETS
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
#endif`,dT=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,hT=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,pT=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,mT=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,gT=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,_T=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,vT=`#ifdef USE_NORMALMAP
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
#endif`,xT=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,yT=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,ST=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,MT=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,wT=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,ET=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,TT=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,AT=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,bT=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,CT=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,RT=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,PT=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,LT=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,DT=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,IT=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,NT=`float getShadowMask() {
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
}`,UT=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,FT=`#ifdef USE_SKINNING
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
#endif`,OT=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,kT=`#ifdef USE_SKINNING
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
#endif`,BT=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,zT=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,VT=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,HT=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,GT=`#ifdef USE_TRANSMISSION
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
#endif`,WT=`#ifdef USE_TRANSMISSION
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
#endif`,XT=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,jT=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,$T=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,YT=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const qT=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,KT=`uniform sampler2D t2D;
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
}`,ZT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,QT=`#ifdef ENVMAP_TYPE_CUBE
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
}`,JT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,eA=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,tA=`#include <common>
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
}`,nA=`#if DEPTH_PACKING == 3200
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
}`,iA=`#define DISTANCE
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
}`,rA=`#define DISTANCE
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
}`,sA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,oA=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,aA=`uniform float scale;
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
}`,lA=`uniform vec3 diffuse;
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
}`,cA=`#include <common>
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
}`,uA=`uniform vec3 diffuse;
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
}`,fA=`#define LAMBERT
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
}`,dA=`#define LAMBERT
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
}`,hA=`#define MATCAP
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
}`,pA=`#define MATCAP
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
}`,mA=`#define NORMAL
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
}`,gA=`#define NORMAL
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
}`,_A=`#define PHONG
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
}`,vA=`#define PHONG
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
}`,xA=`#define STANDARD
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
}`,yA=`#define STANDARD
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
}`,SA=`#define TOON
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
}`,MA=`#define TOON
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
}`,wA=`uniform float size;
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
}`,EA=`uniform vec3 diffuse;
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
}`,TA=`#include <common>
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
}`,AA=`uniform vec3 color;
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
}`,bA=`uniform float rotation;
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
}`,CA=`uniform vec3 diffuse;
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
}`,Xe={alphahash_fragment:Kw,alphahash_pars_fragment:Zw,alphamap_fragment:Qw,alphamap_pars_fragment:Jw,alphatest_fragment:eE,alphatest_pars_fragment:tE,aomap_fragment:nE,aomap_pars_fragment:iE,batching_pars_vertex:rE,batching_vertex:sE,begin_vertex:oE,beginnormal_vertex:aE,bsdfs:lE,iridescence_fragment:cE,bumpmap_pars_fragment:uE,clipping_planes_fragment:fE,clipping_planes_pars_fragment:dE,clipping_planes_pars_vertex:hE,clipping_planes_vertex:pE,color_fragment:mE,color_pars_fragment:gE,color_pars_vertex:_E,color_vertex:vE,common:xE,cube_uv_reflection_fragment:yE,defaultnormal_vertex:SE,displacementmap_pars_vertex:ME,displacementmap_vertex:wE,emissivemap_fragment:EE,emissivemap_pars_fragment:TE,colorspace_fragment:AE,colorspace_pars_fragment:bE,envmap_fragment:CE,envmap_common_pars_fragment:RE,envmap_pars_fragment:PE,envmap_pars_vertex:LE,envmap_physical_pars_fragment:HE,envmap_vertex:DE,fog_vertex:IE,fog_pars_vertex:NE,fog_fragment:UE,fog_pars_fragment:FE,gradientmap_pars_fragment:OE,lightmap_pars_fragment:kE,lights_lambert_fragment:BE,lights_lambert_pars_fragment:zE,lights_pars_begin:VE,lights_toon_fragment:GE,lights_toon_pars_fragment:WE,lights_phong_fragment:XE,lights_phong_pars_fragment:jE,lights_physical_fragment:$E,lights_physical_pars_fragment:YE,lights_fragment_begin:qE,lights_fragment_maps:KE,lights_fragment_end:ZE,logdepthbuf_fragment:QE,logdepthbuf_pars_fragment:JE,logdepthbuf_pars_vertex:eT,logdepthbuf_vertex:tT,map_fragment:nT,map_pars_fragment:iT,map_particle_fragment:rT,map_particle_pars_fragment:sT,metalnessmap_fragment:oT,metalnessmap_pars_fragment:aT,morphinstance_vertex:lT,morphcolor_vertex:cT,morphnormal_vertex:uT,morphtarget_pars_vertex:fT,morphtarget_vertex:dT,normal_fragment_begin:hT,normal_fragment_maps:pT,normal_pars_fragment:mT,normal_pars_vertex:gT,normal_vertex:_T,normalmap_pars_fragment:vT,clearcoat_normal_fragment_begin:xT,clearcoat_normal_fragment_maps:yT,clearcoat_pars_fragment:ST,iridescence_pars_fragment:MT,opaque_fragment:wT,packing:ET,premultiplied_alpha_fragment:TT,project_vertex:AT,dithering_fragment:bT,dithering_pars_fragment:CT,roughnessmap_fragment:RT,roughnessmap_pars_fragment:PT,shadowmap_pars_fragment:LT,shadowmap_pars_vertex:DT,shadowmap_vertex:IT,shadowmask_pars_fragment:NT,skinbase_vertex:UT,skinning_pars_vertex:FT,skinning_vertex:OT,skinnormal_vertex:kT,specularmap_fragment:BT,specularmap_pars_fragment:zT,tonemapping_fragment:VT,tonemapping_pars_fragment:HT,transmission_fragment:GT,transmission_pars_fragment:WT,uv_pars_fragment:XT,uv_pars_vertex:jT,uv_vertex:$T,worldpos_vertex:YT,background_vert:qT,background_frag:KT,backgroundCube_vert:ZT,backgroundCube_frag:QT,cube_vert:JT,cube_frag:eA,depth_vert:tA,depth_frag:nA,distance_vert:iA,distance_frag:rA,equirect_vert:sA,equirect_frag:oA,linedashed_vert:aA,linedashed_frag:lA,meshbasic_vert:cA,meshbasic_frag:uA,meshlambert_vert:fA,meshlambert_frag:dA,meshmatcap_vert:hA,meshmatcap_frag:pA,meshnormal_vert:mA,meshnormal_frag:gA,meshphong_vert:_A,meshphong_frag:vA,meshphysical_vert:xA,meshphysical_frag:yA,meshtoon_vert:SA,meshtoon_frag:MA,points_vert:wA,points_frag:EA,shadow_vert:TA,shadow_frag:AA,sprite_vert:bA,sprite_frag:CA},he={common:{diffuse:{value:new ne(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new We}},envmap:{envMap:{value:null},envMapRotation:{value:new We},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new We}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new We}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new We},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new We},normalScale:{value:new xe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new We},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new We}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new We}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new We}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ne(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ne(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0},uvTransform:{value:new We}},sprite:{diffuse:{value:new ne(16777215)},opacity:{value:1},center:{value:new xe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}}},vi={basic:{uniforms:fn([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.fog]),vertexShader:Xe.meshbasic_vert,fragmentShader:Xe.meshbasic_frag},lambert:{uniforms:fn([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new ne(0)},envMapIntensity:{value:1}}]),vertexShader:Xe.meshlambert_vert,fragmentShader:Xe.meshlambert_frag},phong:{uniforms:fn([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new ne(0)},specular:{value:new ne(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Xe.meshphong_vert,fragmentShader:Xe.meshphong_frag},standard:{uniforms:fn([he.common,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.roughnessmap,he.metalnessmap,he.fog,he.lights,{emissive:{value:new ne(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag},toon:{uniforms:fn([he.common,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.gradientmap,he.fog,he.lights,{emissive:{value:new ne(0)}}]),vertexShader:Xe.meshtoon_vert,fragmentShader:Xe.meshtoon_frag},matcap:{uniforms:fn([he.common,he.bumpmap,he.normalmap,he.displacementmap,he.fog,{matcap:{value:null}}]),vertexShader:Xe.meshmatcap_vert,fragmentShader:Xe.meshmatcap_frag},points:{uniforms:fn([he.points,he.fog]),vertexShader:Xe.points_vert,fragmentShader:Xe.points_frag},dashed:{uniforms:fn([he.common,he.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xe.linedashed_vert,fragmentShader:Xe.linedashed_frag},depth:{uniforms:fn([he.common,he.displacementmap]),vertexShader:Xe.depth_vert,fragmentShader:Xe.depth_frag},normal:{uniforms:fn([he.common,he.bumpmap,he.normalmap,he.displacementmap,{opacity:{value:1}}]),vertexShader:Xe.meshnormal_vert,fragmentShader:Xe.meshnormal_frag},sprite:{uniforms:fn([he.sprite,he.fog]),vertexShader:Xe.sprite_vert,fragmentShader:Xe.sprite_frag},background:{uniforms:{uvTransform:{value:new We},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xe.background_vert,fragmentShader:Xe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new We}},vertexShader:Xe.backgroundCube_vert,fragmentShader:Xe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xe.cube_vert,fragmentShader:Xe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xe.equirect_vert,fragmentShader:Xe.equirect_frag},distance:{uniforms:fn([he.common,he.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xe.distance_vert,fragmentShader:Xe.distance_frag},shadow:{uniforms:fn([he.lights,he.fog,{color:{value:new ne(0)},opacity:{value:1}}]),vertexShader:Xe.shadow_vert,fragmentShader:Xe.shadow_frag}};vi.physical={uniforms:fn([vi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new We},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new We},clearcoatNormalScale:{value:new xe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new We},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new We},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new We},sheen:{value:0},sheenColor:{value:new ne(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new We},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new We},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new We},transmissionSamplerSize:{value:new xe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new We},attenuationDistance:{value:0},attenuationColor:{value:new ne(0)},specularColor:{value:new ne(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new We},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new We},anisotropyVector:{value:new xe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new We}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag};const Kl={r:0,b:0,g:0},Vr=new bi,RA=new dt;function PA(n,e,t,i,r,s){const o=new ne(0);let c=r===!0?0:1,l,u,d=null,a=0,f=null;function h(_){let x=_.isScene===!0?_.background:null;if(x&&x.isTexture){const S=_.backgroundBlurriness>0;x=e.get(x,S)}return x}function m(_){let x=!1;const S=h(_);S===null?g(o,c):S&&S.isColor&&(g(S,1),x=!0);const A=n.xr.getEnvironmentBlendMode();A==="additive"?t.buffers.color.setClear(0,0,0,1,s):A==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,s),(n.autoClear||x)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function v(_,x){const S=h(x);S&&(S.isCubeTexture||S.mapping===yu)?(u===void 0&&(u=new mn(new Xa(1,1,1),new Tt({name:"BackgroundCubeMaterial",uniforms:Eo(vi.backgroundCube.uniforms),vertexShader:vi.backgroundCube.vertexShader,fragmentShader:vi.backgroundCube.fragmentShader,side:En,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(A,M,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(u)),Vr.copy(x.backgroundRotation),Vr.x*=-1,Vr.y*=-1,Vr.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(Vr.y*=-1,Vr.z*=-1),u.material.uniforms.envMap.value=S,u.material.uniforms.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(RA.makeRotationFromEuler(Vr)),u.material.toneMapped=et.getTransfer(S.colorSpace)!==lt,(d!==S||a!==S.version||f!==n.toneMapping)&&(u.material.needsUpdate=!0,d=S,a=S.version,f=n.toneMapping),u.layers.enableAll(),_.unshift(u,u.geometry,u.material,0,0,null)):S&&S.isTexture&&(l===void 0&&(l=new mn(new ja(2,2),new Tt({name:"BackgroundMaterial",uniforms:Eo(vi.background.uniforms),vertexShader:vi.background.vertexShader,fragmentShader:vi.background.fragmentShader,side:br,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=S,l.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,l.material.toneMapped=et.getTransfer(S.colorSpace)!==lt,S.matrixAutoUpdate===!0&&S.updateMatrix(),l.material.uniforms.uvTransform.value.copy(S.matrix),(d!==S||a!==S.version||f!==n.toneMapping)&&(l.material.needsUpdate=!0,d=S,a=S.version,f=n.toneMapping),l.layers.enableAll(),_.unshift(l,l.geometry,l.material,0,0,null))}function g(_,x){_.getRGB(Kl,Zx(n)),t.buffers.color.setClear(Kl.r,Kl.g,Kl.b,x,s)}function p(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(_,x=1){o.set(_),c=x,g(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(_){c=_,g(o,c)},render:m,addToRenderList:v,dispose:p}}function LA(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=f(null);let s=r,o=!1;function c(C,F,L,U,z){let V=!1;const H=a(C,U,L,F);s!==H&&(s=H,u(s.object)),V=h(C,U,L,z),V&&m(C,U,L,z),z!==null&&e.update(z,n.ELEMENT_ARRAY_BUFFER),(V||o)&&(o=!1,S(C,F,L,U),z!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(z).buffer))}function l(){return n.createVertexArray()}function u(C){return n.bindVertexArray(C)}function d(C){return n.deleteVertexArray(C)}function a(C,F,L,U){const z=U.wireframe===!0;let V=i[F.id];V===void 0&&(V={},i[F.id]=V);const H=C.isInstancedMesh===!0?C.id:0;let k=V[H];k===void 0&&(k={},V[H]=k);let X=k[L.id];X===void 0&&(X={},k[L.id]=X);let Q=X[z];return Q===void 0&&(Q=f(l()),X[z]=Q),Q}function f(C){const F=[],L=[],U=[];for(let z=0;z<t;z++)F[z]=0,L[z]=0,U[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:L,attributeDivisors:U,object:C,attributes:{},index:null}}function h(C,F,L,U){const z=s.attributes,V=F.attributes;let H=0;const k=L.getAttributes();for(const X in k)if(k[X].location>=0){const J=z[X];let te=V[X];if(te===void 0&&(X==="instanceMatrix"&&C.instanceMatrix&&(te=C.instanceMatrix),X==="instanceColor"&&C.instanceColor&&(te=C.instanceColor)),J===void 0||J.attribute!==te||te&&J.data!==te.data)return!0;H++}return s.attributesNum!==H||s.index!==U}function m(C,F,L,U){const z={},V=F.attributes;let H=0;const k=L.getAttributes();for(const X in k)if(k[X].location>=0){let J=V[X];J===void 0&&(X==="instanceMatrix"&&C.instanceMatrix&&(J=C.instanceMatrix),X==="instanceColor"&&C.instanceColor&&(J=C.instanceColor));const te={};te.attribute=J,J&&J.data&&(te.data=J.data),z[X]=te,H++}s.attributes=z,s.attributesNum=H,s.index=U}function v(){const C=s.newAttributes;for(let F=0,L=C.length;F<L;F++)C[F]=0}function g(C){p(C,0)}function p(C,F){const L=s.newAttributes,U=s.enabledAttributes,z=s.attributeDivisors;L[C]=1,U[C]===0&&(n.enableVertexAttribArray(C),U[C]=1),z[C]!==F&&(n.vertexAttribDivisor(C,F),z[C]=F)}function _(){const C=s.newAttributes,F=s.enabledAttributes;for(let L=0,U=F.length;L<U;L++)F[L]!==C[L]&&(n.disableVertexAttribArray(L),F[L]=0)}function x(C,F,L,U,z,V,H){H===!0?n.vertexAttribIPointer(C,F,L,z,V):n.vertexAttribPointer(C,F,L,U,z,V)}function S(C,F,L,U){v();const z=U.attributes,V=L.getAttributes(),H=F.defaultAttributeValues;for(const k in V){const X=V[k];if(X.location>=0){let Q=z[k];if(Q===void 0&&(k==="instanceMatrix"&&C.instanceMatrix&&(Q=C.instanceMatrix),k==="instanceColor"&&C.instanceColor&&(Q=C.instanceColor)),Q!==void 0){const J=Q.normalized,te=Q.itemSize,Oe=e.get(Q);if(Oe===void 0)continue;const qe=Oe.buffer,rt=Oe.type,Y=Oe.bytesPerElement,se=rt===n.INT||rt===n.UNSIGNED_INT||Q.gpuType===Vp;if(Q.isInterleavedBufferAttribute){const le=Q.data,Me=le.stride,oe=Q.offset;if(le.isInstancedInterleavedBuffer){for(let Ne=0;Ne<X.locationSize;Ne++)p(X.location+Ne,le.meshPerAttribute);C.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=le.meshPerAttribute*le.count)}else for(let Ne=0;Ne<X.locationSize;Ne++)g(X.location+Ne);n.bindBuffer(n.ARRAY_BUFFER,qe);for(let Ne=0;Ne<X.locationSize;Ne++)x(X.location+Ne,te/X.locationSize,rt,J,Me*Y,(oe+te/X.locationSize*Ne)*Y,se)}else{if(Q.isInstancedBufferAttribute){for(let le=0;le<X.locationSize;le++)p(X.location+le,Q.meshPerAttribute);C.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let le=0;le<X.locationSize;le++)g(X.location+le);n.bindBuffer(n.ARRAY_BUFFER,qe);for(let le=0;le<X.locationSize;le++)x(X.location+le,te/X.locationSize,rt,J,te*Y,te/X.locationSize*le*Y,se)}}else if(H!==void 0){const J=H[k];if(J!==void 0)switch(J.length){case 2:n.vertexAttrib2fv(X.location,J);break;case 3:n.vertexAttrib3fv(X.location,J);break;case 4:n.vertexAttrib4fv(X.location,J);break;default:n.vertexAttrib1fv(X.location,J)}}}}_()}function A(){E();for(const C in i){const F=i[C];for(const L in F){const U=F[L];for(const z in U){const V=U[z];for(const H in V)d(V[H].object),delete V[H];delete U[z]}}delete i[C]}}function M(C){if(i[C.id]===void 0)return;const F=i[C.id];for(const L in F){const U=F[L];for(const z in U){const V=U[z];for(const H in V)d(V[H].object),delete V[H];delete U[z]}}delete i[C.id]}function T(C){for(const F in i){const L=i[F];for(const U in L){const z=L[U];if(z[C.id]===void 0)continue;const V=z[C.id];for(const H in V)d(V[H].object),delete V[H];delete z[C.id]}}}function y(C){for(const F in i){const L=i[F],U=C.isInstancedMesh===!0?C.id:0,z=L[U];if(z!==void 0){for(const V in z){const H=z[V];for(const k in H)d(H[k].object),delete H[k];delete z[V]}delete L[U],Object.keys(L).length===0&&delete i[F]}}}function E(){D(),o=!0,s!==r&&(s=r,u(s.object))}function D(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:c,reset:E,resetDefaultState:D,dispose:A,releaseStatesOfGeometry:M,releaseStatesOfObject:y,releaseStatesOfProgram:T,initAttributes:v,enableAttribute:g,disableUnusedAttributes:_}}function DA(n,e,t){let i;function r(u){i=u}function s(u,d){n.drawArrays(i,u,d),t.update(d,i,1)}function o(u,d,a){a!==0&&(n.drawArraysInstanced(i,u,d,a),t.update(d,i,a))}function c(u,d,a){if(a===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,u,0,d,0,a);let h=0;for(let m=0;m<a;m++)h+=d[m];t.update(h,i,1)}function l(u,d,a,f){if(a===0)return;const h=e.get("WEBGL_multi_draw");if(h===null)for(let m=0;m<u.length;m++)o(u[m],d[m],f[m]);else{h.multiDrawArraysInstancedWEBGL(i,u,0,d,0,f,0,a);let m=0;for(let v=0;v<a;v++)m+=d[v]*f[v];t.update(m,i,1)}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=c,this.renderMultiDrawInstances=l}function IA(n,e,t,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const T=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(T){return!(T!==ai&&i.convert(T)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function c(T){const y=T===Fn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(T!==Dn&&i.convert(T)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==oi&&!y)}function l(T){if(T==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let u=t.precision!==void 0?t.precision:"highp";const d=l(u);d!==u&&(Fe("WebGLRenderer:",u,"not supported, using",d,"instead."),u=d);const a=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),h=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),_=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),x=n.getParameter(n.MAX_VARYING_VECTORS),S=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),A=n.getParameter(n.MAX_SAMPLES),M=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:c,precision:u,logarithmicDepthBuffer:a,reversedDepthBuffer:f,maxTextures:h,maxVertexTextures:m,maxTextureSize:v,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:_,maxVaryings:x,maxFragmentUniforms:S,maxSamples:A,samples:M}}function NA(n){const e=this;let t=null,i=0,r=!1,s=!1;const o=new ur,c=new We,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(a,f){const h=a.length!==0||f||i!==0||r;return r=f,i=a.length,h},this.beginShadows=function(){s=!0,d(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(a,f){t=d(a,f,0)},this.setState=function(a,f,h){const m=a.clippingPlanes,v=a.clipIntersection,g=a.clipShadows,p=n.get(a);if(!r||m===null||m.length===0||s&&!g)s?d(null):u();else{const _=s?0:i,x=_*4;let S=p.clippingState||null;l.value=S,S=d(m,f,x,h);for(let A=0;A!==x;++A)S[A]=t[A];p.clippingState=S,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=_}};function u(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function d(a,f,h,m){const v=a!==null?a.length:0;let g=null;if(v!==0){if(g=l.value,m!==!0||g===null){const p=h+v*4,_=f.matrixWorldInverse;c.getNormalMatrix(_),(g===null||g.length<p)&&(g=new Float32Array(p));for(let x=0,S=h;x!==v;++x,S+=4)o.copy(a[x]).applyMatrix4(_,c),o.normal.toArray(g,S),g[S+3]=o.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,g}}const gr=4,h_=[.125,.215,.35,.446,.526,.582],Yr=20,UA=256,Ko=new Eu,p_=new ne;let Of=null,kf=0,Bf=0,zf=!1;const FA=new P;class m_{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,r=100,s={}){const{size:o=256,position:c=FA}=s;Of=this._renderer.getRenderTarget(),kf=this._renderer.getActiveCubeFace(),Bf=this._renderer.getActiveMipmapLevel(),zf=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,r,l,c),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=v_(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=__(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Of,kf,Bf),this._renderer.xr.enabled=zf,e.scissorTest=!1,Us(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===as||e.mapping===yo?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Of=this._renderer.getRenderTarget(),kf=this._renderer.getActiveCubeFace(),Bf=this._renderer.getActiveMipmapLevel(),zf=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:an,minFilter:an,generateMipmaps:!1,type:Fn,format:ai,colorSpace:Mo,depthBuffer:!1},r=g_(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=g_(e,t,i);const{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=OA(s)),this._blurMaterial=BA(s,e,t),this._ggxMaterial=kA(s,e,t)}return r}_compileMaterial(e){const t=new mn(new He,e);this._renderer.compile(t,Ko)}_sceneToCubeUV(e,t,i,r,s){const l=new Ln(90,1,t,i),u=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],a=this._renderer,f=a.autoClear,h=a.toneMapping;a.getClearColor(p_),a.toneMapping=Ei,a.autoClear=!1,a.state.buffers.depth.getReversed()&&(a.setRenderTarget(r),a.clearDepth(),a.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new mn(new Xa,new wo({name:"PMREM.Background",side:En,depthWrite:!1,depthTest:!1})));const v=this._backgroundBox,g=v.material;let p=!1;const _=e.background;_?_.isColor&&(g.color.copy(_),e.background=null,p=!0):(g.color.copy(p_),p=!0);for(let x=0;x<6;x++){const S=x%3;S===0?(l.up.set(0,u[x],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+d[x],s.y,s.z)):S===1?(l.up.set(0,0,u[x]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+d[x],s.z)):(l.up.set(0,u[x],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+d[x]));const A=this._cubeSize;Us(r,S*A,x>2?A:0,A,A),a.setRenderTarget(r),p&&a.render(v,l),a.render(e,l)}a.toneMapping=h,a.autoClear=f,e.background=_}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===as||e.mapping===yo;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=v_()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=__());const s=r?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=s;const c=s.uniforms;c.envMap.value=e;const l=this._cubeSize;Us(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(o,Ko)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(e,s-1,s);t.autoClear=i}_applyGGXFilter(e,t,i){const r=this._renderer,s=this._pingPongRenderTarget,o=this._ggxMaterial,c=this._lodMeshes[i];c.material=o;const l=o.uniforms,u=i/(this._lodMeshes.length-1),d=t/(this._lodMeshes.length-1),a=Math.sqrt(u*u-d*d),f=0+u*1.25,h=a*f,{_lodMax:m}=this,v=this._sizeLods[i],g=3*v*(i>m-gr?i-m+gr:0),p=4*(this._cubeSize-v);l.envMap.value=e.texture,l.roughness.value=h,l.mipInt.value=m-t,Us(s,g,p,3*v,2*v),r.setRenderTarget(s),r.render(c,Ko),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=m-i,Us(e,g,p,3*v,2*v),r.setRenderTarget(e),r.render(c,Ko)}_blur(e,t,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,t,i,r,s,o,c){const l=this._renderer,u=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&Je("blur direction must be either latitudinal or longitudinal!");const d=3,a=this._lodMeshes[r];a.material=u;const f=u.uniforms,h=this._sizeLods[i]-1,m=isFinite(s)?Math.PI/(2*h):2*Math.PI/(2*Yr-1),v=s/m,g=isFinite(s)?1+Math.floor(d*v):Yr;g>Yr&&Fe(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Yr}`);const p=[];let _=0;for(let T=0;T<Yr;++T){const y=T/v,E=Math.exp(-y*y/2);p.push(E),T===0?_+=E:T<g&&(_+=2*E)}for(let T=0;T<p.length;T++)p[T]=p[T]/_;f.envMap.value=e.texture,f.samples.value=g,f.weights.value=p,f.latitudinal.value=o==="latitudinal",c&&(f.poleAxis.value=c);const{_lodMax:x}=this;f.dTheta.value=m,f.mipInt.value=x-i;const S=this._sizeLods[r],A=3*S*(r>x-gr?r-x+gr:0),M=4*(this._cubeSize-S);Us(t,A,M,3*S,2*S),l.setRenderTarget(t),l.render(a,Ko)}}function OA(n){const e=[],t=[],i=[];let r=n;const s=n-gr+1+h_.length;for(let o=0;o<s;o++){const c=Math.pow(2,r);e.push(c);let l=1/c;o>n-gr?l=h_[o-n+gr-1]:o===0&&(l=0),t.push(l);const u=1/(c-2),d=-u,a=1+u,f=[d,d,a,d,a,a,d,d,a,a,d,a],h=6,m=6,v=3,g=2,p=1,_=new Float32Array(v*m*h),x=new Float32Array(g*m*h),S=new Float32Array(p*m*h);for(let M=0;M<h;M++){const T=M%3*2/3-1,y=M>2?0:-1,E=[T,y,0,T+2/3,y,0,T+2/3,y+1,0,T,y,0,T+2/3,y+1,0,T,y+1,0];_.set(E,v*m*M),x.set(f,g*m*M);const D=[M,M,M,M,M,M];S.set(D,p*m*M)}const A=new He;A.setAttribute("position",new Be(_,v)),A.setAttribute("uv",new Be(x,g)),A.setAttribute("faceIndex",new Be(S,p)),i.push(new mn(A,null)),r>gr&&r--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function g_(n,e,t){const i=new Tn(n,e,t);return i.texture.mapping=yu,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Us(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function kA(n,e,t){return new Tt({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:UA,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Tu(),fragmentShader:`

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
		`,blending:wi,depthTest:!1,depthWrite:!1})}function BA(n,e,t){const i=new Float32Array(Yr),r=new P(0,1,0);return new Tt({name:"SphericalGaussianBlur",defines:{n:Yr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Tu(),fragmentShader:`

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
		`,blending:wi,depthTest:!1,depthWrite:!1})}function __(){return new Tt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Tu(),fragmentShader:`

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
		`,blending:wi,depthTest:!1,depthWrite:!1})}function v_(){return new Tt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Tu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:wi,depthTest:!1,depthWrite:!1})}function Tu(){return`

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
	`}class ty extends Tn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new Xx(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new Xa(5,5,5),s=new Tt({name:"CubemapFromEquirect",uniforms:Eo(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:En,blending:wi});s.uniforms.tEquirect.value=t;const o=new mn(r,s),c=t.minFilter;return t.minFilter===Qr&&(t.minFilter=an),new Gw(1,10,this).update(e,o),t.minFilter=c,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,i=!0,r=!0){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,r);e.setRenderTarget(s)}}function zA(n){let e=new WeakMap,t=new WeakMap,i=null;function r(f,h=!1){return f==null?null:h?o(f):s(f)}function s(f){if(f&&f.isTexture){const h=f.mapping;if(h===rf||h===sf)if(e.has(f)){const m=e.get(f).texture;return c(m,f.mapping)}else{const m=f.image;if(m&&m.height>0){const v=new ty(m.height);return v.fromEquirectangularTexture(n,f),e.set(f,v),f.addEventListener("dispose",u),c(v.texture,f.mapping)}else return null}}return f}function o(f){if(f&&f.isTexture){const h=f.mapping,m=h===rf||h===sf,v=h===as||h===yo;if(m||v){let g=t.get(f);const p=g!==void 0?g.texture.pmremVersion:0;if(f.isRenderTargetTexture&&f.pmremVersion!==p)return i===null&&(i=new m_(n)),g=m?i.fromEquirectangular(f,g):i.fromCubemap(f,g),g.texture.pmremVersion=f.pmremVersion,t.set(f,g),g.texture;if(g!==void 0)return g.texture;{const _=f.image;return m&&_&&_.height>0||v&&_&&l(_)?(i===null&&(i=new m_(n)),g=m?i.fromEquirectangular(f):i.fromCubemap(f),g.texture.pmremVersion=f.pmremVersion,t.set(f,g),f.addEventListener("dispose",d),g.texture):null}}}return f}function c(f,h){return h===rf?f.mapping=as:h===sf&&(f.mapping=yo),f}function l(f){let h=0;const m=6;for(let v=0;v<m;v++)f[v]!==void 0&&h++;return h===m}function u(f){const h=f.target;h.removeEventListener("dispose",u);const m=e.get(h);m!==void 0&&(e.delete(h),m.dispose())}function d(f){const h=f.target;h.removeEventListener("dispose",d);const m=t.get(h);m!==void 0&&(t.delete(h),m.dispose())}function a(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:r,dispose:a}}function VA(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const r=n.getExtension(i);return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const r=t(i);return r===null&&Jc("WebGLRenderer: "+i+" extension not supported."),r}}}function HA(n,e,t,i){const r={},s=new WeakMap;function o(a){const f=a.target;f.index!==null&&e.remove(f.index);for(const m in f.attributes)e.remove(f.attributes[m]);f.removeEventListener("dispose",o),delete r[f.id];const h=s.get(f);h&&(e.remove(h),s.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function c(a,f){return r[f.id]===!0||(f.addEventListener("dispose",o),r[f.id]=!0,t.memory.geometries++),f}function l(a){const f=a.attributes;for(const h in f)e.update(f[h],n.ARRAY_BUFFER)}function u(a){const f=[],h=a.index,m=a.attributes.position;let v=0;if(m===void 0)return;if(h!==null){const _=h.array;v=h.version;for(let x=0,S=_.length;x<S;x+=3){const A=_[x+0],M=_[x+1],T=_[x+2];f.push(A,M,M,T,T,A)}}else{const _=m.array;v=m.version;for(let x=0,S=_.length/3-1;x<S;x+=3){const A=x+0,M=x+1,T=x+2;f.push(A,M,M,T,T,A)}}const g=new(m.count>=65535?Hx:Vx)(f,1);g.version=v;const p=s.get(a);p&&e.remove(p),s.set(a,g)}function d(a){const f=s.get(a);if(f){const h=a.index;h!==null&&f.version<h.version&&u(a)}else u(a);return s.get(a)}return{get:c,update:l,getWireframeAttribute:d}}function GA(n,e,t){let i;function r(f){i=f}let s,o;function c(f){s=f.type,o=f.bytesPerElement}function l(f,h){n.drawElements(i,h,s,f*o),t.update(h,i,1)}function u(f,h,m){m!==0&&(n.drawElementsInstanced(i,h,s,f*o,m),t.update(h,i,m))}function d(f,h,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,h,0,s,f,0,m);let g=0;for(let p=0;p<m;p++)g+=h[p];t.update(g,i,1)}function a(f,h,m,v){if(m===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<f.length;p++)u(f[p]/o,h[p],v[p]);else{g.multiDrawElementsInstancedWEBGL(i,h,0,s,f,0,v,0,m);let p=0;for(let _=0;_<m;_++)p+=h[_]*v[_];t.update(p,i,1)}}this.setMode=r,this.setIndex=c,this.render=l,this.renderInstances=u,this.renderMultiDraw=d,this.renderMultiDrawInstances=a}function WA(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,c){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=c*(s/3);break;case n.LINES:t.lines+=c*(s/2);break;case n.LINE_STRIP:t.lines+=c*(s-1);break;case n.LINE_LOOP:t.lines+=c*s;break;case n.POINTS:t.points+=c*s;break;default:Je("WebGLInfo: Unknown draw mode:",o);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function XA(n,e,t){const i=new WeakMap,r=new Dt;function s(o,c,l){const u=o.morphTargetInfluences,d=c.morphAttributes.position||c.morphAttributes.normal||c.morphAttributes.color,a=d!==void 0?d.length:0;let f=i.get(c);if(f===void 0||f.count!==a){let E=function(){T.dispose(),i.delete(c),c.removeEventListener("dispose",E)};f!==void 0&&f.texture.dispose();const h=c.morphAttributes.position!==void 0,m=c.morphAttributes.normal!==void 0,v=c.morphAttributes.color!==void 0,g=c.morphAttributes.position||[],p=c.morphAttributes.normal||[],_=c.morphAttributes.color||[];let x=0;h===!0&&(x=1),m===!0&&(x=2),v===!0&&(x=3);let S=c.attributes.position.count*x,A=1;S>e.maxTextureSize&&(A=Math.ceil(S/e.maxTextureSize),S=e.maxTextureSize);const M=new Float32Array(S*A*4*a),T=new Ox(M,S,A,a);T.type=oi,T.needsUpdate=!0;const y=x*4;for(let D=0;D<a;D++){const C=g[D],F=p[D],L=_[D],U=S*A*4*D;for(let z=0;z<C.count;z++){const V=z*y;h===!0&&(r.fromBufferAttribute(C,z),M[U+V+0]=r.x,M[U+V+1]=r.y,M[U+V+2]=r.z,M[U+V+3]=0),m===!0&&(r.fromBufferAttribute(F,z),M[U+V+4]=r.x,M[U+V+5]=r.y,M[U+V+6]=r.z,M[U+V+7]=0),v===!0&&(r.fromBufferAttribute(L,z),M[U+V+8]=r.x,M[U+V+9]=r.y,M[U+V+10]=r.z,M[U+V+11]=L.itemSize===4?r.w:1)}}f={count:a,texture:T,size:new xe(S,A)},i.set(c,f),c.addEventListener("dispose",E)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let h=0;for(let v=0;v<u.length;v++)h+=u[v];const m=c.morphTargetsRelative?1:1-h;l.getUniforms().setValue(n,"morphTargetBaseInfluence",m),l.getUniforms().setValue(n,"morphTargetInfluences",u)}l.getUniforms().setValue(n,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:s}}function jA(n,e,t,i,r){let s=new WeakMap;function o(u){const d=r.render.frame,a=u.geometry,f=e.get(u,a);if(s.get(f)!==d&&(e.update(f),s.set(f,d)),u.isInstancedMesh&&(u.hasEventListener("dispose",l)===!1&&u.addEventListener("dispose",l),s.get(u)!==d&&(t.update(u.instanceMatrix,n.ARRAY_BUFFER),u.instanceColor!==null&&t.update(u.instanceColor,n.ARRAY_BUFFER),s.set(u,d))),u.isSkinnedMesh){const h=u.skeleton;s.get(h)!==d&&(h.update(),s.set(h,d))}return f}function c(){s=new WeakMap}function l(u){const d=u.target;d.removeEventListener("dispose",l),i.releaseStatesOfObject(d),t.remove(d.instanceMatrix),d.instanceColor!==null&&t.remove(d.instanceColor)}return{update:o,dispose:c}}const $A={[Sx]:"LINEAR_TONE_MAPPING",[Mx]:"REINHARD_TONE_MAPPING",[wx]:"CINEON_TONE_MAPPING",[Ex]:"ACES_FILMIC_TONE_MAPPING",[Ax]:"AGX_TONE_MAPPING",[bx]:"NEUTRAL_TONE_MAPPING",[Tx]:"CUSTOM_TONE_MAPPING"};function YA(n,e,t,i,r){const s=new Tn(e,t,{type:n,depthBuffer:i,stencilBuffer:r}),o=new Tn(e,t,{type:Fn,depthBuffer:!1,stencilBuffer:!1}),c=new He;c.setAttribute("position",new St([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new St([0,2,0,0,2,0],2));const l=new Ow({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),u=new mn(c,l),d=new Eu(-1,1,1,-1,0,1);let a=null,f=null,h=!1,m,v=null,g=[],p=!1;this.setSize=function(_,x){s.setSize(_,x),o.setSize(_,x);for(let S=0;S<g.length;S++){const A=g[S];A.setSize&&A.setSize(_,x)}},this.setEffects=function(_){g=_,p=g.length>0&&g[0].isRenderPass===!0;const x=s.width,S=s.height;for(let A=0;A<g.length;A++){const M=g[A];M.setSize&&M.setSize(x,S)}},this.begin=function(_,x){if(h||_.toneMapping===Ei&&g.length===0)return!1;if(v=x,x!==null){const S=x.width,A=x.height;(s.width!==S||s.height!==A)&&this.setSize(S,A)}return p===!1&&_.setRenderTarget(s),m=_.toneMapping,_.toneMapping=Ei,!0},this.hasRenderPass=function(){return p},this.end=function(_,x){_.toneMapping=m,h=!0;let S=s,A=o;for(let M=0;M<g.length;M++){const T=g[M];if(T.enabled!==!1&&(T.render(_,A,S,x),T.needsSwap!==!1)){const y=S;S=A,A=y}}if(a!==_.outputColorSpace||f!==_.toneMapping){a=_.outputColorSpace,f=_.toneMapping,l.defines={},et.getTransfer(a)===lt&&(l.defines.SRGB_TRANSFER="");const M=$A[f];M&&(l.defines[M]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=S.texture,_.setRenderTarget(v),_.render(u,d),v=null,h=!1},this.isCompositing=function(){return h},this.dispose=function(){s.dispose(),o.dispose(),c.dispose(),l.dispose()}}const ny=new ln,Bh=new Oa(1,1),iy=new Ox,ry=new uw,sy=new Xx,x_=[],y_=[],S_=new Float32Array(16),M_=new Float32Array(9),w_=new Float32Array(4);function Ro(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let s=x_[r];if(s===void 0&&(s=new Float32Array(r),x_[r]=s),e!==0){i.toArray(s,0);for(let o=1,c=0;o!==e;++o)c+=t,n[o].toArray(s,c)}return s}function Vt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Ht(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Au(n,e){let t=y_[e];t===void 0&&(t=new Int32Array(e),y_[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function qA(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function KA(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Vt(t,e))return;n.uniform2fv(this.addr,e),Ht(t,e)}}function ZA(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Vt(t,e))return;n.uniform3fv(this.addr,e),Ht(t,e)}}function QA(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Vt(t,e))return;n.uniform4fv(this.addr,e),Ht(t,e)}}function JA(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Vt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Ht(t,e)}else{if(Vt(t,i))return;w_.set(i),n.uniformMatrix2fv(this.addr,!1,w_),Ht(t,i)}}function eb(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Vt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Ht(t,e)}else{if(Vt(t,i))return;M_.set(i),n.uniformMatrix3fv(this.addr,!1,M_),Ht(t,i)}}function tb(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Vt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Ht(t,e)}else{if(Vt(t,i))return;S_.set(i),n.uniformMatrix4fv(this.addr,!1,S_),Ht(t,i)}}function nb(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function ib(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Vt(t,e))return;n.uniform2iv(this.addr,e),Ht(t,e)}}function rb(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Vt(t,e))return;n.uniform3iv(this.addr,e),Ht(t,e)}}function sb(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Vt(t,e))return;n.uniform4iv(this.addr,e),Ht(t,e)}}function ob(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function ab(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Vt(t,e))return;n.uniform2uiv(this.addr,e),Ht(t,e)}}function lb(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Vt(t,e))return;n.uniform3uiv(this.addr,e),Ht(t,e)}}function cb(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Vt(t,e))return;n.uniform4uiv(this.addr,e),Ht(t,e)}}function ub(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?(Bh.compareFunction=t.isReversedDepthBuffer()?qp:Yp,s=Bh):s=ny,t.setTexture2D(e||s,r)}function fb(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||ry,r)}function db(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||sy,r)}function hb(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||iy,r)}function pb(n){switch(n){case 5126:return qA;case 35664:return KA;case 35665:return ZA;case 35666:return QA;case 35674:return JA;case 35675:return eb;case 35676:return tb;case 5124:case 35670:return nb;case 35667:case 35671:return ib;case 35668:case 35672:return rb;case 35669:case 35673:return sb;case 5125:return ob;case 36294:return ab;case 36295:return lb;case 36296:return cb;case 35678:case 36198:case 36298:case 36306:case 35682:return ub;case 35679:case 36299:case 36307:return fb;case 35680:case 36300:case 36308:case 36293:return db;case 36289:case 36303:case 36311:case 36292:return hb}}function mb(n,e){n.uniform1fv(this.addr,e)}function gb(n,e){const t=Ro(e,this.size,2);n.uniform2fv(this.addr,t)}function _b(n,e){const t=Ro(e,this.size,3);n.uniform3fv(this.addr,t)}function vb(n,e){const t=Ro(e,this.size,4);n.uniform4fv(this.addr,t)}function xb(n,e){const t=Ro(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function yb(n,e){const t=Ro(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function Sb(n,e){const t=Ro(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Mb(n,e){n.uniform1iv(this.addr,e)}function wb(n,e){n.uniform2iv(this.addr,e)}function Eb(n,e){n.uniform3iv(this.addr,e)}function Tb(n,e){n.uniform4iv(this.addr,e)}function Ab(n,e){n.uniform1uiv(this.addr,e)}function bb(n,e){n.uniform2uiv(this.addr,e)}function Cb(n,e){n.uniform3uiv(this.addr,e)}function Rb(n,e){n.uniform4uiv(this.addr,e)}function Pb(n,e,t){const i=this.cache,r=e.length,s=Au(t,r);Vt(i,s)||(n.uniform1iv(this.addr,s),Ht(i,s));let o;this.type===n.SAMPLER_2D_SHADOW?o=Bh:o=ny;for(let c=0;c!==r;++c)t.setTexture2D(e[c]||o,s[c])}function Lb(n,e,t){const i=this.cache,r=e.length,s=Au(t,r);Vt(i,s)||(n.uniform1iv(this.addr,s),Ht(i,s));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||ry,s[o])}function Db(n,e,t){const i=this.cache,r=e.length,s=Au(t,r);Vt(i,s)||(n.uniform1iv(this.addr,s),Ht(i,s));for(let o=0;o!==r;++o)t.setTextureCube(e[o]||sy,s[o])}function Ib(n,e,t){const i=this.cache,r=e.length,s=Au(t,r);Vt(i,s)||(n.uniform1iv(this.addr,s),Ht(i,s));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||iy,s[o])}function Nb(n){switch(n){case 5126:return mb;case 35664:return gb;case 35665:return _b;case 35666:return vb;case 35674:return xb;case 35675:return yb;case 35676:return Sb;case 5124:case 35670:return Mb;case 35667:case 35671:return wb;case 35668:case 35672:return Eb;case 35669:case 35673:return Tb;case 5125:return Ab;case 36294:return bb;case 36295:return Cb;case 36296:return Rb;case 35678:case 36198:case 36298:case 36306:case 35682:return Pb;case 35679:case 36299:case 36307:return Lb;case 35680:case 36300:case 36308:case 36293:return Db;case 36289:case 36303:case 36311:case 36292:return Ib}}class Ub{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=pb(t.type)}}class Fb{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Nb(t.type)}}class Ob{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const c=r[s];c.setValue(e,t[c.id],i)}}}const Vf=/(\w+)(\])?(\[|\.)?/g;function E_(n,e){n.seq.push(e),n.map[e.id]=e}function kb(n,e,t){const i=n.name,r=i.length;for(Vf.lastIndex=0;;){const s=Vf.exec(i),o=Vf.lastIndex;let c=s[1];const l=s[2]==="]",u=s[3];if(l&&(c=c|0),u===void 0||u==="["&&o+2===r){E_(t,u===void 0?new Ub(c,n,e):new Fb(c,n,e));break}else{let a=t.map[c];a===void 0&&(a=new Ob(c),E_(t,a)),t=a}}}class Sc{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){const c=e.getActiveUniform(t,o),l=e.getUniformLocation(t,c.name);kb(c,l,this)}const r=[],s=[];for(const o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(o):s.push(o);r.length>0&&(this.seq=r.concat(s))}setValue(e,t,i,r){const s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,o=t.length;s!==o;++s){const c=t[s],l=i[c.id];l.needsUpdate!==!1&&c.setValue(e,l.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in t&&i.push(o)}return i}}function T_(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const Bb=37297;let zb=0;function Vb(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=r;o<s;o++){const c=o+1;i.push(`${c===e?">":" "} ${c}: ${t[o]}`)}return i.join(`
`)}const A_=new We;function Hb(n){et._getMatrix(A_,et.workingColorSpace,n);const e=`mat3( ${A_.elements.map(t=>t.toFixed(4))} )`;switch(et.getTransfer(n)){case Kc:return[e,"LinearTransferOETF"];case lt:return[e,"sRGBTransferOETF"];default:return Fe("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function b_(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),s=(n.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";const o=/ERROR: 0:(\d+)/.exec(s);if(o){const c=parseInt(o[1]);return t.toUpperCase()+`

`+s+`

`+Vb(n.getShaderSource(e),c)}else return s}function Gb(n,e){const t=Hb(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const Wb={[Sx]:"Linear",[Mx]:"Reinhard",[wx]:"Cineon",[Ex]:"ACESFilmic",[Ax]:"AgX",[bx]:"Neutral",[Tx]:"Custom"};function Xb(n,e){const t=Wb[e];return t===void 0?(Fe("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Zl=new P;function jb(){et.getLuminanceCoefficients(Zl);const n=Zl.x.toFixed(4),e=Zl.y.toFixed(4),t=Zl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function $b(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ia).join(`
`)}function Yb(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function qb(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(e,r),o=s.name;let c=1;s.type===n.FLOAT_MAT2&&(c=2),s.type===n.FLOAT_MAT3&&(c=3),s.type===n.FLOAT_MAT4&&(c=4),t[o]={type:s.type,location:n.getAttribLocation(e,o),locationSize:c}}return t}function ia(n){return n!==""}function C_(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function R_(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Kb=/^[ \t]*#include +<([\w\d./]+)>/gm;function zh(n){return n.replace(Kb,Qb)}const Zb=new Map;function Qb(n,e){let t=Xe[e];if(t===void 0){const i=Zb.get(e);if(i!==void 0)t=Xe[i],Fe('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return zh(t)}const Jb=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function P_(n){return n.replace(Jb,eC)}function eC(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function L_(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const tC={[gc]:"SHADOWMAP_TYPE_PCF",[na]:"SHADOWMAP_TYPE_VSM"};function nC(n){return tC[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const iC={[as]:"ENVMAP_TYPE_CUBE",[yo]:"ENVMAP_TYPE_CUBE",[yu]:"ENVMAP_TYPE_CUBE_UV"};function rC(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":iC[n.envMapMode]||"ENVMAP_TYPE_CUBE"}const sC={[yo]:"ENVMAP_MODE_REFRACTION"};function oC(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":sC[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const aC={[yx]:"ENVMAP_BLENDING_MULTIPLY",[b1]:"ENVMAP_BLENDING_MIX",[C1]:"ENVMAP_BLENDING_ADD"};function lC(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":aC[n.combine]||"ENVMAP_BLENDING_NONE"}function cC(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:i,maxMip:t}}function uC(n,e,t,i){const r=n.getContext(),s=t.defines;let o=t.vertexShader,c=t.fragmentShader;const l=nC(t),u=rC(t),d=oC(t),a=lC(t),f=cC(t),h=$b(t),m=Yb(s),v=r.createProgram();let g,p,_=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(ia).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(ia).join(`
`),p.length>0&&(p+=`
`)):(g=[L_(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ia).join(`
`),p=[L_(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",t.envMap?"#define "+a:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Ei?"#define TONE_MAPPING":"",t.toneMapping!==Ei?Xe.tonemapping_pars_fragment:"",t.toneMapping!==Ei?Xb("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Xe.colorspace_pars_fragment,Gb("linearToOutputTexel",t.outputColorSpace),jb(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ia).join(`
`)),o=zh(o),o=C_(o,t),o=R_(o,t),c=zh(c),c=C_(c,t),c=R_(c,t),o=P_(o),c=P_(c),t.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,g=[h,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",t.glslVersion===Dg?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Dg?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const x=_+g+o,S=_+p+c,A=T_(r,r.VERTEX_SHADER,x),M=T_(r,r.FRAGMENT_SHADER,S);r.attachShader(v,A),r.attachShader(v,M),t.index0AttributeName!==void 0?r.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(v,0,"position"),r.linkProgram(v);function T(C){if(n.debug.checkShaderErrors){const F=r.getProgramInfoLog(v)||"",L=r.getShaderInfoLog(A)||"",U=r.getShaderInfoLog(M)||"",z=F.trim(),V=L.trim(),H=U.trim();let k=!0,X=!0;if(r.getProgramParameter(v,r.LINK_STATUS)===!1)if(k=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,v,A,M);else{const Q=b_(r,A,"vertex"),J=b_(r,M,"fragment");Je("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(v,r.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+z+`
`+Q+`
`+J)}else z!==""?Fe("WebGLProgram: Program Info Log:",z):(V===""||H==="")&&(X=!1);X&&(C.diagnostics={runnable:k,programLog:z,vertexShader:{log:V,prefix:g},fragmentShader:{log:H,prefix:p}})}r.deleteShader(A),r.deleteShader(M),y=new Sc(r,v),E=qb(r,v)}let y;this.getUniforms=function(){return y===void 0&&T(this),y};let E;this.getAttributes=function(){return E===void 0&&T(this),E};let D=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return D===!1&&(D=r.getProgramParameter(v,Bb)),D},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=zb++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=A,this.fragmentShader=M,this}let fC=0;class dC{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new hC(e),t.set(e,i)),i}}class hC{constructor(e){this.id=fC++,this.code=e,this.usedTimes=0}}function pC(n,e,t,i,r,s){const o=new kx,c=new dC,l=new Set,u=[],d=new Map,a=i.logarithmicDepthBuffer;let f=i.precision;const h={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(y){return l.add(y),y===0?"uv":`uv${y}`}function v(y,E,D,C,F){const L=C.fog,U=F.geometry,z=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?C.environment:null,V=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap,H=e.get(y.envMap||z,V),k=H&&H.mapping===yu?H.image.height:null,X=h[y.type];y.precision!==null&&(f=i.getMaxPrecision(y.precision),f!==y.precision&&Fe("WebGLProgram.getParameters:",y.precision,"not supported, using",f,"instead."));const Q=U.morphAttributes.position||U.morphAttributes.normal||U.morphAttributes.color,J=Q!==void 0?Q.length:0;let te=0;U.morphAttributes.position!==void 0&&(te=1),U.morphAttributes.normal!==void 0&&(te=2),U.morphAttributes.color!==void 0&&(te=3);let Oe,qe,rt,Y;if(X){const at=vi[X];Oe=at.vertexShader,qe=at.fragmentShader}else Oe=y.vertexShader,qe=y.fragmentShader,c.update(y),rt=c.getVertexShaderID(y),Y=c.getFragmentShaderID(y);const se=n.getRenderTarget(),le=n.state.buffers.depth.getReversed(),Me=F.isInstancedMesh===!0,oe=F.isBatchedMesh===!0,Ne=!!y.map,ht=!!y.matcap,Ve=!!H,Ze=!!y.aoMap,st=!!y.lightMap,Le=!!y.bumpMap,Qe=!!y.normalMap,I=!!y.displacementMap,Mt=!!y.emissiveMap,ot=!!y.metalnessMap,vt=!!y.roughnessMap,Ce=y.anisotropy>0,R=y.clearcoat>0,w=y.dispersion>0,O=y.iridescence>0,Z=y.sheen>0,ee=y.transmission>0,K=Ce&&!!y.anisotropyMap,we=R&&!!y.clearcoatMap,fe=R&&!!y.clearcoatNormalMap,Ie=R&&!!y.clearcoatRoughnessMap,ke=O&&!!y.iridescenceMap,re=O&&!!y.iridescenceThicknessMap,ce=Z&&!!y.sheenColorMap,Ee=Z&&!!y.sheenRoughnessMap,Ae=!!y.specularMap,ge=!!y.specularColorMap,$e=!!y.specularIntensityMap,N=ee&&!!y.transmissionMap,de=ee&&!!y.thicknessMap,ue=!!y.gradientMap,ye=!!y.alphaMap,ae=y.alphaTest>0,$=!!y.alphaHash,Te=!!y.extensions;let ze=Ei;y.toneMapped&&(se===null||se.isXRRenderTarget===!0)&&(ze=n.toneMapping);const xt={shaderID:X,shaderType:y.type,shaderName:y.name,vertexShader:Oe,fragmentShader:qe,defines:y.defines,customVertexShaderID:rt,customFragmentShaderID:Y,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:f,batching:oe,batchingColor:oe&&F._colorsTexture!==null,instancing:Me,instancingColor:Me&&F.instanceColor!==null,instancingMorph:Me&&F.morphTexture!==null,outputColorSpace:se===null?n.outputColorSpace:se.isXRRenderTarget===!0?se.texture.colorSpace:Mo,alphaToCoverage:!!y.alphaToCoverage,map:Ne,matcap:ht,envMap:Ve,envMapMode:Ve&&H.mapping,envMapCubeUVHeight:k,aoMap:Ze,lightMap:st,bumpMap:Le,normalMap:Qe,displacementMap:I,emissiveMap:Mt,normalMapObjectSpace:Qe&&y.normalMapType===L1,normalMapTangentSpace:Qe&&y.normalMapType===Ux,metalnessMap:ot,roughnessMap:vt,anisotropy:Ce,anisotropyMap:K,clearcoat:R,clearcoatMap:we,clearcoatNormalMap:fe,clearcoatRoughnessMap:Ie,dispersion:w,iridescence:O,iridescenceMap:ke,iridescenceThicknessMap:re,sheen:Z,sheenColorMap:ce,sheenRoughnessMap:Ee,specularMap:Ae,specularColorMap:ge,specularIntensityMap:$e,transmission:ee,transmissionMap:N,thicknessMap:de,gradientMap:ue,opaque:y.transparent===!1&&y.blending===lo&&y.alphaToCoverage===!1,alphaMap:ye,alphaTest:ae,alphaHash:$,combine:y.combine,mapUv:Ne&&m(y.map.channel),aoMapUv:Ze&&m(y.aoMap.channel),lightMapUv:st&&m(y.lightMap.channel),bumpMapUv:Le&&m(y.bumpMap.channel),normalMapUv:Qe&&m(y.normalMap.channel),displacementMapUv:I&&m(y.displacementMap.channel),emissiveMapUv:Mt&&m(y.emissiveMap.channel),metalnessMapUv:ot&&m(y.metalnessMap.channel),roughnessMapUv:vt&&m(y.roughnessMap.channel),anisotropyMapUv:K&&m(y.anisotropyMap.channel),clearcoatMapUv:we&&m(y.clearcoatMap.channel),clearcoatNormalMapUv:fe&&m(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ie&&m(y.clearcoatRoughnessMap.channel),iridescenceMapUv:ke&&m(y.iridescenceMap.channel),iridescenceThicknessMapUv:re&&m(y.iridescenceThicknessMap.channel),sheenColorMapUv:ce&&m(y.sheenColorMap.channel),sheenRoughnessMapUv:Ee&&m(y.sheenRoughnessMap.channel),specularMapUv:Ae&&m(y.specularMap.channel),specularColorMapUv:ge&&m(y.specularColorMap.channel),specularIntensityMapUv:$e&&m(y.specularIntensityMap.channel),transmissionMapUv:N&&m(y.transmissionMap.channel),thicknessMapUv:de&&m(y.thicknessMap.channel),alphaMapUv:ye&&m(y.alphaMap.channel),vertexTangents:!!U.attributes.tangent&&(Qe||Ce),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!U.attributes.color&&U.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!U.attributes.uv&&(Ne||ye),fog:!!L,useFog:y.fog===!0,fogExp2:!!L&&L.isFogExp2,flatShading:y.wireframe===!1&&(y.flatShading===!0||U.attributes.normal===void 0&&Qe===!1&&(y.isMeshLambertMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isMeshPhysicalMaterial)),sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:a,reversedDepthBuffer:le,skinning:F.isSkinnedMesh===!0,morphTargets:U.morphAttributes.position!==void 0,morphNormals:U.morphAttributes.normal!==void 0,morphColors:U.morphAttributes.color!==void 0,morphTargetsCount:J,morphTextureStride:te,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:y.dithering,shadowMapEnabled:n.shadowMap.enabled&&D.length>0,shadowMapType:n.shadowMap.type,toneMapping:ze,decodeVideoTexture:Ne&&y.map.isVideoTexture===!0&&et.getTransfer(y.map.colorSpace)===lt,decodeVideoTextureEmissive:Mt&&y.emissiveMap.isVideoTexture===!0&&et.getTransfer(y.emissiveMap.colorSpace)===lt,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===ri,flipSided:y.side===En,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:Te&&y.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Te&&y.extensions.multiDraw===!0||oe)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return xt.vertexUv1s=l.has(1),xt.vertexUv2s=l.has(2),xt.vertexUv3s=l.has(3),l.clear(),xt}function g(y){const E=[];if(y.shaderID?E.push(y.shaderID):(E.push(y.customVertexShaderID),E.push(y.customFragmentShaderID)),y.defines!==void 0)for(const D in y.defines)E.push(D),E.push(y.defines[D]);return y.isRawShaderMaterial===!1&&(p(E,y),_(E,y),E.push(n.outputColorSpace)),E.push(y.customProgramCacheKey),E.join()}function p(y,E){y.push(E.precision),y.push(E.outputColorSpace),y.push(E.envMapMode),y.push(E.envMapCubeUVHeight),y.push(E.mapUv),y.push(E.alphaMapUv),y.push(E.lightMapUv),y.push(E.aoMapUv),y.push(E.bumpMapUv),y.push(E.normalMapUv),y.push(E.displacementMapUv),y.push(E.emissiveMapUv),y.push(E.metalnessMapUv),y.push(E.roughnessMapUv),y.push(E.anisotropyMapUv),y.push(E.clearcoatMapUv),y.push(E.clearcoatNormalMapUv),y.push(E.clearcoatRoughnessMapUv),y.push(E.iridescenceMapUv),y.push(E.iridescenceThicknessMapUv),y.push(E.sheenColorMapUv),y.push(E.sheenRoughnessMapUv),y.push(E.specularMapUv),y.push(E.specularColorMapUv),y.push(E.specularIntensityMapUv),y.push(E.transmissionMapUv),y.push(E.thicknessMapUv),y.push(E.combine),y.push(E.fogExp2),y.push(E.sizeAttenuation),y.push(E.morphTargetsCount),y.push(E.morphAttributeCount),y.push(E.numDirLights),y.push(E.numPointLights),y.push(E.numSpotLights),y.push(E.numSpotLightMaps),y.push(E.numHemiLights),y.push(E.numRectAreaLights),y.push(E.numDirLightShadows),y.push(E.numPointLightShadows),y.push(E.numSpotLightShadows),y.push(E.numSpotLightShadowsWithMaps),y.push(E.numLightProbes),y.push(E.shadowMapType),y.push(E.toneMapping),y.push(E.numClippingPlanes),y.push(E.numClipIntersection),y.push(E.depthPacking)}function _(y,E){o.disableAll(),E.instancing&&o.enable(0),E.instancingColor&&o.enable(1),E.instancingMorph&&o.enable(2),E.matcap&&o.enable(3),E.envMap&&o.enable(4),E.normalMapObjectSpace&&o.enable(5),E.normalMapTangentSpace&&o.enable(6),E.clearcoat&&o.enable(7),E.iridescence&&o.enable(8),E.alphaTest&&o.enable(9),E.vertexColors&&o.enable(10),E.vertexAlphas&&o.enable(11),E.vertexUv1s&&o.enable(12),E.vertexUv2s&&o.enable(13),E.vertexUv3s&&o.enable(14),E.vertexTangents&&o.enable(15),E.anisotropy&&o.enable(16),E.alphaHash&&o.enable(17),E.batching&&o.enable(18),E.dispersion&&o.enable(19),E.batchingColor&&o.enable(20),E.gradientMap&&o.enable(21),y.push(o.mask),o.disableAll(),E.fog&&o.enable(0),E.useFog&&o.enable(1),E.flatShading&&o.enable(2),E.logarithmicDepthBuffer&&o.enable(3),E.reversedDepthBuffer&&o.enable(4),E.skinning&&o.enable(5),E.morphTargets&&o.enable(6),E.morphNormals&&o.enable(7),E.morphColors&&o.enable(8),E.premultipliedAlpha&&o.enable(9),E.shadowMapEnabled&&o.enable(10),E.doubleSided&&o.enable(11),E.flipSided&&o.enable(12),E.useDepthPacking&&o.enable(13),E.dithering&&o.enable(14),E.transmission&&o.enable(15),E.sheen&&o.enable(16),E.opaque&&o.enable(17),E.pointsUvs&&o.enable(18),E.decodeVideoTexture&&o.enable(19),E.decodeVideoTextureEmissive&&o.enable(20),E.alphaToCoverage&&o.enable(21),y.push(o.mask)}function x(y){const E=h[y.type];let D;if(E){const C=vi[E];D=iu.clone(C.uniforms)}else D=y.uniforms;return D}function S(y,E){let D=d.get(E);return D!==void 0?++D.usedTimes:(D=new uC(n,E,y,r),u.push(D),d.set(E,D)),D}function A(y){if(--y.usedTimes===0){const E=u.indexOf(y);u[E]=u[u.length-1],u.pop(),d.delete(y.cacheKey),y.destroy()}}function M(y){c.remove(y)}function T(){c.dispose()}return{getParameters:v,getProgramCacheKey:g,getUniforms:x,acquireProgram:S,releaseProgram:A,releaseShaderCache:M,programs:u,dispose:T}}function mC(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let c=n.get(o);return c===void 0&&(c={},n.set(o,c)),c}function i(o){n.delete(o)}function r(o,c,l){n.get(o)[c]=l}function s(){n=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:s}}function gC(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function D_(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function I_(){const n=[];let e=0;const t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function o(f){let h=0;return f.isInstancedMesh&&(h+=2),f.isSkinnedMesh&&(h+=1),h}function c(f,h,m,v,g,p){let _=n[e];return _===void 0?(_={id:f.id,object:f,geometry:h,material:m,materialVariant:o(f),groupOrder:v,renderOrder:f.renderOrder,z:g,group:p},n[e]=_):(_.id=f.id,_.object=f,_.geometry=h,_.material=m,_.materialVariant=o(f),_.groupOrder=v,_.renderOrder=f.renderOrder,_.z=g,_.group=p),e++,_}function l(f,h,m,v,g,p){const _=c(f,h,m,v,g,p);m.transmission>0?i.push(_):m.transparent===!0?r.push(_):t.push(_)}function u(f,h,m,v,g,p){const _=c(f,h,m,v,g,p);m.transmission>0?i.unshift(_):m.transparent===!0?r.unshift(_):t.unshift(_)}function d(f,h){t.length>1&&t.sort(f||gC),i.length>1&&i.sort(h||D_),r.length>1&&r.sort(h||D_)}function a(){for(let f=e,h=n.length;f<h;f++){const m=n[f];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:l,unshift:u,finish:a,sort:d}}function _C(){let n=new WeakMap;function e(i,r){const s=n.get(i);let o;return s===void 0?(o=new I_,n.set(i,[o])):r>=s.length?(o=new I_,s.push(o)):o=s[r],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function vC(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new P,color:new ne};break;case"SpotLight":t={position:new P,direction:new P,color:new ne,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new ne,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new ne,groundColor:new ne};break;case"RectAreaLight":t={color:new ne,position:new P,halfWidth:new P,halfHeight:new P};break}return n[e.id]=t,t}}}function xC(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xe,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let yC=0;function SC(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function MC(n){const e=new vC,t=xC(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let u=0;u<9;u++)i.probe.push(new P);const r=new P,s=new dt,o=new dt;function c(u){let d=0,a=0,f=0;for(let E=0;E<9;E++)i.probe[E].set(0,0,0);let h=0,m=0,v=0,g=0,p=0,_=0,x=0,S=0,A=0,M=0,T=0;u.sort(SC);for(let E=0,D=u.length;E<D;E++){const C=u[E],F=C.color,L=C.intensity,U=C.distance;let z=null;if(C.shadow&&C.shadow.map&&(C.shadow.map.texture.format===So?z=C.shadow.map.texture:z=C.shadow.map.depthTexture||C.shadow.map.texture),C.isAmbientLight)d+=F.r*L,a+=F.g*L,f+=F.b*L;else if(C.isLightProbe){for(let V=0;V<9;V++)i.probe[V].addScaledVector(C.sh.coefficients[V],L);T++}else if(C.isDirectionalLight){const V=e.get(C);if(V.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const H=C.shadow,k=t.get(C);k.shadowIntensity=H.intensity,k.shadowBias=H.bias,k.shadowNormalBias=H.normalBias,k.shadowRadius=H.radius,k.shadowMapSize=H.mapSize,i.directionalShadow[h]=k,i.directionalShadowMap[h]=z,i.directionalShadowMatrix[h]=C.shadow.matrix,_++}i.directional[h]=V,h++}else if(C.isSpotLight){const V=e.get(C);V.position.setFromMatrixPosition(C.matrixWorld),V.color.copy(F).multiplyScalar(L),V.distance=U,V.coneCos=Math.cos(C.angle),V.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),V.decay=C.decay,i.spot[v]=V;const H=C.shadow;if(C.map&&(i.spotLightMap[A]=C.map,A++,H.updateMatrices(C),C.castShadow&&M++),i.spotLightMatrix[v]=H.matrix,C.castShadow){const k=t.get(C);k.shadowIntensity=H.intensity,k.shadowBias=H.bias,k.shadowNormalBias=H.normalBias,k.shadowRadius=H.radius,k.shadowMapSize=H.mapSize,i.spotShadow[v]=k,i.spotShadowMap[v]=z,S++}v++}else if(C.isRectAreaLight){const V=e.get(C);V.color.copy(F).multiplyScalar(L),V.halfWidth.set(C.width*.5,0,0),V.halfHeight.set(0,C.height*.5,0),i.rectArea[g]=V,g++}else if(C.isPointLight){const V=e.get(C);if(V.color.copy(C.color).multiplyScalar(C.intensity),V.distance=C.distance,V.decay=C.decay,C.castShadow){const H=C.shadow,k=t.get(C);k.shadowIntensity=H.intensity,k.shadowBias=H.bias,k.shadowNormalBias=H.normalBias,k.shadowRadius=H.radius,k.shadowMapSize=H.mapSize,k.shadowCameraNear=H.camera.near,k.shadowCameraFar=H.camera.far,i.pointShadow[m]=k,i.pointShadowMap[m]=z,i.pointShadowMatrix[m]=C.shadow.matrix,x++}i.point[m]=V,m++}else if(C.isHemisphereLight){const V=e.get(C);V.skyColor.copy(C.color).multiplyScalar(L),V.groundColor.copy(C.groundColor).multiplyScalar(L),i.hemi[p]=V,p++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=he.LTC_FLOAT_1,i.rectAreaLTC2=he.LTC_FLOAT_2):(i.rectAreaLTC1=he.LTC_HALF_1,i.rectAreaLTC2=he.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=a,i.ambient[2]=f;const y=i.hash;(y.directionalLength!==h||y.pointLength!==m||y.spotLength!==v||y.rectAreaLength!==g||y.hemiLength!==p||y.numDirectionalShadows!==_||y.numPointShadows!==x||y.numSpotShadows!==S||y.numSpotMaps!==A||y.numLightProbes!==T)&&(i.directional.length=h,i.spot.length=v,i.rectArea.length=g,i.point.length=m,i.hemi.length=p,i.directionalShadow.length=_,i.directionalShadowMap.length=_,i.pointShadow.length=x,i.pointShadowMap.length=x,i.spotShadow.length=S,i.spotShadowMap.length=S,i.directionalShadowMatrix.length=_,i.pointShadowMatrix.length=x,i.spotLightMatrix.length=S+A-M,i.spotLightMap.length=A,i.numSpotLightShadowsWithMaps=M,i.numLightProbes=T,y.directionalLength=h,y.pointLength=m,y.spotLength=v,y.rectAreaLength=g,y.hemiLength=p,y.numDirectionalShadows=_,y.numPointShadows=x,y.numSpotShadows=S,y.numSpotMaps=A,y.numLightProbes=T,i.version=yC++)}function l(u,d){let a=0,f=0,h=0,m=0,v=0;const g=d.matrixWorldInverse;for(let p=0,_=u.length;p<_;p++){const x=u[p];if(x.isDirectionalLight){const S=i.directional[a];S.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(g),a++}else if(x.isSpotLight){const S=i.spot[h];S.position.setFromMatrixPosition(x.matrixWorld),S.position.applyMatrix4(g),S.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(g),h++}else if(x.isRectAreaLight){const S=i.rectArea[m];S.position.setFromMatrixPosition(x.matrixWorld),S.position.applyMatrix4(g),o.identity(),s.copy(x.matrixWorld),s.premultiply(g),o.extractRotation(s),S.halfWidth.set(x.width*.5,0,0),S.halfHeight.set(0,x.height*.5,0),S.halfWidth.applyMatrix4(o),S.halfHeight.applyMatrix4(o),m++}else if(x.isPointLight){const S=i.point[f];S.position.setFromMatrixPosition(x.matrixWorld),S.position.applyMatrix4(g),f++}else if(x.isHemisphereLight){const S=i.hemi[v];S.direction.setFromMatrixPosition(x.matrixWorld),S.direction.transformDirection(g),v++}}}return{setup:c,setupView:l,state:i}}function N_(n){const e=new MC(n),t=[],i=[];function r(d){u.camera=d,t.length=0,i.length=0}function s(d){t.push(d)}function o(d){i.push(d)}function c(){e.setup(t)}function l(d){e.setupView(t,d)}const u={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:u,setupLights:c,setupLightsView:l,pushLight:s,pushShadow:o}}function wC(n){let e=new WeakMap;function t(r,s=0){const o=e.get(r);let c;return o===void 0?(c=new N_(n),e.set(r,[c])):s>=o.length?(c=new N_(n),o.push(c)):c=o[s],c}function i(){e=new WeakMap}return{get:t,dispose:i}}const EC=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,TC=`uniform sampler2D shadow_pass;
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
}`,AC=[new P(1,0,0),new P(-1,0,0),new P(0,1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1)],bC=[new P(0,-1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1),new P(0,-1,0),new P(0,-1,0)],U_=new dt,Zo=new P,Hf=new P;function CC(n,e,t){let i=new Jp;const r=new xe,s=new xe,o=new Dt,c=new kw,l=new Bw,u={},d=t.maxTextureSize,a={[br]:En,[En]:br,[ri]:ri},f=new Tt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new xe},radius:{value:4}},vertexShader:EC,fragmentShader:TC}),h=f.clone();h.defines.HORIZONTAL_PASS=1;const m=new He;m.setAttribute("position",new Be(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new mn(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=gc;let p=this.type;this.render=function(M,T,y){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||M.length===0)return;this.type===l1&&(Fe("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=gc);const E=n.getRenderTarget(),D=n.getActiveCubeFace(),C=n.getActiveMipmapLevel(),F=n.state;F.setBlending(wi),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const L=p!==this.type;L&&T.traverse(function(U){U.material&&(Array.isArray(U.material)?U.material.forEach(z=>z.needsUpdate=!0):U.material.needsUpdate=!0)});for(let U=0,z=M.length;U<z;U++){const V=M[U],H=V.shadow;if(H===void 0){Fe("WebGLShadowMap:",V,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;r.copy(H.mapSize);const k=H.getFrameExtents();r.multiply(k),s.copy(H.mapSize),(r.x>d||r.y>d)&&(r.x>d&&(s.x=Math.floor(d/k.x),r.x=s.x*k.x,H.mapSize.x=s.x),r.y>d&&(s.y=Math.floor(d/k.y),r.y=s.y*k.y,H.mapSize.y=s.y));const X=n.state.buffers.depth.getReversed();if(H.camera._reversedDepth=X,H.map===null||L===!0){if(H.map!==null&&(H.map.depthTexture!==null&&(H.map.depthTexture.dispose(),H.map.depthTexture=null),H.map.dispose()),this.type===na){if(V.isPointLight){Fe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}H.map=new Tn(r.x,r.y,{format:So,type:Fn,minFilter:an,magFilter:an,generateMipmaps:!1}),H.map.texture.name=V.name+".shadowMap",H.map.depthTexture=new Oa(r.x,r.y,oi),H.map.depthTexture.name=V.name+".shadowMapDepth",H.map.depthTexture.format=qi,H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Zt,H.map.depthTexture.magFilter=Zt}else V.isPointLight?(H.map=new ty(r.x),H.map.depthTexture=new Pw(r.x,Ai)):(H.map=new Tn(r.x,r.y),H.map.depthTexture=new Oa(r.x,r.y,Ai)),H.map.depthTexture.name=V.name+".shadowMap",H.map.depthTexture.format=qi,this.type===gc?(H.map.depthTexture.compareFunction=X?qp:Yp,H.map.depthTexture.minFilter=an,H.map.depthTexture.magFilter=an):(H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Zt,H.map.depthTexture.magFilter=Zt);H.camera.updateProjectionMatrix()}const Q=H.map.isWebGLCubeRenderTarget?6:1;for(let J=0;J<Q;J++){if(H.map.isWebGLCubeRenderTarget)n.setRenderTarget(H.map,J),n.clear();else{J===0&&(n.setRenderTarget(H.map),n.clear());const te=H.getViewport(J);o.set(s.x*te.x,s.y*te.y,s.x*te.z,s.y*te.w),F.viewport(o)}if(V.isPointLight){const te=H.camera,Oe=H.matrix,qe=V.distance||te.far;qe!==te.far&&(te.far=qe,te.updateProjectionMatrix()),Zo.setFromMatrixPosition(V.matrixWorld),te.position.copy(Zo),Hf.copy(te.position),Hf.add(AC[J]),te.up.copy(bC[J]),te.lookAt(Hf),te.updateMatrixWorld(),Oe.makeTranslation(-Zo.x,-Zo.y,-Zo.z),U_.multiplyMatrices(te.projectionMatrix,te.matrixWorldInverse),H._frustum.setFromProjectionMatrix(U_,te.coordinateSystem,te.reversedDepth)}else H.updateMatrices(V);i=H.getFrustum(),S(T,y,H.camera,V,this.type)}H.isPointLightShadow!==!0&&this.type===na&&_(H,y),H.needsUpdate=!1}p=this.type,g.needsUpdate=!1,n.setRenderTarget(E,D,C)};function _(M,T){const y=e.update(v);f.defines.VSM_SAMPLES!==M.blurSamples&&(f.defines.VSM_SAMPLES=M.blurSamples,h.defines.VSM_SAMPLES=M.blurSamples,f.needsUpdate=!0,h.needsUpdate=!0),M.mapPass===null&&(M.mapPass=new Tn(r.x,r.y,{format:So,type:Fn})),f.uniforms.shadow_pass.value=M.map.depthTexture,f.uniforms.resolution.value=M.mapSize,f.uniforms.radius.value=M.radius,n.setRenderTarget(M.mapPass),n.clear(),n.renderBufferDirect(T,null,y,f,v,null),h.uniforms.shadow_pass.value=M.mapPass.texture,h.uniforms.resolution.value=M.mapSize,h.uniforms.radius.value=M.radius,n.setRenderTarget(M.map),n.clear(),n.renderBufferDirect(T,null,y,h,v,null)}function x(M,T,y,E){let D=null;const C=y.isPointLight===!0?M.customDistanceMaterial:M.customDepthMaterial;if(C!==void 0)D=C;else if(D=y.isPointLight===!0?l:c,n.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0||T.alphaToCoverage===!0){const F=D.uuid,L=T.uuid;let U=u[F];U===void 0&&(U={},u[F]=U);let z=U[L];z===void 0&&(z=D.clone(),U[L]=z,T.addEventListener("dispose",A)),D=z}if(D.visible=T.visible,D.wireframe=T.wireframe,E===na?D.side=T.shadowSide!==null?T.shadowSide:T.side:D.side=T.shadowSide!==null?T.shadowSide:a[T.side],D.alphaMap=T.alphaMap,D.alphaTest=T.alphaToCoverage===!0?.5:T.alphaTest,D.map=T.map,D.clipShadows=T.clipShadows,D.clippingPlanes=T.clippingPlanes,D.clipIntersection=T.clipIntersection,D.displacementMap=T.displacementMap,D.displacementScale=T.displacementScale,D.displacementBias=T.displacementBias,D.wireframeLinewidth=T.wireframeLinewidth,D.linewidth=T.linewidth,y.isPointLight===!0&&D.isMeshDistanceMaterial===!0){const F=n.properties.get(D);F.light=y}return D}function S(M,T,y,E,D){if(M.visible===!1)return;if(M.layers.test(T.layers)&&(M.isMesh||M.isLine||M.isPoints)&&(M.castShadow||M.receiveShadow&&D===na)&&(!M.frustumCulled||i.intersectsObject(M))){M.modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,M.matrixWorld);const L=e.update(M),U=M.material;if(Array.isArray(U)){const z=L.groups;for(let V=0,H=z.length;V<H;V++){const k=z[V],X=U[k.materialIndex];if(X&&X.visible){const Q=x(M,X,E,D);M.onBeforeShadow(n,M,T,y,L,Q,k),n.renderBufferDirect(y,null,L,Q,M,k),M.onAfterShadow(n,M,T,y,L,Q,k)}}}else if(U.visible){const z=x(M,U,E,D);M.onBeforeShadow(n,M,T,y,L,z,null),n.renderBufferDirect(y,null,L,z,M,null),M.onAfterShadow(n,M,T,y,L,z,null)}}const F=M.children;for(let L=0,U=F.length;L<U;L++)S(F[L],T,y,E,D)}function A(M){M.target.removeEventListener("dispose",A);for(const y in u){const E=u[y],D=M.target.uuid;D in E&&(E[D].dispose(),delete E[D])}}}function RC(n,e){function t(){let N=!1;const de=new Dt;let ue=null;const ye=new Dt(0,0,0,0);return{setMask:function(ae){ue!==ae&&!N&&(n.colorMask(ae,ae,ae,ae),ue=ae)},setLocked:function(ae){N=ae},setClear:function(ae,$,Te,ze,xt){xt===!0&&(ae*=ze,$*=ze,Te*=ze),de.set(ae,$,Te,ze),ye.equals(de)===!1&&(n.clearColor(ae,$,Te,ze),ye.copy(de))},reset:function(){N=!1,ue=null,ye.set(-1,0,0,0)}}}function i(){let N=!1,de=!1,ue=null,ye=null,ae=null;return{setReversed:function($){if(de!==$){const Te=e.get("EXT_clip_control");$?Te.clipControlEXT(Te.LOWER_LEFT_EXT,Te.ZERO_TO_ONE_EXT):Te.clipControlEXT(Te.LOWER_LEFT_EXT,Te.NEGATIVE_ONE_TO_ONE_EXT),de=$;const ze=ae;ae=null,this.setClear(ze)}},getReversed:function(){return de},setTest:function($){$?se(n.DEPTH_TEST):le(n.DEPTH_TEST)},setMask:function($){ue!==$&&!N&&(n.depthMask($),ue=$)},setFunc:function($){if(de&&($=V1[$]),ye!==$){switch($){case qd:n.depthFunc(n.NEVER);break;case Kd:n.depthFunc(n.ALWAYS);break;case Zd:n.depthFunc(n.LESS);break;case xo:n.depthFunc(n.LEQUAL);break;case Qd:n.depthFunc(n.EQUAL);break;case Jd:n.depthFunc(n.GEQUAL);break;case eh:n.depthFunc(n.GREATER);break;case th:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ye=$}},setLocked:function($){N=$},setClear:function($){ae!==$&&(ae=$,de&&($=1-$),n.clearDepth($))},reset:function(){N=!1,ue=null,ye=null,ae=null,de=!1}}}function r(){let N=!1,de=null,ue=null,ye=null,ae=null,$=null,Te=null,ze=null,xt=null;return{setTest:function(at){N||(at?se(n.STENCIL_TEST):le(n.STENCIL_TEST))},setMask:function(at){de!==at&&!N&&(n.stencilMask(at),de=at)},setFunc:function(at,Ri,Pi){(ue!==at||ye!==Ri||ae!==Pi)&&(n.stencilFunc(at,Ri,Pi),ue=at,ye=Ri,ae=Pi)},setOp:function(at,Ri,Pi){($!==at||Te!==Ri||ze!==Pi)&&(n.stencilOp(at,Ri,Pi),$=at,Te=Ri,ze=Pi)},setLocked:function(at){N=at},setClear:function(at){xt!==at&&(n.clearStencil(at),xt=at)},reset:function(){N=!1,de=null,ue=null,ye=null,ae=null,$=null,Te=null,ze=null,xt=null}}}const s=new t,o=new i,c=new r,l=new WeakMap,u=new WeakMap;let d={},a={},f=new WeakMap,h=[],m=null,v=!1,g=null,p=null,_=null,x=null,S=null,A=null,M=null,T=new ne(0,0,0),y=0,E=!1,D=null,C=null,F=null,L=null,U=null;const z=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let V=!1,H=0;const k=n.getParameter(n.VERSION);k.indexOf("WebGL")!==-1?(H=parseFloat(/^WebGL (\d)/.exec(k)[1]),V=H>=1):k.indexOf("OpenGL ES")!==-1&&(H=parseFloat(/^OpenGL ES (\d)/.exec(k)[1]),V=H>=2);let X=null,Q={};const J=n.getParameter(n.SCISSOR_BOX),te=n.getParameter(n.VIEWPORT),Oe=new Dt().fromArray(J),qe=new Dt().fromArray(te);function rt(N,de,ue,ye){const ae=new Uint8Array(4),$=n.createTexture();n.bindTexture(N,$),n.texParameteri(N,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(N,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Te=0;Te<ue;Te++)N===n.TEXTURE_3D||N===n.TEXTURE_2D_ARRAY?n.texImage3D(de,0,n.RGBA,1,1,ye,0,n.RGBA,n.UNSIGNED_BYTE,ae):n.texImage2D(de+Te,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ae);return $}const Y={};Y[n.TEXTURE_2D]=rt(n.TEXTURE_2D,n.TEXTURE_2D,1),Y[n.TEXTURE_CUBE_MAP]=rt(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[n.TEXTURE_2D_ARRAY]=rt(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Y[n.TEXTURE_3D]=rt(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),c.setClear(0),se(n.DEPTH_TEST),o.setFunc(xo),Le(!1),Qe(Cg),se(n.CULL_FACE),Ze(wi);function se(N){d[N]!==!0&&(n.enable(N),d[N]=!0)}function le(N){d[N]!==!1&&(n.disable(N),d[N]=!1)}function Me(N,de){return a[N]!==de?(n.bindFramebuffer(N,de),a[N]=de,N===n.DRAW_FRAMEBUFFER&&(a[n.FRAMEBUFFER]=de),N===n.FRAMEBUFFER&&(a[n.DRAW_FRAMEBUFFER]=de),!0):!1}function oe(N,de){let ue=h,ye=!1;if(N){ue=f.get(de),ue===void 0&&(ue=[],f.set(de,ue));const ae=N.textures;if(ue.length!==ae.length||ue[0]!==n.COLOR_ATTACHMENT0){for(let $=0,Te=ae.length;$<Te;$++)ue[$]=n.COLOR_ATTACHMENT0+$;ue.length=ae.length,ye=!0}}else ue[0]!==n.BACK&&(ue[0]=n.BACK,ye=!0);ye&&n.drawBuffers(ue)}function Ne(N){return m!==N?(n.useProgram(N),m=N,!0):!1}const ht={[$r]:n.FUNC_ADD,[u1]:n.FUNC_SUBTRACT,[f1]:n.FUNC_REVERSE_SUBTRACT};ht[d1]=n.MIN,ht[h1]=n.MAX;const Ve={[p1]:n.ZERO,[m1]:n.ONE,[g1]:n.SRC_COLOR,[$d]:n.SRC_ALPHA,[M1]:n.SRC_ALPHA_SATURATE,[y1]:n.DST_COLOR,[v1]:n.DST_ALPHA,[_1]:n.ONE_MINUS_SRC_COLOR,[Yd]:n.ONE_MINUS_SRC_ALPHA,[S1]:n.ONE_MINUS_DST_COLOR,[x1]:n.ONE_MINUS_DST_ALPHA,[w1]:n.CONSTANT_COLOR,[E1]:n.ONE_MINUS_CONSTANT_COLOR,[T1]:n.CONSTANT_ALPHA,[A1]:n.ONE_MINUS_CONSTANT_ALPHA};function Ze(N,de,ue,ye,ae,$,Te,ze,xt,at){if(N===wi){v===!0&&(le(n.BLEND),v=!1);return}if(v===!1&&(se(n.BLEND),v=!0),N!==c1){if(N!==g||at!==E){if((p!==$r||S!==$r)&&(n.blendEquation(n.FUNC_ADD),p=$r,S=$r),at)switch(N){case lo:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case it:n.blendFunc(n.ONE,n.ONE);break;case Rg:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Pg:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:Je("WebGLState: Invalid blending: ",N);break}else switch(N){case lo:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case it:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Rg:Je("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Pg:Je("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Je("WebGLState: Invalid blending: ",N);break}_=null,x=null,A=null,M=null,T.set(0,0,0),y=0,g=N,E=at}return}ae=ae||de,$=$||ue,Te=Te||ye,(de!==p||ae!==S)&&(n.blendEquationSeparate(ht[de],ht[ae]),p=de,S=ae),(ue!==_||ye!==x||$!==A||Te!==M)&&(n.blendFuncSeparate(Ve[ue],Ve[ye],Ve[$],Ve[Te]),_=ue,x=ye,A=$,M=Te),(ze.equals(T)===!1||xt!==y)&&(n.blendColor(ze.r,ze.g,ze.b,xt),T.copy(ze),y=xt),g=N,E=!1}function st(N,de){N.side===ri?le(n.CULL_FACE):se(n.CULL_FACE);let ue=N.side===En;de&&(ue=!ue),Le(ue),N.blending===lo&&N.transparent===!1?Ze(wi):Ze(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),o.setFunc(N.depthFunc),o.setTest(N.depthTest),o.setMask(N.depthWrite),s.setMask(N.colorWrite);const ye=N.stencilWrite;c.setTest(ye),ye&&(c.setMask(N.stencilWriteMask),c.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),c.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),Mt(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?se(n.SAMPLE_ALPHA_TO_COVERAGE):le(n.SAMPLE_ALPHA_TO_COVERAGE)}function Le(N){D!==N&&(N?n.frontFace(n.CW):n.frontFace(n.CCW),D=N)}function Qe(N){N!==o1?(se(n.CULL_FACE),N!==C&&(N===Cg?n.cullFace(n.BACK):N===a1?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):le(n.CULL_FACE),C=N}function I(N){N!==F&&(V&&n.lineWidth(N),F=N)}function Mt(N,de,ue){N?(se(n.POLYGON_OFFSET_FILL),(L!==de||U!==ue)&&(L=de,U=ue,o.getReversed()&&(de=-de),n.polygonOffset(de,ue))):le(n.POLYGON_OFFSET_FILL)}function ot(N){N?se(n.SCISSOR_TEST):le(n.SCISSOR_TEST)}function vt(N){N===void 0&&(N=n.TEXTURE0+z-1),X!==N&&(n.activeTexture(N),X=N)}function Ce(N,de,ue){ue===void 0&&(X===null?ue=n.TEXTURE0+z-1:ue=X);let ye=Q[ue];ye===void 0&&(ye={type:void 0,texture:void 0},Q[ue]=ye),(ye.type!==N||ye.texture!==de)&&(X!==ue&&(n.activeTexture(ue),X=ue),n.bindTexture(N,de||Y[N]),ye.type=N,ye.texture=de)}function R(){const N=Q[X];N!==void 0&&N.type!==void 0&&(n.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function w(){try{n.compressedTexImage2D(...arguments)}catch(N){Je("WebGLState:",N)}}function O(){try{n.compressedTexImage3D(...arguments)}catch(N){Je("WebGLState:",N)}}function Z(){try{n.texSubImage2D(...arguments)}catch(N){Je("WebGLState:",N)}}function ee(){try{n.texSubImage3D(...arguments)}catch(N){Je("WebGLState:",N)}}function K(){try{n.compressedTexSubImage2D(...arguments)}catch(N){Je("WebGLState:",N)}}function we(){try{n.compressedTexSubImage3D(...arguments)}catch(N){Je("WebGLState:",N)}}function fe(){try{n.texStorage2D(...arguments)}catch(N){Je("WebGLState:",N)}}function Ie(){try{n.texStorage3D(...arguments)}catch(N){Je("WebGLState:",N)}}function ke(){try{n.texImage2D(...arguments)}catch(N){Je("WebGLState:",N)}}function re(){try{n.texImage3D(...arguments)}catch(N){Je("WebGLState:",N)}}function ce(N){Oe.equals(N)===!1&&(n.scissor(N.x,N.y,N.z,N.w),Oe.copy(N))}function Ee(N){qe.equals(N)===!1&&(n.viewport(N.x,N.y,N.z,N.w),qe.copy(N))}function Ae(N,de){let ue=u.get(de);ue===void 0&&(ue=new WeakMap,u.set(de,ue));let ye=ue.get(N);ye===void 0&&(ye=n.getUniformBlockIndex(de,N.name),ue.set(N,ye))}function ge(N,de){const ye=u.get(de).get(N);l.get(de)!==ye&&(n.uniformBlockBinding(de,ye,N.__bindingPointIndex),l.set(de,ye))}function $e(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),d={},X=null,Q={},a={},f=new WeakMap,h=[],m=null,v=!1,g=null,p=null,_=null,x=null,S=null,A=null,M=null,T=new ne(0,0,0),y=0,E=!1,D=null,C=null,F=null,L=null,U=null,Oe.set(0,0,n.canvas.width,n.canvas.height),qe.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),c.reset()}return{buffers:{color:s,depth:o,stencil:c},enable:se,disable:le,bindFramebuffer:Me,drawBuffers:oe,useProgram:Ne,setBlending:Ze,setMaterial:st,setFlipSided:Le,setCullFace:Qe,setLineWidth:I,setPolygonOffset:Mt,setScissorTest:ot,activeTexture:vt,bindTexture:Ce,unbindTexture:R,compressedTexImage2D:w,compressedTexImage3D:O,texImage2D:ke,texImage3D:re,updateUBOMapping:Ae,uniformBlockBinding:ge,texStorage2D:fe,texStorage3D:Ie,texSubImage2D:Z,texSubImage3D:ee,compressedTexSubImage2D:K,compressedTexSubImage3D:we,scissor:ce,viewport:Ee,reset:$e}}function PC(n,e,t,i,r,s,o){const c=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),u=new xe,d=new WeakMap;let a;const f=new WeakMap;let h=!1;try{h=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(R,w){return h?new OffscreenCanvas(R,w):Zc("canvas")}function v(R,w,O){let Z=1;const ee=Ce(R);if((ee.width>O||ee.height>O)&&(Z=O/Math.max(ee.width,ee.height)),Z<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const K=Math.floor(Z*ee.width),we=Math.floor(Z*ee.height);a===void 0&&(a=m(K,we));const fe=w?m(K,we):a;return fe.width=K,fe.height=we,fe.getContext("2d").drawImage(R,0,0,K,we),Fe("WebGLRenderer: Texture has been resized from ("+ee.width+"x"+ee.height+") to ("+K+"x"+we+")."),fe}else return"data"in R&&Fe("WebGLRenderer: Image in DataTexture is too big ("+ee.width+"x"+ee.height+")."),R;return R}function g(R){return R.generateMipmaps}function p(R){n.generateMipmap(R)}function _(R){return R.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?n.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function x(R,w,O,Z,ee=!1){if(R!==null){if(n[R]!==void 0)return n[R];Fe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let K=w;if(w===n.RED&&(O===n.FLOAT&&(K=n.R32F),O===n.HALF_FLOAT&&(K=n.R16F),O===n.UNSIGNED_BYTE&&(K=n.R8)),w===n.RED_INTEGER&&(O===n.UNSIGNED_BYTE&&(K=n.R8UI),O===n.UNSIGNED_SHORT&&(K=n.R16UI),O===n.UNSIGNED_INT&&(K=n.R32UI),O===n.BYTE&&(K=n.R8I),O===n.SHORT&&(K=n.R16I),O===n.INT&&(K=n.R32I)),w===n.RG&&(O===n.FLOAT&&(K=n.RG32F),O===n.HALF_FLOAT&&(K=n.RG16F),O===n.UNSIGNED_BYTE&&(K=n.RG8)),w===n.RG_INTEGER&&(O===n.UNSIGNED_BYTE&&(K=n.RG8UI),O===n.UNSIGNED_SHORT&&(K=n.RG16UI),O===n.UNSIGNED_INT&&(K=n.RG32UI),O===n.BYTE&&(K=n.RG8I),O===n.SHORT&&(K=n.RG16I),O===n.INT&&(K=n.RG32I)),w===n.RGB_INTEGER&&(O===n.UNSIGNED_BYTE&&(K=n.RGB8UI),O===n.UNSIGNED_SHORT&&(K=n.RGB16UI),O===n.UNSIGNED_INT&&(K=n.RGB32UI),O===n.BYTE&&(K=n.RGB8I),O===n.SHORT&&(K=n.RGB16I),O===n.INT&&(K=n.RGB32I)),w===n.RGBA_INTEGER&&(O===n.UNSIGNED_BYTE&&(K=n.RGBA8UI),O===n.UNSIGNED_SHORT&&(K=n.RGBA16UI),O===n.UNSIGNED_INT&&(K=n.RGBA32UI),O===n.BYTE&&(K=n.RGBA8I),O===n.SHORT&&(K=n.RGBA16I),O===n.INT&&(K=n.RGBA32I)),w===n.RGB&&(O===n.UNSIGNED_INT_5_9_9_9_REV&&(K=n.RGB9_E5),O===n.UNSIGNED_INT_10F_11F_11F_REV&&(K=n.R11F_G11F_B10F)),w===n.RGBA){const we=ee?Kc:et.getTransfer(Z);O===n.FLOAT&&(K=n.RGBA32F),O===n.HALF_FLOAT&&(K=n.RGBA16F),O===n.UNSIGNED_BYTE&&(K=we===lt?n.SRGB8_ALPHA8:n.RGBA8),O===n.UNSIGNED_SHORT_4_4_4_4&&(K=n.RGBA4),O===n.UNSIGNED_SHORT_5_5_5_1&&(K=n.RGB5_A1)}return(K===n.R16F||K===n.R32F||K===n.RG16F||K===n.RG32F||K===n.RGBA16F||K===n.RGBA32F)&&e.get("EXT_color_buffer_float"),K}function S(R,w){let O;return R?w===null||w===Ai||w===Na?O=n.DEPTH24_STENCIL8:w===oi?O=n.DEPTH32F_STENCIL8:w===Ia&&(O=n.DEPTH24_STENCIL8,Fe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===Ai||w===Na?O=n.DEPTH_COMPONENT24:w===oi?O=n.DEPTH_COMPONENT32F:w===Ia&&(O=n.DEPTH_COMPONENT16),O}function A(R,w){return g(R)===!0||R.isFramebufferTexture&&R.minFilter!==Zt&&R.minFilter!==an?Math.log2(Math.max(w.width,w.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?w.mipmaps.length:1}function M(R){const w=R.target;w.removeEventListener("dispose",M),y(w),w.isVideoTexture&&d.delete(w)}function T(R){const w=R.target;w.removeEventListener("dispose",T),D(w)}function y(R){const w=i.get(R);if(w.__webglInit===void 0)return;const O=R.source,Z=f.get(O);if(Z){const ee=Z[w.__cacheKey];ee.usedTimes--,ee.usedTimes===0&&E(R),Object.keys(Z).length===0&&f.delete(O)}i.remove(R)}function E(R){const w=i.get(R);n.deleteTexture(w.__webglTexture);const O=R.source,Z=f.get(O);delete Z[w.__cacheKey],o.memory.textures--}function D(R){const w=i.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),i.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(w.__webglFramebuffer[Z]))for(let ee=0;ee<w.__webglFramebuffer[Z].length;ee++)n.deleteFramebuffer(w.__webglFramebuffer[Z][ee]);else n.deleteFramebuffer(w.__webglFramebuffer[Z]);w.__webglDepthbuffer&&n.deleteRenderbuffer(w.__webglDepthbuffer[Z])}else{if(Array.isArray(w.__webglFramebuffer))for(let Z=0;Z<w.__webglFramebuffer.length;Z++)n.deleteFramebuffer(w.__webglFramebuffer[Z]);else n.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&n.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&n.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let Z=0;Z<w.__webglColorRenderbuffer.length;Z++)w.__webglColorRenderbuffer[Z]&&n.deleteRenderbuffer(w.__webglColorRenderbuffer[Z]);w.__webglDepthRenderbuffer&&n.deleteRenderbuffer(w.__webglDepthRenderbuffer)}const O=R.textures;for(let Z=0,ee=O.length;Z<ee;Z++){const K=i.get(O[Z]);K.__webglTexture&&(n.deleteTexture(K.__webglTexture),o.memory.textures--),i.remove(O[Z])}i.remove(R)}let C=0;function F(){C=0}function L(){const R=C;return R>=r.maxTextures&&Fe("WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+r.maxTextures),C+=1,R}function U(R){const w=[];return w.push(R.wrapS),w.push(R.wrapT),w.push(R.wrapR||0),w.push(R.magFilter),w.push(R.minFilter),w.push(R.anisotropy),w.push(R.internalFormat),w.push(R.format),w.push(R.type),w.push(R.generateMipmaps),w.push(R.premultiplyAlpha),w.push(R.flipY),w.push(R.unpackAlignment),w.push(R.colorSpace),w.join()}function z(R,w){const O=i.get(R);if(R.isVideoTexture&&ot(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&O.__version!==R.version){const Z=R.image;if(Z===null)Fe("WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)Fe("WebGLRenderer: Texture marked for update but image is incomplete");else{Y(O,R,w);return}}else R.isExternalTexture&&(O.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,O.__webglTexture,n.TEXTURE0+w)}function V(R,w){const O=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&O.__version!==R.version){Y(O,R,w);return}else R.isExternalTexture&&(O.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,O.__webglTexture,n.TEXTURE0+w)}function H(R,w){const O=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&O.__version!==R.version){Y(O,R,w);return}t.bindTexture(n.TEXTURE_3D,O.__webglTexture,n.TEXTURE0+w)}function k(R,w){const O=i.get(R);if(R.isCubeDepthTexture!==!0&&R.version>0&&O.__version!==R.version){se(O,R,w);return}t.bindTexture(n.TEXTURE_CUBE_MAP,O.__webglTexture,n.TEXTURE0+w)}const X={[nh]:n.REPEAT,[Vi]:n.CLAMP_TO_EDGE,[ih]:n.MIRRORED_REPEAT},Q={[Zt]:n.NEAREST,[R1]:n.NEAREST_MIPMAP_NEAREST,[vl]:n.NEAREST_MIPMAP_LINEAR,[an]:n.LINEAR,[of]:n.LINEAR_MIPMAP_NEAREST,[Qr]:n.LINEAR_MIPMAP_LINEAR},J={[D1]:n.NEVER,[O1]:n.ALWAYS,[I1]:n.LESS,[Yp]:n.LEQUAL,[N1]:n.EQUAL,[qp]:n.GEQUAL,[U1]:n.GREATER,[F1]:n.NOTEQUAL};function te(R,w){if(w.type===oi&&e.has("OES_texture_float_linear")===!1&&(w.magFilter===an||w.magFilter===of||w.magFilter===vl||w.magFilter===Qr||w.minFilter===an||w.minFilter===of||w.minFilter===vl||w.minFilter===Qr)&&Fe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(R,n.TEXTURE_WRAP_S,X[w.wrapS]),n.texParameteri(R,n.TEXTURE_WRAP_T,X[w.wrapT]),(R===n.TEXTURE_3D||R===n.TEXTURE_2D_ARRAY)&&n.texParameteri(R,n.TEXTURE_WRAP_R,X[w.wrapR]),n.texParameteri(R,n.TEXTURE_MAG_FILTER,Q[w.magFilter]),n.texParameteri(R,n.TEXTURE_MIN_FILTER,Q[w.minFilter]),w.compareFunction&&(n.texParameteri(R,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(R,n.TEXTURE_COMPARE_FUNC,J[w.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===Zt||w.minFilter!==vl&&w.minFilter!==Qr||w.type===oi&&e.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||i.get(w).__currentAnisotropy){const O=e.get("EXT_texture_filter_anisotropic");n.texParameterf(R,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,r.getMaxAnisotropy())),i.get(w).__currentAnisotropy=w.anisotropy}}}function Oe(R,w){let O=!1;R.__webglInit===void 0&&(R.__webglInit=!0,w.addEventListener("dispose",M));const Z=w.source;let ee=f.get(Z);ee===void 0&&(ee={},f.set(Z,ee));const K=U(w);if(K!==R.__cacheKey){ee[K]===void 0&&(ee[K]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,O=!0),ee[K].usedTimes++;const we=ee[R.__cacheKey];we!==void 0&&(ee[R.__cacheKey].usedTimes--,we.usedTimes===0&&E(w)),R.__cacheKey=K,R.__webglTexture=ee[K].texture}return O}function qe(R,w,O){return Math.floor(Math.floor(R/O)/w)}function rt(R,w,O,Z){const K=R.updateRanges;if(K.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,w.width,w.height,O,Z,w.data);else{K.sort((re,ce)=>re.start-ce.start);let we=0;for(let re=1;re<K.length;re++){const ce=K[we],Ee=K[re],Ae=ce.start+ce.count,ge=qe(Ee.start,w.width,4),$e=qe(ce.start,w.width,4);Ee.start<=Ae+1&&ge===$e&&qe(Ee.start+Ee.count-1,w.width,4)===ge?ce.count=Math.max(ce.count,Ee.start+Ee.count-ce.start):(++we,K[we]=Ee)}K.length=we+1;const fe=n.getParameter(n.UNPACK_ROW_LENGTH),Ie=n.getParameter(n.UNPACK_SKIP_PIXELS),ke=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,w.width);for(let re=0,ce=K.length;re<ce;re++){const Ee=K[re],Ae=Math.floor(Ee.start/4),ge=Math.ceil(Ee.count/4),$e=Ae%w.width,N=Math.floor(Ae/w.width),de=ge,ue=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,$e),n.pixelStorei(n.UNPACK_SKIP_ROWS,N),t.texSubImage2D(n.TEXTURE_2D,0,$e,N,de,ue,O,Z,w.data)}R.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,fe),n.pixelStorei(n.UNPACK_SKIP_PIXELS,Ie),n.pixelStorei(n.UNPACK_SKIP_ROWS,ke)}}function Y(R,w,O){let Z=n.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(Z=n.TEXTURE_2D_ARRAY),w.isData3DTexture&&(Z=n.TEXTURE_3D);const ee=Oe(R,w),K=w.source;t.bindTexture(Z,R.__webglTexture,n.TEXTURE0+O);const we=i.get(K);if(K.version!==we.__version||ee===!0){t.activeTexture(n.TEXTURE0+O);const fe=et.getPrimaries(et.workingColorSpace),Ie=w.colorSpace===hr?null:et.getPrimaries(w.colorSpace),ke=w.colorSpace===hr||fe===Ie?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,w.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,w.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ke);let re=v(w.image,!1,r.maxTextureSize);re=vt(w,re);const ce=s.convert(w.format,w.colorSpace),Ee=s.convert(w.type);let Ae=x(w.internalFormat,ce,Ee,w.colorSpace,w.isVideoTexture);te(Z,w);let ge;const $e=w.mipmaps,N=w.isVideoTexture!==!0,de=we.__version===void 0||ee===!0,ue=K.dataReady,ye=A(w,re);if(w.isDepthTexture)Ae=S(w.format===Jr,w.type),de&&(N?t.texStorage2D(n.TEXTURE_2D,1,Ae,re.width,re.height):t.texImage2D(n.TEXTURE_2D,0,Ae,re.width,re.height,0,ce,Ee,null));else if(w.isDataTexture)if($e.length>0){N&&de&&t.texStorage2D(n.TEXTURE_2D,ye,Ae,$e[0].width,$e[0].height);for(let ae=0,$=$e.length;ae<$;ae++)ge=$e[ae],N?ue&&t.texSubImage2D(n.TEXTURE_2D,ae,0,0,ge.width,ge.height,ce,Ee,ge.data):t.texImage2D(n.TEXTURE_2D,ae,Ae,ge.width,ge.height,0,ce,Ee,ge.data);w.generateMipmaps=!1}else N?(de&&t.texStorage2D(n.TEXTURE_2D,ye,Ae,re.width,re.height),ue&&rt(w,re,ce,Ee)):t.texImage2D(n.TEXTURE_2D,0,Ae,re.width,re.height,0,ce,Ee,re.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){N&&de&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ye,Ae,$e[0].width,$e[0].height,re.depth);for(let ae=0,$=$e.length;ae<$;ae++)if(ge=$e[ae],w.format!==ai)if(ce!==null)if(N){if(ue)if(w.layerUpdates.size>0){const Te=d_(ge.width,ge.height,w.format,w.type);for(const ze of w.layerUpdates){const xt=ge.data.subarray(ze*Te/ge.data.BYTES_PER_ELEMENT,(ze+1)*Te/ge.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ae,0,0,ze,ge.width,ge.height,1,ce,xt)}w.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ae,0,0,0,ge.width,ge.height,re.depth,ce,ge.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,ae,Ae,ge.width,ge.height,re.depth,0,ge.data,0,0);else Fe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else N?ue&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,ae,0,0,0,ge.width,ge.height,re.depth,ce,Ee,ge.data):t.texImage3D(n.TEXTURE_2D_ARRAY,ae,Ae,ge.width,ge.height,re.depth,0,ce,Ee,ge.data)}else{N&&de&&t.texStorage2D(n.TEXTURE_2D,ye,Ae,$e[0].width,$e[0].height);for(let ae=0,$=$e.length;ae<$;ae++)ge=$e[ae],w.format!==ai?ce!==null?N?ue&&t.compressedTexSubImage2D(n.TEXTURE_2D,ae,0,0,ge.width,ge.height,ce,ge.data):t.compressedTexImage2D(n.TEXTURE_2D,ae,Ae,ge.width,ge.height,0,ge.data):Fe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):N?ue&&t.texSubImage2D(n.TEXTURE_2D,ae,0,0,ge.width,ge.height,ce,Ee,ge.data):t.texImage2D(n.TEXTURE_2D,ae,Ae,ge.width,ge.height,0,ce,Ee,ge.data)}else if(w.isDataArrayTexture)if(N){if(de&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ye,Ae,re.width,re.height,re.depth),ue)if(w.layerUpdates.size>0){const ae=d_(re.width,re.height,w.format,w.type);for(const $ of w.layerUpdates){const Te=re.data.subarray($*ae/re.data.BYTES_PER_ELEMENT,($+1)*ae/re.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,$,re.width,re.height,1,ce,Ee,Te)}w.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,re.width,re.height,re.depth,ce,Ee,re.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Ae,re.width,re.height,re.depth,0,ce,Ee,re.data);else if(w.isData3DTexture)N?(de&&t.texStorage3D(n.TEXTURE_3D,ye,Ae,re.width,re.height,re.depth),ue&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,re.width,re.height,re.depth,ce,Ee,re.data)):t.texImage3D(n.TEXTURE_3D,0,Ae,re.width,re.height,re.depth,0,ce,Ee,re.data);else if(w.isFramebufferTexture){if(de)if(N)t.texStorage2D(n.TEXTURE_2D,ye,Ae,re.width,re.height);else{let ae=re.width,$=re.height;for(let Te=0;Te<ye;Te++)t.texImage2D(n.TEXTURE_2D,Te,Ae,ae,$,0,ce,Ee,null),ae>>=1,$>>=1}}else if($e.length>0){if(N&&de){const ae=Ce($e[0]);t.texStorage2D(n.TEXTURE_2D,ye,Ae,ae.width,ae.height)}for(let ae=0,$=$e.length;ae<$;ae++)ge=$e[ae],N?ue&&t.texSubImage2D(n.TEXTURE_2D,ae,0,0,ce,Ee,ge):t.texImage2D(n.TEXTURE_2D,ae,Ae,ce,Ee,ge);w.generateMipmaps=!1}else if(N){if(de){const ae=Ce(re);t.texStorage2D(n.TEXTURE_2D,ye,Ae,ae.width,ae.height)}ue&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ce,Ee,re)}else t.texImage2D(n.TEXTURE_2D,0,Ae,ce,Ee,re);g(w)&&p(Z),we.__version=K.version,w.onUpdate&&w.onUpdate(w)}R.__version=w.version}function se(R,w,O){if(w.image.length!==6)return;const Z=Oe(R,w),ee=w.source;t.bindTexture(n.TEXTURE_CUBE_MAP,R.__webglTexture,n.TEXTURE0+O);const K=i.get(ee);if(ee.version!==K.__version||Z===!0){t.activeTexture(n.TEXTURE0+O);const we=et.getPrimaries(et.workingColorSpace),fe=w.colorSpace===hr?null:et.getPrimaries(w.colorSpace),Ie=w.colorSpace===hr||we===fe?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,w.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,w.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ie);const ke=w.isCompressedTexture||w.image[0].isCompressedTexture,re=w.image[0]&&w.image[0].isDataTexture,ce=[];for(let $=0;$<6;$++)!ke&&!re?ce[$]=v(w.image[$],!0,r.maxCubemapSize):ce[$]=re?w.image[$].image:w.image[$],ce[$]=vt(w,ce[$]);const Ee=ce[0],Ae=s.convert(w.format,w.colorSpace),ge=s.convert(w.type),$e=x(w.internalFormat,Ae,ge,w.colorSpace),N=w.isVideoTexture!==!0,de=K.__version===void 0||Z===!0,ue=ee.dataReady;let ye=A(w,Ee);te(n.TEXTURE_CUBE_MAP,w);let ae;if(ke){N&&de&&t.texStorage2D(n.TEXTURE_CUBE_MAP,ye,$e,Ee.width,Ee.height);for(let $=0;$<6;$++){ae=ce[$].mipmaps;for(let Te=0;Te<ae.length;Te++){const ze=ae[Te];w.format!==ai?Ae!==null?N?ue&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,Te,0,0,ze.width,ze.height,Ae,ze.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,Te,$e,ze.width,ze.height,0,ze.data):Fe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):N?ue&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,Te,0,0,ze.width,ze.height,Ae,ge,ze.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,Te,$e,ze.width,ze.height,0,Ae,ge,ze.data)}}}else{if(ae=w.mipmaps,N&&de){ae.length>0&&ye++;const $=Ce(ce[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,ye,$e,$.width,$.height)}for(let $=0;$<6;$++)if(re){N?ue&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,ce[$].width,ce[$].height,Ae,ge,ce[$].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,$e,ce[$].width,ce[$].height,0,Ae,ge,ce[$].data);for(let Te=0;Te<ae.length;Te++){const xt=ae[Te].image[$].image;N?ue&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,Te+1,0,0,xt.width,xt.height,Ae,ge,xt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,Te+1,$e,xt.width,xt.height,0,Ae,ge,xt.data)}}else{N?ue&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,Ae,ge,ce[$]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,$e,Ae,ge,ce[$]);for(let Te=0;Te<ae.length;Te++){const ze=ae[Te];N?ue&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,Te+1,0,0,Ae,ge,ze.image[$]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+$,Te+1,$e,Ae,ge,ze.image[$])}}}g(w)&&p(n.TEXTURE_CUBE_MAP),K.__version=ee.version,w.onUpdate&&w.onUpdate(w)}R.__version=w.version}function le(R,w,O,Z,ee,K){const we=s.convert(O.format,O.colorSpace),fe=s.convert(O.type),Ie=x(O.internalFormat,we,fe,O.colorSpace),ke=i.get(w),re=i.get(O);if(re.__renderTarget=w,!ke.__hasExternalTextures){const ce=Math.max(1,w.width>>K),Ee=Math.max(1,w.height>>K);ee===n.TEXTURE_3D||ee===n.TEXTURE_2D_ARRAY?t.texImage3D(ee,K,Ie,ce,Ee,w.depth,0,we,fe,null):t.texImage2D(ee,K,Ie,ce,Ee,0,we,fe,null)}t.bindFramebuffer(n.FRAMEBUFFER,R),Mt(w)?c.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Z,ee,re.__webglTexture,0,I(w)):(ee===n.TEXTURE_2D||ee>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ee<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,Z,ee,re.__webglTexture,K),t.bindFramebuffer(n.FRAMEBUFFER,null)}function Me(R,w,O){if(n.bindRenderbuffer(n.RENDERBUFFER,R),w.depthBuffer){const Z=w.depthTexture,ee=Z&&Z.isDepthTexture?Z.type:null,K=S(w.stencilBuffer,ee),we=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;Mt(w)?c.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,I(w),K,w.width,w.height):O?n.renderbufferStorageMultisample(n.RENDERBUFFER,I(w),K,w.width,w.height):n.renderbufferStorage(n.RENDERBUFFER,K,w.width,w.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,we,n.RENDERBUFFER,R)}else{const Z=w.textures;for(let ee=0;ee<Z.length;ee++){const K=Z[ee],we=s.convert(K.format,K.colorSpace),fe=s.convert(K.type),Ie=x(K.internalFormat,we,fe,K.colorSpace);Mt(w)?c.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,I(w),Ie,w.width,w.height):O?n.renderbufferStorageMultisample(n.RENDERBUFFER,I(w),Ie,w.width,w.height):n.renderbufferStorage(n.RENDERBUFFER,Ie,w.width,w.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function oe(R,w,O){const Z=w.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,R),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ee=i.get(w.depthTexture);if(ee.__renderTarget=w,(!ee.__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),Z){if(ee.__webglInit===void 0&&(ee.__webglInit=!0,w.depthTexture.addEventListener("dispose",M)),ee.__webglTexture===void 0){ee.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,ee.__webglTexture),te(n.TEXTURE_CUBE_MAP,w.depthTexture);const ke=s.convert(w.depthTexture.format),re=s.convert(w.depthTexture.type);let ce;w.depthTexture.format===qi?ce=n.DEPTH_COMPONENT24:w.depthTexture.format===Jr&&(ce=n.DEPTH24_STENCIL8);for(let Ee=0;Ee<6;Ee++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,0,ce,w.width,w.height,0,ke,re,null)}}else z(w.depthTexture,0);const K=ee.__webglTexture,we=I(w),fe=Z?n.TEXTURE_CUBE_MAP_POSITIVE_X+O:n.TEXTURE_2D,Ie=w.depthTexture.format===Jr?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(w.depthTexture.format===qi)Mt(w)?c.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Ie,fe,K,0,we):n.framebufferTexture2D(n.FRAMEBUFFER,Ie,fe,K,0);else if(w.depthTexture.format===Jr)Mt(w)?c.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Ie,fe,K,0,we):n.framebufferTexture2D(n.FRAMEBUFFER,Ie,fe,K,0);else throw new Error("Unknown depthTexture format")}function Ne(R){const w=i.get(R),O=R.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==R.depthTexture){const Z=R.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),Z){const ee=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,Z.removeEventListener("dispose",ee)};Z.addEventListener("dispose",ee),w.__depthDisposeCallback=ee}w.__boundDepthTexture=Z}if(R.depthTexture&&!w.__autoAllocateDepthBuffer)if(O)for(let Z=0;Z<6;Z++)oe(w.__webglFramebuffer[Z],R,Z);else{const Z=R.texture.mipmaps;Z&&Z.length>0?oe(w.__webglFramebuffer[0],R,0):oe(w.__webglFramebuffer,R,0)}else if(O){w.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(t.bindFramebuffer(n.FRAMEBUFFER,w.__webglFramebuffer[Z]),w.__webglDepthbuffer[Z]===void 0)w.__webglDepthbuffer[Z]=n.createRenderbuffer(),Me(w.__webglDepthbuffer[Z],R,!1);else{const ee=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,K=w.__webglDepthbuffer[Z];n.bindRenderbuffer(n.RENDERBUFFER,K),n.framebufferRenderbuffer(n.FRAMEBUFFER,ee,n.RENDERBUFFER,K)}}else{const Z=R.texture.mipmaps;if(Z&&Z.length>0?t.bindFramebuffer(n.FRAMEBUFFER,w.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=n.createRenderbuffer(),Me(w.__webglDepthbuffer,R,!1);else{const ee=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,K=w.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,K),n.framebufferRenderbuffer(n.FRAMEBUFFER,ee,n.RENDERBUFFER,K)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function ht(R,w,O){const Z=i.get(R);w!==void 0&&le(Z.__webglFramebuffer,R,R.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),O!==void 0&&Ne(R)}function Ve(R){const w=R.texture,O=i.get(R),Z=i.get(w);R.addEventListener("dispose",T);const ee=R.textures,K=R.isWebGLCubeRenderTarget===!0,we=ee.length>1;if(we||(Z.__webglTexture===void 0&&(Z.__webglTexture=n.createTexture()),Z.__version=w.version,o.memory.textures++),K){O.__webglFramebuffer=[];for(let fe=0;fe<6;fe++)if(w.mipmaps&&w.mipmaps.length>0){O.__webglFramebuffer[fe]=[];for(let Ie=0;Ie<w.mipmaps.length;Ie++)O.__webglFramebuffer[fe][Ie]=n.createFramebuffer()}else O.__webglFramebuffer[fe]=n.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){O.__webglFramebuffer=[];for(let fe=0;fe<w.mipmaps.length;fe++)O.__webglFramebuffer[fe]=n.createFramebuffer()}else O.__webglFramebuffer=n.createFramebuffer();if(we)for(let fe=0,Ie=ee.length;fe<Ie;fe++){const ke=i.get(ee[fe]);ke.__webglTexture===void 0&&(ke.__webglTexture=n.createTexture(),o.memory.textures++)}if(R.samples>0&&Mt(R)===!1){O.__webglMultisampledFramebuffer=n.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let fe=0;fe<ee.length;fe++){const Ie=ee[fe];O.__webglColorRenderbuffer[fe]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,O.__webglColorRenderbuffer[fe]);const ke=s.convert(Ie.format,Ie.colorSpace),re=s.convert(Ie.type),ce=x(Ie.internalFormat,ke,re,Ie.colorSpace,R.isXRRenderTarget===!0),Ee=I(R);n.renderbufferStorageMultisample(n.RENDERBUFFER,Ee,ce,R.width,R.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+fe,n.RENDERBUFFER,O.__webglColorRenderbuffer[fe])}n.bindRenderbuffer(n.RENDERBUFFER,null),R.depthBuffer&&(O.__webglDepthRenderbuffer=n.createRenderbuffer(),Me(O.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(K){t.bindTexture(n.TEXTURE_CUBE_MAP,Z.__webglTexture),te(n.TEXTURE_CUBE_MAP,w);for(let fe=0;fe<6;fe++)if(w.mipmaps&&w.mipmaps.length>0)for(let Ie=0;Ie<w.mipmaps.length;Ie++)le(O.__webglFramebuffer[fe][Ie],R,w,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+fe,Ie);else le(O.__webglFramebuffer[fe],R,w,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0);g(w)&&p(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(we){for(let fe=0,Ie=ee.length;fe<Ie;fe++){const ke=ee[fe],re=i.get(ke);let ce=n.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(ce=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ce,re.__webglTexture),te(ce,ke),le(O.__webglFramebuffer,R,ke,n.COLOR_ATTACHMENT0+fe,ce,0),g(ke)&&p(ce)}t.unbindTexture()}else{let fe=n.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(fe=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(fe,Z.__webglTexture),te(fe,w),w.mipmaps&&w.mipmaps.length>0)for(let Ie=0;Ie<w.mipmaps.length;Ie++)le(O.__webglFramebuffer[Ie],R,w,n.COLOR_ATTACHMENT0,fe,Ie);else le(O.__webglFramebuffer,R,w,n.COLOR_ATTACHMENT0,fe,0);g(w)&&p(fe),t.unbindTexture()}R.depthBuffer&&Ne(R)}function Ze(R){const w=R.textures;for(let O=0,Z=w.length;O<Z;O++){const ee=w[O];if(g(ee)){const K=_(R),we=i.get(ee).__webglTexture;t.bindTexture(K,we),p(K),t.unbindTexture()}}}const st=[],Le=[];function Qe(R){if(R.samples>0){if(Mt(R)===!1){const w=R.textures,O=R.width,Z=R.height;let ee=n.COLOR_BUFFER_BIT;const K=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,we=i.get(R),fe=w.length>1;if(fe)for(let ke=0;ke<w.length;ke++)t.bindFramebuffer(n.FRAMEBUFFER,we.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ke,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,we.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ke,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,we.__webglMultisampledFramebuffer);const Ie=R.texture.mipmaps;Ie&&Ie.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,we.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,we.__webglFramebuffer);for(let ke=0;ke<w.length;ke++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(ee|=n.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(ee|=n.STENCIL_BUFFER_BIT)),fe){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,we.__webglColorRenderbuffer[ke]);const re=i.get(w[ke]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,re,0)}n.blitFramebuffer(0,0,O,Z,0,0,O,Z,ee,n.NEAREST),l===!0&&(st.length=0,Le.length=0,st.push(n.COLOR_ATTACHMENT0+ke),R.depthBuffer&&R.resolveDepthBuffer===!1&&(st.push(K),Le.push(K),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,Le)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,st))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),fe)for(let ke=0;ke<w.length;ke++){t.bindFramebuffer(n.FRAMEBUFFER,we.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ke,n.RENDERBUFFER,we.__webglColorRenderbuffer[ke]);const re=i.get(w[ke]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,we.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ke,n.TEXTURE_2D,re,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,we.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){const w=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[w])}}}function I(R){return Math.min(r.maxSamples,R.samples)}function Mt(R){const w=i.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function ot(R){const w=o.render.frame;d.get(R)!==w&&(d.set(R,w),R.update())}function vt(R,w){const O=R.colorSpace,Z=R.format,ee=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||O!==Mo&&O!==hr&&(et.getTransfer(O)===lt?(Z!==ai||ee!==Dn)&&Fe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Je("WebGLTextures: Unsupported texture color space:",O)),w}function Ce(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(u.width=R.naturalWidth||R.width,u.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(u.width=R.displayWidth,u.height=R.displayHeight):(u.width=R.width,u.height=R.height),u}this.allocateTextureUnit=L,this.resetTextureUnits=F,this.setTexture2D=z,this.setTexture2DArray=V,this.setTexture3D=H,this.setTextureCube=k,this.rebindTextures=ht,this.setupRenderTarget=Ve,this.updateRenderTargetMipmap=Ze,this.updateMultisampleRenderTarget=Qe,this.setupDepthRenderbuffer=Ne,this.setupFrameBufferTexture=le,this.useMultisampledRTT=Mt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function LC(n,e){function t(i,r=hr){let s;const o=et.getTransfer(r);if(i===Dn)return n.UNSIGNED_BYTE;if(i===Hp)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Gp)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Lx)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Dx)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Rx)return n.BYTE;if(i===Px)return n.SHORT;if(i===Ia)return n.UNSIGNED_SHORT;if(i===Vp)return n.INT;if(i===Ai)return n.UNSIGNED_INT;if(i===oi)return n.FLOAT;if(i===Fn)return n.HALF_FLOAT;if(i===Ix)return n.ALPHA;if(i===Nx)return n.RGB;if(i===ai)return n.RGBA;if(i===qi)return n.DEPTH_COMPONENT;if(i===Jr)return n.DEPTH_STENCIL;if(i===Wp)return n.RED;if(i===Xp)return n.RED_INTEGER;if(i===So)return n.RG;if(i===jp)return n.RG_INTEGER;if(i===$p)return n.RGBA_INTEGER;if(i===_c||i===vc||i===xc||i===yc)if(o===lt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===_c)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===vc)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===xc)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===yc)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===_c)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===vc)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===xc)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===yc)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===rh||i===sh||i===oh||i===ah)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===rh)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===sh)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===oh)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===ah)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===lh||i===ch||i===uh||i===fh||i===dh||i===hh||i===ph)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===lh||i===ch)return o===lt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===uh)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(i===fh)return s.COMPRESSED_R11_EAC;if(i===dh)return s.COMPRESSED_SIGNED_R11_EAC;if(i===hh)return s.COMPRESSED_RG11_EAC;if(i===ph)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===mh||i===gh||i===_h||i===vh||i===xh||i===yh||i===Sh||i===Mh||i===wh||i===Eh||i===Th||i===Ah||i===bh||i===Ch)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===mh)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===gh)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===_h)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===vh)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===xh)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===yh)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Sh)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Mh)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===wh)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Eh)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Th)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Ah)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===bh)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Ch)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Rh||i===Ph||i===Lh)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===Rh)return o===lt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Ph)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Lh)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Dh||i===Ih||i===Nh||i===Uh)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===Dh)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Ih)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Nh)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Uh)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Na?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const DC=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,IC=`
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

}`;class NC{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new jx(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Tt({vertexShader:DC,fragmentShader:IC,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new mn(new ja(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class UC extends us{constructor(e,t){super();const i=this;let r=null,s=1,o=null,c="local-floor",l=1,u=null,d=null,a=null,f=null,h=null,m=null;const v=typeof XRWebGLBinding<"u",g=new NC,p={},_=t.getContextAttributes();let x=null,S=null;const A=[],M=[],T=new xe;let y=null;const E=new Ln;E.viewport=new Dt;const D=new Ln;D.viewport=new Dt;const C=[E,D],F=new Ww;let L=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let se=A[Y];return se===void 0&&(se=new df,A[Y]=se),se.getTargetRaySpace()},this.getControllerGrip=function(Y){let se=A[Y];return se===void 0&&(se=new df,A[Y]=se),se.getGripSpace()},this.getHand=function(Y){let se=A[Y];return se===void 0&&(se=new df,A[Y]=se),se.getHandSpace()};function z(Y){const se=M.indexOf(Y.inputSource);if(se===-1)return;const le=A[se];le!==void 0&&(le.update(Y.inputSource,Y.frame,u||o),le.dispatchEvent({type:Y.type,data:Y.inputSource}))}function V(){r.removeEventListener("select",z),r.removeEventListener("selectstart",z),r.removeEventListener("selectend",z),r.removeEventListener("squeeze",z),r.removeEventListener("squeezestart",z),r.removeEventListener("squeezeend",z),r.removeEventListener("end",V),r.removeEventListener("inputsourceschange",H);for(let Y=0;Y<A.length;Y++){const se=M[Y];se!==null&&(M[Y]=null,A[Y].disconnect(se))}L=null,U=null,g.reset();for(const Y in p)delete p[Y];e.setRenderTarget(x),h=null,f=null,a=null,r=null,S=null,rt.stop(),i.isPresenting=!1,e.setPixelRatio(y),e.setSize(T.width,T.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){s=Y,i.isPresenting===!0&&Fe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){c=Y,i.isPresenting===!0&&Fe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return u||o},this.setReferenceSpace=function(Y){u=Y},this.getBaseLayer=function(){return f!==null?f:h},this.getBinding=function(){return a===null&&v&&(a=new XRWebGLBinding(r,t)),a},this.getFrame=function(){return m},this.getSession=function(){return r},this.setSession=async function(Y){if(r=Y,r!==null){if(x=e.getRenderTarget(),r.addEventListener("select",z),r.addEventListener("selectstart",z),r.addEventListener("selectend",z),r.addEventListener("squeeze",z),r.addEventListener("squeezestart",z),r.addEventListener("squeezeend",z),r.addEventListener("end",V),r.addEventListener("inputsourceschange",H),_.xrCompatible!==!0&&await t.makeXRCompatible(),y=e.getPixelRatio(),e.getSize(T),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let le=null,Me=null,oe=null;_.depth&&(oe=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,le=_.stencil?Jr:qi,Me=_.stencil?Na:Ai);const Ne={colorFormat:t.RGBA8,depthFormat:oe,scaleFactor:s};a=this.getBinding(),f=a.createProjectionLayer(Ne),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),S=new Tn(f.textureWidth,f.textureHeight,{format:ai,type:Dn,depthTexture:new Oa(f.textureWidth,f.textureHeight,Me,void 0,void 0,void 0,void 0,void 0,void 0,le),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const le={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:s};h=new XRWebGLLayer(r,t,le),r.updateRenderState({baseLayer:h}),e.setPixelRatio(1),e.setSize(h.framebufferWidth,h.framebufferHeight,!1),S=new Tn(h.framebufferWidth,h.framebufferHeight,{format:ai,type:Dn,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(l),u=null,o=await r.requestReferenceSpace(c),rt.setContext(r),rt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function H(Y){for(let se=0;se<Y.removed.length;se++){const le=Y.removed[se],Me=M.indexOf(le);Me>=0&&(M[Me]=null,A[Me].disconnect(le))}for(let se=0;se<Y.added.length;se++){const le=Y.added[se];let Me=M.indexOf(le);if(Me===-1){for(let Ne=0;Ne<A.length;Ne++)if(Ne>=M.length){M.push(le),Me=Ne;break}else if(M[Ne]===null){M[Ne]=le,Me=Ne;break}if(Me===-1)break}const oe=A[Me];oe&&oe.connect(le)}}const k=new P,X=new P;function Q(Y,se,le){k.setFromMatrixPosition(se.matrixWorld),X.setFromMatrixPosition(le.matrixWorld);const Me=k.distanceTo(X),oe=se.projectionMatrix.elements,Ne=le.projectionMatrix.elements,ht=oe[14]/(oe[10]-1),Ve=oe[14]/(oe[10]+1),Ze=(oe[9]+1)/oe[5],st=(oe[9]-1)/oe[5],Le=(oe[8]-1)/oe[0],Qe=(Ne[8]+1)/Ne[0],I=ht*Le,Mt=ht*Qe,ot=Me/(-Le+Qe),vt=ot*-Le;if(se.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(vt),Y.translateZ(ot),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),oe[10]===-1)Y.projectionMatrix.copy(se.projectionMatrix),Y.projectionMatrixInverse.copy(se.projectionMatrixInverse);else{const Ce=ht+ot,R=Ve+ot,w=I-vt,O=Mt+(Me-vt),Z=Ze*Ve/R*Ce,ee=st*Ve/R*Ce;Y.projectionMatrix.makePerspective(w,O,Z,ee,Ce,R),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function J(Y,se){se===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(se.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(r===null)return;let se=Y.near,le=Y.far;g.texture!==null&&(g.depthNear>0&&(se=g.depthNear),g.depthFar>0&&(le=g.depthFar)),F.near=D.near=E.near=se,F.far=D.far=E.far=le,(L!==F.near||U!==F.far)&&(r.updateRenderState({depthNear:F.near,depthFar:F.far}),L=F.near,U=F.far),F.layers.mask=Y.layers.mask|6,E.layers.mask=F.layers.mask&-5,D.layers.mask=F.layers.mask&-3;const Me=Y.parent,oe=F.cameras;J(F,Me);for(let Ne=0;Ne<oe.length;Ne++)J(oe[Ne],Me);oe.length===2?Q(F,E,D):F.projectionMatrix.copy(E.projectionMatrix),te(Y,F,Me)};function te(Y,se,le){le===null?Y.matrix.copy(se.matrixWorld):(Y.matrix.copy(le.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(se.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(se.projectionMatrix),Y.projectionMatrixInverse.copy(se.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Fa*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(f===null&&h===null))return l},this.setFoveation=function(Y){l=Y,f!==null&&(f.fixedFoveation=Y),h!==null&&h.fixedFoveation!==void 0&&(h.fixedFoveation=Y)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(F)},this.getCameraTexture=function(Y){return p[Y]};let Oe=null;function qe(Y,se){if(d=se.getViewerPose(u||o),m=se,d!==null){const le=d.views;h!==null&&(e.setRenderTargetFramebuffer(S,h.framebuffer),e.setRenderTarget(S));let Me=!1;le.length!==F.cameras.length&&(F.cameras.length=0,Me=!0);for(let Ve=0;Ve<le.length;Ve++){const Ze=le[Ve];let st=null;if(h!==null)st=h.getViewport(Ze);else{const Qe=a.getViewSubImage(f,Ze);st=Qe.viewport,Ve===0&&(e.setRenderTargetTextures(S,Qe.colorTexture,Qe.depthStencilTexture),e.setRenderTarget(S))}let Le=C[Ve];Le===void 0&&(Le=new Ln,Le.layers.enable(Ve),Le.viewport=new Dt,C[Ve]=Le),Le.matrix.fromArray(Ze.transform.matrix),Le.matrix.decompose(Le.position,Le.quaternion,Le.scale),Le.projectionMatrix.fromArray(Ze.projectionMatrix),Le.projectionMatrixInverse.copy(Le.projectionMatrix).invert(),Le.viewport.set(st.x,st.y,st.width,st.height),Ve===0&&(F.matrix.copy(Le.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),Me===!0&&F.cameras.push(Le)}const oe=r.enabledFeatures;if(oe&&oe.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&v){a=i.getBinding();const Ve=a.getDepthInformation(le[0]);Ve&&Ve.isValid&&Ve.texture&&g.init(Ve,r.renderState)}if(oe&&oe.includes("camera-access")&&v){e.state.unbindTexture(),a=i.getBinding();for(let Ve=0;Ve<le.length;Ve++){const Ze=le[Ve].camera;if(Ze){let st=p[Ze];st||(st=new jx,p[Ze]=st);const Le=a.getCameraImage(Ze);st.sourceTexture=Le}}}}for(let le=0;le<A.length;le++){const Me=M[le],oe=A[le];Me!==null&&oe!==void 0&&oe.update(Me,se,u||o)}Oe&&Oe(Y,se),se.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:se}),m=null}const rt=new ey;rt.setAnimationLoop(qe),this.setAnimationLoop=function(Y){Oe=Y},this.dispose=function(){}}}const Hr=new bi,FC=new dt;function OC(n,e){function t(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function i(g,p){p.color.getRGB(g.fogColor.value,Zx(n)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function r(g,p,_,x,S){p.isMeshBasicMaterial?s(g,p):p.isMeshLambertMaterial?(s(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(s(g,p),a(g,p)):p.isMeshPhongMaterial?(s(g,p),d(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(s(g,p),f(g,p),p.isMeshPhysicalMaterial&&h(g,p,S)):p.isMeshMatcapMaterial?(s(g,p),m(g,p)):p.isMeshDepthMaterial?s(g,p):p.isMeshDistanceMaterial?(s(g,p),v(g,p)):p.isMeshNormalMaterial?s(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&c(g,p)):p.isPointsMaterial?l(g,p,_,x):p.isSpriteMaterial?u(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,t(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===En&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,t(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===En&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,t(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,t(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const _=e.get(p),x=_.envMap,S=_.envMapRotation;x&&(g.envMap.value=x,Hr.copy(S),Hr.x*=-1,Hr.y*=-1,Hr.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(Hr.y*=-1,Hr.z*=-1),g.envMapRotation.value.setFromMatrix4(FC.makeRotationFromEuler(Hr)),g.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform))}function c(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,_,x){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*_,g.scale.value=x*.5,p.map&&(g.map.value=p.map,t(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function u(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function d(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function a(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function f(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function h(g,p,_){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===En&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=_.texture,g.transmissionSamplerSize.value.set(_.width,_.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function v(g,p){const _=e.get(p).light;g.referencePosition.value.setFromMatrixPosition(_.matrixWorld),g.nearDistance.value=_.shadow.camera.near,g.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function kC(n,e,t,i){let r={},s={},o=[];const c=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(_,x){const S=x.program;i.uniformBlockBinding(_,S)}function u(_,x){let S=r[_.id];S===void 0&&(m(_),S=d(_),r[_.id]=S,_.addEventListener("dispose",g));const A=x.program;i.updateUBOMapping(_,A);const M=e.render.frame;s[_.id]!==M&&(f(_),s[_.id]=M)}function d(_){const x=a();_.__bindingPointIndex=x;const S=n.createBuffer(),A=_.__size,M=_.usage;return n.bindBuffer(n.UNIFORM_BUFFER,S),n.bufferData(n.UNIFORM_BUFFER,A,M),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,x,S),S}function a(){for(let _=0;_<c;_++)if(o.indexOf(_)===-1)return o.push(_),_;return Je("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(_){const x=r[_.id],S=_.uniforms,A=_.__cache;n.bindBuffer(n.UNIFORM_BUFFER,x);for(let M=0,T=S.length;M<T;M++){const y=Array.isArray(S[M])?S[M]:[S[M]];for(let E=0,D=y.length;E<D;E++){const C=y[E];if(h(C,M,E,A)===!0){const F=C.__offset,L=Array.isArray(C.value)?C.value:[C.value];let U=0;for(let z=0;z<L.length;z++){const V=L[z],H=v(V);typeof V=="number"||typeof V=="boolean"?(C.__data[0]=V,n.bufferSubData(n.UNIFORM_BUFFER,F+U,C.__data)):V.isMatrix3?(C.__data[0]=V.elements[0],C.__data[1]=V.elements[1],C.__data[2]=V.elements[2],C.__data[3]=0,C.__data[4]=V.elements[3],C.__data[5]=V.elements[4],C.__data[6]=V.elements[5],C.__data[7]=0,C.__data[8]=V.elements[6],C.__data[9]=V.elements[7],C.__data[10]=V.elements[8],C.__data[11]=0):(V.toArray(C.__data,U),U+=H.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,F,C.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function h(_,x,S,A){const M=_.value,T=x+"_"+S;if(A[T]===void 0)return typeof M=="number"||typeof M=="boolean"?A[T]=M:A[T]=M.clone(),!0;{const y=A[T];if(typeof M=="number"||typeof M=="boolean"){if(y!==M)return A[T]=M,!0}else if(y.equals(M)===!1)return y.copy(M),!0}return!1}function m(_){const x=_.uniforms;let S=0;const A=16;for(let T=0,y=x.length;T<y;T++){const E=Array.isArray(x[T])?x[T]:[x[T]];for(let D=0,C=E.length;D<C;D++){const F=E[D],L=Array.isArray(F.value)?F.value:[F.value];for(let U=0,z=L.length;U<z;U++){const V=L[U],H=v(V),k=S%A,X=k%H.boundary,Q=k+X;S+=X,Q!==0&&A-Q<H.storage&&(S+=A-Q),F.__data=new Float32Array(H.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=S,S+=H.storage}}}const M=S%A;return M>0&&(S+=A-M),_.__size=S,_.__cache={},this}function v(_){const x={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(x.boundary=4,x.storage=4):_.isVector2?(x.boundary=8,x.storage=8):_.isVector3||_.isColor?(x.boundary=16,x.storage=12):_.isVector4?(x.boundary=16,x.storage=16):_.isMatrix3?(x.boundary=48,x.storage=48):_.isMatrix4?(x.boundary=64,x.storage=64):_.isTexture?Fe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):Fe("WebGLRenderer: Unsupported uniform value type.",_),x}function g(_){const x=_.target;x.removeEventListener("dispose",g);const S=o.indexOf(x.__bindingPointIndex);o.splice(S,1),n.deleteBuffer(r[x.id]),delete r[x.id],delete s[x.id]}function p(){for(const _ in r)n.deleteBuffer(r[_]);o=[],r={},s={}}return{bind:l,update:u,dispose:p}}const BC=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let gi=null;function zC(){return gi===null&&(gi=new Wx(BC,16,16,So,Fn),gi.name="DFG_LUT",gi.minFilter=an,gi.magFilter=an,gi.wrapS=Vi,gi.wrapT=Vi,gi.generateMipmaps=!1,gi.needsUpdate=!0),gi}class VC{constructor(e={}){const{canvas:t=B1(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:c=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:u=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:a=!1,reversedDepthBuffer:f=!1,outputBufferType:h=Dn}=e;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=o;const v=h,g=new Set([$p,jp,Xp]),p=new Set([Dn,Ai,Ia,Na,Hp,Gp]),_=new Uint32Array(4),x=new Int32Array(4);let S=null,A=null;const M=[],T=[];let y=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ei,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const E=this;let D=!1;this._outputColorSpace=Gn;let C=0,F=0,L=null,U=-1,z=null;const V=new Dt,H=new Dt;let k=null;const X=new ne(0);let Q=0,J=t.width,te=t.height,Oe=1,qe=null,rt=null;const Y=new Dt(0,0,J,te),se=new Dt(0,0,J,te);let le=!1;const Me=new Jp;let oe=!1,Ne=!1;const ht=new dt,Ve=new P,Ze=new Dt,st={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Le=!1;function Qe(){return L===null?Oe:1}let I=i;function Mt(b,B){return t.getContext(b,B)}try{const b={alpha:!0,depth:r,stencil:s,antialias:c,premultipliedAlpha:l,preserveDrawingBuffer:u,powerPreference:d,failIfMajorPerformanceCaveat:a};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${zp}`),t.addEventListener("webglcontextlost",Te,!1),t.addEventListener("webglcontextrestored",ze,!1),t.addEventListener("webglcontextcreationerror",xt,!1),I===null){const B="webgl2";if(I=Mt(B,b),I===null)throw Mt(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(b){throw Je("WebGLRenderer: "+b.message),b}let ot,vt,Ce,R,w,O,Z,ee,K,we,fe,Ie,ke,re,ce,Ee,Ae,ge,$e,N,de,ue,ye;function ae(){ot=new VA(I),ot.init(),de=new LC(I,ot),vt=new IA(I,ot,e,de),Ce=new RC(I,ot),vt.reversedDepthBuffer&&f&&Ce.buffers.depth.setReversed(!0),R=new WA(I),w=new mC,O=new PC(I,ot,Ce,w,vt,de,R),Z=new zA(E),ee=new qw(I),ue=new LA(I,ee),K=new HA(I,ee,R,ue),we=new jA(I,K,ee,ue,R),ge=new XA(I,vt,O),ce=new NA(w),fe=new pC(E,Z,ot,vt,ue,ce),Ie=new OC(E,w),ke=new _C,re=new wC(ot),Ae=new PA(E,Z,Ce,we,m,l),Ee=new CC(E,we,vt),ye=new kC(I,R,vt,Ce),$e=new DA(I,ot,R),N=new GA(I,ot,R),R.programs=fe.programs,E.capabilities=vt,E.extensions=ot,E.properties=w,E.renderLists=ke,E.shadowMap=Ee,E.state=Ce,E.info=R}ae(),v!==Dn&&(y=new YA(v,t.width,t.height,r,s));const $=new UC(E,I);this.xr=$,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){const b=ot.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=ot.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return Oe},this.setPixelRatio=function(b){b!==void 0&&(Oe=b,this.setSize(J,te,!1))},this.getSize=function(b){return b.set(J,te)},this.setSize=function(b,B,j=!0){if($.isPresenting){Fe("WebGLRenderer: Can't change size while VR device is presenting.");return}J=b,te=B,t.width=Math.floor(b*Oe),t.height=Math.floor(B*Oe),j===!0&&(t.style.width=b+"px",t.style.height=B+"px"),y!==null&&y.setSize(t.width,t.height),this.setViewport(0,0,b,B)},this.getDrawingBufferSize=function(b){return b.set(J*Oe,te*Oe).floor()},this.setDrawingBufferSize=function(b,B,j){J=b,te=B,Oe=j,t.width=Math.floor(b*j),t.height=Math.floor(B*j),this.setViewport(0,0,b,B)},this.setEffects=function(b){if(v===Dn){console.error("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(b){for(let B=0;B<b.length;B++)if(b[B].isOutputPass===!0){console.warn("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}y.setEffects(b||[])},this.getCurrentViewport=function(b){return b.copy(V)},this.getViewport=function(b){return b.copy(Y)},this.setViewport=function(b,B,j,W){b.isVector4?Y.set(b.x,b.y,b.z,b.w):Y.set(b,B,j,W),Ce.viewport(V.copy(Y).multiplyScalar(Oe).round())},this.getScissor=function(b){return b.copy(se)},this.setScissor=function(b,B,j,W){b.isVector4?se.set(b.x,b.y,b.z,b.w):se.set(b,B,j,W),Ce.scissor(H.copy(se).multiplyScalar(Oe).round())},this.getScissorTest=function(){return le},this.setScissorTest=function(b){Ce.setScissorTest(le=b)},this.setOpaqueSort=function(b){qe=b},this.setTransparentSort=function(b){rt=b},this.getClearColor=function(b){return b.copy(Ae.getClearColor())},this.setClearColor=function(){Ae.setClearColor(...arguments)},this.getClearAlpha=function(){return Ae.getClearAlpha()},this.setClearAlpha=function(){Ae.setClearAlpha(...arguments)},this.clear=function(b=!0,B=!0,j=!0){let W=0;if(b){let G=!1;if(L!==null){const pe=L.texture.format;G=g.has(pe)}if(G){const pe=L.texture.type,_e=p.has(pe),me=Ae.getClearColor(),be=Ae.getClearAlpha(),Pe=me.r,Ge=me.g,Ye=me.b;_e?(_[0]=Pe,_[1]=Ge,_[2]=Ye,_[3]=be,I.clearBufferuiv(I.COLOR,0,_)):(x[0]=Pe,x[1]=Ge,x[2]=Ye,x[3]=be,I.clearBufferiv(I.COLOR,0,x))}else W|=I.COLOR_BUFFER_BIT}B&&(W|=I.DEPTH_BUFFER_BIT),j&&(W|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),W!==0&&I.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Te,!1),t.removeEventListener("webglcontextrestored",ze,!1),t.removeEventListener("webglcontextcreationerror",xt,!1),Ae.dispose(),ke.dispose(),re.dispose(),w.dispose(),Z.dispose(),we.dispose(),ue.dispose(),ye.dispose(),fe.dispose(),$.dispose(),$.removeEventListener("sessionstart",sm),$.removeEventListener("sessionend",om),Nr.stop()};function Te(b){b.preventDefault(),Qc("WebGLRenderer: Context Lost."),D=!0}function ze(){Qc("WebGLRenderer: Context Restored."),D=!1;const b=R.autoReset,B=Ee.enabled,j=Ee.autoUpdate,W=Ee.needsUpdate,G=Ee.type;ae(),R.autoReset=b,Ee.enabled=B,Ee.autoUpdate=j,Ee.needsUpdate=W,Ee.type=G}function xt(b){Je("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function at(b){const B=b.target;B.removeEventListener("dispose",at),Ri(B)}function Ri(b){Pi(b),w.remove(b)}function Pi(b){const B=w.get(b).programs;B!==void 0&&(B.forEach(function(j){fe.releaseProgram(j)}),b.isShaderMaterial&&fe.releaseShaderCache(b))}this.renderBufferDirect=function(b,B,j,W,G,pe){B===null&&(B=st);const _e=G.isMesh&&G.matrixWorld.determinant()<0,me=my(b,B,j,W,G);Ce.setMaterial(W,_e);let be=j.index,Pe=1;if(W.wireframe===!0){if(be=K.getWireframeAttribute(j),be===void 0)return;Pe=2}const Ge=j.drawRange,Ye=j.attributes.position;let De=Ge.start*Pe,pt=(Ge.start+Ge.count)*Pe;pe!==null&&(De=Math.max(De,pe.start*Pe),pt=Math.min(pt,(pe.start+pe.count)*Pe)),be!==null?(De=Math.max(De,0),pt=Math.min(pt,be.count)):Ye!=null&&(De=Math.max(De,0),pt=Math.min(pt,Ye.count));const It=pt-De;if(It<0||It===1/0)return;ue.setup(G,W,me,j,be);let Pt,mt=$e;if(be!==null&&(Pt=ee.get(be),mt=N,mt.setIndex(Pt)),G.isMesh)W.wireframe===!0?(Ce.setLineWidth(W.wireframeLinewidth*Qe()),mt.setMode(I.LINES)):mt.setMode(I.TRIANGLES);else if(G.isLine){let en=W.linewidth;en===void 0&&(en=1),Ce.setLineWidth(en*Qe()),G.isLineSegments?mt.setMode(I.LINES):G.isLineLoop?mt.setMode(I.LINE_LOOP):mt.setMode(I.LINE_STRIP)}else G.isPoints?mt.setMode(I.POINTS):G.isSprite&&mt.setMode(I.TRIANGLES);if(G.isBatchedMesh)if(G._multiDrawInstances!==null)Jc("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),mt.renderMultiDrawInstances(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount,G._multiDrawInstances);else if(ot.get("WEBGL_multi_draw"))mt.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{const en=G._multiDrawStarts,Re=G._multiDrawCounts,bn=G._multiDrawCount,nt=be?ee.get(be).bytesPerElement:1,Kn=w.get(W).currentProgram.getUniforms();for(let di=0;di<bn;di++)Kn.setValue(I,"_gl_DrawID",di),mt.render(en[di]/nt,Re[di])}else if(G.isInstancedMesh)mt.renderInstances(De,It,G.count);else if(j.isInstancedBufferGeometry){const en=j._maxInstanceCount!==void 0?j._maxInstanceCount:1/0,Re=Math.min(j.instanceCount,en);mt.renderInstances(De,It,Re)}else mt.render(De,It)};function rm(b,B,j){b.transparent===!0&&b.side===ri&&b.forceSinglePass===!1?(b.side=En,b.needsUpdate=!0,qa(b,B,j),b.side=br,b.needsUpdate=!0,qa(b,B,j),b.side=ri):qa(b,B,j)}this.compile=function(b,B,j=null){j===null&&(j=b),A=re.get(j),A.init(B),T.push(A),j.traverseVisible(function(G){G.isLight&&G.layers.test(B.layers)&&(A.pushLight(G),G.castShadow&&A.pushShadow(G))}),b!==j&&b.traverseVisible(function(G){G.isLight&&G.layers.test(B.layers)&&(A.pushLight(G),G.castShadow&&A.pushShadow(G))}),A.setupLights();const W=new Set;return b.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;const pe=G.material;if(pe)if(Array.isArray(pe))for(let _e=0;_e<pe.length;_e++){const me=pe[_e];rm(me,j,G),W.add(me)}else rm(pe,j,G),W.add(pe)}),A=T.pop(),W},this.compileAsync=function(b,B,j=null){const W=this.compile(b,B,j);return new Promise(G=>{function pe(){if(W.forEach(function(_e){w.get(_e).currentProgram.isReady()&&W.delete(_e)}),W.size===0){G(b);return}setTimeout(pe,10)}ot.get("KHR_parallel_shader_compile")!==null?pe():setTimeout(pe,10)})};let Cu=null;function py(b){Cu&&Cu(b)}function sm(){Nr.stop()}function om(){Nr.start()}const Nr=new ey;Nr.setAnimationLoop(py),typeof self<"u"&&Nr.setContext(self),this.setAnimationLoop=function(b){Cu=b,$.setAnimationLoop(b),b===null?Nr.stop():Nr.start()},$.addEventListener("sessionstart",sm),$.addEventListener("sessionend",om),this.render=function(b,B){if(B!==void 0&&B.isCamera!==!0){Je("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;const j=$.enabled===!0&&$.isPresenting===!0,W=y!==null&&(L===null||j)&&y.begin(E,L);if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),$.enabled===!0&&$.isPresenting===!0&&(y===null||y.isCompositing()===!1)&&($.cameraAutoUpdate===!0&&$.updateCamera(B),B=$.getCamera()),b.isScene===!0&&b.onBeforeRender(E,b,B,L),A=re.get(b,T.length),A.init(B),T.push(A),ht.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),Me.setFromProjectionMatrix(ht,yi,B.reversedDepth),Ne=this.localClippingEnabled,oe=ce.init(this.clippingPlanes,Ne),S=ke.get(b,M.length),S.init(),M.push(S),$.enabled===!0&&$.isPresenting===!0){const _e=E.xr.getDepthSensingMesh();_e!==null&&Ru(_e,B,-1/0,E.sortObjects)}Ru(b,B,0,E.sortObjects),S.finish(),E.sortObjects===!0&&S.sort(qe,rt),Le=$.enabled===!1||$.isPresenting===!1||$.hasDepthSensing()===!1,Le&&Ae.addToRenderList(S,b),this.info.render.frame++,oe===!0&&ce.beginShadows();const G=A.state.shadowsArray;if(Ee.render(G,b,B),oe===!0&&ce.endShadows(),this.info.autoReset===!0&&this.info.reset(),(W&&y.hasRenderPass())===!1){const _e=S.opaque,me=S.transmissive;if(A.setupLights(),B.isArrayCamera){const be=B.cameras;if(me.length>0)for(let Pe=0,Ge=be.length;Pe<Ge;Pe++){const Ye=be[Pe];lm(_e,me,b,Ye)}Le&&Ae.render(b);for(let Pe=0,Ge=be.length;Pe<Ge;Pe++){const Ye=be[Pe];am(S,b,Ye,Ye.viewport)}}else me.length>0&&lm(_e,me,b,B),Le&&Ae.render(b),am(S,b,B)}L!==null&&F===0&&(O.updateMultisampleRenderTarget(L),O.updateRenderTargetMipmap(L)),W&&y.end(E),b.isScene===!0&&b.onAfterRender(E,b,B),ue.resetDefaultState(),U=-1,z=null,T.pop(),T.length>0?(A=T[T.length-1],oe===!0&&ce.setGlobalState(E.clippingPlanes,A.state.camera)):A=null,M.pop(),M.length>0?S=M[M.length-1]:S=null};function Ru(b,B,j,W){if(b.visible===!1)return;if(b.layers.test(B.layers)){if(b.isGroup)j=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(B);else if(b.isLight)A.pushLight(b),b.castShadow&&A.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||Me.intersectsSprite(b)){W&&Ze.setFromMatrixPosition(b.matrixWorld).applyMatrix4(ht);const _e=we.update(b),me=b.material;me.visible&&S.push(b,_e,me,j,Ze.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||Me.intersectsObject(b))){const _e=we.update(b),me=b.material;if(W&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),Ze.copy(b.boundingSphere.center)):(_e.boundingSphere===null&&_e.computeBoundingSphere(),Ze.copy(_e.boundingSphere.center)),Ze.applyMatrix4(b.matrixWorld).applyMatrix4(ht)),Array.isArray(me)){const be=_e.groups;for(let Pe=0,Ge=be.length;Pe<Ge;Pe++){const Ye=be[Pe],De=me[Ye.materialIndex];De&&De.visible&&S.push(b,_e,De,j,Ze.z,Ye)}}else me.visible&&S.push(b,_e,me,j,Ze.z,null)}}const pe=b.children;for(let _e=0,me=pe.length;_e<me;_e++)Ru(pe[_e],B,j,W)}function am(b,B,j,W){const{opaque:G,transmissive:pe,transparent:_e}=b;A.setupLightsView(j),oe===!0&&ce.setGlobalState(E.clippingPlanes,j),W&&Ce.viewport(V.copy(W)),G.length>0&&Ya(G,B,j),pe.length>0&&Ya(pe,B,j),_e.length>0&&Ya(_e,B,j),Ce.buffers.depth.setTest(!0),Ce.buffers.depth.setMask(!0),Ce.buffers.color.setMask(!0),Ce.setPolygonOffset(!1)}function lm(b,B,j,W){if((j.isScene===!0?j.overrideMaterial:null)!==null)return;if(A.state.transmissionRenderTarget[W.id]===void 0){const De=ot.has("EXT_color_buffer_half_float")||ot.has("EXT_color_buffer_float");A.state.transmissionRenderTarget[W.id]=new Tn(1,1,{generateMipmaps:!0,type:De?Fn:Dn,minFilter:Qr,samples:Math.max(4,vt.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:et.workingColorSpace})}const pe=A.state.transmissionRenderTarget[W.id],_e=W.viewport||V;pe.setSize(_e.z*E.transmissionResolutionScale,_e.w*E.transmissionResolutionScale);const me=E.getRenderTarget(),be=E.getActiveCubeFace(),Pe=E.getActiveMipmapLevel();E.setRenderTarget(pe),E.getClearColor(X),Q=E.getClearAlpha(),Q<1&&E.setClearColor(16777215,.5),E.clear(),Le&&Ae.render(j);const Ge=E.toneMapping;E.toneMapping=Ei;const Ye=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),A.setupLightsView(W),oe===!0&&ce.setGlobalState(E.clippingPlanes,W),Ya(b,j,W),O.updateMultisampleRenderTarget(pe),O.updateRenderTargetMipmap(pe),ot.has("WEBGL_multisampled_render_to_texture")===!1){let De=!1;for(let pt=0,It=B.length;pt<It;pt++){const Pt=B[pt],{object:mt,geometry:en,material:Re,group:bn}=Pt;if(Re.side===ri&&mt.layers.test(W.layers)){const nt=Re.side;Re.side=En,Re.needsUpdate=!0,cm(mt,j,W,en,Re,bn),Re.side=nt,Re.needsUpdate=!0,De=!0}}De===!0&&(O.updateMultisampleRenderTarget(pe),O.updateRenderTargetMipmap(pe))}E.setRenderTarget(me,be,Pe),E.setClearColor(X,Q),Ye!==void 0&&(W.viewport=Ye),E.toneMapping=Ge}function Ya(b,B,j){const W=B.isScene===!0?B.overrideMaterial:null;for(let G=0,pe=b.length;G<pe;G++){const _e=b[G],{object:me,geometry:be,group:Pe}=_e;let Ge=_e.material;Ge.allowOverride===!0&&W!==null&&(Ge=W),me.layers.test(j.layers)&&cm(me,B,j,be,Ge,Pe)}}function cm(b,B,j,W,G,pe){b.onBeforeRender(E,B,j,W,G,pe),b.modelViewMatrix.multiplyMatrices(j.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),G.onBeforeRender(E,B,j,W,b,pe),G.transparent===!0&&G.side===ri&&G.forceSinglePass===!1?(G.side=En,G.needsUpdate=!0,E.renderBufferDirect(j,B,W,G,b,pe),G.side=br,G.needsUpdate=!0,E.renderBufferDirect(j,B,W,G,b,pe),G.side=ri):E.renderBufferDirect(j,B,W,G,b,pe),b.onAfterRender(E,B,j,W,G,pe)}function qa(b,B,j){B.isScene!==!0&&(B=st);const W=w.get(b),G=A.state.lights,pe=A.state.shadowsArray,_e=G.state.version,me=fe.getParameters(b,G.state,pe,B,j),be=fe.getProgramCacheKey(me);let Pe=W.programs;W.environment=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?B.environment:null,W.fog=B.fog;const Ge=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap;W.envMap=Z.get(b.envMap||W.environment,Ge),W.envMapRotation=W.environment!==null&&b.envMap===null?B.environmentRotation:b.envMapRotation,Pe===void 0&&(b.addEventListener("dispose",at),Pe=new Map,W.programs=Pe);let Ye=Pe.get(be);if(Ye!==void 0){if(W.currentProgram===Ye&&W.lightsStateVersion===_e)return fm(b,me),Ye}else me.uniforms=fe.getUniforms(b),b.onBeforeCompile(me,E),Ye=fe.acquireProgram(me,be),Pe.set(be,Ye),W.uniforms=me.uniforms;const De=W.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(De.clippingPlanes=ce.uniform),fm(b,me),W.needsLights=_y(b),W.lightsStateVersion=_e,W.needsLights&&(De.ambientLightColor.value=G.state.ambient,De.lightProbe.value=G.state.probe,De.directionalLights.value=G.state.directional,De.directionalLightShadows.value=G.state.directionalShadow,De.spotLights.value=G.state.spot,De.spotLightShadows.value=G.state.spotShadow,De.rectAreaLights.value=G.state.rectArea,De.ltc_1.value=G.state.rectAreaLTC1,De.ltc_2.value=G.state.rectAreaLTC2,De.pointLights.value=G.state.point,De.pointLightShadows.value=G.state.pointShadow,De.hemisphereLights.value=G.state.hemi,De.directionalShadowMatrix.value=G.state.directionalShadowMatrix,De.spotLightMatrix.value=G.state.spotLightMatrix,De.spotLightMap.value=G.state.spotLightMap,De.pointShadowMatrix.value=G.state.pointShadowMatrix),W.currentProgram=Ye,W.uniformsList=null,Ye}function um(b){if(b.uniformsList===null){const B=b.currentProgram.getUniforms();b.uniformsList=Sc.seqWithValue(B.seq,b.uniforms)}return b.uniformsList}function fm(b,B){const j=w.get(b);j.outputColorSpace=B.outputColorSpace,j.batching=B.batching,j.batchingColor=B.batchingColor,j.instancing=B.instancing,j.instancingColor=B.instancingColor,j.instancingMorph=B.instancingMorph,j.skinning=B.skinning,j.morphTargets=B.morphTargets,j.morphNormals=B.morphNormals,j.morphColors=B.morphColors,j.morphTargetsCount=B.morphTargetsCount,j.numClippingPlanes=B.numClippingPlanes,j.numIntersection=B.numClipIntersection,j.vertexAlphas=B.vertexAlphas,j.vertexTangents=B.vertexTangents,j.toneMapping=B.toneMapping}function my(b,B,j,W,G){B.isScene!==!0&&(B=st),O.resetTextureUnits();const pe=B.fog,_e=W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial?B.environment:null,me=L===null?E.outputColorSpace:L.isXRRenderTarget===!0?L.texture.colorSpace:Mo,be=W.isMeshStandardMaterial||W.isMeshLambertMaterial&&!W.envMap||W.isMeshPhongMaterial&&!W.envMap,Pe=Z.get(W.envMap||_e,be),Ge=W.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,Ye=!!j.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),De=!!j.morphAttributes.position,pt=!!j.morphAttributes.normal,It=!!j.morphAttributes.color;let Pt=Ei;W.toneMapped&&(L===null||L.isXRRenderTarget===!0)&&(Pt=E.toneMapping);const mt=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,en=mt!==void 0?mt.length:0,Re=w.get(W),bn=A.state.lights;if(oe===!0&&(Ne===!0||b!==z)){const Gt=b===z&&W.id===U;ce.setState(W,b,Gt)}let nt=!1;W.version===Re.__version?(Re.needsLights&&Re.lightsStateVersion!==bn.state.version||Re.outputColorSpace!==me||G.isBatchedMesh&&Re.batching===!1||!G.isBatchedMesh&&Re.batching===!0||G.isBatchedMesh&&Re.batchingColor===!0&&G.colorTexture===null||G.isBatchedMesh&&Re.batchingColor===!1&&G.colorTexture!==null||G.isInstancedMesh&&Re.instancing===!1||!G.isInstancedMesh&&Re.instancing===!0||G.isSkinnedMesh&&Re.skinning===!1||!G.isSkinnedMesh&&Re.skinning===!0||G.isInstancedMesh&&Re.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&Re.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&Re.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&Re.instancingMorph===!1&&G.morphTexture!==null||Re.envMap!==Pe||W.fog===!0&&Re.fog!==pe||Re.numClippingPlanes!==void 0&&(Re.numClippingPlanes!==ce.numPlanes||Re.numIntersection!==ce.numIntersection)||Re.vertexAlphas!==Ge||Re.vertexTangents!==Ye||Re.morphTargets!==De||Re.morphNormals!==pt||Re.morphColors!==It||Re.toneMapping!==Pt||Re.morphTargetsCount!==en)&&(nt=!0):(nt=!0,Re.__version=W.version);let Kn=Re.currentProgram;nt===!0&&(Kn=qa(W,B,G));let di=!1,Ur=!1,ps=!1;const _t=Kn.getUniforms(),Yt=Re.uniforms;if(Ce.useProgram(Kn.program)&&(di=!0,Ur=!0,ps=!0),W.id!==U&&(U=W.id,Ur=!0),di||z!==b){Ce.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),_t.setValue(I,"projectionMatrix",b.projectionMatrix),_t.setValue(I,"viewMatrix",b.matrixWorldInverse);const er=_t.map.cameraPosition;er!==void 0&&er.setValue(I,Ve.setFromMatrixPosition(b.matrixWorld)),vt.logarithmicDepthBuffer&&_t.setValue(I,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&_t.setValue(I,"isOrthographic",b.isOrthographicCamera===!0),z!==b&&(z=b,Ur=!0,ps=!0)}if(Re.needsLights&&(bn.state.directionalShadowMap.length>0&&_t.setValue(I,"directionalShadowMap",bn.state.directionalShadowMap,O),bn.state.spotShadowMap.length>0&&_t.setValue(I,"spotShadowMap",bn.state.spotShadowMap,O),bn.state.pointShadowMap.length>0&&_t.setValue(I,"pointShadowMap",bn.state.pointShadowMap,O)),G.isSkinnedMesh){_t.setOptional(I,G,"bindMatrix"),_t.setOptional(I,G,"bindMatrixInverse");const Gt=G.skeleton;Gt&&(Gt.boneTexture===null&&Gt.computeBoneTexture(),_t.setValue(I,"boneTexture",Gt.boneTexture,O))}G.isBatchedMesh&&(_t.setOptional(I,G,"batchingTexture"),_t.setValue(I,"batchingTexture",G._matricesTexture,O),_t.setOptional(I,G,"batchingIdTexture"),_t.setValue(I,"batchingIdTexture",G._indirectTexture,O),_t.setOptional(I,G,"batchingColorTexture"),G._colorsTexture!==null&&_t.setValue(I,"batchingColorTexture",G._colorsTexture,O));const Ji=j.morphAttributes;if((Ji.position!==void 0||Ji.normal!==void 0||Ji.color!==void 0)&&ge.update(G,j,Kn),(Ur||Re.receiveShadow!==G.receiveShadow)&&(Re.receiveShadow=G.receiveShadow,_t.setValue(I,"receiveShadow",G.receiveShadow)),(W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial)&&W.envMap===null&&B.environment!==null&&(Yt.envMapIntensity.value=B.environmentIntensity),Yt.dfgLUT!==void 0&&(Yt.dfgLUT.value=zC()),Ur&&(_t.setValue(I,"toneMappingExposure",E.toneMappingExposure),Re.needsLights&&gy(Yt,ps),pe&&W.fog===!0&&Ie.refreshFogUniforms(Yt,pe),Ie.refreshMaterialUniforms(Yt,W,Oe,te,A.state.transmissionRenderTarget[b.id]),Sc.upload(I,um(Re),Yt,O)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(Sc.upload(I,um(Re),Yt,O),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&_t.setValue(I,"center",G.center),_t.setValue(I,"modelViewMatrix",G.modelViewMatrix),_t.setValue(I,"normalMatrix",G.normalMatrix),_t.setValue(I,"modelMatrix",G.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){const Gt=W.uniformsGroups;for(let er=0,ms=Gt.length;er<ms;er++){const dm=Gt[er];ye.update(dm,Kn),ye.bind(dm,Kn)}}return Kn}function gy(b,B){b.ambientLightColor.needsUpdate=B,b.lightProbe.needsUpdate=B,b.directionalLights.needsUpdate=B,b.directionalLightShadows.needsUpdate=B,b.pointLights.needsUpdate=B,b.pointLightShadows.needsUpdate=B,b.spotLights.needsUpdate=B,b.spotLightShadows.needsUpdate=B,b.rectAreaLights.needsUpdate=B,b.hemisphereLights.needsUpdate=B}function _y(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return F},this.getRenderTarget=function(){return L},this.setRenderTargetTextures=function(b,B,j){const W=w.get(b);W.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,W.__autoAllocateDepthBuffer===!1&&(W.__useRenderToTexture=!1),w.get(b.texture).__webglTexture=B,w.get(b.depthTexture).__webglTexture=W.__autoAllocateDepthBuffer?void 0:j,W.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,B){const j=w.get(b);j.__webglFramebuffer=B,j.__useDefaultFramebuffer=B===void 0};const vy=I.createFramebuffer();this.setRenderTarget=function(b,B=0,j=0){L=b,C=B,F=j;let W=null,G=!1,pe=!1;if(b){const me=w.get(b);if(me.__useDefaultFramebuffer!==void 0){Ce.bindFramebuffer(I.FRAMEBUFFER,me.__webglFramebuffer),V.copy(b.viewport),H.copy(b.scissor),k=b.scissorTest,Ce.viewport(V),Ce.scissor(H),Ce.setScissorTest(k),U=-1;return}else if(me.__webglFramebuffer===void 0)O.setupRenderTarget(b);else if(me.__hasExternalTextures)O.rebindTextures(b,w.get(b.texture).__webglTexture,w.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const Ge=b.depthTexture;if(me.__boundDepthTexture!==Ge){if(Ge!==null&&w.has(Ge)&&(b.width!==Ge.image.width||b.height!==Ge.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");O.setupDepthRenderbuffer(b)}}const be=b.texture;(be.isData3DTexture||be.isDataArrayTexture||be.isCompressedArrayTexture)&&(pe=!0);const Pe=w.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Pe[B])?W=Pe[B][j]:W=Pe[B],G=!0):b.samples>0&&O.useMultisampledRTT(b)===!1?W=w.get(b).__webglMultisampledFramebuffer:Array.isArray(Pe)?W=Pe[j]:W=Pe,V.copy(b.viewport),H.copy(b.scissor),k=b.scissorTest}else V.copy(Y).multiplyScalar(Oe).floor(),H.copy(se).multiplyScalar(Oe).floor(),k=le;if(j!==0&&(W=vy),Ce.bindFramebuffer(I.FRAMEBUFFER,W)&&Ce.drawBuffers(b,W),Ce.viewport(V),Ce.scissor(H),Ce.setScissorTest(k),G){const me=w.get(b.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+B,me.__webglTexture,j)}else if(pe){const me=B;for(let be=0;be<b.textures.length;be++){const Pe=w.get(b.textures[be]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+be,Pe.__webglTexture,j,me)}}else if(b!==null&&j!==0){const me=w.get(b.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,me.__webglTexture,j)}U=-1},this.readRenderTargetPixels=function(b,B,j,W,G,pe,_e,me=0){if(!(b&&b.isWebGLRenderTarget)){Je("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let be=w.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&_e!==void 0&&(be=be[_e]),be){Ce.bindFramebuffer(I.FRAMEBUFFER,be);try{const Pe=b.textures[me],Ge=Pe.format,Ye=Pe.type;if(b.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+me),!vt.textureFormatReadable(Ge)){Je("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!vt.textureTypeReadable(Ye)){Je("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=b.width-W&&j>=0&&j<=b.height-G&&I.readPixels(B,j,W,G,de.convert(Ge),de.convert(Ye),pe)}finally{const Pe=L!==null?w.get(L).__webglFramebuffer:null;Ce.bindFramebuffer(I.FRAMEBUFFER,Pe)}}},this.readRenderTargetPixelsAsync=async function(b,B,j,W,G,pe,_e,me=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let be=w.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&_e!==void 0&&(be=be[_e]),be)if(B>=0&&B<=b.width-W&&j>=0&&j<=b.height-G){Ce.bindFramebuffer(I.FRAMEBUFFER,be);const Pe=b.textures[me],Ge=Pe.format,Ye=Pe.type;if(b.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+me),!vt.textureFormatReadable(Ge))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!vt.textureTypeReadable(Ye))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const De=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,De),I.bufferData(I.PIXEL_PACK_BUFFER,pe.byteLength,I.STREAM_READ),I.readPixels(B,j,W,G,de.convert(Ge),de.convert(Ye),0);const pt=L!==null?w.get(L).__webglFramebuffer:null;Ce.bindFramebuffer(I.FRAMEBUFFER,pt);const It=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await z1(I,It,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,De),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,pe),I.deleteBuffer(De),I.deleteSync(It),pe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,B=null,j=0){const W=Math.pow(2,-j),G=Math.floor(b.image.width*W),pe=Math.floor(b.image.height*W),_e=B!==null?B.x:0,me=B!==null?B.y:0;O.setTexture2D(b,0),I.copyTexSubImage2D(I.TEXTURE_2D,j,0,0,_e,me,G,pe),Ce.unbindTexture()};const xy=I.createFramebuffer(),yy=I.createFramebuffer();this.copyTextureToTexture=function(b,B,j=null,W=null,G=0,pe=0){let _e,me,be,Pe,Ge,Ye,De,pt,It;const Pt=b.isCompressedTexture?b.mipmaps[pe]:b.image;if(j!==null)_e=j.max.x-j.min.x,me=j.max.y-j.min.y,be=j.isBox3?j.max.z-j.min.z:1,Pe=j.min.x,Ge=j.min.y,Ye=j.isBox3?j.min.z:0;else{const Yt=Math.pow(2,-G);_e=Math.floor(Pt.width*Yt),me=Math.floor(Pt.height*Yt),b.isDataArrayTexture?be=Pt.depth:b.isData3DTexture?be=Math.floor(Pt.depth*Yt):be=1,Pe=0,Ge=0,Ye=0}W!==null?(De=W.x,pt=W.y,It=W.z):(De=0,pt=0,It=0);const mt=de.convert(B.format),en=de.convert(B.type);let Re;B.isData3DTexture?(O.setTexture3D(B,0),Re=I.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(O.setTexture2DArray(B,0),Re=I.TEXTURE_2D_ARRAY):(O.setTexture2D(B,0),Re=I.TEXTURE_2D),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,B.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,B.unpackAlignment);const bn=I.getParameter(I.UNPACK_ROW_LENGTH),nt=I.getParameter(I.UNPACK_IMAGE_HEIGHT),Kn=I.getParameter(I.UNPACK_SKIP_PIXELS),di=I.getParameter(I.UNPACK_SKIP_ROWS),Ur=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,Pt.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,Pt.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Pe),I.pixelStorei(I.UNPACK_SKIP_ROWS,Ge),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Ye);const ps=b.isDataArrayTexture||b.isData3DTexture,_t=B.isDataArrayTexture||B.isData3DTexture;if(b.isDepthTexture){const Yt=w.get(b),Ji=w.get(B),Gt=w.get(Yt.__renderTarget),er=w.get(Ji.__renderTarget);Ce.bindFramebuffer(I.READ_FRAMEBUFFER,Gt.__webglFramebuffer),Ce.bindFramebuffer(I.DRAW_FRAMEBUFFER,er.__webglFramebuffer);for(let ms=0;ms<be;ms++)ps&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,w.get(b).__webglTexture,G,Ye+ms),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,w.get(B).__webglTexture,pe,It+ms)),I.blitFramebuffer(Pe,Ge,_e,me,De,pt,_e,me,I.DEPTH_BUFFER_BIT,I.NEAREST);Ce.bindFramebuffer(I.READ_FRAMEBUFFER,null),Ce.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(G!==0||b.isRenderTargetTexture||w.has(b)){const Yt=w.get(b),Ji=w.get(B);Ce.bindFramebuffer(I.READ_FRAMEBUFFER,xy),Ce.bindFramebuffer(I.DRAW_FRAMEBUFFER,yy);for(let Gt=0;Gt<be;Gt++)ps?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Yt.__webglTexture,G,Ye+Gt):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Yt.__webglTexture,G),_t?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Ji.__webglTexture,pe,It+Gt):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Ji.__webglTexture,pe),G!==0?I.blitFramebuffer(Pe,Ge,_e,me,De,pt,_e,me,I.COLOR_BUFFER_BIT,I.NEAREST):_t?I.copyTexSubImage3D(Re,pe,De,pt,It+Gt,Pe,Ge,_e,me):I.copyTexSubImage2D(Re,pe,De,pt,Pe,Ge,_e,me);Ce.bindFramebuffer(I.READ_FRAMEBUFFER,null),Ce.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else _t?b.isDataTexture||b.isData3DTexture?I.texSubImage3D(Re,pe,De,pt,It,_e,me,be,mt,en,Pt.data):B.isCompressedArrayTexture?I.compressedTexSubImage3D(Re,pe,De,pt,It,_e,me,be,mt,Pt.data):I.texSubImage3D(Re,pe,De,pt,It,_e,me,be,mt,en,Pt):b.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,pe,De,pt,_e,me,mt,en,Pt.data):b.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,pe,De,pt,Pt.width,Pt.height,mt,Pt.data):I.texSubImage2D(I.TEXTURE_2D,pe,De,pt,_e,me,mt,en,Pt);I.pixelStorei(I.UNPACK_ROW_LENGTH,bn),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,nt),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Kn),I.pixelStorei(I.UNPACK_SKIP_ROWS,di),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Ur),pe===0&&B.generateMipmaps&&I.generateMipmap(Re),Ce.unbindTexture()},this.initRenderTarget=function(b){w.get(b).__webglFramebuffer===void 0&&O.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?O.setTextureCube(b,0):b.isData3DTexture?O.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?O.setTexture2DArray(b,0):O.setTexture2D(b,0),Ce.unbindTexture()},this.resetState=function(){C=0,F=0,L=null,Ce.reset(),ue.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return yi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=et._getDrawingBufferColorSpace(e),t.unpackColorSpace=et._getUnpackColorSpace()}}const Mc={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class $a{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const HC=new Eu(-1,1,1,-1,0,1);class GC extends He{constructor(){super(),this.setAttribute("position",new St([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new St([0,2,0,0,2,0],2))}}const WC=new GC;class oy{constructor(e){this._mesh=new mn(WC,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,HC)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class XC extends $a{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof Tt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=iu.clone(e.uniforms),this.material=new Tt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new oy(this.material)}render(e,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class F_ extends $a{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,i){const r=e.getContext(),s=e.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0);let o,c;this.inverse?(o=0,c=1):(o=1,c=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),s.buffers.stencil.setFunc(r.ALWAYS,o,4294967295),s.buffers.stencil.setClear(c),s.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(r.EQUAL,1,4294967295),s.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),s.buffers.stencil.setLocked(!0)}}class jC extends $a{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class $C{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const i=e.getSize(new xe);this._width=i.width,this._height=i.height,t=new Tn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Fn}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new XC(Mc),this.copyPass.material.blending=wi,this.timer=new Xw}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());const t=this.renderer.getRenderTarget();let i=!1;for(let r=0,s=this.passes.length;r<s;r++){const o=this.passes[r];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(r),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),o.needsSwap){if(i){const c=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(c.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(c.EQUAL,1,4294967295)}this.swapBuffers()}F_!==void 0&&(o instanceof F_?i=!0:o instanceof jC&&(i=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new xe);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const i=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(i,r),this.renderTarget2.setSize(i,r);for(let s=0;s<this.passes.length;s++)this.passes[s].setSize(i,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class YC extends $a{constructor(e,t,i=null,r=null,s=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=i,this.clearColor=r,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new ne}render(e,t,i){const r=e.autoClear;e.autoClear=!1;let s,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(s=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(s),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=r}}const qC={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new ne(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class To extends $a{constructor(e,t=1,i,r){super(),this.strength=t,this.radius=i,this.threshold=r,this.resolution=e!==void 0?new xe(e.x,e.y):new xe(256,256),this.clearColor=new ne(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let s=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new Tn(s,o,{type:Fn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){const a=new Tn(s,o,{type:Fn});a.texture.name="UnrealBloomPass.h"+d,a.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(a);const f=new Tn(s,o,{type:Fn});f.texture.name="UnrealBloomPass.v"+d,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),s=Math.round(s/2),o=Math.round(o/2)}const c=qC;this.highPassUniforms=iu.clone(c.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Tt({uniforms:this.highPassUniforms,vertexShader:c.vertexShader,fragmentShader:c.fragmentShader}),this.separableBlurMaterials=[];const l=[6,10,14,18,22];s=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new xe(1/s,1/o),s=Math.round(s/2),o=Math.round(o/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const u=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=u,this.bloomTintColors=[new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=iu.clone(Mc.uniforms),this.blendMaterial=new Tt({uniforms:this.copyUniforms,vertexShader:Mc.vertexShader,fragmentShader:Mc.fragmentShader,premultipliedAlpha:!0,blending:it,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new ne,this._oldClearAlpha=1,this._basic=new wo,this._fsQuad=new oy(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let i=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(i,r);for(let s=0;s<this.nMips;s++)this.renderTargetsHorizontal[s].setSize(i,r),this.renderTargetsVertical[s].setSize(i,r),this.separableBlurMaterials[s].uniforms.invSize.value=new xe(1/i,1/r),i=Math.round(i/2),r=Math.round(r/2)}render(e,t,i,r,s){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),s&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=i.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let c=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=c.texture,this.separableBlurMaterials[l].uniforms.direction.value=To.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=To.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this._fsQuad.render(e),c=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,s&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=o}_getSeparableBlurMaterial(e){const t=[],i=e/3;for(let r=0;r<e;r++)t.push(.39894*Math.exp(-.5*r*r/(i*i))/i);return new Tt({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new xe(.5,.5)},direction:{value:new xe(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`

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

				}`})}}To.BlurDirectionX=new xe(1,0);To.BlurDirectionY=new xe(0,1);const O_={type:"change"},nm={type:"start"},ay={type:"end"},Ql=new Mu,k_=new ur,KC=Math.cos(70*rw.DEG2RAD),kt=new P,vn=2*Math.PI,gt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Gf=1e-6;class ZC extends $w{constructor(e,t=null){super(e,t),this.state=gt.NONE,this.target=new P,this.cursor=new P,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:ao.ROTATE,MIDDLE:ao.DOLLY,RIGHT:ao.PAN},this.touches={ONE:eo.ROTATE,TWO:eo.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new P,this._lastQuaternion=new Cr,this._lastTargetPosition=new P,this._quat=new Cr().setFromUnitVectors(e.up,new P(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new f_,this._sphericalDelta=new f_,this._scale=1,this._panOffset=new P,this._rotateStart=new xe,this._rotateEnd=new xe,this._rotateDelta=new xe,this._panStart=new xe,this._panEnd=new xe,this._panDelta=new xe,this._dollyStart=new xe,this._dollyEnd=new xe,this._dollyDelta=new xe,this._dollyDirection=new P,this._mouse=new xe,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=JC.bind(this),this._onPointerDown=QC.bind(this),this._onPointerUp=eR.bind(this),this._onContextMenu=aR.bind(this),this._onMouseWheel=iR.bind(this),this._onKeyDown=rR.bind(this),this._onTouchStart=sR.bind(this),this._onTouchMove=oR.bind(this),this._onMouseDown=tR.bind(this),this._onMouseMove=nR.bind(this),this._interceptControlDown=lR.bind(this),this._interceptControlUp=cR.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(O_),this.update(),this.state=gt.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){const t=this.object.position;kt.copy(t).sub(this.target),kt.applyQuaternion(this._quat),this._spherical.setFromVector3(kt),this.autoRotate&&this.state===gt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(i)&&isFinite(r)&&(i<-Math.PI?i+=vn:i>Math.PI&&(i-=vn),r<-Math.PI?r+=vn:r>Math.PI&&(r-=vn),i<=r?this._spherical.theta=Math.max(i,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+r)/2?Math.max(i,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let s=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),s=o!=this._spherical.radius}if(kt.setFromSpherical(this._spherical),kt.applyQuaternion(this._quatInverse),t.copy(this.target).add(kt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const c=kt.length();o=this._clampDistance(c*this._scale);const l=c-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),s=!!l}else if(this.object.isOrthographicCamera){const c=new P(this._mouse.x,this._mouse.y,0);c.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),s=l!==this.object.zoom;const u=new P(this._mouse.x,this._mouse.y,0);u.unproject(this.object),this.object.position.sub(u).add(c),this.object.updateMatrixWorld(),o=kt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Ql.origin.copy(this.object.position),Ql.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Ql.direction))<KC?this.object.lookAt(this.target):(k_.setFromNormalAndCoplanarPoint(this.object.up,this.target),Ql.intersectPlane(k_,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),s=!0)}return this._scale=1,this._performCursorZoom=!1,s||this._lastPosition.distanceToSquared(this.object.position)>Gf||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Gf||this._lastTargetPosition.distanceToSquared(this.target)>Gf?(this.dispatchEvent(O_),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?vn/60*this.autoRotateSpeed*e:vn/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){kt.setFromMatrixColumn(t,0),kt.multiplyScalar(-e),this._panOffset.add(kt)}_panUp(e,t){this.screenSpacePanning===!0?kt.setFromMatrixColumn(t,1):(kt.setFromMatrixColumn(t,0),kt.crossVectors(this.object.up,kt)),kt.multiplyScalar(e),this._panOffset.add(kt)}_pan(e,t){const i=this.domElement;if(this.object.isPerspectiveCamera){const r=this.object.position;kt.copy(r).sub(this.target);let s=kt.length();s*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*s/i.clientHeight,this.object.matrix),this._panUp(2*t*s/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),r=e-i.left,s=t-i.top,o=i.width,c=i.height;this._mouse.x=r/o*2-1,this._mouse.y=-(s/c)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(vn*this._rotateDelta.x/t.clientHeight),this._rotateUp(vn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(vn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-vn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(vn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-vn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._rotateStart.set(i,r)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panStart.set(i,r)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,r=e.pageY-t.y,s=Math.sqrt(i*i+r*r);this._dollyStart.set(0,s)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),r=.5*(e.pageX+i.x),s=.5*(e.pageY+i.y);this._rotateEnd.set(r,s)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(vn*this._rotateDelta.x/t.clientHeight),this._rotateUp(vn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panEnd.set(i,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,r=e.pageY-t.y,s=Math.sqrt(i*i+r*r);this._dollyEnd.set(0,s),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(e.pageX+t.x)*.5,c=(e.pageY+t.y)*.5;this._updateZoomParameters(o,c)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new xe,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function QC(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function JC(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function eR(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(ay),this.state=gt.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function tR(n){let e;switch(n.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case ao.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=gt.DOLLY;break;case ao.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=gt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=gt.ROTATE}break;case ao.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=gt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=gt.PAN}break;default:this.state=gt.NONE}this.state!==gt.NONE&&this.dispatchEvent(nm)}function nR(n){switch(this.state){case gt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case gt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case gt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function iR(n){this.enabled===!1||this.enableZoom===!1||this.state!==gt.NONE||(n.preventDefault(),this.dispatchEvent(nm),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(ay))}function rR(n){this.enabled!==!1&&this._handleKeyDown(n)}function sR(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case eo.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=gt.TOUCH_ROTATE;break;case eo.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=gt.TOUCH_PAN;break;default:this.state=gt.NONE}break;case 2:switch(this.touches.TWO){case eo.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=gt.TOUCH_DOLLY_PAN;break;case eo.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=gt.TOUCH_DOLLY_ROTATE;break;default:this.state=gt.NONE}break;default:this.state=gt.NONE}this.state!==gt.NONE&&this.dispatchEvent(nm)}function oR(n){switch(this._trackPointer(n),this.state){case gt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case gt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case gt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case gt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=gt.NONE}}function aR(n){this.enabled!==!1&&n.preventDefault()}function lR(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function cR(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function uR(n,e,t,i,r=.6){const s=document.createElement("canvas");s.width=s.height=i;const o=s.getContext("2d"),c=i/2,l=o.createRadialGradient(c,c,0,c,c,c);return l.addColorStop(0,`rgba(${n},${e},${t},${r})`),l.addColorStop(.2,`rgba(${n},${e},${t},${r*.6})`),l.addColorStop(.5,`rgba(${n},${e},${t},${r*.2})`),l.addColorStop(1,`rgba(${n},${e},${t},0)`),o.fillStyle=l,o.fillRect(0,0,i,i),new hs(s)}function fR(n,e,t,i,r=.4,s=.6){const l=document.createElement("canvas");l.width=48,l.height=800;const u=l.getContext("2d"),d=u.createImageData(48,800),a=d.data,f=48/2;for(let h=0;h<800;h++){const m=h/800;let v;if(m<r){const g=m/r;v=g*g}else if(m>s){const g=(m-s)/(1-s);v=(1-g)*(1-g)}else v=1;for(let g=0;g<48;g++){const p=(g-f)/24,_=Math.exp(-p*p*3),x=v*_*i,S=(h*48+g)*4;a[S]=n,a[S+1]=e,a[S+2]=t,a[S+3]=Math.round(x*255)}}return u.putImageData(d,0,0),new hs(l)}function dR(){const e=document.createElement("canvas");e.width=e.height=8;const t=e.getContext("2d"),i=8/2,r=t.createRadialGradient(i,i,0,i,i,i);return r.addColorStop(0,"rgba(180,190,220,0.9)"),r.addColorStop(.4,"rgba(180,190,220,0.3)"),r.addColorStop(1,"rgba(180,190,220,0)"),t.fillStyle=r,t.fillRect(0,0,8,8),new hs(e)}const Wf=[{r:0,g:180,b:160,peakAlpha:.25,peakStart:.35,peakEnd:.55},{r:40,g:80,b:200,peakAlpha:.2,peakStart:.4,peakEnd:.6},{r:100,g:40,b:180,peakAlpha:.18,peakStart:.45,peakEnd:.65},{r:0,g:200,b:100,peakAlpha:.15,peakStart:.38,peakEnd:.58},{r:180,g:40,b:80,peakAlpha:.12,peakStart:.42,peakEnd:.62},{r:30,g:120,b:190,peakAlpha:.16,peakStart:.36,peakEnd:.56}];function hR(n){return[n>>16&255,n>>8&255,n&255]}function Vn(n,e){return Math.random()*(e-n)+n}class pR{constructor(){this.auroras=[],this.elapsed=0,this.group=new li,this.buildStarSphere(),this.buildAuroraCurtains()}buildStarSphere(){const i=new Float32Array(2400),r=new Float32Array(800);for(let l=0;l<800;l++){const u=Math.random()*Math.PI*2,d=Math.acos(2*Math.random()-1);i[l*3]=1500*Math.sin(d)*Math.cos(u),i[l*3+1]=1500*Math.sin(d)*Math.sin(u),i[l*3+2]=1500*Math.cos(d),r[l]=l<30?Vn(2.5,4.5):Vn(1,2.5)}const s=new He;s.setAttribute("position",new Be(i,3)),s.setAttribute("size",new Be(r,1));const o=dR();this.starsMat=new Wa({map:o,transparent:!0,blending:it,depthWrite:!1,size:3,sizeAttenuation:!1,opacity:.7});const c=new Rr(s,this.starsMat);this.group.add(c)}buildAuroraCurtains(){for(let e=0;e<Wf.length;e++){const t=Wf[e],i=fR(t.r,t.g,t.b,t.peakAlpha,t.peakStart,t.peakEnd),r=Vn(120,250),s=Vn(500,800),o=new ja(r,s),c=new wo({map:i,transparent:!0,blending:it,depthWrite:!1,side:ri}),l=new mn(o,c),u=Vn(.08,.18);c.opacity=u;const d=(e/Wf.length-.5)*Math.PI*1.2,a=Vn(500,800);l.position.set(Math.sin(d)*a,Vn(-100,150),-Math.cos(d)*a),l.lookAt(0,l.position.y*.5,0),l.rotation.z+=Vn(-.15,.15),this.group.add(l),this.auroras.push({mesh:l,material:c,baseAlpha:u,phase:Vn(0,Math.PI*2),alphaPhase:Vn(0,Math.PI*2),swayAxis:new P(Vn(-1,1),1,Vn(-.5,.5)).normalize()})}}tick(e){this.elapsed+=Math.min(e,.05);const t=this.elapsed;for(const i of this.auroras){const r=Math.sin(t*.06+i.phase)*5;i.mesh.position.addScaledVector(i.swayAxis,r*e),i.material.opacity=i.baseAlpha*(.92+.08*Math.sin(t*.1+i.alphaPhase))}this.starsMat.opacity=.6+.15*Math.sin(t*.25)}dispose(){this.group.traverse(e=>{(e instanceof mn||e instanceof Rr)&&(e.geometry.dispose(),Array.isArray(e.material)?e.material.forEach(t=>t.dispose()):e.material.dispose())})}}class mR{constructor(e="unknown"){this.activity=0,this.group=new li,this.seed=Math.random()*100;const t=Eg(e),i=pl[t]||pl.unknown;this.color=new ne(i.glow);const r=new ka(8,1),s=new o_(r),o=new pn({color:this.color,transparent:!0,opacity:.4});this.icoWire=new Oh(s,o),this.group.add(this.icoWire);const c=new ka(5,1),l=new o_(c),u=new pn({color:new ne(1,1,1),transparent:!0,opacity:.25});this.icoWireInner=new Oh(l,u),this.group.add(this.icoWireInner);const[d,a,f]=hR(i.glow),h=uR(d,a,f,128,.3);this.glowMaterial=new Su({map:h,blending:it,transparent:!0,depthWrite:!1}),this.glowSprite=new Qp(this.glowMaterial),this.glowSprite.scale.set(25,25,1),this.group.add(this.glowSprite),this.coreLight=new Vw(i.glow,2,80,2),this.group.add(this.coreLight)}triggerActivity(){this.activity=Math.min(1,this.activity+.5)}setModel(e){const t=Eg(e),i=pl[t]||pl.unknown;this.color=new ne(i.glow),this.icoWire.material.color.copy(this.color),this.coreLight.color.copy(this.color)}tick(e,t){this.activity=Math.max(0,this.activity-e*.6),this.icoWire.rotation.y+=e*.12,this.icoWire.rotation.x+=e*.05,this.icoWireInner.rotation.y-=e*.18,this.icoWireInner.rotation.z+=e*.08,this.icoWire.rotation.y+=e*.3*this.activity,this.icoWireInner.rotation.y-=e*.5*this.activity;const i=1+.08*Math.sin(t*.5+this.seed),r=1+this.activity*.4;this.glowSprite.scale.set(25*i*r,25*i*r,1),this.glowMaterial.opacity=.3+this.activity*.3,this.coreLight.intensity=2+this.activity*4+Math.sin(t*.8)*.3,this.icoWire.material.opacity=.4+this.activity*.3,this.icoWireInner.material.opacity=.25+this.activity*.25}dispose(){var e;this.icoWire.geometry.dispose(),this.icoWire.material.dispose(),this.icoWireInner.geometry.dispose(),this.icoWireInner.material.dispose(),(e=this.glowMaterial.map)==null||e.dispose(),this.glowMaterial.dispose()}}function Se(n,e){return Math.random()*(e-n)+n}function im(){const n=Math.random()*Math.PI*2,e=Math.acos(2*Math.random()-1);return new P(Math.sin(e)*Math.cos(n),Math.sin(e)*Math.sin(n),Math.cos(e))}function An(n,e){const t=(Math.random()-.5)*2,i=(Math.random()-.5)*2,r=(Math.random()-.5)*2,s=n+(e-n)*Math.pow(Math.random(),.6),o=n+(e-n)*Math.pow(Math.random(),.6),c=n+(e-n)*Math.pow(Math.random(),.6);return new P(t*s*Se(.4,2.5),i*o*Se(.1,.5),r*c*Se(.4,2.5))}function Ki(n){return(Math.abs(n.y)<.9?new P(0,1,0):new P(1,0,0)).clone().cross(n).normalize()}const Ci=new P(0,0,0);function Qi(n=4){return new P((Math.random()-.5)*n,(Math.random()-.5)*n,(Math.random()-.5)*n)}function gR(n,e,t){const i=(n==null?void 0:n.clone())??An(40,100),r=Qi(),s=new P().addVectors(i,r).multiplyScalar(.5),o=new P(s.x+(Math.random()-.5)*80,s.y+(Math.random()-.5)*80,s.z+(Math.random()-.5)*80);return{origin:i,target:r,color:new ne("#fcd34d"),colorEnd:new ne("#fef9c3"),travelTime:Se(2.8,4),trailLength:Se(.2,.3),trailBrightness:Se(2,2.6),trailFadeTime:Se(22,28),headSize:0,pathConfig:{type:"quadratic",easing:"easeInCubic",c1:o},_tool:"Read"}}function _R(n,e,t){const i=(n==null?void 0:n.clone())??An(40,80),r=i.clone().normalize(),s=i.length(),o=Ki(r),c=r.clone().multiplyScalar(s*1.6).add(o.clone().multiplyScalar(Se(12,22))),l=i.clone().add(r.clone().multiplyScalar(-10)),u={origin:i.clone(),target:Qi(),color:new ne("#a0d0ff"),colorEnd:new ne("#ffffff"),travelTime:Se(.9,1.4),trailLength:.32,trailBrightness:.9,trailFadeTime:10,headSize:3,pathConfig:{type:"linear",easing:"easeInCubic"},_tool:"Edit:return"};return{origin:Ci.clone(),target:i,color:new ne("#60a5fa"),colorEnd:new ne("#a0d0ff"),travelTime:Se(1.8,2.5),trailLength:.28,trailBrightness:1.3,trailFadeTime:8,headSize:4,pathConfig:{type:"cubic",easing:"easeInOut",c1:c,c2:l},pendingSpawn:u,_tool:"Edit"}}function vR(n,e,t){const i=(n==null?void 0:n.clone())??An(90,190),r=i.clone().normalize(),s=i.length(),o=r.clone().multiplyScalar(s*.45).add(Ki(r).multiplyScalar(Se(0,6)));return Array.from({length:5},(c,l)=>{const u=im();return u.y*=.3,u.normalize(),{origin:i.clone().add(new P(Se(-1,1),Se(-1,1),Se(-1,1))),target:i.clone().add(u.multiplyScalar(Se(8,22))),color:new ne("#b0d4ff"),colorEnd:new ne("#b0d4ff"),travelTime:Se(.5,1),trailLength:.5,trailBrightness:1.1,trailFadeTime:14,headSize:3,spawnDelay:l*.04,pathConfig:{type:"linear",easing:"easeOutCubic"},_tool:"Write:scatter"}}),{origin:Ci.clone(),target:i,color:new ne("#60a5fa"),colorEnd:new ne("#bfdbfe"),travelTime:Se(2.8,4),trailLength:.55,trailBrightness:2.2,trailFadeTime:Se(22,28),headSize:0,pathConfig:{type:"quadratic",easing:"easeInCubic",c1:o},_tool:"Write"}}function xR(n,e,t){const i=An(20,90),r=i.clone().normalize(),s=i.length();return{origin:new P(Se(-2,2),Se(-2,2),Se(-2,2)),target:i,color:new ne("#f59e0b"),colorEnd:new ne("#f97316"),travelTime:Se(2.2,3.2),trailLength:.45,trailBrightness:2,trailFadeTime:Se(20,28),headSize:0,pathConfig:{type:"noise",easing:"easeOutCubic",c1:r.clone().multiplyScalar(s*.5).add(Ki(r).multiplyScalar(Se(-20,20))),noiseAmp:Se(8,20),noiseFreq:Se(3,8),noisePhase:Se(0,Math.PI*2)},_tool:n===0?"Bash:first":"Bash"}}function ly(n=0){const e=im();e.y*=.1,e.normalize();const t=Se(55,130),i=e.clone().multiplyScalar(t);i.y*=.15;const r=Ki(e),s=e.clone().multiplyScalar(t*.5).add(r.clone().multiplyScalar(Se(-15,15)));return{origin:Ci.clone(),target:i,color:new ne("#c4b5fd"),colorEnd:new ne("#e9d5ff"),travelTime:Se(.9,1.4),trailLength:0,trailBrightness:0,trailFadeTime:Se(14,20),headSize:0,pathConfig:{type:"quadratic",easing:"easeInOut",c1:s},_tool:"Glob"}}function yR(n,e,t){const i=(n==null?void 0:n.clone())??void 0,r=i?i.length()*Se(.85,1.1):Se(55,115),s=Se(Math.PI/3,Math.PI*.75),o=i?i.clone().normalize().applyAxisAngle(new P(0,1,0),Se(-.4,.4)):(()=>{const f=im();return f.y*=.1,f.normalize()})(),l=Ki(o).clone().multiplyScalar(r),u=Math.atan2(-l.z,-l.x),d=i??new P(l.x+Math.cos(u+s)*r,l.y*Se(.08,.25),l.z+Math.sin(u+s)*r),a={origin:d.clone(),target:Qi(),color:new ne("#e879f9"),colorEnd:new ne("#ffffff"),travelTime:Se(.7,1.1),trailLength:.25,trailBrightness:1.5,trailFadeTime:8,headSize:5,pathConfig:{type:"linear",easing:"easeInCubic"},_tool:"Grep:return"};return{origin:Ci.clone(),target:d,color:new ne("#e879f9"),colorEnd:new ne("#e879f9"),travelTime:Se(6,9),trailLength:.9,trailBrightness:1,trailFadeTime:16,headSize:0,pathConfig:{type:"arc",easing:"linear",arcCenter:l,arcStartAngle:u,arcSweepAngle:s,arcRadius:r},pendingSpawn:a,_tool:"Grep"}}function SR(n,e){const t=An(200,350),i=t.clone().normalize(),r=t.length(),s=Ki(i),o=i.clone().cross(s).normalize(),c=i.clone().multiplyScalar(r*.2).addScaledVector(s,Se(60,120)).addScaledVector(o,Se(-40,40)),l=i.clone().multiplyScalar(r*.7).addScaledVector(s,Se(-30,60)).addScaledVector(o,Se(-20,20)),u=Ki(i.clone().negate()),d={origin:t.clone(),target:Qi(),color:new ne("#f43f5e"),colorEnd:new ne("#fb7185"),travelTime:Se(4,7),trailLength:.7,trailBrightness:1.2,trailFadeTime:20,headSize:3,pathConfig:{type:"cubic",easing:"easeOutCubic",c1:t.clone().add(i.clone().negate().multiplyScalar(r*.3)).addScaledVector(u,Se(-80,80)),c2:t.clone().add(i.clone().negate().multiplyScalar(r*.7)).addScaledVector(u,Se(-40,40))},_tool:"WebFetch:echo"};return{origin:Ci.clone(),target:t,color:new ne("#fb7185"),colorEnd:new ne("#fda4af"),travelTime:Se(6,10),trailLength:.92,trailBrightness:.8,trailFadeTime:25,headSize:4,pathConfig:{type:"cubic",easing:"easeOutCubic",c1:c,c2:l},pendingSpawn:d,_tool:"WebFetch"}}function MR(n){return{origin:An(250,400),target:Qi(),color:new ne("#c8e0ff"),colorEnd:new ne("#ffffff"),travelTime:Se(2,3.5),trailLength:.06,trailBrightness:1.8,trailFadeTime:18,headSize:0,pathConfig:{type:"linear",easing:"easeInCubic"},_tool:"prompt"}}function wR(n){return{origin:Qi(),target:An(80,180),color:new ne("#7eb8f0"),colorEnd:new ne("#aad4ff"),travelTime:Se(2,3.5),trailLength:0,trailBrightness:0,trailFadeTime:12,headSize:0,pathConfig:{type:"linear",easing:"easeOutQuart"},_tool:"response"}}function ER(){const n=An(15,45),e=Qi(),t=n.clone().lerp(e,.5);return t.y-=Se(12,25),{origin:n,target:e,color:new ne("#777777"),colorEnd:new ne("#222222"),travelTime:Se(7,11),trailLength:.2,trailBrightness:.35,trailFadeTime:12,headSize:3,pathConfig:{type:"quadratic",easing:"easeOutThenIn",c1:t},_tool:"Stop"}}function TR(){return{origin:An(80,150),target:Qi(),color:new ne("#FFD060"),colorEnd:new ne("#ffffff"),travelTime:Se(.8,1.5),trailLength:0,trailBrightness:0,trailFadeTime:5,headSize:0,pathConfig:{type:"linear",easing:"easeInPow25"},_tool:"compact:pre"}}function AR(n){return{origin:Qi(),target:An(70,160),color:new ne("#FFE080"),colorEnd:new ne("#FFE080"),travelTime:Se(2.5,4),trailLength:0,trailBrightness:0,trailFadeTime:15,headSize:0,pathConfig:{type:"linear",easing:"easeOutQuart"},_tool:"compact:post"}}function bR(){const n=An(25,50),e=n.clone().normalize(),t=n.length(),i=e.clone().multiplyScalar(t*.5).add(Ki(e).multiplyScalar(Se(-12,12)));return{origin:Ci.clone(),target:n,color:new ne("#f87171"),colorEnd:new ne("#991111"),travelTime:Se(1.2,2),trailLength:.42,trailBrightness:2.5,trailFadeTime:8,headSize:6,stallAt:Se(.55,.65),stallDuration:Se(.3,.6),pathConfig:{type:"noise",easing:"linear",c1:i,noiseAmp:Se(4,8),noiseFreq:Se(12,20),noisePhase:Se(0,Math.PI*2)},_tool:"error"}}function CR(){return{origin:Ci.clone(),target:Ci.clone(),color:new ne("#34d399"),colorEnd:new ne("#34d399"),travelTime:999,trailLength:0,trailBrightness:0,trailFadeTime:8,headSize:0,pathConfig:{type:"linear",easing:"linear"},_tool:"Notification"}}function RR(){const n=An(80,165),e=An(6,18),t=n.clone().lerp(Ci,.4).add(Ki(n.clone().normalize()).multiplyScalar(Se(14,32)));return{origin:n,target:e,color:new ne("#c084fc"),colorEnd:new ne("#c084fc"),travelTime:Se(5,7.5),trailLength:.48,trailBrightness:1,trailFadeTime:14,headSize:5,pathConfig:{type:"quadratic",easing:"easeOutThenIn",c1:t},_tool:"SubagentStop"}}function PR(n){return{origin:Ci.clone(),target:An(30,90),color:new ne(n),colorEnd:new ne(n),travelTime:Se(3,5),trailLength:.45,trailBrightness:1,trailFadeTime:10,headSize:5,pathConfig:{type:"linear",easing:"easeOutCubic"},_tool:"default"}}function B_(n,e,t=0,i,r,s){switch(n){case"Read":return gR(i);case"Edit":return _R(i);case"Write":return vR(i);case"Bash":return xR(t);case"Glob":return ly();case"Grep":return yR(i);case"WebFetch":return SR();case"prompt":return MR();case"response":return wR();case"Stop":return ER();case"compact:pre":return TR();case"compact:post":return AR();case"error":return bR();case"Notification":return CR();case"SubagentStop":return RR();default:return PR(e)}}function wc(n,e){switch(n){case"easeOutCubic":return 1-Math.pow(1-e,3);case"easeOutQuart":return 1-Math.pow(1-e,4);case"easeInQuad":return e*e;case"easeInCubic":return e*e*e;case"easeInPow25":return Math.pow(e,2.5);case"easeInOut":return e<.5?2*e*e:1-Math.pow(-2*e+2,2)/2;case"easeOutThenIn":return e<.45?1-Math.pow(1-e/.45,2.5):1-Math.pow(1-e,3);case"linear":default:return e}}function Ti(n,e,t,i){const r=1-i,s=new P;switch(n.type){case"linear":s.lerpVectors(e,t,i);break;case"quadratic":{const o=n.c1,c=r*r,l=i*i;s.set(c*e.x+2*r*i*o.x+l*t.x,c*e.y+2*r*i*o.y+l*t.y,c*e.z+2*r*i*o.z+l*t.z);break}case"cubic":{const o=n.c1,c=n.c2,l=r*r,u=l*r,d=i*i,a=d*i;s.set(u*e.x+3*l*i*o.x+3*r*d*c.x+a*t.x,u*e.y+3*l*i*o.y+3*r*d*c.y+a*t.y,u*e.z+3*l*i*o.z+3*r*d*c.z+a*t.z);break}case"arc":{const o=n.arcStartAngle+i*n.arcSweepAngle,c=n.arcCenter,l=n.arcRadius;s.set(c.x+Math.cos(o)*l,c.y+Math.sin(o)*l*.12,c.z+Math.sin(o)*l);break}case"noise":{if(n.c1){const u=n.c1,d=r*r,a=i*i;s.set(d*e.x+2*r*i*u.x+a*t.x,d*e.y+2*r*i*u.y+a*t.y,d*e.z+2*r*i*u.z+a*t.z)}else s.lerpVectors(e,t,i);const o=n.noiseAmp*(1-i*.75),c=n.noiseFreq,l=n.noisePhase;s.x+=Math.sin(i*c+l)*Math.sin(i*2.3)*o,s.y+=Math.cos(i*c*1.4+l)*.35*o*(1-i),s.z+=Math.sin(i*c*.8+l+2.1)*Math.sin(i*3.1)*o;break}}return s}function LR(n){return 1-Math.pow(1-n,3)}function ra(n,e){return Math.random()*(e-n)+n}function DR(n){return n*n*n}function z_(n){return 1-Math.pow(1-n,3)}function IR(n,e){const t=e.target.clone(),i=e.target.clone().sub(e.origin).normalize(),r=new Float32Array([t.x,t.y+20,t.z,t.x,t.y+20,t.z]),s=new He;s.setAttribute("position",new Be(r,3));const o=new pn({color:new ne("#ffffff"),transparent:!0,opacity:0,blending:it,depthWrite:!1}),c=new $t(s,o);c.visible=!1,n.add(c);const l=new Float32Array([t.x,t.y,t.z,t.x,t.y,t.z]),u=new He;u.setAttribute("position",new Be(l,3));const d=new pn({color:new ne("#60a5fa"),transparent:!0,opacity:0,blending:it,depthWrite:!1}),a=new $t(u,d);a.visible=!1,n.add(a);const f=[{obj:c,mat:o,meta:{}},{obj:a,mat:d,meta:{}}];let h=!1,m=0;return{entries:f,tick(v,g,p,_,x){if(!h)return;m+=g;const S=m;if(S<.35){c.visible=!0,o.opacity=1;const A=Math.min(1,S/.15),M=t.y+20*(1-DR(A));r[3]=M,s.attributes.position.needsUpdate=!0}if(S>.12&&S<.6){a.visible=!0;const A=Math.min(1,(S-.12)/.33),M=z_(A)*6;l[0]=t.x-i.x*M,l[1]=t.y-i.y*M,l[2]=t.z-i.z*M,l[3]=t.x+i.x*M,l[4]=t.y+i.y*M,l[5]=t.z+i.z*M,u.attributes.position.needsUpdate=!0,d.opacity=Math.min(1,(S-.12)/.1)}if(S>.4){const A=Math.min(1,(S-.4)/.25),M=t.y+20*z_(A);r[3]=M,s.attributes.position.needsUpdate=!0,o.opacity=Math.max(0,1-A),d.opacity=Math.max(0,1-(S-.4)/.3)}S>.8&&(c.visible=!1,a.visible=!1)},onLand(){h=!0},applyFade(v){o.opacity=Math.min(o.opacity,v),d.opacity=Math.min(d.opacity,v)}}}function NR(n,e){const t=[];let i=!1;for(let o=0;o<4;o++){const c=o/4*Math.PI*2,l=new P(Math.cos(c)*6,0,Math.sin(c)*6).add(e.origin),u=new He().setFromPoints([e.origin.clone(),l]),d=new pn({color:new ne("#fb7185"),transparent:!0,opacity:.7,blending:it,depthWrite:!1}),a=new $t(u,d);n.add(a),t.push({obj:a,mat:d,meta:{type:"launch"}})}const r=Ti(e.pathConfig,e.origin,e.target,.5);for(let o=0;o<3;o++){const c=o/3*Math.PI*2,l=new P(Math.cos(c)*4,(o-1)*1.5,Math.sin(c)*4).add(r),u=new He().setFromPoints([r.clone(),l]),d=new pn({color:new ne("#fda4af"),transparent:!0,opacity:0,blending:it,depthWrite:!1}),a=new $t(u,d);n.add(a),t.push({obj:a,mat:d,meta:{type:"relay"}})}const s=[];return{entries:t,tick(o,c,l,u,d){for(const a of t)if(a.meta.type==="launch"&&(a.mat.opacity=Math.max(0,.7-l*1.4)),a.meta.type==="relay"){const f=o>.43&&o<.57,h=f?(o-.43)/.07:0;a.mat.opacity=f?Math.sin(h*Math.PI)*.6:0}if(i)for(const a of s)a.mat.opacity=Math.max(0,a.mat.opacity-c/a.fadeTime)},onLand(){i=!0;for(let o=0;o<6;o++){const c=o/6*Math.PI*2+ra(0,.3),l=ra(8,14),u=e.target.clone().add(new P(Math.cos(c)*l,ra(-1,1),Math.sin(c)*l)),d=new He().setFromPoints([e.target.clone(),u]),a=new pn({color:new ne("#fb7185"),transparent:!0,opacity:.8,blending:it,depthWrite:!1}),f=new $t(d,a);n.add(f);const h=ra(.5,.9);s.push({mat:a,fadeTime:h}),t.push({obj:f,mat:a,meta:{type:"landing"}})}},applyFade(o){for(const c of t){const l=c.mat;l.opacity=Math.min(l.opacity,o)}}}}const Gr=120,Xf=8,UR=`
  attribute float aT;
  varying float vT;
  void main() { vT = aT; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`,FR=`
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
`;function OR(n,e){const t=Array.from({length:Xf},(r,s)=>{const o=new Float32Array(Gr*3),c=new Float32Array(Gr);for(let x=0;x<Gr;x++)c[x]=x/(Gr-1);const l=new He;l.setAttribute("position",new Be(o,3)),l.setAttribute("aT",new Be(c,1));const u=new Tt({vertexShader:UR,fragmentShader:FR,uniforms:{uTime:{value:0},uOpacity:{value:0},uPhase:{value:s/Xf}},blending:it,transparent:!0,depthWrite:!1});n.add(new $t(l,u));const d=1.2+Math.random()*1.5,a=3.5+Math.random()*3,f=Math.random()*Math.PI*2,h=Math.random()*Math.PI*2,m=25+Math.random()*25,v=new P(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize(),g=new P((Math.random()-.5)*200,(Math.random()-.5)*200,(Math.random()-.5)*200),p=-(s/Xf)*3.5-Math.random()*.2,_=.8+Math.random()*.6;return{posArr:o,geo:l,mat:u,f1:d,f2:a,ph1:f,ph2:h,amp:m,perp:v,scatter:g,windowStart:p,rollSpeed:_,window:p}}),i={entries:t.map(r=>({obj:new $t(r.geo,r.mat),mat:r.mat,meta:{}})),suppressDefaultTrail:!0,trailTick(r,s,o){const c=.3+o*.01;let l=!0;for(const u of t){const d=u.window>=1?1/(4*u.rollSpeed):(1-u.windowStart)/e.travelTime;u.window=Math.min(2,u.window+s*d);const a=u.window;if(a<=0){u.geo.setDrawRange(0,0),l=!1;continue}if(a>=2){u.mat.uniforms.uOpacity.value=0,u.geo.setDrawRange(0,0);continue}l=!1;const f=Math.round(Math.min(1,a)*(Gr-1)),h=Math.round(Math.max(0,a-1)*(Gr-1)),m=f-h;if(m<1){u.geo.setDrawRange(0,0);continue}for(let v=h;v<=f;v++){const g=v/(Gr-1),p=wc(e.pathConfig.easing,g),_=Ti(e.pathConfig,e.origin,e.target,p),x=Math.max(0,1-g/.5),S=Math.min(1,g/.5),A=1-Math.pow(g,8),M=(Math.sin(g*u.f1*Math.PI*2+u.ph1+o*c)*u.amp+Math.sin(g*u.f2*Math.PI*2+u.ph2+o*c*1.4)*u.amp*.3)*S*A;u.posArr[v*3]=_.x+u.scatter.x*x+u.perp.x*M,u.posArr[v*3+1]=_.y+u.scatter.y*x+u.perp.y*M,u.posArr[v*3+2]=_.z+u.scatter.z*x+u.perp.z*M}u.geo.attributes.position.needsUpdate=!0,u.geo.setDrawRange(h,m),u.mat.uniforms.uOpacity.value=.7,u.mat.uniforms.uTime.value=o}l&&(i.shouldMarkDone=!0)},tick(){},onLand(){},applyFade(r){},shouldMarkDone:!1};return i}function kR(n,e,t){const i=[n.clone()],r=6;for(let s=1;s<r;s++){const o=s/r,c=n.clone().lerp(e,o),l=new P(Math.random()-.5,(Math.random()-.5)*.3,Math.random()-.5).normalize();c.addScaledVector(l,(Math.random()-.5)*t),i.push(c)}return i.push(e.clone()),new He().setFromPoints(i)}function BR(n,e){const t=[];for(let i=0;i<3;i++){const r=new He().setFromPoints([new P(0,0,0),new P(0,0,0)]),s=new pn({color:new ne("#f87171"),transparent:!0,opacity:0,blending:it,depthWrite:!1}),o=new $t(r,s);o.visible=!1,n.add(o),t.push({obj:o,mat:s,meta:{visible:!1,stallElapsed:0,dir:new P(Math.random()-.5,(Math.random()-.5)*.4,Math.random()-.5).normalize().multiplyScalar(ra(8,18))}})}return{entries:t,tick(i,r,s,o,c){for(const l of t){if(!l.meta.visible)continue;l.meta.stallElapsed+=r;const u=l.meta.stallElapsed,d=l.mat;if(u<.4)d.opacity=Math.sin(u*40)*.3+.7;else if(u<.7){const a=(u-.4)/.3;d.opacity=Math.max(0,1-a)}else d.opacity=0,l.obj.visible=!1}},onStall(i){for(const r of t){const s=i.clone().add(r.meta.dir),o=kR(i,s,3.5);r.obj.geometry.dispose(),r.obj.geometry=o,r.obj.visible=!0,r.meta.visible=!0,r.meta.stallElapsed=0,r.mat.opacity=1}},applyFade(i){for(const r of t){const s=r.mat;s.opacity=Math.min(s.opacity,i)}}}}function zR(n){const e=[];for(let t=0;t<n;t++){const i=t/n*Math.PI*2,r=(t+.55)/n*Math.PI*2;e.push(new P(Math.cos(i),0,Math.sin(i))),e.push(new P(Math.cos(r),0,Math.sin(r)))}return new He().setFromPoints(e)}function VR(n){const e=[20,35,52],t=[0,.12,.24],i=[.9,.6,.32],r=["#34d399","#6ee7b7","#a7f3d0"],s=[];for(let c=0;c<3;c++){const l=zR(12),u=new pn({color:new ne(r[c]),transparent:!0,opacity:0,blending:it,depthWrite:!1}),d=new Oh(l,u);d.rotation.x=Math.PI/2,n.add(d),s.push({obj:d,mat:u,meta:{maxRadius:e[c],delay:t[c],baseOpacity:i[c],expandTime:.9+c*.15}})}const o={entries:s,tick(c,l,u,d,a){let f=!0;for(const h of s){const{maxRadius:m,delay:v,baseOpacity:g,expandTime:p}=h.meta,_=Math.max(0,u-v),x=Math.min(1,_/p),S=LR(x)*m;h.obj.scale.set(S,S,S);const A=Math.max(0,_-p)/.5;h.mat.opacity=g*Math.max(0,1-A),A<1&&(f=!1),A>=1&&(h.obj.visible=!1)}f&&u>.5&&(o.shouldMarkDone=!0)},applyFade(c){},shouldMarkDone:!1};return o}let Jl=null;function HR(){if(Jl)return Jl;const n=document.createElement("canvas");n.width=n.height=32;const e=n.getContext("2d"),t=e.createRadialGradient(16,16,0,16,16,16);return t.addColorStop(0,"rgba(232,121,249,1)"),t.addColorStop(.3,"rgba(232,121,249,0.6)"),t.addColorStop(1,"rgba(232,121,249,0)"),e.fillStyle=t,e.fillRect(0,0,32,32),Jl=new hs(n),Jl}function GR(){return new He().setFromPoints([new P(0,1,0),new P(1,0,0),new P(0,-1,0),new P(-1,0,0),new P(0,1,0)])}function WR(n,e){const t=e.pathConfig;if(t.type!=="arc")return null;const i=61,r=[];for(let A=0;A<=60;A++){const M=A/60,T=t.arcStartAngle+M*t.arcSweepAngle;r.push(new P(t.arcCenter.x+Math.cos(T)*t.arcRadius,t.arcCenter.y+Math.sin(T)*t.arcRadius*.12,t.arcCenter.z+Math.sin(T)*t.arcRadius))}const s=new Float32Array(i*3),o=new Be(s,3),c=new He().setFromPoints(r);c.setAttribute("color",o);const l=new pn({vertexColors:!0,transparent:!0,opacity:.85,blending:it,depthWrite:!1}),u=new $t(c,l);n.add(u);const d={obj:u,mat:l,meta:{}},a=new Su({map:HR(),color:new ne("#e879f9"),blending:it,transparent:!0,depthWrite:!1,opacity:0}),f=new Qp(a);f.position.copy(e.target),f.scale.set(8,8,1),f.visible=!1,n.add(f);const h={obj:f,mat:a,meta:{blipElapsed:0,blipActive:!1}},m=new ne("#e879f9"),v=[];let g=null,p=null,_=0,x=!1;const S=[d,h];return{entries:S,suppressDefaultTrail:!0,tick(A,M,T,y,E){for(let D=0;D<i;D++){const C=D/60,F=Math.abs(C-A);let L;C>A?L=Math.max(.03,.08-(C-A)*.5):L=Math.max(.05,1-F*8);const U=m.clone().multiplyScalar(L);s[D*3]=U.r,s[D*3+1]=U.g,s[D*3+2]=U.b}if(o.needsUpdate=!0,h.meta.blipActive){h.meta.blipElapsed+=M;const D=h.meta.blipElapsed;a.opacity=Math.max(0,1-D/.5);const C=8*(1+D*4);f.scale.set(C,C,1)}if(x){_+=M;for(const D of v)if(D.elapsed+=M,D.elapsed>=D.spawnDelay){D.active=!0;const C=D.elapsed-D.spawnDelay;D.mat.opacity=Math.max(0,.8-C/.5)}if(p&&g){const D=_;if(D<.35){const C=D/.35*15;p.scale.set(C,C,C),g.opacity=Math.max(0,.9-(D-.15)/.2)}else g.opacity=Math.max(0,1-(D-.35)/.2)}}},onLand(){f.visible=!0,a.opacity=1,h.meta.blipActive=!0,h.meta.blipElapsed=0,x=!0,_=0;const A=[-3,-1,1,3];for(let E=0;E<4;E++){const D=A[E],C=new P(e.target.x-4,e.target.y+D,e.target.z),F=new P(e.target.x+4,e.target.y+D,e.target.z),L=new He().setFromPoints([C,F]),U=new pn({color:new ne("#e879f9"),transparent:!0,opacity:0,blending:it,depthWrite:!1}),z=new $t(L,U);n.add(z),S.push({obj:z,mat:U,meta:{type:"matchLine"}}),v.push({mat:U,spawnDelay:E*.06,elapsed:0,active:!1})}const M=GR(),T=new pn({color:new ne("#e879f9"),transparent:!0,opacity:.9,blending:it,depthWrite:!1}),y=new $t(M,T);y.position.copy(e.target),y.scale.set(.1,.1,.1),n.add(y),S.push({obj:y,mat:T,meta:{type:"diamond"}}),p=y,g=T},applyFade(A){l.opacity=Math.min(l.opacity,A),a.opacity=Math.min(a.opacity,A);for(const M of v)M.mat.opacity=Math.min(M.mat.opacity,A);g&&(g.opacity=Math.min(g.opacity,A))}}}let jf=null;function XR(){if(jf)return jf;const n=document.createElement("canvas");n.width=n.height=64;const e=n.getContext("2d"),t=e.createRadialGradient(32,32,0,32,32,32);return t.addColorStop(0,"rgba(255,255,255,1.0)"),t.addColorStop(.25,"rgba(255,255,255,0.8)"),t.addColorStop(.6,"rgba(255,255,255,0.2)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t,e.fillRect(0,0,64,64),jf=new hs(n)}function jR(n,e){const r=new Uint8Array(256);for(let x=0;x<256;x++)r[x]=Math.random()>.45?1:0;const s=800,o=[],c=[0];for(let x=0;x<s;x++)o.push(Ti(e.pathConfig,e.origin,e.target,x/(s-1))),x>0&&c.push(c[x-1]+o[x].distanceTo(o[x-1]));const l=c[s-1],u=new Array(100),d=new Float32Array(100);let a=0;for(let x=0;x<100;x++){const S=x/99*l;for(;a<s-1&&c[a]<S;)a++;u[x]=o[a].clone(),d[x]=a/(s-1)}const f=new Float32Array(100*3),h=new Float32Array(100*3);for(let x=0;x<100;x++)f[x*3]=u[x].x,f[x*3+1]=u[x].y,f[x*3+2]=u[x].z;const m=new He;m.setAttribute("position",new Be(f,3)),m.setAttribute("color",new Be(h,3));const v=new Wa({size:2.8,vertexColors:!0,map:XR(),blending:it,transparent:!0,depthWrite:!1,sizeAttenuation:!0,opacity:.9}),g=new Rr(m,v);n.add(g);const p=[{obj:g,mat:v,meta:{}}];let _=1;return{entries:p,suppressDefaultTrail:!0,onLand(){},trailTick(x,S,A,M){const y=A*12;for(let E=0;E<100;E++){if(d[E]>x){h[E*3]=h[E*3+1]=h[E*3+2]=0;continue}const D=E/99,C=(Math.floor(E-y)%256+256)%256,F=r[C]?1:.06,L=(.2+.8*D)*F*_;h[E*3]=L,h[E*3+1]=(.83+.12*D)*L,h[E*3+2]=(.3+.1*D)*L}m.attributes.color.needsUpdate=!0,v.opacity=.93*_},tick(){},applyFade(x){_=x}}}let $f=null;function $R(){if($f)return $f;const n=document.createElement("canvas");n.width=n.height=64;const e=n.getContext("2d"),t=e.createRadialGradient(32,32,0,32,32,32);return t.addColorStop(0,"rgba(255,255,255,1.0)"),t.addColorStop(.25,"rgba(255,255,255,0.8)"),t.addColorStop(.6,"rgba(255,255,255,0.2)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t,e.fillRect(0,0,64,64),$f=new hs(n)}function YR(n,e){const s=[0],o=[12],c=Array.from({length:1},()=>{const M=new Uint8Array(256);for(let T=0;T<256;T++)M[T]=Math.random()>.45?1:0;return M}),l=800,u=[],d=[0];for(let M=0;M<l;M++)u.push(Ti(e.pathConfig,e.origin,e.target,M/(l-1))),M>0&&d.push(d[M-1]+u[M].distanceTo(u[M-1]));const a=d[l-1],f=[],h=new Float32Array(100);let m=0;for(let M=0;M<100;M++){const T=M/99*a;for(;m<l-1&&d[m]<T;)m++;f.push(u[m].clone()),h[M]=m/(l-1)}const v=Ti(e.pathConfig,e.origin,e.target,.49),g=Ti(e.pathConfig,e.origin,e.target,.51),p=new P().copy(g).sub(v).normalize(),_=new P().crossVectors(p,new P(0,1,0));_.lengthSq()<.01&&_.set(1,0,0),_.normalize();const x=s.map((M,T)=>{const y=new Float32Array(300),E=new Float32Array(100*3),D=new He;D.setAttribute("position",new Be(y,3)),D.setAttribute("color",new Be(E,3));for(let L=0;L<100;L++)y[L*3]=f[L].x+_.x*M,y[L*3+1]=f[L].y+_.y*M,y[L*3+2]=f[L].z+_.z*M;const C=new Wa({size:2.4,vertexColors:!0,map:$R(),blending:it,transparent:!0,depthWrite:!1,sizeAttenuation:!0,opacity:.9}),F=new Rr(D,C);return n.add(F),{posArr:y,colArr:E,geo:D,mat:C,pts:F,bs:c[T],spd:o[T],center:M===0?1:.7}}),S=x.map(M=>({obj:M.pts,mat:M.mat,meta:{}}));let A=1;return{entries:S,suppressDefaultTrail:!0,onLand(){},trailTick(M,T,y){for(const E of x){const D=y*E.spd;for(let C=0;C<100;C++){if(h[C]>M){E.colArr[C*3]=E.colArr[C*3+1]=E.colArr[C*3+2]=0;continue}const F=C/99,L=(Math.floor(C-D)%256+256)%256,U=E.bs[L]?1:.06,z=(.2+.8*F)*U*E.center*A;E.colArr[C*3]=(.376+.4*F)*z,E.colArr[C*3+1]=(.647+.25*F)*z,E.colArr[C*3+2]=z}E.geo.attributes.color.needsUpdate=!0,E.mat.opacity=.9*A}},tick(){},applyFade(M){A=M}}}new ne("#00ff41");new ne("#00ffcc");new ne("#39d353");new ne("#1a6b2a");function qR(n,e){const t=Math.acos(1-2*(n+.5)/e),i=Math.PI*(1+Math.sqrt(5))*n;return new P(Math.sin(t)*Math.cos(i),Math.cos(t),Math.sin(t)*Math.sin(i)).normalize()}const KR=`
  attribute float aT;
  varying float vT;
  void main() {
    vT = aT;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,ZR=`
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
`;function QR(n){const e=new Float32Array(n*3),t=new Float32Array(n);for(let r=0;r<n;r++)t[r]=r/(n-1);const i=new He;return i.setAttribute("position",new Be(e,3)),i.setAttribute("aT",new Be(t,1)),i}function JR(){return new Tt({vertexShader:KR,fragmentShader:ZR,uniforms:{uOpacity:{value:0},uPulse:{value:0}},blending:it,transparent:!0,depthWrite:!1})}const e2=`
  attribute float aT;
  attribute float aFade;
  varying float vT;
  varying float vFade;
  void main() {
    vT    = aT;
    vFade = aFade;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,t2=`
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
`;function n2(n){const e=new Float32Array(n*3),t=new Float32Array(n),i=new Float32Array(n).fill(1);for(let s=0;s<n;s++)t[s]=s/(n-1);const r=new He;return r.setAttribute("position",new Be(e,3)),r.setAttribute("aT",new Be(t,1)),r.setAttribute("aFade",new Be(i,1)),r}function i2(){return new Tt({vertexShader:e2,fragmentShader:t2,uniforms:{uTime:{value:0},uOpacity:{value:1}},blending:it,transparent:!0,depthWrite:!1})}const ec=28,Yf=10;function r2(n){const r=Array.from({length:ec},()=>{const u=QR(Yf),d=JR(),a=new $t(u,d);return n.add(a),{geo:u,mat:d,line:a,spawnTime:-999,dir:new P(1,0,0),active:!1,grown:!1,len:0}});let s=0;function o(u){const d=r[s%ec];d.dir=qR(Math.floor(Math.random()*ec*8),ec*8),d.spawnTime=u,d.active=!0,d.grown=!1,d.len=0,d.mat.uniforms.uOpacity.value=1,d.mat.uniforms.uPulse.value=1,s++}function c(u){for(const d of r){if(!d.active){d.mat.uniforms.uOpacity.value=0;continue}const a=u-d.spawnTime;d.grown||(d.len=Math.min(11,a/.25*11),d.len>=11&&(d.grown=!0)),d.mat.uniforms.uPulse.value=Math.max(0,1-a/.4),d.mat.uniforms.uOpacity.value=1;const f=d.geo.attributes.position;for(let h=0;h<Yf;h++){const v=1.5+h/(Yf-1)*d.len;f.setXYZ(h,d.dir.x*v,d.dir.y*v,d.dir.z*v)}f.needsUpdate=!0}}function l(){for(const u of r)u.active=!1,u.mat.uniforms.uOpacity.value=0}return{spawn:o,tick:c,killAll:l,allMats:r.map(u=>u.mat)}}function s2(n,e){const s=new P().addVectors(e.origin,e.target).multiplyScalar(.5),o=Array.from({length:4},()=>{const h=30+Math.random()*80;return{type:"quadratic",easing:"linear",c1:new P(s.x+(Math.random()-.5)*h,s.y+(Math.random()-.5)*h,s.z+(Math.random()-.5)*h)}}),c=Array.from({length:4},(h,m)=>m*.35),l=Array.from({length:4},()=>{const h=n2(160),m=i2(),v=new $t(h,m);return n.add(v),{geo:h,mat:m,line:v}}),u=3.5;let d=-1;const a=e.travelTime;function f(h,m,v,g,p){const _=m/a;for(let x=0;x<4;x++){const{geo:S,mat:A}=l[x],M=o[x],T=Math.max(0,Math.min(1,_-c[x])),y=T>0;if(A.uniforms.uTime.value=m,A.uniforms.uOpacity.value=y?1:0,!y)continue;x===3&&T>=1&&d<0&&(d=m);const E=d>=0?m-d:0,D=d>=0?Math.max(0,1-E/u):1;A.uniforms.uOpacity.value=D;const C=S.attributes.position,F=S.attributes.aFade;for(let L=0;L<160;L++){const U=L/159,z=T-U*.85,V=Math.max(0,z),H=z<0?0:1,k=Ti(M,e.origin,e.target,V);C.setXYZ(L,k.x,k.y,k.z),F.setX(L,H)}C.needsUpdate=!0,F.needsUpdate=!0}}return{lines:l.map(h=>h.line),allMats:l.map(h=>h.mat),tick:f}}function V_(n,e){const t=s2(n,e),i=new li;i.position.copy(e.target),n.add(i);const r=r2(i),s=[...t.lines.map(l=>({obj:l,mat:new wo,meta:{}})),{obj:i,mat:new wo,meta:{}}];let o=!1,c=0;return{entries:s,suppressDefaultTrail:!0,trailTick(l,u,d,a){l>=1&&!o&&(o=!0,c=d);const f=o?d-c:0;t.tick(l,d,o,f,()=>{}),i.rotation.y=d*.05},tick(){},applyFade(l){if(l<=0){r.killAll();for(const u of t.allMats)u.uniforms.uOpacity.value=0}}}}function Kt(n,e){return Math.random()*(e-n)+n}const cy=`
  attribute float aT;
  varying float vT;
  void main() {
    vT = aT;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,uy=`
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
`,qf=50;function o2(n){const e=new Float32Array(qf*3),t=new Float32Array(qf),i=new He;i.setAttribute("position",new Be(e,3)),i.setAttribute("aT",new Be(t,1)),i.setDrawRange(0,0);const r=new Tt({vertexShader:cy,fragmentShader:uy,uniforms:{uTime:{value:0},uOpacity:{value:.9},uBaseColor:{value:new P(.2,.12,.4)},uTipColor:{value:new P(.6,.4,1)},uPhase:{value:Kt(0,6.28)}},blending:it,transparent:!0,depthWrite:!1}),s=new $t(i,r);n.add(s);const o=[];let c=0,l=!1,u=0;function d(m){o.push(m.clone());const v=Math.min(o.length,qf),g=o.length-v;for(let p=0;p<v;p++){const _=o[g+p];e[p*3]=_.x,e[p*3+1]=_.y,e[p*3+2]=_.z,t[p]=p/(v-1||1)}u=v,i.attributes.position.needsUpdate=!0,i.attributes.aT.needsUpdate=!0,i.setDrawRange(0,u)}function a(){l=!0,c=0}function f(m){if(!l)return!1;c=Math.min(u-1,c+m*30);const v=Math.round(c),g=u-v;if(g<=1)return i.setDrawRange(0,0),!0;i.setDrawRange(v,g);for(let p=v;p<u;p++)t[p]=(p-v)/(g-1);return i.attributes.aT.needsUpdate=!0,!1}function h(m){r.uniforms.uTime.value+=m}return{line:s,geo:i,mat:r,pushPoint:d,startEating:a,tickEat:f,tickTime:h}}const Vh=80,Kf=10,a2=.35;function l2(n,e,t,i){const r=1-i;return new P(r*r*n.x+2*r*i*e.x+i*i*t.x,r*r*n.y+2*r*i*e.y+i*i*t.y,r*r*n.z+2*r*i*e.z+i*i*t.z)}function c2(n,e,t,i,r){const s=Kt(0,Math.PI*2),o=Kt(-.6,.6),l=new P(Math.cos(s)*Math.cos(o),Math.sin(o),Math.sin(s)*Math.cos(o)).normalize().clone().multiplyScalar(Kt(14,22)),u=new Float32Array(Vh*3),d=new Float32Array(Vh),a=new He;a.setAttribute("position",new Be(u,3)),a.setAttribute("aT",new Be(d,1)),a.setDrawRange(0,0);const f=new Tt({vertexShader:cy,fragmentShader:uy,uniforms:{uTime:{value:0},uOpacity:{value:.85},uBaseColor:{value:new P(.2,.12,.4)},uTipColor:{value:new P(.5,.35,.9)},uPhase:{value:Kt(0,6.28)}},blending:it,transparent:!0,depthWrite:!1}),h=new $t(a,f);h.visible=!1,n.add(h),u[0]=e.x,u[1]=e.y,u[2]=e.z,d[0]=0;const m={origin:e.clone(),isHit:i,fireDelay:t,pos:e.clone(),vel:l,searchDist:Kt(20,45),gravity:new P(Kt(-1.5,1.5),Kt(-3,-1),Kt(-1.5,1.5)),drift:new P(Kt(-2,2),Kt(-.5,.5),Kt(-2,2)),returnStart:new P,returnArc:new P,returnT:0,returnDur:Kt(1.2,2),points:[e.clone()],posArr:u,tArr:d,geo:a,mat:f,line:h,ptCount:1,state:"waiting",elapsed:0,stateTime:0,tailIdx:0};return r.push(m),m}function H_(n){const e=Math.min(n.points.length,Vh),t=n.points.length-e;for(let i=0;i<e;i++){const r=n.points[t+i];n.posArr[i*3]=r.x,n.posArr[i*3+1]=r.y,n.posArr[i*3+2]=r.z,n.tArr[i]=i/(e-1||1)}n.ptCount=e,n.geo.attributes.position.needsUpdate=!0,n.geo.attributes.aT.needsUpdate=!0}function u2(n,e){if(n.elapsed+=e,n.mat.uniforms.uTime.value=n.elapsed,n.state==="waiting"){n.elapsed>=n.fireDelay&&(n.state="seeking",n.stateTime=0,n.line.visible=!0);return}if(n.stateTime+=e,n.state==="seeking"){if(n.vel.addScaledVector(n.gravity,e),n.vel.addScaledVector(n.drift,e),n.vel.multiplyScalar(1-e*.3),n.pos.addScaledVector(n.vel,e),n.points.push(n.pos.clone()),H_(n),n.geo.setDrawRange(0,n.ptCount),n.pos.distanceTo(n.origin)>=n.searchDist)if(n.isHit){n.state="hit_returning",n.stateTime=0,n.returnStart.copy(n.pos);const t=n.pos.clone().add(n.origin).multiplyScalar(.5);n.returnArc.set(t.x+Kt(-18,18),t.y+Kt(8,25),t.z+Kt(-18,18)),n.returnT=0,n.mat.uniforms.uBaseColor.value.set(.05,.35,.15),n.mat.uniforms.uTipColor.value.set(.3,1,.5)}else n.state="miss_dying",n.stateTime=0,n.tailIdx=0,n.mat.uniforms.uBaseColor.value.set(.3,.05,.05),n.mat.uniforms.uTipColor.value.set(.5,.1,.08)}else if(n.state==="hit_returning"){n.returnT=Math.min(1,n.returnT+e/n.returnDur);const t=n.returnT<.5?2*n.returnT*n.returnT:1-Math.pow(-2*n.returnT+2,2)/2;n.pos.copy(l2(n.returnStart,n.returnArc,n.origin,t)),n.points.push(n.pos.clone()),H_(n),n.geo.setDrawRange(0,n.ptCount),n.returnT>=1&&(n.state="miss_dying",n.stateTime=0,n.tailIdx=0)}else if(n.state==="miss_dying"){const t=n.isHit?25:15;n.tailIdx=Math.min(n.ptCount-1,n.tailIdx+e*t);const i=Math.round(n.tailIdx),r=n.ptCount-i;if(r<=1){n.state="done",n.geo.setDrawRange(0,0),n.line.visible=!1;return}n.geo.setDrawRange(i,r);for(let s=i;s<n.ptCount;s++)n.tArr[s]=(s-i)/(r-1);n.geo.attributes.aT.needsUpdate=!0,n.isHit||(n.mat.uniforms.uOpacity.value=Math.max(0,.85-n.stateTime*.4))}}function f2(n,e){const t=[],i=o2(n),r=[],s=Array.from({length:Kf},(u,d)=>d);for(let u=s.length-1;u>0;u--){const d=Math.floor(Math.random()*(u+1));[s[u],s[d]]=[s[d],s[u]]}for(let u=0;u<Kf;u++)r.push(c2(n,e.target,Kt(.1,3),s[u]<Kf*a2,t));let o=!1,c=!1;const l={entries:[],suppressDefaultTrail:!0,trailTick(u,d,a,f){if(i.tickTime(d),u<1&&i.pushPoint(f.position),u>=1&&!o&&(o=!0,i.pushPoint(f.position),i.startEating()),o){c||(c=i.tickEat(d));for(const h of r)u2(h,d)}o&&c&&t.every(h=>h.state==="done")&&(l.shouldMarkDone=!0)},tick(){},onLand(){},applyFade(u){},shouldMarkDone:!1,dispose(){i.geo.dispose(),i.mat.dispose();for(const u of t)u.geo.dispose(),u.mat.dispose()}};return l}function Zf(n,e){return Math.random()*(e-n)+n}const Fs=8;function G_(n,e){const t=[];for(let d=0;d<Fs;d++){const a=d/Fs*Math.PI*2,f=Zf(-.3,.3),h=new P(Math.cos(a)*Math.cos(f),Math.sin(f),Math.sin(a)*Math.cos(f)).normalize();t.push({pos:new P(0,0,0),vel:h.multiplyScalar(Zf(80,140)),life:1,maxLife:Zf(1.5,2.5)})}const i=new Float32Array(Fs*3),r=new Float32Array(Fs),s=new Float32Array(Fs);for(let d=0;d<Fs;d++)i[d*3]=t[d].pos.x,i[d*3+1]=t[d].pos.y,i[d*3+2]=t[d].pos.z,r[d]=t[d].life,s[d]=t[d].maxLife;const o=new He;o.setAttribute("position",new Be(i,3)),o.setAttribute("aLife",new Be(r,1)),o.setAttribute("aMaxLife",new Be(s,1));const c=new Tt({vertexShader:`
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
    `,blending:it,transparent:!0,depthWrite:!1}),l=new Rr(o,c);n.add(l);const u={entries:[{obj:l,mat:c,meta:{}}],suppressDefaultTrail:!1,trailTick(d,a){let f=!0;for(let h=0;h<t.length;h++){const m=t[h];m.life-=a/m.maxLife,m.life>0&&(f=!1,m.vel.multiplyScalar(.98),m.pos.addScaledVector(m.vel,a),i[h*3]=m.pos.x,i[h*3+1]=m.pos.y,i[h*3+2]=m.pos.z,r[h]=m.life)}o.attributes.position.needsUpdate=!0,o.attributes.aLife.needsUpdate=!0,f&&(u.shouldMarkDone=!0)},tick(){},onLand(){},applyFade(d){},shouldMarkDone:!1,dispose(){o.dispose(),c.dispose()}};return u}function tc(n,e){return Math.random()*(e-n)+n}const Os=6;function d2(n,e){const t=[];for(let d=0;d<Os;d++){const a=d/Os*Math.PI*2,f=tc(-.4,.4),h=new P(Math.cos(a)*Math.cos(f),Math.sin(f),Math.sin(a)*Math.cos(f)).normalize(),m=tc(80,120),v=h.clone().multiplyScalar(m),g=v.clone().negate().normalize().multiplyScalar(tc(140,200));t.push({pos:v,vel:g,life:1,maxLife:tc(.8,1.4)})}const i=new Float32Array(Os*3),r=new Float32Array(Os),s=new Float32Array(Os);for(let d=0;d<Os;d++)i[d*3]=t[d].pos.x,i[d*3+1]=t[d].pos.y,i[d*3+2]=t[d].pos.z,r[d]=t[d].life,s[d]=t[d].maxLife;const o=new He;o.setAttribute("position",new Be(i,3)),o.setAttribute("aLife",new Be(r,1)),o.setAttribute("aMaxLife",new Be(s,1));const c=new Tt({vertexShader:`
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
    `,blending:it,transparent:!0,depthWrite:!1}),l=new Rr(o,c);n.add(l);const u={entries:[{obj:l,mat:c,meta:{}}],suppressDefaultTrail:!0,trailTick(d,a){let f=!0;for(let h=0;h<t.length;h++){const m=t[h];m.life-=a/m.maxLife,m.life>0&&(f=!1,m.pos.addScaledVector(m.vel,a),i[h*3]=m.pos.x,i[h*3+1]=m.pos.y,i[h*3+2]=m.pos.z,r[h]=m.life)}o.attributes.position.needsUpdate=!0,o.attributes.aLife.needsUpdate=!0,f&&(u.shouldMarkDone=!0)},tick(){},onLand(){},applyFade(d){},shouldMarkDone:!1,dispose(){o.dispose(),c.dispose()}};return u}function ks(n,e){return Math.random()*(e-n)+n}const Bs=10;function W_(n,e){const t=[];for(let g=0;g<Bs;g++){const p=g/Bs*Math.PI*2,_=ks(-.5,.5),x=new P(Math.cos(p)*Math.cos(_),Math.sin(_),Math.sin(p)*Math.cos(_)).normalize();t.push({pos:new P(ks(-1,1),ks(-1,1),ks(-1,1)),vel:x.multiplyScalar(ks(100,180)),life:1,maxLife:ks(1.8,3)})}const i=new Float32Array(Bs*3),r=new Float32Array(Bs),s=new Float32Array(Bs);for(let g=0;g<Bs;g++)i[g*3]=t[g].pos.x,i[g*3+1]=t[g].pos.y,i[g*3+2]=t[g].pos.z,r[g]=t[g].life,s[g]=t[g].maxLife;const o=new He;o.setAttribute("position",new Be(i,3)),o.setAttribute("aLife",new Be(r,1)),o.setAttribute("aMaxLife",new Be(s,1));const c=new Tt({vertexShader:`
      attribute float aLife;
      attribute float aMaxLife;
      varying float vLife;
      void main() {
        vLife = aLife / aMaxLife;
        gl_PointSize = 5.0 * vLife;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      varying float vLife;
      void main() {
        float d = length(gl_PointCoord - 0.5) * 2.0;
        float a = (1.0 - d * d) * vLife;
        gl_FragColor = vec4(1.0, 0.88, 0.5, a);
      }
    `,blending:it,transparent:!0,depthWrite:!1}),l=new Rr(o,c);n.add(l);const u=new He,d=new Float32Array(64*3);for(let g=0;g<64;g++){const _=g/64*Math.PI*2,x=20;d[g*3]=Math.cos(_)*x,d[g*3+1]=Math.sin(_)*x,d[g*3+2]=0}u.setAttribute("position",new Be(d,3));const a=new pn({color:16769152,blending:it,transparent:!0,linewidth:2}),f=new Rw(u,a);let h=0;const m=1.2,v={entries:[{obj:l,mat:c,meta:{}},{obj:f,mat:a,meta:{}}],suppressDefaultTrail:!0,trailTick(g,p){let _=!0;for(let x=0;x<t.length;x++){const S=t[x];S.life-=p/S.maxLife,S.life>0&&(_=!1,S.vel.multiplyScalar(.96),S.pos.addScaledVector(S.vel,p),i[x*3]=S.pos.x,i[x*3+1]=S.pos.y,i[x*3+2]=S.pos.z,r[x]=S.life)}o.attributes.position.needsUpdate=!0,o.attributes.aLife.needsUpdate=!0,h+=p/m,h<=1?(_=!1,a.opacity=1-h*.5,f.scale.set(1+h*1.5,1+h*1.5,1)):a.opacity=0,_&&(v.shouldMarkDone=!0)},tick(){},onLand(){},applyFade(g){},shouldMarkDone:!1,dispose(){o.dispose(),c.dispose(),u.dispose(),a.dispose()}};return v}function h2(n,e,t){switch(n){case"Bash:first":return V_(e,t);case"Bash":return V_(e,t);case"response":return G_(e);case"response:first":return G_(e);case"compact:pre":return d2(e);case"compact:post":return W_(e);case"compact:post:first":return W_(e);case"Edit":return IR(e,t);case"Write":return YR(e,t);case"WebFetch":return NR(e,t);case"prompt":return OR(e,t);case"error":return BR(e);case"Notification":return VR(e);case"Grep":return WR(e,t);case"Glob":return f2(e,t);case"Read":return jR(e,t);default:return null}}const zs=40;let nc=null;function p2(){if(nc)return nc;const n=64,e=document.createElement("canvas");e.width=e.height=n;const t=e.getContext("2d"),i=n/2,r=t.createRadialGradient(i,i,0,i,i,i);return r.addColorStop(0,"rgba(255,255,255,1)"),r.addColorStop(.18,"rgba(255,255,255,0.8)"),r.addColorStop(.45,"rgba(255,255,255,0.25)"),r.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=r,t.fillRect(0,0,n,n),nc=new hs(e),nc}class m2{constructor(e,t){this.done=!1,this.settled=null,this.midPendingSpawns=null,this.progress=0,this.elapsed=0,this.stallTimer=0,this.trailFade=1,this.stallPos=new P,this.midSpawnFired=!1,this.effects=[],this.p=e,this.group=new li,this.state=e.spawnDelay&&e.spawnDelay>0?"waiting":"traveling";const i=e.headSize===0;this.headMat=new Su({map:p2(),color:e.color.clone(),blending:it,transparent:!0,depthWrite:!1,opacity:i?0:1}),this.head=new Qp(this.headMat);const r=Math.max(.01,e.headSize);this.head.scale.set(r,r,1),this.head.position.copy(e.origin),this.group.add(this.head),this.trailPosArr=new Float32Array(zs*3);const s=new Float32Array(zs*3);for(let u=0;u<zs;u++){this.trailPosArr[u*3]=e.origin.x,this.trailPosArr[u*3+1]=e.origin.y,this.trailPosArr[u*3+2]=e.origin.z;const d=u/(zs-1),a=Math.pow(1-d,2.2)*e.trailBrightness;s[u*3]=e.color.r*a,s[u*3+1]=e.color.g*a,s[u*3+2]=e.color.b*a}const o=new He;o.setAttribute("position",new Be(this.trailPosArr,3)),o.setAttribute("color",new Be(s,3)),this.trailMat=new pn({vertexColors:!0,transparent:!0,opacity:1,blending:it,depthWrite:!1}),this.trail=new $t(o,this.trailMat),this.group.add(this.trail);const l=(t??h2)(e._tool??"",this.group,e);l&&(this.effects.push(l),l.suppressDefaultTrail&&(this.trailMat.opacity=0,this.trailMat.visible=!1))}tick(e){if(this.state!=="done"){if(this.elapsed+=e,this.state==="waiting")if(this.elapsed>=(this.p.spawnDelay??0))this.state="traveling";else return;this.state==="traveling"?this._tickTravel(e):this.state==="stalled"?this._tickStall(e):this.state==="fading"&&this._tickFade(e)}}_tickTravel(e){var c,l;const t=this.p;this.progress=Math.min(1,this.progress+e/t.travelTime);const i=this.progress;if(!this.midSpawnFired&&t.midSpawnFrac!=null&&i>=t.midSpawnFrac&&(this.midSpawnFired=!0,(c=t.pendingSpawns)!=null&&c.length&&(this.midPendingSpawns=t.pendingSpawns,t.pendingSpawns=void 0)),t.stallAt!=null&&i>=t.stallAt&&this.state==="traveling"){this._triggerStall();return}const r=wc(t.pathConfig.easing,i),s=Ti(t.pathConfig,t.origin,t.target,r);this.head.position.copy(s);const o=this.effects.find(u=>u.suppressDefaultTrail);if(o)(l=o.trailTick)==null||l.call(o,i,e,this.elapsed,this.head);else{for(let u=0;u<zs;u++){const d=u/(zs-1)*.45*t.trailLength,a=Math.max(0,i-d),f=wc(t.pathConfig.easing,a),h=Ti(t.pathConfig,t.origin,t.target,f);this.trailPosArr[u*3]=h.x,this.trailPosArr[u*3+1]=h.y,this.trailPosArr[u*3+2]=h.z}this.trail.geometry.attributes.position.needsUpdate=!0}if(i>.7&&t.headSize>0){const u=(i-.7)/.3;this.headMat.color.lerpColors(t.color,t.colorEnd,u)}if(t.headSize>0){const u=Math.max(0,1-i*5),d=t.headSize*(1+u*2.2);this.head.scale.set(d,d,1)}this._tickSecondaries(i,e),i>=1&&this._onLand()}_tickStall(e){this.stallTimer+=e;const t=2.5*(1-this.stallTimer/(this.p.stallDuration??.5)),i=Math.sin(this.elapsed*28)*t,r=Math.cos(this.elapsed*21)*t;this.head.position.set(this.stallPos.x+i,this.stallPos.y,this.stallPos.z+r),this.stallTimer>=(this.p.stallDuration??.5)&&this._onLand()}_triggerStall(){var i;this.state="stalled";const e=this.p.stallAt,t=wc(this.p.pathConfig.easing,e);this.stallPos.copy(Ti(this.p.pathConfig,this.p.origin,this.p.target,t)),this.head.position.copy(this.stallPos);for(const r of this.effects)(i=r.onStall)==null||i.call(r,this.stallPos)}_onLand(){var t;const e=this.state==="stalled";this.state="fading",this.settled={position:(e?this.stallPos:this.p.target).clone(),color:this.p.colorEnd.clone()};for(const i of this.effects)(t=i.onLand)==null||t.call(i)}_tickFade(e){var r;this.trailFade=Math.max(0,this.trailFade-e/Math.max(.05,this.p.trailFadeTime));const t=this.trailFade*this.trailFade;this.trailMat.opacity=t,this.headMat.opacity=t;const i=this.effects.find(s=>s.suppressDefaultTrail);i&&((r=i.trailTick)==null||r.call(i,1,e,this.elapsed,this.head));for(const s of this.effects)s.applyFade(t);for(const s of this.effects)if(s.shouldMarkDone){this.state="done";break}this.trailFade<=0&&(this.state="done"),this.done=this.state==="done"}_tickSecondaries(e,t){for(const i of this.effects)i.tick(e,t,this.elapsed,this.state,this.head),i.shouldMarkDone&&!i.suppressDefaultTrail&&(this.state="done",this.done=!0)}dispose(){var e;this.trail.geometry.dispose(),this.trailMat.dispose(),this.headMat.dispose();for(const t of this.effects){for(const i of t.entries)i.obj.geometry&&i.obj.geometry.dispose(),i.mat.dispose();(e=t.dispose)==null||e.call(t)}}}const Qf=600;class g2{constructor(){this.traveling=[],this.pendingDelayed=[],this.stars=[],this.group=new li,this.starPosArr=new Float32Array(Qf*3),this.starColArr=new Float32Array(Qf*3),this.starGeo=new He,this.starGeo.setAttribute("position",new Be(this.starPosArr,3)),this.starGeo.setAttribute("color",new Be(this.starColArr,3)),this.starGeo.setDrawRange(0,0),this.starMat=new Wa({vertexColors:!0,blending:it,depthWrite:!1,transparent:!0,opacity:.75,size:2,sizeAttenuation:!1}),this.group.add(new Rr(this.starGeo,this.starMat))}spawn(e,t,i,r,s,o){const c=Xd[e]||t||jd,l=B_(e,c,0,i);this._launch(l,o)}spawnBurst(e,t,i,r,s,o,c){const l=Xd[e]||i||jd;for(let u=0;u<t;u++){const d=B_(e,l,u,r);this._launch(d,c)}}spawnRaw(e,t){this._launch(e,t)}_launch(e,t){const i=new m2(e);this.group.add(i.group),this.traveling.push({node:i,filePath:t})}tick(e){var t,i,r;for(let s=this.pendingDelayed.length-1;s>=0;s--){const o=this.pendingDelayed[s];o.waited+=e,o.waited>=o.delay&&(this._launch(o.params,o.filePath),this.pendingDelayed.splice(s,1))}for(let s=this.traveling.length-1;s>=0;s--){const o=this.traveling[s],c=o.node;if(c.tick(e),c.midPendingSpawns){for(const l of c.midPendingSpawns){const u=l.spawnDelay??0;u>0?this.pendingDelayed.push({params:l,delay:u,waited:0}):this._launch(l)}c.midPendingSpawns=null}if(c.settled){this._addStar(c.settled.position,c.settled.color),(t=this.onSettle)==null||t.call(this,c.settled.position,c.settled.color,o.filePath);const l=(i=c.p)==null?void 0:i.pendingSpawn;if(l){const d=l.spawnDelay??0;d>0?this.pendingDelayed.push({params:l,delay:d,waited:0}):this._launch(l),c.p.pendingSpawn=void 0}const u=(r=c.p)==null?void 0:r.pendingSpawns;if(u!=null&&u.length){for(const d of u){const a=d.spawnDelay??0;a>0?this.pendingDelayed.push({params:d,delay:a,waited:0}):this._launch(d)}c.p.pendingSpawns=void 0}c.settled=null}c.done&&(this.group.remove(c.group),c.dispose(),this.traveling.splice(s,1))}}addHistoryStar(e,t){this._addStar(e,t)}_addStar(e,t){this.stars.length>=Qf&&this.stars.shift();let i=e.clone();if(i.length()<20){const s=(Math.random()-.5)*2*(15+Math.pow(Math.random(),.6)*100)*(.4+Math.random()*2.1),o=(Math.random()-.5)*2*(15+Math.pow(Math.random(),.6)*100)*(.1+Math.random()*.4),c=(Math.random()-.5)*2*(15+Math.pow(Math.random(),.6)*100)*(.4+Math.random()*2.1);i=new P(s,o,c)}this.stars.push({pos:i,col:t.clone()});const r=this.stars.length;for(let s=0;s<r;s++){const o=this.stars[s];this.starPosArr[s*3]=o.pos.x,this.starPosArr[s*3+1]=o.pos.y,this.starPosArr[s*3+2]=o.pos.z,this.starColArr[s*3]=o.col.r,this.starColArr[s*3+1]=o.col.g,this.starColArr[s*3+2]=o.col.b}this.starGeo.attributes.position.needsUpdate=!0,this.starGeo.attributes.color.needsUpdate=!0,this.starGeo.setDrawRange(0,r)}dispose(){for(const{node:e}of this.traveling)this.group.remove(e.group),e.dispose();this.starGeo.dispose(),this.starMat.dispose()}}const _2=new ka(3.5,32).toNonIndexed();class v2{constructor(){this.activity=0,this.group=new li,this.orbitRadius=18+Math.random()*12,this.orbitSpeed=.4+Math.random()*.4,this.orbitAngle=Math.random()*Math.PI*2,this.mat=new Tt({uniforms:{uTime:{value:0},uActivity:{value:0}},vertexShader:`
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
      `,transparent:!0,depthWrite:!1,blending:it,side:ri}),this.meshref=new mn(_2,this.mat),this.meshref.scale.setScalar(.7),this.group.add(this.meshref)}triggerActivity(){this.activity=1}tick(e,t){this.activity=Math.max(0,this.activity-e*2),this.mat.uniforms.uTime.value=t,this.mat.uniforms.uActivity.value=this.activity,this.orbitAngle+=e*this.orbitSpeed*(1+this.activity),this.meshref.position.set(Math.cos(this.orbitAngle)*this.orbitRadius,Math.sin(t*1.5+this.orbitAngle)*3,Math.sin(this.orbitAngle)*this.orbitRadius),this.meshref.rotation.x=t*.4,this.meshref.rotation.y=t*.6}dispose(){this.mat.dispose()}}class x2{constructor(e,t){this.sessions=new Map,this.elapsed=0,this.eventUnsubs=[],this._autofit=!0,this._autoRotate=!0,this.onResize=()=>{const c=window.innerWidth,l=window.innerHeight;this.renderer.setSize(c,l),this.composer.setSize(c,l),this.camera.aspect=c/l,this.camera.updateProjectionMatrix()},this.container=e,this.clustersRef=t;const i=window.innerWidth,r=window.innerHeight;this.renderer=new VC({antialias:!0,alpha:!1}),this.renderer.setSize(i,r),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setClearColor(0),this.renderer.sortObjects=!0,e.appendChild(this.renderer.domElement),this.scene=new vw,this.camera=new Ln(60,i/r,1,5e3),this.camera.position.set(0,80,300),this.controls=new ZC(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.05,this.controls.autoRotate=!0,this.controls.autoRotateSpeed=.3,this.controls.minDistance=50,this.controls.maxDistance=800,this.controls.target.set(0,0,0),this.bgLayer=new pR,this.scene.add(this.bgLayer.group),this.composer=new $C(this.renderer);const s=new YC(this.scene,this.camera);this.composer.addPass(s);const o=new To(new xe(i/2,r/2),1.2,.4,.15);this.composer.addPass(o),this.scene.updateMatrixWorld(!0),window.addEventListener("resize",this.onResize),this.setupEventListeners()}setupEventListeners(){const e=u=>{var a;const d=this.sessions.get(u.sessionId);if(d)if(u.agentId&&d.subagents.has(u.agentId)?d.subagents.get(u.agentId).triggerActivity():d.core.triggerActivity(),u.tool==="Glob"){const h=(typeof((a=u.toolResponse)==null?void 0:a.content)=="string"?u.toolResponse.content:"").split(`
`).filter(v=>{const g=v.trim();return g.length>0&&!g.startsWith("Found")&&!g.startsWith("No files")&&!g.startsWith("Error")}).length,m=ly(h);d.particles.spawnRaw(m)}else d.particles.spawn(u.tool,u.colorHex,void 0,u.toolInput,u.toolResponse)},t=u=>{const d=this.sessions.get(u.sessionId);d&&(d.core.triggerActivity(),d.particles.spawn("prompt","#b0c8f0"))},i=u=>{const d=this.sessions.get(u.sessionId);d&&(d.core.triggerActivity(),d.particles.spawn("response","#aad4ff"))},r=u=>{const d=this.sessions.get(u.sessionId);d&&(d.core.triggerActivity(),d.particles.spawn("compact:pre","#FFD060"))},s=u=>{const d=this.sessions.get(u.sessionId);d&&(d.core.triggerActivity(),d.particles.spawn("compact:post","#FFE080"))},o=u=>{const d=this.sessions.get(u.sessionId);d&&d.particles.spawn("Stop")},c=u=>{const d=this.sessions.get(u.sessionId);if(d&&!d.subagents.has(u.agentId)){const a=new v2;d.subagents.set(u.agentId,a),d.group.add(a.group),a.triggerActivity()}},l=u=>{const d=this.sessions.get(u.sessionId);if(!d)return;const a=d.subagents.get(u.agentId);a&&(d.group.remove(a.group),a.dispose(),d.subagents.delete(u.agentId))};ct.on("tool:used",e),ct.on("prompt:submitted",t),ct.on("response:received",i),ct.on("compact:pre",r),ct.on("compact:post",s),ct.on("session:end",o),ct.on("subagent:start",c),ct.on("subagent:stop",l),this.eventUnsubs.push(()=>ct.off("tool:used",e),()=>ct.off("prompt:submitted",t),()=>ct.off("response:received",i),()=>ct.off("compact:pre",r),()=>ct.off("compact:post",s),()=>ct.off("session:end",o),()=>ct.off("subagent:start",c),()=>ct.off("subagent:stop",l))}syncSessions(e){for(const[t,i]of e)if(this.sessions.has(t)){const r=this.sessions.get(t);i.model&&r.core.setModel(i.model)}else{const r=i.model||"unknown",s=new li,o=new mR(r),c=new g2;s.add(o.group),s.add(c.group);const u=this.sessions.size/Math.max(1,e.size)*Math.PI*2,d=e.size>1?150:0;s.position.set(Math.cos(u)*d,y2(-20,20),Math.sin(u)*d),this.scene.add(s),this.sessions.set(t,{group:s,core:o,particles:c,subagents:new Map}),this.loadSessionHistory(t,c)}for(const[t,i]of this.sessions)if(!e.has(t)){this.scene.remove(i.group),i.core.dispose(),i.particles.dispose();for(const r of i.subagents.values())r.dispose();i.subagents.clear(),this.sessions.delete(t)}}loadSessionHistory(e,t){fetch(`/api/history?session=${encodeURIComponent(e)}`).then(i=>i.json()).then(i=>{if(i.length===0)return;const r=Math.min(i.length,250),s=i.length/r;for(let o=0;o<r;o++){const c=i[Math.floor(o*s)],l=c.tool_name||c.hook_event_name||"Read",u=Xd[l]||jd,d=new ne(u),a=(Math.random()-.5)*2*(20+Math.pow(Math.random(),.6)*120)*(.4+Math.random()*2.1),f=(Math.random()-.5)*2*(20+Math.pow(Math.random(),.6)*120)*(.1+Math.random()*.4),h=(Math.random()-.5)*2*(20+Math.pow(Math.random(),.6)*120)*(.4+Math.random()*2.1),m=new P(a,f,h);t.addHistoryStar(m,d)}console.log(`[Three] Session ${e.slice(0,8)}: ${r} history stars from ${i.length} events`)}).catch(()=>{})}setAutofit(e){this._autofit=e}setAutoRotate(e){this._autoRotate=e,this.controls.autoRotate=e}_fitCamera(){if(this.sessions.size===0)return;let e=1/0,t=-1/0,i=1/0,r=-1/0,s=1/0,o=-1/0;for(const v of this.sessions.values()){const g=v.group.position,p=140;e=Math.min(e,g.x-p),t=Math.max(t,g.x+p),i=Math.min(i,g.y-p),r=Math.max(r,g.y+p),s=Math.min(s,g.z-p),o=Math.max(o,g.z+p)}const c=(e+t)/2,l=(i+r)/2,u=(s+o)/2,d=Math.max(t-e,r-i,o-s),a=this.camera.fov*(Math.PI/180),f=Math.max(d/2/Math.tan(a/2)*1.3,80);this.controls.target.lerp(new P(c,l,u),.02);const h=this.camera.position.clone().sub(this.controls.target).normalize(),m=this.controls.target.clone().addScaledVector(h,f);this.camera.position.lerp(m,.02)}tick(e){const t=Math.min(e,.05);this.elapsed+=t,this.syncSessions(this.clustersRef.current),this.bgLayer.tick(t),this._autofit&&this._fitCamera(),this.controls.update();for(const i of this.sessions.values()){i.core.tick(t,this.elapsed),i.particles.tick(t);for(const r of i.subagents.values())r.tick(t,this.elapsed)}try{this.composer.render()}catch{}}destroy(){window.removeEventListener("resize",this.onResize);for(const e of this.eventUnsubs)e();this.eventUnsubs=[];for(const e of this.sessions.values()){e.core.dispose(),e.particles.dispose();for(const t of e.subagents.values())t.dispose()}this.sessions.clear(),this.bgLayer.dispose(),this.controls.dispose(),this.renderer.dispose(),this.container.removeChild(this.renderer.domElement)}}function y2(n,e){return Math.random()*(e-n)+n}function S2({clusters:n,onHover:e,onSelect:t,autofitEnabled:i,autoRotateEnabled:r}){const s=Ue.useRef(null),o=Ue.useRef(null),c=Ue.useRef(n);return c.current=n,Ue.useEffect(()=>{o.current&&o.current.setAutofit(i)},[i]),Ue.useEffect(()=>{o.current&&o.current.setAutoRotate(r)},[r]),Ue.useEffect(()=>{const l=s.current;if(!l)return;let u=null,d=performance.now();const a=new x2(l,c);a.setAutofit(i),a.setAutoRotate(r),o.current=a;const f=()=>{const h=performance.now(),m=(h-d)/1e3;d=h,a.tick(m),u=requestAnimationFrame(f)};return u=requestAnimationFrame(f),()=>{u!==null&&cancelAnimationFrame(u),a.destroy(),o.current=null}},[]),q.jsx("div",{ref:s,style:{position:"relative",width:"100vw",height:"100vh",background:"#000000"}})}const X_=["/src/App.tsx","/src/store.ts","/src/types.ts","/src/canvas/renderer.ts","/src/canvas/graph.ts","/server/index.js","/package.json","/client/vite.config.ts","/src/main.tsx","/src/index.css","/src/DebugPanel.tsx","/tests/store.test.ts","/bin/claude-live.js"],j_=["npm run build","git status","ls -la src/","npx tsc --noEmit","npm test","git diff --stat"];function $_(){return"debug-"+Math.random().toString(36).slice(2,8)}async function Hn(n){await fetch("/hook",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)})}function M2({sessionIds:n,isOpen:e,onClose:t,onLoadHistory:i}){const[r,s]=Ue.useState($_),[o,c]=Ue.useState([]),[l,u]=Ue.useState(!1),[d,a]=Ue.useState(null),[f,h]=Ue.useState(null),m=Ue.useRef(0),v=Ue.useRef(0),g=Ue.useRef(0),p=Ue.useRef([]);function _(){const L="agent-"+Math.random().toString(36).slice(2,7);return p.current.push(L),L}function x(){return p.current.pop()||"none"}function S(){return X_[m.current++%X_.length]}function A(){return j_[v.current++%j_.length]}function M(){return g.current+=1,`${Date.now().toString(36)}${g.current.toString(36)}`}function T(L,U){return`${L}@${U}`}Ue.useEffect(()=>{e&&y()},[e]);async function y(){u(!0),h(null);try{const L=await fetch("/api/history");if(!L.ok)throw new Error(`HTTP ${L.status}`);const U=await L.json(),z=new Map;if(Array.isArray(U))for(const H of U){const k=H==null?void 0:H.session_id;if(!k)continue;const X=typeof H.timestamp=="number"?H.timestamp:Date.now(),Q=z.get(k);(!Q||X>Q)&&z.set(k,X)}const V=[...z.entries()].map(([H,k])=>({id:H,ts:k})).sort((H,k)=>k.ts-H.ts).slice(0,10);c(V)}catch(L){h((L==null?void 0:L.message)||"Failed to fetch history")}finally{u(!1)}}async function E(L){a(L),h(null);try{const U=await fetch(`/api/history?session=${encodeURIComponent(L)}`);if(!U.ok)throw new Error(`HTTP ${U.status}`);const z=await U.json();Array.isArray(z)&&(i==null||i(L,z),s(L))}catch(U){h((U==null?void 0:U.message)||"Failed to load session history")}finally{a(null)}}function D(L,U,z={}){return Hn({session_id:r,hook_event_name:"PostToolUse",tool_name:L,tool_input:U,tool_response:z})}const C=[{label:"Read",color:"#4ade80",fn:()=>{const L=M(),U=T(S(),L);D("Read",{file_path:U},{type:"text",file:{filePath:U,content:"Response data from file read operation with individual letters streaming outward"}})}},{label:"Edit",color:"#60a5fa",fn:()=>{const L=M();D("Edit",{file_path:T(S(),L)})}},{label:"Write",color:"#60a5fa",fn:()=>{const L=M();D("Write",{file_path:T(S(),L),content:"Writing content to file with response snake animation showing letters outward"},{})}},{label:"Grep",color:"#a78bfa",fn:()=>{const L=M();D("Grep",{pattern:"useState",path:`/tmp/${L}`},{count:12})}},{label:"Glob",color:"#a78bfa",fn:()=>{const L=M();D("Glob",{pattern:"**/*.tsx",path:`/tmp/${L}`},{files:["a.tsx","b.tsx"]})}},{label:"Bash",color:"#f59e0b",fn:()=>{const L=M();D("Bash",{command:`${A()} #${L}`},{stdout:"bash command output with response letters flowing outward in straight animation paths",stderr:"",interrupted:!1,exitCode:0})}},{label:"WebFetch",color:"#f472b6",fn:()=>{const L=M();D("WebFetch",{url:`https://debug-${L}.local`},{status:200})}},{label:"Notification",color:"#34d399",fn:()=>{const L=M();Hn({session_id:r,hook_event_name:"Notification",tool_input:{message:`Task complete! All files updated. #${L}`}})}},{label:"Permission",color:"#fbbf24",fn:()=>{const L=M();Hn({session_id:r,hook_event_name:"PermissionRequest",tool_input:{message:`Allow bash command execution? #${L}`}})}},{label:"Stop",color:"#888888",fn:()=>Hn({session_id:r,hook_event_name:"Stop"})},{label:"SubStart",color:"#c084fc",fn:()=>Hn({session_id:r,hook_event_name:"SubagentStart",agent_id:_(),agent_type:"general-purpose"})},{label:"SubStop",color:"#7c3aed",fn:()=>Hn({session_id:r,hook_event_name:"SubagentStop",agent_id:x()})},{label:"SessEnd",color:"#ef4444",fn:()=>Hn({session_id:r,hook_event_name:"SessionEnd"})},{label:"Fail",color:"#f87171",fn:()=>Hn({session_id:r,hook_event_name:"PostToolUseFailure",tool_name:"Read",tool_input:{file_path:S()},error:"File not found"})},{label:"Compact↓",color:"#94a3b8",fn:()=>Hn({session_id:r,hook_event_name:"PreCompact",trigger:"manual"})},{label:"Compact↑",color:"#38bdf8",fn:()=>Hn({session_id:r,hook_event_name:"PostCompact"})},{label:"Prompt",color:"#b0c8f0",fn:()=>Hn({session_id:r,hook_event_name:"UserPromptSubmit",prompt:`Fix the login bug on the dashboard page #${M()}`})},{label:"Response",color:"#7eb8f0",fn:()=>Hn({session_id:r,hook_event_name:"Stop",last_assistant_message:"Here is the fix for the login bug. Updated auth middleware to handle token refresh correctly."})}];if(!e)return null;const F=n.includes(r)?n:[...n,r];return q.jsxs("div",{className:"panel-overlay",children:[q.jsxs("div",{className:"debug-panel-header",children:[q.jsx("span",{className:"debug-panel-title",children:"debug"}),q.jsx("button",{className:"debug-close",onClick:t,children:"×"})]}),q.jsxs("div",{className:"debug-section",children:[q.jsx("div",{className:"debug-section-label",children:"session"}),q.jsxs("div",{className:"debug-session-row",children:[q.jsx("select",{className:"debug-select",value:r,onChange:L=>s(L.target.value),children:F.map(L=>q.jsx("option",{value:L,children:L.slice(0,18)},L))}),q.jsx("button",{className:"debug-new-btn",onClick:()=>s($_()),children:"+ new"})]}),q.jsxs("div",{className:"debug-history-row",style:{marginTop:10},children:[q.jsx("button",{className:"debug-new-btn",onClick:y,disabled:l,children:l?"loading…":"pull history"}),f&&q.jsx("span",{className:"debug-hint",style:{marginLeft:8},children:f})]}),o.length>0&&q.jsx("div",{className:"debug-history-list",style:{marginTop:8},children:o.map(L=>q.jsx("button",{className:"debug-history-btn",onClick:()=>E(L.id),title:L.id,children:d===L.id?"loading…":L.id.slice(0,18)},L.id))})]}),q.jsxs("div",{className:"debug-section",children:[q.jsx("div",{className:"debug-section-label",children:"fire event"}),q.jsx("div",{className:"debug-tool-grid",children:C.map(({label:L,color:U,fn:z})=>q.jsx("button",{className:"debug-tool-btn",style:{"--tool-color":U},onClick:z,children:L},L))})]})]})}const w2=[{badge:"#",name:"Read",description:"file operations",color:"#22c55e"},{badge:"E",name:"Edit / Write",description:"editing tools",color:"#3b82f6"},{badge:"B",name:"Bash",description:"shell commands",color:"#f97316"},{badge:"G",name:"Grep / Glob",description:"search tools",color:"#a855f7"},{badge:"↗",name:"WebFetch",description:"HTTP requests",color:"#ec4899"},{badge:"!",name:"Notification",description:"notifications",color:"#06b6d4"},{badge:"✓",name:"Stop",description:"tool completion",color:"#666666"},{badge:"⬡",name:"Subagent",description:"subagent execution",color:"#a855f7"}],E2=[{name:"Slide-in bounce",description:"New event arrives at top of log"},{name:"Dot pop",description:"Emphasis animation on new entry (scale/rotate)"},{name:"Scan shimmer",description:"Left-to-right scan effect (processing effect)"},{name:"Fade with time",description:"Entry visibility decreases after 5 seconds"}];function T2({isOpen:n,onClose:e}){return n?q.jsxs("div",{className:"panel-overlay operations-panel",children:[q.jsx("button",{className:"panel-close-btn",onClick:e,children:"×"}),q.jsxs("div",{className:"panel-section",children:[q.jsx("h3",{children:"Node Types"}),q.jsx("div",{className:"node-types-grid",children:w2.map(t=>q.jsxs("div",{className:"node-type-item",children:[q.jsx("div",{className:"node-type-badge",style:{background:t.color},children:t.badge}),q.jsxs("div",{className:"node-type-info",children:[q.jsx("div",{className:"node-type-name",children:t.name}),q.jsx("div",{className:"node-type-description",children:t.description})]})]},t.name))})]}),q.jsxs("div",{className:"panel-section",children:[q.jsx("h3",{children:"Animation Styles"}),q.jsx("div",{className:"animations-list",children:E2.map(t=>q.jsxs("div",{className:"animation-item",children:[q.jsx("div",{className:"animation-name",children:t.name}),q.jsx("div",{className:"animation-description",children:t.description})]},t.name))})]})]}):null}var fy={};/*!
 *  howler.js v2.2.4
 *  howlerjs.com
 *
 *  (c) 2013-2020, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */(function(n){(function(){var e=function(){this.init()};e.prototype={init:function(){var a=this||t;return a._counter=1e3,a._html5AudioPool=[],a.html5PoolSize=10,a._codecs={},a._howls=[],a._muted=!1,a._volume=1,a._canPlayEvent="canplaythrough",a._navigator=typeof window<"u"&&window.navigator?window.navigator:null,a.masterGain=null,a.noAudio=!1,a.usingWebAudio=!0,a.autoSuspend=!0,a.ctx=null,a.autoUnlock=!0,a._setup(),a},volume:function(a){var f=this||t;if(a=parseFloat(a),f.ctx||d(),typeof a<"u"&&a>=0&&a<=1){if(f._volume=a,f._muted)return f;f.usingWebAudio&&f.masterGain.gain.setValueAtTime(a,t.ctx.currentTime);for(var h=0;h<f._howls.length;h++)if(!f._howls[h]._webAudio)for(var m=f._howls[h]._getSoundIds(),v=0;v<m.length;v++){var g=f._howls[h]._soundById(m[v]);g&&g._node&&(g._node.volume=g._volume*a)}return f}return f._volume},mute:function(a){var f=this||t;f.ctx||d(),f._muted=a,f.usingWebAudio&&f.masterGain.gain.setValueAtTime(a?0:f._volume,t.ctx.currentTime);for(var h=0;h<f._howls.length;h++)if(!f._howls[h]._webAudio)for(var m=f._howls[h]._getSoundIds(),v=0;v<m.length;v++){var g=f._howls[h]._soundById(m[v]);g&&g._node&&(g._node.muted=a?!0:g._muted)}return f},stop:function(){for(var a=this||t,f=0;f<a._howls.length;f++)a._howls[f].stop();return a},unload:function(){for(var a=this||t,f=a._howls.length-1;f>=0;f--)a._howls[f].unload();return a.usingWebAudio&&a.ctx&&typeof a.ctx.close<"u"&&(a.ctx.close(),a.ctx=null,d()),a},codecs:function(a){return(this||t)._codecs[a.replace(/^x-/,"")]},_setup:function(){var a=this||t;if(a.state=a.ctx&&a.ctx.state||"suspended",a._autoSuspend(),!a.usingWebAudio)if(typeof Audio<"u")try{var f=new Audio;typeof f.oncanplaythrough>"u"&&(a._canPlayEvent="canplay")}catch{a.noAudio=!0}else a.noAudio=!0;try{var f=new Audio;f.muted&&(a.noAudio=!0)}catch{}return a.noAudio||a._setupCodecs(),a},_setupCodecs:function(){var a=this||t,f=null;try{f=typeof Audio<"u"?new Audio:null}catch{return a}if(!f||typeof f.canPlayType!="function")return a;var h=f.canPlayType("audio/mpeg;").replace(/^no$/,""),m=a._navigator?a._navigator.userAgent:"",v=m.match(/OPR\/(\d+)/g),g=v&&parseInt(v[0].split("/")[1],10)<33,p=m.indexOf("Safari")!==-1&&m.indexOf("Chrome")===-1,_=m.match(/Version\/(.*?) /),x=p&&_&&parseInt(_[1],10)<15;return a._codecs={mp3:!!(!g&&(h||f.canPlayType("audio/mp3;").replace(/^no$/,""))),mpeg:!!h,opus:!!f.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/,""),ogg:!!f.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),oga:!!f.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),wav:!!(f.canPlayType('audio/wav; codecs="1"')||f.canPlayType("audio/wav")).replace(/^no$/,""),aac:!!f.canPlayType("audio/aac;").replace(/^no$/,""),caf:!!f.canPlayType("audio/x-caf;").replace(/^no$/,""),m4a:!!(f.canPlayType("audio/x-m4a;")||f.canPlayType("audio/m4a;")||f.canPlayType("audio/aac;")).replace(/^no$/,""),m4b:!!(f.canPlayType("audio/x-m4b;")||f.canPlayType("audio/m4b;")||f.canPlayType("audio/aac;")).replace(/^no$/,""),mp4:!!(f.canPlayType("audio/x-mp4;")||f.canPlayType("audio/mp4;")||f.canPlayType("audio/aac;")).replace(/^no$/,""),weba:!!(!x&&f.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/,"")),webm:!!(!x&&f.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/,"")),dolby:!!f.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/,""),flac:!!(f.canPlayType("audio/x-flac;")||f.canPlayType("audio/flac;")).replace(/^no$/,"")},a},_unlockAudio:function(){var a=this||t;if(!(a._audioUnlocked||!a.ctx)){a._audioUnlocked=!1,a.autoUnlock=!1,!a._mobileUnloaded&&a.ctx.sampleRate!==44100&&(a._mobileUnloaded=!0,a.unload()),a._scratchBuffer=a.ctx.createBuffer(1,1,22050);var f=function(h){for(;a._html5AudioPool.length<a.html5PoolSize;)try{var m=new Audio;m._unlocked=!0,a._releaseHtml5Audio(m)}catch{a.noAudio=!0;break}for(var v=0;v<a._howls.length;v++)if(!a._howls[v]._webAudio)for(var g=a._howls[v]._getSoundIds(),p=0;p<g.length;p++){var _=a._howls[v]._soundById(g[p]);_&&_._node&&!_._node._unlocked&&(_._node._unlocked=!0,_._node.load())}a._autoResume();var x=a.ctx.createBufferSource();x.buffer=a._scratchBuffer,x.connect(a.ctx.destination),typeof x.start>"u"?x.noteOn(0):x.start(0),typeof a.ctx.resume=="function"&&a.ctx.resume(),x.onended=function(){x.disconnect(0),a._audioUnlocked=!0,document.removeEventListener("touchstart",f,!0),document.removeEventListener("touchend",f,!0),document.removeEventListener("click",f,!0),document.removeEventListener("keydown",f,!0);for(var S=0;S<a._howls.length;S++)a._howls[S]._emit("unlock")}};return document.addEventListener("touchstart",f,!0),document.addEventListener("touchend",f,!0),document.addEventListener("click",f,!0),document.addEventListener("keydown",f,!0),a}},_obtainHtml5Audio:function(){var a=this||t;if(a._html5AudioPool.length)return a._html5AudioPool.pop();var f=new Audio().play();return f&&typeof Promise<"u"&&(f instanceof Promise||typeof f.then=="function")&&f.catch(function(){console.warn("HTML5 Audio pool exhausted, returning potentially locked audio object.")}),new Audio},_releaseHtml5Audio:function(a){var f=this||t;return a._unlocked&&f._html5AudioPool.push(a),f},_autoSuspend:function(){var a=this;if(!(!a.autoSuspend||!a.ctx||typeof a.ctx.suspend>"u"||!t.usingWebAudio)){for(var f=0;f<a._howls.length;f++)if(a._howls[f]._webAudio){for(var h=0;h<a._howls[f]._sounds.length;h++)if(!a._howls[f]._sounds[h]._paused)return a}return a._suspendTimer&&clearTimeout(a._suspendTimer),a._suspendTimer=setTimeout(function(){if(a.autoSuspend){a._suspendTimer=null,a.state="suspending";var m=function(){a.state="suspended",a._resumeAfterSuspend&&(delete a._resumeAfterSuspend,a._autoResume())};a.ctx.suspend().then(m,m)}},3e4),a}},_autoResume:function(){var a=this;if(!(!a.ctx||typeof a.ctx.resume>"u"||!t.usingWebAudio))return a.state==="running"&&a.ctx.state!=="interrupted"&&a._suspendTimer?(clearTimeout(a._suspendTimer),a._suspendTimer=null):a.state==="suspended"||a.state==="running"&&a.ctx.state==="interrupted"?(a.ctx.resume().then(function(){a.state="running";for(var f=0;f<a._howls.length;f++)a._howls[f]._emit("resume")}),a._suspendTimer&&(clearTimeout(a._suspendTimer),a._suspendTimer=null)):a.state==="suspending"&&(a._resumeAfterSuspend=!0),a}};var t=new e,i=function(a){var f=this;if(!a.src||a.src.length===0){console.error("An array of source files must be passed with any new Howl.");return}f.init(a)};i.prototype={init:function(a){var f=this;return t.ctx||d(),f._autoplay=a.autoplay||!1,f._format=typeof a.format!="string"?a.format:[a.format],f._html5=a.html5||!1,f._muted=a.mute||!1,f._loop=a.loop||!1,f._pool=a.pool||5,f._preload=typeof a.preload=="boolean"||a.preload==="metadata"?a.preload:!0,f._rate=a.rate||1,f._sprite=a.sprite||{},f._src=typeof a.src!="string"?a.src:[a.src],f._volume=a.volume!==void 0?a.volume:1,f._xhr={method:a.xhr&&a.xhr.method?a.xhr.method:"GET",headers:a.xhr&&a.xhr.headers?a.xhr.headers:null,withCredentials:a.xhr&&a.xhr.withCredentials?a.xhr.withCredentials:!1},f._duration=0,f._state="unloaded",f._sounds=[],f._endTimers={},f._queue=[],f._playLock=!1,f._onend=a.onend?[{fn:a.onend}]:[],f._onfade=a.onfade?[{fn:a.onfade}]:[],f._onload=a.onload?[{fn:a.onload}]:[],f._onloaderror=a.onloaderror?[{fn:a.onloaderror}]:[],f._onplayerror=a.onplayerror?[{fn:a.onplayerror}]:[],f._onpause=a.onpause?[{fn:a.onpause}]:[],f._onplay=a.onplay?[{fn:a.onplay}]:[],f._onstop=a.onstop?[{fn:a.onstop}]:[],f._onmute=a.onmute?[{fn:a.onmute}]:[],f._onvolume=a.onvolume?[{fn:a.onvolume}]:[],f._onrate=a.onrate?[{fn:a.onrate}]:[],f._onseek=a.onseek?[{fn:a.onseek}]:[],f._onunlock=a.onunlock?[{fn:a.onunlock}]:[],f._onresume=[],f._webAudio=t.usingWebAudio&&!f._html5,typeof t.ctx<"u"&&t.ctx&&t.autoUnlock&&t._unlockAudio(),t._howls.push(f),f._autoplay&&f._queue.push({event:"play",action:function(){f.play()}}),f._preload&&f._preload!=="none"&&f.load(),f},load:function(){var a=this,f=null;if(t.noAudio){a._emit("loaderror",null,"No audio support.");return}typeof a._src=="string"&&(a._src=[a._src]);for(var h=0;h<a._src.length;h++){var m,v;if(a._format&&a._format[h])m=a._format[h];else{if(v=a._src[h],typeof v!="string"){a._emit("loaderror",null,"Non-string found in selected audio sources - ignoring.");continue}m=/^data:audio\/([^;,]+);/i.exec(v),m||(m=/\.([^.]+)$/.exec(v.split("?",1)[0])),m&&(m=m[1].toLowerCase())}if(m||console.warn('No file extension was found. Consider using the "format" property or specify an extension.'),m&&t.codecs(m)){f=a._src[h];break}}if(!f){a._emit("loaderror",null,"No codec support for selected audio sources.");return}return a._src=f,a._state="loading",window.location.protocol==="https:"&&f.slice(0,5)==="http:"&&(a._html5=!0,a._webAudio=!1),new r(a),a._webAudio&&o(a),a},play:function(a,f){var h=this,m=null;if(typeof a=="number")m=a,a=null;else{if(typeof a=="string"&&h._state==="loaded"&&!h._sprite[a])return null;if(typeof a>"u"&&(a="__default",!h._playLock)){for(var v=0,g=0;g<h._sounds.length;g++)h._sounds[g]._paused&&!h._sounds[g]._ended&&(v++,m=h._sounds[g]._id);v===1?a=null:m=null}}var p=m?h._soundById(m):h._inactiveSound();if(!p)return null;if(m&&!a&&(a=p._sprite||"__default"),h._state!=="loaded"){p._sprite=a,p._ended=!1;var _=p._id;return h._queue.push({event:"play",action:function(){h.play(_)}}),_}if(m&&!p._paused)return f||h._loadQueue("play"),p._id;h._webAudio&&t._autoResume();var x=Math.max(0,p._seek>0?p._seek:h._sprite[a][0]/1e3),S=Math.max(0,(h._sprite[a][0]+h._sprite[a][1])/1e3-x),A=S*1e3/Math.abs(p._rate),M=h._sprite[a][0]/1e3,T=(h._sprite[a][0]+h._sprite[a][1])/1e3;p._sprite=a,p._ended=!1;var y=function(){p._paused=!1,p._seek=x,p._start=M,p._stop=T,p._loop=!!(p._loop||h._sprite[a][2])};if(x>=T){h._ended(p);return}var E=p._node;if(h._webAudio){var D=function(){h._playLock=!1,y(),h._refreshBuffer(p);var U=p._muted||h._muted?0:p._volume;E.gain.setValueAtTime(U,t.ctx.currentTime),p._playStart=t.ctx.currentTime,typeof E.bufferSource.start>"u"?p._loop?E.bufferSource.noteGrainOn(0,x,86400):E.bufferSource.noteGrainOn(0,x,S):p._loop?E.bufferSource.start(0,x,86400):E.bufferSource.start(0,x,S),A!==1/0&&(h._endTimers[p._id]=setTimeout(h._ended.bind(h,p),A)),f||setTimeout(function(){h._emit("play",p._id),h._loadQueue()},0)};t.state==="running"&&t.ctx.state!=="interrupted"?D():(h._playLock=!0,h.once("resume",D),h._clearTimer(p._id))}else{var C=function(){E.currentTime=x,E.muted=p._muted||h._muted||t._muted||E.muted,E.volume=p._volume*t.volume(),E.playbackRate=p._rate;try{var U=E.play();if(U&&typeof Promise<"u"&&(U instanceof Promise||typeof U.then=="function")?(h._playLock=!0,y(),U.then(function(){h._playLock=!1,E._unlocked=!0,f?h._loadQueue():h._emit("play",p._id)}).catch(function(){h._playLock=!1,h._emit("playerror",p._id,"Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction."),p._ended=!0,p._paused=!0})):f||(h._playLock=!1,y(),h._emit("play",p._id)),E.playbackRate=p._rate,E.paused){h._emit("playerror",p._id,"Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction.");return}a!=="__default"||p._loop?h._endTimers[p._id]=setTimeout(h._ended.bind(h,p),A):(h._endTimers[p._id]=function(){h._ended(p),E.removeEventListener("ended",h._endTimers[p._id],!1)},E.addEventListener("ended",h._endTimers[p._id],!1))}catch(z){h._emit("playerror",p._id,z)}};E.src==="data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA"&&(E.src=h._src,E.load());var F=window&&window.ejecta||!E.readyState&&t._navigator.isCocoonJS;if(E.readyState>=3||F)C();else{h._playLock=!0,h._state="loading";var L=function(){h._state="loaded",C(),E.removeEventListener(t._canPlayEvent,L,!1)};E.addEventListener(t._canPlayEvent,L,!1),h._clearTimer(p._id)}}return p._id},pause:function(a){var f=this;if(f._state!=="loaded"||f._playLock)return f._queue.push({event:"pause",action:function(){f.pause(a)}}),f;for(var h=f._getSoundIds(a),m=0;m<h.length;m++){f._clearTimer(h[m]);var v=f._soundById(h[m]);if(v&&!v._paused&&(v._seek=f.seek(h[m]),v._rateSeek=0,v._paused=!0,f._stopFade(h[m]),v._node))if(f._webAudio){if(!v._node.bufferSource)continue;typeof v._node.bufferSource.stop>"u"?v._node.bufferSource.noteOff(0):v._node.bufferSource.stop(0),f._cleanBuffer(v._node)}else(!isNaN(v._node.duration)||v._node.duration===1/0)&&v._node.pause();arguments[1]||f._emit("pause",v?v._id:null)}return f},stop:function(a,f){var h=this;if(h._state!=="loaded"||h._playLock)return h._queue.push({event:"stop",action:function(){h.stop(a)}}),h;for(var m=h._getSoundIds(a),v=0;v<m.length;v++){h._clearTimer(m[v]);var g=h._soundById(m[v]);g&&(g._seek=g._start||0,g._rateSeek=0,g._paused=!0,g._ended=!0,h._stopFade(m[v]),g._node&&(h._webAudio?g._node.bufferSource&&(typeof g._node.bufferSource.stop>"u"?g._node.bufferSource.noteOff(0):g._node.bufferSource.stop(0),h._cleanBuffer(g._node)):(!isNaN(g._node.duration)||g._node.duration===1/0)&&(g._node.currentTime=g._start||0,g._node.pause(),g._node.duration===1/0&&h._clearSound(g._node))),f||h._emit("stop",g._id))}return h},mute:function(a,f){var h=this;if(h._state!=="loaded"||h._playLock)return h._queue.push({event:"mute",action:function(){h.mute(a,f)}}),h;if(typeof f>"u")if(typeof a=="boolean")h._muted=a;else return h._muted;for(var m=h._getSoundIds(f),v=0;v<m.length;v++){var g=h._soundById(m[v]);g&&(g._muted=a,g._interval&&h._stopFade(g._id),h._webAudio&&g._node?g._node.gain.setValueAtTime(a?0:g._volume,t.ctx.currentTime):g._node&&(g._node.muted=t._muted?!0:a),h._emit("mute",g._id))}return h},volume:function(){var a=this,f=arguments,h,m;if(f.length===0)return a._volume;if(f.length===1||f.length===2&&typeof f[1]>"u"){var v=a._getSoundIds(),g=v.indexOf(f[0]);g>=0?m=parseInt(f[0],10):h=parseFloat(f[0])}else f.length>=2&&(h=parseFloat(f[0]),m=parseInt(f[1],10));var p;if(typeof h<"u"&&h>=0&&h<=1){if(a._state!=="loaded"||a._playLock)return a._queue.push({event:"volume",action:function(){a.volume.apply(a,f)}}),a;typeof m>"u"&&(a._volume=h),m=a._getSoundIds(m);for(var _=0;_<m.length;_++)p=a._soundById(m[_]),p&&(p._volume=h,f[2]||a._stopFade(m[_]),a._webAudio&&p._node&&!p._muted?p._node.gain.setValueAtTime(h,t.ctx.currentTime):p._node&&!p._muted&&(p._node.volume=h*t.volume()),a._emit("volume",p._id))}else return p=m?a._soundById(m):a._sounds[0],p?p._volume:0;return a},fade:function(a,f,h,m){var v=this;if(v._state!=="loaded"||v._playLock)return v._queue.push({event:"fade",action:function(){v.fade(a,f,h,m)}}),v;a=Math.min(Math.max(0,parseFloat(a)),1),f=Math.min(Math.max(0,parseFloat(f)),1),h=parseFloat(h),v.volume(a,m);for(var g=v._getSoundIds(m),p=0;p<g.length;p++){var _=v._soundById(g[p]);if(_){if(m||v._stopFade(g[p]),v._webAudio&&!_._muted){var x=t.ctx.currentTime,S=x+h/1e3;_._volume=a,_._node.gain.setValueAtTime(a,x),_._node.gain.linearRampToValueAtTime(f,S)}v._startFadeInterval(_,a,f,h,g[p],typeof m>"u")}}return v},_startFadeInterval:function(a,f,h,m,v,g){var p=this,_=f,x=h-f,S=Math.abs(x/.01),A=Math.max(4,S>0?m/S:m),M=Date.now();a._fadeTo=h,a._interval=setInterval(function(){var T=(Date.now()-M)/m;M=Date.now(),_+=x*T,_=Math.round(_*100)/100,x<0?_=Math.max(h,_):_=Math.min(h,_),p._webAudio?a._volume=_:p.volume(_,a._id,!0),g&&(p._volume=_),(h<f&&_<=h||h>f&&_>=h)&&(clearInterval(a._interval),a._interval=null,a._fadeTo=null,p.volume(h,a._id),p._emit("fade",a._id))},A)},_stopFade:function(a){var f=this,h=f._soundById(a);return h&&h._interval&&(f._webAudio&&h._node.gain.cancelScheduledValues(t.ctx.currentTime),clearInterval(h._interval),h._interval=null,f.volume(h._fadeTo,a),h._fadeTo=null,f._emit("fade",a)),f},loop:function(){var a=this,f=arguments,h,m,v;if(f.length===0)return a._loop;if(f.length===1)if(typeof f[0]=="boolean")h=f[0],a._loop=h;else return v=a._soundById(parseInt(f[0],10)),v?v._loop:!1;else f.length===2&&(h=f[0],m=parseInt(f[1],10));for(var g=a._getSoundIds(m),p=0;p<g.length;p++)v=a._soundById(g[p]),v&&(v._loop=h,a._webAudio&&v._node&&v._node.bufferSource&&(v._node.bufferSource.loop=h,h&&(v._node.bufferSource.loopStart=v._start||0,v._node.bufferSource.loopEnd=v._stop,a.playing(g[p])&&(a.pause(g[p],!0),a.play(g[p],!0)))));return a},rate:function(){var a=this,f=arguments,h,m;if(f.length===0)m=a._sounds[0]._id;else if(f.length===1){var v=a._getSoundIds(),g=v.indexOf(f[0]);g>=0?m=parseInt(f[0],10):h=parseFloat(f[0])}else f.length===2&&(h=parseFloat(f[0]),m=parseInt(f[1],10));var p;if(typeof h=="number"){if(a._state!=="loaded"||a._playLock)return a._queue.push({event:"rate",action:function(){a.rate.apply(a,f)}}),a;typeof m>"u"&&(a._rate=h),m=a._getSoundIds(m);for(var _=0;_<m.length;_++)if(p=a._soundById(m[_]),p){a.playing(m[_])&&(p._rateSeek=a.seek(m[_]),p._playStart=a._webAudio?t.ctx.currentTime:p._playStart),p._rate=h,a._webAudio&&p._node&&p._node.bufferSource?p._node.bufferSource.playbackRate.setValueAtTime(h,t.ctx.currentTime):p._node&&(p._node.playbackRate=h);var x=a.seek(m[_]),S=(a._sprite[p._sprite][0]+a._sprite[p._sprite][1])/1e3-x,A=S*1e3/Math.abs(p._rate);(a._endTimers[m[_]]||!p._paused)&&(a._clearTimer(m[_]),a._endTimers[m[_]]=setTimeout(a._ended.bind(a,p),A)),a._emit("rate",p._id)}}else return p=a._soundById(m),p?p._rate:a._rate;return a},seek:function(){var a=this,f=arguments,h,m;if(f.length===0)a._sounds.length&&(m=a._sounds[0]._id);else if(f.length===1){var v=a._getSoundIds(),g=v.indexOf(f[0]);g>=0?m=parseInt(f[0],10):a._sounds.length&&(m=a._sounds[0]._id,h=parseFloat(f[0]))}else f.length===2&&(h=parseFloat(f[0]),m=parseInt(f[1],10));if(typeof m>"u")return 0;if(typeof h=="number"&&(a._state!=="loaded"||a._playLock))return a._queue.push({event:"seek",action:function(){a.seek.apply(a,f)}}),a;var p=a._soundById(m);if(p)if(typeof h=="number"&&h>=0){var _=a.playing(m);_&&a.pause(m,!0),p._seek=h,p._ended=!1,a._clearTimer(m),!a._webAudio&&p._node&&!isNaN(p._node.duration)&&(p._node.currentTime=h);var x=function(){_&&a.play(m,!0),a._emit("seek",m)};if(_&&!a._webAudio){var S=function(){a._playLock?setTimeout(S,0):x()};setTimeout(S,0)}else x()}else if(a._webAudio){var A=a.playing(m)?t.ctx.currentTime-p._playStart:0,M=p._rateSeek?p._rateSeek-p._seek:0;return p._seek+(M+A*Math.abs(p._rate))}else return p._node.currentTime;return a},playing:function(a){var f=this;if(typeof a=="number"){var h=f._soundById(a);return h?!h._paused:!1}for(var m=0;m<f._sounds.length;m++)if(!f._sounds[m]._paused)return!0;return!1},duration:function(a){var f=this,h=f._duration,m=f._soundById(a);return m&&(h=f._sprite[m._sprite][1]/1e3),h},state:function(){return this._state},unload:function(){for(var a=this,f=a._sounds,h=0;h<f.length;h++)f[h]._paused||a.stop(f[h]._id),a._webAudio||(a._clearSound(f[h]._node),f[h]._node.removeEventListener("error",f[h]._errorFn,!1),f[h]._node.removeEventListener(t._canPlayEvent,f[h]._loadFn,!1),f[h]._node.removeEventListener("ended",f[h]._endFn,!1),t._releaseHtml5Audio(f[h]._node)),delete f[h]._node,a._clearTimer(f[h]._id);var m=t._howls.indexOf(a);m>=0&&t._howls.splice(m,1);var v=!0;for(h=0;h<t._howls.length;h++)if(t._howls[h]._src===a._src||a._src.indexOf(t._howls[h]._src)>=0){v=!1;break}return s&&v&&delete s[a._src],t.noAudio=!1,a._state="unloaded",a._sounds=[],a=null,null},on:function(a,f,h,m){var v=this,g=v["_on"+a];return typeof f=="function"&&g.push(m?{id:h,fn:f,once:m}:{id:h,fn:f}),v},off:function(a,f,h){var m=this,v=m["_on"+a],g=0;if(typeof f=="number"&&(h=f,f=null),f||h)for(g=0;g<v.length;g++){var p=h===v[g].id;if(f===v[g].fn&&p||!f&&p){v.splice(g,1);break}}else if(a)m["_on"+a]=[];else{var _=Object.keys(m);for(g=0;g<_.length;g++)_[g].indexOf("_on")===0&&Array.isArray(m[_[g]])&&(m[_[g]]=[])}return m},once:function(a,f,h){var m=this;return m.on(a,f,h,1),m},_emit:function(a,f,h){for(var m=this,v=m["_on"+a],g=v.length-1;g>=0;g--)(!v[g].id||v[g].id===f||a==="load")&&(setTimeout((function(p){p.call(this,f,h)}).bind(m,v[g].fn),0),v[g].once&&m.off(a,v[g].fn,v[g].id));return m._loadQueue(a),m},_loadQueue:function(a){var f=this;if(f._queue.length>0){var h=f._queue[0];h.event===a&&(f._queue.shift(),f._loadQueue()),a||h.action()}return f},_ended:function(a){var f=this,h=a._sprite;if(!f._webAudio&&a._node&&!a._node.paused&&!a._node.ended&&a._node.currentTime<a._stop)return setTimeout(f._ended.bind(f,a),100),f;var m=!!(a._loop||f._sprite[h][2]);if(f._emit("end",a._id),!f._webAudio&&m&&f.stop(a._id,!0).play(a._id),f._webAudio&&m){f._emit("play",a._id),a._seek=a._start||0,a._rateSeek=0,a._playStart=t.ctx.currentTime;var v=(a._stop-a._start)*1e3/Math.abs(a._rate);f._endTimers[a._id]=setTimeout(f._ended.bind(f,a),v)}return f._webAudio&&!m&&(a._paused=!0,a._ended=!0,a._seek=a._start||0,a._rateSeek=0,f._clearTimer(a._id),f._cleanBuffer(a._node),t._autoSuspend()),!f._webAudio&&!m&&f.stop(a._id,!0),f},_clearTimer:function(a){var f=this;if(f._endTimers[a]){if(typeof f._endTimers[a]!="function")clearTimeout(f._endTimers[a]);else{var h=f._soundById(a);h&&h._node&&h._node.removeEventListener("ended",f._endTimers[a],!1)}delete f._endTimers[a]}return f},_soundById:function(a){for(var f=this,h=0;h<f._sounds.length;h++)if(a===f._sounds[h]._id)return f._sounds[h];return null},_inactiveSound:function(){var a=this;a._drain();for(var f=0;f<a._sounds.length;f++)if(a._sounds[f]._ended)return a._sounds[f].reset();return new r(a)},_drain:function(){var a=this,f=a._pool,h=0,m=0;if(!(a._sounds.length<f)){for(m=0;m<a._sounds.length;m++)a._sounds[m]._ended&&h++;for(m=a._sounds.length-1;m>=0;m--){if(h<=f)return;a._sounds[m]._ended&&(a._webAudio&&a._sounds[m]._node&&a._sounds[m]._node.disconnect(0),a._sounds.splice(m,1),h--)}}},_getSoundIds:function(a){var f=this;if(typeof a>"u"){for(var h=[],m=0;m<f._sounds.length;m++)h.push(f._sounds[m]._id);return h}else return[a]},_refreshBuffer:function(a){var f=this;return a._node.bufferSource=t.ctx.createBufferSource(),a._node.bufferSource.buffer=s[f._src],a._panner?a._node.bufferSource.connect(a._panner):a._node.bufferSource.connect(a._node),a._node.bufferSource.loop=a._loop,a._loop&&(a._node.bufferSource.loopStart=a._start||0,a._node.bufferSource.loopEnd=a._stop||0),a._node.bufferSource.playbackRate.setValueAtTime(a._rate,t.ctx.currentTime),f},_cleanBuffer:function(a){var f=this,h=t._navigator&&t._navigator.vendor.indexOf("Apple")>=0;if(!a.bufferSource)return f;if(t._scratchBuffer&&a.bufferSource&&(a.bufferSource.onended=null,a.bufferSource.disconnect(0),h))try{a.bufferSource.buffer=t._scratchBuffer}catch{}return a.bufferSource=null,f},_clearSound:function(a){var f=/MSIE |Trident\//.test(t._navigator&&t._navigator.userAgent);f||(a.src="data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA")}};var r=function(a){this._parent=a,this.init()};r.prototype={init:function(){var a=this,f=a._parent;return a._muted=f._muted,a._loop=f._loop,a._volume=f._volume,a._rate=f._rate,a._seek=0,a._paused=!0,a._ended=!0,a._sprite="__default",a._id=++t._counter,f._sounds.push(a),a.create(),a},create:function(){var a=this,f=a._parent,h=t._muted||a._muted||a._parent._muted?0:a._volume;return f._webAudio?(a._node=typeof t.ctx.createGain>"u"?t.ctx.createGainNode():t.ctx.createGain(),a._node.gain.setValueAtTime(h,t.ctx.currentTime),a._node.paused=!0,a._node.connect(t.masterGain)):t.noAudio||(a._node=t._obtainHtml5Audio(),a._errorFn=a._errorListener.bind(a),a._node.addEventListener("error",a._errorFn,!1),a._loadFn=a._loadListener.bind(a),a._node.addEventListener(t._canPlayEvent,a._loadFn,!1),a._endFn=a._endListener.bind(a),a._node.addEventListener("ended",a._endFn,!1),a._node.src=f._src,a._node.preload=f._preload===!0?"auto":f._preload,a._node.volume=h*t.volume(),a._node.load()),a},reset:function(){var a=this,f=a._parent;return a._muted=f._muted,a._loop=f._loop,a._volume=f._volume,a._rate=f._rate,a._seek=0,a._rateSeek=0,a._paused=!0,a._ended=!0,a._sprite="__default",a._id=++t._counter,a},_errorListener:function(){var a=this;a._parent._emit("loaderror",a._id,a._node.error?a._node.error.code:0),a._node.removeEventListener("error",a._errorFn,!1)},_loadListener:function(){var a=this,f=a._parent;f._duration=Math.ceil(a._node.duration*10)/10,Object.keys(f._sprite).length===0&&(f._sprite={__default:[0,f._duration*1e3]}),f._state!=="loaded"&&(f._state="loaded",f._emit("load"),f._loadQueue()),a._node.removeEventListener(t._canPlayEvent,a._loadFn,!1)},_endListener:function(){var a=this,f=a._parent;f._duration===1/0&&(f._duration=Math.ceil(a._node.duration*10)/10,f._sprite.__default[1]===1/0&&(f._sprite.__default[1]=f._duration*1e3),f._ended(a)),a._node.removeEventListener("ended",a._endFn,!1)}};var s={},o=function(a){var f=a._src;if(s[f]){a._duration=s[f].duration,u(a);return}if(/^data:[^;]+;base64,/.test(f)){for(var h=atob(f.split(",")[1]),m=new Uint8Array(h.length),v=0;v<h.length;++v)m[v]=h.charCodeAt(v);l(m.buffer,a)}else{var g=new XMLHttpRequest;g.open(a._xhr.method,f,!0),g.withCredentials=a._xhr.withCredentials,g.responseType="arraybuffer",a._xhr.headers&&Object.keys(a._xhr.headers).forEach(function(p){g.setRequestHeader(p,a._xhr.headers[p])}),g.onload=function(){var p=(g.status+"")[0];if(p!=="0"&&p!=="2"&&p!=="3"){a._emit("loaderror",null,"Failed loading audio file with status: "+g.status+".");return}l(g.response,a)},g.onerror=function(){a._webAudio&&(a._html5=!0,a._webAudio=!1,a._sounds=[],delete s[f],a.load())},c(g)}},c=function(a){try{a.send()}catch{a.onerror()}},l=function(a,f){var h=function(){f._emit("loaderror",null,"Decoding audio data failed.")},m=function(v){v&&f._sounds.length>0?(s[f._src]=v,u(f,v)):h()};typeof Promise<"u"&&t.ctx.decodeAudioData.length===1?t.ctx.decodeAudioData(a).then(m).catch(h):t.ctx.decodeAudioData(a,m,h)},u=function(a,f){f&&!a._duration&&(a._duration=f.duration),Object.keys(a._sprite).length===0&&(a._sprite={__default:[0,a._duration*1e3]}),a._state!=="loaded"&&(a._state="loaded",a._emit("load"),a._loadQueue())},d=function(){if(t.usingWebAudio){try{typeof AudioContext<"u"?t.ctx=new AudioContext:typeof webkitAudioContext<"u"?t.ctx=new webkitAudioContext:t.usingWebAudio=!1}catch{t.usingWebAudio=!1}t.ctx||(t.usingWebAudio=!1);var a=/iP(hone|od|ad)/.test(t._navigator&&t._navigator.platform),f=t._navigator&&t._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/),h=f?parseInt(f[1],10):null;if(a&&h&&h<9){var m=/safari/.test(t._navigator&&t._navigator.userAgent.toLowerCase());t._navigator&&!m&&(t.usingWebAudio=!1)}t.usingWebAudio&&(t.masterGain=typeof t.ctx.createGain>"u"?t.ctx.createGainNode():t.ctx.createGain(),t.masterGain.gain.setValueAtTime(t._muted?0:t._volume,t.ctx.currentTime),t.masterGain.connect(t.ctx.destination)),t._setup()}};n.Howler=t,n.Howl=i,typeof Po<"u"?(Po.HowlerGlobal=e,Po.Howler=t,Po.Howl=i,Po.Sound=r):typeof window<"u"&&(window.HowlerGlobal=e,window.Howler=t,window.Howl=i,window.Sound=r)})();/*!
 *  Spatial Plugin - Adds support for stereo and 3D audio where Web Audio is supported.
 *  
 *  howler.js v2.2.4
 *  howlerjs.com
 *
 *  (c) 2013-2020, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */(function(){HowlerGlobal.prototype._pos=[0,0,0],HowlerGlobal.prototype._orientation=[0,0,-1,0,1,0],HowlerGlobal.prototype.stereo=function(t){var i=this;if(!i.ctx||!i.ctx.listener)return i;for(var r=i._howls.length-1;r>=0;r--)i._howls[r].stereo(t);return i},HowlerGlobal.prototype.pos=function(t,i,r){var s=this;if(!s.ctx||!s.ctx.listener)return s;if(i=typeof i!="number"?s._pos[1]:i,r=typeof r!="number"?s._pos[2]:r,typeof t=="number")s._pos=[t,i,r],typeof s.ctx.listener.positionX<"u"?(s.ctx.listener.positionX.setTargetAtTime(s._pos[0],Howler.ctx.currentTime,.1),s.ctx.listener.positionY.setTargetAtTime(s._pos[1],Howler.ctx.currentTime,.1),s.ctx.listener.positionZ.setTargetAtTime(s._pos[2],Howler.ctx.currentTime,.1)):s.ctx.listener.setPosition(s._pos[0],s._pos[1],s._pos[2]);else return s._pos;return s},HowlerGlobal.prototype.orientation=function(t,i,r,s,o,c){var l=this;if(!l.ctx||!l.ctx.listener)return l;var u=l._orientation;if(i=typeof i!="number"?u[1]:i,r=typeof r!="number"?u[2]:r,s=typeof s!="number"?u[3]:s,o=typeof o!="number"?u[4]:o,c=typeof c!="number"?u[5]:c,typeof t=="number")l._orientation=[t,i,r,s,o,c],typeof l.ctx.listener.forwardX<"u"?(l.ctx.listener.forwardX.setTargetAtTime(t,Howler.ctx.currentTime,.1),l.ctx.listener.forwardY.setTargetAtTime(i,Howler.ctx.currentTime,.1),l.ctx.listener.forwardZ.setTargetAtTime(r,Howler.ctx.currentTime,.1),l.ctx.listener.upX.setTargetAtTime(s,Howler.ctx.currentTime,.1),l.ctx.listener.upY.setTargetAtTime(o,Howler.ctx.currentTime,.1),l.ctx.listener.upZ.setTargetAtTime(c,Howler.ctx.currentTime,.1)):l.ctx.listener.setOrientation(t,i,r,s,o,c);else return u;return l},Howl.prototype.init=function(t){return function(i){var r=this;return r._orientation=i.orientation||[1,0,0],r._stereo=i.stereo||null,r._pos=i.pos||null,r._pannerAttr={coneInnerAngle:typeof i.coneInnerAngle<"u"?i.coneInnerAngle:360,coneOuterAngle:typeof i.coneOuterAngle<"u"?i.coneOuterAngle:360,coneOuterGain:typeof i.coneOuterGain<"u"?i.coneOuterGain:0,distanceModel:typeof i.distanceModel<"u"?i.distanceModel:"inverse",maxDistance:typeof i.maxDistance<"u"?i.maxDistance:1e4,panningModel:typeof i.panningModel<"u"?i.panningModel:"HRTF",refDistance:typeof i.refDistance<"u"?i.refDistance:1,rolloffFactor:typeof i.rolloffFactor<"u"?i.rolloffFactor:1},r._onstereo=i.onstereo?[{fn:i.onstereo}]:[],r._onpos=i.onpos?[{fn:i.onpos}]:[],r._onorientation=i.onorientation?[{fn:i.onorientation}]:[],t.call(this,i)}}(Howl.prototype.init),Howl.prototype.stereo=function(t,i){var r=this;if(!r._webAudio)return r;if(r._state!=="loaded")return r._queue.push({event:"stereo",action:function(){r.stereo(t,i)}}),r;var s=typeof Howler.ctx.createStereoPanner>"u"?"spatial":"stereo";if(typeof i>"u")if(typeof t=="number")r._stereo=t,r._pos=[t,0,0];else return r._stereo;for(var o=r._getSoundIds(i),c=0;c<o.length;c++){var l=r._soundById(o[c]);if(l)if(typeof t=="number")l._stereo=t,l._pos=[t,0,0],l._node&&(l._pannerAttr.panningModel="equalpower",(!l._panner||!l._panner.pan)&&e(l,s),s==="spatial"?typeof l._panner.positionX<"u"?(l._panner.positionX.setValueAtTime(t,Howler.ctx.currentTime),l._panner.positionY.setValueAtTime(0,Howler.ctx.currentTime),l._panner.positionZ.setValueAtTime(0,Howler.ctx.currentTime)):l._panner.setPosition(t,0,0):l._panner.pan.setValueAtTime(t,Howler.ctx.currentTime)),r._emit("stereo",l._id);else return l._stereo}return r},Howl.prototype.pos=function(t,i,r,s){var o=this;if(!o._webAudio)return o;if(o._state!=="loaded")return o._queue.push({event:"pos",action:function(){o.pos(t,i,r,s)}}),o;if(i=typeof i!="number"?0:i,r=typeof r!="number"?-.5:r,typeof s>"u")if(typeof t=="number")o._pos=[t,i,r];else return o._pos;for(var c=o._getSoundIds(s),l=0;l<c.length;l++){var u=o._soundById(c[l]);if(u)if(typeof t=="number")u._pos=[t,i,r],u._node&&((!u._panner||u._panner.pan)&&e(u,"spatial"),typeof u._panner.positionX<"u"?(u._panner.positionX.setValueAtTime(t,Howler.ctx.currentTime),u._panner.positionY.setValueAtTime(i,Howler.ctx.currentTime),u._panner.positionZ.setValueAtTime(r,Howler.ctx.currentTime)):u._panner.setPosition(t,i,r)),o._emit("pos",u._id);else return u._pos}return o},Howl.prototype.orientation=function(t,i,r,s){var o=this;if(!o._webAudio)return o;if(o._state!=="loaded")return o._queue.push({event:"orientation",action:function(){o.orientation(t,i,r,s)}}),o;if(i=typeof i!="number"?o._orientation[1]:i,r=typeof r!="number"?o._orientation[2]:r,typeof s>"u")if(typeof t=="number")o._orientation=[t,i,r];else return o._orientation;for(var c=o._getSoundIds(s),l=0;l<c.length;l++){var u=o._soundById(c[l]);if(u)if(typeof t=="number")u._orientation=[t,i,r],u._node&&(u._panner||(u._pos||(u._pos=o._pos||[0,0,-.5]),e(u,"spatial")),typeof u._panner.orientationX<"u"?(u._panner.orientationX.setValueAtTime(t,Howler.ctx.currentTime),u._panner.orientationY.setValueAtTime(i,Howler.ctx.currentTime),u._panner.orientationZ.setValueAtTime(r,Howler.ctx.currentTime)):u._panner.setOrientation(t,i,r)),o._emit("orientation",u._id);else return u._orientation}return o},Howl.prototype.pannerAttr=function(){var t=this,i=arguments,r,s,o;if(!t._webAudio)return t;if(i.length===0)return t._pannerAttr;if(i.length===1)if(typeof i[0]=="object")r=i[0],typeof s>"u"&&(r.pannerAttr||(r.pannerAttr={coneInnerAngle:r.coneInnerAngle,coneOuterAngle:r.coneOuterAngle,coneOuterGain:r.coneOuterGain,distanceModel:r.distanceModel,maxDistance:r.maxDistance,refDistance:r.refDistance,rolloffFactor:r.rolloffFactor,panningModel:r.panningModel}),t._pannerAttr={coneInnerAngle:typeof r.pannerAttr.coneInnerAngle<"u"?r.pannerAttr.coneInnerAngle:t._coneInnerAngle,coneOuterAngle:typeof r.pannerAttr.coneOuterAngle<"u"?r.pannerAttr.coneOuterAngle:t._coneOuterAngle,coneOuterGain:typeof r.pannerAttr.coneOuterGain<"u"?r.pannerAttr.coneOuterGain:t._coneOuterGain,distanceModel:typeof r.pannerAttr.distanceModel<"u"?r.pannerAttr.distanceModel:t._distanceModel,maxDistance:typeof r.pannerAttr.maxDistance<"u"?r.pannerAttr.maxDistance:t._maxDistance,refDistance:typeof r.pannerAttr.refDistance<"u"?r.pannerAttr.refDistance:t._refDistance,rolloffFactor:typeof r.pannerAttr.rolloffFactor<"u"?r.pannerAttr.rolloffFactor:t._rolloffFactor,panningModel:typeof r.pannerAttr.panningModel<"u"?r.pannerAttr.panningModel:t._panningModel});else return o=t._soundById(parseInt(i[0],10)),o?o._pannerAttr:t._pannerAttr;else i.length===2&&(r=i[0],s=parseInt(i[1],10));for(var c=t._getSoundIds(s),l=0;l<c.length;l++)if(o=t._soundById(c[l]),o){var u=o._pannerAttr;u={coneInnerAngle:typeof r.coneInnerAngle<"u"?r.coneInnerAngle:u.coneInnerAngle,coneOuterAngle:typeof r.coneOuterAngle<"u"?r.coneOuterAngle:u.coneOuterAngle,coneOuterGain:typeof r.coneOuterGain<"u"?r.coneOuterGain:u.coneOuterGain,distanceModel:typeof r.distanceModel<"u"?r.distanceModel:u.distanceModel,maxDistance:typeof r.maxDistance<"u"?r.maxDistance:u.maxDistance,refDistance:typeof r.refDistance<"u"?r.refDistance:u.refDistance,rolloffFactor:typeof r.rolloffFactor<"u"?r.rolloffFactor:u.rolloffFactor,panningModel:typeof r.panningModel<"u"?r.panningModel:u.panningModel};var d=o._panner;d||(o._pos||(o._pos=t._pos||[0,0,-.5]),e(o,"spatial"),d=o._panner),d.coneInnerAngle=u.coneInnerAngle,d.coneOuterAngle=u.coneOuterAngle,d.coneOuterGain=u.coneOuterGain,d.distanceModel=u.distanceModel,d.maxDistance=u.maxDistance,d.refDistance=u.refDistance,d.rolloffFactor=u.rolloffFactor,d.panningModel=u.panningModel}return t},Sound.prototype.init=function(t){return function(){var i=this,r=i._parent;i._orientation=r._orientation,i._stereo=r._stereo,i._pos=r._pos,i._pannerAttr=r._pannerAttr,t.call(this),i._stereo?r.stereo(i._stereo):i._pos&&r.pos(i._pos[0],i._pos[1],i._pos[2],i._id)}}(Sound.prototype.init),Sound.prototype.reset=function(t){return function(){var i=this,r=i._parent;return i._orientation=r._orientation,i._stereo=r._stereo,i._pos=r._pos,i._pannerAttr=r._pannerAttr,i._stereo?r.stereo(i._stereo):i._pos?r.pos(i._pos[0],i._pos[1],i._pos[2],i._id):i._panner&&(i._panner.disconnect(0),i._panner=void 0,r._refreshBuffer(i)),t.call(this)}}(Sound.prototype.reset);var e=function(t,i){i=i||"spatial",i==="spatial"?(t._panner=Howler.ctx.createPanner(),t._panner.coneInnerAngle=t._pannerAttr.coneInnerAngle,t._panner.coneOuterAngle=t._pannerAttr.coneOuterAngle,t._panner.coneOuterGain=t._pannerAttr.coneOuterGain,t._panner.distanceModel=t._pannerAttr.distanceModel,t._panner.maxDistance=t._pannerAttr.maxDistance,t._panner.refDistance=t._pannerAttr.refDistance,t._panner.rolloffFactor=t._pannerAttr.rolloffFactor,t._panner.panningModel=t._pannerAttr.panningModel,typeof t._panner.positionX<"u"?(t._panner.positionX.setValueAtTime(t._pos[0],Howler.ctx.currentTime),t._panner.positionY.setValueAtTime(t._pos[1],Howler.ctx.currentTime),t._panner.positionZ.setValueAtTime(t._pos[2],Howler.ctx.currentTime)):t._panner.setPosition(t._pos[0],t._pos[1],t._pos[2]),typeof t._panner.orientationX<"u"?(t._panner.orientationX.setValueAtTime(t._orientation[0],Howler.ctx.currentTime),t._panner.orientationY.setValueAtTime(t._orientation[1],Howler.ctx.currentTime),t._panner.orientationZ.setValueAtTime(t._orientation[2],Howler.ctx.currentTime)):t._panner.setOrientation(t._orientation[0],t._orientation[1],t._orientation[2])):(t._panner=Howler.ctx.createStereoPanner(),t._panner.pan.setValueAtTime(t._stereo,Howler.ctx.currentTime)),t._panner.connect(t._node),t._paused||t._parent.pause(t._id,!0).play(t._id,!0)}})()})(fy);const Hh=["/chords/chord_01.ogg","/chords/chord_02.ogg","/chords/chord_03.ogg","/chords/chord_04.ogg","/chords/chord_05.ogg","/chords/chord_06.ogg","/chords/chord_07.ogg","/chords/chord_08.ogg","/chords/chord_09.ogg","/chords/chord_10.ogg","/chords/chord_11.ogg","/chords/chord_12.ogg","/chords/chord_13.ogg","/chords/chord_14.ogg","/chords/chord_15.ogg","/chords/chord_16.ogg"];let bu=!1,Ec=[],Y_=!1;const q_=new Map;let dy=document.hidden,hy=document.hidden?0:Date.now();const A2=500,b2=[];function C2(){if(Y_)return;Y_=!0;const n=localStorage.getItem("claude-live-audio-enabled");n!==null&&(bu=n==="true");let e=0;Ec=Hh.map(t=>new fy.Howl({src:[t],volume:.2,preload:!0,onload:()=>{e++,b2.forEach(i=>i(e,Hh.length))}})),document.addEventListener("visibilitychange",()=>{dy=document.hidden,document.hidden||(hy=Date.now())})}function R2(n,e){return n==="Read"?0:n==="Edit"||n==="Write"?1:n==="Bash"?2:n==="Grep"||n==="Glob"?3:n==="WebFetch"?4:e==="Notification"||e==="PermissionRequest"?5:e==="SubagentStart"?6:e==="SubagentStop"?7:e==="UserPromptSubmit"?8:e==="SessionStart"?9:e==="SessionEnd"?10:Math.floor(Math.random()*Hh.length)}function K_(n,e){if(!bu||Ec.length===0||dy||Date.now()-hy<A2)return;const t=n||e||"unknown",i=Date.now();if(i-(q_.get(t)||0)<150)return;q_.set(t,i);const r=R2(n,e),s=Ec[r%Ec.length];s.state()==="loaded"&&s.play()}function P2(n){bu=n,localStorage.setItem("claude-live-audio-enabled",n?"true":"false")}function L2(){return bu}function D2({enabled:n}){return n?q.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[q.jsx("polygon",{points:"11 5 6 9 2 9 2 15 6 15 11 19 11 5"}),q.jsx("path",{d:"M15.54 8.46a7 7 0 0 1 0 9.9M19.07 4.93a11 11 0 0 1 0 15.66"})]}):q.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[q.jsx("polygon",{points:"11 5 6 9 2 9 2 15 6 15 11 19 11 5"}),q.jsx("line",{x1:"23",y1:"9",x2:"17",y2:"15"}),q.jsx("line",{x1:"17",y1:"9",x2:"23",y2:"15"})]})}function I2({enabled:n}){const e=n?"#38bdf8":"#666666",t=n?1:.6;return q.jsx("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:q.jsxs("g",{opacity:t,stroke:e,strokeWidth:n?2:1.5,fill:"none",children:[q.jsx("path",{d:"M 3 3 L 3 7 M 3 3 L 7 3"}),q.jsx("path",{d:"M 17 3 L 17 7 M 17 3 L 13 3"}),q.jsx("path",{d:"M 3 17 L 3 13 M 3 17 L 7 17"}),q.jsx("path",{d:"M 17 17 L 17 13 M 17 17 L 13 17"})]})})}const Z_=5e3,Q_=4e3,N2=1e3,U2=100;function F2(n){return n.split("/").pop()??n}function O2({entries:n}){const[e,t]=Ue.useState(Date.now()),[i,r]=Ue.useState(!1);Ue.useEffect(()=>{let u,d=Date.now();const a=()=>{const f=Date.now();f-d>=U2&&(t(f),d=f),u=requestAnimationFrame(a)};return u=requestAnimationFrame(a),()=>cancelAnimationFrame(u)},[]);const s=u=>{const d=e-u.createdAt;return d>=Z_?0:d<Q_?1:1-(d-Q_)/N2},o=Ue.useMemo(()=>n.filter(u=>e-u.createdAt<Z_).slice(-6),[n,e]),c=Ue.useMemo(()=>[...n].reverse(),[n]),l=(u,d)=>{const a=d?s(u):.7,f=u.file?F2(u.file):null;return q.jsxs("div",{className:`elog-row ${d?"":"elog-row--static"}`,style:{opacity:a,"--entry-color":u.colorHex},children:[q.jsx("span",{className:"elog-dot",style:{background:u.colorHex,boxShadow:`0 0 6px ${u.colorHex}55`}}),q.jsx("span",{className:"elog-tool",style:{color:u.colorHex},children:u.tool}),f&&q.jsx("span",{className:"elog-file",children:f}),q.jsx("span",{className:"elog-id",children:u.id.slice(-6)})]},`${d?"live":"hist"}-${u.id}`)};return q.jsxs("div",{className:"elog",children:[!i&&o.length>0&&q.jsx("div",{className:"elog-live",children:o.map(u=>l(u,!0))}),q.jsx("button",{className:"elog-hist-btn",onClick:()=>r(!i),children:i?"× close":`▸ history ${n.length>0?`(${n.length})`:""}`}),i&&q.jsxs("div",{className:"elog-hist",children:[q.jsxs("div",{className:"elog-hist-header",children:[q.jsx("span",{className:"elog-hist-title",children:"event history"}),q.jsx("span",{className:"elog-hist-count",children:n.length})]}),q.jsx("div",{className:"elog-hist-scroll",children:c.map(u=>l(u,!1))})]})]})}const k2=["Read","Edit","Write","Bash","Grep","Glob","WebFetch"],ic=["server/index.js","bin/hook.js","bin/cli.js","bin/hook-wrapper.sh","client/src/App.tsx","client/src/store.ts","client/src/types.ts","client/src/canvas-three/ThreeApp.ts","client/src/canvas-three/ThreeScene.tsx","client/src/canvas-three/layers/BackgroundLayer.ts","client/src/events/EventBus.ts","package.json","README.md","CLAUDE.md","client/vite.config.ts"],B2=["npm test","npm run build","npm run dev","git status","npx tsc --noEmit","grep -r TODO client/src/","ls -la node_modules/","cat .gitignore"],z2=["https://nodejs.org/api/http.html","https://api.github.com/repos","https://www.npmjs.com/package/claude-live"],V2=["refactor the auth module to use JWT tokens","add error handling to the SSE endpoint","fix the failing typecheck in App.tsx","implement the event filtering feature","write tests for the hook handler"];let J_=0,e0=0;function H2(){return"xxxxxxxx-xxxx-4xxx".replace(/x/g,()=>Math.floor(Math.random()*16).toString(16))}function Fi(n){return n[Math.floor(Math.random()*n.length)]}function G2(){return H2()}function Wr(n,e,t,i,r){return{id:`demo-${J_++}`,session_id:n,hook_event_name:e,tool_name:t,tool_input:i,tool_response:r??null,timestamp:Date.now(),cwd:"/home/user/claude-live",tool_use_id:`tu-${J_}`}}function W2(n){const e=[];let t=0;function i(){const d=G2();e0++;const a=`demo-session-${e0}`;return e.push({id:d,label:a,active:!0,eventsSent:0}),n({type:"event",data:Wr(d,"SessionStart",null,null)}),d}function r(d){const a=Fi(k2);let f={},h={};switch(a){case"Read":f={file_path:Fi(ic)},h={content:`file contents...
`.repeat(20)};break;case"Edit":f={file_path:Fi(ic),old_string:"old code",new_string:`new code
with changes`};break;case"Write":f={file_path:Fi(ic),content:`// new file
`.repeat(10)};break;case"Bash":f={command:Fi(B2)},h={exitCode:Math.random()>.9?1:0,output:"command output"};break;case"Grep":f={pattern:Fi(["TODO","FIXME","async fn","impl "]),path:"src/"},h={numMatches:Math.floor(Math.random()*20)};break;case"Glob":f={pattern:Fi(["**/*.js","**/*.ts","**/*.tsx"]),path:"."},h={files:ic.slice(0,Math.floor(Math.random()*10))};break;case"WebFetch":f={url:Fi(z2)},h={status:200};break}n({type:"event",data:Wr(d.id,"PreToolUse",a,f)}),setTimeout(()=>{const m=Math.random()>.92;n({type:"event",data:Wr(d.id,m?"PostToolUseFailure":"PostToolUse",a,f,h)}),d.eventsSent++},200+Math.random()*800)}function s(d){const a=Fi(V2);n({type:"event",data:{...Wr(d.id,"UserPromptSubmit",null,null),prompt:a}})}function o(d){n({type:"event",data:{...Wr(d.id,"Stop",null,null),stop_reason:"end_turn"}})}function c(d){n({type:"event",data:Wr(d.id,"PreCompact",null,{trigger:"auto"})}),setTimeout(()=>{n({type:"event",data:Wr(d.id,"PostCompact",null,{summary:"Context compacted"})})},3500)}const l=i();setTimeout(()=>{const d=e.find(a=>a.id===l);d&&s(d)},500);const u=setInterval(()=>{if(t++,t===30&&e.length<2){const d=i();setTimeout(()=>{const a=e.find(f=>f.id===d);a&&s(a)},500)}for(const d of e){if(!d.active)continue;const a=Math.random();a<.6?r(d):a<.7?s(d):a<.75?o(d):a<.76&&d.eventsSent>40&&c(d)}},1200);return()=>clearInterval(u)}function X2(){const n=window.location.hostname;return!!(n.includes("github.io")||n.includes("pages.dev")||new URLSearchParams(window.location.search).has("demo"))}const Vs=s1(),Tc={Read:"#4ade80",Edit:"#60a5fa",Write:"#60a5fa",Bash:"#f59e0b",Grep:"#a78bfa",Glob:"#a78bfa",WebFetch:"#f472b6",Stop:"#888888",Notification:"#34d399",SubagentStart:"#c084fc",SubagentStop:"#7c3aed",PostToolUseFailure:"#f87171",SessionEnd:"#ef4444",UserPromptSubmit:"#38bdf8",PreCompact:"#94a3b8",PostCompact:"#94a3b8",SessionStart:"#22d3ee",InstructionsLoaded:"#a3a3a3",WorktreeCreate:"#86efac",WorktreeRemove:"#fca5a5"};function Gh(n){var i;const e=n.tool_input,t=n.tool_name;if(t==="Edit"){const r=(e==null?void 0:e.file_path)||"",s=((e==null?void 0:e.new_string)||"").split(`
`).length,o=((e==null?void 0:e.old_string)||"").split(`
`).length,c=r.split("/").pop()||"";return s!==o?`${c} +${s}−${o}`:`${c} ${s}L`}if(t==="Write"){const r=(e==null?void 0:e.file_path)||"",s=((e==null?void 0:e.content)||"").split(`
`).length;return`${r.split("/").pop()||""} ${s}L`}if(t==="Read"){const r=(e==null?void 0:e.file_path)||"",s=e==null?void 0:e.limit,o=e==null?void 0:e.offset,c=r.split("/").pop()||"";return o?`${c} @${o}`:s?`${c} ${s}L`:c}if(["Grep","Glob"].includes(t||""))return(e==null?void 0:e.pattern)||((i=e==null?void 0:e.file_path)==null?void 0:i.split("/").pop())||"";if(t==="Bash")return((e==null?void 0:e.command)||"").slice(0,22);if(t==="WebFetch")try{return new URL((e==null?void 0:e.url)||"").hostname}catch{return""}return n.hook_event_name==="UserPromptSubmit"?(n.prompt||"").slice(0,30):n.hook_event_name==="PreCompact"?n.trigger||"compacting...":n.hook_event_name==="PostCompact"?"context compacted":n.hook_event_name==="SessionStart"?n.model||n.source||"started":n.hook_event_name==="InstructionsLoaded"?n.memory_type||"instructions":""}function t0(n){var r,s;const e=n.tool_name,t=n.tool_input,i=n.tool_response;if(e==="Read"&&i){const c=((t==null?void 0:t.file_path)||"").split("/").pop()||"",l=i.content??i.text??i.output;if(typeof l=="string"){const u=l.split(`
`).length;return`${c} ${u}L`}return c}if(e==="Grep"&&i){const o=i.count??i.numMatches??i.total;return o!==void 0?`${(t==null?void 0:t.pattern)||""} ${o} hits`:(t==null?void 0:t.pattern)||""}if(e==="Glob"&&i){const o=Array.isArray(i)?i.length:((r=i.files)==null?void 0:r.length)??i.count;return o!==void 0?`${(t==null?void 0:t.pattern)||""} ${o} files`:(t==null?void 0:t.pattern)||""}if(e==="Bash"&&i){const o=i.exitCode??i.exit_code??i.code;return o!==void 0?`$ ${((s=((t==null?void 0:t.command)||"").split(/\s+/)[0])==null?void 0:s.split("/").pop())||""} ${o===0?"✓":`✗ ${o}`}`:((t==null?void 0:t.command)||"").slice(0,22)}return Gh(n)}const n0=100;function j2(n){return!n||!n.lastTool?"#888":Tc[n.lastTool]??"#888"}function i0(n){if(!n)return"—";const e=Math.floor((Date.now()-n)/1e3);return e<3?"just now":e<60?`${e}s ago`:e<3600?`${Math.floor(e/60)}m ago`:`${Math.floor(e/3600)}h ago`}function r0(n){if(!n)return"";const e=n.split("/").filter(Boolean);return e[e.length-1]??""}function $2(){const[n,e]=Ue.useState(Vs.getSessions()),[t,i]=Ue.useState(null),[r,s]=Ue.useState(0),[o,c]=Ue.useState(null),[l,u]=Ue.useState(null),[d,a]=Ue.useState(null),[f,h]=Ue.useState(0),[m,v]=Ue.useState(0),[g,p]=Ue.useState(new Map),[_,x]=Ue.useState([]),[S,A]=Ue.useState(!1),[M,T]=Ue.useState(!1),[y,E]=Ue.useState("connecting"),[D,C]=Ue.useState(()=>localStorage.getItem("claude-live-audio-enabled")==="true"),[F,L]=Ue.useState(()=>localStorage.getItem("claude-live-autofit-enabled")==="true"),[U,z]=Ue.useState(()=>localStorage.getItem("claude-live-autorotate-enabled")!=="false");Ue.useEffect(()=>{C2(),C(L2())},[]),Ue.useEffect(()=>{localStorage.setItem("claude-live-autofit-enabled",F?"true":"false")},[F]),Ue.useEffect(()=>{localStorage.setItem("claude-live-autorotate-enabled",U?"true":"false")},[U]),Ue.useEffect(()=>{const J=te=>{h(te.clientX),v(te.clientY)};return window.addEventListener("mousemove",J),()=>window.removeEventListener("mousemove",J)},[]),Ue.useEffect(()=>{if(X2()){const se=W2(le=>{if(le.type==="event"){const Me=le.data;Vs.addEvent(Me),e(new Map(Vs.getSessions())),i(Me.tool_name??Me.hook_event_name??null),s(ht=>ht+1),K_(Me.tool_name??void 0,Me.hook_event_name??void 0);const oe=["Read","Edit","Write","Grep","Glob","Bash"].includes(Me.tool_name||"");if(!(Me.hook_event_name==="PostToolUse"&&!oe)){const ht=Vs.getSessions().get(Me.session_id);let Ve=Me.tool_name||Me.hook_event_name||"?";if(Ve.startsWith("mcp_")){const Ze=Ve.split("__");Ve=Ze[Ze.length-1].replace(/_/g," ")}x(Ze=>{const st={id:Me.id,tool:Ve,file:Me.hook_event_name==="PostToolUse"?t0(Me):Gh(Me),sessionLabel:(ht==null?void 0:ht.label)??Me.session_id.slice(0,8),project:r0(Me.cwd),colorHex:Tc[Ve]??"#888",createdAt:Date.now()};return[...Ze,st].slice(-n0)})}}});return()=>se()}const J="/events";let te=null,Oe=!1;const qe=new Map,rt=5e3;function Y(){Oe||(te=new EventSource(J),te.onopen=()=>{console.log("[claude-live] SSE connected"),E("connected")},te.onmessage=se=>{var le;try{const Me=JSON.parse(se.data);if(Me.type==="event"){const oe=Me.data;if(oe.hook_event_name==="Diagnostic")return;let Ne=null;if(oe.tool_use_id?Ne=`${oe.session_id}:${oe.hook_event_name}:${oe.tool_use_id}`:oe.hook_event_name==="UserPromptSubmit"&&oe.prompt?Ne=`${oe.session_id}:prompt:${oe.prompt.slice(0,80)}`:oe.hook_event_name==="SessionStart"&&(Ne=`${oe.session_id}:start`),Ne){const Le=Date.now();if(qe.has(Ne))return;if(qe.set(Ne,Le),qe.size>500)for(const[Qe,I]of qe)Le-I>rt&&qe.delete(Qe)}const ht=document.hidden;Vs.addEvent(oe,ht);const Ve=Vs.getSessions();e(new Map(Ve)),i(oe.tool_name??oe.hook_event_name??null),s(Le=>Le+1),ht||K_(oe.tool_name??void 0,oe.hook_event_name??void 0);const Ze=["Read","Edit","Write","Grep","Glob","Bash"].includes(oe.tool_name||"");if(!(oe.hook_event_name==="PostToolUse"&&!Ze)&&!ht){const Le=Ve.get(oe.session_id);let Qe=oe.tool_name||oe.hook_event_name||"?";if(Qe.startsWith("mcp_")){const I=Qe.split("__");Qe=I[I.length-1].replace(/_/g," ")}x(I=>{const Mt={id:oe.id,tool:Qe,file:oe.hook_event_name==="PostToolUse"?t0(oe):Gh(oe),sessionLabel:(Le==null?void 0:Le.label)??oe.session_id.slice(0,8),project:r0(oe.cwd),colorHex:Tc[Qe]??"#888",createdAt:Date.now()};return[...I,Mt].slice(-n0)})}if(oe.hook_event_name==="Notification"||oe.hook_event_name==="PermissionRequest"){const Le=Ve.get(oe.session_id),Qe=((le=oe.tool_input)==null?void 0:le.message)??"awaiting input";p(I=>{const Mt=new Map(I);return Mt.set(oe.session_id,{sessionId:oe.session_id,sessionLabel:(Le==null?void 0:Le.label)??oe.session_id.slice(0,8),message:Qe,timestamp:oe.timestamp}),Mt})}(oe.tool_name||oe.hook_event_name==="UserPromptSubmit")&&p(Le=>{if(!Le.has(oe.session_id))return Le;const Qe=new Map(Le);return Qe.delete(oe.session_id),Qe})}}catch{}},te.onerror=()=>{console.warn("[claude-live] SSE error, reconnecting..."),E("disconnected")})}return Y(),()=>{Oe=!0,te==null||te.close()}},[]);const V=(J,te)=>c(J),H=(J,te)=>{u(J),a(te)},k=()=>{const J=!D;C(J),P2(J)},X=()=>{const J=!F;L(J),localStorage.setItem("claude-live-autofit-enabled",J?"true":"false")},Q=()=>{const J=!U;z(J),localStorage.setItem("claude-live-autorotate-enabled",J?"true":"false")};return q.jsxs("div",{style:{position:"relative",width:"100%",height:"100%"},children:[q.jsx(S2,{clusters:n,onHover:V,onSelect:H,autofitEnabled:F,autoRotateEnabled:U}),q.jsxs("div",{className:"hud-bar",children:[q.jsx("span",{className:`hud-dot ${y==="connected"?"hud-dot--on":y==="error"?"hud-dot--err":"hud-dot--warn"}`}),q.jsxs("span",{className:"hud-chip",children:[r,q.jsx("span",{className:"hud-chip-label",children:"ev"})]}),q.jsxs("span",{className:"hud-chip",children:[n.size,q.jsx("span",{className:"hud-chip-label",children:"ses"})]}),q.jsx("span",{className:"hud-chip hud-tool",style:{color:Tc[t??""]??"#555"},children:t??"—"}),q.jsx("div",{className:"hud-ctrl-sep"}),q.jsx("button",{className:"hud-ctrl-btn",onClick:k,title:D?"Mute":"Unmute","aria-label":D?"Mute audio":"Unmute audio",children:q.jsx(D2,{enabled:D})}),q.jsx("button",{className:"hud-ctrl-btn",onClick:X,title:F?"Disable autofit":"Enable autofit","aria-label":F?"Disable autofit":"Enable autofit",children:q.jsx(I2,{enabled:F})}),q.jsx("button",{className:"hud-ctrl-btn",onClick:Q,title:U?"Stop rotation":"Start rotation","aria-label":U?"Stop rotation":"Start rotation",style:{opacity:U?1:.4},children:"⟳"}),q.jsx("button",{className:"hud-ctrl-btn",onClick:()=>A(!0),title:"Operations","aria-label":"Operations",children:"?"}),q.jsx("button",{className:"hud-ctrl-btn",onClick:()=>T(!0),title:"Debug","aria-label":"Debug",children:"⚙"})]}),g.size>0&&q.jsxs("div",{className:"perm-notifications",children:[q.jsx("div",{className:"perm-notifications-title",children:"awaiting input"}),[...g.values()].map(J=>q.jsxs("div",{className:"perm-notification-item",children:[q.jsx("div",{className:"perm-notification-dot"}),q.jsxs("div",{className:"perm-notification-body",children:[q.jsxs("div",{className:"perm-notification-session",children:["session:",J.sessionLabel]}),q.jsx("div",{className:"perm-notification-msg",children:J.message.slice(0,60)})]})]},J.sessionId))]}),q.jsx(O2,{entries:_}),q.jsxs("div",{className:"tooltip",style:{left:f+14,top:m-10,opacity:o?1:0},children:[q.jsx("div",{className:"tooltip-label",children:(o==null?void 0:o.label)??""}),q.jsx("div",{className:"tooltip-type",children:(o==null?void 0:o.nodeType)??""}),q.jsxs("div",{className:"tooltip-meta",children:[(o==null?void 0:o.lastTool)??"—"," · ",i0(o==null?void 0:o.lastTimestamp)]}),q.jsxs("div",{className:"tooltip-count",children:[(o==null?void 0:o.eventCount)??0," events"]}),(o==null?void 0:o.awaitingPermission)&&q.jsxs("div",{className:"perm-badge",children:[q.jsx("div",{className:"perm-dot"}),"waiting for permission"]})]}),q.jsx(M2,{sessionIds:[...n.keys()],isOpen:M,onClose:()=>T(!1)}),q.jsx(T2,{isOpen:S,onClose:()=>A(!1)}),q.jsxs("div",{className:`sidebar ${l?"sidebar--open":""}`,children:[q.jsxs("div",{className:"sidebar-header",children:[q.jsx("div",{className:"sidebar-close",onClick:()=>{u(null),a(null)},children:"×"}),q.jsx("div",{className:"sidebar-title",children:(l==null?void 0:l.label)??""}),q.jsx("div",{className:"sidebar-type",children:(l==null?void 0:l.nodeType)??""}),(l==null?void 0:l.awaitingPermission)&&q.jsxs("div",{className:"perm-badge",style:{marginTop:8},children:[q.jsx("div",{className:"perm-dot"}),"awaiting permission"]})]}),q.jsxs("div",{className:"sidebar-section",children:[q.jsx("div",{className:"sidebar-section-label",children:"Last action"}),q.jsx("div",{className:"sidebar-action",style:{color:j2(l)},children:(l==null?void 0:l.lastTool)??"—"}),q.jsx("div",{className:"sidebar-time",children:i0(l==null?void 0:l.lastTimestamp)})]}),q.jsxs("div",{className:"sidebar-section",children:[q.jsx("div",{className:"sidebar-section-label",children:"Total interactions"}),q.jsx("div",{className:"sidebar-count",children:(l==null?void 0:l.eventCount)??0})]}),q.jsxs("div",{className:"sidebar-section",children:[q.jsx("div",{className:"sidebar-section-label",children:"Session"}),q.jsx("div",{className:"sidebar-session",children:(d==null?void 0:d.label)??"—"})]})]})]})}const Y2=Ue.lazy(()=>Wh(()=>import("./EffectDemoScene-DiyNw7OL.js"),[]).then(n=>({default:n.EffectDemoScene}))),q2=Ue.lazy(()=>Wh(()=>import("./AgentDemoScene-DmPViizX.js"),[]).then(n=>({default:n.AgentDemoScene}))),K2=Ue.lazy(()=>Wh(()=>import("./SakuraPage-BuSWb222.js"),[]).then(n=>({default:n.SakuraPage})));function s0(){return window.location.hash.replace(/^#\/?/,"")||""}function Z2(){const[n,e]=Ue.useState(s0);return Ue.useEffect(()=>{const t=()=>e(s0());return window.addEventListener("hashchange",t),()=>window.removeEventListener("hashchange",t)},[]),n==="effect-demo"?q.jsx(Ue.Suspense,{fallback:q.jsx("div",{style:{background:"#030308",width:"100vw",height:"100vh"}}),children:q.jsx(Y2,{})}):n==="demo"?q.jsx(Ue.Suspense,{fallback:q.jsx("div",{style:{background:"#030308",width:"100vw",height:"100vh"}}),children:q.jsx(q2,{})}):n==="sakura"?q.jsx(Ue.Suspense,{fallback:q.jsx("div",{style:{background:"#0e0a08",width:"100vw",height:"100vh"}}),children:q.jsx(K2,{})}):q.jsx($2,{})}vx(document.getElementById("root")).render(q.jsx(Ue.StrictMode,{children:q.jsx(Z2,{})}));export{Ot as $,it as A,pR as B,aP as C,ri as D,$C as E,oy as F,li as G,Fn as H,ka as I,hs as J,nh as K,pn as L,wo as M,Zt as N,ZC as O,Ln as P,nP as Q,YC as R,vw as S,m2 as T,To as U,xe as V,VC as W,J2 as X,eP as Y,dt as Z,Qp as _,P as a,ja as a0,iP as a1,Zg as a2,Wa as a3,Rr as a4,Su as a5,Gn as a6,l1 as a7,zx as a8,oP as a9,rP as aa,sP as ab,Vw as ac,En as ad,$x as ae,Kx as b,ne as c,mn as d,qx as e,h2 as f,He as g,$t as h,Be as i,wc as j,Tt as k,q as l,$a as m,Tn as n,kw as o,Q2 as p,wi as q,Ue as r,Ti as s,iu as t,XC as u,rw as v,bi as w,Cr as x,tP as y,lo as z};
