# Guia para continuar o Fúria do Templo (leia primeiro)

> **Para o Claude da conta nova:** este arquivo é o "salve" do projeto. Leia tudo antes de mexer. Ele foi escrito pelo Claude que fez o jogo junto com o dono (até a versão v121, novembro de 2026; continuado na conta nova a partir da v122).

## Começo rápido (conta nova)
1. Repositório: **github.com/Denilsonserr/Fui-do-templo-a-PK-2** (branch `main`). Peça para o dono conectar o GitHub na conta nova e adicionar este repositório à sessão. Clonar e ler este guia.
2. Tudo que o jogo usa está em `www/` (`www/index.html` com todo o código + `www/a/` com imagens, sons e quadros de vídeo).
3. Cada `git push` na `main` gera sozinho o APK e o site (ver "Publicação").
4. Ferramentas de montagem (recorte de poses, IA de qualidade, cenários, versão web, testes) estão em `ferramentas/`.
5. A versão do navegador (artifact) da conta antiga não é acessível na conta nova: publique um artifact novo (ver "Publicação").

## Sobre o projeto (contexto combinado com o dono)
- É um jogo **só para uso pessoal do dono** (ele joga sozinho no celular). Não é vendido nem distribuído.
- Por isso o roster mistura personagens originais dele com personagens de anime que ele mesmo traz (Goku, Vegeta, Broly, Zoro, Aokiji...). **Ele manda as artes (folhas de poses em PNG) e os vídeos**; o Claude recorta, melhora a qualidade com IA e programa. O Claude não desenha nem copia arte desses personagens por conta própria.
- Músicas e sons também vieram dele e têm direitos autorais — mais um motivo para ser só uso pessoal.
- Efeitos visuais (auras, raios, impactos) são feitos pelo Claude em código, **no estilo** de anime/FighterZ, mas sem copiar a arte do jogo comercial (o dono pediu "95% igual" uma vez e foi combinado fazer efeitos próprios). Ele disse que vai desenhar os próprios efeitos e mandar (PNG ou sequência de quadros) — quando mandar, integrar.

## O jogo
Jogo de luta anime em HTML5/canvas, empacotado como APK Android com Capacitor (WebView). Tela deitada, controles de toque (joystick + botões soco, chute, ki, especial, ultimate, transformar, voar). Modos: luta contra CPU, treino, torre, 2x2.

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
- Quando ele manda várias imagens em mensagens seguidas, só listar o que chegou (em lista curta) e esperar ele dizer "pode fazer"/"mandei tudo".
- Se faltar alguma pose, usar uma pose parecida que já exista e avisar quais foram reaproveitadas.
- Ele quer **qualidade máxima e movimento fluido** ("bem fluido, ótima qualidade"). Gameplay de referência: Dragon Ball FighterZ (dash, combos que emendam, lançar e perseguir no ar).
- Ele joga pelo APK no celular e às vezes pelo site do GitHub. Ao terminar, avisar que o APK novo está em **Releases → ultima-versao** e que o site pode demorar uns 10 min (cache) — recarregar ou aba anônima.
- Resposta final curta: o que mudou, onde pegar, e o que ficou faltando (poses reaproveitadas, nomes inventados para ataques etc.).

## Publicação
- `git push origin HEAD:main` dispara o GitHub Actions:
  - `.github/workflows/apk.yml` gera o APK e publica na release `ultima-versao` (é de lá que o dono baixa). O APK passou de 100 MB, então o ramo `apk` não recebe mais o arquivo (o passo foi deixado como opcional para não dar erro).
  - Às vezes o push não dispara as Actions (aconteceu uma vez): conferir com `gh run list -R Denilsonserr/Fui-do-templo-a-PK-2` e, se não aparecer, fazer outro commit/push.
  - `.github/workflows/site.yml` publica `www/` no GitHub Pages: https://denilsonserr.github.io/Fui-do-templo-a-PK-2/
- Commits: usar `git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit ...`.
- Versão do navegador (artifact do Claude): `python3 ferramentas/web/pack2.py www <pasta_saida>` gera `index.html` + `jogoN.js` (blocos de 12 MB com as imagens em base64). Publicar em lotes de até 5 blocos (<64 MB por envio). Limite diário de ~200 arquivos enviados; se estourar, esperar a meia-noite UTC. Cada versão do artifact tem no máximo 256 MB: antes de empacotar, copiar `www` para outra pasta e recomprimir os `.webp` (qualidade ~78) — só para a versão web; o APK fica com qualidade cheia. Numa conta nova o link do artifact será outro.

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
  - v118: transformação Super Saiyajin Blue (vídeo com som, sid `vgf`, poses próprias; as que faltaram — tomar golpe, defesa agachado, derrota — são do Vegeta normal com o cabelo pintado de azul, `hair.py`). Aura azul com raios (`vgAura` + `zArcs`). Combos transformado: `fjab→fjab2→frapid(2 golpes)→fpk(soco+chute)→fupper` (lança); chutes `fkick→fhkick→fjkick`. Golpes de vários acertos usam `rehit`. Ultimate (botão grande) = Impacto do Príncipe (vídeo s2); Especial (botão de baixo, 1 barra) = Clarão Final (vídeo s1); os dois sem som e deixam o rival caído. Só transformado. Montagem: `ferramentas/personagens/build_vegeta_blue.py`.
  - v119: o dono trocou TODAS as poses do transformado por uma arte nova (mais realista, cabelo azul-claro). Montagem nova: `ferramentas/personagens/build_vegeta_blue2.py` (quadros completados até 8 repetindo poses). Transformado longe do rival fica parado relaxado (`relax`) e levanta a guarda (`gin`) ao se aproximar (`f.vgG`). Sem poses próprias de carregar ki/rajada/no ar: usa vitória (grito), soco e chute alto. Vídeos e supers iguais.
  - v121: transformado joga igual ao normal: soco→soco→rajada(2 acertos)→soco forte→gancho (lança); chute→chute alto (lança). Mais socos, mais rápidos e mais dano. Chutes também emendam se apertar logo depois que o golpe acaba (`f.acK`, janela 0,5 s), igual aos socos.
- Gogeta (v122, conta nova): forma normal (cabelo preto) com o **mesmo sistema profissional do Vegeta** (`isPro(f)` = Vegeta ou Gogeta; código em `SPRH.gg`, golpes `gjab/gjab2/grapid/gstr/gupper/gkick/ghkick/gsweep/gajab/gakick`; `startMove` troca `v*`→`g*`).
  - Combo: soco→soco→rajada (2 acertos)→soco forte→gancho pulando (lança). Chute→chute alto (lança). Baixo+chute = rasteira. Parado relaxado longe do rival, levanta a guarda perto.
  - Imagens: retrato do quadradinho = imagem do cabelo azul enviada; corpo inteiro (tela VS e escolha) = `FULLIMG.gogeta`.
  - Montagem: `ferramentas/personagens/seg_gogeta.py` (recorte das folhas de fundo preto, separa poses que se encostam) + `build_gogeta.py` (escala por folha pela pose de guarda).
  - Poses reaproveitadas (não vieram folhas próprias): derrota = tomando golpe; vitória = carregar ki/grito; socos/chutes no ar = dash e gancho; rajada de ki = soco.
  - v123: Super Saiyajin Blue (sid `ggf`, poses próprias; montagem `seg_gogeta_blue.py` + `build_gogeta_blue.py`). Golpes iguais ao normal com prefixo `gb` (+15% dano, mais rápidos). Defesa empurrada usa a folha própria (`bpush`).
  - Vídeo da transformação (`GGV`, `updGGT`) — o vídeo enviado veio **sem som** (áudio mudo). Vídeos melhorados com filtro (limpeza + nitidez) em 960x540.
  - Especial (botão de baixo, 1 barra) = Rajada da Fusão (vídeo dos raios azuis, `GGU2`); Ultimate (botão Super) = Destruidor Estelar (vídeo da esfera colorida, `GGU1`). Sem som; o rival toma o dano e fica caído. `ggSuper`/`updGGU`. Nomes inventados pelo Claude.
  - Faltaram poses próprias de carregar ki/rajada e golpes no ar no transformado: usa vitória (grito), soco e dash/gancho.
  - v123 também passou a mostrar o botão Super para o Vegeta (estava escondido por engano).
- Broly: combos; Super Saiyajin Lendário (força máxima, muito rápido, pouco ki, aura verde); Fúria do Planeta (botão grande, mais forte) e Meteoro Verde (botão de baixo).

## Sistema de luta profissional (só no Vegeta)
O dono mandou uma especificação ("SISTEMA PROFISSIONAL DE COMBATE 2D": animação quadro a quadro com tempo próprio, startup/ativo/recuperação, hitbox pelo desenho, dash, corrida, aterrissagem, esquiva, contra-ataque, prioridades, testes dos dois lados). Ele pediu para aplicar **só nos personagens novos a partir do Vegeta**; os antigos ficam como estão. Para um personagem novo, reaproveitar o sistema do Vegeta (`VGA`, `vgKey`, `vgUpd`, `vgGround`, `vgPre`) generalizando para o novo sid.

## v124 — visual e desempenho
- O dono **não quer contorno grosso nem mudar o desenho** dos personagens (testei um acabamento estilo FighterZ com traço e ele recusou). Melhorar sempre mantendo a arte original.
- Lutadores antigos (que estavam com 1.6 px por unidade) passaram de novo pela IA: agora 2.4 px por unidade (`ferramentas/ia/batch2.py`, mapa em `map2_spr.json`). Vegeta, Gogeta, Broly e Zoro já estavam em 2.4–2.8.
- Cenários com vida (`LIFE`, `updLife`, `drawLifeBack`, `drawLifeFront`): raios de luz, névoa, sombra de nuvens, pássaros, partículas próprias de cada cenário, fumaça, brilho na água, tochas do Templo. Para um cenário novo, é só adicionar uma linha em `LIFE`.
- Desempenho: a resolução dinâmica não volta mais para a resolução máxima quando o celular não aguenta (era o que travava); granulado de tela removido; brilho (bloom) recalculado a cada 3 quadros.
- Ampliar os fundos com IA não ajuda: o cenário é desenhado em resolução menor de propósito (`BGD`).

## v125 — carregamento por partida
- Ao abrir, o jogo carrega só Denilson e Lin Feng (fundo do menu) e o Templo. Antes carregava todos os personagens em segundo plano.
- `prepMatch(ids, cenário)`: solta da memória os personagens/vídeos que não estão na luta (`freeUnused`, `VIDF` — **personagem novo com vídeo: adicionar o reset dele em `VIDF`**), carrega só os da luta + o cenário (`stageLoad`) e prepara as imagens antes de começar.
- Tela VS virou tela de carregamento: barra com % e dica (`#vsLoad`, `TIPS`, `ldProg`). A luta só começa quando chega a 100%.
- Cenário aleatório: o próximo cenário já é sorteado e carregado durante o round (`G.nextStg`); os outros são soltos (`stageFree`).

## v126 — cenários animados a partir de vídeo
- O dono mandou vídeos do Planeta Verde e da Cidade do Futuro (mesma arte das imagens que já existiam). `ferramentas/cenarios/build_cenario_video.py` alinha o vídeo com a imagem do jogo e gera: céu animado (faixa do céu, 5 q/s misturando quadros, sem naves rápidas, emenda suave no loop), camadas paradas da arte original (mundo; no Verde, terra distante + chão com parallax) e só os recortes que se mexem fora do céu (trem, naves, palmeiras, 12 q/s).
- No jogo: `VSTG` (dados), `drawVid` (desenho), carregado e solto junto com o cenário (`stageLoad`/`stageFree`). Qualidade Leve = céu parado.
- Também ganharam luz própria nos lutadores (`LT.verde`, `LT.city`) — antes usavam a luz azul de noite do Templo.
- O dono preferiu **não** afastar a câmera: o céu aparece mais quando pulam/voam.
- Dicas para vídeos novos: câmera parada, 3–10 s, mesma arte da imagem do cenário (ou mandar a imagem junto).

## Pendências / ideias
- Vegeta transformado: faltam poses próprias de carregar ki, rajada de ki, soco e chute no ar (hoje usa grito da vitória, soco e chute alto). Se o dono mandar, trocar no `build_vegeta_blue2.py` e no mapa `A`.
- A segunda folha de "gancho para cima" do Vegeta transformado não foi usada.
- Efeitos desenhados pelo dono: ainda não chegaram.
- Nomes "Impacto do Príncipe" e "Clarão Final" foram inventados pelo Claude; o dono pode querer trocar.

## Observações
- Os scripts em `ferramentas/` foram escritos para a pasta temporária da sessão antiga; ajuste os caminhos (`/tmp/...`, `/home/claude/...`) antes de usar.
- Músicas e sons de efeitos são de jogos/animes com direitos autorais — o jogo é só para uso pessoal do dono.
