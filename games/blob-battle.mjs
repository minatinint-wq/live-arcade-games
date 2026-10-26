import {Arena} from '../core/arena.mjs';
import {distance,clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='blob-battle');
const rules={
 theme:'blob',speed:22,hint:'entrar · comida · dividir',
 actions:[{id:'join',label:'Entrar'},{id:'food',label:'Soltar comida'},{id:'split',label:'Dividir energia'}],
 reset(g){g.state.objects=Array.from({length:70},()=>({id:g.uid(),kind:'food',x:g.rnd(35,865),y:g.rnd(110,1160),size:5}));},
 input(g,e,p){if(e.action==='food'||e.kind==='gift')for(let i=0;i<12;i++)g.state.objects.push({id:g.uid(),kind:'food',x:g.rnd(35,865),y:g.rnd(110,1160),size:5});if(e.action==='split'&&(p.mass||25)>35){p.mass*=.75;p.vx+=220*Math.cos(p.angle||0);p.vy+=220*Math.sin(p.angle||0);}},
 drive(g,p,t,dt){p.mass??=25;const food=g.state.objects.reduce((best,o)=>!best||distance(p,o)<distance(p,best)?o:best,null);const target=t&&(t.mass||25)<p.mass*.83?t:food;if(target){const a=Math.atan2(target.y-p.y,target.x-p.x);p.x+=Math.cos(a)*210/Math.sqrt(p.mass)*dt;p.y+=Math.sin(a)*210/Math.sqrt(p.mass)*dt;}},
 actor(g,p){p.mass??=25;p.size=9+Math.sqrt(p.mass)*3;for(let i=g.state.objects.length-1;i>=0;i--)if(distance(p,g.state.objects[i])<p.size){g.state.objects.splice(i,1);p.mass+=2;g.addScore(p,2);}},
 contact(g,a,b){if(a.mass>b.mass*1.18){a.mass+=b.mass*.5;g.damage(b,10000,a);}else if(b.mass>a.mass*1.18){b.mass+=a.mass*.5;g.damage(a,10000,b);}},
 onDeath(g,p){p.mass=25;},step(g,dt){if(g.state.objects.length<65&&g.random()<dt*15)g.state.objects.push({id:g.uid(),kind:'food',x:g.rnd(35,865),y:g.rnd(110,1160),size:5});}
};
export default class extends Arena {constructor(options){super(meta,rules,options);}}
