import {Quiz} from '../core/quiz.mjs';
import {norm} from '../core/random.mjs';
import {WORDS,QUESTIONS,FLAGS} from '../core/words.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='quick-math');
const rules={
theme:'math',duration:25,reset(g){const a=Math.floor(g.rnd(2,20)),b=Math.floor(g.rnd(2,12));const op=g.pick(['+','−','×']);g.answer=op==='+'?a+b:op==='−'?a-b:a*b;g.state.question=a+' '+op+' '+b+' = ?';},
input(g,e,p){const w=g.guess(e);if(!/^-?\d+$/.test(w))return;if(Number(w)===g.answer)g.correct(p,Math.ceil(g.state.remaining)*10);else g.attempt(p,w,'Não é esse resultado');},answer(g){return String(g.answer);}
};
export default class extends Quiz {constructor(options){super(meta,rules,options);}}
