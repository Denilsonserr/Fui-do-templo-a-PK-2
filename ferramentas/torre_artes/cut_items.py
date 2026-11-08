from PIL import Image;import numpy as np,json,hashlib,sys
S='/home/claude/novo_mochila/'
def segs(m,minw=4,mingap=12):
    v=m.any(0);out=[];i=0;n=len(v)
    while i<n:
        if v[i]:
            j=i
            while j<n and v[j]:j+=1
            out.append([i,j]);i=j
        else:i+=1
    # junta pedaços com folga pequena
    M=[]
    for a,b in out:
        if M and a-M[-1][1]<mingap:M[-1][1]=b
        else:M.append([a,b])
    return [x for x in M if x[1]-x[0]>=minw]
res={}
def cuts(prof,n):
    W=len(prof);c=[0]
    for k in range(1,n):
        lo,hi=int(W*k/n-W/(n*3)),int(W*k/n+W/(n*3));c.append(lo+int(np.argmin(prof[lo:hi])))
    c.append(W);return [[c[i],c[i+1]] for i in range(n)]
from scipy import ndimage as nd
def groups(a,n=5):
    m=a[...,3]>30;L,k=nd.label(m,structure=np.ones((3,3)));sz=nd.sum(m,L,range(1,k+1));cm=nd.center_of_mass(m,L,range(1,k+1))
    big=np.argsort(-sz)[:n];big=sorted(big,key=lambda i:cm[i][1]);lab=np.zeros(k+1,int)
    for g,i in enumerate(big):lab[i+1]=g+1
    for i in range(k):
        if lab[i+1]==0:lab[i+1]=1+int(np.argmin([abs(cm[i][1]-cm[b][1])+abs(cm[i][0]-cm[b][0])*.3 for b in big]))
    G=lab[L];return G
def split5(a):return cuts((a[...,3]>140).sum(0).astype(float),5)
for name in ['espadas','pocoes','botas','armaduras']:
    im=Image.open(S+name+'.png').convert('RGBA');a=np.array(im);m=a[...,3]>24
    G=groups(a);sg=[]
    for g in range(1,6):
        b=a.copy();b[G!=g]=0;b[...,3]=np.where(G==g,b[...,3],0);sg.append(b)
    # se houver mais de 5, junta os menores no vizinho
    while len(sg)>5:
        w=[b-a_ for a_,b in sg];k=int(np.argmin(w))
        if k==0:sg[1][0]=sg[0][0];sg.pop(0)
        elif k==len(sg)-1:sg[-2][1]=sg[-1][1];sg.pop()
        else:
            if sg[k][0]-sg[k-1][1]<sg[k+1][0]-sg[k][1]:sg[k-1][1]=sg[k][1]
            else:sg[k+1][0]=sg[k][0]
            sg.pop(k)
    L=[]
    for sub in sg:
        ys=np.where((sub[...,3]>40).any(1))[0];y0,y1=ys[0],ys[-1]+1
        xs=np.where((sub[y0:y1,:,3]>40).any(0))[0]
        c=Image.fromarray(sub[y0:y1,xs[0]:xs[-1]+1]);s=192/max(c.size);c=c.resize((max(1,round(c.width*s)),max(1,round(c.height*s))),Image.LANCZOS)
        cv=Image.new('RGBA',(200,200));cv.alpha_composite(c,((200-c.width)//2,(200-c.height)//2))
        h=hashlib.md5(cv.tobytes()).hexdigest()[:14];cv.save(f'out/{h}.webp',quality=88);L.append(f'a/{h}.webp')
    res[name]=L
# baús: 2 linhas x 5 (fechado / aberto)
im=Image.open(S+'baus.png').convert('RGBA');a=np.array(im);m=a[...,3]>24
rows=cuts((a[...,3]>140).sum(1).astype(float),2);print('rows',rows)
for ri,(y0,y1) in enumerate(rows[:2]):
    sg=split5(a[y0:y1]);print('row',ri,sg)
    L=[]
    for x0,x1 in sg[:5]:
        sub=a[y0:y1,x0:x1];ys=np.where((sub[...,3]>60).any(1))[0];xs=np.where((sub[...,3]>60).any(0))[0];sub=sub[ys[0]:ys[-1]+1,xs[0]:xs[-1]+1];c=Image.fromarray(sub);s=300/max(c.size);c=c.resize((round(c.width*s),round(c.height*s)),Image.LANCZOS)
        h=hashlib.md5(c.tobytes()).hexdigest()[:14];c.save(f'out/{h}.webp',quality=88);L.append(f'a/{h}.webp')
    res['bau_'+('f' if ri==0 else 'a')]=L
for k in ['mochila','andar_vencido']:
    im=Image.open(S+k+'.png').convert('RGB');h=hashlib.md5(im.tobytes()).hexdigest()[:14];im.save(f'out/{h}.webp',quality=86);res[k]=f'a/{h}.webp'
json.dump(res,open('items.json','w'),indent=1)
