import sys
# v204: recorde antigo "Denilson_DW adm" vira "Denilson ADM" (mesmo jogador); ADM: +15% dano, sorte nas passivas (30%) e nos baús (15%)
P=sys.argv[1];s=open(P).read()
def rep(a,b,n=1):
    global s;c=s.count(a);assert c==n,(a[:80],c);s=s.replace(a,b)
# apelidos: nomes antigos do dono contam como Denilson ADM (não dá para apagar no Firestore; aqui junta os recordes)
rep("const twIsAdm=()=>twTits().includes('adm');","const twIsAdm=()=>twTits().includes('adm');const TWALIAS={'denilson_dw adm':'Denilson ADM'};const twAl=n=>TWALIAS[String(n).toLowerCase().trim()]||n;")
rep("out.push({nome:String(g('nome')||'?').slice(0,16)","out.push({nome:twAl(String(g('nome')||'?').slice(0,16))",2)
rep("const nome=String(g('nome')||'?').slice(0,16),a=+g('andar')","const nome=twAl(String(g('nome')||'?').slice(0,16)),a=+g('andar')")
# bônus escondido do ADM
rep("p.tdm=(p.tdm||1)*1.1;","p.tdm=(p.tdm||1)*1.15;")
rep("function twRoll(){","function twRoll(){const R=twRoll0();if(twIsAdm()&&Math.random()<.3){const B=twRoll0();return TWRAR.indexOf(B)>TWRAR.indexOf(R)?B:R}return R}\nfunction twRoll0(){")
rep("function twEqRoll(){","function twEqRoll(){const R=twEqRoll0();if(twIsAdm()&&Math.random()<.15){const B=twEqRoll0();return TWEQR.indexOf(B)>TWEQR.indexOf(R)?B:R}return R}\nfunction twEqRoll0(){")
rep("function twPoRoll(){","function twPoRoll(){const R=twPoRoll0();if(twIsAdm()&&Math.random()<.15){const B=twPoRoll0();return TWPOR.indexOf(B)>TWPOR.indexOf(R)?B:R}return R}\nfunction twPoRoll0(){")
open(P,'w').write(s);print('ok')
