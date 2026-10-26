import {Teams} from '../core/teams.mjs';
import {distance,clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='battle-arena');
const rules={
 theme:'army',actions:[{id:'blue',label:'Azul'},{id:'red',label:'Vermelho'},{id:'warrior',label:'Guerreiro'},{id:'healer',label:'Curandeiro'},{id:'mage',label:'Mago'}],
 reset(g){g.spawnAt=g.time;},input(g,e,p){g.unit(['healer','mage'].includes(e.action)?e.action:'warrior',p.team,{x:g.rnd(140,760),damage:e.action==='mage'?20:12});},
 step(g,dt){if(g.time>g.spawnAt){g.spawnAt=g.time+4;g.unit('warrior',0,{x:g.rnd(160,740)});g.unit('warrior',1,{x:g.rnd(160,740)});}for(const u of g.state.objects){u.cooldown-=dt;const targets=g.state.objects.filter(t=>t.team!==u.team&&t.hp>0).sort((a,b)=>distance(u,a)-distance(u,b));const target=targets[0];if(u.kind==='healer'){const ally=g.state.objects.find(a=>a.team===u.team&&a.hp<35);if(ally&&u.cooldown<=0){ally.hp=Math.min(60,ally.hp+10);u.cooldown=2;}}else if(target&&distance(u,target)<(u.kind==='mage'?170:45)){if(u.cooldown<=0){target.hp-=u.damage||12;u.cooldown=1;}}else{u.y+=(u.team?1:-1)*u.speed*dt;if(u.y<100||u.y>1100){g.state.teams[1-u.team].hp-=8;u.hp=0;}}}for(const u of g.state.objects.filter(u=>u.hp<=0))g.state.teams[1-u.team].score++;g.state.objects=g.state.objects.filter(u=>u.hp>0);for(const t of g.state.teams)if(t.hp<=0)g.win(1-t.id);}
};
export default class extends Teams {constructor(options){super(meta,rules,options);}}
