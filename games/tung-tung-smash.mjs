import {Social} from '../core/social.mjs';
import {clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='tung-tung-smash');
const rules={
theme:'dummy',actions:[{id:'bonk',label:'Martelo de espuma'},{id:'spring',label:'Mola gigante'},{id:'confetti',label:'Explosão de confete'}],reset(g){g.state.dummy={x:450,y:680,vx:0,vy:0,angle:0,spin:0};g.state.combo=0;g.lastHit=-10;},
input(g,e,p){const a=g.state.dummy;a.vx=g.rnd(-250,250);a.vy=e.action==='spring'?-500:-200;a.spin=g.rnd(-6,6);g.state.combo=g.time-g.lastHit<3?g.state.combo+1:1;g.lastHit=g.time;g.addScore(p,g.state.combo*10);g.effect(a.x,a.y,e.action==='confetti'?'FESTA!':'POF!');if(e.action==='confetti')for(let i=0;i<30;i++)g.state.objects.push({kind:'confetti',x:a.x,y:a.y,vx:g.rnd(-250,250),vy:g.rnd(-500,-100),life:2,color:g.rnd(0,360)});},
step(g,dt){const a=g.state.dummy;a.vy+=600*dt;a.angle+=a.spin*dt;const reach=Math.abs(Math.cos(a.angle))*150+Math.abs(Math.sin(a.angle))*225;a.x=clamp(a.x+a.vx*dt,reach+35,865-reach);a.y+=a.vy*dt;if(a.y>760){a.y=760;a.vy*=-.4;a.vx*=.75;a.spin*=.6;}for(const o of g.state.objects){o.x+=o.vx*dt;o.y+=o.vy*dt;o.vy+=500*dt;o.life-=dt;}g.state.objects=g.state.objects.filter(o=>o.life>0);}
};
export default class extends Social {constructor(options){super(meta,rules,options);}}
