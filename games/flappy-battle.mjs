import {Teams} from '../core/teams.mjs';
import {distance,clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='flappy-battle');
const rules={
 theme:'flappy',actions:[{id:'blue',label:'Azul'},{id:'red',label:'Vermelho'},{id:'boost',label:'Impulsionar'},{id:'hit',label:'Atrapalhar rival'},{id:'steal',label:'Roubar pontos'}],
 reset(g){g.state.objects=[{kind:'bird',team:0,x:240,y:600,vy:0},{kind:'bird',team:1,x:660,y:600,vy:0}];g.state.target=100;},
 input(g,e,p,t,o){if(e.action==='hit')o.score=Math.max(0,o.score-8);else if(e.action==='steal'){const n=Math.min(7,o.score);o.score-=n;t.score+=n;}else{t.score+=e.kind==='gift'?12:4;g.state.objects[p.team].vy=-160;}},
 step(g,dt){for(const b of g.state.objects){b.vy+=220*dt;b.y+=b.vy*dt;if(b.y>760)b.vy=-200;if(b.y<370)b.vy=100;g.state.teams[b.team].score+=dt*.7;if(g.state.teams[b.team].score>=100)g.win(b.team);}g.state.pipeOffset=(g.time*90)%300;}
};
export default class extends Teams {constructor(options){super(meta,rules,options);}}
