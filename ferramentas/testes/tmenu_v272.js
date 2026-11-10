// v272: tela Modos de Jogo nova (arte do dono) — botões, cadeado do Caçador (só ADM), efeitos
const {chromium}=require('playwright');const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/';
async function run(adm){const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(a=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"T"',rk_sel:'"goku"',rk_own:'["goku"]'});if(a)localStorage.tw_tit='["adm"]'}},adm);
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(1500);await p.screenshot({path:SH+'m72_'+(adm?'adm':'nor')+'_a.png'});await p.waitForTimeout(1300);await p.screenshot({path:SH+'m72_'+(adm?'adm':'nor')+'_b.png'});
const r={};for(const a of ['boss','torre','gacha','psMenu','mnMenu','evMenu','bpMenu','ranking','rewards','ach','lib','pos','caca','cacaLk'])r[a]=await p.$$eval(`#rkWrap [data-a="${a}"]`,e=>e.length);
await p.click('#rkWrap [data-a="'+(adm?'caca':'cacaLk')+'"]',{force:true});await p.waitForTimeout(700);
const t=await p.evaluate(()=>[(document.getElementById('rkToast')||{}).textContent,__dbg.G.gmode,__dbg.G.mode].join(' | '));
console.log(adm?'ADM':'normal',JSON.stringify(r),'clique caçador:',t,errs);await b.close()}
(async()=>{await run(0);await run(1)})();
