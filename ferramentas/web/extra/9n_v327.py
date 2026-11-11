import sys
# v327: TELA CHEIA no celular (Android e iPhone). Ver GUIA.
P=sys.argv[1];s=open(P,encoding='utf8').read()
def rep(a,b):
    global s
    assert s.count(a)==1,(a[:60],s.count(a));s=s.replace(a,b)
rep('<meta charset="utf-8">','''<meta charset="utf-8">
<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="Fúria">
<meta name="theme-color" content="#06050d"><link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" href="icone180.png">''')
# o jogo agora ocupa a tela inteira (antes deixava uma faixa embaixo no iPhone por causa da barrinha do home); os botões nas laterais continuam respeitando o entalhe (safeProbe)
rep('#stage{position:fixed;top:env(safe-area-inset-top,0px);bottom:env(safe-area-inset-bottom,0px);left:0;right:0;',
    '#stage{position:fixed;top:0;bottom:0;left:0;right:0;height:100vh;height:100dvh;')
rep('html,body{height:100%;background:var(--ink)','html,body{height:100%;min-height:100dvh;background:var(--ink)')
js=r'''
/* ================= v327: TELA CHEIA =================
   Android (navegador): entra em tela cheia no PRIMEIRO toque em qualquer lugar e volta para tela cheia no próximo toque se a pessoa sair (máx. 1 vez a cada 3 s).
   iPhone: o Safari não deixa site ficar em tela cheia — só "Adicionar à Tela de Início" (manifest + apple-mobile-web-app-capable). Aviso 1 vez por dia ensinando. */
const FS_IOS=/iPhone|iPod/.test(navigator.userAgent)||(/iPad|Macintosh/.test(navigator.userAgent)&&'ontouchend' in document),
  FS_APP=(()=>{try{return matchMedia('(display-mode: fullscreen)').matches||matchMedia('(display-mode: standalone)').matches||navigator.standalone===true||!!(window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform())}catch(e){return false}})();
let FS_T=0;
function fsAny(){if(FS_APP)return;const d=document.documentElement,rq=d.requestFullscreen||d.webkitRequestFullscreen;if(!rq||document.fullscreenElement||document.webkitFullscreenElement)return;if(Date.now()-FS_T<3000)return;FS_T=Date.now();
  try{const p=rq.call(d,{navigationUI:'hide'});const lk=()=>{try{screen.orientation.lock('landscape').catch(()=>{})}catch(e){}};if(p&&p.then)p.then(lk).catch(()=>{});else lk()}catch(e){}}
['pointerup','touchend','click'].forEach(ev=>document.addEventListener(ev,fsAny,{capture:true,passive:true}));
function fsFix(){try{window.scrollTo(0,0)}catch(e){};try{resize()}catch(e){}}
addEventListener('orientationchange',()=>setTimeout(fsFix,350));if(window.visualViewport)visualViewport.addEventListener('resize',()=>setTimeout(fsFix,60));
document.addEventListener('fullscreenchange',()=>setTimeout(fsFix,120));
function fsIosTip(){if(!FS_IOS||FS_APP)return;try{const k='fs_tip',d=new Date().toDateString();if(localStorage.getItem(k)===d)return;localStorage.setItem(k,d)}catch(e){}
  const b=document.createElement('div');b.id='fsTip';b.innerHTML='<b>📱 Jogar em TELA CHEIA no iPhone</b><span>Toque em <i>Compartilhar</i> <svg viewBox="0 0 24 24"><path d="M12 3v12M7 8l5-5 5 5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 12v8h14v-8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/></svg> e depois em <i>Adicionar à Tela de Início</i>. Abra o jogo pelo ícone novo: ele abre sem as barras do Safari.</span><button>ENTENDI</button>';
  document.body.appendChild(b);b.querySelector('button').onclick=()=>b.remove();setTimeout(()=>{try{b.remove()}catch(e){}},25000)}
setTimeout(fsIosTip,2500);
'''
css='''#fsTip{position:fixed;left:50%;bottom:max(10px,env(safe-area-inset-bottom));transform:translateX(-50%);z-index:9999;width:min(92vw,560px);display:flex;flex-direction:column;gap:6px;padding:12px 14px;border-radius:14px;background:rgba(14,8,30,.96);border:2px solid #d9a93a;box-shadow:0 0 20px rgba(217,169,58,.45);color:#fff;font:700 14px/1.3 "Saira Condensed",sans-serif;text-align:center}
#fsTip b{color:#ffd76a;font-size:16px}#fsTip i{color:#ffd76a;font-style:normal}#fsTip svg{width:16px;height:16px;vertical-align:-3px;color:#4aa3ff}#fsTip button{align-self:center;margin-top:4px;padding:6px 22px;border:0;border-radius:9px;background:linear-gradient(#ffcf55,#d58a12);color:#2a1600;font:900 14px "Saira Condensed",sans-serif}
'''
a='resize();menuSetup();\nrequestAnimationFrame(loop);\n';assert s.count(a)==1;i=s.index(a)+len(a);s=s[:i]+js+s[i:]
i=s.index('</style>');s=s[:i]+css+s[i:]
open(P,'w',encoding='utf8').write(s);print('v327 ok')
