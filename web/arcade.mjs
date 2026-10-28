import {frame,shadow} from './art.mjs';
import {box,circle,line,poly,text,bar,person,iso,star,ground} from './draw.mjs';
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const age=(s,at)=>at===undefined?99:(s.visualTime??s.time)-at;
const ease=t=>1-Math.pow(1-clamp(t),3);
function sprite(c,sheet,index,x,y,w,h,{angle=0,sx=1,sy=1,alpha=1}={}){c.save();c.globalAlpha*=alpha;c.translate(x,y);c.rotate(angle);c.scale(sx,sy);frame(c,sheet,index,-w/2,-h/2,w,h);c.restore();}
function burst(c,x,y,elapsed,color='#ffd875',count=10){if(elapsed<0||elapsed>.6)return;const p=elapsed/.6;c.save();c.globalAlpha*=1-p;for(let i=0;i<count;i++){const a=i/count*Math.PI*2;circle(c,x+Math.cos(a)*p*85,y+Math.sin(a)*p*70+p*p*60,3+(i%3),color);}c.restore();}
function raisedBlock(c,x,y,w,h,color){const g=c.createLinearGradient(x,y,x,y+h);g.addColorStop(0,color);g.addColorStop(1,'#334b65');box(c,x,y,w,h,g,5);poly(c,[[x,y],[x+10,y-7],[x+w+10,y-7],[x+w,y]],'#d8e4e999');poly(c,[[x+w,y],[x+w+10,y-7],[x+w+10,y+h-7],[x+w,y+h]],'#172739');line(c,[[x+5,y+3],[x+w-5,y+3]],'#ffffff66',2);}
// A portal is checked at z=.7. At this plane its visual gap is exactly gapY±gap/2.
export function portalProjection(o){const scale=.7/Math.max(.35,o.z);return{scale,width:900*scale,height:1200*scale,centerY:600+(o.gapY-600)*scale,gap:o.gap*scale};}
export function arcade(c,s){const a=s.avatar,time=s.visualTime??s.time;
 text(c,String(s.points)+' PONTOS',145,100,23,'#e7f2f7');text(c,'♥ '.repeat(Math.max(0,s.lives)),720,100,25,'#ff8395');
 switch(s.theme){
 case 'fruit':{
  for(const o of s.objects){shadow(c,o.x,1110,o.size*.6,.15);sprite(c,'arcade',o.kind==='bomb'?3:Math.abs(Math.floor(o.color))%3,o.x,o.y,o.size*2.5,o.size*2.5,{angle:o.angle||0});if(o.kind==='bomb'){const flicker=.65+Math.sin(time*38)*.35;star(c,o.x+o.size*.65,o.y-o.size*.8,5+flicker*5,'#ffcf62');}}
  for(const o of s.slices||[]){c.save();c.globalAlpha*=clamp(o.life/.4);c.translate(o.x,o.y);c.rotate(o.angle);c.beginPath();c.rect(o.side<0?-o.size*1.25:0,-o.size*1.25,o.size*1.25,o.size*2.5);c.clip();frame(c,'arcade',Math.abs(Math.floor(o.color))%3,-o.size*1.25,-o.size*1.25,o.size*2.5,o.size*2.5);c.restore();}
  const trail=s.cutTrail||[];for(let i=1;i<trail.length;i++){const alpha=clamp(1-age(s,trail[i].at)/.22);line(c,[[trail[i-1].x,trail[i-1].y],[trail[i].x,trail[i].y]],'rgba(210,255,245,'+alpha+')',7);}
  if(trail.length===1){const p=trail[0],v=clamp(1-age(s,p.at)/.22);line(c,[[p.x-40*v,p.y+20*v],[p.x+40*v,p.y-20*v]],'#e2fff1',4*v);}
  if(s.blast)burst(c,s.blast.x,s.blast.y,age(s,s.blastAt),'#ffad5d',18);
  text(c,'COMBO ×'+s.combo,450,220,32,'#ffcc78');text(c,'PERDIDAS '+(s.misses||0)+' / 3',450,1150,18,'#e3d2bb');ground(c);break;
 }
 case 'stairs':{
  const m=s.stepMotion,dt=m?age(s,m.at):99,p=clamp(dt/.32),scroll=m?(1-ease(p))*52:0;
  for(let i=Math.min(13,s.steps.length)-1;i>=0;i--){const side=s.steps[i],x=side?500:260,y=915-i*52+scroll,shake=Math.sin(time*13+i)*s.balance*8;shadow(c,x+72+shake,y+34,62,.18);sprite(c,'arcade',14,x+72+shake,y+10,165,70);text(c,side?'→':'←',x+72+shake,y+8,24,i===0?'#fff5be':'#233326');if(i===0)line(c,[[x+15+shake,y+33],[x+133+shake,y+33]],'#f6de8b',4);}
  const x=m&&p<1?m.fromX+(m.toX-m.fromX)*ease(p):a.x,jump=m&&p<1?Math.sin(p*Math.PI)*(m.boost?105:70):0,miss=age(s,s.missAt)<.3;
  shadow(c,x,920,58,.25);sprite(c,'fighter-motion',miss?13:p<1?Math.floor(p*4):0,x,a.y-jump,155,195,{sx:m&&m.toX<m.fromX?-1:1,angle:miss?Math.sin(time*50)*.04:0});
  text(c,s.climbed+' / 1000',450,1050,44);if(s.balance>.1)text(c,'ESCADA BALANÇANDO',450,1110,20,'#ffd591');break;
 }
 case 'voxel':{
  const order=[];for(let y=0;y<8;y++)for(let x=0;x<8;x++){let rx=x,ry=y;for(let n=0;n<s.rotation;n++)[rx,ry]=[7-ry,rx];order.push({x,y,rx,ry,h:s.heights[y*8+x]});}order.sort((a,b)=>(a.rx+a.ry)-(b.rx+b.ry));
  for(const v of order){const x=450+(v.rx-v.ry)*39,y=560+(v.rx+v.ry)*23,change=(s.blockChanges||[]).findLast(o=>o.index===v.y*8+v.x),elapsed=change?age(s,change.at):99;
   if(!v.h)iso(c,x,y,0,'#3b695c');
   for(let level=0;level<v.h;level++){const building=change?.to>change?.from&&level===v.h-1&&elapsed<.25,drop=building?(1-ease(elapsed/.25))*70:0;frame(c,'arcade',level===v.h-1?9:v.h>3?11:10,x-43,y-level*35-33-drop,86,86);}
   const cy=580+(v.rx+v.ry)*23-v.h*35;
   if(v.y*8+v.x===s.focus){c.save();c.globalAlpha*=.65+Math.sin(time*4)*.2;line(c,[[x,cy-20],[x+38,cy],[x,cy+20],[x-38,cy],[x,cy-20]],'#ffe8a1',3);c.restore();}
   if(change)burst(c,x,cy,elapsed,change.to<change.from?'#b9c4ce':'#e8d481',7);
  }
  text(c,'BLOCOS: '+s.points,450,1040,24);text(c,'Visão '+(s.rotation+1)+' · lote '+(s.focus+1),450,1080,20,'#b2c7cf');break;
 }
 case 'pig3d':{
  for(const o of [...s.objects].sort((a,b)=>b.z-a.z)){const p=portalProjection(o),x=450-p.width/2,top=p.centerY-p.gap/2,bottom=p.centerY+p.gap/2,y=600-p.height/2,opacity=o.passed?clamp((o.z-.35)/.35):1;c.save();c.globalAlpha*=opacity;
   const ringH=p.gap/0.65,ringW=ringH;
   sprite(c,'arcade',15,450,p.centerY,ringW,ringH,{angle:time*.12,alpha:.88+Math.sin(time*3+o.z)*.08});
   line(c,[[450-ringW*.22,top],[450+ringW*.22,top]],'#d0ffd7',Math.max(1,3*p.scale));line(c,[[450-ringW*.22,bottom],[450+ringW*.22,bottom]],'#d0ffd7',Math.max(1,3*p.scale));c.restore();
  }
  const flap=Math.exp(-Math.max(0,age(s,s.wingAt))*8),tilt=clamp(a.vy/650,-.35,.45);shadow(c,450,1150,55,.12);sprite(c,'arcade',4,450,a.y,145,145,{angle:tilt,sx:1+flap*.05,sy:1-flap*.06});
  for(let n=0;n<5;n++){const phase=(time*1.6+n*.19)%1;line(c,[[410-phase*100,a.y+12+n*11],[390-phase*100,a.y+12+n*11]],'#e5f6e622',2);}
  burst(c,450,a.y,age(s,s.passAt),'#b8ffc9',12);text(c,Math.floor(s.distance)+' m',450,1135,28);break;
 }
 case 'tree':{
  const chop=s.chop,dt=chop?age(s,chop.at):99,p=clamp(dt/.3),slide=dt<.3?(1-ease(p))*68:0,shake=chop?.hit&&dt<.3?Math.sin(time*55)*7:0;
  for(let y=220;y<1000;y+=110){c.save();c.beginPath();c.rect(350+shake,y,200,120);c.clip();frame(c,'arcade',5,250+shake,y-390,400,600);c.restore();}
  for(let i=s.branches.length-1;i>=0;i--){const side=s.branches[i];if(side<0)continue;const y=830-i*68+slide;c.save();c.translate(450+shake,y);if(!side)c.scale(-1,1);line(c,[[30,0],[183,-10],[206,-25]],'#6b452b',23);line(c,[[34,-5],[181,-16]],'#bd9060',6);c.restore();}
  sprite(c,'arcade',6,450+Math.sin(time*.8)*3,235,520,380);
  const facing=a.x<450?1:-1;shadow(c,a.x,1060,65,.24);sprite(c,'fighter-motion',dt<.3?4+Math.min(3,Math.floor(p*4)):0,a.x+shake,943,195,245,{sx:facing,angle:dt<.3?facing*Math.sin(p*Math.PI)*.05:0});
  const hand=dt<.3?[[15,-55],[78,-58],[89,-54],[18,-55]][Math.min(3,Math.floor(p*4))]:[40,25];c.save();c.translate(a.x+facing*hand[0],943+hand[1]);c.scale(facing,1);c.rotate(-.8+Math.sin(p*Math.PI)*1.2);line(c,[[0,70],[0,-45]],'#8f603c',12);poly(c,[[-8,-40],[44,-58],[58,-20],[10,-5]],'#c8dae0');line(c,[[46,-56],[58,-20]],'#f0f6ec',3);c.restore();
  for(const o of s.chips||[]){c.save();c.globalAlpha*=clamp(o.life/.3);c.translate(o.x,o.y);c.rotate(o.vx*.02*time);box(c,-o.size/2,-o.size/2,o.size,o.size*.6,'#dbac6d',2);c.restore();}
  bar(c,230,1110,440,s.energy,'#a9df90',20);text(c,'ENERGIA',450,1155,17,'#d1e2c5');break;
 }
 case 'zombie':{
  shadow(c,450,1100,210,.35);for(let i=0;i<7;i++){const x=318+i*39,y=970+(i%2)*5;raisedBlock(c,x,y,34,120,'#967148');c.save();c.beginPath();c.rect(x+3,y+5,28,110);c.clip();frame(c,'arcade',5,x-55,y-210,150,440);c.restore();}for(const y of [1005,1055]){raisedBlock(c,302,y,294,19,'#88633f');for(const x of [322,430,566])circle(c,x,y+9,3,'#b8b9a5');}text(c,'ABRIGO',450,1130,19,'#d4cfac');
  const zombies=[...(s.fallen||[]).map(z=>({...z,dead:true})),...s.objects].sort((a,b)=>a.y-b.y);
  for(const z of zombies){const death=z.dead?clamp(age(s,z.at)/.55):0,phase=time*5+(z.phase||0),sway=Math.sin(phase)*3;shadow(c,z.x,z.y+55,34,.3);sprite(c,'pieces',14,z.x+sway,z.y-5+Math.abs(Math.sin(phase))*3,100,135,{angle:z.dead?death*1.5:Math.sin(phase)*.045,alpha:(1-death)*(z.dead?1:clamp(age(s,z.spawnAt)/.25)),sy:z.dead?1-death*.4:1});if(!z.dead){bar(c,z.x-26,z.y-78,52,z.hp/50,'#c7d879',5);burst(c,z.x,z.y-30,age(s,z.hitAt),'#d5f5b5',6);}}
  const shot=s.lastShot,elapsed=shot?age(s,shot.at):99;if(elapsed<.12){line(c,[[450,990],[shot.x,shot.y]],'#fff1b5',2);star(c,450,990,14*(1-elapsed/.12),'#ffcf6d',6);for(let i=0;i<4;i++)circle(c,shot.x+Math.sin(i*2)*17,shot.y+Math.cos(i*2)*17,3,'#e7c69c');}
  const loading=s.reloadEndsAt>s.time;text(c,loading?'RECARREGANDO…':'MUNIÇÃO '+s.ammo+' / 6',450,230,30,loading?'#cae4dc':'#f8ca8c');bar(c,250,280,400,s.shelter/100,'#8bdcb9');if(loading)bar(c,320,320,260,s.reloadProgress,'#e5c57a',9);for(let i=0;i<6;i++)box(c,358+i*31,355,20,34,i<s.ammo?'#d4b678':'#263a40',5);burst(c,450,1040,age(s,s.repairAt),'#a4e4af',14);if(age(s,s.emptyAt)<.8)text(c,'RECARREGUE',450,425,26,'#ffb18c');break;
 }
 case 'window':{
  const sky=c.createLinearGradient(0,220,0,1030);sky.addColorStop(0,'#83c4e0');sky.addColorStop(1,'#d3e8e4');box(c,90,220,720,810,sky,8);
  c.save();c.beginPath();c.rect(90,220,720,810);c.clip();for(let i=0;i<6;i++){const x=((i*173+time*7)%1050)-130;circle(c,x,340+i%3*140,55,'#ffffff35');circle(c,x+55,340+i%3*140,40,'#ffffff35');}for(let y=0;y<10;y++)for(let x=0;x<8;x++){const i=y*8+x,alpha=Math.round(s.dirt[i]*220).toString(16).padStart(2,'0');c.save();c.beginPath();c.rect(90+x*90,220+y*81,90,81);c.clip();const dx=Math.sin(i*5.17)*17,dy=Math.cos(i*3.31)*14,r=27+(i*17%16);circle(c,135+x*90+dx,260+y*81+dy,r,'#795a3e'+alpha);circle(c,118+x*90-dx*.4,250+y*81+dy*.5,15+i%13,'#795a3e'+alpha);circle(c,155+x*90+dx*.3,274+y*81-dy,13+i%15,'#795a3e'+alpha);c.restore();if(s.dirt[i]>.2){circle(c,112+x*90,242+y*81,11,'#503b2720');circle(c,143+x*90,267+y*81,7,'#503b2720');}}
  const bucketAge=age(s,s.bucketAt);if(bucketAge<1.2)for(let i=0;i<35;i++){const x=95+(i*103)%710,y=220+((bucketAge*670+i*63)%820);line(c,[[x,y],[x-3,y+25]],'#d5f7ff99',3);}
  c.restore();
  for(const [x,y,w,h]of [[75,205,750,18],[75,1028,750,20],[75,205,20,843],[807,205,18,843],[440,220,18,810],[90,610,720,16]]){raisedBlock(c,x,y,w,h,'#d7d9ce');}
  const m=s.wipeMotion,dt=m?age(s,m.at):99;if(m&&dt<.8){const p=ease(dt/.24),x=m.fromX+(m.x-m.fromX)*p,y=m.fromY+(m.y-m.fromY)*p;sprite(c,'arcade',8,x,y,125,145,{angle:Math.sin(p*Math.PI)*.2});for(let i=0;i<7;i++)circle(c,x-40+i*12,y+35+Math.sin(i+time*8)*6,3,'#efffff99');}
  text(c,Math.round(s.meter*100)+'% LIMPO',450,1110,30);break;
 }
 case 'stack':{
  const count=s.blocks.length,base=1040+Math.max(0,count-17)*38;
  for(let i=0;i<count;i++){const b=s.blocks[i];raisedBlock(c,b.x-b.width/2,base-i*38,b.width,34,`hsl(${190+i*8} 52% ${45+i%3*8}%)`);}
  for(const o of s.falling||[]){c.save();c.globalAlpha*=clamp(o.life/.4);c.translate(o.x,o.y);c.rotate(o.angle);raisedBlock(c,-o.width/2,0,o.width,34,'#bd9475');c.restore();}
  const m=s.moving;if(s.phase==='playing'){shadow(c,m.x,base-count*38+53,m.width*.35,.2);raisedBlock(c,m.x-m.width/2,base-count*38,m.width,34,'#ffcb72');line(c,[[s.blocks.at(-1).x,base-count*38-35],[s.blocks.at(-1).x,base-count*38-12]],'#e0f4da66',2);}
  text(c,(count-1)+' ANDARES',450,170,35);if(s.perfect>1)text(c,'PERFEITO ×'+s.perfect,450,225,23,'#f8e4a2');burst(c,m.x,base-(count-1)*38,age(s,s.lastDropAt),'#c1e8e0',8);if(Math.abs(s.wind)>20){const dir=Math.sign(s.wind);for(let i=0;i<4;i++){const x=450+Math.sin(time*3+i)*200;line(c,[[x,300+i*40],[x+dir*55,300+i*40]],'#f6edd155',3);}}break;
 }
 case 'runner':{
  for(let n=0;n<45;n++)circle(c,(n*137)%900,(n*241)%780,1+n%3,'rgba(210,230,247,'+(.3+Math.sin(time+n)*.18)+')');
  c.save();c.beginPath();c.rect(0,1000,900,240);c.clip();const rock=c.createLinearGradient(0,1000,0,1240);rock.addColorStop(0,'#778496');rock.addColorStop(1,'#27354a');box(c,0,1000,900,240,rock);for(let n=0;n<8;n++){const x=((n*180-s.distance*1.3)%1440+1440)%1440-180;c.save();c.beginPath();c.rect(x,1000,182,240);c.clip();c.globalAlpha*=.72;frame(c,'arcade',13,x-100,900,380,400);c.restore();}c.restore();line(c,[[0,1000],[900,1000]],'#bdcad155',2);
  const grounded=a.grounded??a.y>=959,phase=grounded?Math.sin(time*10)*.22:0,bodyY=a.y-110+(grounded?Math.sin(time*20)*2:0);shadow(c,a.x,1008,42*(1-clamp((960-a.y)/700)),.24);
  c.save();c.translate(a.x,bodyY);
  // The same astronaut sheet is split at the hips so the legs alternate without stretching the face.
  for(const side of [-1,1]){c.save();c.translate(side<0?-8:12,100);c.rotate(phase*side);c.beginPath();c.rect(side<0?-52:-20,0,60,52);c.clip();frame(c,'arcade',12,-60-(side<0?-8:12),-100,120,150);c.restore();}
  c.save();c.beginPath();c.rect(-60,0,120,107);c.clip();frame(c,'arcade',12,-60,0,120,150);c.restore();
  if(s.lowGravity&&!grounded){poly(c,[[-38,90],[-24,135+Math.sin(time*32)*10],[-8,90]],'#91ddfb99');circle(c,-23,91,8,'#e1fcff');}c.restore();
  for(const o of s.objects){sprite(c,'arcade',13,o.x,o.y,85,85,{angle:o.angle||0,alpha:o.hit?.5:1});if(o.hit)burst(c,o.x,o.y,age(s,s.hitAt),'#d6c1a4',10);}
  text(c,Math.floor(s.distance)+' m',450,220,40);if(s.lowGravity)text(c,'BAIXA GRAVIDADE',450,280,21,'#b4e9f5');break;
 }
 }
}
