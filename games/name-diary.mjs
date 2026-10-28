import {Social} from '../core/social.mjs';
import {clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='name-diary');
function nextPage(g){g.state.pages.push([]);if(g.state.pages.length>12){g.state.pages.shift();g.state.stickers=g.state.stickers.filter(v=>v.page>0).map(v=>({...v,page:v.page-1}));}g.state.page=g.state.pages.length-1;g.state.pageTurnAt=g.time;}
const rules={
theme:'diary',actions:[{id:'sign',label:'Assinar diário'},{id:'decorate',label:'Enfeitar página'},{id:'page',label:'Virar página'}],reset(g){g.state.pages=[[]];g.state.page=0;g.state.stickers=[];g.state.pageTurnAt=-10;},
input(g,e,p){if(e.action==='page'){nextPage(g);return;}if(e.action==='decorate'||e.kind==='gift'){g.state.stickers.push({x:g.rnd(240,690),y:g.rnd(420,790),shape:g.pick(['star','heart','flower']),page:g.state.page,at:g.time});g.state.stickers=g.state.stickers.slice(-100);return;}let page=g.state.pages[g.state.page];if(page.length>=10){nextPage(g);page=g.state.pages[g.state.page];}if(!page.some(v=>v.owner===p.id)){page.push({owner:p.id,name:p.name,color:p.color,text:e.text.slice(0,46),at:g.time});g.addScore(p,10);g.state.total++;}}
};
export default class extends Social {constructor(options){super(meta,rules,options);}}
