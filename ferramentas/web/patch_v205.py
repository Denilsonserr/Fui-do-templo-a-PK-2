import sys
# v205: buff do título no painel, ADM +20% dano, MOEDAS na torre e LOJA de poções
P=sys.argv[1];s=open(P).read()
def rep(a,b,n=1):
    global s;c=s.count(a);assert c==n,(a[:80],c);s=s.replace(a,b)
rep("p.tdm=(p.tdm||1)*1.15;","p.tdm=(p.tdm||1)*1.2;")
JS=r"""
/* ---------- v205: moedas e loja ---------- */
const twCoins=()=>twLS.g('tw_moedas',0)|0,twAddCoins=n=>{twLS.s('tw_moedas',Math.max(0,twCoins()+n))};
function twCoinWin(secs,lost,cmb){let c=100+(secs<20?60:secs<35?45:secs<50?30:secs<75?15:0)+(lost<.1?25:lost<.3?10:0)+(cmb>=10?15:0);return Math.min(200,c)}
const TWSHOP=[100,200,300,500,2000];
function twShop(){const c=twCoins(),cheia=twBagItems().length>=TWBAG;
  twModal(`<div class="twM twShop"><h3>🛒 LOJA</h3><p class="twH">Você tem <b class="coin">🪙 ${c}</b> moedas. Ganhe moedas vencendo andares da torre (100 a 200 por luta, mais rápido = mais moedas; +100 ao completar a torre).</p>
    <div class="shL">${TWPOR.map((R,i)=>`<button class="shI ${c<TWSHOP[i]||cheia?'off':''}" data-i="${i}" style="--c:${R.c}"><span class="rr">${R.n}</span><img src="${TWIMG.poc[i]}" alt=""><b>POÇÃO +${R.v}%</b><span class="ds">Transformação · uso único</span><em>🪙 ${TWSHOP[i]}</em></button>`).join('')}</div>
    <span class="twH" id="twShE">${cheia?'Mochila cheia! Libere espaço para comprar.':''}</span><div class="row"><button class="btn" id="twShX">FECHAR</button></div></div>`);
  $('twShX').onclick=()=>{twModal(null);twRender()};
  document.querySelectorAll('#twModal .shI').forEach(b=>b.onclick=()=>{const i=+b.dataset.i,E=$('twShE');if(twBagItems().length>=TWBAG){E.className='twH err';E.textContent='Mochila cheia! Libere espaço para comprar.';return}
    if(twCoins()<TWSHOP[i]){E.className='twH err';E.textContent='Moedas insuficientes.';twSfx('clang');return}twAddCoins(-TWSHOP[i]);twAddPoc(TWPOR[i]);twSfx('powerUp');twToast('🧪 POÇÃO '+TWPOR[i].n+' comprada! Está na mochila','#7dff9a');twShop()})}
"""
rep("function twTrofList(){",JS+"function twTrofList(){")
# ganhar moedas ao vencer um andar
rep("for(const k of ks)TW.tr.push({k,fl:won});","for(const k of ks)TW.tr.push({k,fl:won});\n  {let c=twCoinWin(secs,lost,F.cmb);if(TW.fl>=TWN)c+=100;twAddCoins(c);TW.coinGain=c;TW.coinRun=(TW.coinRun||0)+c}")
rep("TW.time=0;TW.tr=[];TW.sent=false;","TW.time=0;TW.tr=[];TW.coinRun=0;TW.sent=false;")
rep("<div class=\"avN\">ANDAR ${won+1} · ⏱","<div class=\"avN\">ANDAR ${won+1} · 🪙 +${TW.coinGain||0} · ⏱")
rep("<div class=\"twSt\"><div><small>PERSONAGEM</small>","<div class=\"twSt\"><div><small>MOEDAS</small><b class=\"coin\">🪙 +${TW.coinRun||0}</b></div><div><small>PERSONAGEM</small>")
# painel: buff do título + moedas
rep("$('twPs').innerHTML=TWPT.map(","$('twPs').innerHTML=(twIsAdm()?'<span class=\"tb\">👑 ADM <b>+20% DANO</b> · <b>+10% VEL.</b> · 🍀 <b>SORTE</b></span>':'')+`<span class=\"co\">🪙 <b>${twCoins()}</b></span>`+TWPT.map(")
# botão da loja
rep('<button id="twBagB">','<button id="twShB">🛒 LOJA</button><button id="twBagB">')
rep("$('twBagB').onclick=","$('twShB').onclick=()=>{if(!$('twModal').hidden||TW.busy)return;twSfx('whoosh');twShop()};$('twBagB').onclick=")
rep("\n.twBag .bgw{",r"""
#twInfo .ps .tb{width:100%;color:#ffd84a;text-shadow:0 0 .4em rgba(255,200,60,.6)}#twInfo .ps .tb b{color:#ffe680}#twInfo .ps .co b{color:#ffd84a}.coin{color:#ffd84a}
.twShop .shL{display:flex;gap:.8em;justify-content:center;flex-wrap:wrap;margin:.5em 0}.shI{--c:#ccc;width:10.5em;display:flex;flex-direction:column;align-items:center;gap:.15em;padding:.6em .4em;border:2px solid var(--c);border-radius:.8em;background:radial-gradient(circle at 50% 0%,color-mix(in srgb,var(--c) 35%,transparent),#0b0710 72%);color:#fff;font:700 .95em var(--f-ui);cursor:pointer}
.shI img{width:5.5em;height:5.5em;object-fit:contain;filter:drop-shadow(0 0 .4em var(--c))}.shI .rr{font:900 .8em var(--f-ui);letter-spacing:.2em;color:var(--c)}.shI .ds{font-size:.68em;color:#cdbfcf}.shI em{font-style:normal;font:900 1.1em var(--f-ui);color:#ffd84a;margin-top:.2em}.shI.off{opacity:.45}
.twBag .bgw{""")
open(P,'w').write(s);print('ok')
