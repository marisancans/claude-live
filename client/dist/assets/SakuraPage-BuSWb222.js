import{m as We,n as Ge,H as Oe,N as Ht,o as Le,p as Ve,q as He,t as qe,k as mt,F as Ze,c as H,u as At,a as w,v as It,w as gt,x as st,g as ct,i as q,d as at,y as Me,z as Ce,D as vt,J as it,K as zt,X as bt,Y as Pe,G as $t,Z as qt,_ as Ot,$ as Xe,a0 as De,a1 as Lt,a2 as Qe,a3 as _e,A as kt,a4 as Te,a5 as ze,I as Ye,L as Ke,h as Je,W as to,a6 as eo,a7 as oo,S as no,a8 as so,P as io,O as ro,E as ao,R as lo,U as co,V as ho,a9 as uo,aa as po,ab as fo,ac as Rt,ad as mo,b as go,ae as vo,M as yo,r as P,l as S}from"./index-D3vltDuF.js";const wt={defines:{DEPTH_PACKING:1,PERSPECTIVE_CAMERA:1},uniforms:{tColor:{value:null},tDepth:{value:null},focus:{value:1},aspect:{value:1},aperture:{value:.025},maxblur:{value:.01},nearClip:{value:1},farClip:{value:1e3}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		#include <common>

		varying vec2 vUv;

		uniform sampler2D tColor;
		uniform sampler2D tDepth;

		uniform float maxblur; // max blur amount
		uniform float aperture; // aperture - bigger values for shallower depth of field

		uniform float nearClip;
		uniform float farClip;

		uniform float focus;
		uniform float aspect;

		#include <packing>

		float getDepth( const in vec2 screenPosition ) {
			#if DEPTH_PACKING == 1
			return unpackRGBAToDepth( texture2D( tDepth, screenPosition ) );
			#else
			return texture2D( tDepth, screenPosition ).x;
			#endif
		}

		float getViewZ( const in float depth ) {
			#if PERSPECTIVE_CAMERA == 1
			return perspectiveDepthToViewZ( depth, nearClip, farClip );
			#else
			return orthographicDepthToViewZ( depth, nearClip, farClip );
			#endif
		}


		void main() {

			vec2 aspectcorrect = vec2( 1.0, aspect );

			float viewZ = getViewZ( getDepth( vUv ) );

			float factor = ( focus + viewZ ); // viewZ is <= 0, so this is a difference equation

			vec2 dofblur = vec2 ( clamp( factor * aperture, -maxblur, maxblur ) );

			vec2 dofblur9 = dofblur * 0.9;
			vec2 dofblur7 = dofblur * 0.7;
			vec2 dofblur4 = dofblur * 0.4;

			vec4 col = vec4( 0.0 );

			col += texture2D( tColor, vUv.xy );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.15,  0.37 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.37,  0.15 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.40,  0.0  ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.37, -0.15 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.15,  0.37 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.37,  0.15 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.15, -0.37 ) * aspectcorrect ) * dofblur );

			col += texture2D( tColor, vUv.xy + ( vec2(  0.15,  0.37 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.37,  0.15 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.37, -0.15 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.15,  0.37 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.37,  0.15 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.15, -0.37 ) * aspectcorrect ) * dofblur9 );

			col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.40,  0.0  ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur7 );

			col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.4,   0.0  ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur4 );

			gl_FragColor = col / 41.0;
			gl_FragColor.a = 1.0;

		}`};class xo extends We{constructor(t,e,o){super(),this.scene=t,this.camera=e;const n=o.focus!==void 0?o.focus:1,i=o.aperture!==void 0?o.aperture:.025,a=o.maxblur!==void 0?o.maxblur:1;this._renderTargetDepth=new Ge(1,1,{minFilter:Ht,magFilter:Ht,type:Oe}),this._renderTargetDepth.texture.name="BokehPass.depth",this._materialDepth=new Le,this._materialDepth.depthPacking=Ve,this._materialDepth.blending=He;const l=qe.clone(wt.uniforms);l.tDepth.value=this._renderTargetDepth.texture,l.focus.value=n,l.aspect.value=e.aspect,l.aperture.value=i,l.maxblur.value=a,l.nearClip.value=e.near,l.farClip.value=e.far,this.materialBokeh=new mt({defines:Object.assign({},wt.defines),uniforms:l,vertexShader:wt.vertexShader,fragmentShader:wt.fragmentShader}),this.uniforms=l,this._fsQuad=new Ze(this.materialBokeh),this._oldClearColor=new H}render(t,e,o){this.scene.overrideMaterial=this._materialDepth,t.getClearColor(this._oldClearColor);const n=t.getClearAlpha(),i=t.autoClear;t.autoClear=!1,t.setClearColor(16777215),t.setClearAlpha(1),t.setRenderTarget(this._renderTargetDepth),t.clear(),t.render(this.scene,this.camera),this.uniforms.tColor.value=o.texture,this.uniforms.nearClip.value=this.camera.near,this.uniforms.farClip.value=this.camera.far,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),t.clear(),this._fsQuad.render(t)),this.scene.overrideMaterial=null,t.setClearColor(this._oldClearColor),t.setClearAlpha(n),t.autoClear=i}setSize(t,e){this.materialBokeh.uniforms.aspect.value=t/e,this._renderTargetDepth.setSize(t,e)}dispose(){this._renderTargetDepth.dispose(),this._materialDepth.dispose(),this.materialBokeh.dispose(),this._fsQuad.dispose()}}const bo={uniforms:{tDiffuse:{value:null},uVignetteStrength:{value:.25},uSaturation:{value:1.12},uWarmth:{value:.06}},vertexShader:`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float uVignetteStrength;
    uniform float uSaturation;
    uniform float uWarmth;
    varying vec2 vUv;

    // ACES filmic tonemapping
    vec3 aces(vec3 x) {
      float a = 2.51;
      float b = 0.03;
      float c = 2.43;
      float d = 0.59;
      float e = 0.14;
      return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
    }

    void main() {
      vec3 color = texture2D(tDiffuse, vUv).rgb;

      // ACES tonemapping
      color = aces(color);

      // Saturation boost
      float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
      color = mix(vec3(luma), color, uSaturation);

      // Split toning: warm shadows, cool highlights
      vec3 warmTint = vec3(1.0, 0.95, 0.88);
      vec3 coolTint = vec3(0.92, 0.95, 1.0);
      float luminance = dot(color, vec3(0.299, 0.587, 0.114));
      vec3 tint = mix(warmTint, coolTint, smoothstep(0.3, 0.7, luminance));
      color *= mix(vec3(1.0), tint, uWarmth * 3.0);

      // Vignette
      vec2 centered = vUv - 0.5;
      float vignette = 1.0 - dot(centered, centered) * uVignetteStrength * 4.0;
      color *= clamp(vignette, 0.0, 1.0);

      // Gamma correction
      color = pow(color, vec3(1.0 / 2.2));

      gl_FragColor = vec4(color, 1.0);
    }
  `};function wo(){return new At(bo)}const So={uniforms:{tDiffuse:{value:null},uTime:{value:0},uIntensity:{value:.025}},vertexShader:`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uIntensity;
    varying vec2 vUv;

    float rand(vec2 co) {
      return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec3 color = texture2D(tDiffuse, vUv).rgb;
      float grain = rand(vUv * 800.0 + vec2(uTime * 100.0)) - 0.5;
      color += grain * uIntensity;
      gl_FragColor = vec4(color, 1.0);
    }
  `};function Mo(){return new At(So)}function Co(s,t){s.uniforms.uTime.value=t}const Po={uniforms:{tDiffuse:{value:null},uLightPos:{value:[.3,.8]},uExposure:{value:.04},uDecay:{value:.95},uDensity:{value:.4},uWeight:{value:.04},uSamples:{value:60}},vertexShader:`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform vec2 uLightPos;
    uniform float uExposure;
    uniform float uDecay;
    uniform float uDensity;
    uniform float uWeight;
    uniform int uSamples;
    varying vec2 vUv;

    void main() {
      vec2 texCoord = vUv;
      vec2 deltaTexCoord = (texCoord - uLightPos) * (1.0 / float(uSamples)) * uDensity;
      vec3 color = texture2D(tDiffuse, texCoord).rgb;
      float illuminationDecay = 1.0;

      for (int i = 0; i < 60; i++) {
        texCoord -= deltaTexCoord;
        vec3 sample_ = texture2D(tDiffuse, texCoord).rgb;
        sample_ *= illuminationDecay * uWeight;
        color += sample_;
        illuminationDecay *= uDecay;
      }

      vec3 original = texture2D(tDiffuse, vUv).rgb;
      gl_FragColor = vec4(original + color * uExposure, 1.0);
    }
  `};function Do(){return new At(Po)}const _o={uniforms:{tDiffuse:{value:null},uOffset:{value:.002}},vertexShader:`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float uOffset;
    varying vec2 vUv;

    void main() {
      vec2 dir = vUv - 0.5;
      float d = length(dir);
      float strength = d * d * uOffset;

      float r = texture2D(tDiffuse, vUv + dir * strength).r;
      float g = texture2D(tDiffuse, vUv).g;
      float b = texture2D(tDiffuse, vUv - dir * strength).b;

      gl_FragColor = vec4(r, g, b, 1.0);
    }
  `};function To(){return new At(_o)}const Zt="__ground__";function Bt(s){let t=2166136261;for(let e=0;e<s.length;e++)t^=s.charCodeAt(e),t=Math.imul(t,16777619);return t>>>0}function _t(s){let t=Bt(s)||1;return()=>{t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e^=e+Math.imul(e^e>>>7,61|e),((e^e>>>14)>>>0)/4294967296}}function lt(s,t,e){return t+(e-t)*s()}function X(s,t,e){return Math.min(e,Math.max(t,s))}function zo(s){const t=Math.abs(s.y)>.92?new w(1,0,0):new w(0,1,0),e=new w().crossVectors(s,t).normalize(),o=new w().crossVectors(e,s).normalize();return{u:e,v:o}}function Ae(s,t){if(s.type==="file")return t.set(s.path,1),1;const e=s.children??[];let o=1;for(const i of e)o+=Ae(i,t);const n=Math.max(1.4,o);return t.set(s.path,n),n}function Ao(s,t){return[...s].sort((e,o)=>e.type!==o.type?e.type==="folder"?-1:1:Bt(`${t}:${e.path}`)-Bt(`${t}:${o.path}`))}function Xt(s,t,e,o,n=!1){if(n||t==="root")return X(3.6+Math.log1p(o)*.42,3.8,6.8);const i=Math.pow(e/Math.max(o,1),.42);return t==="folder"?X(.34+i*3.3*Math.pow(.86,s),.32,3.6):X(.1+i*.95*Math.pow(.78,s),.18,.46)}function Qt(s,t,e,o,n,i=!1){if(i||t==="root")return X(28+Math.log1p(o)*2.8+lt(n,0,3.5),28,42);const a=Math.pow(e/Math.max(o,1),.36);return t==="folder"?X(16*Math.pow(.9,s)+a*18+lt(n,1,5),9,36):X(7*Math.pow(.88,s)+a*4.8+lt(n,.8,2.2),4,12)}function ko(s,t){const e=new Map,o=Ae(s,e),n=new Map,i=[],a=[],l=new Map;let r=0;const c=_t(`${t}:lean`),h=lt(c,0,Math.PI*2),m=lt(c,.07,.18),d=new w(Math.cos(h)*m,0,Math.sin(h)*m),p=new w(d.x,1,d.z).normalize(),f=_t(`${t}:trunk`),y=Qt(0,"root",o,o,f,!0),g=new w(0,0,0),v=g.clone().add(p.clone().multiplyScalar(y)),M=`${Zt}->${s.path}`,u=g.clone().lerp(v,.32).add(new w(d.x*12,4.5,d.z*12)),C=g.clone().lerp(v,.74).add(new w(d.x*18,2.2,d.z*18));i.push({id:M,fromPath:Zt,toPath:s.path,curvePoints:[g.clone(),u,C,v.clone()],depth:0,radius:Xt(0,"root",o,o,!0),subtreeWeight:o,branchType:"root",isSyntheticRoot:!0});function b(D,F,E,j,I,O){r=Math.max(r,I);const k=e.get(D.path)??1,N=[];if(n.set(D.path,{id:D.id,path:D.path,type:D.type,depth:I,position:E.clone(),parentPath:F,children:N,branchId:O,subtreeWeight:k}),D.type==="file"){a.push(D.path),l.set(D.path,{path:D.path,position:E.clone(),direction:j.clone().normalize(),depth:I,scale:X(1.02-I*.05,.42,1.02)});return}const et=Ao(D.children??[],`${t}:${D.path}`);if(!et.length)return;const W=zo(j),$=X((I+1)/6,0,1);et.forEach((L,Z)=>{const ot=_t(`${t}:${L.path}`),x=e.get(L.path)??1,A=Math.pow(x/Math.max(o,1),.34),B=Z/Math.max(et.length,1)*Math.PI*2,V=lt(ot,-.4,.4),_=B+V,T=It.lerp(.4,1.6,$)+A*.3,R=Math.cos(_)*T,z=Math.sin(_)*T,U=L.type==="folder"?It.lerp(.85,.1,$):It.lerp(.4,-.15,$),G=I===0?.92:I<2?.65:.4,rt=L.type==="folder"?X((I-1)*.06,0,.22):X(.1+I*.07,.1,.45),yt=j.clone().multiplyScalar(G+A*.28).add(new w(0,1,0).multiplyScalar(U)).add(W.u.clone().multiplyScalar(R)).add(W.v.clone().multiplyScalar(z)).add(d.clone().multiplyScalar(.12+$*.18)).add(new w(0,-1,0).multiplyScalar(rt)).normalize(),ht=L.type==="folder"?"folder":"file",Ne=Qt(I+1,ht,x,o,ot),xt=E.clone().add(yt.clone().multiplyScalar(Ne)),J=(ht==="folder"?5.2:2.7)*(.94+$*.55),$e=E.clone().lerp(xt,.28).add(new w(0,U*J*.68,0)).add(W.u.clone().multiplyScalar(R*J*.3)).add(W.v.clone().multiplyScalar(z*J*.3)).add(d.clone().multiplyScalar(J*.3)),Be=E.clone().lerp(xt,.74).add(W.u.clone().multiplyScalar(R*J*.15)).add(W.v.clone().multiplyScalar(z*J*.15)).add(new w(0,ht==="folder"?J*.16:-J*.08,0)),Vt=`${D.path}->${L.path}`;N.push(L.path),i.push({id:Vt,fromPath:D.path,toPath:L.path,curvePoints:[E.clone(),$e,Be,xt.clone()],depth:I+1,radius:Xt(I+1,ht,x,o),subtreeWeight:x,branchType:ht}),b(L,D.path,xt,yt,I+1,Vt)})}return b(s,null,v,p,0,M),{nodes:n,branches:i,tipPaths:a,maxDepth:r,blossomAnchors:l}}function Yt(s){const t=[];for(const e of s.replace(/\\/g,"/").split("/"))if(!(!e||e===".")){if(e===".."){if(!t.length)return null;t.pop();continue}t.push(e)}return t.join("/")}function Kt(s,t){if(typeof t!="string"||!t.trim())return null;const e=s.replace(/\\/g,"/").replace(/\/+$/,""),o=t.replace(/\\/g,"/");return o===e?".":o.startsWith(`${e}/`)?Yt(o.slice(e.length+1))||".":o.startsWith("/")?null:Yt(o.replace(/^\.\//,""))||"."}function Jt(s,t){const e=[];let o=s.nodes.get(t);for(;o&&o.branchId;)e.push(o.branchId),o=o.parentPath?s.nodes.get(o.parentPath):void 0;return e.reverse()}function Io(s,t,e=12){const o=s.nodes.get(t);if(!o)return[];if(o.type==="file")return[o.path];const n=[...o.children],i=[];for(;n.length>0&&i.length<e;){const a=n.shift(),l=s.nodes.get(a);l&&(l.type==="file"?i.push(l.path):n.push(...l.children))}return i}function te(s,t,e){if(s.tipPaths.length<=e)return[...s.tipPaths];const o=_t(t),n=[...s.tipPaths],i=[];for(;n.length>0&&i.length<e;){const a=Math.floor(o()*n.length);i.push(n.splice(a,1)[0])}return i}function Ro(s){var t;return((t=s.branches.find(e=>e.isSyntheticRoot))==null?void 0:t.toPath)??"."}function Uo(s,t){if(t===null)return null;const e=Ro(s),o=t.replace(/\\/g,"/").split("/");for(let n=o.length;n>0;n--){const i=o.slice(0,n).join("/");if(s.nodes.has(i))return i}return s.nodes.has(e)?e:null}const ke=`uniform float uTime;
uniform float uHeat;
uniform float uPulse;
uniform float uFlowOffset;
uniform float uWindStrength;
uniform float uWindPhase;
uniform float uSignalPos;
uniform float uSignalIntensity;

varying vec2 vUv;
varying vec3 vWorldPos;
varying vec3 vWorldNormal;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.52;
  }
  return v;
}

void main() {
  vUv = uv;

  // Breathing — subtle radial pulse
  float breathe = sin(uTime * 0.18 + uFlowOffset * 3.0) * (0.01 + uHeat * 0.016);

  // Wind sway — height-dependent (twigs bend more, trunk barely moves)
  float windSway = sin(uTime * 1.4 + uWindPhase + position.y * 0.06) * uWindStrength * 0.45;
  float windCross = cos(uTime * 0.9 + uWindPhase * 1.3 + position.y * 0.04) * uWindStrength * 0.22;

  // Signal bulge — geometry swells where signal passes
  float signalDist = abs(uv.x - uSignalPos);
  float signalBulge = smoothstep(0.12, 0.0, signalDist) * uSignalIntensity * 0.08;

  // Surface noise — organic irregularity
  float surfaceNoise = (fbm(vec2(uv.x * 2.5 + uFlowOffset * 4.0, uv.y * 5.0 - uTime * 0.04)) - 0.5) * 0.015;

  vec3 displaced = position + normal * (breathe + surfaceNoise + signalBulge);
  displaced.x += windSway;
  displaced.z += windCross;

  vec4 world = modelMatrix * vec4(displaced, 1.0);
  vWorldPos = world.xyz;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`,Ie=`uniform float uTime;
uniform float uHeat;
uniform float uPulse;
uniform float uContam;
uniform vec3 uPulseColor;
uniform float uFlowOffset;
uniform float uSignalPos;
uniform float uSignalIntensity;
uniform vec3 uSignalColor;
uniform float uDepth;
uniform sampler2D uNormalMap;
uniform float uNormalScale;

varying vec2 vUv;
varying vec3 vWorldPos;
varying vec3 vWorldNormal;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.52;
  }
  return v;
}

void main() {
  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  vec3 norm = normalize(vWorldNormal);
  vec3 mapNormal = texture2D(uNormalMap, vUv * vec2(2.0, 4.0)).rgb * 2.0 - 1.0;
  norm = normalize(norm + mapNormal * uNormalScale);
  float fresnel = pow(1.0 - max(dot(viewDir, norm), 0.0), 2.2);

  // --- Cherry bark texture layers ---

  // Vertical grain — dominant on trunk, finer on twigs
  float grainScale = mix(18.0, 40.0, clamp(uDepth / 4.0, 0.0, 1.0));
  float grain = 0.5 + 0.5 * sin(vUv.x * grainScale + vUv.y * grainScale * 1.7 - uTime * 0.15);

  // Horizontal lenticels — characteristic cherry bark feature (stronger on trunk)
  float lenticelFreq = mix(8.0, 20.0, clamp(uDepth / 5.0, 0.0, 1.0));
  float lenticels = smoothstep(0.55, 0.6, sin(vUv.x * lenticelFreq + noise(vUv * 6.0) * 1.5));
  lenticels *= (1.0 - clamp(uDepth / 3.0, 0.0, 0.8)); // fade on twigs

  // Ridge pattern
  float ridge = pow(0.5 + 0.5 * cos(vUv.y * 6.2831), 2.0);

  // FBM bark noise — coarser on trunk, finer on twigs
  float noiseScale = mix(2.8, 5.5, clamp(uDepth / 4.0, 0.0, 1.0));
  float barkNoise = fbm(vec2(vUv.x * noiseScale + uFlowOffset * 3.5, vUv.y * noiseScale * 1.5));

  // Knots — only on trunk/limbs
  float knots = smoothstep(0.62, 0.66, fbm(vec2(vUv.x * 1.5 + uFlowOffset * 7.0, vUv.y * 2.0 + uFlowOffset * 3.0)));
  knots *= (1.0 - clamp(uDepth / 2.5, 0.0, 1.0));

  // Ambient occlusion from crevices
  float ao = 1.0 - barkNoise * 0.2 - knots * 0.3;

  // --- Depth-based cherry bark palette ---
  // Cherry bark: silvery gray-brown on trunk, warmer reddish-brown on branches
  float depthBlend = clamp(uDepth / 5.0, 0.0, 1.0);

  vec3 barkDark = mix(vec3(0.18, 0.14, 0.11), vec3(0.16, 0.10, 0.07), depthBlend);
  vec3 barkMid = mix(vec3(0.30, 0.24, 0.20), vec3(0.38, 0.24, 0.16), depthBlend);
  vec3 barkLight = mix(vec3(0.42, 0.35, 0.30), vec3(0.52, 0.34, 0.22), depthBlend);

  // Base color mix
  vec3 color = mix(barkDark, barkMid, clamp(grain * 0.35 + barkNoise * 0.5 + uHeat * 0.1, 0.0, 1.0));
  color = mix(color, barkLight, ridge * 0.15 + barkNoise * 0.12);

  // Knot darkening
  color = mix(color, barkDark * 0.5, knots * 0.7);

  // Lenticels — lighter horizontal streaks (cherry bark signature)
  color = mix(color, barkLight * 1.2, lenticels * 0.35);

  // Green-gray moss/lichen hint on sheltered parts (lower UV, deeper branches)
  float mossMask = smoothstep(0.3, 0.0, vUv.y) * smoothstep(1.0, 3.0, uDepth) * barkNoise;
  vec3 mossColor = vec3(0.15, 0.18, 0.12);
  color = mix(color, mossColor, mossMask * 0.2);

  // Apply AO
  color *= ao;

  // --- Lighting ---

  // Diffuse from a key light direction
  vec3 lightDir = normalize(vec3(-0.3, 0.8, 0.4));
  float diffuse = max(dot(norm, lightDir), 0.0) * 0.4 + 0.6; // half-lambert
  color *= diffuse;

  // Fresnel rim highlight — warm edge light
  color += vec3(0.22, 0.15, 0.10) * fresnel * 0.4;

  // Ridge specular hint
  color += vec3(0.08, 0.06, 0.04) * ridge * (0.15 + uHeat * 0.15);

  // --- Event effects ---

  // Pulse glow
  float flow = 0.5 + 0.5 * sin(vUv.x * 18.0 - uTime * 2.8 - uFlowOffset * 8.0);
  color += uPulseColor * (0.06 + flow * 0.18 + ridge * 0.1) * uPulse;

  // Signal glow
  float signalDist = abs(vUv.x - uSignalPos);
  float signalGlow = smoothstep(0.1, 0.0, signalDist) * uSignalIntensity;
  color += uSignalColor * signalGlow * 0.6;

  // Contamination blight
  vec3 blightColor = vec3(0.85, 0.25, 0.35);
  color = mix(color, blightColor, uContam * 0.3);

  gl_FragColor = vec4(color, 1.0);
}
`;function Fo(s){let t=2166136261;for(let e=0;e<s.length;e++)t^=s.charCodeAt(e),t=Math.imul(t,16777619);return t>>>0}function Eo(s){let t=Fo(s)||1;return()=>{t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e^=e+Math.imul(e^e>>>7,61|e),((e^e>>>14)>>>0)/4294967296}}function jo(s){const{curve:t,baseRadius:e,taper:o,gnarliness:n,twist:i,sections:a,segments:l,seedKey:r,parentRadius:c}=s,h=Eo(`branch:${r}`),m=(k,N)=>k+(N-k)*h(),d=(a+1)*(l+1)+2,p=new Float32Array(d*3),f=new Float32Array(d*3),y=new Float32Array(d*2),g=[],v=new gt(0,0,0),M=new st;let u=0;for(let k=0;k<=a;k++){const N=k/a,et=t.getPointAt(N),W=t.getTangentAt(N).normalize();let $;if(k===a?$=e*.02:($=e*(1-o*N),c&&k===0&&($=Math.min($,c*.85))),k>2){const T=n*Math.max(.5,1/Math.sqrt(Math.max($,.2)));v.x+=m(-T,T),v.z+=m(-T,T)}M.setFromEuler(v);const L=Math.abs(W.y)>.99?new w(1,0,0):new w(0,1,0),Z=new w().crossVectors(W,L).normalize(),ot=new w().crossVectors(Z,W).normalize(),x=i*N,A=Math.cos(x),B=Math.sin(x),V=Z.clone().multiplyScalar(A).add(ot.clone().multiplyScalar(B)),_=Z.clone().multiplyScalar(-B).add(ot.clone().multiplyScalar(A));for(let T=0;T<=l;T++){const R=T/l*Math.PI*2,z=V.clone().multiplyScalar(Math.cos(R)*$).add(_.clone().multiplyScalar(Math.sin(R)*$));z.applyQuaternion(M);const U=et.clone().add(z),G=z.clone().normalize();p[u*3]=U.x,p[u*3+1]=U.y,p[u*3+2]=U.z,f[u*3]=G.x,f[u*3+1]=G.y,f[u*3+2]=G.z,y[u*2]=N,y[u*2+1]=T/l,u++}if(k<a){const T=k*(l+1),R=(k+1)*(l+1);for(let z=0;z<l;z++){const U=T+z,G=T+z+1,rt=R+z+1,yt=R+z;g.push(U,G,rt),g.push(U,rt,yt)}}}const C=u,b=t.getPointAt(0);p[u*3]=b.x,p[u*3+1]=b.y,p[u*3+2]=b.z;const D=t.getTangentAt(0).normalize();f[u*3]=-D.x,f[u*3+1]=-D.y,f[u*3+2]=-D.z,y[u*2]=0,y[u*2+1]=.5,u++;for(let k=0;k<l;k++)g.push(C,k+1,k);const F=u,E=t.getPointAt(1);p[u*3]=E.x,p[u*3+1]=E.y,p[u*3+2]=E.z;const j=t.getTangentAt(1).normalize();f[u*3]=j.x,f[u*3+1]=j.y,f[u*3+2]=j.z,y[u*2]=1,y[u*2+1]=.5,u++;const I=a*(l+1);for(let k=0;k<l;k++)g.push(F,I+k,I+k+1);const O=new ct;return O.setAttribute("position",new q(p,3)),O.setAttribute("normal",new q(f,3)),O.setAttribute("uv",new q(y,2)),O.setIndex(g),O.computeBoundingSphere(),O}function No(){const t=document.createElement("canvas");t.width=256,t.height=256;const e=t.getContext("2d");e.fillStyle="rgb(128,128,255)",e.fillRect(0,0,256,256);const o=e.getImageData(0,0,256,256),n=o.data;for(let r=0;r<256;r++)for(let c=0;c<256;c++){const h=(r*256+c)*4,m=Math.sin(c/256*Math.PI*24)*.5+Math.sin(c/256*Math.PI*7+.8)*.25;n[h]=Math.round(128+m*30),n[h+1]=128,n[h+2]=255,n[h+3]=255}const a=(r=>{let c=r;return()=>(c=c*1664525+1013904223>>>0,c/4294967295)})(42);for(let r=0;r<12;r++){const c=Math.floor(a()*256),h=Math.floor(a()*256),m=Math.floor(20+a()*30),d=Math.floor(3+a()*5);for(let p=-d;p<=d;p++)for(let f=-m;f<=m;f++){const y=(c+f+256)%256,g=(h+p+256)%256,v=1-Math.sqrt((f/m)**2+(p/d)**2);if(v<=0)continue;const M=(g*256+y)*4,u=Math.sin(v*Math.PI)*40;n[M+1]=Math.min(255,Math.round(n[M+1]+u))}}e.putImageData(o,0,0);const l=new it(t);return l.wrapS=zt,l.wrapT=zt,l.repeat.set(2,4),l.needsUpdate=!0,l}let Ut=null;function $o(){return Ut||(Ut=No()),Ut}function Tt(s){let t=2166136261;for(let e=0;e<s.length;e++)t^=s.charCodeAt(e),t=Math.imul(t,16777619);return(t>>>0)/4294967296}function St(s,t,e){return Math.min(e,Math.max(t,s))}function Bo(s){return new mt({uniforms:{uTime:{value:0},uHeat:{value:0},uPulse:{value:0},uContam:{value:0},uPulseColor:{value:new H("#e8a88a")},uFlowOffset:{value:s},uWindStrength:{value:0},uWindPhase:{value:0},uSignalPos:{value:-1},uSignalIntensity:{value:0},uSignalColor:{value:new H("#ffffff")},uDepth:{value:0},uGrowth:{value:1},uNormalMap:{value:$o()},uNormalScale:{value:.3}},vertexShader:ke,fragmentShader:Ie,transparent:!1,depthWrite:!0,side:vt,blending:Ce})}function Wo(s){return new Me(s.map(t=>t.clone()),!1,"catmullrom",.45)}function Go(s,t){const e=new Map;for(const n of s.branches){if(n.branchType==="file")continue;const i=Wo(n.curvePoints),a=Math.max(12,Math.min(32,28-n.depth*2)),l=n.depth<=1?12:n.depth<=3?10:8,r=Tt(`taper:${n.id}`)*.15,c=n.branchType==="root"?.5:n.branchType==="folder"?.6+r:.75+r,h=n.branchType==="root"?.008:.012+n.depth*.006,m=Tt(n.id)*1+.3,d=s.branches.find(u=>u.toPath===n.fromPath),p=d?d.branchType==="root"?.5:d.branchType==="folder"?.65:.8:.5,f=d?d.radius*(1-p*.7):n.radius,y=Math.min(n.radius,f*.9),g=jo({curve:i,baseRadius:n.isSyntheticRoot?n.radius:y,taper:c,gnarliness:h,twist:m,sections:a,segments:l,seedKey:n.id,parentRadius:f}),v=Bo(Tt(n.id));v.uniforms.uDepth.value=n.depth;const M=new at(g,v);M.renderOrder=2,M.castShadow=!0,t.add(M),e.set(n.id,{spec:n,mesh:M,material:v,curve:i,pulse:0,contamination:0,pulseColor:new H("#e8a88a"),growthProgress:1,growthTarget:1,growthStartTime:0,growthDuration:2.5})}return{branches:e,junctions:[]}}function Oo(s,t,e,o,n,i,a,l){for(const r of s.values()){r.pulse=Math.max(0,r.pulse-l*1.65),r.contamination=Math.max(0,r.contamination-l*.08);const c=St(o*(r.spec.branchType==="root"?1.1:1.04-r.spec.depth*.06),.05,1),h=r.material.uniforms;h.uTime.value=e,h.uHeat.value=c,h.uPulse.value=r.pulse,h.uContam.value=St(n*.45+r.contamination,0,1),h.uPulseColor.value.copy(r.pulseColor),h.uWindStrength.value=i*Math.min(2,r.spec.depth*.3),h.uWindPhase.value=a}for(const r of t){let c=0,h=0;const m=new H("#e8a88a");for(const p of r.branchIds){const f=s.get(p);f&&(f.pulse>=c&&(c=f.pulse,m.copy(f.pulseColor)),h=Math.max(h,f.contamination))}const d=r.material.uniforms;d.uTime.value=e+Tt(r.path),d.uHeat.value=St(o*1.04+c*.16,.08,1),d.uPulse.value=c*.88,d.uContam.value=St(n*.4+h*.85,0,1),d.uPulseColor.value.copy(m),d.uWindStrength.value=i*.2,d.uWindPhase.value=a}}function Lo(s,t){for(const e of s.values())e.mesh.geometry.dispose(),e.material.dispose();for(const e of t)e.mesh.geometry.dispose(),e.material.dispose()}const nt=6e5,ee=18e5,K=8,ut=K+1,Mt=22,oe=5,Ft=2,Vo=50,Ho=.04,ne=38,se=48,ie=28,qo=2e3,re=200,ae=800,le=2,ce=.05,Zo=3.5,he=2,Xo=.06,Et=2,Qo=1.2,Yo=1,ue=30;class de{constructor(t){this.w=t|0||1,this.z=t*1664525+1013904223|0||1}random(t=1,e=0){this.z=36969*(this.z&65535)+(this.z>>16)|0,this.w=18e3*(this.w&65535)+(this.w>>16)|0;let o=(this.z<<16)+this.w|0;return o=(o>>>0)/4294967296,e+o*(t-e)}}class Ko{constructor(t){this.cells=new Map,this.cellSize=t}key(t,e,o){const n=Math.floor(t/this.cellSize),i=Math.floor(e/this.cellSize),a=Math.floor(o/this.cellSize);return`${n},${i},${a}`}clear(){this.cells.clear()}insert(t,e){const o=this.key(e.x,e.y,e.z),n=this.cells.get(o);n?n.push(t):this.cells.set(o,[t])}queryRadius(t,e){const o=[],n=e,i=this.cellSize,a=Math.floor((t.x-n)/i),l=Math.floor((t.x+n)/i),r=Math.floor((t.y-n)/i),c=Math.floor((t.y+n)/i),h=Math.floor((t.z-n)/i),m=Math.floor((t.z+n)/i);for(let d=a;d<=l;d++)for(let p=r;p<=c;p++)for(let f=h;f<=m;f++){const y=this.cells.get(`${d},${p},${f}`);if(y)for(const g of y)o.push(g)}return o}}class Jo{constructor(t=23399){this.nodes=[],this.nodeMap=new Map,this.nextNodeId=0,this.attractors=[],this.envelopeScale=1,this.eventCounter=0,this.activeAttractors=0,this.vertexCount=0,this.indexCount=0,this.seed=t,this.rng=new de(t),this.nodeGrid=new Ko(Mt),this.positions=new Float32Array(nt*3),this.normalsArr=new Float32Array(nt*3),this.uvsArr=new Float32Array(nt*2),this.indicesArr=new Uint32Array(ee),this.geometry=new ct;const e=new q(this.positions,3);e.setUsage(bt);const o=new q(this.normalsArr,3);o.setUsage(bt);const n=new q(this.uvsArr,2);n.setUsage(bt);const i=new q(this.indicesArr,1);i.setUsage(bt),this.geometry.setAttribute("position",e),this.geometry.setAttribute("normal",o),this.geometry.setAttribute("uv",n),this.geometry.setIndex(i),this.geometry.setDrawRange(0,0),this.init()}onEvent(){const t=[],e=[];for(let o=0;o<Yo;o++){const{flowers:n,newNodeIds:i}=this.growOneStep(!0);t.push(...n),e.push(...i)}return{flowers:t,newNodeIds:e}}reset(){this.nodes=[],this.nodeMap.clear(),this.nextNodeId=0,this.attractors=[],this.activeAttractors=0,this.vertexCount=0,this.indexCount=0,this.eventCounter=0,this.envelopeScale=1,this.rng=new de(this.seed),this.init(),this.commitGeometry()}traceToRoot(t){const e=[];let o=this.nodeMap.get(t);for(;o;)e.unshift(o.id),o=o.parentId!==null?this.nodeMap.get(o.parentId):void 0;return e}getNode(t){return this.nodeMap.get(t)}get nodeCount(){return this.nodes.length}get totalEvents(){return this.eventCounter}get isCapped(){return this.vertexCount+ut*60>=nt}getRandomLeafPath(){const t=this.nodes.filter(o=>o.childIds.length===0);if(t.length===0)return null;const e=t[Math.floor(Math.random()*t.length)];return this.traceToRoot(e.id).map(o=>this.nodeMap.get(o)).filter(o=>o!==void 0).map(o=>o.position.clone())}get activeAttractorCount(){return this.activeAttractors}getTipFlowerPositions(){const t=[];for(const e of this.nodes){if(e.depth<Et)continue;const o=e.childIds.length===0;(o||e.depth>=5)&&t.push({pos:e.position.clone(),dir:e.direction.clone(),isTip:o})}return t}init(){this.personality=this.derivePersonality(),this.scatterAttractors(qo);const t=.052+this.personality.leanAngle*.15,e=new w(Math.sin(t)*Math.cos(this.personality.leanDirection),Math.cos(t),Math.sin(t)*Math.sin(this.personality.leanDirection)).normalize(),o={id:this.nextNodeId++,position:new w(0,0,0),parentId:null,childIds:[],radius:Qo,depth:0,distFromRoot:0,direction:e,segmentVertexStart:-1,createdAtEvent:0,lastPerturbation:new w};this.nodes.push(o),this.nodeMap.set(o.id,o)}gaussRng(){const t=Math.max(1e-10,this.rng.random()),e=this.rng.random();return Math.sqrt(-2*Math.log(t))*Math.cos(2*Math.PI*e)}gnarlForDepth(t){const e=this.personality.gnarliness;return t<=5?(.35+Math.min(t,5)*.02)*e:t<=12?.18*e:.1*e}derivePersonality(){const t=this.rng.random(.18,.03),e=this.rng.random(Math.PI*2,0),o=this.rng.random(.9,.3),n=(this.rng.random()-.5)*.04,i=(this.rng.random()-.5)*.04,a=2+Math.floor(this.rng.random()*3),l=[],r=se,c=ie,h=ne;for(let m=0;m<a;m++){let d=0,p=0,f=0,y=0;do d=(this.rng.random()*2-1)*r,p=(this.rng.random()*2-1)*c+h,f=(this.rng.random()*2-1)*r,y++;while((d*d/(r*r)+(p-h)*(p-h)/(c*c)+f*f/(r*r)>1||p<15)&&y<50);l.push(new w(d,p,f))}return{leanAngle:t,leanDirection:e,gnarliness:o,windDriftX:n,windDriftZ:i,hotspots:l}}scatterAttractors(t){const e=this.envelopeScale,o=se*e,n=ie*e,i=ne*e,a=Math.sin(this.personality.leanAngle)*Math.cos(this.personality.leanDirection),l=Math.sin(this.personality.leanAngle)*Math.sin(this.personality.leanDirection),r=Math.floor(t*.6),c=t-r;let h=0,m=0;const d=o*.3;for(;h<r&&m<r*30;){m++;const f=this.personality.hotspots[Math.floor(this.rng.random()*this.personality.hotspots.length)],y=f.x*e,g=f.y*e,v=f.z*e,M=y+this.gaussRng()*d,u=g+this.gaussRng()*d*.5,C=v+this.gaussRng()*d,b=M/o,D=(u-i)/n,F=C/o;if(b*b+D*D+F*F>1||u<12)continue;const E=M+(u-i)*a,j=C+(u-i)*l;this.attractors.push({position:new w(E,u,j),active:!0}),h++}let p=0;for(;p<c;){const f=(this.rng.random()*2-1)*o,y=(this.rng.random()*2-1)*n+i,g=(this.rng.random()*2-1)*o,v=f/o,M=(y-i)/n,u=g/o;if(v*v+M*M+u*u>1||y<12)continue;const C=f+(y-i)*a,b=g+(y-i)*l;this.attractors.push({position:new w(C,y,b),active:!0}),p++}this.activeAttractors+=h+p}growOneStep(t){this.eventCounter++,this.eventCounter%Vo===0&&(this.envelopeScale+=Ho);const e=[],o=[],n={flowers:e,newNodeIds:o};if(this.vertexCount+ut*60>=nt)return console.warn(`[SCA] vertex cap reached: ${this.vertexCount}/${nt} (${this.nodes.length} nodes, event ${this.eventCounter})`),n;this.nodeGrid.clear();for(const b of this.nodes)this.nodeGrid.insert(b.id,b.position);const i=new Map,a=Mt*Mt;for(const b of this.attractors){if(!b.active)continue;const D=this.nodeGrid.queryRadius(b.position,Mt);let F=-1,E=a;for(const j of D){const O=this.nodeMap.get(j).position.distanceToSquared(b.position);O<E&&(E=O,F=j)}if(F>=0){const j=i.get(F)??[];j.push(b.position),i.set(F,j)}}if(i.size===0){const b=this.growTrunkUpward();return o.push(b.id),t&&b.depth>=Et&&e.push({pos:b.position.clone(),dir:b.direction.clone()}),this.activeAttractors<re&&(this.envelopeScale+=.12,this.scatterAttractors(ae)),this.commitGeometry(),n}let l=-1,r=0,c=-1;for(const[b,D]of i.entries()){const F=this.nodeMap.get(b);(D.length>r||D.length===r&&F.depth>c)&&(l=b,r=D.length,c=F.depth)}if(l<0)return this.commitGeometry(),n;const h=this.nodeMap.get(l),m=i.get(l),d=new w;for(const b of m)d.add(new w().subVectors(b,h.position).normalize());d.divideScalar(m.length).normalize();const p=this.gnarlForDepth(h.depth),f=(this.rng.random()-.5)*p,y=(this.rng.random()-.5)*p*.5,g=(this.rng.random()-.5)*p,v=h.lastPerturbation;if(d.x+=f+v.x*.2,d.y+=y+v.y*.2,d.z+=g+v.z*.2,h.depth>he){const b=Math.min(1,(h.depth-he)/10);d.y-=Xo*b,d.x+=this.personality.windDriftX*b,d.z+=this.personality.windDriftZ*b}d.normalize();const M=h.position.clone().addScaledVector(d,Ft),u=this.createNode(M,d,h);u.lastPerturbation=new w(f+v.x*.2,y+v.y*.2,g+v.z*.2),o.push(u.id);const C=oe*oe;for(const b of this.attractors)b.active&&u.position.distanceToSquared(b.position)<C&&(b.active=!1,this.activeAttractors--);return this.updateRadiiToRoot(u),this.writeSegment(u),this.updateAncestorGeometry(u),t&&u.depth>=Et&&e.push({pos:u.position.clone(),dir:u.direction.clone()}),this.activeAttractors<re&&(this.envelopeScale+=.12,this.scatterAttractors(ae)),this.commitGeometry(),n}createNode(t,e,o){const n={id:this.nextNodeId++,position:t.clone(),parentId:o.id,childIds:[],radius:ce,depth:o.depth+1,distFromRoot:o.distFromRoot+Ft,direction:e.clone(),segmentVertexStart:-1,createdAtEvent:this.eventCounter,lastPerturbation:new w};return o.childIds.push(n.id),this.nodes.push(n),this.nodeMap.set(n.id,n),n}growTrunkUpward(){let t=this.nodes[this.nodes.length-1];for(const i of this.nodes)i.childIds.length===0&&i.position.y>t.position.y&&(t=i);const e=new w((this.rng.random()-.5)*.06,1,(this.rng.random()-.5)*.06).normalize(),o=t.position.clone().addScaledVector(e,Ft),n=this.createNode(o,e,t);return n.lastPerturbation=new w,this.updateRadiiToRoot(n),this.writeSegment(n),this.updateAncestorGeometry(n),n}updateRadiiToRoot(t){t.radius=ce;let e=t.parentId!==null?this.nodeMap.get(t.parentId):void 0;for(;e;){let o=0;for(const i of e.childIds){const a=this.nodeMap.get(i);o+=Math.pow(a.radius,le)}const n=Math.min(Zo,Math.pow(o,1/le));if(Math.abs(n-e.radius)<.001)break;e.radius=n,e=e.parentId!==null?this.nodeMap.get(e.parentId):void 0}}writeSegment(t){if(t.parentId===null)return;const e=this.nodeMap.get(t.parentId);if(this.vertexCount+ut*2>=nt||this.indexCount+K*6>=ee)return;t.segmentVertexStart=this.vertexCount;const o=t.direction,n=e.radius,i=t.radius,a=e.distFromRoot/ue,l=t.distFromRoot/ue,r=this.vertexCount;this.writeRing(e.position,o,n,a);const c=this.vertexCount;this.writeRing(t.position,o,i,l);for(let h=0;h<K;h++){const m=r+h,d=r+h+1,p=c+h+1,f=c+h;this.indicesArr[this.indexCount++]=m,this.indicesArr[this.indexCount++]=f,this.indicesArr[this.indexCount++]=d,this.indicesArr[this.indexCount++]=d,this.indicesArr[this.indexCount++]=f,this.indicesArr[this.indexCount++]=p}}writeRing(t,e,o,n){const i=new w(0,1,0),a=new st;Math.abs(e.dot(i))>.999?a.setFromUnitVectors(i,e.y>0?i:new w(0,-1,0)):a.setFromUnitVectors(i,e);const l=new gt().setFromQuaternion(a);let r=0,c=0,h=0,m=0,d=0,p=0;for(let y=0;y<K;y++){const g=2*Math.PI*y/K,v=Math.cos(g),M=Math.sin(g),u=new w(v*o,0,M*o).applyEuler(l).add(t),C=new w(v,0,M).applyEuler(l).normalize(),b=this.vertexCount;this.positions[b*3]=u.x,this.positions[b*3+1]=u.y,this.positions[b*3+2]=u.z,this.normalsArr[b*3]=C.x,this.normalsArr[b*3+1]=C.y,this.normalsArr[b*3+2]=C.z,this.uvsArr[b*2]=y/K,this.uvsArr[b*2+1]=n,this.vertexCount++,y===0&&(r=u.x,c=u.y,h=u.z,m=C.x,d=C.y,p=C.z)}const f=this.vertexCount;this.positions[f*3]=r,this.positions[f*3+1]=c,this.positions[f*3+2]=h,this.normalsArr[f*3]=m,this.normalsArr[f*3+1]=d,this.normalsArr[f*3+2]=p,this.uvsArr[f*2]=1,this.uvsArr[f*2+1]=n,this.vertexCount++}updateAncestorGeometry(t){let e=t.parentId!==null?this.nodeMap.get(t.parentId):void 0;for(;e;){for(const o of e.childIds){const n=this.nodeMap.get(o);if(n.segmentVertexStart<0)continue;const i=n.segmentVertexStart;this.updateRingRadius(i,e.position,n.direction,e.radius);const a=i+ut;a+ut<=this.vertexCount&&this.updateRingRadius(a,n.position,n.direction,n.radius)}e=e.parentId!==null?this.nodeMap.get(e.parentId):void 0}}updateRingRadius(t,e,o,n){const i=new w(0,1,0),a=new st;Math.abs(o.dot(i))>.999?a.setFromUnitVectors(i,o.y>0?i:new w(0,-1,0)):a.setFromUnitVectors(i,o);const l=new gt().setFromQuaternion(a);for(let r=0;r<=K;r++){const c=2*Math.PI*(r%K)/K,h=Math.cos(c),m=Math.sin(c),d=new w(h*n,0,m*n).applyEuler(l).add(e),p=t+r;if(p>=this.vertexCount)break;this.positions[p*3]=d.x,this.positions[p*3+1]=d.y,this.positions[p*3+2]=d.z}}commitGeometry(){this.geometry.setDrawRange(0,this.indexCount),this.geometry.getAttribute("position").needsUpdate=!0,this.geometry.getAttribute("normal").needsUpdate=!0,this.geometry.getAttribute("uv").needsUpdate=!0;const t=this.geometry.getIndex();t&&(t.needsUpdate=!0),this.geometry.computeBoundingSphere()}}const tn=8e3,en=-9.8,pe=-2,Ct=0,on=1;function Y(s){let t=2166136261;for(let e=0;e<s.length;e++)t^=s.charCodeAt(e),t=Math.imul(t,16777619);return(t>>>0)/4294967296}function nn(){const t=document.createElement("canvas");t.width=128,t.height=128;const e=t.getContext("2d"),o=128/2,n=128/2;e.beginPath(),e.moveTo(o,n*.15),e.bezierCurveTo(o+44,n*.28,o+50,n*1.05,o+2,n*1.75),e.bezierCurveTo(o-46,n*1.12,o-40,n*.32,o,n*.15),e.closePath();const i=e.createRadialGradient(o,n*.8,0,o,n*.8,128*.45);i.addColorStop(0,"rgba(255, 230, 240, 1)"),i.addColorStop(.3,"rgba(255, 200, 220, 1)"),i.addColorStop(.6,"rgba(245, 170, 200, 1)"),i.addColorStop(1,"rgba(230, 140, 175, 1)"),e.fillStyle=i,e.fill(),e.strokeStyle="rgba(220, 170, 190, 0.35)",e.lineWidth=1.2,e.beginPath(),e.moveTo(o,n*.25),e.quadraticCurveTo(o+1,n,o,n*1.55),e.stroke(),e.strokeStyle="rgba(220, 170, 190, 0.2)",e.lineWidth=.7;for(let l=0;l<4;l++){const r=.3+l*.15,c=n*(.4+r*1.1),h=18+l*6;e.beginPath(),e.moveTo(o,c),e.quadraticCurveTo(o-h*.6,c-4,o-h,c+3),e.stroke(),e.beginPath(),e.moveTo(o,c),e.quadraticCurveTo(o+h*.6,c-4,o+h,c+3),e.stroke()}const a=new it(t);return a.needsUpdate=!0,a}function sn(){const t=document.createElement("canvas");t.width=128,t.height=128;const e=t.getContext("2d"),o=128/2,n=128/2;e.beginPath(),e.moveTo(o,n*.15),e.bezierCurveTo(o+44,n*.28,o+50,n*1.05,o+2,n*1.75),e.bezierCurveTo(o-46,n*1.12,o-40,n*.32,o,n*.15),e.closePath();const i=e.createRadialGradient(o,n*.8,0,o,n*.8,128*.46);i.addColorStop(0,"rgba(255, 255, 255, 1)"),i.addColorStop(.85,"rgba(255, 255, 255, 1)"),i.addColorStop(.95,"rgba(255, 255, 255, 0.5)"),i.addColorStop(1,"rgba(255, 255, 255, 0)"),e.fillStyle=i,e.fill();const a=new it(t);return a.needsUpdate=!0,a}function rn(s,t){const e=s/2,o=t/2,n=new Float32Array([-e,-o,0,e,-o,0,e,o,0,-e,o,0,0,-o,-e,0,-o,e,0,o,e,0,o,-e]),i=new Float32Array([0,0,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0]),a=new Float32Array([0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1]),l=[0,1,2,0,2,3,0,2,1,0,3,2,4,5,6,4,6,7,4,6,5,4,7,6],r=new ct;return r.setAttribute("position",new q(n,3)),r.setAttribute("normal",new q(i,3)),r.setAttribute("uv",new q(a,2)),r.setIndex(l),r}class an{constructor(){this.count=0,this.driftTimer=0,this.driftInterval=1.5,this.capacity=tn;const t=rn(2.8,3.4),e=nn(),o=sn();this.material=new mt({uniforms:{uMap:{value:e},uAlphaMap:{value:o},uLightDir:{value:new w(-.3,.8,.4).normalize()},uSSS:{value:.45},uSSSColor:{value:new H("#ff8aaa")}},vertexShader:`
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPos;
        void main() {
          vUv = uv;
          vec4 world = modelMatrix * instanceMatrix * vec4(position, 1.0);
          vWorldPos = world.xyz;
          vWorldNormal = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
          gl_Position = projectionMatrix * viewMatrix * world;
        }
      `,fragmentShader:`
        uniform sampler2D uMap;
        uniform sampler2D uAlphaMap;
        uniform vec3 uLightDir;
        uniform float uSSS;
        uniform vec3 uSSSColor;
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPos;

        void main() {
          vec4 texColor = texture2D(uMap, vUv);
          float alpha = texture2D(uAlphaMap, vUv).r;
          if (alpha < 0.5) discard;

          vec3 norm = normalize(vWorldNormal);
          vec3 viewDir = normalize(cameraPosition - vWorldPos);

          // Diffuse — half-lambert for soft wrap
          float diffuse = max(dot(norm, uLightDir), 0.0) * 0.5 + 0.5;

          // Subsurface scattering — light passing through the petal
          float sss = max(dot(-norm, uLightDir), 0.0);
          sss = pow(sss, 1.5) * uSSS;

          // Fresnel rim
          float fresnel = pow(1.0 - max(dot(viewDir, norm), 0.0), 2.5) * 0.15;

          vec3 color = texColor.rgb * diffuse;
          color += uSSSColor * sss;
          color += vec3(1.0, 0.95, 0.98) * fresnel;

          gl_FragColor = vec4(color, 1.0);
        }
      `,side:vt,depthWrite:!0,transparent:!1}),this.mesh=new Pe(t,this.material,this.capacity),this.mesh.count=0,this.mesh.renderOrder=6,this.mesh.frustumCulled=!1,this.states=new Float32Array(this.capacity),this.velocities=new Float32Array(this.capacity*3),this.positions=new Float32Array(this.capacity*3),this.anchorPositions=new Float32Array(this.capacity*3),this.phases=new Float32Array(this.capacity),this.groundTimers=new Float32Array(this.capacity),this.glowGroup=new $t,this.glowGroup.renderOrder=7}allocateCluster(t){const e=16+Math.floor(Y(`count:${t.path}`)*12),o=[],n=t.direction.clone().normalize(),i=Math.abs(n.y)>.9?new w(1,0,0):new w(0,1,0),a=new w().crossVectors(n,i).normalize(),l=new w().crossVectors(a,n).normalize();for(let r=0;r<e&&!(this.count>=this.capacity);r++){const c=this.count++;o.push(c);const h=r/e*Math.PI*2+Y(`${t.path}:a:${r}`)*.7,m=t.scale*(.6+Y(`${t.path}:r:${r}`)*1.2),d=Math.cos(h)*m,p=Math.sin(h)*m,f=(Y(`${t.path}:y:${r}`)-.5)*t.scale*.6,y=t.position.clone().add(a.clone().multiplyScalar(d)).add(l.clone().multiplyScalar(p)).add(n.clone().multiplyScalar(f));this.anchorPositions[c*3]=y.x,this.anchorPositions[c*3+1]=y.y,this.anchorPositions[c*3+2]=y.z,this.positions[c*3]=y.x,this.positions[c*3+1]=y.y,this.positions[c*3+2]=y.z,this.phases[c]=Y(`${t.path}:phase:${r}`),this.states[c]=Ct,this.groundTimers[c]=0;const g=t.scale*(.8+Y(`${t.path}:s:${r}`)*.7),v=new qt,M=(Y(`${t.path}:rx:${r}`)-.5)*Math.PI*.9,u=Y(`${t.path}:ry:${r}`)*Math.PI*2,C=(Y(`${t.path}:rz:${r}`)-.5)*Math.PI*.7,b=new st().setFromEuler(new gt(M,u,C));v.makeRotationFromQuaternion(b),v.scale(new w(g,g,g)),v.setPosition(y),this.mesh.setMatrixAt(c,v)}return this.mesh.instanceMatrix.needsUpdate=!0,o}detach(t,e){for(const o of t)o>=this.count||(this.states[o]=on,this.velocities[o*3]=e.x+(Math.random()-.5)*2,this.velocities[o*3+1]=e.y+Math.random()*3,this.velocities[o*3+2]=e.z+(Math.random()-.5)*2,this.groundTimers[o]=0)}setWilt(t,e){}update(t,e,o){const n=new qt,i=new st,a=new gt;let l=!1;for(let r=0;r<this.count;r++){if(this.states[r]===Ct){const h=this.phases[r],m=Math.sin(e*1.4+h*6.28)*o.effectiveStrength*.6,d=Math.sin(e*2.1+h*3.14)*o.effectiveStrength*.15,p=Math.cos(e*.9+h*4.71)*o.effectiveStrength*.4,f=this.anchorPositions[r*3],y=this.anchorPositions[r*3+1],g=this.anchorPositions[r*3+2];o.effectiveStrength>.05&&(this.mesh.getMatrixAt(r,n),n.setPosition(f+m,y+d,g+p),this.mesh.setMatrixAt(r,n),l=!0);continue}this.velocities[r*3]=this.velocities[r*3]*.98+o.directionX*o.effectiveStrength*t*3,this.velocities[r*3+1]=Math.max(this.velocities[r*3+1]+en*t*.3,-4),this.velocities[r*3+2]=this.velocities[r*3+2]*.98+o.directionZ*o.effectiveStrength*t*3,this.positions[r*3]+=this.velocities[r*3]*t,this.positions[r*3+1]+=this.velocities[r*3+1]*t,this.positions[r*3+2]+=this.velocities[r*3+2]*t,this.positions[r*3+1]<pe&&(this.positions[r*3+1]=pe,this.velocities[r*3]=0,this.velocities[r*3+1]=0,this.velocities[r*3+2]=0,this.groundTimers[r]+=t,this.groundTimers[r]>5&&(this.states[r]=Ct,this.positions[r*3]=this.anchorPositions[r*3],this.positions[r*3+1]=this.anchorPositions[r*3+1],this.positions[r*3+2]=this.anchorPositions[r*3+2],this.groundTimers[r]=0));const c=e*2+this.phases[r]*10;a.set(c*.7,c,c*.3),i.setFromEuler(a),n.makeRotationFromQuaternion(i),n.scale(new w(.5,.5,.5)),n.setPosition(this.positions[r*3],this.positions[r*3+1],this.positions[r*3+2]),this.mesh.setMatrixAt(r,n),l=!0}l&&(this.mesh.instanceMatrix.needsUpdate=!0),this.mesh.count=this.count}ambientDrift(t){if(this.driftTimer+=t,this.driftTimer<this.driftInterval||this.count===0)return;this.driftTimer=0,this.driftInterval=.8+Math.random()*2;const e=1+Math.floor(Math.random()*4),o=[];for(let i=0;i<this.count&&o.length<e*5;i++)this.states[i]===Ct&&o.push(i);if(o.length===0)return;const n=[];for(let i=0;i<e&&o.length>0;i++){const a=Math.floor(Math.random()*o.length);n.push(o.splice(a,1)[0])}this.detach(n,new w(0,.5,0))}reset(){for(this.count=0,this.mesh.count=0;this.glowGroup.children.length;){const t=this.glowGroup.children[0];this.glowGroup.remove(t),t instanceof Ot&&t.material.dispose()}}dispose(){var t,e,o,n;this.mesh.geometry.dispose(),(e=(t=this.material.uniforms.uMap)==null?void 0:t.value)==null||e.dispose(),(n=(o=this.material.uniforms.uAlphaMap)==null?void 0:o.value)==null||n.dispose(),this.material.dispose(),this.reset()}}function ln(){let s=0,t=0;for(;s===0;)s=Math.random();for(;t===0;)t=Math.random();return Math.sqrt(-2*Math.log(s))*Math.cos(2*Math.PI*t)}function fe(s,t,e,o){const n=s+ln()*t;return Math.max(e,Math.min(o,n))}function cn(){const t=document.createElement("canvas");t.width=64,t.height=64;const e=t.getContext("2d");e.clearRect(0,0,64,64);const o=64/2,n=64/2,i=11;for(let r=0;r<5;r++){const c=(r*72-90)*Math.PI/180;e.save(),e.translate(o,n),e.rotate(c),e.beginPath(),e.moveTo(0,0),e.bezierCurveTo(-i*.5,-19*.3,-i,-19*.7,-2.5,-19),e.quadraticCurveTo(0,-19+3.5,2.5,-19),e.bezierCurveTo(i,-19*.7,i*.5,-19*.3,0,0),e.closePath();const h=e.createLinearGradient(0,0,0,-19);h.addColorStop(0,"rgba(252, 175, 195, 1)"),h.addColorStop(.4,"rgba(255, 205, 215, 1)"),h.addColorStop(1,"rgba(255, 238, 242, 1)"),e.fillStyle=h,e.fill(),e.beginPath(),e.moveTo(0,-3),e.lineTo(0,-14),e.strokeStyle="rgba(240, 150, 175, 0.25)",e.lineWidth=.6,e.stroke(),e.restore()}e.beginPath(),e.arc(o,n,4.5,0,Math.PI*2);const a=e.createRadialGradient(o,n,0,o,n,4.5);a.addColorStop(0,"rgba(255, 240, 160, 1)"),a.addColorStop(1,"rgba(230, 210, 120, 1)"),e.fillStyle=a,e.fill();for(let r=0;r<7;r++){const c=r/7*Math.PI*2,h=6;e.beginPath(),e.arc(o+Math.cos(c)*h,n+Math.sin(c)*h,.9,0,Math.PI*2),e.fillStyle="rgba(210, 180, 80, 0.7)",e.fill()}const l=new it(t);return l.needsUpdate=!0,l}const pt=[{r:1,g:.9,b:.92,weight:35},{r:1,g:.88,b:.89,weight:20},{r:.96,g:.78,b:.83,weight:15},{r:.92,g:.65,b:.72,weight:8},{r:.88,g:.55,b:.65,weight:3},{r:1,g:.82,b:.78,weight:8},{r:1,g:.78,b:.72,weight:4},{r:1,g:.98,b:.98,weight:5},{r:1,g:.96,b:.93,weight:2}],hn=pt.reduce((s,t)=>s+t.weight,0),Wt=[];{let s=0;for(const t of pt)s+=t.weight,Wt.push(s)}function un(){const s=Math.random()*hn;for(let t=0;t<Wt.length;t++)if(s<Wt[t])return pt[t];return pt[pt.length-1]}const ft=[{lo:.3,hi:.5,weight:15},{lo:.6,hi:1,weight:35},{lo:1,hi:1.5,weight:30},{lo:1.5,hi:2,weight:14},{lo:2,hi:2.5,weight:6}],dn=ft.reduce((s,t)=>s+t.weight,0),Gt=[];{let s=0;for(const t of ft)s+=t.weight,Gt.push(s)}function pn(){const s=Math.random()*dn;for(let e=0;e<Gt.length;e++)if(s<Gt[e]){const o=ft[e];return o.lo+Math.random()*(o.hi-o.lo)}const t=ft[ft.length-1];return t.lo+Math.random()*(t.hi-t.lo)}const Pt=5e4;class fn{constructor(){this.count=0,this.dummy=new Xe,this._tempDir=new w;const t=new De(1,1),e=cn(),o=new Lt({map:e,alphaTest:.15,transparent:!0,side:vt,roughness:.55,metalness:0,depthWrite:!0});this.mesh=new Pe(t,o,Pt),this.mesh.count=0,this.mesh.castShadow=!0,this.mesh.receiveShadow=!0,this.mesh.frustumCulled=!1;const n=new Float32Array(Pt*3);for(let i=0;i<Pt;i++)n[i*3]=1,n[i*3+1]=1,n[i*3+2]=1;this.mesh.instanceColor=new Qe(n,3)}addCluster(t,e,o){let n=0;for(let i=0;i<o&&!(this.count>=Pt);i++){const a=Math.abs(fe(0,.55,-3.5,3.5)),l=Math.random()*Math.PI*2,r=Math.cos(l)*a,c=Math.sin(l)*a,h=fe(0,.35,-2,2);this.dummy.position.set(t.x+r,t.y+h,t.z+c),this._tempDir.copy(e),this._tempDir.x+=(Math.random()-.5)*1.6,this._tempDir.y+=(Math.random()-.5)*1.4,this._tempDir.z+=(Math.random()-.5)*1.6,this._tempDir.normalize(),this.dummy.quaternion.setFromUnitVectors(new w(0,0,1),this._tempDir);const m=new st().setFromAxisAngle(this._tempDir,Math.random()*Math.PI*2);this.dummy.quaternion.premultiply(m);const d=new w(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize(),p=(Math.random()-.5)*Math.PI*.5,f=new st().setFromAxisAngle(d,p);this.dummy.quaternion.premultiply(f);const y=pn();this.dummy.scale.setScalar(y),this.dummy.updateMatrix(),this.mesh.setMatrixAt(this.count,this.dummy.matrix);const g=un(),v=.04;let M=g.r+(Math.random()-.5)*v,u=g.g+(Math.random()-.5)*v,C=g.b+(Math.random()-.5)*v;const b=Math.random()<.25?.6+Math.random()*.2:.85+Math.random()*.15;M*=b,u*=b,C*=b,M=Math.max(0,Math.min(1,M)),u=Math.max(0,Math.min(1,u)),C=Math.max(0,Math.min(1,C)),this.mesh.setColorAt(this.count,new H(M,u,C)),this.count++,n++}return this.mesh.count=this.count,this.mesh.instanceMatrix.needsUpdate=!0,this.mesh.instanceColor&&(this.mesh.instanceColor.needsUpdate=!0),n}reset(){this.count=0,this.mesh.count=0,this.mesh.instanceMatrix.needsUpdate=!0,this.mesh.instanceColor&&(this.mesh.instanceColor.needsUpdate=!0)}get flowerCount(){return this.count}dispose(){this.mesh.geometry.dispose();const t=this.mesh.material;t.map&&t.map.dispose(),t.dispose()}}function Q(s,t,e){return Math.min(e,Math.max(t,s))}function Re(s){return 1-Math.pow(1-s,3)}function Ue(s,t){if(s.length===0)return null;const e=[],o=t==="outward"?s:[...s].reverse();for(const n of o){const i=t==="outward"?n.spec.curvePoints:[...n.spec.curvePoints].reverse();for(const a of i){const l=e[e.length-1];(!l||l.distanceToSquared(a)>.01)&&e.push(a.clone())}}return e.length<2?null:new Me(e,!1,"catmullrom",.45)}function Fe(s,t=20){const e=new Float32Array(t*3),o=new ct;o.setAttribute("position",new q(e,3));const n=new _e({color:s,size:1.2,transparent:!0,opacity:.7,blending:kt,depthWrite:!1,sizeAttenuation:!0}),i=new Te(o,n);return i.renderOrder=8,{points:i,material:n,positions:e}}function tt(s,t,e=!1){for(const o of s)o.pulse=Math.max(o.pulse,1),o.pulseColor.copy(t),e&&(o.contamination=Math.min(1,o.contamination+.6))}function Ee(s,t){const e=s.length;if(e===0)return{branchIndex:0,localT:0};const o=t*e,n=Math.min(Math.floor(o),e-1),i=Q(o-n,0,1);return{branchIndex:n,localT:i}}const mn=1.2,gn=(s,t)=>{const{branchChain:e,color:o}=s,n=Ue(e,"inward");if(!n)return{tick:()=>!1,dispose:()=>{}};tt(e,o);const i=Fe(o,20);t.add(i.points);let a=0,l=!1;const r={tick(c){var f,y;a+=c;const h=Q(a/mn,0,1),m=Re(h),{branchIndex:d,localT:p}=Ee(e,m);for(let g=0;g<e.length;g++){const v=e[g];g===d?(v.material.uniforms.uSignalPos.value=1-p,v.material.uniforms.uSignalIntensity.value=(1-h)*s.intensity,v.material.uniforms.uSignalColor.value.copy(o)):g<d?v.material.uniforms.uSignalIntensity.value*=.9:v.material.uniforms.uSignalIntensity.value=0}for(let g=0;g<20;g++){const v=Math.max(0,m-g*.015),M=n.getPointAt(v);i.positions[g*3]=M.x,i.positions[g*3+1]=M.y,i.positions[g*3+2]=M.z}return i.points.geometry.attributes.position.needsUpdate=!0,i.material.opacity=.7*(1-h*.7),h>.85&&!l&&(l=!0,(f=r.onReachTarget)==null||f.call(r)),h>=1?((y=r.onComplete)==null||y.call(r),!1):!0},onReachTarget(){},dispose(){t.remove(i.points),i.points.geometry.dispose(),i.material.dispose();for(const c of e)c.material.uniforms.uSignalPos.value=-1,c.material.uniforms.uSignalIntensity.value=0}};return r},vn=1,me=(s,t)=>{const{branchChain:e,color:o}=s,n=Ue(e,"outward");if(!n)return{tick:()=>!1,dispose:()=>{}};tt(e,o);const i=Fe(o,20);t.add(i.points);let a=0,l=!1;const r={tick(c){var f,y;a+=c;const h=Q(a/vn,0,1),m=Re(h),{branchIndex:d,localT:p}=Ee(e,m);for(let g=0;g<e.length;g++){const v=e[g];g===d?(v.material.uniforms.uSignalPos.value=p,v.material.uniforms.uSignalIntensity.value=(1-h)*s.intensity,v.material.uniforms.uSignalColor.value.copy(o)):g<d?v.material.uniforms.uSignalIntensity.value*=.9:v.material.uniforms.uSignalIntensity.value=0}for(let g=0;g<20;g++){const v=Math.max(0,m-g*.015),M=n.getPointAt(v);i.positions[g*3]=M.x,i.positions[g*3+1]=M.y,i.positions[g*3+2]=M.z}return i.points.geometry.attributes.position.needsUpdate=!0,i.material.opacity=.7*(1-h*.7),h>.85&&!l&&(l=!0,(f=r.onReachTarget)==null||f.call(r)),h>=1?((y=r.onComplete)==null||y.call(r),!1):!0},onReachTarget(){},dispose(){t.remove(i.points),i.points.geometry.dispose(),i.material.dispose();for(const c of e)c.material.uniforms.uSignalPos.value=-1,c.material.uniforms.uSignalIntensity.value=0}};return r},yn=1.5,xn=(s,t,e,o)=>{const{branchChain:n,color:i,targetPetalIds:a}=s;if(tt(n,i),o.spike(1,.8),a.length>0){const c=Math.min(3,a.length),h=a.slice(0,c);e.detach(h,{x:0,y:5,z:0})}let l=0;return{tick(c){l+=c;const h=Q(l/yn,0,1),m=Math.sin(l*30)*(1-h)*.3;for(const d of n)d.pulse=Math.max(d.pulse,(1-h)*.8+m);return h<1},dispose(){}}},bn=.8,ge=(s,t)=>{const{branchChain:e,color:o,targetBlossom:n}=s;tt(e,o);let i=null,a=null;n&&(a=new ze({color:o.clone(),transparent:!0,opacity:.8,blending:kt,depthWrite:!1}),i=new Ot(a),i.position.copy(n.position),i.scale.setScalar(3),t.add(i));let l=0;return{tick(r){l+=r;const c=Q(l/bn,0,1);return i&&a&&(i.scale.setScalar(3+Math.sin(l*20)*1.5*(1-c)),a.opacity=.8*(1-c)),c<1},dispose(){i&&(t.remove(i),a==null||a.dispose())}}},wn=3,Sn=(s,t,e)=>{const{branchChain:o,color:n,targetPetalIds:i}=s;tt(o,n,!0),i.length>0&&e.setWilt(i,.5);let a=0;return{tick(l){a+=l;const r=Q(a/wn,0,1);for(const c of o)c.contamination=Math.max(c.contamination,(1-r)*.6);return r<1},dispose(){}}},Mn=2,Cn=s=>{const{branchChain:t,color:e}=s;tt(t,e);let o=0;return{tick(n){o+=n;const i=Q(o/Mn,0,1);for(const a of t)a.pulse=Math.max(a.pulse,(1-i)*.9);return i<1},dispose(){}}},Pn=2.5,Dn=(s,t,e)=>{const{branchChain:o,color:n,targetPetalIds:i}=s;if(tt(o,n),i.length>0){const l=new w((Math.random()-.5)*6,8+Math.random()*4,(Math.random()-.5)*6);e.detach(i,l)}let a=0;return{tick(l){a+=l;const r=Q(a/Pn,0,1);for(const c of o)c.pulse=Math.max(c.pulse,(1-r)*.7),c.contamination=Math.max(c.contamination,(1-r)*.4);return r<1},dispose(){}}},_n=10,Tn=(s,t)=>{const{color:e}=s,o=new Lt({color:e.clone(),emissive:e.clone(),emissiveIntensity:.6,roughness:.2,transparent:!0,opacity:.8}),n=new at(new Ye(1.5,2),o);t.add(n);const i=new Ke({color:e.clone(),transparent:!0,opacity:.25,blending:kt,depthWrite:!1}),a=new ct().setFromPoints([new w,new w]),l=new Je(a,i);t.add(l);let r=0;const c=14+Math.random()*8,h=.8+Math.random()*.6;let m=Math.random()*Math.PI*2;return{tick(d){r+=d;const p=Q(r/_n,0,1),f=1-p;m+=d*h;const y=Math.cos(m)*c,g=10+Math.sin(m*1.6)*4,v=Math.sin(m)*c;return n.position.set(y,g,v),n.scale.setScalar(.8+f*.8),o.opacity=.8*f,o.emissiveIntensity=.3+f*.5,a.setFromPoints([new w(0,0,0),new w(y,g,v)]),i.opacity=.2*f,p<1},dispose(){t.remove(n),t.remove(l),n.geometry.dispose(),o.dispose(),a.dispose(),i.dispose()}}},zn=2,An=s=>{const{branchChain:t,color:e}=s;tt(t,e);let o=0;return{tick(n){o+=n;const i=Q(o/zn,0,1);for(const a of t)a.pulse=Math.max(a.pulse,(1-i)*.7);return i<1},dispose(){}}},ve={Read:gn,Edit:me,Write:me,Bash:xn,Grep:ge,Glob:ge,WebFetch:Sn,UserPromptSubmit:Cn,PostToolUseFailure:Dn,SubagentStart:Tn,SessionStart:An};function ye(s,...t){const e=ve[s]??ve.Read;return e?e(...t):{tick:()=>!1,dispose:()=>{}}}const kn={Read:"#d4a574",Edit:"#7ec8e3",Write:"#7dd3fc",Bash:"#f59e0b",Grep:"#c084fc",Glob:"#a78bfa",WebFetch:"#fb7185",Notification:"#34d399",PermissionRequest:"#fbbf24",UserPromptSubmit:"#ffd4a8",SessionStart:"#e8c4a0",SubagentStart:"#d8b4fe",PostToolUseFailure:"#f87171"},In=new Set(["Read","Grep","Glob"]);function Rn(s){return kn[s.tool_name||s.hook_event_name||""]||"#e8c4a0"}function Un(s){return s.hook_event_name==="PreToolUse"||s.hook_event_name==="PostToolUseFailure"||s.hook_event_name==="UserPromptSubmit"||s.hook_event_name==="SessionStart"||s.hook_event_name==="SubagentStart"||s.hook_event_name==="Notification"||s.hook_event_name==="PermissionRequest"}class Fn{constructor(t,e){this.petalSystem=t,this.windField=e,this.activeEffects=[]}route(t,e){if(!Un(t))return;const o=t.tool_name||"",n=new H(Rn(t));if(t.hook_event_name==="UserPromptSubmit"||t.hook_event_name==="SessionStart"){e.boost=Math.min(1.8,e.boost+.45),this.routeFullTree(e,n,o||t.hook_event_name||"SessionStart");return}if(t.hook_event_name==="SubagentStart"){e.boost=Math.min(1.4,e.boost+.25),this.routeFullTree(e,n,"SubagentStart");return}if(t.hook_event_name==="Notification"||t.hook_event_name==="PermissionRequest"){e.boost=Math.min(1.2,e.boost+.15);return}e.boost=Math.min(1.4,e.boost+.25);const i=t.tool_input??{},a=Kt(e.rootPath,i.file_path)||Kt(e.rootPath,i.path);let l=Uo(e.layout,a);if(l||(l=te(e.layout,`${t.id}:fallback`,1)[0]||null),!l)return;const r=e.layout.nodes.get(l),c=(r==null?void 0:r.type)==="folder"?Io(e.layout,l,3):[l],h=In.has(o)?"inward":"outward";for(const m of c){const p=Jt(e.layout,m).map(u=>e.branches.get(u)).filter(u=>u!==void 0);if(p.length===0)continue;const f=e.layout.blossomAnchors.get(m)??null,y=e.petalInstanceIds,g={branchChain:p,targetBlossom:f,targetPetalIds:y,direction:h,color:n,intensity:1},v=t.hook_event_name==="PostToolUseFailure"?"PostToolUseFailure":o,M=ye(v,g,e.group,this.petalSystem,this.windField);this.activeEffects.push(M)}}routeFullTree(t,e,o){const n=te(t.layout,`${t.id}:${Date.now()}`,4);for(const i of n){const l=Jt(t.layout,i).map(m=>t.branches.get(m)).filter(m=>m!==void 0);if(l.length===0)continue;const r=t.layout.blossomAnchors.get(i)??null,h=ye(o,{branchChain:l,targetBlossom:r,targetPetalIds:[],direction:"outward",color:e,intensity:.8},t.group,this.petalSystem,this.windField);this.activeEffects.push(h)}}update(t,e){this.activeEffects=this.activeEffects.filter(o=>{const n=o.tick(t,e);return n||o.dispose(),n})}dispose(){for(const t of this.activeEffects)t.dispose();this.activeEffects=[]}}class En{constructor(t){}createPulse(t,e){}tick(t){}dispose(){}}class jn{constructor(){this.directionX=1,this.directionZ=0,this.strength=.2,this.gustStrength=0,this.gustTimer=8,this.turbulence=0,this.phase=0,this.baseAngle=0,this.gustRamp=0,this.gustHold=0,this.gustDecay=0,this.gustActive=!1}update(t){this.baseAngle+=t*(Math.PI*2/30),this.directionX=Math.cos(this.baseAngle),this.directionZ=Math.sin(this.baseAngle),this.strength=.2+.25*(.5+.5*Math.sin(this.phase*(Math.PI*2/8))),this.phase+=t,this.turbulence=.5+.5*Math.sin(this.phase*7.3+Math.cos(this.phase*3.1)*2),this.turbulence*=.15,this.gustActive||(this.gustTimer-=t,this.gustTimer<=0&&(this.gustActive=!0,this.gustRamp=.5,this.gustHold=1+Math.random(),this.gustDecay=1.5,this.gustStrength=0)),this.gustActive&&(this.gustRamp>0?(this.gustRamp-=t,this.gustStrength=Math.min(1,this.gustStrength+t*2)):this.gustHold>0?(this.gustHold-=t,this.gustStrength=.7+.3*Math.sin(this.phase*4)):this.gustDecay>0?(this.gustDecay-=t,this.gustStrength=Math.max(0,this.gustStrength-t*.67)):(this.gustActive=!1,this.gustStrength=0,this.gustTimer=5+Math.random()*10))}get effectiveStrength(){return Math.min(1,this.strength+this.gustStrength*.6+this.turbulence*.1)}spike(t,e){this.gustStrength=Math.max(this.gustStrength,t),this.turbulence=Math.max(this.turbulence,e),this.gustActive=!0,this.gustRamp=0,this.gustHold=0,this.gustDecay=2}}function Nn(s){let t=2166136261;for(let e=0;e<s.length;e++)t^=s.charCodeAt(e),t=Math.imul(t,16777619);return(t>>>0)/4294967296}function jt(s,t,e){return Math.min(e,Math.max(t,s))}const $n={Read:"#d4a574",Edit:"#7ec8e3",Write:"#7dd3fc",Bash:"#f59e0b",Grep:"#c084fc",Glob:"#a78bfa",WebFetch:"#fb7185"};function Bn(s){return $n[s.tool_name||""]||"#e8a060"}function Wn(s,t){const e=[...s];for(let o=e.length-1;o>0;o--){const n=Math.floor(Math.random()*(o+1));[e[o],e[n]]=[e[n],e[o]]}return e.slice(0,t)}function Gn(){const t=document.createElement("canvas");t.width=256,t.height=256;const e=t.getContext("2d");e.fillStyle="rgb(128,128,255)",e.fillRect(0,0,256,256);const o=e.getImageData(0,0,256,256),n=o.data;for(let r=0;r<256;r++)for(let c=0;c<256;c++){const h=(r*256+c)*4,m=Math.sin(c/256*Math.PI*24)*.5+Math.sin(c/256*Math.PI*7+.8)*.25;n[h]=Math.round(128+m*30),n[h+1]=128,n[h+2]=255,n[h+3]=255}const a=(r=>{let c=r;return()=>(c=c*1664525+1013904223>>>0,c/4294967295)})(42);for(let r=0;r<12;r++){const c=Math.floor(a()*256),h=Math.floor(a()*256),m=Math.floor(20+a()*30),d=Math.floor(3+a()*5);for(let p=-d;p<=d;p++)for(let f=-m;f<=m;f++){const y=(c+f+256)%256,g=(h+p+256)%256,v=1-Math.sqrt((f/m)**2+(p/d)**2);if(v<=0)continue;const M=(g*256+y)*4,u=Math.sin(v*Math.PI)*40;n[M+1]=Math.min(255,Math.round(n[M+1]+u))}}e.putImageData(o,0,0);const l=new it(t);return l.wrapS=zt,l.wrapT=zt,l.repeat.set(2,4),l.needsUpdate=!0,l}let Nt=null;function On(){return Nt||(Nt=Gn()),Nt}function Ln(s,t=Date.now()){const e=Math.max(0,t-s.lastEventTime),o=jt(1-e/9e4,0,1),n=jt(Math.log1p(s.eventCount)/Math.log(24),0,1);return jt(.12+o*.56+n*.3,.08,1)}function Vn(s){return`${s.projectId}:${s.stats.totalNodes}:${s.stats.maxDepthReached}:${s.stats.truncated?"t":"f"}`}class Hn{constructor(t){this.container=t,this.colonies=new Map,this.windField=new jn,this.petalSystem=new an,this.flowerSystem=new fn,this.elapsed=0;const e=t.clientWidth,o=t.clientHeight;this.renderer=new to({antialias:!0,alpha:!1}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(e,o),this.renderer.outputColorSpace=eo,this.renderer.setClearColor("#0e0a08"),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=oo,t.appendChild(this.renderer.domElement),this.scene=new no,this.scene.fog=new so("#0e0a08",.003),this.camera=new io(38,e/o,.1,1600),this.camera.position.set(40,80,200),this.controls=new ro(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.06,this.controls.autoRotate=!0,this.controls.autoRotateSpeed=.15,this.controls.minDistance=60,this.controls.maxDistance=500,this.controls.target.set(0,40,0),this.composer=new ao(this.renderer),this.composer.addPass(new lo(this.scene,this.camera)),this.composer.addPass(new co(new ho(e,o),.4,.3,.75));const n=new xo(this.scene,this.camera,{focus:160,aperture:.001,maxblur:.002});this.composer.addPass(n),this.composer.addPass(Do()),this.composer.addPass(To()),this.composer.addPass(wo()),this.filmGrainPass=Mo(),this.composer.addPass(this.filmGrainPass),this.scene.add(new uo("#fff5f0",1));const i=new po("#ffeef5","#0a0606",1.8);i.position.set(0,200,0),this.scene.add(i);const a=new fo("#fff0e0",.8);a.position.set(-80,160,100),a.castShadow=!0,a.shadow.mapSize.width=1024,a.shadow.mapSize.height=1024,a.shadow.camera.near=10,a.shadow.camera.far=400,a.shadow.camera.left=-120,a.shadow.camera.right=120,a.shadow.camera.top=120,a.shadow.camera.bottom=-40,a.shadow.bias=-.002,a.shadow.radius=4,this.scene.add(a);const l=new Rt("#ffd0e0",.9,500,1.5);l.position.set(0,180,-80),this.scene.add(l);const r=new Rt("#ffb78e",.35,300,2);r.position.set(-100,20,60),this.scene.add(r);const c=new Rt("#ff8ab0",.3,250,2);c.position.set(90,60,-40),this.scene.add(c),this.skyMaterial=new mt({uniforms:{uTime:{value:0},uHeat:{value:0}},vertexShader:`
        varying vec3 vWorldPos;
        void main() {
          vec4 world = modelMatrix * vec4(position, 1.0);
          vWorldPos = world.xyz;
          gl_Position = projectionMatrix * viewMatrix * world;
        }
      `,fragmentShader:`
        uniform float uTime;
        varying vec3 vWorldPos;
        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
        float noise(vec2 p) {
          vec2 i = floor(p); vec2 f = fract(p);
          float a = hash(i), b = hash(i+vec2(1,0)), c = hash(i+vec2(0,1)), d = hash(i+vec2(1,1));
          vec2 u = f*f*(3.0-2.0*f);
          return mix(a,b,u.x)+(c-a)*u.y*(1.0-u.x)+(d-b)*u.x*u.y;
        }
        float fbm(vec2 p) {
          float v=0.0, a=0.5; mat2 m=mat2(1.6,1.2,-1.2,1.6);
          for(int i=0;i<4;i++){v+=a*noise(p);p=m*p;a*=0.5;} return v;
        }
        void main() {
          vec3 dir = normalize(vWorldPos);
          float y = dir.y * 0.5 + 0.5;
          vec2 skyUv = vec2(atan(dir.z, dir.x)/6.2831+0.5, y);
          float clouds = fbm(skyUv * vec2(4.0, 2.5) + vec2(uTime*0.015, -uTime*0.02));
          float streaks = fbm(vec2(skyUv.x*10.0 - uTime*0.05, skyUv.y*2.0));
          vec3 top = vec3(0.04, 0.02, 0.07);
          vec3 mid = vec3(0.10, 0.06, 0.13);
          vec3 low = vec3(0.35, 0.18, 0.25);
          vec3 glow = vec3(0.45, 0.22, 0.30);
          vec3 color = mix(low, mid, smoothstep(0.0, 0.45, y));
          color = mix(color, top, smoothstep(0.45, 0.9, y));
          color += glow * clouds * 0.15 * smoothstep(0.5, 0.0, y);
          color += vec3(0.3, 0.15, 0.2) * streaks * 0.08;
          gl_FragColor = vec4(color, 1.0);
        }
      `,side:mo,depthWrite:!1}),this.sky=new at(new go(900,32,24),this.skyMaterial),this.sky.scale.set(1,.72,1),this.scene.add(this.sky),this.ground=new at(new vo(800,72),new Lt({color:"#0f0a08",emissive:"#0a0705",emissiveIntensity:.3,roughness:.95,metalness:0})),this.ground.rotation.x=-Math.PI/2,this.ground.position.y=-4,this.ground.receiveShadow=!0,this.scene.add(this.ground),this.createGroundPetals(),this.atmosphere=this.createAtmosphere(),this.scene.add(this.atmosphere);for(let h=0;h<3;h++){const m=-2+h*30,d=new yo({color:new H("#1a1015"),transparent:!0,opacity:.04-h*.01,depthWrite:!1,side:vt}),p=new at(new De(600,600),d);p.rotation.x=-Math.PI/2,p.position.y=m,this.scene.add(p)}this.scene.add(this.petalSystem.mesh),this.scene.add(this.petalSystem.glowGroup),this.signalSystem=new Fn(this.petalSystem,this.windField),this.sapPulseSystem=new En(this.scene),this.tree=new Jo(23399),this.barkMaterial=new mt({uniforms:{uTime:{value:0},uHeat:{value:.12},uPulse:{value:0},uContam:{value:0},uPulseColor:{value:new H("#e8a88a")},uFlowOffset:{value:0},uWindStrength:{value:0},uWindPhase:{value:0},uSignalPos:{value:-1},uSignalIntensity:{value:0},uSignalColor:{value:new H("#ffffff")},uDepth:{value:0},uNormalMap:{value:On()},uNormalScale:{value:.3}},vertexShader:ke,fragmentShader:Ie,transparent:!1,depthWrite:!0,side:vt,blending:Ce}),this.treeMesh=new at(this.tree.geometry,this.barkMaterial),this.treeMesh.castShadow=!0,this.scene.add(this.treeMesh),this.scene.add(this.flowerSystem.mesh),this.resizeHandler=()=>this.onResize(),window.addEventListener("resize",this.resizeHandler)}createAtmosphere(){const e=new Float32Array(600),o=new Float32Array(200);for(let c=0;c<200;c++){const h=20+Math.random()*200,m=Math.random()*Math.PI*2,d=-5+Math.random()*140;e[c*3]=Math.cos(m)*h,e[c*3+1]=d,e[c*3+2]=Math.sin(m)*h,o[c]=2+Math.random()*5}const n=new ct;n.setAttribute("position",new q(e,3)),n.setAttribute("size",new q(o,1));const i=document.createElement("canvas");i.width=64,i.height=64;const a=i.getContext("2d"),l=a.createRadialGradient(32,32,0,32,32,30);l.addColorStop(0,"rgba(255,255,255,1)"),l.addColorStop(.3,"rgba(255,255,255,0.5)"),l.addColorStop(1,"rgba(255,255,255,0)"),a.fillStyle=l,a.fillRect(0,0,64,64);const r=new it(i);return new Te(n,new _e({map:r,color:"#ffe8d0",transparent:!0,opacity:.25,size:4,sizeAttenuation:!0,blending:kt,depthWrite:!1}))}createGroundPetals(){const t=document.createElement("canvas");t.width=32,t.height=32;const e=t.getContext("2d"),o=e.createRadialGradient(16,16,0,16,16,14);o.addColorStop(0,"rgba(255,255,255,1)"),o.addColorStop(.5,"rgba(255,255,255,0.6)"),o.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=o,e.fillRect(0,0,32,32);const n=new it(t),i=80;for(let a=0;a<i;a++){const l=Math.random()*Math.PI*2,r=4+Math.random()*50,c=Math.cos(l)*r,h=Math.sin(l)*r,m=.3+Math.random()*.5,d=new ze({map:n,color:new H(1,.75+(1-m)*.25,.82+(1-m)*.18),transparent:!0,opacity:.2+Math.random()*.2,depthWrite:!1}),p=new Ot(d);p.position.set(c,-3.5+Math.random()*.3,h),p.scale.setScalar(.5+Math.random()*.8),this.scene.add(p)}}syncProjects(t){const e=t.filter(n=>{var i;return(i=n.tree)==null?void 0:i.tree}),o=new Set;for(const n of e){const i=n.tree,a=Vn(i);let l=this.colonies.get(n.project.id);(!l||l.signature!==a)&&(l&&this.disposeColony(l),l=this.createColony(n,a),this.colonies.set(n.project.id,l)),l.activity=n.activity,l.rootPath=i.rootPath,o.add(n.project.id)}for(const[n,i]of this.colonies)o.has(n)||(this.disposeColony(i),this.colonies.delete(n))}createColony(t,e){const o=t.tree,n=ko(o.tree,t.project.id),i=new $t,{branches:a,junctions:l}=Go(n,new $t);return{id:t.project.id,rootPath:o.rootPath,signature:e,group:i,activity:t.activity,layout:n,branches:a,junctions:l,petalInstanceIds:[],heat:.12,contamination:0,boost:0,idleOffset:Nn(t.project.id)*Math.PI*2}}applyEvent(t){const{flowers:e,newNodeIds:o}=this.tree.onEvent();for(const a of e)this.flowerSystem.addCluster(a.pos,a.dir,5+Math.floor(Math.random()*6));const n=new H(Bn(t)),i=o.length>5?Wn(o,5):o;if(i.length>0)for(const a of i){const l=this.tree.traceToRoot(a);if(l.length<2)continue;const r=l.map(c=>this.tree.getNode(c)).filter(c=>c!==void 0).map(c=>c.position.clone());r.length>=2&&this.sapPulseSystem.createPulse(r,n)}else{const a=this.tree.getRandomLeafPath();a&&a.length>=2&&this.sapPulseSystem.createPulse(a,n)}if(t.cwd){const a=this.colonies.get(t.cwd);a&&(a.boost=Math.min(1.4,a.boost+.25),this.signalSystem.route(t,a))}}getTreeStats(){return{nodeCount:this.tree.nodeCount,segmentCount:Math.max(0,this.tree.nodeCount-1),activeAttractors:this.tree.activeAttractorCount,totalEvents:this.tree.totalEvents,isCapped:this.tree.isCapped}}resetGrowth(){this.tree.reset(),this.flowerSystem.reset(),this.sapPulseSystem.dispose()}tick(t){this.elapsed+=t,this.controls.update(),this.windField.update(t),this.barkMaterial.uniforms.uTime.value=this.elapsed,this.barkMaterial.uniforms.uWindStrength.value=this.windField.effectiveStrength,this.barkMaterial.uniforms.uWindPhase.value=this.windField.phase,this.atmosphere.rotation.y+=t*.001,this.skyMaterial.uniforms.uTime.value=this.elapsed;const e=Date.now();for(const o of this.colonies.values()){const n=Ln(o.activity,e);o.heat=n,o.boost=Math.max(0,o.boost-t*.35),o.contamination=Math.max(0,o.contamination-t*.03),Oo(o.branches,o.junctions,this.elapsed+o.idleOffset,n,o.contamination,this.windField.effectiveStrength,this.windField.phase,t)}this.petalSystem.update(t,this.elapsed,this.windField),this.petalSystem.ambientDrift(t),this.sapPulseSystem.tick(t),this.signalSystem.update(t,this.elapsed),Co(this.filmGrainPass,this.elapsed),this.composer.render()}onResize(){const{clientWidth:t,clientHeight:e}=this.container;this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.renderer.setSize(t,e),this.composer.setSize(t,e)}disposeColony(t){Lo(t.branches,t.junctions)}destroy(){window.removeEventListener("resize",this.resizeHandler);for(const t of this.colonies.values())this.disposeColony(t);this.colonies.clear(),this.sapPulseSystem.dispose(),this.signalSystem.dispose(),this.petalSystem.dispose(),this.scene.remove(this.petalSystem.mesh),this.scene.remove(this.petalSystem.glowGroup),this.scene.remove(this.treeMesh),this.scene.remove(this.flowerSystem.mesh),this.flowerSystem.dispose(),this.tree.geometry.dispose(),this.barkMaterial.dispose(),this.atmosphere.geometry.dispose(),this.atmosphere.material.dispose(),this.sky.geometry.dispose(),this.skyMaterial.dispose(),this.ground.geometry.dispose(),this.ground.material.dispose(),this.controls.dispose(),this.composer.dispose(),this.renderer.dispose(),this.container.removeChild(this.renderer.domElement)}}function qn({projects:s,latestSignal:t,resetSignal:e}){const o=P.useRef(null),n=P.useRef(null),i=P.useRef(null),a=P.useRef(s);return a.current=s,P.useEffect(()=>{const l=o.current;if(!l)return;let r=performance.now();const c=new Hn(l);n.current=c,c.syncProjects(a.current);const h=()=>{const m=performance.now(),d=(m-r)/1e3;r=m,c.tick(Math.min(d,.05)),i.current=requestAnimationFrame(h)};return i.current=requestAnimationFrame(h),()=>{i.current!==null&&cancelAnimationFrame(i.current),c.destroy(),n.current=null}},[]),P.useEffect(()=>{var l;(l=n.current)==null||l.syncProjects(s)},[s]),P.useEffect(()=>{var l;t&&((l=n.current)==null||l.applyEvent(t.event))},[t==null?void 0:t.sequence]),P.useEffect(()=>{var l;e&&((l=n.current)==null||l.resetGrowth())},[e]),S.jsx("div",{ref:o,style:{width:"100vw",height:"100vh",background:"#0e0a08"}})}const xe={width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",color:"#e8d4c0",padding:"6px 8px",fontFamily:"IBM Plex Mono, monospace",fontSize:10},dt={background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",color:"#e8d4c0",padding:"5px 8px",cursor:"pointer",fontFamily:"IBM Plex Mono, monospace",fontSize:10};function Zn({isOpen:s,onToggle:t,projects:e,selectedProjectId:o,replayStatus:n,onSelectProject:i,onReplayProject:a,onStopReplay:l,onInjectEvent:r}){const[c,h]=P.useState("client/src/sakura/SakuraApp.ts"),[m,d]=P.useState(null),p=P.useMemo(()=>e.find(u=>u.project.id===o)??e[0]??null,[e,o]),f=P.useMemo(()=>{if(!p)return c;const u=c.replace(/^\/+/,"");return u?`${p.project.root}/${u}`:p.project.root},[c,p]);async function y(u,C){d(u);try{await r(C)}finally{d(null)}}function g(u){if(!p)return null;const C={session_id:"sakura-debug",cwd:p.project.root};return u==="Read"?{...C,hook_event_name:"PreToolUse",tool_name:"Read",tool_input:{file_path:f}}:u==="Edit"?{...C,hook_event_name:"PreToolUse",tool_name:"Edit",tool_input:{file_path:f}}:u==="Bash"?{...C,hook_event_name:"PreToolUse",tool_name:"Bash",tool_input:{command:"npm run build"}}:u==="Grep"?{...C,hook_event_name:"PreToolUse",tool_name:"Grep",tool_input:{pattern:"*.tsx",path:p.project.root}}:u==="Fetch"?{...C,hook_event_name:"PreToolUse",tool_name:"WebFetch",tool_input:{url:"https://example.com"}}:u==="Prompt"?{...C,hook_event_name:"UserPromptSubmit",prompt:"test prompt"}:u==="Error"?{...C,hook_event_name:"PostToolUseFailure",tool_name:"Read",tool_input:{file_path:f},error:"test error"}:u==="Agent"?{...C,hook_event_name:"SubagentStart",agent_id:`agent-${Date.now().toString(36)}`,agent_type:"general"}:u==="Session"?{...C,hook_event_name:"SessionStart"}:null}const v=[{label:"Read",color:"#d4a574"},{label:"Edit",color:"#7ec8e3"},{label:"Bash",color:"#f59e0b"},{label:"Grep",color:"#c084fc"},{label:"Fetch",color:"#fb7185"}],M=[{label:"Prompt",color:"#ffd4a8"},{label:"Error",color:"#f87171"},{label:"Agent",color:"#d8b4fe"},{label:"Session",color:"#e8c4a0"}];return S.jsxs(S.Fragment,{children:[S.jsx("button",{onClick:t,style:{position:"absolute",left:18,bottom:18,zIndex:24,padding:"7px 10px",border:"1px solid rgba(196,149,106,0.28)",background:"rgba(14,10,8,0.7)",color:"#c4956a",fontFamily:"IBM Plex Mono, monospace",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",backdropFilter:"blur(16px)"},children:s?"close":"sakura"}),s&&S.jsxs("div",{style:{position:"absolute",left:18,bottom:52,zIndex:25,width:320,maxHeight:"calc(100vh - 80px)",overflowY:"auto",padding:12,border:"1px solid rgba(255,255,255,0.08)",background:"linear-gradient(180deg, rgba(14,10,8,0.94), rgba(10,7,5,0.98))",boxShadow:"0 20px 60px rgba(0,0,0,0.5)",backdropFilter:"blur(22px)",color:"#e8d4c0",fontFamily:"IBM Plex Mono, monospace"},children:[S.jsxs("div",{style:{marginBottom:10},children:[S.jsx("select",{value:(p==null?void 0:p.project.id)??"",onChange:u=>i(u.target.value),style:{...xe,marginBottom:6},children:e.map(u=>S.jsx("option",{value:u.project.id,children:u.project.label},u.project.id))}),S.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4},children:[S.jsx("button",{onClick:async()=>{if(p){d("buf");try{await a(p.project.id,!1)}finally{d(null)}}},style:dt,disabled:m!==null,children:"replay buf"}),S.jsx("button",{onClick:async()=>{if(p){d("saved");try{await a(p.project.id,!0)}finally{d(null)}}},style:dt,disabled:m!==null,children:"replay saved"}),S.jsx("button",{onClick:l,style:dt,children:"stop"})]}),n!=="idle"&&S.jsx("div",{style:{fontSize:9,color:"#8a7a6a",marginTop:4},children:n})]}),S.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:4,marginBottom:8},children:v.map(u=>S.jsx("button",{onClick:()=>{const C=g(u.label);C&&y(u.label,C)},style:{...dt,color:u.color,borderColor:`${u.color}33`,flex:"1 0 auto"},children:u.label},u.label))}),S.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:4,marginBottom:8},children:M.map(u=>S.jsx("button",{onClick:()=>{const C=g(u.label);C&&y(u.label,C)},style:{...dt,color:u.color,borderColor:`${u.color}33`,flex:"1 0 auto"},children:u.label},u.label))}),S.jsx("input",{value:c,onChange:u=>h(u.target.value),placeholder:"relative path",style:{...xe,marginBottom:4}}),S.jsx("div",{style:{fontSize:9,color:"#6a5a4a",wordBreak:"break-all"},children:f})]})]})}const je={eventCount:0,sessionCount:0,lastEventTime:0,lastTool:null};function be(s){const t=s.split("/").filter(Boolean);return t[t.length-1]||s}function Dt(s,t){const e=new Map(s.map(o=>[o.id,o]));for(const o of t){const n=e.get(o.id);e.set(o.id,n?{...n,...o}:o)}return[...e.values()].sort((o,n)=>n.lastEventTime-o.lastEventTime||o.label.localeCompare(n.label))}function Xn(s){return s.tool_use_id?`${s.session_id}:${s.hook_event_name}:${s.tool_use_id}`:s.hook_event_name==="UserPromptSubmit"&&s.prompt?`${s.session_id}:prompt:${s.prompt.slice(0,80)}`:s.hook_event_name==="SessionStart"?`${s.session_id}:start`:s.id}function we(s){return s.hook_event_name==="PreToolUse"||s.hook_event_name==="PostToolUseFailure"||s.hook_event_name==="UserPromptSubmit"||s.hook_event_name==="SessionStart"||s.hook_event_name==="SubagentStart"||s.hook_event_name==="Notification"||s.hook_event_name==="PermissionRequest"}function Se(s,t){if(!t.cwd)return s;const e=s[t.cwd]??je;return{...s,[t.cwd]:{eventCount:e.eventCount+1,sessionCount:t.session_id?Math.max(e.sessionCount,1):e.sessionCount,lastEventTime:Math.max(e.lastEventTime,t.timestamp||Date.now()),lastTool:t.tool_name||t.hook_event_name||e.lastTool}}}function Yn(){const[s,t]=P.useState([]),[e,o]=P.useState({}),[n,i]=P.useState({}),[a,l]=P.useState(null),[r,c]=P.useState("connecting"),[h,m]=P.useState(!0),[d,p]=P.useState(0),[f,y]=P.useState("waiting"),g=P.useRef(new Set),v=P.useRef(0),M=P.useRef(new Map),[u,C]=P.useState(null),[b,D]=P.useState(!1),[F,E]=P.useState(!1),[j,I]=P.useState("idle"),[O,k]=P.useState(0),N=P.useRef(null);async function et(x,A=!1){if(!(!A&&(e[x]||g.current.has(x)))){g.current.add(x);try{const B=await fetch(`/api/project-tree?project=${encodeURIComponent(x)}`);if(!B.ok)return;const V=await B.json();o(_=>({..._,[V.projectId]:V}))}finally{g.current.delete(x)}}}P.useEffect(()=>{let x=!1;async function A(){try{const[V,_]=await Promise.all([fetch("/api/projects"),fetch("/api/history")]),T=await V.json(),R=await _.json();if(x)return;t(Dt([],T.projects??[])),p(R.length),i(R.reduce((z,U)=>Se(z,U),{}))}catch{}finally{x||m(!1)}}A();const B=setInterval(async()=>{try{const _=await(await fetch("/api/projects")).json();x||t(T=>Dt(T,_.projects??[]))}catch{}},15e3);return()=>{x=!0,clearInterval(B)}},[]),P.useEffect(()=>{for(const x of s)e[x.id]||g.current.has(x.id)||et(x.id)},[s,e]),P.useEffect(()=>{const x=M.current,A=new EventSource("/events");return A.onopen=()=>c("connected"),A.onerror=()=>c("disconnected"),A.onmessage=B=>{try{const V=JSON.parse(B.data);if(V.type!=="event")return;const _=V.data;if(_.hook_event_name==="Diagnostic")return;const T=Xn(_),R=Date.now();if(x.has(T)&&R-x.get(T)<5e3)return;if(x.set(T,R),x.size>500)for(const[z,U]of x)R-U>5e3&&x.delete(z);if(_.cwd){const z=_.cwd;t(U=>{const G=U.find(rt=>rt.id===z);return Dt(U,[{id:z,root:z,label:be(z),eventCount:((G==null?void 0:G.eventCount)??0)+1,sessionCount:Math.max((G==null?void 0:G.sessionCount)??0,1),lastEventTime:_.timestamp||Date.now()}])}),i(U=>Se(U,_))}y(_.tool_name||_.hook_event_name||"event"),we(_)&&(v.current+=1,l({sequence:v.current,event:_}))}catch{}},()=>A.close()},[]);function W(){N.current!==null&&(clearTimeout(N.current),N.current=null),I("idle")}async function $(x,A){W(),k(z=>z+1),I("loading...");const _=(await(await fetch(`/api/history?project=${encodeURIComponent(x)}${A?"&persisted=1":""}`)).json()).filter(we).slice(-220);if(!_.length)return I("no events"),0;let T=0;const R=()=>{const z=_[T];v.current+=1,l({sequence:v.current,event:z}),T++,I(`${T}/${_.length}`),T<_.length?N.current=window.setTimeout(R,z.tool_name==="Bash"?160:90):(N.current=null,I(`done (${_.length})`))};return R(),_.length}async function L(x){const A={id:`hook-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`,session_id:"sakura-debug",timestamp:Date.now(),hook_event_name:"Notification",tool_name:null,tool_input:null,tool_response:null,agent_id:null,agent_type:null,cwd:null,error:null,tool_use_id:null,prompt:null,model:null,source:"hook",reason:null,permission_mode:null,is_interrupt:null,trigger:null,compact_summary:null,last_assistant_message:null,notification_type:null,title:null,agent_transcript_path:null,memory_type:null,...x};await fetch("/hook",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(A)})}P.useEffect(()=>{var x;!u&&((x=s[0])!=null&&x.id)&&C(s[0].id)},[s,u]),P.useEffect(()=>()=>W(),[]);const Z=Dt(s,Object.entries(n).filter(([x])=>!s.some(A=>A.id===x)).map(([x,A])=>({id:x,root:x,label:be(x),eventCount:A.eventCount,sessionCount:A.sessionCount,lastEventTime:A.lastEventTime}))).map(x=>({project:x,tree:e[x.id]??null,activity:n[x.id]??je})),ot=Z.filter(x=>x.tree).length;return S.jsxs("div",{style:{position:"relative",width:"100vw",height:"100vh",overflow:"hidden",background:"#0e0a08"},children:[S.jsx(qn,{projects:Z,latestSignal:a,resetSignal:O}),S.jsx("a",{href:"#/three",style:{position:"absolute",top:18,left:18,zIndex:20,padding:"10px 14px",border:"1px solid rgba(232,196,160,0.18)",background:"rgba(14,10,8,0.52)",color:"#e8c4a0",textDecoration:"none",fontFamily:"IBM Plex Mono, monospace",fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",backdropFilter:"blur(16px)"},children:"back to three"}),S.jsx("button",{onClick:()=>E(x=>!x),style:{position:"absolute",top:18,right:18,zIndex:21,padding:"8px 12px",border:"1px solid rgba(196,149,106,0.28)",background:"rgba(14,10,8,0.7)",color:"#c4956a",fontFamily:"IBM Plex Mono, monospace",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",backdropFilter:"blur(16px)"},children:F?"hide":"info"}),F&&S.jsxs("div",{style:{position:"absolute",top:52,right:18,zIndex:20,width:300,padding:"14px 16px",border:"1px solid rgba(255,255,255,0.08)",background:"linear-gradient(180deg, rgba(14,10,8,0.76), rgba(10,7,5,0.9))",backdropFilter:"blur(18px)",boxShadow:"0 18px 60px rgba(0,0,0,0.35)",color:"#e8d4c0",fontFamily:"IBM Plex Mono, monospace"},children:[S.jsx("div",{style:{fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",color:"#c4956a",marginBottom:6},children:"sakura"}),S.jsx("div",{style:{fontFamily:"Oxanium, sans-serif",fontSize:24,lineHeight:1,marginBottom:10},children:"live project tree"}),S.jsx("div",{style:{color:"#9a8070",fontSize:11,lineHeight:1.6,marginBottom:12},children:"Filesystem branches grow as a living sakura tree. Tool events flow as sap through branch ancestry."}),S.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:8,marginBottom:12},children:[S.jsxs("div",{children:[S.jsx("div",{style:{fontSize:10,color:"#786050",marginBottom:3},children:"link"}),S.jsx("div",{style:{fontSize:12},children:r})]}),S.jsxs("div",{children:[S.jsx("div",{style:{fontSize:10,color:"#786050",marginBottom:3},children:"trees"}),S.jsxs("div",{style:{fontSize:12},children:[ot,"/",Z.length]})]}),S.jsxs("div",{children:[S.jsx("div",{style:{fontSize:10,color:"#786050",marginBottom:3},children:"history"}),S.jsx("div",{style:{fontSize:12},children:d})]})]}),S.jsx("div",{style:{fontSize:10,color:"#786050",marginBottom:4},children:"last pulse"}),S.jsx("div",{style:{fontSize:12,marginBottom:12},children:f}),S.jsx("div",{style:{fontSize:10,color:"#786050",marginBottom:6},children:"active roots"}),S.jsx("div",{style:{display:"grid",gap:6,maxHeight:200,overflowY:"auto"},children:Z.slice(0,6).map(({project:x,tree:A,activity:B})=>S.jsxs("div",{style:{padding:"8px 10px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.05)"},children:[S.jsxs("div",{style:{display:"flex",justifyContent:"space-between",gap:8,marginBottom:3},children:[S.jsx("span",{style:{fontSize:11},children:x.label}),S.jsx("span",{style:{color:"#c4956a",fontSize:10},children:A?`${A.stats.totalNodes} nodes`:"loading"})]}),S.jsx("div",{style:{color:"#6a5a4a",fontSize:10,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:x.root}),S.jsxs("div",{style:{display:"flex",gap:8,marginTop:4,fontSize:10,color:"#8a7a6a"},children:[S.jsxs("span",{children:[B.eventCount," ev"]}),S.jsxs("span",{children:[x.sessionCount," ses"]}),S.jsx("span",{children:B.lastTool||"idle"})]})]},x.id))})]}),S.jsx(Zn,{isOpen:b,onToggle:()=>D(x=>!x),projects:Z,selectedProjectId:u,replayStatus:j,onSelectProject:C,onReplayProject:$,onStopReplay:W,onInjectEvent:L})]})}export{Yn as SakuraPage};
