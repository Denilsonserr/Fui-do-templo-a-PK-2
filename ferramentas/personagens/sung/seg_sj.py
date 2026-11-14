# Recorte das folhas do Sung (v421, copiado do seg_yt do Yuta). Fundos: transparente, branco/xadrez claro, preto, xadrez escuro.
# Uso (na pasta de trabalho): python3 seg_yt.py [tags...]  -> cut/<tag>_<i>.png + .y.npy
import numpy as np,os,sys
from PIL import Image
from scipy import ndimage as nd
from skimage.segmentation import watershed
SRC=os.path.join(os.path.dirname(os.path.abspath(__file__)),'poses')
F={'01': '01_andando_espada_ombro', '02': '02_pulo_espada_ombro', '03': '03_sacar_espada', '04': '04_guarda_espada', '05': '05_cortes_especiais', '06': '06_cortes_especiais_b', '07': '07_chute_efeito', '08': '08_chute', '09': '09_dash', '10': '10_tomando_golpe_caindo', '11': '11_correndo', '12': '12_defesa_agachado', '13': '13_correndo_espada', '14': '14_corte_cima', '15': '15_chute_b', '16': '16_rasteira', '17': '17_soco', '18': '18_pulo_espada'}
GRID={'01': (1, 6), '02': (1, 6), '03': (1, 6), '04': (1, 6), '05': (2, 3), '06': (2, 3), '07': (1, 6), '08': (1, 6), '09': (1, 6), '10': (1, 6), '11': (1, 6), '12': (1, 6), '13': (1, 5), '14': (1, 5), '15': (1, 5), '16': (1, 6), '17': (1, 6), '18': (1, 6)}
MODE={}
os.makedirs('cut',exist_ok=True)
def border_lab(bgish):
    lab,k=nd.label(bgish);border=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0};return np.isin(lab,list(border))
def alpha(tag):
    im=Image.open(os.path.join(SRC,F[tag]+'.png'));a=np.asarray(im.convert('RGBA')).astype(float);md=MODE.get(tag,'white')
    if md=='alpha':return a
    rgb=a[...,:3];mn=rgb.min(2);mx=rgb.max(2);sat=mx-mn;lum=rgb.mean(2)
    if md=='black':
        bg=border_lab(mx<=7)
        lab,k=nd.label((mx<=7)&~bg)
        if k:
            szs=nd.sum(np.ones_like(mx),lab,range(1,k+1));bg|=np.isin(lab,[i+1 for i in range(k) if szs[i]>300])
        al=np.where(bg,0.,1.)
        eff=(sat>35)&~bg;band=nd.binary_dilation(bg,iterations=2)&~bg
        al[eff]=np.clip(mx[eff]/190,0,1);al[band&~eff]=np.clip(mx[band&~eff]/60,0,1)
        safe=np.maximum(al,1e-3)[...,None];col=np.where((eff|band)[...,None],np.clip(rgb/safe,0,255),rgb);return np.dstack([col,al*255])
    if md=='cdark2':
        bg=border_lab((mx<=58)&(sat<=10));bg=nd.binary_opening(bg,iterations=1);al=np.where(bg,0.,1.)
        band=nd.binary_dilation(bg,iterations=2)&~bg;al[band]=np.clip((mx[band]-50)/120,0,1)
        eff=(sat>35)&~bg;al[eff]=np.maximum(al[eff],np.clip((mx[eff]-50)/150,0,1));return np.dstack([rgb,al*255])
    if md=='cdark':
        # xadrez escuro: o fundo bate com o padrão periódico estimado na borda de cima
        row=rgb[:12].mean(0).mean(0);per=None
        g=lum
        best=None
        for s in range(8,40):
            d=np.abs(g[:, :-2*s]-g[:,2*s:]);e=np.median(d[:20]);
            if best is None or e<best[0]:best=(e,s)
        s=best[1];
        ideal=np.zeros_like(g);H,W=g.shape;yy,xx=np.mgrid[0:H,0:W]
        # amostra a cor das duas casas na borda
        par=((yy//s)+(xx//s))%2
        c0=np.median(g[:10][par[:10]==0]);c1=np.median(g[:10][par[:10]==1])
        best2=None
        for oy in range(0,s,2):
            for ox in range(0,s,2):
                p=(((yy[:10]+oy)//s)+((xx[:10]+ox)//s))%2;e=np.abs(g[:10]-np.where(p==0,c0,c1)).mean()
                if best2 is None or e<best2[0]:best2=(e,oy,ox)
        _,oy,ox=best2;par=(((yy+oy)//s)+((xx+ox)//s))%2;ideal=np.where(par==0,c0,c1)
        bgish=(np.abs(g-ideal)<9)&(sat<16)
        bg=border_lab(bgish);bg=nd.binary_opening(bg,iterations=1)|(bg&nd.binary_erosion(bg,iterations=1))
        al=np.where(bg,0.,1.);eff=(sat>35)&~bg;al[eff]=np.clip((mx[eff]-40)/170,0,1)
        safe=np.maximum(al,1e-3)[...,None];col=np.where(eff[...,None],np.clip((rgb-(1-al[...,None])*ideal[...,None])/safe,0,255),rgb);return np.dstack([col,al*255])
    bgish=(mn>=226)&(sat<=16)
    bg=border_lab(bgish)
    # buracos fechados (ex.: entre a espada e a perna): só se forem branco puro e grandes
    lab,k=nd.label(bgish&~bg)
    if k and tag not in ('16','17'):
        szs=nd.sum(np.ones_like(mn),lab,range(1,k+1));mm=nd.mean(mn,lab,range(1,k+1))
        hole=[i+1 for i in range(k) if szs[i]>350 and mm[i]>=246]
        bg|=np.isin(lab,hole)
    al=np.where(bg,0.,1.)
    band=nd.binary_dilation(bg,iterations=3)&~bg
    A=np.clip(np.max((255-rgb)/255.,axis=-1),0,1)
    eff=(sat>45)&(lum>110)&(rgb[...,2]-rgb[...,1]>25)   # só brilho roxo/azul (pele fica opaca)
    sel=(band|eff)&~bg
    al[sel]=np.minimum(1,A[sel]*1.25)
    safe=np.maximum(al,1e-3)[...,None]
    col=np.where(sel[...,None],np.clip((rgb-(1-al[...,None])*255)/safe,0,255),rgb)
    return np.dstack([col,al*255])
def rows_of(al,nr):
    if nr==1:return [(0,al.shape[0])]
    rs=nd.uniform_filter1d((al>20).sum(1).astype(float),9);H=al.shape[0];lo,hi=int(H*.35),int(H*.65);ym=lo+int(np.argmin(rs[lo:hi]));return [(0,ym),(ym,H)]
def run(tag):
    nr,N=GRID[tag];a=alpha(tag);H,W=a.shape[:2]
    for ri,(y0,y1) in enumerate(rows_of(a[...,3],nr)):
        A=a[y0:y1];rgb=A[...,:3];al=A[...,3]/255.;m=al>.06;cw=W/N
        sat=rgb.max(2)-rgb.min(2);eff=(sat>60)&(al<.95)&(rgb[...,2]-rgb[...,1]>25)
        body=(al>.6)&~eff
        er=nd.binary_erosion(body,iterations=4);lab,k=nd.label(er);sz=nd.sum(er,lab,range(1,k+1));com=nd.center_of_mass(er,lab,range(1,k+1))
        mk=np.zeros(m.shape,np.int32)
        for c in range(N):
            cand=[i for i in range(k) if c*cw<=com[i][1]<(c+1)*cw]
            if not cand:
                S=np.zeros_like(m);S[:, int((c+.4)*cw):int((c+.6)*cw)]=True;S&=m
                if not S.any():print('VAZIO',tag,ri,c);continue
                mk[S]=c+1;continue
            i=max(cand,key=lambda q:sz[q]);mk[lab==i+1]=c+1
        lum=rgb.mean(2);cost=nd.gaussian_filter(255-lum,1.0)*(al>.5)+(al<=.5)*300
        ws=watershed(cost,mk,mask=m)
        col=np.clip((np.arange(W)//cw).astype(int),0,N-1)+1
        own=np.where(ws>0,ws,np.broadcast_to(col,(y1-y0,W)))*m
        for n in range(N):
            M=own==n+1
            lb,kk=nd.label(M)
            if kk==0:print('SEM',tag,ri,n);continue
            szs=nd.sum(M,lb,range(1,kk+1));cm=nd.center_of_mass(M,lb,range(1,kk+1));big=int(np.argmax(szs))
            keep=[i+1 for i in range(kk) if szs[i]>=max(60,szs.max()*.01) and (i==big or (n-.15)*cw<=cm[i][1]<=(n+1.15)*cw)]
            M=np.isin(lb,keep)
            ys,xs=np.where(M);Y0,Y1,X0,X1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
            o=np.dstack([rgb[Y0:Y1,X0:X1],(al*M)[Y0:Y1,X0:X1]*255]).clip(0,255).astype(np.uint8)
            idx=ri*N+n;Image.fromarray(o,'RGBA').save(f'cut/{tag}_{idx}.png');np.save(f'cut/{tag}_{idx}.y.npy',np.array([Y0+y0,Y1+y0,X0,X1]))
    print(tag,end=' ',flush=True)
for t in F:
    if len(sys.argv)>1 and t not in sys.argv[1:]:continue
    run(t)
print()
