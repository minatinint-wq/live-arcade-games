import test from 'node:test';import assert from 'node:assert/strict';
import {visualState} from '../web/motion.mjs';import {createGame} from '../runtime.mjs';import {dispatchInput} from '../core/commands.mjs';
import {readFileSync} from 'node:fs';

test('cross review: anonymous platforms and confetti never borrow the last anonymous object position',()=>{
 const canvas={},a={id:'platforms',round:1,time:1,players:[],objects:[{kind:'platform',x:450,y:1080},{kind:'platform',x:230,y:770},{kind:'platform',x:650,y:550}]},b=structuredClone(a);b.time=1.1;
 visualState(canvas,a,100);const start=visualState(canvas,b,100.1);assert.deepEqual(start.objects.map(p=>[p.x,p.y]),b.objects.map(p=>[p.x,p.y]));
 const mid=visualState(canvas,b,100.15);assert.deepEqual(mid.objects.map(p=>[p.x,p.y]),b.objects.map(p=>[p.x,p.y]));
});
test('cross review: named actors interpolate independently and a new actor spawns at its own coordinates',()=>{
 const canvas={},a={id:'test',round:1,time:2,players:[{id:'a',x:10,y:30},{id:'b',x:800,y:900}],objects:[]},b={...a,time:2.1,players:[{id:'b',x:700,y:800},{id:'a',x:110,y:130},{id:'new',x:400,y:600}]};
 visualState(canvas,a,10);visualState(canvas,b,10.1);const s=visualState(canvas,b,10.15);assert(Math.abs(s.players[0].x-750)<.001);assert(Math.abs(s.players[1].x-60)<.001);assert.equal(s.players[2].x,400);assert.equal(b.players[1].x,110);
 const reset=visualState(canvas,{...b,round:2,players:[{id:'a',x:450,y:600}]},10.2);assert.equal(reset.players[0].x,450);
});
test('cross review: immutable copies of one snapshot keep the render clock and same-tick controls visible',()=>{
 const canvas={},a={id:'copy',round:1,time:1,players:[{id:'a',x:0,y:0}],objects:[]},b={...a,time:1.1,players:[{id:'a',x:100,y:100}]};
 visualState(canvas,a,10);visualState(canvas,b,10.1);const mid=visualState(canvas,structuredClone(b),10.15);assert(Math.abs(mid.players[0].x-50)<.001);assert(Math.abs(mid.visualTime-1.15)<.001);
 const next=visualState(canvas,{...structuredClone(b),lastAction:'punch'},10.18);assert(Math.abs(next.players[0].x-80)<.001);assert.equal(next.lastAction,'punch');assert(next.visualTime>mid.visualTime);
});
test('cross review: viewer exact heavy-goat forms select red, apply actual mass and preserve blue on rejection',async()=>{
 for(const text of ['!CABRA PESADA VERMELHA!','cabra pesada, vermelha','Cabra pesada da vermelha','vermelha cabra pesada']){
  const g=await createGame('goat-sumo'),viewer={id:'review',name:'Revisão'};const r=dispatchInput(g,{viewer,text});assert(r.accepted,text);assert.equal(r.team,1);assert(g.state.objects.find(o=>o.team===1).heavyUntil>g.time,text);
 }
 const g=await createGame('goat-sumo'),viewer={id:'review',name:'Revisão'};dispatchInput(g,{viewer,text:'azul'});assert.equal(dispatchInput(g,{viewer,text:'tarefa inexistente vermelha'}).accepted,false);assert.equal(g.users.get('review').team,0);
 g.finish('Rodada encerrada');const before=g.state.objects.find(o=>o.team===1).heavyUntil;assert.equal(dispatchInput(g,{viewer,text:'cabra pesada vermelha'}).accepted,false);assert.equal(g.state.objects.find(o=>o.team===1).heavyUntil,before);assert.equal(g.state.headline,'Rodada encerrada');
});
test('cross review: every atlas crop stays inside its actual PNG, including custom book/orb/scenery cells',async()=>{
 const previous=globalThis.Image;
 try{
  globalThis.Image=class{set src(url){const b=readFileSync(new URL(url));this.naturalWidth=b.readUInt32BE(16);this.naturalHeight=b.readUInt32BE(20);this.onload();}};
  const art=await import('../web/art.mjs?cross-review');await art.loadArt();assert(art.artReady());let calls=0;
  const c={drawImage(im,sx,sy,sw,sh,x,y,w,h){assert(sx>=0&&sy>=0&&sw>0&&sh>0);assert(sx+sw<=im.naturalWidth+.001);assert(sy+sh<=im.naturalHeight+.001);assert(w>0&&h>0);calls++;}};
  for(const [name,count]of [['objects',12],['environments',16],['goat-motion',12],['fighter-motion',16],['horse-motion',8]])for(let i=0;i<count;i++)assert(art.frame(c,name,i,0,0,200,200));assert.equal(calls,64);
 }finally{if(previous===undefined)delete globalThis.Image;else globalThis.Image=previous;}
});
