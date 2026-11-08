
/* ================= v191: BROLY — socos novos (folha de 8 do dono) e COMBO DO LENDÁRIO (folha de 16) no botão de combo ================= */
const BRN=__BRN__;
(function(){for(const k in BRN.n)SPRH.br[k]=BRN.n[k];for(const k in BRN.f)SPRH.brf[k]=BRN.f[k];
  const B=(reach,back,top)=>[-(back||0),-(top||285),reach+(back||0),(top||285)];
  Object.assign(MOVES,{
    bp1:{su:3,ac:3,rc:6,dmg:44,hb:B(160,10),kb:2,hs:16,next:'bp2',lean:2.2,cat:'punch',xv:['bpn',[4],[5],[4]]},
    bp2:{su:4,ac:3,rc:7,dmg:52,hb:B(185,10),kb:2.2,hs:17,next:'bp3',lean:2.8,cat:'punch',xv:['bpn',[1],[2],[0]]},
    bp3:{su:3,ac:3,rc:7,dmg:52,hb:B(185,10),kb:2.2,hs:17,next:'bp4',lean:2.8,cat:'punch',xv:['bpn',[0],[3],[4]]},
    bp4:{su:3,ac:3,rc:6,dmg:46,hb:B(160,10),kb:2,hs:16,next:'bp5',lean:2.2,cat:'punch',xv:['bpn',[4],[5],[4]]},
    bp5:{su:4,ac:3,rc:7,dmg:58,hb:B(185,10),kb:2.4,hs:18,next:'bp6',lean:3,cat:'punch',xv:['bpn',[1],[2],[0]]},
    bp6:{su:10,ac:5,rc:16,dmg:120,hb:B(175,20,300),kb:4,hs:26,heavy:1,lean:4.5,brStun:1,cat:'punch',xv:['bpn',[6],[7],[7,4]]}})})();
function brD(f){return f.form?3:4}
function xvKey(f){if(f.state==='brc')return['bcm',Math.min(15,Math.floor(f.st/brD(f)))];
  if(f.state==='attack'&&f.move&&f.move.xv){const m=f.move,V=m.xv,mf=f.mf;let L,u;
    if(mf<=m.su){L=V[1];u=mf/Math.max(1,m.su)}else if(mf<=m.su+m.ac){L=V[2];u=(mf-m.su)/Math.max(1,m.ac)}else{L=V[3];u=(mf-m.su-m.ac)/Math.max(1,m.rc)}
    return[V[0],L[Math.min(L.length-1,Math.floor(u*L.length))]]}return null}
/* COMBO DO LENDÁRIO: segura o rival, socos com energia verde, gancho, giro de socos e o soco final explosivo */
function brCombo(f,o){f.brW=f.form?1:.6;f.state='brc';f.st=0;f.vx=0;f.move=null;f.guard=false;f.brHeld=false;f.brK=-1;SFX.whoosh()}
function brcStep(f){const o=G.p[0]===f?G.p[1]:G.p[0],t=++f.st,fw=f.facing,D=brD(f),k=Math.floor(t/D),END=16*D+10,HK={3:26,5:26,7:30,8:30,10:22,11:22,12:22,13:22,14:24};
  if(k===2||k===9)f.x=clamp(f.x+fw*8,40,WW-40);
  if(!f.brHeld&&k>=2&&k<=4&&o&&!o.ko&&Math.abs(o.x-f.x)<230&&Math.abs(o.y-f.y)<170&&o.inv<=0){f.brHeld=true;fzTag(f,f.form?'Combo do Lendário!':'Combo do Broly!')}
  if(f.brHeld&&o){o.state='rushed';o.st=0;o.vx=0;o.vy=0;o.flying=false;o.grounded=true;o.move=null;o.x=clamp(f.x+fw*125,40,WW-40);o.y=FLOOR;
    if(k!==f.brK){f.brK=k;
      if(HK[k]){applyHit(f,o,{dmg:HK[k]*(f.brW||1),kb:0,hs:5,px:o.x-fw*30,py:o.y-rand(130,190),kind:'melee',lock:1});G.hitstop=Math.max(G.hitstop,3);G.shake=Math.max(G.shake,6);
        ring(o.x-fw*30,o.y-160,'#7dff5c',110,12,4);spark(o.x-fw*30,o.y-160,'#c8ff9a',8,8);try{SFX.hit(true,1)}catch(e){}if(o.hp<=0){ko(f,o);f.brHeld=false}}
      if(k===15&&f.brHeld){const h={dmg:125*(f.brW||1),kb:0,hs:22,heavy:1,px:o.x-fw*20,py:o.y-150,kind:'melee',lock:1};applyHit(f,o,h);f.brHeld=false;
        o.state='airhit';o.vx=fw*14;o.vy=-5;o.grounded=false;o.bounced=false;if(!f.finDone&&f.combo>=3)comboFinish(f,o,h);G.shake=Math.max(G.shake,20);G.flash=6;G.flashCol='#e0ffd0';
        ring(o.x,o.y-150,'#7dff5c',280,24,8);flashL(o.x,o.y-140,'#5cff4a',560,.9,20);spark(o.x,o.y-150,'#e8ffd8',22,14);try{SFX.boom()}catch(e){}if(o.hp<=0)ko(f,o)}}}
  if(t>=END){f.brHeld=false;neutral(f)}}
