#!/usr/bin/env python3
"""v178 — quem não voa (Rengoku, Naruto, Zoro, Aokiji; Luffy só no Gear 4) + buff do Broly. Uso: python3 patch_v178.py <index> (depois do patch_combo)"""
import sys
P=sys.argv[1];s=open(P).read()
def rep(a,b):
    global s
    c=s.count(a);assert c==1,(c,a[:80]);s=s.replace(a,b)
# --- não voa ---
rep("function startFly(f){if(isRg(f)||isNr(f)){","const noFly=f=>isRg(f)||isNr(f)||isZr(f)||isAo(f);\nfunction startFly(f){if(noFly(f)){")
rep("  if(isRg(f)||isNr(f)){f.state='jump';f.st=0;f.move=null;f.flying=false;","  if(noFly(f)||(isLf(f)&&!f.form)){f.state='jump';f.st=0;f.move=null;f.flying=false;")
rep("if(o.flying){f.flying=true;f.grounded=false;f.y=o.y;f.vy=0}","if(o.flying&&!noFly(f)&&!(isLf(f)&&!f.form)){f.flying=true;f.grounded=false;f.y=o.y;f.vy=0}")
# --- Broly: mais rápido e mais forte ---
rep("walk:4.3,power:1.15,frame:'#4bd62f'","walk:5.3,power:1.32,frame:'#4bd62f'")
rep("speedMul(f){return (f.spark>0?1.2:1)*(f.form?(isGk(f)?1.6:isBr(f)?1.8:","speedMul(f){return (f.spark>0?1.2:1)*(isBr(f)&&!f.form?1.12:1)*(f.form?(isGk(f)?1.6:isBr(f)?2.0:")
rep("if(isBr(f)&&f.form){f.bacc=(f.bacc||0)+.55;","if(isBr(f)){f.bacc=(f.bacc||0)+(f.form?.8:.3);")
# --- Broly: ARMADURA — atacando, aguenta golpes leves sem parar o golpe (2 normal / 4 transformado, recarrega em 3 s) ---
rep("function applyHit(a,d,h){\n  if(d.ko)return false;",
"function applyHit(a,d,h){\n  if(d.ko)return false;\n  const brA=isBr(d)&&d.state==='attack'&&d.move&&!h.lock&&!h.heavy&&!h.launch&&!h.launcher&&!h.smash&&h.kind!=='beam'&&G.frame>=(d.brCD||0)&&(d.brN||0)<(d.form?4:2),brS=brA?{state:d.state,move:d.move,mf:d.mf,st:d.st,vx:d.vx,vy:d.vy,grounded:d.grounded,y:d.y}:null;")
rep("  if(!h.lock&&h.kind!=='beam')d.stunH=(d.stunH||0)+1;",
"  if(brS&&d.hp>0&&d.state!=='blockstun'){Object.assign(d,brS);d.hitstun=0;d.brN=(d.brN||0)+1;if(d.brN>=(d.form?4:2)){d.brN=0;d.brCD=G.frame+180}txt(d.x,d.y-270,'ARMADURA!','#7dff6a');ring(d.x,d.y-140,'#5cff4a',110,12,4)}\n  else if(!h.lock&&h.kind!=='beam')d.stunH=(d.stunH||0)+1;")
rep("window.__dbg={stg:()=>STAGE.key,prepMatch,","window.__dbg={stg:()=>STAGE.key,prepMatch,applyHit,")
open(P,'w').write(s);print('ok')
