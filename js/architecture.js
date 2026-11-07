/* Dependency-free WebGL architectural sculpture. Geometry is illustrative, not a listing. */
(() => {
  'use strict';
  const canvas = document.querySelector('#architecture');
  const hero = document.querySelector('.hero');
  document.documentElement.classList.add('motion-ready');
  const stage = document.querySelector('.hero-stage');
  const toggle = document.querySelector('#motion-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width:767px)');
  let paused = reduced.matches, frame = 0, visible = true, last = 0, time = 0;
  let pointerX = 0, pointerY = 0, smoothX = 0, smoothY = 0, progress = 0;
  let width = 1, height = 1, chapter = -1;
  const chapters = [...document.querySelectorAll('.hero-chapter')];
  const gl = canvas.getContext('webgl', { alpha: true, antialias: true, powerPreference: 'low-power' });
  const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
  const ease = n => n * n * (3 - 2 * n);
  const vertices = [], colors = [], normals = [], levels = [], towers = [];
  function box(x, y, z, sx, sy, sz, color, floor = 0, tower = 0) {
    const faces = [
      [[1,0,0],[[1,-1,-1],[1,1,-1],[1,1,1],[1,-1,1]]],
      [[-1,0,0],[[-1,-1,1],[-1,1,1],[-1,1,-1],[-1,-1,-1]]],
      [[0,1,0],[[-1,1,-1],[-1,1,1],[1,1,1],[1,1,-1]]],
      [[0,-1,0],[[-1,-1,1],[-1,-1,-1],[1,-1,-1],[1,-1,1]]],
      [[0,0,1],[[1,-1,1],[1,1,1],[-1,1,1],[-1,-1,1]]],
      [[0,0,-1],[[-1,-1,-1],[-1,1,-1],[1,1,-1],[1,-1,-1]]]
    ];
    for (const [normal, face] of faces) for (const i of [0,1,2,0,2,3]) {
      const v = face[i]; vertices.push(x+v[0]*sx/2,y+v[1]*sy/2,z+v[2]*sz/2);
      colors.push(...color); normals.push(...normal); levels.push(floor); towers.push(tower);
    }
  }
  const stone = [.77,.79,.68], edge = [.91,.91,.82], glass = [.23,.40,.36], brass = [.51,.59,.43];
  // Three model towers, modeled floor by floor with slabs, recessed glazing and fins.
  box(0,-2.15,0,5.6,.18,4.4,edge);
  box(0,-2.29,0,5.9,.1,4.7,brass);
  for (const [tx,tz,count,tw,td,group] of [[0,0,17,1.9,1.4,0],[-1.85,.55,10,1.1,1.3,-1],[1.65,.45,13,1.1,1.15,1]]) {
    for (let f=0;f<count;f++) {
      const y=-1.96+f*.31, level=f/count;
      box(tx,y,tz,tw,.075,td,edge,level,group);
      box(tx,y+.15,tz,tw*.87,.24,td*.86,glass,level,group);
      for (let i=0;i<5;i++) {
        const dx=tx-tw*.42+i*tw*.21;
        box(dx,y+.15,tz+td*.46,.034,.25,.07,stone,level,group);
        box(dx,y+.15,tz-td*.46,.034,.25,.07,stone,level,group);
      }
      box(tx,y+.06,tz+td*.5,tw,.07,.055,brass,level,group);
      if (f%4===0) box(tx+tw*.3,y+.085,tz+td*.48,.22,.13,.16,[.34,.47,.29],level,group);
    }
    box(tx,-1.96+count*.31,tz,tw+.12,.1,td+.12,edge,1,group);
  }
  // Plinth landscaping and a ring of scale-model city blocks.
  for (let i=0;i<10;i++) {
    const angle=i*2.399, radius=3.8+(i%3)*.25;
    const h=.15+(i%4)*.2;
    box(Math.cos(angle)*radius,-2.15+h/2,Math.sin(angle)*radius,.3,h,.3,[.63,.70,.61],0,0);
  }
  function shader(type, source) {
    const s=gl.createShader(type); gl.shaderSource(s,source); gl.compileShader(s);
    if (!gl.getShaderParameter(s,gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(s));
    return s;
  }
  let program;
  try {
    if (!gl) throw Error('WebGL unavailable');
    program=gl.createProgram();
    gl.attachShader(program,shader(gl.VERTEX_SHADER,`
      attribute vec3 position; attribute vec3 normal; attribute vec3 color;
      attribute float level; attribute float tower;
      uniform mat4 projection; uniform mat4 view; uniform mat4 model;
      uniform float explode; uniform float clock;
      varying vec3 vColor; varying vec3 vNormal; varying float vDepth;
      void main(){
        vec3 p=position;
        p.y += level * explode * 2.3;
        p.x += tower * explode * .9;
        vec4 world=model*vec4(p,1.0);
        vec4 eye=view*world;
        gl_Position=projection*eye;
        vNormal=mat3(model)*normal; vColor=color; vDepth=-eye.z;
      }`));
    gl.attachShader(program,shader(gl.FRAGMENT_SHADER,`
      precision mediump float; varying vec3 vColor; varying vec3 vNormal; varying float vDepth;
      void main(){
        vec3 n=normalize(vNormal);
        float key=max(dot(n,normalize(vec3(-.6,1.,.8))),0.);
        float rim=max(dot(n,normalize(vec3(.8,.4,-1.))),0.);
        vec3 c=vColor*(.63+key*.48)+vec3(.12,.14,.09)*rim;
        c=mix(c,vec3(.91,.93,.88),smoothstep(13.,25.,vDepth)*.38);
        gl_FragColor=vec4(c,1.);
      }`));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program,gl.LINK_STATUS)) throw Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);
    for (const [name,data,size] of [['position',vertices,3],['normal',normals,3],['color',colors,3],['level',levels,1],['tower',towers,1]]) {
      const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
      gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);
      const attr=gl.getAttribLocation(program,name);
      if (attr>=0){gl.enableVertexAttribArray(attr);gl.vertexAttribPointer(attr,size,gl.FLOAT,false,0,0);}
    }
    gl.enable(gl.DEPTH_TEST);gl.enable(gl.CULL_FACE);gl.clearColor(0,0,0,0);
    document.documentElement.classList.add('has-3d');
  } catch (error) {
    program = null;
    console.warn('Architectural scene uses photo fallback:',error.message);
  }
  const uniforms = gl && program ? Object.fromEntries(['projection','view','model','explode','clock'].map(key=>[key,gl.getUniformLocation(program,key)])) : null;
  function perspective(aspect) {
    const f=1/Math.tan(.55/2),near=.1,far=70;
    return [f/aspect,0,0,0,0,f,0,0,0,0,(far+near)/(near-far),-1,0,0,2*far*near/(near-far),0];
  }
  function lookAt(eye,target) {
    const norm=v=>{const l=Math.hypot(...v);return v.map(n=>n/l);};
    const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
    const dot=(a,b)=>a.reduce((s,n,i)=>s+n*b[i],0);
    const z=norm(eye.map((n,i)=>n-target[i])),x=norm(cross([0,1,0],z)),y=cross(z,x);
    return [x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1];
  }
  function resize() {
    width=stage.clientWidth;height=stage.clientHeight;
    const dpr=Math.min(devicePixelRatio||1,mobile.matches?1.25:1.75);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    if (gl) gl.viewport(0,0,canvas.width,canvas.height);
    requestRender();
  }
  new ResizeObserver(resize).observe(stage);
  stage.addEventListener('pointermove',event=>{
    if(event.pointerType==='touch')return;
    const r=stage.getBoundingClientRect();pointerX=(event.clientX-r.left)/r.width-.5;pointerY=(event.clientY-r.top)/r.height-.5;
  },{passive:true});
  stage.addEventListener('pointerleave',()=>{pointerX=0;pointerY=0;});
  const track=document.querySelector('.scene-track i');
  function render(now) {
    frame=0;
    if(document.hidden || !visible)return;
    const dt=Math.min((now-last)/1000,.05);last=now;
    if(!paused)time+=dt;
    const rect=hero.getBoundingClientRect();
    progress=reduced.matches?0:clamp(-rect.top/(hero.offsetHeight-height));
    const next=progress<.34?0:progress<.69?1:2;
    if(next!==chapter){chapter=next;chapters.forEach((el,i)=>{el.classList.toggle('active',i===next);el.inert=i!==next;});document.querySelector('#scene-label').textContent=['THE CITY','THE ARCHITECTURE','YOUR PLACE'][next];}
    track.style.transform=`scaleX(${progress})`;
    smoothX+=(pointerX-smoothX)*.055;smoothY+=(pointerY-smoothY)*.055;
    if(uniforms){
      const p=paused?0:progress;
      const angle=-.5+p*2.9+(paused?0:time*.1+smoothX*.3);
      const c=Math.cos(angle),s=Math.sin(angle);
      const model=[c,0,-s,0,0,1,0,0,s,0,c,0,0,0,0,1];
      const aspect=width/height;
      const xOffset=mobile.matches?0:-3.15;
      const distance=mobile.matches?15.5:12.5;
      const eye=[xOffset,3.3+p*1.8+(paused?0:smoothY*.6),distance-p*1.2];
      const target=[xOffset,mobile.matches?2.2:.6,0];
      gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      gl.uniformMatrix4fv(uniforms.projection,false,new Float32Array(perspective(aspect)));
      gl.uniformMatrix4fv(uniforms.view,false,new Float32Array(lookAt(eye,target)));
      gl.uniformMatrix4fv(uniforms.model,false,new Float32Array(model));
      gl.uniform1f(uniforms.explode,ease(clamp((p-.15)/.32))*(1-ease(clamp((p-.63)/.3))));
      gl.drawArrays(gl.TRIANGLES,0,vertices.length/3);
    }
    if(!paused)frame=requestAnimationFrame(render);
  }
  function requestRender(){if(!frame && visible && !document.hidden)frame=requestAnimationFrame(render);}
  function updatePause(){
    toggle.setAttribute('aria-pressed',String(paused));
    toggle.innerHTML=paused?'Resume motion <span aria-hidden="true">▶</span>':'Pause motion <span aria-hidden="true">Ⅱ</span>';
    document.documentElement.classList.toggle('motion-paused',paused);
    requestRender();
  }
  toggle.addEventListener('click',()=>{paused=!paused;updatePause();});
  reduced.addEventListener('change',()=>{paused=reduced.matches;updatePause();});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){last=performance.now();requestRender();}else{cancelAnimationFrame(frame);frame=0;}},{rootMargin:'100px'}).observe(hero);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else{last=performance.now();requestRender();}});
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();cancelAnimationFrame(frame);frame=0;document.documentElement.classList.remove('has-3d');});
  canvas.addEventListener('webglcontextrestored',()=>location.reload());
  resize();updatePause();

  // Scroll-linked depth throughout the page. CSS timelines keep scroll work off JS.
  // Pointer tilt uses compositor transforms and is disabled for coarse input/reduced motion.
  const fine=matchMedia('(pointer:fine)');
  document.querySelectorAll('.area-tile,.journal-feature').forEach(tile=>{
    tile.addEventListener('pointermove',event=>{
      if(!fine.matches||reduced.matches||paused)return;
      const r=tile.getBoundingClientRect();
      const x=(event.clientX-r.left)/r.width-.5,y=(event.clientY-r.top)/r.height-.5;
      tile.style.setProperty('--rx',`${-y*9}deg`);tile.style.setProperty('--ry',`${x*11}deg`);
      tile.style.setProperty('--shine-x',`${(x+.5)*100}%`);
    },{passive:true});
    tile.addEventListener('pointerleave',()=>{tile.style.setProperty('--rx','0deg');tile.style.setProperty('--ry','0deg');});
  });
  const animated=document.querySelectorAll('.area-tile,.steps li,.journal-list article,.contact-grid,.values-strip');
  const reveal=new IntersectionObserver(entries=>{
    if(reduced.matches)return;
    entries.forEach(entry=>{if(entry.isIntersecting){entry.target.animate([{opacity:.15,transform:'perspective(1000px) translateY(55px) rotateX(7deg)'},{opacity:1,transform:'perspective(1000px) translateY(0) rotateX(0deg)'}],{duration:900,easing:'cubic-bezier(.16,1,.3,1)',delay:Number(entry.target.dataset.motionDelay||0)});reveal.unobserve(entry.target);}});
  },{threshold:.12});
  animated.forEach((el,i)=>{el.dataset.motionDelay=String((i%2)*100);reveal.observe(el);});
})();
