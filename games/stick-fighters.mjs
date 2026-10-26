import {Arena} from '../core/arena.mjs';
import {distance,clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='stick-fighters');
const rules={
 theme:'platform',speed:0,hint:'entrar · soco · salto',
 actions:[{id:'join',label:'Entrar'},{id:'punch',label:'Soco'},{id:'jump',label:'Saltar'}],
 reset(g){g.state.objects=[{kind:'platform',x:450,y:1080,w:800,h:24},{kind:'platform',x:230,y:770,w:270,h:20},{kind:'platform',x:650,y:550,w:250,h:20}];for(const p of g.users.values())p.y=1050;},
 input(g,e,p){if(e.action==='jump'||e.word==='pular')p.vy=-550;if(e.action==='punch'||e.kind==='gift'){p.power=Math.min(6,p.power+1);p.cooldown=0;}},
 drive(g,p,t,dt){if(t)p.x+=Math.sign(t.x-p.x)*75*dt;p.vy+=750*dt;const next=p.y+p.vy*dt;for(const platform of g.state.objects)if(p.vy>=0&&Math.abs(p.x-platform.x)<platform.w/2&&p.y+p.size<=platform.y&&next+p.size>=platform.y){p.y=platform.y-p.size;p.vy=0;}if(p.y>1160){p.hp=100;p.y=250;p.x=g.rnd(100,800);}if(g.random()<dt*.25&&p.vy===0)p.vy=-480;},
 contact(g,a,b){if(a.cooldown<=0){g.damage(b,12*a.power,a);b.vx+=Math.sign(b.x-a.x||1)*220;b.vy=-160;a.cooldown=.9;g.effect(b.x,b.y,'POW!');}}
};
export default class extends Arena {constructor(options){super(meta,rules,options);}}
