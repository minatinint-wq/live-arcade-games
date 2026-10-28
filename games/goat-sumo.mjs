import {Teams} from '../core/teams.mjs';
import {clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='goat-sumo');
const rules={
 theme:'goat',hint:'azul empurrar · vermelho empurrar · cabra pesada vermelha',actions:[{id:'blue',label:'Equipe Azul'},{id:'red',label:'Equipe Vermelha'},{id:'push',label:'Empurrar'},{id:'heavy',label:'Cabra pesada'}],
 reset(g){g.unit('goat',0,{x:370,y:650,vx:0,effort:0,mass:1,heavyUntil:0,impactAt:-10,fallAt:null});g.unit('goat',1,{x:530,y:650,vx:0,effort:0,mass:1,heavyUntil:0,impactAt:-10,fallAt:null});g.state.ring={x:450,y:650,r:300};g.state.lastMove=null;g.lastImpact=-10;},
 input(g,e,p,t){const u=g.state.objects[p.team];if(!u||!['push','heavy'].includes(e.action)&&!['like','gift'].includes(e.kind))return;const heavy=e.action==='heavy';u.effort=clamp(u.effort+(heavy?80:38),0,150);u.chargeAt=g.time;if(heavy)u.heavyUntil=g.time+4;t.score=Math.min(100,u.effort);g.state.lastMove={team:p.team,move:heavy?'heavy':'push',at:g.time};g.addScore(p,heavy?5:2);},
 step(g,dt){const [a,b]=g.state.objects,gap=b.x-a.x;for(const u of [a,b]){const direction=u.team?-1:1;u.mass=u.heavyUntil>g.time?1.9:1;u.effort*=Math.pow(.12,dt);const approach=gap>170&&u.effort<8?direction*34:0;u.vx+=(direction*u.effort*3.3+approach*1.6)*dt;u.vx*=Math.pow(.18,dt);u.vx=clamp(u.vx,-150,150);u.x+=u.vx*dt;u.y=650;g.state.teams[u.team].score=u.effort;}
  const spacing=160,overlap=spacing-(b.x-a.x);if(overlap>0){const sum=a.mass+b.mass,closing=a.vx-b.vx;a.x-=overlap*b.mass/sum;b.x+=overlap*a.mass/sum;const v=(a.vx*a.mass+b.vx*b.mass)/sum;a.vx=v;b.vx=v;if(closing>22&&g.time-g.lastImpact>.35){g.lastImpact=g.time;a.impactAt=b.impactAt=g.time;g.effect((a.x+b.x)/2,595,'CABEÇADA!','#ffe6a0');}}
  g.state.teams[0].hp=clamp((a.x-150)/220*100,0,100);g.state.teams[1].hp=clamp((750-b.x)/220*100,0,100);
  if(a.x<150){a.fallAt=g.time;g.win(1);}else if(b.x>750){b.fallAt=g.time;g.win(0);}
 }
};
export default class extends Teams {constructor(options){super(meta,rules,options);}}
