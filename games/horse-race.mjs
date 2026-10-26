import {Race} from '../core/race.mjs';
import {distance,clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='horse-race');
const rules={
 theme:'horse',laps:2,hint:'azul · vermelho · sprint · recuperar',actions:[{id:'join',label:'Entrar'},{id:'sprint',label:'Arrancada'},{id:'rest',label:'Recuperar fôlego'}],
 input(g,e,p){if(e.word==='azul')p.team=0;if(e.word==='vermelho')p.team=1;if(e.action==='sprint'||e.kind==='gift'){p.boost=4;p.stamina=Math.max(0,(p.stamina??100)-20);}if(e.action==='rest')p.stamina=Math.min(100,(p.stamina??100)+35);},
 actor(g,p,dt){p.stamina=clamp((p.stamina??100)+(p.boost>0?-9:4)*dt,0,100);p.speed=36+p.stamina*.23;p.lane=p.team;}
};
export default class extends Race {constructor(options){super(meta,rules,options);}}
