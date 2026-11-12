import sys
# v373: 5 níveis de gráfico — MÍNIMO (mais leve que o Leve), LEVE, MÉDIO (cores/mapa bonitos do Ultra, mas leve), ULTRA, 4K.
# G.qlv: 0 Mínimo · 1 Leve · 2 Médio · 3 Ultra · 4 4K. Salvo em ft_q (migra de ft_hq/ft_4k).
P=sys.argv[1];s=open(P,encoding='utf8').read()
def R(a,b):
    global s
    assert s.count(a)==1,a[:60];s=s.replace(a,b)
R("try{G.hq=localStorage.getItem('ft_hq')!=='0';G.q4k=localStorage.getItem('ft_4k')!=='0'}catch(e){}",
  "try{G.hq=localStorage.getItem('ft_hq')!=='0';G.q4k=localStorage.getItem('ft_4k')!=='0';const q=localStorage.getItem('ft_q');G.qlv=q!=null?(+q|0):(G.q4k?4:G.hq?3:1)}catch(e){G.qlv=1}")
R("const qName=()=>'Gráfico: '+(!G.hq?'Leve':G.q4k?'4K':'Ultra');","const QLN=['Mínimo','Leve','Médio','Ultra','4K'],qName=()=>'Gráfico: '+QLN[G.qlv|0];")
R("function setQ(lv){G.hq=lv>0;G.q4k=lv>1;G.dyn=1;G.noAO=G.noPop=G.noBloom=G.noLit=0;",
  "function setQ(lv){lv=Math.max(0,Math.min(4,lv|0));G.qlv=lv;G.hq=lv>=2;G.q4k=lv===4;G.dyn=1;G.noAO=G.noPop=G.noBloom=G.noLit=0;qFlags();try{localStorage.setItem('ft_q',lv)}catch(e){}")
R("function setHQ(on){setQ(on?1:0)}","function setHQ(on){setQ(on?3:1)}\n/* Médio: só os efeitos baratos que deixam bonito (cor, luz do mapa, bloom, céu/água animados, sombra no chão) — sem a luz pesada nos personagens e na resolução do Leve */\nfunction qFlags(){G.noCine=0;G.nosplit=0;try{cv.classList.toggle('qmed',G.qlv===2);cv.classList.toggle('qmin',G.qlv===0)}catch(e){}if(G.qlv===2){G.noLit=1;G.noAO=1;G.noPop=1;G.noBloom=1;G.noCine=1;G.nosplit=1}}")
R("$('hqBtn').onclick=$('hqBtn2').onclick=()=>setQ(!G.hq?1:G.q4k?0:2);","$('hqBtn').onclick=$('hqBtn2').onclick=()=>setQ(((G.qlv|0)+1)%5);")
R("DPR=Math.min(window.devicePixelRatio||1,G.q4k?2.2:G.hq?1.6:1.25);","DPR=Math.min(window.devicePixelRatio||1,G.q4k?2.2:G.qlv===3?1.6:G.qlv===2?1.25:G.qlv===0?1:1.25);")
# Mínimo: tira clima, fumaça, ambiente e vida do mapa (passarinhos etc.), menos partículas
R("let last=performance.now(),acc=0;",
  """{const L0=()=>G.qlv===0;const W=(f)=>function(){if(L0())return;return f.apply(this,arguments)};drawWeatherBack=W(drawWeatherBack);drawWeatherFront=W(drawWeatherFront);drawAmbient=W(drawAmbient);drawSmoke=W(drawSmoke);drawLifeBack=W(drawLifeBack);drawLifeFront=W(drawLifeFront);qFlags()}
setInterval(()=>{if(G.qlv===0&&G.mode==='fight'){if(G.parts&&G.parts.length>60)G.parts.splice(0,G.parts.length-60);if(G.smoke&&G.smoke.length)G.smoke.length=0}},250);
let last=performance.now(),acc=0;""")
R('function cinePass(){if(!G.hq)return;','function cinePass(){if(!G.hq||G.noCine)return;')
R('#cv.hd{filter:contrast(1.1) saturate(1.16) brightness(1.03)}','#cv.hd{filter:contrast(1.1) saturate(1.16) brightness(1.03)}#cv.hd.qmed{filter:contrast(1.14) saturate(1.24) brightness(1.04)}')
open(P,'w',encoding='utf8').write(s);print('v373 ok')
