import sys
# v305: digitar o NOME (e códigos, senha, chat) — algumas letras não saíam: o teclado do jogo (WASD, J K L, I O U, F, P, espaço...)
# dava preventDefault em qualquer tela, até dentro das caixas de texto. Agora, digitando num campo de texto, o jogo não pega a tecla.
P=sys.argv[1];s=open(P,encoding='utf8').read()
def rep(a,b):
    global s;assert s.count(a)==1,a;s=s.replace(a,b)
rep("addEventListener('keydown',e=>{if(e.code==='KeyP'||e.code==='Escape'){","const isTyping=e=>{const t=e&&e.target;return !!t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.isContentEditable)};\naddEventListener('keydown',e=>{if(isTyping(e))return;if(e.code==='KeyP'||e.code==='Escape'){")
rep("addEventListener('keyup',e=>{if(KM[e.code])keys[KM[e.code]]=0});","addEventListener('keyup',e=>{if(isTyping(e))return;if(KM[e.code])keys[KM[e.code]]=0});")
rep("addEventListener('keydown',e=>{if(showScreen.cur!=='select')return;","addEventListener('keydown',e=>{if(showScreen.cur!=='select'||isTyping(e))return;")
open(P,'w',encoding='utf8').write(s);print('v305 ok')
