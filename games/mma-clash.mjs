import {Teams} from '../core/teams.mjs';
import {distance,clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='mma-clash');
const rules={
 theme:'mma',actions:[{id:'blue',label:'Canto Azul'},{id:'red',label:'Canto Vermelho'},{id:'punch',label:'Soco'},{id:'kick',label:'Chute'},{id:'guard',label:'Defender'},{id:'rest',label:'Recuperar'}],
 reset(g){for(const t of g.state.teams){t.stamina=100;t.guard=0;t.combo=0;}g.punchAt=g.time+2;},
 input(g,e,p,t,o){if(e.action==='guard'){t.guard=3;return;}if(e.action==='rest'){t.stamina=Math.min(100,t.stamina+20);return;}const cost=e.action==='kick'?20:10;if(t.stamina<cost)return;t.stamina-=cost;const damage=(e.action==='kick'?20:10)*(o.guard>0?.3:1);o.hp=Math.max(0,o.hp-damage);o.hitAt=g.time;t.attackAt=g.time;t.lastAttack=e.action==='kick'?'kick':'punch';t.score+=damage;t.combo++;g.state.lastMove={team:p.team,move:e.action==='kick'?'kick':'punch',at:g.time};if(o.hp===0)g.win(p.team);},
 step(g,dt){for(const t of g.state.teams){t.guard=Math.max(0,t.guard-dt);t.stamina=Math.min(100,t.stamina+5*dt);}if(g.time>g.punchAt){g.punchAt=g.time+2;const i=g.random()<.5?0:1,p={team:i};g.rules.input(g,{action:'punch'},p,g.state.teams[i],g.state.teams[1-i]);}}
};
export default class extends Teams {constructor(options){super(meta,rules,options);}}
