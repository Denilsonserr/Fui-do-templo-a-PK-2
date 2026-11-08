#!/usr/bin/env python3
"""v190 — Broly: combo básico só de socos (5 socos rápidos e fortes + 1 soco pesado que ATORDOA). Uso: python3 patch_v190.py <index> (depois do patch_v189)"""
import sys
P=sys.argv[1];s=open(P).read()
def rep(a,b):
    global s
    c=s.count(a);assert c==1,(c,a[:80]);s=s.replace(a,b)
# quadros (folha antiga do Broly: combo 0 guarda, 1 soco reto, 2 soco longo, 3 gancho armado; dash 0 = soco avançando com poeira)
rep("FR.br=FR.brf=Object.assign({},FR.zed,{","FR.br=FR.brf=Object.assign({},FR.zed,{bp1:[['combo',0],['combo',1],['combo',1,'combo',0]],bp2:[['combo',3],['combo',2],['combo',2,'combo',0]],bp3:[['combo',0],['combo',1],['combo',1,'combo',3]],bp4:[['combo',3],['combo',2],['combo',2,'combo',0]],bp5:[['combo',0],['combo',1],['combo',1,'combo',3]],bp6:[['combo',3],['dash',0],['dash',0,'combo',0]],")
rep("const MOVES={\n","""const MOVES={
  bp1:{su:3,ac:3,rc:7,dmg:44,hb:[30,-262,140,110],kb:2,hs:16,next:'bp2',lean:2.2,cat:'punch'},
  bp2:{su:3,ac:3,rc:7,dmg:48,hb:[30,-262,145,110],kb:2,hs:16,next:'bp3',lean:2.4,cat:'punch'},
  bp3:{su:3,ac:3,rc:7,dmg:50,hb:[30,-262,140,110],kb:2.2,hs:17,next:'bp4',lean:2.4,cat:'punch'},
  bp4:{su:3,ac:3,rc:8,dmg:54,hb:[30,-262,145,110],kb:2.2,hs:17,next:'bp5',lean:2.6,cat:'punch'},
  bp5:{su:4,ac:3,rc:8,dmg:60,hb:[30,-262,150,110],kb:2.4,hs:18,next:'bp6',lean:2.8,cat:'punch'},
  bp6:{su:9,ac:5,rc:16,dmg:115,hb:[20,-280,170,170],kb:4,hs:26,heavy:1,lean:4.5,brStun:1,cat:'punch'},
""")
# soco no chão do Broly = corrente nova (sem o gancho que sobe voando)
rep("if(isBr(f)){if(bufd(f,'sr')){use(f,'sr');if(trySR(f,o))return true}","if(isBr(f)){if(!air&&bufd(f,'punch')&&!f.inp.down){use(f,'punch');startMove(f,acPick(f,'bp1'));return true}if(bufd(f,'sr')){use(f,'sr');if(trySR(f,o))return true}")
# soco pesado final: ATORDOA (fica parado tomando, sem cair nem voar)
rep("  if(!h.lock&&h.kind!=='beam'&&(d.x<=80||d.x>=WW-80)){","  if(a.move&&a.move.brStun&&!h.lock&&d.state==='hit'&&d.hp>0){d.hitstun=Math.max(d.hitstun||0,58);d.vx=a.facing*3;d.stunFx=58;txt(d.x,d.y-300,'ATORDOADO!','#ffe14a');ring(h.px,h.py,'#7dff5c',190,20,6);G.shake=Math.max(G.shake,16);G.hitstop=Math.max(G.hitstop,9)}\n  if(!h.lock&&h.kind!=='beam'&&(d.x<=80||d.x>=WW-80)){")
# estrelinhas girando na cabeça de quem está atordoado
rep("function updFighter(f,o){cmbCD(f);","function updFighter(f,o){cmbCD(f);if(f.stunFx>0){f.stunFx--;if(f.state!=='hit')f.stunFx=0;else if(G.frame%5===0){const a=G.frame*.25;addP({x:f.x+Math.cos(a)*40,y:f.y-275+Math.sin(a)*10,vx:0,vy:0,life:12,max:12,c:pick(['#ffe14a','#ffffff']),type:'glow',sz:6,g:0})}}")
open(P,'w').write(s);print('ok')
