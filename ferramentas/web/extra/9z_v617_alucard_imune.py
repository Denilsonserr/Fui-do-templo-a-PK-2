# v617: ALUCARD não deixa ninguém desviar — os desvios automáticos/passivos dos personagens (Gojo, Garou, Naruto, Luffy, Madara,
# Qingqing, Shaka, o próprio Alucard) não funcionam contra golpe do Alucard. ALHIT=1 enquanto o golpe é do Alucard (rk.js).
import sys
p=sys.argv[1];s=open(p,encoding='utf8').read()
R=[("if(isGj(d)&&d.form&&!h.lock&&","if(isGj(d)&&d.form&&!h.lock&&!ALHIT&&"),
   ("if(isGr(d)&&!h.lock&&!d.ko&&!GRK[d.state]","if(isGr(d)&&!h.lock&&!ALHIT&&!d.ko&&!GRK[d.state]"),
   ("if(isNr(d)&&d.form&&!h.lock&&!h.nrc&&","if(isNr(d)&&d.form&&!h.lock&&!ALHIT&&!h.nrc&&"),
   ("if(isLf(d)&&d.form&&!h.lock&&!d.ko&&!['lfv'","if(isLf(d)&&d.form&&!h.lock&&!ALHIT&&!d.ko&&!['lfv'"),
   ("if(isMd(d)&&d.form&&!h.lock&&","if(isMd(d)&&d.form&&!h.lock&&!ALHIT&&"),
   ("if(isQq(d)&&!h.lock&&d.state!=='qdodge'","if(isQq(d)&&!h.lock&&!ALHIT&&d.state!=='qdodge'"),
   ("try{if(isAuc(d)&&a&&a!==d&&h&&!h.lock&&!d.ko&&d.inv<=0","try{if(isAuc(d)&&a&&a!==d&&h&&!h.lock&&!ALHIT&&!d.ko&&d.inv<=0"),
   ("function skDodge(a,d,h){if(!isSk(d)||!d.form||h.lock||","function skDodge(a,d,h){if(!isSk(d)||!d.form||h.lock||ALHIT||")]
for a,b in R:
    assert s.count(a)==1,('v617',a,s.count(a));s=s.replace(a,b)
open(p,'w',encoding='utf8').write(s)
