# v556: DROPS do jogo todo diminuídos — rkDropF (boss/ranqueada/torre/caça: itens, anel, poção, joia...) multiplicado por rkDropK() (rk.js).
import sys
p=sys.argv[1];s=open(p,encoding='utf8').read()
a="rkDropF=()=>1+(eqDrop()+RKPDN+psSum().drop)/100+(rkEvD()-1);"
assert s.count(a)==1,'v556 a'
s=s.replace(a,"rkDropF=()=>(1+(eqDrop()+RKPDN+psSum().drop)/100+(rkEvD()-1))*(typeof rkDropK==='function'?rkDropK():1);")
open(p,'w',encoding='utf8').write(s)
