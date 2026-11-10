import sys
# v269: código de SORTEIO do PASSE PAGO (o básico), uso ÚNICO (1 pessoa no jogo inteiro). Hash aqui, texto só com o dono.
P=sys.argv[1];s=open(P,encoding='utf8').read()
a="'1ho2mzo':{nm:'PRESENTE DO ADM',dia:4},";assert s.count(a)==1
s=s.replace(a,a+"'189oqcd':{nm:'PASSE DE BATALHA (SORTEIO)',bp:1,uni:1},")
open(P,'w',encoding='utf8').write(s);print('v269 ok')
