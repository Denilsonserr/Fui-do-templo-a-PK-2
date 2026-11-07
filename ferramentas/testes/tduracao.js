const {chromium}=require('playwright');
const CH=process.argv.slice(2);
(async()=>{const b=await chromium.launch();const out=[];
for(const c of CH){const p=await b.newPage({viewport:{width:915,height:412}});const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,150)));await p.route(/fonts\.g/,r=>r.abort());
await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.click('#goSelect');await p.waitForTimeout(500);await p.click(`.tile[data-c="${c}"]`);await p.click('.tile[data-c="denilson"]');
await p.click('#goStage');await p.waitForTimeout(300);await p.click('.stc[data-s="cupula"]');await p.click('#goFight');
await p.waitForFunction(()=>__dbg.G.mode==='fight'&&__dbg.G.phase==='fight',null,{timeout:120000});await p.waitForTimeout(1500);
const r=await p.evaluate(async()=>{const G=__dbg.G;G.noAI=true;G.timer=999;const F=n=>new Promise(r=>{const f0=G.frame;const c=()=>G.frame>=f0+n?r():requestAnimationFrame(c);c()});
 const K=(k,v)=>dispatchEvent(new KeyboardEvent(v?'keydown':'keyup',{code:{tr:'KeyU',sr:'KeyO'}[k],bubbles:true}));const tap=async k=>{K(k,1);await F(2);K(k,0)};
 const f=G.p[0],o=G.p[1];o.x=f.x+200;f.sb=6;await tap('tr');const t0=G.frame;let tr=0;if(G.trans){while(G.trans&&G.frame-t0<2000)await F(1);tr=G.frame-t0}
 await F(30);f.form=f.form||1;f.formT=5000;f.ki=100;f.spark=600;f.sb=6;f.state='idle';o.hp=o.hpLag=9999;o.state='idle';o.x=f.x+200;await F(5);await tap('sr');const u0=G.frame;let ul=0;await F(3);if(G.ws||G.sr||G.sc){while((G.ws||G.sr||G.sc)&&G.frame-u0<3000)await F(1);ul=G.frame-u0}
 return [+(tr/60).toFixed(1),+(ul/60).toFixed(1)]});
out.push([c,...r,errs]);console.log(JSON.stringify([c,...r,errs]));await p.close()}
await b.close()})();
