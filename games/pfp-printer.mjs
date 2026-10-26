import {Social} from '../core/social.mjs';
import {clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='pfp-printer');
const rules={
theme:'printer',actions:[{id:'print',label:'Imprimir retrato'},{id:'color',label:'Trocar moldura'}],reset(g){g.state.wall=[];g.state.ink=0;},
input(g,e,p){if(e.action==='color'){p.color=(p.color+60)%360;return;}g.enqueue({owner:p.id,name:p.name,color:p.color});},
step(g){if(g.time>=g.nextAt&&g.state.queue.length){const p=g.state.queue.shift();g.state.current={...p,id:g.uid(),printedAt:g.time};g.state.wall.push(g.state.current);g.state.wall=g.state.wall.slice(-12);g.state.ink=(g.state.ink+1)%4;g.state.total++;g.addScore(g.users.get(p.owner),10);g.nextAt=g.time+2;}}
};
export default class extends Social {constructor(options){super(meta,rules,options);}}
