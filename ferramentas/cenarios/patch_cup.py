import json
P='/home/claude/fui-do-templo-a-pk-2/www/index.html';s=open(P).read()
R=json.load(open('/home/claude/cup/cup.json'))
def rep(a,b,n=1):
    global s;c=s.count(a);assert c==n,(a[:70],c);s=s.replace(a,b)
C={'top':R['top'],'L':R['L']}
K=2606/2172;dy=round(486-650*K)
rep("ww:2400,dw:2606,dh:1016,dy:-314,refl:0.35,w:[\"clear\"],nw:1}};",
    "ww:2400,dw:2606,dh:1016,dy:-314,refl:0.35,w:[\"clear\"],nw:1},\n  cupula:{lit:.9,bloom:.35,dust:'#d8b48a',peb:'#8a6a4a',name:'CIDADE DAS CÚPULAS',src:'%s',ww:2400,dw:2606,dh:%d,dy:%d,refl:.06,w:['clear','clear','clear','rain'],nw:1,dn:1,camMax:1.75}};"%(R['L'][0]['far'],round(724*K),dy))
rep("dojo:{rim:'#fff4d8',lx:-.3,ly:-.9,amb:'#3a6a2a',aa:.12,bnc:'#e0b070',ba:.18,pt:'petal',mote:'#fff6d8'}};",
    "dojo:{rim:'#fff4d8',lx:-.3,ly:-.9,amb:'#3a6a2a',aa:.12,bnc:'#e0b070',ba:.18,pt:'petal',mote:'#fff6d8'},\n  cupula:{rim:'#fff4dc',lx:-.55,ly:-.82,amb:'#6a98d8',aa:.08,bnc:'#e0bc90',ba:.15,pt:'dust',mote:'#fff6e0'}};")
blk=open('/home/claude/cup/dn.js').read().replace('__CUP__',json.dumps(C,separators=(',',':')))
rep("\nfunction drawStageLayers(){const S=STAGE;","\n"+blk+"\nfunction drawStageLayers(){const S=STAGE;if(S.dn)return drawDN(S);")
rep("function stageLoad(k){const S=STG[k];if(!S)return Promise.resolve();if(S._ld)return S._ld;","function stageLoad(k){const S=STG[k];if(!S)return Promise.resolve();if(S._ld)return S._ld;if(S.dn){S.img=new Image();S.img.src=S.src0;return S._ld=cupLoad()}")
rep("function stageFree(keep){for(const k in STG){if(keep.includes(k)||!STG[k]._ld)continue;const S=STG[k];","function stageFree(keep){for(const k in STG){if(keep.includes(k)||!STG[k]._ld)continue;const S=STG[k];if(S.dn)cupFree();")
rep("G.nextStg=null;stageLoad(cur);setStage(cur);","G.nextStg=null;stageLoad(cur);setStage(cur);if(STAGE.dn){DN.lv=0;DN.from=0;DN.k=1;DN.pts=0;DN.pend=0;DN.smk=[];DN.deb=[];DN.ult=0;DN.tr=0}")
rep("mdTick();gjTick();lfAirTick();rgTick();","mdTick();gjTick();lfAirTick();rgTick();dnTick();")
rep("let zt=Math.min(VW/(dx+400),H/Math.max(1,H-top));zt=clamp(zt,1,G.camMax);","let zt=Math.min(VW/(dx+(STAGE.dn?330:400)),H/Math.max(1,H-top));zt=clamp(zt,1,STAGE.camMax||G.camMax);")
rep("z=clamp(z,1.08,1.7);","z=clamp(z,1.08,Math.max(1.1,Math.min(1.7,2.5/CAM.z)));")
# lutadores mais escuros a noite / alaranjados no por do sol
rep("  // AO: soft inner occlusion","  if(STAGE.night>.02||STAGE.sunset>.02){fbx.globalCompositeOperation='source-atop';if(STAGE.night>.02){fbx.fillStyle=`rgba(14,20,52,${.4*STAGE.night})`;fbx.fillRect(0,0,bw,bh)}if(STAGE.sunset>.02){fbx.fillStyle=`rgba(255,120,50,${.14*STAGE.sunset})`;fbx.fillRect(0,0,bw,bh)}}\n  // AO: soft inner occlusion")
rep('"city": "a/449cdd88123ac1.webp"},STSL=','"city": "a/449cdd88123ac1.webp","cupula": "%s"},STSL='%R['thumb'])
rep("window.__dbg={stg:()=>STAGE.key,prepMatch,","window.__dbg={stg:()=>STAGE.key,prepMatch,DN,")
open(P,'w').write(s);print('ok',dy,round(724*K))
