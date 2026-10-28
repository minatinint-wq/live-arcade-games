import {Arcade} from '../core/arcade.mjs';
import {clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='tower-stack');
const rules={
 theme:'stack',hint:'Solte o andar quando ele alinhar com a torre',actions:[{id:'drop',label:'Soltar andar'},{id:'wind',label:'Rajada de vento'},{id:'steady',label:'Estabilizar'}],
 reset(g){Object.assign(g.state,{blocks:[{x:450,width:460}],moving:{x:270,width:460,v:160},wind:0,falling:[],perfect:0,lastDropAt:-10});},
 input(g,e,p){
  if(e.action==='wind'||e.kind==='gift'){g.state.wind=clamp(g.state.wind+(g.random()<.5?-70:70),-250,250);return;}
  if(e.action==='steady'){const m=g.state.moving;m.v=Math.sign(m.v)*Math.max(90,Math.abs(m.v)*.85);return;}
  if(e.action!=='drop')return;
  const m=g.state.moving,top=g.state.blocks.at(-1);if(Math.abs(m.x-top.x)<5)m.x=top.x;
  const left=Math.max(m.x-m.width/2,top.x-top.width/2),right=Math.min(m.x+m.width/2,top.x+top.width/2),width=right-left;
  const base=1040+Math.max(0,g.state.blocks.length-17)*38,y=base-g.state.blocks.length*38;
  for(const [a,b,dir]of [[m.x-m.width/2,left,-1],[right,m.x+m.width/2,1]])if(b>a)g.state.falling.push({x:(a+b)/2,y,width:b-a,vy:0,vx:dir*80,angle:0,spin:dir,life:1.3});
  if(width<18){g.state.falling.push({x:m.x,y,width:m.width,vy:0,vx:50,angle:0,spin:1,life:1.3});g.finish('O chat');return;}
  g.state.blocks.push({x:(left+right)/2,width});g.state.lastDropAt=g.time;g.state.perfect=width===top.width?g.state.perfect+1:0;g.score(width===top.width?15:Math.round(width/m.width*10),p);
  if(width===top.width)g.effect(450,620,'PERFEITO!');
  g.state.moving={x:40+width/2,width,v:(150+g.state.blocks.length*7)*(g.random()<.5?-1:1)};
  if(g.state.blocks.length>=30)g.finish('A torre');
 },
 step(g,dt){const m=g.state.moving;m.x+=(m.v+g.state.wind)*dt;const low=40+m.width/2,high=860-m.width/2;if(m.x<low){m.x=low;m.v=Math.abs(m.v);g.state.wind=Math.abs(g.state.wind)*.4;}if(m.x>high){m.x=high;m.v=-Math.abs(m.v);g.state.wind=-Math.abs(g.state.wind)*.4;}g.state.wind*=Math.pow(.45,dt);g.state.meter=g.state.blocks.length/30;for(const o of g.state.falling){o.life-=dt;o.vy+=600*dt;o.x+=o.vx*dt;o.y+=o.vy*dt;o.angle+=o.spin*dt;}g.state.falling=g.state.falling.filter(o=>o.life>0).slice(-30);}
};
export default class extends Arcade {constructor(options){super(meta,rules,options);}}
