import {Arena} from '../core/arena.mjs';
import {distance,clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='chainsaw-clash');
const rules={
 theme:'chainsaw',openBounds:true,noRespawn:true,hint:'entrar · alcance · proteção',
 actions:[{id:'join',label:'Entrar'},{id:'range',label:'Aumentar alcance'},{id:'shield',label:'Proteção'}],
 reset(g){g.state.ring={x:450,y:620,r:430};},
 input(g,e,p){if(e.action==='range'||e.kind==='gift')p.power=Math.min(6,p.power+1);if(e.action==='shield')p.hp=Math.min(p.maxHp,p.hp+50);},
 actor(g,p,t,dt){g.state.ring.r=Math.max(100,430-(g.time-g.roundAt)*2.6);p.bladeAngle=g.time*4+p.color;if(distance(p,g.state.ring)>g.state.ring.r)g.damage(p,dt*20);if(t&&distance(p,t)<p.size+t.size+20+p.power*4&&p.cooldown<=0){g.damage(t,10+4*p.power,p);p.cooldown=.6;}const alive=[...g.users.values()].filter(q=>q.alive);if(alive.length===1&&g.time-g.roundAt>3)g.finish(alive[0]);},
 drive(g,p,t,dt){const outside=distance(p,g.state.ring)>g.state.ring.r-25,target=outside?g.state.ring:t;if(target){const a=Math.atan2(target.y-p.y,target.x-p.x);p.x+=Math.cos(a)*70*dt;p.y+=Math.sin(a)*70*dt;}}
};
export default class extends Arena {constructor(options){super(meta,rules,options);}}
