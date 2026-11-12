import sys,re
# v372: Ultra/4K mais leves.
# 1) drawLit (luz dos personagens) era feito na resolução TOTAL da tela (no 4K ~2600 px) com ~15 passes por lutador → agora num buffer menor (G.litCap px por px de tela) e esticado.
# 2) teto de resolução menor: Ultra 1.6x, 4K 2.2x e no máx. ~2,1 milhões de pixels.
# 3) resolução dinâmica: se mesmo no mínimo continuar lento, desliga sozinha os efeitos caros (AO, pop, bloom) em vez de desistir.
P=sys.argv[1];s=open(P,encoding='utf8').read()
i=s.index('function drawLit(f,key,x,y,facing,e,mode){');j=s.index('const AOC=document.createElement',i);F=s[i:j]
a='if(FB.width<bw||FB.height<bh){FB.width=RB.width=Math.max(FB.width,bw);FB.height=RB.height=Math.max(FB.height,bh)}'
assert a in F;k=F.index(a);head=F[:k];tail=F[k:]
tail=re.sub(r'\bbw\b','sw',tail);tail=re.sub(r'\bbh\b','sh',tail)
tail=tail.replace('fbx.setTransform(T.a,T.b,T.c,T.d,T.e-bx,T.f-by)','fbx.setTransform(T.a*q,T.b*q,T.c*q,T.d*q,(T.e-bx)*q,(T.f-by)*q)')
tail=tail.replace('lx=T.a*l.x+T.e-bx,ly=T.d*l.y+T.f-by,rr=Math.max(10,l.r*Math.abs(T.a))','lx=(T.a*l.x+T.e-bx)*q,ly=(T.d*l.y+T.f-by)*q,rr=Math.max(10,l.r*Math.abs(T.a)*q)')
tail=tail.replace('const k=r.w*Math.abs(T.a)*1.6;','const k=r.w*Math.abs(T.a)*1.6*q;')
tail=tail.replace('ctx.drawImage(RB,0,0,sw,sh,bx+dx,by+dy,sw,sh)','ctx.drawImage(RB,0,0,sw,sh,bx+dx,by+dy,bw,bh)')
tail=tail.replace('ctx.drawImage(FB,0,0,sw,sh,bx,by,sw,sh);ctx.restore()}','ctx.drawImage(FB,0,0,sw,sh,bx,by,bw,bh);ctx.restore()}')
assert tail.count('*q')>=6 and 'bx+dx,by+dy,bw,bh' in tail and 'bx,by,bw,bh);ctx.restore' in tail
head+='const q=Math.min(1,(G.litCap||1.2)/Math.max(1,DPR)),sw=Math.max(4,Math.ceil(bw*q)),sh=Math.max(4,Math.ceil(bh*q));'
s=s[:i]+head+tail+s[j:]
a="DPR=Math.min(window.devicePixelRatio||1,G.q4k?3.5:G.hq?2.25:1.35);if(G.q4k)DPR=Math.max(DPR,Math.min(2.5,3840/Math.max(1,w)));DPR=Math.min(DPR,2600/Math.max(1,VW*SC));"
assert a in s
s=s.replace(a,"DPR=Math.min(window.devicePixelRatio||1,G.q4k?2.2:G.hq?1.6:1.25);if(G.q4k)DPR=Math.max(DPR,Math.min(2.2,2400/Math.max(1,w)));DPR=Math.min(DPR,2400/Math.max(1,VW*SC),Math.sqrt(2.1e6/Math.max(1,VW*SC*H*SC)));G.litCap=G.q4k?1.25:1.05;")
a="if(G.dyn<=.56&&DYN.ema>19.5){if(++DYN.stuck>=8){DYN.off=1}return}"
assert a in s
s=s.replace(a,"if(G.dyn<=.56&&DYN.ema>19.5){if(++DYN.stuck>=4){DYN.stuck=0;if(!G.noAO){G.noAO=1;G.noPop=1;return}if(!G.noBloom){G.noBloom=1;return}if(!G.noLit){G.noLit=1;return}DYN.off=1}return}")
a="function drawBloom(){if(!G.hq)return;"
assert a in s;s=s.replace(a,"function drawBloom(){if(!G.hq||G.noBloom)return;")
a="function setQ(lv){G.hq=lv>0;G.q4k=lv>1;G.dyn=1;"
assert a in s;s=s.replace(a,"function setQ(lv){G.hq=lv>0;G.q4k=lv>1;G.dyn=1;G.noAO=G.noPop=G.noBloom=G.noLit=0;")
open(P,'w',encoding='utf8').write(s);print('v372 ok')
