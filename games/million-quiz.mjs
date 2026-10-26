import {Quiz} from '../core/quiz.mjs';
import {norm} from '../core/random.mjs';
import {WORDS,QUESTIONS,FLAGS} from '../core/words.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='million-quiz');
const rules={
theme:'million',duration:150,actions:[{id:'half',label:'Ajuda 50/50'},{id:'stop',label:'Parar e guardar pontos'}],
reset(g){g.level=0;g.state.bank=0;g.state.safe=0;g.state.hidden=[];g.halfUsed=false;g.target=QUESTIONS[0];g.state.question=g.target[0];g.state.options=g.target[1];},
input(g,e,p){if(e.action==='half'&&!g.halfUsed){g.halfUsed=true;g.state.hidden=[0,1,2,3].filter(i=>i!==g.target[2]).slice(0,2);return;}if(e.action==='stop'){g.addScore(p,g.state.bank);g.finish(p);return;}const w=g.guess(e);if(!/^[1-4]$/.test(w))return;if(Number(w)-1===g.target[2]){g.level++;g.state.bank=Math.round(1000000*Math.pow(g.level/15,3));if(g.level%5===0)g.state.safe=g.state.bank;if(g.level===15){g.addScore(p,g.state.bank);g.finish(p);return;}g.target=QUESTIONS[g.level];g.state.question=g.target[0];g.state.options=g.target[1];g.state.hidden=[];g.state.message='Acertou! Etapa '+(g.level+1)+' de 15';}else{g.addScore(p,g.state.safe);g.state.message='Você guardou '+g.state.safe+' pontos virtuais';g.finish('Fim da jornada');}}
};
export default class extends Quiz {constructor(options){super(meta,rules,options);}}
