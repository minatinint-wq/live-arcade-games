import {Arena} from '../core/arena.mjs';
import {distance,clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='take-the-crown');
const rules={
 theme:'crown',speed:52,hint:'entrar · desafiar · escudo',
 actions:[{id:'join',label:'Entrar na fila'},{id:'challenge',label:'Desafiar'},{id:'shield',label:'Proteger o trono'}],
 reset(g){g.state.objects=[{kind:'throne',x:450,y:600,size:70}];g.owner=null;g.held=0;},
 input(g,e,p){if(e.action==='challenge'||e.kind==='gift')p.power=Math.min(8,p.power+2);if(e.action==='shield')p.hp=Math.min(200,p.hp+40);},
 drive(g,p,t,dt){if(!g.owner||!g.users.get(g.owner)?.alive){g.owner=p.id;g.held=0;g.note(p.name+' tomou a coroa');}if(p.id===g.owner){p.x=450;p.y=600;g.held+=dt;g.addScore(p,dt);if(g.held>=25)g.finish(p);}else{const a=Math.atan2(600-p.y,450-p.x);p.x+=Math.cos(a)*65*dt;p.y+=Math.sin(a)*65*dt;if(Math.hypot(p.x-450,p.y-600)<65&&p.cooldown<=0){g.damage(g.users.get(g.owner),12*p.power,p);p.cooldown=1.3;}}g.state.holdTime=g.held;g.state.owner=g.owner;}
};
export default class extends Arena {constructor(options){super(meta,rules,options);}}
