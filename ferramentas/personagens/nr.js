
/* ================= v165: NARUTO (sid nr normal, sid nrk = Modo Kurama; id naruto) — sistema profissional, CLONES DAS SOMBRAS nos combos,
   shuriken, jutsu de substituição, Combo dos Clones; Modo Kurama: muito rápido, dash = teletransporte, Rasengan, esquiva+soco a cada 3 golpes,
   aura = GIF do dono (azul-claro ao carregar no normal; amarelo-fogo no Kurama), botões com chama amarela e raios azuis, ultimate (vídeo do dono). ================= */
SPRH.nr=__NR__;SPRH.nrk=__NRK__;
const NRV={"f":__NRV__},NRU={"f":__NRU__},NRVF=[],NRUF=[];let NRP=null;
const NRVD=5,NRVE=Math.round(NRV.f.length*NRVD);
const NRAB={"src":"__AB__","n":5,"w":360,"h":405},NRAG={"src":"__AG__","n":5,"w":360,"h":405};for(const A of [NRAB,NRAG]){A.img=new Image();A.img.src=A.src}
function nrLoad(){if(NRP)return NRP;
  NRU.f.forEach((p,i)=>{const im=new Image();im.decoding='async';im.onload=()=>{NRUF[i]=im};im.src=p});
  return NRP=Promise.all(NRV.f.map((p,i)=>new Promise(r=>{const im=new Image();im.decoding='async';im.onload=()=>{NRVF[i]=im;r()};im.onerror=()=>r();im.src=p})))}
const NRK={nrs:1,nrr:1,nrc:1,nrsub:1,nrv:1};
function nrKey(f){const t=f.st,K=!!f.form;
  if(f.state==='nrc')return['cmb',Math.min(15,Math.floor(t/(K?3:4)))];
  if(f.state==='nrs')return['ki1',Math.min(7,Math.floor(t/3))];
  if(f.state==='nrr'){if(t<18)return['ki1',Math.min(4,Math.floor(t/4))];return['ki1',t<26?5:7]}
  if(f.state==='nrsub')return['subst',Math.min(K?3:5,Math.floor(t/4))];
  if(f.state==='nrv')return t<6?['dodge',3]:['jab',Math.min(7,2+Math.floor((t-6)/2))];
  return['idle',0]}
Object.assign(VGA,{njab:['jab',[1,2,3],[4,5],[6,7]],njab2:['cross',[1,2],[3,4,5],[6,7]],nknee:['str',[1,2],[3,4,5],[6,7]],nstr:['upper',[1,2,3],[4,5],[6,7]],
  nkick:['kick',[1,2],[3,4,5],[6,7]],nhkick:['hkick',[1,2,3],[4,5],[6,7]],nsweep:['sweep',[1,2],[3,4,5],[6,7]],
  najab:['ajab',[1],[2,3,4],[5,6,7]],nakick:['akick',[1],[2,3,4],[5,6,7]],nsmash:['palm',[0,1,2,3],[4,5],[6,7]],nrush:['dash2',[1,2],[3,4],[5,6]]});
for(const k of ['jab','jab2','knee','str','kick','hkick','sweep','ajab','akick','smash','rush'])VGA['o'+k]=VGA['n'+k];
(function(){for(const sid of ['nr','nrk']){const S=SPRH[sid];Object.assign(S,{jump:S.jumpv,combo:S.jab,sp:S.ki1,trans:S.pw,fly:S.jumpd,up:S.upper,dash:S.dashf,low:S.sweep,throw:S.palm,kunai:S.palm,fire:S.ki1})}
  const S=SPRH.nr,hb=(name,pad,hh,low)=>{const A=VGA[name],L=S[A[0]];let rx=0,ry=0;for(const i of A[2]){const F=L[i];if(F.rx>rx){rx=F.rx;ry=F.ry}}
    return low?[6,-(ry+hh*.6),rx+pad-6,hh]:[6,-(ry+hh/2),rx+pad-6,hh]};
  const N={
    njab:{su:4,ac:3,rc:8,dmg:42,hb:hb('njab',26,90),kb:2.2,hs:16,next:'njab2',knext:'nkick',lean:1.6,cat:'punch'},
    njab2:{su:3,ac:4,rc:8,dmg:46,hb:hb('njab2',26,90),kb:2.4,hs:17,next:'nknee',knext:'nkick',lean:1.8,cat:'punch'},
    nknee:{su:4,ac:4,rc:9,dmg:52,hb:hb('nknee',26,100),kb:2.8,hs:18,next:'nstr',knext:'nhkick',lean:1.6,cat:'punch',nrCl:1},
    nstr:{su:6,ac:5,rc:14,dmg:80,hb:hb('nstr',26,140),kb:4,launch:-10,launcher:1,heavy:1,lean:2,cat:'kick',nrCl:2},
    nkick:{su:5,ac:5,rc:11,dmg:58,hb:hb('nkick',24,90),kb:4,hs:19,lean:1.2,next:'njab',knext:'nhkick',cat:'kick',nrCl:1},
    nhkick:{su:7,ac:5,rc:14,dmg:80,hb:hb('nhkick',24,140),kb:4,launch:-10,launcher:1,heavy:1,lean:1.4,cat:'kick',nrCl:2},
    nsweep:{su:6,ac:5,rc:15,dmg:62,hb:hb('nsweep',22,56,1),kb:3,launch:-5,low:1,crouch:1,cat:'kick'},
    najab:{su:3,ac:4,rc:9,dmg:44,hb:hb('najab',24,72),kb:2.5,hs:18,air:1,next:'nakick',cat:'punch'},
    nakick:{su:4,ac:5,rc:9,dmg:62,hb:hb('nakick',24,100),kb:5,hs:18,air:1,cat:'kick'},
    nsmash:Object.assign({},MOVES.smash,{hb:hb('nsmash',30,80)}),nrush:Object.assign({},MOVES.rush,{hb:hb('nrush',30,120)})};
  Object.assign(MOVES,N);
  // Modo Kurama: mesmos golpes, bem mais rápidos e fortes
  for(const k in N){const m=Object.assign({},N[k]);m.su=Math.max(1,Math.round(m.su*.55));m.rc=Math.max(3,Math.round(m.rc*.6));m.dmg=Math.round(m.dmg*1.15);
    if(m.next)m.next='o'+m.next.slice(1);if(m.knext)m.knext='o'+m.knext.slice(1);MOVES['o'+k.slice(1)]=m}
  for(const sid of ['nr','nrk'])FR[sid]={charge:[['pw',6],['pw',7]],jab:[['jab',3],['jab',4],['jab',5]],cross:[['cross',3],['cross',4],['cross',5]],upper:[['upper',3],['upper',4],['upper',5]],
    hkick:[['hkick',3],['hkick',4],['hkick',5]],sweep:[['sweep',3],['sweep',4],['sweep',5]],blastP:['ki1',3],blastF:['ki1',4],super:[['ki1',3],['ki1',4],['ki1',5]],beamF:['ki1',4],win:[0,1,2],trans:[['pw',7]]};
  HAIR.nr=1.3;HAIR.nrk=1.3;HAND.nr={};HAND.nrk={};RUSHK.nr=[['cmb',4],['cmb',6],['cmb',7],['cmb',8],['cmb',10],['cmb',11],['cmb',12]];RUSHK.nrk=[['cmb',8],['cmb',9],['cmb',10],['cmb',12],['cmb',14],['cmb',11],['cmb',15]];
})();
function nrOpp(f){return G.p[0]===f?G.p[1]:G.p[0]}
/* ---------- clones das sombras ---------- */
const NRCL=[],NRPF=[],NRHQ=[];
const NRPUF=(()=>{const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');for(let i=0;i<16;i++){const x=34+Math.random()*60,y=34+Math.random()*60,r=20+Math.random()*26,gr=g.createRadialGradient(x,y,0,x,y,r);
  gr.addColorStop(0,'rgba(255,255,255,.95)');gr.addColorStop(.6,'rgba(232,232,240,.8)');gr.addColorStop(1,'rgba(220,220,230,0)');g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,TAU);g.fill()}return c})();
function nrPuff(x,y,s,gold){for(let i=0;i<5;i++)NRPF.push({x:x+rand(-30,30)*s,y:y+rand(-60,40)*s,vx:rand(-1.2,1.2),vy:-rand(.2,1.2),t:0,m:rand(16,24),s:rand(70,110)*s,g:gold});try{SFX.whoosh()}catch(e){}}
function nrClones(f,n){const have=NRCL.filter(c=>c.o===f&&!c.out);const OFF=[[-82,1],[62,-1],[-150,1]];
  for(let i=have.length;i<n;i++){const q=OFF[i]||OFF[0],c={o:f,dx:q[0],dl:2+i*2,t:0,out:0,ot:0,i};NRCL.push(c);nrPuff(f.x+f.facing*q[0],f.y-120,.9,f.form)}
  for(const c of NRCL)if(c.o===f)c.keep=G.frame+(f.form?40:55)}
function nrHist(f){const H=f.nrH||(f.nrH=[]);H.push({key:(f.state==='attack'||NRK[f.state])?spriteKey(f):null,x:f.x,y:f.y,fc:f.facing});if(H.length>8)H.shift()}
function nrDrawClones(f){if(!NRCL.length)return;const H=f.nrH||[];
  for(const c of NRCL){if(c.o!==f||f.hide>0)continue;const h=H[Math.max(0,H.length-1-c.dl)];const key=h&&h.key?h.key:spriteKey(f);
    const a=c.out?Math.max(0,1-c.ot/8):Math.min(1,c.t/4);if(a<=0)continue;const x=f.x+f.facing*c.dx,y=f.y;
    if(f.form&&NRAG.img.complete&&NRAG.img.naturalWidth){const t=G.frame,i=Math.floor(t/4+c.i)%NRAG.n,hh=260,w=hh*NRAG.w/NRAG.h;ctx.save();ctx.globalAlpha=.35*a;ctx.drawImage(NRAG.img,0,i*NRAG.h,NRAG.w,NRAG.h,x-w/2,y-hh*.92,w,hh);ctx.restore()}
    ctx.save();ctx.globalAlpha=.9*a;drawSprite(f,key,x,y,f.facing,{rot:0,dy:0,sy:1},'img');ctx.restore()}}
/* ---------- golpes especiais ---------- */
function nrAct(f,st,cost){if(f.ki<cost){if(!f.cpu)say(f,'PRECISA DE '+cost+' KI');return}f.ki-=cost;nrLoad();f.state=st;f.st=0;f.vx=0;f.move=null;f.guard=false;f.nrHit=0;
  if(st==='nrr'){txt(f.x,f.y-300,'RASENGAN!','#bfe8ff');fzTag(f,'Rasengan!')}if(st==='nrsub'){nrPuff(f.x,f.y-120,1.2,f.form);f.inv=30}SFX.whoosh()}
function nrCombo(f,o){nrLoad();f.state='nrc';f.st=0;f.vx=0;f.move=null;f.guard=false;f.nrHeld=false;f.nrK=-1;SFX.whoosh()}
const NRSH=[];
function nrStep(f){const o=nrOpp(f),t=++f.st,fw=f.facing,K=!!f.form;
  if(f.state==='nrs'){if(t===15){const F=SPRH[ssid(f)].ki1[5]||{rx:120,ry:170};for(let i=0;i<(K?3:1);i++)NRSH.push({o:f,x:f.x+fw*(F.rx||110),y:f.y-(F.ry||170)+i*22,vx:fw*(17+i),dir:fw,t:0,hit:0});SFX.slash&&SFX.slash()}if(t>=27)neutral(f);return}
  if(f.state==='nrsub'){if(t===10&&o){const tx=clamp(o.x-o.facing*110,40,WW-40);NRPF.push({x:f.x,y:f.y-110,vx:0,vy:0,t:0,m:26,s:120,g:K,log:1});f.x=tx;f.facing=o.x>f.x?1:-1;nrPuff(f.x,f.y-120,1,K)}
    if(t>=22){f.inv=Math.max(f.inv,6);neutral(f);if(o&&!o.ko&&Math.abs(o.x-f.x)<220){startMove(f,'vjab')}}return}
  if(f.state==='nrv'){if(t===1&&o){const ox=f.x;f.x=clamp(o.x-o.facing*100,40,WW-40);f.facing=o.x>f.x?1:-1;for(let i=0;i<10;i++)addP({x:lerp(ox,f.x,i/10),y:f.y-rand(80,200),vx:0,vy:0,life:12,max:12,c:'#ffd060',type:'glow',sz:rand(8,14),g:0})}
    if(t===10&&o&&!o.ko&&Math.abs(o.x-f.x)<200){applyHit(f,o,{dmg:70,kb:7,hs:16,heavy:1,px:o.x-fw*20,py:o.y-150,kind:'melee'});ring(o.x,o.y-150,'#ffd060',110,14,4)}if(t>=22){f.inv=Math.max(f.inv,4);neutral(f)}return}
  if(f.state==='nrr'){if(t<18){if(t%2===0)addP({x:f.x+fw*rand(60,110),y:f.y-rand(120,170),vx:0,vy:0,life:10,max:10,c:Math.random()<.5?'#9fdcff':'#ffffff',type:'glow',sz:rand(5,10),g:0});return}
    if(t<34){f.vx=fw*22;f.x=clamp(f.x+f.vx,40,WW-40);if(t%2===0)addP({x:f.x-fw*40,y:f.y-rand(60,200),vx:-fw*3,vy:0,life:12,max:12,c:'#ffd060',type:'glow',sz:rand(8,14),g:0});
      if(!f.nrHit&&o&&!o.ko&&Math.abs(o.x-f.x)<150&&Math.abs(o.y-f.y)<170&&o.inv<=0){f.nrHit=1;f.vx=0;const h={dmg:150,kb:12,hs:22,heavy:1,launch:-11,launcher:1,px:o.x-fw*20,py:o.y-150,kind:'blast'};
        if(applyHit(f,o,h)){ring(o.x-fw*20,o.y-150,'#bfe8ff',160,18,6);flashL(o.x,o.y-150,'#7fd0ff',420,.9,18);for(let i=0;i<20;i++)spark(o.x,o.y-150,i%2?'#ffffff':'#7fd0ff',1,rand(6,14));G.shake=Math.max(G.shake,16);try{SFX.boom()}catch(e){}}if(o.hp<=0)ko(f,o)}return}
    f.vx=0;if(t>=44)neutral(f);return}
  if(f.state==='nrc'){const D=K?3:4,k=Math.floor(t/D),END=16*D+6,HK=K?{2:30,3:30,4:32,5:32,8:34,9:34,11:30,12:36,13:30,14:38}:{4:22,5:24,6:24,7:26,9:26,10:28,11:28,12:30,13:30};
    if(k===4||k===8)f.x=clamp(f.x+fw*(K?12:8),40,WW-40);
    if(!K&&k===2&&f.nrK!==2)nrPuff(f.x,f.y-120,1.4,0);
    if(!f.nrHeld&&k>=1&&k<=4&&o&&!o.ko&&Math.abs(o.x-f.x)<240&&Math.abs(o.y-f.y)<160&&o.inv<=0){f.nrHeld=true;fzTag(f,K?'Combo da Kurama!':'Combo dos Clones!')}
    if(f.nrHeld&&o){const lift=K&&k>=6&&k<=8?Math.min(120,(t-6*D)*7):0;o.state='rushed';o.st=0;o.vx=0;o.vy=0;o.flying=false;o.grounded=lift<=0;o.move=null;o.x=clamp(f.x+fw*120,40,WW-40);o.y=FLOOR-lift;
      if(k!==f.nrK){f.nrK=k;
        if(HK[k]){applyHit(f,o,{dmg:HK[k],kb:0,hs:5,px:o.x-fw*20,py:o.y-150,kind:'melee',lock:1});G.hitstop=Math.max(G.hitstop,3);G.shake=Math.max(G.shake,4);if(K)addP({x:o.x-fw*20,y:o.y-150,vx:0,vy:0,life:12,max:12,c:'#ffd060',type:'glow',sz:24,g:0});if(o.hp<=0){ko(f,o);f.nrHeld=false}}
        if(k===15&&f.nrHeld){o.y=FLOOR;o.grounded=true;const h={dmg:K?150:110,kb:0,hs:22,heavy:1,px:o.x-fw*10,py:o.y-120,kind:'melee',lock:1};applyHit(f,o,h);f.nrHeld=false;
          o.state='airhit';o.vx=fw*12;o.vy=-8;o.grounded=false;o.bounced=false;if(!f.finDone&&f.combo>=3)comboFinish(f,o,h);G.shake=Math.max(G.shake,16);
          if(K){ring(o.x,o.y-140,'#ffd060',260,22,7);flashL(o.x,o.y-140,'#ffb020',520,.9,20)}else nrPuff(f.x,f.y-120,1.3,0);if(o.hp<=0)ko(f,o)}}}
    if(t>=END){f.nrHeld=false;if(!K)nrPuff(f.x,f.y-120,1,0);neutral(f)}return}}
function nrDodge(d,a){d.nrN=0;d.state='nrv';d.st=0;d.move=null;d.inv=24;d.guard=false;d.hitstun=0;const ox=d.x;
  for(let i=0;i<14;i++)spark(ox+rand(-40,40),d.y-rand(40,230),i%2?'#ffffff':'#ffd060',1,rand(4,10));txt(d.x,d.y-270,'ESQUIVA!','#ffe08a');try{SFX.zip()}catch(e){}}
function nrTeleDash(f,dir){const o=nrOpp(f);const ox=f.x;let tx=f.x+dir*380;
  if(o&&Math.sign(o.x-f.x)===dir&&Math.abs(o.x-f.x)<460)tx=o.x-dir*105;tx=clamp(tx,40,WW-40);
  for(let i=0;i<14;i++){const u=i/14;addP({x:lerp(ox,tx,u),y:f.y-rand(60,220),vx:dir*rand(1,3),vy:0,life:rand(10,16),max:16,c:Math.random()<.5?'#ffd060':'#fff2b0',type:'glow',sz:rand(8,16),g:0})}
  f.ghosts&&f.ghosts.push({key:spriteKey(f),x:ox,y:f.y,facing:f.facing,life:12});
  f.x=tx;f.state='vstop';f.st=0;f.vx=0;f.inv=Math.max(f.inv,8);f.facing=o?(o.x>f.x?1:-1):f.facing;ring(f.x,f.y-130,'#ffd060',80,10,3);SFX.zip()}
/* ---------- tick: projéteis, clones, fumaça, golpes extras dos clones ---------- */
function nrTick(){if(G.mode!=='fight'||G.hitstop>0)return;
  for(const f of G.p){if(!f||!isNr(f))continue;nrHist(f);
    if(f.state==='attack'&&f.move&&f.move.nrCl&&f.mf===1){nrClones(f,f.move.nrCl)}}
  for(const c of NRCL){c.t++;const f=c.o;if(!c.out&&(G.frame>c.keep||f.ko||f.state==='hit'||f.state==='airhit'||f.state==='down'||G.trans||G.ws)){c.out=1;nrPuff(f.x+f.facing*c.dx,f.y-120,.8,f.form)}if(c.out)c.ot++}
  for(let i=NRCL.length-1;i>=0;i--)if(NRCL[i].out&&NRCL[i].ot>8)NRCL.splice(i,1);
  for(const p of NRPF){p.t++;p.x+=p.vx;p.y+=p.vy}for(let i=NRPF.length-1;i>=0;i--)if(NRPF[i].t>=NRPF[i].m)NRPF.splice(i,1);
  for(const q of NRHQ){q.t--;if(q.t===0&&!q.d.ko){applyHit(q.a,q.d,{dmg:q.dmg,kb:q.kb,hs:6,px:q.d.x-q.a.facing*24,py:q.d.y-150+rand(-30,30),kind:'melee',nrc:1});if(q.d.hp<=0)ko(q.a,q.d)}}
  for(let i=NRHQ.length-1;i>=0;i--)if(NRHQ[i].t<=0)NRHQ.splice(i,1);
  for(const p of NRSH){p.t++;p.x+=p.vx;const o=nrOpp(p.o);
    if(!p.hit&&o&&!o.ko&&Math.abs(p.x-o.x)<50&&p.y>o.y-260&&p.y<o.y-10){p.hit=1;if(applyHit(p.o,o,{dmg:34,kb:3,hs:10,px:p.x,py:p.y,kind:'blast'}))spark(p.x,p.y,'#ffffff',1,8);if(o.hp<=0)ko(p.o,o);p.dead=1}
    if(p.x<CAM.x-200||p.x>CAM.x+VW/CAM.z+200||p.t>90)p.dead=1}
  for(let i=NRSH.length-1;i>=0;i--)if(NRSH[i].dead)NRSH.splice(i,1)}
function nrHitHook(a,d,h){if(!isNr(a)||h.nrc||h.lock||a.state!=='attack')return;const n=NRCL.filter(c=>c.o===a&&!c.out).length;
  for(let i=0;i<n;i++)NRHQ.push({a,d,t:4+i*4,dmg:Math.round(h.dmg*.38),kb:i===n-1?(h.kb||2):0})}
function drawNr(){
  if(NRSH.length){ctx.save();for(const p of NRSH){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.t*.6);ctx.fillStyle='#2a2a34';ctx.strokeStyle='#9aa0b0';ctx.lineWidth=1.5;ctx.beginPath();
      for(let i=0;i<8;i++){const r=i%2?5:17,a=i*Math.PI/4;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r)}ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#d8dce8';ctx.beginPath();ctx.arc(0,0,3,0,TAU);ctx.fill();ctx.restore();
      ctx.globalAlpha=.4;ctx.strokeStyle='#ffffff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p.x-p.dir*14,p.y);ctx.lineTo(p.x-p.dir*70,p.y);ctx.stroke();ctx.globalAlpha=1}ctx.restore()}
  if(NRPF.length){ctx.save();for(const p of NRPF){const u=p.t/p.m,s=p.s*(.6+u*.7);
      if(p.log){ctx.globalAlpha=Math.min(1,(p.m-p.t)/8);ctx.fillStyle='#8a5a32';ctx.fillRect(p.x-22,p.y-60,44,150);ctx.fillStyle='#c79a62';ctx.beginPath();ctx.ellipse(p.x,p.y-60,22,8,0,0,TAU);ctx.fill();continue}
      ctx.globalAlpha=(1-u)*.9;if(p.g){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=(1-u)*.5}else ctx.globalCompositeOperation='source-over';ctx.drawImage(NRPUF,p.x-s/2,p.y-s/2,s,s)}ctx.restore()}}
/* ---------- aura ---------- */
function nrAura(f,k){const t=G.frame,ch=f.state==='charge';if(!f.form&&!ch)return;const A=f.form?NRAG:NRAB;if(!A.img.complete||!A.img.naturalWidth)return;
  const i=Math.floor(t/(f.form?3:4))%A.n,h=(f.form?(ch?400:330):300)*(1+.05*Math.sin(t*.7)),w=h*A.w/A.h;
  ctx.save();ctx.translate(f.x,f.y-h*.46);ctx.scale((t>>4)%2?f.facing:-f.facing,1);
  ctx.globalAlpha=f.form?(ch?.55:.32):.42;ctx.drawImage(A.img,0,i*A.h,A.w,A.h,-w/2,-h/2,w,h);
  ctx.globalCompositeOperation='lighter';ctx.globalAlpha=f.form?(ch?.24:.12):.18;ctx.drawImage(A.img,0,i*A.h,A.w,A.h,-w/2,-h/2,w,h);ctx.restore();
  if(f.form&&G.hitstop<=0&&t%(ch?2:4)===0)addP({x:f.x+rand(-70,70),y:f.y-rand(10,260),vx:rand(-.4,.4),vy:-rand(1.4,3),life:rand(18,30),max:30,c:pick(['#ffb020','#ffd060','#fff2b0']),type:'glow',sz:rand(2.5,5),g:0})}
/* ---------- transformação e ultimate ---------- */
function updNRT(T,f,t){G.tz=1.15;G.tzx=sxs(f.x);G.tzy=sys(f.y-150);if(t<NRVE)return;
  if(t===NRVE){f.form=1;f.formT=FORM_T;f.flick=0;f.nrN=0;G.flash=14;G.flashCol='#fff2b0';G.shake=24;
    for(const r of [320,200,110])ring(f.x,f.y-150,r===110?'#ffffff':'#ffb020',r,26,7);
    for(let i=0;i<40;i++)spark(f.x,f.y-150,i%3?'#ffe08a':'#ffb020',1,rand(5,16));
    SFX.transform();banner('MODO KURAMA!','#ffe08a',90,f.def.formSub);buzz(150)}
  if(t>NRVE&&t%3===0)addP({x:f.x+rand(-70,70),y:f.y-rand(30,260),vx:0,vy:-rand(1,2),life:20,max:20,c:'#ffd060',type:'glow',sz:rand(3,6),g:0});
  if(t>=NRVE+34){G.trans=null;f.inv=15;neutral(f);G.tz=1}}
function nrSuper(f,o){if(!f.form){if(!f.cpu)say(f,'SÓ NO MODO KURAMA');return false}if(f.ki<100){if(!f.cpu)say(f,'PRECISA DE 100 KI');return false}if(!o||o.ko)return false;nrLoad();
  f.ki-=100;f.state='whtS';f.st=0;f.inv=999;f.vx=0;f.vy=0;f.flying=false;f.y=FLOOR;f.grounded=true;f.rushKey=['seals',1];o.hypHard=0;o.iceHard=0;
  G.ws={nr:1,a:f,d:o,t:0,hi:0,vt:0};banner('BIJUU DAMA','#ffe08a',60,'ULTIMATE');G.flash=4;G.flashCol='#fff2b0';SFX.superUp();buzz(70);return true}
function updNRU(){const R=G.ws,a=R.a,d=R.d,FL=NRU.f.length;R.t++;const t=R.t;a.st=t;a.y=FLOOR;a.grounded=true;d.state='rushed';d.st=t;d.vx=0;d.vy=0;d.flying=false;
  if(t<VGU0){a.rushKey=['seals',Math.min(7,(t/4)|0)];G.tz=1.18;G.tzx=sxs(a.x+a.facing*60);G.tzy=sys(a.y-180);G.shake=Math.max(G.shake,1+t*.12);
    if(t%2===0)addP({x:a.x+rand(-80,80),y:a.y-rand(30,260),vx:0,vy:-rand(1,3),life:20,max:20,c:Math.random()<.6?'#ffb020':'#ffffff',type:'glow',sz:rand(3,6),g:0});if(t%6===0)SFX.charge();if(t===VGU0-1){G.flash=8;G.flashCol='#fff2b0'}return}
  if(t===VGU0){SFX.blast();G.tz=1}
  const vt=(t-VGU0)/60*USP(FL);R.vt=vt;const fi=vt*12,HI=[.45,.55,.65,.75,.85].map(q=>Math.round(FL*q));
  if(R.hi<HI.length&&fi>=HI[R.hi]){R.hi++;G.shake=Math.max(G.shake,12);SFX.boom();buzz(40);if(!d.ko)applyHit(a,d,{dmg:34,kb:0,hs:6,px:d.x,py:d.y-120,kind:'blast',lock:1});d.state='rushed';d.vx=0;d.vy=0}
  if(vt>=FL/12-.05){G.flash=10;G.flashCol='#ffffff';G.shake=Math.max(G.shake,28);SFX.crater();SFX.boom();buzz(150);
    flashL(d.x,d.y-140,'#ff8a20',660,1,30);ring(d.x,FLOOR-6,'#ffe08a',300,26,8);for(let i=0;i<22;i++)debris(d.x+rand(-180,180),FLOOR);
    d.y=FLOOR;d.grounded=true;if(!d.ko)applyHit(a,d,{dmg:250,kb:0,hs:24,heavy:1,px:d.x,py:d.y-120,kind:'blast',lock:1});
    G.ws=null;a.rushKey=null;a.inv=12;neutral(a);G.tz=1;d.vx=0;d.vy=0;d.y=FLOOR;d.grounded=true;d.flying=false;if(!d.ko){d.state='down';d.st=6;d.downX=45;txt(d.x,d.y-200,'NOCAUTEADO!','#ffe08a')}}}
