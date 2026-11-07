#!/usr/bin/env python3
"""v177 — anti-combo infinito (parede). Uso: python3 patch_combo.py <index.html>  (depois do patch_torre)"""
import sys
P=sys.argv[1];s=open(P).read()
def rep(a,b):
    global s
    c=s.count(a);assert c==1,(c,a[:80]);s=s.replace(a,b)
# 1) empurra quem bate quando o rival está encostado na parede (não dá para prender)
rep("  if(G.gmode==='treino'&&d.hp<=0)d.hp=1;\n  if(d.hp<=0)ko(a,d);\n  return true;\n}",
"  if(!h.lock&&h.kind!=='beam'&&(d.x<=80||d.x>=WW-80)){const dr=Math.sign(d.x-a.x)||a.facing,pb=Math.min(22,6+(h.kb||0)*1.2);a.x=clamp(a.x-dr*pb,40,WW-40)}\n  if(!h.lock&&h.kind!=='beam')d.stunH=(d.stunH||0)+1;\n  if(G.gmode==='treino'&&d.hp<=0)d.hp=1;\n  if(d.hp<=0)ko(a,d);\n  return true;\n}")
# 2) quem fica preso apanhando >3,3 s seguidos ou 24 golpes seguidos escapa (invencível um pouco e empurra o rival)
rep("  f.st++;if(f.grounded)f.jug=0;",
"  f.st++;if(f.grounded)f.jug=0;\n  if((f.state==='hit'||f.state==='airhit'||f.state==='down')&&G.phase==='fight'&&!G.cine&&!G.trans&&!G.comic&&!G.rush&&!G.sc){f.stunT=(f.stunT||0)+1;if((f.stunT>200||(f.stunH||0)>=24)&&!f.ko&&f.hp>0&&o)comboBreak(f,o)}else if(f.state!=='getup'){f.stunT=0;f.stunH=0}")
rep("function updFighter(f,o){",
"""function comboBreak(f,o){f.stunT=0;f.stunH=0;f.inv=Math.max(f.inv,75);f.jug=99;if(f.grounded&&f.state==='hit')f.hitstun=Math.min(f.hitstun||0,4);
  const dr=Math.sign(o.x-f.x)||-f.facing;o.x=clamp(o.x+dr*140,40,WW-40);o.vx=dr*7;o.combo=0;if(f.x<=80||f.x>=WW-80)f.x=clamp(f.x-dr*60,40,WW-40);
  ring(f.x,f.y-140,'#ffffff',170,18,6);ring(f.x,f.y-140,'#7fe0ff',110,14,4);txt(f.x,f.y-290,'ESCAPE!','#7fe0ff');G.hitstop=Math.max(G.hitstop,6);G.shake=Math.max(G.shake,8);try{SFX.clang()}catch(e){}}
function updFighter(f,o){""")
open(P,'w').write(s);print('ok')
