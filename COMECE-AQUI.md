# FÚRIA DO TEMPLO — GUIA DE PASSAGEM PARA OUTRA CONVERSA / OUTRA CONTA DO CLAUDE

A versão atual é a v654.
Atualizado em 20/11/2026. Este arquivo tem 3 partes:
- **Parte 1** — para o dono (Denilson): como continuar em outra conversa.
- **Parte 2** — para o Claude novo: regras, onde está tudo, servidor, como publicar, o que existe no jogo.
- **Parte 3** — como criar um PERSONAGEM NOVO (o próximo deve ser o **GOKU INSTINTO SUPERIOR**).

O histórico completo, versão por versão, está em `GUIA-CLAUDE.md` (procure por `## vNNN`).

---

## PARTE 1 — PARA O DONO

1. Abra o **Claude Code** (claude.ai/code ou a parte de código do app) na conta que for usar.
2. Conecte o **GitHub** e dê acesso ao repositório **Denilsonserr/Fui-do-templo-a-PK-2**.
3. Comece uma conversa nova com esse repositório e mande esta mensagem:

   > Continua o meu jogo Fúria do Templo. Repositório: Denilsonserr/Fui-do-templo-a-PK-2. Lê primeiro o COMECE-AQUI.md inteiro (e o GUIA-CLAUDE.md quando precisar de detalhe) e segue as regras dele. A versão atual é a v654.

4. Depois é só pedir as coisas do mesmo jeito de sempre.
5. **Onde fica o jogo:**
   - **Site (o principal):** https://fui-do-templo-a-pk-2.denilsinend.workers.dev — conta da **Cloudflare** do dono. Atualiza sozinho ~2 minutos depois de cada versão. Para forçar: `?v=NÚMERO` no fim do link.
   - **APK leve:** GitHub → Releases → `ultima-versao`. Ele abre o site, então **nunca precisa reinstalar**. Quando sai versão nova, aparece no jogo o aviso amarelo **"🔄 ATUALIZAÇÃO NOVA — toque para atualizar"**.
6. **Servidor (contas, saves, ranking, chat, códigos, mercado):** o **Worker da Cloudflare** com o **banco D1 "furia"**. O uso está bem abaixo do limite (o workflow `uso.yml` mostra quanto já foi usado). O Firebase antigo não é mais usado.
7. **Códigos secretos:** o texto dos códigos **não fica no GitHub** (só um "hash"). Guarde a sua lista. Se o Claude novo precisar de um código antigo, mande na conversa.
8. **Personagem novo:** veja a Parte 3. Mande as artes e as regras e diga **"mandei tudo, pode fazer"**.

---

## PARTE 2 — PARA O CLAUDE NOVO

### Quem é o dono e como responder
- **Denilson ("Denilson ADM")**, fala português do Brasil simples, muitas vezes por voz, com erros de digitação: "rark" = rank/ranking, "boys" = boss, "porção" = poção, "codico" = código, "Provine" = "pro Vini", "Ignis" = Igris, "anel SG/SP" = nota do anel.
- Responda **em português simples, curto, sem termos técnicos**. No fim de cada versão: o que mudou, o que foi testado e o link `https://fui-do-templo-a-pk-2.denilsinend.workers.dev/?v=NNN`.
- Faça direto; só pergunte quando a decisão for dele (prêmios, valores, algo que não dá para desfazer). Quando algo é visual, mande print (Playwright, `deviceScaleFactor:2`).
- Pedidos frequentes: **códigos** (anéis, gemas, joias, passe), **eventos** (2x/3x XP, estrelas, drop), **bugs mandados por print dos jogadores**, **bônus pessoais** para o Vini (conta espiã dele, `vnOn()`), coisas só do ADM.

### Regras fixas do dono
- Vídeos de super/transformação entram **sem som** (exceção: giro do gacha do Shaka/Sung).
- **Não copiar arte de jogos comerciais, não clonar vozes reais.** Referência em vídeo = só a ideia; efeito feito em código.
- **Personagem novo só quando ele mandar tudo.** Não inventar poderes.
- Nomes com "adm" são proibidos; o ADM é a conta **"Denilson ADM"** (`TWADMN`, `mnAdm()` no rk.js).
- **Código secreto: nunca escrever o texto no repositório**, só o hash `twHash` (FNV-1a base36 do texto em MAIÚSCULAS) em `TWCUP[hash]`. O texto vai só para o dono, na conversa.
- Moeda vermelha 🔴 = dinheiro de verdade para ele: dar pouco.
- Recortes sempre conferidos (sem borda branca, sem buraco). Não baixar a qualidade das artes.
- Bots: jogadores falsos nos rankings (`botList`), a pedido dele.

### Onde está cada coisa
- Jogo inteiro: `www/index.html` (UM arquivo, GERADO) + artes/sons/vídeos em `www/a/` (nome = hash do conteúdo, `.webp/.mp4`).
- **Nunca edite `www/index.html` à mão.** Monte com `bash ferramentas/web/montar.sh`:
  `base_v212.html` → `patch_v213.py` (injeta `ferramentas/web/ranqueada/rk.js` + `rk.css` + `rk_assets.json` = `RQA`) → `ferramentas/web/extra/*.py` em ordem alfabética (personagens e trocas de texto do código base; o mais novo é `9z_v556.py`). No fim confere o JavaScript e grava `www/versao.txt`.
- **Quase tudo novo vai no FIM do `rk.js`.** Ele roda no mesmo escopo do script base: troque funções com `{const _x=fn;fn=function(){...;return _x.apply(this,arguments)}}`. `const` do base NÃO dá para trocar — para isso use um patch em `extra/` com `rep(antigo,novo)` conferindo a contagem.
- O rk.js roda ANTES de vários `const` do base (ex.: `DYN`, `FS_IOS`, quadros/qualidade): usar no topo dá erro TDZ → use dentro de funções ou `setTimeout(...,0)`.
- Funções internas não são globais no `page.evaluate`: exponha ganchos com `try{Object.assign(window.__pvT||{},{...})}catch(e){}` (há centenas: `__pvT.cup`, `__pvT.G`, `__pvT.treino`, `__pvT.ko`, `__pt.start`...). `__dbg.G` = estado da luta.
- **Testes:** Playwright em `ferramentas/testes/` (`node NOME.js`). Servidor local com o worker de verdade + SQLite: `node ferramentas/servidor/local.mjs 8790` e abrir `http://localhost:8790/index.html`. Para fingir o servidor em teste, `p.route(/\/fs\//, ...)`. Fechar o modal que aparece: `rkModal.hidden=true;innerHTML=''`.
- Artes do dono ficam nas pastas `ferramentas/...` (personagens, portais/npc, aneis, ranqueada_artes, titulos, torre_artes, vfx).

### Publicar (toda versão)
1. Testar.
2. Seção `## vNNN` no fim do `GUIA-CLAUDE.md` (o que mudou + nome do teste).
3. `sed -i 's/A versão atual é a v[0-9]*\./A versão atual é a vNNN./g' COMECE-AQUI.md`
4. `git checkout -- ferramentas/ia/__pycache__` e `git add -A ferramentas www worker GUIA-CLAUDE.md COMECE-AQUI.md` (+ `.github` se mexeu).
5. Commit com `git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit` (+ as linhas de atribuição que o sistema mandar).
6. Push: `for i in 1 2 3 4; do git push -q origin HEAD:main && break; git pull -q --rebase origin main; sleep 15; done`. Se reclamar "repository moved": `git remote set-url origin https://github.com/Denilsonserr/Fui-do-templo-a-PK-2.git`.
- A Cloudflare publica **site + worker** sozinha em ~2–4 min (`wrangler.jsonc`: worker `worker/index.js`, pasta `www`, banco D1 `furia`). **Mexeu no worker? teste no servidor local antes** — erro no worker derruba o jogo de todos.
- `apk.yml` gera o APK leve (não precisa rodar a cada versão).

### Servidor (Cloudflare Worker + D1)
- `worker/index.js` imita a API REST do Firestore: `POST .../documents/torre?documentId=ID` (cria; **409 = já existe** = é assim que funciona "uso único") e `.../documents:runQuery` (UM fieldFilter + orderBy + limit). Nunca apaga nem edita doc.
- **v557: `latestBy:'campo'`** no runQuery = devolve só o doc MAIS NOVO de cada valor desse campo (que tenha o campo do orderBy). Usado nos rankings PVP (`pva`) e Rank Geral (`nome`, campo da temporada `rp2`), porque cada partida cria um doc novo e 2–3 jogadores enchiam o limite.
- Respostas muito grandes dão erro 429 ("too many"): use limit baixo para docs pesados (saves `sv_*` ≤ 60).
- Contas: nome + senha; save `sv_*` (o localStorage inteiro em `d`), id da conta = `sha256('furia|acc|'+nome.toLowerCase().trim()).slice(0,24)`. Rota `/fs/sv-antes?acc=&t=` = último save antes do horário t.
- **O sandbox do Claude NÃO acessa o site.** Para olhar dados reais, dispare workflows do GitHub e leia o log:
  `gh api -X POST repos/Denilsonserr/Fui-do-templo-a-PK-2/actions/workflows/ARQUIVO.yml/dispatches -f ref=main -f 'inputs[x]=...'` → depois `gh api .../actions/runs/ID/logs` (zip).
  - `consulta.yml` (query livre: input `q` = structuredQuery JSON, `campos`) — o mais útil.
  - `uso.yml` (uso do servidor + erros do jogo), `status.yml`, `conta.yml` (save/anéis de uma conta), `aneishist.yml`, `mercado.yml`, `suspeita.yml`/`suspeita2.yml` (gemas/itens suspeitos, compras grandes com o nome do comprador), `torretop.yml`, `pvtop.yml`, `leilao.yml`.

### O que existe no jogo hoje (v610)
- **Personagens (19):** míticos Sung, Yuta, Naruto, Madara, Garou; ilimitado/secreto **Shaka** (nível 70); lendários Goku, Aokiji, Zoro, Broly, Vegeta, Gogeta, Gojo, Luffy, Rengoku; épicos Aylla, Zedry, Zaykon, Qingqing (`RK_MIT/RK_LEG/RK_EPI`, `LVMAX`: mítico 50, lendário 40, épico 30).
- **Modos:** Ranqueada (Boss; temporada 2, XP em `rp2`), **PVP Ranqueado** (estrelas, divisões, campeões com título e bônus, `pvStep`), Torre (ranking de TEMPO; o tempo não conta travadinha/câmera lenta/animações), Caça, Desafio, **Portais** (E…S; dungeon de 10 salas: Urso na 5, Igris na 10; **portal S = RAID DAS FORMIGAS** com chefe **BERU** que se adapta à força do jogador), **Torneio do Mais Forte** (Sung imortal no lugar do boss do Yuta, 3 min, quarta 19h → sábado), Gacha, Passe de Batalha, Mercado Negro, Leilão.
- **Sung:** Sistema do Jogador (níveis, atributos, missões), sombras **Urso (C), Igris (A), Beru (S — a mais forte, 1% no Beru)**.
- **Anéis da alma:** cores branco→amarelo→roxo→preto→vermelho→**dourado** (c=5, notas até **SP**, passivas esq/cmb/vamp/fur) → **DIVINO** (c=6, só do ADM, status ∞). Soma com retorno decrescente na luta (`anDR`); velocidade com teto (`SPDCAP`). Anel dourado SP não vende no mercado.
- **Passivas (Encantamento):** joias negras (giros), raridades até **Divina** e **Primordial** (a mais forte: ORIGEM DE TUDO); Joia Divina/Primordial garantida só por código.
- **Mercado Negro (v546):** vender = anúncio; **comprar = PEDIDO que o ADM aprova** (botão ✅ APROVAR só para o ADM, confere se o comprador voltou o save); **10% de toda venda vai para o ADM**; item comprado nunca é descartado com a mochila cheia.
- **Anti-trapaça:** anti-volta-de-save (`act_*`, `actCheck`, punição com multa e bloqueio do mercado); punição do van hohenheim (v545).
- **Rankings (tela nova v519):** Rank Geral (XP), Mais Rico, Maior Status, Dano no Broly, Mais Rápido, 1ª Fase; ADM aparece como "#0 · RANK ∞ · fora da disputa".
- **Códigos:** `TWCUP[hash]={nm, ...}` + campos tratados em wrappers de `twCupom`: `uni:1` (1 pessoa no jogo todo), `acc:1`/`ev:1` (1 por conta/aparelho), `rgsp:[[stat,stat2,passiva],...]` (anel dourado SP), `rg`, `rgq` (anel PEGADINHA: aparece, não funciona), `rgbox`, `jn` (joias negras), `jpx`/`jdx` (Joia Primordial/Divina), `jpo/jpq` (Origem de Tudo real/pegadinha), `pdq` (pedras das almas), `bp:2,s2:1,x2:1` (passe 2X), `pbo` (evento pessoal), `gem`, `chb` (caixa de personagem). Exemplos e testes: `ferramentas/testes/tcod_*.js`.
- **Eventos:** `RKEVX` = lista `[início, fim, multXP, nome, {gem,luck,drop,anel}, tag]` (o primeiro que vale agora ganha). Bônus pessoais entram como entrada com tag no começo da lista (`pb`, `vn`, `vn4`). Drops do jogo inteiro ×0,6 (`rkDropK`, v556); evento 2x até 22/11 23:59.
- **ADM (Denilson ADM):** todos os personagens no nível máximo, 10 anéis divinos, XP ∞, **imortal** (personagem e sombra), entra em tudo, aprova o mercado.
- **Celular fraco (v558):** gráfico escolhido pelo aparelho e desce sozinho se travar.

---

## PARTE 3 — COMO CRIAR UM PERSONAGEM NOVO (próximo: GOKU INSTINTO SUPERIOR)

### O que pedir ao dono (não começar antes de "mandei tudo")
1. **Folhas de poses** (PNG, fundo liso branco ou verde, cada folha = 1 animação em fila): parado, andar, correr/dash, soco (combo), chute, especial/ki, tomando golpe, caindo/nocaute, defesa, pulo. Quanto mais quadros, melhor.
2. **Rosto quadrado** (retrato), **corpo inteiro** (VS/perfil/gacha) e, se tiver, **botões/HUD**.
3. **Vídeos** (sem som): transformação e ultimate.
4. **Regras dele escritas do jeito dele**: raridade, nível máximo, velocidade, dano, passivas, transformação, ultimate, como se pega (gacha/código/evento), preço/chance/garantia.
5. Guardar as regras em `ferramentas/personagens/<nome>/REGRAS.md` (modelo: `ferramentas/personagens/shaka/REGRAS.md`).

### Caminho que funcionou (Sung v421–v470, Yuta, Shaka)
1. Pasta `ferramentas/personagens/<nome>/` com `poses/01..NN` (folhas do dono), `recebido/`, `videos/`.
2. **Recorte:** script `seg_<sid>.py` (tira o fundo, separa os quadros de cada folha → `work/cut`). Modelos: `ferramentas/personagens/sung/seg_sj.py`, `shaka/seg_sk.py`, `ferramentas/portais/npc/cortar.py` (para monstros/sombras, `cortar_v555.py` do Beru).
3. **Build:** `build_<sid>.py` (escala, nitidez, salva webp em `www/a/` com nome = hash, gera `build/<sid>.json` com quadros `{s,w,h,ax,ay}` por animação) e `imgs_<sid>.py` (retrato, ícone, corpo inteiro → `build/imgs.json`).
4. **Patch** `ferramentas/web/extra/9z_<nome>.py` (modelo **`9y_sung.py`**): cria a entrada em `CH` (`{sid,id,name,cn,energy,...}`), `SPRH.<sid>` (quadros), `PTH`/`FULLIMG`/`loadImg` (imagens), `ROS` (descrição na tela de VS), listas de sids de alta resolução, e liga a lógica de golpes.
5. **Lógica nova** (passivas, transformação, ultimate, aura) no fim do `rk.js`, com wrappers (`startTransform`, `updTrans`, `applyHit`, `update`, `drawSprite`...).
6. Primeiro só no **MODO TESTE do ADM** (painel 🧪, lista `Object.keys(CH)`), depois entra no gacha/listas (`RK_MIT/RK_LEG/...`, `rkRar`, `LVMAX`).
7. Teste Playwright (`tsung_v421.js` é um bom modelo) + prints para o dono aprovar antes de liberar.

### GOKU INSTINTO SUPERIOR — o que já dá para adiantar
- Já existe o **Goku normal**: `CH.goku` (sid `gk`, lendário, nível 40). Decidir com o dono:
  - **(a) personagem NOVO separado** (ex.: id `goku_ui`, sid novo `gu`, provavelmente MÍTICO e no gacha/evento), ou
  - **(b) transformação do Goku** que já existe (forma "Instinto Superior").
  Pelo jeito que ele falou ("o próximo personagem"), o mais provável é **(a)**, mas confirme.
- Ideia natural para o Instinto Superior (só sugerir; **as regras quem decide é o dono**): esquiva automática (o Shaka já tem esquiva na forma de olhos abertos — dá para reaproveitar), muito rápido, aura prateada/azul-clara, contra-ataque.
- Não usar arte de jogo comercial. As artes vêm do dono.
- Antes de começar: abra `GUIA-CLAUDE.md` nas seções do **Sung (v421–v470)** e do **Shaka (v280+)**, que são os exemplos mais completos de personagem com transformação, ultimate em vídeo, gacha, itens e títulos.
