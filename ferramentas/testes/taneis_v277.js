// v277: aba Anéis na Biblioteca (vagas por nível, equipar, anéis girando no corpo) + drop do Lobo Negro
const {chromium}=require('playwright');const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
const R=[{i:'a1',c:0,g:2,s:'dano',v:3,a:0},{i:'a2',c:1,g:4,s:'crit',v:12,a:0},{i:'a3',c:2,g:1,s:'st',v:9,a:0},{i:'a4',c:3,g:5,s:'vel',v:55,a:61234},{i:'a5',c:4,g:7,s:'dano',v:200,a:0},{i:'a6',c:0,g:0,s:'drop',v:1,a:0}];
await p.addInitScript(R=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"T"',rk_sel:'"goku"',rk_own:'["goku"]',tw_tit:'["adm"]',rk_lv:JSON.stringify({goku:{lv:50,t:[]}}),rk_an:JSON.stringify(R),rk_anEq:JSON.stringify({goku:['a1','a2',null,null,null,null,null,null]})})}},R);
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(900);await p.click('#rkWrap [data-a="lib"]',{force:true});await p.waitForTimeout(1200);await p.screenshot({path:SH+'an_bib.png'});
await p.click('#rkWrap [data-a="tab"][data-t="an"]',{force:true});await p.waitForTimeout(1300);await p.screenshot({path:SH+'an_tela.png'});
for(const id of ['a5','a4','a3']){await p.click(`#anGrid [data-i="${id}"]`,{force:true});await p.waitForTimeout(400);if(id==='a5')await p.screenshot({path:SH+'an_info.png'});await p.click('#anIn');await p.waitForTimeout(700)}
await p.screenshot({path:SH+'an_5.png'});console.log('equipados',await p.evaluate(()=>localStorage.rk_anEq));
await p.click('#rkWrap [data-a="anSlot"][data-i="6"]',{force:true});await p.waitForTimeout(300);console.log('vaga 7:',await p.evaluate(()=>document.getElementById('rkToast').textContent));
await p.click('#rkWrap [data-a="tab"][data-t="chr"]',{force:true});await p.waitForTimeout(800);await p.click('#lbAll',{force:true}).catch(()=>{});await p.waitForTimeout(600);await p.screenshot({path:SH+'an_tudo.png'});
// drop na caça (sorte forçada)
await p.evaluate(()=>{try{document.getElementById('rkMX')&&document.getElementById('rkMX').click()}catch(e){}});
await p.evaluate(()=>{localStorage.rk_an='[]'});await p.click('#rkWrap [data-a="back"]',{force:true});await p.waitForTimeout(600);await p.click('#rkWrap [data-a="caca"]',{force:true});await p.waitForTimeout(800);await p.click('#rkWrap [data-a="caGo"]',{force:true});
await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await p.waitForTimeout(800);
for(let k=0;k<3;k++){await p.evaluate(()=>{const [a,o]=__dbg.G.p;a.hp=3600;o.hp=3;o.hpLag=3;o.x=a.x+170;o.y=486;o.grounded=true;o.vy=0;o.bs='idle';o.bcd=300;o.state='idle';o.inv=0;o.facing=-1;a.facing=1;a.state='idle';window.__mr=Math.random;Math.random=()=>0.001});
  for(let i=0;i<10;i++){await p.keyboard.press('KeyJ');await p.waitForTimeout(110);if(await p.evaluate(()=>__dbg.G.p[1].bs==='rev'))break}await p.evaluate(()=>{Math.random=window.__mr});await p.waitForTimeout(3000)}
await p.screenshot({path:SH+'an_drop.png'});console.log('anéis depois da caça',await p.evaluate(()=>localStorage.rk_an));
for(let i=0;i<40;i++){await p.evaluate(()=>{const [a,o]=__dbg.G.p;if(a.hp>1)a.hp=1;a.inv=0;if(o.bs==='idle'){o.x=a.x+150;o.bcd=0}});await p.waitForTimeout(500);if(await p.evaluate(()=>__dbg.G.mode!=='fight'))break}
await p.waitForTimeout(2500);await p.screenshot({path:SH+'an_fim.png'});console.log(errs);await b.close()})();
