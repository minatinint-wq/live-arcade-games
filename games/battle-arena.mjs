import {Teams} from '../core/teams.mjs';
import {distance,clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='battle-arena');
function move(u,target,dt){const d=distance(u,target);if(d<1)return;u.x+=(target.x-u.x)/d*u.speed*dt;u.y+=(target.y-u.y)/d*u.speed*dt;}
const rules={
 theme:'army',actions:[{id:'blue',label:'Azul'},{id:'red',label:'Vermelho'},{id:'warrior',label:'Guerreiro'},{id:'healer',label:'Curandeiro'},{id:'mage',label:'Mago'}],
 reset(g){g.spawnAt=g.time;g.state.spells=[];},input(g,e,p){const kind=['healer','mage'].includes(e.action)?e.action:'warrior';g.unit(kind,p.team,{x:g.rnd(140,760),maxHp:35,damage:kind==='mage'?20:12});},
 step(g,dt){if(g.time>g.spawnAt){g.spawnAt=g.time+4;g.unit('warrior',0,{x:g.rnd(160,740),maxHp:35});g.unit('warrior',1,{x:g.rnd(160,740),maxHp:35});}
  for(const u of g.state.objects){if(u.hp<=0)continue;u.cooldown-=dt;const target=g.state.objects.filter(t=>t.team!==u.team&&t.hp>0).sort((a,b)=>distance(u,a)-distance(u,b))[0];
   if(u.kind==='healer'){const ally=g.state.objects.filter(a=>a!==u&&a.team===u.team&&a.hp>0&&a.hp<(a.maxHp||35)).sort((a,b)=>distance(u,a)-distance(u,b))[0];if(ally&&distance(u,ally)<160){if(u.cooldown<=0){ally.hp=Math.min(ally.maxHp||35,ally.hp+10);u.cooldown=2;u.attackAt=g.time;g.state.spells.push({kind:'heal',x:u.x,y:u.y,tx:ally.x,ty:ally.y,at:g.time,team:u.team});}}else{const leader=g.state.objects.filter(a=>a!==u&&a.team===u.team&&a.kind!=='healer'&&a.hp>0).sort((a,b)=>u.team?b.y-a.y:a.y-b.y)[0];move(u,ally||{x:leader?.x||450,y:leader?leader.y+(u.team?-110:110):650},dt);}}
   else if(target&&distance(u,target)<(u.kind==='mage'?170:54)){if(u.cooldown<=0){target.hp-=u.damage||12;target.hitAt=g.time;u.cooldown=1;u.attackAt=g.time;g.state.spells.push({kind:u.kind==='mage'?'magic':'hit',x:u.x,y:u.y,tx:target.x,ty:target.y,at:g.time,team:u.team});}}
   else{move(u,target||{x:u.x,y:u.team?1150:50},dt);if(u.y<100||u.y>1100){g.state.teams[1-u.team].hp=Math.max(0,g.state.teams[1-u.team].hp-8);u.hp=0;}}
  }
  for(const u of g.state.objects.filter(u=>u.hp<=0))g.state.teams[1-u.team].score++;g.state.objects=g.state.objects.filter(u=>u.hp>0);g.state.spells=g.state.spells.filter(s=>g.time-s.at<.45).slice(-40);for(const t of g.state.teams)if(t.hp<=0)g.win(1-t.id);
 }
};
export default class extends Teams {constructor(options){super(meta,rules,options);}}
