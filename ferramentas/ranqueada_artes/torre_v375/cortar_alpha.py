# v375: recorta peças das folhas que já vêm com transparência (objetos, portão, orbes) por caixas medidas à mão
import numpy as np,os
from PIL import Image
D=os.path.dirname(os.path.abspath(__file__))
def cut(src,boxes,thr=12):
    a=np.array(Image.open(D+'/recebido/'+src).convert('RGBA'))
    for nm,(x0,y0,x1,y1) in boxes.items():
        c=a[y0:y1,x0:x1].copy();m=c[...,3]>thr;ys,xs=np.where(m);c=c[ys.min():ys.max()+1,xs.min():xs.max()+1]
        c[...,3]=np.clip(c[...,3].astype(int)*255//max(1,int(c[...,3].max())),0,255).astype(np.uint8)
        Image.fromarray(c).save(f'{D}/sp/{nm}.png');print(nm,c.shape[1],c.shape[0])
cut('objetos.png',{'rocha_g':(10,25,392,380),'rocha_m':(392,90,692,380),'rocha_p':(695,150,925,380),'tronco':(925,120,1385,380),'tronco_q':(1385,120,1765,380),
  'tocha':(150,385,500,870),'caixa':(600,450,985,870),'caixa_q':(1040,470,1625,870)})
cut('portao.png',{'portao_f':(20,0,885,560),'portao_a':(890,0,1750,560),'alavanca_c':(260,580,565,840),'alavanca_b':(900,650,1350,840)})
cut('orbes.png',{'orbe_vermelho':(0,0,724,724),'orbe_verde':(724,0,1448,724),'orbe_azul':(1448,0,2172,724)},thr=30)
