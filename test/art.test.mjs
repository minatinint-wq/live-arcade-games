import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {CATALOG} from '../catalog.mjs';
import {COVER_ART} from '../web/covers.mjs';
import {startServer} from '../server.mjs';

test('every original game has an illustrated cover and every atlas is a real PNG',async()=>{
 assert.deepEqual(Object.keys(COVER_ART).sort(),CATALOG.map(g=>g.id).sort());
 const sizes={actors:[1448,1086],host:[1536,1024],objects:[1448,1086],pieces:[1254,1254]};
 for(const name of ['actors','host','objects','pieces','arcade','studio','arena','quiz','world']){
  const bytes=await readFile(new URL('../web/assets/'+name+'-v2.png',import.meta.url));
  assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a',name);
  assert(bytes.length>100000,name+' must contain actual artwork');
  if(sizes[name])assert.deepEqual([bytes.readUInt32BE(16),bytes.readUInt32BE(20)],sizes[name],name+' atlas dimensions');
 }
});
test('demo serves generated artwork as PNG and denies arbitrary file access',async()=>{
 const app=await startServer({port:0}),base='http://127.0.0.1:'+app.port;
 try{
  for(const name of ['actors','host','objects','pieces','arcade','studio','arena','quiz','world']){
   const r=await fetch(base+'/web/assets/'+name+'-v2.png');assert.equal(r.status,200);assert.equal(r.headers.get('content-type'),'image/png');
   assert.equal(Buffer.from(await r.arrayBuffer()).subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  }
  assert.equal((await fetch(base+'/web/assets/ART-DIRECTION.md')).status,404);
 }finally{await app.close();}
});
