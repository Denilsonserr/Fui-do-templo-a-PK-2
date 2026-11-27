# v663: endereço novo furiadotemplo.com.br — www/mig.js roda no <head> ANTES do jogo (leva o progresso do endereço antigo)
import sys
p=sys.argv[1];s=open(p,encoding='utf8').read()
a='<head><meta charset="utf-8">'
assert s.count(a)==1
s=s.replace(a,a+'<script src="mig.js"></script>');open(p,'w',encoding='utf8').write(s)
