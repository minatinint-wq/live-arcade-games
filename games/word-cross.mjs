import {Quiz} from '../core/quiz.mjs';
import {norm} from '../core/random.mjs';
import {WORDS,QUESTIONS,FLAGS} from '../core/words.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='word-cross');
const rules={
theme:'cross',reset(g){g.state.question='Complete a cruzadinha';g.entries=[{word:'CASA',clue:'1. Lugar de morar',x:1,y:2,dx:1,dy:0},{word:'SAPO',clue:'2. Anfíbio que pula',x:3,y:2,dx:0,dy:1},{word:'PATO',clue:'3. Ave que nada',x:3,y:4,dx:1,dy:0}];g.state.entries=g.entries.map(({word,...entry})=>({...entry,length:word.length,solved:false}));g.state.grid=Array(49).fill(null);for(const v of g.entries)for(let i=0;i<v.word.length;i++)g.state.grid[(v.y+i*v.dy)*7+v.x+i*v.dx]='';g.state.clue=g.entries.map(v=>v.clue).join(' • ');},
input(g,e,p){const w=g.guess(e).toUpperCase(),n=g.entries.findIndex(v=>v.word===w);if(n<0||g.state.entries[n].solved)return;const v=g.entries[n];g.state.entries[n].solved=true;for(let i=0;i<w.length;i++)g.state.grid[(v.y+i*v.dy)*7+v.x+i*v.dx]=w[i];g.addScore(p,50);if(g.state.entries.every(v=>v.solved))g.finish(p);}
};
export default class extends Quiz {constructor(options){super(meta,rules,options);}}
