import sys
# v252: baús da Torre também dão POÇÃO DE CURA, POÇÃO DE DROP e ANEL DE DROP (pedido do dono; vale para todo baú)
P=sys.argv[1];s=open(P,encoding='utf8').read()
def rep(a,b):
    global s;assert s.count(a)==1,(a[:80],s.count(a));s=s.replace(a,b)
rep("function twBauOpen(B){const ri=TWRK.indexOf(B.r),L=[];for(let i=0;i<B.n;i++){","function twBauOpen(B){const ri=TWRK.indexOf(B.r),L=[];for(let i=0;i<B.n;i++){{const x=rkBauX(B.r);if(x){L.push(x);continue}}")
rep("<img class=\"it\" src=\"${twIco(c.t,c.R.k)}\" alt=\"\"><b class=\"lb\">${c.t==='poc'?'POÇÃO':c.E.n} ${c.R.n}</b>","<img class=\"it\" src=\"${c.ic||twIco(c.t,c.R.k)}\" alt=\"\"><b class=\"lb\">${c.nm||(c.t==='poc'?'POÇÃO':c.E.n)} ${c.R.n}</b>")
rep("if(c.t==='poc')twAddPoc(c.R);else twAddItem(c.E,c.R)};","if(c.pk)twAddPoc(c.pk);else if(c.ring)rkAddRing(c.ring);else if(c.t==='poc')twAddPoc(c.R);else twAddItem(c.E,c.R)};")
open(P,'w',encoding='utf8').write(s);print('v252 ok')
