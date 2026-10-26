import {Quiz} from '../core/quiz.mjs';
import {norm} from '../core/random.mjs';
import {WORDS,QUESTIONS,FLAGS} from '../core/words.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='true-or-false');
const rules={
theme:'truth',actions:[{id:'answer:verdadeiro',label:'Verdadeiro'},{id:'answer:falso',label:'Falso'}],
reset(g){g.target=g.pick([['Um triângulo tem três lados.',true],['Uma hora tem cem minutos.',false],['O Sol é uma estrela.',true],['O número 17 é par.',false],['A Lua é um planeta.',false],['Um quilômetro tem mil metros.',true],['Todo retângulo é um quadrado.',false],['O dobro de 15 é 30.',true]]);g.state.question=g.target[0];g.state.options=['Verdadeiro','Falso'];g.missed=new Set();},
input(g,e,p){if(g.missed.has(p.id))return;const w=g.guess(e);const a=/^(verdadeiro|v|1)$/.test(w)?true:/^(falso|f|2)$/.test(w)?false:null;if(a===null)return;if(a===g.target[1])g.correct(p);else{g.missed.add(p.id);g.attempt(p,w,'Resposta incorreta');}},answer(g){return g.target[1]?'Verdadeiro':'Falso';}
};
export default class extends Quiz {constructor(options){super(meta,rules,options);}}
