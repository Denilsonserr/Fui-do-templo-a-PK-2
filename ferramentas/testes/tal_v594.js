// v594: ALUCARD etapa 1 — só no modo teste do ADM: parado, andando, socos+tiros, chutes, Ki (3 tiros de longe), SUPER COMBO, aura vermelha
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
(async()=>{let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
const b=await chromium.launch();const errs=[];
const run=async(adm)=>{const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:1});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(a=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:a?'"Denilson ADM"':'"Bia"',tw_tit:a?'["adm"]':'[]',rk_ini:'1',rk_xpv2:'1',admT:JSON.stringify({hp:1,en:1,noai:1,vfx:0,a:'alucard',b:'goku',s:'cupula'})})}},adm);
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1500);return p};
let p=await run(0);const nb=await p.evaluate(()=>!!document.getElementById('admTB')&&getComputedStyle(document.getElementById('admTB')).display!=='none');const inAll=await p.evaluate(()=>typeof ALLC!=='undefined'&&ALLC.includes('alucard'));chk(!nb,'jogador comum não vê o botão TESTE');await p.close();
p=await run(1);
await p.click('#admTB');await p.waitForTimeout(300);const opt=await p.evaluate(()=>[...document.querySelectorAll('#admA option')].some(o=>o.value==='alucard'));chk(opt,'ADM: Alucard aparece no painel 🧪 TESTE');await p.click('#admGo');
await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:60000});await p.waitForTimeout(1200);
const W=ms=>p.waitForTimeout(ms),shot=n=>p.screenshot({path:SH+'al_'+n+'.png'});
const st=()=>p.evaluate(()=>{const a=__dbg.G.p[0];return {id:a.def.id,state:a.state,mv:a.mname||null}});
await shot('parado');const s0=await st();chk(s0.id==='alucard','lutando com o Alucard');
await p.keyboard.down('d');await W(500);await shot('andando');await p.keyboard.up('d');await W(300);
await p.evaluate(()=>{const G=__dbg.G,[a,o]=G.p;o.x=a.x+a.facing*190});
const hp0=await p.evaluate(()=>__dbg.G.p[1].hp);const seq=[];for(const k of ['j','j','j','j','j']){await p.keyboard.press(k);await W(130);seq.push((await st()).mv);if(seq.length===3)await shot('tiro_combo')}
await W(900);const hp1=await p.evaluate(()=>__dbg.G.p[1].hp);chk(hp1<hp0,'socos/tiros do combo acertam ('+seq.join(',')+')');
await p.keyboard.press('k');await W(160);await shot('chute');await W(900);
/* Ki = 3 tiros de LONGE */
await p.evaluate(()=>{const G=__dbg.G,[a,o]=G.p;a.x=200;o.x=760;a.facing=1;o.hp=o.mhp||o.hp;a.ki=100});await W(200);const h0=await p.evaluate(()=>__dbg.G.p[1].hp);
await p.keyboard.press('l');await W(160);await shot('ki_tiros');await W(900);const h1=await p.evaluate(()=>__dbg.G.p[1].hp);chk(h1<h0,'Ki: tiros acertam de longe (560 px): -'+Math.round(h0-h1)+' de vida');
await p.evaluate(()=>{const G=__dbg.G,[a,o]=G.p;o.x=a.x+a.facing*190;a.ki=100});await W(300);
const c0=await p.evaluate(()=>__dbg.G.p[1].hp);await p.keyboard.press('i');await W(700);await shot('super_combo');const cmb=await st();await W(1400);await shot('super_combo2');await W(2200);const c1=await p.evaluate(()=>__dbg.G.p[1].hp);
chk(cmb.state==='ytc','botão de combo = SUPER COMBO');chk(c1<c0,'SUPER COMBO causa dano: -'+Math.round(c0-c1));
await p.keyboard.press('u');await W(400);const tr=await p.evaluate(()=>({form:__dbg.G.p[0].form,trans:!!__dbg.G.trans}));chk(!tr.form&&!tr.trans,'transformação = EM BREVE');
await p.keyboard.press('Space');await W(250);await shot('pulo');
await p.evaluate(()=>{__dbg.G.p[0].state='charge'});await W(300);await shot('aura');
console.log(errs.length?'ERROS '+errs.slice(0,5).join(' | '):'sem erros');console.log(ok&&!errs.length?'TUDO OK':'FALHOU');await b.close()})();
