import {Teams} from '../core/teams.mjs';
import {distance,clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='tower-war');
const rules={
 theme:'tower',actions:[{id:'blue',label:'Azul'},{id:'red',label:'Vermelho'},{id:'build',label:'Construir'},{id:'attack',label:'Lançar pedra'},{id:'shield',label:'Escudo'}],
 reset(g){for(const t of g.state.teams){t.floors=5;t.shield=0;}g.autoAt=g.time;},
 input(g,e,p,t,o){if(e.action==='attack'){const damage=e.kind==='gift'?3:1;const blocked=Math.min(o.shield,damage);o.shield-=blocked;o.floors=Math.max(0,o.floors-damage+blocked);g.unit('rock',p.team,{x:p.team?640:260,y:700,life:1});}else if(e.action==='shield')t.shield=Math.min(5,t.shield+1);else t.floors=Math.min(20,t.floors+(e.kind==='gift'?2:1));},
 step(g,dt){for(const o of g.state.objects){o.life-=dt;o.x+=(o.team?-350:350)*dt;o.y-=100*dt;}g.state.objects=g.state.objects.filter(o=>o.life>0);for(const t of g.state.teams){t.score=t.floors;if(t.floors===0)g.win(1-t.id);if(t.floors>=20)g.win(t.id);}if(g.time>g.autoAt){g.autoAt=g.time+6;g.state.teams[g.random()<.5?0:1].floors++;}}
};
export default class extends Teams {constructor(options){super(meta,rules,options);}}
