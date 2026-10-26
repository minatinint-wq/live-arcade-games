import {Quiz} from '../core/quiz.mjs';
import {norm} from '../core/random.mjs';
import {WORDS,QUESTIONS,FLAGS} from '../core/words.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='guess-the-number');
const rules={
theme:'number',reset(g){g.answer=Math.floor(g.rnd(1,101));g.state.low=1;g.state.high=100;g.state.question='Qual é o número secreto?';g.state.clue='Entre 1 e 100';},
input(g,e,p){const w=g.guess(e);if(!/^\d+$/.test(w))return;const n=Number(w);if(n<g.state.low||n>g.state.high){g.state.message='Escolha dentro do intervalo.';return;}if(n===g.answer)g.correct(p);else{if(n<g.answer)g.state.low=n+1;else g.state.high=n-1;g.attempt(p,w,n<g.answer?'MAIOR':'MENOR');g.state.clue='Entre '+g.state.low+' e '+g.state.high;}},answer(g){return String(g.answer);}
};
export default class extends Quiz {constructor(options){super(meta,rules,options);}}
