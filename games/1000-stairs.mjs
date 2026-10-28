import {Arcade} from '../core/arcade.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='1000-stairs');
const advance=(g,n,p)=>{for(let i=0;i<n&&g.state.climbed<1000;i++){g.state.steps.shift();g.state.steps.push(g.random()<.5?0:1);g.state.climbed++;g.score(1,p);}if(g.state.climbed>=1000)g.finish(p);};
const rules={
 theme:'stairs',hint:'Siga a seta do degrau · esquerda · direita · impulso',actions:[{id:'left',label:'Subir à esquerda'},{id:'right',label:'Subir à direita'},{id:'boost',label:'Impulso'},{id:'shake',label:'Balançar escada'}],
 reset(g){Object.assign(g.state,{steps:Array.from({length:16},()=>g.random()<.5?0:1),climbed:0,balance:0,stepMotion:null});g.state.avatar.x=450;g.state.avatar.y=834;},
 input(g,e,p){
  if(e.action==='shake'||e.kind==='gift'){g.state.balance=Math.min(1,g.state.balance+.4);g.state.shakeAt=g.time;return;}
  if(e.action==='boost'){const from=g.state.avatar.x;advance(g,5,p);g.state.avatar.x=g.state.steps[0]?570:330;g.state.stepMotion={at:g.time,fromX:from,toX:g.state.avatar.x,boost:true};return;}
  if(!['left','right'].includes(e.action))return;
  const side=e.action==='left'?0:1;
  if(side===g.state.steps[0]){const from=g.state.avatar.x;advance(g,1,p);g.state.avatar.x=side?570:330;g.state.stepMotion={at:g.time,fromX:from,toX:g.state.avatar.x};}
  else{g.hit();g.state.missAt=g.time;}
 },
 step(g,dt){g.state.balance=Math.max(0,g.state.balance-dt*.15);g.state.avatar.y=834;}
};
export default class extends Arcade {constructor(options){super(meta,rules,options);}}
