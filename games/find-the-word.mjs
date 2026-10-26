import {Quiz} from '../core/quiz.mjs';
import {norm} from '../core/random.mjs';
import {WORDS,QUESTIONS,FLAGS} from '../core/words.mjs';
import {CATALOG} from '../catalog.mjs';
const meta=CATALOG.find(g=>g.id==='find-the-word');
const rules={
theme:'anagram',reset(g){g.target=g.pick(WORDS);g.state.question='Desembaralhe as letras';g.state.clue=g.target[1];const letters=g.target[0].split('');for(let i=letters.length-1;i>0;i--){const j=Math.floor(g.rnd(0,i+1));[letters[i],letters[j]]=[letters[j],letters[i]];}if(letters.join('')===g.target[0])letters.push(letters.shift());g.state.letters=letters;},
input(g,e,p){if(g.guess(e)===g.target[0])g.correct(p);else g.attempt(p,g.guess(e),'Use todas as letras');},answer(g){return g.target[0];}
};
export default class extends Quiz {constructor(options){super(meta,rules,options);}}
