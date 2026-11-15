// v480: Sung forte (Sistema 100, sem itens) batendo de verdade no Igris rank E e S por 20 s: quanto da vida desce
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"V"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_rs463:'1',rk_rs464:'1',rk_rs464b:'1',rk_s2:'1',rk_s2rw:'1',rk_own:'["goku","sung"]',rk_sel:'"sung"',rk_sjs:JSON.stringify({lv:100,cls:'necro',st:{for:260,vit:200,agi:150,per:10,int:10}})})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(1500);
for(const rk of [0,5]){await p.evaluate(rk=>__pt.start({r:rk,id:'v'+rk}),rk);await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await p.waitForTimeout(500);
 await p.evaluate(()=>{__pt.R().room=9;__pt.next()});await p.waitForTimeout(2600);
 await p.evaluate(()=>{const P=__dbg.G.p[0];P.hp=P.mhp=60000;P.inv=0;window.__h0=__dbg.G.p[1].hp});
 for(let i=0;i<125;i++){await p.keyboard.press(i%9===4?'i':i%2?'k':'j');await p.waitForTimeout(150);if(i%10===0)await p.evaluate(()=>{const P=__dbg.G.p[0],o=__dbg.G.p[1];if(Math.abs(o.x-P.x)>260){P.x=o.x-P.facing*180}P.facing=o.x>P.x?1:-1;P.hp=Math.max(P.hp,20000)})}
 console.log('rank',rk,JSON.stringify(await p.evaluate(()=>{const o=__dbg.G.p[1];return {vida:Math.round(o.mhp),desceu:Math.round((window.__h0-o.hp)/o.mhp*100)+'%',tdm:+__dbg.G.p[0].tdm.toFixed(2)}})));
 await p.evaluate(()=>{const G=__dbg.G,f=G.p[0];f.hp=0;f.inv=0;__pvT.ko(G.p[1],f)});await p.waitForTimeout(5000);await p.evaluate(()=>{const M=document.getElementById('lvrzM');if(M)M.remove()})}
await b.close()})();
