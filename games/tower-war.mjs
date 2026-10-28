import {Teams} from '../core/teams.mjs';
import {distance,clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='tower-war');
const rules={
 theme:'tower',actions:[{id:'blue',label:'Azul'},{id:'red',label:'Vermelho'},{id:'build',label:'Construir'},{id:'attack',label:'Lançar pedra'},{id:'shield',label:'Escudo'}],
 reset(g){for(const t of g.state.teams){t.floors=5;t.shield=0;t.hp=25;}g.autoAt=g.time+6;},
 input(g,e,p,t,o){if(e.action==='attack'){g.unit('rock',p.team,{x:p.team?640:260,y:900,life:1,at:g.time,damage:e.kind==='gift'?3:1,hit:false,target:1-p.team});}else if(e.action==='shield')t.shield=Math.min(5,t.shield+1);else{t.floors=Math.min(20,t.floors+(e.kind==='gift'?2:1));t.buildAt=g.time;}},
 step(g,dt){for(const o of g.state.objects){o.life-=dt;const a=Math.min(1,(1-o.life)/.75),start=o.team?640:260,end=o.team?260:640,target=g.state.teams[o.target];o.x=start+(end-start)*a;o.y=900+(1130-target.floors*38-900)*a-Math.sin(a*Math.PI)*200;if(a>=1&&!o.hit){o.hit=true;const blocked=Math.min(target.shield,o.damage);target.shield-=blocked;target.floors=Math.max(0,target.floors-o.damage+blocked);target.hitAt=g.time;}}
  g.state.objects=g.state.objects.filter(o=>o.life>0);for(const t of g.state.teams){t.score=t.floors;t.hp=t.floors*5;if(t.floors===0)g.win(1-t.id);if(t.floors>=20)g.win(t.id);}if(g.time>g.autoAt){g.autoAt=g.time+6;const t=g.state.teams[g.random()<.5?0:1];t.floors=Math.min(20,t.floors+1);t.buildAt=g.time;}}

};
export default class extends Teams {constructor(options){super(meta,rules,options);}}
