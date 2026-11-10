import sys
# v309: SERVIDOR NOVO — o jogo deixa o Firebase (limite de 50 mil leituras/dia) e passa a usar o servidor próprio na Cloudflare
# (worker/index.js + banco D1: 5 milhões de leituras/dia grátis). Mesma API, então o resto do jogo não muda.
# Contas: quem já está logado no aparelho é copiado sozinho para o servidor novo (salvamento assinado com a mesma senha).
P=sys.argv[1];s=open(P,encoding='utf8').read()
def rep(a,b):
    global s;assert s.count(a)==1,a;s=s.replace(a,b)
rep("const TWURL='https://firestore.googleapis.com/v1/projects/'+TWFB.projectId+'/databases/(default)/documents';",
    "const FSO=(/^https?:$/.test(location.protocol)&&!/github\\.io$/.test(location.host))?location.origin:'https://fui-do-templo-a-pk-2.denilsinend.workers.dev';\nconst TWURL=FSO+'/fs/v1/projects/'+TWFB.projectId+'/databases/(default)/documents';")
rep("fetch('https://firestore.googleapis.com/v1/projects/'+TWFB.projectId+'/databases/(default)/documents/torre?documentId=er_'+Date.now().toString(36)+Math.random().toString(36).slice(2,6)+'&key='+TWFB.apiKey,","fetch(((/^https?:$/.test(location.protocol)&&!/github\\.io$/.test(location.host))?location.origin:'https://fui-do-templo-a-pk-2.denilsinend.workers.dev')+'/fs/v1/projects/furia-do-templo/databases/(default)/documents/torre?documentId=er_'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),")
open(P,'w',encoding='utf8').write(s);print('v309 ok')
