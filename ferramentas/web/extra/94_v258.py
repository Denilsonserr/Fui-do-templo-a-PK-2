import sys,json,os
# v258: cenário SHIBUYA (`shib`) — 6 imagens do dono (inteiro → 100% destruído). Dados em ferramentas/cenarios/shibuya/ (shib.json do prep_dn + neon, life_s.json do prep_life shib).
# Começa de NOITE (neon aceso) → amanhece → dia com RAIOS DE SOL → entardece → escurece. Destruição em 6 níveis; nos 2 últimos: brasas, cinzas, chão quente e luz de fogo piscando.
P=sys.argv[1];s=open(P,encoding='utf8').read()
D0=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','cenarios','shibuya')
V=json.load(open(os.path.join(D0,'shib.json')));LV=json.load(open(os.path.join(D0,'life_s.json')))
def rep(a,b):
    global s;c=s.count(a);assert c==1,(c,a[:80]);s=s.replace(a,b)
D={'top':V['top'],'L':V['L'],'feet':600,'thr':[0,5,12,20,30,42],'ug':[0,0,0,0,1,2],'day':200,'ph0':.79,'moon':[1300,95],'sun':[1320,-40],'rays':1,'inferno':[0,0,0,.35,.8,1],'lamps':[[455,520],[640,515],[1480,515],[1700,520]],'life':LV,
   'smk':[[],[[1195,330]],[[1100,170],[700,250],[1560,110]],[[600,120],[1000,120],[1450,100],[400,330]],[[480,170],[900,120],[1450,180],[1900,250],[300,300]],[[300,150],[750,120],[1150,180],[1650,130],[1950,200],[1050,520]]],
   'names':['','SHIBUYA ESTÁ TREMENDO!','O ASFALTO RACHOU!','SHIBUYA ESTÁ PEGANDO FOGO!','OS PRÉDIOS DESABARAM!','SHIBUYA FOI DESTRUÍDA!']}
rep('const DNS={','const DNS={"shib":'+json.dumps(D,separators=(',',':'),ensure_ascii=False)+',')
K=2606/2172
rep("  vale:{lit:.9,bloom:.38,","  shib:{lit:.9,bloom:.38,dust:'#b0aab0',peb:'#5a5a62',name:'SHIBUYA',src:'%s',ww:2400,dw:2606,dh:%d,dy:%d,refl:.12,w:['clear'],nw:1,dn:1,camMax:1.15,camMin:.9},\n  vale:{lit:.9,bloom:.38,"%(V['L'][0]['far'],round(724*K),round(486-640*K)))
rep("  vale:{rim:'#eef4ff',","  shib:{rim:'#fff0dc',lx:-.35,ly:-.85,amb:'#4a6ab8',aa:.12,bnc:'#c8b8c8',ba:.16,pt:'dust',mote:'#ffe6c8'},\n  vale:{rim:'#eef4ff',")
rep('const STH={"vale": "','const STH={"shib": "%s", "vale": "'%V['thumb'])
# efeitos novos no dnLife: raios de sol de dia + inferno (brasas, cinzas, chão quente, luz de fogo)
rep("function dnLife(lv,k,A,fu,fv,sc,n,t){","""const DNE=[],DNA=[];
function dnRays(lv,fu,fv,sc,n,t){const d=(1-n)*(1-DN.sun*.5)*(1-Math.min(.85,lv*.2));if(d<.04)return;const sx=fu(CUP.sun[0]+Math.sin(t*.0015)*30),sy=fv(CUP.sun[1]);ctx.save();ctx.globalCompositeOperation='lighter';
  const R=1100*sc;for(let i=0;i<9;i++){const a0=Math.PI*(.18+i*.075)+Math.sin(t*.004+i*1.9)*.025,w=.03+.018*Math.sin(t*.006+i*2.7),a=(.11+.06*Math.sin(t*.01+i*1.3))*d;
    const g=ctx.createRadialGradient(sx,sy,0,sx,sy,R);g.addColorStop(0,`rgba(255,248,220,${a*2.2})`);g.addColorStop(.45,`rgba(255,236,190,${a})`);g.addColorStop(1,'rgba(255,230,180,0)');ctx.fillStyle=g;
    ctx.beginPath();ctx.moveTo(sx,sy);ctx.arc(sx,sy,R,a0-w,a0+w);ctx.closePath();ctx.fill()}
  const gr=ctx.createRadialGradient(sx,sy,0,sx,sy,260*sc);gr.addColorStop(0,`rgba(255,250,230,${.55*d})`);gr.addColorStop(.3,`rgba(255,240,200,${.2*d})`);gr.addColorStop(1,'rgba(255,230,180,0)');ctx.fillStyle=gr;ctx.fillRect(sx-260*sc,sy-260*sc,520*sc,520*sc);
  for(let i=0;i<4;i++){const f=.25+i*.2,x=sx+(fu(1086)-sx)*f*1.6,y=sy+(fv(560)-sy)*f*1.6,r=(18+i*14)*sc;ctx.globalAlpha=.12*d;ctx.fillStyle=['#ffe8a0','#a0d8ff','#ffc0e0','#c8ffb0'][i];ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill()}ctx.restore()}
function dnInferno(lv,k,A,fu,fv,sc,n,t){const I=CUP.inferno,f=(I[lv]||0)*(lv===A?1:k)+(I[A]||0)*(lv===A?0:1-k);if(f<.02)return;const x0=CAM.x,w=VW/CAM.z,yT=H-H/CAM.z,hh=H/CAM.z,run=G.hitstop<=0&&!G.paused;
  ctx.save();ctx.globalCompositeOperation='lighter';
  const fl=.75+.25*Math.sin(t*.21)+.12*Math.sin(t*.53+1)+.08*Math.sin(t*1.7);
  const gg=ctx.createLinearGradient(0,FLOOR+40,0,yT+hh*.35);gg.addColorStop(0,`rgba(255,110,30,${.30*f*fl})`);gg.addColorStop(.5,`rgba(255,70,20,${.10*f*fl})`);gg.addColorStop(1,'rgba(255,60,20,0)');ctx.fillStyle=gg;ctx.fillRect(x0-40,yT,w+80,hh+60);
  if(DNE.length<Math.round(120*f)&&run)for(let i=0;i<3;i++)DNE.push({x:x0+Math.random()*w,y:FLOOR+rand(0,80),vy:-rand(.6,2.2),vx:rand(-.6,.6),ph:Math.random()*6,s:rand(1.2,3.6),l:0,m:rand(140,320),c:pick(['255,150,40','255,200,80','255,100,30','255,230,140'])});
  for(const e of DNE){if(run){e.l++;e.y+=e.vy;e.x+=e.vx+Math.sin(t*.03+e.ph)*.7;e.vy*=.997}const a=Math.min(1,e.l/20,(e.m-e.l)/50)*f;if(a<=0)continue;ctx.globalAlpha=a;const r=e.s*(1+.3*Math.sin(t*.4+e.ph));
    const g=ctx.createRadialGradient(e.x,e.y,0,e.x,e.y,r*3);g.addColorStop(0,`rgba(${e.c},1)`);g.addColorStop(.35,`rgba(${e.c},.5)`);g.addColorStop(1,`rgba(${e.c},0)`);ctx.fillStyle=g;ctx.fillRect(e.x-r*3,e.y-r*3,r*6,r*6)}
  for(let i=DNE.length-1;i>=0;i--){const e=DNE[i];if(e.l>e.m||e.y<yT-40)DNE.splice(i,1)}
  ctx.globalCompositeOperation='source-over';
  if(DNA.length<Math.round(60*f)&&run&&Math.random()<.5)DNA.push({x:x0+Math.random()*w,y:yT-10,vy:rand(.3,.9),ph:Math.random()*6,s:rand(1.5,3.5),r:Math.random()*6});
  ctx.fillStyle='#3a3438';for(const a of DNA){if(run){a.y+=a.vy;a.x+=Math.sin(t*.02+a.ph)*.6;a.r+=.03}ctx.globalAlpha=.55*f;ctx.save();ctx.translate(a.x,a.y);ctx.rotate(a.r);ctx.fillRect(-a.s,-a.s*.35,a.s*2,a.s*.7);ctx.restore()}
  for(let i=DNA.length-1;i>=0;i--)if(DNA[i].y>FLOOR+80)DNA.splice(i,1);
  ctx.globalCompositeOperation='overlay';ctx.globalAlpha=.09*f*fl;ctx.fillStyle='#ff5a1a';ctx.fillRect(x0-40,yT-40,w+80,hh+80);
  ctx.restore();if(f>.6&&run&&G.mode==='fight'&&Math.random()<.004*f){G.shake=Math.max(G.shake,6)}}
function dnLife(lv,k,A,fu,fv,sc,n,t){if(CUP.rays)dnRays(lv,fu,fv,sc,n,t);if(CUP.inferno)dnInferno(lv,k,A,fu,fv,sc,n,t);""")
# limpa as brasas ao trocar de cenário
rep("function setStage(k){STAGE=STG[k]||STG.cupula;","function setStage(k){STAGE=STG[k]||STG.cupula;try{DNE.length=0;DNA.length=0}catch(e){}")
open(P,'w',encoding='utf8').write(s);print('v258 shibuya ok')
