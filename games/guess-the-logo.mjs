import {Quiz} from '../core/quiz.mjs';
import {norm} from '../core/random.mjs';
import {WORDS,QUESTIONS,FLAGS} from '../core/words.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='guess-the-logo');
const rules={
theme:'symbol',reset(g){g.target=g.pick([['reciclagem','Materiais ganham outra vida','recycle'],['wifi','Conexão sem fios','wifi'],['pausa','Interrompe a reprodução','pause'],['volume','Controla o som','speaker'],['energia','Liga e desliga','power'],['coracao','Representa carinho','heart']]);g.state.question='Que símbolo é esse?';g.state.symbol=g.target[2];g.state.clue='';g.state.progress=0;},
input(g,e,p){if(g.guess(e)===g.target[0])g.correct(p);else g.attempt(p,g.guess(e),'Pense na função do símbolo');},step(g){g.state.progress=Math.min(1,(g.time-g.roundAt+(g.revealBonus||0))/12);if(g.state.reveal||g.state.progress>.8)g.state.clue=g.target[1];},answer(g){return g.target[0];}
};
export default class extends Quiz {constructor(options){super(meta,rules,options);}}
