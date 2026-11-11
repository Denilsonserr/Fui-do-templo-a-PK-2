const {chromium}=require('playwright');
const SET=[{id:'a',t:'anel',r:'sec',v:0,dmg:45,vel:70,nm:'LUVAS DE VIRGEM',sk:1,st:75},{id:'b',t:'cap',r:'sec',v:0,def:90,crit:60,nm:'ELMO DE VIRGEM',sk:1,st:20},{id:'c',t:'esp',r:'sec',v:0,st:70,drop:40,nm:'ROSÁRIO DE SHAKA',sk:1},{id:'d',t:'bot',r:'sec',v:50,dmg:40,nm:'BOTAS DE VIRGEM',sk:1},{id:'e',t:'arm',r:'sec',v:0,dmg:60,crit:45,nm:'ARMADURA DE VIRGEM',sk:1}];
const EQ={anel:'a',cap:'b',esp:'c',bot:'d',arm:'e'};
const P={
 adm:{tw_nome:'"Denilson ADM"',tw_tit:'["adm","sk2"]',tw_titOn:'"adm"',ps:{shaka:{r:'sec',i:5}},sp:[[1,7,'drop',30],[1,6,'drop',22],[1,6,'dano',22],[4,5,'drop',110],[4,0,'drop',25],[3,5,'dano',55],[4,6,'vel',150]],lv:{lv:70,c:["0-0","0-1","0-2","0-3","0-4","0-5","0-6","0-7","0-8","3-0","3-1","3-2","3-3","3-4","3-5","3-9","3-10","3-11","4-0","4-1","4-2","4-3","4-4","4-5","4-9","4-10","4-11","0-9","0-10","0-11","3-6","3-7","3-8","4-6","4-7","4-8","1-0","1-1","1-2"]},rp:109337},
 vini:{tw_nome:'"Vini_junior10"',tw_tit:'["sk2"]',tw_titOn:'"sk2"',ps:{shaka:{r:'mit',i:0}},sp:[[3,2,'crit',25],[1,6,'st',22],[1,6,'st',22],[2,7,'dano',55],[3,7,'crit',100],[3,1,'st',18],[2,7,'st',55]],lv:{lv:49,c:["3-0","0-0","0-1","0-2","0-3","3-1","3-2","3-3","3-4","3-5","0-4","0-5","0-9","0-10","0-11","3-6","3-7","3-8","3-9","3-10","3-11","0-6","0-7","0-8","4-0","4-1","4-2","4-3"]},rp:226021},
 zeus:{tw_nome:'"ZEUS_DARKBR"',tw_tit:'["rk10"]',tw_titOn:'"rk10"',ps:{shaka:{r:'lend',i:4}},sp:[[1,7,'vel',30],[0,7,'drop',15],[1,6,'dano',22],[2,5,'dano',30],[1,7,'crit',30],[1,6,'uv',22],[1,7,'uv',30]],lv:{lv:1,c:[]},rp:216507}};
(async()=>{const b=await chromium.launch();
for(const k in P){const X=P[k],an=X.sp.map((r,i)=>({i:'r'+i,c:r[0],g:r[1],s:r[2],v:r[3]}));
  const ls={rk_ini:'1',rk_xpv2:'1',rk_dia:'1',rk_lvrz:'1',tw_nome:X.tw_nome,tw_tit:X.tw_tit,tw_titOn:X.tw_titOn,rk_own:'["shaka"]',rk_sel:'"shaka"',rk_rp:String(X.rp),tw_inv:JSON.stringify(SET),tw_eqp:JSON.stringify(EQ),rk_an:JSON.stringify(an),rk_anEq:JSON.stringify({shaka:an.map(r=>r.i)}),rk_ps:JSON.stringify({jn:0,ch:X.ps}),rk_lv:JSON.stringify({shaka:X.lv})};
  const p=await b.newPage();await p.route(/fonts\.g|firestore|googleapis|workers\.dev\/fs/,r=>r.abort());await p.addInitScript(i=>{localStorage.clear();Object.assign(localStorage,i)},ls);
  await p.goto('file:///home/claude/fui-do-templo-a-pk-2/www/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});await p.click('#mRank');await p.waitForTimeout(2500);
  console.log(k,await p.evaluate(()=>{const d=__pvT.dl('shaka'),s=__pvT.cs('shaka');return JSON.stringify({atk:s.atk,def:s.def,spd:s.spd,tdm:+d.tdm.toFixed(2),tdf:+d.tdf.toFixed(3),tsp:+(+d.tsp).toFixed(2),tcr:+d.tcr.toFixed(1),tcd:d.tcd})}));await p.close()}
await b.close()})();
