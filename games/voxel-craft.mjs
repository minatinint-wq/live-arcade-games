import {Arcade} from '../core/arcade.mjs';
import {distance,clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='voxel-craft');
const rules={
 theme:'voxel',hint:'construir · quebrar · girar · escolha uma posição',actions:[{id:'build',label:'Construir bloco'},{id:'break',label:'Quebrar bloco'},{id:'rotate',label:'Girar visão'},{id:'rain',label:'Chuva de blocos'}],
 reset(g){g.state.size=8;g.state.rotation=0;g.state.focus=27;g.state.heights=Array.from({length:64},(_,i)=>i%8===0||i%8===7?1:0);g.state.heights[27]=2;},
 input(g,e,p){if(e.action==='rotate'){g.state.rotation=(g.state.rotation+1)%4;return;}if(Number.isInteger(e.index)&&e.index>=0&&e.index<64)g.state.focus=e.index;else if(Number.isFinite(e.x)&&Number.isFinite(e.y))g.state.focus=clamp(Math.floor(e.y/1200*8),0,7)*8+clamp(Math.floor(e.x/900*8),0,7);const i=g.state.focus;if(e.action==='break'){g.state.heights[i]=Math.max(0,g.state.heights[i]-1);}else if(e.action==='rain'||e.kind==='gift'){for(let n=0;n<12;n++){const k=Math.floor(g.rnd(0,64));g.state.heights[k]=Math.min(8,g.state.heights[k]+1);}}else{g.state.heights[i]=Math.min(8,g.state.heights[i]+1);g.state.focus=(i+1)%64;g.score(1,p);}g.state.points=g.state.heights.reduce((a,b)=>a+b,0);},
 step(g){g.state.meter=g.state.heights.reduce((a,b)=>a+(b>0?1:0),0)/64;}
};
export default class extends Arcade {constructor(options){super(meta,rules,options);}}
