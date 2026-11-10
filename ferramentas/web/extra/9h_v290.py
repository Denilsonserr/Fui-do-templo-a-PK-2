import sys
# v290: celular dando ZOOM sozinho (dois toques rápidos / dois dedos nos botões). Trava o zoom da página: viewport sem zoom, touch-action na página toda e bloqueio do gesto de pinça (iPhone ignora o user-scalable).
P=sys.argv[1];s=open(P,encoding='utf8').read()
def rep(a,b):
    global s;assert s.count(a)==1,a;s=s.replace(a,b)
rep('<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">','<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">')
rep('</head>','<style>html,body{touch-action:manipulation;-ms-touch-action:manipulation;overscroll-behavior:none}</style>\n<script>(function(){const no=e=>{e.preventDefault()};for(const ev of ["gesturestart","gesturechange","gestureend"])document.addEventListener(ev,no,{passive:false});document.addEventListener("touchmove",e=>{if(e.scale!==undefined&&e.scale!==1)e.preventDefault()},{passive:false});document.addEventListener("dblclick",e=>{if(!/INPUT|TEXTAREA/.test(e.target.tagName))e.preventDefault()},{passive:false});document.addEventListener("wheel",e=>{if(e.ctrlKey)e.preventDefault()},{passive:false})})()</script>\n</head>')
open(P,'w',encoding='utf8').write(s);print('v290 ok')
