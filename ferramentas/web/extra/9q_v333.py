import sys
# v333: no PVP o rival aparece como SOMBRA (não CPU) na barra de vida
P=sys.argv[1];s=open(P,encoding='utf8').read()
a="(f.cpu?'CPU':'VOCÊ')";assert s.count(a)==1,a;s=s.replace(a,"(f.cpu?(f.pvN?'SOMBRA':'CPU'):'VOCÊ')")
open(P,'w',encoding='utf8').write(s);print('v333 ok')
