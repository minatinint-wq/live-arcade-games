import {Social} from '../core/social.mjs';
import {clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='guess-your-future');
const rules={
theme:'fortune',actions:[{id:'future',label:'Entrar na fila'},{id:'shuffle',label:'Embaralhar o destino'}],reset(g){g.state.line='Uma previsão de brincadeira espera por você';g.state.person='Quem será o próximo?';g.state.orb=0;},
input(g,e,p){if(e.action==='shuffle'){g.state.orb++;return;}g.enqueue({owner:p.id,name:p.name});},
step(g){if(g.time>=g.nextAt&&g.state.queue.length){const q=g.state.queue.shift();g.state.person=q.name;g.state.line=g.pick(['Uma notificação vai interromper seu momento de concentração.','Você encontrará dinheiro… no bolso da roupa que ia lavar.','Uma partida emocionante está no seu caminho.','Seu próximo lanche será melhor do que você espera.','Um amigo vai mandar um meme impossível de explicar.','O controle remoto vai reaparecer quando você parar de procurar.','Uma ideia boa vai chegar na hora do banho.','Hoje o chat vai surpreender você.']);g.state.current={...q,at:g.time};g.state.orb++;g.state.total++;g.nextAt=g.time+5;g.addScore(g.users.get(q.owner),10);}}
};
export default class extends Social {constructor(options){super(meta,rules,options);}}
