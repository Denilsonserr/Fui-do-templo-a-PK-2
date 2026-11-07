/* ================= v168: botões e HUD personalizados por personagem (artes do dono; normal e transformado). Só muda a aparência. ================= */
const HUDA=__HUDA__;const HUDA_ON=false; /* v170: o dono pediu o HUD de vida ANTIGO; só os botões usam as artes */const HUDK=942/540;
function huImg(src){const C=huImg.c||(huImg.c={});if(!C[src]){const i=new Image();i.decoding='async';i.src=src;C[src]=i}const i=C[src];return i.complete&&i.naturalWidth?i:null}
function huArt(f){const A=f&&HUDA[f.def.id];return A?A[f.form&&A[1]?1:0]:null}
const HUTH={naruto:{c:'#ffb020',c2:'#fff2b0',bc:'#ffe23a',bc2:'#fffbe0'},rengoku:{c:'#ff5a10',c2:'#ffd080',bc:'#ff2a20',bc2:'#ffd0c8',sr:1},gojo:{c:'#a040ff',c2:'#e8c8ff',bc:'#c070ff',bc2:'#f4e8ff'}};
const HUFL=[[],[]];
const PORTF={naruto:'a/2e1f82d79ae4b7.jpg'};
function hudArtDraw(f,side,sf){if(!HUDA_ON)return false;const own=huArt(f),V=own||(side===1?huArt(G.p[0]):null);if(!V)return false;const P=V.hud[side?'R':'L'],k=1/HUDK,full=huImg(P.full),emp=huImg(P.empty);if(!full||!emp)return false;
  const x0=side?VW-sf-P.w*k:sf,y0=0,W=P.w*k,Hh=P.h*k,t=G.frame;
  ctx.save();ctx.drawImage(emp,x0,y0,W,Hh);
  const B=P.bars,LY=Math.max(1,Math.ceil(f.hp/LAYER)),base=(LY-1)*LAYER,fr=clamp((f.hp-base)/LAYER,0,1),lag=clamp(((f.hpLag==null?f.hp:f.hpLag)-base)/LAYER,0,1);
  const clipFill=(b,q,fill)=>{if(!b||q<=0)return;const bx0=b[0]*k,bx1=b[2]*k,len=bx1-bx0,w=len*q;const L=side?x0+bx0:x0+bx0,R=side?x0+bx0+w:x0+bx0+w;
    ctx.save();ctx.beginPath();if(side)ctx.rect(x0+bx1-w,y0+b[1]*k-3,w,(b[3]-b[1])*k+6);else ctx.rect(x0+bx0,y0+b[1]*k-3,w,(b[3]-b[1])*k+6);ctx.clip();
    if(fill){ctx.fillStyle=fill;ctx.fillRect(x0,y0,W,Hh);ctx.globalCompositeOperation='destination-in';ctx.drawImage(full,x0,y0,W,Hh)}else ctx.drawImage(full,x0,y0,W,Hh);ctx.restore()};
  if(B.hp){if(lag>fr){const sv=ctx.globalAlpha;ctx.globalAlpha=.85;clipFill(B.hp,lag,'#ff4757');ctx.globalAlpha=sv}
    if(fr<.25&&LY===1&&t%20<10){clipFill(B.hp,fr,'#ff3b30')}else clipFill(B.hp,fr)}
  clipFill(B.ki,clamp(f.ki/100,0,1));clipFill(B.w,clamp((G.wins[side]||0)/2,0,1));
  // energia (6 barras) em bolinhas abaixo da barra de ki
  const sbv=f.sb||0,pb=B.ki||B.hp;if(pb){for(let i=0;i<6;i++){const cx=side?x0+(pb[2]*k)-6-i*13:x0+pb[0]*k+6+i*13,cy=y0+pb[3]*k+7,q=clamp(sbv-i,0,1);
      ctx.beginPath();ctx.moveTo(cx,cy-4.5);ctx.lineTo(cx+4.5,cy);ctx.lineTo(cx,cy+4.5);ctx.lineTo(cx-4.5,cy);ctx.closePath();ctx.fillStyle='rgba(0,0,0,.7)';ctx.fill();
      if(q>0){ctx.save();ctx.globalAlpha=q;ctx.fillStyle=q>=1?'#3ff0ff':'#2aa8c0';if(q>=1){ctx.shadowColor='#3ff0ff';ctx.shadowBlur=6}ctx.fill();ctx.restore()}ctx.strokeStyle='rgba(180,240,255,.6)';ctx.lineWidth=1;ctx.stroke()}}
  // nome
  ctx.font='italic 800 13px "Saira Condensed",sans-serif';ctx.textAlign=side?'right':'left';const ny=y0+Hh-4,nx=side?x0+W-138:x0+138;
  ctx.lineWidth=3;ctx.strokeStyle='#000';ctx.strokeText(f.def.name+(f.cpu?'  CPU':''),nx,ny+12);ctx.fillStyle='#fff';ctx.fillText(f.def.name+(f.cpu?'  CPU':''),nx,ny+12);
  // retrato do personagem dentro do círculo (transformado se tiver)
  if(P.pc){const pcx=side?x0+W-(P.w-P.pc[0])*k:x0+P.pc[0]*k,pcy=y0+P.pc[1]*k,pr=P.pc[2]*k*.86;const im=(f.form&&PORTF[f.def.id]&&huImg(PORTF[f.def.id]))||IMG[f.def.id];
    ctx.save();ctx.beginPath();ctx.arc(pcx,pcy,pr,0,TAU);ctx.fillStyle='#05060c';ctx.fill();ctx.clip();
    if(im&&im.complete&&im.naturalWidth){if(side){ctx.translate(pcx*2,0);ctx.scale(-1,1)}ctx.drawImage(im,pcx-pr,pcy-pr,pr*2,pr*2)}
    ctx.restore();if(f.hp<=0||f.flash>0){ctx.save();ctx.beginPath();ctx.arc(pcx,pcy,pr,0,TAU);ctx.fillStyle=f.hp<=0?'rgba(0,0,0,.6)':'rgba(255,40,40,.4)';ctx.fill();ctx.restore()}}
  ctx.restore();
  // fogo e raios no HUD transformado
  const T=own&&HUTH[f.def.id];if(f.form&&T&&P.top&&P.top.length){const Lf=HUFL[side];if(G.hitstop<=0&&Lf.length<46)for(let i=0;i<2;i++){const q=P.top[(Math.random()*P.top.length)|0];Lf.push({x:q[0],y:q[1],vx:rand(-.3,.3),vy:-rand(.6,1.6),l:0,m:rand(14,26),s:rand(5,11)})}
    ctx.save();ctx.globalCompositeOperation='lighter';const C1=blobT(T.c),C2=blobT(T.c2);
    for(const p of Lf){p.l++;p.x+=p.vx;p.y+=p.vy;const u=p.l/p.m,sz=p.s*(1-u*.6),px=side?x0+W-(P.w-p.x)*k:x0+p.x*k,py=y0+p.y*k;ctx.globalAlpha=(1-u)*.7;ctx.drawImage(C1,px-sz,py-sz,sz*2,sz*2);ctx.globalAlpha=(1-u)*.5;ctx.drawImage(C2,px-sz*.4,py-sz*.4,sz*.8,sz*.8)}
    for(let i=Lf.length-1;i>=0;i--)if(Lf[i].l>=Lf[i].m)Lf.splice(i,1);
    if(t%5<3){const a=P.top[(Math.random()*P.top.length)|0],b=P.top[(Math.random()*P.top.length)|0];if(a&&b&&Math.abs(a[0]-b[0])<220){const X0=side?x0+W-(P.w-a[0])*k:x0+a[0]*k,X1=side?x0+W-(P.w-b[0])*k:x0+b[0]*k;
      jag(ctx,boltLine(X0,y0+a[1]*k,X1,y0+b[1]*k+rand(-6,6),7,10),T.bc,T.bc2,1.1)}}
    ctx.restore()}
  return true}
function hudArtTimer(cx){if(!HUDA_ON)return false;const V=huArt(G.p[0]);if(!V)return false;const T=V.hud.T,im=huImg(T.img);if(!im)return false;const k=1/HUDK,W=T.w*k,Hh=T.h*k,x0=cx-W/2;
  ctx.drawImage(im,x0,0,W,Hh);const t=G.frame,TH=HUTH[G.p[0].def.id]||{c:'#6ab8ff'};
  ctx.textAlign='center';ctx.font='30px Bangers, Impact, sans-serif';const warn=G.tlim!==0&&G.timer<=10&&t%30<15;ctx.save();ctx.shadowColor=warn?'#ff3b30':TH.c;ctx.shadowBlur=12;ctx.fillStyle=warn?'#ff6b5e':'#ffffff';
  ctx.fillText(G.tlim===0?'∞':String(G.timer).padStart(2,'0'),cx,T.cy*k+11);ctx.restore();
  ctx.font='italic 800 10px "Saira Condensed",sans-serif';ctx.fillStyle='#ffffff';ctx.fillText('ROUND '+G.round,cx,Hh+10);return true}
/* botões: troca só a imagem (mesmo tamanho e mesma função) */
const BSK={key:null,orig:null};const BSKID=['bPunch','bKick','bKi','bSp','bSr','bBl','bFly','bTr'];
function btnSkin(){const f=G.mode==='fight'?G.p[0]:null,V=huArt(f),key=V?f.def.id+(f.form?1:0):'';if(key===BSK.key)return;BSK.key=key;const c=$('controls');if(!c)return;
  if(!BSK.orig){BSK.orig={};for(const id of [...BSKID,'joyBase'])BSK.orig[id]=$(id)&&$(id).style.getPropertyValue('--img')}
  c.classList.toggle('cus',!!V);
  for(const id of BSKID){const e=$(id);if(e)e.style.setProperty('--img',V&&V.btn[id]?`url(${V.btn[id]})`:BSK.orig[id])}
  const j=$('joyBase');if(j)j.style.setProperty('--img',V&&V.btn.joy?`url(${V.btn.joy})`:BSK.orig.joyBase);const kn=$('joyKnob');if(kn)kn.style.setProperty('--kimg',V&&V.btn.knob?`url(${V.btn.knob})`:'none');
  if(V&&f.form){c.classList.add('cusfl');setTimeout(()=>c.classList.remove('cusfl'),400)}BFX.list=null}
