export const TEAM=['#62b4ff','#ff6b81'];
export function box(c,x,y,w,h,color,r=0){c.fillStyle=color;c.beginPath();if(r)c.roundRect(x,y,w,h,r);else c.rect(x,y,w,h);c.fill();}
export function circle(c,x,y,r,color){c.fillStyle=color;c.beginPath();c.arc(x,y,Math.max(0,r),0,Math.PI*2);c.fill();}
export function line(c,points,color,width=4){c.strokeStyle=color;c.lineWidth=width;c.lineJoin='round';c.lineCap='round';c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();}
export function poly(c,points,color){c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();}
export function text(c,value,x,y,size=24,color='#fff',align='center',weight=600){c.font=weight+' '+size+'px system-ui, sans-serif';c.fillStyle=color;c.textAlign=align;c.textBaseline='middle';c.fillText(String(value),x,y);}
export function wrap(c,value,x,y,width=700,size=30,color='#fff',lineHeight=42){c.font='600 '+size+'px system-ui, sans-serif';let row='',offset=0;for(const word of String(value).split(/\s+/)){const next=row?row+' '+word:word;if(c.measureText(next).width>width&&row){text(c,row,x,y+offset,size,color);offset+=lineHeight;row=word;}else row=next;}text(c,row,x,y+offset,size,color);return y+offset;}
export function bar(c,x,y,w,value,color=TEAM[0],height=12){box(c,x,y,w,height,'#152332',height/2);box(c,x,y,w*Math.max(0,Math.min(1,value)),height,color,height/2);}
export function star(c,x,y,r,color='#ffcf61',points=5){const p=[];for(let i=0;i<points*2;i++){const a=-Math.PI/2+i*Math.PI/points,s=i%2?r*.45:r;p.push([x+Math.cos(a)*s,y+Math.sin(a)*s]);}poly(c,p,color);}
export function person(c,x,y,{color='#ffb667',pose=0,size=1,hat=false}={}){c.save();c.translate(x,y);c.scale(size,size);circle(c,0,-35,19,'#edb98d');box(c,-20,-14,40,47,color,13);line(c,[[-11,30],[-20+pose*7,61]],'#d8e0eb',13);line(c,[[11,30],[20-pose*7,61]],'#d8e0eb',13);line(c,[[-17,-4],[-33,-8+pose*23]],'#edb98d',12);line(c,[[17,-4],[33,-8-pose*23]],'#edb98d',12);circle(c,-6,-38,2,'#1b2636');circle(c,6,-38,2,'#1b2636');if(hat)box(c,-21,-57,42,9,color,3);c.restore();}
export function badge(c,x,y,value,color='#ffb04b'){box(c,x-63,y-21,126,42,color,21);text(c,value,x,y,19,'#111b22');}
export function ground(c,color='#1b3341'){box(c,40,1080,820,12,color,6);}
export function iso(c,x,y,h,color='#72cc94'){const dx=38,dy=20;poly(c,[[x,y-h],[x+dx,y+dy-h],[x,y+dy*2-h],[x-dx,y+dy-h]],color);poly(c,[[x-dx,y+dy-h],[x,y+dy*2-h],[x,y+dy*2],[x-dx,y+dy]],'#347f75');poly(c,[[x,y+dy*2-h],[x+dx,y+dy-h],[x+dx,y+dy],[x,y+dy*2]],'#23585d');}
export function paper(c,x=80,y=160,w=740,h=870){box(c,x+8,y+10,w,h,'#02060b55',18);box(c,x,y,w,h,'#f2eddd',15);}
