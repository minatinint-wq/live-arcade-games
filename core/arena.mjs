import {Game,W,H} from './game.mjs';import {clamp,distance} from './random.mjs';
export class Arena extends Game {
 constructor(meta,rules,options){super(meta,options);this.rules=rules;this.state.view='arena';this.state.theme=rules.theme||'arena';this.state.actions=rules.actions||[{id:'join',label:'Entrar'},{id:'power',label:'Melhorar'}];this.state.subtitle=rules.hint||'Comente entrar para participar';this.bullets=[];this.reset();}
 reset(){this.state.objects=[];this.bullets=[];for(const p of this.users.values())Object.assign(p,{x:this.rnd(100,W-100),y:this.rnd(180,H-150),hp:100,maxHp:100,alive:true,size:20,vx:0,vy:0,cooldown:0,deadAt:0,power:1,level:1,xp:0,arenaJoined:false,braced:0,mass:1,hitAt:-100,fireAt:-100,attackAt:-100,kickAt:-100});while(this.users.size<10)this.bot();this.roundAt=this.time;this.rules.reset?.(this);}
 nearest(p){return [...this.users.values()].filter(q=>q!==p&&q.alive).sort((a,b)=>distance(p,a)-distance(p,b))[0];}
 damage(target,amount,source){if(!target?.alive)return;target.hitAt=this.time;target.hitFrom=source?.id;target.hp-=amount;if(target.hp<=0){target.hp=0;target.alive=false;target.deadAt=this.time;this.addScore(source,25);this.effect(target.x,target.y,'+25');this.rules.onDeath?.(this,target,source);}}
 shot(p,{damage=18,speed=440,size=5}={}){const t=this.nearest(p);if(!t)return;const angle=Math.atan2(t.y-p.y,t.x-p.x);this.bullets.push({id:this.uid('shot'),kind:'bullet',owner:p.id,x:p.x,y:p.y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,damage,size,life:2.4});p.angle=angle;p.fireAt=this.time;}
 onInput(e,p){if(!p.arenaJoined){p.arenaJoined=true;if(this.state.ring){const a=this.rnd(0,Math.PI*2),r=this.rnd(0,this.state.ring.r*.65);p.x=this.state.ring.x+Math.cos(a)*r;p.y=this.state.ring.y+Math.sin(a)*r;}}if(!p.power)Object.assign(p,{power:1,level:1,xp:0});if(e.action==='join'||e.word==='entrar')this.note(p.name+' entrou');this.rules.input?.(this,e,p);}
 step(dt){this.rules.step?.(this,dt);for(const p of this.users.values()){
  if(!p.alive){if(!this.rules.noRespawn&&this.time-p.deadAt>3)Object.assign(p,{alive:true,hp:p.maxHp,x:this.rnd(90,W-90),y:this.rnd(130,H-120),vx:0,vy:0,cooldown:0,arenaJoined:false,braced:0,hitAt:-100});continue;}
  p.cooldown=Math.max(0,p.cooldown-dt);const t=this.nearest(p);if(this.rules.drive)this.rules.drive(this,p,t,dt);else if(t){const a=Math.atan2(t.y-p.y,t.x-p.x),d=distance(p,t),speed=(this.rules.speed||42)*(d>p.size+t.size?1:-.4);p.x+=Math.cos(a)*speed*dt;p.y+=Math.sin(a)*speed*dt;p.angle=a;}
  p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.pow(.06,dt);if(this.state.theme!=='platform')p.vy*=Math.pow(.06,dt);if(!this.rules.openBounds){p.x=clamp(p.x,35,W-35);p.y=clamp(p.y,100,H-40);}this.rules.actor?.(this,p,t,dt);
 }
 const alive=[...this.users.values()].filter(p=>p.alive);for(let i=0;i<alive.length;i++)for(let j=i+1;j<alive.length;j++){const a=alive[i],b=alive[j];if(a.alive&&b.alive&&distance(a,b)<a.size+b.size){this.rules.contact?.(this,a,b,dt);if(a.alive&&b.alive)this.rules.contact?.(this,b,a,dt);}}
 for(const b of this.bullets){b.life-=dt;b.x+=b.vx*dt;b.y+=b.vy*dt;for(const p of alive)if(b.life>0&&p.alive&&p.id!==b.owner&&distance(p,b)<p.size+b.size){this.damage(p,b.damage,this.users.get(b.owner));b.life=0;break;}}
 this.bullets=this.bullets.filter(b=>b.life>0).slice(-220);if(this.state.objects.length>1200)this.state.objects=this.state.objects.slice(-1200);if(this.time-this.roundAt>120)this.finish([...this.users.values()].sort((a,b)=>b.score-a.score)[0]);
 }
 sync(){this.state.projectiles=this.bullets;this.state.elapsed=this.time-this.roundAt;}
}
