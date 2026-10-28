import {Arcade} from '../core/arcade.mjs';
import {clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='voxel-craft');
const rules={
 theme:'voxel',hint:'Clique no topo do bloco · construir A1 · quebrar A1 · girar',actions:[{id:'build',label:'Construir bloco'},{id:'break',label:'Quebrar bloco'},{id:'rotate',label:'Girar visão'},{id:'rain',label:'Chuva de blocos'}],
 reset(g){Object.assign(g.state,{size:8,rotation:0,focus:27,heights:Array.from({length:64},(_,i)=>i%8===0||i%8===7?1:0),blockChanges:[]});g.state.heights[27]=2;g.state.points=g.state.heights.reduce((a,b)=>a+b,0);},
 input(g,e,p){
  if(e.action==='rotate'){g.state.rotation=(g.state.rotation+1)%4;g.state.rotateAt=g.time;return;}
  const targeted=Number.isInteger(e.index)&&e.index>=0&&e.index<64;
  if(targeted)g.state.focus=e.index;
  else if(Number.isFinite(e.x)&&Number.isFinite(e.y))g.state.focus=clamp(Math.floor(e.y/1200*8),0,7)*8+clamp(Math.floor(e.x/900*8),0,7);
  const change=(i,amount)=>{const from=g.state.heights[i],to=clamp(from+amount,0,8);if(to!==from){g.state.heights[i]=to;g.state.blockChanges.push({index:i,from,to,at:g.time});return true;}return false;};
  const i=g.state.focus;
  if(e.action==='break')change(i,-1);
  else if(e.action==='rain'||e.kind==='gift'){for(let n=0;n<12;n++)change(Math.floor(g.rnd(0,64)),1);}
  else if(e.action==='build'){if(change(i,1))g.addScore(p,1);if(!targeted)g.state.focus=(i+1)%64;}
  g.state.blockChanges=g.state.blockChanges.slice(-24);g.state.points=g.state.heights.reduce((a,b)=>a+b,0);
 },
 step(g){g.state.meter=g.state.heights.reduce((a,b)=>a+(b>0?1:0),0)/64;g.state.blockChanges=g.state.blockChanges.filter(o=>g.time-o.at<.6);}
};
export default class extends Arcade {constructor(options){super(meta,rules,options);}}
