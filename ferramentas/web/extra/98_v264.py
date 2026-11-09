import sys
# v264: 2 códigos ÚNICOS (só 1 pessoa no jogo inteiro cada) do PASSE PRÊMIO (o mais caro). Hashes aqui, texto só com o dono.
P=sys.argv[1];s=open(P,encoding='utf8').read()
a="'1ho2mzo':{nm:'PRESENTE DO ADM',dia:4},";assert s.count(a)==1
s=s.replace(a,a+"'3c1czy':{nm:'PASSE DE BATALHA PRÊMIO (ELITE)',bp:2,uni:1},'15an3rn':{nm:'PASSE DE BATALHA PRÊMIO (ELITE)',bp:2,uni:1},")
open(P,'w',encoding='utf8').write(s);print('v264 ok')
