import {Arena} from '../core/arena.mjs';
import {distance,clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='tank-battle');
const rules={
 theme:'tank',hint:'entrar · melhorar · ataque aéreo · buraco negro',
 actions:[{id:'join',label:'Entrar'},{id:'power',label:'Melhorar tanque'},{id:'heal',label:'Recuperar HP'},{id:'airstrike',label:'Ataque aéreo'},{id:'blackhole',label:'Buraco negro'}],
 input(g,e,p){if(e.action==='power'||e.kind==='gift'){p.power=Math.min(5,p.power+1);p.maxHp+=20;p.hp=Math.min(p.maxHp,p.hp+35);}if(e.action==='heal'||e.kind==='like')p.hp=Math.min(p.maxHp,p.hp+15);if(e.action==='airstrike'){g.state.objects.push({id:g.uid(),kind:'airstrike',x:g.rnd(100,800),y:g.rnd(180,1000),r:130,life:2});}if(e.action==='blackhole')g.state.objects.push({id:g.uid(),kind:'blackhole',x:450,y:600,r:170,life:5});},
 actor(g,p,t,dt){if(t&&p.cooldown<=0){g.shot(p,{damage:10+6*p.power});p.cooldown=1.2/Math.sqrt(p.power);}},
 step(g,dt){for(const o of g.state.objects){o.life-=dt;for(const p of g.users.values()){const d=distance(o,p);if(o.kind==='blackhole'&&d<o.r){p.vx+=(o.x-p.x)*dt*2;p.vy+=(o.y-p.y)*dt*2;}if(o.kind==='airstrike'&&o.life<.2&&d<o.r)g.damage(p,40);}}g.state.objects=g.state.objects.filter(o=>o.life>0);}
};
export default class extends Arena {constructor(options){super(meta,rules,options);}}
