/* ================= v280: SHAKA DE VIRGEM (sid sk normal, skd = OLHOS ABERTOS; id shaka) — personagem SECRETO =================
   Muito rápido e muito dano; todo golpe que ACERTA cancela no próximo (soco <-> chute <-> Ki) = super combos fáceis.
   Ki (toque) = Passo de Luz (avanço dourado). Combo = Fúria de Virgem (16 quadros). Smash = palma de energia.
   Passiva (sempre): a cada 5 golpes RECEBIDOS = contra-ataque CRÍTICO.
   OLHOS ABERTOS (transformação, vídeo do dono sem som): inimigo PARALISADO 3 s; +90% dano, +40% velocidade, +60% crítico; DESVIA SOZINHO; aura dourada (chama do Gojo recolorida).
   Ultimate (100 Ki) = vídeo do dono; depois o inimigo fica paralisado tomando vários golpes invisíveis (normais e críticos) e cai. ================= */
SPRH.sk=__SK__;SPRH.skd=__SK__;
const SKV={"f":__SKV__},SKU={"f":__SKU__},SKVF=[],SKUF=[];let SKP=null;
const SKVD=5,SKVE=Math.round(SKV.f.length*SKVD);
function skLoad(){if(SKP)return SKP;SKU.f.forEach((p,i)=>{const im=new Image();im.decoding='async';im.onload=()=>{SKUF[i]=im};im.src=p});
  return SKP=Promise.all(SKV.f.map((p,i)=>new Promise(r=>{const im=new Image();im.decoding='async';im.onload=()=>{SKVF[i]=im;r()};im.onerror=()=>r();im.src=p})))}
const SKK={skk:1,skc:1,skcn:1};
const SKC=['#ffd84a','#fff3b0','#ffffff','#ffb21f'];
function skKey(f){const t=f.st,M=!!f.form;
  if(f.state==='skc'){const L=SPRH.sk.cmb.length;return['cmb',Math.min(L-1,Math.floor(t/(f.skDiv?1.9:M?2.5:3.2)))]}
  if(f.state==='skk')return['ki1',Math.min(7,Math.floor(t/(M?1.4:2)))];
  if(f.state==='skcn')return['roxo',Math.min(5,Math.floor(t/(M?2:3)))];
  return['idle',0]}
Object.assign(VGA,{Sjab:['jab',[1,2],[3,4],[5,6,7]],Sjab2:['cross',[1,2],[3,4],[5,6,7]],Sjab3:['jab2',[0,1],[2,3,4],[5,6,7]],Sstr:['str',[1,2],[3,4,5],[6,7]],Sknee:['upper',[1,2],[3,4,5],[6,7]],
  Skick:['kick',[1],[2,3,4],[5,6,7]],Skick2:['kick2',[1],[2,3,4],[5,6,7]],Skick3:['kick3',[0,1],[2,3,4],[5,6,7]],Shkick:['hkick',[1,2],[3,4,5],[6,7]],Ssweep:['sweep',[0,1],[2,3,4],[5,6,7]],
  Sajab:['ajab',[1],[2,3,4],[5,6,7]],Sakick:['akick',[1],[2,3,4],[5,6,7]],Ssmash:['palm',[0,1,2],[3,4,5],[6,7]],Srush:['dash2',[1,2],[3,4],[5,6]]});
for(const k of ['jab','jab2','jab3','str','knee','kick','kick2','kick3','hkick','sweep','ajab','akick','smash','rush'])VGA['Z'+k]=VGA['S'+k];
(function(){for(const sid of ['sk','skd']){const S=SPRH[sid];Object.assign(S,{jump:S.jumpv,combo:S.jab,sp:S.ki1,trans:S.pw,fly:S.jumpd,up:S.upper,dash:S.dashf,low:S.sweep,throw:S.palm,kunai:S.palm,fire:S.ki1})}
  const B=(reach,top,bot)=>[-10,-(top||280),reach+55,(top||280)+(bot||0)];
  const N={
    Sjab:{nrPush:8,su:2,ac:4,rc:5,dmg:54,hb:B(200),kb:1.3,hs:19,next:'Sjab2',knext:'Skick',lean:1.6,cat:'punch',skQ:1},
    Sjab2:{nrPush:8,su:2,ac:4,rc:5,dmg:58,hb:B(205),kb:1.4,hs:20,next:'Sjab3',knext:'Skick2',lean:1.8,cat:'punch',skQ:1},
    Sjab3:{nrPush:9,su:2,ac:4,rc:6,dmg:62,hb:B(215,300,30),kb:1.5,hs:20,next:'Sknee',knext:'Skick3',lean:1.8,cat:'punch',skQ:1},
    Sknee:{nrPush:6,su:3,ac:4,rc:8,dmg:74,hb:B(215,340),kb:4,launch:-10,launcher:1,heavy:1,next:'Sstr',knext:'Shkick',lean:1.6,cat:'punch',skQ:1},
    Sstr:{nrPush:11,su:3,ac:5,rc:10,dmg:118,hb:B(260,300),kb:9,hs:24,heavy:1,lean:2.2,cat:'punch',skQ:1,skF:1},
    Skick:{nrPush:7,su:2,ac:4,rc:6,dmg:60,hb:B(205,260,20),kb:2,hs:20,lean:1.2,next:'Sjab2',knext:'Skick2',cat:'kick',skQ:1},
    Skick2:{nrPush:8,su:2,ac:4,rc:6,dmg:66,hb:B(225,250,30),kb:2.2,hs:20,lean:1.3,next:'Sjab3',knext:'Skick3',cat:'kick',skQ:1},
    Skick3:{nrPush:9,su:3,ac:5,rc:8,dmg:76,hb:B(235,260,30),kb:3,hs:20,lean:1.4,next:'Sknee',knext:'Shkick',cat:'kick',skQ:1},
    Shkick:{nrPush:6,su:3,ac:5,rc:10,dmg:96,hb:B(220,330),kb:4,launch:-11,launcher:1,heavy:1,lean:1.4,cat:'kick',skQ:1,skF:1},
    Ssweep:{su:3,ac:5,rc:10,dmg:72,hb:[-10,-90,300,90],kb:3,launch:-5,low:1,crouch:1,cat:'kick',skQ:1},
    Sajab:{su:2,ac:4,rc:8,dmg:54,hb:B(200,240,160),kb:2.5,hs:18,air:1,next:'Sakick',cat:'punch'},
    Sakick:{su:3,ac:5,rc:8,dmg:66,hb:B(220,240,160),kb:5,hs:18,air:1,cat:'kick'},
    Ssmash:Object.assign({},MOVES.smash,{hb:B(260),dmg:(MOVES.smash.dmg||120)*1.2}),Srush:Object.assign({},MOVES.rush,{hb:B(230)})};
  Object.assign(MOVES,N);
  /* OLHOS ABERTOS: mesmos golpes mais rápidos e mais longe */
  for(const k in N){const m=Object.assign({},N[k]);m.su=Math.max(1,Math.round(m.su*.6));m.rc=Math.max(3,Math.round(m.rc*.6));m.hb=m.hb.slice();m.hb[2]+=40;
    if(m.next)m.next='Z'+m.next.slice(1);if(m.knext)m.knext='Z'+m.knext.slice(1);MOVES['Z'+k.slice(1)]=m}
  for(const sid of ['sk','skd'])FR[sid]={charge:[['pw',6],['pw',7]],jab:[['jab',3],['jab',4],['jab',5]],cross:[['cross',3],['cross',4],['cross',5]],upper:[['upper',3],['upper',4],['upper',5]],
    hkick:[['hkick',3],['hkick',4],['hkick',5]],sweep:[['sweep',3],['sweep',4],['sweep',5]],blastP:['ki2',3],blastF:['ki2',4],super:[['ki2',3],['ki2',4],['ki2',5]],beamF:['ki2',4],win:[0,1,2],trans:[['pw',7]]};
  HAIR.sk=1.25;HAIR.skd=1.25;HAND.sk={};HAND.skd={};RUSHK.sk=[['cmb',3],['cmb',5],['cmb',7],['cmb',9],['cmb',11],['cmb',12],['cmb',13]];RUSHK.skd=RUSHK.sk;
})();
function skOpp(f){return G.p[0]===f?G.p[1]:G.p[0]}
/* ---------- buff dos OLHOS ABERTOS: +90% dano, +60% crítico (a velocidade está no speedMul) ---------- */
function skBuff(f){if(f.form&&!f.skB){f.skB=1;f.tdm=(f.tdm||1)*(1.9/1.45);f.tcr=(f.tcr||0)+60}else if(!f.form&&f.skB){f.skB=0;f.tdm=(f.tdm||1)/(1.9/1.45);f.tcr=(f.tcr||0)-60}}
/* ---------- efeitos ---------- */
function skBurst(x,y,big){ring(x,y,'#ffd84a',big?230:120,big?20:12,big?6:4);ring(x,y,'#ffffff',big?110:60,10,3);for(let i=0;i<(big?28:12);i++){const an=Math.random()*TAU,v=rand(3,big?13:8);addP({x,y,vx:Math.cos(an)*v,vy:Math.sin(an)*v-1,life:rand(14,26),max:26,c:pick(SKC),type:'glow',sz:rand(3,big?10:7),g:.1})}
  if(big){flashL(x,y,'#ffc93a',440,.85,18);G.shake=Math.max(G.shake,10)}}
function skImpact(a,d,h,fin){const x=h.px||d.x,y=h.py||d.y-150,M=!!a.form;ring(x,y,M?'#ffe27a':'#ffd84a',fin?160:M?86:66,fin?18:10,fin?6:3);
  for(let i=0;i<(fin?18:M?10:7);i++){const an=-Math.PI*.9+Math.random()*Math.PI*1.8,v=rand(3,fin?12:8);addP({x,y,vx:Math.cos(an)*v*a.facing,vy:Math.sin(an)*v-1,life:rand(12,22),max:22,c:pick(SKC),type:'glow',sz:rand(3,fin?9:6),g:.25})}
  for(let i=0;i<(M?8:5);i++)spark(x,y,i%2?'#fff3b0':'#ffc21f',1,rand(4,10));
  if(fin){flashL(x,y,'#ffc93a',420,.85,16);G.shake=Math.max(G.shake,10);G.hitstop=Math.max(G.hitstop,7);ring(x,y,'#ffffff',90,12,4);G.ck.vx+=a.facing*2.5}}
/* ---------- Ki = Passo de Luz ---------- */
function skQuick(f){if(f.ki<4){if(!f.cpu)say(f,'PRECISA DE 4 KI');return false}f.ki-=4;f.state='skk';f.st=0;f.vx=0;f.move=null;f.guard=false;f.skH=0;SFX.whoosh();return true}
/* ---------- combo pronto (botão de combo) ---------- */
function skCombo(f,o){skLoad();f.state='skc';f.st=0;f.vx=0;f.move=null;f.guard=false;f.skHeld=false;f.skKk=-1;SFX.whoosh()}
/* ---------- PASSIVA: a cada 5 golpes recebidos = contra-ataque CRÍTICO ---------- */
function skCounter(d,a){if(d.ko||a.ko)return;d.state='skcn';d.st=0;d.move=null;d.vx=0;d.guard=false;d.hitstun=0;d.inv=Math.max(d.inv,22);d.skCa=a;
  if(Math.abs(a.x-d.x)>220){d.x=clamp(a.x+(d.x<a.x?-150:150),40,WW-40)}d.facing=a.x>d.x?1:-1;
  txt(d.x,d.y-300,'CONTRA-ATAQUE!','#ffe27a');G.hitstop=Math.max(G.hitstop,8);G.fzDark=Math.max(G.fzDark||0,6);ring(d.x+d.facing*40,d.y-150,'#ffd84a',130,14,4);try{SFX.zip()}catch(e){}buzz(40)}
/* ---------- OLHOS ABERTOS: desvia sozinho (chamado no começo do applyHit) ---------- */
function skDodge(a,d,h){if(!isSk(d)||!d.form||h.lock||d.ko||!a||a===d||G.ws||G.trans)return false;if(G.frame<(d.skDg||0)||Math.random()>.35)return false;
  d.skDg=G.frame+50;d.ghosts.push({key:spriteKey(d),x:d.x,y:d.y,facing:d.facing,life:14,col:'#ffd84a'});
  d.x=clamp(a.x-a.facing*150,40,WW-40);d.facing=a.x>d.x?1:-1;d.inv=Math.max(d.inv,12);if(d.state==='hit'||d.state==='blockstun')neutral(d);
  txt(d.x,d.y-300,'DESVIOU!','#fff3b0');ring(d.x,d.y-150,'#ffd84a',90,10,3);try{SFX.zip()}catch(e){}return true}
function skStep(f){const o=skOpp(f),t=++f.st,fw=f.facing,M=!!f.form;
  if(f.state==='skk'){const D=M?1.4:2,k=Math.floor(t/D),END=Math.round(8*D+4);
    if(k<=3)f.x=clamp(f.x+fw*(M?34:26),40,WW-40);
    if(k>=1&&k<=4&&G.frame%2===0)f.ghosts.push({key:spriteKey(f),x:f.x,y:f.y,facing:f.facing,life:10,col:'#ffd84a'});
    if((k===3||k===5)&&f.skH!==k&&o&&!o.ko&&Math.abs(o.x-f.x)<300&&Math.abs(o.y-f.y)<210&&o.inv<=0){f.skH=k;const h={dmg:M?44:48,kb:k===5?4:1.5,hs:12,px:o.x-fw*40,py:o.y-160,kind:'melee'};
      if(applyHit(f,o,h))skImpact(f,o,h,k===5);if(o.hp<=0)ko(f,o)}
    if(t>=END)neutral(f);return}
  if(f.state==='skcn'){const a=f.skCa||o,HT=M?5:7;if(t===HT&&a&&!a.ko&&Math.abs(a.x-f.x)<320){const h={dmg:M?100:92,kb:7,hs:22,heavy:1,ycrit:1,px:a.x-fw*30,py:a.y-160,kind:'melee'};f.inv=Math.max(f.inv,8);
      if(applyHit(f,a,h)){skImpact(f,a,h,1);skBurst(a.x,a.y-160,1)}if(a.hp<=0)ko(f,a)}
    if(t>=(M?14:20)){f.inv=Math.max(f.inv,4);neutral(f)}return}
  if(f.state==='skc'){const D=f.skDiv?1.9:M?2.5:3.2,L=SPRH.sk.cmb.length,k=Math.floor(t/D),END=Math.round(L*D+6),FIN=L-3;
    const HK=M?{3:30,4:32,5:32,6:34,7:34,8:36,9:36,10:38,11:40}:{3:28,4:28,5:30,6:30,7:32,8:32,9:34,10:34,11:36};
    if(!f.skHeld&&k<=3&&o&&!o.ko){const dx=o.x-f.x;if(Math.sign(dx)===fw&&Math.abs(dx)>120)f.x=clamp(f.x+fw*Math.min(Math.abs(dx)-120,M?36:28),40,WW-40)}
    if(k<=2&&G.frame%2===0)f.ghosts.push({key:spriteKey(f),x:f.x,y:f.y,facing:f.facing,life:10,col:'#ffd84a'});
    if(!f.skHeld&&k>=1&&k<=6&&o&&!o.ko&&Math.abs(o.x-f.x)<330&&Math.abs(o.y-f.y)<240&&(o.inv<=0||o.state==='blockstun')){f.skHeld=true;fzTag(f,M?'Rendição Divina!':'Fúria de Virgem!')}
    if(f.skHeld&&o){o.state='rushed';o.st=0;o.vx=0;o.vy=0;o.flying=false;o.grounded=true;o.move=null;o.x=clamp(f.x+fw*140,40,WW-40);o.y=FLOOR;
      if(k!==f.skKk){f.skKk=k;
        if(HK[k]){const h={dmg:HK[k],kb:0,hs:5,px:o.x-fw*30,py:o.y-rand(130,200),kind:'melee',lock:1};applyHit(f,o,h);skImpact(f,o,h);G.hitstop=Math.max(G.hitstop,3);G.shake=Math.max(G.shake,4);if(o.hp<=0){ko(f,o);f.skHeld=false}}
        if(k===FIN&&f.skHeld){const h={dmg:M?160:130,kb:0,hs:22,heavy:1,px:o.x-fw*10,py:o.y-150,kind:'melee',lock:1};applyHit(f,o,h);f.skHeld=false;
          o.state='airhit';o.vx=fw*13;o.vy=-7;o.grounded=false;o.bounced=false;if(!f.finDone&&f.combo>=3)comboFinish(f,o,h);skBurst(o.x,o.y-150,1);if(o.hp<=0)ko(f,o)}}}
    else if(k!==f.skKk)f.skKk=k;
    if(t>=END){f.skHeld=false;neutral(f)}return}}
/* ---------- paralisia (olhos abertos: 3 s) e golpes invisíveis (depois da Ultimate) ---------- */
function skParFx(o){if(G.hitstop>0)return;if(G.frame%5===0)addP({x:o.x+rand(-70,70),y:o.y-rand(20,250),vx:0,vy:-rand(.4,1.2),life:22,max:22,c:pick(SKC),type:'glow',sz:rand(2.5,5),g:0});
  if(G.frame%30===0)ring(o.x,o.y-150,'#ffd84a',110,16,3)}
function skTick(){if(G.mode!=='fight')return;
  for(const f of G.p){if(!f)continue;
    if(f.skPar>0){if(f.ko||G.phase!=='fight'){f.skPar=0}else{f.skPar--;if(!['rushed','hit','airhit','down','getup'].includes(f.state)||f.state==='hit'){f.state='rushed';f.st=0}if(f.grounded){f.vx=0}f.move=null;f.guard=false;skParFx(f);if(f.skPar===0&&f.state==='rushed')neutral(f)}}
    if(!isSk(f))continue;skBuff(f);
    if(!f.cpu){const C=$('controls');if(C)C.classList.toggle('skf',!!f.form)}
    if(f.skInv){const I=f.skInv,d=I.o;I.t++;if(!d||d.ko||G.phase!=='fight'){f.skInv=null}else{d.state='rushed';d.st=0;d.vx=0;d.vy=0;d.move=null;d.guard=false;d.y=FLOOR;d.grounded=true;
      if(I.t%8===0&&I.n<12){I.n++;const cr=Math.random()<.4+(f.form?.25:0),x=d.x+rand(-50,50),y=d.y-rand(60,240),h={dmg:Math.round((cr?28*1.6:28)),kb:0,hs:4,px:x,py:y,kind:'blast',lock:1};applyHit(f,d,h);
        spark(x,y,cr?'#ffffff':'#ffd84a',1,cr?12:7);ring(x,y,cr?'#ffffff':'#ffd84a',cr?70:44,8,cr?4:2);if(cr)txt(x,y-30,'CRÍTICO!','#fff3b0');G.shake=Math.max(G.shake,cr?7:4);try{SFX.hit&&SFX.hit()}catch(e){}if(d.hp<=0){ko(f,d);f.skInv=null;continue}}
      if(I.t>=104){f.skInv=null;const h={dmg:150,kb:0,hs:20,heavy:1,px:d.x,py:d.y-140,kind:'blast',lock:1};applyHit(f,d,h);skBurst(d.x,d.y-150,1);try{SFX.crater();SFX.boom()}catch(e){}
        if(d.hp<=0){ko(f,d)}else{d.state='down';d.st=6;d.downX=45;d.vx=0;d.y=FLOOR;d.grounded=true;txt(d.x,d.y-200,'NOCAUTEADO!','#ffe27a')}}}}
    if(f.skCtr){const a=f.skCtr;f.skCtr=null;if(!f.ko&&f.state!=='rushed'&&f.state!=='whtS'&&!G.ws&&!G.trans&&a&&!a.ko&&a.state!=='whtS')skCounter(f,a)}
    if(G.hitstop>0||f.hide>0)continue;
    const mv=Math.abs(f.vx)>1.5&&(f.state==='walk'||f.state==='run'||f.state==='vrun'||f.state==='vdash'||f.state==='vbdash'||f.state==='dash'||f.state==='attack');
    if(f.form&&mv){if(G.frame%3===0)f.ghosts.push({key:spriteKey(f),x:f.x,y:f.y,facing:f.facing,life:12,col:'#ffd84a'});
      if(G.frame%2===0)addP({x:f.x-f.facing*rand(20,70),y:f.y-rand(20,240),vx:-f.facing*rand(1,3),vy:-rand(0,.6),life:rand(12,20),max:20,c:pick(SKC),type:'glow',sz:rand(3,7),g:0})}
    else if(!f.form&&mv&&(f.state==='run'||f.state==='vrun'||f.state==='vdash')&&G.frame%4===0)f.ghosts.push({key:spriteKey(f),x:f.x,y:f.y,facing:f.facing,life:8,col:'#ffe9a0'})}}
function skHitHook(a,d,h){if(!isSk(a)||h.lock)return;if(a.state==='attack'&&a.move&&a.move.skQ)skImpact(a,d,h,a.move.skF)}
/* ---------- aura dourada (só de olhos abertos) ---------- */
let SKGO=null;
function skGold(){if(SKGO)return SKGO;const I=GJAU.img;if(!I||!I.complete||!I.naturalWidth)return null;const c=document.createElement('canvas');c.width=I.naturalWidth;c.height=I.naturalHeight;const g=c.getContext('2d');g.drawImage(I,0,0);
  try{const d=g.getImageData(0,0,c.width,c.height),a=d.data;for(let i=0;i<a.length;i+=4){const r=a[i],gg=a[i+1],b=a[i+2],L=Math.max(r,gg,b);a[i]=Math.min(255,L*1.05);a[i+1]=Math.min(255,L*.82+gg*.1);a[i+2]=Math.min(255,L*.22)}g.putImageData(d,0,0)}catch(e){g.globalCompositeOperation='source-atop';g.fillStyle='rgba(255,200,40,.85)';g.fillRect(0,0,c.width,c.height)}
  return SKGO=c}
function skAura(f,k){if(!f.form)return;const t=G.frame,cx=f.x,base=f.y,ch=f.state==='charge',P=skGold(),A=GJAU;
  if(P){const i=Math.floor(t/3)%A.n,h=(ch?330:300)*(1+.04*Math.sin(t*.55)),w=h*A.w/A.h*.9;
    ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=ch?.66:.46;ctx.translate(cx,base-h*.47);ctx.scale((t>>4)%2?f.facing:-f.facing,1);ctx.drawImage(P,0,i*A.h,A.w,A.h,-w/2,-h/2,w,h);
    const j=(i+2)%A.n,h2=h*.78,w2=h2*A.w/A.h*.8;ctx.globalAlpha=ch?.48:.3;ctx.drawImage(P,0,j*A.h,A.w,A.h,-w2/2+Math.sin(t*.2)*8,-h2/2+h*.1,w2,h2);ctx.restore()}
  if(G.hitstop<=0&&t%(ch?1:2)===0)addP({x:cx+rand(-65,65),y:base-rand(10,260),vx:rand(-.5,.5),vy:-rand(1.6,3.4),life:rand(16,28),max:28,c:pick(SKC),type:'glow',sz:rand(2.5,5.5),g:0});
  if(G.hitstop<=0&&t%6===0){const an=t*.08;addP({x:cx+Math.cos(an)*90,y:base-140+Math.sin(an)*40,vx:0,vy:-1,life:18,max:18,c:'#fffbe0',type:'glow',sz:4,g:0})}}
/* ---------- transformação (ABRIR OS OLHOS) e ultimate ---------- */
function updSKT(T,f,t){G.tz=1.15;G.tzx=sxs(f.x);G.tzy=sys(f.y-150);if(t<SKVE)return;
  if(t===SKVE){f.form=1;f.formT=FORM_T;f.flick=0;G.flash=14;G.flashCol='#fff3c0';G.shake=26;skBuff(f);
    for(const r of [360,230,120])ring(f.x,f.y-150,r===120?'#ffffff':'#ffd84a',r,26,7);for(let i=0;i<46;i++)spark(f.x,f.y-150,pick(SKC),1,rand(5,16));
    const o=skOpp(f);if(o&&!o.ko){o.skPar=180;o.state='rushed';o.st=0;o.vx=0;o.move=null;txt(o.x,o.y-300,'PARALISADO!','#ffe27a')}
    SFX.transform();banner('ABRIU OS OLHOS!','#ffd84a',90,f.def.formSub);buzz(150)}
  if(t>SKVE&&t%3===0)addP({x:f.x+rand(-70,70),y:f.y-rand(30,260),vx:0,vy:-rand(1,2),life:20,max:20,c:'#ffd84a',type:'glow',sz:rand(3,6),g:0});
  if(t>=SKVE+30){G.trans=null;f.inv=15;neutral(f);G.tz=1}}
function skSuper(f,o){if(f.ki<100){if(!f.cpu)say(f,'PRECISA DE 100 KI');return false}if(!o||o.ko)return false;skLoad();
  f.ki-=100;f.state='whtS';f.st=0;f.inv=999;f.vx=0;f.vy=0;f.flying=false;f.y=FLOOR;f.grounded=true;f.rushKey=['pw',5];o.hypHard=0;o.iceHard=0;
  G.ws={sk:1,a:f,d:o,t:0,hi:0,vt:0};banner('TESOURO DO CÉU','#ffd84a',60,'ULTIMATE');G.flash=4;G.flashCol='#fff3c0';SFX.superUp();buzz(70);return true}
function updSKU(){const R=G.ws,a=R.a,d=R.d,FL=SKU.f.length;R.t++;const t=R.t;a.st=t;a.y=FLOOR;a.grounded=true;d.state='rushed';d.st=t;d.vx=0;d.vy=0;d.flying=false;
  if(t<VGU0){a.rushKey=['pw',Math.min(7,(t/4)|0)];G.tz=1.18;G.tzx=sxs(a.x+a.facing*60);G.tzy=sys(a.y-180);G.shake=Math.max(G.shake,1+t*.12);
    if(t%2===0)addP({x:a.x+rand(-80,80),y:a.y-rand(30,260),vx:0,vy:-rand(1,3),life:20,max:20,c:Math.random()<.6?'#ffd84a':'#ffffff',type:'glow',sz:rand(3,6),g:0});if(t%6===0)SFX.charge();if(t===VGU0-1){G.flash=8;G.flashCol='#fff3c0'}return}
  if(t===VGU0){SFX.blast();G.tz=1}
  const vt=(t-VGU0)/60*USP(FL);R.vt=vt;
  if(vt>=FL/12-.05){G.flash=10;G.flashCol='#fff8d8';G.shake=Math.max(G.shake,18);SFX.boom();buzz(80);
    G.ws=null;a.rushKey=null;a.inv=30;neutral(a);G.tz=1;d.vx=0;d.vy=0;d.y=FLOOR;d.grounded=true;d.flying=false;
    if(!d.ko){d.state='rushed';a.skInv={o:d,t:0,n:0};banner('TESOURO DO CÉU','#ffd84a',50,'OS SENTIDOS FORAM DESTRUÍDOS')}}}
