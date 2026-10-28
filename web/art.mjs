const FILES={actors:[4,3],host:[3,2],objects:[4,3],pieces:[4,4],arcade:[4,4],studio:[1,1],arena:[1,1],quiz:[1,1],world:[1,1]};
const images=new Map();let pending,failed=false;
export function loadArt(){if(typeof Image==='undefined')return Promise.resolve(false);if(!pending)pending=Promise.all(Object.keys(FILES).map(name=>new Promise(resolve=>{const im=new Image();im.onload=()=>{images.set(name,im);resolve(true);};im.onerror=()=>{failed=true;resolve(false);};im.src=new URL('./assets/'+name+'-v2.png',import.meta.url).href;})));return pending;}
export const artFailed=()=>failed;
export const artReady=()=>typeof Image==='undefined'||images.size===Object.keys(FILES).length;
export function frame(c,name,index,x,y,w,h){const im=images.get(name);if(!im)return false;const [cols,rows]=FILES[name],cw=im.naturalWidth/cols,ch=im.naturalHeight/rows,i=Math.abs(Math.floor(index))%(cols*rows);c.drawImage(im,i%cols*cw,Math.floor(i/cols)*ch,cw,ch,x,y,w,h);return true;}
export function backdrop(c,name,x,y,w,h,alpha=1){const im=images.get(name);if(!im)return false;c.save();c.globalAlpha*=alpha;const scale=Math.max(w/im.naturalWidth,h/im.naturalHeight),sw=w/scale,sh=h/scale;c.drawImage(im,(im.naturalWidth-sw)/2,(im.naturalHeight-sh)*.45,sw,sh,x,y,w,h);c.restore();return true;}
export const artIndex=value=>{let n=0;for(const v of String(value))n=(n*31+v.charCodeAt(0))>>>0;return n%12;};
export function actor(c,x,y,{color='',pose=0,size=1,variant}={}){const i=variant??artIndex(color);c.save();c.translate(x,y);c.rotate(Math.sin(pose)*.025);const bounce=Math.sin(pose*2)*2*size;frame(c,'actors',i,-55*size,-65*size+bounce,110*size,135*size);c.restore();}
export function shadow(c,x,y,w=100,alpha=.3){c.save();c.fillStyle='rgba(0,0,0,'+alpha+')';c.beginPath();c.ellipse(x,y,w,w*.2,0,0,Math.PI*2);c.fill();c.restore();}
export function surfaceFor(s){if(s.view==='quiz')return 'quiz';if(s.view==='social')return s.theme==='snake'?'world':'studio';if(s.view==='arcade')return ['fruit','tree','voxel','pig3d','stairs'].includes(s.theme)?'world':'arena';return 'arena';}
loadArt();
