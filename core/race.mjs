import {Game,W,H} from './game.mjs';import {clamp} from './random.mjs';
export class Race extends Game {
 constructor(meta,rules,options){super(meta,options);this.rules=rules;this.state.view='race';this.state.theme=rules.theme;this.state.actions=rules.actions;this.state.subtitle=rules.hint;this.reset();}
 reset(){while(this.users.size<6)this.bot();this.roundAt=this.time;this.state.objects=[];for(const p of this.users.values())Object.assign(p,{progress:0,lane:p.team,boost:0,stamina:100,speed:this.rnd(47,55),penalty:0});this.rules.reset?.(this);}
 onInput(e,p){if(p.progress===undefined)Object.assign(p,{progress:0,lane:p.team,boost:0,stamina:100,speed:51,penalty:0});this.rules.input(this,e,p);}
 step(dt){for(const p of this.users.values()){
  p.progress??=0;p.speed??=51;p.boost=Math.max(0,(p.boost||0)-dt);p.penalty=Math.max(0,(p.penalty||0)-dt);this.rules.actor?.(this,p,dt);
  p.progress+=(p.speed+(p.boost>0?30:0))*(p.penalty>0?.25:1)*dt;p.lap=1+Math.floor(p.progress/900);const angle=(p.progress%900)/900*Math.PI*2-Math.PI/2;p.x=450+Math.cos(angle)*(260+p.lane*38);p.y=610+Math.sin(angle)*(410+p.lane*25);p.angle=angle+Math.PI/2;
  if(p.progress>=(this.rules.laps||3)*900){this.addScore(p,100);this.finish(p);break;}
 }this.rules.step?.(this,dt);}
 sync(){this.state.laps=this.rules.laps||3;this.state.distance=900;}
}
