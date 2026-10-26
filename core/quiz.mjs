import {Game} from './game.mjs';
import {norm} from './random.mjs';
import {revealHint} from './hints.mjs';
export class Quiz extends Game {
 constructor(meta,rules,options){super(meta,options);this.rules=rules;this.state.view='quiz';this.state.theme=rules.theme;this.state.actions=rules.actions||[{id:'hint',label:'Revelar pista'}];this.state.subtitle=rules.hint||'Escreva a resposta no chat';this.reset();}
 reset(){this.roundAt=this.time;this.timeBonus=0;this.revealBonus=0;this.state.objects=[];this.state.attempts=[];this.state.found=[];this.state.reveal=0;this.state.hidden=[];this.state.hintCell=-1;this.state.message='';this.state.clue='';this.state.options=[];this.state.question='';this.state.remaining=this.rules.duration||90;this.solved=new Set();this.rules.reset(this);}
 correct(p,points=100,finish=true){if(this.solved.has(p.id))return false;this.solved.add(p.id);this.addScore(p,points);this.state.message=p.name+' acertou!';this.note(this.state.message);if(finish)this.finish(p);return true;}
 guess(e){return norm(e.text||e.action.replace(/^answer:/,''));}
 onInput(e,p){if(e.action==='@time'){const added=Math.min(5,60-this.timeBonus);this.timeBonus+=added;this.state.remaining+=added;this.state.message=added?'O chat acrescentou '+added+' segundos.':'Limite de tempo extra desta rodada atingido.';return;}if(e.action==='hint'||e.action==='@hint'){revealHint(this);return;}this.rules.input(this,e,p);}
 step(dt){this.state.remaining=Math.max(0,(this.rules.duration||90)+this.timeBonus-(this.time-this.roundAt));this.rules.step?.(this,dt);if(this.state.remaining<=0){this.state.message=this.rules.answer?.(this)||'Fim do tempo';this.finish('Rodada encerrada');}}
 attempt(p,text,value){this.state.attempts.unshift({name:p.name,text:String(text).slice(0,60),value});this.state.attempts.length=Math.min(this.state.attempts.length,8);}
}
