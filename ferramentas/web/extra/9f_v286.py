import sys
# v286: código ÚNICO de devolução (gacha do Shaka girada antes da hora): +2450 💎 e zera a piedade do Shaka (rk_pityS e rk_pitySS). Hash aqui, texto só com o dono.
P=sys.argv[1];s=open(P,encoding='utf8').read()
def rep(a,b):
    global s;assert s.count(a)==1,a;s=s.replace(a,b)
rep("'1ho2mzo':{nm:'PRESENTE DO ADM',dia:4},","'1ho2mzo':{nm:'PRESENTE DO ADM',dia:4},'1xpdic':{nm:'DEVOLUÇÃO DA INVOCAÇÃO DO SHAKA',gem:2450,uni:1,rz:['pityS','pitySS']},")
rep("used[h]=1;twLS.s('tw_cup',used);if(C.poc)","used[h]=1;twLS.s('tw_cup',used);if(C.rz){for(const k of C.rz)rkS(k,0);try{acSave(1)}catch(x){}}if(C.poc)")
open(P,'w',encoding='utf8').write(s);print('v286 ok')
