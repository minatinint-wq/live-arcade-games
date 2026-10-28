import {Arena} from '../core/arena.mjs';
import {distance,clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='slap-arena');
const rules={
 theme:'sumo',openBounds:true,noRespawn:true,hint:'entrar · tapa · firmar',
 actions:[{id:'join',label:'Entrar'},{id:'slap',label:'Dar tapa'},{id:'brace',label:'Firmar os pés'}],
 reset(g){for(const p of g.users.values()){p.x=g.rnd(300,600);p.y=g.rnd(400,800);}g.state.ring={x:450,y:600,r:350};},
 input(g,e,p){if(e.action==='slap'||e.kind==='gift'){p.power=Math.min(5,p.power+1);p.cooldown=0;}if(e.action==='brace')p.braced=g.time+4;},
 contact(g,a,b){if(a.cooldown>0)return;const angle=Math.atan2(b.y-a.y,b.x-a.x),force=(a.power||1)*170/(b.braced>g.time?3:1);b.vx+=Math.cos(angle)*force;b.vy+=Math.sin(angle)*force;a.cooldown=1.6;a.attackAt=g.time;g.effect(b.x,b.y,'TAPA!');},
 actor(g,p){if(Math.hypot(p.x-450,p.y-600)>350){g.damage(p,10000);g.note(p.name+' caiu da arena');}const alive=[...g.users.values()].filter(q=>q.alive);if(g.time-g.roundAt>3&&alive.length===1)g.finish(alive[0]);}
};
export default class extends Arena {constructor(options){super(meta,rules,options);}}
