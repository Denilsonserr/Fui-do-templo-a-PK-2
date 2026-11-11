import sys
# v328: menus mais leves (tela inicial e telas do ranqueado). Ver GUIA.
P=sys.argv[1];s=open(P,encoding='utf8').read()
css='''
/* v328: desempenho — "mix-blend-mode" obriga o celular a misturar a tela inteira de novo a cada quadro; filtro e fundo animados redesenham tudo.
   Trocados por camadas simples que a placa de vídeo só move/apaga (transform/opacity). */
#mm *,#mm,.rk_menu *,.lb2 *,.mfx *,.mmfx2 *{mix-blend-mode:normal!important}
#mm .mSw,#mm .mmSpk,.mmfx2>*,.mfx>*,.rk_menu .sw,.rk_menu .gl,.lb2 .sw{will-change:transform,opacity}
#mRank{animation:none!important}
.mmfx2 .mWall{animation:none!important;opacity:0!important}
#mm .glow{opacity:.6}
body.lowfx .mmfx2 .mEmb,body.lowfx .mmfx2 .mStar,body.lowfx .mfx .mFf,body.lowfx .mfx .mGd,body.lowfx .mfx .fog,body.lowfx #mm .glow{display:none!important}
body.lowfx .rk_menu .mn2Q,body.lowfx .rk_menu .mn2R .gl{animation:none!important}
body.lowfx .lb2 .lbAs img{animation:none!important}
'''
js=r'''
/* v328: ao abrir o jogo a tela inicial não era marcada como atual, então a luta de fundo continuava sendo desenhada atrás do menu (pesava muito). */
if(!showScreen.cur)showScreen.cur=[...screens].find(id=>{const e=$(id);return e&&!e.hidden})||'title';
/* v328: aparelho fraco (até 4 núcleos ou até 3 GB) = menos enfeites nos menus; a luta não muda */
try{const hc=navigator.hardwareConcurrency||8,dm=navigator.deviceMemory||8;if(hc<=4||dm<=3)document.body.classList.add('lowfx')}catch(e){}
'''
i=s.index('</style>');s=s[:i]+css+s[i:]
a='resize();menuSetup();\nrequestAnimationFrame(loop);\n';assert s.count(a)==1;i=s.index(a)+len(a);s=s[:i]+js+s[i:]
open(P,'w',encoding='utf8').write(s);print('v328 desempenho ok')
