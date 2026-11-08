import sys
# v208: SUPER SOCO (segurar o soco) com carregamento no botão e QUEBRA DE DEFESA
P=sys.argv[1];s=open(P).read()
def rep(a,b,n=1):
    global s;c=s.count(a);assert c==n,(a[:80],c);s=s.replace(a,b)
# quebra de defesa: super soco contra quem está defendendo (inclusive defesa perfeita)
rep("\n  if(blocking&&((d.guardT||0)<=(isGr(d)?(d.form?18:12):7)||",
    "\n  if(blocking&&h.smash&&h.kind!=='beam'){guardBreak(a,d,h,mult);return true}\n  if(blocking&&((d.guardT||0)<=(isGr(d)?(d.form?18:12):7)||")
rep("function applyHit(a,d,h){",r"""function guardBreak(a,d,h,mult){const x=h.px||d.x,y=h.py||d.y-150,dm=h.dmg*mult*.6;d.hp=Math.max(1,d.hp-dm);d.lagT=30;
  d.state='hit';d.st=0;d.hitstun=58;d.guard=false;d.move=null;d.vx=a.facing*7;d.gbT=58;d.stunFx=58;a.combo=(a.combo||0)+1;a.ki=Math.min(100,a.ki+10);
  txt(d.x,d.y-300,'DEFESA QUEBRADA!','#7fd8ff');G.hitstop=Math.max(G.hitstop,16);G.slow=Math.max(G.slow||0,16);G.shake=Math.max(G.shake,20);G.flash=Math.max(G.flash,4);G.flashCol='#d8f2ff';
  ring(x,y,'#ffffff',110,14,6);ring(x,y,'#7fd8ff',220,22,6);for(let i=0;i<22;i++){const an=Math.random()*TAU,v=rand(5,15);addP({x,y,vx:Math.cos(an)*v,vy:Math.sin(an)*v-3,life:rand(24,40),max:40,c:i%3?'#bfeaff':'#ffffff',type:'glow',sz:rand(4,9),g:.35})}
  try{flashL(x,y,'#9fdcff',460,.9,18)}catch(e){}try{SFX.clang();SFX.boom()}catch(e){}buzz(80)}
function applyHit(a,d,h){""")
# quem está com a defesa quebrada não consegue defender até se recuperar
rep("const blocking=!h.lock&&(","const blocking=!h.lock&&!((d.gbT||0)>0)&&(")
rep("function cmbCD(f){","function cmbCD(f){if(f.gbT>0)f.gbT--;")
# carregamento no botão de soco (jogador 1)
rep("function cmbCD(f){if(f.gbT>0)f.gbT--;",r"""function cmbCD(f){if(f.gbT>0)f.gbT--;
  if(!f.cpu&&G.p&&f===G.p[0]){const b=$('bPunch');if(b){const p=Math.min(1,Math.max(0,((f.pHeld||0)-4)/16)),k=Math.round(p*20);if(b.dataset.ch!==String(k)){b.dataset.ch=k;let q=b.querySelector('.pch');if(!q){q=document.createElement('i');q.className='pch';b.appendChild(q);const t=document.createElement('i');t.className='pchT';t.textContent='SUPER!';b.appendChild(t)}q.style.setProperty('--p',(p*100)+'%');b.classList.toggle('chg',p>0&&p<1);b.classList.toggle('chf',p>=1)}}}""")
# texto e glow do carregamento mais visíveis no personagem
rep("if(f.pHeld===20)f.buf.smash=G.frame}","if(f.pHeld===20){f.buf.smash=G.frame;if(!f.hide)ring(f.x+f.facing*70,f.y-170,'#ffd84a',90,12,4)}}")
rep("txt(f.x,f.y-290,'SUPER SOCO!','#ffd23f');return true}","txt(f.x,f.y-290,'SUPER SOCO! 💥','#ffd23f');return true}")
rep("\n.twBag .bgw{",r"""
#bPunch .pch{position:absolute;inset:-9%;border-radius:50%;pointer-events:none;opacity:0;background:conic-gradient(#ffd84a var(--p,0%),rgba(255,255,255,.12) 0);-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 7px),#000 calc(100% - 6px));mask:radial-gradient(farthest-side,transparent calc(100% - 7px),#000 calc(100% - 6px));transition:opacity .1s}
#bPunch.chg .pch{opacity:1;filter:drop-shadow(0 0 6px #ffb300)}#bPunch.chf .pch{opacity:1;background:conic-gradient(#fff,#ffd84a,#fff,#ffd84a,#fff);animation:pchF .25s ease-in-out infinite alternate;filter:drop-shadow(0 0 10px #fff) drop-shadow(0 0 16px #ffb300)}
#bPunch .pchT{display:none;font-style:normal;position:absolute;left:50%;bottom:4%;transform:translateX(-50%);z-index:5;background:rgba(0,0,0,.75);padding:1px 6px;border-radius:6px;border:1px solid #ffd84a;font:900 13px var(--f-ui);color:#ffd84a;text-shadow:0 0 6px #ff6a00,0 1px 2px #000;pointer-events:none;white-space:nowrap}#bPunch.chf .pchT{display:block}
@keyframes pchF{to{opacity:.55}}
.twBag .bgw{""")
open(P,'w').write(s);print('ok')
