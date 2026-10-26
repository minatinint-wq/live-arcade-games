import {Arcade} from '../core/arcade.mjs';
import {distance,clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='tower-stack');
const rules={
 theme:'stack',hint:'soltar · vento · estabilizar',actions:[{id:'drop',label:'Soltar andar'},{id:'wind',label:'Rajada de vento'},{id:'steady',label:'Estabilizar'}],
 reset(g){g.state.blocks=[{x:450,width:460}];g.state.moving={x:150,width:460,v:160};g.state.wind=0;},
 input(g,e,p){if(e.action==='wind'||e.kind==='gift'){g.state.wind+=g.random()<.5?-70:70;return;}if(e.action==='steady'){g.state.moving.v*=.85;return;}const m=g.state.moving,top=g.state.blocks.at(-1),left=Math.max(m.x-m.width/2,top.x-top.width/2),right=Math.min(m.x+m.width/2,top.x+top.width/2),width=right-left;if(width<18){g.finish('O chat');return;}g.state.blocks.push({x:(left+right)/2,width});g.score(Math.round(width/m.width*10),p);g.state.moving={x:150,width,v:(150+g.state.blocks.length*7)*(g.random()<.5?-1:1)};if(g.state.blocks.length>=30)g.finish('A torre');},
 step(g,dt){const m=g.state.moving;m.x+=(m.v+g.state.wind)*dt;if(m.x<100){m.x=100;m.v=Math.abs(m.v);}if(m.x>800){m.x=800;m.v=-Math.abs(m.v);}g.state.wind*=Math.pow(.45,dt);g.state.meter=g.state.blocks.length/30;}
};
export default class extends Arcade {constructor(options){super(meta,rules,options);}}
