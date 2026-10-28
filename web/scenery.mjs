import {frame,backdrop} from './art.mjs';
import {box,circle,line,poly} from './draw.mjs';
// Every game selects its own setting and stage treatment; scenery never moves hitboxes.
export const SCENERY={
 'tank-battle':[1,'dust'],'take-the-crown':[3,'royal'],'car-race':[2,'track'],'slap-arena':[4,'ring'],'evo-monster':[13,'spores'],'stick-fighters':[6,'clouds'],'chainsaw-clash':[1,'hazard'],'blob-battle':[12,'snow'],
 'goat-sumo':[0,'farm'],'bridge-brawl':[5,'river'],'flappy-battle':[6,'flock'],'territory-war':[1,'territory'],'tower-war':[3,'citadel'],'horse-race':[0,'derby'],'battle-arena':[5,'battle'],'boys-vs-girls':[4,'tug'],'mma-clash':[4,'mma'],
 'fruit-slice':[15,'orchard'],'1000-stairs':[6,'stairs'],'voxel-craft':[6,'voxel'],'flappy-3d':[6,'flight'],'log-rush':[5,'forest'],'zombie-hill':[13,'mist'],'window-wipe':[14,'glass'],'tower-stack':[2,'construction'],'lunar-dash':[11,'stars'],
 'would-you-rather':[9,'poll'],'context':[8,'search'],'five-letters':[8,'letters'],'guess-the-location':[11,'map'],'true-or-false':[14,'binary'],'word-swipe':[12,'swipe'],'trivia-time':[-1,'quiz'],'memory-maestro':[3,'cards'],'quick-math':[4,'chalk'],'word-hunt':[8,'hunt'],'crowd-says':[9,'survey'],'word-cross':[8,'cross'],'find-the-word':[7,'anagram'],'guess-the-flag':[6,'expo'],'word-association':[15,'mind'],'guess-the-drawing':[8,'paper'],'guess-the-logo':[14,'tech'],'guess-the-number':[7,'digits'],'million-quiz':[3,'million'],
 'card-factory':[3,'collection'],'coin-mint':[7,'factory'],'name-diary':[8,'diary'],'pfp-printer':[10,'gallery'],'ai-host':[9,'talkshow'],'dance-party':[9,'dance'],'tung-tung-smash':[4,'dummy'],'clip-machine':[9,'reactions'],'snake':[15,'garden'],'guess-your-future':[-2,'cosmic'],'roast-your-photo':[10,'roast'],'dance-floor':[9,'disco']
};
function seed(id){return [...id].reduce((n,v)=>(n*31+v.charCodeAt(0))>>>0,7);}
export function scenery(c,s,meta,y=0,w=900,h=1240){const [tile,style]=SCENERY[meta.id]||[6,'clouds'],t=s.visualTime??s.time,n=seed(meta.id);c.save();c.translate(0,y);box(c,0,0,w,h,'#122033');if(tile>=0)frame(c,'environments',tile,0,0,w,h);else backdrop(c,tile===-1?'quiz':'studio',0,0,w,h);
 const shade=c.createLinearGradient(0,0,0,h);shade.addColorStop(0,s.view==='quiz'?'#03101bc9':'#03101b42');shade.addColorStop(.52,s.view==='quiz'?'#03101bb3':'#03101b12');shade.addColorStop(1,'#03101b69');box(c,0,0,w,h,shade);
 // Moving light, particles and ripples belong to the chosen place, not every scene.
 if(['clouds','flock','stairs','voxel','flight','expo'].includes(style)){for(let i=0;i<6;i++){const x=((i*191+n%200+t*(i%2?7:-5))%1100+1100)%1100-100,cy=150+i*171;c.globalAlpha=.09;for(let q=0;q<3;q++)circle(c,x+q*36,cy+(q%2)*9,37+q*8,'#fff');}c.globalAlpha=1;}
 if(['snow','stars','cosmic','mist','spores','farm','dust','orchard','forest','garden'].includes(style)){for(let i=0;i<35;i++){const x=(i*137+n)%w,cy=((i*233+n+t*(style==='snow'?24:style==='stars'?2:6))%h+h)%h;c.globalAlpha=style==='stars'?.25+Math.sin(t*2+i)*.15:.12;circle(c,x,cy,style==='snow'?2+i%3:1+i%4,style==='farm'||style==='dust'?'#c3924c':'#dbf5ff');}c.globalAlpha=1;}
 if(['river','battle'].includes(style)){for(let i=0;i<8;i++){const ry=130+i*143;c.strokeStyle='#c7efff33';c.lineWidth=2;c.beginPath();c.ellipse(i%2?873:27,ry,18+Math.sin(t*1.6+i)*7,5,0,0,Math.PI*2);c.stroke();}}
 if(['dance','disco','reactions','poll','survey','talkshow','roast','million'].includes(style)){for(let i=0;i<4;i++){const x=80+i*245,a=Math.sin(t*.5+i)*90;c.globalAlpha=.05+Math.sin(t*2+i)*.025;poly(c,[[x,0],[x-150+a,h],[x+120+a,h]],i%2?'#68d8ff':'#e69aff');}c.globalAlpha=1;}
 if(['factory','anagram','digits','construction','hazard'].includes(style)){for(let i=0;i<8;i++){const x=i%2?850:50,py=(i*150+t*22)%h;c.globalAlpha=.16;circle(c,x,py,2,'#ffcf73');}c.globalAlpha=1;}
 if(s.view==='quiz'){
  const board={chalk:'#102b27e8',paper:'#233347ed',cards:'#103f36dd',letters:'#172333d9',hunt:'#0e2535dd',cross:'#142538dd',tech:'#092f47dd',map:'#06152caa',binary:'#123345aa',million:'#16132cbb'}[style];
  if(board)box(c,65,290,770,770,board,24);
  if(['letters','hunt','cross','swipe','paper','chalk'].includes(style)){c.globalAlpha=.06;for(let i=0;i<13;i++)line(c,[[80,315+i*57],[820,315+i*57]],'#cce9ec',1);c.globalAlpha=1;}
 }
 // Distinct themed accents leave the question/arena center unobstructed.
 if(['track','derby'].includes(style)){for(let i=0;i<8;i++){box(c,16,220+i*110,8,52,i%2?'#fff7df88':'#ed716088',2);box(c,w-24,220+i*110,8,52,i%2?'#ed716088':'#fff7df88',2);}}
 c.restore();return style;
}
