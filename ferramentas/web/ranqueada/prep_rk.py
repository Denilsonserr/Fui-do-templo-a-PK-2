from PIL import Image,ImageFilter;import numpy as np,hashlib,json,glob;from scipy import ndimage as nd
S='/home/claude/novo_ranq/';R={}
def save(im,q=86,fmt='webp'):
    h=hashlib.md5(im.tobytes()).hexdigest()[:14];p=f'out/{h}.{fmt}'
    im.save(p,quality=q) if fmt!='png' else im.save(p);return f'a/{h}.{fmt}'
def alpha_fix(a):
    # fundo branco/transparente ligado à borda -> transparente
    rgb=a[...,:3].astype(int);wh=(rgb.min(2)>238)|(a[...,3]<20);L,k=nd.label(wh);edge=set(np.unique(np.concatenate([L[0],L[-1],L[:,0],L[:,-1]])))-{0}
    bg=np.isin(L,list(edge));al=np.where(bg,0,a[...,3]).astype(float);al=nd.uniform_filter(al,3);a=a.copy();a[...,3]=al.astype(np.uint8);return a
def groups(a,n):
    m=a[...,3]>60;L,k=nd.label(m,structure=np.ones((3,3)));sz=nd.sum(m,L,range(1,k+1));cm=nd.center_of_mass(m,L,range(1,k+1))
    big=sorted(np.argsort(-sz)[:n],key=lambda i:(round(cm[i][0]/250),cm[i][1]));lab=np.zeros(k+1,int)
    for g,i in enumerate(big):lab[i+1]=g+1
    for i in range(k):
        if lab[i+1]==0:lab[i+1]=1+int(np.argmin([abs(cm[i][1]-cm[b][1])+abs(cm[i][0]-cm[b][0]) for b in big]))
    return lab[L]
def cut(a,G,n,size):
    out=[]
    for g in range(1,n+1):
        b=a.copy();b[...,3]=np.where(G==g,b[...,3],0)
        mm=b[...,3]>40;LL,kk=nd.label(mm,structure=np.ones((3,3)));ss=nd.sum(mm,LL,range(1,kk+1))
        if kk>1:keep=[i+1 for i in range(kk) if ss[i]>=.03*ss.max()];b[...,3]=np.where(nd.binary_dilation(np.isin(LL,keep),iterations=3),b[...,3],0)
        ys=np.where((b[...,3]>30).any(1))[0];xs=np.where((b[...,3]>30).any(0))[0]
        c=Image.fromarray(b[ys[0]:ys[-1]+1,xs[0]:xs[-1]+1]);c.thumbnail((size,size),Image.LANCZOS);out.append(save(c,90))
    return out
# emblemas (2 linhas x 4, ordem madeira..divindade)
a=alpha_fix(np.array(Image.open(S+'ranks.png').convert('RGBA')));H,W=a.shape[:2];G=np.zeros((H,W),int)
yy,xx=np.mgrid[0:H,0:W];G=(yy>=402)*4+np.minimum(3,xx*4//W)+1;G=np.where(a[...,3]>0,G,0);R['rank']=cut(a,G,8,320)
# moedas: gema, moeda vermelha, ticket
a=alpha_fix(np.array(Image.open(S+'moedas.png').convert('RGBA')));R['coin']=cut(a,groups(a,3),3,200)
# telas
for k in ['menu_principal','menu_ranqueado','modo_boss','gacha','loja_gemas','biblioteca']:
    im=Image.open(S+k+'.png').convert('RGB');R[k]=save(im,84);R[k+'_wh']=im.size
# carta (1 moldura) colorida por raridade
c=Image.open(S+'cartas_giro.png').convert('RGBA');a=alpha_fix(np.array(c))
b=np.array(c)[:,393:585].copy()
m=b[...,3]>60;L,k=nd.label(m);sz=nd.sum(m,L,range(1,k+1));keep=np.argmax(sz)+1;b[...,3]=np.where(nd.binary_dilation(L==keep,iterations=2),b[...,3],0)
ys=np.where((b[...,3]>30).any(1))[0];xs=np.where((b[...,3]>30).any(0))[0];b=b[ys[0]:ys[-1]+1,xs[0]:xs[-1]+1]
gray=b[...,:3].astype(float).mean(2)/255
COL={'comum':(205,212,225),'rara':(60,150,255),'epica':(185,90,255),'lend':(255,196,40),'mit':(255,50,70)}
R['card']={}
for kk,(r,g_,bb) in COL.items():
    col=np.array([r,g_,bb],float)/255
    # colorir: tons médios na cor, altas luzes brancas
    t=np.clip(gray,0,1)[...,None];out=np.where(t<.75,col*t*1.45,col+(1-col)*((t-.75)/.25))
    o=np.dstack([(out.clip(0,1)*255).astype(np.uint8),b[...,3]]);im=Image.fromarray(o);im.thumbnail((180,600),Image.LANCZOS);R['card'][kk]=save(im,90)
# frames do vídeo da invocação
R['inv']=[]
for f in sorted(glob.glob(S+'vid/rc/*.png')):R['inv'].append(save(Image.open(f).convert('RGB'),74))
json.dump(R,open('rk_assets.json','w'),indent=0);print({k:(v if not isinstance(v,list) else len(v)) for k,v in R.items()})
