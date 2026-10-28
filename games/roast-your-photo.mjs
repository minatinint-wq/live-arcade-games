import {Social} from '../core/social.mjs';
import {clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='roast-your-photo');
const rules={
theme:'roast',actions:[{id:'roast',label:'Entrar na zoeira'},{id:'nice',label:'Elogio surpresa'}],reset(g){g.state.line='Zoeira leve. Só participa quem entra na fila.';g.state.person='O palco está livre';},
input(g,e,p){g.enqueue({owner:p.id,name:p.name,color:p.color,nice:e.action==='nice'});},
step(g){if(g.time>=g.nextAt&&g.state.queue.length){const q=g.state.queue.shift();g.state.person=q.name;g.state.current={...q,at:g.time};g.state.line=q.nice?g.pick(['Você tem energia de quem salva o grupo na última fase.','O chat ficou mais divertido quando você chegou.','Presença de protagonista na transmissão.']):g.pick(['Tem energia de quem abre a geladeira para pensar.','Deve ter vinte abas abertas e nenhuma ideia de onde toca a música.','Se concentração fosse Wi-Fi, estaria procurando sinal.','Chegou com confiança de quem pulou o tutorial.','Tem cara de quem fala só mais uma partida cinco vezes.','Deve usar o botão soneca como minigame.','Planejou tudo e esqueceu de apertar iniciar.','Jogou no fácil e ainda pediu ajuda ao chat.']);g.state.total++;g.nextAt=g.time+5;g.addScore(g.users.get(q.owner),10);}}
};
export default class extends Social {constructor(options){super(meta,rules,options);}}
