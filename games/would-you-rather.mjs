import {Quiz} from '../core/quiz.mjs';
import {norm} from '../core/random.mjs';
import {WORDS,QUESTIONS,FLAGS} from '../core/words.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='would-you-rather');
const rules={
theme:'poll',duration:30,actions:[{id:'answer:1',label:'Opção 1'},{id:'answer:2',label:'Opção 2'}],
reset(g){const pairs=[['Voar por um dia','Respirar debaixo da água'],['Morar na praia','Morar na montanha'],['Viajar ao passado','Visitar o futuro'],['Só pizza por uma semana','Só macarrão por uma semana'],['Ter um robô cozinheiro','Ter um carro voador']];g.state.question='Você prefere…';g.state.options=g.pick(pairs);g.votes=new Map();g.state.votes=[0,0];},
input(g,e,p){const n=Number(g.guess(e))-1;if(n!==0&&n!==1)return;const old=g.votes.get(p.id);if(old!==undefined)g.state.votes[old]--;g.votes.set(p.id,n);g.state.votes[n]++;g.state.message='Voto registrado';},
step(g){if(g.state.remaining<=0){const v=g.state.votes;g.state.message=v[0]===v[1]?'Empate!':g.state.options[v[0]>v[1]?0:1];g.finish(g.state.message);}}
};
export default class extends Quiz {constructor(options){super(meta,rules,options);}}
