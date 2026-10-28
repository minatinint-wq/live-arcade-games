import {Quiz} from '../core/quiz.mjs';
import {norm} from '../core/random.mjs';
import {WORDS,QUESTIONS,FLAGS} from '../core/words.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='word-swipe');
const rules={
theme:'swipe',reset(g){g.state.question='Ligue letras vizinhas';g.state.lastPath=[];g.state.pathAt=-10;g.state.grid=['C','A','S','A','M','A','R','O','P','A','T','O','S','O','L','A'];g.targets=['casa','mar','pato','sol','rato','asa'];g.state.clue='CASA · MAR · PATO · SOL · RATO · ASA';},
input(g,e,p){const w=g.guess(e);const grid=g.state.grid.map(norm);const dfs=(i,k,used)=>{if(grid[i]!==w[k]||used.has(i))return false;if(k===w.length-1)return true;const next=new Set([...used,i]);for(let j=0;j<16;j++)if(Math.abs(i%4-j%4)<=1&&Math.abs(Math.floor(i/4)-Math.floor(j/4))<=1&&dfs(j,k+1,next))return true;return false;};if(!g.targets.includes(w)||g.state.found.includes(w)||!grid.some((_,i)=>dfs(i,0,new Set())))return;const path=[];const find=(i,k,used)=>{if(grid[i]!==w[k]||used.has(i))return false;path.push(i);if(k===w.length-1)return true;const next=new Set([...used,i]);for(let j=0;j<16;j++)if(Math.abs(i%4-j%4)<=1&&Math.abs(Math.floor(i/4)-Math.floor(j/4))<=1&&find(j,k+1,next))return true;path.pop();return false;};grid.some((_,i)=>find(i,0,new Set()));g.state.lastPath=path;g.state.pathAt=g.time;g.state.found.push(w);g.addScore(p,w.length*10);g.state.message=p.name+' encontrou '+w;if(g.state.found.length===g.targets.length)g.finish(p);}
};
export default class extends Quiz {constructor(options){super(meta,rules,options);}}
