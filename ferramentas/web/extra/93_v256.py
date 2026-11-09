import sys
# v256: dois códigos (hashes aqui, texto só com o dono):
#  o9m3i1 = 40 JOIAS NEGRAS, uso ÚNICO no jogo inteiro (uni:1 → documentId sem chave de conta)
#  n8jwhl = 1000 💎 + 5 Joias Negras + 20 tickets, todo mundo pode usar 1 vez (ev:1)
P=sys.argv[1];s=open(P,encoding='utf8').read()
def rep(a,b):
    global s;assert s.count(a)==1,(a[:80],s.count(a));s=s.replace(a,b)
rep("'1ho2mzo':{nm:'PRESENTE DO ADM',dia:4},","'1ho2mzo':{nm:'PRESENTE DO ADM',dia:4},'o9m3i1':{nm:'40 JOIAS NEGRAS',jn:40,uni:1},'n8jwhl':{nm:'PRESENTE DAS PASSIVAS',ev:1,gem:1000,tic:20,jn:5},")
rep("let dk='';if(C.ev||C.jn){","let dk='';if((C.ev||C.jn)&&!C.uni){")
rep("(C.dia||C.ev||C.jn?'❌ Você já usou esse código.'","((C.dia||C.ev||C.jn)&&!C.uni?'❌ Você já usou esse código.'")
rep("if(C.ev){rkAdd('gem',C.gem);rkAdd('tic',C.tic);","if(C.ev){rkAdd('gem',C.gem);rkAdd('tic',C.tic);if(C.jn)psAddJn(C.jn);")
rep("'🎉 Código do EVENTO aceito! +'+C.gem+' 💎 e +'+C.tic+' 🎫 tickets de giro (no Modo Ranqueado)'","'🎉 Código aceito! +'+C.gem+' 💎, +'+C.tic+' 🎫 tickets de giro'+(C.jn?' e +'+C.jn+' 💠 Joias Negras':'')+' (no Modo Ranqueado)'")
open(P,'w',encoding='utf8').write(s);print('v256 ok')
