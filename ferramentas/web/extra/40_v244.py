import sys
# v244: código ADM 4000 💎 (hash ufmb0o, uso único no jogo inteiro, texto só com o dono) + etiqueta ADM com a arte nova nos rankings/chat
P=sys.argv[1];s=open(P,encoding='utf8').read()
def rep(a,b,n=1):
    global s;c=s.count(a);assert c==n,(a[:90],c);s=s.replace(a,b)
rep("'1ho2mzo':{nm:'PRESENTE DO ADM',dia:4},","'1ho2mzo':{nm:'PRESENTE DO ADM',dia:4},'ufmb0o':{nm:'4000 DIAMANTES (ADM)',gem:4000},")
rep("k==='adm'?'<em class=\"twTit adm\"><i>👑</i><b>ADM</b></em>'","k==='adm'?'<em class=\"twTit admI\"><img src=\"'+RQA.tit_adm+'\" alt=\"ADM\"></em>'")
open(P,'w',encoding='utf8').write(s);print('v244 ok')
