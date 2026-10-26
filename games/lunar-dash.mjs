import {Arcade} from '../core/arcade.mjs';
import {distance,clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='lunar-dash');
const rules={
 theme:'runner',hint:'saltar · gravidade · meteoro',actions:[{id:'jump',label:'Saltar'},{id:'gravity',label:'Baixa gravidade'},{id:'meteor',label:'Meteoro'}],
 reset(g){g.state.avatar.x=220;g.state.avatar.y=960;g.state.distance=0;g.lowUntil=0;g.spawnAt=g.time+2;},
 input(g,e){if(e.action==='gravity')g.lowUntil=g.time+7;else if(e.action==='meteor'||e.kind==='gift')g.state.objects.push({id:g.uid(),kind:'rock',x:960,y:940,size:35});else if(g.state.avatar.y>=950)g.state.avatar.vy=-420;},
 step(g,dt){const a=g.state.avatar;a.vy+=(g.time<g.lowUntil?220:520)*dt;a.y=Math.min(960,a.y+a.vy*dt);if(a.y===960)a.vy=0;g.state.distance+=dt*75;if(g.time>g.spawnAt){g.spawnAt=g.time+g.rnd(1.5,3);g.rules.input(g,{action:'meteor'});}for(const o of g.state.objects){o.x-=240*dt;if(!o.hit&&distance(o,a)<o.size+25){o.hit=true;g.hit();}if(!o.scored&&o.x<a.x-50){o.scored=true;g.score(5);}}g.state.objects=g.state.objects.filter(o=>o.x>-100);g.state.meter=Math.min(1,g.state.distance/5000);if(g.state.distance>=5000)g.finish('O corredor');}
};
export default class extends Arcade {constructor(options){super(meta,rules,options);}}
