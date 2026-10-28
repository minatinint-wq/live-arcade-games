import {Arcade} from '../core/arcade.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='log-rush');
const rules={
 theme:'tree',hint:'Corte do lado sem galho · esquerda · direita',actions:[{id:'left',label:'Cortar à esquerda'},{id:'right',label:'Cortar à direita'},{id:'branch',label:'Adicionar galho'}],
 reset(g){Object.assign(g.state,{branches:Array.from({length:12},(_,i)=>i%3===0?Math.floor(g.rnd(0,2)):-1),energy:1,chop:null,chips:[]});g.state.avatar.x=270;},
 input(g,e,p){
  if(e.action==='branch'||e.kind==='gift'){g.state.branches[1]=g.random()<.5?0:1;g.state.branchAt=g.time;return;}
  if(!['left','right'].includes(e.action))return;
  const side=e.action==='left'?0:1;g.state.avatar.x=side?630:270;g.state.chop={at:g.time,side,hit:g.state.branches[0]===side};
  if(g.state.branches[0]===side){g.hit();g.state.energy=Math.min(1,g.state.energy+.1);}else{g.score(1,p);g.state.energy=Math.min(1,g.state.energy+.09);for(let i=0;i<8;i++)g.state.chips.push({x:450,y:850,vx:g.rnd(-220,220),vy:g.rnd(-150,-25),life:.6,size:g.rnd(4,10)});}
  g.state.branches.shift();g.state.branches.push(g.random()<.45?Math.floor(g.rnd(0,2)):-1);
 },
 step(g,dt){g.state.energy=Math.max(0,g.state.energy-dt*.025);g.state.meter=g.state.energy;if(g.state.energy<=0)g.hit();for(const o of g.state.chips){o.life-=dt;o.vy+=500*dt;o.x+=o.vx*dt;o.y+=o.vy*dt;}g.state.chips=g.state.chips.filter(o=>o.life>0).slice(-80);}
};
export default class extends Arcade {constructor(options){super(meta,rules,options);}}
