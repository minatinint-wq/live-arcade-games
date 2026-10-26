import {Quiz} from '../core/quiz.mjs';
import {norm} from '../core/random.mjs';
import {WORDS,QUESTIONS,FLAGS} from '../core/words.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='guess-the-location');
const rules={
theme:'map',reset(g){const places=[['Brasília','Capital brasileira desenhada com grandes eixos',.37,.7],['Lisboa','Capital portuguesa às margens do Tejo',.47,.32],['Tóquio','Capital do Japão',.89,.36],['Cairo','Cidade próxima às pirâmides de Gizé',.59,.43],['Buenos Aires','Capital argentina à beira do Rio da Prata',.35,.84],['Paris','Cidade atravessada pelo Sena',.51,.29]];g.target=g.pick(places);g.state.question='Que lugar é esse?';g.state.clue=g.target[1];g.state.mapPoint={x:g.target[2],y:g.target[3]};g.state.options=places.map(p=>p[0]);},
input(g,e,p){let w=g.guess(e);if(/^\d+$/.test(w))w=norm(g.state.options[Number(w)-1]||'');if(w===norm(g.target[0]))g.correct(p);else g.attempt(p,w,'Tente outra cidade');},answer(g){return g.target[0];}
};
export default class extends Quiz {constructor(options){super(meta,rules,options);}}
