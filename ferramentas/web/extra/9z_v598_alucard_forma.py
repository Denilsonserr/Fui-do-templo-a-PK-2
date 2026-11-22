import json,sys,os
# v598: ALUCARD — ETAPA 2 (ainda só no 🧪 TESTE do ADM): TRANSFORMAÇÃO (vídeo do dono, mais nítido), FORMA TRANSFORMADA (15 folhas -> SPRH.ald),
# ULTIMATE (vídeo do dono) + cena final: o inimigo fica CAÍDO no chão sangrando e continua tomando dano (Alucard atira no corpo, rindo).
# Regras do dono: transformado = aura vermelho-sangue MAIOR, muito rápido, MAIOR bônus de transformação do jogo, ultimate com MUITO dano;
# passiva: 10% de chance de desviar sozinho de cada golpe (nas duas formas); soco = tiro (se estiver MUITO perto = soco); chute = chute; Ki = 3 tiros.
# Roda depois de 9z_v594_alucard.py (ordem alfabética).
P=sys.argv[1];s=open(P,encoding='utf8').read()
D=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','personagens','alucard','build')
J=json.load(open(os.path.join(D,'ald_ai.json')));V=json.load(open(os.path.join(D,'videos.json')))
def rep(a,b,n=1):
    global s;c=s.count(a);assert c==n,(a[:90],c);s=s.replace(a,b)
cj=lambda o:json.dumps(o,separators=(',',':'))
# sprites da forma
rep("SPRH.al=","SPRH.ald=%s;SPRH.al="%cj(J['ald']))
rep("(function(){for(const sid of ['al','sj','yt','ytd']){","(function(){for(const sid of ['al','ald','sj','yt','ytd']){")
rep("const ssid=f=>f.def.sid==='al'?'al':","const ssid=f=>f.def.sid==='al'?(f.form?'ald':'al'):")
rep("s==='al'?['al']:","s==='al'?['al','ald']:")
rep("sid==='yt'||sid==='ytd'||sid==='sj'||sid==='al'||sid==='sk'||","sid==='yt'||sid==='ytd'||sid==='sj'||sid==='al'||sid==='ald'||sid==='sk'||")
rep("HAIR.al=1.2;HAND.al={};RUSHK.al=[['cmb',4],['cmb',6],['cmb',9],['cmb',11],['cmb',12],['cmb',13]];",
    "HAIR.al=1.2;HAND.al={};RUSHK.al=[['cmb',4],['cmb',6],['cmb',9],['cmb',11],['cmb',12],['cmb',13]];HAIR.ald=1.2;HAND.ald={};RUSHK.ald=RUSHK.al;")
rep("rushName:'SUPER COMBO',formName:'EM BREVE',formSub:'EM BREVE'},\n  sung:","rushName:'SUPER COMBO',formName:'RESTRIÇÃO LIBERADA',formSub:'NÍVEL ZERO'},\n  sung:")
rep("Ki = 3 tiros de uma vez. Combo = SUPER COMBO.'}","Ki = 3 tiros de uma vez. Combo = SUPER COMBO. Perto demais = soco. 10% de chance de desviar sozinho. TRANSFORMAÇÃO: aura vermelho-sangue, muito rápido e o maior bônus do jogo. ULTIMATE (transformado): o inimigo cai sangrando e continua tomando dano.'}")
# transformação e ultimate
rep("function ytSuper(f,o){if(isAuc(f)){if(!f.cpu)say(f,'EM BREVE');return false}","function ytSuper(f,o){if(isAuc(f))return aucUlt(f,o);")
rep("function startTransform(f){if(f.def.sid==='al'){if(!f.cpu)say(f,'EM BREVE');return false}","function startTransform(f){if(f.def.sid==='al')return aucTransStart(f);")
rep("if(T.sj)return updSJT(T,f,t);","if(T.auc)return aucUpdT(T,f,t);if(T.sj)return updSJT(T,f,t);")
rep("if(G.trans&&G.trans.sj&&sjFull()){if(G.mode==='fight')drawHUD();return}","if(G.trans&&G.trans.auc&&aucFull()){if(G.mode==='fight')drawHUD();return}if(G.trans&&G.trans.sj&&sjFull()){if(G.mode==='fight')drawHUD();return}")
# MAIOR bônus de transformação do jogo: dano ×1,45×1,6 = ×2,32 | recebe ×0,8×0,7 = ×0,56 | velocidade 3,0 (já herdada do Yuta)
rep("*(a.form&&a.def.sid==='sj'?.97:1)","*(a.form&&a.def.sid==='sj'?.97:1)*(a.form&&a.def.sid==='al'?1.6:1)")
rep("*(d.form&&d.def.sid==='sj'?1.03:1)","*(d.form&&d.def.sid==='sj'?1.03:1)*(d.form&&d.def.sid==='al'?.7:1)")
# soco = tiro; MUITO perto = soco de verdade (nas duas formas)
rep("{const _sm=startMove;startMove=function(f,name){if(isAuc(f)&&!f.form&&name){","{const _sm=startMove;startMove=function(f,name){if(isAuc(f)&&name&&!aucNear(f)){")
# aura: transformado = vermelho-sangue MAIOR
rep("function aucAura(f,k){","function aucAura(f,k){if(f.form)return aucAuraF(f,k);")
rep("function ytAura(f,k){if(isAuc(f))return aucAura(f,k);","""/* ================= v598: ALUCARD — forma, transformação, ultimate, passiva ================= */
const AUV=__AUV__,AUTF=[],AUUF=[],AUTD=4,AUTE=Math.round(AUV.t.length*AUTD),AUUD=3,AUUE=Math.round(AUV.u.length*AUUD),AUBL=170;let AULP=null,AUOK=0;
function aucLoad(){if(AULP)return AULP;AULP=Promise.all([...skImL(AUV.t,AUTF),...skImL(AUV.u,AUUF)]).then(()=>{AUOK=1});return AULP}
function aucNear(f){const o=ytOpp(f);return !!o&&!o.ko&&Math.abs(o.x-f.x)<165&&Math.abs(o.y-f.y)<120}
function aucTransStart(f){if(G.trans&&G.trans.f!==f)return false;if(!AUOK){aucLoad();if(!f.cpu)say(f,'CARREGANDO...');return false}
  f.sb=Math.max(0,(f.sb||0)-SB_COST);f.state='transform';f.st=0;f.vx=0;f.vy=0;f.inv=999;G.trans={f,t:0,auc:1};try{SFX.powerUp()}catch(e){}buzz(60);return true}
function aucUlt(f,o){if(!f.form){if(!f.cpu)say(f,'TRANSFORME-SE PRIMEIRO');return false}if(f.ki<100){if(!f.cpu)say(f,'PRECISA DE 100 KI');return false}if(!o||o.ko||G.trans)return false;
  if(!AUOK){aucLoad();if(!f.cpu)say(f,'CARREGANDO...');return false}
  f.ki-=100;f.state='transform';f.st=0;f.vx=0;f.vy=0;f.inv=999;f.flying=false;f.y=FLOOR;f.grounded=true;o.hypHard=0;o.iceHard=0;G.trans={f,o,t:0,auc:1,u:1,n:0};try{SFX.superUp()}catch(e){}buzz(70);return true}
function aucFull(){const T=G.trans;if(T.u){if(T.t>=AUUE)return false;gkFull(AUUF,AUV.u.length,Math.floor(T.t/AUUD),Math.min(1,T.t/5,(AUUE-T.t)/5+.25));return true}
  if(T.t>=AUTE)return false;gkFull(AUTF,AUV.t.length,Math.floor(T.t/AUTD),Math.min(1,T.t/6,(AUTE-T.t)/6+.25));return true}
function aucBlood(x,y,n,pw){try{blood(x,y,Math.random()<.5?-1:1,n,pw)}catch(e){}if(!G.blood)for(let i=0;i<n;i++)addP({x:x+rand(-10,10),y,vx:rand(-3,3),vy:-rand(1,5),life:30,max:30,c:'#9a0010',type:'glow',sz:rand(3,6),g:.3})}
function aucUpdT(T,f,t){
  if(!T.u){if(t<AUTE)return;
    if(t===AUTE){f.form=1;f.formT=FORM_T;f.flick=0;G.flash=14;G.flashCol='#ff1a2a';G.shake=24;
      for(const r of [360,230,120])ring(f.x,f.y-150,r===120?'#ffd6da':'#c0001a',r,26,7);for(let i=0;i<40;i++)spark(f.x,f.y-150,i%3?'#ff1a2a':'#ffd6da',1,rand(5,16));
      try{SFX.transform()}catch(e){}banner('RESTRIÇÃO LIBERADA!','#ff2a3a',100,'NÍVEL ZERO — o vampiro desperta');buzz(150)}
    if(t>AUTE&&t%2===0)addP({x:f.x+rand(-80,80),y:f.y-rand(30,280),vx:0,vy:-rand(1,2.4),life:22,max:22,c:Math.random()<.7?'#c0001a':'#ff5a66',type:'glow',sz:rand(3,7),g:0});
    if(t>=AUTE+30){G.trans=null;f.inv=15;neutral(f);G.tz=1}return}
  /* ULTIMATE: depois do vídeo, o inimigo está CAÍDO, sangrando, e o Alucard continua atirando no corpo (rindo) */
  const d=T.o,e=t-AUUE;if(e<0)return;
  if(!d||d.ko){aucUltEnd(T,f,d);return}
  if(e===0){d.x=clamp(f.x+f.facing*250,90,WW-90);d.facing=-f.facing;d.y=FLOOR;d.grounded=true;d.flying=false;d.vx=0;d.vy=0;
    G.flash=10;G.flashCol='#ff1a2a';G.shake=22;aucBlood(d.x,FLOOR-40,26,9);banner('KUAHAHAHA!','#ff2a3a',80,'ULTIMATE');try{SFX.crater()}catch(e){}}
  d.state='rushed';d.rushKey=['fall',3];d.vx=0;d.vy=0;d.y=FLOOR;d.grounded=true;f.rushKey=['win',Math.floor(e/5)%8];f.y=FLOOR;
  G.tz=1.12;G.tzx=sxs((f.x+d.x)/2);G.tzy=sys(FLOOR-150);
  if(e%4===0)aucBlood(d.x+rand(-50,50),FLOOR-rand(10,30),2,3);
  if(e>=14&&e<AUBL-24&&e%11===3){T.n++;const gx=f.x+f.facing*110,gy=FLOOR-190;aucMuzzle(gx,gy,f.facing,T.n%4===0?'big':'mid',1);
    aucImpact(d.x+rand(-30,30),FLOOR-rand(20,50),T.n%4===0,1);aucBlood(d.x,FLOOR-40,T.n%4===0?16:9,T.n%4===0?8:6);d.x+=rand(-4,4);
    applyHit(f,d,{dmg:T.n%4===0?50:30,kb:0,hs:3,lock:1,px:d.x,py:FLOOR-40,kind:'blast'});G.shake=Math.max(G.shake,T.n%4===0?12:6);try{SFX.blast()}catch(e){}
    if(d.hp<=0){ko(f,d);aucUltEnd(T,f,d);return}}
  if(e===AUBL-14){aucMuzzle(f.x+f.facing*130,FLOOR-170,f.facing,'big',1);aucImpact(d.x,FLOOR-40,1,1);aucBlood(d.x,FLOOR-40,30,10);
    applyHit(f,d,{dmg:140,kb:0,hs:10,lock:1,heavy:1,px:d.x,py:FLOOR-40,kind:'blast'});G.flash=12;G.flashCol='#ff1a2a';G.shake=26;try{SFX.boom()}catch(e){}if(d.hp<=0){ko(f,d);aucUltEnd(T,f,d);return}}
  aucFxTick();
  if(e>=AUBL)aucUltEnd(T,f,d)}
function aucUltEnd(T,f,d){G.trans=null;G.tz=1;f.rushKey=null;f.inv=20;neutral(f);if(d){d.rushKey=null;if(!d.ko){d.state='down';d.st=0;d.downX=30;d.vx=0;d.vy=0}}}
/* passiva: 10% de chance de desviar sozinho de cada golpe (normal e transformado) */
{const _ah=applyHit;applyHit=function(a,d,h){try{if(isAuc(d)&&a&&a!==d&&h&&!h.lock&&!d.ko&&d.inv<=0&&!G.trans&&!G.ws&&G.mode==='fight'&&G.frame>=(d.aucDg||0)&&Math.random()<.1){
    d.aucDg=G.frame+18;d.ghosts.push({key:spriteKey(d),x:d.x,y:d.y,facing:d.facing,life:14,col:'#ff2a3a'});d.x=clamp(d.x-(a.x>d.x?1:-1)*120,40,WW-40);d.facing=a.x>d.x?1:-1;d.inv=Math.max(d.inv,10);
    if(d.state==='hit'||d.state==='blockstun')neutral(d);txt(d.x,d.y-300,'DESVIOU!','#ff9aa4');ring(d.x,d.y-150,'#ff2a3a',80,10,3);try{SFX.zip()}catch(e){}return false}}catch(e){}return _ah.apply(this,arguments)}}
/* aura transformado: vermelho-sangue, MAIOR, duas camadas + sangue pingando */
let AUCRD2=null;
function aucRed2(){if(AUCRD2)return AUCRD2;const I=GJAU.img;if(!I||!I.complete||!I.naturalWidth)return null;const c=document.createElement('canvas');c.width=I.naturalWidth;c.height=I.naturalHeight;const g=c.getContext('2d');g.drawImage(I,0,0);
  try{const d=g.getImageData(0,0,c.width,c.height),a=d.data;for(let i=0;i<a.length;i+=4){const L=Math.max(a[i],a[i+1],a[i+2]);a[i]=Math.min(255,L*.95);a[i+1]=Math.min(255,L*.02);a[i+2]=Math.min(255,L*.08)}g.putImageData(d,0,0)}catch(e){g.globalCompositeOperation='source-atop';g.fillStyle='rgba(125,0,12,.93)';g.fillRect(0,0,c.width,c.height)}AUCRD2=c;return c}
function aucAuraF(f,k){const t=G.frame,ch=f.state==='charge',P=aucRed(),Q=aucRed2(),A=GJAU;
  if(P&&Q){const i=Math.floor(t/3)%A.n,h=(ch?400:365)*(1+.04*Math.sin(t*.5)),w=h*A.w/A.h*.95;ctx.save();ctx.translate(f.x,f.y-h*.46);ctx.scale((t>>4)%2?f.facing:-f.facing,1);
    ctx.globalAlpha=ch?.5:.36;ctx.drawImage(Q,0,((i+3)%A.n)*A.h,A.w,A.h,-w*.6,-h*.55,w*1.2,h*1.1);
    ctx.globalCompositeOperation='lighter';ctx.globalAlpha=ch?.7:.5;ctx.drawImage(P,0,i*A.h,A.w,A.h,-w/2,-h/2,w,h);
    const j=(i+2)%A.n,h2=h*.75,w2=h2*A.w/A.h*.8;ctx.globalAlpha=ch?.5:.32;ctx.drawImage(P,0,j*A.h,A.w,A.h,-w2/2+Math.sin(t*.2)*8,-h2/2+h*.12,w2,h2);ctx.restore()}
  if(G.hitstop<=0){if(t%(ch?1:2)===0)addP({x:f.x+rand(-70,70),y:f.y-rand(10,290),vx:rand(-.5,.5),vy:-rand(1.6,3.4),life:rand(16,28),max:28,c:Math.random()<.6?'#c0001a':Math.random()<.5?'#ff3a4a':'#ffd6da',type:'glow',sz:rand(2.5,6),g:0});
    if(t%9===0)addP({x:f.x+rand(-45,45),y:f.y-rand(120,250),vx:0,vy:rand(.5,1.5),life:40,max:40,c:'#7d0010',type:'glow',sz:rand(2.5,4),g:.25})}
  zArcs(f,f.x,f.y,ZPAL.red,ch?8:5,ch?.9:.6)}
function ytAura(f,k){if(isAuc(f))return aucAura(f,k);""".replace('__AUV__',cj(V)))
# carrega os vídeos quando uma luta com o Alucard começa
rep("function aucTick(){aucFxTick();","function aucTick(){aucFxTick();if(!AULP&&G.p.some(isAuc))aucLoad();")
open(P,'w',encoding='utf8').write(s);print('alucard forma ok',len(s))
