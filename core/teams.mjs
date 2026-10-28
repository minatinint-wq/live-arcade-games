import {Game} from './game.mjs';
export class Teams extends Game {
 constructor(meta,rules,options){super(meta,options);this.rules=rules;this.state.view='teams';this.state.theme=rules.theme;this.state.actions=rules.actions;this.state.subtitle=rules.hint||'azul · vermelho · apoiar';this.reset();}
 reset(){this.roundAt=this.time;this.state.objects=[];this.state.teams=[{id:0,name:'Equipe Azul',color:'#59aaff',score:0,hp:100,wins:0},{id:1,name:'Equipe Vermelha',color:'#ff666d',score:0,hp:100,wins:0}];this.rules.reset?.(this);}
 win(i){this.state.teams[i].wins++;this.finish(this.state.teams[i].name);}
 onInput(e,p){if(e.action==='blue'||/^(azul|a|1)$/.test(e.word)){p.team=0;return;}if(e.action==='red'||/^(vermelho|b|2)$/.test(e.word)){p.team=1;return;}this.rules.input?.(this,e,p,this.state.teams[p.team],this.state.teams[1-p.team]);}
 unit(kind,team,extra={}){if(this.state.objects.length>150)return null;const u={id:this.uid(),kind,team,x:team?450:450,y:team?170:1000,hp:35,size:17,speed:45,cooldown:0,...extra};this.state.objects.push(u);return u;}
 step(dt){this.rules.step?.(this,dt);if(this.state.phase==='playing'&&this.time-this.roundAt>120){const [a,b]=this.state.teams;if(Math.abs(a.score-b.score)<1e-7)this.finish('Empate!');else this.win(a.score>b.score?0:1);}}
}
