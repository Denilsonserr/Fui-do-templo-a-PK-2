import numpy as np,sys
from PIL import Image
from scipy import ndimage as nd
def cut(path,out):
    a=np.asarray(Image.open(path).convert('RGB')).astype(int);r,g,b=a[...,0],a[...,1],a[...,2];v=a.max(2)
    grad=nd.gaussian_gradient_magnitude(a.mean(2).astype(float),1.0)
    mn=a.min(2);sat=(v-mn)/np.maximum(v,1);bgl=(r-b>=5)&(v<175)&(grad<14)&~((sat>.7)&(v>80))&~(g<r*.45)
    bgl=nd.binary_opening(bgl,iterations=1)
    lab,n=nd.label(bgl);H,W=bgl.shape
    edge=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
    # também as faixas entre quadros (colunas/linhas de divisão) tocam a borda
    bg=np.isin(lab,list(edge))
    bg=nd.binary_dilation(bg,iterations=2,mask=(r-b>=3)&(v<190))
    glow=(r-b>30)&(v<170)&(grad<10)&(g>r*.55)&(g<r*.78)
    for _ in range(60):
        nb=nd.binary_dilation(bg,iterations=2)&glow&~bg
        if not nb.any():break
        bg|=nb
    fg=~bg;fg=nd.binary_opening(fg,iterations=2)
    l2,k=nd.label(fg);sz=nd.sum(fg,l2,range(1,k+1));fg=np.isin(l2,[i+1 for i in range(k) if sz[i]>800])
    fg=nd.binary_fill_holes(fg)
    al=np.clip(nd.gaussian_filter(fg.astype(float),.8),0,1)*nd.binary_dilation(fg,iterations=1)
    Image.fromarray(np.dstack([a,al*255]).clip(0,255).astype(np.uint8),'RGBA').save(out)
if __name__=='__main__':cut(sys.argv[1],sys.argv[2])
