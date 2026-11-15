// v455: MODERAÇÃO — ADM cria a senha no painel, bane um jogador pelo ID com tempo, fecha/abre o jogo. Servidor local 8790 (reinicie antes: banco novo).
const {chromium}=require('playwright');const U='http://localhost:8790/index.html';
(async()=>{const b=await chromium.launch();const E=[];
const ctx=async(nm,adm)=>{const c=await b.newContext({viewport:{width:915,height:412}});const p=await c.newPage();p.on('pageerror',e=>E.push(nm+': '+e.message));p.on('dialog',d=>d.accept('novaSenha77'));await p.route(/fonts\.g|googleapis/,r=>r.abort());
  await p.addInitScript(([nm,adm])=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',tw_uid:JSON.stringify('uid_'+nm),tw_nome:JSON.stringify(nm),rk_own:'["goku"]',rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0}),...(adm?{tw_tit:'["adm"]',tw_titOn:'"adm"'}:{})})}},[nm,adm]);
  await p.goto(U);await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});return p};
const tela=p=>p.evaluate(()=>{const o=document.getElementById('modO');return o?o.innerText.replace(/\s+/g,' ').slice(0,120):'(livre)'});
const bia=await ctx('Bia',0);/* Bia joga e aparece no servidor */
await bia.evaluate(()=>fetch('/fs/v1/projects/furia-do-templo/databases/(default)/documents/torre?documentId=t_bia',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:{uid:{stringValue:'uid_Bia'},nome:{stringValue:'Bia'}}})}));
const adm=await ctx('Denilson ADM',1);await adm.click('#mRank');await adm.waitForTimeout(1500);
await adm.evaluate(()=>{const M=document.getElementById('rkModal');if(M){M.hidden=true;M.innerHTML=''};document.querySelectorAll('#lvrzM,#acM').forEach(x=>x.remove())});
await adm.evaluate(()=>__pvT.admO());await adm.waitForTimeout(400);await adm.click('#admMod');await adm.waitForTimeout(1200);
console.log('1ª vez:',await adm.evaluate(()=>document.querySelector('#modP .modW').innerText.slice(0,140).replace(/\s+/g,' ')));
await adm.fill('#modS','segredo123');await adm.click('#modSok');await adm.waitForTimeout(1500);
const idBia=await adm.evaluate(()=>p3Id?0:0).catch(()=>0);
const ID=await bia.evaluate(()=>document.querySelector('.p3Id b')?0:0);
const id=require('child_process').execSync(`node -e "const t=s=>{let h=0x811c9dc5;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,0x01000193)>>>0}return h.toString(36)};console.log(10000002+(parseInt(t('uid_Bia').slice(0,7),36)%89999990))"`).toString().trim();
await adm.fill('#modId',id);await adm.click('.modT:nth-child(3)');await adm.fill('#modMot','xingou no chat');await adm.screenshot({path:'/tmp/mod_painel.png'});await adm.click('#modBan');await adm.waitForTimeout(1500);
console.log('lista:',await adm.evaluate(()=>[...document.querySelectorAll('#modP .modL')].map(x=>x.innerText.replace(/\s+/g,' ')).join(' | ')));
await bia.reload();await bia.waitForTimeout(4500);console.log('Bia depois do ban:',await tela(bia));await bia.screenshot({path:'/tmp/mod_banido.png'});
await adm.evaluate(()=>document.querySelector('#modP .modL [data-g]').click());await adm.waitForTimeout(1500);await bia.click('#modR');await bia.waitForTimeout(1500);console.log('Bia desbanida:',await tela(bia));
await adm.fill('#modMsg','Volto às 18h');await adm.click('#modFe');await adm.waitForTimeout(1500);await adm.screenshot({path:'/tmp/mod_fechado_adm.png'});
await bia.reload();await bia.waitForTimeout(4500);console.log('Bia com jogo fechado:',await tela(bia));await bia.screenshot({path:'/tmp/mod_manut.png'});
await adm.reload();await adm.waitForTimeout(4500);console.log('ADM com jogo fechado:',await tela(adm));
await adm.evaluate(()=>modOpen?0:0).catch(()=>{});await adm.click('#mRank');await adm.waitForTimeout(1200);await adm.evaluate(()=>{const M=document.getElementById('rkModal');if(M){M.hidden=true;M.innerHTML=''};document.querySelectorAll('#lvrzM,#acM').forEach(x=>x.remove());__pvT.admO()});await adm.waitForTimeout(300);await adm.click('#admMod');await adm.waitForTimeout(1500);
await adm.click('#modAb');await adm.waitForTimeout(1500);await bia.click('#modR');await bia.waitForTimeout(1500);console.log('Bia com jogo aberto:',await tela(bia));
await adm.click('#modNs');await adm.waitForTimeout(1500);console.log('senha trocada:',await adm.evaluate(()=>localStorage.mod_s));
console.log('ERROS',E);await b.close()})();
