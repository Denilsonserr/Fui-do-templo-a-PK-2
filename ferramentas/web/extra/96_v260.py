import sys
# v260: 6 músicas novas mandadas pelo dono (jogo só entre amigos). Entram no MUS (luta, Torre, Ranqueado) e nos botões da escolha de música.
P=sys.argv[1];s=open(P,encoding='utf8').read()
N=[['Dark Aria (Solo Leveling)','a/a030b5993db8ca.mp3'],['Rap da Akatsuki','a/e5d31657b242a8.mp3'],['Madara (Tauz)','a/d5a331156ca701.mp3'],['Monster (Tauz)','a/840ee7593193cf.mp3'],['Obito (Tauz)','a/9c21265bb82906.mp3'],['Garou (Okabe)','a/2df69698ef34f9.mp3']]
a="['Lovers','a/b418308c213e75.mp3']];";assert s.count(a)==1
s=s.replace(a,"['Lovers','a/b418308c213e75.mp3'],"+",".join("['%s','%s']"%(n,f) for n,f in N)+"];")
b='<button data-m="11" aria-pressed="false">';i=s.index(b);j=s.index('</button>',i)+9
s=s[:j]+''.join('<button data-m="%d" aria-pressed="false">%s</button>'%(12+k,n) for k,(n,f) in enumerate(N))+s[j:]
open(P,'w',encoding='utf8').write(s);print('v260 ok')
