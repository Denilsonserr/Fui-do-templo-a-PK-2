// v602: ALUCARD — TODO tiro sai com a arma APONTADA (conta tiros com/sem arma) em combos, Ki, chutes com arma, normal e transformado, e na ULTIMATE
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
(async()=>{let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Denilson ADM"',tw_tit:'["adm"]',rk_ini:'1',rk_xpv2:'1',ft_q:'3',admT:JSON.stringify({hp:1,en:1,noai:1,vfx:0,a:'alucard',b:'goku',s:'cupula'})})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1500);
await p.click('#admTB');await p.waitForTimeout(300);await p.click('#admGo');await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:60000});await p.waitForTimeout(4000);
const W=ms=>p.waitForTimeout(ms),ev=f=>p.evaluate(f);
for(const fm of [0,1]){
  await ev(fm=>{const G=__dbg.G,[a,o]=G.p;a.x=300;o.x=850;a.facing=1;a.form=fm;a.formT=99999;a.state='idle';o.hp=o.mhp||3600},fm);await W(300);
  for(let r=0;r<2;r++){for(let i=0;i<5;i++){await p.keyboard.press('j');await W(150)}await W(900);await ev(()=>{const G=__dbg.G,[a,o]=G.p;a.x=300;o.x=850;o.hp=o.mhp||3600})}
  await ev(()=>{__dbg.G.p[0].ki=100});await p.keyboard.press('l');await W(1200);
  await p.keyboard.down('s');await p.keyboard.press('k');await p.keyboard.up('s');await W(900);
}
const st=await ev(()=>__aucT.n());chk(st.arma>=20&&st.semArma===0,'tiros com a arma apontada: '+st.arma+' | sem arma: '+st.semArma);
console.log(errs.length?'ERROS '+errs.slice(0,5).join(' | '):'sem erros');console.log(ok&&!errs.length?'TUDO OK':'FALHOU');await b.close()})();
