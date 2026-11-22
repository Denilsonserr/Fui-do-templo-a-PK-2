import json,sys,os
# v594: ALUCARD (sid al, id alucard) — ETAPA 1, só no MODO TESTE do ADM (não entra em ALLC; aparece no painel 🧪 TESTE, que lista Object.keys(CH)).
# Sprites: ferramentas/personagens/alucard/ (seg_al.py -> work/cut, build_al.py ai -> build/al_ai.json, imgs_al.py -> build/imgs.json).
# Lógica: reaproveita a do espadachim YUTA (como o Sung): isYt também vale para 'al'. Sem Rika, sem contra-ataque passivo, sem transformação e sem ultimate (EM BREVE).
# Pedido do dono: pistoleiro BEM RÁPIDO que ataca de longe com TIROS, combos rápidos, socos e chutes; aura do Gojo VERMELHA; última folha = SUPER COMBO.
P=sys.argv[1];s=open(P,encoding='utf8').read()
D=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','personagens','alucard','build')
_f=os.path.join(D,'al_ai.json');J=json.load(open(_f if os.path.exists(_f) else os.path.join(D,'al_fast.json')));IM=json.load(open(os.path.join(D,'imgs.json')))
def rep(a,b,n=1):
    global s;c=s.count(a);assert c==n,(a[:90],c);s=s.replace(a,b)
cj=lambda o:json.dumps(o,separators=(',',':'))
rep("const isYt=f=>!!f&&(f.def.sid==='yt'||f.def.sid==='sj');","const isYt=f=>!!f&&(f.def.sid==='yt'||f.def.sid==='sj'||f.def.sid==='al');const isAuc=f=>!!f&&f.def.sid==='al';")
rep("const ssid=f=>f.def.sid==='sj'?'sj':","const ssid=f=>f.def.sid==='al'?'al':f.def.sid==='sj'?'sj':")
rep("s==='sj'?['sj']:","s==='sj'?['sj']:s==='al'?['al']:")
rep("loadImg('sung','","loadImg('alucard','%s');loadImg('sung','"%IM['port'])
rep("  sung:{sid:'sj',id:'sung',","  alucard:{sid:'al',id:'alucard',name:'ALUCARD',cn:'O PISTOLEIRO VAMPIRO',energy:'#ff2a3a',energy2:'#ffd6da',fe:'#ff2a3a',fe2:'#ffe2e6',walk:7.4,power:1.12,frame:'#c0101e',\n    hx:92,hy:180,bx:110,by:156,blade:'ki',beamName:'',beamNameF:'',rushName:'SUPER COMBO',formName:'EM BREVE',formSub:'EM BREVE'},\n  sung:{sid:'sj',id:'sung',")
rep('const PTH={','const PTH={"alucard": "%s",'%IM['pth'])
rep("const FULLIMG={","const FULLIMG={alucard:'%s',"%IM['full'])
rep("SPRH.sj=","SPRH.al=%s;SPRH.sj="%cj(J['al']))
rep("(function(){for(const sid of ['sj','yt','ytd']){","(function(){for(const sid of ['al','sj','yt','ytd']){")
rep("const ROS={sung:","const ROS={alucard:{c:'#c0101e',d:'Pistoleiro vampiro. Muito rápido. O forte é o TIRO: soco = sequência de tiros trocando de postura (duas mãos/uma mão, agachado rajada ultra rápida, afasta pra trás e atira, TIRO GROSSO). Chute = chutes com a arma. Ki = 3 tiros de uma vez. Combo = SUPER COMBO.'},sung:")
rep("RUSHK.sj=RUSHK.yt;","RUSHK.sj=RUSHK.yt;HAIR.al=1.2;HAND.al={};RUSHK.al=[['cmb',4],['cmb',6],['cmb',9],['cmb',11],['cmb',12],['cmb',13]];")
rep("f.def.sid==='yt'||f.def.sid==='sj'||f.def.sid==='sk');","f.def.sid==='yt'||f.def.sid==='sj'||f.def.sid==='al'||f.def.sid==='sk');")
rep("sid==='yt'||sid==='ytd'||sid==='sj'||sid==='sk'||","sid==='yt'||sid==='ytd'||sid==='sj'||sid==='al'||sid==='sk'||")
# sem ultimate e sem transformação por enquanto (o dono ainda não mandou)
rep("function ytSuper(f,o){","function ytSuper(f,o){if(isAuc(f)){if(!f.cpu)say(f,'EM BREVE');return false}")
rep("function startTransform(f){","function startTransform(f){if(f.def.sid==='al'){if(!f.cpu)say(f,'EM BREVE');return false}")
rep("function ytRika(f,o){","function ytRika(f,o){if(isAuc(f))return;")
rep("if(d.hp>0&&isYt(d)&&!h.lock&&!d.ko&&!YTK[d.state]){","if(d.hp>0&&isYt(d)&&!isAuc(d)&&!h.lock&&!d.ko&&!YTK[d.state]){")  # sem contra-ataque passivo (é do Yuta)
# SUPER COMBO (folha 13 do dono, 16 quadros): mais rápido e com acertos próprios
rep("f.def.sid==='sj'?'Dança das Sombras!':'Dança da Espada!'","f.def.sid==='sj'?'Dança das Sombras!':isAuc(f)?'SUPER COMBO!':'Dança da Espada!'")
rep("if(f.state==='ytc'){const D=M?3:4,","if(f.state==='ytc'){const D=M?3:isAuc(f)?3:4,")
rep("const HK=f.def.sid==='sj'?","const HK=isAuc(f)?{2:24,3:24,4:26,5:26,6:28,7:28,8:30,9:32,10:32,11:34,12:34,13:36}:f.def.sid==='sj'?")
rep("const h={dmg:f.def.sid==='sj'?(M?190:150):","const h={dmg:isAuc(f)?160:f.def.sid==='sj'?(M?190:150):")
rep("  if(f.state==='ytk'){const D=M?1.5:2.2","  if(f.state==='ytk'&&isAuc(f))return aucKiStep(f,o,t);\n  if(f.state==='ytk'){const D=M?1.5:2.2")
rep("function ytTick(){if(G.mode!=='fight')return;","function ytTick(){if(G.mode!=='fight')return;aucTick();")
rep("drawAfx();drawParts();drawMd();","drawAfx();drawParts();aucDrawFX();drawMd();")  # v598: efeitos dos tiros
rep("function ytAura(f,k){","""/* ================= v594: ALUCARD — tiros, aura vermelha ================= */
const AUC_GUN={usweep:1,uajab:1,wsweep:1,wajab:1};
let AUCB=[];
/* tiro: projétil rápido com rastro vermelho; acerta de longe */
function aucFire(f,dmg,dy,O){O=O||{};const o=ytOpp(f);if(!o)return;const x=f.x+f.facing*(O.big?150:120),y=f.y-(dy||188);
  const kind=O.big?'big':O.fast?'fast':dmg>=26?'mid':'weak',rd=!!f.form;
  AUCB.push({x,y,vx:f.facing*(O.big?30:O.fast?50:38),vy:O.vy||0,f,o,dmg,big:!!O.big,kind,rd,h:[[x,y]],ph:Math.random()*6,life:O.big?50:40});
  if(O.big){G.shake=Math.max(G.shake,8);f.vx-=f.facing*6}
  aucMuzzle(x,y,f.facing,kind,rd);
  flashL(x+f.facing*14,y,rd?'#ff2a3a':'#ffb040',O.big?170:kind==='weak'?60:90,.9,O.big?9:5);
  try{SFX.blast()}catch(e){}G.shake=Math.max(G.shake,O.big?8:2)}
/* ===== v598: EFEITOS DOS TIROS desenhados na hora (nada de PNG): clarão do cano em estrela girando, traçante com brilho,
   tiro rápido = laser fino, tiro grosso = cometa com espiral, impacto em estrela + faíscas, cápsulas caindo e fumaça ===== */
let AUCFX=[];
const AUCPAL={n:{core:'255,248,220',mid:'255,184,64',out:'255,90,26'},r:{core:'255,214,206',mid:'235,18,28',out:'130,0,8'}};
function aucMuzzle(x,y,dir,kind,rd){const pw=kind==='big'?2:kind==='fast'?1.2:kind==='mid'?1:.75,N=kind==='big'?14:10,R=[];
  for(let i=0;i<N;i++)R.push({a:i/N*Math.PI*2+rand(-.2,.2),l:rand(.45,1)});
  AUCFX.push({k:'mz',x,y,dir,pw,R,rd,t:0,life:kind==='big'?9:6,rot:rand(0,6)});
  if(kind==='big'){const J=[];for(let i=0;i<9;i++)J.push(rand(.55,1));AUCFX.push({k:'jag',x,y,dir,J,rd,t:0,life:10});AUCFX.push({k:'ring',x,y,rd,t:0,life:12,r:90})}
  AUCFX.push({k:'cas',x:x-dir*70,y:y+10,vx:-dir*rand(3,6),vy:rand(-9,-6),r:0,vr:rand(.3,.6)*(Math.random()<.5?-1:1),t:0,life:60,bn:0});
  for(let i=0;i<(kind==='big'?5:2);i++)AUCFX.push({k:'smk',x:x+dir*rand(0,30),y:y+rand(-8,8),vx:dir*rand(.5,2),vy:rand(-1.4,-.4),s:rand(8,14)*(kind==='big'?1.8:1),t:0,life:rand(26,40)|0})}
function aucImpact(x,y,big,rd){const S=[];for(let i=0;i<(big?18:10);i++)S.push({a:rand(0,Math.PI*2),v:rand(.6,1)});
  AUCFX.push({k:'imp',x,y,S,big,rd,t:0,life:big?14:9,rot:rand(0,6)});AUCFX.push({k:'ring',x,y,rd,t:0,life:big?14:8,r:big?150:56})}
function aucFxTick(){if(G.hitstop>0)return;const n=[];for(const e of AUCFX){e.t++;
    if(e.k==='cas'){e.vy+=.7;e.x+=e.vx;e.y+=e.vy;e.r+=e.vr;if(e.y>FLOOR-4&&e.vy>0){e.y=FLOOR-4;if(e.bn++<2){e.vy*=-.42;e.vx*=.6;e.vr*=.6}else{e.vy=0;e.vx*=.8;e.vr=0}}}
    if(e.k==='smk'){e.x+=e.vx;e.y+=e.vy;e.vx*=.96;e.s+=.5}
    if(e.t<e.life)n.push(e)}AUCFX=n}
try{window.__aucT={fire:(...a)=>aucFire(...a),tick:()=>aucTick(),n:()=>({b:AUCB.length,fx:AUCFX.length})}}catch(e){}
function aucGrad(x0,x1,c,a0,a1){const g=ctx.createLinearGradient(x0,0,x1,0);g.addColorStop(0,`rgba(${c},${a0})`);g.addColorStop(1,`rgba(${c},${a1})`);return g}
function aucStar(r,rays,w,col,a,rot){ctx.save();ctx.rotate(rot);for(const q of rays){const L=r*q.l;ctx.save();ctx.rotate(q.a);const g=ctx.createLinearGradient(0,0,L,0);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,-w);ctx.lineTo(L,0);ctx.lineTo(0,w);ctx.fill();ctx.restore()}ctx.restore()}
function aucGlow(r,col,a){const g=ctx.createRadialGradient(0,0,0,0,0,r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r,0,7);ctx.fill()}
function aucDrawFX(){if(!AUCB.length&&!AUCFX.length)return;ctx.save();
  /* fumaça e cápsulas (normal) */
  for(const e of AUCFX){const p=e.t/e.life;
    if(e.k==='smk'){ctx.globalCompositeOperation='source-over';ctx.globalAlpha=.22*(1-p);ctx.fillStyle='#8a8580';ctx.beginPath();ctx.arc(e.x,e.y,e.s,0,7);ctx.fill()}
    if(e.k==='cas'){ctx.globalCompositeOperation='source-over';ctx.globalAlpha=e.t>e.life-12?(e.life-e.t)/12:1;ctx.save();ctx.translate(e.x,e.y);ctx.rotate(e.r);const g=ctx.createLinearGradient(0,-3,0,3);g.addColorStop(0,'#fff0b0');g.addColorStop(.5,'#d9a236');g.addColorStop(1,'#7a5210');ctx.fillStyle=g;ctx.fillRect(-7,-2.6,14,5.2);ctx.fillStyle='#5a3a08';ctx.fillRect(5,-2.6,2,5.2);ctx.restore()}}
  ctx.globalAlpha=1;ctx.globalCompositeOperation='lighter';
  /* balas */
  for(const b of AUCB){const P=AUCPAL[b.rd?'r':'n'],h=b.h,t0=h[0],dx=b.x-t0[0],dy=b.y-t0[1],L=Math.hypot(dx,dy)||1,w=b.kind==='big'?19:b.kind==='fast'?3.2:b.kind==='mid'?5.5:4.2,fl=.85+Math.sin(G.frame*1.7+b.ph)*.15;
    ctx.save();ctx.translate(b.x,b.y);ctx.rotate(Math.atan2(dy,dx));
    const lay=(ww,c,a)=>{ctx.fillStyle=aucGrad(-L,0,c,0,a);ctx.beginPath();ctx.moveTo(-L,0);ctx.lineTo(-L*.15,-ww);ctx.lineTo(4,-ww*.6);ctx.lineTo(4,ww*.6);ctx.lineTo(-L*.15,ww);ctx.closePath();ctx.fill()};
    lay(w*3.2*fl,P.out,.35);lay(w*1.5,P.mid,.75);lay(w*.55,P.core,1);
    if(b.kind==='big'){ctx.lineWidth=3;for(let s=0;s<2;s++){ctx.strokeStyle=`rgba(${s?P.mid:P.core},.7)`;ctx.beginPath();for(let i=0;i<=24;i++){const u=i/24,xx=-L*u,yy=Math.sin(u*14-G.frame*.9+s*Math.PI+b.ph)*w*1.4*(1-u*.6);i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy)}ctx.stroke()}
      ctx.save();ctx.scale(1.6,1);aucGlow(w*4.2*fl,P.out,.55);ctx.restore();aucGlow(w*1.5,P.core,.85);
      ctx.strokeStyle=`rgba(${P.core},.55)`;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(-w*5*fl,0);ctx.lineTo(w*5*fl,0);ctx.moveTo(0,-w*2*fl);ctx.lineTo(0,w*2*fl);ctx.stroke()}
    else{ctx.save();ctx.scale(2.2,1);aucGlow(w*2.6,P.mid,.7*fl);ctx.restore();aucGlow(w*1.2,P.core,1);
      if(b.kind==='fast'){ctx.strokeStyle=`rgba(${P.core},${.6*fl})`;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(-26,0);ctx.lineTo(26,0);ctx.moveTo(0,-12*fl);ctx.lineTo(0,12*fl);ctx.stroke()}}
    ctx.restore()}
  /* clarões, estrelas de impacto, anéis */
  for(const e of AUCFX){const p=e.t/e.life,P=AUCPAL[e.rd?'r':'n'];
    if(e.k==='mz'){const s=e.t<2?(e.t+1)/2.4:1-(e.t-2)/(e.life-2),a=Math.max(0,s);ctx.save();ctx.translate(e.x,e.y);ctx.scale(e.dir,1);
      ctx.save();ctx.scale(2.4,1);aucStar(52*e.pw*s,e.R.slice(0,4),5*e.pw,P.mid,a,e.rot*0);ctx.restore();
      aucStar(48*e.pw*s,e.R,3.2*e.pw,P.mid,a,e.rot+e.t*.25);aucStar(30*e.pw*s,e.R,1.6*e.pw,P.core,a,e.rot+e.t*.25);
      aucGlow(34*e.pw*s+4,P.out,.6*a);aucGlow(14*e.pw*s+3,P.core,a);ctx.restore()}
    if(e.k==='jag'){const s=e.t<3?(e.t+1)/3:1-(e.t-3)/(e.life-3);ctx.save();ctx.translate(e.x+e.dir*20,e.y);ctx.scale(e.dir*s*1.3,s);
      for(const[c,k]of[[P.out,1],[P.mid,.72],[P.core,.42]]){ctx.fillStyle=`rgba(${c},${.85*s})`;ctx.beginPath();e.J.forEach((j,i)=>{const an=i/e.J.length*Math.PI*2,r=(i%2?28:62)*j*k;const xx=Math.cos(an)*r*(Math.cos(an)>0?1.6:.8),yy=Math.sin(an)*r;i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy)});ctx.closePath();ctx.fill()}ctx.restore()}
    if(e.k==='imp'){const s=1-p;ctx.save();ctx.translate(e.x,e.y);const R=(e.big?120:60);
      aucStar(R*(.6+p*.6),e.S.map(q=>({a:q.a,l:q.v})),e.big?4:2.4,P.mid,s,e.rot);aucGlow(R*.5*s+6,P.core,s);
      ctx.lineCap='round';ctx.strokeStyle=`rgba(${P.core},${s})`;ctx.lineWidth=e.big?3:2;ctx.beginPath();for(const q of e.S){const r0=R*.3+p*R*1.3*q.v,r1=r0+R*.35*s;ctx.moveTo(Math.cos(q.a)*r0,Math.sin(q.a)*r0);ctx.lineTo(Math.cos(q.a)*r1,Math.sin(q.a)*r1)}ctx.stroke();ctx.restore()}
    if(e.k==='ring'){const s=1-p;ctx.strokeStyle=`rgba(${P.mid},${.8*s})`;ctx.lineWidth=(e.r>80?7:3)*s+1;ctx.beginPath();ctx.ellipse(e.x,e.y,e.r*(.25+p),e.r*(.25+p)*.6,0,0,7);ctx.stroke()}}
  ctx.restore()}
function aucTick(){aucFxTick();const nb=[];
  for(const b of AUCB){if(G.hitstop>0){nb.push(b);continue}
    for(let k=0;k<3;k++){b.x+=b.vx/3;b.y+=(b.vy||0)/3;
      const o=b.o;if(o&&!o.ko&&o.inv<=0&&Math.abs(o.x-b.x)<(b.big?64:46)&&b.y>o.y-300&&b.y<o.y+10){const h=b.big?{dmg:b.dmg,kb:8,launch:-7,heavy:1,hs:16,px:b.x,py:b.y,kind:'blast'}:{dmg:b.dmg,kb:1.2,hs:7,px:b.x,py:b.y,kind:'blast'};if(b.big){flashL(b.x,b.y,b.rd?'#ff1a2a':'#ff6a2a',260,.9,12);G.shake=Math.max(G.shake,12)}
        if(applyHit(b.f,o,h)){aucImpact(b.x,b.y,b.big,b.rd);for(let i=0;i<(b.big?8:3);i++)spark(b.x,b.y,i%2?'#ffffff':b.rd?'#ff2a3a':'#ffb040',1,rand(3,9))}if(o.hp<=0)ko(b.f,o);b.life=0;break}}
    b.h.push([b.x,b.y]);if(b.h.length>(b.kind==='fast'?7:b.kind==='big'?8:4))b.h.shift();
    if(b.kind==='big'&&G.frame%2===0)spark(b.x-b.vx*.5,b.y+rand(-12,12),b.rd?'#ff2a3a':'#ffb040',1,rand(2,5));
    if(--b.life>0&&b.x>-60&&b.x<WW+60)nb.push(b)}
  AUCB=nb;if(G.mode!=='fight'){AUCFX=[]}
  for(const f of G.p){if(!isAuc(f)||f.ko)continue;
    /* golpes com a arma no combo (tiro, tiro pra cima, rasteira atirando, tiro no ar): disparam um tiro no 1º quadro ativo */
    const SH=f.state==='attack'&&f.move&&AUCSH[f.mname];
    if(SH){if(f.aucMv!==f.move){f.aucMv=f.move;f.aucN=0;if(SH.back)f.vx=-f.facing*SH.back}
      if(f.aucN<SH.n&&f.mf>=f.move.su+f.aucN*(SH.gap||0)){const i=f.aucN++;aucFire(f,SH.d,(SH.dy||188)+(SH.alt&&i%2?14:0),{big:SH.big,fast:SH.fast});if(SH.big)txt(f.x,f.y-320,'TIRO GROSSO!','#ff6a7a')}}
    else f.aucMv=null;
    if(f.state==='attack'&&f.move&&AUC_GUN[f.mname]){if(f.mf>=f.move.su&&f.aucS!==f.move){f.aucS=f.move;aucFire(f,f.mname.endsWith('sweep')?30:36,f.mname.endsWith('sweep')?96:f.mname.endsWith('str')?212:188)}}
    else f.aucS=null;
    /* muito rápido: rastro vermelho correndo/dash */
    if(G.hitstop<=0&&(f.state==='run'||f.state==='vrun'||f.state==='vdash'||f.state==='dash')&&G.frame%3===0)f.ghosts.push({key:spriteKey(f),x:f.x,y:f.y,facing:f.facing,life:9,col:'#ff3a4a'})}}
/* Ki = RAJADA DE 3 TIROS (folha 03: saca e atira) */
function aucKiStep(f,o,t){const D=1.7,k=Math.floor(t/D),END=Math.round(8*D+6);f.vx=0;
  if(k===4&&f.aucK!==k){f.aucK=k;aucFire(f,24,196,{vy:-1.6});aucFire(f,24,188);aucFire(f,24,180,{vy:1.6});txt(f.x,f.y-320,'TIRO TRIPLO!','#ffb0b8')}
  if(t>=END){f.aucK=-1;neutral(f)}}
/* v595: botão SOCO = sequência de TIROS trocando de postura (o soco vira pistola). 1º tiro: duas mãos OU uma mão (sorteado). */
const AUCSH={aj1:{n:1,d:26,dy:192},aj1b:{n:1,d:26,dy:186},aj2:{n:2,gap:4,d:18,dy:192,fast:1},aj3:{n:6,gap:2,d:10,dy:118,alt:1,fast:1},aj4:{n:2,gap:4,d:24,dy:188,back:15},aj5:{n:1,d:72,dy:150,big:1}};
const AUCMAP={ujab:'aj1',ujab2:'aj2',ujab3:'aj3',uknee:'aj4',ustr:'aj5'};
(function(){const H=[-10,-280,70,280],M=(su,ac,rc,nx,kn)=>({su,ac,rc,dmg:8,hb:H,kb:.5,hs:5,next:nx,knext:kn,lean:.4,cat:'punch'});
  Object.assign(MOVES,{aj1:M(3,4,9,'aj2','ukick'),aj1b:M(3,4,9,'aj2','ukick'),aj2:M(2,7,8,'aj3','ukick2'),aj3:M(2,13,8,'aj4','ukick3'),aj4:M(4,7,8,'aj5','uhkick'),aj5:M(6,5,14,null,null)});
  Object.assign(VGA,{aj1:['sA',[0,1],[2,3,4],[5,6,7]],aj1b:['sB',[0,1],[2,3,4],[5,6,7]],aj2:['sA',[2],[3,4,5],[6,7]],aj3:['sC',[0],[1,2,3,4,5,6],[7]],aj4:['sD',[0,1],[2,3,4,5],[6,7]],aj5:['sE',[0,1],[2,3,4],[5,6,7]]})})();
{const _sm=startMove;startMove=function(f,name){if(isAuc(f)&&!f.form&&name){let n=VGN[name]||name;if(/^[vuw]/.test(n))n='u'+n.slice(1);const m=AUCMAP[n];if(m)name=m==='aj1'&&Math.random()<.5?'aj1b':m}return _sm.call(this,f,name)}}
let AUCRD=null;
function aucRed(){if(AUCRD)return AUCRD;const I=GJAU.img;if(!I||!I.complete||!I.naturalWidth)return null;const c=document.createElement('canvas');c.width=I.naturalWidth;c.height=I.naturalHeight;const g=c.getContext('2d');g.drawImage(I,0,0);
  try{const d=g.getImageData(0,0,c.width,c.height),a=d.data;for(let i=0;i<a.length;i+=4){const L=Math.max(a[i],a[i+1],a[i+2]);a[i]=Math.min(255,L*1.12);a[i+1]=Math.min(255,L*.16);a[i+2]=Math.min(255,L*.2)}g.putImageData(d,0,0)}catch(e){g.globalCompositeOperation='source-atop';g.fillStyle='rgba(255,40,50,.85)';g.fillRect(0,0,c.width,c.height)}
  return AUCRD=c}
/* aura do Gojo VERMELHA (sempre ligada; mais forte carregando) */
function aucAura(f,k){const t=G.frame,ch=f.state==='charge',P=aucRed(),A=GJAU;
  if(P){const i=Math.floor(t/3)%A.n,h=(ch?320:285)*(1+.03*Math.sin(t*.5)),w=h*A.w/A.h*.85;ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=ch?.62:.24;ctx.translate(f.x,f.y-h*.47);ctx.scale((t>>4)%2?f.facing:-f.facing,1);ctx.drawImage(P,0,i*A.h,A.w,A.h,-w/2,-h/2,w,h);ctx.restore()}
  if(G.hitstop<=0&&t%(ch?2:7)===0)addP({x:f.x+rand(-50,50),y:f.y-rand(20,240),vx:rand(-.3,.3),vy:-rand(1,2.4),life:22,max:22,c:Math.random()<.7?'#ff2a3a':'#ffd6da',type:'glow',sz:rand(2,4),g:0});
  if(ch)zArcs(f,f.x,f.y,ZPAL.red,4,.6)}
function ytAura(f,k){if(isAuc(f))return aucAura(f,k);""")
open(P,'w',encoding='utf8').write(s);print('alucard ok',len(s))
