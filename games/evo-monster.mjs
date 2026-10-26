import {Arena} from '../core/arena.mjs';
import {distance,clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='evo-monster');
const rules={
 theme:'monster',speed:37,hint:'entrar · experiência · evoluir',
 actions:[{id:'join',label:'Entrar'},{id:'xp',label:'Soltar experiência'},{id:'evolve',label:'Evoluir criatura'}],
 reset(g){g.state.objects=Array.from({length:65},()=>({id:g.uid(),kind:'orb',x:g.rnd(45,855),y:g.rnd(120,1150),size:6}));},
 input(g,e,p){if(e.action==='evolve'||e.kind==='gift')p.xp+=30+e.coins;if(e.action==='xp'||e.kind==='like')for(let i=0;i<8;i++)g.state.objects.push({id:g.uid(),kind:'orb',x:g.rnd(45,855),y:g.rnd(120,1150),size:6});},
 drive(g,p,t,dt){const orb=g.state.objects.sort((a,b)=>distance(p,a)-distance(p,b))[0];const target=orb||t;if(target){const a=Math.atan2(target.y-p.y,target.x-p.x);p.x+=Math.cos(a)*(40+p.level*3)*dt;p.y+=Math.sin(a)*(40+p.level*3)*dt;}},
 actor(g,p){for(let i=g.state.objects.length-1;i>=0;i--)if(distance(p,g.state.objects[i])<p.size+6){g.state.objects.splice(i,1);p.xp+=4;g.addScore(p,4);}const level=1+Math.floor(Math.sqrt(p.xp/12));if(level>p.level){p.level=level;p.hp+=25;p.maxHp+=25;g.effect(p.x,p.y,'NÍVEL '+level);}p.size=18+Math.min(11,p.level)*3;},
 contact(g,a,b){if(a.cooldown<=0){g.damage(b,8*a.level,a);a.cooldown=1;}},
 step(g,dt){if(g.state.objects.length<45&&g.random()<dt*10)g.state.objects.push({id:g.uid(),kind:'orb',x:g.rnd(45,855),y:g.rnd(120,1150),size:6});}
};
export default class extends Arena {constructor(options){super(meta,rules,options);}}
