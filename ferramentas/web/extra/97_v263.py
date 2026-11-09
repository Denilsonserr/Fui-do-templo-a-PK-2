import sys
# v263: MODO PC (teclado e mouse). Esconde os botões de toque no PC, mostra a legenda das teclas, botão "Controles" na Configuração e na Pausa.
P=sys.argv[1];s=open(P,encoding='utf8').read()
def rep(a,b):
    global s;c=s.count(a);assert c==1,(a[:80],c);s=s.replace(a,b)
rep("$('controls').hidden=false;$('pauseBtn').hidden=false;layoutControls();","$('controls').hidden=pcOn();$('pauseBtn').hidden=false;layoutControls();")
rep('<div id="controls" hidden>','<div id="pcHud" hidden></div>\n  <div id="controls" hidden>')
rep('<button class="btn" id="goHow">Como jogar</button>','<button class="btn" id="goHow">Como jogar</button>\n      <button class="btn pcB" id="pcBtn">Controles: Automático</button>')
rep('<button class="btn" id="pHow">Como jogar</button>','<button class="btn" id="pHow">Como jogar</button><button class="btn pcB" id="pcBtn2">Controles: Automático</button>')
rep('<div class="keys">Teclado: setas/WASD · J soco · K chute · L ki · I especial · U transformar · O super · P pausa</div>','')
rep('<h2>Como jogar</h2>','<h2>Como jogar</h2>'+
'<div class="keys pcKeys"><b>⌨️ TECLADO E MOUSE (PC)</b><span><kbd>W A S D</kbd>/<kbd>setas</kbd> andar · <kbd>W</kbd>/<kbd>Espaço</kbd> pular (segure no ar = voar) · <kbd>S</kbd> agachar</span><span><kbd>J</kbd>/🖱️ esquerdo soco · <kbd>K</kbd>/🖱️ direito chute · <kbd>L</kbd> ki (toque = rajada, segure = carregar)</span><span><kbd>I</kbd>/<kbd>Q</kbd> especial · <kbd>O</kbd>/<kbd>R</kbd> super · <kbd>U</kbd>/<kbd>E</kbd> transformar · <kbd>F</kbd>/<kbd>G</kbd> voar · <kbd>Shift</kbd>/<kbd>H</kbd> defender · <kbd>T</kbd>/<kbd>Tab</kbd> trocar</span><span><kbd>Esc</kbd>/<kbd>P</kbd> pausa · <kbd>Esc</kbd> volta nos menus · <kbd>F1</kbd> mostra/esconde as teclas na luta</span></div>')
open(P,'w',encoding='utf8').write(s);print('v263 ok')
