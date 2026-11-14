# Guia para continuar o Fúria do Templo (leia primeiro)

> **Leia antes o `COMECE-AQUI.md` (resumo da passagem, v220).** **Para o Claude da conta nova:** este arquivo é o "salve" do projeto. Leia tudo antes de mexer. Ele foi escrito pelo Claude que fez o jogo junto com o dono (até a versão v121, novembro de 2026; continuado na conta nova a partir da v122).

## Começo rápido (conta nova)
1. Repositório: **github.com/Denilsonserr/Fui-do-templo-a-PK-2** (branch `main`). Peça para o dono conectar o GitHub na conta nova e adicionar este repositório à sessão. Clonar e ler este guia.
2. Tudo que o jogo usa está em `www/` (`www/index.html` com todo o código + `www/a/` com imagens, sons e quadros de vídeo).
3. Cada `git push` na `main` gera sozinho o APK e o site (ver "Publicação").
4. Ferramentas de montagem (recorte de poses, IA de qualidade, cenários, versão web, testes) estão em `ferramentas/`.
5. A versão do navegador (artifact) da conta antiga não é acessível na conta nova: publique um artifact novo (ver "Publicação").

## ⚠️ Estado atual e como montar o index.html (use `bash ferramentas/web/montar.sh`; patches novos de personagem vão em `ferramentas/web/extra/`)
- O `www/index.html` atual é gerado assim (sempre a partir da base, nunca editar o index à mão):
  `cp ferramentas/web/base_v212.html www/index.html && python3 ferramentas/web/patch_v213.py www/index.html`
  - Base = jogo até a v212 (`ferramentas/web/base_v212.html`). O `patch_v213.py` injeta `ferramentas/web/ranqueada/rk.js` + `rk.css` + artes (`ranqueada/rk_assets.json`) e todas as mudanças da v213 até a v220.
  - Mudança nova no ranqueado/conta/códigos: editar `rk.js`/`rk.css` (ou acrescentar `rep(...)` no fim do `patch_v213.py`) e montar de novo.
- Conferir sintaxe: `node -e "const s=require('fs').readFileSync('www/index.html','utf8');const m=s.match(/<script>[\s\S]*?<\/script>/);new Function(m[0].slice(8,-9))"`
- Testes com Playwright em `ferramentas/testes/` (os de Firestore simulam o servidor com `page.route`). Os mais usados: `tranqueado.js`, `trb.js`, `tequipar.js`, `trecomp.js`, `tconta.js`, `tcodigo_rk.js`, `tdiamante.js`.
- Servidor (Firestore) não é acessível pelo sandbox: usar os workflows `consulta.yml`, `lista.yml`, `teste_conta.yml` (`gh api -X POST repos/Denilsonserr/Fui-do-templo-a-PK-2/actions/workflows/<arquivo>/dispatches -f ref=main` e ler os logs com `gh api .../actions/runs/<id>/logs`).
- Se o site demorar a atualizar: o deploy do GitHub Pages às vezes fica ~10 min "in_progress"; esperar (ou `destravar-site.yml`).
- Códigos secretos: só os hashes ficam no código (`TWCUP`, `TWADM`). O texto dos códigos o dono guarda e passa na conversa se precisar.
- Pendente sem resposta: dar o 2º lugar do evento de 08/11 para ZEUS_DARKBR (terminou 15:45:52, fora do horário)?
- Regras do dono: responder curto em português simples (o que mudou, onde pegar, o que foi reaproveitado/inventado); atualizar este guia a cada versão; commits terminam com as linhas de Co-Authored-By/Claude-Session da sessão.

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
- Super ataques e transformações: **sem áudio** do vídeo, todos (regra do dono desde a v138). Vídeos curtos: transformação ≤ ~3,2 s, ultimate ≤ ~5,5 s.
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

## v127 — botões novos, efeito de transformação e troca estilo FighterZ
- Arte dos botões = imagem enviada pelo dono (recortada com `ferramentas/web/recortar_botoes.py`; brilho sobre fundo preto vira transparência). Layout baseado na imagem, mas menor (v128: o dono achou grande demais; anel de carga fino só em Ki, Combo, Super e Transformar).
- Botões: Defesa (`bBl`, tecla H — segura para defender parado; com baixo defende agachado), Combo dourado = `bSp` (Especial/combos; o dono vai mandar combos novos), Super vermelho = `bSr` (ataques em vídeo). Chute = botão do corredor.
- Transformado: efeito nos botões (canvas `#btnFx`, `drawBtnFx`) e na barra de vida de quem transformou (`hudBarFx`). Tema por personagem em `FXT`: `bolt` raios (Goku amarelo, Vegeta/Gogeta azul, Broly verde...), `fire` (Magmus, Lin Feng, Xiao), `aura` (Zoro verde, Qingqing, Aokiji...). Personagem novo: adicionar em `FXT`.
- Modo 2x2 (não Torre): troca estilo FighterZ (`TAG`, `doTag`, `tagStep`, `tagUpdate`, `hudTag`). Pílula embaixo do nome mostra o parceiro (retrato, vida, espera); tocar troca (espera de 5 s; tecla T). O parceiro entra correndo e dá um soco que joga o rival longe. Quando um cai, o outro entra direto sem round novo; acaba quando os dois caem. CPU também troca. Parceiro fora recupera vida devagar.
- Pendente: o Especial em vídeo de Vegeta/Gogeta/Broly continua no botão dourado até chegarem os combos novos.

## v130 — efeitos de chão e finalização (referência: gameplay de FighterZ que o dono mandou)
- `FX2` (partículas próprias): nuvens de poeira com sombra na cor do cenário (`STAGE.dust`), pedras na cor do chão (`STAGE.peb`), grama voando nos cenários com grama (`GRASS`: verde, planet, look — cenário novo com grama: adicionar ali).
- Gatilhos em `fx2Tick`: corrida/dash, aterrissagem, queda no chão, deslizar ao tomar golpe, carregar ki (ventania com linhas de vento, poeira empurrada, pedras e grama subindo).
- v132: o dono NÃO quer pedras (desligadas: `rock()` não faz nada e partículas 'rock' não aparecem na luta). Zoom da finalização melhorado (`finOverlay`: escurecer bordas, linhas de velocidade, clarão; câmera acompanha o rival).
- (antigo v131) pedras = folhas desenhadas pelo dono (atlas em cinza, `RKA`), pintadas na cor do chão de cada cenário (`rockTex`). Usadas no FX2 e nas pedrinhas antigas.
- Finalização (`comboFinish`): último golpe de um combo de 4+ acertos (lança, pesado ou sem continuação) → zoom 1.45 na câmera, câmera lenta curta, linhas de velocidade, poeira e pedras.

## v133 — Madara (forma normal)
- **Regra nova do dono:** usar TODOS os quadros de cada folha, na ordem (são frames). Além das poses, ele manda folhas de **combo pronto** (8 quadros = um combo inteiro).
- Sistema profissional (`isMd`, `isPro`), golpes `mjab→mjab2→mknee→mstr` (lança), `mkick→mhkick`, `msweep`. Montagem: `seg_madara.py` (fundos preto, branco, cinza e transparente) + `build_madara.py`.
- Botões: Combo dourado = **combo pronto** (folha do dono: sobe com o rival e desce com soco, `mdc`); frente+Defesa = **agarrão** (não dá para defender, joga o rival por cima para o outro lado, `mdg`); Ki = **kunai** de longe (12 ki, imagem do dono); frente+Ki = **Bola de Fogo** saindo da boca (35 ki, GIF do dono; boca medida no quadro, `mo`), vira com o lado; baixo+Ki = corte de kunai (10 ki). Código: `mdStep`, `mdTick`, `drawMd`, `MDBOX`.
- v134: recortes corrigidos (chute que encostava no quadro vizinho; fumaça cinza do agarrão — fim do agarrão usa o agachamento do combo pronto). Aura própria do Madara (`mdAura`): pequena, transparente, chamas escuras finas — o dono não quer aura de Dragon Ball nele; sem a aura grande de ki, sem as linhas de vento e com luz fraca ao carregar.
- (v133/v134) Efeito de transformação era fogo; na v135 virou raio roxo.

## v135 — Madara com Rinnegan (transformação ocular)
- Material do dono: vídeo da transformação (olhos → Rinnegan, **com som**, música abaixa para .24), folha "combo 2" (2 linhas × 4 quadros em fundo cinza, com os rastros brancos) e vídeo do ultimate (Susanoo + meteoro, sem som).
- Transformação: botão Transformar (custo normal de barras) → `updMDT` toca o vídeo `MDV` (12 qps, 5 frames de jogo por quadro) e liga `f.form=1`. Mesmas poses (sid `md`), cor da forma roxa (`fe`), `FXT.madara` = raio roxo.
- Raios roxos em volta do corpo (`mdBolts`, desenhado dentro do `mdAura`); carregando ki: mais raios e faíscas. Velocidade ×1.85 (`speedMul`).
- A cada 3 golpes recebidos transformado (`d.mdN` no `applyHit`), o 3º é desviado: estado `mdv` = esquiva (pose dodge) → aparece atrás do rival → chute giratório (75 de dano, lança).
- Combo dourado transformado = **Combo do Rinnegan** (`mdc2`, anim `cmb2` da folha `m28`, 6 frames por pose): avança, prende o rival e acerta 45+50+45+55+130 (≈530 com bônus da forma).
- Botão vermelho transformado (100 ki + 3 barras de ki como os outros) = **Tengai Shinsei** (`mdSuper`/`updMDU`, vídeo `MDU` 112 quadros): acertos nos quadros 6,70,80,90,100 e golpe final no fim; rival termina caído.
- Montagem: `seg_md.py` (m28: tira a sombra cinza do último quadro) e `build_madara.py` com `ONLY=cmb2` (monta só uma animação; gera `md_ai_cmb2.json`). Teste: `ferramentas/testes/tmadara2.js`.
- Nomes inventados pelo Claude: "Combo do Rinnegan", "ESQUIVA + CONTRA!". "Tengai Shinsei"/"Rinnegan" vêm do Naruto.

## v136 — "COMBO FINALIZADO!" (pedido do dono, estilo FighterZ)
- `comboFinish`: pausa maior no golpe final (hitstop 32 ≈ meio segundo parado com o zoom), depois câmera lenta (slow 36) com o rival caindo; zoom dura mais (`finCam.m` 96).
- `finOverlay` desenha "COMBO FINALIZADO!" no alto da tela (entra com pulo de tamanho, faixa escura com linhas na cor do personagem) e embaixo "N GOLPES · X DE DANO".

## v137 — narração (áudios do dono) + nomes dos personagens
- 34 áudios do dono (narrador em inglês) em `SMP` com chave `v...` (ex.: `vEKO`, `vFantastic`, `vMVersus`). Toca por `nv(k,at,force)`: uma voz por vez (corta a anterior), sem repetir a mesma em 350 ms. Log de teste: `window.__nvlog`.
- Momentos: escolher modo = Challenge; "Lutar" = Challenge OK; tela VS = Versus; 1º golpe do round = First Attack; combo 3/5/8/12/16 = Impressive/Excellent/Amazing/Fantastic/Extreme; defesa perfeita = Reflected; 3 barras de ki cheias = Power Up; transformação = Max Burst; especial/combo dourado = Super Power; ultimate = Ultimate.
- K.O. (`koCall`): round que não acaba a luta = K.O. (ou Destruction se foi com especial/ultimate/smash). Último K.O.: ultimate/especial = Special Finish (Reverse Special Finish se o vencedor estava com menos de 25% de vida), combo dourado = Destruction Finish, smash = Smash K.O., combo de 8+ = Devastation, senão K.O. Empate = Double K.O.; vitória sem tomar dano = Perfect; round ganho = Victory/Winner.
- Resultado: vitória = "Player 1" + Win/Winner/Victory (emendados); Torre concluída = Congratulations; derrota = Game Over. Player 3–6 ficam guardados (não há 3+ jogadores).
- Nomes na seleção (`nm_<id>`): voz PRÓPRIA do jogo (não imita o narrador — o dono pediu "parecido"; o Claude recusa copiar voz real). Feita offline com Kokoro (modelo baixado do GitHub releases de thewh1teagle/kokoro-onnx; PyPI e HuggingFace bloqueados) com fonemas escritos à mão, mistura am_fenrir+am_eric, depois tom +32% (rubberband), compressão, brilho e eco (`ferramentas/narracao/names.py`). Personagem novo: adicionar o nome em IPA no dicionário `N` e rodar.
- Correção: o botão vermelho do Madara ficava escondido no começo da luta (lista do `startMatch`).

## v138 — vídeos sem som e mais rápidos (pedido do dono)
- **Regra nova do dono:** vídeos de super ataque e de transformação SEM som (todos). `gkPlay` não toca nada; sons de Qingqing/Zaykon/Zedry desligados (`if(0&&...)`). Música não abaixa mais durante os vídeos. (Substitui a regra antiga "Aokiji/Qingqing com som; transformações com som".)
- Transformação: vídeo no máximo ~3,2 s (`TVD(n,base)=min(base,192/n)` → `XXVD` = frames de jogo por quadro; `XXVE=round(n*XXVD)`), mais ~0,55 s depois do vídeo. Antes: Broly 9,5 s, Qingqing 8 s, Goku/Zaykon 7 s; agora todos ~3,7 s (Zoro e Madara 2,5 s).
- Ultimate: vídeo no máximo 5,5 s (`USP(n)` multiplica o tempo do vídeo `vt`; acertos e fim seguem o tempo do vídeo). Antes: Goku 12,9 s, Aokiji ~10 s, Madara ~9,9 s; agora todos ~6 s com a preparação. Teste: `ferramentas/testes/tduracao.js`.

## v139 — músicas novas
- 8 músicas do dono (vieram em .m4a, convertidas para .mp3 128k com volume igualado, loudnorm -15,5): Bring Me To Life, Numb (Linkin Park), On My Own, Rise, Judas, Hero’s Come Back, Blue Bird, Lovers. Entram em `MUS` (índices 4–11) e nos botões escondidos `#msel` (o menu "Selecionar Música" lê esses botões). "Aleatória" sorteia entre todas as 12.
- Menu de música: `#stPop` agora rola se ficar alto e fica por cima das fases (z-index).

## v140 — 4 cenários novos feitos só com vídeo
- Quartel Congelado (`marinha`), Vale da Caveira (`caveira`), Vila da Folha (`konoha`), Dojô do Jardim (`dojo`). Nomes inventados pelo Claude.
- Vieram só os vídeos (1648x544, ~3:1, mesmo formato do Verde/Cidade). `ferramentas/cenarios/build_cenario_novo.py`: imagem parada = começo do vídeo limpo + IA (2172 de largura); céu animado só onde o vídeo mexe dentro da faixa de cima (Caveira 420 px, Folha 230 px) SEM parallax (`VSTG.noPar`, alinhado ao mundo); recortes que se mexem (bandeiras, árvores) com fps/escala/loop limitados. Dojô: 6 q/s, escala .5, loop 4 s, com mistura entre quadros no `drawVid` (quando fps<10); chão do dojô esticado 130 px para baixo (os lutadores precisam de ~150 px de imagem abaixo do chão).
- `drawVid`/`vidImgs` aceitam cenário sem céu (sem `skyS`/`sky`). Altura do chão: `dy = 486 - fração*dh` (fração = onde pisam na imagem). Luz própria em `LT`; Dojô só tem clima limpo (é interno).

## v141 — GOJO (sid `gj`, id `gojo`)
- Material do dono: corpo inteiro + quadrada, 32 folhas de poses (`/home/claude/gj_build/sh/jNN.png`; j28 e j29 tinham 2 linhas e foram postas numa linha só antes de recortar; j29 = combo numerado de 16 quadros), GIF do Azul, vídeo da expansão de domínio, imagem do cenário do domínio, vídeo do ultimate.
- Recorte: `seg_gj.py` (cópia do seg do Madara, sem FIX; fundo por `gj_fundo.py`: PNG com alfa "falso" opaco é tratado como fundo branco). Montagem: `ferramentas/personagens/build_gojo.py` (REF = altura da guarda por folha; `ai` = Real-ESRGAN, ~25 min).
- Animações: relax j01, idle j02, walk j03, run j04, dashf j05, dash2 j07, dashb j30 (mortal), jab j08, cross j09, str j10, upper j06, kick j11, hkick j12, sweep j13, block j14, cblock j15, palm j16, dodge j18, jumpv j19, jumpd j20, hit j22, hhit/launch/lose j23, fall/drop j24, getup j25, pw/ki j26 (aura roxa já no desenho → aura genérica de carregar desligada), win j27, cmb2 j28, cmb j29 (16), seals j31, azul j32.
- Golpes: jjab→jjab2→jknee→jstr (lança). Combo dourado: normal = Combo do Mais Forte (`gjc`, 16 quadros, 12 acertos + final); transformado = Combo do Domínio (`gjc2`, folha j28). Ki = Azul (`gja`, 30 ki): bola azul (GIF convertido para brilho aditivo, atlas 520x234x12, desenhada com 'lighter') que anda, PUXA o rival e acerta 5 vezes.
- Transformação = Expansão de Domínio: vídeo `GJV` sem som (~3,2 s) → `form=1`, cenário vira `STG.dominio` (escondido da seleção com `hid:1`; `G.gjPrev` guarda o cenário e `gjDomEnd()` volta quando a forma acaba; novo round já troca). Aura azul própria (`gjAura`), velocidade ×1.85, a cada 3 golpes recebidos desvia sozinho (`gjv`, texto "INFINITO!", sem contra-ataque — o dono pediu só desviar).
- Ultimate (vermelho, transformado, 100 ki): vídeo `GJU` (Azul máximo), acertos nos quadros 12,24,38,46,64,72 e final; rival termina caído. Nome: "VAZIO ROXO" (v143).
- Voz do nome: `nm_gojo` (names.py). Nomes inventados pelo Claude: "O MAIS FORTE", "Combo do Mais Forte", "Combo do Domínio", "AZUL MÁXIMO", "INFINITO!". "Vazio Infinito" é o nome do domínio no anime.
- `__dbg.stg()` devolve a chave do cenário atual (para testes). Teste: `ferramentas/testes/tgojo.js`.

## v142 — Gojo: ajustes pedidos pelo dono
- Carregar energia (`pw`/`ki1`/`ki2`) = folha j32 (mão estendida → sinal com os dedos → olhos brilhando). A folha j26 (agachar com aura roxa) não é mais usada (o dono não gostou).
- Defesa agachada (`cblock`) = só o 5º quadro da folha de agachar (j15_4).
- Voar para frente = quadros 5 e 6 da folha de avanço j05 (`flyf`); voar para trás = quadros 5 e 6 da folha cinza j07 (`flyb`). Andar para trás no chão (`dashb`) = j07; mortal (j30) virou a esquiva automática (`flip`, estado `gjv`).
- Combo do Mais Forte: os acertos agora caem só nos quadros de golpe do combo numerado (2,3,5,6,7,8,11,12 e final no 13); avanço nos quadros 2 e 10. Chute alto do fim da corrente segura a pose de joelho antes do chute.
- `build_gojo.py ai` reaproveita `cache_ai.json` (quadros já feitos com IA), então trocar quadros de animação não precisa refazer a IA.

## v143 — Gojo: dash para trás limpo, ultimate novo e aura de fogo azul-claro
- Folha nova j33 (mesmo dash para trás sem os rastros que atrapalhavam) → `dashb` e `flyb` (quadros 5 e 6). REF 469.
- Ultimate trocado pelo vídeo novo do dono (Vazio Roxo, 63 quadros, 5,3 s, SEM acelerar: `vt` sem `USP`). Acertos nos quadros 24,28,32,47,51,55 + final. Banner "VAZIO ROXO". Quadros do ultimate antigo apagados.
- Aura transformado: usa a aura de fogo genérica (`drawAura`) em azul-claro (`#8fe2ff`), sempre no tamanho grande, com brilho reduzido pela metade (senão some o personagem no cenário claro do domínio) e sem raios. Sem transformar continua a aura suave `gjAura`.

## v144 — Gojo: aura do transformado pela referência do dono
- Substitui a aura de fogo genérica da v143. Atrás do corpo: GIF de chama azul do dono (atlas `GJAU`, 5 quadros 360x405, 'lighter', alfa .46; .62 carregando), virando de lado a cada 16 frames. Na frente do corpo (`gjFireFront`, chamado logo depois do `renderFighter`): raios azuis (`zArcs` azul, mais ao carregar) e fogo azul nas mãos (`gjHandFire`: brilho branco-ciano + línguas de fogo). A mão da frente vem do quadro atual (`rx/ry` do sprite); a mão de trás é estimada (58 px atrás) só em poses paradas/andando/defesa.

## v145 — Madara: perna bugada ao tomar golpe forte
- Na folha m12 (tomar golpe forte / ser lançado) o 4º quadro tinha "roubado" a perna direita e a mão do 3º quadro (os dois se encostam). Regra nova no `seg_md.py`: `'m12':[(3,2,(X<815)&((Y>352)|elipse da mão em (773,337)|((X<760)&(Y>318))))]`. Refeito só `hhit`/`launch` com IA (`ONLY=hhit,launch build_madara.py ai`).

## v146 — 7 personagens tirados do jogo (pedido do dono)
- Tirados: Denilson, Denilson 2.0, Lin Feng, Arkarus, White, Xiao Wyn e General Magmus. Saíram do `ALLC` (seleção, aleatório, Torre, CPU). Ficaram 12: Aylla, Zedry, Zaykon, Qingqing, Goku, Aokiji, Zoro, Broly, Vegeta, Gogeta, Madara, Gojo.
- O CÓDIGO deles continua no index.html (CH, SPRH, funções isXw/isWht/etc.) porque está muito misturado com o resto; só não aparecem mais. Os 529 arquivos de pose (66 MB) usados só por eles foram apagados de `www/a` — NÃO colocar eles de volta no `ALLC` sem refazer as poses.
- Trocas: escolha padrão = Gojo; luta de fundo do menu e pré-carregamento inicial = Gojo x Madara (antes Denilson x Lin Feng); fundos dos cartões de modo = Gojo, Goku, Madara, Vegeta; "A jornada de Denilson" → "Em breve".

## v147 — correção: Gojo (e Madara) invisíveis
- Na v146 o pré-carregamento inicial passou a ser `['gj','md']`, mas esse código roda ANTES de `SPRH.gj`/`SPRH.md` existirem no arquivo → `loadSid` guardava em `SPL` uma promessa vazia e nunca mais carregava as poses. Correção: `loadSid` não guarda nada se `SPRH[sid]` ainda não existe, e o pré-carregamento inicial roda num `setTimeout(0)` (depois do script inteiro).

## v148 — LUFFY (sid `lf` normal, sid `lfs` = Gear 4 Snakeman; id `luffy`)
- Material do dono: corpo inteiro + quadrada; 29 folhas normais (`/home/claude/novo_lf/poses/lNN.png`) + 25 folhas do Snakeman (`snake/sNN.png`), todas 2 linhas × 4 (cada folha virou 1 linha em `lf_build/sh/`); vídeo da transformação (`trans/video1.mp4`, 6,3 s) e do ultimate (`trans/ultimate.mp4`, 7,5 s). A folha l29 (Boundman) NÃO é usada: o dono quer o Snakeman.
- Fundos: quase todos com alfa; l12 tinha "xadrez" de transparência pintado (limpo à mão antes). Recorte `seg_luffy.py`; montagem `build_luffy.py` (gera `lf` e `lfs` juntos; `ai` ~40 min, cache em `cache_ai.json`).
- Golpes normais: ljab→ljab2→lknee (Pistol curto, folha do soco que estica)→lstr (gancho, lança). Snakeman: yjab→yjab2→yknee (soco forte com giro, 2 acertos)→ystr. Nomes de golpe `l*`/`y*` trocados automaticamente pela forma no `startMove`.
- Ki: `lfp` = Gomu Gomu no Pistol (braço de borracha desenhado em `drawLf`: linha da mão do quadro até o punho, estica e volta; frente+Ki = forte). Snakeman: braço vinho maior que faz curva e PERSEGUE a altura do rival (Culverin / Jet Culverin). baixo+Ki = `lfg` Gatling / Black Mamba (punhos borrados + vários acertos). Combo dourado = `lfc` (folha de combo pronto: l28 normal, s25 Snakeman).
- Transformação: vídeo `LFV` sem som → `form=1` (sid `lfs`), velocidade ×2.2 (a maior do jogo). Aura `lfAura`: Snakeman = bolinhas de fumaça lilás subindo devagar + raios vermelhos (`ZPAL.red`) discretos; carregando (qualquer forma) = GIF da chama do Gojo em cinza-claro, transparente ('screen'), como fumaça. Aura genérica de carregar desligada para ele.
- Ultimate (vermelho, só Snakeman, 100 ki): vídeo `LFU` "KING COBRA" (89 quadros, limitado a 5,5 s pelo `USP`), rival termina caído.
- Voz do nome `nm_luffy`. Nomes: Pistol, Gatling, Culverin, Jet Culverin, Black Mamba, King Cobra e Snakeman são do anime; "O REI DOS PIRATAS", "Combo de Borracha", "Combo da Cobra" inventados pelo Claude. Teste: `ferramentas/testes/tluffy.js`.

## v149 — Luffy: tamanho, soco de ar e raios vermelhos
- Tamanho: as folhas de luta (1774 px: l05–l17, l27, l28) vinham ~10% maiores que as de pé (conferido pela cabeça/chapéu) → REF ×1.11; l02 /1.03; l04 ×1.03; Snakeman SK .95→.87. Como o cache da IA guarda w/h antigos, a escala foi aplicada direto no JSON (`lf_ai2.json` → `lf_ai.json`); `build_luffy.py` já tem os fatores para quem refizer do zero (sem cache).
- O dono NÃO gostou do braço de borracha desenhado pelo Claude: removido. Ki = soco rápido (quadro esticado da própria folha) + rajada de AR (`LFAIR`, `lfAirTick`/`drawLf`: meias-luas brancas e linhas de vento; Snakeman vermelhas, com raios). Gatling: várias rajadas de ar pequenas (sem punhos desenhados). O dono disse que vai mandar um desenho de soco dele — usar no lugar quando chegar.
- Snakeman: raios vermelhos (`zArcs` ZPAL.red) sempre visíveis (até 5; 8 carregando).

## v150 — Luffy: socos mais fortes, mais rápidos e rajadas
- Corrente de socos agora tem 5 golpes: ljab → ljab2 → lknee (Pistol curto, alcance maior) → **lrap** (rajada: folha da Gatling, 4 acertos) → lstr (gancho, lança). Snakeman: yjab → yjab2 → yknee (2 acertos) → **yrap** (5 acertos) → ystr. Tudo mais rápido (su 2–3, rc 5–7) e com mais dano (~+15%).
- `move.lfAir`: 1 = sai uma rajada de ar visual no 1º quadro ativo; 2 = várias rajadas durante a rajada de socos (só visual, `nohit`). `lfHand` usa `spriteKey` fora dos estados especiais.
- Ki mais forte: Pistol 65/95, Culverin 82/110; Gatling/Black Mamba acertos 16/20 a cada 4 frames.

## v151 — Luffy: socos e chute novos do dono, braço desenhado pelo dono, Gatling estilo anime, sem voar normal
- Folhas novas (fundo marrom em degradê, tirado com `ferramentas/personagens/fundo_marrom.py`: cor puxada pro marrom + liga a partir da borda, protegendo vermelho saturado): l30 soco esticado (jab/ki1), l31 soco forte (cross/ki2), l32 chute (kick). REF = altura do quadro 0 / 1.03. Só essas animações foram trocadas no SPRH (o resto ficou com a escala da v149).
- Braço de borracha agora é o DESENHO do dono (tira de 4 quadros, `novo_lf/v2/braco.png`): recortado sem a manga, atlas `LFARMS` (L = braço comprido, S = punho curto; LH/SH = versões Haki vermelho-escuro para o Snakeman). Pistol/Culverin: `lfArmDraw` estica o braço (L) da mão até o alcance, punho na ponta, e volta. Gatling/Black Mamba: vários punhos (S) espalhados + puffs brancos com miolo cinza e arcos (`LFFIST`, `LFPUFF`, `lfPuff`) — imitando o GIF que o dono mandou (o GIF em si é cena do anime, não dá para recortar).
- Luffy normal NÃO voa (`startFly` bloqueia; mensagem "SÓ VOA NO GEAR 4"). Snakeman voa.

## v152 — Luffy: braço esticado desenhado REMOVIDO (pedido do dono)
- O dono não quer o braço esticado (nem o desenhado pelo Claude, nem o desenho dele esticado pelo jogo). Ki/Pistol voltou ao da v150: soco rápido + rajada de ar (`LFAIR`). `LFARMS`/`lfArmDraw` ficam no código mas o `lfArm` nunca é criado. Os punhos da Gatling (`LFFIST`) e os puffs ficaram (o dono aprovou "o resto dos efeitos").
- Snakeman: raios vermelhos também NA FRENTE do corpo (`lfBoltsFront`, chamado depois do `renderFighter`), além dos de trás.

## v153 — Luffy: super do normal + Snakeman divertido
- Luffy NORMAL ganhou super no botão vermelho (100 ki + 3 barras como os outros): vídeo do dono `LFU2` (93 quadros, sem som, máx 5,5 s), banner "GOMU GOMU NO BAZOOKA" (nome escolhido pelo Claude), acertos a 45–85% do vídeo + final 200; rival caído. `G.ws.lf` = 2 (normal) / 1 (King Cobra). `srReady` do Luffy não exige forma.
- Snakeman: golpes bem mais rápidos (su 1–3, rc 4–9); sempre quicando no chão parado/andando/correndo (`spriteFx`: pulo visual de 30–40 px com achatamento ao tocar o chão); dash para frente (toque duplo) = some (`lfb`, `hide`) e aparece atrás do rival com chute alto (`yhkick`), "ATRÁS DE VOCÊ!", 45 frames de espera; a cada 10 golpes levados (`lfHN`) ganha 3 esquivas (`lfDg`, estado `lfv`, "MODO ESQUIVA!"/"ESQUIVA!").
- Teste: `ferramentas/testes/tluffy_snake.js`.

## Pendências / ideias
- Vegeta transformado: faltam poses próprias de carregar ki, rajada de ki, soco e chute no ar (hoje usa grito da vitória, soco e chute alto). Se o dono mandar, trocar no `build_vegeta_blue2.py` e no mapa `A`.
- A segunda folha de "gancho para cima" do Vegeta transformado não foi usada.
- Efeitos desenhados pelo dono: ainda não chegaram.
- Nomes "Impacto do Príncipe" e "Clarão Final" foram inventados pelo Claude; o dono pode querer trocar.

## Observações
- Os scripts em `ferramentas/` foram escritos para a pasta temporária da sessão antiga; ajuste os caminhos (`/tmp/...`, `/home/claude/...`) antes de usar.
- Músicas e sons de efeitos são de jogos/animes com direitos autorais — o jogo é só para uso pessoal do dono.

## v154 — Luffy: frames "cortados" corrigidos
- l30/l31/l32 (soco1/soco2/chute novos): o zeramento de 30 colunas da borda cortava a capa. Recorte refeito: na faixa de 45px da borda só remove pixels marrom-escuros (fundo), capa preservada.
- 46 frames com borda reta cortada (fumaça/corpo tocando a borda do recorte) receberam fade de 18px nas bordas (lista em build: l01_3, l12_*, l14_*, l19_*, s01_3/4, s24_3/7 ...).
- Merge: só as posições (t,i) regeneradas foram trocadas em SPRH.lf/lfs (frames do cache têm tamanho pré-v149; NÃO substituir animações inteiras).

## v155 — otimização (sem perder qualidade)
- Conferido: o carregamento por partida (v125) continua funcionando — ao entrar numa luta, `freeUnused` solta poses e vídeos dos personagens que não estão nela (testado: Luffy/Gojo → Madara/Goku solta tudo do Luffy e do Gojo).
- Abertura mais rápida: o menu só precisa das poses paradas de Gojo e Madara → `loadAnims(sid,['idle'])` em vez de `loadSid` (antes carregava ~800 imagens antes de liberar o botão Batalha; abertura ~2x mais rápida). `freeUnused` agora solta também personagens carregados só em parte.
- Bloom: reduz a tela cheia 1 vez (antes 3) e multiplica com a cópia pequena (`BL3`) — mesmo resultado.
- Vídeos (transformação/ultimate, `gkFull`): decodifica os próximos 6 quadros em segundo plano (`img.decode()`) → menos travadinhas.
- Névoa (`drawHaze`) não desenha a camada quando o alfa é 0 (clima neblina).
- `dominio` (Gojo) fica carregado durante as lutas dele (antes era solto no começo do round e recarregado na hora da expansão). `G._mids` = ids da partida (gravado em `prepMatch`).
- Bug: se os dois apertassem transformar no mesmo instante, um ficava preso no estado 'transform' (invencível, parado). `startTransform` agora recusa se já há outra transformação (`return false`).
- Debug: `__dbg.prepMatch`, `__dbg.render`, `__dbg.vmem()` (quadros de vídeo carregados).

## v156 — RENGOKU (sid `rg`, id `rengoku`)
- Material do dono: 2 imagens de referência, 18 folhas (`/home/claude/novo_rg/sh/r01..r18`; as de 2 linhas viraram 1 linha em `rg_build/sh/` separando pelas formas inteiras), GIF de aura azul, vídeo da transformação (4,1 s) e do ataque final (8,1 s). Fundo já transparente.
- Recorte `ferramentas/personagens/seg_rg.py` (alfa direto + watershed; fagulhas soltas vão para a pose mais perto). Escala de cada folha pelo TAMANHO DO ROSTO (área de pele no rosto → `S.json`, "altura de pé equivalente"; algumas corrigidas à mão no `build_rengoku.py`). Montagem `build_rengoku.py` (`ai` ~14 min, cache `cache_ai.json`); depois `post_rg.py` (camada de fogo + pontos de fagulha) e `patch_rg.py` (cola `rg.js` no index — só para montar do zero a partir do index anterior).
- Espada: guarda e ponta marcadas À MÃO em 38 quadros (`sword.json` → campo `sw` do quadro: [guardaX, guardaY, pontaX, pontaY] em unidades do jogo, x para frente, y para cima). `rgSword`: brilho na lâmina + línguas de fogo + rastro de fogo que segue a ponta quadro a quadro. Normal: fogo só nos golpes de espada/técnicas (`move.rgSw`); transformado: sempre.
- Fogo que já vem desenhado (folhas r04, r05, r14, r18): camada só do fogo (`fl`, desenhada com 'lighter' piscando) + pontos `fp` que soltam fagulhas (`rgDrawnFire`).
- Golpes (prefixo `k`): kjab (r01) → kjab2 (r02) → kknee (r04, corte de fogo) → kstr (r05, arco de fogo, lança); chute r13 (kkick→khkick lança); baixo+chute = r10 (rasteira deslizando). Ki = Primeira Forma (`rgs`, onda de fogo recortada da arte do dono r04_4, `RGWV`); baixo+Ki = Segunda Forma (`rgu`, arco subindo, lança perto). Combo dourado = Combo da Chama (`rgc`, folha r18 de 16 quadros, 9 acertos + final que joga no chão).
- Andar/correr/dash com espada embainhada (folhas do dono); longe do rival fica de pé (`relax` r16_0) e saca a espada ao se aproximar (`gin` = r07); guarda = r03.
- Transformação = "Espírito da Chama" (nome do Claude): vídeo `RGV` sem som (~3,2 s), aura = GIF do dono recolorido para vermelho/laranja (`RGAU`, desenhado normal + um pouco de 'lighter' — só 'lighter' ficava rosa em cenário azul), velocidade ×1.9, dano ×1.45 (padrão da forma) e golpes 40% mais rápidos (`f.racc`). Golpes transformado = QUEIMADURA (`rgBurn`: 2,5 s, 5 de dano a cada 15 frames, rival com fogo por cima `rgBurnDraw`).
- Ultimate (vermelho, normal ou transformado, 100 ki): vídeo `RGU` "NONA FORMA: RENGOKU" (97 quadros, máx 5,5 s pelo `USP`), acertos a 45–85% + final 240 + queimadura; rival caído.
- Voz do nome `nm_rengoku`. Retrato/tela VS a partir das 2 imagens de referência. Teste: `ferramentas/testes/trengoku.js`.
- Nomes: Primeira Forma, Segunda Forma, Nona Forma: Rengoku são do anime; "Espírito da Chama", "Combo da Chama", "O HASHIRA DAS CHAMAS" do Claude.

## v157 — zoom do combo enquadrando os dois + Rengoku mais fluido
- Zoom da finalização (`finFrame`, chamado pelo `camDirector`): antes dava zoom em volta de um ponto da tela (o ponto ficava parado e o rival podia sair do quadro). Agora calcula uma caixa com os dois lutadores + o ponto do golpe, escolhe o zoom que cabe (1.08–1.7) e CENTRALIZA de verdade (`zx=(VW/2-sx*z)/(1-z)`, limitado a 0..VW). Primeiros 7 frames: soco de zoom no ponto do golpe (+0.28); depois abre para mostrar os dois. Perto da parede o enquadramento fica limitado pela borda do cenário.
- Rengoku: 5º golpe na corrente de socos — `kfire` (corte flamejante = quadros 2–7 da folha do combo, 2 acertos); corrente: kjab → kjab2 → kknee → kfire → kstr. Cada corte dá um passo à frente (`move.rgPush`), som de espada (`furi`/`sgrd` do Zoro), marca de corte no ponto do golpe (`RGSL`), rastro da espada mais longo com núcleo branco, e o quadro anterior desbota por 3 frames por cima do novo (`rgTween`) para o movimento ficar mais fluido.

## v158 — Rengoku não voa
- Pedido do dono: o Rengoku só pula. `startFly` não faz nada para ele (o botão de voar vira pulo; segurar para cima no ar não voa); a CPU também não voa com ele. O Super Dash depois de lançar vira um SALTO na direção do rival (`trySD`, texto "SALTO!").

## v159 — CIDADE DAS CÚPULAS (`cupula`): cenário com dia/noite e destruição
- Material do dono: 3 imagens 2172x724 alinhadas — inteiro (A), pouco destruído (B), muito destruído (C). Pedido: lutadores grandes como no zoom do combo, cenário com MENOS zoom, dia/noite e destruição depois de especiais, "de uma nova maneira".
- Montagem `ferramentas/cenarios/cupulas_prep.py` (pasta `/home/claude/cup`): IA 2x → imagem 3000x1000 por nível; camadas extras por nível: janelas que acendem (vidro azul-claro, 60% das janelas sorteadas), estrelas e céu da noite/pôr do sol (só no céu ligado ao topo), fogo desenhado só no C (camada que pisca + fagulhas). Gera `cup.json`; `patch_cup.py` cola `dn.js` no index (a partir do index anterior).
- Câmera: cenário `dn:1` tem `camMax` próprio (1.75; antes 1.32 para todos) e margem menor no `updCam` → lutadores bem maiores. O cenário inteiro é desenhado com zoom fixo ~0.9 (independente do zoom dos lutadores), preso na linha dos pés (FLOOR) e com paralaxe 0.8 → mostra muito mais cidade. O chão abaixo da imagem é a última faixa esticada. `finFrame` limita o zoom do combo a 2.5/CAM.z.
- Dia/noite (`DN.ph`, volta inteira em 2 min de luta, começa num horário sorteado): paleta `DNK` (manhã → dia → pôr do sol → noite → madrugada) multiplica o cenário; à noite: céu escuro, estrelas, lua, janelas e postes acesos; a luz dos lutadores (`LT.cupula`) muda junto e o `drawLit` escurece/alaranja os lutadores (`STAGE.night`/`STAGE.sunset`).
- Destruição (`DN.pts`): especial/combo pronto +1, transformação +1, ultimate +3 (aplicado quando o vídeo acaba). 3 pontos = nível 1 (imagem B), 7 = nível 2 (C). Troca com fumaça/fade de ~0,8 s, tremor, pedaços caindo, banner "O CENÁRIO ESTÁ SE DESTRUINDO!"/"CIDADE EM RUÍNAS!", fumaça subindo dos prédios. Volta ao inteiro a cada round.
- Só este cenário usa o sistema novo (`STAGE.dn`); os outros continuam iguais. Para outro cenário assim: 3 imagens alinhadas do dono + rodar o prep e adaptar `CUPF0` (linha do chão) e os pontos de fumaça/postes.

## v160 — Cidade das Cúpulas: tamanho dos lutadores como no FighterZ
- O dono achou os lutadores grandes demais na v159 (ocupavam ~80% da altura da tela). Agora o cenário `cupula` tem `camMax:1.15` e `camMin:.9` (zoom pode ficar abaixo de 1 quando se afastam) → lutador ~45% da altura da tela, parecido com o Dragon Ball FighterZ. `updCam` usa `STAGE.camMin`; `camReset` começa no `camMax` quando ele é menor que 1.

## v161 — só a Cidade das Cúpulas, todos do mesmo tamanho, realce no gráfico
- Pedido do dono: apagar TODOS os cenários menos a Cidade das Cúpulas (os novos virão no mesmo estilo). `STG` só tem `cupula` (+ `dominio`, escondido, que é a expansão de domínio do Gojo). `VSTG={}`, `STH` só com a cúpula. Os blocos de dados dos cenários antigos (`ST18`, `ST19`, `NMK`, `ST4`, `LT`, `LIFE`, `GRADE`) continuam no código mas não carregam nada (`if(0)` nos carregadores). 253 arquivos (26 MB) apagados de `www/a`. Menu, fundo do cartão de modo e cenário padrão = `cupula` (o `stageLoad('cupula')` inicial roda num `setTimeout(0)` porque `CUP` é definido depois).
- Mesmo tamanho: `SZK` (fator por sid) + `sizeNorm()` escala os dados dos quadros (w,h,ax,ay,rx,ry,sw,hand,mo,fp) uma vez no início (antes do pré-carregamento). Alvo: altura de pé ~265 (Aokiji/Zoro/Broly/Luffy/Rengoku menores, Gojo maior). As hitboxes dos golpes (calculadas antes) quase não mudam. Comparação: `/tmp/opt/lineup.js` (desenha todos lado a lado).
- Gráfico: no `drawLit`, o lutador recebe uma cópia dele mesmo em 'soft-light' (alfa .38) → mais contraste e cor, sem mudar o desenho (`G.noPop` desliga).
- Testes agora usam `data-s="cupula"`.

## v162 — PLANETA NAMEKUSEI (`namek`) + motor de cenário genérico
- Material do dono: 5 imagens alinhadas (inteiro → totalmente destruído; as 3 primeiras 2170x725, as outras 2172x724 — o prep redimensiona tudo para 2172x724).
- Motor genérico (`ferramentas/cenarios/dn2.js`, substitui o bloco da v159): dados por cenário em `DNS[chave]` — `L` (níveis), `thr` (pontos para cada nível), `smk` (pontos de fumaça por nível, coordenadas da imagem 2172x724), `lamps`, `moon`, `feet`, `day` (segundos de um dia inteiro), `names` (aviso de cada nível). Cenário novo assim: imagens `L0..Ln.png` + IA (`B0..Bn.png`, 3000x1000) → `prep_dn.py <pasta> <saida.json> <linha_do_horizonte>` → acrescentar a entrada em `DNS` e o `STG` (dn:1, `dy=486-linha_dos_pés*1.2`) no `patch_dn.py`.
- Destruição agora por PARTIDA (não volta a cada round): golpe pesado recebido (heavy/lança/smash, sem `lock`) +1, especial +2, transformação +2, ultimate +5. Namek: níveis com 4/10/18/28 pontos; Cúpulas: 7/18. Céu do Namek: máscara pela cor do topo (verde), o sol some à noite e vira lua.
- Dia: começa de madrugada (ph .955) no 1º round e um dia inteiro dura 6 min (amanhece, dia, entardece e escurece ao longo da partida). A luz de dia de cada cenário vem do `LT[chave]` (guardada em `L._d`).

## v163 — cenários: destruição mais lenta e "mini vida"
- Destruição: golpe pesado agora vale 0,5; especial/transformação 2; ultimate 5. Níveis: Namek 6/15/26/40 pontos e o nível 4 exige 1 ultimate e o 5 exige 2 (`ug`); Cúpulas 9/24 e a ruína total exige 2 ultimates. `DN.ults` conta ultimates da partida.
- Vida (`dnLife` no `dn2.js`, dados `DNS[k].life` gerados por `prep_life.py`): copas das árvores recortadas da imagem IA (atlas por nível, coordenadas da imagem 2172) desenhadas por cima balançando no vento (giro pequeno pela base, escala 1.045 para cobrir a original); brilhos piscando na água do Namek; fogo desenhado ganha chamas animadas (GIF de fogo `RGAU` nos focos, agrupando os pontos `fp`); bandos de pássaros de dia. Tudo leve (só desenhos pequenos).

## v164 — FORTALEZA DE GELO (`gelo`)
- 5 imagens do dono (fortaleza da Marinha no gelo, inteira → em ruínas), pasta `/home/claude/mar`. Prep: `FMIN=2 SKYD=90 SKYL=0 python3 prep_dn.py /home/claude/mar mar.json 300` (fogo desenhado a partir do nível 2; céu só pela cor azul-escura do topo, sem pegar o gelo claro). `prep_dn.py` ganhou essas opções (`FMIN`, `SKYD`, `SKYL`).
- `DNS.gelo`: pés na linha 610 da imagem (`dy=486-610*1.2`), níveis 6/15/26/40 (4º exige 1 ultimate, 5º 2), fumaça por nível, avisos próprios, `snow:1` = neve caindo leve (`DNF`, até 70 flocos) desenhada no `dnLife`. Fogo animado nos focos (mesmo do Namek). Sem árvores.

## v165 — NARUTO (sid `nr` normal, sid `nrk` = Modo Kurama; id `naruto`)
- Material do dono: 3 imagens de referência; 16 folhas normais + combo (n17) + combo dos clones (n18); 17 folhas do Modo Kurama + combo (k17) + combo numerado (k18); vídeo da transformação (5,7 s — o dono pediu SEM acelerar: `NRVD=5`); vídeo do super (Bijuu Dama, 8,2 s, acelerado pelo `USP`); GIF de aura (azul).
- Recorte `seg_nr.py` (fundos transparente/preto/cinza/fumaça; k05 e k14 com fumaça: só pixels saturados ou contorno; combos de 2 linhas cortados em grade 8x2, tira números do k18 e pedaços do quadro vizinho). Montagem `build_naruto.py` (escala por folha pela altura da guarda/pé; chão por LINHA nas folhas em grade; `ai` ~26 min). `patch_nr.py` cola `nr.js` no index anterior.
- Golpes prefixo `n` (normal) e `o` (Kurama: mesmos golpes, ~45% mais rápidos, +15% dano, `f.nacc`): jab→jab2→knee→str (lança); kick→hkick (lança). CLONES DAS SOMBRAS: `move.nrCl` — knee/kick chamam 1 clone (2 Narutos), str/hkick chamam 2 (3 Narutos). Clone = cópia do sprite do Naruto com atraso (histórico `f.nrH`), aparece e some em fumaça (`NRPF`); cada acerto do Naruto gera acertos extras dos clones (`NRHQ`, 38% do dano). No Kurama os clones têm a aura dourada.
- Ki: normal = shuriken (`nrs`, 8 ki); Kurama = Rasengan (`nrr`, 35 ki, avança e lança). Baixo+Ki = Jutsu de Substituição (`nrsub`, 20 ki: tronco no lugar, aparece atrás do rival e ataca). Combo dourado = Combo dos Clones (n18) / Combo da Kurama (k18) (`nrc`).
- Modo Kurama: velocidade ×2.1, dash = teletransporte (`nrTeleDash`, para frente para na frente do rival; para trás também), a cada 3 golpes recebidos desvia (some e aparece atrás) e dá um soco (`nrv`, "ESQUIVA!"). Aura = GIF do dono em amarelo-fogo (`NRAG`); carregando no normal = GIF azul-claro (`NRAB`, sem aura fora disso). Botões no Kurama: tema `firebolt` (chama amarela + raios azuis) no `drawBtnFx`.
- Ultimate (vermelho, só Kurama): vídeo `NRU` "BIJUU DAMA", rival caído. Não voa (igual Rengoku). Voz `nm_naruto`. Teste `ferramentas/testes/trnaruto.js`.
- Nomes: Clones das Sombras, Substituição, Rasengan, Modo Kurama, Bijuu Dama são do anime; "Combo dos Clones", "Combo da Kurama", "O NINJA DA FOLHA" do Claude.

## v166 — VILA DA FOLHA (`folha`)
- 5 imagens do dono (2132x737, redimensionadas para 2172x724 no prep), pasta `/home/claude/folha`. Prep: `FY=700 HZL=250,250,250,250,150 FMIN=3 SKYD=110 SKYL=0 python3 prep_dn.py /home/claude/folha fol.json 250` (`HZL` = horizonte por nível — o último tem céu escuro parecido com a montanha; `FY` = até onde procurar fogo desenhado). Árvores: `prep_life.py folha life_f.json B0..B4`.
- `DNS.folha`: `ph0:.78` = começa de NOITE, passa pela madrugada, clareia, dia, entardece e escurece (dia de 5 min, `day:300`); destruição igual à do Namek (6/15/26/40 pontos, nível 4 exige 1 ultimate e o 5 exige 2); `rain:1` = no nível final cai uma chuva fraca (70 gotas finas, alfa .28, `DN.rn`).
- Ordem para remontar o index: index da v161 → `patch_dn.py` → `patch_nr.py nr_ai.json` (o `patch_dn` aplica o motor e TODOS os cenários dn).

## v167 — Naruto: ajustes pedidos pelo dono
- O combo dos clones da folha n18 foi TIRADO (o dono achou ruim). Combo dourado do normal = folha n17 (`cmb1`, 16 quadros) — no meio dele aparecem 1 e depois 2 clones (os clones copiam os quadros do combo).
- Modo Kurama: as chamas que já vêm desenhadas nos quadros ganham movimento (`post_nr.py` gera a camada `fl` só das chamas laranja + pontos `fp`; `nrFront` desenha 2 cópias em 'lighter' ondulando/piscando e solta fagulhas). Ordem de montagem: `post_nr.py nr_ai.json nr_ai2.json out_ai` e depois `patch_nr.py nr_ai2.json`.
- Socos/chutes: passo à frente em cada golpe (`move.nrPush`), impacto próprio (`nrImpact`: anel/faíscas brancas; douradas no Kurama), quadro anterior desbotando por cima (`rgTween`, igual ao Rengoku).
- Clones: entram deslizando de longe com um "pulo", piscam branco ao aparecer, anel de fumaça, avançam junto no golpe (`c.lg`) e somem num "puf" maior.
- Defesa: a cada 3 golpes defendidos, 65% de chance de Jutsu de Substituição (`nrLog`): fica o TRONCO da folha do dono (último quadro de `subst`; no Kurama o tronco dourado) no chão, ele aparece 250 px para trás, "SUBSTITUIÇÃO!". O baixo+Ki também usa o tronco da folha agora.

## v168 — botões e HUD personalizados por personagem (artes do dono)
- O dono manda 1 imagem de tela inteira (1670x942) por forma (normal e transformado) com o HUD (barra de vida, retrato, timer) e os botões. Só a APARÊNCIA muda — a posição/tamanho/função dos botões continua a mesma (o dono pediu para ignorar o que cada desenho mostra).
- `ferramentas/web/prep_hud.py` (artes em `ferramentas/web/hud_artes/<id>/`): tira o fundo (transparente, branco ou preto), acha os botões pelo círculo (Hough) e associa por POSIÇÃO: esquerda de cima p/ baixo = bFly, bTr, joystick; direita: maior = bSr, linha de cima = bBl, meio = bKi/bSp, baixo = bKick/bPunch. Joystick: base sem o centro + o centro vira a bolinha (`--kimg`). HUD: metade esquerda (P1) e direita (P2) em versão cheia e "vazia" (barras escurecidas); barra verde = vida, amarela/ciano = ki, verdinhas pequenas = rounds ganhos; timer sem o ∞. Gera `hud.json`; `patch_hud.py` cola `hud.js` (index anterior).
- No jogo (`HUDA`, `hudArtDraw`, `hudArtTimer`, `btnSkin`): cada lado usa a arte do SEU personagem (rival com arte → HUD dele do lado direito); sem arte = HUD antigo. As barras enchem cortando a versão cheia. Energia (6 barras) = losangos ciano embaixo; nome embaixo. Transformado: fogo e raios subindo do contorno do HUD (`HUTH` cores: Naruto amarelo, Rengoku vermelho-laranja com raios vermelhos SÓ no botão Ultimate, Gojo roxo). Botões: `#controls.cus` (imagem 100% do botão), piscada branca ao trocar de forma, fogo/raios do `drawBtnFx` (tema `firebolt` com cor dos raios `bc`).
- Personagens com arte: Naruto, Rengoku, Gojo.

## v169 — HUD: rival sem arte e retratos
- Rival SEM arte própria agora usa o HUD do jogador (metade direita da arte do P1) em vez do HUD antigo (o dono achou que ficava "bugado" misturado). Fogo/raios do HUD só aparecem em quem tem arte própria.
- O círculo do retrato da arte agora mostra a foto do personagem (`IMG[id]`), espelhada do lado direito, com escurecer no K.O. e vermelho ao tomar golpe. Transformado usa `PORTF[id]` se existir (Naruto Modo Kurama = rosto recortado da imagem do Kurama do dono); senão a foto normal. Centro/raio do círculo: `pc` de cada metade no `hud.json` (achado por Hough).

## v170 — HUD de vida ANTIGO de volta (pedido do dono)
- O dono achou o HUD de vida das artes "bugado": `HUDA_ON=false` desliga `hudArtDraw`/`hudArtTimer` (barra de vida, ki, energia, retrato e timer voltam ao desenho antigo). Ficam SÓ os botões e o joystick das artes (normal/transformado, com fogo/raios nos botões).

## v171 — MODO TORRE NOVO (7 andares, passivas, troféus, ranking online)
- Artes do dono: `torre/tela.png` (tela da torre, 1671x941: 7 janelas pretas, coroa, círculo vermelho, botões INICIAR TORRE/VOLTAR desenhados) e `torre/cartas.png` (9 cartas: Naruto, Rengoku, Luffy, Gojo, Madara, Aokiji, Goku, Gogeta, Zoro). Cartas recortadas sem a moldura (proporção 3.8, 570x150) → `assets.json`. Personagens sem carta (Vegeta, Broly, Aylla, Zedry, Zaykon, Qingqing) NÃO entram como rivais.
- Código: `ferramentas/web/torre/` (`torre.js`, `torre.css`, `assets.json`) + `ferramentas/web/patch_torre.py <index> <pasta com torre.js/torre.css/assets.json/out>` (aplicar por cima da v170). Teste: `ferramentas/testes/ttorre.js` (simula o Firestore).
- Fluxo: Menu → Torre → escolhe o personagem (aba Rival, dificuldade, time e vidas escondidos) → Próximo abre a tela `#tower`. O jogador fica em pé no círculo vermelho (`fullSrc`). INICIAR sorteia 7 das 9 cartas (sem o próprio personagem); andar 1 = janela de baixo, andar 7 = chefe (debaixo da coroa). Cada rival é revelado (carta vira) só quando o anterior morre; ao vencer, a carta fica cinza e um X vermelho é riscado.
- Cada andar = 1 luta de 1 round (2 barras de vida), cenário/música/clima sorteados. Vida que sobrou continua; depois de vencer recupera 60%. Dificuldade: IA `G.diff` 0,0,1,1,2,2,3 (`LV[3]` novo, mais agressivo), rival bate +7%/andar e aguenta um pouco mais; chefe aguenta 1/0.6 do dano e começa TRANSFORMADO (`twBossGo` chama `startTransform` no "Lutar!"). Perder = fim da subida (começa do zero).
- Passivas (3 opções: vida, dano, velocidade; raridade sorteada para cada): comum 55% (+8/+5/+4%), rara 28% (+15/+10/+8%), épica 13% (+25/+18/+13%), lendária 4% (+40/+30/+20%). Acumulam. Vida = `p.tdf` (toma menos dano), dano = `p.tdm`, velocidade = `p.tsp` (`speedMul`).
- Troféus (`TWTR`, soma pontos 🏆): Vitória +1 (todo andar), Relâmpago <30s +2, Intocável sem perder vida +3, Por um Fio <15% vida +2, Mestre do Combo 10+ golpes +1, Ultimate! +1, Caçador de Chefe +3, Rei Relâmpago chefe <60s +4, Torre Conquistada +5, Speedrun torre <6 min +5, Bênção Lendária +1. Contagem total guardada em `tw_tc`.
- Recordes: no aparelho `tw_rec` (melhor), `tw_hist` (15 melhores), `tw_nome`. Ordem: mais andares → mais troféus → menos tempo (`twPts`).
- Ranking online: Firebase do dono, projeto `furia-do-templo` (plano Spark grátis), Firestore coleção `torre`, via REST (sem SDK): grava `nome, andar, tempo, trof, pontos, char, v`; lê `runQuery` ordenado por `pontos` (150, mostra 50, 1 por nome). Regras publicadas: ler livre; criar só com nome texto ≤16, andar int ≤7, tempo int; ninguém edita/apaga. A apiKey do app Web fica no código (é normal, não é senha). Na 1ª vez pede o nome; depois envia sozinho no fim de cada subida.

## v172 — Torre mais difícil: barras de vida
- Vida por fighter: `f.mhp` (antes só o global `MAXHP`). HUD conta os pontinhos por `f.mhp/LAYER` e tem cores até 7 barras (verde, amarelo, rosa, roxo, azul, vermelho, dourado). "PERFEITO" e o tempo esgotado comparam a FRAÇÃO da vida (`hp/mhp`).
- Jogador começa com 4 barras (`TWPB`). Rivais por andar `TWOB=[2,3,3,4,5,6,7]` (chefe = 7). Rival bate +8%/andar; chefe bate ×1.6, aguenta ×1/0.85, velocidade ×1.12, IA `LV[3]` quase perfeita (react 3, agg .97, blk .88). Tempo da luta = 60+20×barras do rival (máx. 240; chefe 200).
- Cartas: 30% de chance (se tiver menos de 7) de uma das 3 virar "💚 BARRA DE VIDA +1" (épica ou lendária). A vida guardada é absoluta (`TW.hpv`); cura de 60% do máximo depois de cada vitória.

## v173 — Torre: menos barras, mais velocidade/dano/IA
- Pedido do dono: 7 barras era demais. Rivais `TWOB=[2,2,3,3,3,4,4]` (andares 6 e 7 com 4). Jogador continua com 4 (+ carta de barra extra até 7).
- A dificuldade agora vem de: velocidade do rival `o.tsp=1+.045×andar` (chefe ×1.3), dano `o.tdm=1+.07×andar` (chefe ×1.55, aguenta ×1/0.85), e IA própria por andar `TWLV[0..6]` (reação 16→2, agressividade .55→.98, defesa .4→.9, combos .6→1, pausas 16→0) — `aiThink` usa `twLV()||LV[G.diff]`. `G.diff` (usado nas chances de super/transformar) = 1,1,2,2,2,3,3.

## v174 — Ranking separado (Tempo / Troféus), tempo zerado, passiva MÍTICA
- Ranking com 3 abas: ⏱ TEMPO (mais andares, depois menos tempo — `twCmpT`), 🏆 TROFÉUS (mais troféus, depois mais andares — `twCmpF`), MEUS RECORDES (aparelho). 1 linha por nome (melhor de cada aba). Busca 300 docs ordenados por `pontos` e reordena no aparelho; cache 30 s.
- "Reset do tempo" pedido pelo dono (o jogo ficou mais difícil): NÃO dá para editar o Firestore daqui (proxy bloqueia e as regras não deixam editar). Feito no jogo: recordes criados antes de `TWCUT` (2026-11-07 21:00 UTC) ou com `v<174` ficam com tempo "--:--" e NÃO entram no rank de tempo; os troféus deles continuam valendo no rank de troféus. Envio agora manda `v:174`.
- Raridade nova MÍTICA (`mit`, 1%: +65% vida/+45% dano/+30% velocidade, borda que troca de cor). Lendária caiu para 3%. Troféu "Bênção Mítica" 🔮 +3.

## v175 — nome obrigatório na 1ª torre
- Ao tocar INICIAR TORRE sem `tw_nome` salvo, abre `twAskName` ("SEU NOME NA TORRE", mín. 2 letras, máx. 16, sem < >). Só depois de confirmar a subida começa. O nome ainda pode ser trocado no campo do fim da subida.

## v176 — Ranking por PERSONAGEM
- Fim da subida mostra o personagem usado (foto + nome); nas linhas do ranking o nome do personagem aparece embaixo do nome do jogador.
- Aba nova 🥷 PERSONAGEM: fileira com todos os personagens (começa no que você usou); busca no Firestore `where char == id` (índice simples automático, até 500 docs) e SOMA por nome: torre completa = 20 pontos (`TWPC`), subida que não terminou = 1 ponto por andar vencido. Mostra 👑 torres completas, ⭐ pontos e nº de subidas. Cache 30 s por personagem.

## v177 — fim do combo infinito na parede
- Bug usado na Torre: com o rival encostado na parede ele não era empurrado e ficava preso em "hit" no chão (Luffy chegou a 198 golpes seguidos, Goku 47). Teste: `ferramentas/testes/tparede.js <personagem> <punch|kick>` (rival no canto, sem IA, aperta o golpe 360 vezes; mostra o maior combo).
- `ferramentas/web/patch_combo.py <index>` (aplicar DEPOIS do `patch_torre.py`):
  1. Empurrão na parede: golpe (não beam/lock) com o rival a ≤80 px da parede empurra QUEM BATEU para trás (6 + kb×1.2, máx. 22 px).
  2. `comboBreak`: se o lutador fica apanhando (hit/airhit/down) mais de 200 quadros seguidos (~3,3 s) ou leva 24 golpes seguidos (`stunH`), ele ESCAPA: invencível 75 quadros, rival empurrado 140 px, texto "ESCAPE!". Não conta durante cinemáticas (cine/trans/comic/rush/sc).
- Depois: Luffy máx. 23, Goku 5 no canto.
- Ordem completa para remontar: index da v170 → `patch_torre.py` → `patch_combo.py`.

## v178 — quem não voa + Broly mais forte
- `noFly(f)` = Rengoku, Naruto, Zoro, Aokiji (Luffy normal já não voava; Gear 4 voa). `startFly` vira pulo, Super Dash vira "SALTO!", teletransporte não deixa flutuando. Quem voa: Goku, Vegeta, Gogeta, Broly, Madara, Gojo, Aylla, Zedry, Zaykon, Qingqing, etc. Teste `ferramentas/testes/tvoo.js <personagem> <rival>`.
- Broly: andar 4.3→5.3, força 1.15→1.32, velocidade normal ×1.12 e transformado ×2.0 (era 1.8), golpes mais rápidos (normal +30%, transformado +80%, era +55% só transformado). ARMADURA: atacando, aguenta golpes leves sem ser interrompido (2 no normal, 4 transformado; depois recarrega 3 s; não vale contra pesado/lançador/beam/cinemática), texto "ARMADURA!".
- `patch_v178.py` (depois do `patch_combo.py`). Também põe `applyHit` no `__dbg`.

## v179 — ZORO NOVO (golpes das folhas do dono, estilo Rengoku)
- Material: 4 folhas (`/home/claude/novo_zr`): z1 corte com 1 espada (6), z2 corte com 2 espadas (6), z3 investida (6), z4 combo transformado (20, fundo xadrez claro → `seg_zr4.py`) + GIF de aura azul.
- `ferramentas/personagens/zoro/`: `seg_zr4.py` (fundo da z4), `seg_zr.py` (linhas → colunas iguais; corpo por watershed com 1 semente por coluna, efeito verde fica com a coluna), `build_zoro.py` (escala: postura do quadro 0 = 225 unidades antes do `SZK` do zr; âncora no quadril; chão = bota mais baixa da linha; IA 2x; gera camada SÓ do efeito verde `fl` + pontos `fp`) → `zr_new.json`; `zr.js`; `patch_zr.py <index> <pasta_build>` (depois do v178). Aura: GIF recolorido para verde `a/9ddf09d051c5cc.webp` (5 quadros 360x381).
- Animações novas em `SPRH.zr` e `SPRH.zrf` (mesmos quadros): `c1`, `c2`, `dsh`, `cmb`. Golpes com `move.zv=[anim,[inicio],[ativo],[recuperação]]` (o `spriteKey` chama `zrKey` antes de tudo).
- Golpes: soco = `zp1` (corte 1 espada, 2 acertos) → `zp2` (2 espadas, 3 acertos) → `zp3`; chute = `zp3` (INVESTIDA: corre `zDash` 15, lança). Passo à frente (`rgPush`), quadro anterior desbotando (`rgTween`), marca de corte verde (`ZRSL`), som de espada.
- Brilho da espada com movimento (`zrFront`): camada do efeito piscando/ondulando em 'lighter', raios verdes saindo dos pontos `fp` (transformado: também roxos) e fagulhas verdes.
- Velocidade/dano: andar 4.5→5.8, força 1.1→1.25, velocidade ×1.15 normal / ×1.95 transformado, golpes +30% normal / +70% transformado (`f.zrac`).
- Transformado: aura = GIF do dono em VERDE com raios ROXOS (`zrAura`); especial (botão sp) = COMBO DO REI DEMÔNIO (`zrc`, folha z4, 12 acertos + final em X, segura o rival). Normal: especial continua Fúria do Demônio. Ultimate continua Corte do Rei.
- Teste `ferramentas/testes/tzoro.js`.

## v180 — Zoro: ataques de cima, sem espada roxa, aura menor; Torre: tempo zerado de novo + trocar nome
- Folha nova z5 (6 quadros, 2 espadas com arcos) → animação `c3`. `build_zoro.py add` só monta o que falta e reaproveita o `zr_new.json`.
- No AR (é o "ataque de cima"): soco = `zair` (corte duplo, 2 acertos, segura no ar `zHover`); chute = `zdive` CORTE METEORO (mergulha `vy=19`; ao tocar o chão `zrDiveLand`: onda de corte, lança quem estiver perto).
- Transformado usa os quadros NORMAIS (`SPRH.zrf` = `SPRH.zr`): sem espada roxa; o roxo fica só nos raios. Aura do tamanho do Zoro (altura 268, largura ×0.8) e mais transparente (alfa .22 + .07 'lighter').
- Torre: tempo do ranking zerado de novo (`TWCUT` 2026-11-07 22:50 UTC, e `v<180` não conta tempo; envio manda `v:180`). Botão ✏️ NOME no painel (troca quando quiser) e linha "Jogador: …".
- Ordem completa para remontar: index da v170 → `ferramentas/web/patch_torre.py` → `patch_combo.py` → `patch_v178.py` → `ferramentas/personagens/zoro/patch_zr.py <index> /home/claude/zr_build`.

## v181 — Zoro: golpes do combo no soco, combo também sem transformar
- No ar (`zair`/`zdive`) só os quadros 1, 3 e 6 da folha z5 (`c3` [0],[2],[5]), pedido do dono.
- Corrente do soco agora: `zp1` (corte 1 espada) → `zp2` (2 espadas) → `zca` (corte por cima, quadros 3–8 do combo) → `zcb` (giro com arcos, quadros 9–15 + 18–19, 4 acertos) → `zp3` (investida). Chute = investida. CANCELAR NO ACERTO: depois que o golpe acerta, apertar soco/chute no fim dele já sai o próximo (corrente rápida).
- Especial: transformado = Combo do Rei Demônio (dano cheio); SEM transformar = mesmo combo ("Combo do Espadachim") com 38% do dano (`f.zrW`). Baixo + especial (sem transformar) = Fúria do Demônio (como antes).

## v182 — espera de 3 s no botão de COMBO
- Combos prontos grátis (Rengoku `rgc`, Naruto `nrc`, Zoro `zrc`, Madara `mdc/mdc2`, Gojo `gjc/gjc2`, Luffy `lfc`): quando o combo TERMINA, o botão especial fica 3 s bloqueado (`f.spCD`, `cmbCD` no começo do `updFighter`). Apertar antes: "COMBO EM Xs". O botão fica cinza com o número da contagem (`#bSp.cd`, `<i class="cdn">`). Vale também para a CPU. Zoro baixo+especial (Fúria do Demônio) não é afetado.
- `ferramentas/web/patch_v182.py` (depois do `patch_zr.py`). Teste `ferramentas/testes/tcombo_espera.js`.

## v183 — Zoro: caixas de acerto consertadas + ordem dos golpes
- Antes a caixa de acerto seguia a ponta do arco do quadro (ex.: `zca` ficava de 180 a 420 de altura) e errava rival agachado/baixo. Agora todas são fixas do chão até a cabeça (`B(alcance, atrás, topo, abaixo)`): zp1 205, zca 195 (+30 atrás), zp2 220, zcb 200 (+90 atrás, giro), zp3 190, no ar 200–205 pegando até 140–200 abaixo dos pés.
- Corrente nova (mais rápida no começo): zp1 (início 4) → zca → zp2 → zcb → zp3. Teste `ferramentas/testes/tzoro_hitbox.js` (cada golpe a 70/120/170/220 px, em pé e agachado: todos acertam).

## v184 — preso na parede: o rival dá um contra-golpe e joga para o meio (sem dano)
- `wallBreak` (no `patch_combo.py`): se quem apanha está a ≤95 px da parede e já levou 8 golpes seguidos (ou ~1,8 s preso), ele dá um soco/chute (pose de `RUSHK` do personagem, 18 quadros, invencível 45) e quem estava batendo é arremessado (`airhit`) em direção ao MEIO do cenário (vx = distância até o meio / 34, mín. 9), SEM perder vida, invencível 30. Texto "SAIU DA PAREDE!". Fora da parede continua o `comboBreak` (24 golpes / 3,3 s). Teste `ferramentas/testes/tparede_sair.js` (Luffy: de x 2186 até ~1220, vida intacta).

## v185 — tempo da Torre justo + tempo na tela
- `twTick` só conta quando NÃO está: pausado (inclui a tela de configuração), transformando (`G.trans`), em ultimate (`G.ws`), cinemática/super (`G.cine`, `G.comic`, `G.zsp`, `G.sc`, `G.rush`, `G.wfs`, `G.xu`).
- Na luta da Torre, embaixo do timer (que pode ser ∞), aparece "TORRE mm:ss" em amarelo = tempo total da subida até agora (`twHudT`, no lugar de "ROUND 1"). No fim soma tudo igual (`TW.time`). Teste `ferramentas/testes/ttorre_tempo.js` (transformação e pausa: 0 quadros contados).

## v186 — VALE DO FIM (`vale`)
- 6 imagens do dono (2172x724; inteiro → totalmente destruído, a última de noite com tempestade), pasta `/home/claude/vale` (`up.py` = IA 2x → B0..B5 3000x1000, ~1 min cada). Prep: `FMIN=99 SKYD=110 SKYL=0 HZL=240,240,240,240,230,230 python3 prep_dn.py /home/claude/vale val.json 240`; vida: `prep_life.py vale life_v.json B0..B5` (modo novo `vale`: arbustos verdes balançando + brilhos na água). Cópias em `ferramentas/cenarios/vale/`.
- `ferramentas/cenarios/patch_vale.py <index>` (depois do `patch_v182`): `DNS.vale` (`ph0:.74` começa de NOITE → madrugada → dia → pôr do sol, dia de 5 min; níveis 5/12/20/30/42 pontos, o 5º exige 1 ultimate e o 6º 2; `rain:1` + `storm:1` = no nível final chuva forte (150 gotas) e relâmpagos (clarão na tela); `falls` = cachoeira com água descendo (traços brancos em 'lighter') e névoa na base, retângulo por nível), `STG.vale` (pés na linha 662 da imagem, reflexo .32), luz `LT.vale`, miniatura na seleção.
- Teste `ferramentas/testes/tvale.js` (fotos de noite/dia/tarde e dos níveis).
- Ordem para remontar: index da v170 → patch_torre → patch_combo → patch_v178 → zoro/patch_zr → patch_v182 → cenarios/patch_vale.

## v187 — polimento (movimento, golpes, impacto)
- `ferramentas/web/patch_v187.py` (depois do `patch_vale`):
  1. Personagens do sistema profissional (Naruto, Rengoku, Gojo, Madara, Luffy, Vegeta, Gogeta) agora também têm o movimento secundário dos antigos: cabeça/cabelo balançando (vento, corrida, pulo, clima) e tronco inclinando (`e.kH`/`e.kU` pelo `updAnim`, força por estado em `PROSW`), e respiração parado (`e.sy`). Só com gráfico Ultra (`G.hq`).
  2. `rgTween` (quadro anterior desbotando por cima do novo) para TODOS os personagens nos golpes (antes só Rengoku/Zoro/Naruto) → golpes mais fluidos.
  3. Golpe pesado/lançador/smash: tranco maior na câmera (`G.ck.vx`) + brilho branco rápido no ponto do golpe.
- Teste geral `/home/claude/scripts/allchars.js` sem erros.

## v188 — ajuda para acertar os golpes (todos os personagens)
- `atkAssist` (`ferramentas/web/patch_v188.py`, depois do `patch_v187`): ao começar um golpe de SOCO/CHUTE no chão, se o rival está na frente, na mesma altura, e até 120 px além do alcance (`hb`) do golpe, o lutador desliza para frente durante o início/ativo do golpe (10–18 px por quadro, no máx. a distância que falta, para ao encostar ou acertar). Sem animação nova, sem acerto automático; não vale no ar, em golpes que já correm (`zDash`) nem com o rival caído. CPU também usa.
- Teste `ferramentas/testes/talcance.js <personagem>` (soco e chute a 140/180/220/260/300 px). Antes: Vegeta/Broly/Goku/Aokiji/Naruto acertavam soco só até ~140–180 e chute só até ~180. Agora: soco até ~220, chute até ~260–300.
- Ordem para remontar: v170 → patch_torre → patch_combo → patch_v178 → zoro/patch_zr → patch_v182 → cenarios/patch_vale → patch_v187 → patch_v188.

## v189 — ninguém voa sozinho
- Pedido do dono: personagem só voa se o JOGADOR apertar o botão de voar (e o personagem puder voar). `patch_v189.py` (depois do `patch_v188`):
  - Super Dash/Perseguição depois de lançar (soco com o rival no ar): no chão vira SALTO (pulo que desce) para TODOS; só persegue voando quem já estava voando.
  - Segurar para cima no ar não faz mais voar (`upT` desligado).
  - Teletransporte não deixa voando quem estava no chão.
  - CPU nunca voa (`startFly` com `f.cpu` vira pulo).
- Teste `ferramentas/testes/tsemvoo.js` (Broly CPU 25 s: 0 quadros voando, no máximo 15 quadros no ar; botão de voar do jogador continua funcionando).

## v190 — Broly: combo básico só de socos
- Antes a corrente era jab → cross → upper (o upper usa o quadro `up` = Broly subindo como se voasse) e daí perseguição/chute. Agora o SOCO no chão do Broly é `bp1`…`bp5` (5 socos rápidos e fortes, alternando soco reto `combo 1`/soco longo `combo 2` com o gancho armado `combo 3`) → `bp6` SOCO PESADO (quadro `dash 0`, avançando com poeira) que ATORDOA: quem toma fica parado em "hit" ~1 s (`hitstun 58`), sem cair nem voar, texto "ATORDOADO!" e estrelinhas na cabeça (`stunFx`). Nada sobe no ar.
- `ferramentas/web/patch_v190.py` (depois do `patch_v189`). Teste `ferramentas/testes/tbroly_socos.js` (6 golpes, 0 quadros no ar, rival só idle/hit).

## v191 — Broly: socos e combo novos (folhas do dono)
- Folhas: b1 (8 poses de soco, fundo transparente) e b2 (16 poses do combo, fundo branco → `alpha_b2.py`). `ferramentas/personagens/broly/`: `seg_br.py` (grade; na b2 watershed em tudo + tira fiapos), `build_broly.py` (postura = 272 unidades, IA 2x, gera DUAS versões: transformado = cabelo verde original; normal = cabelo recolorido para preto só no bloco do cabelo do topo da cabeça), `br.js`, `patch_br.py <index> /home/claude/br_build` (depois do `patch_v190`). Animações `bpn` e `bcm` em `SPRH.br` (cabelo preto) e `SPRH.brf` (verde).
- Soco no chão (sobrescreve os `bp*` da v190, mesma ideia): bp1 jab (b1 4→5) → bp2 soco reto pesado de costas (1→2) → bp3 (0→3) → bp4 jab → bp5 reto → bp6 MARTELO por cima (6→7) que ATORDOA ~1 s. Chave de quadro por `move.xv` (`xvKey`). Nada sobe no ar.
- Botão de COMBO: o Meteoro Verde (`brSuper` tipo 2) saiu; agora é o COMBO DO LENDÁRIO (`brc`, folha b2): segura o rival, socos com energia verde, gancho, giro de socos e o soco final explosivo que arremessa para longe (baixo, sem voar). Grátis com a espera de 3 s (`CMBS.brc`). Sem transformar: 60% do dano ("Combo do Broly"). Ultimate (Fúria do Planeta) continua.
- Testes `ferramentas/testes/tbroly_socos.js` e `tbroly_combo.js`.

## v192 — Broly normal com a arte do dono
- O dono mandou as folhas do Broly NORMAL (n1 = 8 socos, n2 = 16 do combo; fundo xadrez claro → `alpha_n1.py`/`alpha_n2.py`, só fundo ligado à borda, para não apagar o branco das botas). Agora `SPRH.br.bpn/bcm` = arte normal do dono (sai o cabelo pintado de preto) e `SPRH.brf` = transformado (b1/b2). `build_broly.py` monta as duas; mesmos golpes e combo da v191. Arquivos antigos do cabelo pintado apagados.

## v193 — NOVO PERSONAGEM: GAROU (id `garou`, sid `gr` normal / `grm` Forma Monstro)
- Material do dono em `/home/claude/novo_gr/` (folhas normais g01–g20, monstro t01–t16, combos c01/c02/c03, vídeos, botões). Ferramentas em `ferramentas/personagens/garou/` (cópias de `/home/claude/gr_build/`):
  - `seg_gr.py` recorta (fundo branco ligado à borda; g12 limiar mais solto; t12 xadrez; buracos brancos internos removidos nas folhas do monstro).
  - `build_garou.py [ai]` monta `gr_ai.json` (normal 282, monstro 300 unidades, quadros do monstro com nitidez extra).
  - `gr.js` é o bloco JS; `patch_gr.py www/index.html gr_ai.json` injeta (lê vids/aura/imgs/hud de `/home/claude/gr_build`).
- Golpes (prefixos livres `q` normal / `x` monstro; o `startMove` troca `v*`→`q*`/`x*`): soco jab→cross→joelhada→gancho lançador; chute→chute alto lançador; rasteira; aéreos.
  - Todo golpe de soco/chute que ACERTA pode ser cancelado no próximo (`m.grQ`, igual Zoro), inclusive no Ki.
  - Ki (toque) = `grk`: 2 socos relâmpago, custa 4 de Ki.
  - Combo (`grc`, espera de 3 s) = Punho da Água Corrente (folha c02 normal com aura / c03 monstro).
- CONTRA-ATAQUE (`grCounter`, estado `grcn`):
  - Defesa perfeita com janela maior (12 quadros normal / 18 monstro) → contra-ataque.
  - Esquiva pra trás (`vbdash`) na hora do golpe do rival → "ESQUIVA PERFEITA!" + contra-ataque.
  - Monstro: a cada 4 golpes recebidos contra-ataca sozinho e teleporta atrás do rival.
  - Acertar o rival no começo do golpe dele = COUNTER ×1.35 (`grCHit`).
- Velocidade: normal ×1.12 (walk 5.6) + golpes acelerados; monstro ×2.4 (o mais rápido do jogo) + golpes bem mais rápidos.
  - Rastro vermelho ao andar/correr (azul-claro só correndo no normal).
  - Não voa (`noFly`).
- Aura: a do Gojo (`GJAU`) recolorida em vermelho (`a/23baffe4772893.webp`) com raios vermelhos (`zArcs ZPAL.red`); no normal a mesma chama recolorida em azul-claro, bem transparente (forte ao carregar).
- Transformação: vídeo de 3,2 s ("FORMA MONSTRO!"). Ultimate: vídeo inteiro, "EXPLOSÃO GAMA", só na Forma Monstro com 100 de Ki. Sem som.
- Botões do dono (normal/transformado) em `HUDA.garou`; `HUTH.garou` = chamas + raios vermelhos nos botões. Vida sem arte (HUDA_ON=false).
- Não entrou nas cartas da Torre.
- Testes `ferramentas/testes/tgarou.js` (golpes, Ki, combo, defesa→contra-ataque, transformação, ultimate) e `tgarou_todos.js` (todos contra o Garou CPU).

## v194 — Garou: quadradinho novo, imagem em pé limpa, socos sem pulo
- Quadradinho da escolha (`PTH.garou`) = imagem do Monstro que o dono mandou (recorte do rosto/peito, 220×220).
- Imagem em pé (`FULLIMG.garou`): tirado o branco preso entre o braço e o corpo (componente branca interna + halo).
- Socos: a corrente agora é só no chão: jab → direto → golpe da água → direto rápido (`qjab3`) → SOCO FINAL (`qstr`, anim `upper` com o redemoinho) que empurra longe (kb 9), SEM lançar. Antes o último soco era lançador e o `trySD` fazia o Garou pular atrás chutando. Chutes continuam iguais.
- Todo soco que acerta solta respingos de água azul (normal) / energia vermelha (monstro); o final tem explosão, tremida e brilho (`grImpact(a,d,h,fin)`, chamado no `applyHit`).
- Teste `ferramentas/testes/tgarou_socos.js` (14 socos seguidos: 0 quadros no ar).

## v195 — Torre: 4 cartas, carta SECRETA, carta TRANSFORMAÇÃO e drop de EQUIPAMENTOS
- `ferramentas/web/patch_v195.py` (aplicado em cima da v194).
- Agora vêm 4 cartas de passiva (um dos 3 tipos aparece repetido), com as mesmas raridades de antes.
- Carta TRANSFORMAÇÃO 🔥 (`TWTRF`): só nasce de carta lendária (+40%) ou mítica (+75%), com 45% de chance de trocar o tipo.
  - Faz a energia de transformar encher mais rápido (`f.tsb` multiplica o ganho de `f.sb`).
  - Já começa cada luta com parte da energia (`SB_COST*trf/200`, até 90%).
- Carta SECRETA 👁️ (`TWSECP=0.4`% por tela de cartas; `window.__twSec` força nos testes): +80% vida/dano/velocidade, +100% transformação, +2 barras (máx. 7) e vida cheia. Dá o troféu "Carta Secreta" (+10).
- EQUIPAMENTOS (`TWEQ`): depois da passiva vem a tela "DROP DE EQUIPAMENTO" com 3 cartas (Espada = ataque, Armadura = defesa, Poção = velocidade).
  - Raridades `TWEQR`: comum 70% +1%, rara 22,5% +4%, épica 6% +5%, lendária 1,3% +7%, mítica 0,2% +10%.
  - Ficam até o fim da torre. Guarda o melhor de cada tipo (`TW.eq`), que soma nas passivas no `twApply`.
  - Mítico dá o troféu "Equipamento Mítico" (+4).
  - Aparecem no painel da torre.
- Teste `ferramentas/testes/ttorre_v195.js`.

## v196 — Torre: 3 BAÚS e MOCHILA (equipamentos permanentes)
- `ferramentas/web/patch_v196.py` (em cima da v195). Saiu a tela "DROP DE EQUIPAMENTO" da v195.
- Depois de vencer um andar aparecem 3 baús (CSS puro, `.twCh`): balançam e abrem sozinhos (1,4 s, um a cada 0,7 s) ou com toque.
  - Brilham na cor da melhor raridade de dentro.
  - Das 4 cartas: um baú tem 2 e os outros 1 cada.
  - Depois dos 3 abertos aparecem as cartas para escolher.
- Equipamento: 20% por andar (`TWEQP`; `window.__twEq` força nos testes) vem dentro de um dos baús, com a raridade `TWEQR` (comum 70% … mítico 0,2%).
  - Vai para a MOCHILA. Se for melhor que o equipado, já equipa sozinho.
- MOCHILA 🎒 (botão na torre): `localStorage tw_inv` (até 60 itens, apaga comum velho não equipado) e `tw_eqp` {esp,arm,poc}.
  - Nunca expira. Toque equipa ou desequipa (1 de cada tipo).
  - O bônus vale em todas as subidas (`twEqB` lê `twEqOn()`).
- Teste `ferramentas/testes/ttorre_bau.js`.

## v197 — Poção de uso único + BOTAS
- `ferramentas/web/patch_v197.py` (em cima da v196).
- Equipamentos permanentes agora são Espada (ataque), Armadura (defesa) e BOTAS 🥾 (`bot`, velocidade). Raridades `TWEQR` iguais (20% por andar).
- POÇÃO 🧪 virou consumível: `localStorage tw_poc` (até 40).
  - Raridades `TWPOR`: comum 60% +1, rara 30% +4, épica 7,5% +5, lendária 2% +7, mítica 0,5% +10.
  - Chance de vir num baú: 40% por andar (`TWPOP`; `window.__twPo` força nos testes).
  - Na MOCHILA o botão BEBER guarda a poção em `tw_pocOn` (só uma por vez). Na próxima luta da torre (`twApply`) ela soma ao bônus de transformação (`p.tsb` e energia inicial) e é gasta. Aparece um aviso no começo da luta.
- Migração: as poções de velocidade da v196 viram poções de uso único com o mesmo valor.
- Teste `ferramentas/testes/ttorre_pocao.js`.

## v198 — Torre com as artes do dono: ANDAR VENCIDO, BAÚS por raridade, MOCHILA
- Artes originais em `ferramentas/torre_artes/`. `cut_items.py` recorta 5 itens por folha (componentes conexos agrupados por posição, porque as espadas se sobrepõem) e os 10 baús (fechado/aberto), e gera `/home/claude/mo_build/items.json`. `patch_v198.py` lê esse json (`TWIMG`).
- Tela ANDAR VENCIDO (`.twAV`, arte 1847×851 com posições em %, `twFit` ajusta ao tamanho da tela):
  - Embaixo, as 4 cartas de passiva nos 4 quadros.
  - Em cima, até 3 BAÚS, ganhos pelo desempenho: pontos de troféu do andar 2+ = 1 baú, 5+ = 2, 9+ = 3 (`twChests`; `window.__twCh` força nos testes).
  - Cada baú: 60% poção (`TWPOR`) / 40% equipamento (`TWEQR`, difícil). A arte do baú é a da raridade. Toque abre (ou abre sozinho em 2,2 s); o item sobe com nome e valor e vai para a mochila. Escolher a carta abre os baús que faltam.
  - Quadro do troféu: ícones e pontos dos troféus do andar (+N 🏆) e os nomes. Linha de análise: tempo, % de vida perdida e maior combo.
- Troféus novos de desempenho: Raio (<15 s, +3), Perfeito (<30 s sem perder vida, +5), Muralha (perdeu <10%, +2), Combo Insano (20+, +3).
- MOCHILA (`.twMO`, arte 1846×852):
  - 20 espaços (`TWBAG`) com equipamentos não equipados e poções. Quando passa de 20, descarta o mais fraco (`twCap`).
  - Embaixo os 5 equipados: armadura, botas, capacete (EM BREVE, sem item ainda), espada, poção bebida.
  - Toque num item → detalhe com EQUIPAR / BEBER / DESCARTAR / DESEQUIPAR.
- Teste `ferramentas/testes/ttorre_arte.js`.

## v199 — buff do Garou
- `ferramentas/web/patch_v199.py index.html gr.js patch_gr.py` (aplica as mesmas trocas no index e nas fontes do Garou).
- Velocidade: normal ×1.3 (antes 1.12, walk 5.9) e Monstro ×2.7 (antes 2.4). Golpes mais acelerados (`gacc` .4 normal / .9 monstro).
- Dano: power 1.12 e dano base dos golpes ~+12%.
- Alcance: `B()` agora alcança +55 (antes +10). Monstro +30 em cima disso. Rasteira 290.
  - Soco acerta até ~280 px (antes ~200).
- Encaixe: corrente com menos empurrão (kb ~1.4), mais atordoamento (hs 19–20) e passo à frente maior (`nrPush`).
- Combo (botão): avança até o rival nos primeiros quadros, pega até 300 px de distância (antes 240) e numa janela maior (k 1–7). Pega até quem está defendendo.
- Ki (2 socos) com alcance 265/290.
- PASSIVA: a cada 3 golpes recebidos (normal E Monstro; antes só Monstro a cada 4) → contra-ataque (`grCounter`).
- Teste `ferramentas/testes/tgarou_buff.js`.

## v200 — TÍTULOS, ranking SEMANAL e MODO EVENTO
- `ferramentas/web/patch_v200.py` (lê `/home/claude/mo_build/evento.json` com as imagens das 2 espadas do evento; arte em `ferramentas/torre_artes/espadas_evento.png`).
- Cada aparelho tem um código escondido `tw_uid`. O envio para o Firestore agora manda também:
  - `uid`
  - `tit` (título em uso)
  - `sem` (chave da semana `wAAAAMMDD` da segunda-feira, horário de Brasília UTC-3)
  - `ev` (id do evento, só se estiver no horário)
  - `v:200`
  - Continua na coleção `torre` (as regras só deixam criar lá).
- RANKING: aba nova 📅 SEMANA (abre nela). Busca `where sem == semana atual` e confere o `createTime` do servidor dentro da semana. Mostra a melhor subida por uid (`twBestU`). Reseta sozinho toda segunda 00:00.
- TÍTULOS (`TWTIT`, botão 👑 TÍTULOS):
  - INICIANTE (1 andar), GUERREIRO (4 andares), CONQUISTADOR (7 andares).
  - CAMPEÃO DA SEMANA: 1º da semana anterior. Conferido ao abrir a torre (`twClaims`, `tw_wkc`).
  - CAMPEÃO DO TORNEIO: 1º do evento.
  - O título em uso aparece embaixo do nome e nos rankings.
- EVENTO (`TWEV`, botão 🎉 EVENTO com bolinha vermelha piscando ao vivo):
  - Evento atual: `ev20261108` "1º TORNEIO DA TORRE", 08/11/2026 15:00–15:45 (Brasília).
  - Subida que TERMINA no horário entra. Vale o `createTime` do servidor (até +60 s de folga).
  - Ranking = melhor subida por jogador (andares → troféus → menos tempo).
  - Depois do fim (+90 s), ao abrir a torre: se este aparelho for 1º/2º, recebe o prêmio na mochila (`tw_evc` marca entregue) e aparece a tela "VOCÊ GANHOU".
  - Prêmios:
    - 1º = LÂMINA SOMBRIA (espada mítica, +11% dano +5% velocidade) + título CAMPEÃO DO TORNEIO.
    - 2º = LÂMINA DOURADA (lendária, +6% dano +2% velocidade).
  - Itens de evento têm `img`, `nm`, `vel` próprios e nunca são descartados primeiro pela mochila cheia.
  - Para o próximo evento: trocar `TWEV` (id novo, horários, prêmios).
- `window.__twEvT=[iniOffsetMs,fimOffsetMs]` antes de carregar → simula horário (teste `ferramentas/testes/tevento.js`, Firestore simulado).

## v201 — nome único + título ADM
- `ferramentas/web/patch_v201.py`.
- Nome ÚNICO: ao confirmar um nome novo (✏️ NOME ou o 1º nome), `twNameFree` procura no Firestore:
  - `nomeL == minúsculo`, `nome ==` variações de maiúscula/minúscula, e o top 300.
  - O nome está tomado se existir com outro `uid`. Se o documento antigo não tem uid, só libera se for o nome que este aparelho já usava.
  - Sem internet não registra.
  - Ao registrar, grava um documento de reserva (`claim:'1'`, andar 0) com `nome`, `nomeL`, `uid`. Todos os rankings ignoram `claim`.
  - No fim da subida o campo de nome ficou só leitura (troca só pelo ✏️ NOME).
  - Envio agora manda `nomeL` e `v:201`.
- Título ADM (`TWTIT.adm`, escondido para quem não tem; não dá bônus): dourado com brilho passando, borda em gradiente animada e coroa pulsando (`.twTit.adm`).
  - Liberado digitando o código secreto do dono no campo de NOME (hash FNV `TWADM`). O código fica só com o dono.
  - Vale por aparelho: em outro aparelho, digitar o código de novo.
- Teste `ferramentas/testes/tnome_adm.js`.

## v202 — nome "ADM" proibido + jogador Denilson ADM
- `ferramentas/web/patch_v202.py`.
- `twBadName`: nenhum nome pode ter "adm" de nenhum jeito. Antes de conferir, tira acento, maiúsculas, espaços, pontos e símbolos e troca 4/@→a, 0→o, 1/!/|→i, 3→e.
- Quem já tinha nome com ADM (sem o título) perde o nome ao abrir a torre e escolhe outro.
- O código ADM do dono (digitado no ✏️ NOME) agora:
  - define o nome **Denilson ADM** (`TWADMN`) e reserva no Firestore;
  - dá o título ADM e já deixa em uso.
  - É o único jeito de ter ADM no nome.
- Nos rankings a etiqueta ADM só aparece se o nome for "Denilson ADM" (contra quem tentar mandar o título pelo REST).
- Bônus escondido do título ADM: +10% ataque e +10% velocidade (`twAdmBuff`, depois do `twApply`) em TODAS as lutas do jogador 1 do aparelho que tem o título.
- Teste `ferramentas/testes/tnome_adm.js`.

## v203 — títulos nos rankings + CHAT da torre
- `ferramentas/web/patch_v203.py`.
- Títulos de todo mundo nos rankings (Semana, Tempo, Troféus, Personagem e Evento): vale o título ATUAL de cada jogador.
  - `twTitMap` lê os documentos `claim=='1'` (cache 30 s) e junta com o `tit` das subidas. O mais recente por nome ganha (`TWTM`, `twTN`).
  - Quando o jogador troca ou ganha título, `twTitSync` grava um claim novo com `tit`. Na 1ª abertura da torre na v203 também grava (`tw_ts203`).
  - ADM só aparece para o nome "Denilson ADM".
- CHAT 💬 (botão no painel da torre):
  - Mensagens são documentos na coleção `torre` com `chat:'cAAAAMMDD'` (dia de Brasília), `msg` (até 140), `nome`, `uid`, `tit`, `andar 0`, `tempo 0`, sem `pontos` (assim não entram no ranking de pontos).
  - Carrega hoje + 2 dias antes (até 80 mensagens) e atualiza a cada 8 s com a tela aberta. Espera de 4 s entre mensagens.
  - Filtro simples de palavrão (`TWBAD`, troca por ***).
  - As regras do Firestore não deixam apagar: não dá para remover mensagem.
- Teste `ferramentas/testes/tchat.js`.

## v204 — recorde antigo do dono + buff do ADM
- `ferramentas/web/patch_v204.py`.
- Não dá para apagar documentos no Firestore (regras + proxy). Por isso `TWALIAS` faz o nome antigo "Denilson_DW adm" aparecer como "Denilson ADM" em todos os rankings (`twAl` no `twFetch`, `twQ`, `twFetchC`).
  - O `twBest` junta por nome e fica a melhor subida: o 2º lugar do tempo (03:13, 70 troféus) virou do Denilson ADM, com a etiqueta ADM.
  - Para juntar outros nomes antigos, é só acrescentar no `TWALIAS`.
- Bônus escondido do título ADM:
  - +15% dano (antes 10) e +10% velocidade.
  - Sorte nas passivas: 30% de chance de sortear 2 vezes e ficar com a melhor raridade (`twRoll`).
  - Sorte nos baús: 15% no sorteio da raridade do equipamento e da poção (`twEqRoll`/`twPoRoll`).
- Teste `ferramentas/testes/tadm_alias.js`.

## v205 — buff do título no painel, ADM +20%, MOEDAS e LOJA
- `ferramentas/web/patch_v205.py`.
- Painel da torre: linha "👑 ADM +20% DANO · +10% VEL. · 🍀 SORTE" só no aparelho que tem o título. Moedas 🪙 na mesma área.
- ADM: dano +20% (antes 15).
- Conferido na luta (`ferramentas/testes/tbuffs_loja.js`, medindo o `applyHit` e a distância andada): passivas + equipamentos + ADM entram certinho (dano dado ×1.38, dano recebido ×0.592, velocidade ×1.32 no exemplo).
- MOEDAS (`tw_moedas`): cada andar vencido dá 100 + rapidez (<20 s +60, <35 +45, <50 +30, <75 +15) + vida (perdeu <10% +25, <30% +10) + combo 10+ (+15), no máximo 200. Completar a torre: +100. Aparece na tela ANDAR VENCIDO e no fim ("MOEDAS +N").
- LOJA 🛒 (botão no painel): só poções. Comum 100, rara 200, épica 300, lendária 500, mítica 2000 (`TWSHOP`). Vão para a mochila (precisa de espaço).

## v206 — códigos de uso único (cupons)
- `ferramentas/web/patch_v206.py`.
- Digitado no ✏️ NOME (como o código ADM). `TWCUP[hash FNV do código]` diz o que o código dá.
- Ao usar, cria `torre/cupom_<hash>` com `documentId` fixo. Se o documento já existe, o Firestore responde 409/403 → "Esse código já foi usado por outro jogador". Só o 1º aparelho do mundo consegue.
- Código 1 (hash `1polqg8`): espada, armadura e botas MÍTICAS (+10% cada), já equipadas. O texto do código fica só com o dono (não fica no repositório).
- Para criar outro código: gerar um texto novo, calcular `twHash(CODIGO)` e acrescentar no `TWCUP`.
- Teste `ferramentas/testes/tcupom.js` (simula 2 aparelhos).

## v207 — CAPACETE e crítico melhorado
- `ferramentas/web/patch_v207.py` (lê `/home/claude/mo_build/cap.json`; artes em `ferramentas/torre_artes/capacetes1/2.png`).
- Capacete ⛑️ (`TWEQ` k `cap`, `TWCAPV`): barra de transformação mais rápida e crítico.

| Raridade | Transformação | Crítico |
|---|---|---|
| comum | +1% | +1% |
| rara | +5% | +5% |
| épica | +10% | +15% |
| lendária | +20% | +20% |
| mítica | +35% | +25% |

  - Vem nos baús como os outros equipamentos (agora 4 tipos). Usa o espaço do meio da mochila (saiu o "EM BREVE").
  - Na luta da torre: soma no `p.tsb` e dá `p.tcr`.
- CRÍTICO: todos têm 5% de chance base (+ `tcr` do capacete) em golpes que não são de agarrão (`h.lock`). Crítico = dano ×1.6 (Xenowing transformado continua 30% de chance e ×1.8).
  - Efeito novo `critFx`: "💥 CRÍTICO!" dourado, 3 anéis, faíscas, flash, tremida, pausa maior e vibração.
  - Painel mostra "💥 CRÍT. X%". `window.__crit` força nos testes.
- Teste `ferramentas/testes/tcapacete.js` (3000 golpes: ~29% de crítico com o mítico, ~6% sem).

## v208 — SUPER SOCO com carga no botão e QUEBRA DE DEFESA
- `ferramentas/web/patch_v208.py`.
- Segurar o soco (já existia: `pHeld` 20 quadros → `buf.smash` → `doSmash`) agora mostra no botão de soco:
  - um anel dourado enchendo (`.pch`, `--p`, de 4 a 20 quadros);
  - ao completar, o anel brilhando com "SUPER!" (`.pchT`).
  - É atualizado no `cmbCD` do jogador 1. No personagem aparece um anel dourado na hora que carrega.
- QUEBRA DE DEFESA (`guardBreak`): golpe `smash` em quem está defendendo, inclusive defesa perfeita.
  - O defensor fica atordoado 58 quadros (`gbT`, não consegue defender) e leva 60% do dano.
  - Efeitos: "DEFESA QUEBRADA!" azul-gelo, cacos de luz, anéis, câmera lenta, tremida e vibração.
  - Vale para todos os personagens (smash/vsmash/qsmash/nsmash…).
- Teste `ferramentas/testes/tsupersoco.js`.

## v209 — poções mais fortes e mais caras
- `ferramentas/web/patch_v209.py`.
- Poção (uso único, próxima luta da torre). `TWPOE[raridade]` = [transformação, dano, crítico]:

| Raridade | Transformação | Dano | Crítico |
|---|---|---|---|
| comum | +5% | +5% | +3% |
| rara | +7% | +7% | +5% |
| épica | +10% | +10% | +10% |
| lendária | +15% | +15% | +15% |
| mítica | +20% | +20% | +20% |

  - No `twApply`: transformação no `trf`, dano no `p.tdm` (+), crítico no `p.tcr` (+).
  - As poções que já estavam na mochila foram atualizadas pela raridade (o `v` virou o valor novo).
- Loja: comum 400, rara 600, épica 700, lendária 1000, mítica 3000 (`TWSHOP`).
- Teste `ferramentas/testes/tpocao2.js`.

## v210 — vender equipamento
- `ferramentas/web/patch_v210.py`.
- Na mochila, um equipamento guardado (não equipado) agora tem o botão VENDER no lugar de DESCARTAR. Pede confirmação no 2º toque.
- Valores (`TWSELL`): comum 100, rara 200, épica 300, lendária 700, mítica 2000 🪙.
- Poção continua só com DESCARTAR. As moedas aparecem no topo da mochila.
- Teste `ferramentas/testes/tvender.js`.

## v211 — chefe final com 2 vidas no EVENTO
- `ferramentas/web/patch_v211.py`.
- `TW.evBoss` é marcado no `twFight` do chefe (andar 7) quando o evento está AO VIVO.
- No `ko()`: a 1ª morte do chefe vira `twBossRevive`. Ele volta com vida cheia, dano ×2, velocidade ×1.2 e defesa melhor (dano recebido ×0.85), invencível ~1,6 s, com banner "O CHEFE VOLTOU! 2ª VIDA · 2X MAIS FORTE" e efeitos vermelhos. A 2ª morte é K.O. normal.
- Tela do evento avisa a regra.
- Teste `ferramentas/testes/tchefe2vidas.js`.

## v212 — código de uso único com 2 BAÚS LENDÁRIOS
- `ferramentas/web/patch_v212.py`.
- `TWCUP` aceita `bau:{r,n}`. Ao usar, `twBauOpen` mostra os baús (arte da raridade) que abrem sozinhos ou com toque.
  - Cada baú: 60% poção / 40% equipamento (tipo sorteado) daquela raridade. Vai para a mochila.
- Código 2 (hash `706xst`): 2 baús lendários. O texto do código fica só com o dono.
- Ferramenta `.github/workflows/consulta.yml` (rodar pela API `actions/workflows/consulta.yml/dispatches`): lista do Firestore os documentos com `sem == semana` e `ev == ev20261108`. O sandbox não alcança o Firestore, mas o GitHub Actions sim.
- Teste `ferramentas/testes/tcupom_bau.js`.

## v213 — MODO RANQUEADO + menu principal novo
- Fontes: `ferramentas/web/ranqueada/` (`rk.js`, `rk.css`, `prep_rk.py` que gera `rk_assets.json` + `/home/claude/rk_build/out/*` → `www/a`). Artes originais em `ferramentas/ranqueada_artes/`. Patch: `ferramentas/web/patch_v213.py` (em cima da v212). A variável das artes é `RQA` (`RKA` já existia no jogo).
- Menu principal: arte nova (1847×851).
  - Botões: Batalha, História 🔒, Torre, **Ranqueado (`mRank`)**, Online 🔒, Configuração. A arte já tem os cadeados.
- Tela `ranked` (`rkOpen/rkView`), todas por cima das artes do dono com áreas clicáveis (`rkB` em pixels da arte):
  - **Menu do ranqueado:** Modo Boss, Contra Relógio 🔒, Desafio do Tempo 🔒, Gacha; abas Ranking, Recompensas, Conquistas, Personagem (Biblioteca), Minha Posição. No topo, emblema do rank e moedas.
  - **Modo Boss (Broly):**
    - Recompensas, emblema do rank brilhando na bandeira, nº de jogadores online.
    - Online: cada jogo grava `on:'o'+floor(t/120000)` a cada 2 min; conta uids do bucket atual e do anterior.
    - Chat Global: `gchat` = dia. Escolha do personagem (só os que tem).
  - **Luta:**
    - `G.gmode='boss'`, jogador com 4 barras.
    - Broly: 7 barras (dano ×1.6, recebe ×0.8). Na 1ª morte, `rkPhase2` transforma (vídeo) com 14 barras (dano ×2.2, recebe ×0.65, vel ×1.25); a forma não acaba.
    - IA no máximo; 300 s.
    - Equipamentos da mochila também valem aqui.
  - **Fim da luta (`rkAfter`):**
    - Vitória: baú (raridade pelo desempenho) com 300–500 🔴, 10–15 💎, ticket às vezes, equipamento às vezes, poção 30%. Drops especiais: lendários 4% (Bandana, Botas Saiyajin, Semente dos Deuses), míticos 1,5% (Adaga Kamish, Gunbai do Madara); piedade a cada 25 vitórias (`rk_bpity`).
    - Derrota: 30–150 🔴 pelo dano.
    - Pontos: vitória +30 (+10 se < 150 s), derrota −15 sem cair de rank.
    - Grava no Firestore `rk:'1'` com rp, dmg, t1, tt.
  - **Semente dos Deuses** (`tw_senzu`): ao morrer no Boss ou na Torre, volta com a vida cheia (gasta 1).
  - **Ranks** (`RKR`): Madeira 0, Bronze 100, Prata 250, Ouro 450, Diamante 700, Lendário 1000, Dragão Lendário 1400, Divindade 1900. Cada rank tem título com o emblema brilhando (`TWTIT.rk0..rk7`, `.twTit.rkt`) e recompensa em 💎 (50…1000) para resgatar.
  - **Invocação (gacha):**
    - 1 giro = 50 💎 ou 1 ticket; 10 giros = 450 💎. Só a Limitada liberada; Especial e Padrão 🔒.
    - Vídeo (cortado do vídeo do dono, efeitos roxos, `RQA.inv`) → cartas por raridade.
    - Chances: lendário 2% (garantido em 30), épico 6%, equipamento 27%, moeda vermelha 20–80 (65%, pouca de propósito para não virar ciclo infinito com a loja).
    - Especiais: mítico especial 0,6% (Máscara Hollow, Chapéu do Hokage, Armadura Saiyajin); SECRETO 0,3% Lâmina Negra (garantida em 50, `rk_pity2`).
    - Lendário novo passa o vídeo da transformação do personagem (`RKTV`). Repetido vira 💎.
  - **Loja:** só Geminhas (pacotes da arte; compra com 🔴). Abas Equipamentos/Tickets/Moeda Vermelha 🔒.
  - **Biblioteca:** Personagens / Equipamentos / Itens / Coleções. Busca, filtro, páginas, item no pedestal, "USAR NA RANQUEADA" / "USAR TÍTULO".
  - **Conquistas** (`RKACH`) dão 💎. **Minha Posição** mostra rank, pontos, colocação e recordes.
- Dados no aparelho (`rk_*`): gem, tic, red, own, sel, rp, pity, pity2, bpity, hist, st, rwc, achc. Começa com 100 💎, 1 ticket e o Goku. A mochila e os equipamentos são os mesmos da torre.
- Testes: `ferramentas/testes/tranqueado.js` (tudo, Firestore simulado) e `tsenzu.js`.

## v214 — ranqueado em tela cheia e mais leve
- Ao abrir o ranqueado chama `fsTry()` (tela cheia). `rkFit` usa a arte COBRINDO a tela (`max`, corta um pouquinho das bordas) em vez de deixar faixas pretas.
- Vídeos (invocação e transformação do personagem novo):
  - Os quadros são carregados e decodificados antes (`rkPre`); a invocação ao abrir o gacha, o personagem novo durante o vídeo da invocação (`RKCWP`).
  - Desenhados num canvas pelo relógio (`rkPlayFrames`, 12 q/s com `requestAnimationFrame`), sem trocar `img.src`.
- CSS: menos filtros animados (cartas lendárias brilham com um fundo pulsando em vez de `drop-shadow` animado; emblemas pequenos sem raios girando).
- Mesmo patch `patch_v213.py` + fontes em `ferramentas/web/ranqueada/` (refazer a partir da v212).

## v215 — REGRAS DA RANQUEADA (Boss Ranked) + tela "Ranqueada · Modo Boss"
- Regras do dono em `ferramentas/ranqueada_artes/regras_boss.txt`; arte da tela em `ranqueada_boss.png` (1672×941, `rkB2`, view `rb`).
- XP ranqueado (`rk_rp`), nunca negativo, pode cair de rank:

| Rank | XP mínimo (`RKXP`) | Vitória (`RKXW`) | Derrota (`RKXL`) |
|---|---|---|---|
| Madeira | 0 | +100 | −30 |
| Bronze | 1000 | +120 | −45 |
| Prata | 2500 | +140 | −60 |
| Ouro | 5000 | +160 | −80 |
| Diamante | 9000 | +180 | −100 |
| Lendário | 15000 | +200 | −125 |
| Dragão Lendário | 23000 | +230 | −150 |
| Divindade | 35000 | +260 | −180 |

  - Divindade não tem limite de XP.
  - Os pontos antigos (v213) foram convertidos para o XP mínimo do rank (`rk_xpv2`).
  - Desistir no meio da luta (pausa → menu) = derrota (`rkQuit`).
- Nível do Boss = rank (1–8); não dá para escolher outro (as setas só mostram as informações de cada nível).
  - `RKLVS`: vida/dano/velocidade 100/100/100 … 320/200/135%. Vida = resistência (`tdf` dividido), para as barras continuarem 7+14.
  - Calculado sempre a partir dos atributos originais (`RKBOSS[0].b1/b2`), sem acumular.
  - IA por nível (`RKAI` via `twLV`) e `G.diff` 1/2/3.
- Passivas (`rkPassTick`/`rkPassHit`, cada uma 1 vez por luta, contando a vida TOTAL das 2 fases):
  - nv2: bloqueio 10% (recarga 1 s);
  - nv3: esquiva 15% (recarga 1,5 s);
  - nv4: regenera 3% a 40%;
  - nv5: +15% de dano por 8 s a 50%;
  - nv6: barreira 10% a 70%;
  - nv7: fúria, +15% de velocidade por 10 s a 30%;
  - nv8: Fase Suprema a 25% (barreira 15% e +20% de dano por 12 s).
- Configuração reutilizável: `RKBOSS` (id, nome, barras das fases, atributos base) para os próximos bosses.
- Tela `rb` (Modo Boss → Iniciar):
  - Broly em pé no pedestal; seletor de nível 1/8 com setas e quadros (cadeado acima do rank).
  - Rank atual com emblema; barra de XP; XP de vitória/derrota do rank.
  - Passivas do nível; descrição do nível; próximo rank; INICIAR BATALHA.
- `rkFit`: cobre a tela quando a proporção da arte é parecida com a da tela; senão encaixa inteira.
- Teste `ferramentas/testes/trb.js` (confere o exemplo do dono: Ouro 5500 → vitória 5660 / derrota 5580).

## v216 — nerf da Moeda Vermelha e das geminhas
- A Moeda Vermelha é tratada como "dinheiro de verdade" (pedido do dono).
- Vitória no Boss: 🔴 5–10 (mais jogando bem) e 50% de chance de 1–2 💎. Derrota: 🔴 0–2, sem 💎.
- Gacha: moeda vermelha 1–5. Repetido: lendário 25 💎, épico 5 💎 (antes 100/30).
- Recompensas de rank e conquistas continuam iguais.

## v217 — Boss mais fácil no começo, botão EQUIPAR e música no ranqueado
- Broly com barras por nível (`RKBOSS[0].ph` agora é lista por nível, `rkPhB(lv)`):
  - nv1 3→5, nv2 3→6, nv3 4→7, nv4 4→8, nv5 5→10, nv6 6→11, nv7 7→13, nv8 7→14 (fase 1 → transformado).
  - Dano base menor (b1 dm .9, b2 dm 1.15); continua multiplicado por `RKLVS`, então o dano sobe com o rank.
  - Banner, resultado (`frac`) e `rkTot` usam as barras do nível.
- Botão 🎒 EQUIPAR (lobby do Boss) e EQUIPAMENTOS (tela rb) → `rkEquip()`:
  - Personagem selecionado no meio; espaços em volta: espada, capacete, armadura, botas, poção.
  - Lista da mochila (mesma da Torre) com filtro; toque equipa/bebe; toque no espaço tira.
  - A poção ativa agora também vale (e é gasta) na luta do Boss (`rkApply`).
- Música: botão 🎵 nas telas do ranqueado → `rkMusic()` (aleatória / sem música / escolher faixa; salvo em `rk_mus`).
  - Toca no lobby (intervalo de volume vale também quando `showScreen.cur==='ranked'`) e na luta do Boss (`musPick` → `rkMusPlay`).
  - No modo aleatório, cada entrada no ranqueado sorteia uma faixa.
- `__dbg.mus()` para testes. Teste `ferramentas/testes/tequipar.js`.

## v218 — Broly bem mais fácil, prêmios dos elos, conquistas, menus leves e Caixa de Diamantes
- Broly: barras por nível `[[2,3],[2,4],[3,5],[3,6],[4,8],[5,10],[6,12],[7,14]]`; base b1 dm .65/df 1.2/sp .92, b2 dm .8/df 1.05/sp 1; IA dos níveis 1–3 mais lenta (`RKAI`).
- Elos (`RKRW`, resgate em `rk_rwc2`; quem já pegou o antigo recebe só a diferença de 💎):
  - Bronze 200💎 + baú raro · Prata 350💎 2🎫 baú épico · Ouro 500💎 3🎫 2 baús épicos 1🌱 · Diamante 800💎 5🎫 baú lendário 2🌱
  - Lendário 1200💎 8🎫 2 baús lendários 3🌱 · Dragão 2000💎 10🎫 baú mítico 5🌱 + CAIXA SECRETA (item especial sorteado)
  - Divindade 3000💎 15🎫 2 baús míticos 10🌱 + LÂMINA NEGRA + CAIXA SECRETA.
  - `rkBau` abre os baús da Torre por cima do ranqueado (cria o `#twModal` se a Torre ainda não foi aberta). `rkSpWin` mostra a caixa secreta.
- Conquistas: 35 (vitórias, lutas, tempo, dano, giros, lendários, personagens, equipamentos, cada rank), algumas dão 🎫; botão RESGATAR TUDO.
- Menus: o loop do jogo não roda mais na tela do ranqueado (`loop` pula `sc==='ranked'`); emblemas sem animação de filtro; botões com `touch-action:manipulation` e resposta ao toque.
- CAIXA DE DIAMANTES (hash `1b2e1xu`, código só com o dono): digitado no campo de nome da Torre.
  - Só vale para quem está na lista de jogadores da Torre (hashes de nome `TWDIAN` e uid `TWDIAU`, tirados com `.github/workflows/lista.yml` em 08/11).
  - 1 vez por pessoa: documentId `cupom_1b2e1xu_u<hash uid>` ou `_n<hash nome>`.
  - Sorteio `RKDIA`: 100 (25%) 200 (20%) 300 (16%) 400 (13%) 500 (10%) 600 (7%) 700 (4%) 800 (2,5%) 900 (1,5%) 1000 (1%). Vai para `rk_gem`.
- Testes: `trecomp.js`, `tdiamante.js`.

## v219 — campo de CÓDIGO no ranqueado e Caixa de Diamantes automática
- Botão 🎟️ CÓDIGO no topo de todas as telas do ranqueado → `rkCode()`; usa o mesmo `twCupom` (baús abrem por cima com `rkBau`, caixa com `rkDiaShow`). O código ADM continua só no nome da Torre.
- `rkOverTw(fn)`: mostra qualquer janela da Torre (`#twModal`) por cima do ranqueado.
- `rkDiaAuto()` (ao abrir o ranqueado): quem está na lista da Torre ganha a Caixa de Diamantes sozinho, 1 vez (mesmo documento do código: se já pegou pelo código, não ganha de novo). Marca `rk_dia`.
- Texto da caixa de info do Broly mostra as barras do nível.
- Teste `ferramentas/testes/tcodigo_rk.js`.

## v220 — CAIXA DA SORTE e CONTA (nome + senha)
- Código CAIXA DA SORTE (hash `1jzhy5g`, código só com o dono): qualquer jogador, 1 vez por pessoa (documentId `cupom_1jzhy5g_u<hash uid>`); 100–600 💎 sorteio uniforme, sem tabela. `rkDiaBox(2)`.
- CONTA (`acOpen`, botão 👤 CONTA no Menu Principal e 👤 no topo do ranqueado; janela própria `#acM`):
  - Criar: usa o nome atual (`tw_nome`) + senha (mín. 4). Não deixa criar se já existe conta com o nome.
  - Salvamento: todas as chaves `tw_*` e `rk_*` num doc novo `sv_<acc>_<ts36>` (campos `sv`=acc, `ts`, `d`=JSON, `sg`=HMAC). `acc`=SHA-256('furia|acc|'+nome)[:24]. Chave = PBKDF2(senha, 'furia|'+nome, 60000).
  - Só cria documentos (regras não deixam editar): salva a cada 2 min se mudou e ao sair/minimizar (`visibilitychange`), e ao abrir o ranqueado.
  - Entrar: consulta `sv==acc` ordenado por `__name__` DESC (funciona sem índice; o range só por `__name__` DESC precisa de índice), pega o mais novo com assinatura válida (doc falso sem a senha é ignorado), troca os dados e recarrega.
  - Local: `ac_k` (chave derivada), `ac_n`, `ac_h`, `ac_t` (fora do backup).
- Ferramenta `.github/workflows/teste_conta.yml` (testa a consulta no Firestore de verdade).
- Testes `ferramentas/testes/tconta.js`.

## v221 — código de 1000 💎 e mais diamantes no Broly
- Código 1000 DIAMANTES (hash `1kd7i6l`, texto só com o dono): uso único no jogo inteiro (documentId `cupom_1kd7i6l`); `TWCUP` aceita `gem:N` (soma em `rk_gem`).
- Vitória no Modo Boss: 💎 sempre 5–15 (antes 50% de 1–2). Caixa de recompensas do lobby mostra "5-15".
- Teste `ferramentas/testes/tmil.js`.

## v222 — Lâmina Negra garantida só em 160 giros
- Pity da espada secreta (`rk_pity2`): 50 → 160 giros (pedido do dono: estava fácil demais). Chance por giro continua 0,3%. Textos do gacha atualizados.

## v223 — personagens MÍTICOS no gacha (Naruto, Madara, Garou)
- `RK_MIT=['naruto','madara','garou']` (saíram de `RK_LEG`). `rkRar` → 'mit' (cor vermelha, carta `RQA.card.mit`).
- Chance 0,4% por giro, **sem garantia** (não usa nem zera o pity de lendário). Repetido: +60 💎.
- Ao aparecer (novo ou repetido): `rkMega()` (tela "SUPER MEGA SORTE!", raios vermelhos, tremida, ~2,9 s) → revela a carta → `rkCharWin(id,1,nw)` toca o vídeo da ULTIMATE (`RKUV`: NRU/MDU/GRU, sem som) e mostra o corpo inteiro com fundo vermelho.
- Revelar tudo agora é em sequência (não sobrepõe animações) e a carta não revela duas vezes.
- Taxas, biblioteca e histórico mostram "MÍTICO". Quem já tinha esses personagens continua com eles.
- Teste `ferramentas/testes/tmitico.js` (força o sorteio mítico com `Math.random` só dentro de `rkRoll`).

## v224 — mítico garantido em 110, sem repetido, XP turbinado e recordes no Boss
- Mítico (`rk_pity3`): garantido em 110 giros; só sorteia míticos que o jogador NÃO tem (`RKMTMP` evita 2 iguais no mesmo giro de 10); com os 3, o mítico para de aparecer e o contador some da tela.
- XP de vitória +50%: `RKXW=[150,180,210,240,270,300,340,390]` (derrota igual `RKXL`).
- Bônus (`RKXB`), mostrados em etiquetas no resultado (`.rkXb`):
  - Combo: +2 XP por golpe do maior combo (máx. +60).
  - SEU RECORDE de tempo no nível (ou 1ª vitória no nível): +150 (`st.rec[nível]`).
  - RECORDE DO SERVIDOR (vitória mais rápida no nível entre todos): +600 + aviso. `RKSRV` vem de `rkSrvLoad()` (docs `rk`; `lv` agora é enviado no `rkSend`; docs antigos usam o rank do `rp`). Sem internet = sem bônus de servidor.
  - Derrota: o dano causado devolve até 80% do XP perdido (`RKXL*0.8*fração`).
- Tela rb mostra recorde do servidor e o seu no nível.
- Testes `trecorde.js`, `tmitico2.js` (no `trb.js` o exemplo antigo 5500→5660 virou 5892 por causa do buff + 1ª vitória).

## v225 — tickets de giro arrumados, evento 3x XP e tela da conta mais clara
- Tickets (`rkCost(n)`): tickets são usados primeiro (1 ticket = 1 giro). Giro de 10 agora também usa tickets: os que faltarem custam 45 💎 cada. Etiqueta amarela no botão mostra o custo (`.rkTk`). Antes o giro de 10 ignorava os tickets.
- Eventos de XP: `RKEVX=[[inícioUTC, fimUTC, mult, nome]]`. Primeiro: 08/11 20:00–22:00 (Brasília) = 3x XP; multiplica todo o XP da VITÓRIA (com bônus), derrota igual. Faixa `rkEvTxt()` em todas as telas do ranqueado com o tempo que falta; a tela rb mostra o XP de vitória já multiplicado.
- Conta: a tela "MINHA CONTA" diz claramente que já está conectado neste aparelho e mostra rank, XP, 💎, personagens e moedas; criar conta com nome que já tem conta manda usar ENTRAR.
- Ferramenta `.github/workflows/busca.yml` (input `nome`, `*` = tudo): lista docs do servidor por nome (o campo `d` dos saves aparece só como tamanho). Os saves (`sv`) podem ser lidos com `consulta.yml` (campo `sv`, valor = acc).
- Teste `ferramentas/testes/tticket.js`.

## v226 — aviso de ticket discreto
- O dono achou feia a etiqueta amarela em cima do preço. Agora é uma faixinha escura pequena ACIMA de cada botão (`.rkTk`, fora do botão): "🎫 usa 1 ticket (não gasta 💎)" / "🎫 usa 4 tickets + 270 💎". O preço original do botão aparece normal.

## v227 — gacha sem personagem repetido + código de 2000 💎
- `rkNewChr(r)`: lendário/épico só sorteia personagem que o jogador NÃO tem (nem repetido dentro do mesmo giro de 10, via `RKMTMP`). Se já tem todos daquela raridade, vem um equipamento da mesma raridade. Míticos já eram assim (v224).
- Código 2000 DIAMANTES (hash `17hle64`, texto só com o dono): uso único no jogo inteiro.
- Teste `ferramentas/testes/tsemrep.js`.

## v228 — MODO TORRE dentro do Ranqueado + menu novo + mochila nova com pilhas
- Artes do dono (`ferramentas/ranqueada_artes/*_v228.png`): menu principal novo (sem Torre; Perfil 🔒 EM BREVE), menu do ranqueado novo (Modo Boss, Torre, Desafio do Tempo 🔒, Gacha) e tela "MODO TORRE RANQUEADA" (`RQA.torre_rk`, 1671×941).
- Menu principal: `#mTorre` escondido; `#mPerfil` bloqueado (toast "em breve"). Posições `#mm .mbN` no rk.css.
- Torre só pelo Ranqueado (`rkTorre()`): usa o personagem selecionado do ranqueado (só os que o jogador tem). `twBackF`/SAIR voltam ao menu do ranqueado.
- Tela da Torre: `rkTwSkin()` (no fim do `twBuild`) troca a arte e reposiciona tudo (`RTSLOT` = andares; `rtB()` = coordenadas na arte). `rkTwRender()` (fim do `twRender`): emblema do rank no círculo (toque = recompensas de rank), nome + título + personagem (🔍 = trocar personagem, `rkTwPick`), barra de XP do rank, BÔNUS (⚔️ DANO, ❤️ barras, 🛡️ DF, ⚡ VEL, 🎯 CRÍT, 🍀 ST). Botões da arte: RANKING, RECOMPENSAS (`rkTwRw`, explica XP e tabela de bônus), TEMPORADA (evento/semana), RANKS (`rkRewards`). Linha extra: EQUIPAR, LOJA, TÍTULOS, CHAT, NOME, TROFÉUS (clicam os botões antigos escondidos do `#twInfo`). O painel antigo virou o placar pequeno no topo.
- Mesma rank do Boss (`rk_rp`). XP da Torre (`rkTwXP` no `twFinish`, mostrado no fim): cada andar `RKXW*0,6`, completar `RKXW*2`, cair no 1º andar `-RKXL*0,5`; evento de XP multiplica.
- BÔNUS DE RANK na Torre (`RKTB(i)`: dano 2i%, defesa 2i%, vel i%, crít i%, sorte 3i%), aplicado no `twApply` (`rkTwBuff`). Sorte (`rkSorte`, ADM +30) melhora `twRoll`/`twEqRoll`/`twPoRoll` (substitui a sorte só do ADM).
- Mochila: `twBag` agora abre a mochila nova (`rkEquip`, funciona na Torre e no Ranqueado — `rkModal`/`rkToast`/`RKMS()`/`rkHost()` usam a janela da Torre quando a tela é a Torre). Itens iguais (e poções iguais) ficam numa PILHA que ocupa 1 espaço (até 99): `twStacks()`; `twCap` conta pilhas (20). Toque no item → detalhe: EQUIPAR / VENDER 1 / VENDER TODOS / BEBER / DESCARTAR.
- Testes: `ttorre_rk.js` (novo); `tequipar.js`, `tcupom*.js`, `tdiamante.js` atualizados para o caminho novo. `ttorre_bau.js` (v196) já estava desatualizado (tela de andar vencido mudou depois).

## v229 — Torre em tela cheia, título no lugar do nome, código SORTE MÁXIMA
- Tela da Torre ocupa a tela inteira (`#twBox.rkT` 100vw×100vh; a arte estica um pouco na largura; tudo é posicionado em %).
- Barra do nome: o nome saiu (ficava escuro/bugado); agora mostra só o TÍTULO ativo grande (`.rtTit`, cor do título) e o personagem embaixo.
- Código CAIXA DA SORTE MÁXIMA (hash `1tg5gr8`, texto só com o dono): 100–1000 💎 totalmente aleatório; 1 vez por NOME (documentId `cupom_1tg5gr8_n<hash nome>`); precisa ter nome. `rkDiaBox(3)`.
- Teste `ferramentas/testes/tsorte3.js`.

## v230 — loja de poções sem "mochila cheia" falso + espadas do torneio ÚNICAS
- Loja (`twShop`): agora usa as pilhas — a poção entra se já existe pilha igual com menos de 99 ou se há espaço livre (`twPocFits`). Mochila passou de 20 para 40 espaços (`TWBAG=40`), cada espaço com até 99 iguais.
- Espadas do 1º Torneio (LÂMINA SOMBRIA do 1º = Vini_junior10, LÂMINA DOURADA do 2º = Denilson ADM): `rkUniqFix()` (ao abrir o jogo) transforma em ITEM ÚNICO: Ataque +25%, Crítico +15%, Sorte +5% (`st`, soma em `rkSorte`), mantém a velocidade, `uniq:1`. Prêmios do `TWEV.prem` também atualizados. Não podem ser vendidas.
- Visual único (`.uniq`): borda arco-íris girando, brilho pulsando, ✦ piscando e item balançando com brilho na mochila.
- Teste `ferramentas/testes/tunico.js`.

## v231 — Torre mais difícil conforme o rank
- `RKTD` (por rank 0–7) aplicado no inimigo em `twApply` (`rkTwDiff`): dano ×[1,1.05,1.1,1.15,1.22,1.4,1.55,1.65], barras ×[1,1,1.1,1.15,1.25,1.4,1.55,1.65], vel ×[1,1,1.02,1.04,1.06,1.1,1.14,1.16], IA +1 nível a partir do Lendário. Leve até o Diamante, bem mais difícil do Lendário para cima (para chegar no Dragão Lendário/Divindade).
- RECOMPENSAS da Torre mostra a dificuldade do seu rank e a coluna 👹 Inimigos na tabela.
- Teste `ferramentas/testes/ttorre_dif.js` (andar 1: Madeira 2 barras/dano ×1; Dragão 3 barras/dano ×1,55/IA 2).

## v232 — servidor estourou o limite de LEITURAS do dia (plano grátis) → economia
- 08/11 ~22h: Firestore respondeu 429 "Quota exceeded" (leituras; escrita ainda funcionava). O plano Spark dá 50 mil leituras/dia e zera à meia-noite do Pacífico (~05:00 de Brasília). Ferramenta `.github/workflows/status.yml` testa leitura e escrita.
- Culpados: ranking do ranqueado/recordes (até 1000 docs por consulta), mapa de títulos (todos os `claim`), chat global a cada 10 s, online a cada 30 s.
- `twFetchT` agora passa por um CACHE das consultas (`RKQC` + localStorage `qc_*`): títulos 30 min, ranking/recordes 5 min, outros rankings 3 min, online ~4 min, chat 25 s; nome/conta/uid sem cache. Se vier 429, para de consultar por 15 min (`RKQ429`), usa o que tem guardado e avisa "Servidor no limite de hoje".
- Menos escritas também: online a cada 5 min (bucket `p`+5 min), salvamento da conta a cada 5 min, chat global atualiza a cada 30 s, chat da Torre a cada 25 s.
- Se continuar estourando com muitos jogadores: o dono pode ativar o plano Blaze (pago por uso, centavos) no Firebase.
- Teste `ferramentas/testes/tcache.js`.

## v233 — códigos de poções e do PEITORAL LENDÁRIO ÚNICO
- Código 6 POÇÕES MÍTICAS + 7 LENDÁRIAS (hash `1a7bd9w`): uso único no jogo inteiro. `TWCUP` aceita `poc:[[raridade,qtd],...]` (vão direto para a mochila, em pilhas).
- Código PEITORAL LENDÁRIO ÚNICO (hash `bb4q7b`): uso único; armadura lendária `uniq` Defesa +25%, Dano +5%, Sorte +5%, já equipada. Itens de código agora guardam todos os campos (`Object.assign`), e o texto de item único mostra o atributo certo de cada tipo.
- `TWCUP.bau` pode ser lista (`rkBauSeq`), esperando os baús automáticos de um lote terminarem antes do próximo.
- Teste `ferramentas/testes/tcod_v233.js`.

## v234 — muito menos leituras no servidor
- Ranking do ranqueado: em vez de ler até 1000 docs `rk`, usa consultas ORDENADAS pequenas (`rkOQ`): RANK `rp` desc 150, DANO `dmg` desc 100, MAIS RÁPIDO `tw` asc 100, 1ª FASE `t1w` asc 100. `rkSend` agora grava `tw` (tempo da vitória), `t1w` e `rkr:'L'+nível` (só vitórias).
- Recorde do servidor: lê só as vitórias do nível atual (`rkQ('rkr','L'+nível)`). Docs antigos (antes da v234) não contam nesses rankings/recordes novos.
- Chats por HORA: global grava `gh:'h'+hora` e lê só as últimas 6 horas; Torre grava `ch` e lê as últimas 6 horas (antes lia o dia inteiro / 3 dias a cada poucos segundos).
- Ranking da Torre (`twFetch`) lê 150 em vez de 300. Cache: títulos 6 h, rankings ordenados e recordes 10 min, semana/evento 10 min.
- Teste `ferramentas/testes/tchat2.js` (servidor simulado com where/orderBy; conta leituras).

## v235 — PERFIL e HISTÓRICO (artes do dono)
- Artes: `ferramentas/ranqueada_artes/perfil_v235.png` (1672×941, `RQA.perfil`) e `historico_v235.png` (1671×941, `RQA.historico`). Views novas do ranqueado: `pf` e `hs` (`pfH/pfOn`, `hsH/hsOn` no fim do `rk.js`; coordenadas em pixels da arte com `rkB2`). Os botões 🎵/🎟️/👤 ficam escondidos nessas telas.
- Menu principal: botão **Perfil** liberado (`#mPerfil` → `rkOpen('pf')`, rep no fim do `patch_v213.py`). Voltar (seta) = menu principal; abas PERFIL/HISTÓRICO trocam entre as telas. As outras abas vazias da arte ainda não fazem nada.
- **Perfil:**
  - Quadradinho = foto (`rk_foto`, jpg 200×200 ≤ ~40 KB, recortada no meio). Toque → TROCAR FOTO (galeria do celular, `<input type=file>`), 🏅 EMBLEMA (em breve: o dono vai mandar molduras animadas estilo Mobile Legends) e TIRAR FOTO. A foto fica no aparelho e vai no save da conta (chave `rk_`). Ninguém vê o perfil dos outros ainda; quando fizer isso, colocar o "esconder foto" do ADM.
  - 1ª faixa = nome (`tw_nome`, dourado animado para Denilson ADM); 2ª faixa = título em uso (toque abre `twTitles` por cima).
  - Bolinhas: rank ATUAL e MÁXIMO (`rk_rkmax`, atualizado no `rkS('rp')` e ao abrir o perfil) com brilho na cor do rank.
  - 3 bolinhas de baixo: personagens mais usados (`rk_use`, conta cada `startMatch` fora do treino, desde a v235).
  - Pedestal: personagem (`rk_ped`; vazio = o mais usado). 🔍 ou toque no personagem → escolher entre os personagens do ranqueado ou AUTOMÁTICO.
- **Histórico:** PARTIDAS = lutas no Boss + andares lutados na Torre; TAXA DE VITÓRIA = vitórias/partidas; TOP = posição no ranking RANK (`rkLoadRk('rp')`, cache de 10 min; fora dos 150 = "150+"); TORRE = subidas (começa com o `tw_hist`); BOSS = vitórias no Broly; PERSON. = personagens/total; RECORDE = vitória mais rápida no Boss (`st.tt`). Toque nos 4 botões = detalhe.
- **Radar (nível de habilidade, `pfRadar`)**, tudo local, sem servidor (toque = explicação):
  - CRÍTICO: média entre crítico da build (5% + equipamentos + bônus do rank) e críticos de verdade (`PFF` conta acertos/críticos do jogador 1 via `applyHit`/`critFx`); 35% = máximo.
  - DANO: média do dano no Broly (`pf.df`) 65% + bônus de dano 35%.
  - VELOCIDADE: `walk` do personagem mais usado + bônus de velocidade.
  - RANK: rank + progresso. COMBO: média do maior combo por luta (30 = máximo). FARM: tudo que juntou (💎 + 🔴×3 + 🪙/10, escala log).
  - Dados em `rk_pf` (tw, twc, twf, twl, n, cmb, df, hit, crit, farm, mo). Ganchos: `rkAfter` (Boss), `twAfter`/`twFinish` (Torre), `rkAdd` (💎/🔴).
- Teste `ferramentas/testes/tperfil.js` (`FOTO=<imagem> SH=<pasta> node ...`). `ttorre_rk.js` não clica mais no Perfil.

## v236 — Perfil em tela cheia, recorte da foto, vitrine de equipamentos, ranks e título ADM
- Perfil e Histórico ocupam a tela inteira (`data-full` no `.rkA` → `rkFit` estica a arte para `innerWidth×innerHeight`, como a Torre da v229).
- Foto: TROCAR FOTO abre o recorte (`pfCrop`): arrastar move, barra/2 dedos/roda dá zoom, prévia "assim vai ficar"; salva 200×200 jpg em `rk_foto`.
- As 3 bolinhas de baixo agora são a VITRINE (pedido do dono): toque → escolher um equipamento da mochila (`pfVitPick`, `rk_vit` = ids). Brilho por raridade (`.pfV.r0..r4`: comum simples → mítica com raios e brilho forte; item único com arco-íris). Nome + raridade embaixo. Os personagens mais usados continuam contando (`rk_use`) e decidem o pedestal automático.
- Ranks (`pfRkH`): quanto mais alto, mais efeito (`--k` = rank/7): brilho maior; raios girando a partir da Prata; faíscas orbitando a partir do Diamante; estrelinhas a partir do Lendário; anel de fogo no Dragão/Divindade; Divindade com brilho dourado extra.
- Título (`pfTitH`): placa grande com a cor do título (emblema para títulos de rank). ADM: placa dourada com borda animada, coroa, "ADM" dourado animado, "ADMINISTRADOR", brilhos piscando e faixa de luz passando.
- Teste `ferramentas/testes/tperfil.js` atualizado (recorte e vitrine).

## v237 — ver o PERFIL dos outros jogadores
- Toque num jogador no RANKING DO RANQUEADO (todas as abas), no CHAT GLOBAL (lobby do Boss) ou no CHAT DA TORRE → abre o Perfil/Histórico dele (`pfOpenOther`). Clique delegado em `[data-pu]` (`data-pu` = uid, `data-pn` = nome); `twChatHTML` foi reescrito no `rk.js` só para pôr esses atributos. A seta volta para onde estava (ranking reabre na mesma aba; chat da Torre reabre).
- Publicação (`pfPub`): doc `torre/pf_<twHash(uid)>_<ts36>` com `pfu`=uid, `uid`, `nome`, `d`=JSON (`pfMine()`: nome, título, rp, rank máximo, foto, vitrine, pedestal, radar, números do histórico). Só grava se mudou (`pfpub_h`, fora do save da conta). Ao abrir o próprio Perfil = na hora; ao abrir o jogo (15 s) e depois das lutas = no máximo a cada 30 min (`pfpub_t`).
- Leitura: `pfLast('pfu',uid)` (`__name__` DESC, limit 1 — como os saves da conta, sem índice) + `pfLast('pfh',uid)`; cache 5 min (`RKQT` /"pf[uh]"/). 2 leituras por perfil aberto.
- Tudo que vem do servidor passa por `pfClean` (foto só `data:image/jpeg`, imagens de item só `a/*.webp` ou data:image, personagem/título/raridade conferidos, números limitados, textos escapados).
- Quem ainda não abriu o jogo na v237: perfil básico pelo ranking (nome, título, rank, personagem do último Boss) com o aviso "ainda não atualizou o jogo" e Histórico com "—".
- Perfil de outro: faixa "👀 PERFIL DE <nome>"; nada é editável; toque num item da vitrine mostra o efeito; sem 🔍.
- ADM (título ADM + nome Denilson ADM) toca na foto de outro jogador → 🚫 ESCONDER FOTO / 👁️ MOSTRAR FOTO: doc `pfh_<hash>_<ts36>` com `pfh`=uid, `pfa`='h'/'s', nome Denilson ADM (vale o mais novo; leva até 5 min para os outros verem). Limitação: as regras do Firestore não conferem quem criou o doc.
- Teste `ferramentas/testes/tperfil_outro.js` (2 jogadores, servidor simulado com orderBy `__name__`).

## v238 — código PRESENTE DO ADM
- `TWCUP['1ho2mzo']={nm:'PRESENTE DO ADM',dia:4}` (rep no fim do `patch_v213.py`). Texto do código só com o dono.
- Só para quem tem CONTA conectada (`ac_n` + `ac_k`); sem conta: "❌ Esse código é só para quem tem CONTA...". 1 vez por conta: documentId `cupom_1ho2mzo_a<twHash(nome da conta minúsculo)>` (mesma conta em outro aparelho = "Você já usou esse código").
- Prêmio (só um, `rkAdmGift`, chamado por `rkDiaBox(4)`): 10% personagem que o jogador não tem (qualquer raridade; se já tem todos, vira tickets/diamantes), 50% 10 tickets de giro, 40% 100–600 💎. Salva a conta logo depois (`acSave(1)`).
- Caixa: baú mítico com raios dourados girando, anel arco-íris, brilho pulsando, estrelinhas e título "🎁 PRESENTE DO ADM 👑" dourado animado (`.rkAg`). Personagem sai de dentro da caixa com o nome.
- Teste `ferramentas/testes/tpresente.js` (`CODE=<código> SH=<pasta> node ...`).

## v239 — YUTA, Invocação Mítica, títulos numerados, ANEL, SISTEMA DE NÍVEL e sorte nos drops
### Yuta (id `yuta`, sid `yt` normal / `ytd` Despertar)
- Material do dono em `ferramentas/personagens/yuta/` (`poses/01..20`, `videos/`, botões, itens secretos, `REGRAS.md` com tudo o que ele pediu).
- Ferramentas: `seg_yt.py` (recorte; fundos transparente/branco/preto; a folha 04 de fundo xadrez escuro NÃO é usada), `build_yuta.py [ai]` (gera `yt_ai.json`; ~10 min com IA), `yt.js` (bloco do personagem), patch `ferramentas/web/extra/20_yuta.py` (lê `ferramentas/personagens/yuta/build/*.json`; as imagens já estão em `www/a`).
- Golpes (prefixo `u` normal / `w` Despertar; `startMove` troca `v*`): soco = cadeia de espadadas (ujab→ujab2→ujab3→uknee lançador→ustr), chute = chutes acrobáticos (ukick→ukick2→ukick3 estrela/rasteira→uhkick lançador); todo golpe que acerta cancela no próximo (soco↔chute, ou Ki). Ki (toque) = Corte Relâmpago `ytk` (4 Ki). Combo (3 s) = folha 18 (`ytc`). Smash = corte roxo (folha 06).
- Passiva (as 2 formas): a cada 4 golpes recebidos → `ytCounter` (contra-ataque com CRÍTICO forçado, `h.ycrit`).
- Despertar (vídeo do dono cortado para ~3,3 s, sem som): velocidade ×3 (`speedMul`), dano total +60% (`ytBuff`: tdm ×1.6/1.45 por cima do ×1.45 geral), crítico +50, aura = chama do Gojo recolorida em roxo (2 camadas) + raios `ZPAL.purp`. Golpes que acertam podem chamar a RIKA (`ytRika`, estado `ytr`, sprite vira a Rika = o Yuta some; 24% soco / 16% chute, espera 2,5 s). Combo alterna os 2 combos da Rika (`cmb` = folha 19, `cmb1` = folha 20).
- Ultimate (100 Ki, nas 2 formas) = vídeo do super ataque sem as partes brancas/pretas e 25% mais rápido (~5,3 s), 7 impactos + explosão roxa final.
- Botões do dono: `HUDA.yuta` (normal e despertar; só os botões, sem o HUD de vida); `HUTH.yuta` = chamas/raios roxos no despertar.
- Não está nos personagens normais do gacha: só sai na Invocação Mítica. Teste `ferramentas/testes/tyuta.js`.
### Invocação Mítica (`RKBAN` = 'mit' | 'esp', salvo em `rk_ban`)
- Arte nova `RQA.gacha_yt` (aba Mítica); a antiga do Gojo virou a aba ESPECIAL (abas desenhadas por cima: `.gbTabs`). Padrão 🔒.
- `rkRollY`: Yuta 0,4% (garantido em 250, `rk_pityY`; só 1 por jogador), itens secretos do Yuta 0,3% (garantido em 200, `rk_pityYS`, nunca repetido), equipamento 30%, moeda vermelha o resto. Sem a garantia de épico no giro de 10.
- Ganhou o Yuta: `rkMegaY` "SORTE MÍTICA!" roxo → vídeo da ultimate → `ytTitClaim`: tenta criar `torre/yttit_1..10` (documentId fixo; 409 = já tem dono) e dá o título `ytN` (+10% de dano no Boss e na Torre). Sem internet fica pendente (`rk_yttp`) e tenta de novo ao abrir o ranqueado. Brilho do título por número (`.ytt y1..y4`).
- Itens secretos (RKSP `yesp`,`yanel`,`yrou`,`yrika`, `yt:1`): valem 50% em quem não é o Yuta (`eqNf`). Faixa "Taxa Aumentada!" com brilho/flutuando (`.ytTaxa`).
### Equipamento: espaço do ANEL
- `twEqOn` agora inclui `anel`; `twEqB` (virou `let` no `10_v239.py`) soma extras dos itens (`dmg`, `def`, `vel`, `trf`) e o corte de 50%. Crítico de TODOS os equipamentos agora vale também na Torre (antes só o capacete) — `rkExtra`. `fdmg` = dano extra na transformação (`a.tfd`). Tela da mochila com visual novo (roxo, espaços redondos, personagem flutuando).
### Sistema de NÍVEL (Biblioteca → Personagens → ⬆ EVOLUIR)
- Arte nova da Biblioteca de personagens (`RQA.bib_pf`): nome, barra de nível, atributos, texto da ultimate. Tela de nível `lvl` (`RQA.lv_ed`): pedestal, atributos, nível atual→próximo, SUBIR/ELEVAR, árvore 6×4.
- Máx.: épico 30, lendário 40, mítico 50. Custo por nível `LVCOST` (🪙 da Torre + Pó Amaldiçoado `rk_po`): 150/10, 300/20, 500/35, 900/60, 1800/120. Cada nível +0,4% dano +0,15% crítico.
- Elevação para os níveis 10/20/30/40/50: Pergaminho/Cubo/Máscara/Chama/Orbe (`rk_el`). Drop por vitória no Boss 15/12/10/5/3% (Torre completa ×2), piedade 8/20/40/80/150 (`rk_elp`); gacha 1%.
- Árvore `LVTREE` (linhas abrem no nível 1,10,20,30,40,50): dano, dano crítico (`tcd`), crítico, velocidade, sorte, roubo de vida (`tls`), vel. ultimate (`tki` = Ki mais rápido). Escolher/trocar custa cristal (`rk_cr`, linha 1 comum … linha 6 2× mítico).
- Bônus aplicados em `rkExtra` (depois do `rkApply`, Boss e Torre). Ganchos no jogo base em `10_v239.py`.
- Drops: Boss (vitória pó 8–15, derrota 2–4, cristal 30%/6%), Torre (pó 3–6 por andar, cristal 10%), Gacha (pó 2–5 por giro, cristal 6%). Aparecem no resultado do Boss / toast.
### SORTE
- `lvSorte()` = rank + ADM + equipamento (anel!) + árvore do personagem; `lvLuck()` = 1 + sorte/200. Multiplica pó, cristais, itens de elevação, geminhas e moeda vermelha do Boss e as moedas da Torre (além da raridade dos baús, que já existia).
- Teste `ferramentas/testes/tsorte_crit.js`: crítico = ×1,6 (+ dano crítico da árvore), roubo de vida cura, anel do Yuta = 50 de sorte no Yuta e 25 em outros.
- Testes: `tv239.js` (gacha, Sorte Mítica, título nº, item secreto, biblioteca, nível, mochila), `tyuta.js`. `window.__rk` expõe funções para testes.

## v240 — vídeo de invocação do Yuta, código do INFLUENCIADOR, CAIXA DE GEMAS e baús sem poção
- Invocação Mítica: o vídeo da invocação é o do dono (`ferramentas/personagens/yuta/videos/invocacao.mp4`, 10,6 s, sem som, 128 quadros `RQA.invy`). A aba Especial continua com o vídeo antigo (`rkPlayVid`/`rkGachaOn` com `RKBAN`).
- Código PRESENTE DE INFLUENCIADOR (hash `1p6oul2`, `dia:5`, texto só com o dono): 1000 💎 + 70 Pó Amaldiçoado + 900 🪙 (dá para subir um personagem do nível 1 ao 7) + título INFLUENCIADOR (`TWTIT.inf`, rosa/neon arco-íris, já entra em uso). `rkInfGift`.
- Código CAIXA DE GEMAS (hash `9zxei9`, `dia:6`): 100–1000 💎 aleatório (`rkDiaBox(6)`).
- Os dois (e o Presente do ADM): 1 vez por CONTA (`dia>=4` → documentId `cupom_<hash>_a<hash da conta>`); sem conta não usa.
- Baús RAROS, LENDÁRIOS e MÍTICOS não dão mais poção: `twBauOpen` (códigos/elos), `twChests` (Torre: se a poção sorteada for rara/lendária/mítica vira equipamento da mesma raridade) e o baú do Boss (`rkAfter`). Comum e épico continuam podendo dar poção.
- Patch `ferramentas/web/extra/30_v240.py`. Teste `ferramentas/testes/tv240.js` (`C1`/`C2` = códigos).

## v241 — botões do topo da Biblioteca no lugar certo
- Na arte nova da Biblioteca (Personagens) os botões 👤, 🎵 e CÓDIGO já vêm desenhados: os botões do jogo ficam invisíveis exatamente em cima deles (`.rkA.lbArt`, ligado no `rkLibOn`). Campo de busca sem texto duplicado (a arte já tem "Buscar...").

## v242 — MODO FARM no Boss
- Na tela "Ranqueada · Modo Boss" os níveis ABAIXO do rank agora são jogáveis (🌾 FARM). `RKFL` = nível do farm (definido no `rkBossStart` a partir do `RKSEL`); `rkBL()` = nível usado pelo Broly (farm ou rank).
- No farm: não ganha nem perde XP de rank (vitória, derrota e desistência), não conta recorde e não envia para o ranking (`rkSend` não roda). Gemas e moeda vermelha normais. Menores: baú (lendário→épico, épico/raro→raro), ticket e equipamento (metade), drops especiais (metade e sem avançar a piedade), pó/cristais (metade), item de elevação (metade e sem avançar a piedade).
- LUTAR DE NOVO mantém o nível do farm. Teste `ferramentas/testes/tfarm.js`.

## v243 — EVENTO DO YUTA no Modo Boss (até domingo 15/11 23:59)
- Arte do dono `ferramentas/ranqueada_artes/boss_yuta_v243.png` (`RQA.boss_yt`). Telas do Boss em TELA CHEIA (`boss`, `rb`, `yb`, `yrb` com `data-full`).
- Lobby do Broly: o 2º espaço virou o botão do Yuta (`ysSlotOld`, com o tempo que falta). Lobby do Yuta (`yb`, `ysLobbyH`): 1º espaço volta ao Broly; chat, online, emblema do rank, recompensas (💎, pó, equipamento, ✦ 0,5%). Escolha salva em `rk_bsel`; `RKBID` = boss atual ('broly'|'yuta'), `rkBoss()`.
- `RKBOSS` ganhou o Yuta (mais barras e mais forte que o Broly em cada nível; fase 2 = Despertar com o vídeo dele). Todo o código do Boss usa `rkBoss()` (fases, banners, resultado "YUTA DERROTADO!"). Recordes separados (`rkr` 'Y'+nível, `st.recY`).
- Tela de início `yrb` (`ysStartH`) com 2 abas: RANQUEADO (igual ao Broly: nível = rank, dá/tira XP, passivas por nível) e FARM DO EVENTO.
- FARM DO EVENTO (`RKYD` = dificuldade, `YSDIF`): FÁCIL/NORMAL/DIFÍCIL/MESTRE/SUPER DIFÍCIL (força dos níveis 1/3/5/7/8 do rank, barras 2→3 … 8→15, Super +25% dano). Sem XP de rank. Passivas SORTEADAS a cada luta pela ROLETA (`ysFight`, `ysRoll`, pools `YSPOOL` fácil/média/difícil; novas: olho amaldiçoado +20% crít., energia cheia, maldição +25% dano 10 s, Rika protetora, roubo de vida 25%). Passivas agora são um conjunto (`o.rkPS`; no ranqueado `rkPSlv(nível)`).
- Drops do farm (`rkResult` com `R.yd`): 💎 2–14, pó 6–45, cristal 35%, equipamento 25–50% (raridade melhor nas altas), moeda vermelha; DIFÍCIL+ 0,3% item secreto do Yuta; MESTRE/SUPER 0,5% o próprio YUTA (Sorte Mítica + vídeo + título nº). Tudo × `lvLuck()` (sorte). Derrota: um pouco de pó.
- Fora do horário (`YSEV`) o Yuta some do lobby ("ENCERRADO"). `window.__ysT` = deslocamento de tempo para testes.
- Testes `ferramentas/testes/tevento_yuta.js` (lobby, telas, roleta, farm, ranqueado).

## v244 — telas do evento com as artes do dono, bônus dos títulos, ADM +60% e código de 4000 💎
- Tela de início do evento (`ysStartH`) agora usa as artes do dono: `RQA.ys_rank` (`yuta_rank_v244.png`) e `RQA.ys_farm` (`yuta_farm_v244.png`). O retratinho do Yuta do botão "LUTAR COM" é coberto pelo personagem escolhido (`.ysPort`). Os 4 espaços da esquerda mostram rank/sorte/recordes (ranqueado) ou sorte/gemas/pó/drop especial (farm).
- BÔNUS DOS TÍTULOS (`TBUF`, só o título EM USO; vale em todas as lutas do jogador 1 — `twAdmBuff` foi trocado por `tbApply`; no Boss é aplicado depois do `rkApply`): Iniciante +2% dano · Guerreiro +3% dano +2% vel · Conquistador +5% dano +3% def · Campeão da Semana +6% dano +5% crít · Campeão do Torneio +8% dano +5% crít +5% vel · Influenciador +5% dano +5 sorte · ranks: Madeira +1% def … Divindade +10% dano +6% crít +6% def +5 sorte · Yuta nº +5% crít (além dos +10% de dano de ter o título). A descrição de cada título mostra o bônus.
- ADM (quem tem o título ADM): +60% dano, defesa, velocidade, energia (Ki e transformação) e +60 de crítico em todas as lutas; sorte +60 (antes 30) e drops ×1,6 (`lvLuck`). Quando o dono mandar os itens com "taxa de drop", somar aqui.
- Placa nova do título ADM (arte do dono `titulo_adm_v244.png` → `RQA.tit_adm`) no perfil (`.pfAdmI`, brilho/flutuar/faixa de luz/estrelas) e nos rankings/chat (`.twTit.admI`).
- Código 4000 DIAMANTES ADM (hash em `ferramentas/web/extra/40_v244.py`, texto só com o dono): uso único no jogo inteiro.
- Teste `ferramentas/testes/tv244.js`.

## v245 — perfil com a arte nova, MOLDURAS da foto e título ADMINISTRADOR
- Arte nova do Perfil (`perfil_v245.png`, mesma chave `RQA.perfil`); coordenadas do `pfH` ajustadas (foto 297–482 × 143–332, ranks, vitrine, pedestal).
- Título ADM: tirada a arte da v244; agora é a placa feita em código `.pfAdmX` (borda girando vermelho/dourado, "ADMINISTRADOR" em degradê vermelho animado, linhas de energia, raios passando, coroa, faixa de luz e estrelas) e `.twTit.admX` nos rankings/chat.
- MOLDURAS (artes do dono em `ferramentas/ranqueada_artes/molduras/`; `cortar.py` recorta → `RQA.mold[k]` {src, h = buraco da foto em fração, ar}). Foto → 🖼️ MOLDURA (`mdPick`), salva em `rk_mold`; vai no perfil publicado (outros jogadores veem).
  - adm: quem tem o título ADM (dourado com brilho forte, flutua, faixa de luz, estrelas).
  - rk0..rk7: rank MÁXIMO alcançado (brilho cresce com o rank: `--k`).
  - top1/top2/top3: posição no ranking de RANK na semana atual (`rk_topw` {w: twWk, n}); conferido ao abrir o menu (`mdTopCheck`). Vale até a semana virar.
  - ytob: ter o Yuta. yt100: vencer as 5 dificuldades do farm do evento (`st.ysW`). br100: vencer o Broly nos 8 níveis, farm conta (`st.brW`).
- Teste `ferramentas/testes/tmolduras.js`.

## v246 — perfil (arte nova de novo), moldura sem tampar o rank, Divindade divina e código de 3000 💎
- Arte `perfil_v246.png` (`RQA.perfil`): ranks mais para baixo; coordenadas do `pfH` refeitas (foto 290–490 × 170–382).
- `mdH(...,yMax)`: a moldura diminui para não passar do topo do painel dos ranks (y 438). O brilho grande das molduras fica num anel de fora (não pinta a foto).
- Divindade (moldura rk7, moldura ADM e emblema do rank 7 no perfil): raios dourados girando, auréola flutuando, brilho mais forte.
- Código 3000 DIAMANTES (hash em `ferramentas/web/extra/50_v246.py`, texto só com o dono): uso único no jogo inteiro.

## v247 — itens secretos do Yuta com bônus certo e brilho negro "quebrando a realidade"
- Bug: a RIKA (capacete, `RKSP.yrika`) tem `v:0` (o bônus está em `def/crit/st/fdmg`), então aparecia "+0%". Agora o selo usa `rkItV(x)` = maior valor entre v/def/crit/dmg/st/fdmg (Rika mostra +40%).
- `rkIsY(x)` marca item secreto do Yuta (`ysec` ou `yt`+`r:'sec'`). Um reparo no carregamento reescreve os itens do Yuta guardados com os valores de `RKSP` (itens antigos sem `def/fdmg/ysec` voltam a dar bônus).
- Vitrine do perfil (`pfMine`/`pfClean`) agora guarda `def, fdmg, trf, yt, ysec` e aceita `r:'sec'` e `t:'anel'`.
- CSS `.ysec` (em `rk.css`): borda cônica preta/roxa, vazio escuro pulsando, rachaduras, imagem com glitch e tremida — no perfil, nos espaços da mochila, na lista e no detalhe do item.
- Lembrar: item do Yuta em outro personagem vale 50% (`eqNf`), por isso no Naruto a Rika soma +20% de defesa.

## v248 — vitrine do Yuta no lugar, EVENTO DE ATUALIZAÇÃO (10h) e código de evento
- Bug: `.ysec{position:relative}` vencia o `.rkA>*{position:absolute}` e jogava a vitrine do perfil (Uniforme do Yuta) para baixo. Corrigido com `.rkA>.ysec{position:absolute}`.
- Evento em `RKEVX` (rk.js): `[ini,fim,multXP,texto,{gem,luck}]`. Novo: 09/11/2026 15:30–10/11 01:30 UTC (12:30–22:30 Brasília): 2x XP de rank, 2x gemas (`rkEvG()` nas lutas de Boss/farm e no evento do Yuta) e 2x sorte (`rkEvL()` dentro do `lvLuck`). A sorte também aumenta gemas/pó/drops, então somado fica bem forte (de propósito, é evento). Códigos NÃO dobram.
- Faixa do evento no menu do Ranqueado foi para a esquerda (`.rk_menu .rkEvX`) para não tampar o painel de rank/moedas.
- Código de EVENTO (hash `w9rmwq` em `ferramentas/web/extra/60_v248.py`, texto só com o dono): 1000 💎 + 20 🎫. Tipo novo `ev:1` no `twCupom`: todo mundo pode usar, 1 vez por CONTA (sem conta, 1 vez por aparelho). Teste: `ferramentas/testes/tevento_v248.js`.

## v249 — RIKA vira OBSCURA (acima da SECRETA), sempre equipada, Sorte/Drop no verde
- Bug: a Rika tem `v:0`, então o `twAddItem` (base) trocava ela por QUALQUER capacete novo (`it.v>cur.v`), e o `twCap` (mochila cheia) jogava fora o item "mais fraco" = a Rika. Agora (`extra/70_v249.py`): drop novo não troca item do Yuta (`rkIsY`), e a mochila cheia nunca descarta item do Yuta.
- Nova raridade `obs` = **OBSCURA** (cor `#c46bff`, venda 10000, `TWEQR`), acima da SECRETA. `rkHi(r)` = sec ou obs. `rkLock(x)` = item obscuro: sempre equipado (o reparo no carregamento re-equipa), não dá pra tirar, trocar nem vender (mochila do Ranqueado e da Torre).
- RIKA nova: `{r:'obs',def:40,crit:20,st:30,drop:30}` — saiu o "Dano na transformação", entrou **Drop +30%** e Sorte foi para 30. O reparo apaga campos antigos (ex.: `fdmg`).
- Stat novo `drop`: `eqDrop()`/`rkDropF()` — multiplica o `lvLuck` (pó, cristais, itens de elevação, gemas extras) e a chance de ticket e equipamento no fim da luta do Boss.
- Rodapé da mochila: crítico agora conta o 50% fora do Yuta (`eqCrit`), mostra 🔥 dano na transformação se tiver, e **🍀 Sorte / 🎁 Drop em verde** (`.eqGr`).
- Classe extra `.yobs` (via `rkYC(x)`) deixa o item obscuro mais escuro, com fumaça preta e brilho vermelho. Teste: `ferramentas/testes/trika_v249.js`.

## v250 — 3 ranks acima da Divindade, poções de CURA e DROP, ANÉIS DE DROP
- Artes do dono em `ferramentas/ranqueada_artes/v250/` (recorte: `cortar.py` → `saida.json`, juntado no `rk_assets.json`: `rank[8..10]`, `mold.rk8..rk10`, `pcu[6]`, `pdr[6]`, `anel[6]` na ordem comum, rara, épica, lendária, mítica, secreta).
- Ranks novos: 8 DIVINDADE SUPREMA (50.000 XP), 9 DIVINDADE CELESTIAL (70.000), 10 DEUS CELESTIAL (100.000). `RKTOP=RKR.length-1` substitui os "7" fixos. Estendidos: `RKXP/RKXW/RKXL`, `RKLVS`, `RKBOSS[].ph`, `RKTD`, `RKPAS`, `RKRW` (recompensas), conquistas `dvs/dvc/dsc`, `TBUF.rk8..rk10`, molduras `MDL.rk8..rk10` (classe `r7` + `r8/r9/r10`). Perfil: `pfRk` ganha `t7 tdv` acima do 7.
- Tela do Boss (arte com 8 quadros): a partir do nível 9 a fileira vira uma janela (`s0=lv-7`) com quadros desenhados por cima (`.rbCell.ov .rbO`). Mesma ideia na aba RANQUEADO do evento do Yuta.
- Poções novas (no `tw_poc` com `pk:'cura'|'drop'`, `v` = valor): CURA 3/15/20/45/75/100% e DROP 3/15/20/45/75/100% (comum→secreta). Beber guarda em `rk_pk_cura` / `rk_pk_drop` (uma de cada, separada da poção de buff). No começo da próxima luta de Boss/Torre (`rkExtra`): a cura arma `p.rkCura` (cura 1 vez quando a vida fica abaixo de 35%, `rkCuraTick` a cada quadro via `extra/80_v250.py`) e o drop vira `RKPDN` só naquela luta.
- Anel de drop (`t:'anel'`, `drop` 5/7/10/15/20/35%, `nm:'ANEL DE DROP'`): `rkAddRing(r)` equipa sozinho se for melhor (não troca anel do Yuta).
- Drop total: `rkDropF()=1+(eqDrop()+RKPDN)/100` — entra no `lvLuck` e nas chances de ticket/equipamento/poção/anel do Boss.
- Onde caem: vitória no Boss (fora do baú): 22% poção de cura/drop (farm 12%), 7% anel de drop (farm 4%), tudo × drop. Secreta = 1% × drop.
- Teste: `ferramentas/testes/tv250.js`.

## v251 — poções de CURA na loja da Torre
- `twShop` embrulhado no fim do rk.js: embaixo das poções normais aparece "💚 POÇÕES DE CURA" com as 6 raridades. Preços `TWSHCU` (moedas da torre): comum 1000, rara 2000, épica 4000, lendária 5000 (o dono não falou a lendária; ficou entre épica e mítica), mítica 6000, secreta 20000.
- `twPocFits` refeito com a chave nova das pilhas (`p|pk|r|v`). A loja rola para baixo se não couber (`.twShop{max-height:96vh;overflow-y:auto}`). Teste: `ferramentas/testes/tloja_cura_v251.js`.

## v252 — baús da Torre dão poção de CURA/DROP e ANEL DE DROP
- Pedido do dono (a Torre é "o mais legal"). `rkBauX(r)` (fim do rk.js) é chamado em cada baú do `twBauOpen` (`extra/90_v252.py`): 25% poção de cura ou drop, 10% anel de drop, tudo × `rkDropF()`; senão segue o baú antigo (poção normal/equipamento). Raridade = a do baú; 1% × drop vira SECRETA.
- Vale para todos os baús que usam `twBauOpen` (Torre, recompensas de rank, códigos de baú). A regra antiga "baú raro+ sem poção" continua só para a poção normal de buff.
- Teste: `ferramentas/testes/tbau_v252.js`.

## v253 — PASSIVAS / ENCANTAMENTOS com a JOIA NEGRA
- Regras do dono: `ferramentas/ranqueada_artes/v253/REGRAS_PASSIVAS.txt` (36 passivas, chances, proteção, limites). Artes: `passiva.png` (tela, `RQA.passiva`), `joia_negra.png` (`RQA.jn`), `mercado_negro.png` (`RQA.mercado`, ainda não usado — Mercado Negro espera o dono dizer preço fixo/faixa e taxa).
- Tudo no fim do rk.js ("v253"). Dados numa chave só `rk_ps` = {jn (joias), pl/pm (contadores 50/200), pend (giro sorteado esperando APLICAR/MANTER), ch (passiva por personagem), aura (0 = aura desligada)}. Passiva de item fica no item `it.ps={r,i}` (entra na chave da pilha e na vitrine do perfil).
- Tela `rkView('ps')` (`psH/psOn/psAct`), aberta pelo botão 💠 ENCANTAR da mochila (só no Ranqueado). Abas: personagem, espada, capacete, anel, armadura, botas; grade 3×3 com páginas. O giro grava joia−1 + resultado juntos ANTES da animação (`psRoll` decide; `psAnim` só mostra). Com giro pendente não dá para trocar de alvo.
- Efeitos (`psSum(id)` = personagem + itens equipados, com limites `PSCAP`): crítico → `p.tcd` (multiplicador do crítico); defesa → `p.tdf/(1+def/100)`; velocidade → `p.pspd` acelera só golpes `cat:'punch'|'kick'` (`extra/91_v253.py`); regeneração → `psRegTick` (5 s sem dano, a cada 5 s, máx. 15% da vida por luta); drop → `rkDropF`; sorte → `rkSorte`. Aplicado no começo da luta de Boss/Torre (`rkExtra`).
- Aura: personagem com passiva SECRETA troca a cor da energia (`p.def` copiado com a cor `PSTC` do tipo). Botão "✨ AURA DA PASSIVA" na mochila liga/desliga.
- Brilho: itens com passiva épica+ ganham `psg psr_<raridade> pst_<tipo>` (cor do tipo, mais forte quanto mais rara).
- Joia Negra: 0,5% × drop em cada vitória do Boss (rank/farm/evento) e em cada andar da Torre. Código pode dar joias com `{nm:'...',jn:N}` no `TWCUP` (dia/ev não).
- Teste: `ferramentas/testes/tpassivas_v253.js` (distribuição em 200 mil giros, proteção, pendente, aplicar, soma com limites, luta real com crítico/defesa/regen/aura).

## v254 — MENU com PASSIVAS e MERCADO NEGRO, código 5 Joias Negras
- Arte nova do menu do Ranqueado (`ferramentas/ranqueada_artes/v254/menu_ranqueado_v254.png`, `RQA.menu_ranqueado`) com 2 botões redondos: Passivas (`data-a="psMenu"` → `rkView('ps')`) e Mercado Negro (`mnMenu` → `mnOpen()`). O painel de rank/moedas (`.rk_menu .rkTop`) foi para o meio de cima.
- MERCADO NEGRO (`rkView('mn')`, arte `RQA.mercado`, fim do rk.js "v254"): preço LIVRE (dono decidiu), sem taxa. Abas: 🛒 comprar, ⇄ vender (itens da mochila menos ÚNICOS, poções, Joia Negra — 1 por anúncio), 💰 minhas vendas (status e RECEBER).
  - Firestore só cria: anúncio `mk_<lid>` {mk:'1', mkv:chave do vendedor (twHash do tw_uid), it:JSON, preco}; fechamento `mkb_<lid>` {mkx:'1', mks, tipo buy|cx|rm, preco} com documentId fixo (só um compra/cancela — 409 para o resto); preço do ADM `mkp_<lid>_<ts>` (vale o mais novo); recebimento `mkc_<lid>` (vendedor recebe 1 vez). Todos levam nome/andar:0/tempo:0 por causa das regras.
  - Anunciar tira o item da mochila antes (se o envio falhar, devolve). Comprar só tira os 💎 e dá o item depois do servidor aceitar. Vendedor recebe sozinho ao abrir o Ranqueado e na aba 💰 (`mnClaim`).
  - ADM (`twIsAdm()`): no detalhe aparece campo de preço + ✏️ MUDAR e 🗑️ REMOVER (o item volta para o vendedor).
  - Item de outro jogador passa por `mnClean` (só campos conhecidos, sem ÚNICO). Leituras do mercado ficam 20 s no cache (`RKQT`); ações limpam o cache. ATENÇÃO leituras: cada abertura lê até 600 anúncios + 1500 fechamentos (plano grátis = 50 mil leituras/dia).
- Código 5 JOIAS NEGRAS: hash `nbnmp9` em `extra/92_v254.py` (texto só com o dono); `jn` agora conta 1 vez por conta/aparelho (igual ao código de evento).
- Teste: `ferramentas/testes/tmercado_v254.js` (2 jogadores, servidor simulado: anunciar, comprar, sem saldo, cancelar, receber, não receber 2 vezes, código).

## v255 — Joia Negra cai mais
- Pedido do dono: chance da Joia Negra de 0,5% → **4% × `lvLuck()`** (a sorte aumenta; `lvLuck` já inclui drop, ADM +60% e evento) em cada vitória do Boss (rank/farm/evento) e em cada andar vencido da Torre.

## v256 — 2 códigos novos (texto só com o dono)
- `o9m3i1` = 40 JOIAS NEGRAS, uso ÚNICO no jogo inteiro (`uni:1` faz o `jn` não usar chave de conta → documentId `cupom_o9m3i1`, o 2º recebe "já foi usado por outro jogador").
- `n8jwhl` = PRESENTE DAS PASSIVAS: 1000 💎 + 20 🎫 + 5 💠, todo mundo 1 vez (`ev:1`; o ramo `ev` agora também dá `jn`).
- Arquivo `extra/93_v256.py`. Teste: `ferramentas/testes/tcodigos_v256.js`.

## v257 — Biblioteca mostra TODOS os bônus do personagem
- `cbAll(id)` (fim do rk.js) soma por origem: nível (`lvBonus`), equipamentos colocados (com 50% dos itens do Yuta em outro personagem), título em uso (`tbOf`), passivas (`psSum`), rank (`RKTB`) e ADM (+60). O painel "Atributos" agora mostra os totais (`cbRows`, com defesa, dano crítico, vel. de ataque, drop e roubo de vida pequenos ao lado) e o botão "🔍 TUDO" (`#lbAll`) abre a tabela por origem (`cbModal`).
- Só mostra; não muda como os bônus funcionam na luta. Teste: `ferramentas/testes/tbonus_v257.js`.

## v258 — cenário SHIBUYA (`shib`)
- 6 imagens do dono (2172x724, inteiro → 100% destruído; os 2 últimos com outra perspectiva e céu de fogo) em `ferramentas/cenarios/shibuya/L0..L5.png`. Montagem: `up.py` (IA 2x → B0..B5 3000x1000, pasta `/home/claude/shib`), `FMIN=2 FY=724 SKYD=120 SKYL=0 HZL=470,470,470,470,400,400 python3 prep_dn.py /home/claude/shib shibuya/shib.json 470`, `python3 shibuya/neon.py` (camada `win` = letreiros/telões acendendo à noite, sem o céu), `python3 prep_life.py shib shibuya/life_s.json B0..B5` (árvores balançando; água só nos níveis 2+).
- `extra/94_v258.py`: `DNS.shib` (`ph0:.79` começa de NOITE → amanhece → dia → pôr do sol → noite, dia de 200 s; níveis 5/12/20/30/42 pontos, 5º exige 1 ultimate e o 6º 2), `STG.shib` (pés na linha 640), `LT.shib`, miniatura. Efeitos novos no `dnLife`: `dnRays` (raios de sol de dia, saindo de `CUP.sun`, mais fracos com fumaça/destruição) e `dnInferno` (força por nível `CUP.inferno=[0,0,0,.35,.8,1]`: brasas subindo, cinzas caindo, chão quente laranja, luz de fogo piscando, tremidinhas).
- Teste: `ferramentas/testes/tshibuya.js` (fotos noite/amanhecer/dia/tarde e níveis).

## v259 — PASSE DE BATALHA (Temporada 1)
- Artes: `ferramentas/ranqueada_artes/v259/passe_batalha.png` (`RQA.passe`, 1774x887, `bpB`) e menu novo com o botão "Passe de Batalha" (`data-a="bpMenu"`). Tela `rkView('bp')` (`bpH/bpOn/bpAct`, fim do rk.js "v259").
- 20 níveis (2 páginas de 10, setas), 250 XP por nível. Trilhas: GRÁTIS (`BPF`), PAGO (`BPN`), PRÊMIO (`BPP`); o banner da coroa troca PAGO⇄PRÊMIO. Totais (o dono pediu): grátis 3000 💎 · 15 joias · 2000 🔴 · baú do Yuta · personagem LENDÁRIO aleatório (nível 20); pago 10000 💎 · 20 joias · 5000 🔴 · personagem MÍTICO aleatório (nível 20); prêmio 18000 💎 · 40 joias · 7000 🔴 · personagem À ESCOLHA (nível 15) · ESPADA À ESCOLHA (nível 20, sem itens ÚNICOS de torneio). O resto (tickets, poções de cura/drop, anéis, baús lendário/mítico, baú do Yuta) foi distribuído pelo Claude.
- Missões (`BPMD` diárias, voltam todo dia; `BPMS` da temporada): contadores via `bpAdd` em `rkResult` (lutas/vitórias no Boss), `twAfter` (andares/lutas), `twFinish` (torre completa), `lvSpinDrops` (giros do gacha), `psRoll` (giros de passiva). Fim da temporada `BPS.fim` = 09/12/2026 23:59 (Brasília). Nova temporada: mudar `BPS.n`, as tabelas e os códigos.
- Dados `rk_bp` (vai junto com a conta). O "pego" é salvo antes de entregar; escolher personagem/espada abre lista (`bpPick`) e só marca como pego depois de escolher. Personagem aleatório já tendo todos → 1500/3000 💎; à escolha tendo todos → 5000 💎.
- Códigos (`extra/95_v259.py`, texto só com o dono): `17lixq` libera o PAGO, `xoi9kg` libera o PRÊMIO (que libera o PAGO também). 1 vez por conta/aparelho — quem tiver o código consegue usar.
- Teste: `ferramentas/testes/tpasse_v259.js` (somas das trilhas, missões, código, pegar tudo, escolha de personagem e espada; os 60 prêmios).

## v260 — 6 músicas novas
- Mandadas pelo dono (o jogo é só para o grupo de amigos, sem cobrar): Dark Aria (Solo Leveling), Rap da Akatsuki, Madara (Tauz), Monster (Tauz), Obito (Tauz), Garou (Okabe). Convertidas para mp3 112k em `www/a/` e adicionadas no `MUS` + botões `#msel` 12–17 (`extra/96_v260.py`). Aparecem na escolha de música da luta, no Ranqueado (🎵) e no aleatório.
- Lembrar: o site e o repositório são públicos (qualquer um com o link acessa).

## Próximo personagem (ainda NÃO começar): SHAKA DE VIRGEM
- 09/11/2026: o dono mandou só 2 imagens de referência (`ferramentas/personagens/shaka/recebido/`). Esperar ele mandar o resto e dizer que mandou TUDO. Não inventar poderes.

## v261 — EVENTO DO PASSE (4 horas)
- `BPEV` (fim do rk.js): 09/11/2026 17:45–21:45 Brasília. Enquanto ligado: 3x XP em TODAS as missões do passe; seção "⚡ EVENTO" com 14 missões fáceis (`BPME`: Torre, Boss, lutas, gacha, passiva; contadores `o.e`, pegas em `o.ec`, zera quando muda `BPEV.id`) + missões de rank (`bpEvL`: "Esteja no rank X ou acima", uma por rank); faixa extra no topo (`bpEvBan`, junto do `rkEvTxt`).
- BAÚ DO EVENTO: cada vitória (Boss `rkResult` ou andar `twAfter`) tem 0,5% → `bpEvChest` cria o documento fixo `bpev_<id>` no servidor; quem cria primeiro ganha o PASSE PAGO (`bpUnlock(1)`), o resto recebe 409 e para de tentar. Quem já tem o pago não entra no sorteio. Libera direto (não mostra o código, para ele não vazar).
- Próximo evento igual: mudar `BPEV` (id novo + horário).
- Teste: `ferramentas/testes/tevento_passe_v261.js` (missões, 3x, dois jogadores disputando o baú).

## v262 — faixas de evento paradas
- `.rkEvX` usava a animação `rkEp` (scale) que apagava o `translateX(-50%)` e fazia a faixa tremer. Agora usa só brilho (`rkEvG`, e `bpEvG` na roxa do passe). Posição testada parada.

## v263 — MODO PC (teclado e mouse)
- Fim do rk.js ("v263") + `extra/97_v263.py`. `pcOn()`: automático (mouse e sem tela de toque = PC) ou escolhido no botão "Controles" (Configuração e Pausa; `ft_pc` '1' teclado, '0' toque, vazio automático).
- No PC: os botões de toque somem na luta (`$('controls').hidden=pcOn()` + `pcSync` a cada 250 ms), aparece a legenda das teclas embaixo (`#pcHud`, F1 esconde, `ft_pcleg`), aviso de girar o celular nunca aparece.
- Teclas novas no `KM` (as antigas continuam): Espaço = pular, Shift = defender, Q = especial, E = transformar, R = super, G = voar, Tab = trocar. Mouse na luta: esquerdo = soco, direito = chute. Esc nos menus do Ranqueado fecha a janela aberta ou volta (inclusive `menuBack`).
- "Como jogar" mostra o quadro das teclas no topo quando está no PC.
- Teste: `ferramentas/testes/tpc_v263.js` (andar, pular, soco, clique, chute, defesa, ki, especial, F1, Esc, celular com toque).

## v264 — 2 códigos únicos do PASSE PRÊMIO (Elite)
- `extra/98_v264.py`: hashes `3c1czy` e `15an3rn` (`bp:2,uni:1`): cada um libera PAGO + PRÊMIO para UMA pessoa no jogo inteiro (documento `cupom_<hash>`). Texto só com o dono. Teste: `ferramentas/testes/tcodigos_v264.js`.

## v265 — código de 20.000 💎
- `extra/99_v265.py`: hash `1q7f8pe` (`gem:20000`), uso ÚNICO no jogo inteiro (só 1 pessoa, 1 vez). Texto só com o dono. Teste: `ferramentas/testes/tcodigos_v265.js`.

## v266 — 2 códigos de diamantes
- `extra/9a_v266.py`: `74f1ed` = 15.000 💎 uso ÚNICO (1 pessoa no jogo inteiro); `2qr7un` = DIAMANTES DA SORTE, 500 a 1500 💎 aleatório, todo mundo 1 vez por conta (`ev:1,rnd:[500,1500]`, ramo novo `C.rnd` no `twCupom`). Texto só com o dono. Teste: `ferramentas/testes/tcodigos_v266.js`.

## v267 — ABAS DE EVENTO + 2º TORNEIO DA TORRE (corrida)
- Menu novo (`ferramentas/ranqueada_artes/v267/menu_ranqueado_v267_sem_ponto.png`: os "!" vermelhos pintados foram apagados; o jogo põe o pontinho só quando precisa). Botão "Abas de Evento" (`evMenu`, brilha + pontinho quando tem evento ou recado novo; `evAny`). Passe de Batalha mudou de lugar (`rkB(1682,420,1842,546)`).
- Tela `rkView('ev')` com a arte `abas_evento.png` (`RQA.abas_ev`, 1672x941, `bpB0`): até 6 abas (`evList`): TORNEIO (TWEV), EVENTO 2x (RKEVX), EVENTO DO PASSE (BPEV), RECADOS DO ADM. As faixas que ficavam no meio da tela foram desligadas (`rkEvTxt` vazio).
- RECADOS DO ADM: o ADM escreve e publica na própria aba (documento `avs_<ts>` com `avs:'1', tit, txt`; cache 20 s). Todo mundo lê. Assim códigos não ficam no GitHub. (Proteção do ADM é só no jogo.)
- TORNEIO (`extra/9b_v267.py`): `TWEV` novo `ev20261109`, 09/11/2026 20:15–20:45 Brasília, `fast:1` = ranking por mais andares e depois MENOR TEMPO (troféus não contam). Prêmios: 1º `bp:2` (Passe Prêmio), 2º `bp:1` (Passe Pago), 3º `gem:3000`. Entrega automática pelo `twClaims` (agora também ao abrir o Ranqueado), com janela de parabéns. O chefe final continua com 2 vidas no torneio.
- Teste: `ferramentas/testes/tabas_evento_v267.js` (abas ao vivo, recado do ADM, 3 vencedores recebendo, menu sem brilho fora de evento).

## v268 — torneio justo (20:20–20:50), chefe com 3 vidas, 1000 💎 por participar
- `TWEV` agora 20:20–20:50 Brasília, `lives:3` (chefe final volta 2 vezes; `d.twRev` conta as voltas), `flat:1` (`rkTwLv()` no rk.js devolve 0 durante o torneio: inimigos do rank mais baixo e SEM bônus de rank; itens/passivas/nível continuam), `part:1000` (todo mundo que tem subida no ranking do torneio ganha 1000 💎 uma vez, no `twClaims`, `ec[id].part`).
- Teste: `ferramentas/testes/ttorneio_v268.js` (4 jogadores: 3 premiados + participante).

## v269 — código de sorteio do PASSE PAGO
- `extra/9c_v269.py`: hash `189oqcd` (`bp:1,uni:1`): libera o Passe Pago para UMA pessoa no jogo inteiro. Texto só com o dono. Teste: `ferramentas/testes/tcodigos_v269.js`.

## Ferramenta: publicar RECADO DO ADM sem abrir o jogo
- `.github/workflows/recado.yml` (inputs `titulo`, `texto`): cria o documento `avs_<ts>` no servidor; aparece em Abas de Evento → Recados do ADM. Recados não dá para apagar (servidor só cria); para corrigir, publique outro (o mais novo aparece primeiro).
- 09/11/2026: sorteio do dono — 1º recado (20 sorteios, 4/3/7/20 → 3) foi substituído por "SORTEIO REFEITO" (100 sorteios com o 13 incluído → **7**).

## Ideia para amanhã (ainda NÃO fazer): MODO CAÇA ÀS BESTAS DE ALMA (estilo Soul Land)
- 09/11/2026, o dono: vai ter um modo para caçar bestas de alma que dropam ANÉIS DE ALMA (cor pela idade). Vão ter VÁRIAS bestas; só as BESTAS BOSS mais fortes podem dropar os anéis de **70 mil anos** e de **100 mil anos**.
- Ele vai mandar as REGRAS completas (e artes) amanhã. Esperar. Rascunho que o Claude sugeriu: anéis 10/100/1.000/10.000/(70.000)/100.000 anos, até 9 anéis por personagem, sorte/drop aumentam a chance, ossos de alma como drop super raro — tudo só sugestão até ele confirmar.

## v270 — MODO CAÇA (TESTE) com o LOBO SOMBRIO (primeira besta)
- 09/11/2026, o dono mandou 6 imagens do lobo preto (referência + folhas: garras, pulo/bote, ferido/morte, patada, andando) em `ferramentas/bestas/lobo/recebido/`. Ele é SÓ inimigo/boss (não jogável), só ataque físico, sem energia/especial/super, muito rápido, pulos altos, violento como animal.
- Corte: `ferramentas/bestas/lobo/cortar.py` (tira fundo branco, buracos fechados >40px e pedaços vizinhos) → `quadros/` + `info.json`; `assets.py` gera webp em `www/a` e `RQA.lobo={garras,pulo,ferido,patada,anda,por}` no rk_assets.json (altura em pé 275 unidades).
- Menu do Ranqueado: o botão travado "Desafio do Tempo" agora tem a etiqueta **🐺 CAÇA · TESTE** (`data-a="caca"` → `caStart()`).
- Código no fim do rk.js: `BSD` (5 barras de vida, vel 12.5), `bsMake` (troca o def do adversário por id 'lobo'), máquina de estados própria `bsStep` em `f.bs` (idle/run/back/a_claw 2 golpes 120+150/a_swipe 170 derruba/a_pounce pulo alto 190/a_land/hurt/dead), IA `bsThink` por distância, `bsDraw` (desenha o quadro virado, olho vermelho, rastro de garra). Wrappers em updFighter/aiThink/renderFighter/hurtbox/drawCastShadow/drawContact/drawAura/spriteKey/drawIceBody só quando `f.beast`.
- `G.gmode='caca'`: equipamento do jogador vale, tempo 180, banner "MODO CAÇA · TESTE". `endRound` → `caEnd`: volta ao menu do Ranqueado e mostra o resultado (LUTAR DE NOVO / FECHAR); o popup é reaberto até 6s se outra tela (diário/claims) fechar ele (`CA.rs`).
- AINDA SEM PRÊMIOS. Quando o dono mandar as regras do Soul Land: anéis por idade, 70k/100k só de besta boss.
- Teste: `ferramentas/testes/tcaca_v270.js`.

## v271 — LOBO SOMBRIO: tamanho de lobo, mais rápido, AUTO COMBO com dash
- O dono mandou mais 2 folhas: `recebido/06_derrubado.png` (6 quadros de dano/queda → 'cai') e `07_auto_combo.png` (grade 4x4 com números vermelhos → 'combo', 16 quadros). `cortar.py` corta pela grade, apaga o número do canto e guarda as garras roxas (margem maior).
- Quadros 07–16 do combo olham para a DIREITA: no RQA.lobo o quadro tem um 5º valor `1` (o desenho vira).
- Tamanho: ALT 160 (antes 275). REF de cada folha medido pela largura do corpo (combo 213, cai 351). Caixa de dano do lobo 210×200 (um pouco mais alta que o desenho pra soco no peito acertar).
- Velocidade: corrida 17, gravidade 1.1, tempos dos golpes menores, levanta com raiva (às vezes pula pra trás).
- AUTO COMBO (`f.bs='combo'`, tabela `BSC`, função `bsCombo`): olho brilha (aviso) → agacha → DASH veloz com rastro roxo (mordida) → garra baixa (defender embaixo) → garra pra cima (lança) → pulo + mordida no ar → mergulho girando → pancada no chão (onda dos dois lados) → dash cortando → patada final. 8 golpes, ~680 de dano se pegar tudo.
- Se o dash + garra baixa não acertarem (errou/defendeu), o combo para. Depois do combo ou do erro: **BRECHA!** (ofegante, toma +30% de dano, ~0,7s). Combo tem recarga de 4–6s.
- Quadros novos de dano: apanhou em pé (cai 0/1), voando (2/3), no chão (4→5), morte (2→5).
- Teste: `ferramentas/testes/tcaca_v271.js` (combo inteiro, combo errado → brecha, apanha, KO).

## v272 — nova tela "Modos de Jogo" (arte do dono: Shaka, Yuta, lobo, serpentes)
- Arte em `ferramentas/ranqueada_artes/v272/` (`fazer.py`: redimensiona p/ 1847×851, apaga o "!" vermelho pintado nas Abas de Evento com inpaint, gera webp → `RQA.menu_ranqueado`). A arte antiga (v267) saiu do www/a.
- Botões novos (rkB): Modo Boss, Torre, **Caçador** (no lugar do antigo Desafio do Tempo), Gacha; Passivas, Mercado Negro, Abas de Evento, Passe; barra de baixo (Ranking, Recompensas, Conquistas, Personagem, Minha Posição).
- **Caçador com cadeado**: só quem tem o título ADM (`twIsAdm()`) entra (`data-a="caca"`, etiqueta "ADM · TESTE"); os outros veem o cadeado e o aviso (`cacaLk`).
- Efeitos (`rkMenuFx`, CSS `.mfx`/`.mB`): brilho correndo nos botões (vermelho Boss, dourado Torre, roxo Caçador, azul Gacha), névoa roxa passando, vaga-lumes roxos, faíscas douradas subindo no cabelo do Shaka, olhos do lobo (vermelho) e das serpentes (roxo) piscando, orbe do Yuta pulsando, lua brilhando, raio roxo de vez em quando.
- Caixa de rank/moedas (`.rkTop`) agora pequena numa linha no canto de cima à direita (não tampa o Yuta).
- Teste: `ferramentas/testes/tmenu_v272.js`.

## v273 — MENU PRINCIPAL novo + Perfil dentro do Modos de Jogo
- Artes do dono em `ferramentas/ranqueada_artes/v273/` (`fazer.py` gera `RQA.menu_principal` e `RQA.menu_ranqueado`; apaga de novo o "!" pintado nas Abas de Evento e remove os webp antigos).
- Menu principal (#mm, classe `mm273`, código no fim do rk.js + CSS no fim do rk.css): **BATALHA AVENTURA** = `mRank` (abre o Modos de Jogo/ranqueada; botão grande com brilho dourado pulsando), **Batalha Treino** = `goSelect` (luta normal), **História** = `mHist` (o cadeado/EM BREVE já está pintado na arte), **Configuração** = `mCfg`. **Online e Perfil saíram do menu principal** (`mOnline`/`mPerfil`/`mTorre` escondidos): online já existe na ranqueada, perfil foi pro Modos de Jogo.
- Efeitos do menu principal (`.mmfx2`): luz da porta do domo, aura de fogo do Naruto e do Rengoku tremendo, brasas subindo, brilho correndo na parede dourada, estrelinhas na coroa do Aventura, planeta brilhando; brilho correndo nos botões (laranja no Aventura, azul no Treino/Config).
- Modos de Jogo: "Minha Posição" virou **Perfil** (`data-a="perfil"` → `rkView('pf')` com PFRET voltando pro menu). Posições dos olhos/orbe ajustadas para a arte nova.
- Teste: `ferramentas/testes/tmenu_v273.js`.

## v274 — CAÇA AO MONSTRO: tela do modo + LOBO de 10 NÍVEIS + cenário FLORESTA SOMBRIA
- **Tela** `rkView('ca')` (`caH`, arte `ferramentas/ranqueada_artes/v274/caca_menu.png` → `RQA.caca_menu`, 1672×941, `rkB2`): voltar, LOBO SOMBRIO (toque = explicação `caInfo`), 4 vagas trancadas (bestas futuras), prévia do cenário, os 5 anéis com idade (BRANCO 100 · AMARELO 1.000 · ROXO 10.000 · PRETO 50 a 75 mil · VERMELHO 100.000 anos — toque mostra; **ainda não caem**), botão de cruzar espadas = `caStart()`, barra com RECORDE (`rk_caRec` = quantas vezes derrotou). Efeitos: névoa, vaga-lumes, olhos piscando, lua. O botão Caçador do Modos de Jogo abre essa tela (continua só para quem tem o título ADM).
- **10 níveis** (fim do rk.js "v274"): `CALV` (vida 3→10 barras, dano .6→2.4, dano recebido 1→.3, velocidade 1→1.5 = passos extras do `bsStep`, recarga do combo), `bSc` tamanho +2,8% por nível. Ao zerar a vida (`ko` interceptado) o lobo cai (`caLvUp`), junta energia (vida enchendo), sobe de nível, sorteia uma **passiva** sem repetir (`CAPS`: regeneração, couro de aço, presas críticas, sede de sangue, couraça sombria = não para no dash/bote, instinto selvagem, fúria lupina, caçador incansável, esquiva animal) e levanta com UIVO (`caRevStep`): flash/anéis da cor do nível, empurra o jogador, banner "NÍVEL N · NOVA PASSIVA", tempo volta a 180, jogador ganha +10% de vida. Aura por nível (`caAura`: roxo → vermelho → vermelho com sombra preta) + brasas. Nível 10 derrotado = vitória ("REI DA FLORESTA").
- **Cenário** `flo` (`extra/9d_v274.py`, imagens em `ferramentas/cenarios/floresta/`, `up.py` IA → `/home/claude/flo/B*.png`; `FMIN=4 FY=724 SKYD=70 SKYL=0 HZL=20,20,150,260,260 python3 prep_dn.py /home/claude/flo floresta/flo.json 260`; `prep_life.py flo floresta/life_f.json B0..B4` (modo novo `flo`)). Escondido da escolha normal (`hid:1`), `ph0:.25` (a arte já é noite; sem escurecer de novo), destruição só pelo nível do lobo (`CASC=[0,1,1,2,2,3,3,4,4,4]` → `dnBreak`), `inferno` no último, névoa `dnFog` (`fog` por nível: forte no começo, rala no fim).
- Fim (`caEnd`): volta para a tela da caça com "derrotou o lobo NX", nível alcançado, passivas que ele ganhou, recorde.
- Teste: `ferramentas/testes/tcaca_v274.js`.

## v275 — LOBO NEGRO (nome novo), foto no VS, RAIOS no corpo, olhos e níveis 7-10 mais duros
- Nome: `BSD.name='LOBO NEGRO'` (todo texto da caça). As bestas NÃO são personagens: não entram na escolha da Batalha Treino nem em lugar nenhum além do modo Caça (o dono pediu; já era assim — a besta é o adversário "virado" por `bsMake`).
- VS: foto do dono em pé (`ferramentas/bestas/lobo/recebido/08_em_pe_vs.jpg`, `vs.py` tira o fundo → `RQA.lobo.vs`); `showVS` embrulhado troca `#vs2`/`#vsn2` no modo caça (por baixo o adversário ainda é o Goku).
- A aura saiu: agora **raios no corpo** (`caBolts`/`caAura`): cor `caCol(nível)` azul (nv1) → roxo → vermelho (nv10), quantidade 1+nível×1,4, maiores a cada nível; brilho suave a partir do nv5. O uivo usa a mesma cor.
- Olhos: a partir do nv7 brilham bem mais forte; nv8+ com risco de luz (estrela) piscando.
- Defesa: dano recebido nos níveis 7-10 = .40/.31/.24/.17 (antes .5/.43/.37/.3).
- Velocidade (`bsSpd`): níveis 7-10 ganham vantagem de 15/20/25/30% sobre o jogador, **dividida pela velocidade do jogador** (`o.tsp`, equipamentos de velocidade, ADM...). Quem tem muita velocidade anula a vantagem; vale em todos os níveis.
- Teste: `ferramentas/testes/tcaca_v275.js`.

## v276 — Lobo Negro SEM raios
- O dono pediu para tirar os raios do corpo: `CA_RAIOS=0` no rk.js (o código `caBolts` ficou, é só ligar se ele pedir de volta). Os olhos vermelhos fortes dos níveis finais continuam, e a energia roxa voltando quando ele levanta também.
- Teste: `ferramentas/testes/tcaca_v276.js`.

## v277 — ANÉIS DO PODER (inspirado em Soul Land)
- Artes do dono em `ferramentas/aneis/recebido/` (5 anéis em fundo preto + arte da aba `biblioteca_aneis.png`). `ferramentas/aneis/fazer.py`: preto vira transparente (alfa = brilho) → `RQA.anel2` (5 anéis; `RQA.anel` é outra coisa, os anéis de drop da v250) e `RQA.aneis` (arte da aba).
- Biblioteca: botão novo **💍 Anéis** (desenhado por cima das artes antigas, embaixo de Coleções) e a aba `RKL.tab='an'` com a arte nova (`anH/anOn/anGrid/anInfo/anPut/anSlot`, fim do rk.js "v277"). Personagem = o que estava aberto na aba Personagens (se for seu) ou o da ranqueada (`AN.ch`).
- 8 vagas no círculo; abrem 1 a cada 10 níveis do personagem (`anSlots = nível/10`, máx 8). **Hoje o nível máximo é 50 (mítico)/40 (lendário)/30 (épico) → no máximo 5/4/3 anéis** — falta o dono decidir se sobe o limite para 80.
- Anéis equipados flutuam em volta do corpo (`.anR`): cada um numa altura (de baixo pra cima), metade de trás atrás do personagem e a da frente na frente, balançando.
- Anel: `{i,c,g,s,v,a}` cor 0-4 (`ANC`: branco 100 · amarelo 1.000 · roxo 10.000 · preto 25-75 mil · vermelho 100.000 anos), nota `ANG` E..SSS (pesos `ANW` 40/30/17/9/3,5/0,4/0,08/0,02), atributo sorteado `ANS` (dano, crítico, velocidade, sorte, drop, vel. ultimate), valor `ANV[cor][nota]` (branco 1..15, amarelo 3..30, roxo 6..55, preto 12..100, vermelho 25..200). Dados `rk_an`, `rk_anEq`.
- Bônus: Boss, Torre e Caça (`rkApply` → dano/crítico/velocidade/vel. ultimate do personagem em luta); sorte e drop entram pelo `psSum()` (sem id). Coluna **ANÉIS** no "TUDO" (`CBS`).
- Drop: só do LOBO NEGRO, por nível derrotado (`anDropLobo`): chance 25%→80% (nv1→10, × sorte até 1,6); cor: branco sempre, amarelo nv3+, roxo nv5+, preto nv7+ (50 mil+ só nv9-10), vermelho só nv9-10 (bem raro). Aviso na luta e lista no fim da caçada. Jogar fora: botão no anel.
- Teste: `ferramentas/testes/taneis_v277.js`.

## v278 — botão "Anéis" da Biblioteca no lugar certo
- O botão desenhado por cima das artes antigas estava em cima do "Coleções" na arte `biblioteca` (abas Equip./Itens/Coleções). Agora fica logo abaixo de Coleções, do mesmo tamanho e no mesmo estilo (borda azul brilhando, cantos cortados, ícone do anel, letra itálica): `bib_pf` (aba Personagens) em `rkB(12,517,276,594)`, `biblioteca` em `rkB(8,555,279,640)`; nessa arte o botão "USAR TÍTULO" desceu para `rkB(18,652,268,716)`.
- Teste: `ferramentas/testes/tbib_v278.js`.

## v279 — CAÇA LIBERADA PARA TODOS + loot da caçada + NÍVEL DOS ANÉIS + PEDRAS DAS ALMAS + SET DO LOBO
- O modo Caça saiu do teste: o botão Caçador do Modos de Jogo abre para todo mundo (sem cadeado/ADM).
- **Sorte x Drop (regra do dono):** `caLuck()` = 1 + sorte/100 (máx 4x) multiplica as CHANCES (0,5% → 1% → 2%); `caDropF()` = drop multiplica as QUANTIDADES (10 💎 → 20 💎). Sorte/drop do Set do Lobo somam.
- **Loot por nível derrotado** (`caLoot`): geminhas (5+nv×4+0..5)×drop; 🔴 1-2 (20%, nv4+, sem multiplicar — moeda de dinheiro real); ticket 1%×sorte; sacola de PEDRAS DAS ALMAS (40%+3%/nv; comum→divina, as altas bem raras e melhoram com sorte/nível); peça do SET DO LOBO (10%+1%/nv; comum→divino); baú LENDÁRIO 2% / MÍTICO 0,6% (×sorte, nv4+, abrem com a animação normal depois do resultado).
- **Anéis** (substitui o drop da v277, `anDropLobo`): rola do mais raro: vermelho 0,4% (nv9) / 0,5% (nv10), preto 1,2% (nv7-8) / 2% (nv9-10), roxo 4% (nv5+), amarelo 9% (nv3+), branco 22% — tudo ×sorte.
- **Nível do anel** (`r.l`): máx `ANMX` branco 10, amarelo 20, roxo 30, preto 40, vermelho 50. Valor = valor da nota × (10% no nível 1 → 100% no máximo) (`anV`). Evoluir (`anUpM`, botão ⬆️ EVOLUIR no anel): anel grande animado, barra de nível, custo `anCost(l)`: pedra comum (1-9), rara (10-19), épica (20-29), lendária (30-39), mítica (40-44), secreta (45-48), divina (49→50); quantidade 1-3; + 20×nível geminhas.
- **Pedras das Almas** `rk_pdr2` [7] (ícones `RQA.pedra`, `ferramentas/bestas/lobo/set/pedras.png`). Aparecem na Biblioteca › Itens.
- **Set do Lobo** (ícones `RQA.lset[peça][raridade]`, `set_lobo.png`; `fazer.py`): capacete=crítico, armadura=defesa, botas=velocidade, colar=sorte na caça, anel=drop na caça, capa=dano (`LSV`, comum→divino). **Só vale no modo Caça.** Guardado `rk_ls {peçaRaridade:qtd}`, `rk_lsEq {peça:raridade}`. Tela: botão "🐺 SET DO LOBO · 🎒 PEDRAS" na tela da Caça (`lsOpen`). Peças também listadas em Biblioteca › Itens.
- Teste: `ferramentas/testes/tloot_v279.js`.

## v280 — SHAKA DE VIRGEM (personagem SECRETO) + Invocação ILIMITADA
- Material e regras do dono: `ferramentas/personagens/shaka/` (`REGRAS.md`, `poses/01..14`, `videos/`, `recebido/`, `gacha/`, `itens_secretos.png`). Ferramentas: `seg_sk.py` (recorte; folhas 11 e 13 por componentes/watershed), `build_sk.py` (sem IA; `build/sk.json`), `imgs.py` (retrato/miniatura/corpo), vídeos extraídos com ffmpeg a 12 q/s (transformação ×1,2 sem os quadros pretos/com defeito; ultimate inteiro) → `build/vids.json`. Código `sk.js`, patch `ferramentas/web/extra/9e_v280.py` (mesmo esquema do Yuta).
- Luta (id `shaka`, sid `sk`/`skd`, golpes `S*` normal / `Z*` olhos abertos): soco/chute/Ki cancelam um no outro quando acertam (super combos), Ki = Passo de Luz (`skk`), combo = Fúria de Virgem (`skc`), smash = palma de energia. Velocidade 1,3 (olhos abertos 1,82 = +40%). ROS st 99/99/99 (o mais alto). Passiva: 5 golpes recebidos → contra-ataque crítico (`skcn`).
- ABRIR OS OLHOS (transformação): vídeo do dono; inimigo PARALISADO 3 s (`o.skPar=180`, estado 'rushed'); +90% dano (`skBuff`), +60% crítico; DESVIA SOZINHO 35% (`skDodge` no começo do `applyHit`, recarga 50 quadros); aura = chama do Gojo recolorida em DOURADO (só transformado).
- Ultimate (100 Ki) "Tesouro do Céu": vídeo do dono; depois o inimigo fica paralisado tomando 12 golpes invisíveis (40% críticos, 65% transformado) + golpe final e cai (`f.skInv`).
- Invocação ILIMITADA (rk.js "v280", `RKBAN='sk'`, arte `RQA.gacha_sk`): 3ª aba (antes trancada/Madara). Abre 10/11/2026 12:45 Brasília (`SKG0`) por 7 dias (`SKG1`); antes mostra "ABRE ÀS 12:45" e bloqueia. 70/700 💎 (aceita tickets). Shaka 0,35% garantido em 170 (`rk_pityS`), itens secretos 0,25% garantido em 220 (`rk_pitySS`, nunca repetido). "SORTE SECRETA!" dourado (`rkMegaS`).
- Itens secretos (`RKSP sk*`, `RQA.ssp`): Elmo (def 60, crit 40), Armadura (dano 50, crit 40), Luvas no espaço da arma (vel 40, dano 10), Botas (vel 40, dano 30), Rosário no espaço do anel (sorte 60, drop 30). 50% em quem não é o Shaka (decisão do Claude, igual ao Yuta); Shaka com o set completo = ×1,1 (`skSetFull`).
- Nível: Shaka vai até 70 (`LVMAX`), custo 50+ = 3000🪙/200 pó, sem item de elevação no 60/70. Linhas secretas da árvore (nível 60: dano 18/crit 12/dano crít. 25/vel 10; nível 70: dano 25/crit 15/dano crít. 35/roubo de vida 8), cristal mítico ×3/×4, botão "✦ HABILIDADES SECRETAS" na tela de nível (`lvX`).
- Botões personalizados: o dono vai mandar (por enquanto os normais).
- Testes: `ferramentas/testes/tshaka_v280.js`, `tgacha_sk_v280.js`.

## v281 — Shaka: recorte refeito (rosto/braços/boca não somem mais) e retrato centralizado
- Bug: no `seg_sk.py` o "miolo" do corpo era só o que tinha cor escura (`A>.62` com abertura), então pele e cabelo claros viravam "brilho" semitransparente → rosto, boca e braços apareciam vazados. Agora o miolo é o contorno preto FECHADO (`binary_closing` + preencher buracos): tudo dentro do contorno fica opaco; só o brilho de fora (energia, rastros) fica transparente.
- Retrato da barra de vida recortado de novo com o rosto no centro (`imgs.py`). Os webp antigos foram apagados.
- O escudo (folha 10) continua o mesmo até o dono mandar a imagem nova.

## v282 — botões do Shaka + recorte sem contorno branco
- Botões do dono (`ferramentas/personagens/shaka/botoes/normal.png` e `olhos_abertos.png`), só os botões (sem HUD): `hud_sk.py` recorta cada botão em círculo pelas posições da arte (1670×942) → `build/hud_shaka.json` → `HUDA.shaka`; `HUTH.shaka` dourado (chamas/raios nos botões). Olhos abertos: classe `#controls.skf` = botões pulsando em brilho dourado + brilho nos cantos.
- `seg_sk.py`: tira o contorno branco do desenho encostado no fundo e os buraquinhos brancos fechados (ex.: entre o rosário e a mão).
- `build_sk.py` agora passa a IA 2x (Real-ESRGAN, `ferramentas/ia/esr.py`) em cada quadro (~25 min) — entra na versão seguinte quando terminar.

## v283 — Shaka: qualidade com IA + guarda/defesa, em pé e vitória novas
- Todos os quadros do Shaka passaram pela IA 2x (Real-ESRGAN). `build_sk.py` guarda o resultado em `/home/claude/sk_build/cache_ai.json` (só refaz quadros novos).
- Folhas novas do dono: `poses/15_guarda_defesa.png` (guarda de luta → `idle`; último quadro = defesa `block`), `16_em_pe.png` (em pé com o cabelo mexendo → `relax`/entrada), `17_vitoria.png` (vitória). As 16 e 17 vêm transparentes com um brilho vermelho em volta: `seg_sk.py` tira (alfa < 70 e borda vermelha).
- Escudo da mandala (folha 10) saiu da defesa.
- Teste: `ferramentas/testes/tshaka_v283.js`.

## v284 — Shaka: escudo da mandala (folha 10) fora do jogo
- O dono confirmou: a defesa é SÓ a folha 15 (braços cruzados na frente do rosto). A folha 10 (palma + mandala) não é usada em nenhuma animação (a animação `shield` saiu do `build_sk.py`).

## v285 — Shaka carrega energia EM PÉ + gacha do Shaka abre 13:20
- `pw` (carregar energia/transformação) = folha 01 (em pé com o rosário na mão), quadros [0,0,1,1,2,2,1,1]. As imagens da folha 01 tinham sido apagadas na limpeza da v283 (não eram usadas): `build_sk.py` refaz o que falta (o cache em `/home/claude/sk_build/cache_ai.json` foi limpo das entradas sem arquivo). ATENÇÃO ao limpar `www/a`: só apagar o que nenhum JSON de build usa.
- Invocação Ilimitada do Shaka: abre 10/11/2026 **13:20** (Brasília) (`SKG0`), 7 dias a partir daí.

## Cloudflare (10/11/2026) — publicação alternativa ao GitHub Pages
- O dono criou no Cloudflare (Workers & Pages → Connect to Git) o projeto `fui-do-templo-a-pk-2` ligado a este repositório, com deploy `npx wrangler deploy`. `wrangler.jsonc` na raiz publica a pasta `www` como arquivos estáticos (limite: 20.000 arquivos, 25 MB cada). Cada push na main publica sozinho no link `*.workers.dev`.

## v286 — código de DEVOLUÇÃO da gacha do Shaka (jogador Vn)
- O jogador "Vn" deu 35 giros no banner do Shaka entre 12:45 e 13:20 (a v284 abria 12:45; o dono mudou para 13:20). Ferramenta nova `.github/workflows/auditoria.yml` (lê os salvamentos de conta `sv_*` depois de um horário e mostra quem tem o Shaka/piedade/giros).
- Código ÚNICO (`extra/9f_v286.py`, hash `1xpdic`, texto só com o dono): +2450 💎 e zera `rk_pityS`/`rk_pitySS` (flag nova `rz` no `twCupom`: zera as chaves `rk_*` listadas).

## v287 — Invocação do Shaka com vídeo + som, "SUPER MEGA SORTE SECRETA", anéis brilhando pelo nível
- Girar na Invocação Ilimitada toca o vídeo do dono COM SOM em tela cheia (`<video>` object-fit:cover; `a/d99e2dad783e30.mp4` = ultimate do Shaka 720p, `SKINV`); toque pula. Se o navegador bloquear o som, toca mudo.
- Pegou o Shaka: `rkMegaS` novo (branco dourado divino, "SUPER MEGA / SORTE SECRETA!", anéis de luz) → `rkCharWin` toca os quadros dele ABRINDO OS OLHOS (`RKUV.shaka=()=>SKV`) com fundo branco dourado (`.rkWin.skw`).
- Anéis: a cada 10 níveis brilham mais na cor deles (`anGl` = nível/10, classes `.gl.g1..g5`), no corpo do personagem e na lista.
- Teste: `ferramentas/testes/tgacha_sk_v287.js`.

## v288 — carta DIVINA do Shaka + TÍTULO numerado (10 primeiros, +20% de dano com o Shaka)
- Carta do Shaka no resultado da invocação (`.rkCd.skCd`): moldura dourada-branca (filtro na moldura mítica), aura branca pulsando e raios girando.
- Título `sk1..sk10` (`TWTIT`, "SHAKA Nº N", 🪷): `skTitClaim` tenta criar `torre/sktit_1..10` (documentId fixo; 409 = já tem dono); sem internet fica pendente (`rk_sktp`) e tenta de novo ao abrir o Ranqueado. Tela "TÍTULO DIVINO" (`skTitWin`). Placa `.pfTt.skt s1..s4` (Nº1 com letra branca/dourada animada e brilho mais forte).
- Bônus: +20% de dano SÓ lutando com o Shaka (Boss, Torre e Caça).
- Teste: `ferramentas/testes/tgacha_sk_v288.js` (Nº1 ocupado → ganha Nº2).

## v289 — 2 códigos do lançamento do Shaka (só quem tem CONTA, 1 vez por conta)
- `extra/9g_v289.py` (textos só com o dono): `1yu9fib` = diamantes aleatórios 1000–5000 (`rnd`), `qb52ye` = tickets aleatórios 10–30 (flag nova `rtic`).
- Flag nova `acc:1` no `twCupom`: exige conta (ac_n + ac_k) e trava por conta no servidor (`cupom_<hash>_a<hash da conta>`). O texto do sorteio de diamantes agora mostra a faixa certa do código.

## v290 — trava o ZOOM da página no celular
- Jogador reclamou que "fica dando zoom" (dois toques rápidos ou dois dedos nos botões). `extra/9h_v290.py`: viewport com `maximum-scale=1,user-scalable=no`, `touch-action:manipulation` no html/body, e bloqueio de `gesturestart/gesturechange`, pinça (`touchmove` com scale), duplo clique fora de campos de texto e Ctrl+roda no PC.

## APK LEVE (10/11/2026) — o app abre o site do Cloudflare por dentro
- `capacitor.config.json`: `server.url` = https://fui-do-templo-a-pk-2.denilsinend.workers.dev e `webDir` = `apk_www` (só uma página "precisa de internet" de reserva). O APK fica com poucos MB, atualiza sozinho (é o site) e o online funciona (mesmo endereço do site). O jogo em si continua em `www/` (publicado pelo Cloudflare e pelo GitHub Pages).
- Quem jogava no APK antigo sem conta: o progresso ficava no app (endereço interno) e não passa para o novo — precisa entrar na CONTA.

## v291 — Biblioteca, perfil com anéis, itens do Shaka
- Biblioteca (aba Personagens): o botão "Anéis" tampava o "USAR NA RANQUEADA" → Anéis `rkB(12,515,276,590)`, Usar `rkB(14,603,268,660)`, Evoluir `rkB(14,670,268,740)`.
- Perfil (o seu): os anéis da alma equipados no personagem do pedestal flutuam em volta do corpo (`.pfAnR`, mesma ideia da aba Anéis, com o brilho por nível).
- Itens do Shaka brilham dourado em qualquer tela (CSS gerado por `img[src$=...]` dos ícones `RQA.ssp`).
- O dono pediu: ROSÁRIO vai no espaço da ARMA (sorte 60, drop 30) e as LUVAS no do ANEL (vel 40, dano 10). Itens já ganhos são convertidos ao abrir o jogo (e tirados do espaço errado).

## v292
- **Bug dos itens do Shaka sumindo:** a mochila cheia (`twCap`) descartava o item de menor `v` — e os itens do Shaka têm `v:0`, então eram apagados primeiro. Agora `twCap` nunca descarta item secreto/obscuro/único/evento (`ysec`, `sk`, `uniq`, `ev`, `rkHi`) e ordena os comuns por `rkItV`.
- **Devolução:** bloco único (`rk_skfix292`) que olha o histórico do gacha (`rk_hist`, últimos 60) e devolve itens do Shaka (`sk`) que não estão na mochila.
- **Item secreto (Yuta/Shaka) não pode mais ser vendido** (botão escondido + checagem no clique).
- **Rika pode ser tirada:** `rkLock` agora retorna sempre `false` (fim do "obscuro sempre equipado" da v249).
- **Itens do Shaka ~40–50% mais fortes que os do Yuta (mesmo slot):** Elmo def90 crit60 st20 · Armadura dmg60 crit45 · Luvas dmg45 vel70 st75 · Botas v50 dmg40 · Rosário st70 drop40. A migração da v247 agora também copia `dmg`, `vel` e `sk`, então itens já guardados recebem os valores novos.
- Teste: `ferramentas/testes/titens_v292.js`.

## v293
- **Baú da Caça (arte do dono em `ferramentas/web/ranqueada/bau_caca/`, cortes em `cortes/`, RQA.bauc = {c:[6 fechados], o:[6 abertos], p:[6 quadros], slot}):** cada nível do boss da Caça derrotado dá **anel 100%** (`anDropLobo` nova: tenta do mais raro ao mais comum com a sorte; se nada, BRANCO) + o loot do nível. A luta PAUSA com `G.hold=1`: baú fechado treme → abre (toque ou 1,5 s) → o anel sobe → quadro com até 5 itens (anel + loot daquele nível) → **CONTINUAR**. Cor do baú = `bcTier(nível, raridade do anel)`. Pausa (ESC) bloqueada com o baú na tela; `caStart` e `startMatch` zeram `G.hold`.
- **Códigos (texto só com o dono):** `ypw8yf` = todos os equipamentos do Shaka (1 pessoa no jogo todo, já equipa); `1r1gpju` = 1000–4000 💎 aleatórios para todos, 1 vez por pessoa (`ev:1` → conta ou aparelho).
- **Itens no espaço certo:** migração que tira do `tw_eqp` item equipado num espaço de outro tipo (ex.: Rosário que estava no anel) e coloca no espaço certo.
- **Luta travada / tela preta (9i_v293.py):** o `loop` agora tem try/catch (antes um erro matava o requestAnimationFrame e a luta congelava), vigia que religa o loop se ficar 2 s parado, `contextlost` do canvas, e **relatório de erro** no Firestore (`torre/er_*`: mensagem, stack, aparelho, nome, modo) — olhar esses documentos para achar o erro real.
- **Evento 7h:** 10/11/2026 15:30–22:30 (Brasília): 3x DROP, 2x SORTE, 2x XP (`RKEVX` com `{luck:2,drop:3}`; `rkEvD` multiplica `rkDropF`, que vale no Boss, Torre e Caça).
- **Anéis:** todo anel brilha (`anGl` mínimo 1, mais com nível, raridade preta/vermelha e nota alta), brilho branco + cor, halo e estrelinha nas células.
- **Mochila:** quadrados do dono (`RQA.bauc.slot`) como fundo dos itens normais e dos espaços vazios.
- Testes: `tbau_v293.js`, `tbau2_v293.js` (o `tloot_v279.js` antigo não clica no CONTINUAR do baú).

## v294
- **Chances dos anéis da Caça (pedido do dono):** VERMELHO nv7 0,3% · nv8 0,5% · nv9 1% · nv10 1,5%. PRETO nv6 1% · nv7 2% · nv8 3% · nv9 4% · nv10 5% (sorte multiplica). Roxo/amarelo iguais.
- **Notas (ANW):** E 30 · D 20 · C 12 · B 10 · A 9 · S 8 · SS 7 · SSS 4 (%). O dono escreveu "A 10%, A 9%…" — entendi como B 10% e A 9%.
- **Código de PERSONAGEM:** `TWCUP[h].chr` = id do personagem (wrapper do `twCupom` põe em `rk_own` quando o código é aceito). Código do Gojo `1g9z05`: 1 pessoa no jogo todo (texto só com o dono).
- Teste: `ferramentas/testes/tcod_v294.js` (servidor simulado: Gojo, itens do Shaka, gemas, uso repetido e outra pessoa).

## v295
- **Começo padrão:** todo mundo começa 1 vez com gráfico LEVE e velocidade TURBO (`ft_def295`); depois cada um troca no ⚙️ e fica salvo.
- **Poção na Caça:** `caPoc(p)` no rkApply da Caça aplica a poção normal, a de CURA e a de DROP; botão 🧪 POÇÕES no Set do Lobo abre a mochila nas poções; `rkCuraTick`/`psRegTick` também na Caça (9j_v295.py).
- **Evento 7h agora com 2x GEMAS** também (`gem:2`), e as gemas da Caça usam `rkEvG()`.
- **Brilho dos anéis FIXO** (sem piscar) e no perfil (`.rk_pf .pfAnR img.gl`).
- **Ranking da Caça** (botão 🏆 RANKING na tela da Caça): doc `ca:'1'` com recordes da pessoa (clv nível, cdm dano numa caçada, ccr críticos numa caçada, ctt segundos para caçar os 10, crg = melhor anel c*10+nota+1). Só manda quando bate um recorde (`rk_caBest`). Dano = applyHit no lobo; críticos = critFx; tempo = G.frame (pausa do baú não conta).
- **Títulos da Caça (CATIT):** CAÇADOR, MATADOR DE LOBOS, REI DA FLORESTA, CAÇADOR VELOZ (<4 min), OLHO DO PREDADOR (60 críticos), ALMA NEGRA (anel preto), ALMA DE SANGUE (anel vermelho), NOTA SSS — com bônus pequenos (TBUF). Tela 🏅 no ranking.
- Teste: `tcaca_v295.js`.

## v296
- **Aviso de atualização:** o `montar.sh` agora troca `__APPV__` pelo código da versão (md5 do index) e grava `www/versao.txt`. O jogo (site e APK leve, só em http/https) confere o `versao.txt` 20 s depois de abrir, a cada 2 min e quando volta para a tela; se mudou, aparece o botão dourado "🔄 ATUALIZAÇÃO NOVA! Toque para atualizar" (salva a conta e recarrega). Não aparece no meio da luta. Patch: `extra/9k_v296.py`. Teste: `tupd_v296.js` (precisa de `python3 -m http.server 8765` na pasta www).
- O APK leve já carrega o jogo do site da Cloudflare, então nunca mais precisa reinstalar para atualizar o jogo — só se mudar o próprio app (ícone, nome, permissões).

## v297
- **SAIR da caçada:** no baú de cada nível (menos o 10) tem "🏳️ SAIR E GUARDAR" ao lado do CONTINUAR. Termina a caçada contando os níveis vencidos (`o.bLv=L+1`, `caEnd(0)`): recorde, ranking da Caça e títulos valem normal.
- **Anel PRETO escuro de verdade:** arte do anel preto (`RQA.anel2[3]`) recolorida para preto com contorno roxo (`ranqueada/anel_preto/anel_preto.png`, feita a partir da antiga); cor do anel preto `ANC[3][1]` = `#8a6fc0`.
- **Código para todos (texto só com o dono):** `fah9en` = 30 💠 Joias Negras, 1 vez por pessoa.
- Teste: `tsair_v297.js`.

## v298
- **Recuperar conta (senha esquecida):** código de 1 uso com `rec:'<nome da conta>'` (`TWCUP[h]={nm:'RECUPERAR CONTA',it:[],rec:'Breno'}`, hash `zmyqa8`, texto só com o dono). Ao aceitar: pede SENHA NOVA (`acRecOpen`, fica pendente em `ac_rec` se fechar), carrega o último salvamento da conta (`acList`, sem conferir assinatura) e salva de novo assinado com a senha nova — como o ENTRAR confere os 15 salvamentos mais novos, a senha nova passa a valer em qualquer aparelho. Para outra pessoa: novo código com `rec` = nome da conta (achar a conta com a ferramenta consulta.yml: campo `sv`, valor = sha256('furia|acc|'+nome em minúsculas)[:24]).
- Conta do Breno conferida no servidor (último salvamento 10/11 às 07:04).
- Teste: `trec_v298.js`.

## v299
- Mais 2 códigos de RECUPERAR CONTA (texto só com o dono): `170s7ti` → conta **Vini_junior10** (último salvamento 10/11 16:45), `1db5so5` → conta **xdarwinzinn** (último salvamento 10/11 12:16). Ambas conferidas no servidor com consulta.yml (campo `sv`).

## v300
- Código de presente do **Shaka** (1 pessoa no jogo todo, `chr:'shaka'`, hash `jo9vs1`; texto só com o dono). Testado com tcod_v294 adaptado.

## v301
- **Nerf das gemas da Caça** (dono pegou 3.000 💎 numa caçada com evento + drop): por nível agora `(2 + 1,5×nível + 0–3) × drop (máx. 2x) × evento`, e **no máximo 500 💎 por caçada**. Médias de uma caçada completa: normal ~120, com drop ~175, com tudo + evento 2x ~470.

## v302
- **Título ADM novo (`.pfAdmG`, wrapper de `pfTitH` para t='adm' e nome do ADM):** "♛ ADMINISTRADOR" em ouro metálico pulsando sobre uma galáxia girando (nebulosa, estrelas, anel de luz 3D), rachaduras douradas que se espalham dentro e para fora da placa (SVG, `ADMCK`/`ADMOUT`), estilhaços voando, brilho passando e um glitch rápido ("realidade quebrando"). Fundo dentro de `.bg` com overflow escondido (sem isso a galáxia vazava pela tela). Teste: `tadm_v302.js` (nome "Denilson ADM" + tw_tit ["adm"]).

## v303
- Código de 1 pessoa (hash `gs2l5f`, texto só com o dono): **PASSE MÁXIMO** (`bpUnlock(2)` = passe prêmio/elite + xp do nível 20) **+ 18.000 💎** (flags `bpx`/`gx`, wrapper do twCupom). Vale para a temporada atual do passe (`BPS.n`).

## v304
- Código de 1 pessoa (hash `2rq1y4`, texto só com o dono): **PASSE FULL** (passe prêmio + nível 20, sem gemas extras; `bpx:1`).

## v305
- **Letras que não saíam ao digitar (nome, código, conta, chat):** o teclado do jogo (`KM`: WASD, J K L, I O U, F, espaço, P...) dava `preventDefault` em qualquer lugar, até dentro das caixas de texto (em teclado de PC e alguns teclados de celular). Agora `isTyping(e)` ignora as teclas quando o foco está em INPUT/TEXTAREA. Antes: "Vini junior" virava "Vnn"; depois: sai certo. Patch `extra/9l_v305.py`, teste `tnome_v305.js`.

## v306
- Código de 1 pessoa (hash `h5wrl3`, texto só com o dono): **70.000 💎** (`gem:70000`).

## v307
- **Código sem servidor e sem conta (`off:1`):** wrapper do `twCupom` que confere só no aparelho (`tw_cup`, 1 vez por aparelho) e dá o prêmio (gem, chr, bpx, gx) sem falar com o Firestore. O de 70.000 💎 (`h5wrl3`) agora é assim. Cuidado: código `off` não tem trava de "1 pessoa no jogo todo" — só entregar a quem deve usar. Teste: `toff_v307.js` (servidor bloqueado).
- Obs.: no rk.js não escrever `if(C.gem){rkAdd('gem',C.gem);` — um patch antigo procura esse texto e exige que exista 1 vez só.

## v308
- **"Jogo sem internet" = Firestore no LIMITE DE LEITURAS do dia** (plano grátis: 50 mil leituras/dia; erro 429 "Quota exceeded"; escrita continua funcionando; zera à meia-noite do Pacífico = 05:00 de Brasília). Conferido com status.yml (que agora também testa o site da Cloudflare e o Pages).
- **Economia de leituras:** chat das horas que já passaram fica guardado 6 h (`RKQH`), chat da hora atual 60 s, só as últimas 3 horas no lobby do Boss (eram 6), lobby atualiza o chat a cada 60 s (era 30 s) e o "online" a cada ~10 min (era 2 min, cache 10 min), rankings da Caça/rank 15 min.
- **Mensagem certa:** com o servidor no limite aparece "⏳ O servidor chegou no limite de hoje (... voltam às 05:00 de Brasília). O jogo funciona normal." em vez de "Sem internet" (`rkNetMsg()`).
- Solução definitiva (decisão do dono): plano Blaze do Firebase (paga só o que passar do grátis, ~US$0,06 por 100 mil leituras) com alerta de gasto.
- Teste: `t429_v308.js`.

## v309 (preparado, ainda NÃO ligado) — SERVIDOR NOVO na Cloudflare (Workers + D1)
- Motivo: Firebase grátis = 50 mil leituras/dia e acabou (v308); pagar o Firebase deu problema para o dono. D1 grátis = 5 milhões de leituras/dia e 100 mil escritas/dia.
- `worker/index.js`: imita o pedaço da API REST do Firestore que o jogo usa (criar documento com/sem documentId e 409 se já existe; `runQuery` com fieldFilter EQUAL/>/</>=/<=, orderBy por campo numérico ou `__name__`, limit até 3000). Tabelas `docs(id,ct,f)` + `kv(id,k,s,n)` com índices (k,s,id) e (k,n) para as consultas lerem só as linhas certas. Só cria/consulta, nunca apaga. `/fs-admin/import` (só até 11/11/2026 15:00) e `/fs-admin/count`.
- `ferramentas/servidor/local.mjs`: roda o worker no computador com D1 de mentira (node:sqlite) servindo o www — teste completo `tfs_v309.js` (criar conta, entrar em outro aparelho, código de 1 pessoa, chat, migração automática da conta, relatório de erro).
- `ferramentas/servidor/9m_v309.py`: troca o `TWURL` do jogo para `<site>/fs/v1/...` e o relatório de erro também. Quando ligar: copiar para `ferramentas/web/extra/`.
- Contas: bloco no rk.js (só age quando TWURL é o servidor novo) salva de novo a conta de quem está logado no aparelho → a conta passa a existir no servidor novo com a mesma senha.
- `.github/workflows/importar.yml`: copia do Firebase (depois das 05:00) títulos, códigos usados, rankings, perfis, mercado e os 3 salvamentos mais novos de cada conta dos últimos N dias.
- Achado: o relatório de erro da v293 nunca enviava (o script do `<head>` não enxerga `TWFB`/`TWURL`, que ficam dentro do script principal) — corrigido no 9m_v309.
- Para ligar falta o **Database ID** do D1 (`furia`) criado pelo dono; o wrangler.jsonc fica:
  `"main":"worker/index.js"`, `assets:{directory:"./www",binding:"ASSETS",not_found_handling:"single-page-application",run_worker_first:["/fs/*","/fs-admin/*"]}`, `d1_databases:[{binding:"DB",database_name:"furia",database_id:"<ID>"}]`.

## v309 — SERVIDOR NOVO LIGADO
- D1 `furia` criado pelo dono: id `c7962d81-d19e-41b3-bc3b-22e07a16c8ff` (conta Cloudflare 8ef044958a4e6c7f45abc693fd028f27). `wrangler.jsonc` com `main`, `assets.binding/run_worker_first` e `d1_databases`. `extra/9m_v309.py` ligado: o jogo usa `<site>/fs/v1/...` (no GitHub Pages usa o site da Cloudflare com CORS).
- `status.yml` também testa o servidor novo (`/fs-admin/count` e uma consulta). Ferramentas antigas (consulta/busca/auditoria) ainda olham o Firebase — para o servidor novo, consultar `<site>/fs/v1/projects/furia-do-templo/databases/(default)/documents:runQuery` com o mesmo corpo.
- Depois das 05:00 de 11/11: rodar `importar.yml` (copia do Firebase; a importação no worker fecha 11/11 15:00).

## v310
- Servidor novo começou vazio → ranking do Boss vazio. Agora cada jogador, ao abrir o jogo (só no servidor novo, 1 vez: `rk_rksync310`), manda o seu RANK atual (`rkSend` com o rp do aparelho) e os recordes da Caça (`caSend`). O ranking volta a encher conforme o pessoal abre o jogo; o histórico completo vem do Firebase às 05:20 (importar.yml, tarefa agendada).
- Teste: `trk_v310.js` (precisa do servidor local).

## v311
- Pedido do dono: o ranking do **RANK** (ranqueada) continua — vem do rank salvo no celular de cada um (v310). Os **outros rankings começam do zero**: Boss (dano no Broly, mais rápido, 1ª fase), Caça e Torre.
- `importar.yml` não copia mais rk/rkr/ca/pontos/char/sem/ev (só códigos usados, títulos nº, perfis, mercado e contas).
- Caça: `caSend` agora manda `v:311` e o ranking da Caça só conta documentos v≥311; os recordes da Caça guardados no aparelho zeram 1 vez (`rk_carst311`). O envio dos recordes da Caça ao abrir o jogo (v310) foi tirado.

## v312
- **Ranking do RANK com todo mundo que tem conta:** o `importar.yml` (05:20) agora também cria 1 documento de rank (`rkimp_<conta>`, `rk:'1'`, `rp` do `rk_rp` do salvamento mais novo) para cada conta salva nos últimos 45 dias (até 9.000 salvamentos mais novos) — quem tem conta aparece no ranking com o rank que tinha, mesmo sem abrir o jogo. Quem abrir depois manda o rank atual (mais novo → vale ele).
- **Conta que ainda não está no servidor novo:** `acList` (ENTRAR/recuperar) busca no Firebase antigo quando o servidor novo não tem a conta; depois de entrar, o salvamento vai para o servidor novo (migração v309). Teste `tfb_v312.js`.

## v313
- **15 bots** (ideia dos amigos do dono; ele manda tirar quando quiser → `BOTON=false` no rk.js): ShadowKing, Lukinhas_77, DarkNinja, Pedrin_BR, KaioZ, Mestre_Wolf, Gabizinha, RyuDoMal, Thzin, Vitin_God, NightFox, Lipe_Zero, Davizao, Kira_Sama, BrunoX.
- Só no aparelho (nada no servidor): entram no ranking do RANK (rp começa de Divindade até Madeira e sobe 150–900 XP por dia, teto 55.000 = Divindade Suprema), Boss (dano/tempo/1ª fase coerentes com o rank), Caça (nível, dano, críticos, tempo, anel) e somam 3–11 no "online". Sem uid → não abrem perfil. Não contam para as molduras TOP 1/2/3 (`mdTopCheck` ignora bots).
- Teste: `tbot_v313.js`.

## v314
- **Bots do jeito do dono:** nomes Samuel pera, Rangel, Goku black32, Tatayra, Marcos56, Ninguém, Furiosos, Darkalfe, Andtref, Andares (+ Thzin, Vitin_God, NightFox, Lipe_Zero, Davizao = 15). Jogadores medianos (Prata→Lendário); Goku black32, Furiosos, Vitin_God, Ninguém se esforçam mais.
- **Sobem só enquanto estão ONLINE:** cada bot fica online 1 ou 2 horas, sai 1 hora e volta (`botOn`, deslocamento por bot); o "online" soma só os que estão online agora.
- **Nunca passam o 1º, 2º e 3º lugar de verdade:** rank limitado abaixo do 3º jogador real (`cap`), e `botCap` faz o mesmo no Boss (dano, tempo, 1ª fase) e na Caça (nível, dano, críticos, tempo, anel).
- **Perfil dos bots:** tocar no nome no ranking abre perfil (rank atual e máximo, personagem no pedestal, itens na vitrine, nível de habilidade e histórico com partidas, vitória %, posição, Torre, Boss, personagens e recorde) calculado do rank/tempo online (`botProf`). uid dos bots começa com `bt`.
- Para tirar: `BOTON=false`. Teste: `tbot_v314.js` (servidor local).

## v315
- **Evento da Caça ao vivo (10/11 21:15–21:30 de Brasília, `CEV`):** anéis da Caça com chance de cor rara 3x (`anDropLobo` usa `caLuck()*(cevOn()?3:1)`); quem termina uma caçada no horário (até 21:33) manda doc `cev:'cev1115'` (nível e dano) e ganha **ANEL AMARELO SS de Dano**; ranking do evento = mais longe, desempate mais dano; **1º: ANEL PRETO 75.000 anos nota S (Dano)**, **2º e 3º: PRETO 75.000 nota A (Dano)**. Prêmios automáticos (`cevClaim`) ao abrir o jogo depois de 21:31 (1 vez: `cev1115_cl`). Faixa na tela da Caça + tela `cevInfo` com o ranking ao vivo. Bots não entram.

## v316
- **Anéis da alma no CHÃO em volta do personagem** (vídeo de referência do dono — só a ideia; a arte é a dos anéis do jogo): `anDecor()` roda depois de cada `rkView`/`rkModal` e acha toda imagem de personagem EM PÉ (src = `fullSrc(id)` e altura > 28% da tela; ignora cartas/miniaturas). Põe os anéis equipados nele (`anEq`) em volta dos pés: um dentro do outro (1º anel = o de dentro), metade de trás atrás do corpo e metade da frente na frente (`.anFt.b`/`.anFt.f`), pulsando com cor/brilho do anel, onda de energia saindo pelo chão e um anel subindo pelo corpo de vez em quando. Os anéis antigos flutuando (perfil `.pfAnR`, biblioteca `.anR`) foram escondidos.
- **Perfil público leva os anéis** (`pfMine` → `D.an` com cor/nota/nível/brilho do personagem do pedestal; `pfClean` lê) → no perfil dos outros aparecem os anéis DELES.
- **Botão "💍 ANÉIS DA ALMA" no seu perfil** abre a Biblioteca na aba Anéis do personagem do pedestal (equipar/trocar).
- Teste: `tanpe_v316.js`.

## v317
- Pedido do dono: anéis de volta EMPILHADOS (como antes, mais bonitos): começam no chão e vão subindo com espaço igual entre eles até cobrir o personagem todo (do pé à cabeça: `gap = altura*0.88/(n-1)`), largos para não encostar no corpo (~2x a largura do personagem), cada um GIRANDO devagar no lugar (3D: `rotateX(74deg)` + `rotateZ` 13–20 s, um sim outro não ao contrário). Metade de trás atrás do corpo e metade da frente na frente. O anel que subia (v316) saiu; ficou a onda de energia no chão.
- Obs.: filtro (drop-shadow) direto na imagem girando em 3D deixava uma faixa clara retangular no Chromium → brilho vai num drop-shadow simples na imagem dentro do `.sp`.

## v318
- Anéis CENTRALIZADOS: `anSil(img)` mede a silhueta do personagem (canvas 120 linhas, alpha>60, guardado por src); cada anel fica no centro do corpo NA ALTURA DELE e com a largura do corpo ali ×1,3 + folga (sem encostar), limitado a 1,18× a mediana e 1,25× a largura da imagem (cabelo grande não deixa um anel gigante). Mais deitados (`rotateX(78deg)`) para não se encavalarem com 8 anéis. Distribuídos de 2% acima do pé até 90% da altura do corpo. Teste: `tanel_v318.js` (Shaka com 8 anéis).

## v319
- Anéis do jeito da imagem do dono: TODOS NO CHÃO, um dentro do outro, em volta dos pés (atrás do personagem; ele fica em pé em cima). Ordem pela RARIDADE (cor, depois nota): o mais raro é o maior/de fora; os 3 mais fracos bem pequenos perto dos pés (`anGround`). Centro = meio dos pés (silhueta `anSil`).
- A arte dos anéis (grossa, com espinhos grandes) virava uma mancha quando achatada e sobreposta → anel desenhado em SVG (`anRingSvg`): linha fina na cor do anel + linha clara + linha pontilhada de dentro + espinhos para fora (mais espinhos quanto mais raro / nota S+), os espinhos giram devagar (cada anel num sentido) = anel girando no lugar. Brilho fraco (drop-shadow 2/5 px) pulsando devagar.

## v320
- Anéis no chão mais fortes (pedido do dono com imagem): `ANRP` = cores próprias do anel no chão (vermelho vivo #ff0a1e com espinhos maiores tipo arame farpado, preto BEM preto #030104 com borda roxa escura, roxo BEM roxo #8f00ff). Brilho maior (drop-shadow no próprio SVG), pulso de brilho `anGlw2` e o anel INTEIRO girando devagar (34 s + 5 s por anel, um sim outro não ao contrário). Faixa de cada anel mais fina para os anéis não virarem uma mancha. Teste: `tanel_v318.js`.

## v321
- Anéis do chão 15% maiores (`anGround` embrulhado com `cw*1.15`) e girando BEM devagar (70 s + 9 s por anel); pulso de brilho mais lento (4,5 s).

## v322
- Anéis girando um pouco mais rápido (40 s + 6 s por anel) para dar para ver o giro. Vermelho e preto ganharam um brilho pequeno: um risco claro que acende e apaga em volta do anel e uma estrelinha que pisca (gira junto com o anel).

## v323 — 3 códigos de USO ÚNICO (texto só com o dono)
- No fim do rk.js: `kdc5bt` = 40.000 💎, `e8a07j` = 10.000 💎, `yuirz0` = ZORO e SHAKA (campo novo `chrs:[...]`, wrapper `_cp5` põe todos em `rk_own`). Cada um: 1 pessoa no jogo inteiro (servidor recusa o segundo: "já foi usado por outro jogador"). Testado com o servidor local (`local.mjs 8790`).

## v324
- Evoluir anel NÃO gasta mais diamante (pedido do dono: foi erro). `anCost` devolve `g:0`; a tela de evoluir só mostra a Pedra das Almas (o quadrinho de 💎 some quando o custo é 0). Testado: com 0 💎 o anel sobe de nível gastando só a pedra.

## 11/11 — importação do Firebase FEITA
- `importar.yml` rodado às 05:20 (Brasília): 1340 de 1340 documentos importados (131 códigos usados, 347 prêmios resgatados, 432 perfis, 532 nomes, 307 do mercado, 3 recados, 69 salvamentos de 23 contas + rank de cada conta). Servidor ficou com 2162 documentos. O primeiro envio deu 403 porque a Cloudflare bloqueia o User-Agent padrão do Python — o workflow agora manda User-Agent de navegador.

## 11/11 — D1 bateu o limite de LEITURAS do dia
- status.yml às 05:53: o D1 grátis respondeu "exceeded D1 free tier daily row read limit" (5 milhões de linhas lidas/dia; zera à meia-noite UTC = 21:00 de Brasília). Site e APK abrem normal; contas, ranking, chat, mercado e códigos ficam sem servidor até zerar.
- worker: (1) a mensagem de erro 429 agora mostra o motivo real; (2) índice novo `kv_idk(id,k)`; (3) CACHE de 20 s das consultas (chat 8 s) no próprio worker, igual para todos os jogadores — contas/nome/uid/cupom nunca usam cache; criar documento de chat/mercado/recado/título limpa o cache daquele campo; (4) contador de linhas lidas por tipo de consulta em `/fs-admin/reads` (status.yml mostra). Depois que zerar, rodar status.yml para ver o que mais gasta. Se não bastar: plano pago do Workers (US$5/mês) dá 25 bilhões de leituras — decisão do dono.

## 11/11 — PLANO PAGO + TRAVA DE GASTO
- O dono assinou o **Workers Paid (US$5/mês)** na conta Cloudflare Denilsinend: inclui 10 milhões de pedidos/mês e 25 bilhões de linhas lidas/mês no D1 (o limite diário de 5 milhões acabou).
- O dono NÃO quer pagar mais que os US$5. A Cloudflare não tem trava de valor, então o worker tem a própria trava: tabela `uso(dia,req,rows)` (contagem gravada a cada 200 pedidos ou 1 min por isolate); se passar de `TRAVA` (300 mil pedidos/dia, 700 milhões de linhas/dia, 9 milhões de pedidos/mês, 22 bilhões de linhas/mês) responde 429 "trava de gasto" (o jogo mostra servidor no limite) até virar o dia/mês. Ver em `/fs-admin/uso` (status.yml mostra). Se o dono cancelar o plano pago, baixar a TRAVA para o grátis (5 milhões de linhas/dia, 100 mil pedidos/dia).

## v325 — atualização a cada 1 minuto (plano pago)
- `RKQT` (cache das consultas no aparelho): ranking, online, perfis, eventos e o resto = 60 s (antes 5 a 15 min); chat da hora atual 30 s; mercado/recados 20 s; títulos e horas velhas do chat 6 h; conta/nome/uid sem cache. Junto com o cache de 20 s do worker, cada consulta lê o banco no máximo ~3 vezes por minuto para todo mundo — cabe com folga nos US$5/mês.

## v326 — MENU NOVO "Modos de Jogo" (vídeo do dono)
- Fundo = vídeo do dono (Shaka, Gojo, Yuta, dragão) em loop sem emenda (fim cruzado com o começo): `a/a3fc8111f7ccad.webm` (VP9) ou `a/62690f694178ea.mp4` se o aparelho não tocar webm; imagem parada `a/f2bd77b255d5ce.webp` enquanto carrega. Arte 1408x640 (`MN2`, `RKD.menu`), áreas de toque com `mnB(x0,y0,x1,y1)` em pixels da arte. Um único `<video>` (`MN2V`) é reaproveitado (não reinicia quando a tela redesenha) e pausa fora do menu/app em segundo plano.
- Foto com moldura dourada e barra roxa (nome + rank + XP) = PERFIL. Em cima: 🎵 música, moedas (ticket de giro, diamante [toque = loja], moeda da torre, vermelha), ⚙️ = janela OPÇÕES (Código, Configuração, Menu principal). "Modos de Jogo" = volta ao menu principal. Esquerda: Boss, Torre, Caçador, Gacha (brilho dourado passando). Direita: Passivas, Mercado Negro, Abas de Evento, Passe (aura dourada pulsando, bolinha vermelha quando tem novidade). Embaixo: Ranking, Recompensas, Conquistas, Personagem (biblioteca), Conta (brilho dourado + pulso).
- Os botões soltos antigos (🎵, CÓDIGO, 👤) e o rkTop ficam escondidos só nesse menu. Música = a mesma de antes.

## v327 — TELA CHEIA no celular
- `extra/9n_v327.py`. Android (navegador): entra em tela cheia no PRIMEIRO toque em qualquer lugar e volta no próximo toque se a pessoa sair (`fsAny`, 1 vez a cada 3 s) + trava deitado. O jogo (#stage) agora ocupa 100% da altura (antes deixava faixa embaixo no iPhone por causa da barrinha do home; laterais continuam respeitando o entalhe pelo safeProbe). Reajusta ao girar/mudar barras (`visualViewport`).
- iPhone: o Safari NÃO deixa site ficar em tela cheia. Solução = "Adicionar à Tela de Início": `www/manifest.webmanifest` (display fullscreen, deitado) + metas apple-mobile-web-app-capable/black-translucent + ícones `www/icone180/192/512.png` (rosto do Shaka do menu). Aviso dourado 1 vez por dia no iPhone ensinando (some se já abriu pelo ícone). No Android também dá para instalar pelo menu do Chrome.
- APK: já era tela cheia (MainActivity esconde as barras).

## v328 — TELAS NOVAS (artes do dono) + menus mais leves
- Artes originais em `ferramentas/ranqueada_artes/v328/` (chr, an, eq, it, col = Biblioteca 1846x852; ach, rw, conta = 1672x941; rank = 1846x852).
- **BIBLIOTECA nova** (fim do rk.js, `LB2`, `lbB`, `lbCtrH`, `lbAct`): uma arte por aba (Personagem, Equipamentos, Itens, Coleções, Anéis). Grade 5x4 à direita (Coleções 6x3 dentro do quadro da coroa). Personagem flutua no meio (com os anéis do chão, `anDecor`). Quadradinhos do lado = equipamentos equipados (tocar vazio = filtra a lista; tocar cheio = guarda; poção abre a mochila antiga). Equipamentos: 8 espaços (cap, arm, anel/luvas, bot | esp, poção, 2 "EM BREVE"). Itens: 5 categorias (poções, elevação, cristais/pedras/pó, tesouros/set do lobo/semente/joia, moedas). Coleções: baús/itens especiais, títulos de rank, títulos, títulos especiais, personagens. Anéis: 8 vagas no círculo, toque no nome troca o personagem, toque num anel da lista = seleciona (2º toque = detalhes), EQUIPAR põe na primeira vaga livre (ou tira se já está nele), tocar numa vaga vazia com anel selecionado = coloca ali, EVOLUIR = evolui o anel selecionado. Atributos = `cbRows` (toque abre o detalhe `cbModal`). EVOLUIR nas outras abas = tela de nível do personagem; EQUIPAR = usar personagem / equipar item / usar título.
- **CONQUISTAS** e **RECOMPENSAS DE RANK**: arte de fundo (`arP`), lista rolando com letra Cinzel (fonte nova carregada em `extra/9o_v328.py`). **CONTA**: arte nova, a lógica continua no `acOpen` (o `acM` troca o HTML pelo `acArtH`, mesmos ids acSv/acOut/acNew/acIn/acN/acP/acP1/acP2/acX). **RANKING**: virou tela cheia (`rkView('rkg')`, `RG2`), 4 abas da arte (rank, dano no Broly, mais rápido, 1ª fase), 5 por página nas faixas coloridas (ouro, azul, vermelho, roxo, roxo), ◀ ▶ embaixo; toque no jogador abre o perfil.
- **Desempenho** (`extra/9p_v328.py`): o jogo não marcava a tela inicial como atual ao abrir, então a luta de fundo era desenhada atrás do menu o tempo todo — em CPU 4x mais lenta a tela inicial foi de 13 para 60 quadros/s. Também: sem `mix-blend-mode` nos menus, sem filtro animado no botão BATALHA AVENTURA, faixa de luz da parede parada, e `body.lowfx` (até 4 núcleos ou 3 GB) tira enfeites pequenos. Teste: `tdesempenho_v328.js`.
- Os códigos de teste antigos clicavam no botão 🎟️ CÓDIGO do menu; agora o código fica no ⚙️ (OPÇÕES → CÓDIGO). `tfs_v309.js` já foi ajustado.
- O código de tela cheia do v327 estava num `<script>` separado (não rodava o `fsFix`); agora fica junto do jogo.

## v329
- Anéis: personagem menor e no centro do círculo (`lbPed(id,0,[497,225,653,505])`). Ranking: só o nome (o emblema já mostra o rank) e o título só como escrita com brilho (`rgTit`, sem caixa; ADM só aparece para o nome do ADM). Equipamentos: tirados os nomes embaixo dos quadradinhos (fica só "EM BREVE" nos fechados).

## v330 — GACHA COM CARTAS (artes do dono)
- O sistema do gacha não mudou; só a revelação. `rkCards` foi trocado no fim do `rk.js` (CSS `.crO/.crG/.crC` no fim do `rk.css`).
- Artes em `ferramentas/ranqueada_artes/v330/` (costas, item, uma carta por personagem; `modelo_10.png` é só a referência do dono). `fazer.py` deixa todas em 700x1020 webp → `CRT` (`bk` costas, `it` carta prata de item, `chr[id]` personagem). Raposa = Qingqing.
- Giro de 10: 10 cartas de costas (5x2) entram voando e viram uma por uma. Giro de 1: uma carta grande. Antes de virar, lendário/mítico "carregam" com a cor e tremem; depois brilho por nível (`crtLv`: 3 = mítico e Shaka limitado com raios, holográfico e faíscas; 2 = lendário; 1 = épico; 0 = comum). Mega sorte e vídeo do personagem continuam iguais.
- Itens (moeda, equipamento, especiais): carta prata `N`, ícone pequeno no quadrado e nome na faixa de baixo. Personagem novo sem carta usa a carta prata com o retrato.
- Para personagem novo: pôr a carta em `v330/<id>.png`, rodar `fazer.py` e adicionar em `CRT.chr`.
- Testes: `tcartas_v330.js`, `tcartas1_v330.js`, `tcartasfps_v330.js` (CPU 4x: 56–60 quadros/s).

## v331 — 3 códigos para TODOS, só com CONTA, 1 vez por conta (texto só com o dono)
- No fim do rk.js: `cf2w82` = 50 giros de passiva (`jn:50`, Joia Negra), `1gvgw6x` = 1000 a 4000 💎 aleatório (`rnd`), `1laos4r` = 10 a 40 tickets aleatórios (`rtic`). Todos com `acc:1` (sem conta: "Esse código é só para quem tem CONTA").
- Teste `tcod_v331.js` com o servidor local (C1/C2/C3 = textos): 2 contas usam os 3, repetir na mesma conta é recusado pelo servidor. Obs.: logo depois de abrir o ranqueado a tela redesenha e fecha a janela do código; o teste espera 6 s.

## v332 — código só para UMA conta + ferramenta de salvamentos
- Campo novo `so` no `TWCUP` (wrapper `_cp6` no fim do rk.js): `twHash` do nome da conta em minúsculas; outra conta recebe "Esse código é de outro jogador". `1n4nhbj` = GAROU só para a conta **Sapopreto** (`acc:1`, 1 vez). Teste `tcod_v332.js` (C1 = texto, NOME = conta).
- `.github/workflows/jogador.yml` (input `nome`): lista os 40 últimos salvamentos da conta no servidor novo (personagens ganhos/perdidos entre um e outro, diamantes, tickets, pity) e o histórico do gacha do último. Usado em 11/11: Sapopreto não perdeu nenhum personagem nos salvamentos (o drop das 09:54 foi a bota secreta do Shaka, não personagem).

## v333 — PVP RANQUEADA "SOMBRA" + menu novo com o botão PVP
- **Menu**: vídeo novo do dono com o botão "PVP Ranqueada" (`ferramentas/ranqueada_artes/v333/`). O vídeo veio com o nome/foto do dono gravados: `patch.py` faz um remendo (barra roxa limpa + círculo escuro) e `video.sh` aplica em todos os quadros, emenda o fim com o começo e tira o som → `MN2` (webm/mp4/poster). Áreas de toque novas no `rkMenuH`; botão `pvp` abre o PVP. Vídeo antigo apagado do www/a.
- **Tela PVP**: arte do dono 1849x851 (`PVA.tela`, `pvB`). Emblemas recortados da própria arte (IA 2x, fundo tirado) em `PVA.e`; Madeira = bronze escurecido. `fazer.py` gera tudo.
- **Como a sombra funciona**: `humanInput` (wrapper) chama `pvRec` em toda luta do jogador (menos treino): a cada 8 quadros grava a ação (P, K, SP, SR, TR, J, KI, KC, BL, BK, FW, DN, ID) por situação `pvCtx` = distância(4) + estado do rival (n/a/j/v) + no ar + recurso (S super pronto / P especial / -). Também grava combos (sequências P/K até 8), reação a ataques (B/J/C/F/N) e tempo de reação. Fica em `rk_pvf` (vai junto no salvamento da conta). Contadores são divididos por 2 quando crescem (estilo recente pesa mais).
- `pvThink` (no `aiThink`, só `G.gmode==='pvp'` e perfil com ≥120 janelas) repete isso: sorteia a ação pela tabela da situação (se pouca informação usa a situação mais geral), segue os combos do jogador um botão por golpe, reage a ataques com a reação e o tempo dele (mínimo 6 quadros).
- **Bônus reais**: `pvDelta(id)` cria um lutador de mentira, roda o `rkApply` como se fosse Boss e guarda os números que mudaram (nível, equipamentos, anéis, passivas, títulos). Os dois lados lutam com os próprios bônus (wrapper do `rkApply` quando `pvp`). Poção não é gasta.
- **Ranks**: `PVT` Madeira→Lendário com 3 divisões cada, estrelas para subir 2,3,4,5,7,10,15,25 → DIVINO (estrelas sem limite). Vitória +1 ⭐ (3 seguidas = +1 extra), derrota −1 (Madeira não perde; cai de divisão/rank, mas não volta para Madeira). Primeira vez em cada rank dá prêmio (💎/🎫 em `PVT`), cada vitória +15 💎. Estado em `rk_pvp`.
- **Servidor** (temporada = mês, `pvMon()`): sombra `pvs_<conta>_<ts>` com `pvk`(mês) `pvg`(rank+mês) `pvs`(pontos) `pvn`(nome minúsculo) `pva`(hash da conta) `d`(perfil+bônus); envia no máx. 1 a cada 4 min e sempre no fim de uma luta. Busca: mesmo rank → vizinhos → qualquer um do mês (40 linhas por consulta). Aviso para o dono da sombra `pvr_*` (`pvo`=conta). Ranking: `pvk` ordenado por `pvs` (300 linhas, 1 por conta). Precisa de CONTA.
- **ADM liga/desliga**: ⚙️ da tela PVP (só ADM) grava `pvc_<ts>` com `on` 0/1; todos leem o mais novo (guardado 2 min). Desligado: ninguém busca nem envia sombra.
- Sala Personalizada: luta contra a sombra de alguém pelo nome, não vale estrela. Formação: escolhe o personagem do PVP (`rk_pvch`) e mostra quanto do estilo já foi gravado.
- Na barra de vida o rival aparece como SOMBRA (`extra/9q_v333.py`).
- Teste `tpvp_v333.js` (servidor local): Bia com sombra de socos, Caio busca, luta apertando teclas, perde sem perder estrela na Madeira, ranking com os dois, Bia vê "DEFENDEU" no histórico, ADM desliga (tela mostra PVP DESLIGADO) e liga. Menus continuam a 60 quadros/s (`tdesempenho_v328.js`).

## v334 — PVP: todos os bônus valem (menos poção)
- `pvDelta` agora roda o `rkApply` com `G.pick` = personagem do PVP (os equipamentos/anéis/nível/passivas/título certos), tira poção de buff, poção de cura e de drop durante o cálculo (e devolve depois, sem gastar) e também leva a cor da aura da passiva secreta (`_def`).
- Na luta os dois lados recebem os números (dano, velocidade, defesa, crítico, dano crítico, roubo de vida, ki, transformação, soco rápido, regeneração). A regeneração das passivas roda no PVP para você e para a sombra (`extra/9r_v334.py` + wrapper do `psRegTick`). Semente dos Deuses (reviver) não vale no PVP (é de uso único, como poção).
- Teste `tpvpbonus_v334.js`: conta sem itens = tudo 1/0; conta com espada mítica, bota, 2 anéis e nível 45 = tdm 1,316, tsp 1,08, crítico 12,2; poções continuam guardadas.

## v335 — PVP: quem está em cada rank
- Na lista "Ranks" da direita da tela PVP, cada rank virou botão (`pvTier`): abre a lista dos jogadores daquele rank (foto do personagem, nome, título, divisão, estrelas, V/D). Tocar em "Ranks" (título) = todos, separados por rank (inclui a Madeira). Bolinha vermelha = quantos jogadores no rank.
- `pvLoadAll()` faz UMA consulta (`pvk` do mês, 300 linhas, 1 por conta, guardada 1 min) e serve para a lista, as bolinhas e o Ranking.
- Teste `tpvprank_v335.js` (4 contas: 2 Prata, 1 Diamante, 1 Madeira).

## v336 — PVP: sombra forte + TIME DE 3
- Motivo da sombra fraca: no PVP o `aiThink` usava `LV[G.diff]` com `G.diff=3` (não existe) → a máquina travava quando o estilo tinha pouca gravação (a do dono tinha 113 < 120). Os bônus já iam (sombra do dono: dano x5,9, vel x3,7, crítico 185%).
- Agora: `twLV` no PVP = nível mais difícil da Torre (`TWLV` último). A sombra é a máquina no máximo e, em ~35% das decisões (janelas de 16 quadros, perfil ≥60), usa o estilo gravado (`pvThink`); defesa sempre da máquina.
- Time de 3 (`rk_pvt`, `pvTeam()`; quem tem menos repete): Formação escolhe na ordem. A sombra envia `team:[{ch,p,s,lv}x3]` (sombras antigas viram 3 do mesmo). Luta igual Torre: quem cai sai, entra o próximo, o vencedor continua com a vida que sobrou; vence quem derrubar os 3 (`endRound` do PVP + `extra/9s_v336.py`: `G.teams` = `PV.fight.teams` e sem tag). Bônus e estilo de cada personagem aplicados a cada entrada.
- Teste `tpvp3_v336.js`: sombra ADM tdm 1,6/tdf 0,625; jogador parado tomou 3500 de dano em 15 s; 3 nocautes → vitória. Gancho de teste `window.__pvT`.
- Pendente (o dono vai explicar): bônus de estrela por sequência e animação de estrela estilo Mobile Legends.

## v337 — reset do PVP + desculpas
- **Reset do PVP**: `PVRZ=1`. `pvMon()` agora termina com `r<PVRZ>` (sombras antigas do servidor não aparecem mais) e `pvG()` zera rank/estrelas/V-D/histórico de quem tem `rz` diferente (os prêmios de primeira vez `rw` continuam marcados, para ninguém pegar duas vezes). Novo reset = aumentar `PVRZ`.
- **Evento de desculpas** 11/11/2026 13:00–20:00 (Brasília) em `RKEVX`: 3x XP, 3x gemas, 3x sorte, 3x drop e `anel:3` = 3 tentativas de drop de Anel da Alma por nível vencido na Caça (`anDropLobo`).
- **Código de desculpas** (texto só com o dono): `973bb8` = 5000 💎 + 40 Joias Negras (giros de passiva) + 20 🎫, 1 vez por CONTA (`acc:1`, campo novo `pk:{gem,tic}` entregue depois que o servidor aceita, wrapper `_cp7`). Teste `tdesc_v337.js` (C1 = texto).

## v338 — SOMBRA COMBISTA
- `pvCombo` (antes do `aiThink` no PVP): emenda cada golpe na janela certa (`mf>=su+1` e acertou), aperta 1 quadro e solta (borda do botão), sequência de 7 golpes (a mais usada pelo dono com ≥3 golpes ou soco x4 + chute que lança) e fecha com super/especial; persegue o rival tonto ou no ar e recomeça; abre combo de perto quando o rival não está atacando. Limite: com 22+ golpes seguidos solta o rival por 40 quadros (sem combo infinito). Defesa/aproximação = máquina no máximo; estilo gravado em ~25% das jogadas.
- Toda sombra tem +10% de dano e +10% de defesa (igual para todas).
- Teste `tpvp4_v338.js`: combo máximo 24 golpes, jogador parado perde ~3500 em 15 s.

## v339 — ADM +70% e 2x de evento sempre
- Título ADM (`tbApply`): +70% dano, velocidade, defesa, energia e transformação, +70 de crítico; sorte do ADM x1,7 (`lvLuck`). Texto do título atualizado.
- Entrada fixa no começo do `RKEVX` (getters) que só vale para o ADM: sem evento = 2x XP/gemas/sorte/drop/anel; com evento = dobra o evento (ex.: desculpas 3x → 6x). Outros jogadores não mudam.
- Teste `tadm_v339.js` (gancho `__pvT.ev/dl`).

## v340 — faixa de EVENTO ATIVO
- `evBarTick` (a cada 1 s) mostra `#evBar` no topo (um pouco abaixo das barras de moedas) na tela inicial, em todas as telas do ranqueado (menu, Boss, Torre, Caça, Gacha, PVP, loja...) e na Torre, só quando há evento de verdade em `RKEVX` (a entrada fixa do ADM não conta; o ADM vê "👑 VOCÊ: 6x"). Some durante as lutas. Nome do evento, contagem regressiva com segundos e os bônus passando (letreiro). Teste `tevbar_v340.js`.

## v341 — 2x do ADM é do título (não é evento)
- Saiu a entrada fixa do ADM no `RKEVX` (não aparece em Eventos, na faixa nem nas telas). `rkAdm2()` (2 se ADM) multiplica direto `rkEvG/rkEvL/rkEvD/rkEvA` e o XP de rank de vitória no Boss (`drp*=2`). Com evento ativo junta (3x → 6x), sem evento fica 2x. Texto do título: "+70% em TUDO · 2x XP, gemas, sorte, drop e anel, sempre".

## v342 — girar até 5 passivas + código ADM 700 + faixa só no menu
- Passivas: botão "GIRAR x5" (usa até 5 Joias, mínimo 2). Sorteia todas (cada uma conta proteção e passe), guarda `o.pendL` e abre a escolha (`psPick`): escolher uma = aplica; "MANTER ANTIGA" = descarta todas. Se sair do jogo no meio, a escolha volta ao abrir as Passivas. Teste `tps5_v342.js`.
- Campo novo `adm:1` no `TWCUP` (wrapper `_cp8`): só quem tem o título ADM. `115nx35` = 700 Joias Negras, 1 pessoa no jogo inteiro (`uni:1`). Texto só com o dono.
- Faixa de evento (`evBar`) agora só no menu Modos de Jogo (`RKV==='menu'`) e some quando abre uma janela.

## v343 — sorte e drop também na RARIDADE
- Conferido: sorte/drop já valiam na QUANTIDADE e na CHANCE (pó, cristais, gemas e moedas extras no Boss/Torre, Joia Negra, itens de elevação, baús, poções, tickets, anéis na Caça). Mas as chances já ficavam em 100% e a raridade quase não mudava, por isso o dono não sentia diferença.
- Agora `lkK()` = giros extras "pega o melhor" pela sorte (`log2(lvLuck)`, máx. 5) em `twEqRoll` (equipamento), `twPoRoll` (poção), `lvCrRoll` (cristal) e na raridade do Anel da Alma (`anDropLobo`, que também passou o limite da sorte de 1,6 para 4).
- Medido (4000 sorteios, `tsorte_v343.js`): jogador comum sem evento = 0,2% mítico; com evento 3x = 0,7%; ADM com evento (sorte 79x, drop 6x) = 1,2% mítico, 7,9% lendário, comum cai de 70% para 11%.

## v344 — sorte e drop SOMADOS (regra do dono: +100% = dobra a chance)
- `lvLuck = 1 + sorte%/100 + (evento-1) + (ADM 2x: +1)` e `rkDropF = 1 + drop%/100 + (evento-1) + (ADM: +1)` — tudo somado, nada multiplicado (antes multiplicava tudo e a sorte do ADM chegava a 79x). Ex.: chance 10% com +100% = 20%, +200% = 30%, +300% = 40%. A sorte dos itens/passivas agora conta inteira (antes era a metade, /200). ADM: +70 de sorte do título + 100% do 2x.
- Medido: comum sem evento 1x; comum no evento 3x = sorte 3x/drop 3x; ADM sem evento = sorte 2,7x/drop 2x; ADM no evento = sorte 4,7x/drop 4x. Raridade continua melhorando pelos giros extras (`lkK`).

## v345 — TODAS as porcentagens somadas (+100% = dobra)
- Dano (`tdm`), velocidade (`tsp`), energia (`tki`) e transformação (`tsb`): cada fonte soma (`+X/100`), nada multiplica (antes título, ADM e equipamento multiplicavam entre si). Ex.: +100% = 2x, +300% = 4x.
- Defesa: somada como porcentagem de defesa: `1/tdf = 1 + soma` (código: `p.tdf=1/(1/(p.tdf||1)+X/100)`), +100% de defesa = toma metade do dano.
- Crítico, dano crítico, sorte e drop já eram somados (sorte/drop: v344). Bônus da sombra no PVP (+10%) também somado. `rkExtra` não sobrescreve mais a energia (`tki`).
- Regra para código novo: bônus de % sempre SOMA no total do atributo.

## v346 — SISTEMA RPG (atributos em pontos) + CONSTELAÇÃO + reset dos níveis
- `CST[id]=[ATK,DEF,VEL]` base por personagem (épicos ~50/10, lendários ~150-185, Naruto 270, Madara 290, Yuta 300, Garou 360, Shaka 470). Nível: +3% do base em ATK/DEF por nível (VEL +2%), +0,1% crítico e 1 ponto de constelação.
- Equipamento dá PONTOS: `eqFlat()` = valor do item x `EQRF` (comum 10, rara 15, épica 20, lendária 40, mítica 100; espada→ATK, armadura→DEF, botas→VEL, inclusive atributos extras dmg/def/vel). Anéis da Alma, passivas, título, ADM, poção, evento e estrelas de % continuam % somadas.
- Conversão no fim da cadeia do `rkApply` (Boss/Torre/Caça; PVP usa o `pvDelta`, que passa por ela): `tdm=(ATK/150)^0,55 x (1+%)`, `1/tdf=1+DEF/900+%`, `tsp=(VEL/80)^0,2+%` (0,6–2,2). A % antiga do equipamento (`twEqB`) é tirada antes (agora vem em pontos). Inimigos (Boss/Torre/Caça): `tdf/1,3` e `tdm x1,15`.
- CONSTELAÇÃO (`CNB`, `CNN`, tela `rkView('cns')`, botão no lugar da árvore antiga na tela de nível): 5 ramos (Ataque, Defesa, Velocidade, Crítico, Espírito) x 12 estrelas: tronco de 6 + 2 caminhos de 3 terminando em ESTRELA-MESTRA (4 pontos + 1 cristal ÉPICO). Estrela pequena 1 ponto, maior 2. Precisa da anterior acesa. Guardado em `rk_lv[id].c`. Resetar estrelas: 200 💎 (devolve cristais). Árvore antiga (`t`, linhas secretas do Shaka) não é mais usada.
- `lvResetAll` (`LVRZ=1`, `rk_lvrz`): na 1ª vez que abre o ranqueado, todos os personagens voltam ao nível 1 e recebe de volta moedas + pó (`LVCOST`), itens de elevação dos níveis 10/20/30/40/50 e os cristais das escolhas da árvore antiga; aviso `#lvrzM`.
- Teste `trpg_v346.js` (reset/devolução, atributos, ativar estrelas, telas).

## v347 — Bosses com atributos, anti-itens, Caça mais forte, recompensa diária
- Boss (Broly) por nível `BSST` [ATK,DEF,VEL]: 50/10/60 no nível 1 até 38.000/6.000/320 no 11; Yuta +20% ATK. `bsStApply(o,fase)` usa as mesmas fórmulas do jogador (fase 2 mantém a proporção b2/b1 e o `ysK` do evento). O painel do Boss mostra ATK/DEF/VEL.
- Passivas ANTI-ITENS (`BSANTI`, nível 5+): tiram crítico do jogador (5 até 25), cortam o roubo de vida (x0,5 até x0,25) e ignoram defesa (20% até 40%); aparecem em vermelho nas passivas do Boss.
- Caça (wrapper `caLvApply`): lobo 1-4 +15% dano/+30% vida efetiva; 5-8 dano x2 e defesa x2; 9-10 dano x3, defesa x3, crítico x3 e velocidade x1,5. A escala genérica do v346 ficou só para a Torre.
- RECOMPENSA DIÁRIA (`rk_dl`, `DLR`): abre sozinha ao entrar no ranqueado (3 s); 7 dias seguidos (pular = volta ao dia 1): 300💎, 2🎫, 3💠, 500💎+50🔴, 3🎫, 5💠+cristal épico, 1500💎+5🎫+5💠. 1ª VITÓRIA DO DIA no Boss: gemas e moedas vermelhas em dobro (`rk_fwd`).
- Medido (`tboss_v347.js`): Shaka nível 70 com espada e armadura míticas = dano x4,64; Boss nível 11 = dano x21 e toma só 13% do dano.

## v348 — menos diamante por luta
- Boss: base `5 + nível x 5,5 + 0–10` (nível 1 ≈ 5–15, nível 11 ≈ 60–70); farm = metade. Evento de gemas conta no máximo x3. Sorte dá até +100% (`(min(3,sorte)-1) x 0,5`). Teto `GEMCAP=150` por luta (antes chegava a ~600 com sorte x evento x ADM).
- Yuta do evento: mesma regra (sorte até +100%, evento até x3, máx. 150). 1ª vitória do dia: no máximo +70.

## v349 — equilíbrio geral + DESAFIO DO DIA
- Curva do Boss refeita (`BSST`) pela força esperada do jogador em cada rank (iniciante épico → Shaka 70 mítico), mirando "o Boss é X vezes mais forte que você": nível 1 ≈ 0,7x, 3 ≈ 1,1x, 5 ≈ 1,6x, 7 ≈ 2,5x, 9 ≈ 3,5x, 11 ≈ 5x (era ~17x no v347). ATK: 40 → 38.000; DEF: 0 → 1.000 (nível 11 tem DEF 700, ataque absurdo).
- Torre: inimigo ganha +25% de vida efetiva e +15% de dano por andar (jogadores ficaram bem mais fortes com o sistema RPG).
- DESAFIO DO DIA (botão laranja no menu, `dsfOpen`/`dsfStart`/`dsfEnd`, `rk_dsf`, modo `G.gmode='dsf'`): rival e modificador do dia (`DSFC`, `DSFM`, sorteados pela data de Brasília). O rival tem a força do jogador +10% (não depende de item), IA combista no máximo. 3 tentativas/dia. Vitória: 2 Joias, 120 pó, 1 cristal (raridade sobe com a sequência), 1 ticket, 40 gemas; 7 dias seguidos = baú lendário + 10 Joias + 5 tickets. Derrota: 20 pó. Lutador = 1º do time do PVP. Resultado em `#lvrzM` (o menu fecha o rkModal sozinho logo depois de abrir).
- Teste `tdesafio_v349.js`.

## v350 — Bosses calibrados pela força REAL dos jogadores
- `forca.yml` (ferramenta): lista os bônus reais de cada jogador pelas sombras do PVP. Em 11/11: os mais fortes (Vini_junior10, ZEUS_DARKBR, Breno) têm dano x20–30, tomam 7–11% do dano e crítico acima de 100%; o meio fica em dano x4–12; iniciantes x2.
- `BSST` refeito para isso: ATK 90 → 518.200 e DEF 0 → 8.100 (níveis 1→11). Meta "Boss X vezes mais forte que um jogador típico daquele rank": 0,7x no nível 1 até 5x no 11 (contra um jogador de dano x25 e 9% de dano recebido).

## v351 — Bosses pelo TEMPO de luta
- Medido (`tdps_v351.js`, gancho de teste `window.__autoP` = jogador controlado pela IA combista): jogador com dano x1 tira ~51 de vida por segundo do Boss (que defende). Vida do Broly nível 11 = 30 barras x 1800 (+~30% de passivas/barreiras) ≈ 70 mil.
- `BSST` refeito para o tempo: ATK 50 → 46.000, DEF 0 nos níveis 1–5 → 4.400 no 11. Ataque do Boss agora converte com expoente 0,3 (`(ATK/150)^0,3`; o do jogador continua 0,55), para os números grandes não matarem em 2 golpes. Yuta: ATK +20% e DEF +35% (luta ~35% mais longa).
- Tempo estimado no Broly nível 11: jogador de dano x25 (os mais fortes hoje) ≈ 3 min; dano x6 ≈ 12–16 min (na prática não vence); Yuta nível 11 ≈ 4 min para os mais fortes.
- Caça (sem mudança): lobo inteiro (10 níveis) ≈ 5–6 min para os mais fortes, bem mais para o resto.

## v352 — força REAL atual (as sombras do PVP estavam velhas)
- As sombras no servidor eram de versões antigas (antes do sistema RPG), por isso o dono aparecia com dano x6. Calculado com os itens reais de cada conta (`build_conta.yml` mostra itens/anéis/passivas/estrelas; `tforca_v352.js` refaz o cálculo no jogo): **Denilson ADM: dano x33,6, toma 10% do dano, crítico 192%, dano crítico +101%** (o mais forte); Vini: x21,8 / 11% / 132%; ZEUS: x17,7 / 11% / 104%. O conjunto secreto do Shaka (raridade "sec", fator 120) dá ~19.000 de ataque e ~12.000 de defesa sozinho.
- `BSST` níveis 9–11: DEF 3.000 / 4.500 / 6.300. Nível 11 (Broly): ADM ~2 min, Vini ~3 min, ZEUS ~7 min. Yuta ~35% mais. Caça inteira: ADM ~3 min, Vini ~4 min.
- Gancho de teste: `__pvT.dl` = pvDelta (o da recompensa diária virou `__pvT.dc`).

## v353 — sombra do ADM
- Sombra de quem usa o título ADM no PVP: +50% de dano, +50% de defesa e +30 de crítico em cima de todos os bônus dele, sem o limite de 22 golpes por combo.
- Todas as sombras são reenviadas 1 vez nesta versão (`rk_pvupv=352`): ao entrar no ranqueado (6 s) ou ao abrir o PVP — as do servidor eram de antes do sistema RPG.
- Equilíbrio: os jogadores NÃO foram enfraquecidos; só os inimigos ficaram mais fortes. Quem tem mais itens continua o mais forte.

## v354 — CAÇA · HIDRA (só ADM, teste)
- Artes do dono em `ferramentas/bestas/hidra/recebido/` (tela da Caça, retrato, em pé, 8 folhas, 7 mapas). `cortar.py` (usa o cortador do lobo) → `quadros/`; `assets.py` → `RQA.hidra` no rk_assets.json: `parado, garras (mordida), pulo, cai (ferido/morte), anda (correndo), combo (16 de 24 da investida), patada (rabada), furia (golpe no chão)`, todos olhando p/ a DIREITA (flag 1), altura 200 (lobo 160); `por`, `vs`, `tela`, `mapas[7]`.
- A Hidra usa o MESMO motor de besta do lobo: `f.bR` troca o `RQA.lobo` durante bsStep/bsDraw; `f.bFil` = filtro (lobinhos vermelho/verde/azul/preto, clones). Golpe novo `a_slam` (`hySlam`): atordoa (`stunFx`) e, do nível 3 da Hidra em diante, 50% de CONGELAR (`state='iced'`).
- Fluxo (`hyStart`, `G.gmode='caca'` + `HY.on`): PARTE 1 mapa1 lobinhos (6 abates, 2 extras ao mesmo tempo) → PARTE 2 mapa2 clones+lobos (8, 3) → PARTE 3 mapa3 horda (12, 4, nascem mais rápido) → HIDRA nível 1–5 (mapas 3 a 7 = cachoeira sendo destruída). Mobs extras em `HY.mobs` (fora do G.p): andam com `updFighter`, o golpe do jogador acerta neles (`hyHitMobs`), desenhados antes do G.p[1]. Quando o G.p[1] cai numa parte, um extra vira o principal. `ko` envolvido: Hidra <5 levanta (`hyBossUp`), a 5ª termina chamando o ko original com gmode trocado (senão o `caLvUp` do lobo pegava).
- Atributos (`HYS`): lobinho ATK 3.000/DEF 350, clone 9.000/800, Hidra 30.000/1.300 até 90.000/3.100 (vida 8 a 18 barras), mesmas contas do Boss.
- CAIXA a cada parte e nível (`hyChest`, aparece no canto `#hyBox`): gemas (10→35, total 150 numa caçada completa), joias, pó, cristal e anéis (1, 2 do nível 1 da Hidra, 4 na vitória; `hyRing` com mais vermelho nos níveis altos). Anel VERMELHO da Hidra: idade 100 a 500.000 anos (`r.a`, `r.hy`), valor x0,5 (100 anos) até x2 (500 mil); `anAge` mostra a idade do vermelho.
- Tela: slot 2 da Caça vira HIDRA só para ADM (`hySel`; arte nova `RQA.hidra.tela` quando selecionada; `caLobo` volta). Outros veem o cadeado. Recorde `rk_hyRec`. Teste `thidra_v354.js` (gancho `__autoP`, `__pvT.hy/stg`).

## v355 — Hidra: VS transparente, caminho sem parar, itens no chão, 7 níveis
- VS: `02_em_pe.jpg` recortado (fundo branco tirado, sombra translúcida) → `quadros/em_pe.png` → `RQA.hidra.vs`.
- Mais monstros: Parte 1 14 abates (até 4 extras), Parte 2 20 (5), Parte 3 30 (6), nascendo a cada 55/45/35 quadros. No chefe, do nível 2 em diante nascem lobinhos (até 3).
- Hidra até o NÍVEL 7 (`HYMAX`, mapas 6 e 7 = último mapa destruído). Muito mais dano: lobinho ATK 9.000, clone 24.000, Hidra 45.000 → 280.000 (vida 8 → 25 barras).
- Sem parar a tela: ao terminar uma parte, o BAÚ cai no chão e aparece "➡ SIGA" na direita; o inimigo principal vira invisível e segue o jogador (`hyIdle`, para a câmera); andar até o fim do mapa (`hyNext`) troca de mapa num piscar (0,3 s) e o jogador entra pela esquerda. No chefe o baú cai onde a Hidra caiu.
- Itens no chão (`HY.items`, `hyDrop`/`hyItemsTick`/`hyItemsDraw`): baú abre ao chegar perto e espalha os prêmios flutuando (gema, joia, pó, cristal, anéis, cura); passar por cima pega (`hyGrant`). Poção de CURA (+10% da vida) cai de 14% dos monstros, de cada baú e a cada nível da Hidra. O que ficar para trás é entregue ao trocar de mapa/terminar (`hyCollectAll`, menos a cura). Gemas somam 150 numa caçada completa (10 baús).
- Lobinhos coloridos/clones: quadros pintados uma vez num canvas (`hyTinted`) em vez de `ctx.filter` a cada quadro (celular).
- Correções: a Hidra não "morre" de novo enquanto levanta (`hyRev`; golpes com `lock` ignoravam a invencibilidade e davam vários baús); qualquer besta da caçada fora da lista não cai mais no `caLvUp` do lobo (aparecia a tela "NÍVEL 1 DERROTADO" no meio).

## v356 — Hidra: sem "vento" empurrando
- O inimigo invisível do "SIGA EM FRENTE" (`hyIdle`) ficava 40px na frente do jogador e o motor separa os dois lutadores (80px) a cada quadro → o jogador era empurrado para trás sem parar. Agora ele fica no mesmo x em `state='down'` (o motor não separa quem está caído). Testado: parado não anda sozinho; andando para a direita troca de parte.
- Pendente (o dono vai mandar artes): modo EXPLORAÇÃO na Caça — depois dos mini-bosses, andar pelo mapa sem inimigos procurando baús; mais partes de mapa. NÃO começar antes de ele mandar tudo.

## v357 — baús de RPG + exploração
- Artes do dono: `ferramentas/bestas/hidra/recebido/baus_fechados.png`, `baus_abertos.png` (fundo escuro com brilho), `mapa_ex1.png`, `mapa_ex2.png`. `baus.py` recorta por célula da grade (fundo = mediana das bordas de cada linha) → `baus/f2_0..6` (7 fechados: madeira, prata, azul, roxo, vermelho, celestial, divino) e `a2_0..6` (abertos); a linha 1 (animação do baú vermelho caindo) ficou recortada mas sem uso. `assets_baus.py` → `RQA.hidra.bc/bo/ex`.
- Baú no chão: cai, quica com poeira, brilha na cor do tipo; perto dele aparece o botão **🎁 ABRIR BAÚ** (`#hyOpen`, tecla E/Enter) e uma setinha ▼; ao apertar ele treme e abre (troca para a arte aberta) e espalha os prêmios. Tipo do baú pela fase (`hyBT`).
- EXPLORAÇÃO (`HYEX`): depois da Parte 1 → "Trilha da Floresta" (mapa_ex1, 3 baús tipo 1–3) e depois da Parte 2 → "Árvore Ancestral" (mapa_ex2, 4 baús tipo 2–5). Sem inimigos, baús espalhados pelo mapa; sair pela direita continua. Baús da exploração não dão gemas (`ng`) para manter o limite de 150; o que ficar fechado é entregue ao sair do mapa.
- Correção: `hyNext` podia rodar 2 vezes durante a troca de mapa (pulava a exploração). Teste `texplora_v357.js`.

## v358 — menos baús e mini-bosses, sem andar de costas
- Partes: 8 / 12 / 16 abates (até 3 / 4 / 5 extras, nascendo a cada 70/60/50 quadros). Exploração: 1 baú em cada mapa (tipo 2 e 4). Hidra: baú só nos níveis 2, 4 e 6 + o da vitória (9 baús numa caçada completa). Gemas por baú `[15,18,20,0,20,0,24,0,25,28]` = 150 no total.
- "Correndo ao contrário": no caminho sem inimigos o inimigo invisível ficava em cima do jogador e ele virava de costas. Agora fica 320px à frente na direção que o jogador anda (`HY.dir`), então o personagem olha para onde corre.

## v359 — recorte dos baús refeito
- O dono reclamou de baús "bugados" (pedaços do brilho e buracos). Causa: a folha não tem colunas iguais (1536/7 cortava os baús no meio) e o corte por cor pegava o brilho.
- `ferramentas/bestas/hidra/baus2.py`: limites de coluna medidos à mão (`XB`, `YB`, só a linha de baixo = a do jogo), GrabCut por célula e depois corte do brilho por textura (desvio local > `TX=14`; o brilho é liso, o baú tem detalhe), fecha buracos e fica com o maior pedaço. Depois roda `assets_baus.py`.
- O baú divino fechado ficou sem a auréola (cortada de propósito: ela grudava no brilho).
- Teste: `texplora_v357.js` (agora usa `items[0]`, só 1 baú na exploração).

## v360 — Hidra liberada para todos + ninhadas de filhotes + 2 códigos de diamante
- **Hidra liberada**: tirei o cadeado de ADM (`hyStart`, `caH` com `adm=true`, `rkView`). Barra: "3 PARTES + 8 NÍVEIS".
- **Hidra mais forte e com 8 níveis** (`HYMAX=8`, `HYS.hidra` com 8 linhas, ATK 60k→400k, vida 9→30 camadas).
- **Ninhadas** (bloco v360 no fim do rk.js): `hyBossUp` refeito — ao cair, a Hidra some (`HY.boss`) e nasce uma ninhada de FILHOTES (`hySetup` tipo `'filhote'`: tamanho 0,42, rápidos, ATK 45% e DEF 50% do nível; `HYFN=[3,4,4,5,5,6,7]` filhotes; no máx. 3 na tela, 4 do nível 4 em diante, `hyFilTick`). Wrapper `_ko3` conta os filhotes; matou todos → `hyFilBack`: a Hidra VOLTA no nível seguinte (estágio destruído muda). 7 ninhadas no total. Lobos extras não nascem durante a ninhada. Golpe da fúria do filhote é raro (3,5%) e só atordoa.
- **Códigos** (texto só com o dono): `l0xbdi` = 80.000 💎, 1 pessoa no jogo inteiro (campo novo `gm`, wrapper `_cp9`; não precisa de conta). `c4riff` = 3.000 a 6.000 💎, 1 vez por CONTA (`acc:1,rnd`).
- Gancho de teste: `__pvT.hyBoss()` (pula direto para a Hidra nível 1), `__pvT.fil()`, `__pvT.rv(view)`.
- Testes: `thidra_v360.js` (jogador sem título, 7 ninhadas até o fim), `tcod_v360.js` (C1/C2; reinicie o servidor local antes, ele guarda os códigos usados).
- Cuidado nos testes: NÃO coloque `mhp` gigante no jogador — o HUD desenha uma bolinha por camada de vida e trava.

## v361 — código PRESENTE DO SHAKA
- `mc90e4` (texto só com o dono) = 30.000 💎 + 20.000 moedas de ouro (`twAddCoins`) + 1 equipamento ALEATÓRIO do Shaka de Virgem (`rkGiveSp` de uma chave de `RKSP` com `sk`). Código ÚNICO: 1 pessoa no jogo inteiro, não precisa de conta.
- Campos novos no `TWCUP`: `mo` (moedas de ouro) e `rsk` (item aleatório do Shaka), wrapper `_cp10` (usa também o `gm` do v360). Teste `tcod_v361.js` (C1).

## v362 — devolução automática para todos
- `gfDev()` (no `rkOpen`): +5.000 💎 e +100.000 moedas de ouro (`twAddCoins`) UMA vez por jogador, sem código e sem precisar de conta. Marca `rk_gf362` vai junto no salvamento da conta (acData salva `rk_`/`tw_`), então não repete em outro aparelho. Janela "DEVOLUÇÃO PARA TODOS!" em `#lvrzM` (espera outra janela fechar). Motivo: upar anel gastou gemas demais.
- Jogador novo também recebe. Teste `tgf_v362.js`.

## v363 — passivas DIVINA e PRIMORDIAL
- Raridades novas acima da SECRETA: `div` (DIVINA, dourada ☀) e `pri` (PRIMORDIAL, arco-íris ✴). Lista própria `PSRK` (não mexi no `RKPR`, que é usado pelas poções). `psRI` usa `PSRK`.
- 5 passivas cada (`PSV.div`/`PSV.pri`); a 5ª é a apelona do tipo `mx` (dá todos os atributos juntos): Bênção de Buda {cd25,def15,spd12,reg1,drop40,st30}; ORIGEM DE TUDO {cd50,def30,spd25,reg2,5,drop100,st80}. `psSum` e `psFx` entendem `mx`.
- Chances `PSW`: div 0,1% · pri 0,02%. Dentro delas a 5ª sai 10% (as outras 4 dividem 90%). Proteção nova `o.pd`: 1000 giros sem Divina+ → Divina+ garantida. Mostrador da proteção tem 3 linhas.
- Limites `PSCAP` subiram: crit 90, def 50, vel 35, regen 3, drop 150, sorte 110.
- Aura no personagem vale para Secreta+ (`psRI>=5`). Revelação especial em tela cheia (`.psRev`) quando sai Divina/Primordial (wrapper do `psAnim`).
- Teste `tps_v363.js` (2 milhões de giros, soma, tela, revelação, giro x5). Gancho `__pvT.ps`.
- `tps5_v342.js` está velho (as janelas de presente diário/devolução atrapalham), não é defeito.

## v364 — Mercado Negro: Joias Negras em quantidade + anéis da alma
- Joia Negra (giro de passiva) agora sai em lote: anúncio `{k:'jn',n}` (antigo sem `n` = 1). Na aba VENDER aparece a barra QTD (-10, −, +, +10, MÁX) e o preço é o TOTAL do lote.
- Anéis da alma (`rk_an`, inclusive o VERMELHO da Hidra) podem ser vendidos: `{k:'an',r:{c,g,s,v,l,a}}`; `mnClean` refaz o `v` pela tabela `ANV` (não confia no vendedor) e limita nível/idade. Se o anel estava equipado, sai do personagem ao anunciar (aviso no detalhe). Comprador recebe com id novo (`anGive`).
- Wrappers em `mnView`/`mnClean`/`mnGive`/`mnMine`/`mnH`/`mnAct` no bloco v364. O APK abre o site (capacitor `server.url`), então todo mundo pega a versão nova.
- Teste `tmercado_v364.js` (Firestore falso: vende 21 joias + anel vermelho equipado, outro compra, vendedor recebe).

## v365 — EVENTO SAINT SEIYA: 3 músicas do dono no lobby
- Músicas (vieram em .m4a, convertidas para mp3 112k, loudnorm -15,5): Lost Canvas – Abertura `a/52222ed0e49460.mp3`, Pelo Mundo `a/e8d2c34b51584e.mp3`, Laços de Flor `a/35458a69982711.mp3`. Entram no `MUS` (índices 18, 19, 20) e nos botões `#msel` (`extra/9t_v365.py`) → rádio do Ranqueado (🎵) e música das lutas.
- Lobby (tela do Ranqueado fora da luta, inclusive o giro do Shaka): `evMusPlay` toca SÓ as 3, em CORTES das partes mais fortes (achadas pela energia do áudio, com fade): Lost Canvas inteira `a/636a17e61ad5f8.mp3`, Pelo Mundo 0:28–2:16 `a/bdf54fec7a8981.mp3`, Laços de Flor 2:20–3:42 `a/b335bfbd785ba6.mp3`. `MEL.loop=false` e no `ended` entra a próxima. Aviso "🎶 EVENTO SAINT SEIYA · nome" a cada troca. Ignora a escolha da rádio (até "sem música"); o som geral desligado continua valendo.
- Rádio: aviso do evento no topo; escolher faixa não mexe no lobby, vale para as lutas. `musPick` (wrapper): volta `loop=true`; se a rádio tem faixa escolhida (≠ aleatória), qualquer luta fora da Torre usa ela (`rkMusPlay`).
- Desligar o evento: `EVMUS=0` no bloco v365.
- Teste `tmusica_v365.js`.

## v366 — corte novo do Laços de Flor no lobby
- O dono disse que o Laços de Flor "não funcionava bem" no lobby. O corte antigo (2:20–3:42) começava no meio de uma frase e tinha uma PAUSA quase muda de ~1 s em 3:05 (parte da música) → parecia que travava. Corte novo `a/1e36ad6d822ca1.mp3`: começa logo depois da pausa (3:05,8) no clímax final e vai até o fim natural da música (58 s). Arquivo antigo `b335bfbd785ba6` apagado.

## v367 — vídeo da invocação do Shaka SEM áudio
- Pedido do dono: o vídeo do giro do Shaka (`SKINV`, wrapper do `rkPlayVid` na v287) agora toca mudo (`muted`/`defaultMuted`), para a música do evento continuar bonita no gacha. A música do lobby não abaixa nem para durante o vídeo.
- Gancho `__pvT.skVid()`; o gancho da música do evento virou `__pvT.evm()` (o nome `ev` já era usado). Teste `tskmudo_v367.js`.

## v368 — PERFIL NOVO (artes do dono) + BATALHAS + ÁLBUM DE CARTAS + COLEÇÃO
- Artes em `ferramentas/ranqueada_artes/perfil_v368/` (`fazer.py` apaga da arte vazia do perfil "ID:", "Mv.", lápis e "Não possui Clã", e o título errado "BATALHÃS"). `referencia_perfil.png` = como o dono quer que fique. Constante `P3A` (webp). Coordenadas em pixels da arte 1847×851 com `rkB3`. `RKD.pf=[1847,851]`.
- **Registro de lutas**: `btRec(modo,venceu,{o,on,x})` nos fins de luta (`rkAfter` boss, `twAfter` torre, `caEnd` caça, `pvEnd` pvp, `dsfEnd` desafio, `hyEnd` hidra, `showResult` versus). `rk_bt` (últimas 120) e `rk_btc` (contadores: pt, w, l, pf=perfeitas, sq/bs sequência, m por modo, ch por personagem; começa com os números antigos do Boss+Torre). Trava de 4 s (`G._btT`) contra registro duplo.
- **PERFIL** (`pfH` reescrito): foto + moldura + selo ADM, nome com ✎ (troca nome), ID numérico (`p3Id`, ADM = 10000001) com copiar, Nv. (`p3Lv`, até 99, pela experiência das lutas), 👍 curtidas / 🔥 popularidade (curtidas×10+visitas) / 👥 visitantes diferentes, PLACA do título (`p3Plate`, dourada com asas — quando o dono mandar as artes dos títulos, troca aqui), "🏆 Top 1 <personagem> · Fúria do Templo" (`p3Top1`: quem está mais alto no PVP entre os que usam aquele personagem), "Não possui Clã", medalhas do ELO (PVP `PVA.e`) atual e mais alta, Medalha de Deus vazia (o dono vai fazer), Partidas / Taxa / Heróis / Estrela Solitária (= vitórias PERFEITAS), 3 heróis mais usados, Conquistas vazias (o dono vai fazer), Visitas recentes (3 fotinhas), personagem do pedestal flutuando (anéis via `anDecor`), rosto dele apagado no fundo do cabeçalho, 3 FOTOS do jogador (`rk_pft`, jpg ≤30 KB, toque = ver/trocar/tirar), Ajustes (`mn2Cfg`). Menu lateral: Perfil, Histórico (tela antiga), Álbum, Coleção, Batalhas, Stream/Social (em breve), Conta.
- Servidor: curtida = doc `lkt`=uid do dono do perfil; visita = doc `vst` (+ `ft` = fotinho 64 px), 1 por dia por perfil (`rk_vsd`), curtida 1 vez (`rk_lks`). `p3Soc` lê os dois (cache 3 min). `pfMine`/`pfClean` publicam/aceitam `lv, bc, top, ft, pvt, pvbt`.
- **BATALHAS** (`p3bt`): filtros Todas/PVP/PVE(boss, desafio, versus)/Torre/Caça(lobo, hidra), 5 por página, detalhe (📋), resumo e modo mais jogado.
- **ÁLBUM** (`p3al`): `ALB` = Dragon Ball, Naruto, One Piece, Jujutsu Kaisen, Demon Slayer, Cavaleiros do Zodíaco, One Punch Man, EXCLUSIVOS (Aylla, Zedry, Zaykon, QingQing). Só cartas do anime certo; carta que você tem = "＋ COLAR" (ou 📥 COLAR TODAS); sem a carta = verso escuro "?"; ✎ renomeia, 🗑️ tira, ⇄ troca de lugar, ◀ ▶ troca de álbum. Álbum completo = +300 💎 uma vez (`ALREW`). Dados em `rk_alb`. Personagem novo: pôr a arte em `CRT.chr` e o id no álbum certo.
- **COLEÇÃO** (`p3co`): tudo do jogo (equipamentos, especiais/Shaka, anéis das 5 cores, joia negra, moedas, poções, títulos, itens de evento) via `rkLibItems`; abas de cima (tudo/ataque/defesa/anel/lótus/baú) × categorias da esquerda; contador tem/total; detalhe à direita.
- Outro jogador: Álbum/Coleção/Batalhas dele não aparecem ("só no SEU perfil").
- Testes: `tperfil_v368.js` (ADM=1), `tperfil_outro_v368.js` (2 jogadores, curtir/visitar). `thidra_v360.js` agora mostra o registro da luta.

## v369 — PLACAS DE TÍTULO (artes do dono) + títulos de TOP automáticos + HISTÓRICO NOVO
- Placas: folha do dono `ferramentas/ranqueada_artes/titulos_v369/folha.png` (o xadrez é DESENHADO, não é transparência). `cortar.py`: faixa manual por placa + GrabCut + remove só o que tem o padrão de 2 tons do xadrez → `placas/*.png` → webp 96 px de altura (`TPL` = [arquivo, proporção]).
- Qual placa cada título usa (`tplOf`): adm → Administrador; deus → Deus (título especial NOVO `deus`, escondido, dado pelo ADM); ranks do Ranqueado rk1..rk10 → Elite, Veterano, Conquistador, Mestre Supremo, Lenda Viva, Imortal, Divindade, Divindade, Divindade, Deus Celestial (`TPRK`; Madeira não tem placa); torre `con` → Conquistador; `sem`/`tor` → Campeão do Servidor; TOPs → placas de Top.
- Brilhos (`TPGL`/CSS `.tpl`): ADM = raios girando, ondas de choque, rachaduras douradas piscando, coroa faiscando, estrelinhas e raios elétricos; Deus = asas com brilho branco + auréola; g3 (Deus Celestial, Top 1 Servidor, Top 1 PVP) = brilho forte pulsando; g2/g1 = médio/leve; todos com faixa de luz.
- Onde aparece: placa grande no Perfil (`p3Plate` usa `tplH`) e placa pequena nas listas (`rgTit`). `twTitTag` (listas da Torre) é `const` e continua com o estilo antigo.
- TÍTULOS DE TOP dinâmicos (`TPD`, `TWTIT[k].dyn`): tps1/2/3/10 (ranking rp do Ranqueado, sem bots), tpp1/2/3 (PVP por rank/divisão/estrelas), tpc1 (Caça: nível mais longe, desempate dano), tpt1 (Torre da semana), tpa1 ("Aventura" = ranking de DANO do Modo Boss). `tplSync` roda ao abrir o Ranqueado (no máx. a cada 20 min, `rk_tsync`): dá/tira os TOPs e, se o título em uso é vazio/rank/TOP, troca sozinho pelo melhor (TOP > maior rank). Depois publica o perfil.
- HISTÓRICO NOVO (view `hs` reescrita, arte `P3A.hs`): Temporada Atual / Tudo, filtro de modo, círculos Partidas/Taxa/MVP, 13 números e o RADAR (Avançar, KDA, Sobrevivência, Luta em Equipe, Farm, Dano) + Detalhes. MVP = vitória com mais da metade da vida.
- Medição da luta: `startMatch` zera `G._bs`; o `update` soma tempo (quadros na fase de luta), dano causado (queda de vida do adversário e dos mobs da Hidra) e recebido; `ko` conta abates; ouro/gemas = diferença 5 s depois do fim. Cada luta do `rk_bt` ganha t, k, dd, dr, hp, mvp, tm, n, g, gm. Totais: `rk_btc` (tudo) e `rk_bts` (temporada), cada um com `mm[modo]`.
- TEMPORADA: `TEMP={id:1,n:'TEMPORADA 1'}`. Para reiniciar (quando o dono pedir): `TEMP.id+1` (zera `rk_bts` de todo mundo ao abrir) + resetar os rankings.
- Perfil publica `hs:{all,sea}` (números) para o histórico de outros jogadores.
- Teste `ttitulos_v369.js` (ADM com placa e histórico; Bia ganha Top 1 do Servidor e do PVP com servidor falso).

## v370 — 3 RANKS NOVOS + emblemas novos do dono + rank do MODO BOSS no perfil
- Perfil: as 2 medalhas (atual / mais alta) agora são o rank do MODO BOSS (Ranqueado: `rkRank(rp)` e `pfRkMax`), não mais o PVP (`p3Rk`, com os efeitos do `pfRkH`).
- RKR ganhou DEUS CÓSMICO (180k XP, 4.000 💎), DEUS PRIMORDIAL (300k, 6.000 💎), DEUS ABSOLUTO (500k, 10.000 💎). RKTOP = 13. Tudo que é por nível do Boss ganhou 3 níveis (Boss nível 12–14): RKXP, RKXW (+680/+800/+950), RKXL, RKLVS, RKPAS, `ph` de cada boss, BSST (160k ATK no 14), BSANTI, RKRW (baús míticos, tickets, sementes, caixas secretas) + presente extra `RKRWX` (joias negras 50/100/250 e moedas 200k/500k/1M, wrapper do `rkRwClaim`).
- Emblemas: `ferramentas/ranqueada_artes/ranks_v370/` (`cortar.py`: fundo preto → transparência pela luminosidade). `RQA.rank` = [Madeira antigo, Bronze, Prata, Ouro, Diamante, Lendário, Dragão, Divindade, Div. Suprema, Div. Celestial, Deus Celestial, Deus Cósmico, Primordial, Absoluto]. O emblema azul do MEIO da 2ª folha ficou guardado (`emb/extra_guardado.png`).
- Placa de título dos 3 novos = Deus Celestial por enquanto (`TPRK`); o dono vai fazer as placas e as molduras.
- Brilho do perfil pelo rank (`p3Tier`, classes `pa0..pa5`): Diamante+ foto brilha; Divindade+ moldura animada na foto; Div. Celestial+ moldura arco-íris girando + "✦ RANK ✦" ao lado do nome + personagem brilhando; Deus Cósmico+ estrelinhas subindo pela tela; Absoluto dourado. Emblemas t11–13 pulsam mais forte.
- Teste `trank_v370.js`.

## v371 — código único BAÚ MÍTICO
- `1ilnmg2` (texto só com o dono) = 10.000 💎 (`gm`) + 5.000 moedas vermelhas (`red`) + personagem MÍTICO aleatório que a pessoa ainda não tem (`rmc`, de `RK_MIT`; mostra a animação `rkCharWin`; se já tem todos: +5.000 💎). 1 pessoa no jogo inteiro. Wrapper `_cp11`. Teste `tcod_v371.js` (C1).

## v372 — gráfico Ultra e 4K mais leves
- Causa: no Ultra/4K a LUZ DOS PERSONAGENS (`drawLit`: ambiente, sombra de forma, AO, 2 luzes de borda, contorno = ~15 passes por lutador) era feita na resolução TOTAL da tela (4K chegava a 2600×1171 px). `extra/9u_v372.py`: o buffer da luz agora usa no máx. `G.litCap` px por px de tela (Ultra 1,05 · 4K 1,25) e é esticado — visualmente igual.
- Teto de resolução: Ultra 1,6x (antes 2,25x), 4K 2,2x (antes até 3,5x) e no máx. ~2,1 milhões de pixels.
- Resolução dinâmica: se mesmo no mínimo ficar lento, desliga sozinha, um por vez: AO+pop → bloom → luz dos personagens (antes ela só desistia). Trocar o gráfico no menu religa tudo.
- Medição (`tgrafico_cmp.js`, U=<outro index> para comparar): Ultra 5 → 14 qps e 4K 5 → 10 qps no navegador de teste (sem GPU); drawLit ~4x mais barato. Gancho `__pvT.setQ`, `__pvT.prof`.

## v373 — 5 níveis de gráfico: MÍNIMO, LEVE, MÉDIO, ULTRA, 4K
- `extra/9v_v373.py`. `G.qlv` 0..4 salvo em `ft_q` (quem tinha Ultra/4K continua). Botão "Gráfico:" passa pelos 5.
- MÍNIMO: resolução 1x, sem clima, fumaça, ambiente e vida do mapa; partículas cortadas em 60.
- MÉDIO: liga os efeitos BARATOS do Ultra (cor do mapa, luzes do cenário, sombra no chão, céu/água animados, filtro de cor mais forte `#cv.hd.qmed`) com a resolução do Leve, e desliga os CAROS: luz por personagem (`noLit`), bloom e `cinePass` (os dois copiam a tela inteira todo quadro) e o cenário em 2 camadas (`nosplit`). `qFlags()`.
- Medição sem GPU (`tgrafico_cmp.js`): Mínimo ~40 · Leve ~38 · Médio ~27 · Ultra ~16 · 4K ~10 qps.
- Gancho `__pvT.prof2([nomes])` mede qualquer função (usa eval só com nomes).

## v374 — correção do "ZUMBI" (Torre/Boss) + passivas em todos os modos + erros dos jogadores
- ZUMBI: quem saía da Caça da Hidra pelo menu de pausa deixava `HY.on=1` (só o `hyEnd` desligava; o `caStart` também não). O wrapper do `ko` da Hidra seguia ativo em TODAS as lutas seguintes: o inimigo ficava com vida 0 e a luta não terminava (Torre, Boss…). Reproduzido em `tzumbi_v374.js` (antigo: phase fica 'fight'; novo: 'ko'). Correção `hyReset()`: desliga HY/CA ao começar qualquer luta que não é a caçada (`startMatch`), no `caStart`, no `update` e no `rkOpen`. NÃO mexe no `G.diff` (a Torre usa diff 3 nos últimos andares).
- PASSIVAS: testadas por raridade (`tpsv_v374.js`): crit 10/15/21, def, vel 7/10/13, regen 0,5/0,75/1 — sobem certo. Mas só valiam no Boss e na Torre → agora valem também na Caça/Hidra (`caca`), Desafio (`dsf`) e Versus (`pve`). PVP tem o sistema próprio.
- ERROS DOS JOGADORES: ferramenta nova `.github/workflows/erros.yml` (lê os docs `er_*` que o `errRep` manda; agrupa por mensagem, jogadores, pilha). Corrigidos: imagem "broken" no `blitD` (o mais comum: travava o quadro) → pula a imagem (`extra/9w_v374.py`); "hidden de null" na revelação das cartas (`rkMega*`/`rkSecWin` em try). Parte dos erros vem de quem ainda não tocou em "ATUALIZAÇÃO NOVA" (código antigo, ex.: `dnLife … fp`).
- Boss conferido de ponta a ponta (`tboss_v374.js`): fase 2 com o dobro de vida e depois vitória + registro.

## v375 — TORRE NOVA (Torre Principal 6 andares + Torre Extrema 5 andares)
- Artes do dono em `ferramentas/ranqueada_artes/torre_v375/recebido/` (menu, 10 mapas, props 3D, armadilhas, frente, objetos, portão, orbes). Cortes: `cortar_alpha.py` (caixas manuais), `cortar_3d.py` (GrabCut, grama = fundo), `cortar_armadilhas.py` (xadrez desenhado 253/236 = fundo, peças por faixa) → `sp/`. `assets.py` → `RQA.torre5` {menu, mapas{}, frente, sp{}, subir (recorte das torres para a tela "subindo")}.
- Código no fim do `rk.js` (bloco `v375: TORRE NOVA`, antes do `__pvT`). Estado `TN`; usa `G.gmode='torre'` + `TW.on` (vida em barras, equipamentos, poções, bônus/dificuldade de rank, troféus `TW.tr`, ranking `tw_rec`/`twSend`). Partida ÚNICA do começo ao fim (um `startMatch`): cada andar troca o cenário com `setStage('tn_<mapa>')` (registrados como cópia do `STG.flo`).
- Andar (`TNF`, g=0..10): lobinhos (`tnWolf` = `hyMk('lobo')` escalado pelo andar; `TN.need` lobos) + armadilhas (`tnTraps`: esp=espinhos de lava, poca=poça (lenta; gelo congela, pântano envenena), mach=machado pêndulo, serra, chama=cabeça de lobo lança-chamas, pedra=pedra rolando com aviso) + meteoros (sombra de aviso → explosão + cratera) + caixas/barris quebráveis (orbes verde=vida, vermelho=+25% dano 12s, azul=energia). Decoração por tema (`TNDEC`) com brilho das tochas/braseiros e brasas; moldura de folhas (`frente`) nos mapas de floresta.
- BOSS: personagem do roster (`TWC`), sprites carregados durante os lobos (`prepMatch([pick,boss])` → `TN.bossReady`). Passivas (`TNBP`: fúria, escudo, regeneração, espinhos, veloz, vampiro, invocador, meteoros, gigante, implacável), quantidade `TNNP` (1→6) e barras `TNBARS`.
- Boss morre → baú CAI DO CÉU (sem pausar; botão "ABRIR BAÚ": moedas, diamantes, equipamento/poção da torre, joia negra na Extrema) + ESTÁTUA DO ANJO acende (escolher 1 de 3 bênçãos `TNBL` com raridade `twRoll`) + ALAVANCA (no andar 6 é a ESTÁTUA DO CAVALEIRO = portal da Extrema) → portão abre → atravessar = tela "SUBINDO A TORRE" (`tnClimb`, cura 20%).
- Tela nova (`tnSkin` por cima do `rkTwSkin`): arte 1847×851, andares com ✔/🔒/👑, tocar na torre escolhe Principal/Extrema (Extrema libera com `tn_best`≥6), SELECIONAR = `tnGo`. Fim `tnFinish`/`tnEndModal` (andar 0..11 no ranking; XP só dos andares jogados). Testes: `ttorre_v375.js`, `ttorre2_v375.js` (G0=andar inicial, NF=nº de andares).

## v376 — Torre: mapas limpos, DESAFIOS por andar e visual dos cenários
- Pedido do dono: tirar pedras/árvores/tudo do mapa → `TN.dec=[]`, sem caixas (`TN.cr=[]`) e sem a moldura de folhas. Ficam só as coisas que funcionam: armadilhas, estátua do anjo, alavanca/cavaleiro, portão, baú.
- Poucos lobos e só em alguns andares: `TNCH` por andar = `lobos` (3–4, no máx. 2 ao mesmo tempo), `met` (CHUVA DE METEOROS: sobreviver 20s, meteoros caindo perto) ou `duelo` (boss na hora com +1 passiva). Fase em `TN.ph` ('mob'/'met'/'duelo'/'boss'/'clear'); `tnPh(nome)` = inimigo invisível de espera. Meteoros fora da chuva ficaram raros.
- DESAFIO BÔNUS por andar (`TNBO`: boss em 60s, perder <30% da vida, combo 12, não levar dano de armadilha/meteoro) → cumpriu = baú ESPECIAL (roxo, +1 item, diamantes).
- Visual: mapas reprocessados (nitidez + contraste/cor, webp 92). `TNST` por mapa: luz do personagem (LT com `key` do cenário), partículas (vaga-lumes, brasas, poeira dourada, cinzas, neve, brilhos de cristal, névoa), raios de luz, neblina no chão, cor (Ultra/4K) e vinheta; clima: gelo=neve, pântano=chuva, assombrado=tempestade. Partículas por nível gráfico (Mínimo nenhuma). Teste: `ttorre3_v376.js`.

## v377 — Torre simplificada (pedido do dono)
- Voltaram os CENÁRIOS ANTIGOS (sorteio entre os `STG` não escondidos, `TN.stg`; ao subir troca com `setStage` + o mesmo ajuste do dia/noite `DN` do `startRound`). Os mapas novos (`tn_*`) ficam registrados mas sem uso.
- Saíram: armadilhas, lobos, meteoros, chuva/duelo/caçada, desafio bônus, alavanca, portão, efeitos dos mapas novos. Andar = só o BOSS (`TN.ph` 'duelo' → 'boss' → 'clear').
- Boss morre → baú cai do céu (perto) + ESTÁTUA DO ANJO aparece perto; tocar nela = escolher a passiva e SUBIR (tela "subindo"). Último andar: abrir o baú → fim.
- Bosses bem mais fortes: `TNBARS` 4→15 barras, `TNDM` 1,3→3, defesa `tdf` .9→.55, vel. até 1,45, crítico 10+3/andar, energia cheia, IA no máximo (G.diff 3; só o 1º andar é 2), passivas `TNNP` 1→7 (sem invocador/meteoros). Teste: `ttorre4_v377.js`.

## v378 — Torre: roletas de passiva, baús recortados, sem travada do boss, IA e XP
- Baús recortados de novo (`torre_v375/cortar_baus.py`: grama verde = fundo + GrabCut com caixa larga + tira o verde da borda) e menores no jogo (105 / 135 o final).
- Saiu a estátua. Depois do boss + baú: `tnRoleta()` mostra DUAS ROLETAS que giram sozinhas (sem escolher): SUA PASSIVA (10 de `TNRL` = `TNBL` sem o ímã; raridade `twRoll`) e PASSIVA DO PRÓXIMO BOSS (`TNBP`; vai para `TN.nextPas`, entra garantida no próximo boss). Depois sobe.
- Travada quando o boss aparecia: era o carregamento do PRÓXIMO boss começando na entrada do boss. Agora o próximo boss carrega quando o boss atual morre (`tnBossDown` → `prepMatch([pick, atual, próximo])`, `TN.preP`), durante o baú/roletas. Medido (`troleta_v378.js`): nenhum quadro > 90 ms na entrada do boss.
- IA: boss da torre usa `TWLV[3 + andar/2]` (até o nível máximo). XP da torre: `RKTWX.fl` 0,6→1 por andar, `top` 2→3,2.

## v379 — Torre: 4 passivas para escolher, rank deixa a torre mais difícil, vidas/transformação e boss final
- Saiu a roleta (pesava no celular). Depois do boss + baú aparecem 4 cartas (`tnPick`, de `TNRL`) para escolher; a passiva do próximo boss é sorteada escondida (`TN.nextPas`).
- Dificuldade pelo rank: `RKTD` agora tem as 14 ranks (antes só 11 → ranks 11–13 davam NaN na vida do boss) e cresce até 3,6x de dano/vida no Deus Absoluto (2,7x no Deus Celestial). Vale também para o texto de recompensas.
- Vidas: na Extrema ~75% dos bosses têm 2 vidas; o BOSS FINAL (andar 11) tem 3. Ao "morrer" com vida sobrando: `tnBossRev` = transforma (`startTransform`), vida cheia, dano x1,5 (máx. 14), recebe 40% menos dano, +8% vel. (≈3x mais forte). Barras/dano base `TNBARS`/`TNDM` reequilibrados (o rank já multiplica).
- Tela: emblema da rank centralizado no círculo (`rtAv` 100,162–224,286); anéis do poder no personagem da torre (`anDecor` também em `#twMe img`). Teste: `ttorre5_v379.js` (G0 = andar inicial).

## v380 — Torre como a antiga (um andar por luta) + subida SALVA + risco do andar + código
- Cada andar é UMA luta (`tnFight`: VS → `startMatch`; o lutador do `setupFighters` vira o boss em `tnBossCfg`). Boss morre → baú + 4 cartas → `tnFloorEnd`: cura 40%, salva e VOLTA PARA A TELA DA TORRE (dá para usar poção/equipar — o `twApply` aplica na próxima luta). SELECIONAR continua.
- Subida salva em `rk 'tnrun'` {g, g0, pick, bosses, stg, hp, bars, bl, nextPas, coins, loot, fr, tr, coinRun} (`tnSave`/`tnRestore`; o `twOpen` recupera). Sair da luta pelo pause (`twQuitFight`) = volta para a torre sem perder (andar recomeça com a vida do começo). VOLTAR não desiste; botão ✖ DESISTIR (`tnGiveUp` → `tnFinish(false,true)`). Morrer = fim (apaga a subida). Personagem trava durante a subida (como antes).
- RISCO do andar (`TNRK`, escolhido na tela, `tn_risk`): 🛡️ SEGURO (boss -25%, prêmios pela metade), ⚔️ NORMAL, 🔥 ARRISCADO (boss +40% vida/+35% dano e +1 passiva; baú raro, prêmios x2).
- Código `TORRENOVA` (hash `kzru11`): 1.000 💎, uma vez por conta. Teste: `ttorre6_v380.js`.

## v381 — Torre: modo 💀 ULTRA EXTREMO
- Botão "💀 ULTRA" na tela da torre (entre VOLTAR e SELECIONAR, `tn_ux`; só troca sem subida em andamento; vai junto na subida salva `ux`).
- Na luta: força PURA do personagem — no fim do `rkApply` zera `tdm/tsp/tdf/tsb/tcd/tfd/pspd/preg/tki/rkCura`, crítico 5, vida = barras da torre; `psSum`/`anSum` devolvem zero durante a luta ULTRA (`tnUxOn`); poção e consumíveis (`tw_pocOn`, `pk_cura`, `pk_drop`) ficam guardados e não são gastos. Sem o multiplicador de rank no boss (`rkTwDiff` desligado). As passivas escolhidas na própria torre continuam valendo.
- Prêmios do baú x2,5 (e baú raro). Teste: `tultra_v381.js` (normal: dano 1,75 / ULTRA: 1,0).

## v382 — Evento 2x XP de rank + código
- `RKEVX`: 2x XP DE RANK de 12/11 16:30 até 15/11 23:59 (Brasília) — `Date.UTC(2026,10,12,19,30)` a `Date.UTC(2026,10,16,2,59)`. Conferido `__pvT.ev()`.
- Código `DOBRODEXP` (hash `1kxa24y`): 1.000 a 4.000 💎 sorteado, uma vez por conta.

## v383 — Torre: "matei o boss e não apareceu nada" (modos difíceis)
- Causa principal achada nos erros dos jogadores (`erros.yml`): `dnLife … reading 'fp'` no desenho do dia/noite — ultimate que troca de cenário deixava `DN.lv` maior que os níveis do cenário (`CUP.L`) e o desenho quebrava todo quadro (tela parava). Nos andares difíceis os bosses têm energia cheia e soltam mais ultimate → acontecia mais. Correção: `drawDN` embrulhado prende `DN.lv/DN.from` dentro do cenário atual.
- VIGIA da torre (`tnWatch`, todo quadro): boss morto (hp 0/ko) sem passar pelo `ko` → chama `tnBossDown`; lutador do boss trocado por outro objeto (transformação/ultimate) → passa as marcas do boss para o novo; andar sem boss → arruma; depois do boss, se as 4 cartas não aparecerem em 5s → mostra; andar final: abre o baú sozinho e termina a torre se ficar parado.
- Guarda no botão de salvar a conta (`acLt` nulo). Teste: `tvigia_v383.js`.

## v384 — COMBO do Shaka respeita os 3 s + energia da transformação não para no combo
- `tryCommon` não tinha o bloqueio da espera (`f.spCD`) para o Shaka (`isSk`) — o botão mostrava a contagem mas o combo saía. Embrulhado no `rk.js`: Shaka com espera → "COMBO EM Xs".
- A energia da transformação (`f.sb`) só enche na linha do `updFighter`, que o combo pula, e no hitstop nada roda. Agora: embrulho do `updFighter` (lutador em `CMBS`/`inCmb` sem ter enchido → enche no mesmo ritmo `tsb/SB_FR`) e do `update` (durante o hitstop também enche para quem está no combo). Teste: `tcombo_v384.js`.

## v385 — fim da devolução automática do v362
- O dono pediu para tirar o presente de desculpas (5.000 💎 + 100.000 moedas) para quem entra agora: o gancho `gfDev()` no `rkOpen` foi removido (a função ficou, sem uso).

## v386 — código único SUPREMO40MIL
- `TWCUP['1k4a4is']` (SUPREMO40MIL): uso ÚNICO (1 jogador): 40.000 💎 + personagem MÍTICO aleatório (`rmc`) + 1 equipamento do Shaka de Virgem (`rsk`, nível secreto, o mais forte). Mensagem junta os dois prêmios (`TWCUP._sp`). Teste: `tcupom_v386.js` (2º aparelho = "já foi usado").

## v387 — TESTE: cabelo do Shaka balançando com o vento (só a conta ADM vê)
- `ferramentas/personagens/shaka/cabelo/separar.py`: polígonos feitos à mão na juba solta dos 3 quadros únicos da pose de luta parada (`idle`; o 3º também é o 1º do `block`) → camadas `corpo_*.png` e `cabelo_*.png` (máscara dura; as camadas se sobrepõem 3 px para não ficar linha) → `RQA.skhair` {nome do quadro: {b, h, rx = raiz}}. A pose `relax` não precisa (o desenho já tem o cabelo mexendo quadro a quadro).
- `rk.js` "v387": `renderFighter` guarda o lutador (`SKHF`); `blitD` do Shaka desenha o corpo, a parte presa da juba (recorte, mesmas inclinações do `blitD`) e a juba solta em fatias verticais (`skhDraw`): parada na raiz e mais solta na ponta, ondas de vento, reage a andar/correr (`vx`), pulo/queda (`vy`) e transformação/carregar.
- MODO TESTE: só aparece para quem tem o título ADM (`skhAdm`). Para liberar a todos: tirar o `(SKHON===2||skhAdm())`. Desligar: `localStorage.sk_hair='0'`. Teste: `tskhair_v387.js`.

## v388 — NARRAÇÃO EM PORTUGUÊS (voz do dono) + escolha na Configuração
- 55 áudios do dono (ElevenLabs, nomes automáticos). Identificados com reconhecimento de fala offline (Whisper small via onnx do sherpa-onnx, baixado do GitHub releases; script no scratchpad) + ordem de geração. Mapa no `ferramentas/narracao/pt/montar_pt.py` (corta silêncio, -15 LUFS igual ao narrador inglês) → `RQA.vozpt` {chave: [arquivos]} (várias = sorteia).
- Português: vMChallenge, vCOK, vFirstAttack, vImpressive, vAmazing (+Espetacular), vFantastic, vExtreme, vReflected, vPowerUp, vMaxBurst ("Máximo poder"), vSuperPower ("Super combo"), vUltimate ("Ataque supremo"/"Ultimate"), vRDestruction, vESpecialFinish, vEReverseSpecialFinish, vEDestructionFinish, vESmashKO, vEDevastation, vEDoubleKO, vEPerfect (2), vPlayer01–03, vGameOver ("O show acabou!"), vCongratulations ("Torre conquistada!"), rounds nR1/nR2/nRF, início da luta nS1/nS2 ("Batalha!"). Ficaram em INGLÊS (o dono preferiu): Versus, Excellent, K.O., Win/Winner/Victory, Player 4–6, round 3/4.
- Extras só em PT: provocações `xProv` (5, depois de um K.O. de round do jogador e quando o boss da torre cai), `xTempo` (tempo esgotado, `timeOver`), `xRecorde` (novo recorde na torre).
- Nomes PT: goku, vegeta, broly, naruto, madara, gojo, rengoku, luffy, zoro, aokiji, garou, shaka (novo — também vale no inglês), qingqing, zaykon, zedry, aylla. Os outros seguem com a voz antiga.
- Troca feita no `smp()` (só áudios `vox`). Botão "Narração: Português / Inglês (original)" na Configuração (`localStorage.voz`, padrão PT). Teste (precisa do servidor local, o file:// não carrega áudio): `tvoz_v388.js`.

## v389 — EVENTO DO SHAKA no Modo Boss (5 dias: 13/11 09:30 até 18/11 23:59) + cenário TEMPLO DE VIRGEM
- `RKBOSS` ganhou o Shaka (`id:'shaka'`, mais barras e mais forte que o Yuta; `bsSt` ×1,3 ataque ×1,45 defesa). `rkBP()` = 'S' (recordes do servidor `rkr` 'S'+nível), recordes próprios `st.recS` (`rkRecK()`), vitórias do farm `st.skW`.
- Janela `SKEV` / `skOn()` / `skLeft()` (usa `ysNow()`, então `window.__ysT` também desloca o tempo). Escolha salva em `rk_bsel`.
- Lobby `sb` (`skLobbyH`, arte do dono `ferramentas/cenarios/shaka/recebido/lobby.png` → `RQA.shk.lobby` = `RQA.boss_sk`, 1847×851): lista Broly/Yuta/Shaka, contagem do evento, 5 recompensas (💎, pó, equip., ✦ itens de Virgem 0,3%, ✦ SHAKA 0,5%), chat, online, equipar, trocar, iniciar. Vaga do Shaka (`skSlot`) nos lobbies do Broly e do Yuta.
- INICIAR → modal `skStart()`: RANQUEADO (nível = rank, dá XP) ou FARM do evento com as 5 dificuldades do `YSDIF` (mesmo `RKYD`), passivas sorteadas SEM roleta (`skRoll`, `SKPOOL`; nomes `SKPN`). `ysApply` foi embrulhado para o Shaka.
- Drops (`rkResult` com `R.bn==='SHAKA'`): farm igual ao do Yuta; DIFÍCIL+ 0,3% item de Virgem (`skSecLeft`), MESTRE/SUPER 0,5% o próprio SHAKA (`rkMegaS` + `skTitClaim`); ranqueado: 0,2% item de Virgem. Tudo × sorte.
- Cenário `STG.shk` (só no boss Shaka, `hid`): 3 estados × 4 camadas com parallax (céu .03, meio .25-.3, templo+estátua .6, chão 1) desenhados por `shkDraw` (embrulha `drawStageLayers`). Inteiro → RACHADO quando o Shaka abre os olhos (2ª fase) → DESMORONADO com 45% da vida na 2ª fase (`shkSet`: tremor, poeira, banner). Pétalas / poeira / brasas (`shkFx`). Carrega o estado 1 na luta e os outros 2 depois (`shkImgs`).
- Fontes: `ferramentas/cenarios/shaka/` — `recebido/` (artes do dono), `cortar.py` (tira o fundo branco/xadrez/preto → `camadas/`), `layout.json` + `sim.py` (simula a câmera), `montar.py` (→ `www/a/*.webp` + `shk.json`, que vai no `rk_assets.json` em `shk`). Sobraram sem uso: c3_ceuA, c3_meioB, c3_estatuaB, c3_chaoB, c1_estatua já está junto do templo.
- Teste `ferramentas/testes/tshaka_v389.js`.

## v390 — SHAKA: boss mais difícil (3x o Yuta), passiva antes da luta, +20% jogando com o Shaka e EVOLUÇÃO V2
- Boss Shaka: `bsSt` ataque ×3,6 e defesa ×4,05 (= 3x os do Yuta); barras do ranqueado = 1,5x as do Yuta; farm do Shaka = barras do `YSDIF` ×1,5 (`skFph`). Luta de 7 min (`rkBossGo` embrulhado: `G.timer=420`).
- Antes de toda luta do Shaka (`skGo` → `skPpPick`): 3 cartas de passiva para escolher 1, raridade de COMUM a PRIMORDIAL (`PSRK`/`PSRC`/`psRN`, pesos `SKPPW` 38/26/17/10/5,5/2,5/0,8/0,2). Tipos `SKPPT`: dano, defesa, velocidade, crítico, roubo de vida (`p.skVamp`), energia de transformação. Vale só naquela luta (`SKPP`, aplicado no `rkApply`; LUTAR DE NOVO repete a mesma).
- Jogando COM o Shaka (G.pick==='shaka') no evento: +20% de dano e de defesa.
- EVOLUÇÃO V2 (`skV2Ch`, `skV2Evo`, `skV2Win`): cada vitória contra o Shaka tem 0,3% (1º rank) → 3% (rank mais alto) de um item de Virgem que o jogador JÁ TEM virar V2 (não vem item novo). V2 = +35% em todos os atributos, nome "... V2", `it.v2=1`, `it.skb`=chave base, ícone novo da arte do dono (`ferramentas/cenarios/shaka/v2/`, `RQA.shk.v2`). `skSecLeft` e o conserto v292 reconhecem o V2 pelo `skb`. Chance NÃO multiplica pela sorte (número exato pedido pelo dono).
- Efeito especial V2: ícone brilha dourado/roxo em qualquer lugar (estilo criado em tempo de execução pelo `src` dos ícones) + faíscas douradas/roxas no lutador que usa V2 (mais itens V2 = mais faíscas).
- Teste `ferramentas/testes/tshaka_v389.js` (agora cobre passiva, timer e V2).

## v391 — SHAKA num NÍVEL MAIS BAIXO (mais fácil)
- No modal do Shaka (`skStart`), abaixo do RANQUEADO: botões NÍV. 1 … (seu rank − 1) (`.skLv`, `skGo(-1,l)` → `RKSEL=l`). `rkBossStart` agora trata o Shaka igual ao Broly: `RKSEL` abaixo do rank = MODO FARM (`RKFL`): boss daquele nível, sem XP de rank (nem perde), gemas pela metade e baú menor (lógica `FM` do `rkAfter`).
- Drops especiais pelo nível que lutou: V2 `skV2Ch(R.farm-1)` (farm do evento usa o nível da dificuldade), item de Virgem no farm de nível 0,1% (ranqueado 0,2%).
- Teste `ferramentas/testes/tshaka_nivel_v391.js`.

## v392 — Boss SHAKA libera ao MEIO-DIA de 13/11
- `SKEV.ini` = 13/11 12:00 (Brasília). Antes disso a vaga mostra "LIBERA 12:00" (`skAntes()`) e tocar avisa "libera hoje ao MEIO-DIA". Quem tem o título ADM entra antes (`skOn` deixa ADM passar) para testar. Fim continua 18/11 23:59.
- Teste `ferramentas/testes/tshaka_meiodia_v392.js`.

## v393 — tela de ESCOLHA do Shaka com a arte do dono
- O modal do `skStart` virou a tela `skp` (`skPickH`, arte `ferramentas/cenarios/shaka/recebido/escolha.png` → `RQA.shk.pick` = `RQA.shk_pick`, 1847×851). Botão RANQUEADO (nível, barras, XP, chance V2), 11 vagas de NÍVEL (níveis abaixo do rank liberados; ★ = seu rank; 🔒 acima; com rank > 11 a janela mostra os 11 níveis logo abaixo), 5 dificuldades do farm, VOLTAR → lobby `sb`. Mesmas ações `skgo` (com `data-l`).
- Os testes do Shaka agora deslocam o relógio (`__ysT`) para depois do meio-dia de 13/11.

## v394 — SHAKA: FORMA DIVINA (Armadura Divina = os 5 itens V2)
- Itens V2 viraram a ARMADURA DIVINA: nomes `SKDN` (ELMO DIVINO, ARMADURA DIVINA, LUVAS DIVINAS, BOTAS DIVINAS, ROSÁRIO DIVINO + " V2"), ícones novos do dono (`divina/icones_v2_divinos.png` → `RQA.shk.v2`), itens antigos são renomeados ao abrir. Lobby do evento com a arte nova (`divina/lobby_divino.png`, mesmo layout).
- Regra: jogando COM o Shaka (jogador 1), os 5 itens V2 EQUIPADOS (`skDivSet`), de OLHOS ABERTOS e com vida ≤ 1 barra (`LAYER`) → `skDivTry` toca o vídeo da transformação divina (`divina` vídeos em `RQA.skdv.t`, `G.trans.skv`, `updSKDV`) → `f.skDiv=1`, sprites `skv` (`ssid`), velocidade 3,3 (`speedMul`; olhos abertos 1,82 ≈ +80%), dano ×2,2 (+120%), combo a cada 2 s (`spCD` ≤ 120), inimigo paralisado 3 s, forma não acaba mais na luta, botões brilhando (`#controls.skdv`), auréola dourada com raios girando (`skAura` embrulhado). Uma vez por luta.
- Ultimate divina (100 Ki): vídeo do dono (`RQA.skdv.u`, `G.ws.skv`, `updSKU` usa o tamanho certo) → PURIFICAÇÃO (`skPurTick`): inimigo sobe 150, fica CONGELADO 4 s tomando um golpe CRÍTICO a cada 7 quadros (`ycrit`) + golpe final e cai.
- Tela "ARMADURA DIVINA COMPLETA" (`skDivWin`, arte de corpo inteiro `RQA.skdv.corpo`) quando o 5º item vira V2 (uma vez, `rk_skdvok`).
- Sprites: `ferramentas/personagens/shaka/divina/` — `folhas/d01..d13` (folhas do dono), `seg_skv.py` (recorte por grade), `build_skv.py` (mesmas animações do sk, IA 2x, cache `build/cache_ai.json`; rodar na pasta `/home/claude/skv_build`), `build/skv.json` → patch `ferramentas/web/extra/9x_v394.py` (SPRH.skv, ssid, sidsOf carrega skv só com o set, speedMul, vídeos). Combo pronto usa `cmb` = folha d07 (16 quadros); `cmb2` (folha d03) guardado.
- Teste `ferramentas/testes/tshaka_divino_v394.js`.

## v395 — ADM testa a FORMA DIVINA na Batalha Treino
- `skDivTreino()`: na Batalha Treino (`G.gmode==='treino'`), quem tem o título ADM vira a forma divina logo depois de ABRIR OS OLHOS, sem os 5 itens V2 e sem precisar de 1 barra (o boneco não ataca). Fora do treino a regra continua a mesma. `skDivLd()` (no `sidsOf`) carrega os sprites `skv` para ADM sempre.
- Gancho de teste `__pvT.treino(eu, rival)`. Teste `ferramentas/testes/tshaka_treino_v395.js`.

## v396 — conserto: a "Batalha Treino" do menu é o modo `pve` (luta normal), não `treino` (boneco)
- `skDivTreino()` agora vale em `pve` E `treino` para quem tem o título ADM. Testado pelo caminho real (botão de transformar → abrir os olhos → forma divina). Gancho novo `__pvT.trf()` (transforma o jogador 1). Teste: `GM=pve node ferramentas/testes/tshaka_treino_v395.js`.

## v397 — BATALHA TREINO = modo livre (sem bônus) com a FORMA DIVINA para todos + Templo de Virgem
- O dono: a Batalha Treino (menu; `G.gmode` 'pve', e também o boneco 'treino') é o modo de só brincar, separado do ranqueado: sem bônus de nada. `setupFighters` embrulhado: em `pve`/`treino` apaga `tdm/tsp/tdf/tsb` e zera `tcr` dos dois lutadores (o ADM ganhava +70%). Todos os personagens já ficam liberados nessa tela.
- Forma divina do Shaka para TODO MUNDO nesse modo (`skLivre`, `skDivTreino` sem ADM): logo depois de abrir os olhos, sem itens V2 e sem precisar de 1 barra. No ranqueado/boss a regra continua (5 V2 + olhos abertos + 1 barra).
- Conserto "a segunda transformação já aparece pronta": os vídeos divinos só começavam a baixar na hora de transformar. Agora `prepMatch` (com Shaka) espera os vídeos (`skDvLoad`, inclui a ultimate) e `skDivTry` só começa com `SKDOK`.
- TEMPLO DE VIRGEM na escolha de fase (`STG.shk.sel`, miniatura `RQA.shk.thumb`; o patch 9x mostra `hid` com `sel` e usa `STG[k].thumb`), fora do "Aleatório". Fora do boss ele racha quando alguém perde 40% da vida e desmorona com 75%.
- Teste: `GM=pve node ferramentas/testes/tshaka_treino_v395.js` (jogador sem ADM).

## v398 — forma divina pelo BOTÃO, aura dourada clara, cabelão balançando, tamanho certo e otimização
- Não transforma mais sozinho (`skDivTry` virou vazio). De OLHOS ABERTOS, apertar TRANSFORMAR de novo (`tryCommon` embrulhado) com **1 barra de energia** (gasta 1) vira a forma divina. Modo livre: sempre. Ranqueado/Boss: 5 V2 + 1 barra de vida (`skDivWhy` diz o que falta). O botão de transformar acende (`updateButtons` → `.skdvR`).
- Tamanho: `SZK.skv=.9` (mesma altura do Shaka normal).
- Aura divina: chama do Gojo recolorida em DOURADO CLARO (`skGold2`) no lugar da dourada; sem o degradê grande e sem a auréola.
- Cabelão: `blitD` embrulhado só para quadros `skvH` (forma divina): a parte de trás do sprite (atrás do corpo, `xb`) é desenhada em fatias verticais de 9 (14 em qualidade baixa) que balançam mais nas pontas e reagem a andar/correr/pular/carregar.
- OTIMIZAÇÃO: os botões de olhos abertos (`#controls.skf`, desde a v282) e da forma divina pulsavam com `filter` animado = celular redesenhando os controles a cada quadro. Agora brilho FIXO. Vídeos: só a transformação divina carrega na luta; a ultimate carrega quando ele vira divino (`skDuLoad`); a transformação é liberada da memória depois de usada (`skDvFree`) e tudo é liberado quando o Shaka sai (`VIDF.shaka`).
- Testes: `tshaka_treino_v395.js` (GM=pve) e `tshaka_divino_v394.js` apertam o botão (`__pvT.dvBtn()`).

## v399 — PROTEÇÃO DA CONTA (aparelho com progresso velho não salva mais por cima) + conta do Michael restaurada
- Caso: "Michael" (12/11 22:46 rank 33.422 XP, 7 personagens, Shaka 70, 79 mil 💎) — às 23:29 um OUTRO aparelho logado na mesma conta, com o progresso antigo (3.201 XP, só Goku), salvou por cima; o ENTRAR pega o salvamento mais novo → "perdeu tudo".
- Correção no jogo (`acNewer`, `acConfM`, `acSave` embrulhado): antes de salvar e 5 s depois de abrir o jogo, confere o salvamento mais novo da conta com assinatura válida; se for mais novo que o último deste aparelho (`ac_t`), NÃO salva e mostra os dois progressos: CARREGAR O DA CONTA (troca o aparelho pelo da conta) ou MANTER ESTE APARELHO (salva este por cima, de propósito). Teste `ferramentas/testes/tconta_v399.js`.
- Ferramenta nova `.github/workflows/restaurar.yml` (nome + ts): lista os salvamentos; com ts, cria 15 cópias idênticas (mesma assinatura) com IDs `sv_<conta>_<agora36>_rNN`, acima dos atuais e abaixo dos futuros → ENTRAR carrega o restaurado; salvamentos novos continuam valendo. Nada é apagado.
- Michael restaurado para o salvamento 1794534395761 (12/11 22:46:35).

## v400 — Boss SHAKA com 3 VIDAS no topo + EVENTO SEXTA-FEIRA 13 (abóboras e loja)
- Shaka: nos 4 ranks mais altos (`shk3On`: boss Shaka ranqueado, `rkBL()>=RKTOP-3`) ele tem 3 vidas — 1ª normal, 2ª olhos abertos (`rkPhase2`), 3ª FORMA DIVINA (`skPhase3`, `ko` embrulhado; mesmas barras da 2ª, dano ×1,35, defesa ×0,85, velocidade ×0,7 para compensar a velocidade divina; toca o vídeo divino; templo desmorona). `skDivLd` carrega os sprites `skv` nesse caso. Botão RANQUEADO mostra "3 VIDAS (3ª DIVINA)".
- V2: `skV2Ch` 0,3% → 3% até o 4º rank mais alto; nos 3 mais altos 5% / 5,5% / 6%.
- SEXTA-FEIRA 13 (rk.js "v400", arte `ferramentas/ranqueada_artes/sexta13/` → `RQA.sx13`): ABÓBORAS (`rk_sx`) caem só em 13/11 (`SXDROP`) no fim de toda luta (`ko`/`timeOver` → `sxGive`): Batalha 3–7, Torre 5–10/andar, Boss 12–25 (Shaka ×1,5), Caça 10–20, PVP 10–18, Desafio 8–15; derrota 1–3; vitória 1% de CAIXA SURPRESA (`rk_sxbox`). Boneco de treino não dá.
- Loja `sx` (`sxH`, 1847×851) até 15/11 23:59 (`SXLOJA`), botão na Loja (2º espaço da esquerda): GEMINHAS 100 🎃 → 10–100 💎 · CAIXA SURPRESA 500 🎃 (ou abre as ganhas): 💎 200–1000 40% / 🎫 3–8 25% / 🔴 150–500 25% / 🎃 150–400 9% / 1% item da ARMADURA DIVINA (V2 que falta; completo = 3000 💎), animação fechada→aberta · ABÓBORA NEGRA 250 🎃: bônus pessoal com tempo (`rk_sxb`; 2x XP 10 min 30%, 2x gemas 5 min 25%, 2x sorte 5 min 20%, 2x drop 3 min 15%, 3x XP 5 min 10%) que entra em `RKEVX` como evento só do jogador (`sxBoostApply`, multiplica por cima do evento global; o novo substitui o anterior).
- Teste `ferramentas/testes/tsexta13_v400.js`.

## v401 — TORRE não trava mais depois do boss morrer (jogador Honrado) + códigos novos
- Caso "Honrado" (Shaka, rank 95 mil): matava o boss da Torre, o andar não terminava e ele ficava pulando na arena; saía pela pausa (a subida salvava no MESMO andar → "precisa fazer 2 vezes") ou desistia (perdia rank). Não reproduzi no PC (nem com o salvamento real dele, `ttorre_honrado_v401.js` com SAVE=json), então blindei todos os caminhos (rk.js "v401"):
  - `twQuitFight` (pausa → menu) e `tnFinish(false,…)` (desistir/endRound) com o boss do andar JÁ morto (`TN.ph==='clear'`) contam o ANDAR COMO VENCIDO (`tnForceFloor`), sem perder rank.
  - Carta da passiva: um toque só (toque duplo/erro não trava); se der erro, fecha e termina o andar.
  - Vigias: carta escolhida e andar não terminou em 5 s → `tnFloorEnd`; andar terminado mas ainda na luta em 4,2 s → força a volta (`tnForceFloor`/`tnGoTower`); luta da Torre com `TN.on=0` por 4 s → volta para a Torre.
  - Teste `ferramentas/testes/ttorre_trava_v401.js`.
- Perdas do Honrado desde 12/11: 5 × 125 = 625 → devolvido em DOBRO (1.250) pelo código de uso único HONRADO1250 (campo novo `rp`).
- Códigos (uso único no jogo inteiro, textos só com o dono): PASSEMAXIMO (`bpmax`: passe premium `own=2` + XP do nível 20), ABOBORA300 (`sx` 300 🎃), SEXTA13GEMAS (1000 💎), CAIXASEXTA13 (`sxbox` 1 caixa surpresa). Teste `CODE=... node ferramentas/testes/tcupom_v401.js`.
- `.github/workflows/restaurar.yml`: agora soma as perdas de rank desde 12/11 e com ts=dump imprime o último salvamento (zlib+base64).

## v402 — códigos da Sexta-feira 13 para TODO MUNDO (1 vez por conta)
- ABOBORA300, SEXTA13GEMAS e CAIXASEXTA13 agora `acc:1` (cada CONTA usa 1 vez; precisa estar logado na conta). PASSEMAXIMO e HONRADO1250 continuam de uso único no jogo inteiro. Teste: `CODE=... REP=1 node ferramentas/testes/tcupom_v401.js`.

## v403 — títulos do coração e 2 códigos de uso único (namorada e protegida do dono)
- Títulos (rk.js "v403", `hid`, só quem ganha vê): `love` "💖 LOVE" (+50% dano/defesa/velocidade/crítico/sorte via `TBUF.love`) e `prot` "💗 MINHA PROTEGIDA" (+20% em tudo). Perfil: `.pfTt.luvT` (borda rosa girando, texto rosa/branco animado, corações subindo); chat/rankings: `.twTit.luv` (patch 9x muda o `twTitTag`).
- Códigos (uso único no jogo inteiro, textos só com o dono): MEUAMORLOVE (`luv:'love'`) = TODOS os personagens (`ALLC`), todos os equipamentos especiais (`RKSP`) + Armadura Divina V2 completa + 1 equipamento de cada tipo na raridade máxima, 200.000 💎, 500 🎫, 30.000 🔴, 200.000 🪙, 3.000 🎃 + 10 caixas surpresa, passe máximo, título LOVE já equipado. MINHAPROTEGIDA (`luv:'prot'`) = todos os personagens, todos os equipamentos (mesma lista), 50.000 💎, título MINHA PROTEGIDA equipado. `luvGive`. Teste `CODE=... node ferramentas/testes/tcupom_v401.js`.

## v404 — tocar num jogador do RANKING volta a abrir o perfil
- A tela nova de Ranking (`rkView('rkg')`, `RG2`) tem as linhas com `data-pu`, mas o ouvinte de clique do perfil só aceitava a lista antiga (`#rkModal .twRk`) e o chat. Agora aceita `.rk_rkg` também; o VOLTAR volta ao ranking na mesma aba (e página). Teste `ferramentas/testes/tperfil_v404.js`.

## v405 — abóboras da Sexta-feira 13 aparecem no resultado
- As abóboras já caíam no Boss (inclusive Shaka), mas só num texto rápido no K.O. Agora `sxGive` guarda `SXL` e: no Boss (Broly/Yuta/Shaka, ranqueado e farm) a linha "🎃 +N ABÓBORAS (+ caixa)" entra no topo da lista de prêmios do resultado (`rkResult`); nos outros modos aparece um aviso ao voltar para a tela (Torre/Ranqueado) com o total.

## v406 — Boss Shaka dá 200–230 abóboras, Caixa Surpresa mais modesta, evento 2x SORTE + 2x DROP até 00:00 de 13/11
- `sxGive`: vitória no Boss SHAKA (ranqueado ou farm) = 200–230 🎃.
- `sxBoxOpen`: 💎 15–30 · 🎫 1 · 🔴 5–10 · 🎃 20–50; item da Armadura Divina = `min(1,5%, lvLuck())` (1% base, sobe com a sorte até 1,5%).
- `RKEVX` (1º da lista): 13/11 16:10 → 14/11 00:00 (Brasília) 2x XP · 2x SORTE · 2x DROP (`{luck:2,drop:2}`), por cima do 2x XP de rank que vai até domingo.

## v407 — CRASH do Boss Shaka no nível 13 (forma divina pesada demais)
- Causa: no rank alto (3 vidas) o jogo carregava na entrada da luta sk + skd + **skv (271 MB decodificado, 22 MB de download)** + vídeo divino (75 MB) → +500 MB → celular travava/fechava.
- `divina/reduzir_v407.py`: quadros skv de 2,4x → 1,45x (99 MB / 9,8 MB) e vídeos 800×450 → 640×360. Arquivos antigos apagados do www/a.
- Carregamento SOB DEMANDA (rk.js "v407", `skvNeed`): `skDivLd()` = false (nada divino na entrada); sprites `skv` (`loadSid`) + vídeo começam a carregar quando o Shaka ABRE OS OLHOS e pode virar divino (jogador no modo livre / com a armadura; boss com `shk3On`). Jogador: o botão só transforma com tudo pronto (`SKVOK`/`SKDOK`), senão "CARREGANDO A FORMA DIVINA...". Boss 3ª vida: se ainda não carregou, luta de olhos abertos e vira divino assim que terminar. Tudo é liberado no `startMatch` seguinte.

## v408 — código MITICOALEATORIO (uso único): caixa de personagem MÍTICO aleatório
- `TWCUP['4zocj2']={rmc:1}`: sorteia um mítico que a pessoa ainda não tem (`RK_MIT`), com a animação de personagem novo; se já tiver todos, 5.000 💎. Mensagem dos códigos `rmc` não mostra mais "+0 💎".

## v409 — Caixa Surpresa: 2% → 4% de EVOLUIR uma peça de Virgem (não dá item novo)
- `sxBoxOpen`: chance `min(4%, 2%×lvLuck())`. Agora é EVOLUÇÃO (igual ao Boss Shaka): escolhe uma peça de Virgem que a pessoa JÁ TEM e ainda não é V2 e aplica `skV2Evo` nela. Sem peça para evoluir (não tem nenhuma, ou todas já são V2) → sorteia os outros prêmios. Peça V2 nunca repete. Teste `ferramentas/testes/tcaixa_v409.js`.

## v410 — código ADMABOBORA30K (uso único, do dono): 30.000 🎃 abóboras da Sexta-feira 13

## v411 — Caixa Surpresa: ABRIR 5x / 10x + código ADMABOBORA50K
- `sxBoxRoll()` (1 sorteio, mesma tabela da v409), `sxBoxMulti(n)`: usa primeiro as caixas que a pessoa já tem e paga 500 🎃 por cada uma que falta; tela com a grade de prêmios (`.sxGr`, evolução V2 brilhando) e botão ABRIR +n. Teste `ferramentas/testes/tcaixa10_v411.js`.
- Código ADMABOBORA50K (uso único, do dono): 50.000 🎃.

## v412 — Boss SHAKA dá 450 🎃 por vitória (ranqueado ou farm do evento)

## v413 — PERFIL: escolher a forma do personagem do pedestal (NORMAL / TRANSFORMAÇÃO / 2ª TRANSFORMAÇÃO)
- Botões embaixo do personagem no perfil (`pfFormBtns`, perfil novo `p3Ch`). Escolha por personagem em `rk_pedf` ({id:0|1|2}) e publicada no perfil (`pf` no `pfMine`) → quem visita vê a forma e a etiqueta "⚡ TRANSFORMAÇÃO"/"✦ 2ª TRANSFORMAÇÃO".
- Imagens (`pedSrc`): normal = `fullSrc`; transformações = 1º quadro parado do sprite da forma (`PFFS`: sid base → [forma1, forma2]); 2ª do Shaka = arte de corpo inteiro divina (`RQA.skdv.corpo`) e só aparece com a Armadura Divina completa (`skDivHave`); Zedry tem 2ª (`zed3`). Teste `ferramentas/testes/tperfil_forma_v413.js`.

## v414 — forma divina NÃO exige mais vida baixa
- O dono: transformar = 2 barras de ENERGIA; 2ª transformação (divina) = já de olhos abertos + 1 barra de ENERGIA. Tirado o "1 barra de vida" do `skDivWhy` (ranqueado/boss continuam exigindo os 5 V2 equipados; modo livre não). Texto da tela "Armadura Divina completa" corrigido. Teste `tshaka_divino_v394.js` agora com vida cheia.

## v415 — a FORMA do personagem é escolhida na aba PERSONAGEM e vale em TODO o jogo
- Botões NORMAL · TRANSFORMADO · 2ª FORMA embaixo do personagem na aba Personagem (biblioteca `lib`, `lbPed` + `pfFormBtns(id,st)`), só para personagens que a pessoa tem. Escolha em `rk_pedf` por personagem.
- `fullSrc` embrulhado (guarda `fullSrc0`): toda imagem grande do personagem (aba Personagem, Anéis com os anéis em volta, perfil, Equipamentos…) usa a forma escolhida. Perfil não tem mais botões (só mostra; visitantes veem a forma pelo campo `pf`). `tperfil_forma_v413.js` (agora sem botões no perfil) e `tforma_lib_v415.js`.

## v416 — código ARMADURAVIRGEM (uso único, do dono): as 5 peças V1 da armadura de Virgem
- Campo `skv1`: coloca na mochila as peças de `SKSEC` que a pessoa ainda não tem (nem V1 nem V2). Depois elas podem evoluir para V2 no Boss Shaka ou na Caixa Surpresa.

## v417 — FORMA DIVINA mais divertida
- Leve/escorregadia: rastro fantasma dourado/branco ao andar, correr, pular e dar dash (ghosts a cada 3 quadros); combo pronto mais rápido na divina (sk.js: `D=f.skDiv?1.9:…` no `skStep` e na animação `skc`), com fantasmas e luzes douradas durante TODO o combo/golpes.
- DESVIO DIVINO (`skDodge` embrulhado só com `skDiv`): 50% de chance, recarga 0,5 s, aparece atrás do inimigo deixando 2 fantasmas.
- REFLEXO (`applyHit` embrulhado): 22% dos golpes que acertam o Shaka divino voltam 70% do dano para quem bateu (recarga 40 quadros, "REFLETIDO!").
- AURA DIVINA: auréola dourada com raios de luz girando atrás da cabeça (`skHalo`, imagem pronta em cache = leve), por baixo da chama dourada clara da v398.
- Teste `ferramentas/testes/tdivino_jogo_v417.js` (40 golpes: ~50% desvio, ~20-30% dos acertos refletidos).
