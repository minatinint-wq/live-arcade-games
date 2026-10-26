import {Arcade} from '../core/arcade.mjs';
import {distance,clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='flappy-3d');
const rules={
 theme:'pig3d',hint:'pular · corrente de ar · apertar portal',actions:[{id:'jump',label:'Bater asas'},{id:'wind',label:'Corrente de ar'},{id:'narrow',label:'Apertar portal'}],
 reset(g){g.state.avatar.y=600;g.spawnAt=g.time;g.state.distance=0;g.state.gap=310;},
 input(g,e){if(e.action==='narrow'||e.kind==='gift')g.state.gap=Math.max(160,g.state.gap-20);else g.state.avatar.vy=e.action==='wind'?-360:-250;},
 step(g,dt){const a=g.state.avatar;a.vy+=290*dt;a.y=clamp(a.y+a.vy*dt,90,1110);if(a.y>=1110){g.hit();a.y=600;a.vy=-100;}g.state.distance+=dt*8;if(g.time>g.spawnAt){g.spawnAt=g.time+2;g.state.objects.push({id:g.uid(),kind:'portal',z:8,gapY:g.rnd(350,800),gap:g.state.gap,passed:false});}for(const o of g.state.objects){o.z-=2*dt;if(o.z<.7&&!o.passed){o.passed=true;if(Math.abs(a.y-o.gapY)>o.gap/2)g.hit();else g.score(10);}}g.state.objects=g.state.objects.filter(o=>o.z>-.2);}
};
export default class extends Arcade {constructor(options){super(meta,rules,options);}}
