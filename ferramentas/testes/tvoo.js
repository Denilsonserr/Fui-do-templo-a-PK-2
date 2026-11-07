const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
const out={};
for(const [c,o] of [[process.argv[2],process.argv[3]]]){
await p.evaluate(()=>{try{document.getElementById('toMenu').click()}catch(e){}});await p.waitForTimeout(300);
if(!(await p.isVisible('#goSelect')))await p.evaluate(()=>{});
await p.click('#goSelect');await p.waitForTimeout(400);await p.click(`.tile[data-c="${c}"]`);await p.click(`.tile[data-c="${o}"]`);await p.click('#goStage');await p.waitForTimeout(300);await p.click('.stc[data-s="cupula"]');await p.click('#goFight');
await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});
out[c]=await p.evaluate(async()=>{const G=__dbg.G;G.noAI=true;G.timer=999;const f=G.p[0],o=G.p[1];
 const F=n=>new Promise(r=>{const f0=G.frame;const c=()=>G.frame>=f0+n?r():requestAnimationFrame(c);c()});
 const K=(k,v)=>dispatchEvent(new KeyboardEvent(v?'keydown':'keyup',{code:k,bubbles:true}));
 K('KeyF',1);await F(3);K('KeyF',0);await F(10);const s1=[f.state,f.flying];K('ArrowUp',1);await F(40);const s2=[f.state,f.flying];K('ArrowUp',0);await F(60);
 // armadura do Broly
 let arm=null;if(f.def.id==='broly'){f.x=800;o.x=900;await F(5);o.cpu=false;f.state='idle';K('KeyJ',1);await F(2);K('KeyJ',0);await F(3);const st0=f.state;
   const h={dmg:20,kb:3,hs:14,px:f.x,py:f.y-140,kind:'melee'};f.inv=0;const r=[];for(let i=0;i<3;i++){f.inv=0;const ok=__dbg.applyHit(o,f,Object.assign({},h));r.push(ok+':'+f.state);if(f.state!=='attack'){break}}const ok=r.join('|');
   arm={st0,after:f.state,ok,walk:f.def.walk,power:f.def.power}}
 return {s1,s2,arm}});
await p.evaluate(()=>{__dbg.G.paused=false});await p.evaluate(()=>document.getElementById('pauseBtn').click());await p.waitForTimeout(300)}
console.log(JSON.stringify(out),errs);await b.close()})();
