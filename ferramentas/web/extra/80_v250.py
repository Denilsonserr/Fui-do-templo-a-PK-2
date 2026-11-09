import sys
# v250: poção de cura roda a cada quadro; o reparo antigo das poções não mexe nas poções de cura/drop (pk)
P=sys.argv[1];s=open(P,encoding='utf8').read()
def rep(a,b):
    global s;assert s.count(a)==1,(a[:80],s.count(a));s=s.replace(a,b)
rep("nrTick();grTick();ytTick();","nrTick();grTick();ytTick();try{if(G.gmode==='boss'||G.gmode==='torre')rkCuraTick()}catch(e){}")
rep("for(const x of L){const v=twPoE(x.r)[0];if(x.v!==v){x.v=v;ch=1}}","for(const x of L){if(x.pk)continue;const v=twPoE(x.r)[0];if(x.v!==v){x.v=v;ch=1}}")
open(P,'w',encoding='utf8').write(s);print('v250 ok')
