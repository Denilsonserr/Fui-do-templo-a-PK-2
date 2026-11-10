import sys
# v289: 2 códigos do lançamento do Shaka, SÓ para quem tem CONTA, 1 vez por conta: diamantes aleatórios 1000-5000 e tickets aleatórios 10-30. Hash aqui, texto só com o dono.
P=sys.argv[1];s=open(P,encoding='utf8').read()
def rep(a,b):
    global s;assert s.count(a)==1,a;s=s.replace(a,b)
rep("'1ho2mzo':{nm:'PRESENTE DO ADM',dia:4},","'1ho2mzo':{nm:'PRESENTE DO ADM',dia:4},'1yu9fib':{nm:'DIAMANTES DO SHAKA',acc:1,rnd:[1000,5000]},'qb52ye':{nm:'TICKETS DO SHAKA',acc:1,rtic:[10,30]},")
# conta obrigatória + 1 vez por conta
rep("let dk='';if((C.ev||C.jn||C.bp)&&!C.uni){","let dk='';if(C.acc){const an=String(localStorage.getItem('ac_n')||'').toLowerCase().trim();if(!an||!localStorage.getItem('ac_k')){E.className='twH err';E.textContent='❌ Esse código é só para quem tem CONTA. Crie ou entre na sua conta (botão 👤) e tente de novo.';twSfx('clang');return true}dk='_a'+twHash(an)}else if((C.ev||C.jn||C.bp)&&!C.uni){")
rep("((C.dia||C.ev||C.jn||C.bp)&&!C.uni?","((C.dia||C.ev||C.jn||C.bp||C.acc)&&!C.uni?")
# tickets aleatórios + texto do sorteio de diamantes com a faixa certa
rep("if(C.rnd){const g=","if(C.rtic){const t=C.rtic[0]+Math.floor(Math.random()*(C.rtic[1]-C.rtic[0]+1));rkAdd('tic',t);try{acSave(1)}catch(x){}E.className='twH ok';E.textContent='🎫 '+C.nm+'! Você ganhou +'+t+' tickets de giro (de '+C.rtic[0]+' a '+C.rtic[1]+')';twSfx('powerUp');if(t>=25)setTimeout(()=>twSfx('boom'),300);return true}if(C.rnd){const g=")
rep("+g+' 💎 (de 500 a 1500)';","+g+' 💎 (de '+C.rnd[0]+' a '+C.rnd[1]+')';")
rep("if(g>=1200)setTimeout(","if(g>=C.rnd[1]*.8)setTimeout(")
open(P,'w',encoding='utf8').write(s);print('v289 ok')
