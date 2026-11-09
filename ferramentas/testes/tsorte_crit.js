// v239: confere que o CRÍTICO aumenta o dano (x1,6 + dano crítico da árvore) e que a SORTE aumenta os drops (pó, geminhas, moeda vermelha). Também o roubo de vida.
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"T"',rk_ini:'1',rk_xpv2:'1',rk_own:'["goku","yuta"]',rk_sel:'"yuta"',rk_rp:'0',rk_dia:'1',
  rk_lv:JSON.stringify({yuta:{lv:20,t:[3,1,0]}}),tw_inv:JSON.stringify([{id:'a1',t:'anel',r:'sec',v:50,st:50,trf:30,nm:'ANEL DO YUTA',yt:1}]),tw_eqp:'{"anel":"a1"}'})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
const r=await p.evaluate(()=>{const o={};const R=__rk;o.sorteYuta=R.lvSorte();o.luckYuta=R.lvLuck();localStorage.rk_sel='"goku"';o.sorteGoku=R.lvSorte();o.luckGoku=R.lvLuck();localStorage.rk_sel='"yuta"';return o});
await p.click('#mRank');await p.waitForTimeout(500);await p.click('#rkWrap [data-a="boss"]');await p.waitForTimeout(600);await p.click('#rkWrap [data-a="start"]');await p.waitForTimeout(400);await p.click('#rkWrap [data-a="fight"]');
await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});
const c=await p.evaluate(()=>{const G=__dbg.G,[a,d]=G.p;G.noAI=true;const hit=cr=>{window.__crit=cr;d.hp=d.mhp=99999;d.inv=0;d.state='idle';d.ko=false;d.combo=0;a.combo=0;const h0=d.hp;__dbg.applyHit(a,d,{dmg:100,kb:0,hs:1,kind:'melee',px:d.x,py:d.y-150});return h0-d.hp};
  const n=hit(0),c=hit(1);a.hp=100;const before=a.hp;hit(0);return {normal:Math.round(n),critico:Math.round(c),razao:+(c/n).toFixed(3),tcd:a.tcd,tls:a.tls,tcr:a.tcr,cura:Math.round(a.hp-before)}});
console.log(JSON.stringify({sorte:r,crit:c,errs}));await b.close()})();
