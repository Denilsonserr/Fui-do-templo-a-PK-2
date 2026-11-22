// v609: menu do Alucard com o botão RANQUEADA PVP (vídeo novo do dono): PVP abre, botões no lugar
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
(async()=>{let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const b=await chromium.launch();
const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',tw_nome:'"Bia"',rk_own:'["goku"]'})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1500);
await p.click('#mRank');await p.waitForTimeout(1500);await p.evaluate(()=>{const m=document.getElementById('rkModal');if(m)m.innerHTML=''});
const v=await p.evaluate(()=>{const v=document.querySelector('.mn2v');return v&&v.src});chk(/22d40dc5a2d2f8|07f3567d173dc9/.test(v||''),'menu com o vídeo novo');
await p.evaluate(()=>{document.querySelectorAll('#rkWrap .hs[data-a]').forEach(e=>e.style.outline='2px solid #0f0')});await p.screenshot({path:SH+'menu_pvp.png'});
const has=await p.evaluate(()=>['boss','pvp','torre','caca','gacha','portais','menuBack'].every(a=>document.querySelector('#rkWrap [data-a="'+a+'"]')));chk(has,'botões: Modos, Boss, PVP, Torre, Caçador, Gacha, Portais');
await p.evaluate(()=>document.querySelector('#rkWrap [data-a="pvp"]').click());await p.waitForTimeout(1200);await p.screenshot({path:SH+'menu_pvp_abriu.png'});
const pv=await p.evaluate(()=>!!document.querySelector('#rkWrap .rk_pvp, #rkWrap [class*="pv"]'));chk(pv,'tocar em RANQUEADA PVP abre o PVP');
console.log(E.length?'ERROS '+E.slice(0,5).join(' | '):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
