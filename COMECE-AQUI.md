# FÚRIA DO TEMPLO — GUIA DE PASSAGEM PARA OUTRA CONTA DO CLAUDE

A versão atual é a v336.
Versão do jogo neste momento: **v336** (11/11/2026).
Este arquivo tem duas partes: a **Parte 1** é para o dono (Denilson) e a **Parte 2** é para o Claude da outra conta.

---

## PARTE 1 — PARA O DONO: COMO USAR EM OUTRA CONTA

1. Entre na outra conta do Claude e abra o **Claude Code** (claude.ai/code ou a parte de código do app).
2. Conecte o **GitHub** nessa conta e dê acesso ao repositório **Denilsonserr/Fui-do-templo-a-PK-2**.
3. Comece uma conversa nova com esse repositório e mande este arquivo, ou só esta mensagem:

   > Continua o meu jogo Fúria do Templo. Repositório: Denilsonserr/Fui-do-templo-a-PK-2. Lê primeiro os arquivos COMECE-AQUI.md e GUIA-CLAUDE.md inteiros e segue as regras deles. A versão atual é a v336.

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
