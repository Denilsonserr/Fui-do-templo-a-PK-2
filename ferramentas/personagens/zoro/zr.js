
/* ================= v179: ZORO NOVO — golpes das folhas do dono (corte de 1 espada, corte de 2 espadas, investida), brilho verde da espada animado
   (camada só do efeito piscando + raios + fagulhas), estilo Rengoku (passo à frente, marca de corte, quadro desbotando), Combo do Rei Demônio
   transformado (folha de 20 quadros), aura verde (GIF do dono recolorido) com raios roxos. ================= */
const ZRN=__ZRN__;
const ZRAU={"src":"a/9ddf09d051c5cc.webp","n":5,"w":360,"h":381};ZRAU.img=new Image();ZRAU.img.src=ZRAU.src;
(function(){const S0=SPRH.zr,S1=SPRH.zrf;for(const k in S0)S1[k]=S0[k];/* transformado usa as espadas normais (sem roxo) */for(const k in ZRN){S0[k]=ZRN[k];S1[k]=ZRN[k]}
  const hb=(an,ac,pad,hh)=>{let rx=0,ry=0;for(const i of ac){const F=ZRN[an][i];if(F.rx>rx){rx=F.rx;ry=F.ry}}rx*=.9;ry*=.9;return[6,-(ry+hh/2),Math.max(120,rx+pad-6),hh]};
  Object.assign(MOVES,{
    zp1:{su:6,ac:6,rc:8,dmg:52,rehit:[3],hb:hb('c1',[3,4],10,170),kb:2.6,hs:17,lean:1.6,next:'zp2',knext:'zp3',cat:'punch',rgSw:1,rgPush:7,zr:1,zv:['c1',[0,1,2],[3,4],[5]]},
    zp2:{su:5,ac:9,rc:9,dmg:44,rehit:[3,6],hb:hb('c2',[2,3,4],10,190),kb:2.6,hs:16,lean:1.8,next:'zp3',knext:'zp3',cat:'punch',rgSw:1,rgPush:8,zr:2,zv:['c2',[0,1],[2,3,4],[5]]},
    zair:{su:4,ac:8,rc:8,dmg:50,rehit:[4],hb:hb('c3',[2,3,4],10,200),kb:3,hs:18,air:1,zHover:1,lean:1.4,cat:'punch',rgSw:1,zr:1,zv:['c3',[0,1],[2,3,4],[5]]},
    zdive:{su:5,ac:14,rc:8,dmg:66,hb:hb('c3',[4],10,230),kb:4,hs:18,air:1,zDive:1,heavy:1,lean:1.2,cat:'kick',rgSw:1,zr:2,zv:['c3',[1,2],[4],[5]]},
    zp3:{su:8,ac:9,rc:12,dmg:92,hb:hb('dsh',[3,4],30,200),kb:5,launch:-10,launcher:1,heavy:1,lean:2.4,cat:'kick',rgSw:1,zDash:15,zr:3,zv:['dsh',[0,1,2],[3,4],[5]]}})})();
/* quadro do golpe novo (o sistema antigo do Zoro só tinha 3 quadros por golpe) */
function zrKey(f){if(f.state==='zrc')return['cmb',Math.min(19,Math.floor(f.st/zrD(f)))];
  if(f.state==='attack'&&f.move&&f.move.zv){const m=f.move,V=m.zv,mf=f.mf;let L,u;
    if(mf<=m.su){L=V[1];u=mf/Math.max(1,m.su)}else if(mf<=m.su+m.ac){L=V[2];u=(mf-m.su)/Math.max(1,m.ac)}else{L=V[3];u=(mf-m.su-m.ac)/Math.max(1,m.rc)}
    return[V[0],L[Math.min(L.length-1,Math.floor(u*L.length))]]}return null}
function zrD(f){return f.form?3:4}
/* Combo do Rei Demônio (só transformado, botão especial) */
function zrCombo(f,o){f.state='zrc';f.st=0;f.vx=0;f.move=null;f.guard=false;f.zrHeld=false;f.zrK=-1;SFX.whoosh();try{smp('furi',.9,{gap:.04})}catch(e){}}
function zrcStep(f){const o=G.p[0]===f?G.p[1]:G.p[0],t=++f.st,fw=f.facing,D=zrD(f),k=Math.floor(t/D),END=20*D+8,HK={3:22,4:22,5:24,6:24,7:26,8:26,9:28,11:24,12:24,13:26,14:26,15:28};
  if(k===1||k===10)f.x=clamp(f.x+fw*10,40,WW-40);
  if(!f.zrHeld&&k>=2&&k<=5&&o&&!o.ko&&Math.abs(o.x-f.x)<240&&Math.abs(o.y-f.y)<170&&o.inv<=0){f.zrHeld=true;fzTag(f,'Combo do Rei Demônio!')}
  if(f.zrHeld&&o){const lift=k>=11&&k<=15?Math.min(120,(t-11*D)*6):0;o.state='rushed';o.st=0;o.vx=0;o.vy=0;o.flying=false;o.grounded=lift<=0;o.move=null;o.x=clamp(f.x+fw*120,40,WW-40);o.y=FLOOR-lift;
    if(k!==f.zrK){f.zrK=k;
      if(HK[k]){applyHit(f,o,{dmg:HK[k],kb:0,hs:5,px:o.x-fw*20,py:o.y-150,kind:'melee',lock:1});G.hitstop=Math.max(G.hitstop,3);G.shake=Math.max(G.shake,5);zrSlashMark(o.x-fw*10,o.y-rand(110,190),fw,1.2);try{smp('sgrd',.5,{gap:.03})}catch(e){}if(o.hp<=0){ko(f,o);f.zrHeld=false}}
      if(k===16&&f.zrHeld){o.y=FLOOR;o.grounded=true;const h={dmg:130,kb:0,hs:22,heavy:1,px:o.x-fw*10,py:o.y-140,kind:'melee',lock:1};applyHit(f,o,h);f.zrHeld=false;
        o.state='airhit';o.vx=fw*12;o.vy=-9;o.grounded=false;o.bounced=false;if(!f.finDone&&f.combo>=3)comboFinish(f,o,h);G.shake=Math.max(G.shake,18);G.flash=6;G.flashCol='#d8ffd0';
        for(const a of [-.8,.8])ZRSL.push({x:o.x,y:o.y-140,dir:fw,a,t:0,m:14,big:2.4});ring(o.x,o.y-140,'#7dff6a',260,22,7);flashL(o.x,o.y-120,'#5cff4a',520,.9,20);zrSpark(o.x,o.y-140,24,1.6);if(o.hp<=0)ko(f,o)}}}
  if(k>=3&&k<=16&&t%3===0)zrSpark(f.x+fw*rand(40,180),f.y-rand(40,260),1,1);
  if(t>=END){f.zrHeld=false;neutral(f)}}
/* marcas de corte verdes */
const ZRSL=[];
function zrSlashMark(x,y,dir,big){ZRSL.push({x,y,dir,a:rand(-.9,-.3),t:0,m:9,big:big||1})}
function zrSpark(x,y,n,big){for(let i=0;i<n;i++)addP({x:x+rand(-20,20)*big,y:y+rand(-20,20)*big,vx:rand(-1.8,1.8),vy:-rand(.5,3),life:rand(14,24),max:24,c:pick(['#3dff3a','#8cff6a','#d8ffd0','#ffffff']),type:'glow',sz:rand(4,9)*big,g:0})}
function drawZrSl(){if(!ZRSL.length)return;ctx.save();ctx.globalCompositeOperation='lighter';
  for(const q of ZRSL){q.t++;const u=q.t/q.m,L=(160+100*u)*q.big,W=(13*(1-u)+2)*q.big;ctx.save();ctx.translate(q.x,q.y);ctx.rotate(q.a*q.dir);ctx.globalAlpha=1-u;
    for(const [w,c] of [[W*2.4,'rgba(40,255,60,.55)'],[W,'rgba(170,255,150,.95)'],[W*.35,'rgba(255,255,255,1)']]){ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(-L/2,0);ctx.quadraticCurveTo(0,-w,L/2,0);ctx.quadraticCurveTo(0,w,-L/2,0);ctx.fill()}ctx.restore()}
  ctx.restore();for(let i=ZRSL.length-1;i>=0;i--)if(ZRSL[i].t>=ZRSL[i].m)ZRSL.splice(i,1)}
/* raio: linha quebrada com núcleo branco */
function zrBolt(x0,y0,x1,y1,c,w,a){const n=6,P=[[x0,y0]];for(let i=1;i<n;i++){const u=i/n;P.push([x0+(x1-x0)*u+rand(-12,12),y0+(y1-y0)*u+rand(-12,12)])}P.push([x1,y1]);
  ctx.globalAlpha=a;for(const [lw,cc] of [[w*3,c],[w,'#ffffff']]){ctx.strokeStyle=cc;ctx.lineWidth=lw;ctx.lineJoin='round';ctx.lineCap='round';ctx.beginPath();P.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke()}}
/* brilho verde da espada com movimento: a camada só do efeito (fl) pisca/ondula por cima, raios saem dos pontos do efeito (fp), fagulhas sobem */
function zrFrame(f){try{const k=zrKey(f)||spriteKey(f),L=SPRH[ssid(f)][k[0]];return L&&L[Math.max(0,Math.min(L.length-1,k[1]|0))]}catch(e){return null}}
function zrFront(f){if(f.hide>0)return;const F=zrFrame(f);if(!F||!F.fl)return;if(!F.flI){const im=new Image();im.decoding='async';im.src=F.fl;F.flI=im}
  const fw=f.facing,t=G.frame,e=spriteFx(f);
  if(F.flI.complete&&F.flI.naturalWidth){ctx.save();ctx.translate(f.x,f.y+(e.dy||0));ctx.scale(fw,1);ctx.globalCompositeOperation='lighter';
    const a=.32+.25*Math.sin(t*.8)+.12*Math.sin(t*2.1),sy=1+.03*Math.sin(t*.9),sx=1+.025*Math.sin(t*1.3);ctx.globalAlpha=Math.max(.12,a);
    ctx.drawImage(F.flI,-F.ax*sx,-F.ay*sy,F.w*sx,F.h*sy);ctx.globalAlpha=.18;ctx.drawImage(F.flI,-F.ax*1.04,-F.ay*1.03,F.w*1.04,F.h*1.03);ctx.restore()}
  if(F.fp&&F.fp.length){ctx.save();ctx.globalCompositeOperation='lighter';const nb=f.form?2:1;
    for(let i=0;i<nb;i++)if(Math.random()<.55){const q=F.fp[(Math.random()*F.fp.length)|0],x=f.x+fw*q[0],y=f.y+(e.dy||0)-q[1],ang=rand(0,TAU),L=rand(25,60);
      zrBolt(x,y,x+Math.cos(ang)*L,y+Math.sin(ang)*L,f.form&&Math.random()<.45?'rgba(190,90,255,.9)':'rgba(60,255,70,.9)',rand(1.2,2.2),.85)}
    ctx.restore();
    if(G.hitstop<=0)for(let i=0;i<2;i++){const q=F.fp[(Math.random()*F.fp.length)|0];addP({x:f.x+fw*q[0]+rand(-6,6),y:f.y-q[1]+rand(-6,6),vx:rand(-.8,.8),vy:-rand(1,2.6),life:rand(12,22),max:22,c:pick(['#3dff3a','#8cff6a','#d8ffd0']),type:'glow',sz:rand(3,6),g:0})}}}
/* aura transformado/carregando: GIF do dono em verde + raios roxos em volta */
function zrAura(f,k){const t=G.frame,cx=f.x,base=f.y,ch=f.state==='charge';if(!f.form&&!ch)return;if(!ZRAU.img.complete||!ZRAU.img.naturalWidth)return;
  /* do tamanho do Zoro (altura de pé ~265) e meio transparente */
  const i=Math.floor(t/4)%ZRAU.n,h=(ch?285:268)*(1+.03*Math.sin(t*.6)),w=h*ZRAU.w/ZRAU.h*.8;
  ctx.save();ctx.translate(cx,base-h*.5);ctx.scale((t>>4)%2?f.facing:-f.facing,1);
  ctx.globalAlpha=f.form?(ch?.3:.22):.18;ctx.drawImage(ZRAU.img,0,i*ZRAU.h,ZRAU.w,ZRAU.h,-w/2,-h/2,w,h);
  ctx.globalCompositeOperation='lighter';ctx.globalAlpha=f.form?(ch?.12:.07):.05;ctx.drawImage(ZRAU.img,0,i*ZRAU.h,ZRAU.w,ZRAU.h,-w/2,-h/2,w,h);ctx.restore();
  if(f.form&&t%3===0){ctx.save();ctx.globalCompositeOperation='lighter';for(let j=0;j<2;j++){const a0=rand(0,TAU),r0=rand(55,95),x0=cx+Math.cos(a0)*r0*.6,y0=base-135+Math.sin(a0)*r0*1.1;
      zrBolt(x0,y0,x0+rand(-60,60),y0+rand(-70,70),'rgba(180,80,255,.95)',rand(1.4,2.4),.9)}ctx.restore()}
  if(G.hitstop<=0&&t%(ch?2:4)===0)addP({x:cx+rand(-70,70),y:base-rand(10,250),vx:rand(-.4,.4),vy:-rand(1.4,3),life:rand(18,30),max:30,c:pick(['#3dff3a','#8cff6a','#d8ffd0','#c58bff']),type:'glow',sz:rand(2.5,5),g:0})}

/* CORTE METEORO: chute no ar = mergulha cortando; ao tocar o chão solta uma onda de corte em volta */
function zrDiveLand(f){const o=G.p[0]===f?G.p[1]:G.p[0],fw=f.facing;G.shake=Math.max(G.shake,14);ring(f.x+fw*60,FLOOR-10,'#5cff4a',200,18,6);flashL(f.x+fw*60,FLOOR-60,'#5cff4a',360,.7,14);zrSpark(f.x+fw*60,FLOOR-30,18,1.3);for(let i=0;i<8;i++)debris(f.x+rand(-120,160),FLOOR);
  for(const a of [-.25,.25])ZRSL.push({x:f.x+fw*80,y:FLOOR-40,dir:fw,a,t:0,m:12,big:1.8});txt(f.x,f.y-280,'CORTE METEORO!','#8cff6a');try{SFX.boom();smp('sgrd',.7,{gap:.05})}catch(e){}
  if(o&&!o.ko&&o.inv<=0&&Math.abs(o.x-(f.x+fw*60))<200&&o.y>FLOOR-200){const h={dmg:76,kb:5,hs:20,heavy:1,launch:-10,launcher:1,px:o.x-fw*20,py:o.y-120,kind:'melee'};if(applyHit(f,o,h)&&o.state!=='blockstun'){o.state='airhit';o.vy=-10;o.vx=fw*4;o.grounded=false;o.bounced=false}if(o.hp<=0)ko(f,o)}}
