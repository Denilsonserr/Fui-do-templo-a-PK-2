import sys,json,os
# v274: cenário FLORESTA SOMBRIA (`flo`) — só do modo CAÇA (lobo). 5 imagens do dono (inteira → em chamas) em ferramentas/cenarios/floresta/.
# Sempre de NOITE; a destruição NÃO vem dos golpes (thr altíssimo): sobe quando o lobo sobe de nível (CASC no rk.js chama dnBreak).
# Névoa (`fog` por nível): mais forte e assustadora no começo, rala quando a floresta já está destruída/queimando.
P=sys.argv[1];s=open(P,encoding='utf8').read()
D0=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','cenarios','floresta')
V=json.load(open(os.path.join(D0,'flo.json')));LV=json.load(open(os.path.join(D0,'life_f.json')))
def rep(a,b):
    global s;c=s.count(a);assert c==1,(c,a[:80]);s=s.replace(a,b)
D={'top':V['top'],'L':V['L'],'feet':640,'thr':[0,1e9,1e9,1e9,1e9],'ug':[0,0,0,0,0],'day':1e6,'ph0':.25,'moon':[1700,70],'sun':[1320,-40],'rays':0,'inferno':[0,0,0,0,.75],'lamps':[],'life':LV,
   'fog':[1,.85,.7,.5,.35],
   'smk':[[],[],[[520,300]],[[480,250],[1500,230],[900,320]],[[300,200],[700,150],[1150,260],[1700,150],[1950,250]]],
   'names':['','A FLORESTA ESTÁ TREMENDO!','AS ÁRVORES ESTÃO CAINDO!','A FLORESTA FOI DEVASTADA!','A FLORESTA ESTÁ EM CHAMAS!']}
rep('const DNS={','const DNS={"flo":'+json.dumps(D,separators=(',',':'),ensure_ascii=False)+',')
K=2606/2172
rep("  vale:{lit:.9,bloom:.38,","  flo:{lit:.82,bloom:.3,dust:'#8a9aa0',peb:'#4a5058',name:'FLORESTA SOMBRIA',src:'%s',ww:2400,dw:2606,dh:%d,dy:%d,refl:0,w:['clear'],nw:1,dn:1,hid:1,camMax:1.15,camMin:.9},\n  vale:{lit:.9,bloom:.38,"%(V['L'][0]['far'],round(724*K),round(486-640*K)))
rep("  vale:{rim:'#eef4ff',","  flo:{rim:'#bcd4ff',lx:-.3,ly:-.9,amb:'#2a4a7a',aa:.14,bnc:'#5a7a8a',ba:.12,pt:'dust',mote:'#b8d0ff'},\n  vale:{rim:'#eef4ff',")
rep('const STH={"shib": "','const STH={"flo": "%s", "shib": "'%V['thumb'])
# névoa da floresta (atrás dos lutadores)
rep("function dnLife(lv,k,A,fu,fv,sc,n,t){","""function dnFog(lv,k,A,t){const F=CUP.fog,f=(F[lv]||0)*(lv===A?1:k)+(F[A]||0)*(lv===A?0:1-k);if(f<.02)return;const x0=CAM.x,w=VW/CAM.z;ctx.save();
  const gb=ctx.createLinearGradient(0,FLOOR-230,0,FLOOR+40);gb.addColorStop(0,'rgba(150,175,215,0)');gb.addColorStop(.6,`rgba(150,175,215,${.30*f})`);gb.addColorStop(1,`rgba(170,190,225,${.42*f})`);ctx.fillStyle=gb;ctx.fillRect(x0-40,FLOOR-230,w+80,280);
  for(let i=0;i<7;i++){const sp=.000035*(1+i%3)*(i%2?1:-1),u=(((i*.37+t*sp)%1.4)+1.4)%1.4-.2,x=x0+u*w,y=FLOOR-60-(i%3)*85,rx=w*(.28+(i%2)*.1),ry=70+(i%3)*25;
    ctx.save();ctx.translate(x,y);ctx.scale(rx/ry,1);const g=ctx.createRadialGradient(0,0,0,0,0,ry);g.addColorStop(0,`rgba(160,185,225,${.26*f})`);g.addColorStop(1,'rgba(160,185,225,0)');ctx.fillStyle=g;ctx.fillRect(-ry,-ry,ry*2,ry*2);ctx.restore()}
  ctx.restore()}
function dnLife(lv,k,A,fu,fv,sc,n,t){if(CUP.fog)dnFog(lv,k,A,t);""")
open(P,'w',encoding='utf8').write(s);print('v274 floresta ok')
