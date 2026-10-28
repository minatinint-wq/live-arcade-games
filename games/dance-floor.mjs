import {Social} from '../core/social.mjs';
import {clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='dance-floor');
const rules={
theme:'floor',actions:[{id:'blue',label:'Equipe Azul'},{id:'red',label:'Equipe Vermelha'},{id:'step',label:'Conquistar piso'},{id:'sync',label:'Passo sincronizado'}],reset(g){g.state.tiles=Array(64).fill(-1);g.state.tileAt=Array(64).fill(-10);g.state.teams=[{name:'Azul',score:0,color:'#59aaff'},{name:'Vermelho',score:0,color:'#ff666d'}];g.state.combo=[0,0];g.lastStep=[-10,-10];},
input(g,e,p){if(e.action==='blue'||e.word==='azul')p.team=0;if(e.action==='red'||e.word==='vermelho')p.team=1;const t=p.team,n=g.time-g.lastStep[t];g.state.combo[t]=n>.35&&n<.9?Math.min(8,g.state.combo[t]+1):1;g.lastStep[t]=g.time;const count=e.action==='sync'?g.state.combo[t]+1:1;for(let i=0;i<count;i++){const candidates=g.state.tiles.map((v,n)=>v!==t?n:-1).filter(n=>n>=0);if(candidates.length){const cell=g.pick(candidates);g.state.tiles[cell]=t;g.state.tileAt[cell]=g.time;}}for(let i=0;i<2;i++)g.state.teams[i].score=g.state.tiles.filter(v=>v===i).length;g.addScore(p,count*5);if(g.state.teams[t].score>=48)g.finish(g.state.teams[t].name);},
step(g){g.state.pulse=(Math.sin(g.time*Math.PI*4)+1)/2;}
};
export default class extends Social {constructor(options){super(meta,rules,options);}}
