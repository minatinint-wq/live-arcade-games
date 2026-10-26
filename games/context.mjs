import {Quiz} from '../core/quiz.mjs';
import {norm} from '../core/random.mjs';
import {WORDS,QUESTIONS,FLAGS} from '../core/words.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='context');
const rules={
theme:'context',reset(g){g.target=g.pick(WORDS);g.state.question='Qual é a palavra secreta?';g.state.clue=g.target[1];},
input(g,e,p){const w=g.guess(e);if(!w)return;const score=w===g.target[0]?100:g.target[2].includes(w)?80:Math.min(40,[...w].filter(c=>g.target[0].includes(c)).length*5);g.attempt(p,w,score);if(score===100)g.correct(p);else g.state.message=score>=80?'Quente! Relação prevista no banco de pistas.':'Tente se aproximar pela pista.';},answer(g){return g.target[0];}
};
export default class extends Quiz {constructor(options){super(meta,rules,options);}}
