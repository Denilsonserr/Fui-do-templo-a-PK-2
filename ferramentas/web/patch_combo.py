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
"  f.st++;if(f.grounded)f.jug=0;\n  if((f.state==='hit'||f.state==='airhit'||f.state==='down')&&G.phase==='fight'&&!G.cine&&!G.trans&&!G.comic&&!G.rush&&!G.sc){f.stunT=(f.stunT||0)+1;const wl=f.x<=95||f.x>=WW-95;if(wl&&((f.stunH||0)>=8||f.stunT>110)&&!f.ko&&f.hp>0&&o&&!o.ko)wallBreak(f,o);else if((f.stunT>200||(f.stunH||0)>=24)&&!f.ko&&f.hp>0&&o)comboBreak(f,o)}else if(f.state!=='getup'){f.stunT=0;f.stunH=0}\n  if(f.wbT>0){f.wbT--;if(f.wbT<=0){f.rushKey=null;if(f.state==='blockstun')neutral(f)}}")
rep("function updFighter(f,o){",
"""function comboBreak(f,o){f.stunT=0;f.stunH=0;f.inv=Math.max(f.inv,75);f.jug=99;if(f.grounded&&f.state==='hit')f.hitstun=Math.min(f.hitstun||0,4);
  const dr=Math.sign(o.x-f.x)||-f.facing;o.x=clamp(o.x+dr*140,40,WW-40);o.vx=dr*7;o.combo=0;if(f.x<=80||f.x>=WW-80)f.x=clamp(f.x-dr*60,40,WW-40);
  ring(f.x,f.y-140,'#ffffff',170,18,6);ring(f.x,f.y-140,'#7fe0ff',110,14,4);txt(f.x,f.y-290,'ESCAPE!','#7fe0ff');G.hitstop=Math.max(G.hitstop,6);G.shake=Math.max(G.shake,8);try{SFX.clang()}catch(e){}}
/* preso na parede: o rival dá um soco/chute e joga quem estava batendo para o meio do cenário (sem dano) */
function wallBreak(f,o){f.stunT=0;f.stunH=0;f.inv=Math.max(f.inv,45);f.jug=0;const R=RUSHK[ssid(f)]||RUSHK[f.def.sid],dir=f.x<WW/2?1:-1;
  f.y=FLOOR;f.grounded=true;f.flying=false;f.vx=0;f.vy=0;f.facing=dir;f.state='blockstun';f.hitstun=18;f.st=0;f.move=null;f.rushKey=R?R[Math.random()<.5?1:2]||R[0]:null;f.wbT=18;
  o.move=null;o.state='airhit';o.st=0;o.grounded=false;o.flying=false;o.y=Math.min(o.y,FLOOR-2);o.vy=-11;o.vx=clamp((WW/2-o.x)/34,-24,24);if(Math.abs(o.vx)<9)o.vx=dir*9;o.bounced=false;o.inv=Math.max(o.inv,30);o.combo=0;o.hitstun=24;o.facing=-dir;
  const px=f.x+dir*80,py=f.y-150;ring(px,py,'#ffffff',150,16,6);ring(px,py,'#ffd23f',90,12,4);spark(px,py,'#fff4c2',14,12);txt(f.x+dir*230,f.y-290,'SAIU DA PAREDE!','#ffd23f');fzTag(f,'Contra-golpe!');
  G.hitstop=Math.max(G.hitstop,8);G.shake=Math.max(G.shake,12);try{SFX.hit(true,2)}catch(e){}buzz(60)}
function updFighter(f,o){""")
open(P,'w').write(s);print('ok')
