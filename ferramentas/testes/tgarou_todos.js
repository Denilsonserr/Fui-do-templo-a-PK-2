const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ids=['aylla','zedry','zaykon','qingqing','goku','aokiji','zoro','broly','vegeta','gogeta','madara','gojo','luffy','rengoku','naruto','garou'];const res=[];
for(const id of ids){const p=await b.newPage({viewport:{width:915,height:412}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.goto('http://localhost:8765/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#goSelect');await p.waitForTimeout(300);await p.click(`.tile[data-c="${id}"]`);await p.click('.tile[data-c="garou"]');await p.click('#goStage');await p.waitForTimeout(200);await p.click('.stc[data-s="cupula"]');await p.click('#goFight');
await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});
await p.evaluate(()=>{const G=__dbg.G;G.p[0].cpu=true;G.p[1].ki=100;G.p[1].sb=9;G.p[0].sb=9;G.p[0].ki=100});
await p.waitForTimeout(9000);const st=await p.evaluate(()=>{const G=__dbg.G;return G.p.map(f=>f.def.id+':'+Math.round(f.hp)+':'+f.state+':'+(f.form||0)).join(' ')});res.push(id+' => '+st+' '+errs.slice(0,2).join('|'));await p.close()}
console.log(res.join('\n'));await b.close()})();
