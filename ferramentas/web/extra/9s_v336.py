import sys
# v336: PVP com time de 3 (um entra quando o outro cai, igual Torre) e sem a troca (tag)
P=sys.argv[1];s=open(P,encoding='utf8').read()
def rep(a,b):
    global s;assert s.count(a)==1,a;s=s.replace(a,b)
rep("G.teams=G.gmode==='torre'?null:","G.teams=G.gmode==='pvp'&&typeof PV!=='undefined'&&PV.fight?PV.fight.teams:G.gmode==='torre'?null:")
rep("TAG.on=!!(G.teams&&G.gmode!=='torre'&&","TAG.on=!!(G.teams&&G.gmode!=='torre'&&G.gmode!=='pvp'&&")
open(P,'w',encoding='utf8').write(s);print('v336 ok')
