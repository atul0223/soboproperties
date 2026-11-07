import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=readFileSync(new URL('../js/architecture.js',import.meta.url),'utf8');
for(const scenario of [{mobile:false,reduced:false,webgl:true},{mobile:true,reduced:false,webgl:true},{mobile:false,reduced:true,webgl:true},{mobile:false,reduced:false,webgl:false}]){
  let top=0,draws=0,raf,clock=0,explode=0;
  const events=new Map(),buffers=[],matrices=[];
  const element=(id='')=>({id,style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},clientWidth:scenario.mobile?390:1440,clientHeight:scenario.mobile?750:810,offsetHeight:scenario.reduced?810:2400,animate(){},setAttribute(){},getBoundingClientRect:()=>({top,left:0,width:1440,height:810}),addEventListener:(name,fn)=>events.set(id+name,fn)});
  const canvas=element('canvas'),hero=element('hero'),stage=element('stage'),toggle=element('toggle');
  const chapters=[element(),element(),element()];
  const gl=new Proxy({
    createShader:()=>({}),createProgram:()=>({}),createBuffer:()=>({}),
    getShaderParameter:()=>true,getProgramParameter:()=>true,getAttribLocation:()=>0,getUniformLocation:(_,name)=>name,
    bufferData:(_,data)=>buffers.push(data),uniformMatrix4fv:(_,__,matrix)=>matrices.push(matrix),
    uniform1f:(name,value)=>{if(name==='explode')explode=value;},drawArrays:()=>draws++
  },{get:(target,key)=>target[key]??(()=>{})});
  canvas.getContext=()=>scenario.webgl?gl:null;
  const nodes={'#architecture':canvas,'.hero':hero,'.hero-stage':stage,'#motion-toggle':toggle,'.scene-track i':element(),'#scene-label':element()};
  const context={console:{warn(){}},Float32Array,Math,Error,performance:{now:()=>clock},devicePixelRatio:2,location:{reload(){}},
    document:{hidden:false,documentElement:element(),querySelector:selector=>nodes[selector],querySelectorAll:selector=>selector==='.hero-chapter'?chapters:[],addEventListener(){}},
    matchMedia:query=>({matches:query.includes('reduced')?scenario.reduced:query.includes('767')?scenario.mobile:true,addEventListener(){}}),
    ResizeObserver:class{observe(){}},IntersectionObserver:class{observe(){} unobserve(){}},
    requestAnimationFrame:fn=>{raf=fn;return 1;},cancelAnimationFrame:()=>{raf=null;}
  };
  vm.runInNewContext(source,context);
  const step=()=>{const fn=raf;raf=null;clock+=16;fn?.(clock);};
  step();
  if(scenario.webgl){
    assert(draws>0,'initial model draws');
    assert(buffers[0].length>10000,'architectural geometry exists');
    assert(buffers.every(data=>Array.from(data).every(Number.isFinite)),'finite geometry');
    assert(matrices.every(data=>Array.from(data).every(Number.isFinite)),'finite camera matrices');
  }
  if(!scenario.reduced){
    top=-720;step();assert.equal(nodes['#scene-label'].textContent,'THE ARCHITECTURE');
    if(scenario.webgl)assert(explode>.8,'floors separate in middle chapter');
    top=-1500;step();assert.equal(nodes['#scene-label'].textContent,'YOUR PLACE');
    if(scenario.webgl)assert(explode<.05,'floors reassemble in final chapter');
    events.get('toggleclick')();step();assert(!raf,'pause stops animation loop');
    events.get('toggleclick')();step();assert(raf,'resume restarts animation loop');
  }else assert(!raf,'reduced motion renders one static frame');
  console.log('PASS',JSON.stringify(scenario));
}
