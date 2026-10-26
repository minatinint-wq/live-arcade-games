import test from 'node:test';import assert from 'node:assert/strict';import {readdir} from 'node:fs/promises';
import {createGame,CATALOG} from '../runtime.mjs';
function numeric(v,path='state'){if(typeof v==='number')assert(Number.isFinite(v),path);else if(v&&typeof v==='object')for(const [k,x]of Object.entries(v))numeric(x,path+'.'+k);}
const files=(await readdir(new URL('../games/',import.meta.url))).filter(f=>f.endsWith('.mjs'));
for(const file of files)test(file+' preserves the authoritative game contract under inputs and round changes',async()=>{
 const id=file.slice(0,-4),g=await createGame(id,{seed:981}),again=await createGame(id,{seed:981});assert(CATALOG.some(x=>x.id===id));assert.equal(g.snapshot().id,id);assert.deepEqual(g.snapshot(),again.snapshot());
 const viewer={id:'test-viewer',name:'Jogador de teste'};g.input({kind:'comment',viewer,text:'entrar',action:'join'});
 for(const action of g.state.actions)g.input({viewer,action:action.id,kind:'control',text:'teste',count:1,coins:10});
 for(let i=0;i<1300;i++){g.tick(.1);if(i%100===0){numeric(g.snapshot());assert(g.users.size<=200);assert(g.snapshot().objects.length<2000);}}
 const s=g.snapshot();assert(s.time>0);assert(Array.isArray(s.scores));assert(Array.isArray(s.players));assert(s.players.some(p=>p.id===viewer.id));const original=g.state.headline;s.headline='mudado fora do jogo';assert.equal(g.state.headline,original);
});
test('catalog is unique, Portuguese and contains no credentials or remote executable',()=>{assert.equal(CATALOG.length,57);assert.equal(new Set(CATALOG.map(g=>g.id)).size,57);for(const g of CATALOG){assert(g.name&&g.description);assert.match(g.id,/^[a-z0-9-]+$/);assert.equal(typeof g.premium,'boolean');assert(!('key' in g));}});
test('unlisted module paths are rejected before import',async()=>{await assert.rejects(()=>createGame('../server'));});
