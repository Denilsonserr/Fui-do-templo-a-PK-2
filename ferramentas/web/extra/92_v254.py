import sys
# v254: código 5 JOIAS NEGRAS (hash nbnmp9, texto só com o dono): todo mundo pode usar, 1 vez por conta (sem conta: 1 vez por aparelho)
P=sys.argv[1];s=open(P,encoding='utf8').read()
def rep(a,b):
    global s;assert s.count(a)==1,(a[:80],s.count(a));s=s.replace(a,b)
rep("'1ho2mzo':{nm:'PRESENTE DO ADM',dia:4},","'1ho2mzo':{nm:'PRESENTE DO ADM',dia:4},'nbnmp9':{nm:'5 JOIAS NEGRAS',jn:5},")
rep("let dk='';if(C.ev){","let dk='';if(C.ev||C.jn){")
rep("(C.dia||C.ev?'❌ Você já usou esse código.'","(C.dia||C.ev||C.jn?'❌ Você já usou esse código.'")
open(P,'w',encoding='utf8').write(s);print('v254 ok')
