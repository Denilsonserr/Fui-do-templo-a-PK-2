// v384: espera de 3 s do COMBO do Shaka e energia da transformação enchendo durante o combo
const {chromium}=require('playwright');const U='file:///home/claude/fui-do-templo-a-pk-2/www/index.html';
(async()=>{const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:915,height:412},hasTouch:true});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|googleapis|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(`if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Ze"',rk_own:'["goku","shaka"]',rk_sel:'"shaka"',rk_lvrz:'1',rk_gf362:'1',rk_pvupv:'352',rk_tsync:String(Date.now())})}`);
await p.goto(U);await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);
await p.evaluate(()=>{document.querySelectorAll('#lvrzM').forEach(x=>x.remove());__pvT.tnO()});await p.waitForTimeout(1500);await p.evaluate(()=>__pvT.tnS(0));
await p.waitForFunction(()=>{const G=__pvT.G(),T=__pvT.tn();return G.mode==='fight'&&G.phase==='fight'&&T.ph==='boss'},null,{timeout:90000});await p.waitForTimeout(800);
const press=async()=>{await p.evaluate(()=>{const G=__pvT.G(),a=G.p[0],o=G.p[1];a.x=o.x-150;a.facing=1;o.hp=o.mhp;a.buf.sp=G.frame})};
const info=()=>p.evaluate(()=>{const G=__pvT.G(),a=G.p[0];return {st:a.state,cmb:!!a.inCmb,sb:+(a.sb||0).toFixed(3),cd:Math.max(0,(a.spCD||0)-G.frame)}});
await press();const S=[];for(let i=0;i<14;i++){await p.waitForTimeout(250);S.push(await info())}console.log('combo 1:',JSON.stringify(S.map(x=>x.st+'/'+x.sb+'/cd'+x.cd)));
let w=0;while(w++<40){const x=await info();if(!x.cmb&&x.cd>0)break;await p.waitForTimeout(150)}
const a=await info();await press();await p.waitForTimeout(400);const b2=await info();console.log('apertou com espera',a.cd,'→ estado',b2.st,'emCombo',b2.cmb);
console.log('ERROS',errs.slice(0,5));await b.close()})();
