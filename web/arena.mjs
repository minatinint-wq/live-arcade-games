import {frame,shadow} from './art.mjs';
import {box,circle,line,poly,text,bar,star,person,TEAM} from './draw.mjs';
export function arena(c,s){
 const theme=s.theme;
 if(theme==='platform'){for(const o of s.objects)if(o.kind==='platform'){frame(c,'arcade',14,o.x-o.w/2-8,o.y-10,o.w+16,Math.max(42,o.h*2.5));}}
 else{for(let x=50;x<900;x+=80)line(c,[[x,110],[x,1120]],'#ffffff06',1);for(let y=110;y<1120;y+=80)line(c,[[50,y],[850,y]],'#ffffff06',1);if(s.ring){circle(c,s.ring.x,s.ring.y,s.ring.r,'#243b494d');c.strokeStyle='#ffcf61';c.lineWidth=5;c.beginPath();c.arc(s.ring.x,s.ring.y,s.ring.r,0,Math.PI*2);c.stroke();}}
 if(theme==='crown'){box(c,385,500,130,180,'#6e4e76',20);box(c,385,660,130,25,'#e5b45d',6);poly(c,[[402,490],[402,450],[430,472],[450,438],[470,472],[498,450],[498,490]],'#f4c459');text(c,Math.ceil(s.holdTime||0)+' / 25 s',450,410,26,'#f4c459');}
 for(const o of s.objects){if(o.kind==='platform'||o.kind==='throne')continue;if(o.kind==='blackhole'){circle(c,o.x,o.y,o.r||90,'#8d5ae533');circle(c,o.x,o.y,35,'#060714');}else if(o.kind==='orb'||o.kind==='food'){circle(c,o.x,o.y,o.size||7,o.kind==='orb'?'#6be6b1':'#ffb05b');circle(c,o.x-2,o.y-2,2,'#fff');}else circle(c,o.x||450,o.y||600,o.size||8,o.color||'#ffc966');}
 for(const p of s.players){if(!p.alive)continue;const color=`hsl(${p.color} 65% 63%)`,size=p.size||20;c.save();c.translate(p.x,p.y);
 if(theme==='tank'){c.rotate(p.angle||0);frame(c,'pieces',p.color%2, -43,-43,86,86);}
 else if(theme==='blob'){c.scale(1+Math.sin(s.time*4+p.color)*.03,1-Math.sin(s.time*4+p.color)*.03);frame(c,'pieces',7,-size*1.4,-size*1.4,size*2.8,size*2.8);}
 else if(theme==='monster'){frame(c,'pieces',6,-size*1.5,-size*1.5,size*3,size*3);}
 else {shadow(c,0,size,Math.max(20,size),.3);person(c,0,0,{color:p.color,size:Math.max(.48,size/40),pose:Math.sin(s.time*6+p.color)});if(theme==='chainsaw'){const a=s.time*4+p.color;c.save();c.translate(Math.cos(a)*52,Math.sin(a)*52);c.rotate(a);frame(c,'pieces',10,-25,-25,50,50);c.restore();}}

 c.restore();bar(c,p.x-23,p.y-size-16,46,p.hp/p.maxHp,color,5);text(c,p.name,p.x,p.y+size+23,15,'#e2e9f2');}
 for(const b of s.projectiles||[])circle(c,b.x,b.y,5,'#ffe197');
}
export function race(c,s){const horse=s.theme==='horse';c.save();c.translate(450,625);c.scale(1,1.58);c.strokeStyle=horse?'#705644':'#3c4b60';c.lineWidth=140;c.beginPath();c.ellipse(0,0,280,270,0,0,Math.PI*2);c.stroke();c.strokeStyle='#d6dfce55';c.lineWidth=3;c.setLineDash([16,20]);c.beginPath();c.ellipse(0,0,280,270,0,0,Math.PI*2);c.stroke();c.setLineDash([]);c.restore();for(let i=0;i<8;i++)for(let j=0;j<3;j++)box(c,730+j*17,580+i*17,17,17,(i+j)%2?'#fff':'#182431');text(c,horse?'DERBY DO CHAT':'GRANDE PRÊMIO',450,590,28,'#a9bacb');text(c,(s.laps||3)+' VOLTAS',450,640,20,'#8298ac');for(const p of s.players){c.save();c.translate(p.x,p.y);c.rotate((p.progress||0)/900*Math.PI*2);const color=`hsl(${p.color} 70% 64%)`;if(horse)frame(c,'pieces',4+(p.team||0),-48,-48,96,96);else frame(c,'pieces',2+(p.color%2),-32,-44,64,88);c.restore();text(c,p.name,p.x,p.y-45,16);if(p.boost>0)text(c,'TURBO',p.x,p.y+40,13,'#ffcb69');}}
export function teams(c,s){const [a,b]=s.teams;for(let i=0;i<2;i++){text(c,s.teams[i].name,240+i*420,115,23,TEAM[i]);text(c,Math.floor(s.teams[i].score),240+i*420,158,38,TEAM[i]);bar(c,110+i*420,205,260,(s.teams[i].hp||0)/100,TEAM[i]);}
 switch(s.theme){
 case 'territory':for(const cell of s.cells){const x=101+cell.x*78,y=350+cell.y*78;box(c,x,y,72,72,cell.team<0?'#263748':TEAM[cell.team],10);if(cell.shield)text(c,'◆'.repeat(cell.shield),x+36,y+36,14,'#fff');}break;
 case 'goat':circle(c,450,660,325,'#314b3f99');c.strokeStyle='#e4c999';c.lineWidth=5;c.beginPath();c.arc(450,660,300,0,Math.PI*2);c.stroke();for(const o of s.objects){c.save();c.translate(o.x,o.y);c.scale(o.team?-1:1,1);shadow(c,0,50,80,.3);frame(c,'pieces',8,-110,-110,220,220);c.restore();}break;
 case 'tug':line(c,[[130,700],[770,700]],'#ceb082',9);box(c,441+s.rope*260,670,18,60,'#ffca65',4);for(let i=0;i<4;i++){person(c,140+i*80+s.rope*70,710,{color:TEAM[0],pose:-.5});person(c,510+i*80+s.rope*70,710,{color:TEAM[1],pose:.5});}line(c,[[450,760],[450,900]],'#fff4',3);break;
 case 'mma':poly(c,[[230,400],[670,400],[820,570],[820,850],[670,1020],[230,1020],[80,850],[80,570]],'#2e46596b');for(let i=0;i<2;i++){const move=s.lastMove?.team===i&&s.time-s.lastMove.at<.5;person(c,320+i*260,700,{color:TEAM[i],size:2.2,pose:move?1:.25});bar(c,150+i*420,300,180,s.teams[i].stamina/100,'#e2bd6e');if(move)star(c,450,660,28,'#ffce79');}break;
 case 'flappy':for(let i=0;i<4;i++){const y=360+i*190-(s.pipeOffset||0)%190;box(c,80,y,95,80,'#315965',9);box(c,725,y,95,80,'#315965',9);}for(const o of s.objects){circle(c,o.x,o.y,48,TEAM[o.team]+'44');frame(c,'pieces',9,o.x-58,o.y-58,116,116);}break;
 case 'tower':for(let i=0;i<2;i++){const t=s.teams[i];for(let n=0;n<t.floors;n++)box(c,160+i*420,1060-n*31,160,28,TEAM[i],4);if(t.shield)circle(c,240+i*420,410,30,'#eacb8180');}break;
 default:box(c,100,300,700,710,'#274858',22);box(c,385,300,130,710,'#4a6770');line(c,[[450,300],[450,1010]],'#c1d8cb33',2);for(let i=0;i<2;i++){box(c,350,300+i*620,200,75,TEAM[i],10);text(c,Math.ceil(s.teams[i].hp)+' PV',450,337+i*620,20,'#172a38');}for(const o of s.objects){if(o.kind==='rock'){circle(c,o.x,o.y,15,'#b7a898');continue;}frame(c,'pieces',o.kind==='mage'||o.kind==='healer'?13:11+o.team,o.x-(o.kind==='giant'?50:32),o.y-(o.kind==='giant'?65:42),o.kind==='giant'?100:64,o.kind==='giant'?130:84);bar(c,o.x-15,o.y-47,30,o.hp/50,TEAM[o.team],4);}
 }
 for(const o of s.objects)if(o.kind==='rock')circle(c,o.x,o.y,15,'#baa897');
}
