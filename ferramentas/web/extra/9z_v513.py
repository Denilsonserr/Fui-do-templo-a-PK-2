# v513: tempos da Torre feitos com o bug da velocidade (anel dourado SP de velocidade +840%) não contam no ranking de TEMPO.
# Janela do bug: depois de 17/11/2026 01:00 UTC (1º código com anel SP de velocidade) e v<202, com tempo < 300 s.
import sys
p=sys.argv[1];s=open(p,encoding='utf8').read()
a="old=ct<TWCUT||(+g('v')||0)<180;"
assert s.count(a)==1,'v513 a'
s=s.replace(a,"old=ct<TWCUT||(+g('v')||0)<180||(ct>=TWBUG&&(+g('v')||0)<202&&(+g('tempo')||0)<300);")
b="const TWCUT=Date.parse('2026-11-07T22:50:00Z');"
assert s.count(b)==1,'v513 b'
s=s.replace(b,b+"const TWBUG=Date.parse('2026-11-17T01:00:00Z');/* v513: tempos do bug da velocidade */")
c="pontos:I(twPts(rec)),char:{stringValue:rec.char},v:I(201),"
assert s.count(c)==1,'v513 c'
s=s.replace(c,"pontos:I(twPts(rec)),char:{stringValue:rec.char},v:I(202),")
open(p,'w',encoding='utf8').write(s)
