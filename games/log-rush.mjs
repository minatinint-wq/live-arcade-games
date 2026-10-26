import {Arcade} from '../core/arcade.mjs';
import {distance,clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='log-rush');
const rules={
 theme:'tree',hint:'esquerda · direita · galho extra',actions:[{id:'left',label:'Cortar à esquerda'},{id:'right',label:'Cortar à direita'},{id:'branch',label:'Adicionar galho'}],
 reset(g){g.state.branches=Array.from({length:12},(_,i)=>i%3===0?Math.floor(g.rnd(0,2)):-1);g.state.avatar.x=270;g.state.energy=1;},
 input(g,e,p){if(e.action==='branch'||e.kind==='gift'){g.state.branches[1]=g.random()<.5?0:1;return;}const side=e.action==='left'||e.word==='esquerda'?0:1;g.state.avatar.x=side?630:270;if(g.state.branches[0]===side){g.hit();g.state.energy=Math.min(1,g.state.energy+.1);}else{g.score(1,p);g.state.energy=Math.min(1,g.state.energy+.09);}g.state.branches.shift();g.state.branches.push(g.random()<.45?Math.floor(g.rnd(0,2)):-1);},
 step(g,dt){g.state.energy=Math.max(0,g.state.energy-dt*.025);g.state.meter=g.state.energy;if(g.state.energy<=0)g.hit();}
};
export default class extends Arcade {constructor(options){super(meta,rules,options);}}
