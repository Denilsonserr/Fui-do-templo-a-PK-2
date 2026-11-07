#!/usr/bin/env python3
"""v179 — Zoro novo. Uso: python3 patch_zr.py <index> <pasta_build> (pasta com zr.js, zr_new.json, out/). Aplicar depois do patch_v178."""
import sys,os,json,shutil
P,D=sys.argv[1],sys.argv[2];s=open(P).read()
def rep(a,b):
    global s
    c=s.count(a);assert c==1,(c,a[:80]);s=s.replace(a,b)
www=os.path.dirname(os.path.abspath(P))
for f in os.listdir(os.path.join(D,'out')):shutil.copy(os.path.join(D,'out',f),os.path.join(www,'a',f))
js=open(os.path.join(D,'zr.js')).read().replace('__ZRN__',open(os.path.join(D,'zr_new.json')).read())
rep("function drawRg(){",js+"\nfunction drawRg(){")
rep("function spriteKey(f){\n","function spriteKey(f){\n  if(isZr(f)&&!f.rushKey){const zk=zrKey(f);if(zk)return zk}\n")
rep("if(f.state==='lfc'||","if(f.state==='zrc'){zrcStep(f);return}\n  if(f.state==='lfc'||")
rep("if(bufd(f,'sp')){use(f,'sp');if(zrSpecial(f,o))return true}\n    if(!air&&bufd(f,'punch')&&!f.inp.down){use(f,'punch');startMove(f,acPick(f,'zs1'));return true}if(!air&&bufd(f,'kick')){use(f,'kick');startMove(f,'zkk');return true}}",
    "if(bufd(f,'sp')){use(f,'sp');if(f.form&&!air){zrCombo(f,o);return true}if(zrSpecial(f,o))return true}\n    if(!air&&bufd(f,'punch')&&!f.inp.down){use(f,'punch');startMove(f,acPick(f,'zp1'));return true}if(!air&&bufd(f,'kick')){use(f,'kick');startMove(f,'zp3');return true}}")
rep("walk:4.5,power:1.1,frame:'#3fae4a'","walk:5.8,power:1.25,frame:'#3fae4a'")
rep("isRg(f)?1.9:isNr(f)?2.1:1.35):1)","isRg(f)?1.9:isNr(f)?2.1:isZr(f)?1.95:1.35):(isZr(f)?1.15:1))")
rep("if(m.rgPush&&f.grounded&&f.mf>=m.su-2&&f.mf<=m.su+1)","if(m.zDash&&f.grounded&&f.mf>=m.su-4&&f.mf<=m.su+m.ac-2){f.vx=m.zDash*f.facing*Math.min(speedMul(f),1.5);if(G.frame%2===0)f.ghosts.push({key:spriteKey(f),x:f.x,y:f.y,facing:f.facing,life:10})}\n  if(isZr(f)){f.zrac=(f.zrac||0)+(f.form?.7:.3);while(f.zrac>=1){f.zrac-=1;if(f.mf<m.su+m.ac+m.rc-1)f.mf++}}\n  if(m.rgPush&&f.grounded&&f.mf>=m.su-2&&f.mf<=m.su+1)")
rep("if(isRg(f))return rgAura(f,k);","if(isRg(f))return rgAura(f,k);if(isZr(f)&&(f.form||f.state==='charge'))return zrAura(f,k);")
rep("if(isRg(f))rgTween(f,key,x,e);","if(isRg(f)||isZr(f))rgTween(f,key,x,e);")
rep("if(isRg(f))rgFront(f)}","if(isRg(f))rgFront(f);if(isZr(f))zrFront(f)}")
rep("if(isZr(a)&&h.kind==='sword')smp('sgrd',.75,{gap:.05});","if(isZr(a)&&h.kind==='sword')smp('sgrd',.75,{gap:.05});if(isZr(a)&&a.state==='attack'&&a.move&&a.move.zv){smp('sgrd',.6,{gap:.05});zrSlashMark(h.px,h.py,a.facing,a.form?1.3:1)}")
rep("drawLf();drawRg();drawNr();","drawLf();drawRg();drawZrSl();drawNr();")
open(P,'w').write(s);print('ok')
