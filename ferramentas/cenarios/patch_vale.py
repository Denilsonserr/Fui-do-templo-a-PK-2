#!/usr/bin/env python3
"""v186 — VALE DO FIM (`vale`). Uso: python3 patch_vale.py <index> (depois do patch_v182). Pasta /home/claude/vale: val.json (prep_dn) e life_v.json (prep_life vale)."""
import sys,json
P=sys.argv[1];s=open(P).read()
def rep(a,b):
    global s
    c=s.count(a);assert c==1,(c,a[:80]);s=s.replace(a,b)
V=json.load(open('/home/claude/vale/val.json'));LV=json.load(open('/home/claude/vale/life_v.json'))
FALL=[[[1012,240,1160,592]],[[1012,240,1160,592]],[[1012,240,1160,592]],[[1030,232,1162,590]],[[1028,430,1150,560]],[[1088,250,1172,455]]]
D={'top':V['top'],'L':V['L'],'feet':600,'thr':[0,5,12,20,30,42],'ug':[0,0,0,0,1,2],'day':300,'ph0':.74,'rain':1,'storm':1,'moon':[1840,80],'lamps':[],'life':LV,'falls':FALL,
   'smk':[[],[],[[150,110],[280,180]],[[200,90],[480,90],[300,380]],[[180,90],[420,110],[1950,150],[1700,420],[600,460]],[[200,120],[560,200],[1600,150],[1900,250],[1300,400],[800,420]]],
   'names':['','O VALE ESTÁ TREMENDO!','AS ROCHAS ESTÃO CAINDO!','O PENHASCO DESABOU!','AS ESTÁTUAS ESTÃO RACHANDO!','O VALE DO FIM CAIU!']}
rep('const DNS={','const DNS={"vale":'+json.dumps(D,separators=(',',':'))+',')
K=2606/2172
rep("camMax:1.15,camMin:.9}};\nSTG.dominio","camMax:1.15,camMin:.9},\n  vale:{lit:.9,bloom:.38,dust:'#b8b0a0',peb:'#6a6a70',name:'VALE DO FIM',src:'%s',ww:2400,dw:2606,dh:%d,dy:%d,refl:.32,w:['clear'],nw:1,dn:1,camMax:1.15,camMin:.9}};\nSTG.dominio"%(V['L'][0]['far'],round(724*K),round(486-662*K)))
rep("  folha:{rim:'#fff1d0',","  vale:{rim:'#eef4ff',lx:-.4,ly:-.85,amb:'#4a78c0',aa:.13,bnc:'#8ab0d8',ba:.18,pt:'glint',mote:'#e6f0ff'},\n  folha:{rim:'#fff1d0',")
rep('const STH={"namek": "','const STH={"vale": "%s", "namek": "'%V['thumb'])
# cachoeira com movimento + nevoa na base; tempestade com relampagos no nivel final
rep("  const LF=CUP.life;if(!LF)return;","""  const FW=CUP.falls&&CUP.falls[lv];if(FW&&FW.length){ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle='#ffffff';ctx.lineCap='round';const na=1-n*.55;
    for(const r of FW){const x0=fu(r[0]),x1=fu(r[2]),y0=fv(r[1]),y1=fv(r[3]),w=x1-x0,h=y1-y0;
      for(let i=0;i<18;i++){const u=(i*.1371+.03)%1,x=x0+w*(.06+u*.88),v=3.2+(i%4)*.9,sp=(t*v*sc+i*97)%h,L=h*(.12+(i%3)*.05);ctx.globalAlpha=(.09+.06*Math.sin(t*.09+i))*na;ctx.lineWidth=(1.6+i%3)*sc;ctx.beginPath();ctx.moveTo(x,y0+sp);ctx.lineTo(x,Math.min(y1,y0+sp+L));ctx.stroke()}
      for(let i=0;i<6;i++){const xx=x0+w*(.05+.18*i)+Math.sin(t*.03+i)*8*sc,yy=y1-6*sc-Math.abs(Math.sin(t*.02+i))*10*sc,rr=(22+10*Math.sin(t*.05+i*1.7))*sc,g=ctx.createRadialGradient(xx,yy,0,xx,yy,rr);g.addColorStop(0,'rgba(255,255,255,.2)');g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;ctx.globalAlpha=na;ctx.fillRect(xx-rr,yy-rr,rr*2,rr*2)}}ctx.restore()}
  if(CUP.storm&&DN.lv===CUP.L.length-1&&G.mode==='fight'){if(DN.lt>0)DN.lt--;else if(G.hitstop<=0&&Math.random()<.0035)DN.lt=16;
    if(DN.lt>0){ctx.save();ctx.globalAlpha=(DN.lt/16)*.32*(DN.lt%5<2?1:.45);ctx.fillStyle='#dfe4ff';ctx.fillRect(CAM.x-60,H-H/CAM.z-60,VW/CAM.z+120,H/CAM.z+120);ctx.restore()}}
  const LF=CUP.life;if(!LF)return;""")
rep("while(R.length<70)R.push(","while(R.length<(CUP.storm?150:70))R.push(")
rep("ctx.globalAlpha=.28*k2;","ctx.globalAlpha=(CUP.storm?.42:.28)*k2;")
open(P,'w').write(s);print('ok')
