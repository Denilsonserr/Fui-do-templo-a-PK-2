// v473: fim da sala sem golpe infinito; Igris (passivas, auto combo, lâmina) e fim do portal no Igris; tela VERSUS com o portal; portais "em breve"
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const E=[];p.on('pageerror',e=>E.push(e.message));
await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"Denilson ADM"',tw_tit:'["adm"]',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',rk_rs463:'1',rk_rs464:'1',rk_rs464b:'1',rk_own:'["goku","sung"]',rk_sel:'"sung"',rk_sjs:JSON.stringify({cls:'necro',lv:30}),rk_dl:JSON.stringify({d:new Date(Date.now()-3*3600e3).toISOString().slice(0,10),s:0})})}});
await p.goto('http://localhost:8790/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mRank');await p.waitForTimeout(2000);const clr=()=>p.evaluate(()=>{const M=document.getElementById('rkModal');if(M){M.hidden=true;M.innerHTML=''};document.querySelectorAll('#lvrzM,#acM').forEach(x=>x.remove())});await clr();
/* tela dos portais num horário de busca */
const tb=await p.evaluate(()=>{let t=Date.now();for(let k=0;k<300;k++){if(__pt.now(t).st==='busca')return t;t+=30000}return 0});
await p.clock.install({time:tb+2000});await p.evaluate(()=>document.querySelector('[data-a="portais"]').click());await p.waitForTimeout(1200);await clr();await p.screenshot({path:'/tmp/pt_busca.png'});
const busca=await p.evaluate(()=>document.querySelectorAll('.ptSoon').length);await p.clock.resume();
await p.evaluate(()=>__pt.start({r:5,id:'teste'}));await p.waitForTimeout(1600);await p.screenshot({path:'/tmp/pt_vs.png'});
await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await p.waitForTimeout(800);
/* limpa a sala e anda: vida não pode cair */
await p.evaluate(()=>{const G=__dbg.G,H=__pt.HY();const o=G.p[1];o.hp=0;__pvT.ko(G.p[0],o)});
for(let k=0;k<30;k++){const g=await p.evaluate(()=>{const G=__dbg.G,H=__pt.HY();if(H.gate)return 1;const o=G.p[1];if(o&&!o.ko&&!o.hyIdle){o.hp=0;__pvT.ko(G.p[0],o)}for(const m of H.mobs.slice())if(!m.ko){m.hp=0;__pvT.ko(G.p[0],m)}return 0});if(g)break;await p.waitForTimeout(300)}
const hp0=await p.evaluate(()=>__dbg.G.p[0].hp);await p.keyboard.down('d');await p.waitForTimeout(1500);const face=await p.evaluate(()=>__dbg.G.p[0].facing);await p.keyboard.up('d');
await p.waitForTimeout(800);const hp1=await p.evaluate(()=>__dbg.G.p[0].hp);
/* sala 10: Igris */
await p.evaluate(()=>{__pt.R().room=9});await p.evaluate(()=>__pt.next());await p.waitForTimeout(2500);await p.evaluate(()=>{const P=__dbg.G.p[0];P.inv=0;P.hp=P.mhp=99999999});
const st=[];for(let k=0;k<24;k++){await p.waitForTimeout(250);st.push(await p.evaluate(()=>{const o=__dbg.G.p[1];return o.pn&&o.pn.atk?o.pn.atk.a.replace('ig_',''):o.state}))}
await p.screenshot({path:'/tmp/pt_igris2.png'});
const ig=await p.evaluate(()=>{const o=__dbg.G.p[1];return {nome:o.def.name,pas:o.pn&&o.pn.pas,sc:o.bSc}});
await p.evaluate(()=>{const G=__dbg.G,o=G.p[1];o.hp=0;__pvT.ko(G.p[0],o)});await p.waitForTimeout(9000);
const fim=await p.evaluate(()=>{const M=document.getElementById('lvrzM');return M?M.innerText.replace(/\s+/g,' ').slice(0,120):(document.getElementById('pnSh')?'sombra':'?')});await p.screenshot({path:'/tmp/pt_fim2.png'});
const seq=[];for(const x of st)if(seq[seq.length-1]!==x)seq.push(x);
console.log(JSON.stringify({busca,hpAntes:Math.round(hp0),hpDepois:Math.round(hp1),olhando:face,igris:ig,acoes:seq.join('>'),fim}),E.slice(0,4));await b.close()})();
