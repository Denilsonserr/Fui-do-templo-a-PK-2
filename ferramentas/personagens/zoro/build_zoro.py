# Montagem das poses novas do Zoro (v179). Uso: python3 build_zoro.py   (pasta com cut/zN_i.png)
# Escala: a postura de base (quadro 0 de cada folha) fica com ~225 unidades de altura (antes do sizeNorm do zr).
# Gera camada SO do efeito verde (fl) + pontos do efeito (fp) para animar o brilho da espada no jogo.
import json,numpy as np,os,hashlib,sys,time
sys.path.insert(0,'/home/claude/fui-do-templo-a-pk-2/ferramentas/ia');import esr
from PIL import Image
RES=2.4;OUT='out';os.makedirs(OUT,exist_ok=True);T0=time.time()
NF={'z1':6,'z2':6,'z3':6,'z4':20}
def body_mask(a):
    al=a[...,3]>140;g,r,b=a[...,1],a[...,0],a[...,2];return al&~((g>r+25)&(g>b+15))
def eff_mask(a):
    g,r,b=a[...,1],a[...,0],a[...,2];return (a[...,3]>10)&(g>r+25)&(g>b+15)
# altura de referencia por folha: corpo do quadro 0
S={}
for t in NF:
    a=np.asarray(Image.open(f'cut/{t}_0.png')).astype(int);ys=np.where(body_mask(a).any(1))[0];S[t]=225.0/(ys.max()-ys.min())
# chao por linha da folha: ponto mais baixo das botas (pixels escuros) entre os quadros da linha
def dark_low(t,i):
    a=np.asarray(Image.open(f'cut/{t}_{i}.png')).astype(int);y0=np.load(f'cut/{t}_{i}.y.npy')[0]
    d=(a[...,3]>160)&(a[...,:3].mean(2)<70);ys=np.where(d.any(1))[0];return y0+ys.max()
GROUND={}
for t,n in NF.items():
    per=n//2
    for row in (0,1):GROUND[(t,row)]=max(dark_low(t,i) for i in range(row*per,(row+1)*per))
def sv(arr):
    im=Image.fromarray(arr.clip(0,255).astype(np.uint8),'RGBA');h=hashlib.md5(im.tobytes()).hexdigest()[:14];p=f'{OUT}/{h}.webp'
    if not os.path.exists(p):im.save(p,'WEBP',quality=88,alpha_quality=90,method=6)
    return f'a/{h}.webp'
def frame(t,i):
    y0,y1,x0,x1=np.load(f'cut/{t}_{i}.y.npy');im=Image.open(f'cut/{t}_{i}.png');a=np.asarray(im).astype(int)
    B=body_mask(a);H=B.shape[0];ys=np.where(B.any(1))[0];top,bot=ys.min(),ys.max()
    # ancora x: meio do quadril (faixa 55-72% da altura do corpo)
    band=B[int(top+(bot-top)*.55):int(top+(bot-top)*.72)];xs=np.where(band.any(0))[0];ax=(np.median(np.where(band)[1]) if band.any() else B.shape[1]/2)
    row=0 if i<NF[t]//2 else 1;ay=GROUND[(t,row)]-y0
    k=S[t];gw,gh=im.width*k,im.height*k;W,Hh=round(gw*RES),round(gh*RES)
    o=esr.sr_rgba(im,2).resize((W,Hh),Image.LANCZOS);oa=np.asarray(o).astype(float)
    E=eff_mask(oa.astype(int));fl=oa.copy();fl[...,3]*=E;fl[...,3]=np.minimum(255,fl[...,3]*1.0)
    al=a[...,3]>40;cols=np.where(al.any(0))[0];rx=cols.max();ry=np.where(al[:,max(0,rx-4):rx+1].any(1))[0].mean()
    fr={'w':round(gw,1),'h':round(gh,1),'ax':round(ax*k,1),'ay':round(ay*k,1),'rx':round((rx-ax)*k),'ry':round((ay-ry)*k),'src':sv(oa)}
    if E.sum()>200:
        fr['fl']=sv(fl);ey,ex=np.where(eff_mask(a));sel=np.random.default_rng(i).choice(len(ex),min(40,len(ex)),replace=False)
        fr['fp']=[[round((ex[j]-ax)*k),round((ay-ey[j])*k)] for j in sel]
    print(t,i,round(time.time()-T0),flush=True);return fr
J={'c1':[frame('z1',i) for i in range(6)],'c2':[frame('z2',i) for i in range(6)],'dsh':[frame('z3',i) for i in range(6)],'cmb':[frame('z4',i) for i in range(20)]}
json.dump(J,open('zr_new.json','w'),separators=(',',':'));print('DONE',S,round(time.time()-T0))
