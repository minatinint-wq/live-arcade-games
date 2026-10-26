import {norm,clamp} from './random.mjs';
export function revealHint(g){const s=g.state,n=++s.reveal;let clue='';switch(s.theme){
case 'context':clue=`${g.target[1]}. Tem ${g.target[0].length} letras e começa com ${g.target[0][0].toUpperCase()}.`;break;
case 'letters5':clue='Letras reveladas: '+g.target.slice(0,Math.min(2,n)).toUpperCase()+' _'.repeat(5-Math.min(2,n));break;
case 'map':clue=g.target[1]+'. Nome: '+g.target[0].slice(0,Math.min(3,n))+'…';break;
case 'swipe':{const w=g.targets.find(w=>!s.found.includes(w));clue=w?'Procure '+w.length+' letras começando em '+w[0].toUpperCase()+'.':'Todas encontradas!';break;}
case 'trivia':case 'million':s.hidden=[0,1,2,3].filter(i=>i!==g.target[2]).slice(0,2);clue='Duas alternativas incorretas foram retiradas.';if(s.theme==='million')g.halfUsed=true;break;
case 'memory':clue='Espie as cartas por um instante.';break;
case 'math':clue='O resultado é '+(g.answer<0?'negativo':'positivo')+', '+(g.answer%2?'ímpar':'par')+' e tem '+String(Math.abs(g.answer)).length+' algarismo(s).';break;
case 'hunt':{const v=g.lines.find(v=>!s.found.includes(v.word));if(v){s.hintCell=v.start;clue='Uma palavra começa na casa destacada.';}break;}
case 'survey':{const i=s.answers.findIndex(v=>!v);clue=i>=0?`Resposta ${i+1}: começa com ${g.target[1][i][0].toUpperCase()} e tem ${g.target[1][i].length} letras.`:'Painel completo!';break;}
case 'cross':{const i=s.entries.findIndex(v=>!v.solved);clue=i>=0?g.entries[i].clue+' · começa com '+g.entries[i].word[0]:s.clue;break;}
case 'anagram':clue=g.target[1]+' · começa com '+g.target[0].slice(0,Math.min(n,2)).toUpperCase();break;
case 'flag':clue='O país começa com '+g.target.name.slice(0,Math.min(n,2)).toUpperCase()+' e tem '+norm(g.target.name).length+' letras.';break;
case 'association':{const w=g.target[2].find(v=>!s.found.includes(v));clue=w?'Uma associação começa com '+w[0].toUpperCase()+' e tem '+w.length+' letras.':'Todas encontradas!';break;}
case 'drawing':case 'symbol':g.revealBonus=(g.revealBonus||0)+5;s.progress=Math.min(1,(s.progress||0)+.25);clue=g.target[1];break;
case 'number':{const span=s.high-s.low,next=Math.max(1,Math.floor(span*.65)),left=clamp(g.answer-Math.floor(g.rnd(0,next+1)),s.low,Math.max(s.low,s.high-next));s.low=left;s.high=Math.min(s.high,left+next);clue='Agora está entre '+s.low+' e '+s.high+'.';break;}
default:clue=s.clue||'Responda no chat para participar.';
}s.clue=clue;s.message='Pista revelada';return clue;}
