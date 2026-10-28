import {Social} from '../core/social.mjs';
import {clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='coin-mint');
const rules={
theme:'coins',actions:[{id:'mint',label:'Cunhar moeda'},{id:'polish',label:'Polir coleção'}],reset(g){g.state.collection=[];g.state.press=0;},
input(g,e,p){if(e.action==='polish'){let changed=0;for(const c of g.state.collection)if(c.owner===p.id&&c.shine<3){c.shine++;c.polishedAt=g.time;changed++;}g.state.message=changed?'Coleção polida!':'Cunhe moedas novas para polir.';if(changed)g.addScore(p,5);return;}g.enqueue({owner:p.id,name:p.name,color:p.color});},
step(g,dt){g.state.press=Math.max(0,g.state.press-dt);if(g.time>=g.nextAt&&g.state.queue.length){const p=g.state.queue.shift();const c={...p,id:g.uid(),year:2026,metal:g.pick(['Cobre','Prata','Ouro']),shine:0,mintedAt:g.time};g.state.collection.push(c);g.state.collection=g.state.collection.slice(-40);g.state.current=c;g.state.press=1;g.state.total++;g.addScore(g.users.get(p.owner),c.metal==='Ouro'?50:10);g.nextAt=g.time+1;}}
};
export default class extends Social {constructor(options){super(meta,rules,options);}}
