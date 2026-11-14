# v431: URSO DE SOMBRA (TANK) do Sung + vídeo da transformação. Uso: (na pasta work/, depois do seg_urso.py) python3 ../build_urso.py
# Saída: www/a/*.webp + build/urso.json {f:{anim:[{s,w,h,ax,ay}]}, v:[quadros do vídeo 640x360]}. Unidades do jogo; desenhado no rk.js (bloco v431).
import json,numpy as np,os,hashlib,subprocess,tempfile,glob
from PIL import Image
D=os.path.dirname(os.path.abspath(__file__));OUT=os.path.join(D,'..','..','..','..','www','a');os.makedirs(os.path.join(D,'build'),exist_ok=True)
RES=1.6
# altura no jogo do 1º quadro de cada folha (o urso fica maior que o Sung: Sung ~290)
H0={'01':420,'02':365,'03':360,'04':372,'05':330,'06':372}
REF={'01':15}  # a folha 01 usa o último quadro (urso em pé) como referência
N={'01':16,'02':4,'03':4,'04':4,'05':6,'06':6}
def sv(im,q=86):
    h=hashlib.md5(im.tobytes()).hexdigest()[:14];p=f'{OUT}/{h}.webp'
    if not os.path.exists(p):im.save(p,'WEBP',quality=q,alpha_quality=88,method=6)
    return 'a/'+h+'.webp'
def fr(t,i):
    im=Image.open(f'cut/{t}_{i}.png');a=np.asarray(im)[...,3]>120;ri=REF.get(t,0)
    y=np.load(f'cut/{t}_{ri}.y.npy');k=H0[t]/(y[1]-y[0]);ys,xs=np.where(a);bot=ys.max()
    band=a[max(0,bot-int(a.shape[0]*.12)):bot+1];bx=np.median(np.where(band)[1]) if t not in('06',) or i<3 else xs.mean()
    w,h=im.size;o=im.resize((max(1,round(w*k*RES)),max(1,round(h*k*RES))),Image.LANCZOS)
    return {'s':sv(o),'w':round(w*k,1),'h':round(h*k,1),'ax':round(bx*k,1),'ay':round(bot*k,1)}
A={'rise':[fr('01',i) for i in range(16)],'punch':[fr('02',i) for i in range(4)],'kick':[fr('03',i) for i in range(4)],'block':[fr('04',i) for i in range(4)],
   'claw':[fr('05',i) for i in range(3)],'claw2':[fr('05',i) for i in range(3,6)],'die':[fr('06',i) for i in range(6)]}
def vid(fn,fps):
    T=tempfile.mkdtemp();subprocess.run(['ffmpeg','-v','error','-i',os.path.join(D,fn),'-vf',f'fps={fps},scale=640:360:flags=lanczos',f'{T}/v_%03d.png'],check=True)
    return [sv(Image.open(f).convert('RGB'),76) for f in sorted(glob.glob(f'{T}/v_*.png'))]
V=vid('invocacao_tank.mp4',8)        # v: vídeo da ULTIMATE (invoca o TANK), tocado acelerado
TV=vid('transformacao_sung.mp4',10)  # t: vídeo da TRANSFORMAÇÃO (v434)
json.dump({'f':A,'v':V,'t':TV},open(os.path.join(D,'build','urso.json'),'w'),separators=(',',':'))
tot=sum(os.path.getsize(os.path.join(OUT,os.path.basename(x['s']))) for L in A.values() for x in L);tv=sum(os.path.getsize(os.path.join(OUT,os.path.basename(x))) for x in V)
print('transf',len(TV));print('urso',sum(len(L) for L in A.values()),'quadros',tot//1024,'KB · vídeo',len(V),'quadros',tv//1024,'KB')
