import {norm,clamp} from './random.mjs';
import {interactionProfile} from './bindings.mjs';
const ALIASES={join:['entrar','jogar','participar'],blue:['azul','time azul','equipe azul','1'],red:['vermelho','time vermelho','equipe vermelha','2'],boost:['turbo','impulso','acelerar'],left:['esquerda','esq'],right:['direita','dir'],up:['cima'],down:['baixo'],jump:['pular','saltar','pulo'],punch:['soco','socar'],kick:['chute','chutar'],guard:['defender','defesa'],rest:['descansar','recuperar','folego'],shoot:['atirar','tiro'],reload:['recarregar'],heal:['curar','reforco','cura'],slice:['cortar'],build:['construir','bloco'],break:['quebrar'],rotate:['girar'],drop:['soltar'],wipe:['limpar'],dirty:['sujar','manchar'],bucket:['balde'],hint:['pista','ajuda'],food:['comida','alimentar'],bomb:['bomba'],future:['futuro','previsao'],roast:['zoeira','zoar'],sign:['assinar'],print:['imprimir','carta'],mint:['moeda','cunhar'],hello:['salve','oi'],joke:['piada'],challenge:['desafiar','desafio'],spin:['rodar'],fast:['rapido','acelerar'],slow:['devagar','desacelerar'],step:['passo','dancar'],sync:['sincronizar'],pull:['puxar'],push:['empurrar'],claim:['conquistar'],fortify:['fortificar'],attack:['atacar','ataque'],shield:['escudo','proteger'],power:['melhorar'],evolve:['evoluir'],airstrike:['ataque aereo'],blackhole:['buraco negro'],slap:['tapa'],brace:['firmar'],xp:['experiencia'],split:['dividir'],range:['alcance'],heavy:['pesada','peso'],soldier:['soldado'],archer:['arqueiro'],giant:['gigante'],hit:['atrapalhar'],steal:['roubar'],sprint:['arrancada','correr'],warrior:['guerreiro'],healer:['curandeiro'],mage:['mago'],rally:['uniao'],fruit:['fruta','frutas'],shake:['balancar'],rain:['chuva de blocos','chuva'],wind:['vento'],narrow:['apertar'],branch:['galho'],zombie:['zumbi'],steady:['estabilizar'],gravity:['gravidade'],meteor:['meteoro'],half:['50/50','metade'],stop:['parar'],upgrade:['combinar'],polish:['polir'],decorate:['enfeitar'],page:['pagina','virar pagina'],color:['cor','moldura'],bonk:['martelo'],spring:['mola'],confetti:['confete'],wow:['surpresa'],fail:['deu ruim'],win:['vitoria'],laugh:['risada','rir'],shuffle:['embaralhar'],nice:['elogio']};
const clean=text=>norm(text).replace(/^!\s*/,'').replace(/[!?.,;]+$/,'').trim();
export function commandAliases(action){return [...new Set([action.command||action.label.toLowerCase(),action.id,...(ALIASES[action.id]||[]),...(action.id==='red'?['vermelha','equipe vermelha','time vermelha']:[])])];}
export function resolveCommand(state,text){const w=clean(text);return state.actions.find(a=>commandAliases(a).some(v=>clean(v)===w))?.id||'';}
const reject=message=>({accepted:false,message,queued:0});
export function dispatchInput(game,event={}){
 if(!event||typeof event!=='object')return reject('Interação inválida.');
 const kind=event.kind||'comment';if(['join','member','enter','roomUser','viewer'].includes(kind))return reject('Entradas de espectadores são ignoradas.');
 const profile=interactionProfile(game),source={...event,kind},raw=String(event.text||'').slice(0,240),word=clean(raw);
 const receipt=(action,message,queued=0)=>{const r={accepted:true,kind,action,message,queued,at:game.time};game.state.lastInteraction=r;return r;};
 if(['like','gift','follow','share'].includes(kind)){
  const p=game.player(event);if(!p)return reject('Limite de participantes atingido.');let action,count=1;const totals=game.state.engagement;
  if(kind==='like'){const likes=clamp(Math.floor(Number(event.count)||1),1,10000);totals.likes+=likes;p.likeBalance=(p.likeBalance||0)+likes;count=Math.floor(p.likeBalance/profile.likeThreshold);p.likeBalance%=profile.likeThreshold;action=profile.likes.action;if(!count)return receipt(action,p.likeBalance+'/'+profile.likeThreshold+' curtidas para '+profile.likes.label.toLowerCase());}
  if(kind==='gift'){count=clamp(Math.floor(Number(event.count)||1),1,10000);totals.gifts+=count;action=profile.gifts[Number(event.coins)>=100?2:Number(event.coins)>=10?1:0].action;}
  if(kind==='follow'){totals.follows++;action=profile.follow.action;}
  if(kind==='share'){totals.shares++;action=profile.gifts[0].action;}
  const result=game.queueInteraction({...source,kind:'control',sourceKind:kind,action,text:''},count);if(!result.accepted)return reject(result.message);
  return receipt(action,(kind==='gift'?count+'× presente: ':kind==='like'?'Curtidas: ':'Apoio: ')+({'@time':'+5 segundos','@hint':'pista','@energy':'energia'}[action]||game.state.actions.find(a=>a.id===action)?.label||action),result.queued);
 }
 if(!['control','comment','chat'].includes(kind))return reject('Tipo de interação desconhecido.');
 if(word==='comandos'||word==='ajuda'&&game.state.view!=='quiz'){game.state.helpUntil=game.time+10;game.state.help=profile;game.note('Comandos: '+profile.commands.map(a=>a.command).join(' · '));return receipt('help','Lista de comandos exibida.');}
 let action=String(event.action||''),selectedTeam;const explicit=Boolean(action);if(!action)action=resolveCommand(game.state,word);
 if(!action&&game.state.view==='quiz'&&['pista','ajuda'].includes(word))action='hint';
 if(!action&&['entrar','participar','jogar'].includes(word))action='@join';
 if(!action&&game.meta.id==='voxel-craft'){const m=word.match(/^(construir|quebrar|build|break)\s+([a-h])\s*([1-8])$/);if(m){action=['quebrar','break'].includes(m[1])?'break':'build';source.index=(Number(m[3])-1)*8+m[2].charCodeAt(0)-97;}}
 if(!action&&game.state.actions.some(a=>a.id==='blue')){
  const prefix=word.match(/^(?:(?:time|equipe)\s+)?(azul|vermelh[oa])\s+(.+)$/),suffix=word.match(/^(.+?)\s+(?:(?:do|da)\s+)?(?:(?:time|equipe)\s+)?(azul|vermelh[oa])$/);
  const color=prefix?.[1]||suffix?.[2],command=prefix?.[2]||suffix?.[1];if(command){action=resolveCommand(game.state,command);if(action)selectedTeam=color==='azul'?0:1;}
 }
 if(action==='@join'&&!explicit){const p=game.player(event);if(!p)return reject('Limite de participantes atingido.');return receipt(action,p.name+' entrou na rodada.');}
 const answer=action.startsWith('answer:')&&game.state.view==='quiz'&&/^answer:[\p{L}\d -]{1,30}$/u.test(action);
 if(action&&!answer&&!game.state.actions.some(a=>a.id===action)&&!(action==='hint'&&game.state.view==='quiz'))return reject('Este comando não está disponível neste jogo.');
 if(!action&&game.state.view!=='quiz'&&game.state.view!=='social')return reject('Comando não reconhecido. Digite !comandos.');
 if(!action&&!raw.trim()&&event.index===undefined)return reject('Escreva uma mensagem ou escolha uma ação.');
 if(game.state.phase!=='playing')return reject('Aguarde a próxima rodada.');
 const text=answer?action.slice(7):game.state.view==='quiz'?raw.replace(/^!\s*/,'').replace(/^(?:resposta|responder)\s+/i,''):raw;
 if(game.state.theme==='memory'&&!action){const m=clean(text).match(/^(?:(?:virar|par)\s+)?(\d{1,2})(?:\s+(\d{1,2}))?$/);if(m){for(const v of m.slice(1).filter(Boolean))if(Number(v)<1||Number(v)>16)return reject('Use números de cartas entre 1 e 16.');for(const v of m.slice(1).filter(Boolean))game.input({...source,action:'',text:v});return receipt('answer','Carta(s) selecionada(s).');}}
 if(selectedTeam!==undefined){const p=game.player(event);if(!p)return reject('Limite de participantes atingido.');p.team=selectedTeam;}
 game.input({...source,action,text});const label=action?game.state.actions.find(a=>a.id===action)?.label||'Resposta enviada':'Mensagem recebida.';const result=receipt(action||'answer',label+(selectedTeam===undefined?'':selectedTeam?' · Equipe Vermelha':' · Equipe Azul'));if(selectedTeam!==undefined)result.team=selectedTeam;return result;
}
export function interactiveInput(game,event){return dispatchInput(game,event).accepted;}
