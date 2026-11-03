import re,base64,json,os,sys
src,out=sys.argv[1],sys.argv[2]
os.makedirs(out+'/a',exist_ok=True)
s=open(src+'/index.html').read()
i=s.index('<script>');j=s.rindex('</script>')
pre,scr,post=s[:i],s[i+8:j],s[j+9:]
mime={'webp':'image/webp','jpg':'image/jpeg','mp3':'audio/mpeg'}
def rep(m):
    p=m.group(0);ext=p.rsplit('.',1)[1]
    if ext=='webm':
        open(out+'/'+p,'wb').write(open(src+'/'+p,'rb').read());return p
    return 'data:%s;base64,%s'%(mime[ext],base64.b64encode(open(src+'/'+p,'rb').read()).decode())
scr=re.sub(r'a/[0-9a-f]{14}\.(?:webp|jpg|webm|mp3)',rep,scr)
N=12_000_000;parts=[scr[k:k+N] for k in range(0,len(scr),N)]
tags=''
for n,pt in enumerate(parts,1):
    js=('window.__J=[];' if n==1 else '')+'window.__J.push('+json.dumps(pt)+');'
    open(out+'/jogo%d.js'%n,'w').write(js);tags+='<script src="jogo%d.js"></script>'%n
tags+='<script>(function(){var s=document.createElement("script");s.textContent=window.__J.join("");window.__J=null;document.body.appendChild(s)})();</script>'
open(out+'/index.html','w').write(pre+tags+post)
print(len(parts),[os.path.getsize(out+'/jogo%d.js'%n) for n in range(1,len(parts)+1)])
