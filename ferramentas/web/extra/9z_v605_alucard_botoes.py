import json,sys,os
# v605: BOTÕES PERSONALIZADOS DO ALUCARD (artes do dono: normal e transformado; só os botões, sem o HUD de vida),
# recortados por ferramentas/personagens/alucard/hud_al.py -> build/hud_alucard.json -> HUDA.alucard (mesmo tamanho/lugar dos botões de sempre).
# Transformado: raios vermelhos + SANGUE escorrendo dos botões + brilho vermelho pulsando (#controls.alf).
P=sys.argv[1];s=open(P,encoding='utf8').read()
B=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','personagens','alucard','build')
HU=json.load(open(os.path.join(B,'hud_alucard.json')))
def rep(a,b,n=1):
    global s;c=s.count(a);assert c==n,(a[:90],c);s=s.replace(a,b)
cj=lambda o:json.dumps(o,separators=(',',':'))
rep("const HUDA={","const HUDA={\"alucard\":%s,"%cj(HU))
rep("const HUTH={","const HUTH={alucard:{c:'#ff1a2a',c2:'#ffc0c4',bc:'#ff1a1a',bc2:'#ffd6d6',k:'blood'},")
rep("if(T.k==='firebolt'){for(const b of BFX.list){","if(T.k==='blood')aucBtnFx(g,T,t);else if(T.k==='firebolt'){for(const b of BFX.list){")
rep("function fxTheme(f){","""/* v605: botões do Alucard transformado: raios vermelhos em volta + gotas de SANGUE escorrendo e pingando + névoa vermelha */
function aucBtnFx(g,T,t){const L=BFX.list;
  if(t%4===0||!BFX.bolts.length){BFX.bolts=[];for(const b of L){const nb=b.id==='bSr'?3:(Math.random()<.75?1:0);for(let q=0;q<nb;q++){BFX.bolts.push(boltArc(b.x,b.y,b.r*(1.02+Math.random()*.12),Math.random()*TAU,.7+Math.random()*1.3,9,.32));
      if(Math.random()<.45){const a=Math.random()*TAU,x0=b.x+Math.cos(a)*b.r,y0=b.y+Math.sin(a)*b.r,Ln=b.r*(.4+Math.random()*.6);BFX.bolts.push(boltLine(x0,y0,x0+Math.cos(a)*Ln,y0+Math.sin(a)*Ln,6,b.r*.3))}}}}
  for(const P of BFX.bolts)jag(g,P,T.bc,T.bc2,1.6);
  /* gotas: nascem na metade de baixo do anel, escorrem e caem */
  for(const b of L)if(Math.random()<(b.id==='bSr'?.35:.16)){const a=Math.PI*(.15+Math.random()*.7);BFX.p.push({x:b.x+Math.cos(a)*b.r*.98,y:b.y+Math.sin(a)*b.r*.98,vx:0,vy:.15,l:0,m:40+Math.random()*30,s:b.r*(.05+Math.random()*.05),st:8+Math.random()*16})}
  for(const p of BFX.p){p.l++;if(p.l>p.st){p.vy+=.18;p.y+=p.vy}else p.y+=.12;const u=p.l/p.m,a=Math.max(0,1-u);
    g.globalCompositeOperation='source-over';g.globalAlpha=a*.95;g.fillStyle='#8a0010';g.beginPath();g.ellipse(p.x,p.y,p.s,p.s*(1+Math.min(2.2,p.vy*.6)),0,0,TAU);g.fill();
    g.fillStyle='#ff4a55';g.globalAlpha=a*.7;g.beginPath();g.arc(p.x-p.s*.3,p.y-p.s*.3,p.s*.35,0,TAU);g.fill();
    if(p.l<=p.st){g.strokeStyle='#7a000c';g.globalAlpha=a*.8;g.lineWidth=p.s*1.1;g.beginPath();g.moveTo(p.x,p.y-p.l*.12-p.s);g.lineTo(p.x,p.y);g.stroke()}}
  g.globalCompositeOperation='lighter';BFX.p=BFX.p.filter(p=>p.l<p.m);
  const C1=blobT('#c0001a');for(const b of L){const pu=.55+.45*Math.sin(t*.12+b.y*.03);g.globalAlpha=.22*pu;g.drawImage(C1,b.x-b.r*1.5,b.y-b.r*1.5,b.r*3,b.r*3)}}
function fxTheme(f){""")
# brilho vermelho pulsando nos botões quando transformado
rep("#controls.skf .b{","#controls.alf .b{filter:drop-shadow(0 0 .5em #ff1a2a) drop-shadow(0 0 .15em #7a0010)} #controls.alf::before{content:\"\";position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 10% 78%,rgba(200,0,20,.22),transparent 32%),radial-gradient(circle at 86% 66%,rgba(200,0,20,.24),transparent 36%);animation:mfPul 1.6s ease-in-out infinite} #controls.skf .b{")
rep("function aucTick(){aucFxTick();","function aucTick(){aucFxTick();try{const p0=G.p[0];if(p0&&!p0.cpu){const C=$('controls');if(C)C.classList.toggle('alf',isAuc(p0)&&!!p0.form)}}catch(e){}")
open(P,'w',encoding='utf8').write(s);print('alucard botoes ok')
