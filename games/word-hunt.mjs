import {Quiz} from '../core/quiz.mjs';
import {norm} from '../core/random.mjs';
import {WORDS,QUESTIONS,FLAGS} from '../core/words.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='word-hunt');
const rules={
theme:'hunt',reset(g){g.state.question='Encontre quatro palavras';g.state.grid=Array.from({length:100},()=>g.pick('ABCDEFGHIJKLMNOPQRSTUVWXYZ'));g.targets=['LUA','VENTO','SOL','MAR'];g.lines=[];for(let n=0;n<4;n++){const w=g.targets[n],start=n===3?19:n*20+1,step=n===3?10:n===2?11:1;g.lines.push({word:w,start,step});for(let i=0;i<w.length;i++)g.state.grid[start+i*step]=w[i];}g.state.clue=g.targets.join(' · ');},
input(g,e,p){const w=g.guess(e).toUpperCase();if(g.targets.includes(w)&&!g.state.found.includes(w)){g.state.found.push(w);g.state.objects.push({...g.lines.find(l=>l.word===w),at:g.time});g.addScore(p,40);if(g.state.found.length===4)g.finish(p);}}
};
export default class extends Quiz {constructor(options){super(meta,rules,options);}}
