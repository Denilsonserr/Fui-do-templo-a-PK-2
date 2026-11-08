// v205: confere se os bônus (passivas, equipamentos, título ADM) entram MESMO na luta; moedas e loja
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:1.5});p.setDefaultTimeout(120000);const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_uid:'"meu"',tw_nome:'"Denilson ADM"',tw_tit:'["adm"]',tw_titOn:'"adm"',tw_ts203:'1',
  tw_inv:JSON.stringify([{id:'s',t:'esp',r:'epica',v:5},{id:'a',t:'arm',r:'rara',v:4},{id:'b',t:'bot',r:'lend',v:7}]),tw_eqp:JSON.stringify({esp:'s',arm:'a',bot:'b'}),tw_moedas:'150'})}});
await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#mTorre');await p.waitForTimeout(500);await p.click('.tile[data-c="garou"]');await p.click('#goStage');await p.waitForTimeout(1500);await p.screenshot({path:'/tmp/bf_painel.png'});
await p.click('#twGo');await p.waitForTimeout(1600);
await p.evaluate(()=>{__TW.pas={vida:65,dano:10,vel:13,trf:0}});
await p.click('#twGo');await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight');await p.waitForTimeout(300);
const r=await p.evaluate(async()=>{const G=__dbg.G,[a,o]=G.p;G.noAI=true;const F=n=>new Promise(r=>{const f0=G.frame;const c=()=>G.frame>=f0+n?r():requestAnimationFrame(c);c()});
  const hit=(x,y)=>{y.inv=0;y.state='idle';y.guard=false;const h0=y.hp;__dbg.applyHit(x,y,{dmg:100,kb:0,hs:2,kind:'melee',lock:1,px:y.x,py:y.y-150});const d=h0-y.hp;y.hp=h0;return d};
  const out={tdm:+a.tdm.toFixed(3),tsp:+a.tsp.toFixed(3),tdf:+a.tdf.toFixed(3),esperado:{tdm:+((1+15/100)*1.2).toFixed(3),tsp:+((1+20/100)*1.1).toFixed(3),tdf:+(1/(1+69/100)).toFixed(3)}};
  const t=a.tdm,dA=hit(a,o);a.tdm=1;const dA1=hit(a,o);a.tdm=t;out.danoDado=+(dA/dA1).toFixed(3);
  const df=a.tdf,dB=hit(o,a);a.tdf=1;const dB1=hit(o,a);a.tdf=df;out.danoRecebido=+(dB/dB1).toFixed(3);
  // velocidade: anda 30 quadros
  a.x=600;o.x=1500;a.state='idle';dispatchEvent(new KeyboardEvent('keydown',{code:'KeyD',bubbles:true}));await F(30);const x1=a.x;dispatchEvent(new KeyboardEvent('keyup',{code:'KeyD',bubbles:true}));await F(20);
  const ts=a.tsp;a.tsp=1;a.x=600;a.state='idle';dispatchEvent(new KeyboardEvent('keydown',{code:'KeyD',bubbles:true}));await F(30);const x2=a.x;dispatchEvent(new KeyboardEvent('keyup',{code:'KeyD',bubbles:true}));a.tsp=ts;out.velocidade=+((x1-600)/(x2-600)).toFixed(3);
  o.hp=50;G.timer=1;G.tf=59;return out});
console.log('BUFFS',JSON.stringify(r));
await p.waitForFunction(()=>__dbg.G.mode==='tower');await p.waitForSelector('#twModal .twAV');await p.waitForTimeout(1200);await p.screenshot({path:'/tmp/bf_av.png'});
console.log('MOEDAS',await p.evaluate(()=>localStorage.tw_moedas+' ganho='+__TW.coinGain));
await p.click('#twModal .avp[data-i="0"]');await p.waitForTimeout(2500);await p.click('#twShB');await p.waitForTimeout(600);await p.screenshot({path:'/tmp/bf_loja.png'});
await p.click('#twModal .shI[data-i="1"]');await p.waitForTimeout(500);await p.screenshot({path:'/tmp/bf_loja2.png'});
console.log('DEPOIS',await p.evaluate(()=>localStorage.tw_moedas+' pocoes='+localStorage.tw_poc));
console.log('ERROS',JSON.stringify(errs));await b.close()})();
