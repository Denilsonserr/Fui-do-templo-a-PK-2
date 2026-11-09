import sys
# v259: códigos do PASSE DE BATALHA (hashes aqui, texto só com o dono): 17lixq = PAGO, xoi9kg = PRÊMIO (libera PAGO + PRÊMIO). 1 vez por conta (sem conta: por aparelho).
P=sys.argv[1];s=open(P,encoding='utf8').read()
def rep(a,b):
    global s;assert s.count(a)==1,(a[:80],s.count(a));s=s.replace(a,b)
rep("'1ho2mzo':{nm:'PRESENTE DO ADM',dia:4},","'1ho2mzo':{nm:'PRESENTE DO ADM',dia:4},'17lixq':{nm:'PASSE DE BATALHA',bp:1},'xoi9kg':{nm:'PASSE DE BATALHA PRÊMIO',bp:2},")
rep("let dk='';if((C.ev||C.jn)&&!C.uni){","let dk='';if((C.ev||C.jn||C.bp)&&!C.uni){")
rep("((C.dia||C.ev||C.jn)&&!C.uni?'❌ Você já usou esse código.'","((C.dia||C.ev||C.jn||C.bp)&&!C.uni?'❌ Você já usou esse código.'")
rep("if(C.jn&&!C.ev){","if(C.bp){bpUnlock(C.bp);try{acSave(1)}catch(x){}E.className='twH ok';E.textContent='👑 '+C.nm+' LIBERADO! Abra o Passe de Batalha no menu do Ranqueado e pegue seus prêmios.';twSfx('powerUp');setTimeout(()=>twSfx('boom'),300);setTimeout(()=>{try{if(RKV==='bp')rkView('bp')}catch(x){}},600);return true}if(C.jn&&!C.ev){")
open(P,'w',encoding='utf8').write(s);print('v259 ok')
