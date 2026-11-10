import sys
# v295: (1) todo mundo começa no gráfico LEVE e na velocidade TURBO (1 vez só; depois cada um muda no ⚙️ e fica salvo)
#       (2) poção de CURA e regeneração também no modo Caça
P=sys.argv[1];s=open(P,encoding='utf8').read()
def rep(a,b):
    global s;assert s.count(a)==1,a;s=s.replace(a,b)
rep("try{G.hq=localStorage.getItem('ft_hq')!=='0';","try{if(!localStorage.getItem('ft_def295')){localStorage.setItem('ft_hq','0');localStorage.setItem('ft_4k','0');localStorage.setItem('ft_spd','2');localStorage.setItem('ft_def295','1')}}catch(e){}\ntry{G.hq=localStorage.getItem('ft_hq')!=='0';")
rep("if(G.gmode==='boss'||G.gmode==='torre'){rkCuraTick();psRegTick()}","if(G.gmode==='boss'||G.gmode==='torre'||G.gmode==='caca'){rkCuraTick();psRegTick()}")
open(P,'w',encoding='utf8').write(s);print('v295 ok')
