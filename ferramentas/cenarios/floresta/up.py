import sys;sys.path.insert(0,'/home/claude/fui-do-templo-a-pk-2/ferramentas/ia');import esr,time
from PIL import Image
for n in range(5):
    t=time.time();im=Image.open(f'L{n}.png').convert('RGBA');o=esr.sr_rgba(im,2);o.convert('RGB').resize((3000,1000),Image.LANCZOS).save(f'B{n}.png');print(n,round(time.time()-t),flush=True)
