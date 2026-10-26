import {Quiz} from '../core/quiz.mjs';
import {norm} from '../core/random.mjs';
import {WORDS,QUESTIONS,FLAGS} from '../core/words.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='word-association');
const rules={
theme:'association',reset(g){g.target=g.pick(WORDS);g.state.question='O que combina com '+g.target[0]+'?';g.state.clue='Encontre cinco palavras relacionadas';g.state.slots=5;},
input(g,e,p){const w=g.guess(e);if(g.target[2].includes(w)&&!g.state.found.includes(w)){g.state.found.push(w);g.addScore(p,25);if(g.state.found.length===5)g.finish(p);}else g.attempt(p,w,'Procure outra associação');},answer(g){return g.target[2].join(', ');}
};
export default class extends Quiz {constructor(options){super(meta,rules,options);}}
