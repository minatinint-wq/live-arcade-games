import {Social} from '../core/social.mjs';
import {clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='ai-host');
const rules={
theme:'host',actions:[{id:'hello',label:'Pedir um salve'},{id:'joke',label:'Pedir uma piada'},{id:'challenge',label:'Lançar desafio'}],
reset(g){g.state.line='Boa transmissão! Quem chegou para brincar?';g.state.expression='smile';g.state.speaker='Apresentador';g.state.speakingUntil=0;},
input(g,e,p){const w=e.word;let line,expression='smile';if(e.action==='joke'||/piada|rir/.test(w)){line=g.pick(['O Wi-Fi foi correr e perdeu a conexão.','A bicicleta foi dormir porque estava de duas rodas cansada.','Meu relógio pediu férias: estava trabalhando o tempo todo.']);expression='laugh';}else if(e.action==='challenge'||/desafio|jogo/.test(w)){line=g.pick(['Desafio do chat: escreva uma palavra sem a letra A!','Quem consegue contar de trás para frente sem errar?','Escolha: quiz, corrida ou uma batalha de equipes?']);expression='surprise';}else if(/obrigad|presente/.test(w)||e.kind==='gift')line='Valeu pelo apoio, '+p.name+'! A festa é de todo mundo.';else if(/boa noite|bom dia|oi|salve/.test(w)||e.action==='hello')line='Salve, '+p.name+'! Chega junto, a brincadeira já começou.';else line=g.pick([p.name+', essa foi para o chat pensar!','O chat tem opinião! Quem concorda com '+p.name+'?',p.name+', gostei da participação. Manda a próxima!']);g.enqueue({name:p.name,line,expression});},
step(g){if(g.time>=g.nextAt&&g.state.queue.length){const q=g.state.queue.shift();g.state.line=q.line;g.state.expression=q.expression;g.state.speaker=q.name;g.state.speakingUntil=g.time+4;g.state.total++;g.nextAt=g.time+5;}}
};
export default class extends Social {constructor(options){super(meta,rules,options);}}
