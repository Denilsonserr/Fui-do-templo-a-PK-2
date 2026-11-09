import sys
# v248: código de EVENTO (hash w9rmwq, texto só com o dono): 1000 gemas + 20 tickets de giro. Todo mundo pode usar, 1 vez por CONTA (ou por aparelho, sem conta).
P=sys.argv[1];s=open(P,encoding='utf8').read()
def rep(a,b):
    global s;assert s.count(a)==1,(a[:80],s.count(a));s=s.replace(a,b)
rep("'1ho2mzo':{nm:'PRESENTE DO ADM',dia:4},","'1ho2mzo':{nm:'PRESENTE DO ADM',dia:4},'w9rmwq':{nm:'PRESENTE DO EVENTO',ev:1,gem:1000,tic:20},")
rep("let dk='';if(C.dia>=4){","let dk='';if(C.ev){const an=String(localStorage.getItem('ac_n')||'').toLowerCase().trim();dk=an&&localStorage.getItem('ac_k')?'_a'+twHash(an):'_u'+twHash(twUid())}else if(C.dia>=4){")
rep("(C.dia?'❌ Você já usou esse código.'","(C.dia||C.ev?'❌ Você já usou esse código.'")
rep("if(C.gem){rkAdd('gem',C.gem);","if(C.ev){rkAdd('gem',C.gem);rkAdd('tic',C.tic);try{acSave(1)}catch(x){}E.className='twH ok';E.textContent='🎉 Código do EVENTO aceito! +'+C.gem+' 💎 e +'+C.tic+' 🎫 tickets de giro (no Modo Ranqueado)';twSfx('powerUp');setTimeout(()=>twSfx('boom'),300);return true}if(C.gem){rkAdd('gem',C.gem);")
open(P,'w',encoding='utf8').write(s);print('v248 ok')
