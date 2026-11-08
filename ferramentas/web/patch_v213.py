import sys,json
# v213: MODO RANQUEADO + novo menu principal. Fontes: ferramentas/web/ranqueada/rk.js e rk.css; artes: /home/claude/rk_build/rk_assets.json (copiar rk_build/out/* para www/a)
P=sys.argv[1];s=open(P).read();D='/home/claude/fui-do-templo-a-pk-2/ferramentas/web/ranqueada/'
RKA=json.load(open('/home/claude/rk_build/rk_assets.json'))
def rep(a,b,n=1):
    global s;c=s.count(a);assert c==n,(a[:80],c);s=s.replace(a,b)
js=open(D+'rk.js').read().replace('__RKA__',json.dumps({k:v for k,v in RKA.items() if not k.endswith('_wh')},separators=(',',':')))
rep("function twTrofList(){",js+"\nfunction twTrofList(){")
css=open(D+'rk.css').read()
rep("\n.twBag .bgw{",css+"\n.twBag .bgw{")
# tela nova
rep("const screens=['title','config','modes','select','stages','how','pause','result','vs','tower'];","const screens=['title','config','modes','select','stages','how','pause','result','vs','tower','ranked'];")
rep('<section id="tower" class="screen" hidden></section>','<section id="tower" class="screen" hidden></section>\n  <section id="ranked" class="screen" hidden><div id="rkWrap"></div><div id="rkModal" hidden></div></section>')
# ---- menu principal novo (arte do dono) ----
rep("const MM='a/031bb78fb910a0.webp';","const MM='"+RKA['menu_principal']+"';")
rep('<button class="mb mb5" id="mCfg"','<button class="mb mb6" id="mRank" aria-label="Modo Ranqueado"><span class="shine"></span></button>\n      <button class="mb mb5" id="mCfg"')
rep("$('mCfg').onclick=","$('mRank').onclick=()=>{if(!SPR_OK)return;SFX.whoosh();rkOpen('menu')};$('mCfg').onclick=")
rep("#mm{position:absolute;left:50%;top:0;transform:translateX(-50%);width:max(100vw,calc(100vh*1.7769));aspect-ratio:1672/941;max-width:calc(100vh*2.4);",
    "#mm{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(100vw,calc(100vh*2.1704));aspect-ratio:1847/851;")
rep(".mb1{top:15.7%;width:28.2%;height:8.3%;animation-delay:.35s}",".mb1{top:18.2%;width:24.9%;height:7.2%;animation-delay:.35s}")
rep(".mb2{top:24.5%;width:26.6%;height:6.8%;animation-delay:.45s}",".mb2{top:26.5%;width:24.9%;height:7.3%;animation-delay:.45s}")
rep(".mb3{top:31.9%;width:26.6%;height:6.8%;animation-delay:.55s}",".mb3{top:34.9%;width:24.9%;height:7.1%;animation-delay:.55s}")
rep(".mb4{top:39.1%;width:26.6%;height:6.8%;animation-delay:.65s}",".mb4{top:51.7%;width:24.9%;height:7.1%;animation-delay:.75s}\n.mb6{top:43.2%;width:24.9%;height:7.3%;animation-delay:.65s}\n.mb6::after{content:\"\";position:absolute;inset:0;box-shadow:inset 0 0 2cqw rgba(190,90,255,.55);animation:gp 1.6s ease-in-out infinite alternate}")
rep(".mb5{top:46.3%;width:26.6%;height:6.8%;animation-delay:.75s}",".mb5{top:59.9%;width:24.9%;height:7.3%;animation-delay:.85s}\n#mm .glow{display:none}.mb .lock{display:none}.mb.lk{background:transparent}\n#mmbg{filter:brightness(.35) saturate(1.2) blur(6px)}")
# ---- luta do Modo Boss ----
rep("function startMatch(){musPick();MAXHP=LAYER*(G.gmode==='torre'?2:(G.lives||2));","function startMatch(){musPick();MAXHP=LAYER*(G.gmode==='torre'?2:G.gmode==='boss'?4:(G.lives||2));")
rep("twApply();twAdmBuff();","twApply();twAdmBuff();rkApply();")
rep("G.phase='fight';twBossGo()","G.phase='fight';twBossGo();rkBossGo()")
rep("if(TW.on&&G.gmode==='torre')twTick();if(G.gmode==='treino')","if(TW.on&&G.gmode==='torre')twTick();if(G.gmode==='boss')rkTick();if(G.gmode==='treino')")
rep("function ko(a,d){if(G.phase!=='fight')return;","function ko(a,d){if(G.phase!=='fight')return;\n  if(G.gmode==='boss'&&d===G.p[1]&&d.rkPh===1){rkPhase2(a,d);return}\n  if((G.gmode==='boss'||(TW.on&&G.gmode==='torre'))&&d===G.p[0]&&rkSenzuRevive(d))return;")
rep("function endRound(){\n  const w=G.koWinner;","function endRound(){\n  const w=G.koWinner;if(G.gmode==='boss'){rkAfter(w);return}")
rep("G.ring={title:(TW.on&&G.gmode==='torre')?","G.ring={title:G.gmode==='boss'?'MODO BOSS · BROLY':(TW.on&&G.gmode==='torre')?")
rep("$('toMenu').onclick=()=>{","$('toMenu').onclick=()=>{if(G.gmode==='boss'){G.diff=RKB.diff0;G.gmode='pve'}")
# ---- equipamentos especiais: dano extra e crítico de qualquer peça ----
rep("if(st==='vel'&&o[E.k].vel)v+=o[E.k].vel}return v};","if(st==='vel'&&o[E.k].vel)v+=o[E.k].vel;if(st==='dano'&&o[E.k].dmg)v+=o[E.k].dmg}return v};")
rep("{const c=twEqOn().cap;p.tcr=c&&c.crit||0}","{const o=twEqOn();p.tcr=0;for(const k in o)p.tcr+=o[k].crit||0}")
rep("ef=x=>x.t==='cap'?","ef=x=>x.img&&(x.crit||x.dmg)?rkSpTxt(x)+' (permanente)':x.t==='cap'?")
# ---- títulos de rank com brilho e emblema ----
rep("k&&TWTIT[k]?`<em class=\"twTit\" style=\"--c:${TWTIT[k].c}\">","k&&TWTIT[k]&&TWTIT[k].rk!=null?`<em class=\"twTit rkt\" style=\"--c:${TWTIT[k].c}\"><img src=\"${RQA.rank[TWTIT[k].rk]}\" alt=\"\"><b>${TWTIT[k].n}</b></em>`:k&&TWTIT[k]?`<em class=\"twTit\" style=\"--c:${TWTIT[k].c}\">")
open(P,'w').write(s);print('ok',len(s))
