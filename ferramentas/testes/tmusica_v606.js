// v606: músicas do Alucard no menu/invocação, música ALEATÓRIA em toda batalha, vídeo da transformação no giro do Alucard
const {chromium}=require('playwright');const SH=process.env.SH||'/tmp/';
(async()=>{let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};const E=[];const b=await chromium.launch();
const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>E.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());await p.clock.install({time:Date.UTC(2026,10,22,16,5)});
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{rk_ini:'1',rk_xpv2:'1',tw_nome:'"Bia"',rk_own:'["goku"]',rk_gem:'100000',rk_tic:'0',rk_ban:'al',rk_mus:'"3"'})}});
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.waitForTimeout(1500);
await p.click('#mRank');await p.waitForTimeout(1500);const src=await p.evaluate(()=>document.querySelector('audio')?[...document.querySelectorAll('audio')].map(a=>a.src).join(' '):'');
const mel=await p.evaluate(()=>{for(const a of document.querySelectorAll('audio'))if(/b9dc4444173b21|11ae0f46904639/.test(a.src))return a.src;return null});
const mu=await p.evaluate(()=>__dbg.mus());chk(/b9dc4444173b21|11ae0f46904639/.test(mu[1]),'menu toca música do Alucard ('+mu[1]+')');
const picks=await p.evaluate(()=>{const R=[];for(let i=0;i<30;i++)R.push(__pvT.musPick());return {R,n:__pvT.musN()}});
const dif=new Set(picks.R).size,rep=picks.R.some((v,i)=>i&&v===picks.R[i-1]);chk(dif>=10&&!rep,'batalha: música aleatória a cada luta mesmo com uma escolhida ('+dif+' diferentes em 30, de '+picks.n+'; nunca repete a anterior)');
await p.evaluate(()=>{const m=document.getElementById('rkModal');if(m)m.innerHTML='';document.querySelector('#rkWrap [data-a="gacha"]').click()});await p.waitForTimeout(800);
await p.evaluate(()=>document.querySelector('#rkWrap [data-a="sum1"]').click());await p.waitForTimeout(1500);
const v=await p.evaluate(()=>{const v=document.querySelector('.alFx video');return v?{src:v.src,t:v.currentTime,w:v.videoWidth}:null});chk(v&&/6060fac432c798/.test(v.src),'giro do Alucard passa o vídeo da transformação ('+(v?v.w+'px':'-')+')');
await p.screenshot({path:SH+'giro_alucard.png'});
console.log(E.length?'ERROS '+E.slice(0,5).join(' | '):'sem erros');console.log(ok&&!E.length?'TUDO OK':'FALHOU');await b.close()})();
