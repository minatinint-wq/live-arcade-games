import {Quiz} from '../core/quiz.mjs';
import {norm} from '../core/random.mjs';
import {WORDS,QUESTIONS,FLAGS} from '../core/words.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='guess-the-flag');
const rules={
theme:'flag',reset(g){g.target=g.pick(FLAGS);g.state.flag=g.target;g.state.question='De qual país é esta bandeira?';g.state.clue='Responda com o nome do país';},
input(g,e,p){if(g.guess(e)===norm(g.target.name))g.correct(p);else g.attempt(p,g.guess(e),'Tente outro país');},answer(g){return g.target.name;}
};
export default class extends Quiz {constructor(options){super(meta,rules,options);}}
