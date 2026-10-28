import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {pathToFileURL,fileURLToPath} from 'node:url';
import path from 'node:path';
import {createGame,CATALOG} from './runtime.mjs';
import {interactiveInput} from './core/commands.mjs';
const ROOT=fileURLToPath(new URL('.',import.meta.url));
export async function startServer({port=Number(process.env.PORT)||4417,host='127.0.0.1'}={}){
 const games=new Map(),streams=new Set(),pending=new Map();
 async function obtain(id){if(!CATALOG.some(g=>g.id===id))throw Object.assign(Error('Jogo não encontrado'),{status:404});if(!games.has(id)){if(!pending.has(id))pending.set(id,createGame(id).then(game=>{const item={game,touched:Date.now()};games.set(id,item);pending.delete(id);return item;}));await pending.get(id);}const item=games.get(id);item.touched=Date.now();return item;}
 const server=http.createServer(async(req,res)=>{const send=(status,value)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(value));};try{
  const url=new URL(req.url,'http://localhost');if(req.method==='POST'&&req.headers.origin&&req.headers.origin!==`http://${req.headers.host}`)return send(403,{error:'Origem não permitida'});
  if(url.pathname==='/api/catalog')return send(200,CATALOG);
  if(url.pathname.startsWith('/api/')){const {game}=await obtain(url.searchParams.get('id'));
   if(url.pathname==='/api/state'&&req.method==='GET')return send(200,game.snapshot());
   if(url.pathname==='/api/events'&&req.method==='GET'){if(streams.size>=64)return send(429,{error:'Muitas sessões'});res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache','Connection':'keep-alive'});const item={game,res};streams.add(item);res.write('data: '+JSON.stringify(game.snapshot())+'\n\n');req.on('close',()=>streams.delete(item));return;}
   if(req.method==='POST'){let size=0,body='';for await(const chunk of req){size+=chunk.length;if(size>8192)return send(413,{error:'Entrada muito grande'});body+=chunk;}let data;try{data=JSON.parse(body||'{}');}catch{return send(400,{error:'JSON inválido'});}if(!data||typeof data!=='object')return send(400,{error:'Entrada inválida'});
    if(url.pathname==='/api/input'){const allowed={kind:String(data.kind||'comment'),text:String(data.text||''),action:String(data.action||''),viewer:{id:String(data.viewer?.id||'demo').slice(0,80),name:String(data.viewer?.name||'Você').slice(0,40)},count:Math.min(100,Number(data.count)||1),coins:Math.min(10000,Number(data.coins)||1)};for(const key of ['x','y','index'])if(Number.isFinite(data[key]))allowed[key]=data[key];interactiveInput(game,allowed);return send(200,game.snapshot());}
    if(url.pathname==='/api/reset'){game.nextRound();return send(200,game.snapshot());}
   }return send(404,{error:'Rota não encontrada'});
  }
  if(req.method!=='GET'&&req.method!=='HEAD')return send(405,{error:'Método não permitido'});
  const file=url.pathname==='/'||url.pathname==='/capture'?'web/index.html':url.pathname==='/catalog.mjs'?'catalog.mjs':/^\/web\/(?:[a-z-]+\.(?:mjs|css|html)|assets\/[a-z0-9-]+\.png)$/.test(url.pathname)?url.pathname.slice(1):null;
  if(!file)return send(404,{error:'Arquivo não encontrado'});
  const data=await readFile(path.join(ROOT,file));const types={'.html':'text/html','.mjs':'text/javascript','.css':'text/css','.png':'image/png'};res.writeHead(200,{'Content-Type':types[path.extname(file)]+(file.endsWith('.png')?'':'; charset=utf-8'),'X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'none'; frame-ancestors 'self'",'Cache-Control':'no-cache'});res.end(req.method==='HEAD'?undefined:data);
 }catch(e){send(e.status||500,{error:e.status?e.message:'Falha na demonstração'});}});
 let cycle=0;const timer=setInterval(()=>{cycle++;const active=new Set([...streams].map(s=>s.game));for(const {game,touched}of games.values())if(active.has(game)||Date.now()-touched<10000)game.tick(.05);if(cycle%2===0)for(const stream of streams){if(stream.res.writableLength>1024*1024){stream.res.destroy();streams.delete(stream);}else stream.res.write('data: '+JSON.stringify(stream.game.snapshot())+'\n\n');}},50);timer.unref();
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,host,resolve);});return {server,port:server.address().port,close:async()=>{clearInterval(timer);for(const s of streams)s.res.end();await new Promise(r=>server.close(r));}};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){const {port}=await startServer();console.log('LIVE Arcade Games: http://127.0.0.1:'+port);}
