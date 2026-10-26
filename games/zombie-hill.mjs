import {Arcade} from '../core/arcade.mjs';
import {distance,clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='zombie-hill');
const rules={
 theme:'zombie',hint:'atirar · recarregar · reforço · zumbi',actions:[{id:'shoot',label:'Atirar'},{id:'reload',label:'Recarregar'},{id:'heal',label:'Reforçar abrigo'},{id:'zombie',label:'Soltar zumbi'}],
 reset(g){g.state.ammo=6;g.state.shelter=100;g.reloadAt=0;g.spawnAt=g.time;g.shots=[];g.state.avatar.y=1050;},
 input(g,e,p){if(e.action==='reload'){if(!g.reloadAt)g.reloadAt=g.time+1.8;return;}if(e.action==='heal'){g.state.shelter=Math.min(100,g.state.shelter+20);return;}if(e.action==='zombie'||e.kind==='gift'){g.state.objects.push({id:g.uid(),kind:'zombie',x:g.rnd(70,830),y:130,hp:50,size:22,speed:g.rnd(30,50)});return;}if(e.action==='shoot'&&g.state.ammo>0&&!g.reloadAt){g.state.ammo--;const target=g.state.objects.filter(z=>z.hp>0).sort((a,b)=>b.y-a.y)[0];if(target){target.hp-=35;g.state.lastShot={x:target.x,y:target.y,at:g.time};if(target.hp<=0)g.score(10,p);}}},
 step(g,dt){if(g.reloadAt&&g.time>=g.reloadAt){g.state.ammo=6;g.reloadAt=0;}if(g.time>=g.spawnAt){g.spawnAt=g.time+Math.max(.4,2-(g.time-g.roundAt)/100);g.rules.input(g,{action:'zombie'},null);}for(const z of g.state.objects){z.y+=z.speed*dt;if(z.y>1000&&z.hp>0){g.state.shelter=Math.max(0,g.state.shelter-15);z.hp=0;if(g.state.shelter===0)g.finish('A horda');}}g.state.objects=g.state.objects.filter(z=>z.hp>0);g.state.meter=g.state.shelter/100;}
};
export default class extends Arcade {constructor(options){super(meta,rules,options);}}
