import sys
# v246: código 3000 DIAMANTES (hash 1gaadmg, uso único no jogo inteiro, texto só com o dono)
P=sys.argv[1];s=open(P,encoding='utf8').read()
a="'1ho2mzo':{nm:'PRESENTE DO ADM',dia:4},";assert s.count(a)==1
s=s.replace(a,a+"'1gaadmg':{nm:'3000 DIAMANTES',gem:3000},");open(P,'w',encoding='utf8').write(s);print('v246 ok')
