# Guia para continuar o Fúria do Templo (leia primeiro)

Jogo de luta anime em HTML5/canvas, empacotado como APK Android com Capacitor.
Tudo o que roda está em `www/` (um único `www/index.html` com todo o JS + imagens/sons em `www/a/`).

## Como o dono gosta de trabalhar (MUITO IMPORTANTE)
- Fala português (Brasil), de forma simples. Responder em português, sem termos técnicos.
- **Personagem novo: só começar a montar quando ele disser que mandou TUDO** (poses, transformação, vídeos, ataques). Até lá, só confirmar o que recebeu.
- **Não inventar poderes**: só colocar especiais/ultimates que ele mandar. Sem ataque mandado = só socos/chutes + rajada de ki básica.
- **Nunca mandar o arquivo APK no chat sem ele pedir.**
- Sempre que pedir "melhor qualidade", passar as poses pela IA (Real-ESRGAN, ver `ferramentas/ia`).
- Super ataques: **sem áudio** do vídeo, exceto Aokiji e Qingqing (que mantêm o som). Transformações mantêm o som do vídeo, com a música mais baixa.
- Música dentro da luta: volume normal 0.45, cai para 0.24 durante vídeos com som.
- Os efeitos de impacto devem ser discretos (clarão branco pequeno). Ele achou feia a explosão laranja grande — não voltar com ela.
- Não copiar arte/efeitos de jogos comerciais (ex.: FighterZ). Fazer efeitos próprios no mesmo estilo.
- Fluxo de cada mudança: testar → publicar a versão do navegador (artifact) → commit + push no GitHub.

## Publicação
- `git push origin HEAD:main` dispara o GitHub Actions:
  - `.github/workflows/apk.yml` gera o APK (release `ultima-versao`).
  - `.github/workflows/site.yml` publica `www/` no GitHub Pages: https://denilsonserr.github.io/Fui-do-templo-a-PK-2/
- Commits: usar `git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit ...`.
- Versão do navegador (artifact do Claude): `python3 ferramentas/web/pack2.py www <pasta_saida>` gera `index.html` + `jogoN.js` (blocos de 12 MB com as imagens em base64). Publicar em lotes de até 5 blocos (<64 MB por envio). Limite diário de ~200 arquivos enviados; se estourar, esperar a meia-noite UTC. Numa conta nova o link do artifact será outro.

## Estrutura do código (www/index.html)
- `CH` = definição de cada lutador (sid, nome, cores do ki, `walk`, `power`, nomes de forma/ataques).
- `ALLC` = lista do roster; `ROS` = descrição/atributos na tela de escolha; `loadImg(id, 'a/...jpg')` = retrato.
- `SPRH[sid][animação] = [{w,h,ax,ay,src,...}]` = quadros. Animações usadas: idle, walk, combo, kick, low, jump, block, hit, fall, trans, win, pw, fly, sp (+ extras como dash, kk, kick2).
- `ssid(f)` escolhe o sid conforme a forma (ex.: `gk`/`gkf`). `sidsOf(id)` lista os sids do personagem (para pré-carregar).
- `FR[sid]` mapeia golpes → quadros (fases [início, ativo, recuperação]). `MOVES` = dados dos golpes (frames, dano, hitbox...).
- `RUSHK`, `HAIR`, `HAND`, `SCQ` (combo aéreo do botão Especial) por personagem.
- Transformação: `startTransform` → `updTrans` → função própria por personagem (ex.: `updGKT`, `updAOT`, `updBRT`). Vídeos viram quadros webp (12 fps, 800x450) porque o WebView do APK não toca `<video>`; desenhar com `gkFull(...)`.
- Ultimate (botão grande): `trySR` → `_trySR` → função do personagem; usa `G.ws={...}` e `updWhtS` despacha. Desenho de tela cheia no início de `render`.
- Botão de baixo (Especial 100): normalmente `startSC` (combo aéreo) ou especial próprio.
- Mecânicas gerais já feitas: barras de energia (6, uma a cada 10 s), ki em 3 camadas + modo **Poder Máximo** (necessário para Ultimate, exceto Aylla/Xiao/White), hitstop por força do golpe, auto-combo (janela 0,5 s), super soco segurando o soco (SMASH, bate na parede), Super Dash após o gancho, contador de golpes e avisos (Smash!, Perseguição!, Contra-ataque!, Parede!).
- Telas: escolha de personagem e de cenário usam imagens de fundo com quadradinhos (`SL/TP` e `STSL` = posições em %). Tela VS com corpo inteiro (`fullSrc`).
- Cenários: `STG` (lista), cenários vivos em camadas `ST4`/`NMK` (`drawLive`, `drawNMK`).

## Como adicionar um personagem novo (passo a passo)
1. Copiar as folhas de poses para uma pasta e recortar: `ferramentas/personagens/seg.py` (remove o fundo cinza/branco e separa cada pose em `cut/`). Ajustar caminhos no script.
2. Ver o resultado (folha de contato) e montar o mapeamento animação → poses (ver `build_broly.py` como modelo: forma normal `xx` e transformada `xxf`).
3. Gerar os quadros com IA: `build_*.py` usa `ferramentas/ia/esr.py` (Real-ESRGAN animevideov3 em numpy; ~20 s por pose). Gera `out/*.webp` + JSON → copiar para `www/a/`.
4. Retrato: recortar o rosto da imagem enviada (jpg ~900 px).
5. Vídeos: `ffmpeg -i v.mp4 -vf "fps=12,scale=800:450" -c:v libwebp -quality 76 f%03d.webp`; som (se for manter): `ffmpeg -i v.mp4 -vn -af loudnorm=I=-17:TP=-2 -ac 2 -ar 44100 -c:a libmp3lame -q:a 3 s.mp3`.
6. No `index.html`, seguir o padrão do Broly/Goku/Aokiji (procurar por `isBr(`, `brSuper`, `updBRT`): CH, isXX, ssid, sidsOf, recolor, SPRH, FR, HAND, HAIR, RUSHK, SCQ, ALLC/ROS, botões (`bSr`), transformação, ultimate, prepMatch (carregar vídeos), música baixa durante vídeo.
7. Testar com Playwright (exemplos em `ferramentas/testes/`), checar sintaxe com `node --check`.
8. Publicar (artifact) + commit + push.

## Personagens atuais (resumo das regras pedidas)
- Denilson, Denilson 2.0, Lin Feng, Arkarus, Aylla, White, Xiao Wyn, Magmus: personagens originais antigos.
- Zedry: Forma Dourada (1 barra, vídeo), Forma Suprema (+2 barras, +30% dano/vel/defesa), ultimate Impacto Estelar.
- Zaykon: Forma Azul (vídeo, aura azul e raios roxos), ultimate Impacto Divino.
- Qingqing: velocidade máxima, dano baixo, esquiva automática a cada 3 golpes recebidos, sedução hipnotiza 1 s; Forma Lunar (aura branca); ultimate Julgamento Lunar (vídeo com som, deixa caído); Especial Coração Hipnótico (4 s).
- Goku: Super Saiyajin (vídeo, aura amarela com raios azuis, muita força/velocidade, pouco ki); Kamehameha amarelo (vídeo recolorido).
- Aokiji: Corpo de Gelo (força enorme, ki sempre cheio, lentidão a cada 3 acertos, gelo no chão); ultimate Era do Gelo congela 3 s no bloco de gelo enviado.
- Zoro: só golpes de espada; transformado = espadas roxas com brilho e raios roxos, mais alcance; Ki = Super Corte de longe; Especial = Fúria do Demônio (400 + lentidão); 3% crítico em tela cheia; 1% redemoinho que ergue; ultimate Corte do Rei.
- Vegeta (v117): primeiro personagem com a **gameplay profissional** (só nele, os outros ficam como estão). Sem transformação e sem especiais ainda (o dono vai mandar).
  - Toque 2x para frente = dash; segurando = corrida; 2x para trás = dash para trás com invencibilidade (esquiva).
  - Aterrissagem, levantar do chão (28 quadros), vitória e derrota com folhas próprias.
  - Andar/correr: o quadro da animação segue a distância percorrida (`f.vgD`), então não desliza.
  - Golpes: `VGA` (quadros de início/ativo/recuperação) + `MOVES.vjab/vjab2/vstr/vkick/vhkick/vsweep/vajab/vakick`; hitbox calculada do alcance real do desenho (`rx/ry` de cada quadro).
  - Combo: soco, soco, soco forte, chute, chute alto (lança → Super Dash). Baixo+chute = rasteira. Chute na defesa = contra-ataque (20 ki).
  - Código: procurar `isVg(`, `vgKey`, `vgUpd`, `vgGround`. Montagem das poses: `ferramentas/personagens/build_vegeta.py` (cada folha tem escala própria, normalizada pela pose de guarda; âncora pelo pé de apoio).
- Broly: combos; Super Saiyajin Lendário (força máxima, muito rápido, pouco ki, aura verde); Fúria do Planeta (botão grande, mais forte) e Meteoro Verde (botão de baixo).

## Observações
- Os scripts em `ferramentas/` foram escritos para a pasta temporária da sessão antiga; ajuste os caminhos (`/tmp/...`, `/home/claude/...`) antes de usar.
- Músicas e sons de efeitos são de jogos/animes com direitos autorais — o jogo é só para uso pessoal do dono.
