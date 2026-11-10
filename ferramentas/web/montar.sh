#!/bin/bash
# Monta o www/index.html do zero: base (até a v212) + patch_v213 (ranqueado e tudo depois) + patches extras (personagens novos etc.)
set -e
cd "$(dirname "$0")/../.."
cp ferramentas/web/base_v212.html www/index.html
python3 ferramentas/web/patch_v213.py www/index.html
for p in ferramentas/web/extra/*.py; do [ -e "$p" ] || continue; echo "extra: $p"; python3 "$p" www/index.html; done
node -e "const s=require('fs').readFileSync('www/index.html','utf8');const m=s.match(/<script>[\s\S]*?<\/script>/);new Function(m[0].slice(8,-9));console.log('JS ok')"
# v296: código da versão (aviso de atualização no jogo)
python3 - <<'PY'
import hashlib
p='www/index.html';s=open(p,encoding='utf8').read();h=hashlib.md5(s.encode()).hexdigest()[:12]
assert s.count('__APPV__')==1;s=s.replace('__APPV__',h);open(p,'w',encoding='utf8').write(s);open('www/versao.txt','w').write(h+'\n');print('versão',h)
PY
