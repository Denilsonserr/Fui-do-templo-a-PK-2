
/* ================= v193: GAROU (sid gr normal, sid grm = Forma Monstro; id garou) — mestre do combo e do COUNTER: socos/chutes mais rápidos do jogo,
   cancelar no acerto, Ki = 2 socos relâmpago, defesa perfeita/esquiva na hora certa = CONTRA-ATAQUE, golpe no início do golpe do rival = COUNTER (+35%).
   Normal: aura azul-clara leve (azul forte ao carregar). Monstro: o mais rápido do jogo, aura vermelha (estilo Gojo) com raios vermelhos e rastro de velocidade. ================= */
SPRH.gr=__GR__;SPRH.grm=__GRM__;
const GRV={"f":__GRV__},GRU={"f":__GRU__},GRVF=[],GRUF=[];let GRP=null;
const GRVD=5,GRVE=Math.round(GRV.f.length*GRVD);
const GRAU={"src":"__GRAU__","n":5,"w":360,"h":405};GRAU.img=new Image();GRAU.img.src=GRAU.src;
function grLoad(){if(GRP)return GRP;GRU.f.forEach((p,i)=>{const im=new Image();im.decoding='async';im.onload=()=>{GRUF[i]=im};im.src=p});
  return GRP=Promise.all(GRV.f.map((p,i)=>new Promise(r=>{const im=new Image();im.decoding='async';im.onload=()=>{GRVF[i]=im;r()};im.onerror=()=>r();im.src=p})))}
const GRK={grk:1,grc:1,grcn:1};
function grKey(f){const t=f.st,M=!!f.form;
  if(f.state==='grc')return['cmb',Math.min(15,Math.floor(t/(M?3:4)))];
  if(f.state==='grk')return['ki1',Math.min(7,Math.floor(t/(M?1.5:2)))];
  if(f.state==='grcn')return t<5?['dodge',3]:['jab',Math.min(7,2+Math.floor((t-5)/2))];
  return['idle',0]}
Object.assign(VGA,{qjab:['jab',[1,2],[3,4],[5,6,7]],qjab2:['cross',[1,2],[3,4],[5,6,7]],qjab3:['jab2',[0,1],[2,3,4],[5,6,7]],qknee:['str',[0,1,2],[3,4,5],[6,7]],qstr:['upper',[1,2,3],[4,5,6],[7]],
  qkick:['kick',[1],[2,3,4],[5,6,7]],qhkick:['hkick',[1,2],[3,4,5],[6,7]],qsweep:['sweep',[1,2],[3,4,5],[6,7]],
  qajab:['ajab',[1],[2,3,4],[5,6,7]],qakick:['akick',[1],[2,3,4],[5,6,7]],qsmash:['palm',[0,1,2,3],[4,5],[6,7]],qrush:['dash2',[1,2],[3,4],[5,6]]});
for(const k of ['jab','jab2','jab3','knee','str','kick','hkick','sweep','ajab','akick','smash','rush'])VGA['x'+k]=VGA['q'+k];
(function(){for(const sid of ['gr','grm']){const S=SPRH[sid];Object.assign(S,{jump:S.jumpv,combo:S.jab,sp:S.ki1,trans:S.pw,fly:S.jumpd,up:S.upper,dash:S.dashf,low:S.sweep,throw:S.palm,kunai:S.palm,fire:S.ki1})}
  const B=(reach,top,bot)=>[-10,-(top||280),reach+55,(top||280)+(bot||0)];
  const N={
    qjab:{nrPush:7,su:2,ac:4,rc:5,dmg:46,hb:B(185),kb:1.3,hs:19,next:'qjab2',knext:'qkick',lean:1.6,cat:'punch',grQ:1},
    qjab2:{nrPush:8,su:2,ac:4,rc:5,dmg:50,hb:B(190),kb:1.4,hs:20,next:'qknee',knext:'qkick',lean:1.8,cat:'punch',grQ:1},
    qknee:{nrPush:8,su:3,ac:4,rc:6,dmg:55,hb:B(195,280,20),kb:1.5,hs:20,next:'qjab3',knext:'qhkick',lean:1.8,cat:'punch',grQ:1},
    qjab3:{nrPush:8,su:2,ac:4,rc:5,dmg:50,hb:B(195),kb:1.4,hs:20,next:'qstr',knext:'qkick',lean:1.8,cat:'punch',grQ:1},
    qstr:{nrPush:10,su:3,ac:5,rc:11,dmg:96,hb:B(205,300),kb:9,hs:24,heavy:1,lean:2.2,cat:'punch',grQ:1,grF:1},
    qkick:{nrPush:7,su:3,ac:4,rc:7,dmg:58,hb:B(205,260,20),kb:2,hs:20,lean:1.2,next:'qjab',knext:'qhkick',cat:'kick',grQ:1},
    qhkick:{nrPush:6,su:4,ac:5,rc:10,dmg:86,hb:B(210,320),kb:4,launch:-10,launcher:1,heavy:1,lean:1.4,cat:'kick',grQ:1},
    qsweep:{su:3,ac:5,rc:11,dmg:64,hb:[-10,-90,290,90],kb:3,launch:-5,low:1,crouch:1,cat:'kick'},
    qajab:{su:3,ac:4,rc:8,dmg:44,hb:B(180,240,140),kb:2.5,hs:18,air:1,next:'qakick',cat:'punch'},
    qakick:{su:3,ac:5,rc:8,dmg:60,hb:B(200,240,160),kb:5,hs:18,air:1,cat:'kick'},
    qsmash:Object.assign({},MOVES.smash,{hb:B(200)}),qrush:Object.assign({},MOVES.rush,{hb:B(210)})};
  Object.assign(MOVES,N);
  // Forma Monstro: mesmos golpes, MUITO mais rápidos e fortes
  for(const k in N){const m=Object.assign({},N[k]);m.su=Math.max(1,Math.round(m.su*.5));m.rc=Math.max(3,Math.round(m.rc*.55));m.dmg=Math.round(m.dmg*1.15);m.hb=m.hb.slice();m.hb[2]+=30;
    if(m.next)m.next='x'+m.next.slice(1);if(m.knext)m.knext='x'+m.knext.slice(1);MOVES['x'+k.slice(1)]=m}
  for(const sid of ['gr','grm'])FR[sid]={charge:[['pw',6],['pw',7]],jab:[['jab',3],['jab',4],['jab',5]],cross:[['cross',3],['cross',4],['cross',5]],upper:[['upper',3],['upper',4],['upper',5]],
    hkick:[['hkick',3],['hkick',4],['hkick',5]],sweep:[['sweep',3],['sweep',4],['sweep',5]],blastP:['ki1',3],blastF:['ki1',4],super:[['ki1',3],['ki1',4],['ki1',5]],beamF:['ki1',4],win:[0,1,2],trans:[['pw',7]]};
  HAIR.gr=1.2;HAIR.grm=1.0;HAND.gr={};HAND.grm={};RUSHK.gr=[['cmb1',2],['cmb1',3],['cmb1',5],['cmb1',7],['cmb1',11],['cmb1',12],['cmb1',13]];RUSHK.grm=[['cmb',3],['cmb',4],['cmb',5],['cmb',7],['cmb',11],['cmb',12],['cmb',13]];
})();
function grOpp(f){return G.p[0]===f?G.p[1]:G.p[0]}
/* ---------- Ki = 2 socos relâmpago ---------- */
function grQuick(f){if(f.ki<4){if(!f.cpu)say(f,'PRECISA DE 4 KI');return false}f.ki-=4;f.state='grk';f.st=0;f.vx=0;f.move=null;f.guard=false;f.grH=0;SFX.whoosh();return true}
/* ---------- combo pronto (botão de combo) ---------- */
function grCombo(f,o){grLoad();f.state='grc';f.st=0;f.vx=0;f.move=null;f.guard=false;f.grHeld=false;f.grK=-1;SFX.whoosh()}
/* ---------- CONTRA-ATAQUE ---------- */
function grCounter(d,a,why){if(d.ko||a.ko)return;d.state='grcn';d.st=0;d.move=null;d.vx=0;d.guard=false;d.hitstun=0;d.inv=Math.max(d.inv,20);d.grCa=a;d.grGot=(d.grGot||0)+1;
  if(d.form){const ox=d.x;d.x=clamp(a.x-a.facing*105,40,WW-40);d.facing=a.x>d.x?1:-1;for(let i=0;i<12;i++)addP({x:lerp(ox,d.x,i/12),y:d.y-rand(70,220),vx:0,vy:0,life:12,max:12,c:pick(['#ff2020','#ff7060','#ffffff']),type:'glow',sz:rand(7,13),g:0})}
  txt(d.x,d.y-300,why||'CONTRA-ATAQUE!',d.form?'#ff5a4a':'#9fe0ff');G.hitstop=Math.max(G.hitstop,8);G.fzDark=Math.max(G.fzDark||0,6);ring(d.x+d.facing*40,d.y-150,d.form?'#ff3030':'#9fe0ff',120,14,4);try{SFX.zip()}catch(e){}buzz(40)}
function grStep(f){const o=grOpp(f),t=++f.st,fw=f.facing,M=!!f.form;
  if(f.state==='grk'){const H1=M?3:4,H2=M?7:9,END=M?14:18;
    if(t===2||t===6)f.x=clamp(f.x+fw*(M?14:10),40,WW-40);
    if((t===H1||t===H2)&&o&&!o.ko&&Math.abs(o.x-f.x)<(M?290:265)&&Math.abs(o.y-f.y)<200&&o.inv<=0){const h={dmg:M?44:34,kb:t===H2?3.5:1.5,hs:12,px:o.x-fw*40,py:o.y-170,kind:'melee'};
      if(applyHit(f,o,h)){grImpact(f,o,h);f.combo=(f.combo||0)}if(o.hp<=0)ko(f,o)}
    if(t>=END)neutral(f);return}
  if(f.state==='grcn'){const a=f.grCa||o;if(t===6&&a&&!a.ko&&Math.abs(a.x-f.x)<260){const h={dmg:M?115:78,kb:7,hs:20,heavy:1,px:a.x-fw*30,py:a.y-160,kind:'melee'};f.inv=Math.max(f.inv,8);
      if(applyHit(f,a,h)){grImpact(f,a,h);ring(a.x,a.y-160,M?'#ff2020':'#bfeaff',170,18,6);flashL(a.x,a.y-160,M?'#ff3030':'#7fd0ff',360,.8,14);G.shake=Math.max(G.shake,12)}if(a.hp<=0)ko(f,a)}
    if(t>=(M?16:20)){f.inv=Math.max(f.inv,4);neutral(f)}return}
  if(f.state==='grc'){const D=M?3:4,k=Math.floor(t/D),END=16*D+6,HK=M?{2:32,3:30,4:32,5:34,7:36,8:34,10:30,11:34,12:36,13:38}:{2:22,3:22,4:24,5:26,7:28,8:24,10:22,11:26,12:28,13:30};
    if(k===2||k===10)f.x=clamp(f.x+fw*(M?12:8),40,WW-40);
    if(!f.grHeld&&k<=6&&o&&!o.ko){const dx=o.x-f.x;if(Math.sign(dx)===fw&&Math.abs(dx)>110)f.x=clamp(f.x+fw*Math.min(Math.abs(dx)-110,M?30:22),40,WW-40)}
    if(!f.grHeld&&k>=1&&k<=7&&o&&!o.ko&&Math.abs(o.x-f.x)<300&&Math.abs(o.y-f.y)<230&&(o.inv<=0||o.state==='blockstun')){f.grHeld=true;fzTag(f,M?'Combo do Monstro!':'Punho da Água Corrente!')}
    if(f.grHeld&&o){const lift=k>=6&&k<=8?Math.min(90,(t-6*D)*6):0;o.state='rushed';o.st=0;o.vx=0;o.vy=0;o.flying=false;o.grounded=lift<=0;o.move=null;o.x=clamp(f.x+fw*120,40,WW-40);o.y=FLOOR-lift;
      if(k!==f.grK){f.grK=k;
        if(HK[k]){const h={dmg:HK[k],kb:0,hs:5,px:o.x-fw*30,py:o.y-rand(130,200),kind:'melee',lock:1};applyHit(f,o,h);grImpact(f,o,h);G.hitstop=Math.max(G.hitstop,3);G.shake=Math.max(G.shake,4);if(o.hp<=0){ko(f,o);f.grHeld=false}}
        if(k===15&&f.grHeld){o.y=FLOOR;o.grounded=true;const h={dmg:M?150:105,kb:0,hs:22,heavy:1,px:o.x-fw*10,py:o.y-150,kind:'melee',lock:1};applyHit(f,o,h);f.grHeld=false;
          o.state='airhit';o.vx=fw*13;o.vy=-7;o.grounded=false;o.bounced=false;if(!f.finDone&&f.combo>=3)comboFinish(f,o,h);G.shake=Math.max(G.shake,16);
          ring(o.x,o.y-150,M?'#ff2020':'#9fe0ff',260,22,7);flashL(o.x,o.y-150,M?'#ff3030':'#7fd0ff',520,.9,20);if(o.hp<=0)ko(f,o)}}}
    if(t>=END){f.grHeld=false;neutral(f)}return}}
function grImpact(a,d,h,fin){const x=h.px||d.x,y=h.py||d.y-150,M=!!a.form,c1=M?'#ff3020':'#4fb0ff',c2=M?'#ffd0c8':'#e8f8ff';ring(x,y,M?'#ff3a2a':'#bfeaff',fin?150:M?80:62,fin?18:10,fin?6:3);
  for(let i=0;i<(fin?18:M?9:7);i++){const an=-Math.PI*.9+Math.random()*Math.PI*1.8,v=rand(3,fin?12:8);addP({x,y,vx:Math.cos(an)*v*a.facing,vy:Math.sin(an)*v-1,life:rand(12,22),max:22,c:i%3?c1:c2,type:'glow',sz:rand(3,fin?9:6),g:.25})}
  for(let i=0;i<(M?8:5);i++)spark(x,y,i%2?c2:c1,1,rand(4,10));
  if(fin){flashL(x,y,M?'#ff3030':'#6fc8ff',420,.85,16);G.shake=Math.max(G.shake,10);G.hitstop=Math.max(G.hitstop,7);ring(x,y,'#ffffff',90,12,4);G.ck.vx+=a.facing*2.5}}
/* golpe do Garou que acerta o rival no INÍCIO do golpe dele = COUNTER (+35%) — chamado pelo applyHit */
function grCHit(a,d,h){if(!isGr(a)||h.lock||d.state!=='attack'||!d.move||d.mf>d.move.su+1)return 1;txt(d.x,d.y-280,'COUNTER!',a.form?'#ff5a4a':'#9fe0ff');G.hitstop=Math.max(G.hitstop,6);return 1.35}
/* ---------- tick: rastro de velocidade ---------- */
function grTick(){if(G.mode!=='fight'||G.hitstop>0)return;
  for(const f of G.p){if(!f||!isGr(f)||f.hide>0)continue;const mv=Math.abs(f.vx)>1.5&&(f.state==='walk'||f.state==='run'||f.state==='vrun'||f.state==='vdash'||f.state==='vbdash'||f.state==='dash'||f.state==='attack');
    if(f.form&&mv){if(G.frame%3===0)f.ghosts.push({key:spriteKey(f),x:f.x,y:f.y,facing:f.facing,life:12,col:'#ff2020'});
      if(G.frame%2===0)addP({x:f.x-f.facing*rand(20,70),y:f.y-rand(20,240),vx:-f.facing*rand(1,3),vy:-rand(0,.6),life:rand(12,20),max:20,c:pick(['#ff2020','#ff5a4a','#ffb0a0']),type:'glow',sz:rand(3,7),g:0})}
    else if(!f.form&&mv&&(f.state==='run'||f.state==='vrun'||f.state==='vdash')&&G.frame%4===0)f.ghosts.push({key:spriteKey(f),x:f.x,y:f.y,facing:f.facing,life:8,col:'#9fe0ff'})}}
/* ---------- aura ---------- */
function grAura(f,k){const t=G.frame,cx=f.x,base=f.y,ch=f.state==='charge';
  if(f.form){if(GRAU.img.complete&&GRAU.img.naturalWidth){const i=Math.floor(t/3)%GRAU.n,h=(ch?320:290)*(1+.03*Math.sin(t*.6)),w=h*GRAU.w/GRAU.h*.86;
      ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=ch?.6:.4;ctx.translate(cx,base-h*.47);ctx.scale((t>>4)%2?f.facing:-f.facing,1);ctx.drawImage(GRAU.img,0,i*GRAU.h,GRAU.w,GRAU.h,-w/2,-h/2,w,h);ctx.restore()}
    zArcs(f,cx,base,ZPAL.red,ch?7:4,ch?.85:.5);
    if(G.hitstop<=0&&t%(ch?2:3)===0)addP({x:cx+rand(-60,60),y:base-rand(10,250),vx:rand(-.4,.4),vy:-rand(1.4,3),life:rand(16,26),max:26,c:pick(['#ff2020','#ff5a4a','#ffd0c8']),type:'glow',sz:rand(2.5,5),g:0});return}
  // normal: aura leve azul-clara e transparente (azul forte carregando) — mesma chama da Forma Monstro, recolorida em azul
  const B=grBlue();if(B){const i=Math.floor(t/3)%GRAU.n,h=(ch?300:270)*(1+.03*Math.sin(t*.5)),w=h*GRAU.w/GRAU.h*.8;
    ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=ch?.62:.2;ctx.translate(cx,base-h*.47);ctx.scale((t>>4)%2?f.facing:-f.facing,1);ctx.drawImage(B,0,i*GRAU.h,GRAU.w,GRAU.h,-w/2,-h/2,w,h);ctx.restore()}
  if(G.hitstop<=0&&t%(ch?2:8)===0)addP({x:cx+rand(-50,50),y:base-rand(20,230),vx:rand(-.3,.3),vy:-rand(1,2.2),life:22,max:22,c:ch?'#4fa8ff':'#d8f2ff',type:'glow',sz:rand(2,3.5),g:0});
  if(ch)zArcs(f,cx,base,ZPAL.blue,4,.6)}
let GRB=null;
function grBlue(){if(GRB)return GRB;const I=GRAU.img;if(!I.complete||!I.naturalWidth)return null;const c=document.createElement('canvas');c.width=I.naturalWidth;c.height=I.naturalHeight;const g=c.getContext('2d');g.drawImage(I,0,0);
  try{const d=g.getImageData(0,0,c.width,c.height),a=d.data;for(let i=0;i<a.length;i+=4){const r=a[i],gg=a[i+1],b=a[i+2];a[i]=Math.min(255,gg*.8+b*.2);a[i+1]=Math.min(255,gg+r*.55);a[i+2]=Math.min(255,Math.max(r,b))}g.putImageData(d,0,0)}catch(e){g.globalCompositeOperation='source-atop';g.fillStyle='rgba(90,180,255,.85)';g.fillRect(0,0,c.width,c.height)}
  return GRB=c}
/* ---------- transformação e ultimate ---------- */
function updGRT(T,f,t){G.tz=1.15;G.tzx=sxs(f.x);G.tzy=sys(f.y-150);if(t<GRVE)return;
  if(t===GRVE){f.form=1;f.formT=FORM_T;f.flick=0;G.flash=14;G.flashCol='#ffd0c8';G.shake=26;
    for(const r of [320,200,110])ring(f.x,f.y-150,r===110?'#ffffff':'#ff2020',r,26,7);for(let i=0;i<40;i++)spark(f.x,f.y-150,i%3?'#ff8070':'#ff2020',1,rand(5,16));
    SFX.transform();banner('FORMA MONSTRO!','#ff5a4a',90,f.def.formSub);buzz(150)}
  if(t>GRVE&&t%3===0)addP({x:f.x+rand(-70,70),y:f.y-rand(30,260),vx:0,vy:-rand(1,2),life:20,max:20,c:'#ff3030',type:'glow',sz:rand(3,6),g:0});
  if(t>=GRVE+30){G.trans=null;f.inv=15;neutral(f);G.tz=1}}
function grSuper(f,o){if(!f.form){if(!f.cpu)say(f,'SÓ NA FORMA MONSTRO');return false}if(f.ki<100){if(!f.cpu)say(f,'PRECISA DE 100 KI');return false}if(!o||o.ko)return false;grLoad();
  f.ki-=100;f.state='whtS';f.st=0;f.inv=999;f.vx=0;f.vy=0;f.flying=false;f.y=FLOOR;f.grounded=true;f.rushKey=['pw',5];o.hypHard=0;o.iceHard=0;
  G.ws={gr:1,a:f,d:o,t:0,hi:0,vt:0};banner('EXPLOSÃO GAMA','#ff5a4a',60,'ULTIMATE');G.flash=4;G.flashCol='#ffd0c8';SFX.superUp();buzz(70);return true}
function updGRU(){const R=G.ws,a=R.a,d=R.d,FL=GRU.f.length;R.t++;const t=R.t;a.st=t;a.y=FLOOR;a.grounded=true;d.state='rushed';d.st=t;d.vx=0;d.vy=0;d.flying=false;
  if(t<VGU0){a.rushKey=['pw',Math.min(7,(t/4)|0)];G.tz=1.18;G.tzx=sxs(a.x+a.facing*60);G.tzy=sys(a.y-180);G.shake=Math.max(G.shake,1+t*.12);
    if(t%2===0)addP({x:a.x+rand(-80,80),y:a.y-rand(30,260),vx:0,vy:-rand(1,3),life:20,max:20,c:Math.random()<.6?'#ff2020':'#ffffff',type:'glow',sz:rand(3,6),g:0});if(t%6===0)SFX.charge();if(t===VGU0-1){G.flash=8;G.flashCol='#ffd0c8'}return}
  if(t===VGU0){SFX.blast();G.tz=1}
  const vt=(t-VGU0)/60*USP(FL);R.vt=vt;const fi=vt*12,HI=[.3,.45,.6,.72,.84].map(q=>Math.round(FL*q));
  if(R.hi<HI.length&&fi>=HI[R.hi]){R.hi++;G.shake=Math.max(G.shake,12);SFX.boom();buzz(40);if(!d.ko)applyHit(a,d,{dmg:36,kb:0,hs:6,px:d.x,py:d.y-120,kind:'blast',lock:1});d.state='rushed';d.vx=0;d.vy=0}
  if(vt>=FL/12-.05){G.flash=10;G.flashCol='#ffffff';G.shake=Math.max(G.shake,28);SFX.crater();SFX.boom();buzz(150);
    flashL(d.x,d.y-140,'#ff2020',660,1,30);ring(d.x,FLOOR-6,'#ff5a4a',300,26,8);for(let i=0;i<22;i++)debris(d.x+rand(-180,180),FLOOR);
    d.y=FLOOR;d.grounded=true;if(!d.ko)applyHit(a,d,{dmg:260,kb:0,hs:24,heavy:1,px:d.x,py:d.y-120,kind:'blast',lock:1});
    G.ws=null;a.rushKey=null;a.inv=12;neutral(a);G.tz=1;d.vx=0;d.vy=0;d.y=FLOOR;d.grounded=true;d.flying=false;if(!d.ko){d.state='down';d.st=6;d.downX=45;txt(d.x,d.y-200,'NOCAUTEADO!','#ff8070')}}}
