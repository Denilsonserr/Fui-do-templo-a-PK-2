#!/bin/bash
# Monta o www/index.html do zero: base (até a v212) + patch_v213 (ranqueado e tudo depois) + patches extras (personagens novos etc.)
set -e
cd "$(dirname "$0")/../.."
cp ferramentas/web/base_v212.html www/index.html
python3 ferramentas/web/patch_v213.py www/index.html
for p in ferramentas/web/extra/*.py; do [ -e "$p" ] || continue; echo "extra: $p"; python3 "$p" www/index.html; done
node -e "const s=require('fs').readFileSync('www/index.html','utf8');const m=s.match(/<script>[\s\S]*?<\/script>/);new Function(m[0].slice(8,-9));console.log('JS ok')"
