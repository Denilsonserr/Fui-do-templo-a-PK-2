import sys
# v334: regeneração das passivas também roda no PVP
P=sys.argv[1];s=open(P,encoding='utf8').read()
a="if(G.gmode==='boss'||G.gmode==='torre'||G.gmode==='caca'){rkCuraTick();psRegTick()}";assert s.count(a)==1,a
s=s.replace(a,"if(G.gmode==='boss'||G.gmode==='torre'||G.gmode==='caca'){rkCuraTick();psRegTick()}else if(G.gmode==='pvp')psRegTick()")
open(P,'w',encoding='utf8').write(s);print('v334 ok')
