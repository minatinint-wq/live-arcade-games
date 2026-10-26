import {Quiz} from '../core/quiz.mjs';
import {norm} from '../core/random.mjs';
import {WORDS,QUESTIONS,FLAGS} from '../core/words.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='guess-the-drawing');
const rules={
theme:'drawing',reset(g){g.target=g.pick([['casa','Um lugar para morar'],['barco','Flutua'],['arvore','Tem raízes'],['bicicleta','Duas rodas'],['gato','Um animal doméstico'],['sol','Ilumina o dia']]);g.state.question='O desenho está aparecendo…';g.state.drawing=g.target[0];g.state.clue='';g.state.progress=0;},
input(g,e,p){if(g.guess(e)===g.target[0])g.correct(p,Math.max(10,100-Math.floor(g.state.progress*70)));else g.attempt(p,g.guess(e),'Continue olhando');},
step(g){g.state.progress=Math.min(1,(g.time-g.roundAt)/22);if(g.state.reveal||g.state.progress>.8)g.state.clue=g.target[1];},answer(g){return g.target[0];}
};
export default class extends Quiz {constructor(options){super(meta,rules,options);}}
