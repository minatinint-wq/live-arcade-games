import {Social} from '../core/social.mjs';
import {clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='snake');
const rules={
theme:'snake',actions:[{id:'up',label:'↑ Cima'},{id:'left',label:'← Esquerda'},{id:'down',label:'↓ Baixo'},{id:'right',label:'→ Direita'},{id:'food',label:'Soltar comida'},{id:'bomb',label:'Obstáculo'}],
reset(g){g.state.body=[{x:10,y:10},{x:9,y:10},{x:8,y:10}];g.state.direction={x:1,y:0};g.state.food={x:15,y:10};g.state.obstacles=[];g.moveAt=g.time+.22;g.state.points=0;g.turnPending=false;g.state.previousBody=g.state.body.map(v=>({...v}));g.state.movedAt=g.time;},
input(g,e,p){const dirs={up:[0,-1],left:[-1,0],down:[0,1],right:[1,0],cima:[0,-1],esquerda:[-1,0],baixo:[0,1],direita:[1,0]};const d=dirs[e.action]||dirs[e.word];if(d&&!g.turnPending){const old=g.state.direction;if(old.x!==-d[0]||old.y!==-d[1]){g.state.direction={x:d[0],y:d[1]};g.turnPending=true;}}const empty=()=>{for(let i=0;i<600;i++){const v={x:Math.floor(g.rnd(0,20)),y:Math.floor(g.rnd(0,20))};if(![...g.state.body,...g.state.obstacles,g.state.food].some(b=>b.x===v.x&&b.y===v.y))return v;}return null;};if(e.action==='food'){const v=empty();if(v)g.state.food=v;}if(e.action==='bomb'&&g.state.obstacles.length<30){const v=empty();if(v)g.state.obstacles.push(v);}g.addScore(p,1);},
step(g){if(g.time<g.moveAt)return;g.moveAt=g.time+.22;g.turnPending=false;const old=g.state.body[0],d=g.state.direction,h={x:(old.x+d.x+20)%20,y:(old.y+d.y+20)%20},eat=h.x===g.state.food.x&&h.y===g.state.food.y;const colliders=eat?g.state.body:g.state.body.slice(0,-1);if([...colliders,...g.state.obstacles].some(b=>b.x===h.x&&b.y===h.y)){g.finish('Fim da cobrinha');return;}g.state.previousBody=g.state.body.map(v=>({...v}));g.state.movedAt=g.time;g.state.body.unshift(h);if(eat){g.state.points+=10;const empty=[];for(let x=0;x<20;x++)for(let y=0;y<20;y++)if(![...g.state.body,...g.state.obstacles].some(b=>b.x===x&&b.y===y))empty.push({x,y});if(!empty.length){g.finish('Tabuleiro completo');return;}g.state.food=g.pick(empty);}else g.state.body.pop();}
};
export default class extends Social {constructor(options){super(meta,rules,options);}}
