import json,re
D='/tmp/claude-0/-home-claude/84c7cfdc-56b6-51b4-bc59-f94c8c16eba0/scratchpad/s/ui/'
T=json.load(open(D+'thumbs.json'));Z=json.load(open(D+'stslots.json'))
P='/home/claude/fui-do-templo-a-pk-2/www/index.html';s=open(P).read()
def rep(a,b):
    global s;assert s.count(a)==1,(a[:70],s.count(a));s=s.replace(a,b)
i=s.index('<section id="stages" class="screen" hidden>');j=s.index('</section>',i)
old=s[i:j]
keep=re.search(r'(<div class="seg" id="msel">.*?</div>)',old,re.S).group(1)+re.search(r'(<div class="seg" id="wsel">.*?</div>)',old,re.S).group(1)
s=s[:i]+'''<section id="stages" class="screen fz" hidden>
    <div class="stS"><div id="stGrid"></div>
      <button class="sth" data-o="mus" style="left:31%;top:84.5%;width:38%;height:6.3%"></button>
      <button class="sth" data-o="amb" style="left:26.5%;top:91%;width:20.5%;height:6.3%"></button>
      <button class="sth" data-o="tm" style="left:49%;top:91%;width:11%;height:6.3%"></button>
      <button class="sth" data-o="wx" style="left:63.5%;top:91%;width:10%;height:6.3%"></button>
      <div id="stPop" hidden></div>
    </div>
    <div class="fzb"><button class="btn" id="stBack">Voltar</button><div class="stv" id="stVal"></div><button class="btn main" id="goFight">Lutar!</button></div>
    <div hidden>'''+keep+'''</div>
  '''+s[j:]
CSS="""
#stages.fz{padding:0;justify-content:flex-start;align-items:stretch;overflow:hidden;gap:0;background:#140802}
.stS{--H:calc(100vh - max(46px,13vh));--u:calc(var(--H) / 100);position:relative;width:100vw;height:var(--H);background:url(%s) center/100%% 100%%;flex:none;contain:layout paint}
#stGrid{position:absolute;inset:0;display:block}
#stGrid .stc{position:absolute;padding:0;border:0;background:transparent;clip-path:var(--cp);cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
#stGrid .stc img{width:100%%;height:100%%;object-fit:cover;display:block}
#stGrid .stc b{position:absolute;left:0;right:0;bottom:0;padding:2%% 4%% 3%%;font:italic 800 calc(var(--u)*1.9)/1.1 var(--f-ui);color:#fff;text-align:center;background:linear-gradient(0deg,rgba(0,0,0,.85),transparent);letter-spacing:.03em}
#stGrid .stc .q{display:grid;place-items:center;height:100%%;font:calc(var(--u)*7) var(--f-display);color:#ffd23f;background:#0a0b16}
#stGrid .stc .nw{position:absolute;top:6%%;right:6%%;font:800 calc(var(--u)*1.4)/1 var(--f-ui);background:#ff2d55;color:#fff;padding:2%% 4%%}
#stGrid .stc[aria-pressed=true]{outline:none;filter:brightness(1.15)}
#stGrid .stc[aria-pressed=true]::after{content:"";position:absolute;inset:0;box-shadow:inset 0 0 0 calc(var(--u)*.6) #ffd23f}
.sth{position:absolute;background:transparent;border:0;border-radius:8px;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
.sth:active,.sth.on{background:rgba(255,210,63,.18);box-shadow:0 0 0 2px #ffd23f inset}
#stPop{position:absolute;left:50%%;bottom:17%%;transform:translateX(-50%%);max-width:94%%;display:flex;flex-wrap:wrap;justify-content:center;gap:calc(var(--u)*1);padding:calc(var(--u)*1.6);background:rgba(20,8,2,.94);border:2px solid #ffb12e;border-radius:12px;box-shadow:0 0 30px rgba(255,140,30,.6)}
#stPop b{width:100%%;text-align:center;font:italic 800 calc(var(--u)*2.6) var(--f-ui);color:#ffd23f;letter-spacing:.08em}
#stPop button{font:800 calc(var(--u)*2.4) var(--f-ui);padding:calc(var(--u)*1) calc(var(--u)*2.2);border:1px solid rgba(255,255,255,.25);background:#2a1206;color:#fff;border-radius:8px;touch-action:manipulation}
#stPop button[aria-pressed=true]{background:#ffd23f;color:#1a0c00}
#stPop button.hz::after{content:" ●";color:#ff2d55}
.stv{flex:1;text-align:center;font:700 calc(var(--u)*2.3) var(--f-ui);color:#ffe7b0;letter-spacing:.05em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
/* leveza */
#select .tile.p1::after,#select .tile.p2::after,#select .tile.cur::before{animation:none!important}
.fzf img.full{animation:fzin .25s ease-out;will-change:auto}
"""%Z['bg']
s=s.replace("</style>",CSS+"</style>",1)
# render stages
i=s.index('function renderStages(){');j=s.index('\n$(\'goHow\')',i)
s=s[:i]+"""const STH="""+json.dumps(T['ST'])+""",STSL="""+json.dumps(Z['S'])+""";let stOpen=null;
function renderStages(){const g=$('stGrid');
  if(!g.children.length){[...Object.keys(STG),'auto'].forEach((k,n)=>{const b=document.createElement('button');b.className='stc';b.dataset.s=k;const q=STSL[n];if(q){b.style.left=q[0]+'%';b.style.top=q[1]+'%';b.style.width=q[2]+'%';b.style.height=q[3]+'%';b.style.setProperty('--cp',q[4])}
      b.innerHTML=k==='auto'?'<span class="q">?</span><b>Aleatório</b>':`<img src="${STH[k]}" alt="" decoding="async" loading="lazy"><b>${STG[k].name}</b>`+(STG[k].nw?'<span class="nw">NOVO</span>':'');
      b.onpointerdown=e=>{e.preventDefault();G.ssel=k;SFX.whoosh();renderStages()};g.appendChild(b)});
    document.querySelectorAll('.sth').forEach(h=>h.onpointerdown=e=>{e.preventDefault();stMenu(h.dataset.o)});}
  g.querySelectorAll('.stc').forEach(b=>b.setAttribute('aria-pressed',b.dataset.s===G.ssel?'true':'false'));stVal()}
function stLbl(sel){const b=document.querySelector(sel+' button[aria-pressed=true]');return b?b.textContent:''}
function stVal(){const v=$('stVal');if(!v)return;v.textContent='♪ '+stLbl('#msel')+'  ·  Ambiente: '+(G.noAmb?'Desligado':'Ligado')+'  ·  '+tmName()+'  ·  Clima: '+stLbl('#wsel')}
function stMenu(o){const p=$('stPop');document.querySelectorAll('.sth').forEach(h=>h.classList.toggle('on',h.dataset.o===o&&stOpen!==o));if(stOpen===o){p.hidden=true;stOpen=null;return}stOpen=o;p.innerHTML='';
  const add=(t,on,fn,cl)=>{const b=document.createElement('button');b.textContent=t;b.setAttribute('aria-pressed',on?'true':'false');if(cl)b.className=cl;b.onpointerdown=e=>{e.preventDefault();fn();SFX.whoosh&&SFX.whoosh();p.hidden=true;stOpen=null;document.querySelectorAll('.sth').forEach(h=>h.classList.remove('on'));stVal()};p.appendChild(b)};
  p.insertAdjacentHTML('beforeend','<b>'+({mus:'MÚSICA',amb:'SOM AMBIENTE',tm:'TEMPO DA LUTA',wx:'CLIMA'})[o]+'</b>');
  if(o==='mus')document.querySelectorAll('#msel button').forEach(x=>add(x.textContent,x.getAttribute('aria-pressed')==='true',()=>x.click()));
  if(o==='wx')document.querySelectorAll('#wsel button').forEach(x=>add(x.textContent,x.getAttribute('aria-pressed')==='true',()=>x.click(),x.className));
  if(o==='tm')TMV.forEach((v,i)=>add(TMN[i],G.tlim===v,()=>{G.tlim=v;try{localStorage.setItem('ft_time',v)}catch(e){}const tb=$('tmBtn');if(tb)tb.textContent=tmName()}));
  if(o==='amb'){add('Ligado',!G.noAmb,()=>{G.noAmb=0});add('Desligado',!!G.noAmb,()=>{G.noAmb=1})}
  p.hidden=false}"""+s[j:]
rep("const want=G.mode==='fight'&&!G.paused&&AU.on&&STAGE?AMBK[STAGE.key]:null;","const want=G.mode==='fight'&&!G.paused&&AU.on&&!G.noAmb&&STAGE?AMBK[STAGE.key]:null;")
# lighter character tiles: small thumbnails
rep("b.innerHTML='<span class=\"tw\">'+(ROS[id]?`<img src=\"${IMG[id].src}\" alt=\"${CH[id].name}\">`","b.innerHTML='<span class=\"tw\">'+(ROS[id]?`<img src=\"${PTH[id]||IMG[id].src}\" alt=\"${CH[id].name}\" decoding=\"async\">`")
rep("G.opp2='random';let selT='p',selCur=0;","G.opp2='random';let selT='p',selCur=0;const PTH="+json.dumps(T['PT'])+";")
open(P,'w').write(s)
i=s.index('<script>');j=s.rindex('</script>');open('/tmp/claude-0/-home-claude/84c7cfdc-56b6-51b4-bc59-f94c8c16eba0/scratchpad/s/chk.js','w').write(s[i+8:j]);print('ok')
