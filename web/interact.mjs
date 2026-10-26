// Coordinates are in the 900×1200 playfield, below the 160px title strip.
const within=(x,y,a,b,w,h)=>x>=a&&x<=a+w&&y>=b&&y<=b+h;
export function pointerInput(s,x,y){
 if(!s||s.phase!=='playing'||x<0||x>900||y<0||y>1200)return null;
 const data={x,y};
 if(s.theme==='memory'){const col=Math.floor((x-118)/171),row=Math.floor((y-320)/171);if(col<0||col>3||row<0||row>3||!within(x,y,118+col*171,320+row*171,152,152))return null;return {...data,index:row*4+col,text:String(row*4+col+1)};}
 if(s.theme==='voxel'){const cells=s.heights.map((h,i)=>{let rx=i%8,ry=Math.floor(i/8);for(let n=0;n<s.rotation;n++)[rx,ry]=[7-ry,rx];return{i,h,depth:rx+ry,cx:450+(rx-ry)*39,cy:580+(rx+ry)*23-h*35};}).sort((a,b)=>b.depth-a.depth);const v=cells.find(v=>Math.abs(x-v.cx)/38+Math.abs(y-v.cy)/20<=1);return v?{index:v.i,action:'build'}:null;}
 if(s.theme==='window')return within(x,y,90,220,720,810)?{action:'wipe',x:(x-90)/720*900,y:(y-220)/810*1200}:null;
 if(s.theme==='fruit')return {...data,action:'slice'};
 if(s.theme==='stairs'||s.theme==='tree')return {action:x<450?'left':'right'};
 if(s.theme==='stack')return {action:'drop'};
 if(s.theme==='runner'||s.theme==='pig3d')return {action:'jump'};
 if(s.theme==='zombie')return {action:'shoot'};
 if(s.theme==='poll'){for(let i=0;i<2;i++)if(within(x,y,90,380+i*260,720,210))return{action:'answer:'+(i+1)};return null;}
 if(s.theme==='map'){for(let i=0;i<s.options.length;i++)if(within(x,y,95+i%2*360,830+Math.floor(i/2)*83,345,72))return{action:'answer:'+(i+1)};return null;}
 if(s.options?.length){for(let i=0;i<s.options.length;i++)if(!s.hidden?.includes(i)&&within(x,y,110,370+i*137,680,112))return{action:'answer:'+(i+1)};}
 if(s.view==='quiz')return null;
 if(s.actions.some(a=>a.id==='blue'))return{action:x<450?'blue':'red'};
 return {action:s.actions.find(a=>!['join','blue','red'].includes(a.id))?.id||s.actions[0]?.id};
}
export function keyboardInput(s,key){const aliases={ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right',ArrowUp:'up',w:'up',ArrowDown:'down',s:'down',' ':'space'};const k=aliases[key];if(!k||!s||s.phase!=='playing')return null;if(s.theme==='snake')return k==='space'?null:{action:k};if(['stairs','tree'].includes(s.theme)&&['left','right'].includes(k))return{action:k};if(s.theme==='car')return{action:k==='up'||k==='space'?'boost':k==='down'?'oil':'lane'};if(s.theme==='horse')return{action:k==='down'?'rest':'sprint'};if(k==='space'){const id={pig3d:'jump',runner:'jump',stack:'drop',zombie:'shoot',fruit:'slice',window:'wipe',voxel:'build',platform:'jump'}[s.theme];if(id)return{action:id};}return null;}
const letterCell=(s,x,y)=>{const cols=s.theme==='swipe'?4:10,size=s.theme==='swipe'?166:73,left=s.theme==='swipe'?120:90,top=s.theme==='swipe'?340:330,col=Math.floor((x-left)/size),row=Math.floor((y-top)/size);return col>=0&&col<cols&&row>=0&&row<cols?row*cols+col:null;};
export function bindCanvasInput(canvas,getState,enabled,send){
 canvas.tabIndex=0;canvas.style.touchAction='none';let down=false,path=[],lastAt=0;
 const point=e=>{const r=canvas.getBoundingClientRect(),scale=Math.min(r.width/900,r.height/1600);return{x:(e.clientX-r.left-(r.width-900*scale)/2)/scale,y:(e.clientY-r.top-(r.height-1600*scale)/2)/scale-160};};
 const move=e=>{if(!down||!enabled())return;const s=getState(),p=point(e);if(!s)return;if(['swipe','hunt'].includes(s.theme)){const i=letterCell(s,p.x,p.y);if(i!==null&&path.at(-1)!==i&&!path.includes(i)){if(s.theme==='swipe'&&path.length){const old=path.at(-1);if(Math.abs(old%4-i%4)>1||Math.abs(Math.floor(old/4)-Math.floor(i/4))>1)return;}path.push(i);}return;}if(['fruit','window'].includes(s.theme)&&performance.now()-lastAt>100){lastAt=performance.now();const data=pointerInput(s,p.x,p.y);if(data)send(data);}};
 canvas.addEventListener('pointerdown',e=>{if(!enabled())return;const s=getState();if(!s)return;down=true;path=[];canvas.focus();canvas.setPointerCapture(e.pointerId);if(['swipe','hunt'].includes(s.theme))move(e);else{const p=point(e),data=pointerInput(s,p.x,p.y);if(data)send(data);}lastAt=performance.now();});
 canvas.addEventListener('pointermove',move);
 canvas.addEventListener('pointerup',()=>{const s=getState();if(down&&enabled()&&s&&path.length){if(s.theme==='swipe')send({text:path.map(i=>s.grid[i]).join('')});if(s.theme==='hunt'&&path.length>1){const a=path[0],b=path.at(-1),dx=Math.sign(b%10-a%10),dy=Math.sign(Math.floor(b/10)-Math.floor(a/10)),n=Math.max(Math.abs(b%10-a%10),Math.abs(Math.floor(b/10)-Math.floor(a/10)));if(dx===0||dy===0||Math.abs(b%10-a%10)===Math.abs(Math.floor(b/10)-Math.floor(a/10))){const w=Array.from({length:n+1},(_,i)=>s.grid[a+i*dx+i*dy*10]).join('');send({text:w});}}}down=false;path=[];});
 canvas.addEventListener('pointercancel',()=>{down=false;path=[];});canvas.addEventListener('keydown',e=>{if(!enabled())return;const data=keyboardInput(getState(),e.key);if(data){e.preventDefault();send(data);}});
}
