import {Arcade} from '../core/arcade.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='lunar-dash');
const collides=(a,o)=>{const x=Math.max(a.x-25,Math.min(o.x,a.x+25)),y=Math.max(a.y-105,Math.min(o.y,a.y+40));return Math.hypot(o.x-x,o.y-y)<o.size;};
const rules={
 theme:'runner',hint:'Salte antes do meteoro · baixa gravidade dura 7 segundos',actions:[{id:'jump',label:'Saltar'},{id:'gravity',label:'Baixa gravidade'},{id:'meteor',label:'Meteoro'}],
 reset(g){Object.assign(g.state.avatar,{x:220,y:960,grounded:true});Object.assign(g.state,{distance:0,lowGravity:false,jumpAt:-10,hitAt:-10});g.lowUntil=0;g.spawnAt=g.time+2;},
 input(g,e){if(e.action==='gravity'){g.lowUntil=g.time+7;g.state.lowGravity=true;}else if(e.action==='meteor'||e.kind==='gift')g.state.objects.push({id:g.uid(),kind:'rock',x:960,y:940,size:35,angle:g.rnd(-1,1)});else if(e.action==='jump'&&g.state.avatar.grounded){g.state.avatar.vy=-420;g.state.avatar.grounded=false;g.state.jumpAt=g.time;}},
 step(g,dt){
  const a=g.state.avatar;g.state.lowGravity=g.time<g.lowUntil;a.vy+=(g.state.lowGravity?220:520)*dt;a.y=Math.min(960,a.y+a.vy*dt);if(a.y===960){a.vy=0;a.grounded=true;}g.state.distance+=dt*75;
  if(g.time>g.spawnAt){g.spawnAt=g.time+g.rnd(1.5,3);g.rules.input(g,{action:'meteor'});}
  for(const o of g.state.objects){o.x-=240*dt;o.angle+=dt*1.7;if(!o.hit&&collides(a,o)){o.hit=true;if(g.time>=g.hurtUntil)g.state.hitAt=g.time;g.hit();}if(!o.scored&&o.x<a.x-50){o.scored=true;if(!o.hit)g.score(5);}}
  g.state.objects=g.state.objects.filter(o=>o.x>-100);g.state.meter=Math.min(1,g.state.distance/5000);if(g.state.distance>=5000)g.finish('O corredor');
 }
};
export default class extends Arcade {constructor(options){super(meta,rules,options);}}
