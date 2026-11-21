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
rep("const ROS={sung:","const ROS={alucard:{c:'#c0101e',d:'Pistoleiro vampiro (EM TESTE). Muito rápido. Soco = socos e TIROS de longe, chute = chutes com a arma e rasteira atirando. Ki = rajada de 3 tiros. Combo = SUPER COMBO.'},sung:")
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
rep("function ytAura(f,k){","""/* ================= v594: ALUCARD — tiros, aura vermelha ================= */
const AUC_GUN={ujab3:1,ustr:1,usweep:1,uajab:1,wjab3:1,wstr:1,wsweep:1,wajab:1};
let AUCB=[];
/* tiro: projétil rápido com rastro vermelho; acerta de longe */
function aucFire(f,dmg,dy){const o=ytOpp(f);if(!o)return;const x=f.x+f.facing*120,y=f.y-(dy||188);
  AUCB.push({x,y,vx:f.facing*38,f,o,dmg,life:40});
  flashL(x+f.facing*14,y,'#ffb040',70,.9,6);ring(x+f.facing*10,y,'#ffd27a',26,6,2);for(let i=0;i<5;i++)spark(x,y,i%2?'#ffd27a':'#ff4a2a',1,rand(3,8));
  try{SFX.blast()}catch(e){}G.shake=Math.max(G.shake,2)}
function aucTick(){if(!AUCB.length)return;const nb=[];
  for(const b of AUCB){if(G.hitstop>0){nb.push(b);continue}
    for(let k=0;k<3;k++){b.x+=b.vx/3;addP({x:b.x,y:b.y+rand(-1.5,1.5),vx:-b.vx*.04,vy:0,life:7,max:7,c:k?'#ff3a2a':'#ffe2a0',type:'glow',sz:k?3.2:2.2,g:0});
      const o=b.o;if(o&&!o.ko&&o.inv<=0&&Math.abs(o.x-b.x)<46&&b.y>o.y-300&&b.y<o.y+10){const h={dmg:b.dmg,kb:1.2,hs:7,px:b.x,py:b.y,kind:'blast'};
        if(applyHit(b.f,o,h)){ring(b.x,b.y,'#ff4a5a',46,10,3);for(let i=0;i<6;i++)spark(b.x,b.y,i%2?'#ffffff':'#ff2a3a',1,rand(3,9))}if(o.hp<=0)ko(b.f,o);b.life=0;break}}
    if(--b.life>0&&b.x>-60&&b.x<WW+60)nb.push(b)}
  AUCB=nb;
  for(const f of G.p){if(!isAuc(f)||f.ko)continue;
    /* golpes com a arma no combo (tiro, tiro pra cima, rasteira atirando, tiro no ar): disparam um tiro no 1º quadro ativo */
    if(f.state==='attack'&&f.move&&AUC_GUN[f.mname]){if(f.mf>=f.move.su&&f.alS!==f.move){f.alS=f.move;aucFire(f,f.mname.endsWith('sweep')?30:36,f.mname.endsWith('sweep')?96:f.mname.endsWith('str')?212:188)}}
    else f.alS=null;
    /* muito rápido: rastro vermelho correndo/dash */
    if(G.hitstop<=0&&(f.state==='run'||f.state==='vrun'||f.state==='vdash'||f.state==='dash')&&G.frame%3===0)f.ghosts.push({key:spriteKey(f),x:f.x,y:f.y,facing:f.facing,life:9,col:'#ff3a4a'})}}
/* Ki = RAJADA DE 3 TIROS (folha 03: saca e atira) */
function aucKiStep(f,o,t){const D=1.7,k=Math.floor(t/D),END=Math.round(8*D+6);f.vx=0;
  if(k>=3&&k<=5&&f.alK!==k){f.alK=k;aucFire(f,30,188)}
  if(t>=END){f.alK=-1;neutral(f)}}
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
