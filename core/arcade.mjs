import {Game} from './game.mjs';
export class Arcade extends Game {
 constructor(meta,rules,options){super(meta,options);this.rules=rules;this.state.view='arcade';this.state.theme=rules.theme;this.state.actions=rules.actions;this.state.subtitle=rules.hint;this.reset();}
 reset(){this.roundAt=this.time;this.state.objects=[];this.state.avatar={x:450,y:920,vx:0,vy:0};this.state.lives=3;this.state.points=0;this.state.meter=0;this.hurtUntil=0;this.rules.reset?.(this);}
 hit(){if(this.time<this.hurtUntil)return;this.hurtUntil=this.time+1;this.state.lives--;this.effect(this.state.avatar.x,this.state.avatar.y,'OPS!','#ff6a74');if(this.state.lives<=0)this.finish('O chat');}
 score(n,p){this.state.points=Math.max(0,this.state.points+n);this.addScore(p,n);}
 onInput(e,p){this.rules.input?.(this,e,p);}
 step(dt){this.rules.step?.(this,dt);if(this.state.objects.length>800)this.state.objects=this.state.objects.slice(-800);}
}
