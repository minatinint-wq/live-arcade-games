import {Social} from '../core/social.mjs';
import {clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='card-factory');
const rules={
theme:'cards',actions:[{id:'print',label:'Criar carta'},{id:'upgrade',label:'Combinar cartas'}],
reset(g){g.state.album=[];},
input(g,e,p){if(e.action==='upgrade'){const cards=g.state.album.filter(c=>c.owner===p.id&&c.level===1);if(cards.length>=3){const ids=new Set(cards.slice(0,3).map(c=>c.id));g.state.album=g.state.album.filter(c=>!ids.has(c.id));g.state.album.push({id:g.uid(),owner:p.id,name:p.name,color:p.color,level:2,rarity:'Lendária',power:100});g.state.message='Três cartas combinadas!';g.addScore(p,100);}else g.state.message='Junte três cartas suas para combinar.';return;}g.enqueue({owner:p.id,name:p.name,color:p.color});},
step(g){if(g.time>=g.nextAt&&g.state.queue.length){const p=g.state.queue.shift(),r=g.rnd();const card={...p,id:g.uid(),rarity:r<.12?'Épica':r<.4?'Rara':'Comum',power:Math.floor(g.rnd(20,100)),level:1};g.state.album.push(card);g.state.album=g.state.album.slice(-24);g.state.current=card;g.state.total++;g.nextAt=g.time+1.3;g.addScore(g.users.get(p.owner),card.power);}}
};
export default class extends Social {constructor(options){super(meta,rules,options);}}
