import sys
# v240: códigos do INFLUENCIADOR (hash 1p6oul2) e CAIXA DE GEMAS (hash 9zxei9) — textos só com o dono. 1 vez por CONTA (igual ao Presente do ADM).
# Baús raros, lendários e míticos não dão mais poção (só equipamento).
P=sys.argv[1];s=open(P,encoding='utf8').read()
def rep(a,b,n=1):
    global s;c=s.count(a);assert c==n,(a[:90],c);s=s.replace(a,b)
rep("'1ho2mzo':{nm:'PRESENTE DO ADM',dia:4},","'1ho2mzo':{nm:'PRESENTE DO ADM',dia:4},'1p6oul2':{nm:'PRESENTE DE INFLUENCIADOR',dia:5},'9zxei9':{nm:'CAIXA DE GEMAS',dia:6},")
rep("let dk='';if(C.dia===4){","let dk='';if(C.dia>=4){")
rep("if(Math.random()<.6)L.push({t:'poc',R:TWPOR[ri]});","if(Math.random()<.6&&!['rara','lend','mit'].includes(B.r))L.push({t:'poc',R:TWPOR[ri]});")
rep("if(Math.random()<.6){const R=twPoRoll();L.push({t:'poc',R})}","if(Math.random()<.6){const R=twPoRoll();if(['rara','lend','mit'].includes(R.k)){const E=TWEQ[(Math.random()*TWEQ.length)|0];L.push({t:E.k,E,R:TWEQR.find(q=>q.k===R.k)})}else L.push({t:'poc',R})}")
rep("TWTIT[k].yt?' ytt y'+","TWTIT[k].inf?' inf':TWTIT[k].yt?' ytt y'+")
open(P,'w',encoding='utf8').write(s);print('v240 ok')
