import {random,clamp,norm} from './random.mjs';
export const W=900,H=1200;
export class Game {
 constructor(meta,{seed=7341}={}){this.meta=meta;this.random=random(seed);this.time=0;this.serial=0;this.users=new Map();this.state={id:meta.id,name:meta.name,view:'board',time:0,round:1,phase:'playing',headline:meta.name,subtitle:'O chat participa da brincadeira',players:[],objects:[],effects:[],teams:[],scores:[],feed:[],actions:[]};}
 rnd(a=0,b=1){return a+(b-a)*this.random();}
 pick(a){return a[Math.floor(this.random()*a.length)];}
 uid(prefix='item'){return prefix+'-'+(++this.serial);}
 player(e={}){const id=String(e.viewer?.id||e.userId||'local').slice(0,80);if(this.users.has(id))return this.users.get(id);if(this.users.size>=200){const oldest=[...this.users.keys()].find(k=>k.startsWith('bot-'));if(oldest)this.users.delete(oldest);else return null;}const p={id,name:String(e.viewer?.name||e.nickname||'Participante').replace(/[\u0000-\u001f]/g,'').slice(0,40),score:0,color:Math.floor(this.rnd(0,360)),team:Math.floor(this.rnd(0,2)),x:this.rnd(90,W-90),y:this.rnd(140,H-130),vx:0,vy:0,hp:100,maxHp:100,alive:true,size:20,cooldown:0,power:1,level:1,xp:0};this.users.set(id,p);return p;}
 bot(){return this.player({viewer:{id:this.uid('bot'),name:this.pick(['Lia','Davi','Beto','Luna','Nina','Gui','Rafa','Bia'])}});}
 addScore(p,n){if(p)p.score=Math.max(0,Math.min(1e9,p.score+n));}
 note(text){this.state.feed.unshift({id:++this.serial,time:this.time,text:String(text).slice(0,160)});this.state.feed.length=Math.min(10,this.state.feed.length);}
 effect(x,y,text,color='#ffb04b'){this.state.effects.push({id:++this.serial,x,y,text:String(text).slice(0,40),color,life:1.3});}
 finish(winner){if(this.state.phase==='finished')return;this.state.phase='finished';this.state.winner=winner?.name||String(winner||'Rodada concluída');this.state.headline=this.state.winner+' venceu!';this.roundEnd=this.time+4;}
 nextRound(){this.state.round++;this.state.phase='playing';delete this.state.winner;this.state.headline=this.meta.name;this.roundEnd=null;this.reset?.();}
 input(e={}){if(typeof e!=='object'||e===null||this.state.phase!=='playing')return;const p=this.player(e);if(!p)return;const event={...e,kind:String(e.kind||'comment'),text:String(e.text||e.comment||'').slice(0,240),action:String(e.action||'').slice(0,50),count:clamp(Number(e.count)||1,1,100),coins:clamp(Number(e.coins)||0,0,10000)};event.word=norm(event.text);this.onInput?.(event,p);}
 tick(dt=.05){dt=clamp(Number(dt)||0,0,.1);this.time+=dt;this.state.time=this.time;for(const f of this.state.effects)f.life-=dt;this.state.effects=this.state.effects.filter(f=>f.life>0).slice(-80);if(this.state.phase==='finished'){if(this.time>=this.roundEnd)this.nextRound();}else this.step?.(dt);this.sync?.();return this.state;}
 snapshot(){this.sync?.();this.state.players=[...this.users.values()].map(p=>({...p}));this.state.scores=[...this.users.values()].filter(p=>!p.id.startsWith('bot-')).sort((a,b)=>b.score-a.score).slice(0,8).map(({id,name,score,team})=>({id,name,score,team}));return structuredClone(this.state);}
}
