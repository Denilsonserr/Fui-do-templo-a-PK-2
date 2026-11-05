"""v140: cenário NOVO feito só a partir de um vídeo (sem imagem parada do jogo).
- imagem parada = começo do vídeo, limpa (mediana de 5 quadros) e aumentada com IA (Real-ESRGAN) para W de largura
- céu animado (opcional, ceu_px>0): faixa de cima, 5 q/s, metade da resolução, misturando quadros, SEM parallax (alinhado com o mundo: VSTG.noPar)
  só onde o vídeo mexe dentro da faixa (nuvens) o mundo fica transparente
- recortes que se mexem fora do céu (bandeiras, árvores...): fps e duração do loop limitados para economizar memória
Uso: python3 build_cenario_novo.py <nome> <video.mp4> <ceu_px (0 = sem céu)> [fps_recortes=10] [seg_loop=6] [escala_recortes=.7]
Saída: out_<nome>/ (webp com nome = md5) + <nome>.json (+ <nome>_thumb.webp 360x225)"""
import cv2,numpy as np,sys,os,json,io,hashlib,subprocess,tempfile,glob
from PIL import Image
from scipy import ndimage as nd
sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','ia'));import esr
name,video,skyH=sys.argv[1],sys.argv[2],int(sys.argv[3]);W_FPS=float(sys.argv[4]) if len(sys.argv)>4 else 10;LOOP=float(sys.argv[5]) if len(sys.argv)>5 else 6
OUT=f'out_{name}';os.makedirs(OUT,exist_ok=True)
W=2172;SKY_G=.5;SKY_FPS=5;SKY_FADE=6;W_G=float(sys.argv[6]) if len(sys.argv)>6 else .7;W_FADE=8;PER=4;WPER=10
tmp=tempfile.mkdtemp();subprocess.run(['ffmpeg','-v','error','-i',video,'-vf','fps=24',f'{tmp}/f%04d.png'],check=True)
fs=sorted(glob.glob(f'{tmp}/f*.png'));V0=[np.asarray(Image.open(f).convert('RGB')) for f in fs]
h0,w0,_=V0[0].shape;H=round(W*h0/w0);print(name,'quadros',len(V0),w0,h0,'->',W,H,flush=True)
def save(im,q=84):
    bb=io.BytesIO();im.save(bb,'WEBP',quality=q,alpha_quality=88,method=5);d=bb.getvalue();h=hashlib.md5(d).hexdigest()[:14]
    open(f'{OUT}/{h}.webp','wb').write(d);return f'a/{h}.webp'
# 1) imagem parada em alta qualidade
base=np.median(np.stack(V0[:5]),0).astype(np.uint8)
B=np.asarray(esr.sr_rgba(Image.fromarray(base).convert('RGBA'),2).convert('RGB').resize((W,H),Image.LANCZOS))
V=[cv2.resize(v,(W,H),interpolation=cv2.INTER_CUBIC) for v in V0]
# 2) o que se mexe
Ag=np.stack([cv2.cvtColor(v,cv2.COLOR_RGB2GRAY) for v in V[::2]]).astype(np.float32)
mv=nd.gaussian_filter((np.abs(np.diff(Ag,axis=0))>25).mean(0),4);yy=np.arange(H)[:,None]*np.ones((1,W))
info={'W':W,'H':H,'noPar':1}
skyM=np.zeros((H,W),bool)
if skyH>0:
    skyM=nd.binary_dilation((mv>.015)&(yy<skyH),iterations=10)&(yy<skyH)
    soft=np.clip(nd.gaussian_filter(skyM.astype(np.float32),6)*1.6,0,1)*np.clip((skyH-yy)/12,0,1)
    info['world']=save(Image.fromarray(np.dstack([B,(1-soft)*255]).astype(np.uint8),'RGBA'),88)
    info['skyH']=skyH;gw,gh=round(W*SKY_G),round(skyH*SKY_G)
    step=24/SKY_FPS;N=int(min(len(V),LOOP*24*1.6)/step);fr=[]
    for k in range(N):
        c=int(k*step);med=np.median(np.stack(V[max(0,c-1):c+2]),0).astype(np.uint8)
        fr.append(cv2.resize(med[:skyH],(gw,gh),interpolation=cv2.INTER_AREA).astype(np.float32))
    L=SKY_FADE;loop=[fr[N-L+k]*(1-k/L)+fr[k]*(k/L) if k<L else fr[k] for k in range(N-L)]
    info['sky']={'a':[save(Image.fromarray(np.vstack(loop[i:i+PER]).clip(0,255).astype(np.uint8)),84) for i in range(0,len(loop),PER)],'n':len(loop),'per':PER,'gw':gw,'gh':gh,'fps':SKY_FPS}
    info['skyS']=save(Image.fromarray(B[:skyH]),86)
else:
    info['world']=save(Image.fromarray(B),88);info['skyH']=0
# 3) recortes que se mexem (fora do céu)
m=(mv>.02)&~nd.binary_dilation(skyM,iterations=4);m=nd.binary_opening(m,iterations=2);m=nd.binary_dilation(m,iterations=8)
lab,n=nd.label(m);boxes=[]
for i in range(n):
    if nd.sum(m,lab,i+1)<900:continue
    ys,xs=np.where(lab==i+1);boxes.append([int(xs.min()),int(ys.min()),int(xs.max())+1,int(ys.max())+1])
if boxes:
    soft=nd.gaussian_filter(m.astype(np.float32),5)*m
    step=24/W_FPS;N=int(min(len(V),LOOP*24+W_FADE*step)/step)
    bx=[];x=0;rh=0
    for (x0,y0,x1,y1) in boxes:
        w_=round((x1-x0)*W_G);h_=round((y1-y0)*W_G);bx.append([x0,y0,x1-x0,y1-y0,x,w_,h_]);x+=w_+2;rh=max(rh,h_)
    aw=x
    def row_of(k):
        f=V[int(k*step)];row=np.zeros((rh,aw,4),np.float32)
        for (x0,y0,ww,hh,ax,w_,h_) in bx:
            c=np.dstack([f[y0:y0+hh,x0:x0+ww].astype(np.float32),soft[y0:y0+hh,x0:x0+ww]*255])
            row[:h_,ax:ax+w_]=cv2.resize(c,(w_,h_),interpolation=cv2.INTER_AREA)
        return row
    rows=[]
    for k in range(N-W_FADE):
        r_=row_of(N-W_FADE+k)*(1-k/W_FADE)+row_of(k)*(k/W_FADE) if k<W_FADE else row_of(k)
        rows.append(r_.clip(0,255).astype(np.uint8))
    info['wanim']={'a':[save(Image.fromarray(np.vstack(rows[i:i+WPER]),'RGBA'),82) for i in range(0,len(rows),WPER)],'n':len(rows),'per':WPER,'rh':rh,'b':bx,'fps':W_FPS}
# miniatura para a tela de fases
th=Image.fromarray(B);tw,thh=360,225;sc=thh/H;th=th.resize((round(W*sc),thh),Image.LANCZOS);l=(th.width-tw)//2;th.crop((l,0,l+tw,thh)).save(f'{name}_thumb.webp','WEBP',quality=85)
json.dump(info,open(f'{name}.json','w'))
tot=sum(os.path.getsize(f'{OUT}/{f}') for f in os.listdir(OUT))
mem=(info['sky']['gw']*info['sky']['gh']*4*info['sky']['n'] if 'sky' in info else 0)+(info['wanim']['rh']*sum(b[5]+2 for b in info['wanim']['b'])*4*info['wanim']['n'] if 'wanim' in info else 0)
print(name,'arquivos',len(os.listdir(OUT)),'tamanho',round(tot/1e6,1),'MB  memória animação',round(mem/1e6,1),'MB  caixas',len(boxes),flush=True)
