import {Arcade} from '../core/arcade.mjs';
import {clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='window-wipe');
const rules={
 theme:'window',hint:'Arraste o rodo pela janela · manchar · balde',actions:[{id:'wipe',label:'Passar rodo'},{id:'dirty',label:'Manchar'},{id:'bucket',label:'Balde de água'}],
 reset(g){Object.assign(g.state,{dirt:Array.from({length:80},()=>g.rnd(.35,1)),focus:0,wipeMotion:null,bucketAt:-10});},
 input(g,e,p){
  if(e.action==='dirty'||e.kind==='gift'){for(let n=0;n<9;n++)g.state.dirt[Math.floor(g.rnd(0,80))]=1;g.state.dirtyAt=g.time;return;}
  if(e.action==='bucket'){g.state.dirt=g.state.dirt.map(d=>Math.max(0,d-.22));g.state.bucketAt=g.time;return;}
  if(e.action!=='wipe')return;
  let index=g.state.focus;if(Number.isFinite(e.x)&&Number.isFinite(e.y))index=clamp(Math.floor(e.y/1200*10),0,9)*8+clamp(Math.floor(e.x/900*8),0,7);
  const col=index%8,row=Math.floor(index/8);let removed=0;
  for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++)if(col+dx<8&&row+dy<10){const i=(row+dy)*8+col+dx,before=g.state.dirt[i];g.state.dirt[i]=Math.max(0,before-.7);removed+=before-g.state.dirt[i];}
  const old=g.state.wipeMotion;g.state.wipeMotion={at:g.time,fromX:old?.x??450,fromY:old?.y??650,x:90+(col+.5)*90,y:220+(row+.5)*81};
  g.state.focus=(index+2)%80;if(removed>0)g.score(1,p);
 },
 step(g){g.state.meter=1-g.state.dirt.reduce((a,b)=>a+b,0)/80;if(g.state.meter>.97)g.finish('A limpeza');}
};
export default class extends Arcade {constructor(options){super(meta,rules,options);}}
