import {Arcade} from '../core/arcade.mjs';
import {distance,clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='1000-stairs');
const rules={
 theme:'stairs',hint:'esquerda · direita · impulso',actions:[{id:'left',label:'Subir à esquerda'},{id:'right',label:'Subir à direita'},{id:'boost',label:'Impulso'},{id:'shake',label:'Balançar escada'}],
 reset(g){g.state.steps=Array.from({length:16},()=>g.random()<.5?0:1);g.state.climbed=0;g.state.balance=0;},
 input(g,e,p){if(e.action==='shake'||e.kind==='gift'){g.state.balance=Math.min(1,g.state.balance+.4);return;}if(e.action==='boost'){g.state.climbed+=5;g.score(5,p);return;}const side=e.action==='left'||e.word==='esquerda'?0:1;if(side===g.state.steps[0]){g.state.steps.shift();g.state.steps.push(g.random()<.5?0:1);g.state.climbed++;g.score(1,p);g.state.avatar.x=side?570:330;}else g.hit();if(g.state.climbed>=1000)g.finish(p);},
 step(g,dt){g.state.balance=Math.max(0,g.state.balance-dt*.15);g.state.avatar.y=850+Math.sin(g.time*8)*g.state.balance*20;}
};
export default class extends Arcade {constructor(options){super(meta,rules,options);}}
