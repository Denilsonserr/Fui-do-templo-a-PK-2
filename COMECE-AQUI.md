# FÚRIA DO TEMPLO — GUIA DE PASSAGEM PARA A CONTA NOVA

Versão do jogo neste momento: **v263** (09/11/2026).
Este arquivo tem duas partes: a **Parte 1** é para o dono (Denilson) e a **Parte 2** é para o Claude da conta nova.

---

## PARTE 1 — PARA O DONO: COMO LIGAR TUDO NA CONTA NOVA

1. Entre na conta nova do Claude e abra o **Claude Code** (claude.ai/code, ou no app, na parte de código).
2. Conecte o **GitHub** nessa conta (ele pede para entrar no GitHub e autorizar).
   - Dê acesso ao repositório **Denilsonserr/Fui-do-templo-a-PK-2**.
3. Comece uma conversa nova escolhendo esse repositório e mande este arquivo (ou só a mensagem abaixo):

   > Continua o meu jogo Fúria do Templo. Repositório: Denilsonserr/Fui-do-templo-a-PK-2. Lê primeiro os arquivos COMECE-AQUI.md e GUIA-CLAUDE.md inteiros e segue as regras deles. A versão atual é a v263.

4. Depois é só pedir as coisas do mesmo jeito de sempre. Cada versão nova gera sozinha:
   - o **site**: https://denilsonserr.github.io/Fui-do-templo-a-PK-2/?v=NÚMERO
   - o **APK**: na página do GitHub → Releases → `ultima-versao` (ou na aba Actions).
5. **Códigos secretos:** não ficam escritos no GitHub, por segurança. Guarde a sua lista. Se o Claude novo precisar de um, mande na conversa.
6. Se o site demorar para mudar: às vezes o GitHub fica uns 10 minutos "publicando". Espere e abra o link com outro número no final (`?v=2341`, `?v=2342`...).
7. **Personagem novo de anime (como você faz):**
   1. Avise o Claude: "vou mandar um personagem novo: NOME".
   2. Mande tudo, em quantas mensagens precisar:
      - **Folhas de poses (PNG):** forma normal e forma transformada. Parado, andando, socos, chutes, pulando, defesa, tomando golpe, caído, vitória, carregando ki. Fundo liso (branco, cinza ou preto) ajuda no recorte.
      - **Vídeos (MP4):** transformação (até ~3 s), ultimate/super (até ~5 s) e especial, se tiver. Eles entram SEM som.
      - **Imagem do rosto** (retrato do quadradinho) e **corpo inteiro** (tela VS).
      - **Arte dos botões e HUD** do personagem, se quiser.
      - **As regras dele, escritas do seu jeito:** como joga, poderes, velocidade, força, combos, o que a transformação muda, o que o especial e o ultimate fazem. Ex.: "rápido, contra-ataque a cada 3 golpes, ultimate congela 3 s".
   3. Diga **"mandei tudo, pode fazer"**. O Claude só começa depois disso e não inventa poder que você não mandou.
   4. Se faltar alguma pose, ele usa uma parecida e avisa quais foram reaproveitadas.
   5. Depois é só pedir ajustes ("mais rápido", "perna bugada", "aura mais forte"...).
8. **Servidor online (Firebase, projeto `furia-do-templo`):** fica na sua conta Google com a foto do casal (não na conta "Tang sal").
   - O plano é o grátis: 50 mil leituras por dia.
   - Se estourar, o ranking e o chat param até as **5h da manhã**; o jogo e as vitórias continuam funcionando.
   - Para não ter limite: ative o **plano Blaze** em console.cloud.google.com/billing/create. Em 08/11 o Google deu o erro OR_BACR2_59; tente pelo computador ou com outro cartão.

---

## PARTE 2 — PARA O CLAUDE DA CONTA NOVA

### Quem é o dono e como responder
- Denilson fala português do Brasil, simples, muitas vezes por voz e com erros de digitação ("rark" = rank/ranqueado, "porção" = poção, "torrer" = torre).
- **Responda em português simples, curto, sem termos técnicos.** Ao fim de cada versão diga:
  1. o que mudou;
  2. onde pegar (link `?v=` + "APK no GitHub");
  3. o que foi reaproveitado e o que foi inventado.
- **Não mande o arquivo APK no chat sem ele pedir.**
- **Atualize o `GUIA-CLAUDE.md` a cada versão** (uma seção `## vNNN — ...` no fim) e a versão no topo deste arquivo.
- Teste antes de publicar e só diga que está pronto depois de conferir que o GitHub Actions terminou com sucesso (`gh run list -L 3`).
- Faça as mudanças direto. Só pergunte quando a decisão for dele (prêmio de evento, valores de dinheiro).
- Quando ele mandar ARTE nova (prints de telas desenhadas), a arte vira o fundo da tela e os botões são áreas clicáveis por cima, em % da imagem.

### Regras fixas do dono (não quebrar)
- Vídeos de super ataque e de transformação **sem som**.
- **Não copiar arte de jogos comerciais.** Os efeitos são feitos em código.
- **Não clonar vozes reais. Não abrir a pasta pirata do FighterZ.**
- Personagem novo: só montar quando ele disser que mandou TUDO. Não inventar poderes.
- Nomes com "adm" são proibidos; só o código ADM dá o nome "Denilson ADM" e o título ADM.
- **Códigos secretos: nunca escrever o texto do código no repositório**, só o hash (`twHash`, em `TWCUP` no `patch_v213.py`). O texto vai só para o dono, na conversa.
- Moeda vermelha 🔴 = "dinheiro de verdade" para ele: dar pouco.

### Onde está cada coisa
- Jogo inteiro: `www/index.html` (um arquivo só); artes, sons e vídeos em `www/a/`. Artes originais do dono: `ferramentas/ranqueada_artes/`.
- **O `www/index.html` é GERADO. Nunca edite à mão.** Monte assim (já confere o JavaScript no fim):
  ```
  bash ferramentas/web/montar.sh
  ```
  (faz `cp ferramentas/web/base_v212.html www/index.html` + `python3 ferramentas/web/patch_v213.py www/index.html` + os patches de `ferramentas/web/extra/*.py`, em ordem)
  - `base_v212.html` = jogo até a v212.
  - `patch_v213.py` injeta `ferramentas/web/ranqueada/rk.js` + `rk.css` + artes (`ranqueada/rk_assets.json` → `RQA`), e todas as trocas `rep(antigo, novo)` da v213 até agora. Cada `rep` confere se achou o texto: se falhar, o texto mudou.
  - Mudanças novas: edite `rk.js`/`rk.css` (o código do Ranqueado, Torre nova, conta, códigos, mochila, cache) ou acrescente `rep(...)` no fim do `patch_v213.py` (antes do `open(P,'w').write(s)`).
  - Funções do jogo base podem ser trocadas de dentro do `rk.js` só reatribuindo (ex.: `twBag=function(){...}`, `twFetchT=...`).
- Conferir o JavaScript:
  ```
  node -e "const s=require('fs').readFileSync('www/index.html','utf8');const m=s.match(/<script>[\s\S]*?<\/script>/);new Function(m[0].slice(8,-9));console.log('ok')"
  ```
- Testes (Playwright/Chromium) em `ferramentas/testes/`, rodar com `node ferramentas/testes/NOME.js` (1–4 min cada; o servidor é simulado com `page.route`). Os mais úteis:
  - `ttorre_rk.js`, `ttorre_dif.js`: Torre nova.
  - `tranqueado.js`, `trb.js`, `trecorde.js`: Boss, XP e recordes.
  - `tequipar.js`, `tunico.js`: mochila e itens únicos.
  - `tticket.js`, `tmitico.js`, `tmitico2.js`, `tsemrep.js`: gacha.
  - `tconta.js`: conta com senha.
  - `tchat2.js`, `tcache.js`: servidor (conta leituras).
  - `tcod_v233.js`, `tsorte3.js`, `tmil.js`, `tcodigo_rk.js`, `tdiamante.js`: códigos.
- O histórico completo, versão por versão, está em `GUIA-CLAUDE.md`.

### Personagens de anime: como fazer um novo (parte técnica)
- Roster atual (`ALLC`): aylla, zedry, zaykon, qingqing (originais do dono) + goku, aokiji, zoro, broly, vegeta, gogeta, madara, gojo, luffy, rengoku, naruto, garou, yuta (v239, modelo mais novo: `ferramentas/personagens/yuta/`).
- O dono manda as artes e os vídeos; o Claude recorta, melhora com IA e programa. **Não desenhe nem busque arte desses personagens por conta própria.** É jogo de uso pessoal do dono.
- **Leia no `GUIA-CLAUDE.md`:**
  - "Como o dono gosta de trabalhar" e "Estrutura do código";
  - "Como adicionar um personagem novo (passo a passo)";
  - o último personagem feito, **"v193 — NOVO PERSONAGEM: GAROU"** (o modelo mais completo e atual);
  - Naruto (v165), Rengoku (v156) e Zoro novo (v179).
- **Fluxo resumido:**
  1. **Recorte:** `seg_*.py`. Tira o fundo e separa as poses; ver `ferramentas/personagens/garou/seg_gr.py`.
  2. **Montagem:** `build_*.py`. Mapeia animação → poses, normaliza a escala pela pose de guarda, ancora no pé e melhora com Real-ESRGAN (`ferramentas/ia/esr.py`, ~20 s por pose). Gera webp + JSON.
  3. **Vídeos:** `ffmpeg -i v.mp4 -an -vf "fps=12,scale=800:450" -c:v libwebp -quality 76 f%03d.webp`. Sem som, porque o WebView do APK não toca `<video>`.
  4. **Código:** um bloco JS próprio (modelo `garou/gr.js`) com CH, sid normal e transformado, `SPRH`, golpes (`MOVES` com prefixo próprio no sistema profissional do Vegeta/Gogeta: startup/ativo/recuperação, hitbox pelo desenho), transformação (`updXXT`), especial e ultimate (`G.ws`), aura, HUD/botões, ALLC/ROS, retrato/`fullSrc`, pré-carga dos vídeos.
  5. **Injetar:** coloque o patch do personagem em `ferramentas/web/extra/NN_nome.py` (modelo `garou/patch_gr.py`) e monte com `bash ferramentas/web/montar.sh`.
     - **ATENÇÃO:** os personagens antigos já estão dentro de `base_v212.html`. Os scripts antigos usam caminhos `/home/claude/...` da conta antiga: copie o material novo para uma pasta e ajuste os caminhos.
  6. **Ranqueado:** decidir com o dono a raridade no gacha (`RK_EPI`, `RK_LEG`, `RK_MIT` no `rk.js`; mítico tem vídeo da ultimate em `RKUV`). Se for transformação lendária, pôr em `RKTV`.
  7. **Testar** com Playwright (pose a pose, os dois lados, combos, transformação, ultimate) e publicar.
- O dono gosta de movimento **fluido e com qualidade máxima** (referência de gameplay: Dragon Ball FighterZ — dash, combos que emendam, lançar e perseguir), impactos discretos e efeitos próprios em código.

### Publicar
- `git push origin HEAD:main` → GitHub Actions: `site.yml` (Pages) e `apk.yml` (APK na release `ultima-versao`).
- Conferir com `gh run list -L 3` até `completed success`. O deploy do Pages às vezes demora ~10 min.
- Use `gh api` (REST); o GraphQL é bloqueado pelo proxy.
- Os commits terminam com as linhas de atribuição da sessão que o sistema indicar.

### Servidor online (Firestore)
- Projeto `furia-do-templo`, coleção única **`torre`**, acesso por REST (sem SDK).
- **Regras:**
  - qualquer um lê e cria; ninguém edita nem apaga;
  - para criar, o documento precisa de `nome` (texto ≤ 16), `andar` (inteiro ≤ 7) e `tempo` (inteiro).
  - Uso único = `documentId` fixo (409 = já usado).
- **Tipos de documento:**
  - recordes da Torre: `pontos`;
  - nomes: `claim`/`nomeL`;
  - semana e evento: `sem`, `ev`;
  - chat da Torre: `chat` + `ch` por hora;
  - chat global: `gchat` + `gh` por hora;
  - online: `on`, em blocos de 5 min;
  - ranking do ranqueado: `rk` (+ `rkr`, `tw`, `t1w` nas vitórias);
  - códigos: `cupom`;
  - saves de conta: `sv`.
- **Limite grátis: 50 mil leituras/dia** (zera às 5h de Brasília). Em 08/11 estourou.
  - Desde a v232/v234 tudo passa por cache (`twFetchT` no `rk.js`: `RKQC`/`qc_*`).
  - Rankings agora são consultas ordenadas pequenas (`rkOQ`), e os chats leem só as últimas 6 horas.
  - **Não crie consultas que leiam a coleção inteira.**
- O sandbox não acessa o Firestore. Use os workflows e leia os logs:
  - `status.yml`: testa leitura e escrita (429 = limite).
  - `busca.yml`: input `nome`; `*` = tudo.
  - `consulta.yml`: campo e valor.
  - `lista.yml`: quem jogou a Torre.
  - `teste_conta.yml`.

  Disparar: `gh api -X POST repos/Denilsonserr/Fui-do-templo-a-PK-2/actions/workflows/ARQUIVO.yml/dispatches -f ref=main`. Ler: `gh api repos/Denilsonserr/Fui-do-templo-a-PK-2/actions/runs/ID/logs > l.zip` e `unzip`.

### O que existe hoje (v239)
- **Menu principal (arte do dono):**
  - Batalha;
  - História 🔒;
  - Modo Ranqueado;
  - Online 🔒;
  - Perfil (aba PERFIL e aba HISTÓRICO, v235);
  - Configuração;
  - botão 👤 CONTA.
- **Modo Ranqueado:**
  - **Modo Boss (Broly):** 8 níveis pelo rank, mais fácil no começo; bônus de XP por recorde do servidor, recorde próprio, combo e dano.
  - **Torre Ranqueada:** tela nova, mesma rank do Boss, dá mais XP, bônus de rank, inimigos mais fortes nos ranks altos (`RKTD`).
  - **Desafio do Tempo:** 🔒.
  - **Gacha:**
    - personagem nunca repetido;
    - míticos (Naruto, Madara, Garou) com garantia em 110 giros;
    - lendário garantido em 30 giros;
    - Lâmina Negra garantida em 160 giros;
    - tickets também valem no giro de 10.
  - **Outros:** loja, biblioteca, ranking, recompensas dos elos, 35 conquistas, chat global, 🎒 equipar, 🎵 música, 🎟️ código.
- **Ranks:**
  - Madeira 0 XP, Bronze 1000, Prata 2500, Ouro 5000, Diamante 9000, Lendário 15000, Dragão Lendário 23000, Divindade 35000.
  - Eventos de XP em `RKEVX` (hora de Brasília em UTC).
- **Mochila nova** (Torre e Ranqueado): 40 espaços, cada um com até 99 itens iguais. Dá para equipar, vender, beber e descartar. Itens ÚNICOS brilham e não podem ser vendidos.
- **Conta:** nome + senha, saves assinados (`acOpen`), salva a cada 5 minutos.
- **Itens únicos:** espadas dos campeões do torneio de 08/11 (Vini_junior10 e Denilson ADM) e o Peitoral Lendário do código.

### Pendências
- O dono não respondeu se dá o 2º lugar do evento de 08/11 ao ZEUS_DARKBR (a corrida dele terminou às 15:45:52, fora do horário).
- O plano Blaze não foi ativado (erro do Google OR_BACR2_59).
- Ainda não existem: Desafio do Tempo, História, Online. Esperar o dono mandar as artes e as regras.
- Perfil: faltam os EMBLEMAS animados da foto (o dono vai mandar) e as abas vazias da arte.
- O dono vai mandar mais ANÉIS (o espaço do anel já existe: `t:'anel'`).
