// v273: menu principal novo + Perfil dentro do Modos de Jogo
const {chromium}=require('playwright');const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',rk_dia:'1',tw_nome:'"T"',rk_sel:'"goku"',rk_own:'["goku"]'})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForTimeout(1200);await p.screenshot({path:SH+'mp73_carregando.png'});
await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1500);await p.screenshot({path:SH+'mp73_a.png'});await p.waitForTimeout(1200);await p.screenshot({path:SH+'mp73_b.png'});
const vis=await p.evaluate(()=>['mPerfil','mOnline','mTorre','mRank','goSelect','mHist','mCfg'].map(i=>i+':'+(!document.getElementById(i).hidden)).join(' '));console.log(vis);
// cliques nos lugares da arte (coordenadas da tela)
const box=await p.evaluate(()=>{const r=document.getElementById('mm').getBoundingClientRect();return [r.x,r.y,r.width,r.height]});const at=(x,y)=>[box[0]+x/1847*box[2],box[1]+y/851*box[3]];
const where=async()=>p.evaluate(()=>[...document.querySelectorAll('section.screen')].filter(s=>!s.hidden).map(s=>s.id).join(',')+' '+((document.querySelector('#rkWrap .rkA')||{}).className||''));
await p.mouse.click(...at(400,560));await p.waitForTimeout(400);console.log('historia:',await p.evaluate(()=>document.getElementById('mmtoast').textContent));
await p.mouse.click(...at(300,640));await p.waitForTimeout(700);console.log('config:',await p.evaluate(()=>!document.getElementById('config').hidden));await p.click('#cfgBack');await p.waitForTimeout(600);
await p.mouse.click(...at(300,435));await p.waitForTimeout(900);console.log('treino:',await p.evaluate(()=>!document.getElementById('select').hidden));
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(500);
await p.mouse.click(...at(350,240));await p.waitForTimeout(1500);console.log('aventura:',await where());await p.screenshot({path:SH+'mo73.png'});
await p.click('#rkWrap [data-a="perfil"]',{force:true});await p.waitForTimeout(1200);console.log('perfil:',await where());await p.screenshot({path:SH+'mo73_perfil.png'});
await p.click('#rkWrap [data-a="back"]',{force:true});await p.waitForTimeout(900);console.log('voltar do perfil:',await where());
console.log(errs);await b.close()})();
