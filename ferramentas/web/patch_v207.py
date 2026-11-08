import sys,json
# v207: CAPACETE (transformação mais rápida + crítico) e sistema de CRÍTICO melhorado
P=sys.argv[1];s=open(P).read();CAP=json.load(open('/home/claude/mo_build/cap.json'))
def rep(a,b,n=1):
    global s;c=s.count(a);assert c==n,(a[:80],c);s=s.replace(a,b)
rep("{k:'bot',n:'BOTAS',i:'🥾',s:'vel',d:'Aumenta a VELOCIDADE'}];","{k:'bot',n:'BOTAS',i:'🥾',s:'vel',d:'Aumenta a VELOCIDADE'},{k:'cap',n:'CAPACETE',i:'⛑️',s:'trf',d:'Transforma mais rápido + CRÍTICO'}];\nconst TWCAPV={comum:[1,1],rara:[5,5],epica:[10,15],lend:[20,20],mit:[35,25]};")
rep("const twIco=(t,r)=>","TWIMG.cap="+json.dumps(CAP)+";const twIco=(t,r)=>")
rep("TWEQ[(Math.random()*3)|0];L.push({t:E.k,E,R:twEqRoll()})","TWEQ[(Math.random()*TWEQ.length)|0];L.push({t:E.k,E,R:twEqRoll()})")
rep("function twAddItem(E,R){const I=twInv(),it={id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),t:E.k,r:R.k,v:R.v};",
    "function twAddItem(E,R){const I=twInv(),it={id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),t:E.k,r:R.k,v:R.v};if(E.k==='cap'){it.v=TWCAPV[R.k][0];it.crit=TWCAPV[R.k][1]}")
rep("if(k==='cap'){e+=`<span class=\"moS lock\" style=\"${bx}\"><i>EM BREVE</i></span>`;continue}\n","")
rep("const tot={esp:0,arm:0,bot:0};","const tot={esp:0,arm:0,bot:0,cap:0,crit:0};")
rep("if(x)tot[E.k]=x.v}","if(x){tot[E.k]=x.v;if(x.crit)tot.crit=x.crit}}")
rep("<div class=\"moT r\">🥾 VEL. <b>+${tot.bot}%</b> · 🧪","<div class=\"moT r\">🥾 VEL. <b>+${tot.bot}%</b> · ⛑️ TRANSF. <b>+${tot.cap}%</b> · 💥 CRÍT. <b>+${tot.crit}%</b> · 🧪")
rep("ef=x=>x.vel?","ef=x=>x.t==='cap'?'Transformação +'+x.v+'% mais rápida · Crítico +'+(x.crit||0)+'% (permanente)':x.vel?")
rep("const pon=twPocOn(),trf=(TW.pas.trf||0)+(pon?pon.v:0);","const pon=twPocOn(),trf=(TW.pas.trf||0)+(pon?pon.v:0)+twEqB('trf');{const c=twEqOn().cap;p.tcr=c&&c.crit||0}")
rep("const crit=isXw(a)&&a.form&&!h.lock&&Math.random()<.3;","const crit=!h.lock&&(isXw(a)&&a.form?Math.random()<.3:Math.random()<(window.__crit!=null?window.__crit:(5+(a.tcr||0))/100));")
rep("(crit?1.8:1)","(crit?(isXw(a)&&a.form?1.8:1.6):1)")
rep("if(crit){txt(d.x,d.y-270,'CRÍTICO!','#ff6ad0');G.hitstop=Math.max(G.hitstop,9);G.flash=Math.max(G.flash,3);G.flashCol='#ffd0f0';ring(h.px,h.py,'#ff4fb8',140,16,6)}","if(crit){critFx(a,d,h)}")
rep("function applyHit(a,d,h){",r"""function critFx(a,d,h){const x=h.px||d.x,y=h.py||d.y-150;txt(d.x,d.y-290,'💥 CRÍTICO!','#ffdd33');G.hitstop=Math.max(G.hitstop,11);G.flash=Math.max(G.flash,4);G.flashCol='#fff2c0';G.shake=Math.max(G.shake,12);
  ring(x,y,'#ffffff',90,12,5);ring(x,y,'#ffb300',170,18,7);ring(x,y,'#ff3a2a',240,22,4);for(let i=0;i<16;i++)spark(x,y,i%3?'#ffd84a':'#ffffff',1,rand(6,14));try{flashL(x,y,'#ffcf4a',380,.85,14)}catch(e){}try{SFX.hit(true,2)}catch(e){}buzz(45)}
function applyHit(a,d,h){""")
rep("+`<span class=\"co\">🪙 <b>${twCoins()}</b></span>`","+`<span class=\"co\">🪙 <b>${twCoins()}</b></span>`+(()=>{const c=twEqOn().cap;return `<span>💥 CRÍT. <b>${5+(c&&c.crit||0)}%</b></span>`})()")
open(P,'w').write(s);print('ok')
