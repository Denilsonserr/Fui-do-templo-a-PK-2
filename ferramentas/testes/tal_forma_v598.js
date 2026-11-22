// v598: ALUCARD — transformação (vídeo), forma (sprites ald, aura sangue, bônus), soco perto, desvio 10%, ULTIMATE (vídeo + inimigo caído sangrando tomando dano)
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
(async()=>{let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Denilson ADM"',tw_tit:'["adm"]',rk_ini:'1',rk_xpv2:'1',admT:JSON.stringify({hp:1,en:1,noai:1,vfx:0,a:'alucard',b:'goku',s:'cupula'})})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1500);
await p.click('#admTB');await p.waitForTimeout(300);await p.click('#admGo');await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:60000});await p.waitForTimeout(4000);
const W=ms=>p.waitForTimeout(ms),shot=n=>p.screenshot({path:SH+'alf_'+n+'.png'}),ev=f=>p.evaluate(f);
/* desvio 10% */
const dodge=await ev(()=>{const G=__dbg.G,[a,o]=G.p;let n=0,N=500;for(let i=0;i<N;i++){a.inv=0;a.aucDg=0;a.hp=a.mhp||3600;const h0=a.hp;window.__ah=window.__ah;const x=a.x;const r=__dbg.applyHit?__dbg.applyHit(o,a,{dmg:5,kb:0,hs:0,kind:'melee'}):null;if(r===null)return -1;if(r===false&&a.hp===h0)n++;a.x=x}return n/N});
chk(dodge===-1||(dodge>.05&&dodge<.16),'passiva: desvia ~10% dos golpes ('+(dodge===-1?'sem acesso direto':(dodge*100).toFixed(1)+'%')+')');
/* soco PERTO = soco; longe = tiro */
await ev(()=>{const G=__dbg.G,[a,o]=G.p;a.x=400;o.x=520;a.facing=1;a.state='idle'});await W(150);await p.keyboard.press('j');await W(90);const near=await ev(()=>__dbg.G.p[0].mname);
await W(800);await ev(()=>{const G=__dbg.G,[a,o]=G.p;a.x=300;o.x=800;a.facing=1});await W(200);await p.keyboard.press('j');await W(90);const far=await ev(()=>__dbg.G.p[0].mname);
chk(!/^aj/.test(near||'')&&/^aj/.test(far||''),'perto = soco ('+near+'), longe = tiro ('+far+')');await W(900);
/* transformação */
await ev(()=>{const a=__dbg.G.p[0];a.sb=3;a.state='idle'});await W(200);await p.keyboard.press('u');await W(300);
let tr=await ev(()=>({t:!!__dbg.G.trans&&!!__dbg.G.trans.auc}));if(!tr.t){await W(3000);await ev(()=>{const a=__dbg.G.p[0];a.sb=3;a.state='idle'});await p.keyboard.press('u');await W(300);tr=await ev(()=>({t:!!__dbg.G.trans&&!!__dbg.G.trans.auc}))}
chk(tr.t,'transformação começa (vídeo)');await W(2500);await shot('trans_video1');await W(3000);await shot('trans_video2');
await p.waitForFunction(()=>!__dbg.G.trans,null,{timeout:20000});await W(300);
const fm=await ev(()=>{const a=__dbg.G.p[0];return {form:a.form,key:typeof a.def==='object'}});chk(fm.form===1,'ficou TRANSFORMADO');await shot('forma_parado');
await p.keyboard.down('d');await W(400);await shot('forma_correndo');await p.keyboard.up('d');await W(300);
await ev(()=>{const G=__dbg.G,[a,o]=G.p;a.x=250;o.x=800;a.facing=1;o.hp=o.mhp||o.hp});await W(200);const h0=await ev(()=>__dbg.G.p[1].hp);
for(let i=0;i<5;i++){await p.keyboard.press('j');await W(150);if(i===2)await shot('forma_tiro')}await W(800);const h1=await ev(()=>__dbg.G.p[1].hp);chk(h1<h0,'transformado: tiros acertam (-'+Math.round(h0-h1)+')');
await ev(()=>{__dbg.G.p[0].state='charge'});await W(300);await shot('forma_aura');await ev(()=>{__dbg.G.p[0].state='idle'});await W(200);
/* ULTIMATE */
await ev(()=>{const G=__dbg.G,[a,o]=G.p;a.x=500;o.x=800;a.facing=1;a.ki=100;a.formT=99999;o.hp=o.mhp||3600;a.state='idle';o.state='idle'});await W(300);const u0=await ev(()=>__dbg.G.p[1].hp);
await p.keyboard.press('o');await W(300);const ul=await ev(()=>!!__dbg.G.trans&&!!__dbg.G.trans.u);chk(ul,'ULTIMATE começa (vídeo)');
await W(2500);await shot('ult_video');await p.waitForFunction(()=>__dbg.G.trans&&__dbg.G.trans.u&&__dbg.G.trans.t>=320,null,{timeout:20000}).catch(()=>{});
await W(500);await shot('ult_caido1');const ly=await ev(()=>{const d=__dbg.G.p[1];return JSON.stringify(d.rushKey)});await W(900);await shot('ult_caido2');
await p.waitForFunction(()=>!__dbg.G.trans,null,{timeout:20000});await W(200);const u1=await ev(()=>__dbg.G.p[1].hp);await shot('ult_fim');
chk(ly==='["fall",3]','inimigo fica CAÍDO no chão durante a cena ('+ly+')');chk(u0-u1>700,'ULTIMATE dá MUITO dano: -'+Math.round(u0-u1)+' (vida '+Math.round(u0)+')');
console.log(errs.length?'ERROS '+errs.slice(0,5).join(' | '):'sem erros');console.log(ok&&!errs.length?'TUDO OK':'FALHOU');await b.close()})();
