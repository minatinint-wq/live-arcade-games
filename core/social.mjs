import {Game} from './game.mjs';
export class Social extends Game {
 constructor(meta,rules,options){super(meta,options);this.rules=rules;this.state.view='social';this.state.theme=rules.theme;this.state.actions=rules.actions;this.state.subtitle=rules.hint||'Entre no chat e participe';this.reset();}
 reset(){this.state.objects=[];this.state.queue=[];this.state.current=null;this.state.message='';this.state.beat=0;this.state.total=0;this.nextAt=this.time;this.rules.reset?.(this);}
 onInput(e,p){this.rules.input?.(this,e,p);}
 enqueue(value){if(this.state.queue.length<80)this.state.queue.push(value);}
 step(dt){this.state.beat+=dt;this.rules.step?.(this,dt);this.state.objects=this.state.objects.slice(-160);}
}
