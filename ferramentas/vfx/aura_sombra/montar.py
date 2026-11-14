# v425: AURA DE SOMBRA do dono (vídeo aura_dono.mp4 = grade 6x2 animada, fundo preto). Pega a célula (linha 2, coluna C) ao longo do tempo
# = aura em volta da silhueta, em loop. Fundo preto -> desenhada com 'lighter' (o preto some). Saída: 1 tira webp + aura.json
import subprocess,os,glob,json,hashlib,io,numpy as np,tempfile
from PIL import Image
D=os.path.dirname(os.path.abspath(__file__));A=os.path.join(D,'..','..','..','www','a');C=0;STEP=2;FW=170
T=tempfile.mkdtemp();subprocess.run(['ffmpeg','-v','error','-i',os.path.join(D,'aura_dono.mp4'),f'{T}/v_%03d.png'],check=True)
fs=sorted(glob.glob(f'{T}/v_*.png'));W=1168/6
cells=[np.asarray(Image.open(f).convert('RGB').crop((int(C*W),384,int((C+1)*W),768))).astype(float) for f in fs]
# loop sem emenda: mistura os últimos 8 quadros com os primeiros
n=len(cells);X=8;L=[c.copy() for c in cells[:n-X]]
for i in range(X):k=(i+1)/(X+1);L[i]=cells[n-X+i]*(1-k)+cells[i]*k
L=L[::STEP]
S=np.max([c.max(2) for c in L],0);ys,xs=np.where(S>14);y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
fr=[Image.fromarray(c[y0:y1,x0:x1].clip(0,255).astype(np.uint8)) for c in L]
w0,h0=fr[0].size;FH=round(FW*h0/w0);strip=Image.new('RGB',(FW*len(fr),FH))
for i,f in enumerate(fr):strip.paste(f.resize((FW,FH),Image.LANCZOS),(i*FW,0))
b=io.BytesIO();strip.save(b,'WEBP',quality=82,method=6);d=b.getvalue();h=hashlib.md5(d).hexdigest()[:14];open(f'{A}/{h}.webp','wb').write(d)
# buraco da silhueta: linhas onde o centro da célula é escuro (para encaixar o personagem)
mid=np.mean([c.max(2) for c in L],0)[y0:y1,x0:x1];cx=mid.shape[1]//2;col=mid[:,cx-6:cx+6].mean(1);hole=np.where(col<25)[0]
o={'s':'a/'+h+'.webp','n':len(fr),'fw':FW,'fh':FH,'hy0':round(hole.min()/mid.shape[0],3) if len(hole) else .3,'hy1':round(hole.max()/mid.shape[0],3) if len(hole) else 1}
json.dump(o,open(os.path.join(D,'aura.json'),'w'));print(o,strip.size,len(d)//1024,'KB')
