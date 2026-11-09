import sys
# v253: passivas — velocidade de ataque (só golpes básicos: cat punch/kick), regeneração a cada quadro, códigos podem dar Joia Negra (jn)
P=sys.argv[1];s=open(P,encoding='utf8').read()
def rep(a,b):
    global s;assert s.count(a)==1,(a[:80],s.count(a));s=s.replace(a,b)
rep("const m=f.move;f.mf++;","const m=f.move;f.mf++;if(f.pspd&&(m.cat==='punch'||m.cat==='kick')){f.pacc=(f.pacc||0)+f.pspd/100;while(f.pacc>=1){f.pacc-=1;if(f.mf<m.su+m.ac+m.rc-1)f.mf++}}")
rep("try{if(G.gmode==='boss'||G.gmode==='torre')rkCuraTick()}catch(e){}","try{if(G.gmode==='boss'||G.gmode==='torre'){rkCuraTick();psRegTick()}}catch(e){}")
rep("if(C.ev){rkAdd('gem',C.gem);","if(C.jn&&!C.ev){psAddJn(C.jn);E.className='twH ok';E.textContent='🎁 Código aceito! +'+C.jn+' 💠 JOIA NEGRA';twSfx('powerUp');setTimeout(()=>twSfx('boom'),300);return true}if(C.ev){rkAdd('gem',C.gem);")
open(P,'w',encoding='utf8').write(s);print('v253 ok')
