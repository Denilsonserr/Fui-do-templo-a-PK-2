import sys
# v265: código de 20.000 💎, uso ÚNICO (só 1 pessoa no jogo inteiro). Hash aqui, texto só com o dono.
P=sys.argv[1];s=open(P,encoding='utf8').read()
a="'1ho2mzo':{nm:'PRESENTE DO ADM',dia:4},";assert s.count(a)==1
s=s.replace(a,a+"'1q7f8pe':{nm:'20.000 DIAMANTES',gem:20000},")
open(P,'w',encoding='utf8').write(s);print('v265 ok')
