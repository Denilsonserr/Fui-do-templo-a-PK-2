import sys
# v266: 74f1ed = 15.000 💎 uso ÚNICO (1 pessoa no jogo inteiro); 2qr7un = 500 a 1500 💎 aleatório, todo mundo pode usar 1 vez (ev:1, rnd). Texto só com o dono.
P=sys.argv[1];s=open(P,encoding='utf8').read()
def rep(a,b):
    global s;assert s.count(a)==1,a[:60];s=s.replace(a,b)
a="'1ho2mzo':{nm:'PRESENTE DO ADM',dia:4},"
rep(a,a+"'74f1ed':{nm:'15.000 DIAMANTES',gem:15000},'2qr7un':{nm:'DIAMANTES DA SORTE',ev:1,rnd:[500,1500]},")
rep("if(C.ev){rkAdd('gem',C.gem);","if(C.rnd){const g=C.rnd[0]+Math.floor(Math.random()*(C.rnd[1]-C.rnd[0]+1));rkAdd('gem',g);try{acSave(1)}catch(x){}E.className='twH ok';E.textContent='🎲 DIAMANTES DA SORTE! Você ganhou +'+g+' 💎 (de 500 a 1500)';twSfx('powerUp');if(g>=1200)setTimeout(()=>twSfx('boom'),300);return true}if(C.ev){rkAdd('gem',C.gem);")
open(P,'w',encoding='utf8').write(s);print('v266 ok')
