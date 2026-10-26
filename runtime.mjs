import {CATALOG} from './catalog.mjs';
export {CATALOG};
export async function createGame(id,options){if(!CATALOG.some(g=>g.id===id))throw Error('Jogo desconhecido');const {default:Game}=await import('./games/'+id+'.mjs');return new Game(options);}
