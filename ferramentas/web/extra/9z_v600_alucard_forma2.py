import sys
# v600: ALUCARD (🧪 TESTE do ADM) — pedido do dono depois de testar a forma:
#  - tiros da forma MAIS RÁPIDOS e recarga mais curta (combo próprio af1..af5, balas mais velozes);
#  - no lugar dos 3 tiros (Ki), transformado solta MORCEGOS DE SANGUE que perseguem o inimigo (divertido);
#  - DASH bem mais rápido (normal e ainda mais transformado), com rastro vermelho.
# Roda depois de 9z_v598_alucard_forma.py.
P=sys.argv[1];s=open(P,encoding='utf8').read()
def rep(a,b,n=1):
    global s;c=s.count(a);assert c==n,(a[:90],c);s=s.replace(a,b)
# combo de tiros da forma
rep("const m=AUCMAP[n];","const m=(f.form?AUCMAPF:AUCMAP)[n];")
rep("const AUCMAP={ujab:'aj1',ujab2:'aj2',ujab3:'aj3',uknee:'aj4',ustr:'aj5'};","""const AUCMAP={ujab:'aj1',ujab2:'aj2',ujab3:'aj3',uknee:'aj4',ustr:'aj5'};
/* v600: transformado = rajadas mais rápidas, mais balas e recarga curta */
const AUCMAPF={ujab:'af1',ujab2:'af2',ujab3:'af3',uknee:'af4',ustr:'af5'};
Object.assign(AUCSH,{af1:{n:2,gap:2,d:16,dy:192,fast:1},af2:{n:3,gap:2,d:14,dy:188,fast:1},af3:{n:10,gap:1,d:8,dy:118,alt:1,fast:1},af4:{n:3,gap:2,d:18,dy:188,back:18,fast:1},af5:{n:2,gap:6,d:60,dy:150,big:1}});""")
rep("Object.assign(MOVES,{aj1:M(3,4,9,'aj2','ukick')","Object.assign(MOVES,{af1:M(2,4,5,'af2','ukick'),af2:M(2,6,5,'af3','ukick2'),af3:M(2,11,5,'af4','ukick3'),af4:M(2,6,5,'af5','uhkick'),af5:M(4,8,9,null,null),aj1:M(3,4,9,'aj2','ukick')")
rep("Object.assign(VGA,{aj1:['sA',","Object.assign(VGA,{af1:['sA',[0],[1,2,3,4],[5,6,7]],af2:['sB',[0],[1,2,3,4,5],[6,7]],af3:['sC',[0],[1,2,3,4,5,6],[7]],af4:['sD',[0],[1,2,3,4,5],[6,7]],af5:['sE',[0,1],[2,3,4],[5,6,7]],aj1:['sA',")
# balas mais velozes transformado
rep("AUCB.push({x,y,vx:f.facing*(O.big?30:O.fast?50:38),","AUCB.push({x,y,vx:f.facing*(O.big?30:O.fast?50:38)*(f.form?1.3:1),")
# Ki transformado = morcegos
rep("if(k===4&&f.aucK!==k){f.aucK=k;aucFire(f,24,196,{vy:-1.6});","if(k===4&&f.aucK!==k&&f.form){f.aucK=k;aucBats(f)}if(k===4&&f.aucK!==k){f.aucK=k;aucFire(f,24,196,{vy:-1.6});")
rep("function aucFxTick(){if(G.hitstop>0)return;","""/* v600: MORCEGOS DE SANGUE (Ki transformado): saem do casaco, voam batendo asa e perseguem o inimigo */
let AUCBAT=[];
function aucBats(f){const o=ytOpp(f);for(let i=0;i<9;i++)AUCBAT.push({x:f.x+f.facing*rand(10,60),y:f.y-rand(110,260),vx:f.facing*rand(5,11),vy:rand(-5,3),t:0,f,o,ph:rand(0,6),sz:rand(.8,1.25),oy:rand(-90,60),life:150+i*4,dl:i*3});
  txt(f.x,f.y-320,'FAMILIARES!','#ff5a66');ring(f.x,f.y-180,'#c0001a',120,14,4);for(let i=0;i<14;i++)addP({x:f.x+rand(-40,40),y:f.y-rand(120,260),vx:f.facing*rand(1,5),vy:rand(-2,2),life:24,max:24,c:i%2?'#7d0010':'#ff3a4a',type:'glow',sz:rand(4,8),g:0});try{SFX.whoosh()}catch(e){}G.shake=Math.max(G.shake,5)}
function aucBatTick(){if(G.hitstop>0)return;const n=[];for(const b of AUCBAT){b.t++;if(b.t<b.dl){n.push(b);continue}const o=b.o;
    if(o&&!o.ko){const tx=o.x,ty=o.y-150+b.oy*Math.max(0,1-b.t/60),dx=tx-b.x,dy=ty-b.y,d=Math.hypot(dx,dy)||1;b.vx+=dx/d*1.15;b.vy+=dy/d*1.15+Math.sin(b.t*.4+b.ph)*.6}
    const sp=Math.hypot(b.vx,b.vy),mx=17;if(sp>mx){b.vx*=mx/sp;b.vy*=mx/sp}b.x+=b.vx;b.y+=b.vy;
    if(G.frame%2===0)addP({x:b.x,y:b.y,vx:0,vy:.3,life:12,max:12,c:'#a0000c',type:'glow',sz:3*b.sz,g:0});
    if(o&&!o.ko&&o.inv<=0&&Math.abs(o.x-b.x)<52&&b.y>o.y-290&&b.y<o.y+10){if(applyHit(b.f,o,{dmg:13,kb:.8,hs:3,px:b.x,py:b.y,kind:'blast'})){aucImpact(b.x,b.y,0,1);aucBlood(b.x,b.y,5,4)}if(o.hp<=0)ko(b.f,o);continue}
    if(--b.life>0&&b.x>-100&&b.x<WW+100)n.push(b);else for(let i=0;i<5;i++)addP({x:b.x,y:b.y,vx:rand(-2,2),vy:rand(-2,2),life:18,max:18,c:'#5a0008',type:'glow',sz:rand(3,6),g:0})}
  AUCBAT=n}
function aucDrawBats(){if(!AUCBAT.length)return;ctx.save();for(const b of AUCBAT){if(b.t<b.dl)continue;const fl=Math.sin(b.t*.9+b.ph),s=34*b.sz,dir=b.vx>=0?1:-1;
    ctx.save();ctx.translate(b.x,b.y);ctx.rotate(Math.atan2(b.vy,Math.abs(b.vx))*dir*.35);ctx.scale(dir,1);
    ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(0,0,0,0,0,s*1.6);g.addColorStop(0,'rgba(255,20,30,.7)');g.addColorStop(1,'rgba(255,30,40,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,s*1.6,0,7);ctx.fill();
    ctx.globalCompositeOperation='source-over';ctx.fillStyle='#120206';
    for(const sd of [-1,1]){const wy=fl*s*.75;ctx.beginPath();ctx.moveTo(0,-s*.12);ctx.quadraticCurveTo(sd*s*.5,-s*.35+wy*.5,sd*s*1.15,-s*.25+wy);
      ctx.quadraticCurveTo(sd*s*.95,s*.05+wy*.6,sd*s*.78,-s*.02+wy*.55);ctx.quadraticCurveTo(sd*s*.6,s*.22+wy*.4,sd*s*.42,s*.06+wy*.3);ctx.quadraticCurveTo(sd*s*.25,s*.22,0,s*.12);ctx.closePath();ctx.fill()}
    ctx.beginPath();ctx.ellipse(0,0,s*.17,s*.28,0,0,7);ctx.fill();ctx.beginPath();ctx.moveTo(-s*.12,-s*.2);ctx.lineTo(-s*.08,-s*.42);ctx.lineTo(-s*.02,-s*.24);ctx.lineTo(s*.02,-s*.24);ctx.lineTo(s*.08,-s*.42);ctx.lineTo(s*.12,-s*.2);ctx.fill();
    ctx.fillStyle='#ff2a3a';ctx.shadowColor='#ff0000';ctx.shadowBlur=6;ctx.fillRect(-s*.09,-s*.16,s*.06,s*.05);ctx.fillRect(s*.03,-s*.16,s*.06,s*.05);ctx.shadowBlur=0;ctx.restore()}
  ctx.restore()}
function aucFxTick(){aucBatTick();if(G.hitstop>0)return;""")
rep("function aucDrawFX(){if(!AUCB.length&&!AUCFX.length)return;","function aucDrawFX(){aucDrawBats();if(!AUCB.length&&!AUCFX.length)return;")
rep("AUCB=nb;if(G.mode!=='fight'){AUCFX=[]}","AUCB=nb;if(G.mode!=='fight'){AUCFX=[];AUCBAT=[]}")
# DASH bem mais rápido (normal 24, transformado 36), ação liberada antes, rastro vermelho; corrida mais rápida
rep("function vgUpd(f,o,ctl){","""function vgUpd(f,o,ctl){if(isAuc(f)&&(f.state==='vdash'||f.state==='vbdash'||f.state==='vrun'))return aucDash(f,o,ctl);return vgUpd0(f,o,ctl)}
function aucDash(f,o,ctl){const I=f.inp,fw=f.facing,hf=fw>0?I.right:I.left,hb=fw>0?I.left:I.right,t=f.st,V=f.form?36:24,M=f.form;
  if(G.hitstop<=0){f.ghosts.push({key:spriteKey(f),x:f.x,y:f.y,facing:f.facing,life:M?12:8,col:M?'#c0001a':'#ff3a4a'});
    if(f.state!=='vrun'||G.frame%2===0)addP({x:f.x-fw*rand(10,50),y:f.y-rand(40,250),vx:-fw*rand(4,9),vy:0,life:12,max:12,c:M?'#a0000c':'#ff4a5a',type:'glow',sz:rand(2,4),g:0})}
  if(f.state==='vdash'){f.vx=(t<2?8:t<8?V:t<12?V*(1-(t-8)/4):0)*fw;if(t===1){try{SFX.zip()}catch(e){}if(M)f.inv=Math.max(f.inv,6)}
    if(t<9&&G.frame%2===0)dirt(f.x-fw*24,2,-fw,4.5);
    if(t>=2&&ctl&&vgAct(f,o,hf,hb)){if(f.state==='attack')f.vx=9*fw;return}
    if(t>=2&&ctl&&I.up){vgJump(f,true);return}
    if(t>=7&&ctl&&hf){f.state='vrun';f.st=0;return}
    if(t>=12){f.state='vstop';f.st=0}return}
  if(f.state==='vbdash'){f.vx=-(t<2?6:t<8?V*.85:t<12?V*.85*(1-(t-8)/4):0)*fw;if(t===1&&M)f.inv=Math.max(f.inv,8);if(t>=8&&ctl&&vgAct(f,o,hf,hb))return;if(t>=12)neutral(f);return}
  if(!ctl||!hf){f.state='vstop';f.st=0;return}
  f.vx=f.def.walk*(M?3.9:3.0)*fw;if(G.frame%4===0)dirt(f.x-fw*22,2,-fw,3);
  if(vgAct(f,o,hf,hb)){if(f.state==='attack')f.vx=8*fw;return}
  if(I.up){vgJump(f,true);return}
  if(Math.abs(o.x-f.x)<92&&Math.sign(o.x-f.x)===fw){f.state='vstop';f.st=0}}
function vgUpd0(f,o,ctl){""")
# animação do dash do Alucard acompanha o dash curto
rep("case 'vdash':return['dashf',t<3?1:t<6?2:t<10?3:t<14?4:t<17?5:t<20?6:7];","case 'vdash':return isAuc(f)?['dashf',t<2?1:t<4?2:t<6?3:t<8?4:t<10?5:t<11?6:7]:['dashf',t<3?1:t<6?2:t<10?3:t<14?4:t<17?5:t<20?6:7];")
rep("try{window.__aucT={fire:(...a)=>aucFire(...a),tick:()=>aucTick(),n:()=>({b:AUCB.length,fx:AUCFX.length})}}catch(e){}","try{window.__aucT={fire:(...a)=>aucFire(...a),tick:()=>aucTick(),n:()=>({b:AUCB.length,fx:AUCFX.length,bat:AUCBAT.length})}}catch(e){}")
open(P,'w',encoding='utf8').write(s);print('alucard forma2 ok',len(s))
