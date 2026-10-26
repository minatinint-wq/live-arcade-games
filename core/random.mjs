export function random(seed=12345){let n=seed>>>0;return()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};}
export const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export const finite=n=>typeof n==='number'&&Number.isFinite(n);
