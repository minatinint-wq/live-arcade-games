import {Teams} from '../core/teams.mjs';
import {distance,clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='bridge-brawl');
const rules={
 theme:'bridge',actions:[{id:'blue',label:'Azul'},{id:'red',label:'Vermelho'},{id:'soldier',label:'Soldado'},{id:'archer',label:'Arqueiro'},{id:'giant',label:'Gigante'}],
 reset(g){g.spawnAt=0;g.state.towers=[{x:450,y:110,hp:300,team:1},{x:450,y:1090,hp:300,team:0}];},
 input(g,e,p){const kind=['soldier','archer','giant'].includes(e.action)?e.action:e.kind==='gift'?'giant':'soldier';g.unit(kind,p.team,{x:g.pick([250,650]),hp:kind==='giant'?110:kind==='archer'?28:45,speed:kind==='giant'?30:55,damage:kind==='giant'?25:kind==='archer'?12:16});},
 step(g,dt){if(g.time>g.spawnAt){g.spawnAt=g.time+3.5;for(let t=0;t<2;t++)g.unit('soldier',t,{x:g.pick([250,650]),damage:12});}for(const u of g.state.objects){u.cooldown-=dt;const enemy=g.state.objects.find(o=>o.team!==u.team&&o.hp>0&&Math.abs(o.x-u.x)<80&&Math.abs(o.y-u.y)<(u.kind==='archer'?150:48));if(enemy){if(u.cooldown<=0){enemy.hp-=u.damage||12;u.cooldown=1;}}else{u.y+=(u.team?-1:1)*-u.speed*dt;const tower=g.state.towers.find(t=>t.team!==u.team);if(Math.abs(u.y-tower.y)<65&&u.cooldown<=0){tower.hp-=u.damage||12;u.cooldown=1;if(tower.hp<=0)g.win(u.team);}}}g.state.objects=g.state.objects.filter(u=>u.hp>0&&u.y>50&&u.y<1150);for(const t of g.state.teams)t.score=300-g.state.towers.find(x=>x.team!==t.id).hp;}
};
export default class extends Teams {constructor(options){super(meta,rules,options);}}
