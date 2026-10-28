import test from 'node:test';import assert from 'node:assert/strict';
import {createGame,CATALOG} from '../runtime.mjs';import {dispatchInput} from '../core/commands.mjs';
import {visualState} from '../web/motion.mjs';import {SCENERY} from '../web/scenery.mjs';
test('team commands accept adjective, prefix and suffix without silently changing a rejected selection',async()=>{
 for(const text of ['Cabra pesada vermelha','vermelha cabra pesada','equipe vermelha cabra pesada','cabra pesada da equipe vermelha','!cabra pesada vermelho']){
  const g=await createGame('goat-sumo'),r=dispatchInput(g,{text,viewer:{id:'v',name:'Visitante'}});assert.equal(r.accepted,true,text);assert.equal(r.action,'heavy');assert.equal(r.team,1);assert.equal(g.users.get('v').team,1);assert.match(r.message,/Vermelha/);
 }
 const g=await createGame('goat-sumo');assert(dispatchInput(g,{text:'azul empurrar'}).accepted);assert.equal(g.users.get('local').team,0);const before=g.users.get('local').team;assert.equal(dispatchInput(g,{text:'comando inexistente vermelha'}).accepted,false);assert.equal(g.users.get('local').team,before);
 g.finish('Teste');assert.equal(dispatchInput(g,{text:'cabra pesada vermelha'}).accepted,false);assert.equal(g.users.get('local').team,before);
});
test('render clock interpolates snapshots continuously without mutating simulation or carrying another game',()=>{
 const canvas={},a={id:'a',round:1,time:1,players:[{id:'p',x:0,y:10}],objects:[]},b={...a,time:1.1,players:[{id:'p',x:100,y:30}]};
 visualState(canvas,a,10);visualState(canvas,b,10.1);const mid=visualState(canvas,b,10.15);assert(Math.abs(mid.players[0].x-50)<.001);assert(mid.visualTime>b.time);assert.equal(b.players[0].x,100);assert.equal(visualState(canvas,{...b,round:2},10.2).players[0].x,100);
});
test('all 57 originals have an explicit environment; goats, lunar, printing and MMA use separate settings',()=>{
 assert.deepEqual(Object.keys(SCENERY).sort(),CATALOG.map(g=>g.id).sort());const distinct=new Set(['goat-sumo','lunar-dash','coin-mint','pfp-printer','mma-clash'].map(id=>SCENERY[id][0]));assert.equal(distinct.size,5);assert.equal(new Set(Object.values(SCENERY).map(JSON.stringify)).size,57);
});
test('timeout and draw results do not claim that a round-ending message won',async()=>{
 const g=await createGame('context');for(let i=0;i<1801;i++)g.tick(.05);assert.equal(g.state.phase,'finished');assert.equal(g.state.headline,'Rodada encerrada');assert(!g.state.headline.includes('venceu'));
 const poll=await createGame('would-you-rather');for(let i=0;i<601;i++)poll.tick(.05);assert.equal(poll.state.headline,'Empate!');assert.equal(poll.state.message,'Empate!');
});
test('a team match tied at the time limit never awards the blue team by default',async()=>{const g=await createGame('goat-sumo');for(let i=0;i<2401;i++)g.tick(.05);assert.equal(g.state.phase,'finished');assert.equal(g.state.headline,'Empate!');assert.equal(g.state.teams[0].wins,0);assert.equal(g.state.teams[1].wins,0);});
