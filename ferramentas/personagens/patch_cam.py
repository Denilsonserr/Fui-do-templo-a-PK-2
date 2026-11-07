P='/home/claude/fui-do-templo-a-pk-2/www/index.html';s=open(P).read()
def rep(a,b,n=1):
    global s;c=s.count(a);assert c==n,(a[:70],c);s=s.replace(a,b)
# v157: zoom do combo enquadra os 2 lutadores + o ponto do golpe (centraliza de verdade; antes so dava zoom em volta de um ponto da tela)
rep("if(G.finCam){const c=G.finCam,u=c.t/c.m;if(c.a&&c.d){c.x=lerp(c.x,c.a.x*.35+c.d.x*.65,.2);c.y=lerp(c.y,Math.min(c.a.y,c.d.y)-120,.2)}G.tz=c.t<5?1.62:u<.72?1.48:1;G.tzx=sxs(c.x);G.tzy=sys(c.y);return}",
"if(G.finCam){finFrame(G.finCam);return}")
rep("/* ---- camera director ---- */","""/* ---- camera director ---- */
function finFrame(c){const u=c.t/c.m,a=c.a,d=c.d;if(!a||!d)return;
  const X=[a.x,d.x,c.px],x0=Math.min(...X)-120,x1=Math.max(...X)+120,y0=Math.min(a.y-275,d.y-275,c.py-70),y1=Math.max(a.y,d.y)+24;
  const sx0=sxs(x0),sx1=sxs(x1),sy0=sys(y0),sy1=sys(y1);
  let z=Math.min(1.7,.94*VW/Math.max(1,sx1-sx0),.9*H/Math.max(1,sy1-sy0));z=clamp(z,1.08,1.7);
  // comeco: soco de zoom no ponto do golpe; depois abre para mostrar os dois
  const hit=c.t<7,zt=hit?Math.min(1.85,z+.28):u<.74?z:1;
  const wx=hit?(c.px*.6+(x0+x1)/2*.4):((x0+x1)/2*.8+c.px*.2),wy=hit?(c.py*.6+(y0+y1)/2*.4):(y0+y1)/2;
  c.x=c.x==null?wx:lerp(c.x,wx,.25);c.y=c.y==null?wy:lerp(c.y,wy,.25);
  const sx=sxs(c.x),sy=sys(c.y);let zx=sx,zy=sy;
  if(zt>1.03){zx=(VW/2-sx*zt)/(1-zt);zy=(H*.5-sy*zt)/(1-zt)}
  G.tz=zt;G.tzx=clamp(zx,0,VW);G.tzy=clamp(zy,0,H);if(c.t<3){G.zx=G.tzx;G.zy=G.tzy}}""")
rep("if(G.finCam){const c=G.finCam;c.t++;if(c.t<4)G.zoom=lerp(G.zoom,1.6,.45);if(c.t>c.m)G.finCam=null}","if(G.finCam){const c=G.finCam;c.t++;if(c.t<4)G.zoom=lerp(G.zoom,G.tz||1.6,.45);if(c.t>c.m)G.finCam=null}")
rep("G.finCam={t:0,m:96,x:mx,y:my,a,d,px:h.px,py:h.py,","G.finCam={t:0,m:96,x:null,y:null,a,d,px:h.px,py:h.py,")
open(P,'w').write(s);print('cam ok')
