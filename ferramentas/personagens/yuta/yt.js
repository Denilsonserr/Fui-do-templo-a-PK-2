/* ================= v239: YUTA OKKOTSU (sid yt normal, sid ytd = DESPERTAR com a Rika; id yuta) =================
   Normal: espadachim de MUITO dano e velocidade. Soco = cadeia de espadadas, chute = chutes acrobáticos (estrela, rasteira, giro),
   cada golpe que ACERTA pode ser cancelado no próximo (soco <-> chute). Ki = Corte Relâmpago (avanço com corte roxo). Combo (3 s) = combo de espada do dono.
   Despertar: 3x mais rápido, +60% dano, +50% crítico, aura roxa (chama do Gojo recolorida) com raios. Golpes podem chamar a RIKA (ela aparece, soca e some;
   o Yuta some enquanto ela aparece). Combo = alterna os 2 combos da Rika. Passiva (sempre): a cada 4 golpes recebidos = CONTRA-ATAQUE CRÍTICO.
   Ultimate (100 Ki, nas duas formas) = vídeo do dono (sem som), cortado e acelerado. ================= */
SPRH.yt=__YT__;SPRH.ytd=__YTD__;
const YTV={"f":__YTV__},YTU={"f":__YTU__},YTVF=[],YTUF=[];let YTP=null;
const YTVD=5,YTVE=Math.round(YTV.f.length*YTVD);
function ytLoad(){if(YTP)return YTP;YTU.f.forEach((p,i)=>{const im=new Image();im.decoding='async';im.onload=()=>{YTUF[i]=im};im.src=p});
  return YTP=Promise.all(YTV.f.map((p,i)=>new Promise(r=>{const im=new Image();im.decoding='async';im.onload=()=>{YTVF[i]=im;r()};im.onerror=()=>r();im.src=p})))}
const YTK={ytk:1,ytc:1,ytcn:1,ytr:1};
const YTC=['#7a2cff','#b57bff','#f6eeff','#d24bff'];
function ytKey(f){const t=f.st,M=!!f.form;
  if(f.state==='ytc'){const L=SPRH[ssid(f)][f.ytCK||'cmb'].length;return[f.ytCK||'cmb',Math.min(L-1,Math.floor(t/(M?3:4)))]}
  if(f.state==='ytk')return['ki1',Math.min(7,Math.floor(t/(M?1.5:2.2)))];
  if(f.state==='ytcn')return['roxo',Math.min(5,Math.floor(t/(M?2:3)))];
  if(f.state==='ytr')return['rkp',Math.min(5,Math.floor(t/(M?2.5:3)))];
  return['idle',0]}
Object.assign(VGA,{ujab:['jab',[1,2],[3,4],[5,6,7]],ujab2:['cross',[1,2],[3,4],[5,6,7]],ujab3:['jab2',[0,1],[2,3,4],[5,6,7]],ustr:['str',[1,2],[3,4,5],[6,7]],uknee:['upper',[1,2],[3,4,5],[6,7]],
  ukick:['kick',[1],[2,3,4],[5,6,7]],ukick2:['kick2',[1],[2,3,4],[5,6,7]],ukick3:['kick3',[0,1],[2,3,4],[5,6,7]],uhkick:['hkick',[1,2],[3,4,5],[6,7]],usweep:['sweep',[0,1],[2,3,4],[5,6,7]],
  uajab:['ajab',[1],[2,3,4],[5,6,7]],uakick:['akick',[1],[2,3,4],[5,6,7]],usmash:['palm',[0,1,2],[3,4,5],[6,7]],urush:['dash2',[1,2],[3,4],[5,6]]});
for(const k of ['jab','jab2','jab3','str','knee','kick','kick2','kick3','hkick','sweep','ajab','akick','smash','rush'])VGA['w'+k]=VGA['u'+k];
(function(){for(const sid of ['yt','ytd']){const S=SPRH[sid];Object.assign(S,{jump:S.jumpv,combo:S.jab,sp:S.ki1,trans:S.pw,fly:S.jumpd,up:S.upper,dash:S.dashf,low:S.sweep,throw:S.palm,kunai:S.palm,fire:S.ki1})}
  const B=(reach,top,bot)=>[-10,-(top||280),reach+55,(top||280)+(bot||0)];
  const N={
    ujab:{nrPush:8,su:2,ac:4,rc:5,dmg:52,hb:B(215),kb:1.3,hs:19,next:'ujab2',knext:'ukick',lean:1.6,cat:'punch',ytQ:1},
    ujab2:{nrPush:8,su:2,ac:4,rc:5,dmg:56,hb:B(225),kb:1.4,hs:20,next:'ujab3',knext:'ukick2',lean:1.8,cat:'punch',ytQ:1},
    ujab3:{nrPush:9,su:2,ac:4,rc:6,dmg:60,hb:B(235,300,30),kb:1.5,hs:20,next:'uknee',knext:'ukick3',lean:1.8,cat:'punch',ytQ:1},
    uknee:{nrPush:6,su:3,ac:4,rc:8,dmg:70,hb:B(225,330),kb:4,launch:-10,launcher:1,heavy:1,next:'ustr',knext:'uhkick',lean:1.6,cat:'punch',ytQ:1},
    ustr:{nrPush:11,su:3,ac:5,rc:11,dmg:112,hb:B(245,300),kb:9,hs:24,heavy:1,lean:2.2,cat:'punch',ytQ:1,ytF:1},
    ukick:{nrPush:7,su:2,ac:4,rc:6,dmg:58,hb:B(200,260,20),kb:2,hs:20,lean:1.2,next:'ujab2',knext:'ukick2',cat:'kick',ytQ:1},
    ukick2:{nrPush:8,su:2,ac:4,rc:6,dmg:62,hb:B(215,240,30),kb:2.2,hs:20,lean:1.3,next:'ujab3',knext:'ukick3',cat:'kick',ytQ:1},
    ukick3:{nrPush:9,su:3,ac:5,rc:8,dmg:72,hb:[-30,-120,300,140],kb:3,launch:-5,low:1,lean:1.4,next:'uknee',knext:'uhkick',cat:'kick',ytQ:1},
    uhkick:{nrPush:6,su:3,ac:5,rc:10,dmg:92,hb:B(210,330),kb:4,launch:-11,launcher:1,heavy:1,lean:1.4,cat:'kick',ytQ:1,ytF:1},
    usweep:{su:3,ac:5,rc:10,dmg:68,hb:[-10,-90,300,90],kb:3,launch:-5,low:1,crouch:1,cat:'kick'},
    uajab:{su:2,ac:4,rc:8,dmg:52,hb:B(215,240,160),kb:2.5,hs:18,air:1,next:'uakick',cat:'punch'},
    uakick:{su:3,ac:5,rc:8,dmg:62,hb:B(200,240,160),kb:5,hs:18,air:1,cat:'kick'},
    usmash:Object.assign({},MOVES.smash,{hb:B(250),dmg:(MOVES.smash.dmg||120)*1.15}),urush:Object.assign({},MOVES.rush,{hb:B(230)})};
  Object.assign(MOVES,N);
  /* DESPERTAR: mesmos golpes muito mais rápidos e mais longe (dano extra vem do bônus da forma) */
  for(const k in N){const m=Object.assign({},N[k]);m.su=Math.max(1,Math.round(m.su*.5));m.rc=Math.max(3,Math.round(m.rc*.5));m.hb=m.hb.slice();m.hb[2]+=40;
    if(m.next)m.next='w'+m.next.slice(1);if(m.knext)m.knext='w'+m.knext.slice(1);MOVES['w'+k.slice(1)]=m}
  for(const sid of ['yt','ytd'])FR[sid]={charge:[['pw',6],['pw',7]],jab:[['jab',3],['jab',4],['jab',5]],cross:[['cross',3],['cross',4],['cross',5]],upper:[['upper',3],['upper',4],['upper',5]],
    hkick:[['hkick',3],['hkick',4],['hkick',5]],sweep:[['sweep',3],['sweep',4],['sweep',5]],blastP:['ki1',3],blastF:['ki1',4],super:[['ki1',3],['ki1',4],['ki1',5]],beamF:['ki1',4],win:[0,1,2],trans:[['pw',7]]};
  HAIR.yt=1.2;HAIR.ytd=1.2;HAND.yt={};HAND.ytd={};RUSHK.yt=[['cmb',3],['cmb',5],['cmb',7],['cmb',9],['cmb',11],['cmb',12],['cmb',13]];RUSHK.ytd=RUSHK.yt;
})();
function ytOpp(f){return G.p[0]===f?G.p[1]:G.p[0]}
/* ---------- buff do DESPERTAR (liga/desliga junto com a forma) ---------- */
function ytBuff(f){if(f.form&&!f.ytB){f.ytB=1;f.tdm=(f.tdm||1)*(1.6/1.45);f.tcr=(f.tcr||0)+50}else if(!f.form&&f.ytB){f.ytB=0;f.tdm=(f.tdm||1)/(1.6/1.45);f.tcr=(f.tcr||0)-50}}
/* ---------- efeitos ---------- */
function ytBurst(x,y,big){ring(x,y,'#b57bff',big?220:120,big?20:12,big?6:4);ring(x,y,'#ffffff',big?110:60,10,3);for(let i=0;i<(big?26:12);i++){const an=Math.random()*TAU,v=rand(3,big?13:8);addP({x,y,vx:Math.cos(an)*v,vy:Math.sin(an)*v-1,life:rand(14,26),max:26,c:pick(YTC),type:'glow',sz:rand(3,big?10:7),g:.1})}
  if(big){flashL(x,y,'#9a4dff',420,.85,18);G.shake=Math.max(G.shake,10)}}
function ytImpact(a,d,h,fin){const x=h.px||d.x,y=h.py||d.y-150,M=!!a.form;ring(x,y,M?'#c070ff':'#b57bff',fin?160:M?86:66,fin?18:10,fin?6:3);
  for(let i=0;i<(fin?18:M?10:7);i++){const an=-Math.PI*.9+Math.random()*Math.PI*1.8,v=rand(3,fin?12:8);addP({x,y,vx:Math.cos(an)*v*a.facing,vy:Math.sin(an)*v-1,life:rand(12,22),max:22,c:pick(YTC),type:'glow',sz:rand(3,fin?9:6),g:.25})}
  for(let i=0;i<(M?8:5);i++)spark(x,y,i%2?'#f6eeff':'#9a4dff',1,rand(4,10));
  if(fin){flashL(x,y,'#8a3cff',420,.85,16);G.shake=Math.max(G.shake,10);G.hitstop=Math.max(G.hitstop,7);ring(x,y,'#ffffff',90,12,4);G.ck.vx+=a.facing*2.5}}
/* ---------- Ki = Corte Relâmpago ---------- */
function ytQuick(f){if(f.ki<4){if(!f.cpu)say(f,'PRECISA DE 4 KI');return false}f.ki-=4;f.state='ytk';f.st=0;f.vx=0;f.move=null;f.guard=false;f.ytH=0;SFX.whoosh();return true}
/* ---------- combo pronto (botão de combo): normal = combo de espada; despertar = alterna os 2 combos da Rika ---------- */
function ytCombo(f,o){ytLoad();f.state='ytc';f.st=0;f.vx=0;f.move=null;f.guard=false;f.ytHeld=false;f.ytKk=-1;
  if(f.form){f.ytAlt=!f.ytAlt;f.ytCK=f.ytAlt?'cmb':'cmb1'}else f.ytCK='cmb';SFX.whoosh()}
/* ---------- RIKA aparece e soca (o Yuta some) ---------- */
function ytRika(f,o){if(!o||o.ko)return;f.state='ytr';f.st=0;f.move=null;f.vx=0;f.guard=false;f.ytRkCD=G.frame+(f.form?150:400);f.ytCa=o;f.inv=Math.max(f.inv,14);
  ytBurst(f.x+f.facing*40,f.y-170,0);fzTag(f,'RIKA!');txt(f.x,f.y-320,'RIKA!','#e2b6ff');try{SFX.zip()}catch(e){}}
/* ---------- PASSIVA: a cada 4 golpes recebidos = contra-ataque CRÍTICO ---------- */
function ytCounter(d,a){if(d.ko||a.ko)return;d.state='ytcn';d.st=0;d.move=null;d.vx=0;d.guard=false;d.hitstun=0;d.inv=Math.max(d.inv,22);d.ytCa=a;
  if(Math.abs(a.x-d.x)>220){d.x=clamp(a.x+(d.x<a.x?-150:150),40,WW-40)}d.facing=a.x>d.x?1:-1;
  txt(d.x,d.y-300,'CONTRA-ATAQUE!','#d8a8ff');G.hitstop=Math.max(G.hitstop,8);G.fzDark=Math.max(G.fzDark||0,6);ring(d.x+d.facing*40,d.y-150,'#b57bff',130,14,4);try{SFX.zip()}catch(e){}buzz(40)}
function ytStep(f){const o=ytOpp(f),t=++f.st,fw=f.facing,M=!!f.form;
  if(f.state==='ytk'){const D=M?1.5:2.2,k=Math.floor(t/D),END=Math.round(8*D+4);
    if(k<=2)f.x=clamp(f.x+fw*(M?30:22),40,WW-40);
    if(k>=1&&k<=3&&G.frame%2===0)f.ghosts.push({key:spriteKey(f),x:f.x,y:f.y,facing:f.facing,life:10,col:'#b57bff'});
    if((k===4||k===6)&&f.ytH!==k&&o&&!o.ko&&Math.abs(o.x-f.x)<300&&Math.abs(o.y-f.y)<210&&o.inv<=0){f.ytH=k;const h={dmg:M?40:46,kb:k===6?4:1.5,hs:12,px:o.x-fw*40,py:o.y-160,kind:'melee'};
      if(applyHit(f,o,h))ytImpact(f,o,h,k===6);if(o.hp<=0)ko(f,o)}
    if(t>=END)neutral(f);return}
  if(f.state==='ytcn'){const a=f.ytCa||o,HT=M?5:7;if(t===HT&&a&&!a.ko&&Math.abs(a.x-f.x)<300){const h={dmg:M?95:88,kb:7,hs:22,heavy:1,ycrit:1,px:a.x-fw*30,py:a.y-160,kind:'melee'};f.inv=Math.max(f.inv,8);
      if(applyHit(f,a,h)){ytImpact(f,a,h,1);ytBurst(a.x,a.y-160,1)}if(a.hp<=0)ko(f,a)}
    if(t>=(M?14:20)){f.inv=Math.max(f.inv,4);neutral(f)}return}
  if(f.state==='ytr'){const a=f.ytCa||o,D=M?2.5:3,k=Math.floor(t/D),END=Math.round(6*D+3);
    if(a&&!a.ko&&k<=1){const dx=a.x-f.x;if(Math.abs(dx)>150)f.x=clamp(f.x+Math.sign(dx)*Math.min(Math.abs(dx)-150,26),40,WW-40)}
    if((k===2||k===3)&&f.ytH!==k&&a&&!a.ko&&Math.abs(a.x-f.x)<330&&Math.abs(a.y-f.y)<230){f.ytH=k;const h={dmg:M?62:50,kb:k===3?8:1,launch:k===3?-8:0,hs:14,heavy:k===3?1:0,px:a.x-fw*30,py:a.y-170,kind:'melee'};
      if(applyHit(f,a,h)){ytImpact(f,a,h,k===3);if(k===3)ytBurst(a.x,a.y-160,1)}if(a.hp<=0)ko(f,a)}
    if(t>=END){ytBurst(f.x,f.y-160,0);f.ytH=-1;neutral(f)}return}
  if(f.state==='ytc'){const D=M?3:4,L=SPRH[ssid(f)][f.ytCK||'cmb'].length,k=Math.floor(t/D),END=L*D+6,FIN=L-2;
    const HK=f.ytCK==='cmb1'?{4:30,5:32,7:34,8:34,9:36,10:36,11:38}:M?{1:28,2:30,3:30,4:32,5:34,6:34,8:36,9:38,10:40}:{2:26,3:26,4:28,5:28,6:30,7:30,8:32,9:32,10:34,11:36,12:36};
    if(!f.ytHeld&&k<=5&&o&&!o.ko){const dx=o.x-f.x;if(Math.sign(dx)===fw&&Math.abs(dx)>120)f.x=clamp(f.x+fw*Math.min(Math.abs(dx)-120,M?32:24),40,WW-40)}
    if(!f.ytHeld&&k>=1&&k<=7&&o&&!o.ko&&Math.abs(o.x-f.x)<330&&Math.abs(o.y-f.y)<240&&(o.inv<=0||o.state==='blockstun')){f.ytHeld=true;fzTag(f,f.ytCK==='cmb1'?'Rika: Fúria Amaldiçoada!':M?'Yuta & Rika!':'Dança da Espada!')}
    if(f.ytCK!=='cmb'||M){if(k===7&&f.ytCK==='cmb'&&f.ytKk!==7)ytBurst(f.x+fw*60,f.y-170,0);if(f.ytCK==='cmb1'&&k===3&&f.ytKk!==3)ytBurst(f.x,f.y-120,1)}
    if(f.ytHeld&&o){const lift=k>=FIN-3&&k<FIN?Math.min(80,(t-(FIN-3)*D)*5):0;o.state='rushed';o.st=0;o.vx=0;o.vy=0;o.flying=false;o.grounded=lift<=0;o.move=null;o.x=clamp(f.x+fw*(f.ytCK==='cmb1'?170:135),40,WW-40);o.y=FLOOR-lift;
      if(k!==f.ytKk){f.ytKk=k;
        if(HK[k]){const h={dmg:HK[k],kb:0,hs:5,px:o.x-fw*30,py:o.y-rand(130,200),kind:'melee',lock:1};applyHit(f,o,h);ytImpact(f,o,h);G.hitstop=Math.max(G.hitstop,3);G.shake=Math.max(G.shake,4);if(o.hp<=0){ko(f,o);f.ytHeld=false}}
        if(k===FIN&&f.ytHeld){o.y=FLOOR;o.grounded=true;const h={dmg:M?150:120,kb:0,hs:22,heavy:1,px:o.x-fw*10,py:o.y-150,kind:'melee',lock:1};applyHit(f,o,h);f.ytHeld=false;
          o.state='airhit';o.vx=fw*13;o.vy=-7;o.grounded=false;o.bounced=false;if(!f.finDone&&f.combo>=3)comboFinish(f,o,h);ytBurst(o.x,o.y-150,1);if(o.hp<=0)ko(f,o)}}}
    else if(k!==f.ytKk)f.ytKk=k;
    if(t>=END){f.ytHeld=false;neutral(f)}return}}
/* ---------- tick: buff da forma, rastro roxo, Rika no meio das espadadas ---------- */
function ytTick(){if(G.mode!=='fight')return;
  for(const f of G.p){if(!f||!isYt(f))continue;ytBuff(f);
    if(f.ytCtr){const a=f.ytCtr;f.ytCtr=null;if(!f.ko&&f.state!=='rushed'&&f.state!=='whtS'&&!G.ws&&!G.trans&&a&&!a.ko&&a.state!=='whtS')ytCounter(f,a)}
    if(G.hitstop>0||f.hide>0)continue;
    const o=ytOpp(f);
    if(f.ytRkGo&&f.state==='attack'&&f.move&&f.mf>=f.move.su+f.move.ac-1){const d=f.ytRkGo;f.ytRkGo=null;ytRika(f,d)}else if(f.ytRkGo&&f.state!=='attack')f.ytRkGo=null;
    const mv=Math.abs(f.vx)>1.5&&(f.state==='walk'||f.state==='run'||f.state==='vrun'||f.state==='vdash'||f.state==='vbdash'||f.state==='dash'||f.state==='attack');
    if(f.form&&mv){if(G.frame%3===0)f.ghosts.push({key:spriteKey(f),x:f.x,y:f.y,facing:f.facing,life:12,col:'#9a4dff'});
      if(G.frame%2===0)addP({x:f.x-f.facing*rand(20,70),y:f.y-rand(20,240),vx:-f.facing*rand(1,3),vy:-rand(0,.6),life:rand(12,20),max:20,c:pick(YTC),type:'glow',sz:rand(3,7),g:0})}
    else if(!f.form&&mv&&(f.state==='run'||f.state==='vrun'||f.state==='vdash')&&G.frame%4===0)f.ghosts.push({key:spriteKey(f),x:f.x,y:f.y,facing:f.facing,life:8,col:'#c9a8ff'})}}
/* chamado pelo applyHit quando um golpe do Yuta acerta */
function ytHitHook(a,d,h){if(!isYt(a)||h.lock)return;if(a.state==='attack'&&a.move&&a.move.ytQ)ytImpact(a,d,h,a.move.ytF);
  if(a.form&&a.state==='attack'&&a.move&&a.move.ytQ&&!a.ytRkGo&&G.frame>(a.ytRkCD||0)&&d.hp>0&&Math.random()<(a.move.cat==='punch'?.24:.16))a.ytRkGo=d}
/* ---------- aura ---------- */
let YTPU=null;
function ytPurple(){if(YTPU)return YTPU;const I=GJAU.img;if(!I||!I.complete||!I.naturalWidth)return null;const c=document.createElement('canvas');c.width=I.naturalWidth;c.height=I.naturalHeight;const g=c.getContext('2d');g.drawImage(I,0,0);
  try{const d=g.getImageData(0,0,c.width,c.height),a=d.data;for(let i=0;i<a.length;i+=4){const r=a[i],gg=a[i+1],b=a[i+2],L=Math.max(r,gg,b);a[i]=Math.min(255,L*.78+r*.15);a[i+1]=Math.min(255,L*.32+gg*.25);a[i+2]=Math.min(255,L*1.05)}g.putImageData(d,0,0)}catch(e){g.globalCompositeOperation='source-atop';g.fillStyle='rgba(150,70,255,.85)';g.fillRect(0,0,c.width,c.height)}
  return YTPU=c}
function ytAura(f,k){const t=G.frame,cx=f.x,base=f.y,ch=f.state==='charge',P=ytPurple(),A=GJAU;
  if(f.form){if(P){const i=Math.floor(t/3)%A.n,h=(ch?330:300)*(1+.04*Math.sin(t*.55)),w=h*A.w/A.h*.9;
      ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=ch?.68:.48;ctx.translate(cx,base-h*.47);ctx.scale((t>>4)%2?f.facing:-f.facing,1);ctx.drawImage(P,0,i*A.h,A.w,A.h,-w/2,-h/2,w,h);
      // segunda camada, menor e defasada: chama "dupla" que se move
      const j=(i+2)%A.n,h2=h*.78,w2=h2*A.w/A.h*.8;ctx.globalAlpha=ch?.5:.32;ctx.drawImage(P,0,j*A.h,A.w,A.h,-w2/2+Math.sin(t*.2)*8,-h2/2+h*.1,w2,h2);ctx.restore()}
    zArcs(f,cx,base,ZPAL.purp,ch?8:5,ch?.9:.6);
    if(G.hitstop<=0&&t%(ch?1:2)===0)addP({x:cx+rand(-65,65),y:base-rand(10,260),vx:rand(-.5,.5),vy:-rand(1.6,3.4),life:rand(16,28),max:28,c:pick(YTC),type:'glow',sz:rand(2.5,5.5),g:0});
    // runas/fagulhas girando em volta
    if(G.hitstop<=0&&t%6===0){const an=t*.08;addP({x:cx+Math.cos(an)*90,y:base-140+Math.sin(an)*40,vx:0,vy:-1,life:18,max:18,c:'#f6eeff',type:'glow',sz:4,g:0})}
    return}
  if(P&&(ch||t%1===0)){const i=Math.floor(t/3)%A.n,h=(ch?300:270)*(1+.03*Math.sin(t*.5)),w=h*A.w/A.h*.8;
    ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=ch?.6:.14;ctx.translate(cx,base-h*.47);ctx.scale((t>>4)%2?f.facing:-f.facing,1);ctx.drawImage(P,0,i*A.h,A.w,A.h,-w/2,-h/2,w,h);ctx.restore()}
  if(G.hitstop<=0&&t%(ch?2:9)===0)addP({x:cx+rand(-50,50),y:base-rand(20,230),vx:rand(-.3,.3),vy:-rand(1,2.2),life:22,max:22,c:ch?'#b57bff':'#e8d8ff',type:'glow',sz:rand(2,3.5),g:0});
  if(ch)zArcs(f,cx,base,ZPAL.purp,4,.6)}
/* ---------- transformação e ultimate ---------- */
function updYTT(T,f,t){G.tz=1.15;G.tzx=sxs(f.x);G.tzy=sys(f.y-150);if(t<YTVE)return;
  if(t===YTVE){f.form=1;f.formT=FORM_T;f.flick=0;G.flash=14;G.flashCol='#e8d0ff';G.shake=26;ytBuff(f);
    for(const r of [340,220,120])ring(f.x,f.y-150,r===120?'#ffffff':'#9a4dff',r,26,7);for(let i=0;i<44;i++)spark(f.x,f.y-150,pick(YTC),1,rand(5,16));
    SFX.transform();banner('DESPERTAR: RIKA!','#c58bff',90,f.def.formSub);buzz(150)}
  if(t>YTVE&&t%3===0)addP({x:f.x+rand(-70,70),y:f.y-rand(30,260),vx:0,vy:-rand(1,2),life:20,max:20,c:'#9a4dff',type:'glow',sz:rand(3,6),g:0});
  if(t>=YTVE+30){G.trans=null;f.inv=15;neutral(f);G.tz=1}}
function ytSuper(f,o){if(f.ki<100){if(!f.cpu)say(f,'PRECISA DE 100 KI');return false}if(!o||o.ko)return false;ytLoad();
  f.ki-=100;f.state='whtS';f.st=0;f.inv=999;f.vx=0;f.vy=0;f.flying=false;f.y=FLOOR;f.grounded=true;f.rushKey=['pw',5];o.hypHard=0;o.iceHard=0;
  G.ws={yt:1,a:f,d:o,t:0,hi:0,vt:0};banner('AMOR PURO: RIKA','#c58bff',60,'ULTIMATE');G.flash=4;G.flashCol='#e8d0ff';SFX.superUp();buzz(70);return true}
function updYTU(){const R=G.ws,a=R.a,d=R.d,FL=YTU.f.length;R.t++;const t=R.t;a.st=t;a.y=FLOOR;a.grounded=true;d.state='rushed';d.st=t;d.vx=0;d.vy=0;d.flying=false;
  if(t<VGU0){a.rushKey=['pw',Math.min(7,(t/4)|0)];G.tz=1.18;G.tzx=sxs(a.x+a.facing*60);G.tzy=sys(a.y-180);G.shake=Math.max(G.shake,1+t*.12);
    if(t%2===0)addP({x:a.x+rand(-80,80),y:a.y-rand(30,260),vx:0,vy:-rand(1,3),life:20,max:20,c:Math.random()<.6?'#9a4dff':'#ffffff',type:'glow',sz:rand(3,6),g:0});if(t%6===0)SFX.charge();if(t===VGU0-1){G.flash=8;G.flashCol='#e8d0ff'}return}
  if(t===VGU0){SFX.blast();G.tz=1}
  const vt=(t-VGU0)/60*USP(FL);R.vt=vt;const fi=vt*12,HI=[.12,.3,.42,.55,.66,.76,.86].map(q=>Math.round(FL*q));
  if(R.hi<HI.length&&fi>=HI[R.hi]){R.hi++;G.shake=Math.max(G.shake,14);SFX.boom();buzz(40);if(!d.ko)applyHit(a,d,{dmg:34,kb:0,hs:6,px:d.x,py:d.y-120,kind:'blast',lock:1});d.state='rushed';d.vx=0;d.vy=0}
  if(vt>=FL/12-.05){G.flash=10;G.flashCol='#f2e4ff';G.shake=Math.max(G.shake,30);SFX.crater();SFX.boom();buzz(160);
    flashL(d.x,d.y-140,'#9a4dff',700,1,32);ring(d.x,FLOOR-6,'#c58bff',320,26,8);ring(d.x,d.y-150,'#ffffff',180,20,6);ytBurst(d.x,d.y-160,1);for(let i=0;i<22;i++)debris(d.x+rand(-180,180),FLOOR);
    d.y=FLOOR;d.grounded=true;if(!d.ko)applyHit(a,d,{dmg:270,kb:0,hs:24,heavy:1,px:d.x,py:d.y-120,kind:'blast',lock:1});
    G.ws=null;a.rushKey=null;a.inv=12;neutral(a);G.tz=1;d.vx=0;d.vy=0;d.y=FLOOR;d.grounded=true;d.flying=false;if(!d.ko){d.state='down';d.st=6;d.downX=45;txt(d.x,d.y-200,'NOCAUTEADO!','#d8a8ff')}}}
