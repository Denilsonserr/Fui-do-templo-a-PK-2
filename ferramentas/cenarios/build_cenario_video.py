"""v126: cenário animado a partir de vídeo (leve), sem tocar o vídeo inteiro.
Entrada: vídeo do cenário + a imagem parada do cenário que já existe no jogo (mesma arte).
Saída (pasta out_<nome>/ + <nome>.json):
  - céu animado: só a faixa do céu, em resolução menor, 5 quadros/s (o jogo mistura um quadro no outro = movimento suave),
    sem as naves rápidas (mediana curta no tempo), com o que não é céu preenchido (para a parallax não mostrar "fantasma")
  - camadas paradas em alta qualidade (imagem original do jogo): mundo (sem o céu), e no Planeta Verde terra distante + chão
  - coisas que se mexem fora do céu (trem, naves, palmeiras): só os recortes, 12 quadros/s
  - repetição sem emenda: o fim do vídeo se mistura com o começo
Uso: python3 build_cenario_video.py <nome> <video.mp4> <imagem_do_jogo.webp> <horizonte_px> [corte_chao_px]"""
import cv2,numpy as np,sys,os,json,glob,subprocess,tempfile,io,hashlib
from PIL import Image
from scipy import ndimage as nd
name,video,base,hz=sys.argv[1],sys.argv[2],sys.argv[3],int(sys.argv[4]);floorcut=int(sys.argv[5]) if len(sys.argv)>5 else 0;skymax=int(sys.argv[6]) if len(sys.argv)>6 else 9999
OUT=f'out_{name}';os.makedirs(OUT,exist_ok=True)
SKY_G=.5;SKY_FPS=5;SKY_FADE=6;W_G=.75;W_FPS=12;W_FADE=12;PER=4;WPER=12
B=np.asarray(Image.open(base).convert('RGB'));H,W,_=B.shape
tmp=tempfile.mkdtemp();subprocess.run(['ffmpeg','-v','error','-i',video,'-vf','fps=24',f'{tmp}/f%04d.png'],check=True)
fs=sorted(glob.glob(f'{tmp}/f*.png'));V=[np.asarray(Image.open(f).convert('RGB')) for f in fs];print('quadros',len(V),flush=True)
# 1) alinhar vídeo com a imagem do jogo
g1=cv2.cvtColor(np.median(np.stack(V[::8]),0).astype(np.uint8),cv2.COLOR_RGB2GRAY);g2=cv2.cvtColor(B,cv2.COLOR_RGB2GRAY)
o=cv2.ORB_create(6000);k1,d1=o.detectAndCompute(g1,None);k2,d2=o.detectAndCompute(g2,None)
mt=cv2.BFMatcher(cv2.NORM_HAMMING,crossCheck=True).match(d1,d2)
M,_=cv2.estimateAffine2D(np.float32([k1[m.queryIdx].pt for m in mt]),np.float32([k2[m.trainIdx].pt for m in mt]),ransacReprojThreshold=2.5)
warp=lambda im,sc=1.0:cv2.warpAffine(im,M*sc,(round(W*sc),round(H*sc)),flags=cv2.INTER_AREA if sc<1 else cv2.INTER_LINEAR,borderMode=cv2.BORDER_REPLICATE)
# 2) máscara do céu
Ag=np.stack([cv2.warpAffine(cv2.cvtColor(v,cv2.COLOR_RGB2GRAY),M,(W,H)) for v in V[::6]]).astype(np.float32)
sd=nd.gaussian_filter(Ag.std(0),3);r,g,b=[B[...,i].astype(np.int16) for i in range(3)]
yy=np.arange(H)[:,None]*np.ones((1,W))
if name=='verde':col=(g>b+10)&(g>=r-5)&(g>120);cl=sd>18
else:col=(b>r+60)&(b>g+20)&(r<130);cl=(sd>12)&(r+g+b>470)&(b>=r-10)
sky=(col|cl)&(yy<hz);sky=nd.binary_opening(sky,iterations=2)
lab,n=nd.label(sky);sky=np.isin(lab,list(set(np.unique(lab[:3]))-{0}))
holes=nd.binary_fill_holes(sky)&~sky;l2,n2=nd.label(holes)
if n2:
    sz=nd.sum(holes,l2,range(1,n2+1));msd=nd.mean(sd,l2,range(1,n2+1));sky|=np.isin(l2,[i+1 for i in range(n2) if sz[i]<1500 or msd[i]>11])
sky&=(yy<skymax);skyE=nd.binary_erosion(sky,iterations=2)
skyrows=int(np.where(skyE.any(1))[0].max())+8;skyrows=min(skyrows,hz+8)
def save(im,q=82,key=''):
    bb=io.BytesIO();im.save(bb,'WEBP',quality=q,alpha_quality=88,method=5);d=bb.getvalue();h=hashlib.md5(d).hexdigest()[:14]
    open(f'{OUT}/{h}.webp','wb').write(d);return f'a/{h}.webp'
# 3) camadas paradas (arte original)
al=np.clip(nd.gaussian_filter((~skyE).astype(np.float32),.8),0,1)
if skymax<9999:al=np.maximum(al,np.clip((yy-(skymax-20))/20,0,1))
info={'W':W,'H':H,'skyH':skyrows}
if floorcut:
    f=24;ramp=np.clip((yy-(floorcut-f))/f,0,1)
    land=np.dstack([B,(al*np.clip(1-((yy-floorcut)/f),0,1)*255)]).astype(np.uint8)[:floorcut+f]
    info['land']=save(Image.fromarray(land,'RGBA'),88);info['landH']=floorcut+f
    fl=np.dstack([B,ramp*255]).astype(np.uint8)[floorcut-f:];info['floor']=save(Image.fromarray(fl,'RGBA'),88);info['floorY']=floorcut-f
else:
    info['world']=save(Image.fromarray(np.dstack([B,al*255]).astype(np.uint8),'RGBA'),88)
# 4) céu animado
gw,gh=round(W*SKY_G),round(skyrows*SKY_G);hole=cv2.resize(nd.binary_dilation(~sky,iterations=6).astype(np.uint8),(round(W*SKY_G),round(H*SKY_G)),interpolation=cv2.INTER_NEAREST)[:gh]
step=24/SKY_FPS;N=int(len(V)/step);frames=[]
for k in range(N):
    c=int(k*step);win=V[max(0,c-3):c+4];med=np.median(np.stack(win),0).astype(np.uint8)
    w=warp(med,SKY_G)[:gh];w=cv2.inpaint(w,hole,6,cv2.INPAINT_TELEA);frames.append(w.astype(np.float32))
L=SKY_FADE;loop=[]
for k in range(N-L):
    if k<L:a=k/L;loop.append(frames[N-L+k]*(1-a)+frames[k]*a)
    else:loop.append(frames[k])
atl=[]
for i in range(0,len(loop),PER):
    ch=loop[i:i+PER];atl.append(save(Image.fromarray(np.vstack(ch).clip(0,255).astype(np.uint8)),84))
info['sky']={'a':atl,'n':len(loop),'per':PER,'gw':gw,'gh':gh,'fps':SKY_FPS}
# céu parado (qualidade Leve / carregando)
st=cv2.inpaint(B[:skyrows].copy(),nd.binary_dilation(~sky[:skyrows],iterations=6).astype(np.uint8),6,cv2.INPAINT_TELEA)
info['skyS']=save(Image.fromarray(st),86)
# 5) coisas que se mexem fora do céu (só recortes)
Af=np.stack([cv2.warpAffine(cv2.cvtColor(v,cv2.COLOR_RGB2GRAY),M,(W,H)) for v in V[::2]]).astype(np.float32)
mv=nd.gaussian_filter((np.abs(np.diff(Af,axis=0))>40).mean(0),4)
lim=floorcut if floorcut else H
m=(mv>.02)&~nd.binary_dilation(sky,iterations=4)&(yy<lim);m=nd.binary_opening(m,iterations=2);m=nd.binary_dilation(m,iterations=8)
lab,n=nd.label(m);boxes=[]
for i in range(n):
    if nd.sum(m,lab,i+1)<600:continue
    ys,xs=np.where(lab==i+1);boxes.append([int(xs.min()),int(ys.min()),int(xs.max())+1,int(ys.max())+1])
if boxes:
    soft=nd.gaussian_filter(m.astype(np.float32),5)*m
    step=24/W_FPS;N=int(len(V)/step)
    bx=[];x=0;rh=0
    for (x0,y0,x1,y1) in boxes:
        w_=round((x1-x0)*W_G);h_=round((y1-y0)*W_G);bx.append([x0,y0,x1-x0,y1-y0,x,w_,h_]);x+=w_+2;rh=max(rh,h_)
    aw=x
    def row_of(k):
        f=cv2.warpAffine(V[int(k*step)],M,(W,H),flags=cv2.INTER_LINEAR);row=np.zeros((rh,aw,4),np.float32)
        for (x0,y0,ww,hh,ax,w_,h_) in bx:
            c=np.dstack([f[y0:y0+hh,x0:x0+ww].astype(np.float32),soft[y0:y0+hh,x0:x0+ww]*255])
            row[:h_,ax:ax+w_]=cv2.resize(c,(w_,h_),interpolation=cv2.INTER_AREA)
        return row
    rows=[]
    for k in range(N-W_FADE):
        if k<W_FADE:a=k/W_FADE;r_=row_of(N-W_FADE+k)*(1-a)+row_of(k)*a
        else:r_=row_of(k)
        rows.append(r_.clip(0,255).astype(np.uint8))
    wa=[]
    for i in range(0,len(rows),WPER):wa.append(save(Image.fromarray(np.vstack(rows[i:i+WPER]),'RGBA'),82))
    info['wanim']={'a':wa,'n':len(rows),'per':WPER,'rh':rh,'b':[[a,b_,c,d,e,f_,g_] for a,b_,c,d,e,f_,g_ in bx],'fps':W_FPS}
json.dump(info,open(f'{name}.json','w'))
tot=sum(os.path.getsize(f'{OUT}/{f}') for f in os.listdir(OUT))
mem=info['sky']['gw']*info['sky']['gh']*4*info['sky']['n']+(info['wanim']['rh']*sum(b[5]+2 for b in info['wanim']['b'])*4*info['wanim']['n'] if 'wanim' in info else 0)
print(name,'arquivos',len(os.listdir(OUT)),'tamanho',round(tot/1e6,1),'MB  memória animação',round(mem/1e6,1),'MB  caixas',len(boxes))
