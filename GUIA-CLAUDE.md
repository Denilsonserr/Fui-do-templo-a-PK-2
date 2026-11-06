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

## Pendências / ideias
- Vegeta transformado: faltam poses próprias de carregar ki, rajada de ki, soco e chute no ar (hoje usa grito da vitória, soco e chute alto). Se o dono mandar, trocar no `build_vegeta_blue2.py` e no mapa `A`.
- A segunda folha de "gancho para cima" do Vegeta transformado não foi usada.
- Efeitos desenhados pelo dono: ainda não chegaram.
- Nomes "Impacto do Príncipe" e "Clarão Final" foram inventados pelo Claude; o dono pode querer trocar.

## Observações
- Os scripts em `ferramentas/` foram escritos para a pasta temporária da sessão antiga; ajuste os caminhos (`/tmp/...`, `/home/claude/...`) antes de usar.
- Músicas e sons de efeitos são de jogos/animes com direitos autorais — o jogo é só para uso pessoal do dono.
