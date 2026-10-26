import {Social} from '../core/social.mjs';
import {clamp} from '../core/random.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='name-diary');
const rules={
theme:'diary',actions:[{id:'sign',label:'Assinar diário'},{id:'decorate',label:'Enfeitar página'},{id:'page',label:'Virar página'}],reset(g){g.state.pages=[[]];g.state.page=0;g.state.stickers=[];},
input(g,e,p){if(e.action==='page'){g.state.pages.push([]);g.state.pages=g.state.pages.slice(-12);g.state.page=g.state.pages.length-1;return;}if(e.action==='decorate'||e.kind==='gift'){g.state.stickers.push({x:g.rnd(160,740),y:g.rnd(350,980),shape:g.pick(['star','heart','flower']),page:g.state.page});g.state.stickers=g.state.stickers.slice(-100);return;}let page=g.state.pages[g.state.page];if(page.length>=10){g.state.pages.push([]);g.state.pages=g.state.pages.slice(-12);g.state.page=g.state.pages.length-1;page=g.state.pages[g.state.page];}if(!page.some(v=>v.owner===p.id)){page.push({owner:p.id,name:p.name,color:p.color,text:e.text.slice(0,46)});g.addScore(p,10);g.state.total++;}}
};
export default class extends Social {constructor(options){super(meta,rules,options);}}
