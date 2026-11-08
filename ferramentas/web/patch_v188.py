#!/usr/bin/env python3
"""v188 — ajuda para acertar (passo de aproximação no início dos golpes de soco/chute no chão). Uso: python3 patch_v188.py <index> (depois do patch_v187)"""
import sys
P=sys.argv[1];s=open(P).read()
def rep(a,b):
    global s
    c=s.count(a);assert c==1,(c,a[:80]);s=s.replace(a,b)
rep("function updAttack(f,o){\n","""/* ajuda de alcance: se o rival está um pouco além do alcance do golpe (até 120 px), o lutador desliza para frente durante o INÍCIO do golpe para encostar. Sem animação nova, sem acerto automático. */
function atkAssist(f,o,m){if(!o||o.ko||m.air||!f.grounded||!m.hb||(m.cat!=='punch'&&m.cat!=='kick')||m.zDash||m.noAs)return;
  if(f.asM!==m){f.asM=m;f.asV=0;const dir=Math.sign(o.x-f.x)||f.facing;if(dir!==f.facing||Math.abs(o.y-f.y)>150||o.state==='down')return;
    const reach=(m.hb[0]+m.hb[2])*(f.form&&isZr(f)&&m.zr?1.4:1),gap=Math.abs(o.x-f.x)-(reach+18);if(gap<=0||gap>120)return;f.asR=gap;f.asV=Math.max(10,Math.min(18,gap/Math.max(2,m.su)))}
  if(f.asV>0&&f.asR>0&&f.mf<=m.su+m.ac&&!f.hasHit){const st=Math.min(f.asR,f.asV);f.vx=f.facing*Math.max(Math.abs(f.vx),st);f.asR-=st;if(Math.abs(o.x-f.x)<70)f.asR=0}}
function updAttack(f,o){
""")
rep("function startMove(f,name){","function startMove(f,name){f.asM=null;")
rep("  else if(f.flying){f.vx*=.9;f.vy*=.9}\n  if(m.nrPush","  else if(f.flying){f.vx*=.9;f.vy*=.9}\n  atkAssist(f,o,m);\n  if(m.nrPush")
open(P,'w').write(s);print('ok')
