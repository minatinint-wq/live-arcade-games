import {Social} from '../core/social.mjs';
import {clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='clip-machine');
const rules={
theme:'reaction',actions:[{id:'wow',label:'Surpresa'},{id:'fail',label:'Deu ruim'},{id:'win',label:'Vitória'},{id:'laugh',label:'Risada'}],reset(g){g.state.scene='ready';g.state.line='Qual é a reação do chat?';g.state.sceneAt=g.time;},
input(g,e,p){const map={wow:['Olha isso!','surprise'],fail:['O plano era bom…','oops'],win:['Aí sim, chat!','win'],laugh:['Essa foi boa!','laugh']};let id=e.action;if(!map[id])id=/kkk|haha/.test(e.word)?'laugh':/ganh|boa/.test(e.word)?'win':/ruim|perd/.test(e.word)?'fail':'wow';g.enqueue({owner:p.id,name:p.name,line:map[id][0],scene:map[id][1]});},
step(g){if(g.time>=g.nextAt&&g.state.queue.length){const q=g.state.queue.shift();g.state.scene=q.scene;g.state.line=q.line;g.state.speaker=q.name;g.state.sceneAt=g.time;g.nextAt=g.time+3;g.state.total++;g.addScore(g.users.get(q.owner),10);}}
};
export default class extends Social {constructor(options){super(meta,rules,options);}}
