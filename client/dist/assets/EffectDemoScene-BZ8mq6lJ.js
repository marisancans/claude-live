import{C as K,G as L,W as X,S as Y,P as J,O as Q,B as Z,E as ee,R as te,U as oe,V as ae,L as W,a as u,b as H,M as F,A as M,c as S,d as B,e as re,D as ne,T as ie,f as U,g as N,h as E,i as z,j as se,s as le,k as R,r as _,l as g}from"./index-cWLk4rCz.js";const j=new Map;let $=U;function ce(r,t){j.set(r,t),$=(o,i,s)=>{const d=j.get(o);return d?d(i,s):U(o,i,s)}}class ue{constructor(t){this.clock=new K,this.nodeGroup=new L,this.currentNode=null,this.respawnTimer=0,this.currentVariation=null,this.axisGroup=new L,this._onResize=()=>{const i=this.renderer.domElement.parentElement;if(!i)return;const s=i.clientWidth,d=i.clientHeight;this.camera.aspect=s/d,this.camera.updateProjectionMatrix(),this.renderer.setSize(s,d),this.composer.setSize(s,d)},this.renderer=new X({antialias:!0}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(t.clientWidth,t.clientHeight),this.renderer.setClearColor(197384),t.appendChild(this.renderer.domElement),this.scene=new Y,this.camera=new J(55,t.clientWidth/t.clientHeight,1,2e3),this.camera.position.set(0,60,200),this.controls=new Q(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.06,this.controls.autoRotate=!1,this.controls.target.set(-40,5,-15),this.controls.minDistance=50,this.controls.maxDistance=600,this.background=new Z,this.scene.add(this.background.group),this.scene.add(this.nodeGroup),this.scene.add(this.axisGroup),this._buildAxis(),this._buildCoreGlow(),this.composer=new ee(this.renderer),this.composer.addPass(new te(this.scene,this.camera));const o=new oe(new ae(t.clientWidth,t.clientHeight),.7,.4,.75);this.composer.addPass(o),window.addEventListener("resize",this._onResize),this._onResize()}_buildAxis(){const t=new W({color:2236996,transparent:!0,opacity:.4}),o=(i,s)=>{const d=new N().setFromPoints([i,s]);return new E(d,t)};this.axisGroup.add(o(new u(-120,0,0),new u(20,0,0))),this.axisGroup.add(o(new u(0,-20,0),new u(0,30,0))),this.axisGroup.add(o(new u(0,0,-60),new u(0,0,20)))}_buildCoreGlow(){const t=new H(3,16,16),o=new F({color:new S("#22ff88"),transparent:!0,opacity:.15,blending:M});this.scene.add(new B(t,o));const i=new re(5,6,32),s=new F({color:new S("#4ade80"),transparent:!0,opacity:.2,blending:M,side:ne});this.scene.add(new B(i,s));const d=new u(-80,10,-30),v=new H(2,12,12),h=new F({color:new S("#4ade80"),transparent:!0,opacity:.3,blending:M}),m=new B(v,h);m.position.copy(d),this.scene.add(m)}setVariation(t){if(this.currentVariation=t,t.buildCustomEffect){const o=t.spawnParams()._tool??"";ce(o,t.buildCustomEffect)}this._clearNode(),this._spawnNode()}_clearNode(){this.currentNode&&(this.nodeGroup.remove(this.currentNode.group),this.currentNode.dispose(),this.currentNode=null)}_spawnNode(){if(!this.currentVariation)return;const t=this.currentVariation.spawnParams(this.camera.position),o=new ie(t,$);this.nodeGroup.add(o.group),this.currentNode=o,this.respawnTimer=0}tick(){const t=Math.min(this.clock.getDelta(),.05);this.controls.update(),this.background.tick(t),this.currentNode?(this.currentNode.tick(t),this.currentNode.done&&(this._clearNode(),this.respawnTimer=0)):(this.respawnTimer+=t,this.respawnTimer>1&&this.currentVariation&&this._spawnNode()),this.composer.render()}destroy(){window.removeEventListener("resize",this._onResize),this.renderer.dispose(),this._clearNode(),j.clear()}}const q=new u(0,0,0);function x(r,t){return Math.random()*(t-r)+r}function de(){return{origin:new u(-120,15,-60),target:q.clone().add(new u(x(-2,2),x(-2,2),x(-2,2))),color:new S("#b0c8f0"),colorEnd:new S("#ffffff"),travelTime:3,trailLength:0,trailBrightness:0,trailFadeTime:4,headSize:0,pathConfig:{type:"linear",easing:"easeInCubic"},_tool:"prompt:custom"}}function pe(){const r=Math.random()*Math.PI*2,t=Math.acos(x(-1,1)),o=x(250,400);return new u(Math.sin(t)*Math.cos(r)*o,Math.sin(t)*Math.sin(r)*o,Math.cos(t)*o)}function O(r){const t=de();t._tool=r,t.origin=pe(),t.travelTime=x(4,5.5),t.trailFadeTime=1.8;const o=t.origin.clone().add(q).multiplyScalar(.5);return t.pathConfig={type:"quadratic",easing:"easeInOut",c1:new u(o.x+x(-40,40),o.y+x(20,60),o.z+x(-30,30))},t}function he(r,t){return{f1:1.2+Math.random()*1.5,f2:3.5+Math.random()*3,ph1:Math.random()*Math.PI*2,ph2:Math.random()*Math.PI*2,amp:4+Math.random()*6,perp:new u(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize(),scatter:new u((Math.random()-.5)*400,(Math.random()-.5)*400,(Math.random()-.5)*400),windowStart:-(r/t)*3.5-Math.random()*.2,rollSpeed:.8+Math.random()*.6}}function fe(r,t,o,i,s){const d=se(t.pathConfig.easing,o),v=le(t.pathConfig,t.origin,t.target,d),h=Math.max(0,1-o/.5),m=Math.min(1,o/.5),l=1-Math.pow(o,8),e=(Math.sin(o*r.f1*Math.PI*2+r.ph1+i*s)*r.amp+Math.sin(o*r.f2*Math.PI*2+r.ph2+i*s*1.4)*r.amp*.3)*m*l;return new u(v.x+r.scatter.x*h+r.perp.x*e,v.y+r.scatter.y*h+r.perp.y*e,v.z+r.scatter.z*h+r.perp.z*e)}function P(r,t,o,i,s){const d=Array.from({length:i},(h,m)=>{const l=he(m,i),e=new Float32Array(o*3),n=new N;n.setAttribute("position",new z(e,3));const c=new Float32Array(o);for(let T=0;T<o;T++)c[T]=T/(o-1);n.setAttribute("aT",new z(c,1));const{mat:a,setOpacity:p,setTime:w}=s(m,n);return r.add(new E(n,a)),{...l,posArr:e,geo:n,mat:a,window:l.windowStart,setOpacity:p,setTime:w}}),v={entries:d.map(h=>({obj:new E(h.geo,h.mat),mat:h.mat,meta:{}})),suppressDefaultTrail:!0,trailTick(h,m,l){var c;const e=2.5+l*.1;let n=!0;for(const a of d){const p=a.window>=1?1/(1.5*a.rollSpeed):(1-a.windowStart)/t.travelTime;a.window=Math.min(2,a.window+m*p);const w=a.window;if(w<=0){a.geo.setDrawRange(0,0),n=!1;continue}if(w>=2){a.setOpacity(0),a.geo.setDrawRange(0,0);continue}n=!1;const T=Math.round(Math.min(1,w)*(o-1)),y=Math.round(Math.max(0,w-1)*(o-1)),A=T-y;if(A<1){a.geo.setDrawRange(0,0);continue}for(let b=y;b<=T;b++){const C=fe(a,t,b/(o-1),l,e);a.posArr[b*3]=C.x,a.posArr[b*3+1]=C.y,a.posArr[b*3+2]=C.z}a.geo.attributes.position.needsUpdate=!0,a.geo.setDrawRange(y,A),a.setOpacity(.7),(c=a.setTime)==null||c.call(a,l)}n&&(v.shouldMarkDone=!0)},tick(){},onLand(){},applyFade(h){},shouldMarkDone:!1};return v}function ge(r,t){return P(r,t,120,8,o=>{const i=new W({color:new S().setHSL(.55+o/8*.15,.9,.6+o%2*.2),transparent:!0,opacity:0,blending:M,depthWrite:!1});return{mat:i,setOpacity:s=>{i.opacity=s}}})}const me=`
  attribute float aT;
  varying float vT;
  void main() { vT = aT; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`,ve=`
  uniform float uTime;
  uniform float uOpacity;
  uniform float uHueBase;
  varying float vT;
  vec3 hsl2rgb(float h, float s, float l) {
    h = mod(h, 1.0);
    vec3 rgb = clamp(abs(mod(h*6.0+vec3(0,4,2),6.0)-3.0)-1.0, 0.0, 1.0);
    return l + s*(rgb-0.5)*(1.0-abs(2.0*l-1.0));
  }
  void main() {
    // Hue drifts along length + time
    float hue   = mod(uHueBase + vT * 0.3 + uTime * 0.12, 1.0);
    float core  = pow(1.0 - vT, 0.3);          // bright at head (t=1 is target)
    float bloom = pow(vT, 0.5) * 0.6;
    vec3  col   = hsl2rgb(hue, 1.0, 0.55 + bloom * 0.3);
    // White-hot center
    col = mix(col, vec3(1.0), core * 0.4);
    float alpha = (bloom + core * 0.5) * uOpacity;
    gl_FragColor = vec4(col * (bloom + core * 0.5 + 0.05), alpha);
  }
`;function we(r,t){return P(r,t,120,8,o=>{const i=new R({vertexShader:me,fragmentShader:ve,uniforms:{uTime:{value:0},uOpacity:{value:0},uHueBase:{value:o/8}},blending:M,transparent:!0,depthWrite:!1});return{mat:i,setOpacity:s=>{i.uniforms.uOpacity.value=s},setTime:s=>{i.uniforms.uTime.value=s}}})}const be=`
  attribute float aT;
  varying float vT;
  void main() { vT = aT; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`,Te=`
  uniform float uTime;
  uniform float uOpacity;
  uniform float uPhase;
  varying float vT;
  float hash(float n) { return fract(sin(n)*43758.5453); }
  void main() {
    // High-freq flicker noise
    float noise  = hash(floor(vT * 80.0 + uTime * 30.0));
    float flicker = 0.7 + 0.3 * noise;
    // Traveling pulse toward core (vT=1)
    float pulsePos = mod(uPhase + uTime * 0.6, 1.0);
    float pulse    = exp(-pow((vT - pulsePos) / 0.05, 2.0)) * 2.5;
    // Base glow — brighter near core
    float base = pow(vT, 0.4) * 0.5;
    float b    = (base + pulse) * flicker;
    // Color: deep blue → cyan → white at pulse peak
    vec3 blue  = vec3(0.05, 0.2, 1.0);
    vec3 cyan  = vec3(0.2,  0.9, 1.0);
    vec3 white = vec3(1.0,  1.0, 1.0);
    vec3 col   = mix(blue, cyan, vT);
    col = mix(col, white, clamp(pulse / 2.5, 0.0, 1.0));
    gl_FragColor = vec4(col * b, b * uOpacity);
  }
`;function ye(r,t){return P(r,t,120,8,o=>{const i=new R({vertexShader:be,fragmentShader:Te,uniforms:{uTime:{value:0},uOpacity:{value:0},uPhase:{value:o/8}},blending:M,transparent:!0,depthWrite:!1});return{mat:i,setOpacity:s=>{i.uniforms.uOpacity.value=s},setTime:s=>{i.uniforms.uTime.value=s}}})}const xe=`
  attribute float aT;
  varying float vT;
  void main() { vT = aT; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`,Me=`
  uniform float uTime;
  uniform float uOpacity;
  uniform float uOffset;
  varying float vT;
  vec3 hsl2rgb(float h, float s, float l) {
    h = mod(h, 1.0);
    vec3 rgb = clamp(abs(mod(h*6.0+vec3(0,4,2),6.0)-3.0)-1.0, 0.0, 1.0);
    return l + s*(rgb-0.5)*(1.0-abs(2.0*l-1.0));
  }
  void main() {
    // Slow drifting color bands along the strand
    float hue    = mod(uOffset + vT * 0.5 + uTime * 0.04, 1.0);
    float bright = 0.5 + 0.5 * sin(vT * 3.0 + uTime * 0.8 + uOffset * 6.28);
    // Soft curtain falloff — bright in the middle of length
    float curtain = sin(vT * 3.14159) * 0.8 + 0.2;
    // Very soft, high luminance pastels
    vec3 col   = hsl2rgb(hue, 0.6, 0.6 + bright * 0.25);
    float alpha = curtain * bright * 0.5 * uOpacity;
    gl_FragColor = vec4(col * curtain * bright, alpha);
  }
`;function Se(r,t){return P(r,t,120,10,o=>{const i=new R({vertexShader:xe,fragmentShader:Me,uniforms:{uTime:{value:0},uOpacity:{value:0},uOffset:{value:o/10}},blending:M,transparent:!0,depthWrite:!1});return{mat:i,setOpacity:s=>{i.uniforms.uOpacity.value=s},setTime:s=>{i.uniforms.uTime.value=s}}})}const Ae=`
  attribute float aT;
  varying float vT;
  void main() { vT = aT; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`,Ce=`
  uniform float uTime;
  uniform float uOpacity;
  uniform float uHue;
  varying float vT;
  vec3 hsl2rgb(float h, float s, float l) {
    h = mod(h, 1.0);
    vec3 rgb = clamp(abs(mod(h*6.0+vec3(0,4,2),6.0)-3.0)-1.0, 0.0, 1.0);
    return l + s*(rgb-0.5)*(1.0-abs(2.0*l-1.0));
  }
  void main() {
    // Traveling energy packets
    float packet1 = exp(-pow(mod(vT - uTime * 0.5, 1.0) / 0.08, 2.0));
    float packet2 = exp(-pow(mod(vT - uTime * 0.5 + 0.4, 1.0) / 0.08, 2.0));
    float energy  = packet1 + packet2 * 0.6;
    // White-hot spine at high energy, colored bleed otherwise
    vec3 fiberCol = hsl2rgb(uHue, 1.0, 0.5);
    vec3 col      = mix(fiberCol, vec3(1.0), clamp(energy, 0.0, 1.0));
    // Base thread glow — constant soft light
    float base  = 0.2 + 0.1 * sin(vT * 20.0 - uTime * 3.0);
    float alpha = (base + energy * 0.8) * uOpacity;
    gl_FragColor = vec4(col * (base + energy * 0.8), alpha);
  }
`;function _e(r,t){return P(r,t,120,8,o=>{const i=new R({vertexShader:Ae,fragmentShader:Ce,uniforms:{uTime:{value:0},uOpacity:{value:0},uHue:{value:.55+o/8*.35}},blending:M,transparent:!0,depthWrite:!1});return{mat:i,setOpacity:s=>{i.uniforms.uOpacity.value=s},setTime:s=>{i.uniforms.uTime.value=s}}})}const ke=[{name:"Writhing",description:"Baseline — colored strands scatter, converge, weave into core",spawnParams:()=>O("prompt:writhing"),buildCustomEffect:ge},{name:"Neon Iridescent",description:"Hue shifts along length and over time — white-hot core bloom",spawnParams:()=>O("prompt:neon"),buildCustomEffect:we},{name:"Plasma",description:"Electric blue-white with noisy flicker and traveling pulses",spawnParams:()=>O("prompt:plasma"),buildCustomEffect:ye},{name:"Aurora",description:"Soft pastel curtains drifting with slow color bands",spawnParams:()=>O("prompt:aurora"),buildCustomEffect:Se},{name:"Fiber Light",description:"White-hot spine with colored energy packets traveling to core",spawnParams:()=>O("prompt:fiber"),buildCustomEffect:_e}];function f(r,t){return Math.random()*(t-r)+r}const Oe=new u(0,0,0);function Re(){const r=Math.random()*Math.PI*2,t=f(60,110),o=new u(Math.cos(r)*t,f(-8,15),Math.sin(r)*t*.5),i=o.clone().multiplyScalar(.5);return{origin:Oe.clone(),target:o,color:new S("#a78bfa"),colorEnd:new S("#e9d5ff"),travelTime:f(2.5,3.5),trailLength:0,trailBrightness:0,trailFadeTime:30,headSize:0,pathConfig:{type:"quadratic",easing:"easeInOut",c1:new u(i.x+f(-25,25),i.y+f(10,35),i.z+f(-20,20))},_tool:"Glob:demo"}}const V=80,I=10,Pe=.35,Ee=`
  attribute float aT;
  varying float vT;
  void main() {
    vT = aT;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,ze=`
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3  uBaseColor;
  uniform vec3  uTipColor;
  uniform float uPhase;
  varying float vT;

  void main() {
    vec3 col = mix(uBaseColor, uTipColor, vT);

    // energy flow racing toward tip
    float flow = sin((vT * 8.0 - uTime * 2.0 + uPhase) * 3.14159);
    flow = pow(max(0.0, flow), 3.0) * 0.3;
    col += uTipColor * flow;

    // hot head: last 10% glows bright
    float head = smoothstep(0.9, 1.0, vT);
    col = mix(col, uTipColor * 1.5, head * 0.7);

    float bright = 0.4 + vT * 0.3 + flow * 0.3 + head * 0.8;
    float alpha  = uOpacity * (0.3 + vT * 0.3 + flow * 0.15 + head * 0.4);

    gl_FragColor = vec4(min(col * bright, 1.0), min(alpha, 1.0));
  }
`;function De(r,t){const o=[];function i(e,n){const c=f(0,Math.PI*2),a=f(-.6,.6),p=new u(Math.cos(c)*Math.cos(a),Math.sin(a),Math.sin(c)*Math.cos(a)).normalize(),w=f(14,22),T=p.clone().multiplyScalar(w),y=new Float32Array(V*3),A=new Float32Array(V),b=new N;b.setAttribute("position",new z(y,3)),b.setAttribute("aT",new z(A,1)),b.setDrawRange(0,0);const C=new R({vertexShader:Ee,fragmentShader:ze,uniforms:{uTime:{value:0},uOpacity:{value:.85},uBaseColor:{value:new u(.2,.12,.4)},uTipColor:{value:new u(.5,.35,.9)},uPhase:{value:f(0,6.28)}},blending:M,transparent:!0,depthWrite:!1}),D=new E(b,C);D.visible=!1,r.add(D),y[0]=t.target.x,y[1]=t.target.y,y[2]=t.target.z,A[0]=0;const G={origin:t.target.clone(),isHit:n,fireDelay:e,pos:t.target.clone(),vel:T,searchDist:f(20,45),gravity:new u(f(-1.5,1.5),f(-3,-1),f(-1.5,1.5)),drift:new u(f(-2,2),f(-.5,.5),f(-2,2)),returnStart:new u,returnArc:new u,returnT:0,returnDur:f(1.2,2),points:[t.target.clone()],posArr:y,tArr:A,geo:b,mat:C,line:D,ptCount:1,state:"waiting",elapsed:0,stateTime:0,tailIdx:0};return o.push(G),G}const s=[],d=Array.from({length:I},(e,n)=>n);for(let e=d.length-1;e>0;e--){const n=Math.floor(Math.random()*(e+1));[d[e],d[n]]=[d[n],d[e]]}for(let e=0;e<I;e++){const n=d[e]<I*Pe;s.push(i(f(.1,3),n))}function v(e){const n=Math.min(e.points.length,V),c=e.points.length-n;for(let a=0;a<n;a++){const p=e.points[c+a];e.posArr[a*3]=p.x,e.posArr[a*3+1]=p.y,e.posArr[a*3+2]=p.z,e.tArr[a]=a/(n-1||1)}e.ptCount=n,e.geo.attributes.position.needsUpdate=!0,e.geo.attributes.aT.needsUpdate=!0}function h(e,n,c,a){const p=1-a;return new u(p*p*e.x+2*p*a*n.x+a*a*c.x,p*p*e.y+2*p*a*n.y+a*a*c.y,p*p*e.z+2*p*a*n.z+a*a*c.z)}function m(e,n){if(e.elapsed+=n,e.mat.uniforms.uTime.value=e.elapsed,e.state==="waiting"){e.elapsed>=e.fireDelay&&(e.state="seeking",e.stateTime=0,e.line.visible=!0);return}if(e.stateTime+=n,e.state==="seeking"){if(e.vel.addScaledVector(e.gravity,n),e.vel.addScaledVector(e.drift,n),e.vel.multiplyScalar(1-n*.3),e.pos.addScaledVector(e.vel,n),e.points.push(e.pos.clone()),v(e),e.geo.setDrawRange(0,e.ptCount),e.pos.distanceTo(e.origin)>=e.searchDist)if(e.isHit){e.state="hit_returning",e.stateTime=0,e.returnStart.copy(e.pos);const c=e.pos.clone().add(e.origin).multiplyScalar(.5);e.returnArc.set(c.x+f(-18,18),c.y+f(8,25),c.z+f(-18,18)),e.returnT=0,e.mat.uniforms.uBaseColor.value.set(.05,.35,.15),e.mat.uniforms.uTipColor.value.set(.3,1,.5)}else e.state="miss_dying",e.stateTime=0,e.tailIdx=0,e.mat.uniforms.uBaseColor.value.set(.3,.05,.05),e.mat.uniforms.uTipColor.value.set(.5,.1,.08)}else if(e.state==="hit_returning"){e.returnT=Math.min(1,e.returnT+n/e.returnDur);const c=e.returnT<.5?2*e.returnT*e.returnT:1-Math.pow(-2*e.returnT+2,2)/2;e.pos.copy(h(e.returnStart,e.returnArc,e.origin,c)),e.points.push(e.pos.clone()),v(e),e.geo.setDrawRange(0,e.ptCount),e.returnT>=1&&(e.state="miss_dying",e.stateTime=0,e.tailIdx=0)}else if(e.state==="miss_dying"){const c=e.isHit?25:15;e.tailIdx=Math.min(e.ptCount-1,e.tailIdx+n*c);const a=Math.round(e.tailIdx),p=e.ptCount-a;if(p<=1){e.state="done",e.geo.setDrawRange(0,0),e.line.visible=!1;return}e.geo.setDrawRange(a,p);for(let w=a;w<e.ptCount;w++)e.tArr[w]=(w-a)/(p-1);e.geo.attributes.aT.needsUpdate=!0,e.isHit||(e.mat.uniforms.uOpacity.value=Math.max(0,.85-e.stateTime*.4))}}const l={entries:[],suppressDefaultTrail:!0,trailTick(e,n){for(const c of s)m(c,n);o.every(c=>c.state==="done")&&(l.shouldMarkDone=!0)},tick(){},onLand(){},applyFade(e){},shouldMarkDone:!1,dispose(){for(const e of o)e.geo.dispose(),e.mat.dispose()}};return l}const Fe=[{name:"Seeker Missiles",description:"Missiles launch staggered, seek outward; hits glow green and arc back, misses turn red and dissolve",spawnParams:Re,buildCustomEffect:De}],k=[{label:"Prompt",color:"#93c5fd",variations:ke},{label:"Glob",color:"#a78bfa",variations:Fe}];function Ve(){const r=_.useRef(null),t=_.useRef(null),o=_.useRef(0),[i,s]=_.useState(0),[d,v]=_.useState(0),h=k[i];_.useEffect(()=>{if(!r.current)return;const l=new ue(r.current);t.current=l;const e=k[0].variations[0];l.setVariation(e);function n(){l.tick(),o.current=requestAnimationFrame(n)}return o.current=requestAnimationFrame(n),()=>{cancelAnimationFrame(o.current),l.destroy(),t.current=null}},[]);function m(l,e){var c;s(l),v(e);const n=k[l].variations[e];(c=t.current)==null||c.setVariation(n)}return g.jsxs("div",{style:{width:"100vw",height:"100vh",background:"#030308",display:"flex",position:"relative"},children:[g.jsx("div",{ref:r,style:{flex:1,height:"100%"}}),g.jsxs("div",{style:{position:"absolute",top:0,right:0,width:280,height:"100%",background:"rgba(3,3,14,0.88)",borderLeft:"1px solid rgba(255,255,255,0.06)",display:"flex",flexDirection:"column",fontFamily:"monospace",color:"#aaa",overflowY:"auto"},children:[g.jsxs("div",{style:{padding:"16px 16px 10px",borderBottom:"1px solid rgba(255,255,255,0.06)"},children:[g.jsx("div",{style:{fontSize:11,letterSpacing:"0.1em",color:"#555",marginBottom:4},children:"EFFECT DEMO"}),g.jsx("div",{style:{fontSize:13,color:"#eee"},children:"trail variations"})]}),g.jsx("div",{style:{display:"flex",padding:"10px 10px 0",gap:6,flexWrap:"wrap"},children:k.map((l,e)=>g.jsx("button",{onClick:()=>m(e,0),style:{padding:"4px 10px",fontSize:11,borderRadius:3,border:`1px solid ${i===e?l.color:"rgba(255,255,255,0.1)"}`,background:i===e?`${l.color}18`:"transparent",color:i===e?l.color:"#666",cursor:"pointer",letterSpacing:"0.05em"},children:l.label},l.label))}),g.jsx("div",{style:{padding:10,display:"flex",flexDirection:"column",gap:8,flex:1},children:h.variations.map((l,e)=>{const n=i===k.indexOf(h)&&d===e;return g.jsxs("button",{onClick:()=>m(k.indexOf(h),e),style:{textAlign:"left",padding:"10px 12px",borderRadius:5,border:`1px solid ${n?h.color:"rgba(255,255,255,0.07)"}`,background:n?`${h.color}12`:"rgba(255,255,255,0.02)",cursor:"pointer",color:"inherit",transition:"border-color 0.15s"},children:[g.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:4},children:[g.jsx("span",{style:{display:"inline-block",width:8,height:8,borderRadius:"50%",background:n?h.color:"#444",flexShrink:0}}),g.jsxs("span",{style:{fontSize:12,color:n?h.color:"#ccc",fontWeight:600},children:[e+1,". ",l.name]})]}),g.jsx("div",{style:{fontSize:11,color:"#666",lineHeight:1.5,paddingLeft:16},children:l.description})]},l.name)})}),g.jsx("div",{style:{padding:"10px 16px",borderTop:"1px solid rgba(255,255,255,0.05)",fontSize:10,color:"#444"},children:"drag to orbit · scroll to zoom · node loops automatically"})]}),g.jsx("a",{href:"#/three",style:{position:"absolute",top:14,left:14,fontSize:11,color:"#444",textDecoration:"none",fontFamily:"monospace",letterSpacing:"0.05em"},children:"← back"})]})}export{Ve as EffectDemoScene};
