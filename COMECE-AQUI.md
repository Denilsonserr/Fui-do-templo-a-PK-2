# FÚRIA DO TEMPLO — GUIA DE PASSAGEM PARA A CONTA NOVA

Versão do jogo neste momento: **v233** (08/11/2026).
Este arquivo tem duas partes: a **Parte 1** é para o dono (Denilson) e a **Parte 2** é para o Claude da conta nova.

---

## PARTE 1 — PARA O DONO: COMO LIGAR TUDO NA CONTA NOVA

1. Entre na conta nova do Claude e abra o **Claude Code** (no site claude.ai/code ou no app, na parte de código).
2. Conecte o **GitHub** nessa conta (ele pede para entrar no GitHub e autorizar).
   - Dê acesso ao repositório **Denilsonserr/Fui-do-templo-a-PK-2**.
3. Comece uma conversa nova escolhendo esse repositório e mande este arquivo (ou só a mensagem abaixo):

   > Continua o meu jogo Fúria do Templo. Repositório: Denilsonserr/Fui-do-templo-a-PK-2. Lê primeiro os arquivos COMECE-AQUI.md e GUIA-CLAUDE.md inteiros e segue as regras deles. A versão atual é a v233.

4. Depois é só pedir as coisas do mesmo jeito de sempre. Cada versão nova gera sozinha:
   - o **site**: https://denilsonserr.github.io/Fui-do-templo-a-PK-2/?v=NÚMERO
   - o **APK**: na página do GitHub → Releases → `ultima-versao` (ou na aba Actions).
5. **Códigos secretos:** não estão escritos no GitHub, por segurança. Guarde a lista com você. Se o Claude novo precisar saber de um, mande na conversa.
6. Se o site demorar para mudar: às vezes o GitHub fica uns 10 minutos "publicando". Espere e abra o link com outro número no final (`?v=2201`, `?v=2202`...).

---

## PARTE 2 — PARA O CLAUDE DA CONTA NOVA

### Quem é o dono e como responder
- Denilson fala português do Brasil, de forma simples (muitas vezes por voz, com erros de digitação). **Responda em português simples, curto, sem termos técnicos.**
- Formato de resposta que ele gosta, ao fim de cada versão:
  1. o que mudou;
  2. onde pegar (link do site com `?v=` + "APK no GitHub");
  3. o que foi reaproveitado e o que foi inventado.
- **Não mande o arquivo APK no chat sem ele pedir.**
- **Atualize o `GUIA-CLAUDE.md` a cada versão** (uma seção `## vNNN — ...` no fim).
- Teste antes de publicar e só diga que está pronto depois de conferir que o GitHub Actions terminou com sucesso.
- Faça as mudanças direto (ele quer o resultado). Só pergunte quando for uma decisão que é dele (ex.: prêmio de evento).

### Regras fixas do dono (não quebrar)
- Vídeos de super ataque e de transformação **sem som**.
- **Não copiar arte de jogos comerciais** (FighterZ etc.). Os efeitos são feitos em código, no mesmo estilo.
- **Não clonar vozes reais.**
- **Não abrir a pasta pirata do FighterZ** se ela aparecer.
- Personagem novo: só montar quando ele disser que mandou TUDO. Não inventar poderes.
- Nomes com "adm" são proibidos (`twBadName`); só o código ADM dá o nome "Denilson ADM" e o título ADM.
- Códigos secretos: **nunca escrever o texto do código no repositório**, só o hash (`twHash`). Ele recebe o texto na conversa.

### Onde está cada coisa
- Jogo inteiro: `www/index.html` (um arquivo só) e artes/sons/vídeos em `www/a/`.
- **O `www/index.html` é GERADO. Não edite à mão.** Monte sempre assim:
  ```
  cp ferramentas/web/base_v212.html www/index.html
  python3 ferramentas/web/patch_v213.py www/index.html
  ```
  - `base_v212.html` = jogo até a v212.
  - `patch_v213.py` injeta o Modo Ranqueado (`ferramentas/web/ranqueada/rk.js` e `rk.css`), as artes (`ranqueada/rk_assets.json`) e todas as mudanças da v213 até a v220 (cada mudança é um `rep(antigo, novo)` que confere se achou o texto).
  - Para mudar ranqueado, conta, códigos, música ou Boss: edite `rk.js`/`rk.css` ou acrescente `rep(...)` no fim do `patch_v213.py`, e monte de novo.
- Conferir se o JavaScript não quebrou:
  ```
  node -e "const s=require('fs').readFileSync('www/index.html','utf8');const m=s.match(/<script>[\s\S]*?<\/script>/);new Function(m[0].slice(8,-9));console.log('ok')"
  ```
- Testes (Playwright, Chromium) em `ferramentas/testes/`. Rodar com `node ferramentas/testes/NOME.js` (cada um leva 1–3 min). Os testes de servidor simulam o Firestore com `page.route`. Os principais:
  - `tranqueado.js`, `trb.js`: luta do Boss, XP e níveis.
  - `tequipar.js`: botão de equipar, poção e música.
  - `trecomp.js`: prêmios dos elos e conquistas.
  - `tconta.js`: conta com nome e senha e a Caixa da Sorte.
  - `tcodigo_rk.js`, `tdiamante.js`, `tcupom.js`, `tcupom_bau.js`: códigos.
- O guia completo e o histórico de tudo estão em `GUIA-CLAUDE.md` (personagens, como montar personagem novo, cenários, Torre, Ranqueado...).

### Publicar
- `git push origin HEAD:main` → o GitHub Actions faz sozinho:
  - `site.yml`: publica o site no GitHub Pages.
  - `apk.yml`: gera o APK na release `ultima-versao`.
- Conferir: `gh run list -L 3` até aparecer `completed success`.
  - Se o push não disparar, faça outro commit.
  - O deploy do Pages às vezes fica ~10 min em andamento; espere.
- Os commits terminam com as linhas de atribuição da sessão (Co-Authored-By / Claude-Session) que o sistema indicar.

### Modo online (servidor)
- Firebase do dono, projeto `furia-do-templo` (grátis), Firestore, coleção única **`torre`**, acessada por REST (sem SDK). A chave da API está no código (é normal).
- **Regras do servidor:**
  - qualquer um lê e cria;
  - ninguém edita nem apaga;
  - para criar, o documento precisa ter `nome` (texto ≤ 16), `andar` (inteiro ≤ 7) e `tempo` (inteiro).
  - Por isso tudo é "criar documento novo", e coisas de uso único usam `documentId` fixo (se já existe, o servidor responde 409 = já usado).
- Tipos de documento, separados por campo:
  - recordes da Torre (`pontos`);
  - registro de nome (`claim`/`nomeL`);
  - semanal (`sem`) e evento (`ev`);
  - chat da Torre (`chat`) e chat global do ranqueado (`gchat`);
  - online (`on`);
  - ranking do ranqueado (`rk`);
  - códigos usados (`cupom`);
  - saves de conta (`sv`).
- **O sandbox do Claude não acessa o Firestore.** Para consultar o servidor de verdade, use os workflows:
  - `consulta.yml` (filtra por campo e valor);
  - `lista.yml` (lista quem jogou a Torre);
  - `teste_conta.yml`.

  Disparar: `gh api -X POST repos/Denilsonserr/Fui-do-templo-a-PK-2/actions/workflows/ARQUIVO.yml/dispatches -f ref=main`, depois ler o resultado com `gh api repos/Denilsonserr/Fui-do-templo-a-PK-2/actions/runs/ID/logs > l.zip` e `unzip`.
  - Use `gh api` REST; o GraphQL é bloqueado pelo proxy.

### O que existe hoje (resumo da v220)
- **Menu Principal:** Batalha, Modo Torre, Modo Ranqueado e Configuração; botão **👤 CONTA** no canto.
- **Modo Torre:** 7 andares, rankings (troféus, tempo, semanal, evento), chat, títulos, mochila (espadas, armaduras, capacetes, botas), poções, moedas, loja, vender itens, baús, código no campo de nome.
- **Modo Ranqueado** (`rk.js`):
  - Modo Boss contra o Broly, com 8 níveis que seguem o rank:
    - Madeira 0 XP, Bronze 1000, Prata 2500, Ouro 5000, Diamante 9000, Lendário 15000, Dragão Lendário 23000, Divindade 35000.
    - Barras por nível, em `RKBOSS[0].ph`: 2→3 no nível 1, até 7→14 no nível 8.
    - O Boss tem passivas nos níveis altos.
  - Gacha com pity, loja de diamantes, biblioteca, ranking, recompensas de elo (`RKRW`, com baús e caixa secreta), 35 conquistas (`RKACH`), chat global, online.
  - Botões: 🎒 EQUIPAR, 🎵 música (aleatória ou escolhida), 🎟️ CÓDIGO, 👤 CONTA.
- **Moedas do ranqueado:**
  - 💎 diamantes (`rk_gem`);
  - 🎫 tickets (`rk_tic`);
  - 🔴 moeda vermelha (`rk_red`), que o dono trata como "dinheiro de verdade": dá pouco de propósito.
- **Conta** (`acOpen` no `rk.js`):
  - nome + senha;
  - salva todas as chaves `tw_*` e `rk_*` em documentos `sv_...`, assinados com uma chave tirada da senha (PBKDF2 + HMAC);
  - para entrar, carrega o save mais novo que tenha assinatura válida.
- **Códigos** (`TWCUP` no `patch_v213.py`, só os hashes):
  - 3 míticos (uso único no jogo inteiro);
  - 2 baús lendários (uso único);
  - Caixa de Diamantes: só para quem jogou a Torre, 1 vez por pessoa, também entregue sozinha ao abrir o ranqueado;
  - Caixa da Sorte: 100–600 aleatório, 1 vez por pessoa.
  - O código ADM fica no campo de nome da Torre.

### Pendências
- Ficou sem resposta do dono: dar o 2º lugar do evento de 08/11 para o ZEUS_DARKBR? (A corrida dele terminou às 15:45:52, depois do horário do evento.) O 1º foi o Vini_junior10 e o 2º o Denilson ADM.
- Lugares bloqueados no Modo Boss (3 bosses "?") e modos "Contra o tempo"/"Desafio" do ranqueado ainda não existem; esperar o dono mandar as artes e as regras.
