// v374: cada passiva (raridade x tipo) muda os números do lutador na luta do Boss? Mede tcd/tdf/pspd/preg
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];const out=[];
for(const ps of [null,{r:'epica',i:0},{r:'lend',i:0},{r:'mit',i:0},{r:'epica',i:1},{r:'lend',i:1},{r:'mit',i:1},{r:'epica',i:2},{r:'lend',i:2},{r:'mit',i:2},{r:'epica',i:3},{r:'lend',i:3},{r:'mit',i:3}]){
const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|googleapis|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(ps=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"Ze"',rk_own:'["vegeta"]',rk_sel:'"vegeta"',rk_lvrz:'1',rk_gf362:'1',rk_pvupv:'352',rk_tsync:String(Date.now()),rk_rp:'100000',rk_ps:JSON.stringify({jn:0,ch:ps?{vegeta:ps}:{}}),rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}},ps);
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);
await p.evaluate(()=>{document.querySelectorAll('#lvrzM').forEach(x=>x.remove());try{rkModal(null)}catch(e){}});
for(const a of ['boss','start','fight']){await p.click(`#rkWrap [data-a="${a}"]`,{force:true}).catch(()=>{});await p.waitForTimeout(900)}
await p.waitForFunction(()=>{const G=__pvT.G();return G.mode==='fight'&&G.phase==='fight'},null,{timeout:60000}).catch(()=>{});
const r=await p.evaluate(()=>{const f=__pvT.G().p[0];return {tcd:+(f.tcd||0).toFixed(1),tdf:+(f.tdf||0).toFixed(3),pspd:f.pspd||0,tsp:+(f.tsp||0).toFixed(3),preg:f.preg||0,tdm:+(f.tdm||0).toFixed(2)}});
out.push((ps?ps.r+'#'+ps.i:'sem')+' '+JSON.stringify(r));await p.close()}
console.log(out.join('\n'),'\nERROS',errs);await b.close()})();
