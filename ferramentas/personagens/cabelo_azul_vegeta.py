import numpy as np,glob,shutil
from PIL import Image
from scipy import ndimage as nd
SRC='../vg/cut/';MAP={'v13':'r13','v19':'r19','v12':'r12','v23':'r23'}
def ramp(v):
    v=np.clip(v,0,1)[...,None];A=np.array([8,30,140.]);B=np.array([40,120,255.]);C=np.array([215,240,255.])
    return np.where(v<.55,A+(B-A)*(v/.55),B+(C-B)*((v-.55)/.45))
for s,d in MAP.items():
    for f in glob.glob(SRC+s+'_*.png'):
        i=f.split('_')[1][:-4];a=np.asarray(Image.open(f)).astype(float);rgb,al=a[...,:3],a[...,3]
        mx=rgb.max(2);sat=mx-rgb.min(2);dark=(mx<105)&(sat<45)&(al>100)
        op=nd.binary_opening(dark,iterations=2);lb,n=nd.label(op)
        if n==0:continue
        z=nd.sum(op,lb,range(1,n+1));big=z.max();keep=[q+1 for q in range(n) if z[q]>big*.25]
        m=np.isin(lb,keep);m=nd.binary_dilation(m,iterations=3)&(mx<150)&(sat<60)&(al>20)
        v=(mx/110.)**.9;new=ramp(v)
        sm=nd.gaussian_filter(m.astype(float),.7)[...,None]
        rgb=rgb*(1-sm)+new*sm
        Image.fromarray(np.dstack([rgb,al]).clip(0,255).astype(np.uint8),'RGBA').save(f'cut/{d}_{i}.png')
        shutil.copy(SRC+f'{s}_{i}.y.npy',f'cut/{d}_{i}.y.npy')
