import {Race} from '../core/race.mjs';
import {distance,clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='car-race');
const rules={
 theme:'car',laps:3,hint:'entrar · turbo · trocar faixa · óleo',actions:[{id:'join',label:'Entrar na corrida'},{id:'boost',label:'Turbo'},{id:'lane',label:'Trocar faixa'},{id:'oil',label:'Mancha de óleo'}],
 input(g,e,p){if(e.action==='boost'||e.kind==='gift')p.boost=Math.min(12,(p.boost||0)+3);if(e.action==='lane')p.lane=1-(p.lane||0);if(e.action==='oil')g.state.objects.push({kind:'oil',progress:p.progress+110,lane:p.lane,life:10});},
 step(g,dt){for(const o of g.state.objects){o.life-=dt;for(const p of g.users.values())if(Math.abs(p.progress-o.progress)<20&&p.lane===o.lane)p.penalty=1.4;}g.state.objects=g.state.objects.filter(o=>o.life>0);}
};
export default class extends Race {constructor(options){super(meta,rules,options);}}
