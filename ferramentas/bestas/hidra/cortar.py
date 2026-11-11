# Hidra (besta da Caça): recorta as folhas do dono (fundo branco) em quadros transparentes -> quadros/*.png + info.json
import sys,os,json
D=os.path.dirname(os.path.abspath(__file__));sys.path.insert(0,D+'/../lobo')
import cortar as C
C.R=D+'/recebido/'
S={'parado':C.frames('03_parado.png',3,2,mg=80),'garras':C.frames('04_mordida.png',3,2,mg=220),'pulo':C.frames('05_pulo.png',3,2,mg=80),'cai':C.frames('06_ferido_morte.png',3,2,mg=80),
   'anda':C.frames('07_correndo.png',3,2,mg=80),'combo':C.frames('08_investida_24.png',6,4,mg=140),'patada':C.frames('09_rabada.png',4,2,mg=200),'furia':C.frames('10_furia.png',3,2,mg=220)}
info={}
for k,L in S.items():
    info[k]=[]
    for i,(im,m) in enumerate(L):im.save(D+f'/quadros/{k}{i}.png');info[k].append(m)
json.dump(info,open(D+'/info.json','w'),indent=1)
for k,v in info.items():print(k,[(m['bw'],m['bh']) for m in v])
