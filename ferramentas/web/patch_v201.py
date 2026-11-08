import sys
# v201: nome ÚNICO (confere no Firestore e reserva o nome) + título ADM (só com código secreto, brilhando)
P=sys.argv[1];s=open(P).read()
def rep(a,b,n=1):
    global s;c=s.count(a);assert c==n,(a[:80],c);s=s.replace(a,b)
rep("tor:{n:'CAMPEÃO DO TORNEIO',i:'🏆',c:'#ff2e63',d:'1º lugar num EVENTO da torre'}};",
    "tor:{n:'CAMPEÃO DO TORNEIO',i:'🏆',c:'#ff2e63',d:'1º lugar num EVENTO da torre'},adm:{n:'ADM',i:'👑',c:'#ffd84a',d:'Administrador do jogo',hid:1}};\n"
    "const twHash=s=>{let h=0x811c9dc5;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,0x01000193)>>>0}return h.toString(36)};const TWADM='r8iakt';")
rep("const twTitTag=k=>k&&TWTIT[k]?`<em class=\"twTit\" style=\"--c:${TWTIT[k].c}\">${TWTIT[k].i} ${TWTIT[k].n}</em>`:'';",
    "const twTitTag=k=>k==='adm'?'<em class=\"twTit adm\"><i>👑</i><b>ADM</b></em>':k&&TWTIT[k]?`<em class=\"twTit\" style=\"--c:${TWTIT[k].c}\">${TWTIT[k].i} ${TWTIT[k].n}</em>`:'';")
# títulos escondidos só aparecem para quem tem
rep("<div class=\"twTits\">${Object.keys(TWTIT).map(k=>{const T=TWTIT[k],g=got.includes(k);return `<button class=\"tt ${g?'got':''} ${on===k?'on':''}\"",
    "<div class=\"twTits\">${Object.keys(TWTIT).filter(k=>!TWTIT[k].hid||got.includes(k)).map(k=>{const T=TWTIT[k],g=got.includes(k);return `<button class=\"tt ${g?'got':''} ${on===k?'on':''} ${k==='adm'?'adm':''}\"")
# ignora os documentos de reserva de nome nos rankings
rep("for(const x of (Array.isArray(j)?j:[])){const F=x&&x.document&&x.document.fields;if(!F)continue;","for(const x of (Array.isArray(j)?j:[])){const F=x&&x.document&&x.document.fields;if(!F||F.claim)continue;",3)
# nome único
rep("const ok=()=>{const n=I.value.replace(/[<>]/g,'').trim().slice(0,16);if(n.length<2){$('twNameE').textContent='Digite um nome com pelo menos 2 letras';I.focus();return}twLS.s('tw_nome',n);twSfx('powerUp');twModal(null);cb&&cb()};",
r"""const E=$('twNameE');let busy=0;
  const ok=async()=>{if(busy)return;const n=I.value.replace(/[<>]/g,'').trim().slice(0,16);
    if(twHash(n.toUpperCase())===TWADM){twGiveTit('adm');twLS.s('tw_titOn','adm');I.value=twLS.g('tw_nome','');E.className='twH ok';E.textContent='👑 Título ADM liberado neste aparelho!';twSfx('powerUp');return}
    if(n.length<2){E.textContent='Digite um nome com pelo menos 2 letras';I.focus();return}
    if(n.toLowerCase()===String(twLS.g('tw_nome','')).toLowerCase()){twLS.s('tw_nome',n);twModal(null);cb&&cb();return}
    busy=1;E.className='twH';E.textContent='Verificando se o nome está livre...';
    try{const free=await twNameFree(n);busy=0;if(!free){E.className='twH err';E.textContent='Esse nome já é de outro jogador. Escolha outro!';I.focus();twSfx('clang');return}}
    catch(e){busy=0;E.className='twH err';E.textContent='Precisa de internet para registrar o nome.';return}
    twLS.s('tw_nome',n);twClaimName(n);twSfx('powerUp');twModal(null);cb&&cb()};""")
rep("function twStart(){TW.opps=",r"""async function twNameFree(n){const me=twUid(),L=String(twLS.g('tw_nome','')).toLowerCase(),lo=n.toLowerCase();
  const V=[...new Set([n,lo,n.toUpperCase(),lo.replace(/(^|\s)\S/g,c=>c.toUpperCase())])],A=(await twQRaw(['nomeL',lo]));for(const v of V)A.push(...await twQRaw(['nome',v]));
  try{twFetch.c=null;for(const e of await twFetch())A.push({nome:e.nome,uid:e.uid||''})}catch(e){}
  return !A.some(e=>e.nome.toLowerCase()===lo&&(e.uid?e.uid!==me:lo!==L))}
async function twQRaw(w){const body={structuredQuery:{from:[{collectionId:'torre'}],where:{fieldFilter:{field:{fieldPath:w[0]},op:'EQUAL',value:{stringValue:w[1]}}},limit:50}};
  const r=await twFetchT(TWURL+':runQuery?key='+TWFB.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok)throw new Error('http '+r.status);const j=await r.json(),o=[];
  for(const x of (Array.isArray(j)?j:[])){const F=x&&x.document&&x.document.fields;if(!F)continue;o.push({nome:String(F.nome&&F.nome.stringValue||''),uid:String(F.uid&&F.uid.stringValue||'')})}return o}
/* reserva: grava um documento "claim" (andar 0) com o nome e o código do aparelho; os rankings ignoram */
function twClaimName(n){const I=v=>({integerValue:String(v)});const f={nome:{stringValue:n},nomeL:{stringValue:n.toLowerCase()},andar:I(0),tempo:I(0),trof:I(0),pontos:I(0),char:{stringValue:''},v:I(201),uid:{stringValue:twUid()},claim:{stringValue:'1'}};
  twFetchT(TWURL+'/torre?key='+TWFB.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:f})}).catch(()=>{})}
function twStart(){TW.opps=""")
rep("char:{stringValue:rec.char},v:I(200),uid:{stringValue:twUid()},","char:{stringValue:rec.char},v:I(201),nomeL:{stringValue:nome.toLowerCase()},uid:{stringValue:twUid()},")
# no fim da subida o nome não é mais editável ali (troca só pelo ✏️ NOME, que confere)
rep('<input id="twName" maxlength="16" placeholder="Seu nome no ranking" value="${twEsc(name)}">','<input id="twName" maxlength="16" placeholder="Seu nome no ranking" value="${twEsc(name)}" readonly>')
# estilo do ADM: dourado com brilho passando, coroa pulsando, borda animada
rep("\n.twBag .bgw{",r"""
.twTit.adm{position:relative;overflow:hidden;display:inline-flex;align-items:center;gap:.25em;padding:.1em .6em;font-size:.95em;border:1.5px solid transparent;border-radius:.35em;
  background:linear-gradient(#1a0a00,#1a0a00) padding-box,linear-gradient(90deg,#ff2e63,#ffd84a,#fff6c8,#ffd84a,#ff2e63) border-box;background-size:100% 100%,300% 100%;animation:admB 2.4s linear infinite;box-shadow:0 0 .6em rgba(255,200,60,.7),0 0 1.4em rgba(255,60,90,.35)}
.twTit.adm b{font:900 1.15em var(--f-display,var(--f-ui));letter-spacing:.18em;background:linear-gradient(90deg,#ffb300,#fff7d0 30%,#ffd84a 45%,#ff7a2a 60%,#ffe680 80%,#ffb300);background-size:250% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:admT 1.8s linear infinite;filter:drop-shadow(0 0 .25em rgba(255,200,60,.9))}
.twTit.adm i{font-style:normal;animation:admC 1.2s ease-in-out infinite;filter:drop-shadow(0 0 .3em #ffd84a)}
.twTit.adm:after{content:'';position:absolute;top:-50%;bottom:-50%;width:35%;left:-60%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.85),transparent);transform:skewX(-20deg);animation:admS 2.2s ease-in-out infinite}
@keyframes admB{to{background-position:0 0,300% 0}}@keyframes admT{to{background-position:-250% 0}}@keyframes admC{50%{transform:scale(1.25) rotate(-8deg)}}@keyframes admS{0%,40%{left:-60%}100%{left:130%}}
.tt.adm{border-color:#ffd84a;background:radial-gradient(circle at 50% 0%,rgba(255,200,60,.45),#1a0a00 70%);animation:admG 1.6s ease-in-out infinite}.tt.adm b{font-size:1.3em;background:linear-gradient(90deg,#ffb300,#fff7d0,#ff7a2a,#ffb300);background-size:250% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:admT 1.8s linear infinite}
@keyframes admG{50%{box-shadow:0 0 1.6em #ffd84a,0 0 3em rgba(255,60,90,.5)}}
.twTits{grid-template-columns:repeat(auto-fit,minmax(9em,1fr))}.twH.ok{color:#7dff9a}
.twBag .bgw{""")
rep("out.push({nome:String(g('nome')||'?').slice(0,16),andar:+g('andar')||0,tempo:+g('tempo')||0,old,trof:+g('trof')||0,char:String(g('char')||'')})}","out.push({nome:String(g('nome')||'?').slice(0,16),andar:+g('andar')||0,tempo:+g('tempo')||0,old,trof:+g('trof')||0,char:String(g('char')||''),uid:String(g('uid')||'')})}")
open(P,'w').write(s);print('ok',len(s))
