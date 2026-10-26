import {Social} from '../core/social.mjs';
import {clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='dance-party');
const rules={
theme:'dance',actions:[{id:'join',label:'Entrar na festa'},{id:'spin',label:'Girar'},{id:'fast',label:'Acelerar ritmo'},{id:'slow',label:'Diminuir ritmo'}],reset(g){g.state.bpm=110;g.state.spotlight=0;g.danceSlots=new Map();for(const p of g.users.values())p.dancing=false;},
input(g,e,p){if(e.action==='fast'||e.kind==='gift')g.state.bpm=clamp(g.state.bpm+10,60,180);if(e.action==='slow')g.state.bpm=clamp(g.state.bpm-10,60,180);if(!g.danceSlots.has(p.id)){let slot=g.danceSlots.size;if(slot>=18){const oldest=g.danceSlots.keys().next().value;slot=g.danceSlots.get(oldest);g.users.get(oldest).dancing=false;g.danceSlots.delete(oldest);}g.danceSlots.set(p.id,slot);}const slot=g.danceSlots.get(p.id);p.dancing=true;if(e.action==='spin')p.spinUntil=g.time+3;p.x=125+(slot%6)*130;p.y=460+Math.floor(slot/6)*180;g.addScore(p,5);},
step(g,dt){g.state.spotlight=(g.state.spotlight+dt*.5)%(Math.PI*2);for(const p of g.users.values())if(p.dancing)p.pose=Math.sin(g.time*g.state.bpm/60*Math.PI*2+p.color);}
};
export default class extends Social {constructor(options){super(meta,rules,options);}}
