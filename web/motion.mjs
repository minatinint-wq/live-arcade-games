const clocks=new WeakMap();
const mix=(a,b,k)=>a+(b-a)*k;
function points(before,after,k){const old=new Map((before||[]).map(p=>[p.id,p]));return(after||[]).map(p=>{const q=p.id==null?null:old.get(p.id);return !q||q.alive!==p.alive||Math.hypot((p.x??0)-(q.x??0),(p.y??0)-(q.y??0))>200?p:{...p,...Object.fromEntries(['x','y'].filter(n=>Number.isFinite(q[n])&&Number.isFinite(p[n])).map(n=>[n,mix(q[n],p[n],k)]))};});}
/** Render one snapshot interval behind the server to interpolate instead of snapping at 10Hz. */
export function visualState(canvas,state,now=performance.now()/1000){
 let clock=clocks.get(canvas);
 if(!clock||clock.current.id!==state.id||clock.current.round!==state.round||state.time<clock.current.time){clock={current:state,previous:state,arrived:now,interval:.1};clocks.set(canvas,clock);}
 else if(clock.current!==state){if(clock.current.time!==state.time){clock.previous=clock.current;clock.interval=Math.max(.025,Math.min(.25,state.time-clock.current.time||.1));clock.arrived=now;}clock.current=state;}
 const elapsed=Math.max(0,now-clock.arrived),k=Math.min(1,elapsed/clock.interval),previous=clock.previous;
 const s={...state,visualTime:state.time+Math.min(.2,elapsed),players:points(previous.players,state.players,k),objects:points(previous.objects,state.objects,k),projectiles:points(previous.projectiles,state.projectiles,k),effects:(state.effects||[]).map(e=>({...e,life:Math.max(0,e.life-Math.min(.2,elapsed))}))};
 if(state.avatar&&previous.avatar)s.avatar={...state.avatar,x:mix(previous.avatar.x,state.avatar.x,k),y:mix(previous.avatar.y,state.avatar.y,k)};
 return s;
}
