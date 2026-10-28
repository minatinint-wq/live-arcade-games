import {Arcade} from '../core/arcade.mjs';
import {clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='flappy-3d');
const rules={
 theme:'pig3d',hint:'Bata asas para atravessar o centro dos portais',actions:[{id:'jump',label:'Bater asas'},{id:'wind',label:'Corrente de ar'},{id:'narrow',label:'Apertar portal'}],
 reset(g){g.state.avatar.y=600;g.spawnAt=g.time+.7;Object.assign(g.state,{distance:0,gap:310,wingAt:g.time});},
 input(g,e){if(e.action==='narrow'||e.kind==='gift'){g.state.gap=Math.max(160,g.state.gap-20);g.state.narrowAt=g.time;}else if(e.action==='jump'||e.action==='wind'){g.state.avatar.vy=e.action==='wind'?-360:-250;g.state.wingAt=g.time;}},
 step(g,dt){
  const a=g.state.avatar;a.vy+=290*dt;a.y+=a.vy*dt;
  if(a.y>=1110){g.hit();a.y=1080;a.vy=-180;g.state.hitAt=g.time;}
  if(a.y<=90){g.hit();a.y=110;a.vy=100;g.state.hitAt=g.time;}
  a.y=clamp(a.y,90,1110);g.state.distance+=dt*8;
  if(g.time>g.spawnAt){g.spawnAt=g.time+2;g.state.objects.push({id:g.uid(),kind:'portal',z:8,gapY:g.rnd(350,800),gap:g.state.gap,passed:false});}
  for(const o of g.state.objects){o.z-=2*dt;if(o.z<=.7&&!o.passed){o.passed=true;if(Math.abs(a.y-o.gapY)+36>o.gap/2){g.hit();g.state.hitAt=g.time;}else{g.score(10);g.state.passAt=g.time;g.effect(450,a.y-80,'+10');}}}
  g.state.objects=g.state.objects.filter(o=>o.z>.35);
 }
};
export default class extends Arcade {constructor(options){super(meta,rules,options);}}
