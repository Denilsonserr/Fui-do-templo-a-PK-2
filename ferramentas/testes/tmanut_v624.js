// v624: manutenção forçada no servidor — jogador vê a tela de manutenção, ADM continua entrando
const {chromium}=require('playwright');const SH=__dirname+'/shots/t624_';
(async()=>{const b=await chromium.launch();let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
  const run=async(adm)=>{const p=await b.newPage({viewport:{width:915,height:412}});await p.route(/fonts\.g|firestore/,r=>r.abort());
    await p.addInitScript(adm=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:adm?'"Denilson ADM"':'"Bia"',rk_ini:'1',rk_xpv2:'1',rk_lvrz:'1'},adm?{tw_tit:'["adm"]'}:{})}},adm);
    await p.goto('http://localhost:8790/index.html');await p.waitForTimeout(9000);const v=await p.evaluate(()=>{const O=document.getElementById('modO');return O?O.textContent.slice(0,80):''});await p.screenshot({path:SH+(adm?'adm':'jog')+'.png'});await p.close();return v};
  const j=await run(0);console.log('jogador:',j);chk(/MANUTENÇÃO/.test(j),'jogador vê JOGO EM MANUTENÇÃO');
  const a=await run(1);console.log('adm:',a);chk(!a,'ADM entra normal');console.log(ok?'TUDO OK':'FALHOU');await b.close()})();
