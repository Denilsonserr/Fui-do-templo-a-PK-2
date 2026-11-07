
/* ================= v156: RENGOKU (sid rg, id rengoku) — sistema profissional, espada com fogo quadro a quadro, fogo desenhado animado,
   Primeira Forma (onda de fogo), Segunda Forma (arco subindo), Combo da Chama (folha do dono), transformação Espírito da Chama (vídeo do dono, aura de fogo = GIF do dono recolorido),
   golpes transformado QUEIMAM, ultimate Nona Forma (vídeo do dono). ================= */
SPRH.rg=__SPRH__;
const RGV={"f":__RGV__},RGU={"f":__RGU__},RGVF=[],RGUF=[];let RGP=null;
const RGVD=TVD(RGV.f.length,5),RGVE=Math.round(RGV.f.length*RGVD);
const RGAU={"src":"a/9137683854b94b.webp","n":5,"w":360,"h":405};RGAU.img=new Image();RGAU.img.src=RGAU.src;
const RGWV={"src":"a/a9f161a88534b9.webp","w":271,"h":278};RGWV.img=new Image();RGWV.img.src=RGWV.src;
function rgLoad(){if(RGP)return RGP;
  for(const arr of Object.values(SPRH.rg))for(const S of arr)if(S.fl&&!S.flI){const im=new Image();im.decoding='async';im.src=S.fl;S.flI=im}
  RGU.f.forEach((p,i)=>{const im=new Image();im.decoding='async';im.onload=()=>{RGUF[i]=im};im.src=p});
  return RGP=Promise.all(RGV.f.map((p,i)=>new Promise(r=>{const im=new Image();im.decoding='async';im.onload=()=>{RGVF[i]=im;r()};im.onerror=()=>r();im.src=p})))}
const RGK={rgc:1,rgs:1,rgu:1};
function rgD(f){return f.form?3:4}
function rgKey(f){const t=f.st;if(f.state==='rgc')return['cmb',Math.min(15,Math.floor(t/rgD(f)))];
  if(f.state==='rgs')return['ki1',Math.min(7,Math.floor(t/(f.form?3.5:4.5)))];
  if(f.state==='rgu')return['ki2',Math.min(7,Math.floor(t/(f.form?3.2:4)))];return['idle',0]}
Object.assign(VGA,{kjab:['jab',[1,2,3],[4,5],[6,7]],kfire:['fslash',[1,2],[3,4,5],[6,7]],kjab2:['cross',[1,2,3],[4,5],[6,7]],kknee:['str',[1,2,3],[4,5],[6,7]],kstr:['upper',[1,2],[3,4,5],[6,7]],
  kkick:['kick',[1,2,3],[4,5],[6,7]],khkick:['hkick',[1,2,3],[4,5],[6,7]],ksweep:['sweep',[1,2],[3,4,5],[6,7]],
  kajab:['ajab',[1],[2,3,4],[5,6,7]],kakick:['akick',[1],[2,3,4],[5,6,7]],ksmash:['palm',[0,1,2,3],[4,5],[6,7]],krush:['dash2',[1,2],[3,4],[5,6]]});
(function(){const S=SPRH.rg;
  S.fslash=[2,3,4,5,6,6,7,7].map(i=>S.cmb[i]);
  Object.assign(S,{jump:S.jumpv,combo:S.jab,sp:S.ki1,trans:S.pw,fly:S.jumpd,up:S.upper,dash:S.dashf,low:S.sweep,throw:S.palm,kunai:S.palm,fire:S.ki1});
  const hb=(name,pad,hh,low)=>{const A=VGA[name],L=S[A[0]];let rx=0,ry=0;for(const i of A[2]){const F=L[i];if(F.rx>rx){rx=F.rx;ry=F.ry}}
    return low?[6,-(ry+hh*.6),rx+pad-6,hh]:[6,-(ry+hh/2),rx+pad-6,hh]};
  Object.assign(MOVES,{
    kjab:{su:4,ac:3,rc:8,dmg:46,hb:hb('kjab',26,110),kb:2.2,hs:16,next:'kjab2',knext:'kkick',lean:1.6,cat:'punch',rgSw:1,rgPush:5},
    kjab2:{su:4,ac:3,rc:9,dmg:50,hb:hb('kjab2',26,110),kb:2.4,hs:17,next:'kknee',knext:'kkick',lean:1.8,cat:'punch',rgSw:1,rgPush:6},
    kknee:{su:5,ac:4,rc:10,dmg:58,hb:hb('kknee',20,120),kb:2.6,hs:18,next:'kfire',knext:'kkick',lean:1.6,cat:'punch',rgSw:1,rgPush:8},
    kfire:{su:5,ac:6,rc:11,dmg:36,rehit:[4],hb:hb('kfire',10,230),kb:2.4,hs:15,next:'kstr',knext:'kkick',lean:2,cat:'punch',rgSw:1,rgPush:6},
    kstr:{rgPush:4,su:6,ac:6,rc:14,dmg:88,hb:hb('kstr',10,250),kb:4,launch:-11,launcher:1,heavy:1,lean:2,cat:'kick',rgSw:1},
    kkick:{su:6,ac:5,rc:12,dmg:60,hb:hb('kkick',24,80),kb:4,hs:19,lean:1.2,next:'kjab',knext:'khkick',cat:'kick'},
    khkick:{su:8,ac:5,rc:15,dmg:80,hb:hb('khkick',24,90),kb:4,launch:-10,launcher:1,heavy:1,lean:1.4,cat:'kick'},
    ksweep:{su:7,ac:5,rc:16,dmg:66,hb:hb('ksweep',22,60,1),kb:3,launch:-5,low:1,crouch:1,cat:'kick',rgSw:1},
    kajab:{su:3,ac:4,rc:9,dmg:52,hb:hb('kajab',10,160),kb:2.5,hs:18,air:1,next:'kakick',cat:'punch',rgSw:1},
    kakick:{su:4,ac:5,rc:9,dmg:62,hb:hb('kakick',24,100),kb:5,hs:18,air:1,cat:'kick'},
    ksmash:Object.assign({},MOVES.smash,{hb:hb('ksmash',20,110),rgSw:1}),
    krush:Object.assign({},MOVES.rush,{hb:hb('krush',30,120)})});
  FR.rg={charge:[['pw',6],['pw',7]],jab:[['jab',3],['jab',4],['jab',5]],cross:[['cross',3],['cross',4],['cross',5]],upper:[['upper',3],['upper',4],['upper',5]],
    hkick:[['hkick',3],['hkick',4],['hkick',5]],sweep:[['sweep',3],['sweep',4],['sweep',5]],blastP:['ki1',3],blastF:['ki1',4],super:[['ki1',3],['ki1',4],['ki1',5]],beamF:['ki1',4],win:[0,1,2],trans:[['pw',7]]};
  HAIR.rg=1.3;HAND.rg={};RUSHK.rg=[['cmb',4],['cmb',8],['cmb',5],['cmb',12],['cmb',13],['cmb',9],['cmb',14]];
})();
function rgOpp(f){return G.p[0]===f?G.p[1]:G.p[0]}
function rgAct(f,st,cost){if(f.ki<cost){if(!f.cpu)say(f,'PRECISA DE '+cost+' KI');return}f.ki-=cost;rgLoad();f.state=st;f.st=0;f.vx=0;f.move=null;f.guard=false;f.rgHit=0;
  fzTag(f,st==='rgs'?'Primeira Forma!':'Segunda Forma!');txt(f.x,f.y-300,st==='rgs'?'PRIMEIRA FORMA!':'SEGUNDA FORMA!','#ffcf7a');SFX.whoosh()}
function rgCombo(f,o){rgLoad();f.state='rgc';f.st=0;f.vx=0;f.move=null;f.guard=false;f.rgHeld=false;f.rgK=-1;SFX.whoosh()}
const RGBOX=[],RGSL=[];
function rgSlashMark(x,y,dir,big){RGSL.push({x,y,dir,a:rand(-.9,-.3),t:0,m:9,big:big||1})}
function rgFlame(x,y,n,big){for(let i=0;i<n;i++)addP({x:x+rand(-20,20)*big,y:y+rand(-20,20)*big,vx:rand(-1.5,1.5),vy:-rand(1,3.5),life:rand(16,28),max:28,c:pick(['#ff5a10','#ff9a20','#ffd060','#fff2b0']),type:'glow',sz:rand(5,11)*big,g:0})}
function rgStep(f){const o=rgOpp(f),t=++f.st,fw=f.facing,form=!!f.form;
  if(f.state==='rgs'){const R=form?14:17;
    if(t===R){RGBOX.push({k:'wave',o:f,x:f.x+fw*150,y:f.y-150,vx:fw*(form?17:13),dir:fw,t:0,hit:0,form});SFX.blast&&SFX.blast();G.shake=Math.max(G.shake,6);rgFlame(f.x+fw*160,f.y-150,8,1)}
    if(t>=(form?28:36))neutral(f);return}
  if(f.state==='rgu'){const H0=form?8:10,H1=form?20:24;
    if(t>=H0&&t<=H1&&t%2===0)rgFlame(f.x+fw*rand(60,180),f.y-rand(60,280),2,1);
    if(!f.rgHit&&t>=H0&&t<=H1&&o&&!o.ko&&o.inv<=0){const dx=(o.x-f.x)*fw;
      if(dx>-30&&dx<250&&o.y>f.y-320){f.rgHit=1;const h={dmg:form?84:72,kb:3,hs:18,heavy:1,launch:-12,launcher:1,px:o.x-fw*20,py:o.y-150,kind:'melee'};
        if(applyHit(f,o,h)){if(o.state!=='blockstun'){o.state='airhit';o.vy=-12;o.vx=fw*3;o.grounded=false;o.bounced=false}ring(o.x,o.y-160,'#ffb030',130,16,5);rgFlame(o.x,o.y-160,14,1.3);G.shake=Math.max(G.shake,12)}if(o.hp<=0)ko(f,o)}}
    if(t>=(form?26:34)){neutral(f)}return}
  if(f.state==='rgc'){const D=rgD(f),k=Math.floor(t/D),END=16*D+6,HK={4:24,5:26,6:28,8:26,9:28,10:24,11:26,12:28,13:30};
    if(k===1||k===8)f.x=clamp(f.x+fw*(form?12:9),40,WW-40);
    if(!f.rgHeld&&k>=1&&k<=4&&o&&!o.ko&&Math.abs(o.x-f.x)<230&&Math.abs(o.y-f.y)<160&&o.inv<=0){f.rgHeld=true;fzTag(f,'Combo da Chama!')}
    if(f.rgHeld&&o){const lift=k>=10&&k<=13?Math.min(110,(t-10*D)*6):0;o.state='rushed';o.st=0;o.vx=0;o.vy=0;o.flying=false;o.grounded=lift<=0;o.move=null;o.x=clamp(f.x+fw*115,40,WW-40);o.y=FLOOR-lift;
      if(k!==f.rgK){f.rgK=k;
        if(HK[k]){applyHit(f,o,{dmg:HK[k],kb:0,hs:5,px:o.x-fw*20,py:o.y-150,kind:'melee',lock:1});G.hitstop=Math.max(G.hitstop,3);G.shake=Math.max(G.shake,4);rgFlame(o.x-fw*20,o.y-150,5,1);if(o.hp<=0){ko(f,o);f.rgHeld=false}}
        if(k===14&&f.rgHeld){o.y=FLOOR;o.grounded=true;const h={dmg:120,kb:0,hs:22,heavy:1,px:o.x-fw*10,py:o.y-120,kind:'melee',lock:1};applyHit(f,o,h);f.rgHeld=false;
          o.state='airhit';o.vx=fw*12;o.vy=-8;o.grounded=false;o.bounced=false;if(!f.finDone&&f.combo>=3)comboFinish(f,o,h);G.shake=Math.max(G.shake,16);
          ring(o.x,FLOOR-10,'#ffb030',260,22,7);flashL(o.x,FLOOR-80,'#ff6a1a',520,.9,20);rgFlame(o.x,FLOOR-40,26,1.5);for(let i=0;i<10;i++)debris(o.x+rand(-120,120),FLOOR);if(o.hp<=0)ko(f,o)}}}
    if(k>=4&&k<=14&&t%3===0)rgFlame(f.x+fw*rand(40,170),f.y-rand(40,260),1,1);
    if(t>=END){f.rgHeld=false;neutral(f)}return}}
/* queimadura: golpes do Rengoku transformado deixam o rival pegando fogo */
function rgBurn(a,d){if(!(d.burnT>0))txt(d.x,d.y-280,'QUEIMANDO!','#ffb030');d.burnT=Math.max(d.burnT||0,150);d.burnA=a}
function rgTick(){if(G.mode!=='fight'||G.hitstop>0)return;
  for(const d of G.p){if(!d||!(d.burnT>0))continue;d.burnT--;if(d.ko){d.burnT=0;continue}
    if(G.frame%2===0)addP({x:d.x+rand(-45,45),y:d.y-rand(10,230),vx:rand(-.4,.4),vy:-rand(1.5,3.2),life:rand(16,26),max:26,c:pick(['#ff5a10','#ff9a20','#ffd060']),type:'glow',sz:rand(6,12),g:0});
    if(d.burnT%15===0&&G.phase==='fight'&&!G.trans&&!G.ws){d.hp=Math.max(G.gmode==='treino'?1:0,d.hp-5);d.lagT=40;if(d.burnA&&d.burnA.comboDmg!=null)d.burnA.comboDmg+=5;if(d.hp<=0&&d.burnA)ko(d.burnA,d)}}
  for(const p of RGBOX){p.t++;const o=rgOpp(p.o);
    if(p.k==='wave'){p.x+=p.vx;if(G.frame%2===0)addP({x:p.x-p.dir*rand(20,80),y:p.y+rand(-60,60),vx:-p.dir*rand(1,3),vy:-rand(.5,1.5),life:18,max:18,c:pick(['#ff6a1a','#ffb030','#ffe08a']),type:'glow',sz:rand(5,10),g:0});
      if(!p.hit&&o&&!o.ko&&Math.abs(p.x-o.x)<95&&o.y>p.y-60&&o.y-260<p.y+90){p.hit=1;const h={dmg:p.form?88:66,kb:6,hs:16,heavy:1,px:o.x-p.dir*20,py:p.y,kind:'blast'};
        if(applyHit(p.o,o,h)){ring(o.x,p.y,'#ffb030',140,16,5);rgFlame(o.x,p.y,16,1.3);G.shake=Math.max(G.shake,10)}if(o.hp<=0)ko(p.o,o);p.dead=1}
      if(p.x<CAM.x-300||p.x>CAM.x+VW/CAM.z+300||p.t>90)p.dead=1}}
  for(let i=RGBOX.length-1;i>=0;i--)if(RGBOX[i].dead)RGBOX.splice(i,1)}
function drawRg(){rgBurnDraw();if(RGSL.length){ctx.save();ctx.globalCompositeOperation='lighter';for(const q of RGSL){q.t++;const u=q.t/q.m,L=(150+90*u)*q.big,W=(14*(1-u)+2)*q.big;ctx.save();ctx.translate(q.x,q.y);ctx.rotate(q.a*q.dir);ctx.globalAlpha=1-u;
    for(const [w,c] of [[W*2.2,'rgba(255,90,20,.6)'],[W,'rgba(255,210,120,.95)'],[W*.35,'rgba(255,255,255,1)']]){ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(-L/2,0);ctx.quadraticCurveTo(0,-w,L/2,0);ctx.quadraticCurveTo(0,w,-L/2,0);ctx.fill()}ctx.restore()}ctx.restore();for(let i=RGSL.length-1;i>=0;i--)if(RGSL[i].t>=RGSL[i].m)RGSL.splice(i,1)}if(!RGBOX.length||!RGWV.img.complete||!RGWV.img.naturalWidth)return;ctx.save();
  for(const p of RGBOX){const s=(p.form?1.55:1.3)*(1+Math.sin(p.t*.6)*.04),W=RGWV.w*.58*s,H=RGWV.h*.58*s;
    ctx.save();ctx.translate(p.x,p.y);ctx.scale(p.dir,1);ctx.globalAlpha=Math.min(1,p.t/4);ctx.drawImage(RGWV.img,-W*.55,-H/2,W,H);
    ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.35+.2*Math.sin(p.t*.9);ctx.drawImage(RGWV.img,-W*.55,-H/2*1.04,W,H*1.04);
    const g=ctx.createRadialGradient(0,0,0,0,0,110*s);g.addColorStop(0,'rgba(255,200,90,.45)');g.addColorStop(1,'rgba(255,80,10,0)');ctx.fillStyle=g;ctx.globalAlpha=1;ctx.fillRect(-110*s,-110*s,220*s,220*s);ctx.restore()}
  ctx.restore()}
/* fogo na espada quadro a quadro: guarda e ponta marcadas em cada quadro (sw) */
function rgFrame(f){try{const k=RGK[f.state]?rgKey(f):spriteKey(f),L=SPRH[ssid(f)][k[0]];return L&&L[Math.max(0,Math.min(L.length-1,k[1]|0))]}catch(e){return null}}
function rgSwordOn(f){if(f.form)return true;const s=f.state;return s==='rgs'||s==='rgu'||s==='rgc'||s==='charge'||(s==='attack'&&f.move&&f.move.rgSw)||s==='whtS'}
function rgTongue(x,y,h,w,t,ph,a){const sway=Math.sin(t*.35+ph)*w*.9;ctx.globalAlpha=a;
  const gr=ctx.createLinearGradient(x,y,x,y-h);gr.addColorStop(0,'rgba(255,90,20,.95)');gr.addColorStop(.45,'rgba(255,170,40,.85)');gr.addColorStop(1,'rgba(255,245,200,0)');ctx.fillStyle=gr;
  ctx.beginPath();ctx.moveTo(x-w,y);ctx.quadraticCurveTo(x-w*.8+sway*.4,y-h*.55,x+sway,y-h);ctx.quadraticCurveTo(x+w*.8+sway*.4,y-h*.5,x+w,y);ctx.closePath();ctx.fill()}
function rgSword(f,F){const fw=f.facing,t=G.frame,e=spriteFx(f),dy=e.dy||0,s=F.sw;
  const hx=f.x+fw*s[0],hy=f.y+dy-s[1],tx=f.x+fw*s[2],ty=f.y+dy-s[3];const big=(f.form?1.25:1)*(f.state==='attack'||RGK[f.state]?1.15:.85);
  // rastro de fogo (frame a frame) seguindo a ponta e o meio da lamina
  const T=f.rgTr||(f.rgTr=[]);T.push([tx,ty,hx+(tx-hx)*.42,hy+(ty-hy)*.42,t]);while(T.length&&t-T[0][4]>10)T.shift();
  ctx.save();ctx.globalCompositeOperation='lighter';
  if(T.length>2&&(f.state==='attack'||RGK[f.state]||f.state==='whtS')){for(let i=1;i<T.length;i++){const A=T[i-1],B=T[i],u=i/T.length;
      if(Math.hypot(B[0]-A[0],B[1]-A[1])<3)continue;ctx.globalAlpha=.55*u;ctx.fillStyle=u>.6?'rgba(255,214,110,1)':'rgba(255,110,25,1)';
      ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(B[0],B[1]);ctx.lineTo(B[2],B[3]);ctx.lineTo(A[2],A[3]);ctx.closePath();ctx.fill()}
    ctx.globalAlpha=.9;ctx.strokeStyle='rgba(255,250,230,1)';ctx.lineCap='round';ctx.lineWidth=4;ctx.beginPath();T.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke()}
  // brilho ao longo da lamina
  ctx.globalAlpha=1;ctx.lineCap='round';
  for(const [lw,c] of [[16*big,'rgba(255,80,10,.28)'],[8*big,'rgba(255,160,40,.5)'],[3*big,'rgba(255,240,190,.7)']]){ctx.strokeStyle=c;ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(hx+(tx-hx)*.12,hy+(ty-hy)*.12);ctx.lineTo(tx,ty);ctx.stroke()}
  // linguas de fogo subindo da lamina
  const n=9;for(let i=0;i<n;i++){const u=.15+.85*i/(n-1),x=hx+(tx-hx)*u,y=hy+(ty-hy)*u,fl=.6+.4*Math.abs(Math.sin(t*.45+i*1.7));
    rgTongue(x,y,(30+26*u)*big*fl,(7+4*u)*big,t,i*2.1,.85)}
  ctx.restore();
  if(G.hitstop<=0&&t%3===0)addP({x:tx+rand(-8,8),y:ty+rand(-8,8),vx:rand(-.6,.6),vy:-rand(1,2.5),life:16,max:16,c:pick(['#ffb030','#ffe08a','#ff6a1a']),type:'glow',sz:rand(2.5,4.5),g:0})}
/* fogo que ja vem desenhado nos quadros: pisca (camada so do fogo, 'lighter') e solta fagulhas */
function rgDrawnFire(f,F){if(!F.flI||!F.flI.complete||!F.flI.naturalWidth)return;const fw=f.facing,t=G.frame,e=spriteFx(f);
  ctx.save();ctx.translate(f.x,f.y+(e.dy||0));ctx.scale(fw,1);ctx.globalCompositeOperation='lighter';
  const a=.28+.22*Math.sin(t*.7)+.1*Math.sin(t*1.9),sy=1+.035*Math.sin(t*.9);ctx.globalAlpha=Math.max(.1,a);
  ctx.drawImage(F.flI,-F.ax,-F.ay*sy,F.w,F.h*sy);ctx.restore();
  if(F.fp&&F.fp.length&&G.hitstop<=0)for(let i=0;i<2;i++){const q=F.fp[(Math.random()*F.fp.length)|0];
    addP({x:f.x+fw*q[0]+rand(-6,6),y:f.y-q[1]+rand(-6,6),vx:rand(-.8,.8),vy:-rand(1,2.6),life:rand(14,24),max:24,c:pick(['#ffb030','#ffe08a','#ff6a1a','#fff2b0']),type:'glow',sz:rand(3,6),g:0})}}
function rgTween(f,key,x,e){if(!(f.state==='attack'||RGK[f.state]))return;const k=key[0]+':'+key[1];
  if(f.rgKk!==k){f.rgKp=f.rgKk?f.rgKk.split(':'):null;f.rgKt=G.frame;f.rgKk=k}
  const dt=G.frame-(f.rgKt||0);if(f.rgKp&&dt<3){const a=ctx.globalAlpha;ctx.globalAlpha=a*(.42*(1-dt/3));drawSprite(f,[f.rgKp[0],+f.rgKp[1]],x,f.y,f.facing,e,'img');ctx.globalAlpha=a}}
function rgFront(f){if(f.hide>0)return;const F=rgFrame(f);if(!F)return;
  if(F.fl)rgDrawnFire(f,F);
  if(F.sw&&rgSwordOn(f))rgSword(f,F);else f.rgTr=null}
/* aura: transformado = chama do GIF do dono em vermelho/laranja atras do corpo; carregando = mesma chama mais fraca */
function rgAura(f,k){const t=G.frame,cx=f.x,base=f.y,ch=f.state==='charge';if(!f.form&&!ch)return;if(!RGAU.img.complete||!RGAU.img.naturalWidth)return;
  const i=Math.floor(t/4)%RGAU.n,h=(ch?(f.form?330:300):290)*(1+.04*Math.sin(t*.6)),w=h*RGAU.w/RGAU.h;
  ctx.save();ctx.translate(cx,base-h*.45);ctx.scale((t>>4)%2?f.facing:-f.facing,1);
  ctx.globalAlpha=f.form?(ch?.62:.48):.34;ctx.drawImage(RGAU.img,0,i*RGAU.h,RGAU.w,RGAU.h,-w/2,-h/2,w,h);
  ctx.globalCompositeOperation='lighter';ctx.globalAlpha=f.form?(ch?.22:.14):.1;ctx.drawImage(RGAU.img,0,i*RGAU.h,RGAU.w,RGAU.h,-w/2,-h/2,w,h);ctx.restore();
  if(G.hitstop<=0&&t%(ch?2:4)===0)addP({x:cx+rand(-70,70),y:base-rand(10,250),vx:rand(-.4,.4),vy:-rand(1.4,3),life:rand(18,30),max:30,c:pick(['#ff5a10','#ff9a20','#ffd060','#fff2b0']),type:'glow',sz:rand(2.5,5),g:0})}
/* rival queimando: linguas de fogo no corpo */
function rgBurnDraw(){if(!RGAU.img.complete||!RGAU.img.naturalWidth)return;for(const d of G.p){if(!d||!(d.burnT>0)||d.hide>0)continue;const t=G.frame,k=Math.min(1,d.burnT/40),i=Math.floor(t/3+2)%RGAU.n,h=215*(1+.05*Math.sin(t*.7)),w=h*RGAU.w/RGAU.h;
    ctx.save();ctx.translate(d.x,d.y-h*.44);ctx.scale((t>>3)%2?1:-1,1);ctx.globalAlpha=.14*k;ctx.drawImage(RGAU.img,0,i*RGAU.h,RGAU.w,RGAU.h,-w/2,-h/2,w,h);
    ctx.globalCompositeOperation="lighter";ctx.globalAlpha=.1*k;ctx.drawImage(RGAU.img,0,i*RGAU.h,RGAU.w,RGAU.h,-w/2,-h/2,w,h);ctx.restore()}}
function updRGT(T,f,t){G.tz=1.15;G.tzx=sxs(f.x);G.tzy=sys(f.y-150);if(t<RGVE)return;
  if(t===RGVE){f.form=1;f.formT=FORM_T;f.flick=0;G.flash=12;G.flashCol='#ffe0a8';G.shake=24;
    for(const r of [320,200,110])ring(f.x,f.y-150,r===110?'#fff2b0':'#ff6a1a',r,26,7);
    rgFlame(f.x,f.y-150,40,1.6);for(let i=0;i<16;i++)debris(f.x+rand(-160,160),FLOOR);
    SFX.transform();banner('ESPÍRITO DA CHAMA!','#ffcf7a',90,f.def.formSub);buzz(150)}
  if(t>RGVE&&t%2===0)rgFlame(f.x+rand(-70,70),f.y-rand(30,260),1,1);
  if(t>=RGVE+34){G.trans=null;f.inv=15;neutral(f);G.tz=1}}
function rgSuper(f,o){if(f.ki<100){if(!f.cpu)say(f,'PRECISA DE 100 KI');return false}if(!o||o.ko)return false;rgLoad();
  f.ki-=100;f.state='whtS';f.st=0;f.inv=999;f.vx=0;f.vy=0;f.flying=false;f.y=FLOOR;f.grounded=true;f.rushKey=['seals',1];o.hypHard=0;o.iceHard=0;
  G.ws={rg:1,a:f,d:o,t:0,hi:0,vt:0};banner('NONA FORMA: RENGOKU','#ffcf7a',60,'ULTIMATE');G.flash=4;G.flashCol='#ffe0a8';SFX.superUp();buzz(70);return true}
function updRGU(){const R=G.ws,a=R.a,d=R.d,FL=RGU.f.length;R.t++;const t=R.t;a.st=t;a.y=FLOOR;a.grounded=true;d.state='rushed';d.st=t;d.vx=0;d.vy=0;d.flying=false;
  if(t<VGU0){a.rushKey=['seals',Math.min(7,(t/4)|0)];G.tz=1.18;G.tzx=sxs(a.x+a.facing*60);G.tzy=sys(a.y-180);G.shake=Math.max(G.shake,1+t*.12);
    if(t%2===0)rgFlame(a.x+rand(-80,80),a.y-rand(30,260),1,1);if(t%6===0)SFX.charge();if(t===VGU0-1){G.flash=8;G.flashCol='#ffe0a8'}return}
  if(t===VGU0){SFX.blast();G.tz=1}
  const vt=(t-VGU0)/60*USP(FL);R.vt=vt;const fi=vt*12,HI=[.45,.55,.65,.75,.85].map(q=>Math.round(FL*q));
  if(R.hi<HI.length&&fi>=HI[R.hi]){R.hi++;G.shake=Math.max(G.shake,12);SFX.boom();buzz(40);if(!d.ko)applyHit(a,d,{dmg:34,kb:0,hs:6,px:d.x,py:d.y-120,kind:'blast',lock:1});d.state='rushed';d.vx=0;d.vy=0}
  if(vt>=FL/12-.05){G.flash=10;G.flashCol='#ffffff';G.shake=Math.max(G.shake,28);SFX.crater();SFX.boom();buzz(150);
    flashL(d.x,d.y-140,'#ff6a1a',660,1,30);ring(d.x,FLOOR-6,'#ffcf7a',300,26,8);for(let i=0;i<22;i++)debris(d.x+rand(-180,180),FLOOR);
    d.y=FLOOR;d.grounded=true;if(!d.ko)applyHit(a,d,{dmg:240,kb:0,hs:24,heavy:1,px:d.x,py:d.y-120,kind:'blast',lock:1});if(!d.ko)rgBurn(a,d);
    G.ws=null;a.rushKey=null;a.inv=12;neutral(a);G.tz=1;d.vx=0;d.vy=0;d.y=FLOOR;d.grounded=true;d.flying=false;if(!d.ko){d.state='down';d.st=6;d.downX=45;txt(d.x,d.y-200,'NOCAUTEADO!','#ffcf7a')}}}
