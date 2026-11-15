import sys
# v451: 3 músicas de Solo Leveling mandadas pelo dono (personagem novo Sung). Entram no MUS (21, 22, 23) e nos botões da escolha de música.
P=sys.argv[1];s=open(P,encoding='utf8').read()
N=[['LEveL – Abertura (Solo Leveling)','a/70487c63a0bfec.mp3'],['Dark Aria Lv.2 – PT-BR (Solo Leveling)','a/28e97e8ccc453a.mp3'],['Dark Aria Lv.2 (Solo Leveling)','a/f9907cd6d1a33f.mp3']]
a="['Laços de Flor (Lost Canvas)','a/35458a69982711.mp3']];";assert s.count(a)==1
s=s.replace(a,"['Laços de Flor (Lost Canvas)','a/35458a69982711.mp3'],"+",".join("['%s','%s']"%(n,f) for n,f in N)+"];")
b='<button data-m="20" aria-pressed="false">';i=s.index(b);j=s.index('</button>',i)+9
s=s[:j]+''.join('<button data-m="%d" aria-pressed="false">%s</button>'%(21+k,n) for k,(n,f) in enumerate(N))+s[j:]
open(P,'w',encoding='utf8').write(s);print('v451 ok')
# v451: Sung ataca mais rápido (quadros de golpe): normal .5 → .7, transformado 1.3 → 1.75 (Yuta continua igual)
s=open(P,encoding='utf8').read()
a="(f.yacc||0)+(f.form?1.3:.5)";assert s.count(a)==1
s=s.replace(a,"(f.yacc||0)+(f.mname==='sjrg'?.25:f.def.sid==='sj'?(f.form?2.3:.7):(f.form?1.3:.5))")  # v456: a lança tem ritmo próprio
open(P,'w',encoding='utf8').write(s);print('v451 sung ok')
