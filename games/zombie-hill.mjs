import {Arcade} from '../core/arcade.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='zombie-hill');
const rules={
 theme:'zombie',hint:'Atire para defender o abrigo · recarregue o tambor',actions:[{id:'shoot',label:'Atirar'},{id:'reload',label:'Recarregar'},{id:'heal',label:'Reforçar abrigo'},{id:'zombie',label:'Soltar zumbi'}],
 reset(g){Object.assign(g.state,{ammo:6,shelter:100,fallen:[],reloadEndsAt:0,reloadProgress:0,lastShot:null});g.reloadAt=0;g.spawnAt=g.time+.5;g.state.avatar.y=1050;},
 input(g,e,p){
  if(e.action==='reload'){if(!g.reloadAt&&g.state.ammo<6){g.reloadAt=g.time+1.8;g.state.reloadEndsAt=g.reloadAt;}return;}
  if(e.action==='heal'){g.state.shelter=Math.min(100,g.state.shelter+20);g.state.repairAt=g.time;return;}
  if(e.action==='zombie'||e.kind==='gift'){if(g.state.objects.length<100)g.state.objects.push({id:g.uid(),kind:'zombie',x:g.rnd(90,810),y:490,hp:50,spawnAt:g.time,size:22,speed:g.rnd(30,50),phase:g.rnd(0,6.28)});return;}
  if(e.action!=='shoot'||g.reloadAt)return;
  if(g.state.ammo<=0){g.state.emptyAt=g.time;return;}
  g.state.ammo--;const target=g.state.objects.filter(z=>z.hp>0).sort((a,b)=>b.y-a.y)[0];
  g.state.lastShot={x:target?.x??450,y:target?.y??120,at:g.time};
  if(target){target.hp-=35;target.y-=13;target.hitAt=g.time;if(target.hp<=0){g.score(10,p);g.state.fallen.push({...target,at:g.time});}}
 },
 step(g,dt){
  if(g.reloadAt&&g.time>=g.reloadAt){g.state.ammo=6;g.reloadAt=0;g.state.reloadEndsAt=0;}
  g.state.reloadProgress=g.reloadAt?Math.max(0,1-(g.reloadAt-g.time)/1.8):0;
  if(g.time>=g.spawnAt){g.spawnAt=g.time+Math.max(.4,2-(g.time-g.roundAt)/100);g.rules.input(g,{action:'zombie'},null);}
  for(const z of g.state.objects){if(z.hp<=0)continue;z.y+=z.speed*dt;if(z.y>1000){g.state.shelter=Math.max(0,g.state.shelter-15);z.hp=0;g.state.breachAt=g.time;if(g.state.shelter===0)g.finish('A horda');}}
  g.state.objects=g.state.objects.filter(z=>z.hp>0);g.state.fallen=g.state.fallen.filter(z=>g.time-z.at<.55).slice(-20);g.state.meter=g.state.shelter/100;
 }
};
export default class extends Arcade {constructor(options){super(meta,rules,options);}}
