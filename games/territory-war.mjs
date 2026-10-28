import {Teams} from '../core/teams.mjs';
import {distance,clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='territory-war');
const rules={
 theme:'territory',actions:[{id:'blue',label:'Azul'},{id:'red',label:'Vermelho'},{id:'claim',label:'Conquistar'},{id:'fortify',label:'Fortificar'}],
 reset(g){g.state.cells=Array.from({length:81},(_,i)=>({x:i%9,y:Math.floor(i/9),team:i<9?0:i>=72?1:-1,shield:0}));},
 input(g,e,p,t){const cells=g.state.cells;if(e.action==='fortify'){for(const c of cells.filter(c=>c.team===p.team))c.shield=Math.min(3,c.shield+1);return;}const owned=cells.filter(c=>c.team===p.team),front=cells.filter(c=>c.team!==p.team&&owned.some(o=>Math.abs(o.x-c.x)+Math.abs(o.y-c.y)===1));for(let n=0;n<(e.kind==='gift'?4:1)&&front.length;n++){const c=front.splice(Math.floor(g.random()*front.length),1)[0];if(c.shield)c.shield--;else c.team=p.team;c.changedAt=g.time;}},
 step(g){for(const t of g.state.teams){t.score=g.state.cells.filter(c=>c.team===t.id).length;if(t.score>=65)g.win(t.id);}}
};
export default class extends Teams {constructor(options){super(meta,rules,options);}}
