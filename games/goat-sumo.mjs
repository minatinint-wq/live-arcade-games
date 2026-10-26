import {Teams} from '../core/teams.mjs';
import {distance,clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='goat-sumo');
const rules={
 theme:'goat',actions:[{id:'blue',label:'Equipe Azul'},{id:'red',label:'Equipe Vermelha'},{id:'push',label:'Empurrar'},{id:'heavy',label:'Cabra pesada'}],
 reset(g){g.unit('goat',0,{x:370,y:650,vx:0});g.unit('goat',1,{x:530,y:650,vx:0});g.state.ring={x:450,y:650,r:320};},
 input(g,e,p,t){if(e.action==='push'||e.kind==='like'||e.kind==='gift')t.score+=e.kind==='gift'?10:3;if(e.action==='heavy')t.score+=14;},
 step(g,dt){const [a,b]=g.state.objects;a.x+=(g.state.teams[0].score-g.state.teams[1].score)*dt*2;b.x=a.x+160;for(const t of g.state.teams)t.score*=Math.pow(.8,dt);if(a.x<110)g.win(1);if(b.x>790)g.win(0);}
};
export default class extends Teams {constructor(options){super(meta,rules,options);}}
