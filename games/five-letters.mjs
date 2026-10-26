import {Quiz} from '../core/quiz.mjs';
import {norm} from '../core/random.mjs';
import {WORDS,QUESTIONS,FLAGS} from '../core/words.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='five-letters');
const rules={
theme:'letters5',reset(g){g.target=g.pick(WORDS)[0];g.state.question='Uma palavra. Cinco letras.';g.state.rows=[];},
input(g,e,p){const w=g.guess(e);if(!/^[a-z]{5}$/.test(w)){g.state.message='Envie exatamente cinco letras.';return;}const result=Array(5).fill(0),remaining=g.target.split('');for(let i=0;i<5;i++)if(w[i]===remaining[i]){result[i]=2;remaining[i]='';}for(let i=0;i<5;i++)if(result[i]!==2){const j=remaining.indexOf(w[i]);if(j>=0){result[i]=1;remaining[j]='';}}g.state.rows.push({word:w,result});g.state.rows=g.state.rows.slice(-6);if(w===g.target)g.correct(p);else if(g.state.rows.length===6){g.state.message='A palavra era '+g.target;g.finish('Fim das tentativas');}},answer(g){return g.target;}
};
export default class extends Quiz {constructor(options){super(meta,rules,options);}}
