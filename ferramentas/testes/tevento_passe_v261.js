const {chromium}=require('playwright');const S=process.env.S;const W='/home/claude/fui-do-templo-a-pk-2/www/';const fs=require('fs');
fs.writeFileSync(W+'_t.html',fs.readFileSync(W+'index.html','utf8').replace('window.__G=G;','window.__G=G;window.__v25=()=>({bpG,bpAdd,rkView,bpEvChest,BPEV,bpEvOn});'));
const IDS=new Set();
(async()=>{const b=await chromium.launch();const errs=[];
const pg=async(uid,rp)=>{const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g/,r=>r.abort());
 await p.route(/firestore\.googleapis\.com/,async r=>{const u=r.request().url();if(/:runQuery/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});const m=u.match(/documentId=([^&]+)/);if(m){if(IDS.has(m[1]))return r.fulfill({status:409,body:'{}'});IDS.add(m[1])}return r.fulfill({status:200,contentType:'application/json',body:'{}'})});
 await p.addInitScript(([u,rp])=>{const T=Date.UTC(2026,10,9,21,30)-Date.now(),_n=Date.now;Date.now=()=>_n()+T;if(!sessionStorage.d){sessionStorage.d=1;localStorage.clear();Object.assign(localStorage,{tw_nome:'"'+u+'"',tw_uid:'"'+u+'"',rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_rp:String(rp)})}},[uid,rp]);
 await p.goto('file://'+W+'_t.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});return p};
const A=await pg('a1',16000),B=await pg('b2',0);
console.log('on',await A.evaluate(()=>__v25().bpEvOn()));
await A.bringToFront();await A.waitForTimeout(2500);await A.click('#mRank');await A.waitForTimeout(1500);console.log('E',errs);await A.screenshot({path:S+'bpev_menu.png'});
await A.evaluate(()=>{const R=__v25();R.bpAdd('floor',10);R.bpAdd('bossW',3);R.bpAdd('fights',6);R.bpAdd('spin',10)});
await A.click('#rkWrap [data-a="bpMenu"]');await A.waitForTimeout(600);await A.click('#rkWrap [data-b="mis"]',{force:true});await A.waitForTimeout(500);await A.screenshot({path:S+'bpev_mis.png'});
for(let i=0;i<40;i++){const ok=await A.evaluate(()=>{const b=document.querySelector('#rkModal .bpMi button');if(b){b.click();return 1}return 0});if(!ok)break;await A.waitForTimeout(120)}
console.log('A xp',await A.evaluate(()=>{const o=__v25().bpG();return o.xp+' ec'+o.ec.length+' dc'+o.dc.length+' sc'+o.sc.length}));
// baú: forçar sorte
const force=p=>p.evaluate(async()=>{const r=Math.random;Math.random=()=>0.001;await __v25().bpEvChest();Math.random=r;return localStorage.rk_bpev_e1+' own '+__v25().bpG().own});
console.log('A chest',await force(A));console.log('B chest',await force(B));console.log('A again',await force(A));
await A.evaluate(()=>{document.getElementById('rkMX')&&document.getElementById('rkMX').click();__v25().rkView('bp')});await A.waitForTimeout(800);await A.screenshot({path:S+'bpev_bp.png'});
console.log(errs);await b.close();fs.unlinkSync(W+'_t.html')})();
