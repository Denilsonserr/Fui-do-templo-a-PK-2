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
