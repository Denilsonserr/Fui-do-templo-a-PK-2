# FÚRIA DO TEMPLO — GUIA DE PASSAGEM PARA OUTRA CONTA DO CLAUDE

A versão atual é a v460.
Versão do jogo neste momento: **v460** (11/11/2026).
Este arquivo tem duas partes: a **Parte 1** é para o dono (Denilson) e a **Parte 2** é para o Claude da outra conta.

---

## PARTE 1 — PARA O DONO: COMO USAR EM OUTRA CONTA

1. Entre na outra conta do Claude e abra o **Claude Code** (claude.ai/code ou a parte de código do app).
2. Conecte o **GitHub** nessa conta e dê acesso ao repositório **Denilsonserr/Fui-do-templo-a-PK-2**.
3. Comece uma conversa nova com esse repositório e mande este arquivo, ou só esta mensagem:

   > Continua o meu jogo Fúria do Templo. Repositório: Denilsonserr/Fui-do-templo-a-PK-2. Lê primeiro os arquivos COMECE-AQUI.md e GUIA-CLAUDE.md inteiros e segue as regras deles. A versão atual é a v460.

4. Depois é só pedir as coisas do mesmo jeito de sempre.
5. **Onde fica o jogo:**
   - **Site (o principal):** https://fui-do-templo-a-pk-2.denilsinend.workers.dev — na sua conta da **Cloudflare**. Atualiza sozinho uns 2 minutos depois de cada versão.
   - **APK leve:** GitHub → Releases → `ultima-versao`. Ele abre o site da Cloudflare, então **nunca precisa reinstalar** para atualizar o jogo. Quando sai versão nova, aparece no jogo o botão **"🔄 ATUALIZAÇÃO NOVA"**.
   - GitHub Pages (antigo, lento): https://denilsonserr.github.io/Fui-do-templo-a-PK-2/
6. **Servidor do jogo (contas, ranking, chat, códigos):** desde 10/11 é o **banco D1 "furia" da Cloudflare** (grátis, 5 milhões de leituras por dia). O Firebase antigo não é mais usado.
7. **Códigos secretos:** o texto dos códigos **não fica no GitHub**. Guarde a sua lista. Se o Claude novo precisar de um código antigo, mande na conversa.
8. **Personagem novo:**
   1. Avise: "vou mandar um personagem novo: NOME".
   2. Mande tudo: folhas de poses (PNG, fundo liso), vídeos (transformação e ultimate, entram sem som), rosto, corpo inteiro, botões/HUD e **as regras dele escritas do seu jeito**.
   3. Diga **"mandei tudo, pode fazer"**. O Claude só começa aí e não inventa poder.

---

## PARTE 2 — PARA O CLAUDE DA OUTRA CONTA

### Quem é o dono e como responder
- Denilson fala português do Brasil simples, muitas vezes por voz, com erros de digitação ("rark" = rank/ranqueada, "boys"/"boss", "porção" = poção, "cluade" = Claude).
- **Responda em português simples e curto, sem termos técnicos.** No fim de cada versão diga o que mudou e termine com:
  - `Site novo: https://fui-do-templo-a-pk-2.denilsinend.workers.dev`
  - `APK no GitHub: Releases → ultima-versao`
- **Toda versão:** testar → seção `## vNNN` no fim do `GUIA-CLAUDE.md` → trocar a versão no topo deste arquivo (`sed 's/\*\*vOLD\*\*/**vNEW**/; s/A versão atual é a vOLD\./A versão atual é a vNEW./'`) → commit → push.
- Faça direto; só pergunte quando a decisão for dele (prêmios, valores). Mostre prints quando mudar algo visual.
- **Não mande o APK no chat sem ele pedir.**

### Regras fixas do dono
- Vídeos de super e transformação **sem som** (exceção: vídeo do giro do Shaka no gacha tem som).
- **Não copiar arte de jogos comerciais. Não clonar vozes reais. Não abrir a pasta pirata do FighterZ.** Vídeo de referência que ele mandar = só a ideia; o efeito é feito em código.
- Personagem novo só quando ele mandar TUDO. Não inventar poderes.
- Nomes com "adm" são proibidos; só o código ADM dá "Denilson ADM" e o título ADM.
- **Código secreto: nunca escrever o texto no repositório**, só o hash `twHash` (FNV-1a base36) em `TWCUP`. O texto vai só para o dono, na conversa.
- Moeda vermelha 🔴 = dinheiro de verdade para ele: dar pouco.
- Jogo privado para amigos (música de artista famoso pode, mas sai se lançar).
- Recortes sempre conferidos (sem borda branca, sem buraco). Não baixar a qualidade das artes para diminuir tamanho. Se uma imagem não vai ficar boa, não usa.
- Bots (v313/v314): 15 jogadores falsos nos rankings, a pedido dele e dos amigos; desligar com `BOTON=false` quando ele mandar tirar.

### Onde está cada coisa
- Jogo inteiro: `www/index.html` (um arquivo); artes/sons/vídeos em `www/a/`.
- **O `www/index.html` é GERADO. Nunca edite à mão.** Monte com:
  ```
  bash ferramentas/web/montar.sh
  ```
  Ordem: `base_v212.html` → `patch_v213.py` (injeta `ferramentas/web/ranqueada/rk.js` + `rk.css` + `rk_assets.json` como `RQA`) → `ferramentas/web/extra/*.py` em ordem alfabética (personagens novos, Shaka `9e_v280`, zoom `9h_v290`, travamento `9i_v293`, padrão leve/turbo `9j_v295`, aviso de atualização `9k_v296`, teclado `9l_v305`, servidor novo `9m_v309`). No fim confere o JavaScript e grava `www/versao.txt`.
- Quase tudo novo vai no fim do `rk.js` (mesmo escopo do script base: troque funções com `{const _x=fn;fn=function(){...}}`; `const` do base não dá para trocar).
- Use `rep(antigo,novo)` com assert de contagem nos patches.
- Testes Playwright em `ferramentas/testes/` (`node NOME.js`). Use `__dbg.G`. Para testes com servidor, rode antes `node ferramentas/servidor/local.mjs 8790` e abra `http://localhost:8790/index.html`. Os mais novos: `tfs_v309` (servidor), `tbot_v314`, `tcev_v315`, `tanel_v318`, `tcaca_v295`, `tbau_v293`, `tcod_v294`, `trec_v298`.

### Publicar
- `git push` (a remota mostra "This repository moved", é normal).
- Cloudflare publica sozinha em ~2 min (`wrangler.jsonc`: worker `worker/index.js` + pasta `www` + banco D1 `furia`, id `c7962d81-d19e-41b3-bc3b-22e07a16c8ff`).
- `apk.yml` gera o APK leve (`capacitor.config.json` → `server.url` = site da Cloudflare, `webDir` = `apk_www`).
- Use `gh api` (REST); GraphQL e secrets são bloqueados pelo proxy.
- Commits: `git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit` com as linhas de atribuição que o sistema indicar.

### Servidor (Cloudflare Worker + D1)
- `worker/index.js` imita a API REST do Firestore que o jogo usa: `POST /fs/v1/projects/furia-do-templo/databases/(default)/documents/torre[?documentId=ID]` (cria; 409 = ID já existe = "uso único") e `.../documents:runQuery` (fieldFilter + orderBy + limit). Só cria e consulta, nunca apaga.
- Ferramentas: `/fs-admin/count` e `/fs-admin/stats` (jogadores, contas, online, hoje). O workflow `status.yml` testa tudo.
- O sandbox do Claude não acessa a internet do jogo: dispare workflows (`gh api -X POST repos/Denilsonserr/Fui-do-templo-a-PK-2/actions/workflows/ARQUIVO.yml/dispatches -f ref=main`) e leia o log do job.
- **Contas:** nome + senha, saves `sv_*` assinados com HMAC da senha (o jogo inteiro do aparelho vai em `d`). Senha esquecida → código de uso único com `rec:'<nome>'` (v298). Conta que só existe no Firebase antigo é buscada lá no ENTRAR (v312).
- **Pendente:** importar do Firebase antigo (contas, códigos usados, títulos, perfis, mercado e o RANK de cada conta) com `importar.yml` — só funciona depois das 05:00 de Brasília (limite do Firebase) e o worker aceita importação só até 11/11/2026 15:00.

### O que existe hoje (v319)
- **Menu:** Batalha Aventura (= Modos de Jogo), Batalha Treino, História 🔒, Configuração, 👤 Conta.
- **Modos de Jogo:** Modo Boss (Broly / Yuta do evento), Torre, **Caçador** (Lobo Negro, 10 níveis), Gacha (padrão, Yuta, **Shaka ilimitado**), Passivas (Joias Negras), Mercado Negro, Abas de Evento, Passe de Batalha, Ranking, Recompensas, Conquistas, Biblioteca (personagens, **anéis**, equipamentos, itens, coleções), Perfil (perfil + histórico, todo mundo vê).
- **Ranks:** Madeira 0 → Bronze 1000 → Prata 2500 → Ouro 5000 → Diamante 9000 → Lendário 15000 → Dragão Lendário 23000 → Divindade 35000 → Divindade Suprema 50000 → Divindade Celestial 70000 → Deus Celestial 100000.
- **Caça:** cada nível vencido = baú com anel 100% (anel por cor/nota: branco, amarelo, roxo, preto, vermelho; notas E…SSS) + loot (gemas até 500 por caçada, pedras das almas, set do lobo); SAIR E GUARDAR depois de cada nível; ranking da Caça (5 abas) e títulos da Caça; poções valem.
- **Anéis da alma:** 8 espaços por personagem (1 a cada 10 níveis); aparecem **no chão, um dentro do outro, em volta do personagem em pé** (desenhados em SVG, o mais raro por fora) em todas as telas e no perfil público.
- **Shaka:** personagem secreto (gacha ilimitado), itens próprios (Elmo, Armadura, Luvas, Botas, Rosário) ~40–50% mais fortes que os do Yuta, títulos Nº1–10.
- **Eventos:** `RKEVX` (XP/gemas/sorte/drop por horário), evento ao vivo da Caça `CEV` (v315), torneio da Torre, passe.
- **Proteções:** mochila cheia não apaga item secreto/único; item secreto não vende; luta não trava (loop com try/catch) e manda erro para o servidor (`er_*`); letras de luta não roubam o teclado das caixas de texto.

### Pendências
- Rodar `importar.yml` depois das 05:00 de 11/11 e contar para o dono quantas contas e ranks voltaram.
- O dono pode mandar: mais bestas (3 antes de novos modos), regras do modo Soul Land, mais personagens.
- O histórico completo, versão por versão, está em `GUIA-CLAUDE.md`.

## v461 — Sung pronto pro lançamento
- Forma: um pouco abaixo do Shaka (vel 1.78, dano ×.97, dano recebido ×1.03); golpes ~2.3× mais rápidos; espada/brilho ROXOS (sjPurp troca só os pixels azuis) + raios roxos.
- Passivas: 1º golpe sofrido bloqueado (pose espada no chão); a cada 3 acertos teleporta pra trás + TAPA DO MONARCA; ≤50% vida = sobrevivência (+20% dano/vel); <20% = modo sangue (+10% vida, 1×/round).
- Sistema até nv 100 (SJMX); anéis do Sung = min(7, nv/10).
- TANK mais agressivo (alcance 330, defende ×.55, contra-ataca). Sombras +25% dano e +30% velocidade.
- Itens do Monarca: valores das peças do Shaka; no Sung +50% (set completo +60%), nos outros 50%. Sombra ganha METADE do bônus (25%/30% dos valores) × nível da sombra (nv1 30% … máx 100%). Ícones novos com rachaduras vermelhas (personagens/sung/itens/rachaduras.py) + brilho vermelho pulsando.
- Testes: tsung_passivas_v461.js, tsung_itens_v461.js.

## v462 — Título MONARCA Nº1–10 (10 primeiros a pegar o Sung)
- Servidor: torre/sjtit_N (create-only, 409 = já tem dono). Pendente offline: rk_sjtp. Tenta ao pegar o Sung (rkMegaSJ) e ao abrir o menu.
- Bônus de dano lutando com o Sung (Boss, Torre, Caça, Portais): Nº1 +30, Nº2 +25, Nº3 +20, Nº4 +18 … Nº10 +6 (SJTB). Nº1 e Nº2 acima do Shaka (+20).
- Visual: borda roxa girando, fumaça preta subindo, Nº1 com texto brilhando; janela própria (sjTitWin). Cuidado: classes .a/.b/.c são globais (anel dourado) — usei .sa/.sb/.sc.
- Teste: tsung_titulo_v462.js.

## v463 — Gacha do Sung mais difícil + RESET do Sung
- Sung: 0,03% por giro (sorte não conta) e garantia: número secreto por jogador entre 190 e 210 giros (rk_sjTg). Peças do Monarca: cada uma entre 170 e 300 (rk_sjTgI).
- Reset 1× por jogador (rk_rs463): quem tinha o Sung perde Sung, peças do Monarca (menos a Manopla do passe) e título MONARCA Nº; recebe 80 💎 × giros do banner do Sung no histórico desde 09:00 (mín. 1.600). Aviso ao abrir o menu (rk_rs463m).
- Títulos do servidor recomeçam: documentId agora é torre/sjtit2_N. Histórico passa a guardar o banner (campo b).
- Teste: tsung_reset_v463.js.
- v463c: quem tem CONTA e foi resetado recebe tickets e diamantes de volta como estavam no último save antes das 09:00 (rota nova do worker /fs/sv-antes?acc=&t= ; assinatura conferida no jogo com acFind). Nunca tira: fica o maior valor (agora × save antigo). 1 vez (rk_rs463b). Teste: tsung_reset_save_v463.js (usa o worker de verdade no servidor local).

## v464 — VOLTA NO TEMPO antes do Sung (15/11 10:48)
- 1× por jogador (rk_rs464): tira Sung, peças do Monarca (menos Manopla) e título MONARCA Nº; zera contadores. Títulos no servidor: sjtit3_N.
- Com conta (rk_rs464b, assíncrono): último save antes das 09:00 (/fs/sv-antes) → 💎 e 🎫 = maior entre o save e (agora − devolução antiga rk_rs463g); personagens = os do save.
- Sem conta: +80 💎 por giro do histórico com b='mit'. Aviso "VOLTAMOS NO TEMPO" ao abrir o menu (rk_rs464m).
- Gacha: Sung garantido em 250; escondido: 0 até 100 giros, 0,2% de 101-150, depois sobe +0,093%/giro (mediana ~183, metade entre 168 e 200). Peças: 0,3%, garantia 200.
- SJREL = 11:00 Brasília (14:00Z). Contagem no topo da tela de início (#sjCdT). Teste: tsung_volta_v464.js.

## v465 — Portais às 12:00 + códigos da atualização (textos só com o dono)
- PTREL = 15/11 12:00 Brasília (15:00Z).
- Códigos (1× por aparelho/conta): 26vofv = 1.000–5.000 💎 · 1l10mju = anel rank S PRETO ou VERMELHO · 4brzfl = PASSE PAGO · nupno9 = PASSE 2X (premium + todos os prêmios em dobro, menos a Caixa V2 de Virgem; o.x2 no rk_bp, selo ⚡ PASSE 2X).
- Teste: C1..C4=<códigos> node ferramentas/testes/tcodigos_v465.js.
- v466: MANOPLA DO MONARCA (só passe pago, nível 20): dano 100 · def 70 · crít 70 · vel 60 · status 50; vale 100% em qualquer personagem (Sung +50/60%); brilho dourado.
- v467: quem tem título de ADMINISTRADOR (twIsAdm) entra nos Portais antes das 12:00 (PT0 recua 3h só para ele; às 12:00 volta ao horário de todos). Teste: tportais_adm_v467.js.
- v468: espaço próprio do COLAR ('col'): mochila (RKSLOT, aba 📿) e tela Equipamentos (LBSLE: colar no desenho do colar em cima; espada e poção descem). Colar das Sombras virou t:'col' (migra do espaço do anel). Teste: tcolar_v468.js.
- v469: TIRADO o tingimento roxo dos quadros do Sung (wrapper de drawSprite/spriteImg da v461) — ele apagava os efeitos de energia azul/roxo dos golpes (camada S.b). Raios roxos da forma continuam.
- v470: Sung — combo Dança das Sombras com 11 golpes + finalizador forte (extra/9z_v470.py); combo a cada 2 s; +15% de dano (sem a sombra); DASH teleporta atrás do inimigo e atordoa 0,5 s (recarga 1 s); a passiva do tapa a cada 3 golpes não conta/interrompe mais o combo (era isso que cortava o combo em ~5 golpes). Teste: tsung_v470.js.
- v471: 2º código do PASSE 2X (hash swnp7u, texto só com o dono).

## v472 — Dungeon dos Portais: NPCs do dono, chefes Urso e Igris, sombras
- Artes: ferramentas/portais/npc (recebido/, cortar.py → npc.json; refs.py → retratos). Cada folha é normalizada pela altura do 1º quadro (tabela POSE).
- Motor novo "pn" (pnInit/pnStep/pnDraw, por cima do bs dos lobos): DEMÔNIO DE CHAMA e CEIFADOR, cores roxo/vermelho/branco (PNV), AURA de nível BRANCA<AZUL<PRETA<VERMELHA (PNL: dano/vida/velocidade). Batem sem parar, kb ≤ 2 (não empurram). Até 2 LOBOS SOMBRIOS por sala (pretos, sem combo).
- Morreu → cai PÓ e às vezes 💎 (mais no rank alto). Sala comum SEM baú; baú só no chefe (+ chance de peça do Monarca 0,3% E … 3% S).
- Chefes: sala 5/15/25… URSO DAS SOMBRAS (3 vidas, renasce com a animação de erguer); 1ª vitória com Sung = sombra TANK rank C (rk_urso). Sala 10/20… IGRIS (forte/rápido, não trava apanhando); sombra IGRIS rank A por chance: E .2 · D .5 · C 1 · B 2 · A 3,5 · S 5 %.
- Tela "ERGA-SE!" (pnShWin) com EQUIPAR AGORA. Sung SEM sombra do urso até vencer o Urso (sjSys filtra 'tank' sem rk_urso).
- IGRIS sombra (SJSH.igris, rank A): igsTick/igsDraw — aura do Monarca, combo longo, crítico 35%, teleporta atrás de quem ataca o Sung e derruba, segura especial (metade do dano).
- Testes: tportal_npc_v472.js, tigris_sombra_v472.js.
