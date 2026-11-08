import sys
# v203: títulos de todo mundo aparecem nos rankings (título atual de cada jogador) + CHAT do Modo Torre (salvo no Firestore)
P=sys.argv[1];s=open(P).read()
def rep(a,b,n=1):
    global s;c=s.count(a);assert c==n,(a[:80],c);s=s.replace(a,b)
JS=r"""
/* ---------- v203: título atual de cada jogador (documentos "claim" + subidas, o mais recente vale) ---------- */
let TWTM={};
async function twTitMap(){if(twTitMap.p&&Date.now()-twTitMap.t<30000)return twTitMap.p;twTitMap.t=Date.now();
  return twTitMap.p=(async()=>{const body={structuredQuery:{from:[{collectionId:'torre'}],where:{fieldFilter:{field:{fieldPath:'claim'},op:'EQUAL',value:{stringValue:'1'}}},limit:1000}};
    const r=await twFetchT(TWURL+':runQuery?key='+TWFB.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok)throw new Error('http '+r.status);const j=await r.json();
    for(const x of (Array.isArray(j)?j:[])){const F=x&&x.document&&x.document.fields;if(!F||!F.nome)continue;twTmPut(F.nome.stringValue,F.tit?F.tit.stringValue:'',Date.parse(x.document.createTime||'')||0)}return TWTM})().catch(e=>{twTitMap.p=null;return TWTM})}
function twTmPut(nome,tit,ct){const k=String(nome||'').toLowerCase();if(!k)return;const o=TWTM[k];if(!o||ct>=o.ct)TWTM[k]={tit:tit||'',ct}}
const twTN=e=>{const o=TWTM[String(e.nome||'').toLowerCase()];return o?o.tit:(e.tit||'')};
/* avisa o servidor quando o título em uso muda (vale para todo mundo ver nos rankings e no chat) */
function twTitSync(){const n=twLS.g('tw_nome','');if(!n)return;twClaimName(n);twTitMap.p=null}
/* ---------- CHAT da torre: mensagens salvas na coleção torre (campo chat = dia), carrega hoje e os 2 dias antes ---------- */
const twDay=t=>{const d=new Date(t-BRT);return 'c'+d.getUTCFullYear()+String(d.getUTCMonth()+1).padStart(2,'0')+String(d.getUTCDate()).padStart(2,'0')};
const TWBAD=['porra','caralho','puta','fdp','merda','buceta','arrombad','viado','vagabund','corno','cuzao','cuzão','desgraçad','pqp','vsf','tnc'];
const twClean=t=>{let o=String(t);for(const w of TWBAD)o=o.replace(new RegExp(w,'gi'),m=>m[0]+'*'.repeat(m.length-1));return o};
async function twChatLoad(){const days=[0,1,2].map(i=>twDay(Date.now()-i*864e5)),out=[];
  for(const d of days){const body={structuredQuery:{from:[{collectionId:'torre'}],where:{fieldFilter:{field:{fieldPath:'chat'},op:'EQUAL',value:{stringValue:d}}},limit:400}};
    const r=await twFetchT(TWURL+':runQuery?key='+TWFB.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok)throw new Error('http '+r.status);const j=await r.json();
    for(const x of (Array.isArray(j)?j:[])){const F=x&&x.document&&x.document.fields;if(!F||!F.msg)continue;out.push({id:x.document.name,nome:String(F.nome&&F.nome.stringValue||'?').slice(0,16),tit:F.tit?F.tit.stringValue:'',uid:F.uid?F.uid.stringValue:'',msg:String(F.msg.stringValue||'').slice(0,140),ct:Date.parse(x.document.createTime||'')||0})}}
  return out.sort((a,b)=>a.ct-b.ct).slice(-80)}
function twChatHTML(L){const me=twUid();if(!L.length)return '<p class="twH">Ninguém falou nada ainda hoje. Mande um oi! 👋</p>';
  return L.map(m=>{const t=new Date(m.ct-BRT).toISOString().slice(11,16);return `<div class="cm${m.uid===me?' me':''}${m.nome.toLowerCase()===TWADMN.toLowerCase()&&m.tit==='adm'?' adm':''}"><span class="ch"><b>${twEsc(m.nome)}</b>${twTitTag(m.tit,m.nome)}<small>${t}</small></span><p>${twEsc(twClean(m.msg))}</p></div>`}).join('')}
function twChat(){const n=twLS.g('tw_nome','');if(!n){twAskName(()=>twChat());return}
  twModal(`<div class="twM twChat"><h3>💬 CHAT DA TORRE</h3><p class="twH">Mensagens dos últimos 3 dias. Seja gente boa! 🙂</p><div class="cl" id="twChL"><p class="twH">Carregando...</p></div>
    <div class="cs"><input id="twChI" maxlength="140" placeholder="Escreva uma mensagem..." autocomplete="off"><button class="btn main" id="twChS">ENVIAR</button></div><span id="twChE" class="twH"></span>
    <div class="row"><button class="btn" id="twChX">FECHAR</button></div></div>`);
  const Lst=$('twChL'),I=$('twChI');let L=[],stick=true;
  const draw=()=>{if(!$('twChL'))return;stick=Lst.scrollTop+Lst.clientHeight>=Lst.scrollHeight-30;Lst.innerHTML=twChatHTML(L);if(stick)Lst.scrollTop=Lst.scrollHeight};
  const load=()=>twChatLoad().then(x=>{const pend=L.filter(m=>m.pend&&!x.some(y=>y.uid===m.uid&&y.msg===m.msg));L=x.concat(pend);draw()}).catch(()=>{if($('twChL')&&!L.length)Lst.innerHTML='<p class="twH err">Sem internet agora.</p>'});
  load();clearInterval(twChat.iv);twChat.iv=setInterval(()=>{if(!$('twModal').querySelector('.twChat')){clearInterval(twChat.iv);return}load()},8000);
  const send=()=>{const t=I.value.replace(/[<>]/g,'').trim().slice(0,140),E=$('twChE');if(!t)return;if(Date.now()-(twChat.last||0)<4000){E.className='twH err';E.textContent='Calma! Espere uns segundos entre as mensagens.';return}
    twChat.last=Date.now();I.value='';E.textContent='';const nome=twLS.g('tw_nome',''),tit=twTitOn();L.push({nome,tit,uid:twUid(),msg:t,ct:Date.now(),pend:1});stick=true;draw();Lst.scrollTop=Lst.scrollHeight;twSfx('whoosh');
    const IV=v=>({integerValue:String(v)});const f={nome:{stringValue:nome},andar:IV(0),tempo:IV(0),uid:{stringValue:twUid()},tit:{stringValue:tit},chat:{stringValue:twDay(Date.now())},msg:{stringValue:t},v:IV(203)};
    twFetchT(TWURL+'/torre?key='+TWFB.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:f})}).then(r=>{if(!r.ok)throw 0}).catch(()=>{E.className='twH err';E.textContent='Não foi enviada (sem internet?).';L=L.filter(m=>!(m.pend&&m.msg===t));draw()})};
  $('twChS').onclick=send;I.onkeydown=e=>{if(e.key==='Enter')send()};$('twChX').onclick=()=>{clearInterval(twChat.iv);twModal(null)};setTimeout(()=>{try{I.focus()}catch(e){}},100)}
"""
rep("function twTrofList(){",JS+"function twTrofList(){")
# reserva/atualização de nome agora leva o título
rep("const f={nome:{stringValue:n},nomeL:{stringValue:n.toLowerCase()},andar:I(0),tempo:I(0),trof:I(0),pontos:I(0),char:{stringValue:''},v:I(201),uid:{stringValue:twUid()},claim:{stringValue:'1'}};",
    "const f={nome:{stringValue:n},nomeL:{stringValue:n.toLowerCase()},andar:I(0),tempo:I(0),trof:I(0),pontos:I(0),char:{stringValue:''},v:I(203),uid:{stringValue:twUid()},tit:{stringValue:twTitOn()},claim:{stringValue:'1'}};")
rep("twLS.s('tw_titOn',twTitOn()===b.dataset.k?'':b.dataset.k);twSfx('clang');twTitles()})}","twLS.s('tw_titOn',twTitOn()===b.dataset.k?'':b.dataset.k);twSfx('clang');twTitSync();twTitles()})}")
rep("if(!twLS.g('tw_titOn',''))twLS.s('tw_titOn',k);","if(!twLS.g('tw_titOn',''))twLS.s('tw_titOn',k);setTimeout(twTitSync,1500);")
# ao abrir a torre a 1ª vez nesta versão: manda o título atual
rep("setTimeout(twClaims,800);","setTimeout(twClaims,800);if(!twLS.g('tw_ts203',0)&&twLS.g('tw_nome','')){twLS.s('tw_ts203',1);setTimeout(twTitSync,1200)}")
# rankings esperam o mapa de títulos e mostram o título de todo mundo
rep("async function twFetch(){if(twFetch.c&&Date.now()-twFetch.t<30000)return twFetch.c;","async function twFetch(){if(twFetch.c&&Date.now()-twFetch.t<30000)return twFetch.c;await twTitMap();")
rep("function twFetchC(id){const k='c_'+id;","function twFetchC(id){await twTitMap();const k='c_'+id;")
rep("async function twQ(where){","async function twQ(where){await twTitMap();")
rep("const ct=Date.parse(x.document.createTime||'')||0,old=ct<TWCUT||(+g('v')||0)<180;","const ct=Date.parse(x.document.createTime||'')||0,old=ct<TWCUT||(+g('v')||0)<180;if(g('tit')!=null)twTmPut(g('nome'),g('tit'),ct);")
rep("<span class=\"nm\">${twEsc(e.nome)}<small>${CH[e.char]?CH[e.char].name:''}</small>","<span class=\"nm\">${twEsc(e.nome)}${twTitTag(twTN(e),e.nome)}<small>${CH[e.char]?CH[e.char].name:''}</small>")
rep("<span class=\"nm\">${twEsc(e.nome)}<small>${e.runs}","<span class=\"nm\">${twEsc(e.nome)}${twTitTag(twTN(e),e.nome)}<small>${e.runs}")
rep("<span class=\"nm\">${twEsc(e.nome)}${twTitTag(e.tit,e.nome)}","<span class=\"nm\">${twEsc(e.nome)}${twTitTag(twTN(e),e.nome)}")
# botão do chat
rep('<button id="twEvB">','<button id="twChB">💬 CHAT</button><button id="twEvB">')
rep("$('twEvB').onclick=","$('twChB').onclick=()=>{if(!$('twModal').hidden||TW.busy)return;twSfx('whoosh');twChat()};$('twEvB').onclick=")
rep("\n.twBag .bgw{",r"""
.twChat{max-width:70em}.twChat .cl{height:46vh;overflow:auto;display:flex;flex-direction:column;gap:.4em;padding:.5em;background:#0a0509;border:1px solid #4a2028;border-radius:.6em;text-align:left;margin:.3em 0}
.cm{max-width:80%;align-self:flex-start;padding:.35em .7em;border-radius:.6em .6em .6em .15em;background:#22121a;border:1px solid #3a2028}.cm.me{align-self:flex-end;border-radius:.6em .6em .15em .6em;background:#3a1418;border-color:#7a2a30}
.cm.adm{border-color:#ffd84a;box-shadow:0 0 .8em rgba(255,200,60,.45)}.cm .ch{display:flex;align-items:center;gap:.3em;font-size:.8em;flex-wrap:wrap}.cm .ch b{color:#ffcf4a}.cm .ch small{color:#8a7a80;font-size:.85em;margin-left:.3em}.cm p{margin:.15em 0 0;font:600 .95em var(--f-ui);word-break:break-word;color:#f2e8ee}
.twChat .cs{display:flex;gap:.5em}.twChat .cs input{flex:1;padding:.5em .8em;border-radius:.5em;border:1px solid #6a2a30;background:#14080c;color:#fff;font:700 1em var(--f-ui)}
.twRk .nm .twTit{margin-left:.5em}
.twBag .bgw{""")
open(P,'w').write(s);print('ok',len(s))
