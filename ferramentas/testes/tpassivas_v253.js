const {chromium}=require('playwright');const S=process.env.S;const W='/home/claude/fui-do-templo-a-pk-2/www/';const fs=require('fs');
fs.writeFileSync(W+'_t.html',fs.readFileSync(W+'index.html','utf8').replace('window.__G=G;','window.__G=G;window.__v25=()=>({psRoll,psSum,psDef,PSV,psG,psS,rkView});'));
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"T"',rk_ini:'1',rk_xpv2:'1',rk_own:'["goku","yuta","naruto"]',rk_sel:'"yuta"',rk_rp:'16000',rk_dia:'1',rk_ps:JSON.stringify({jn:60}),
 tw_inv:JSON.stringify([{id:'e1',t:'esp',r:'lend',v:7},{id:'e2',t:'esp',r:'comum',v:1},{id:'e3',t:'esp',r:'comum',v:1},{id:'c1',t:'cap',r:'mit',v:10,crit:5},{id:'a1',t:'arm',r:'rara',v:4}]),tw_eqp:'{"esp":"e1","cap":"c1","arm":"a1"}'})}});
await p.goto('file://'+W+'_t.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
// probabilidades
console.log('dist',await p.evaluate(()=>{const R=__v25(),c={};const N=200000;for(let i=0;i<N;i++){const o={pl:0,pm:0};const r=R.psRoll(o);c[r.r]=(c[r.r]||0)+1}for(const k in c)c[k]=(100*c[k]/N).toFixed(2);return JSON.stringify(c)}));
console.log('pity',await p.evaluate(()=>{const R=__v25();let ok1=1,ok2=1;for(let i=0;i<5000;i++){const a=R.psRoll({pl:50,pm:0});if(!['lend','mit','sec'].includes(a.r))ok1=0;const b=R.psRoll({pl:0,pm:200});if(!['mit','sec'].includes(b.r))ok2=0}
  const o={pl:0,pm:0};let n=0;for(let i=0;i<100000;i++){R.psRoll(o);if(o.pl>50)n++}return 'lend+ garantida:'+ok1+' mit+ garantida:'+ok2+' passou de 50:'+n}));
await p.click('#mRank');await p.waitForTimeout(500);await p.click('#rkWrap [data-a="boss"]');await p.waitForTimeout(700);await p.click('#rkWrap [data-a="equip"]');await p.waitForTimeout(700);
await p.click('#psGo');await p.waitForTimeout(900);await p.screenshot({path:S+'ps1.png'});
await p.click('#rkWrap .psCell[data-id="e1"]');await p.waitForTimeout(400);
await p.click('#rkWrap [data-p="spin"]',{force:true});await p.waitForTimeout(600);await p.screenshot({path:S+'ps_anim.png'});await p.waitForTimeout(3500);await p.screenshot({path:S+'ps2.png'});
console.log('pend',await p.evaluate(()=>localStorage.rk_ps));
await p.click('#rkWrap [data-p="tg"][data-k="cap"]',{force:true});await p.waitForTimeout(300);console.log('blocked',await p.evaluate(()=>document.querySelector('#rkToast').textContent));
await p.click('#rkWrap [data-p="apply"]',{force:true});await p.waitForTimeout(500);
console.log('after',await p.evaluate(()=>localStorage.rk_ps+' | '+JSON.stringify(JSON.parse(localStorage.tw_inv).find(x=>x.id==='e1'))));
// passivas para teste de efeitos: personagem yuta secreto drop, itens: esp lend cd, cap sec def, arm mit spd
await p.evaluate(()=>{const R=__v25();const o=R.psG();o.ch.yuta={r:'sec',i:3};o.pend=null;R.psS(o);const I=JSON.parse(localStorage.tw_inv);I.find(x=>x.id==='e1').ps={r:'sec',i:0};I.find(x=>x.id==='c1').ps={r:'sec',i:1};I.find(x=>x.id==='a1').ps={r:'mit',i:1};localStorage.tw_inv=JSON.stringify(I)});
console.log('sum',await p.evaluate(()=>JSON.stringify(__v25().psSum('yuta'))));
await p.evaluate(()=>__v25().rkView('ps'));await p.waitForTimeout(600);await p.screenshot({path:S+'ps3.png'});
await p.evaluate(()=>__v25().rkView('boss'));await p.waitForTimeout(500);await p.click('#rkWrap [data-a="equip"]');await p.waitForTimeout(1200);await p.screenshot({path:S+'ps_eq.png'});
console.log(await p.evaluate(()=>[...document.querySelectorAll('#rkModal button')].map(b=>b.textContent).filter(t=>/AURA|ENCANTAR/.test(t)).join(' | ')));
await p.evaluate(()=>document.getElementById('rkMX').click());await p.waitForTimeout(300);
await p.evaluate(()=>__v25().rkView('boss'));await p.waitForTimeout(600);await p.click('#rkWrap [data-a="start"]');await p.waitForTimeout(600);await p.click('#rkWrap [data-a="fight"]',{force:true});await p.waitForFunction(()=>__G.mode==='fight'&&__G.phase==='fight',null,{timeout:120000});
const st=await p.evaluate(()=>{const q=__G.p[0];return {tcd:q.tcd,tdf:q.tdf,pspd:q.pspd,preg:q.preg,energy:q.def.energy,hp:q.hp,mhp:q.mhp,mode:__G.mode}});console.log('fight',JSON.stringify(st));
await p.evaluate(()=>{const q=__G.p[0];q.hp=q.hp*.5;q._lhp=q.hp;q.pregT=__G.frame;__G.p[1].x=__G.p[0].x+2500;__G.p[1].frozen=1});for(let i=0;i<14;i++){await p.evaluate(()=>{__G.p[1].x=__G.p[0].x+2500;__G.p[1].stun=999});await p.waitForTimeout(500)}
console.log('regen',await p.evaluate(()=>{const q=__G.p[0];return q.hp.toFixed(0)+' tot '+(q.pregTot||0).toFixed(0)}));
await p.screenshot({path:S+'ps_fight.png'});
console.log(errs);await b.close();fs.unlinkSync(W+'_t.html')})();
