import sys
# v470: combo do SUNG (Dança das Sombras) com 11 golpes + finalizador mais forte (Yuta continua igual)
P=sys.argv[1];s=open(P,encoding='utf8').read()
a="const HK=f.ytCK==='cmb1'?{4:30,5:32,7:34,8:34,9:36,10:36,11:38}:"
assert s.count(a)==1
s=s.replace(a,"const HK=f.def.sid==='sj'?(M?{1:34,2:35,3:36,4:37,5:38,6:39,7:40,8:41,9:42,10:44,11:46}:{1:30,2:31,3:32,4:33,5:34,6:35,7:36,8:37,9:38,10:40,11:42}):f.ytCK==='cmb1'?{4:30,5:32,7:34,8:34,9:36,10:36,11:38}:")
a="const h={dmg:M?150:120,kb:0,hs:22,heavy:1,px:o.x-fw*10,py:o.y-150,kind:'melee',lock:1};applyHit(f,o,h);f.ytHeld=false;"
assert s.count(a)==1
s=s.replace(a,"const h={dmg:f.def.sid==='sj'?(M?190:150):M?150:120,kb:0,hs:22,heavy:1,px:o.x-fw*10,py:o.y-150,kind:'melee',lock:1};applyHit(f,o,h);f.ytHeld=false;")
open(P,'w',encoding='utf8').write(s);print('v470 ok')
