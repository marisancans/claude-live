import{C as W,G as p,a as b,W as z,S as M,P as A,O as S,B as k,b as C,M as F,A as u,d as h,E as j,R,U as L,V,g as E,L as _,h as G,Q as I,k as g,D as f,I as P,r as v,l as o}from"./index-zmiMo1Db.js";class D{constructor(e){this.clock=new W,this.elapsed=0,this.agentGroup=new p,this.currentVisual=null,this.currentVariation=null,this.agentTetherLine=null,this.wanderOffsets=new b(Math.random()*100,Math.random()*100,Math.random()*100),this.pulseTimer=0,this.pulseInterval=2,this._onResize=()=>{const d=this.renderer.domElement.parentElement;if(!d)return;const y=Math.max(1,d.clientWidth),l=Math.max(1,d.clientHeight);this.camera.aspect=y/l,this.camera.updateProjectionMatrix(),this.renderer.setSize(y,l),this.composer.setSize(y,l)},this.renderer=new z({antialias:!0}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(e.clientWidth,e.clientHeight),this.renderer.setClearColor(197384),e.appendChild(this.renderer.domElement),this.scene=new M;const t=Math.max(1,e.clientWidth),r=Math.max(1,e.clientHeight);this.camera=new A(55,t/r,1,2e3),this.camera.position.set(0,30,110),this.controls=new S(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.06,this.controls.autoRotate=!0,this.controls.autoRotateSpeed=.5,this.controls.target.set(0,15,0),this.controls.minDistance=20,this.controls.maxDistance=300,this.background=new k,this.scene.add(this.background.group);const n=new C(3,16,16),a=new F({color:4491519,transparent:!0,opacity:.5,blending:u}),i=new h(n,a);this.scene.add(i),this.scene.add(this.agentGroup),this.composer=new j(this.renderer),this.composer.addPass(new R(this.scene,this.camera));const c=new L(new V(e.clientWidth,e.clientHeight),1.2,.4,.15);this.composer.addPass(c),this.scene.updateMatrixWorld(!0),this.resizeObserver=new ResizeObserver(this._onResize),this.resizeObserver.observe(e),window.addEventListener("resize",this._onResize),this._onResize()}setVariation(e){if(this.currentVariation=e,this._clearVisual(),this.currentVisual=e.build(this.agentGroup),!this.agentTetherLine){const t=new E().setFromPoints(new Array(21).fill(new b)),r=new _({color:4500223,transparent:!0,opacity:.2,blending:u});this.agentTetherLine=new G(t,r),this.scene.add(this.agentTetherLine)}this.pulseTimer=0}triggerPulse(){var e,t;(t=(e=this.currentVisual)==null?void 0:e.pulse)==null||t.call(e)}_clearVisual(){this.currentVisual&&(this.currentVisual.dispose(),this.currentVisual=null)}tick(){const e=Math.min(this.clock.getDelta(),.05);if(this.elapsed+=e,this.controls.update(),this.background.tick(e),this.currentVisual){this.currentVisual.tick(e,this.elapsed);const t=.25;this.wanderOffsets.x+=e*t*.8,this.wanderOffsets.y+=e*t*1.1,this.wanderOffsets.z+=e*t*.9;const r=50;if(this.agentGroup.position.set(Math.sin(this.wanderOffsets.x)*r,25+Math.sin(this.wanderOffsets.y)*15,Math.cos(this.wanderOffsets.z)*r*Math.cos(this.wanderOffsets.x*.5)),this.agentTetherLine){const n=new b(0,0,0),a=this.agentGroup.position.clone(),i=n.clone().lerp(a,.5);i.y-=10+Math.sin(this.elapsed*2)*4;const c=new I(n,i,a);this.agentTetherLine.geometry.setFromPoints(c.getPoints(20))}this.pulseTimer+=e,this.pulseTimer>=this.pulseInterval&&(this.pulseTimer=0,this.pulseInterval=1.5+Math.random()*3)}try{this.composer.render()}catch{}}destroy(){this.resizeObserver.disconnect(),window.removeEventListener("resize",this._onResize),this.renderer.dispose(),this.renderer.domElement.remove(),this._clearVisual(),this.agentTetherLine&&(this.scene.remove(this.agentTetherLine),this.agentTetherLine.geometry.dispose(),this.agentTetherLine.material.dispose())}}const w=new P(3.5,128),T=new P(3.5,32).toNonIndexed();function O(s){const e=new p;s.add(e);const t=new g({uniforms:{uTime:{value:0},uActivity:{value:0}},vertexShader:`
      uniform float uTime; uniform float uActivity;
      varying vec3 vWorldPos;
      
      float getWarp(vec3 p) {
        // Classic smooth, large rolling waves
        return sin(p.x*2.0 - uTime) * sin(p.y*3.0 - uTime*0.8) * cos(p.z*2.0 + uTime) * 1.5;
      }
      void main() {
        vec3 pos = position + normal * getWarp(position) * (0.6 + uActivity);
        vec4 wPos = modelMatrix * vec4(pos, 1.0);
        vWorldPos = wPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * wPos;
      }
    `,fragmentShader:`
      uniform float uActivity;
      varying vec3 vWorldPos;
      void main() {
        vec3 n = normalize(cross(dFdx(vWorldPos), dFdy(vWorldPos)));
        vec3 v = normalize(cameraPosition - vWorldPos);
        float fresnel = 1.0 - max(dot(v, n), 0.0);
        
        vec3 base = mix(vec3(0.01, 0.02, 0.05), vec3(0.05, 0.01, 0.05), fract(vWorldPos.y * 0.15));
        vec3 col = base + pow(fresnel, 4.0) * vec3(0.1, 0.4, 0.8) * (1.0 + uActivity);
        
        gl_FragColor = vec4(col, min(1.0, 0.3 + pow(fresnel, 4.0) * 0.5));
      }
    `,transparent:!0,depthWrite:!1,blending:u,side:f});e.add(new h(w,t));let r=0;return{tick(n,a){r=Math.max(0,r-n*2),t.uniforms.uTime.value=a,t.uniforms.uActivity.value=r},pulse(){r=1},dispose(){s.remove(e),t.dispose()}}}function B(s){const e=new p;s.add(e);const t=new g({uniforms:{uTime:{value:0},uActivity:{value:0}},vertexShader:`
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
    `,transparent:!0,depthWrite:!1,blending:u,side:f});e.add(new h(T,t));let r=0;return{tick(n,a){r=Math.max(0,r-n*2),t.uniforms.uTime.value=a,t.uniforms.uActivity.value=r},pulse(){r=1},dispose(){s.remove(e),t.dispose()}}}function $(s){const e=new p;s.add(e);const t=new g({uniforms:{uTime:{value:0},uActivity:{value:0}},vertexShader:`
      uniform float uTime; uniform float uActivity;
      varying vec3 vWorldPos;
      
      float getWarp(vec3 p) {
        // Ripple strictly outward from the center poles based on Y
        float radius = length(p.xz);
        // Add a vertical sweeping element so it looks like a drop hitting water
        return sin(radius * 15.0 - uTime * 6.0) * cos(p.y * 3.0 + uTime) * 0.5;
      }
      void main() {
        // Displace the sphere entirely radially
        vec3 pos = position + normal * getWarp(position) * (1.0 + uActivity * 2.0);
        vec4 wPos = modelMatrix * vec4(pos, 1.0);
        vWorldPos = wPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * wPos;
      }
    `,fragmentShader:`
      uniform float uActivity;
      varying vec3 vWorldPos;
      void main() {
        vec3 n = normalize(cross(dFdx(vWorldPos), dFdy(vWorldPos)));
        vec3 v = normalize(cameraPosition - vWorldPos);
        float fresnel = 1.0 - max(dot(v, n), 0.0);
        
        vec3 col = vec3(0.01, 0.01, 0.08); // Indigo
        col += pow(fresnel, 5.0) * vec3(0.5, 0.1, 1.0) * (1.0 + uActivity);
        
        gl_FragColor = vec4(col, min(1.0, 0.2 + pow(fresnel, 5.0) * 0.8));
      }
    `,transparent:!0,depthWrite:!1,blending:u,side:f});e.add(new h(w,t));let r=0;return{tick(n,a){r=Math.max(0,r-n*2),t.uniforms.uTime.value=a,t.uniforms.uActivity.value=r},pulse(){r=1},dispose(){s.remove(e),t.dispose()}}}function H(s){const e=new p;s.add(e);const t=new g({uniforms:{uTime:{value:0},uActivity:{value:0}},vertexShader:`
      uniform float uTime; uniform float uActivity;
      varying vec3 vWorldPos;
      
      float getWarp(vec3 p) {
        // Floor the position to calculate the wave, tearing the geometry into blocks
        vec3 stepP = floor(p * 3.0) / 3.0; // Quantize the space
        float n = sin(stepP.x*5.0 - uTime) * cos(stepP.y*5.0) * sin(stepP.z*5.0 + uTime);
        return n * 1.5;
      }
      void main() {
        vec3 pos = position + normal * getWarp(position) * (0.8 + uActivity * 2.0);
        vec4 wPos = modelMatrix * vec4(pos, 1.0);
        vWorldPos = wPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * wPos;
      }
    `,fragmentShader:`
      uniform float uActivity;
      varying vec3 vWorldPos;
      void main() {
        vec3 n = normalize(cross(dFdx(vWorldPos), dFdy(vWorldPos)));
        vec3 v = normalize(cameraPosition - vWorldPos);
        float fresnel = 1.0 - max(dot(v, n), 0.0);
        
        vec3 col = vec3(0.05, 0.01, 0.01); // Deep crimson base
        col += pow(fresnel, 2.0) * vec3(1.0, 0.2, 0.2) * (1.0 + uActivity);
        
        gl_FragColor = vec4(col, min(1.0, 0.5 + pow(fresnel, 2.0) * 0.5));
      }
    `,transparent:!0,depthWrite:!1,blending:u,side:f}),r=new h(T,t);e.add(r);let n=0;return{tick(a,i){n=Math.max(0,n-a*2),t.uniforms.uTime.value=i,t.uniforms.uActivity.value=n},pulse(){n=1},dispose(){s.remove(e),t.dispose()}}}function q(s){const e=new p;s.add(e);const t=new g({uniforms:{uTime:{value:0},uActivity:{value:0}},vertexShader:`
      uniform float uTime; uniform float uActivity;
      varying vec3 vWorldPos;
      
      float getWarp(vec3 p) {
        // Obscenely high frequency sine waves create mathematical noise, vibrating the mesh
        float n = sin(p.x * 40.0 + uTime * 10.0) * sin(p.y * 40.0 - uTime * 5.0) * sin(p.z * 40.0 + uTime * 8.0);
        return n * 0.25; // Keep amplitude low so it looks like fuzz, not explosions
      }
      void main() {
        vec3 pos = position + normal * getWarp(position) * (1.0 + uActivity * 3.0);
        vec4 wPos = modelMatrix * vec4(pos, 1.0);
        vWorldPos = wPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * wPos;
      }
    `,fragmentShader:`
      uniform float uActivity;
      varying vec3 vWorldPos;
      void main() {
        vec3 n = normalize(cross(dFdx(vWorldPos), dFdy(vWorldPos)));
        vec3 v = normalize(cameraPosition - vWorldPos);
        float fresnel = 1.0 - max(dot(v, n), 0.0);
        
        vec3 col = vec3(0.01, 0.01, 0.01); // Basically black hole
        // The high frequency normals make the fresnel scatter like crazy!
        col += pow(fresnel, 3.0) * vec3(0.8, 0.8, 1.0) * (1.0 + uActivity);
        
        gl_FragColor = vec4(col, min(1.0, 0.6 + pow(fresnel, 3.0) * 0.4));
      }
    `,transparent:!0,depthWrite:!1,blending:u,side:f});e.add(new h(w,t));let r=0;return{tick(n,a){r=Math.max(0,r-n*2),t.uniforms.uTime.value=a,t.uniforms.uActivity.value=r},pulse(){r=1},dispose(){s.remove(e),t.dispose()}}}const x=[{name:"Smooth Void",description:"Deep dark rolling liquid displacement (The tuned baseline model).",build:O},{name:"Jagged Crystal",description:"Changes displacement to absolute mathematics and uses flat-shading to create sharp, tearing crystal spikes.",build:B},{name:"Concentric Droplet",description:"Symmetrical ripples flow outward radially from the center like a drop of liquid suspended in time.",build:$},{name:"Voxel Glitch Glass",description:"Forces the displacement math to snap to blocks (quantization), tearing the glass into digital cubes.",build:H},{name:"Micro-Fuzz",description:"Uses an obscenely high frequency wave to vibrate the vertices microscopically, causing intense light scattering.",build:q}];function U(){const s=v.useRef(null),e=v.useRef(null),t=v.useRef(0),[r,n]=v.useState(0);v.useEffect(()=>{if(!s.current)return;const i=new D(s.current);e.current=i,i.setVariation(x[0]);function c(){i.tick(),t.current=requestAnimationFrame(c)}return t.current=requestAnimationFrame(c),()=>{cancelAnimationFrame(t.current),i.destroy(),e.current=null}},[]);function a(i){var c;n(i),(c=e.current)==null||c.setVariation(x[i])}return o.jsxs("div",{style:{width:"100vw",height:"100vh",background:"#030308",position:"relative",overflow:"hidden"},children:[o.jsx("div",{ref:s,style:{position:"absolute",top:0,left:0,right:0,bottom:0}}),o.jsxs("div",{style:{position:"absolute",top:0,right:0,width:320,height:"100%",background:"rgba(3,3,14,0.92)",borderLeft:"1px solid rgba(255,255,255,0.06)",display:"flex",flexDirection:"column",fontFamily:"'Inter', 'SF Pro Display', system-ui, sans-serif",color:"#aaa",overflowY:"auto"},children:[o.jsxs("div",{style:{padding:"20px 20px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)",background:"linear-gradient(180deg, rgba(100,120,255,0.06) 0%, transparent 100%)"},children:[o.jsx("div",{style:{fontSize:10,letterSpacing:"0.18em",color:"#555",marginBottom:6,textTransform:"uppercase"},children:"SUBAGENT VISUALIZATIONS"}),o.jsx("div",{style:{fontSize:16,color:"#e8ecf4",fontWeight:600,letterSpacing:"-0.01em"},children:"Agent Node Concepts"}),o.jsx("div",{style:{fontSize:11,color:"#556",marginTop:4,lineHeight:1.5},children:"Each concept is a completely different visual direction for representing a subagent in the Three.js scene."})]}),o.jsx("div",{style:{padding:12,display:"flex",flexDirection:"column",gap:8,flex:1},children:x.map((i,c)=>{const d=r===c,l=["#66aaff","#aa66ff","#8833cc","#4488ff","#44ddff"][c];return o.jsxs("button",{onClick:()=>a(c),style:{textAlign:"left",padding:"14px 16px",borderRadius:8,border:`1px solid ${d?l:"rgba(255,255,255,0.06)"}`,background:d?`linear-gradient(135deg, ${l}15 0%, ${l}08 100%)`:"rgba(255,255,255,0.02)",cursor:"pointer",color:"inherit",transition:"all 0.2s ease",position:"relative",overflow:"hidden"},onMouseEnter:m=>{d||(m.currentTarget.style.borderColor=`${l}66`,m.currentTarget.style.background=`${l}08`)},onMouseLeave:m=>{d||(m.currentTarget.style.borderColor="rgba(255,255,255,0.06)",m.currentTarget.style.background="rgba(255,255,255,0.02)")},children:[d&&o.jsx("div",{style:{position:"absolute",left:0,top:0,bottom:0,width:3,background:`linear-gradient(180deg, ${l}, ${l}44)`,borderRadius:"0 2px 2px 0"}}),o.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:6},children:[o.jsx("div",{style:{width:28,height:28,borderRadius:6,background:d?`linear-gradient(135deg, ${l}44, ${l}22)`:"rgba(255,255,255,0.04)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:d?l:"#555",border:`1px solid ${d?`${l}33`:"rgba(255,255,255,0.06)"}`,flexShrink:0},children:c+1}),o.jsx("span",{style:{fontSize:13,fontWeight:600,letterSpacing:"-0.01em",color:d?"#eef2ff":"#bbb"},children:i.name})]}),o.jsx("div",{style:{fontSize:11,color:d?"#8899bb":"#556",lineHeight:1.6,paddingLeft:38},children:i.description})]},i.name)})}),o.jsx("div",{style:{padding:"12px 16px",borderTop:"1px solid rgba(255,255,255,0.06)"},children:o.jsx("button",{onClick:()=>{var i;return(i=e.current)==null?void 0:i.triggerPulse()},style:{width:"100%",padding:"10px 0",background:"linear-gradient(135deg, rgba(100,120,255,0.15), rgba(100,120,255,0.08))",border:"1px solid rgba(100,120,255,0.2)",borderRadius:6,cursor:"pointer",color:"#8899cc",fontSize:12,fontWeight:600,letterSpacing:"0.05em",transition:"all 0.2s ease"},onMouseEnter:i=>{i.currentTarget.style.background="linear-gradient(135deg, rgba(100,120,255,0.25), rgba(100,120,255,0.15))",i.currentTarget.style.borderColor="rgba(100,120,255,0.4)"},onMouseLeave:i=>{i.currentTarget.style.background="linear-gradient(135deg, rgba(100,120,255,0.15), rgba(100,120,255,0.08))",i.currentTarget.style.borderColor="rgba(100,120,255,0.2)"},children:"⚡ TRIGGER PULSE"})}),o.jsxs("div",{style:{padding:"10px 16px",borderTop:"1px solid rgba(255,255,255,0.04)",fontSize:10,color:"#334",display:"flex",justifyContent:"space-between"},children:[o.jsx("span",{children:"drag to orbit · scroll to zoom"}),o.jsx("span",{children:"auto-pulse active"})]})]}),o.jsx("a",{href:"#/three",style:{position:"absolute",top:16,left:16,fontSize:11,color:"#556",textDecoration:"none",fontFamily:"'Inter', system-ui, sans-serif",letterSpacing:"0.05em",padding:"6px 12px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:5,transition:"all 0.2s ease"},onMouseEnter:i=>{i.currentTarget.style.borderColor="rgba(255,255,255,0.15)",i.currentTarget.style.color="#aab"},onMouseLeave:i=>{i.currentTarget.style.borderColor="rgba(255,255,255,0.06)",i.currentTarget.style.color="#556"},children:"← back"})]})}export{U as AgentDemoScene};
