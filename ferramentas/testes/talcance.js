const {chromium}=require('playwright');const C=process.argv[2];
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#goSelect');await p.waitForTimeout(400);await p.click(`.tile[data-c="${C}"]`);await p.click('.tile[data-c="'+(C==='goku'?'zoro':'goku')+'"]');await p.click('#goStage');await p.waitForTimeout(300);await p.click('.stc[data-s="cupula"]');await p.click('#goFight');
await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});
const r=await p.evaluate(async()=>{const G=__dbg.G;G.noAI=true;G.timer=999;const F=n=>new Promise(r=>{const f0=G.frame;const c=()=>G.frame>=f0+n?r():requestAnimationFrame(c);c()});
 const K=(k,v)=>dispatchEvent(new KeyboardEvent(v?'keydown':'keyup',{code:k,bubbles:true}));const f=G.p[0],o=G.p[1];const out={};
 for(const key of ['KeyJ','KeyK'])for(const d of [140,180,220,260,300]){f.x=900;o.x=900+d;f.y=o.y=486;f.facing=1;o.facing=-1;f.state='idle';f.move=null;o.state='idle';o.inv=0;o.hp=o.hpLag=3600;await F(20);
   K(key,1);await F(2);K(key,0);await F(40);out[key+d]=3600-o.hp>0?'S':'-'}
 return out});
console.log(C,Object.values(r).join(''),errs.join('|').slice(0,200));await b.close()})();
