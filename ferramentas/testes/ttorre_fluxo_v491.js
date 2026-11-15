const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});const E=[],W=[];p.on('pageerror',e=>E.push(e.message));p.on('response',r=>{if(r.status()>=400)W.push(r.status()+' '+r.url().slice(-60))});p.on('console',m=>{if(m.type()==='warning')W.push(m.text().slice(0,200))});await p.route(/fonts\.g|firestore/,r=>r.abort());
const live=+process.env.LIVE;
await p.addInitScript(live=>{if(live)window.__twEvT=[-60000,3600000];if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Bia"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_rs463:'1',rk_rs464:'1',rk_rs464b:'1',rk_s2:'1',rk_s2rw:'1',rk_rws2:'1',rk_own:'["goku"]',rk_sel:'"goku"'})}},live);
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.evaluate(()=>__tb2.go());const log=[];let last='';
for(let t=0;t<170;t++){await p.waitForTimeout(1000);
 const s=await p.evaluate(()=>{const G=__tb2.G(),T=__tb2.TN();try{if(G.mode==='fight'&&G.p){for(const q of G.p.slice(1))if(q&&!q.ko&&q.hp>0){q.hp=Math.min(q.hp,1)}for(const m of (T.mobs||[]))if(m&&!m.ko)m.hp=Math.min(m.hp,1);const P=G.p[0];if(P&&G.p[1]&&!G.p[1].ko){P.x=G.p[1].x-80*(G.p[1].x>P.x?1:-1)}}}catch(e){}
  const M=document.getElementById('tnPick');if(M&&M.classList.contains('on')){const c=M.querySelector('.tnC');c&&c.click()}
  const scr=[...document.querySelectorAll('.screen')].filter(x=>!x.hidden&&x.offsetParent!==null).map(x=>x.id).join('/');
  return `scr=${scr} mode=${G.mode} gm=${G.gmode} ph=${T.ph} g=${T.g} on=${T.on} done=${T.done} p1hp=${G.p&&G.p[1]?Math.round(G.p[1].hp):'-'} ko1=${G.p&&G.p[1]?G.p[1].ko:'-'} mobs=${(T.mobs||[]).length} chest=${T.chest?JSON.stringify({l:T.chest.land,o:T.chest.open}):'-'} statue=${T.statue?JSON.stringify(T.statue):'-'} gate=${T.gate?JSON.stringify(T.gate).slice(0,80):'-'}`});
 if(s!==last){log.push(t+'s '+s);last=s}
 // auto attack: press keys
 await p.keyboard.press('j');
 if(/scr=tower/.test(s)&&/mode=tower/.test(s)){await p.evaluate(()=>__tb2.go())}}
console.log(log.join('\n'));console.log('ERR',E.slice(0,5),'WARN',W.slice(0,8));await p.screenshot({path:'/tmp/tnflow.png'});await b.close()})();
