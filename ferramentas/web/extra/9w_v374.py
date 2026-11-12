import sys
# v374: imagem que não carregou ("broken") no drawImage derrubava o quadro inteiro (erro mais comum dos jogadores). Agora é pulada.
P=sys.argv[1];s=open(P,encoding='utf8').read()
a="function blitD(im,S,e){const kU=e.kU||0,kH=e.kH||0;"
assert s.count(a)==1
s=s.replace(a,"function blitD(im,S,e){if(!im||(im.tagName==='IMG'&&(!im.complete||!im.naturalWidth)))return;const kU=e.kU||0,kH=e.kH||0;")
open(P,'w',encoding='utf8').write(s);print('v374 ok')
