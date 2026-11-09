const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:1.5});const errs=[];p.on('pageerror',e=>{errs.push(e.message);console.log('ERR',e.stack)});await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#goSelect');await p.waitForTimeout(400);await p.screenshot({path:'/tmp/claude-0/-home-claude/c713aef5-e636-58de-be3c-638a4225a82d/scratchpad/shots//y_sel.png'});await p.click('.tile[data-c="yuta"]');await p.click('.tile[data-c="goku"]');await p.click('#goStage');await p.waitForTimeout(300);await p.click('.stc[data-s="cupula"]');await p.click('#goFight');
await p.waitForTimeout(1500);await p.screenshot({path:'/tmp/claude-0/-home-claude/c713aef5-e636-58de-be3c-638a4225a82d/scratchpad/shots//y_vs.png'});
await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});
await p.evaluate(()=>{const G=__dbg.G;G.noAI=true;G.timer=999;window.F=n=>new Promise(r=>{const f0=G.frame;const c=()=>G.frame>=f0+n?r():requestAnimationFrame(c);c()});const f=G.p[0],o=G.p[1];f.x=900;o.x=1040;f.facing=1;o.facing=-1;
 window.K=async(code,n)=>{dispatchEvent(new KeyboardEvent('keydown',{code,bubbles:true}));await F(n||2);dispatchEvent(new KeyboardEvent('keyup',{code,bubbles:true}))};
 window.SH=async()=>{G.hold=true;await new Promise(r=>setTimeout(r,120));G.hold=false}});
await p.screenshot({path:'/tmp/claude-0/-home-claude/c713aef5-e636-58de-be3c-638a4225a82d/scratchpad/shots//y_0.png'});
const out=[];
// chain of punches
out.push(await p.evaluate(async()=>{const G=__dbg.G,f=G.p[0],o=G.p[1];o.hp=3600;const seq=[];for(let i=0;i<6;i++){await K('KeyJ');seq.push(f.mname+(f.grounded?'':'(AR)')+':'+Math.round(o.y));await F(9)}await F(30);return 'punch chain '+seq.join(',')+' dmg '+Math.round(3600-o.hp)}));
// kick
out.push(await p.evaluate(async()=>{const G=__dbg.G,f=G.p[0],o=G.p[1];o.hp=3600;f.x=900;o.x=1040;o.state='idle';await F(40);const seq=[];for(let i=0;i<3;i++){await K('KeyK');seq.push(f.mname);await F(10)}await F(40);return 'kick '+seq.join(',')+' dmg '+Math.round(3600-o.hp)}));
// ki quick punches
out.push(await p.evaluate(async()=>{const G=__dbg.G,f=G.p[0],o=G.p[1];o.hp=3600;f.ki=100;f.x=900;o.x=1040;o.y=__dbg.FLOOR||o.y;await F(60);await K('KeyL');await F(3);const s=f.state+' ki='+f.ki;await SH();await F(20);return 'ki '+s+' dmg '+Math.round(3600-o.hp)+' ki '+f.ki}));
await p.screenshot({path:'/tmp/claude-0/-home-claude/c713aef5-e636-58de-be3c-638a4225a82d/scratchpad/shots//y_ki.png'});
// combo
out.push(await p.evaluate(async()=>{const G=__dbg.G,f=G.p[0],o=G.p[1];o.hp=3600;f.x=900;o.x=1040;await F(60);await K('KeyI');await F(30);const s=f.state+':'+f.ytHeld;await SH();return 'combo '+s}));
await p.screenshot({path:'/tmp/claude-0/-home-claude/c713aef5-e636-58de-be3c-638a4225a82d/scratchpad/shots//y_cmb.png'});
out.push(await p.evaluate(async()=>{const G=__dbg.G,f=G.p[0],o=G.p[1];for(let i=0;i<10&&f.state==='ytc';i++)await F(10);await F(5);return 'combo end '+f.state+' dmg '+Math.round(3600-o.hp)+' cd '+(f.spCD-G.frame)}));
// counter: perfect guard
out.push(await p.evaluate(async()=>{const G=__dbg.G,f=G.p[0],o=G.p[1];f.hp=f.maxHp||f.hp;o.hp=3600;f.x=900;o.x=1040;await F(90);__dbg.startMove(o,'jab');await F(2);dispatchEvent(new KeyboardEvent('keydown',{code:'KeyH',bubbles:true}));await F(25);const s=f.state;dispatchEvent(new KeyboardEvent('keyup',{code:'KeyH',bubbles:true}));await F(30);return 'guard-> '+s+' got '+f.ytN+' odmg '+Math.round(3600-o.hp)}));
out.push(await p.evaluate(async()=>{const G=__dbg.G,f=G.p[0],o=G.p[1];f.state='idle';o.hp=3600;f.x=900;o.x=1040;await F(60);let st=[];for(let i=0;i<4;i++){__dbg.applyHit(o,f,{dmg:10,kb:0,hs:2,kind:'melee',px:f.x,py:f.y-150});await F(3);st.push(f.state)}await F(4);const s=f.state;await F(30);return 'passiva '+st.join(',')+' -> '+s+' odmg '+Math.round(3600-o.hp)}));
console.log(out.join('\n'),errs);
// transform
await p.evaluate(async()=>{const G=__dbg.G,f=G.p[0];f.ki=100;f.sb=9;f.x=900;await F(60);await K('KeyU',3)});
await p.waitForTimeout(1500);await p.screenshot({path:'/tmp/claude-0/-home-claude/c713aef5-e636-58de-be3c-638a4225a82d/scratchpad/shots//y_tr.png'});
const tr=await p.evaluate(async()=>{const G=__dbg.G,f=G.p[0];for(let i=0;i<60&&!(f.form&&!G.trans);i++)await F(10);await F(30);return 'form '+f.form+' st '+f.state+''});console.log(tr);
console.log(await p.evaluate(async()=>{const G=__dbg.G,f=G.p[0],o=G.p[1];let rk=0;for(let r=0;r<8;r++){f.state='idle';f.x=900;o.x=1040;o.state='idle';o.hp=3600;f.ytRkCD=0;await F(20);for(let i=0;i<4;i++){await K('KeyJ');await F(7);if(f.state==='ytr')rk++}await F(30)}return 'rika aparicoes '+rk+' tcr '+f.tcr+' tdm '+f.tdm.toFixed(2)}));
await p.screenshot({path:'/tmp/claude-0/-home-claude/c713aef5-e636-58de-be3c-638a4225a82d/scratchpad/shots/y_rika.png'});
console.log(await p.evaluate(async()=>{const G=__dbg.G,f=G.p[0],o=G.p[1];const r=[];for(let k=0;k<2;k++){f.state='idle';f.spCD=0;f.x=900;o.x=1040;o.state='idle';o.hp=3600;await F(30);await K('KeyI');await F(20);r.push(f.ytCK+':'+f.ytHeld);for(let i=0;i<10&&f.state==='ytc';i++)await F(10);r.push('dmg'+Math.round(3600-o.hp))}return 'combos rika '+r.join(' ')}));
await p.evaluate(async()=>{const G=__dbg.G,f=G.p[0];f.vx=9;f.state='walk';await F(4)});await p.evaluate(()=>{dispatchEvent(new KeyboardEvent('keydown',{code:'KeyD',bubbles:true}))});await p.waitForTimeout(250);const vx=await p.evaluate(()=>__dbg.G.p[0].vx);console.log('walk vx',vx);await p.screenshot({path:'/tmp/claude-0/-home-claude/c713aef5-e636-58de-be3c-638a4225a82d/scratchpad/shots//y_walk.png'});await p.evaluate(()=>{dispatchEvent(new KeyboardEvent('keyup',{code:'KeyD',bubbles:true}))});
await p.evaluate(async()=>{const G=__dbg.G,f=G.p[0];await F(30);f.state='charge';await F(10);await SH()});await p.screenshot({path:'/tmp/claude-0/-home-claude/c713aef5-e636-58de-be3c-638a4225a82d/scratchpad/shots//y_chg.png'});
const ult=await p.evaluate(async()=>{const G=__dbg.G,f=G.p[0],o=G.p[1];f.state='idle';o.hp=3600;f.ki=100;f.spark=1;f.x=900;o.x=1040;await F(30);return __dbg.trySuper?'':'?'});
console.log(await p.evaluate(async()=>{const f=__dbg.G.p[0];f.spark=600;f.ki=100;const pre=[f.state,f.ki,f.spark,f.form,f.sb].join();await K('KeyO',3);await F(2);return pre+' -> ws '+JSON.stringify(Object.keys(__dbg.G.ws||{}))+' st '+f.state}));await p.waitForTimeout(2000);await p.screenshot({path:'/tmp/claude-0/-home-claude/c713aef5-e636-58de-be3c-638a4225a82d/scratchpad/shots//y_ult.png'});
const u2=await p.evaluate(async()=>{const G=__dbg.G,o=G.p[1];for(let i=0;i<60&&G.ws;i++)await F(10);return 'ult done ws '+!!G.ws+' dmg '+Math.round(3600-o.hp)+' ostate '+o.state});console.log(u2,errs);
await b.close()})();
