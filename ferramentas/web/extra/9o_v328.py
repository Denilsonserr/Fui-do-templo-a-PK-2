import sys
# v328: fonte Cinzel (letra dourada bonita das telas novas)
P=sys.argv[1];s=open(P,encoding='utf8').read()
a="family=Bangers&family=Saira+Condensed:wght@500;700;800&display=swap"
assert s.count(a)==1;s=s.replace(a,"family=Bangers&family=Cinzel:wght@700;900&family=Saira+Condensed:wght@500;700;800&display=swap")
open(P,'w',encoding='utf8').write(s);print('v328 ok')
