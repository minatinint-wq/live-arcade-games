import test from 'node:test';import assert from 'node:assert/strict';
import {createGame,CATALOG} from '../runtime.mjs';import {dispatchInput} from '../core/commands.mjs';
import {quiz} from '../web/quiz.mjs';import {social} from '../web/social.mjs';
const viewer={id:'social-v3',name:'Revisor'};
const input=(g,action,text='',id=viewer.id)=>g.input({kind:'control',action,text,viewer:{id,name:id===viewer.id?viewer.name:id}});
const tick=(g,n)=>{for(let i=0;i<n*20;i++)g.tick(.05);};
const cases={
 'would-you-rather':g=>{input(g,'answer:1');input(g,'answer:2');assert.deepEqual(g.state.votes,[0,1]);tick(g,30.1);assert.equal(g.state.phase,'finished');},
 context:g=>{input(g,'','resposta impossível');assert.equal(g.state.phase,'playing');input(g,'',g.target[0]);assert.equal(g.state.phase,'finished');},
 'five-letters':g=>{input(g,'','aaa');assert.equal(g.state.rows.length,0);input(g,'',g.target);assert(g.state.rows[0].at>=0);assert.equal(g.state.phase,'finished');},
 'guess-the-location':g=>{input(g,'',String(g.state.options.indexOf(g.target[0])+1));assert.equal(g.state.phase,'finished');},
 'true-or-false':g=>{input(g,'',g.target[1]?'falso':'verdadeiro');input(g,'',g.target[1]?'verdadeiro':'falso');assert.equal(g.state.phase,'playing');input(g,'',g.target[1]?'verdadeiro':'falso','outro');assert.equal(g.state.phase,'finished');},
 'word-swipe':g=>{input(g,'','casa');assert.equal(g.state.lastPath.length,4);assert.equal(new Set(g.state.lastPath).size,4);for(const w of g.targets)input(g,'',w);assert.equal(g.state.phase,'finished');},
 'trivia-time':g=>{input(g,'',String(g.target[2]+1));assert.equal(g.state.phase,'finished');},
 'memory-maestro':g=>{input(g,'hint');tick(g,.1);assert(g.peekAt>g.time);g.nextRound();assert.equal(g.peekAt,0);input(g,'','1');tick(g,.1);assert.equal(g.state.cards[0],g.cards[0]);const b=g.cards.findIndex((v,i)=>i!==0&&v===g.cards[0]);input(g,'',String(b+1));assert.equal(g.state.matched.length,2);assert(g.state.matchedAt[0]>=0);},
 'quick-math':g=>{input(g,'',String(g.answer));assert.equal(g.state.phase,'finished');},
 'word-hunt':g=>{for(const w of g.targets)input(g,'',w);assert.equal(g.state.objects.length,4);assert(g.state.objects.every(v=>v.at>=0));assert.equal(g.state.phase,'finished');},
 'crowd-says':g=>{for(const w of g.target[1])input(g,'',w);assert(g.state.answerAt.every(v=>v>=0));assert.equal(g.state.phase,'finished');},
 'word-cross':g=>{for(const v of g.entries)input(g,'',v.word);assert(g.state.entries.every(v=>v.solved&&v.at>=0));assert.equal(g.state.phase,'finished');},
 'find-the-word':g=>{assert.notEqual(g.state.letters.join(''),g.target[0]);input(g,'',g.target[0]);assert.equal(g.state.phase,'finished');},
 'guess-the-flag':g=>{input(g,'',g.target.name);assert.equal(g.state.phase,'finished');},
 'word-association':g=>{for(const w of g.target[2])input(g,'',w);assert.equal(g.state.found.length,5);assert.equal(g.state.phase,'finished');},
 'guess-the-drawing':g=>{tick(g,2);assert(g.state.progress>0);input(g,'',g.target[0]);assert.equal(g.state.phase,'finished');},
 'guess-the-logo':g=>{tick(g,2);assert(g.state.progress>0);input(g,'',g.target[0]);assert.equal(g.state.phase,'finished');},
 'guess-the-number':g=>{input(g,'','0');assert.equal(g.state.low,1);input(g,'',String(g.answer));assert.equal(g.state.phase,'finished');},
 'million-quiz':g=>{input(g,'half');assert.equal(g.state.hidden.length,2);assert(!g.state.hidden.includes(g.target[2]));for(let i=0;i<15;i++)input(g,'',String(g.target[2]+1));assert.equal(g.users.get(viewer.id).score,1000000);},
 'card-factory':g=>{for(let i=0;i<3;i++){input(g,'print');tick(g,1.4);}input(g,'upgrade');assert.equal(g.state.album.length,1);assert.equal(g.state.current.level,2);assert.equal(g.state.current.id,g.state.album[0].id);assert(g.state.current.createdAt>=0);},
 'coin-mint':g=>{input(g,'polish');assert.equal(g.users.get(viewer.id).score,0);input(g,'mint');tick(g,.1);assert(g.state.current.mintedAt>=0);for(let i=0;i<3;i++)input(g,'polish');const before=g.users.get(viewer.id).score;input(g,'polish');assert.equal(g.users.get(viewer.id).score,before);assert.equal(g.state.collection[0].shine,3);},
 'name-diary':g=>{input(g,'sign','Uma mensagem');input(g,'decorate');assert.equal(g.state.pages[0].length,1);for(let i=0;i<13;i++)input(g,'page');assert.equal(g.state.pages.length,12);assert.equal(g.state.stickers.length,0);assert.equal(g.state.page,11);assert(g.state.pageTurnAt>=0);},
 'pfp-printer':g=>{input(g,'print');tick(g,.1);const old=g.state.wall[0].color;input(g,'color');assert.notEqual(g.state.wall[0].color,old);assert.equal(g.state.current.color,g.users.get(viewer.id).color);},
 'ai-host':g=>{input(g,'joke');tick(g,.1);assert.equal(g.state.expression,'laugh');assert(g.state.speakingUntil>g.time);},
 'dance-party':g=>{for(let i=0;i<21;i++)input(g,'join','',String(i));tick(g,.2);assert.equal([...g.users.values()].filter(p=>p.dancing).length,18);assert.equal(g.danceSlots.size,18);for(let i=0;i<30;i++)input(g,'fast');assert.equal(g.state.bpm,180);},
 'tung-tung-smash':g=>{input(g,'spring');tick(g,.3);assert(g.state.dummy.y<680);input(g,'confetti');assert.equal(g.state.objects.length,30);tick(g,3);assert.equal(g.state.objects.length,0);assert(Number.isFinite(g.state.dummy.angle));const d=g.state.dummy,r=Math.abs(Math.cos(d.angle))*150+Math.abs(Math.sin(d.angle))*225;assert(d.x-r>=34&&d.x+r<=866);},
 'clip-machine':g=>{input(g,'win');tick(g,.1);assert.equal(g.state.scene,'win');assert(g.state.sceneAt>=0);},
 snake:g=>{const p=g.state.body[0];tick(g,.25);assert.equal(g.state.previousBody[0].x,p.x);assert.notEqual(g.state.body[0].x,p.x);assert(g.state.movedAt>0);},
 'guess-your-future':g=>{input(g,'future');tick(g,.1);assert.equal(g.state.person,viewer.name);input(g,'shuffle');assert.equal(g.state.shuffleAt,g.time);},
 'roast-your-photo':g=>{input(g,'nice');tick(g,.1);assert.equal(g.state.current.nice,true);assert(g.state.current.at>=0);},
 'dance-floor':g=>{input(g,'blue');input(g,'sync');assert(g.state.tiles.includes(0));assert(g.state.tileAt.some(v=>v>=0));assert.equal(g.state.teams[0].score,g.state.tiles.filter(v=>v===0).length);}
};
for(const [id,check] of Object.entries(cases))test('individual quiz/social review: '+id,async()=>{const g=await createGame(id,{seed:375});check(g);const round=g.state.round;g.nextRound();assert.equal(g.state.phase,'playing');assert.equal(g.state.round,round+1);});
test('all 31 reviewed quiz/social scenes animate or transition without invalid coordinates',async()=>{
 assert.equal(Object.keys(cases).length,31);
 for(const id of Object.keys(cases)){
  const g=await createGame(id),meta=CATALOG.find(v=>v.id===id);dispatchInput(g,{kind:'comment',text:g.state.actions[0].label,viewer});tick(g,.2);const values=[];
  const c=new Proxy({measureText:s=>({width:String(s).length*14}),createLinearGradient:()=>({addColorStop(){}})}, {get:(o,k)=>k in o?o[k]:(...a)=>{for(const n of a)if(typeof n==='number'){assert(Number.isFinite(n),id+' '+String(k));values.push(n);}},set:(o,k,v)=>{o[k]=v;return true;}});
  const renderer=g.state.view==='quiz'?quiz:social;const s=g.snapshot();renderer(c,{...s,visualTime:s.time+.04});assert(values.length>10,meta.id);
 }
});
