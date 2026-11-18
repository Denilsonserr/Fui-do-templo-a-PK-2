// v517: Sung nível alto (dados do Honrado, nível 88) volta a upar: repetíveis crescem com o nível + 2 repetíveis novas
const {chromium}=require('playwright');
const SJ={"lv":88,"xp":3790,"pts":19,"cls":"necro","sh":["tank","igris"],"eq":"igris","ms":{"t3":1,"k10":1,"t6":1,"t9":1,"t11":1,"k2":1,"k4":1,"k8":1,"k6":1,"r1b":360,"w10":1,"u25":1,"u100":1,"w50":1,"w150":1,"k13":1},"cnt":{"w":365,"ult":195},"d":{"day":"2026-11-18","w":11,"h":258,"u":2,"a":11,"f":2},"dc":{"d1":1,"d2":1,"d3":1,"d4":1},"st":{"for":216,"vit":60,"agi":10,"per":80,"int":100},"shl":{"tank":20,"igris":40},"rsN":6};
(async()=>{const b=await chromium.launch();const errs=[];let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
  const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());await p.route(/\/fs\/v1\//,r=>r.fulfill({status:200,contentType:'application/json',body:'[]'}));
  await p.clock.install({time:new Date('2026-11-18T12:00:00-03:00')});
  await p.addInitScript(sj=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_pvupv:'352',rk_own:'["goku","sung"]',rk_sel:'"sung"',tw_nome:'"Honrado"',tw_uid:'"u_h"',rk_sjs:JSON.stringify(sj),rk_urso:'1'})}},SJ);
  await p.goto('http://localhost:8790/index.html');await p.clock.runFor(1000);await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
  const r=await p.evaluate(()=>{__pvT.sjo();__pvT.sja('ms',{});const txt=[...document.querySelectorAll('#sjPan .sjMs')].map(x=>x.textContent.replace(/\s+/g,' ').trim());
    const b1=document.querySelector('#sjPan [data-s="get"][data-k="r1"]');const can=b1&&!b1.disabled;b1&&b1.click();const o=JSON.parse(localStorage.rk_sjs);
    const r2=document.querySelector('#sjPan [data-s="get"][data-k="r2"]');return {txt,can,xp:o.xp,lv:o.lv,r2b:o.ms.r2b,r3b:o.ms.r3b,r2dis:r2&&r2.disabled}});
  console.log(r.txt.filter(t=>/repete/.test(t)).join('\n'));console.log(JSON.stringify({...r,txt:undefined}));
  chk(r.can&&r.xp===3790+450+87*12-4110&&r.lv===89,'repetível de 5 vitórias deu 1.494 XP e subiu para o nível 89');
  chk(r.r2b===195&&r.r3b===0&&r.r2dis,'repetíveis novas começam do zero (não dão tudo de uma vez)');
  chk(r.txt.some(t=>/Invoque sombras 5 vezes \(repete/.test(t))&&r.txt.some(t=>/500 golpes/.test(t)),'missões novas aparecem');
  chk(!errs.length,'sem erros '+errs.join(' | '));console.log(ok?'TUDO OK':'TEM FALHA');await b.close()})();
