import {Arcade} from '../core/arcade.mjs';
import {distance,clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='window-wipe');
const rules={
 theme:'window',hint:'Clique para limpar · manchar · balde',actions:[{id:'wipe',label:'Passar rodo'},{id:'dirty',label:'Manchar'},{id:'bucket',label:'Balde de água'}],
 reset(g){g.state.dirt=Array.from({length:80},()=>g.rnd(.35,1));g.state.focus=0;},
 input(g,e,p){if(e.action==='dirty'||e.kind==='gift'){for(let n=0;n<9;n++)g.state.dirt[Math.floor(g.rnd(0,80))]=1;return;}if(e.action==='bucket'){g.state.dirt=g.state.dirt.map(d=>Math.max(0,d-.22));return;}let index=g.state.focus;if(Number.isFinite(e.x)&&Number.isFinite(e.y))index=clamp(Math.floor(e.y/1200*10),0,9)*8+clamp(Math.floor(e.x/900*8),0,7);for(const offset of [0,1,8,9]){const i=index+offset;if(i<80)g.state.dirt[i]=Math.max(0,g.state.dirt[i]-.7);}g.state.focus=(index+2)%80;g.score(1,p);},
 step(g){g.state.meter=1-g.state.dirt.reduce((a,b)=>a+b,0)/80;if(g.state.meter>.97)g.finish('A limpeza');}
};
export default class extends Arcade {constructor(options){super(meta,rules,options);}}
