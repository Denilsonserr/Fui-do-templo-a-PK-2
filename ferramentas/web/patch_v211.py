import sys
# v211: no EVENTO o chefe final tem 2 vidas: ao morrer a 1ª vez ele volta com a vida cheia e 2x mais forte
P=sys.argv[1];s=open(P).read()
def rep(a,b,n=1):
    global s;c=s.count(a);assert c==n,(a[:80],c);s=s.replace(a,b)
rep("function ko(a,d){if(G.phase!=='fight')return;",
r"""function twBossRevive(a,d){d.twRev=1;d.ko=false;d.hp=d.hpLag=d.mhp;d.tdm=(d.tdm||1)*2;d.tsp=(d.tsp||1)*1.2;d.tdf=(d.tdf||1)*.85;d.state='idle';d.st=0;d.vx=0;d.vy=0;d.y=FLOOR;d.grounded=true;d.flying=false;d.move=null;d.hitstun=0;d.inv=100;d.ki=100;
  a.vx=-a.facing*10;G.hitstop=Math.max(G.hitstop,24);G.slow=Math.max(G.slow||0,40);G.flash=12;G.flashCol='#ff3030';G.shake=30;
  for(const r of [360,240,130])ring(d.x,d.y-150,r===130?'#ffffff':'#ff1a1a',r,28,8);for(let i=0;i<46;i++)spark(d.x,d.y-150,i%3?'#ff4a3a':'#ffffff',1,rand(6,18));try{flashL(d.x,d.y-150,'#ff2020',700,1,30)}catch(e){}
  banner('O CHEFE VOLTOU!','#ff3030',120,'2ª VIDA · 2X MAIS FORTE');try{SFX.transform();SFX.boom()}catch(e){}buzz(200)}
function ko(a,d){if(G.phase!=='fight')return;
  if(TW.on&&G.gmode==='torre'&&TW.evBoss&&TW.fl===TWN-1&&d===G.p[1]&&!d.twRev){twBossRevive(a,d);return}""")
rep("function twFight(){if(TW.busy)return;TW.busy=true;","function twFight(){if(TW.busy)return;TW.busy=true;TW.evBoss=TW.fl===TWN-1&&twEvSt()==='ao vivo';")
rep("banner('CHEFE FINAL','#ffc531',90,o.def.name+' · TRANSFORMADO');","banner('CHEFE FINAL','#ffc531',90,o.def.name+' · TRANSFORMADO'+(TW.evBoss?' · 2 VIDAS (EVENTO)':''));")
rep("Durante o horário do evento, toda subida da torre que <b>terminar</b>","⚠️ No evento o <b>CHEFE FINAL tem 2 vidas</b>: quando morre, volta com a vida cheia e 2x mais forte! Durante o horário do evento, toda subida da torre que <b>terminar</b>")
open(P,'w').write(s);print('ok')
