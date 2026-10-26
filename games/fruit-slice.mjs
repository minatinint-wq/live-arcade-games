import {Arcade} from '../core/arcade.mjs';
import {distance,clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='fruit-slice');
const rules={
 theme:'fruit',hint:'Clique nas frutas · corte · bomba',actions:[{id:'slice',label:'Cortar fruta'},{id:'fruit',label:'Lançar frutas'},{id:'bomb',label:'Lançar bomba'}],
 reset(g){g.spawnAt=0;g.state.combo=0;},
 input(g,e,p){if(e.action==='fruit'||e.action==='bomb'||e.kind==='gift'){g.state.objects.push({id:g.uid(),kind:e.action==='bomb'?'bomb':'fruit',x:g.rnd(150,750),y:1100,vx:g.rnd(-100,100),vy:-g.rnd(650,850),size:35,color:g.rnd(0,360)});return;}if(e.action==='slice'||e.word==='cortar'){const x=Number.isFinite(e.x)?e.x:g.state.objects.find(o=>o.kind==='fruit')?.x??450,y=Number.isFinite(e.y)?e.y:g.state.objects.find(o=>o.kind==='fruit')?.y??600;for(const o of g.state.objects)if(!o.cut&&Math.hypot(o.x-x,o.y-y)<80){o.cut=true;if(o.kind==='bomb'){g.hit();g.state.combo=0;}else{g.state.combo++;g.score(10+g.state.combo,p);g.effect(o.x,o.y,'+'+(10+g.state.combo));}}}},
 step(g,dt){if(g.time>g.spawnAt){g.spawnAt=g.time+1.1;g.rules.input(g,{action:g.random()<.16?'bomb':'fruit'},null);}for(const o of g.state.objects){o.x+=o.vx*dt;o.vy+=650*dt;o.y+=o.vy*dt;}g.state.objects=g.state.objects.filter(o=>!o.cut&&o.y<1250);}
};
export default class extends Arcade {constructor(options){super(meta,rules,options);}}
