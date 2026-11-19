# v555: corta as folhas do BERU (formiga preta, chefe da Raid das Formigas) e das FORMIGAS (vermelha/branca)
# + gera a versão SOMBRA do Beru ("bes_*": roxo-azulado brilhante, igual ao estilo das sombras). Junta no npc.json.
import os,json,hashlib,numpy as np
from PIL import Image
from scipy import ndimage
D=os.path.dirname(os.path.abspath(__file__));R=os.path.join(D,'../../..')
exec(open(os.path.join(D,'cortar.py')).read().split('def splits')[0].split('ALT=')[0].split('FL=')[0])  # imports
src=open(os.path.join(D,'cortar.py')).read()
exec('def alpha'+src.split('def alpha')[1].split('out={}')[0])   # alpha + splits
FL={'be_anda':(1,5),'be_corre':(1,5),'be_soco':(1,5),'be_chute':(1,5),'be_guarda':(1,5),'be_morte':(1,5),'be_ergue':(1,5),'be_combo':(2,8),
    'fv_anda':(1,5),'fv_corre':(1,5),'fv_golpe':(3,[5,4,4]),'fv_morte':(1,6),
    'fb_anda':(1,5),'fb_corre':(1,5),'fb_golpe':(1,6),'fb_morte':(1,6)}
ALT={'be':390,'fv':235,'fb':205}
POSE={'be_corre':.80,'be_soco':.97,'be_chute':.95,'be_combo':1.0,'fv_golpe':1.0,'fb_corre':.98}
REF={'be_ergue':-1}  # quadro em pé usado para medir a escala
def rows_of(A,nr):
  H=A.shape[0];rp=(A>40).sum(1);cuts=[0]
  for k in range(1,nr):
    m=H*k//nr;w=int(H*.1);cuts.append(m-w+int(np.argmin(rp[m-w:m+w])))
  cuts.append(H);return list(zip(cuts[:-1],cuts[1:]))
def shadow(rgba):
  a=rgba[...,3:].copy();c=rgba[...,:3].astype(np.float32)/255.
  lum=(c[...,0]*.3+c[...,1]*.59+c[...,2]*.11)[...,None]
  base=np.array([.28,.34,1.0]);hi=np.array([.78,.62,1.0])
  out=np.clip(lum*1.25,0,1)*hi+ (1-np.clip(lum*1.25,0,1))*base*.42
  out=out*.85+c*.15;out=np.clip(out*1.12+.04,0,1)
  return np.dstack([(out*255).astype(np.uint8),a])
def save(img):
  t='/tmp/_n.webp';img.save(t,'WEBP',quality=86,method=6);hs=hashlib.sha256(open(t,'rb').read()).hexdigest()[:14];os.replace(t,os.path.join(R,'www/a',hs+'.webp'));return 'a/'+hs+'.webp'
J=json.load(open(os.path.join(D,'npc.json')))
for nm,(nr,nc) in FL.items():
  im=Image.open(os.path.join(D,'recebido',nm+'.png')).convert('RGB');a=np.array(im);A=alpha(a,0);H,W=A.shape
  rows=[(0,H)] if nr==1 else rows_of(A,nr);fr=[]
  for ri,(y0,y1) in enumerate(rows):
    ncr=nc[ri] if isinstance(nc,list) else nc
    sub=A[y0:y1];cp=(sub>40).sum(0).astype(float);xs=np.where(cp>0)[0];cuts=splits(cp,ncr,max(0,xs[0]-2),min(W,xs[-1]+3))
    for i in range(ncr):
      x0,x1=cuts[i],cuts[i+1];blk=sub[:,x0:x1];m=blk>40
      lab,n=ndimage.label(ndimage.binary_dilation(m,iterations=3))
      if n>1:
        sz=ndimage.sum(m,lab,range(1,n+1));keep=[j+1 for j,s in enumerate(sz) if s>=max(400,sz.max()*.02)]
        blk=np.where(np.isin(lab,keep),blk,0);m=blk>40
      ys,xs2=np.where(m)
      if len(ys)==0:continue
      by0,by1,bx0,bx1=ys.min(),ys.max()+1,xs2.min(),xs2.max()+1
      rgba=np.dstack([a[y0:y1,x0:x1][by0:by1,bx0:bx1],blk[by0:by1,bx0:bx1]])
      hh=by1-by0;band=m[by0+int(hh*.35):by0+int(hh*.7),bx0:bx1];cx=(np.where(band)[1].mean() if band.any() else (bx1-bx0)/2)
      fr.append((rgba,cx,hh))
  ch=nm.split('_')[0]
  if nm.endswith('_anda'):hstand=np.median([f[2] for f in fr])
  else:hstand=fr[REF.get(nm,0)][2]/POSE.get(nm,1.0)
  s=ALT[ch]/hstand
  for tag,fx in ([(nm,None)]+([( 'bes_'+nm[3:],shadow)] if ch=='be' else [])):
    L=[]
    for rgba,cx,hh in fr:
      px=fx(rgba) if fx else rgba
      img=Image.fromarray(px,'RGBA');w,h=img.size;sc=.6
      img=img.resize((max(1,int(w*sc)),max(1,int(h*sc))),Image.LANCZOS)
      L.append({'s':save(img),'w':round(w*s,1),'h':round(h*s,1),'ax':round(cx*s,1),'ay':round(h*s,1)})
    J[tag]=L
# retrato (frente) do Beru: chefe e carta da sombra
im=Image.open(os.path.join(D,'recebido','be_ref.png')).convert('RGB');a=np.array(im);A=alpha(a,0);ys,xs=np.where(A>40)
rgba=np.dstack([a,A])[ys.min():ys.max()+1,xs.min():xs.max()+1]
for tag,fx in (('be_ref',None),('bes_ref',shadow)):
  img=Image.fromarray(fx(rgba) if fx else rgba,'RGBA');img.thumbnail((520,780),Image.LANCZOS);J[tag]=[{'s':save(img),'w':img.size[0],'h':img.size[1],'ax':img.size[0]/2,'ay':img.size[1]}]
json.dump(J,open(os.path.join(D,'npc.json'),'w'));print({k:len(v) for k,v in J.items() if k[:3] in('be_','bes','fv_','fb_')})
