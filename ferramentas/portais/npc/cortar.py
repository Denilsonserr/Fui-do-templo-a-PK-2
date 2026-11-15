# v463: corta as folhas dos NPCs dos Portais (demônio de chama e ceifador esqueleto) → www/a/<hash>.webp + npc.json
# fundo branco → transparente (flood fill a partir da borda), divide em linhas/colunas, âncora no pé e no centro do corpo.
import os,sys,json,hashlib,numpy as np
from PIL import Image
from scipy import ndimage
D=os.path.dirname(os.path.abspath(__file__));R=os.path.join(D,'../../..')
# nome: (linhas, quadros por linha)
FL={'dem_anda':(1,5),'dem_corre':(1,5),'dem_golpe':(2,8),'dem_soco':(1,5),'dem_morte':(2,4),
    'esq_anda':(1,5),'esq_corre':(1,5),'esq_golpe':(2,6),'esq_soco':(1,5),'esq_chute':(1,5),'esq_morte':(2,6),
    'ig_anda':(1,5),'ig_corre':(1,5),'ig_golpe':(2,7),'ig_forte':(1,5),'ig_dash':(1,5),'ig_chute':(1,5),'ig_morte':(1,5),
    'igs_anda':(1,5),'igs_chute':(1,5),'igs_forte':(1,5),'igs_guarda':(1,5),'igs_pulo':(1,5),'igs_morte':(1,5),'igs_golpe':(2,[6,5])}
EQ={'ig_golpe'}
ALT={'dem':330,'esq':320,'ig':380,'igs':380}   # altura em pé no jogo
def alpha(a,soft=0):
  rgb=a[...,:3].astype(np.int16);mn=rgb.min(-1);mx=rgb.max(-1);bg=(mn>=226)&((mx-mn)<22)
  lab,_=ndimage.label(bg);edge=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
  out=np.isin(lab,list(edge))
  # buracos fechados (entre perna e rabo, capa): branco puro e neutro; o cabelo de chama é branco LILÁS (fica)
  n=lab.max()
  if n:
    sp=(mx-mn).astype(np.float32);ss=ndimage.mean(sp,lab,range(1,n+1));sz=ndimage.sum(bg,lab,range(1,n+1))
    cy=ndimage.mean(np.indices(lab.shape)[0],lab,range(1,n+1)) if soft else None
    holes=[i+1 for i in range(n) if (i+1) not in edge and sz[i]>120 and (ss[i]<1.2 or (soft and ss[i]<6 and cy[i]>lab.shape[0]*.45))]
    if holes:out|=np.isin(lab,holes)
  # suaviza a borda: pixels claros vizinhos do fundo ficam semitransparentes
  near=ndimage.binary_dilation(out,iterations=2)&~out
  A=np.where(out,0,255).astype(np.float32);lum=mn.astype(np.float32)
  A[near]=np.clip((255-lum[near])/(255-170)*255,0,255)
  A=ndimage.gaussian_filter(A,.6);A[out&~ndimage.binary_dilation(~out,iterations=1)]=0
  return A.astype(np.uint8)
def splits(prof,n,lo,hi):
  W=hi-lo;cuts=[lo]
  for k in range(1,n):
    t=lo+W*k/n;a,b=int(t-W/n*.35),int(t+W/n*.35);seg=prof[a:b];
    # coluna mais vazia perto da divisão ideal (penaliza distância)
    sc=seg+np.abs(np.arange(a,b)-t)*.02*prof.max()/max(1,W/n);cuts.append(a+int(np.argmin(sc)))
  cuts.append(hi);return cuts
out={};ref={}
for nm,(nr,nc) in FL.items():
  im=Image.open(os.path.join(D,'recebido',nm+'.png')).convert('RGB');a=np.array(im);A=alpha(a,nm.startswith('ig'));H,W=A.shape
  rp=(A>40).sum(1)
  if nr==1:rows=[(0,H)]
  else:
    m=H//2;w=int(H*.12);c=m-w+int(np.argmin(rp[m-w:m+w]));rows=[(0,c),(c,H)]
  fr=[]
  for ri,(y0,y1) in enumerate(rows):
    ncr=nc[ri] if isinstance(nc,list) else nc
    sub=A[y0:y1];cp=(sub>40).sum(0).astype(float);xs=np.where(cp>0)[0];cuts=splits(cp,ncr,max(0,xs[0]-2),min(W,xs[-1]+3)) if nm not in EQ else [int(W*k/ncr) for k in range(ncr+1)]
    for i in range(ncr):
      x0,x1=cuts[i],cuts[i+1];blk=sub[:,x0:x1];m=blk>40
      # remove pedacinhos soltos pequenos (respingos do vizinho)
      lab,n=ndimage.label(ndimage.binary_dilation(m,iterations=3));
      if n>1:
        sz=ndimage.sum(m,lab,range(1,n+1));keep=[j+1 for j,s in enumerate(sz) if s>=max(400,sz.max()*.02)];msk=np.isin(lab,keep);blk=np.where(msk,blk,0);m=blk>40
      ys,xs2=np.where(m)
      if len(ys)==0:continue
      by0,by1,bx0,bx1=ys.min(),ys.max()+1,xs2.min(),xs2.max()+1
      rgba=np.dstack([a[y0:y1,x0:x1][by0:by1,bx0:bx1],blk[by0:by1,bx0:bx1]])
      # âncora: pé = base; x = centro de massa do tronco (35%-70% da altura)
      hh=by1-by0;band=m[by0+int(hh*.35):by0+int(hh*.7),bx0:bx1];cx=(np.where(band)[1].mean() if band.any() else (bx1-bx0)/2)
      fr.append((rgba,cx,hh))
  out[nm]=fr
J={}
for nm,fr in out.items():
  ch=nm.split('_')[0]
  # cada folha foi desenhada num tamanho: usa a altura do 1º quadro × quanto essa pose é da altura em pé
  POSE={'dem_golpe':.80,'dem_soco':.86,'dem_corre':.74,'esq_golpe':.84,'esq_soco':.80,'esq_chute':.92,'esq_corre':.70,'ig_corre':.80,'igs_pulo':.62,'ig_morte':.95}
  if nm.endswith('_anda'):hstand=np.median([f[2] for f in fr])
  else:hstand=fr[0][2]/POSE.get(nm,1.0)
  s=ALT[ch]/hstand
  L=[]
  for rgba,cx,hh in fr:
    img=Image.fromarray(rgba,'RGBA');w,h=img.size;sc=.6  # guarda em 60% (leve), desenha escalado
    img=img.resize((max(1,int(w*sc)),max(1,int(h*sc))),Image.LANCZOS)
    t='/tmp/_n.webp';img.save(t,'WEBP',quality=86,method=6);hs=hashlib.sha256(open(t,'rb').read()).hexdigest()[:14];os.replace(t,os.path.join(R,'www/a',hs+'.webp'))
    L.append({'s':'a/'+hs+'.webp','w':round(w*s,1),'h':round(h*s,1),'ax':round(cx*s,1),'ay':round(h*s,1)})
  J[nm]=L
json.dump(J,open(os.path.join(D,'npc.json'),'w'));print({k:len(v) for k,v in J.items()})
