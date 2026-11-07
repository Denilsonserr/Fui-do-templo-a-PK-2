const {chromium}=require('playwright');const CH=process.argv[2]||'naruto',KEY=process.argv[3]||'punch';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#goSelect');await p.waitForTimeout(400);await p.click(`.tile[data-c="${CH}"]`);await p.click('.tile[data-c="zoro"]');await p.click('#goStage');await p.waitForTimeout(300);await p.click('.stc[data-s="cupula"]');await p.click('#goFight');
await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});
const r=await p.evaluate(async (KEY)=>{const G=__dbg.G;G.noAI=true;G.timer=999;const f=G.p[0],o=G.p[1];
 const F=n=>new Promise(r=>{const f0=G.frame;const c=()=>G.frame>=f0+n?r():requestAnimationFrame(c);c()});
 const K=(k,v)=>{const c={left:'ArrowLeft',right:'ArrowRight',up:'ArrowUp',down:'ArrowDown',punch:'KeyJ',kick:'KeyK'}[k];dispatchEvent(new KeyboardEvent(v?'keydown':'keyup',{code:c,bubbles:true}))};
 const W=1920;o.x=99999;await F(2);f.x=o.x-110;f.facing=1;o.facing=-1;o.hp=o.hpLag=1e6;await F(20);
 let maxC=0,grN=0,maxAir=0,air=0,log=[];
 for(let i=0;i<360;i++){K(KEY,1);await F(2);K(KEY,0);await F(3);K('right',1);await F(1);K('right',0);
   if(f.combo>maxC)maxC=f.combo;if(o.grounded){grN++;air=0}else{air++;maxAir=Math.max(maxAir,air)}if(i%30===0)log.push([o.state,Math.round(o.y),o.grounded,o.jug,f.combo,Math.round(o.x),f.state].join(','))}
 return {maxC,grN,maxAir,log,WW:o.x}},KEY);
console.log(CH,KEY,JSON.stringify(r),errs);await b.close()})();
