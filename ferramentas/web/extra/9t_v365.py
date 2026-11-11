import sys
# v365: 3 músicas de Saint Seiya mandadas pelo dono (evento). Entram no MUS (luta, Torre, rádio do Ranqueado) e nos botões da escolha de música.
P=sys.argv[1];s=open(P,encoding='utf8').read()
N=[['Lost Canvas – Abertura','a/52222ed0e49460.mp3'],['Pelo Mundo (Saint Seiya)','a/e8d2c34b51584e.mp3'],['Laços de Flor (Lost Canvas)','a/35458a69982711.mp3']]
a="['Garou (Okabe)','a/2df69698ef34f9.mp3']];";assert s.count(a)==1
s=s.replace(a,"['Garou (Okabe)','a/2df69698ef34f9.mp3'],"+",".join("['%s','%s']"%(n,f) for n,f in N)+"];")
b='<button data-m="17" aria-pressed="false">';i=s.index(b);j=s.index('</button>',i)+9
s=s[:j]+''.join('<button data-m="%d" aria-pressed="false">%s</button>'%(18+k,n) for k,(n,f) in enumerate(N))+s[j:]
open(P,'w',encoding='utf8').write(s);print('v365 ok')
