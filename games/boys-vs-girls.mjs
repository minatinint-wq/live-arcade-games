import {Teams} from '../core/teams.mjs';
import {distance,clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='boys-vs-girls');
const rules={
 theme:'tug',actions:[{id:'blue',label:'Equipe Azul'},{id:'red',label:'Equipe Vermelha'},{id:'pull',label:'Puxar'},{id:'rally',label:'União da equipe'}],
 reset(g){g.state.rope=0;g.force=[0,0];},input(g,e,p,t){g.force[p.team]+=e.action==='rally'?18:e.kind==='gift'?10:4;g.addScore(p,1);},
 step(g,dt){g.state.rope+=(g.force[0]-g.force[1])*dt*.05;for(let i=0;i<2;i++){g.force[i]*=Math.pow(.55,dt);g.state.teams[i].score=Math.max(0,50+(i?-1:1)*g.state.rope*50);}if(g.state.rope>=1)g.win(0);if(g.state.rope<=-1)g.win(1);}
};
export default class extends Teams {constructor(options){super(meta,rules,options);}}
