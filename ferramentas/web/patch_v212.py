import sys
# v212: código de uso único que dá BAÚS (2 lendários) — abre os baús na hora
P=sys.argv[1];s=open(P).read()
def rep(a,b,n=1):
    global s;c=s.count(a);assert c==n,(a[:80],c);s=s.replace(a,b)
rep("const TWCUP={'1polqg8':{","const TWCUP={'706xst':{nm:'2 BAÚS LENDÁRIOS',bau:{r:'lend',n:2}},'1polqg8':{")
rep("used[h]=1;twLS.s('tw_cup',used);const I=twInv(),Q=twEqp();",
    "used[h]=1;twLS.s('tw_cup',used);if(C.bau){E.className='twH ok';E.textContent='🎁 Código aceito! '+C.nm+'!';twSfx('powerUp');setTimeout(()=>twBauOpen(C.bau),900);return true}const I=twInv(),Q=twEqp();")
rep("function twAdmBuff(){",r"""function twBauOpen(B){const ri=TWRK.indexOf(B.r),L=[];for(let i=0;i<B.n;i++){if(Math.random()<.6)L.push({t:'poc',R:TWPOR[ri]});else{const E=TWEQ[(Math.random()*TWEQ.length)|0];L.push({t:E.k,E,R:TWEQR[ri]})}}
  twModal(`<div class="twM gold"><h3>🎁 ${B.n} BAÚ${B.n>1?'S':''} ${TWEQR[ri].n.replace('A','O')}${B.n>1?'S':''}!</h3><p class="twH">Toque nos baús para abrir</p><div class="cpB">${L.map((c,i)=>`<div class="avC cpC" data-i="${i}" style="--c:${c.R.c}"><img class="cf" src="${TWIMG.bf[ri]}" alt=""><img class="ca" src="${TWIMG.ba[ri]}" alt=""><img class="it" src="${twIco(c.t,c.R.k)}" alt=""><b class="lb">${c.t==='poc'?'POÇÃO':c.E.n} ${c.R.n}</b></div>`).join('')}</div>
    <div class="row"><button class="btn main" id="twCpOk">PEGAR TUDO</button></div></div>`);
  const open=el=>{if(!el||el.classList.contains('open'))return;el.classList.add('open');const c=L[+el.dataset.i];twSfx('boom');setTimeout(()=>twSfx('powerUp'),250);if(c.t==='poc')twAddPoc(c.R);else twAddItem(c.E,c.R)};
  document.querySelectorAll('#twModal .cpC').forEach(el=>el.onclick=()=>open(el));L.forEach((c,i)=>setTimeout(()=>open(document.querySelector('#twModal .cpC[data-i="'+i+'"]')),1400+i*800));
  $('twCpOk').onclick=()=>{document.querySelectorAll('#twModal .cpC').forEach(open);setTimeout(()=>{twModal(null);twRender();twToast('🎒 Itens dos baús foram para a MOCHILA','#ffc531')},500)}}
function twAdmBuff(){""")
rep("\n.twBag .bgw{","\n.cpB{display:flex;gap:3em;justify-content:center;margin:2.5em 0 1.6em}.cpC{position:relative;width:11em;height:11em;font-size:1.2em}\n.twBag .bgw{")
open(P,'w').write(s);print('ok')
