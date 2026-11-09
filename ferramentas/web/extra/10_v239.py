import sys
# v239: ganchos do jogo base usados pelo sistema de nível, equipamento novo (anel) e títulos do Yuta
P=sys.argv[1];s=open(P,encoding='utf8').read()
def rep(a,b,n=1):
    global s;c=s.count(a);assert c==n,(a[:90],c);s=s.replace(a,b)
rep("const twEqB=st=>","let twEqB=st=>")
# dano crítico extra (árvore) + dano extra na transformação (Rika do Yuta)
rep("(crit?(isXw(a)&&a.form?1.8:1.6):1)","(crit?(isXw(a)&&a.form?1.8:1.6+(a.tcd||0)/100):1)*(a.form&&a.tfd?1+a.tfd/100:1)")
# roubo de vida
rep("const hp0=d.hp;d.hp=Math.max(0,d.hp-dmg);","const hp0=d.hp;d.hp=Math.max(0,d.hp-dmg);if(a.tls&&a.hp>0&&!a.ko)a.hp=Math.min(a.mhp||MAXHP,a.hp+(hp0-d.hp)*a.tls/100);")
# velocidade da ultimate = enche o Ki mais rápido
rep("a.ki=Math.min(100,a.ki+5);d.ki=Math.min(100,d.ki+3);","a.ki=Math.min(100,a.ki+5*(a.tki||1));d.ki=Math.min(100,d.ki+3);")
# títulos do Yuta brilham mais quanto menor o número
rep('k&&TWTIT[k]?`<em class="twTit" style="--c:${TWTIT[k].c}">','k&&TWTIT[k]?`<em class="twTit${TWTIT[k].yt?\' ytt y\'+(TWTIT[k].yt===1?1:TWTIT[k].yt<=3?2:TWTIT[k].yt<=6?3:4):\'\'}" style="--c:${TWTIT[k].c}">')
open(P,'w',encoding='utf8').write(s);print('v239 ok')
