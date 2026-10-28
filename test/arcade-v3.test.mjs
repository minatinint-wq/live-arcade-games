import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from '../runtime.mjs';
import {pointerInput} from '../web/interact.mjs';
import {arcade,portalProjection} from '../web/arcade.mjs';
import {loadArt} from '../web/art.mjs';
const viewer={id:'arcade-review',name:'Teste Arcade'};
const input=(g,action,extra={})=>g.input({kind:'control',viewer,action,...extra});
const advance=(g,seconds)=>{for(let i=0;i<Math.round(seconds*20);i++)g.tick(.05);};

test('fruit-slice: a real pointer cut splits one fruit into two moving halves; missed fruits cost lives',async()=>{
 const g=await createGame('fruit-slice');g.spawnAt=1e6;input(g,'fruit');const f=g.state.objects[0],action=pointerInput(g.state,f.x,f.y);input(g,action.action,action);assert(g.state.points>0);assert.equal(g.state.slices.length,2);const x=g.state.slices[0].x;g.tick(.1);assert.notEqual(g.state.slices[0].x,x);assert.equal(g.state.objects.length,0);
 for(let n=0;n<3;n++)g.state.objects.push({id:'miss'+n,kind:'fruit',x:450,y:1249,vx:0,vy:100,size:35,color:0,angle:0,spin:0});g.tick(.05);assert.equal(g.state.misses,3);assert.equal(g.state.lives,2);
});
test('1000-stairs: boost advances its staircase and the 1000th step actually wins',async()=>{
 const g=await createGame('1000-stairs'),remaining=g.state.steps.slice(5);input(g,'boost');assert.equal(g.state.climbed,5);assert.deepEqual(g.state.steps.slice(0,11),remaining);assert(g.state.stepMotion.boost);g.state.climbed=998;input(g,'boost');assert.equal(g.state.climbed,1000);assert.equal(g.state.phase,'finished');assert.equal(g.state.steps.length,16);
});
test('voxel-craft: pointer selection survives building, initial count is real and capped cells cannot farm points',async()=>{
 const g=await createGame('voxel-craft');assert.equal(g.state.points,g.state.heights.reduce((a,b)=>a+b));const i=28,gx=450+(i%8-Math.floor(i/8))*39,gy=580+(i%8+Math.floor(i/8))*23;const pointer=pointerInput(g.state,gx,gy);assert.equal(pointer.index,i);input(g,'build',pointer);assert.equal(g.state.heights[i],1);assert.equal(g.state.focus,i);input(g,'break',{index:i});assert.equal(g.state.heights[i],0);g.state.heights[i]=8;const score=g.users.get(viewer.id).score;input(g,'build',{index:i});assert.equal(g.users.get(viewer.id).score,score);assert.equal(g.state.heights[i],8);
});
test('flappy-3d: visible portal opening matches the collision plane and the pig needs body clearance',async()=>{
 for(const [offset,passes]of [[0,true],[119.1,false]]){const g=await createGame('flappy-3d');g.spawnAt=1e6;g.state.avatar.y=500+offset;g.state.avatar.vy=-14.5;const gate={id:'gate',kind:'portal',z:.75,gapY:500,gap:310,passed:false};g.state.objects=[gate];const visual=portalProjection({...gate,z:.7});assert.equal(visual.centerY,500);assert.equal(visual.gap,310);g.tick(.05);assert(gate.passed);assert.equal(g.state.points,passes?10:0);assert.equal(g.state.lives,passes?3:2);}
 const ceiling=await createGame('flappy-3d');ceiling.state.avatar.y=80;ceiling.tick(.05);assert.equal(ceiling.state.lives,2);assert(ceiling.state.avatar.y>=90);
});
test('log-rush: a safe chop produces moving wood chips and the visible branch side hurts',async()=>{
 const g=await createGame('log-rush');g.state.branches[0]=-1;input(g,'left');assert.equal(g.state.points,1);assert.equal(g.state.chips.length,8);const y=g.state.chips[0].y;g.tick(.1);assert.notEqual(g.state.chips[0].y,y);g.state.branches[0]=0;input(g,'left');assert.equal(g.state.lives,2);assert.equal(g.state.chop.hit,true);input(g,'branch');assert([0,1].includes(g.state.branches[1]));
});
test('zombie-hill: recoil, reload progress, death pose and ammunition all match their actions',async()=>{
 const g=await createGame('zombie-hill');g.spawnAt=1e6;input(g,'zombie');const z=g.state.objects[0],y=z.y;input(g,'shoot');assert.equal(g.state.ammo,5);assert.equal(z.hp,15);assert(z.y<y);assert(g.state.lastShot);input(g,'reload');advance(g,.5);assert(g.state.reloadProgress>0&&g.state.reloadProgress<1);input(g,'shoot');assert.equal(g.state.ammo,5);advance(g,1.4);assert.equal(g.state.ammo,6);input(g,'shoot');assert.equal(g.state.fallen.length,1);assert.equal(g.state.points,10);g.tick(.05);assert.equal(g.state.objects.length,0);advance(g,.6);assert.equal(g.state.fallen.length,0);
});
test('window-wipe: a right-edge wipe never cleans the next row left and clean glass cannot farm score',async()=>{
 const g=await createGame('window-wipe');g.state.dirt.fill(1);input(g,'wipe',{x:899,y:1});assert.equal(g.state.dirt[7],.30000000000000004);assert.equal(g.state.dirt[15],.30000000000000004);assert.equal(g.state.dirt[8],1);assert(g.state.wipeMotion);g.state.dirt.fill(0);const score=g.users.get(viewer.id).score;input(g,'wipe',{x:0,y:0});assert.equal(g.users.get(viewer.id).score,score);input(g,'dirty');assert(g.state.dirt.some(v=>v>0));input(g,'bucket');assert(g.state.bucketAt>=0);
});
test('tower-stack: discarded overlap moves, wind cannot pin the floor outside the playfield, and stabilization has a floor',async()=>{
 const g=await createGame('tower-stack');g.state.moving.x=600;input(g,'drop');assert.equal(g.state.blocks.length,2);assert(g.state.falling.length>0);const y=g.state.falling[0].y;g.tick(.1);assert(g.state.falling[0].y>y);g.state.wind=-2000;input(g,'wind');assert(Math.abs(g.state.wind)<=250);advance(g,3);const m=g.state.moving;assert(m.x-m.width/2>=40);assert(m.x+m.width/2<=860);for(let i=0;i<100;i++)input(g,'steady');assert(Math.abs(g.state.moving.v)>=90);
 const perfect=await createGame('tower-stack');perfect.state.moving.x=450;input(perfect,'drop');assert.equal(perfect.state.blocks[1].width,460);assert.equal(perfect.state.perfect,1);
});
test('lunar-dash: no mid-air impulse reset and only successfully avoided meteors award points',async()=>{
 const g=await createGame('lunar-dash');g.spawnAt=1e6;input(g,'jump');assert.equal(g.state.avatar.grounded,false);g.state.avatar.vy=-200;input(g,'jump');assert.equal(g.state.avatar.vy,-200);advance(g,2);assert.equal(g.state.avatar.grounded,true);g.state.objects=[{id:'bad',x:169,y:940,size:35,angle:0,hit:true},{id:'good',x:169,y:940,size:35,angle:0,hit:false}];g.state.avatar.y=600;g.state.avatar.grounded=false;g.tick(.05);assert.equal(g.state.points,5);input(g,'gravity');assert.equal(g.state.lowGravity,true);advance(g,7.1);assert.equal(g.state.lowGravity,false);
});

test('all nine revised arcade renderers produce changing animation and finite sprite coordinates',async()=>{
 const originalImage=globalThis.Image;globalThis.Image=class {naturalWidth=1536;naturalHeight=1536;set src(value){this.source=value;queueMicrotask(()=>this.onload?.());}};
 try{await loadArt();for(const id of ['fruit-slice','1000-stairs','voxel-craft','flappy-3d','log-rush','zombie-hill','window-wipe','tower-stack','lunar-dash']){
  const g=await createGame(id);input(g,id==='fruit-slice'?'fruit':id==='zombie-hill'?'zombie':id==='1000-stairs'?(g.state.steps[0]?'right':'left'):id==='voxel-craft'?'build':id==='window-wipe'?'wipe':id==='log-rush'?(g.state.branches[0]===0?'right':'left'):g.state.actions[0].id);g.tick(.05);
  const ops=[];const gradient={addColorStop(){}};const ctx=new Proxy({globalAlpha:1,measureText:s=>({width:String(s).length*12}),createLinearGradient:()=>gradient},{get:(o,k)=>k in o?o[k]:(...args)=>{for(const n of args)if(typeof n==='number')assert(Number.isFinite(n),id+' '+String(k));ops.push([String(k),...args.map(v=>typeof v==='object'?'image':v)]);},set:(o,k,v)=>{if(typeof v==='number')assert(Number.isFinite(v),id+' '+String(k));o[k]=v;ops.push(['set',String(k),v]);return true;}});
  let s=g.snapshot();s.visualTime=s.time;arcade(ctx,s);const first=JSON.stringify(ops);ops.length=0;g.tick(.1);s=g.snapshot();s.visualTime=s.time+.045;arcade(ctx,s);assert.notEqual(JSON.stringify(ops),first,id+' must animate');if(id!=='tower-stack')assert(ops.some(v=>v[0]==='drawImage'),id+' draws real local assets');
 }}finally{globalThis.Image=originalImage;}
});
