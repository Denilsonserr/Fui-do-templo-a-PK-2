import sys
# v210: VENDER equipamento por moedas na mochila
P=sys.argv[1];s=open(P).read()
def rep(a,b,n=1):
    global s;c=s.count(a);assert c==n,(a[:80],c);s=s.replace(a,b)
rep("const TWSHOP=","const TWSELL={comum:100,rara:200,epica:300,lend:700,mit:2000};\nconst TWSHOP=")
rep("if(src==='eq')bt=`<button class=\"btn main\" data-a=\"eq\">EQUIPAR</button><button class=\"btn\" data-a=\"del\">DESCARTAR</button>`;",
    "if(src==='eq')bt=`<button class=\"btn main\" data-a=\"eq\">EQUIPAR</button><button class=\"btn sell\" data-a=\"sell\">VENDER 🪙 ${TWSELL[x.r]||100}</button>`;")
rep("else if(a==='del'){",
    "else if(a==='sell'){if(!b.dataset.ok){b.dataset.ok=1;b.textContent='CONFIRMAR VENDA? 🪙 '+(TWSELL[x.r]||100);return}twLS.s('tw_inv',twInv().filter(y=>y.id!==x.id));const Q=twEqp();for(const k in Q)if(Q[k]===x.id)delete Q[k];twLS.s('tw_eqp',Q);twAddCoins(TWSELL[x.r]||100);twSfx('powerUp');twToast('🪙 +'+(TWSELL[x.r]||100)+' moedas! Item vendido','#ffd84a')}\n        else if(a==='del'){")
rep("<div class=\"moT c\">🎒 MOCHILA ${L.length}/${TWBAG}</div>","<div class=\"moT c\">🎒 MOCHILA ${L.length}/${TWBAG} · <span class=\"coin\">🪙 ${twCoins()}</span></div>")
rep("\n.twBag .bgw{","\n.moD .btn.sell{background:linear-gradient(180deg,#8a6a10,#4a3404);border-color:#ffd84a;color:#ffe680}\n.twBag .bgw{")
open(P,'w').write(s);print('ok')
