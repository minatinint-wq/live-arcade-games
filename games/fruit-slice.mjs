import {Arcade} from '../core/arcade.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='fruit-slice');
const rules={
 theme:'fruit',hint:'Arraste para cortar frutas · evite as bombas',actions:[{id:'slice',label:'Cortar fruta'},{id:'fruit',label:'Lançar frutas'},{id:'bomb',label:'Lançar bomba'}],
 reset(g){g.spawnAt=g.time+.3;Object.assign(g.state,{combo:0,slices:[],cutTrail:[],misses:0});},
 input(g,e,p){
  if(e.action==='fruit'||e.action==='bomb'||e.kind==='gift'){g.state.objects.push({id:g.uid(),kind:e.action==='bomb'?'bomb':'fruit',x:g.rnd(150,750),y:1100,vx:g.rnd(-100,100),vy:-g.rnd(650,850),size:35,color:g.rnd(0,360),angle:g.rnd(-1,1),spin:g.rnd(-1.5,1.5)});return;}
  if(e.action!=='slice'&&e.word!=='cortar')return;
  const x=Number.isFinite(e.x)?e.x:g.state.objects.find(o=>o.kind==='fruit')?.x??450,y=Number.isFinite(e.y)?e.y:g.state.objects.find(o=>o.kind==='fruit')?.y??600;
  g.state.cutTrail.push({x,y,at:g.time});g.state.cutTrail=g.state.cutTrail.slice(-12);
  for(const o of g.state.objects)if(!o.cut&&Math.hypot(o.x-x,o.y-y)<o.size+35){
   o.cut=true;
   if(o.kind==='bomb'){g.hit();g.state.combo=0;g.state.blastAt=g.time;g.state.blast={x:o.x,y:o.y};}
   else{g.state.combo++;g.score(10+g.state.combo,p);g.effect(o.x,o.y,'+'+(10+g.state.combo));for(const side of [-1,1])g.state.slices.push({x:o.x,y:o.y,vx:side*95+o.vx*.3,vy:-110,size:o.size,color:o.color,angle:o.angle,side,life:.75});}
  }
 },
 step(g,dt){
  if(g.time>g.spawnAt){g.spawnAt=g.time+1.1;g.rules.input(g,{action:g.random()<.16?'bomb':'fruit'},null);}
  for(const o of g.state.objects){o.x+=o.vx*dt;o.vy+=650*dt;o.y+=o.vy*dt;o.angle+=o.spin*dt;if(o.kind==='fruit'&&!o.cut&&o.y>=1250){g.state.misses++;g.state.combo=0;if(g.state.misses%3===0)g.hit();}}
  g.state.objects=g.state.objects.filter(o=>!o.cut&&o.y<1250);
  for(const o of g.state.slices){o.life-=dt;o.vy+=480*dt;o.x+=o.vx*dt;o.y+=o.vy*dt;o.angle+=o.side*dt*2;}
  g.state.slices=g.state.slices.filter(o=>o.life>0).slice(-40);g.state.cutTrail=g.state.cutTrail.filter(o=>g.time-o.at<.22);
 }
};
export default class extends Arcade {constructor(options){super(meta,rules,options);}}
