# Sistema de NÍVEL dos personagens (Modo Ranqueado) — pedido do dono em 09/11/2026 (ainda não feito)
- Épicos: nível 1 a 30. Lendários: 1 a 40. Míticos: 1 a 50.
- Cada nível: um pouquinho de dano e de crítico (bem pouco).
- A cada 10 níveis é preciso ELEVAR o personagem com um item especial (ganho no ranqueado, nos modos e nas caixas):
  nível 10 = 1 item, 20 = 2, 30 = 3, 40 = 4, 50 = 5.
- A cada elevação (10, 20, 30, 40, 50) o jogador ESCOLHE um bônus para montar a build: +10% dano crítico, ou dano, ou velocidade, ou sorte, ou roubo de vida, ou crítico.
- Para subir de nível: MOEDA DOURADA da Torre (🪙 tw_moedas) + um PÓ novo, ganho no gacha, no ranqueado e em todos os modos.
- O dono vai mandar a arte da tela de editar o personagem.

## Tela nova da Biblioteca → Personagens (`biblioteca_personagem_v239.png`)
- Painel ATRIBUTOS: preencher Dano, Crítico, Velocidade, Sorte e Vel. Ultimate (velocidade da ultimate) do personagem.
- Faixa com "NARUTO" desenhado: apagar o nome da arte e escrever o nome do personagem escolhido.
- Barra embaixo do nome: barra de XP/nível que enche com cor + "Nível N".
- Caixa "Ultimate": texto explicando como funciona a ultimate do personagem.
- Quadradinhos à direita: personagens. Pedestal: personagem em pé.
- O dono ainda vai mandar a tela de EDITAR os níveis.

## Tabela proposta ao dono (esperando aprovação)
- Custo por nível: 1→10 150🪙+10 pó; 10→20 300🪙+20; 20→30 500🪙+35; 30→40 900🪙+60; 40→50 1800🪙+120.
- Pó: Boss vitória 8–15, derrota 2–4; Torre 3–6 por andar; gacha 2–5 por giro; baús.
- Item de elevação: Boss vitória 5%; Torre completa 1; gacha 1%/giro; baús lendário/mítico às vezes.
- Por nível: +0,4% dano, +0,15% crítico. Elevação (escolha): dano crítico +10%, dano +8%, vel +5%, sorte +10%, roubo de vida +4%, crítico +5%.
- Nomes sugeridos: Pó Amaldiçoado, Pedra de Elevação.

## Tela de EDITAR o nível (`editar_nivel_v239.png`)
- Pedestal com o personagem; painel do meio: nome no topo + 5 linhas (dano, crítico, velocidade, sorte, vel. ultimate) com os valores e os bônus somados.
- Embaixo: quadrado do nível atual → quadrado do próximo nível + botão de SUBIR (seta dourada).
- Direita: ÁRVORE DE HABILIDADE, 6 linhas × 4 quadradinhos. Cada quadradinho é uma opção (dano a mais, velocidade de ataque, crítico, sorte...). O jogador toca e escolhe o que o personagem vai ter. Fazer bem legal, com animação ao subir de nível.

## Itens do nível (`itens_nivel_v239.png`, 3 linhas × 5 raridades: comum, rara, épica, lendária, mítica)
- Linha 1 = sacos de PÓ (raridade = quantidade de pó que vem).
- Linha 2 = CRISTAIS (novo): o dono deixou o Claude decidir a função, ligada a upar o personagem.
- Linha 3 = itens de ELEVAÇÃO (mudou: não é mais 1-2-3-4-5 do mesmo item):
  nível 10 = comum (pergaminho), 20 = raro (cubo), 30 = épico (máscara), 40 = lendário (chama azul), 50 = mítico (orbe).
  Drop difícil, cada vez mais raro, COM piedade para não ficar impossível.
