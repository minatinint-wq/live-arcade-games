import {Quiz} from '../core/quiz.mjs';
import {norm} from '../core/random.mjs';
import {WORDS,QUESTIONS,FLAGS} from '../core/words.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='memory-maestro');
const rules={
theme:'memory',actions:[{id:'hint',label:'Espiar os pares'}],reset(g){g.state.question='Encontre os oito pares';g.cards=Array.from({length:16},(_,i)=>i%8);for(let i=15;i>0;i--){const j=Math.floor(g.rnd(0,i+1));[g.cards[i],g.cards[j]]=[g.cards[j],g.cards[i]];}g.state.cards=Array(16).fill(null);g.state.matched=[];g.open=[];g.closeAt=0;g.peekAt=0;g.state.flippedAt=Array(16).fill(-10);g.state.matchedAt=Array(16).fill(-10);},
input(g,e,p){let n=Number(g.guess(e))-1;if(Number.isFinite(e.index))n=Math.floor(e.index);if(n<0||n>=16||!Number.isInteger(n)||g.open.length>=2||g.state.matched.includes(n)||g.open.includes(n))return;g.state.cards[n]=g.cards[n];g.state.flippedAt[n]=g.time;g.open.push(n);if(g.open.length===2){const[a,b]=g.open;if(g.cards[a]===g.cards[b]){g.state.matched.push(a,b);g.state.matchedAt[a]=g.state.matchedAt[b]=g.time;g.addScore(p,30);g.open=[];if(g.state.matched.length===16)g.finish(p);}else g.closeAt=g.time+1.2;}},
step(g){if(g.state.reveal){g.closeAt=0;g.open=[];g.state.cards=[...g.cards];g.state.flippedAt.fill(g.time);g.peekAt=g.time+1.5;g.state.reveal=0;}if(g.peekAt&&g.time>=g.peekAt){g.peekAt=0;g.state.cards=g.cards.map((v,i)=>g.state.matched.includes(i)?v:null);g.open=[];}if(g.closeAt&&g.time>=g.closeAt){for(const n of g.open)if(!g.state.matched.includes(n))g.state.cards[n]=null;g.open=[];g.closeAt=0;g.peekAt=0;g.state.flippedAt=Array(16).fill(-10);g.state.matchedAt=Array(16).fill(-10);}}
};
export default class extends Quiz {constructor(options){super(meta,rules,options);}}
