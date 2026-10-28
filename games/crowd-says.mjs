import {Quiz} from '../core/quiz.mjs';
import {norm} from '../core/random.mjs';
import {WORDS,QUESTIONS,FLAGS} from '../core/words.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='crowd-says');
const rules={
theme:'survey',reset(g){g.target=g.pick([['Algo que você leva à praia',['agua','protetor','toalha','chinelo','guarda-sol']],['Algo que cabe em um estojo',['lapis','caneta','borracha','regua','apontador']],['Um sabor de sorvete',['chocolate','morango','baunilha','creme','coco']],['Algo que tem na cozinha',['fogao','geladeira','panela','prato','copo']]]);g.state.question=g.target[0];g.state.answers=Array(5).fill(null);g.state.answerAt=Array(5).fill(-10);g.state.clue='Respostas do nosso banco de brincadeiras';},
input(g,e,p){const i=g.target[1].indexOf(g.guess(e));if(i>=0&&!g.state.answers[i]){g.state.answers[i]=g.target[1][i];g.state.answerAt[i]=g.time;g.addScore(p,(5-i)*20);if(g.state.answers.every(Boolean))g.finish(p);}else g.attempt(p,g.guess(e),'Ainda não apareceu no painel');}
};
export default class extends Quiz {constructor(options){super(meta,rules,options);}}
