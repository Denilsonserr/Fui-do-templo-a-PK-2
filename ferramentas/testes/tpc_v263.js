// v263: modo PC — teclado e mouse (PC = mouse sem toque) e celular (toque) continuam funcionando
const {chromium,devices}=require('playwright');const SH='/home/claude/fui-do-templo-a-pk-2/ferramentas/testes/shots/';
const start=async p=>{await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
  await p.click('#goSelect');await p.waitForTimeout(400);await p.click('.tile[data-c="goku"]');await p.click('.tile[data-c="madara"]');await p.click('#goStage');await p.waitForTimeout(500);await p.click('#goFight');
  await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await p.evaluate(()=>{__dbg.G.noAI=true;__dbg.G.timer=999});await p.waitForTimeout(500)};
(async()=>{const b=await chromium.launch();const errs=[];
 // PC
 const p=await b.newPage({viewport:{width:1280,height:720}});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());await start(p);
 const st=()=>p.evaluate(()=>({controls:document.getElementById('controls').hidden,hud:document.getElementById('pcHud').hidden,state:__dbg.G.p[0].state,mv:__dbg.G.p[0].mname||'',x:Math.round(__dbg.G.p[0].x),y:Math.round(__dbg.G.p[0].y),ki:Math.round(__dbg.G.p[0].ki)}));
 console.log('PC inicio',JSON.stringify(await st()));await p.screenshot({path:SH+'pc_luta.png'});
 const x0=(await st()).x;await p.keyboard.down('KeyD');await p.waitForTimeout(500);await p.keyboard.up('KeyD');console.log('D anda',(await st()).x-x0);
 await p.keyboard.press('Space');await p.waitForTimeout(150);console.log('Espaço pula',JSON.stringify(await st()));await p.waitForTimeout(1200);
 await p.keyboard.press('KeyJ');await p.waitForTimeout(60);console.log('J',(await st()).state,(await st()).mv);await p.waitForTimeout(600);
 await p.mouse.click(640,360);await p.waitForTimeout(60);console.log('clique esq',(await st()).state,(await st()).mv);await p.waitForTimeout(600);
 await p.mouse.click(640,360,{button:'right'});await p.waitForTimeout(60);console.log('clique dir',(await st()).state,(await st()).mv);await p.waitForTimeout(600);
 await p.keyboard.down('ShiftLeft');await p.waitForTimeout(150);console.log('Shift',(await st()).state,await p.evaluate(()=>__dbg.G.p[0].guard));await p.keyboard.up('ShiftLeft');await p.waitForTimeout(300);
 await p.keyboard.down('KeyL');await p.waitForTimeout(900);const k1=(await st()).ki;await p.keyboard.up('KeyL');console.log('L segura ki',k1);await p.waitForTimeout(400);
 await p.evaluate(()=>{__dbg.G.p[0].ki=100});await p.keyboard.press('KeyQ');await p.waitForTimeout(80);console.log('Q especial',(await st()).state,(await st()).mv);await p.waitForTimeout(3500);
 await p.keyboard.press('F1');await p.waitForTimeout(400);console.log('F1 esconde',(await st()).hud);await p.keyboard.press('F1');await p.waitForTimeout(400);
 await p.keyboard.press('Escape');await p.waitForTimeout(400);console.log('Esc pausa',await p.evaluate(()=>__dbg.G.paused),'hud',(await st()).hud);await p.screenshot({path:SH+'pc_pausa.png'});
 console.log('botão',await p.evaluate(()=>document.getElementById('pcBtn2').textContent));
 // celular
 const m=await b.newPage({...devices['Pixel 7 landscape']});m.on('pageerror',e=>errs.push(e.message));await m.route(/fonts\.g|firestore/,r=>r.abort());await start(m);
 console.log('CELULAR',await m.evaluate(()=>JSON.stringify({controls:document.getElementById('controls').hidden,hud:document.getElementById('pcHud').hidden})));
 // trocar para teclado no celular
 await m.evaluate(()=>localStorage.setItem('ft_pc','1'));await m.waitForTimeout(500);console.log('celular forçado teclado',await m.evaluate(()=>document.getElementById('controls').hidden));
 console.log('erros',errs);await b.close()})();
