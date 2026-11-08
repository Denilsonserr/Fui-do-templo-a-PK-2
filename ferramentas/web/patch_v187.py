#!/usr/bin/env python3
"""v187 — polimento: cabelo/cabeça/roupa balançando e respiração nos personagens novos (sistema profissional), golpes mais fluidos para todos (quadro anterior desbotando), impacto mais forte. Uso: python3 patch_v187.py <index> (depois do patch_vale)"""
import sys
P=sys.argv[1];s=open(P).read()
def rep(a,b):
    global s
    c=s.count(a);assert c==1,(c,a[:80]);s=s.replace(a,b)
# 1) movimento secundário (cabeça/cabelo e tronco inclinando, respiração) também no sistema profissional (Naruto, Rengoku, Gojo, Madara, Luffy, Vegeta, Gogeta)
rep("if(isPro(f)){if(f.state==='fly'&&!f.moving)e.dy=Math.sin(G.frame*.08)*4;if(f.state==='rushed')e.rot=-.35;if(f.ent&&f.ent.oy)e.dy+=f.ent.oy;return e}",
"if(isPro(f)){if(f.state==='fly'&&!f.moving)e.dy=Math.sin(G.frame*.08)*4;if(f.state==='rushed')e.rot=-.35;if(f.ent&&f.ent.oy)e.dy+=f.ent.oy;"
"const A=f.an;if(A&&G.hq&&PROSW[f.state]&&!(f.ent&&f.ent.key)){const k=PROSW[f.state];e.kU=A.lean*k;e.kH=A.hair*k*1.15;e.hr=.23}"
"if(f.state==='idle'||f.state==='win'){const b=Math.sin(G.frame*.055+(A?A.br:0));e.sy=1+b*.008;e.sx=1-b*.0035}return e}")
rep("function spriteFx(f){","const PROSW={idle:.9,walk:.9,vrun:.7,crouch:.5,charge:.9,win:.8,attack:.5,jump:.8,fly:.8,blockstun:.4,hit:.6};\nfunction spriteFx(f){")
# 2) golpes mais fluidos para TODOS: o quadro anterior desbota por cima do novo (antes só Rengoku/Zoro/Naruto)
rep("if(isRg(f)||isZr(f))rgTween(f,key,x,e);","if(!isNr(f))rgTween(f,key,x,e);")
# 3) impacto: golpe pesado dá um tranco maior na câmera e um brilho branco rápido no ponto do golpe
rep("  if(human)buzz(h.heavy?45:18);","  if(human)buzz(h.heavy?45:18);\n  if(!h.lock&&(h.heavy||h.launcher||h.smash)&&G.hq){G.ck.vx+=a.facing*1.4;flashL(h.px,h.py,'#ffffff',150,.5,6)}")
open(P,'w').write(s);print('ok')
