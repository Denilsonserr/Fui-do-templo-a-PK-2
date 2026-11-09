import sys
# v249: item OBSCURO (Rika) nunca sai do equipamento: drop novo não troca, mochila cheia não descarta, não dá pra tirar/vender.
P=sys.argv[1];s=open(P,encoding='utf8').read()
def rep(a,b):
    global s;assert s.count(a)==1,(a[:80],s.count(a));s=s.replace(a,b)
rep("const Q=twEqp(),cur=I.find(x=>x.id===Q[E.k]);if(!cur||it.v>cur.v){","const Q=twEqp(),cur=I.find(x=>x.id===Q[E.k]);if(!cur||(!rkIsY(cur)&&it.v>cur.v)){")
rep("const w=L.slice().sort((a,b)=>(a.ev?99:0)+a.v-(b.ev?99:0)-b.v)[0];","const w=L.slice().sort((a,b)=>(a.ev?99:0)+(rkIsY(a)?1e6:0)+a.v-(b.ev?99:0)-(rkIsY(b)?1e6:0)-b.v)[0];")
rep("if(src==='eq')bt=`<button class=\"btn main\" data-a=\"eq\">EQUIPAR</button><button class=\"btn sell\" data-a=\"sell\">","if(src==='eq')bt=`<button class=\"btn main\" data-a=\"eq\">EQUIPAR</button><button class=\"btn sell\" data-a=\"sell\" ${rkLock(x)?'hidden':''}>")
rep("else if(src==='eqd')bt=`<button class=\"btn main\" data-a=\"tirar\">DESEQUIPAR</button>`;","else if(src==='eqd')bt=rkLock(x)?'<em>🌑 Item OBSCURO: fica sempre equipado</em>':`<button class=\"btn main\" data-a=\"tirar\">DESEQUIPAR</button>`;")
rep("if(a==='eq'){const Q=twEqp();Q[x.t]=x.id;","if(a==='eq'){const Q=twEqp();if(rkLock(twInv().find(y=>y.id===Q[x.t]))&&!rkLock(x)){twSfx('clang');twToast('🌑 Item OBSCURO fica sempre equipado','#c46bff');return}Q[x.t]=x.id;")
open(P,'w',encoding='utf8').write(s);print('v249 ok')
