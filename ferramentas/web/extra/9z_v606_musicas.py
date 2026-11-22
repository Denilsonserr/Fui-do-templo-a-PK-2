import sys
# v606: 2 músicas do ALUCARD mandadas pelo dono (Hellsing abertura + Rap do Alucard do Tauz). Entram no MUS (24, 25) e nos botões da escolha de música.
P=sys.argv[1];s=open(P,encoding='utf8').read()
N=[['Hellsing – Abertura','a/b9dc4444173b21.mp3'],['Rap do Alucard (Tauz)','a/11ae0f46904639.mp3']]
a="['Dark Aria Lv.2 (Solo Leveling)','a/f9907cd6d1a33f.mp3']];";assert s.count(a)==1
s=s.replace(a,"['Dark Aria Lv.2 (Solo Leveling)','a/f9907cd6d1a33f.mp3'],"+",".join("['%s','%s']"%(n,f) for n,f in N)+"];")
b='<button data-m="23" aria-pressed="false">';i=s.index(b);j=s.index('</button>',i)+9
s=s[:j]+''.join('<button data-m="%d" aria-pressed="false">%s</button>'%(24+k,n) for k,(n,f) in enumerate(N))+s[j:]
open(P,'w',encoding='utf8').write(s);print('v606 musicas ok')
