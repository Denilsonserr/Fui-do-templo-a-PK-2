import sys
# v293: luta TRAVADA / TELA PRETA em alguns celulares.
# 1) se der erro dentro do loop do jogo, o loop morria (requestAnimationFrame não era chamado de novo) e a luta congelava. Agora o loop continua.
# 2) vigia: se a luta está rodando e o loop ficou parado mais de 2 s com a tela visível, liga de novo.
# 3) canvas perdido pela placa de vídeo (contextlost) → tela preta: força redesenhar quando volta.
# 4) erros vão para o servidor (documento er_*, 1 por erro diferente por sessão) para eu ver o que aconteceu no celular da pessoa.
P=sys.argv[1];s=open(P,encoding='utf8').read()
def rep(a,b):
    global s;assert s.count(a)==1,a;s=s.replace(a,b)
rep("function loop(now){const sc=showScreen.cur;","let LOOPT=0,LOOPE=0;function loop(now){LOOPT=performance.now();try{loop0(now)}catch(e){LOOPE++;try{errRep(e,'loop')}catch(x){}requestAnimationFrame(loop)}}\nfunction loop0(now){const sc=showScreen.cur;")
rep("requestAnimationFrame(loop);\n","requestAnimationFrame(loop);\nsetInterval(()=>{if(document.hidden)return;if(performance.now()-LOOPT>2000){LOOPT=performance.now();requestAnimationFrame(loop)}},1000);\ntry{const cv=document.querySelector('canvas');if(cv){cv.addEventListener('contextlost',e=>{e.preventDefault()});cv.addEventListener('contextrestored',()=>{try{resize();render()}catch(x){}})}}catch(e){}\n")
rep("</head>","""<script>const ERRS={};function errRep(e,w){try{const m=String(e&&e.message||e).slice(0,200);if(ERRS[m]||Object.keys(ERRS).length>5)return;ERRS[m]=1;const st=String(e&&e.stack||'').slice(0,600);
  const G0=(typeof G!=='undefined'&&G)||{},F={m:{stringValue:m},st:{stringValue:st},w:{stringValue:String(w||'')},ua:{stringValue:navigator.userAgent.slice(0,160)},nome:{stringValue:String((localStorage.getItem('tw_nome')||'?')).slice(0,20)},
  modo:{stringValue:String(G0.mode||'')+'/'+String(G0.gmode||'')},t:{integerValue:String(Date.now())}};
  fetch('https://firestore.googleapis.com/v1/projects/'+TWFB.projectId+'/databases/(default)/documents/torre?documentId=er_'+Date.now().toString(36)+Math.random().toString(36).slice(2,6)+'&key='+TWFB.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:F})}).catch(()=>{})}catch(x){}}
window.addEventListener('error',e=>{try{errRep(e.error||e.message,'win')}catch(x){}});window.addEventListener('unhandledrejection',e=>{try{errRep(e.reason,'prom')}catch(x){}});</script>
</head>""")
rep('function startMatch(){','function startMatch(){G.hold=0;')
open(P,'w',encoding='utf8').write(s);print('v293 ok')
