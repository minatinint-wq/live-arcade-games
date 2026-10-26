import {Quiz} from '../core/quiz.mjs';
import {norm} from '../core/random.mjs';
import {WORDS,QUESTIONS,FLAGS} from '../core/words.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='trivia-time');
const rules={
theme:'trivia',reset(g){g.target=g.pick(QUESTIONS);g.state.question=g.target[0];g.state.options=g.target[1];g.missed=new Set();},
input(g,e,p){if(g.missed.has(p.id))return;const w=g.guess(e);if(w===String(g.target[2]+1)||w===norm(g.target[1][g.target[2]]))g.correct(p,Math.ceil(g.state.remaining));else{g.missed.add(p.id);g.attempt(p,w,'Próxima rodada!');}},answer(g){return g.target[1][g.target[2]];}
};
export default class extends Quiz {constructor(options){super(meta,rules,options);}}
