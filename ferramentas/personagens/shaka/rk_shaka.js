
/* ================= v280: SHAKA — Invocação ILIMITADA (3ª aba, no lugar da do Madara) + nível 70 =================
   Abre 10/11/2026 12:45 (Brasília) e fica 7 dias. 70 💎 / 700 💎 (aceita tickets), Shaka 0,35% garantido em 170 (rk_pityS),
   itens secretos do Shaka 0,25% garantido em 220 (rk_pitySS, nunca repetido). */
const SKG0=Date.UTC(2026,10,10,15,45),SKG1=SKG0+7*864e5;
const skgOpen=()=>{const n=Date.now();return n>=SKG0&&n<SKG1},skgHHMM=()=>'12:45';
const skOwned=()=>rkG('own',[]).includes('shaka');const SKSEC=['skcap','skarm','skluv','skbot','skros'];
const skSecLeft=()=>{const I=twInv();return SKSEC.filter(k=>!I.some(x=>x.nm===RKSP[k].nm))};
function rkRollS(){
  if(!skOwned()&&!RKMTMP.includes('shaka')){const p=rkG('pityS',0)+1;if(p>=170||Math.random()*100<.35){rkS('pityS',0);RKMTMP.push('shaka');return {k:'chr',r:'mit',id:'shaka'}}rkS('pityS',p)}
  {const L=skSecLeft().filter(k=>!RKMTMP.includes(k));if(L.length){const p=rkG('pitySS',0)+1;if(p>=220||Math.random()*100<.25){rkS('pitySS',0);const s=L[(Math.random()*L.length)|0];RKMTMP.push(s);return {k:'sp',r:'sec',s}}rkS('pitySS',p)}}
  if(Math.random()*100<30){let q=Math.random()*100,R='comum';for(const [k,w] of RKEQW){if((q-=w)<0){R=k;break}}return {k:'eq',r:R,E:TWEQ[(Math.random()*TWEQ.length)|0]}}
  return {k:'red',r:'comum',n:1+((Math.random()*5)|0)}}
{const _r=rkRoll;rkRoll=function(){return RKBAN==='sk'?rkRollS():_r()}}
{const _c=rkCost;rkCost=function(n){if(RKBAN!=='sk')return _c(n);const t=Math.min(n,rkG('tic',0)|0);return {t,g:n===1?(t?0:70):(n-t)*70}}}
{const _sm=rkSummon;rkSummon=function(n){if(RKBAN==='sk'&&!skgOpen()){rkSfx('clang');return rkToast(Date.now()<SKG0?'🔒 A Invocação do Shaka abre hoje às '+skgHHMM()+' (Brasília)':'A Invocação Ilimitada do Shaka acabou','#ffd84a')}return _sm.apply(this,arguments)}}
{const _tx=rkTaxas;rkTaxas=function(){if(RKBAN!=='sk')return _tx();rkModal(`<div class="twM"><h3>% TAXAS · INVOCAÇÃO ILIMITADA · SHAKA</h3><table class="rkTx"><tr><th>Resultado</th><th>Chance</th></tr>
  <tr><td style="color:#ffd84a">✦ SECRETO: SHAKA DE VIRGEM · garantido em 170 giros</td><td>0,35%</td></tr><tr><td style="color:#fff3b0">✦ SECRETO: Elmo, Armadura, Luvas, Botas ou Rosário do Shaka · garantido em 220 giros · nunca repetido</td><td>0,25%</td></tr>
  <tr><td>Equipamento</td><td>30%</td></tr><tr><td style="color:#ff5a5a">Moeda Vermelha (1 a 5)</td><td>69,4%</td></tr></table>
  <p class="twH">70 💎 por giro (10 giros = 700 💎) · 1 ticket = 1 giro. Fica 7 dias: depois não dá mais para pegar.<br>Itens do Shaka: 100% no Shaka (+10% com o set completo), 50% em outros personagens.</p><div class="row"><button class="btn" id="rkMX">FECHAR</button></div></div>`);$('rkMX').onclick=()=>rkModal(null)}}
function rkMegaS(){return new Promise(res=>{const O=document.createElement('div');O.className='rkMega skm';O.innerHTML='<i class="rays"></i><i class="fl"></i><i class="ring"></i><div class="tx"><small>✦ ✦ ✦ ✦ ✦ ✦</small><b>SORTE</b><b>SECRETA!</b><span>O SHAKA DE VIRGEM APARECEU!</span></div>';rkHost().appendChild(O);
  rkSfx('boom');setTimeout(()=>rkSfx('powerUp'),400);setTimeout(()=>rkSfx('boom'),900);setTimeout(()=>rkSfx('powerUp'),1500);setTimeout(()=>rkSfx('boom'),2200);let d=0;const end=()=>{if(d)return;d=1;O.classList.add('out');setTimeout(()=>{O.remove();res()},400)};setTimeout(end,3600);setTimeout(()=>{O.onclick=end},900)})}
function skgLeft(){const n=Date.now();if(n<SKG0)return 'ABRE ÀS '+skgHHMM();if(n>=SKG1)return 'ENCERRADA';const m=Math.floor((SKG1-n)/6e4);return 'TERMINA EM '+Math.floor(m/1440)+'d '+Math.floor(m%1440/60)+'h'}
{const _gh=rkGachaH;rkGachaH=function(){
  if(RKBAN!=='sk'){let h=_gh.apply(this,arguments);
    h=h.replace(`<button class="hs lk dim" data-a="lock" style="${rkB(15,402,380,518)}">${RKLOCK}</button>`,`<button class="hs skTab" data-a="ban" data-b="sk" style="${rkB(15,402,380,518)}"><img src="${IMG.shaka?IMG.shaka.src:''}" alt=""><span>Invocação<br><b>Ilimitada</b></span><em>${skgLeft()}</em></button>`);
    h=h.replace('<button class="lk" data-a="lock"><i>🔒</i>Invocação<br>Padrão</button>',`<button class="skT" data-a="ban" data-b="sk"><i>✦</i>Invocação<br>Ilimitada<em>SHAKA</em></button>`);return h}
  const own=skOwned(),pS=rkG('pityS',0),pI=rkG('pitySS',0),sl=skSecLeft().length,op=skgOpen();
  return `<button class="hs" data-a="back" style="${rkB(15,10,130,85)}"></button><button class="hs" data-a="home" style="${rkB(1740,10,1840,85)}"></button>
  <div class="rkNum" style="${rkB(1240,22,1360,62)}">${rkFmtN(rkG('gem',0))}</div><button class="hs" data-a="shop" style="${rkB(1365,18,1418,68)}"></button>
  <div class="rkNum" style="${rkB(1530,22,1650,62)}">${rkFmtN(rkG('tic',0))}</div><button class="hs" data-a="lock" style="${rkB(1655,18,1710,68)}"></button>
  <button class="hs" data-a="ban" data-b="mit" style="${rkB(15,120,390,255)}"></button><button class="hs" data-a="ban" data-b="esp" style="${rkB(15,268,380,392)}"></button><button class="hs on skOn" data-a="ban" data-b="sk" style="${rkB(15,405,385,525)}"></button>
  <div class="ytTaxa skTaxa" style="${rkB(1312,470,1832,615)}"><i class="g"></i><i class="s"><s></s><s></s><s></s><s></s><s></s></i></div><i class="skLotus" style="${rkB(860,560,1140,720)}"></i>
  <div class="skLeft ${op?'':'off'}" style="${rkB(420,250,880,300)}">${op?'⏳ ':'🔒 '}${skgLeft()}</div>
  <button class="hs" data-a="shop" style="${rkB(40,700,125,800)}"></button><button class="hs" data-a="hist" style="${rkB(165,700,265,800)}"></button><button class="hs" data-a="taxas" style="${rkB(300,700,390,800)}"></button>
  <button class="hs ${op?'':'skNo'}" data-a="sum1" style="${rkB(540,690,985,805)}"><span class="shine"></span></button><button class="hs ${op?'':'skNo'}" data-a="sum10" style="${rkB(1030,690,1480,805)}"><span class="shine"></span></button>${(()=>{const c1=rkCost(1),c10=rkCost(10);return (c1.t?`<div class="rkTk" style="${rkB(600,655,925,688)}">🎫 usa 1 ticket (não gasta 💎)</div>`:'')+(c10.t?`<div class="rkTk" style="${rkB(1060,655,1445,688)}">🎫 usa ${c10.t} ticket${c10.t>1?'s':''}${c10.g?' + '+c10.g+' 💎':' (não gasta 💎)'}</div>`:'')})()}
  ${own?`<div class="ytOwn skOwn" style="${rkB(420,610,860,660)}">✔ VOCÊ JÁ TEM O SHAKA</div>`:''}
  <div class="rkPity" style="${rkB(540,812,1480,845)}">${own?'':`<span style="color:#ffd84a">✦ Shaka em <b>${170-pS}</b></span> · `}${sl?`✦ Item secreto em <b>${220-pI}</b> · `:''}🎟️ 1 ticket = 1 giro · 🟣 +pó</div>`}}
{const _bg=rkView;rkView=function(v){const r=_bg.apply(this,arguments);if(v==='gacha'&&RKBAN==='sk'){const A=document.querySelector('#rkWrap .rkA');if(A)A.style.backgroundImage=`url(${RQA.gacha_sk})`}return r}}
function lvX(){const id=LVC.id,L=lvOf(id);rkModal(`<div class="twM lvXm"><h3>✦ HABILIDADES SECRETAS DO SHAKA</h3><p class="twH">Só o Shaka passa do nível 50. Escolha 1 bônus em cada linha (cristal MÍTICO).</p>
  ${[6,7].map(r=>`<div class="lvXr"><b>NÍVEL ${LVROW[r]}${L.lv<LVROW[r]?' 🔒':''}</b>${LVTREE[r].map(([k,v],ci)=>`<button class="lvNd ${L.lv>=LVROW[r]?'on':'lk'} ${L.t[r]===ci?'sel':''}" data-r="${r}" data-c="${ci}" style="--c:#ffd84a"><i>${LVSTAT[k].i}</i><b>+${v}%</b><small>${LVSTAT[k].n}</small></button>`).join('')}</div>`).join('')}
  <p class="twH">Custo: nível 60 = 3 cristais míticos · nível 70 = 4 cristais míticos.</p><div class="row"><button class="btn" id="rkMX">FECHAR</button></div></div>`);
  $('rkMX').onclick=()=>rkModal(null);document.querySelectorAll('#rkModal .lvXr .lvNd').forEach(b=>b.onclick=()=>lvNode(+b.dataset.r,+b.dataset.c))}
