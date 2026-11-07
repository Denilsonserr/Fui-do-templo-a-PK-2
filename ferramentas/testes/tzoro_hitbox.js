const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#goSelect');await p.waitForTimeout(400);await p.click('.tile[data-c="zoro"]');await p.click('.tile[data-c="'+(process.argv[2]||'goku')+'"]');await p.click('#goStage');await p.waitForTimeout(300);await p.click('.stc[data-s="cupula"]');await p.click('#goFight');
await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});
const r=await p.evaluate(async()=>{const G=__dbg.G;G.noAI=true;G.timer=999;const F=n=>new Promise(r=>{const f0=G.frame;const c=()=>G.frame>=f0+n?r():requestAnimationFrame(c);c()});
 const f=G.p[0],o=G.p[1],res={};
 for(const mv of ['zp1','zca','zp2','zcb','zp3']){res[mv]=[];for(const d of [70,120,170,220]){for(const cr of [0,1]){
   f.x=700;o.x=700+d;f.y=o.y=486;f.grounded=o.grounded=true;f.facing=1;o.facing=-1;f.state='idle';f.move=null;o.state=cr?'crouch':'idle';o.inp.down=cr;o.inv=0;o.hp=o.hpLag=3600;await F(4);
   o.state=cr?'crouch':'idle';__dbg.startMove(f,mv);let hit=0;for(let i=0;i<45;i++){await F(1);if(cr&&o.state!=='hit'&&o.state!=='airhit')o.state='crouch';}res[mv].push((3600-o.hp>0?'S':'-'));o.inp.down=0}}}
 return res});
console.log(JSON.stringify(r),errs);await b.close()})();
