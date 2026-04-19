# Resumo da Implementação — Games Improvement (2026-04-18)

Baseado no spec: `docs/superpowers/specs/2026-04-18-games-improvement-design.md`
Plano: `docs/superpowers/plans/2026-04-18-games-improvement.md`

---

## Task 1 — home.blade.php

- [x] 4 botões "Jogar" mudados de `target="_blank"` para `target="game-window"` (linhas 324, 400, 458, 516)
- [x] `rel="noopener noreferrer"` preservado em todos
- [x] Outros links do portfólio não foram alterados

---

## Task 2 — memory-vue

- [x] Título da aba: `Jogo da Memória Tech`
- [x] Header `<h1>`: `🃏 Jogo da Memória Tech`
- [x] Paleta violet: body `#0d0a1a`, header `#1a1230`, accent `#8b5cf6`
- [x] Back-link: `← Voltar para o Portfólio` com comportamento `window.opener`
- [x] Botão Reiniciar movido para inline com stats (`↺ Reiniciar`, estilo compacto com borda violet)
- [x] Layout stats: `⏱ tempo  🃏 N/8 pares  [↺ Reiniciar]`
- [x] Ícone JS: SVG oficial do JavaScript (amarelo com "JS")
- [x] Ícone Node.js: SVG oficial do Node.js
- [x] Card.vue renderiza SVG via `v-html` quando disponível, fallback para emoji
- [x] Grid de cards: 4 colunas → 2 colunas em mobile (≤ 480px) — em `Board.vue`
- [x] Header responsivo em mobile (≤ 480px): padding reduzido, title empilhado
- [x] Build copiado para `public/games/memory-vue/`

---

## Task 3 — termo-react

- [x] Título da aba: `Wordle Tech`
- [x] Header `<h1>`: `🟩 Wordle Tech`
- [x] Paleta verde: body `#071a0d`, header `#0f2a18`, accent `#22c55e`
- [x] Back-link: `← Voltar para o Portfólio` com comportamento `window.opener`
- [x] Lista de palavras expandida de 25 para 40 palavras tech de 5 letras
- [x] Bug `resetGame` corrigido: agora avança para próxima palavra via `wordIndex` em vez de chamar `getDailyWord()` que retornava sempre a mesma
- [x] Overlay fullscreen de fim de jogo criado (`GameOverlay.tsx`):
  - Vitória: fundo verde, "🎉 Você acertou!", palavra revelada, "Em X tentativas", botão "Próxima Palavra"
  - Derrota: fundo vermelho, "😞 Fim de Jogo", palavra revelada, botão "Tentar Novamente"
  - `backdrop-filter: blur` em ambos
- [x] Badges do placar separados: `✓ N vitórias` (verde), `✗ N derrotas` (vermelho), `🔥 N seguidas` (laranja, apenas se streak > 0)
- [x] Badges tech no header com cor verde (era azul)
- [x] Responsividade mobile: teclado virtual e grid de letras menores (≤ 480px) via `index.css`
- [x] Build copiado para `public/games/termo-react/`

---

## Task 4 — runner-vanilla

- [x] Título da aba: `Fuga do Dino`
- [x] Header `<h1>`: `🦖 Fuga do Dino`
- [x] Paleta âmbar: body `#1a1005`, header `#2a1a08`, chão `#3d2510`, accent `#f59e0b`
- [x] Back-link: `← Voltar para o Portfólio` com comportamento `window.opener`
- [x] Velocidade inicial: `1.0x` (exibida no HUD como `Vel: 1.0x`)
- [x] Incremento de velocidade: `+0.5x` a cada 1500 pontos (era +0.5 a cada 500)
- [x] Canvas altura proporcional: `max(width * 0.25, 140px)` — responsivo no resize
- [x] Dinossauro: sprite desenhado no canvas (corpo verde escuro, cabeça, olho branco/preto, 2 pernas animadas em 2 frames de corrida, pernas estendidas no pulo)
- [x] Insetos (5 tipos): besouro, mosquito, barata, grilo, aranha — todos desenhados via canvas com formas geométricas e cores distintas
- [x] 5 tamanhos por tipo: escalas 0.6×, 0.8×, 1.0×, 1.2×, 1.4×
- [x] Último score salvo em `localStorage` com chave `dino_last_score`
- [x] Overlay de fim de jogo exibe: `Score: N | Último: N`
- [x] Texto "GAME OVER" → "Fim de Jogo"
- [x] Build copiado para `public/games/runner-vanilla/`

---

## Task 5 — typing-svelte

- [x] Título da aba: `Defesa Espacial`
- [x] Header `<h1>`: `⌨️ Defesa Espacial`
- [x] Paleta ciano: body `#01101a`, header `#021828`, arena `#011520`, accent `#06b6d4`
- [x] Back-link: `← Voltar para o Portfólio` com comportamento `window.opener`
- [x] 7 aliens SVG com cores distintas (ciano, verde, roxo, laranja, rosa, vermelho, amarelo) — substituiu emoji `👾`
- [x] Cada spawn sorteia tipo aleatório (0–6)
- [x] Mobile input: `<input>` visível na barra do servidor em telas touch/mobile (`@media (pointer: coarse), (max-width: 767px)`)
- [x] Em desktop: comportamento original mantido (teclado físico)
- [x] Comandos embaralhados com Fisher-Yates no início de cada partida (`shuffleCommands()`)
- [x] Índice circular para não repetir sequências
- [x] Velocidade progressiva: `fallSpeed += 0.05` a cada 15 segundos
- [x] Timer de velocidade reseta ao reiniciar
- [x] Vidas: 5 (era 3)
- [x] Reiniciar reseta para 5 vidas
- [x] Texto "GAME OVER" → "Fim de Jogo"
- [x] `arenaHeight` calculado dinamicamente (`window.innerHeight - 120`)
- [x] Aliens spawnam dentro de `window.innerWidth - 200`
- [x] Build copiado para `public/games/typing-svelte/`

---

## Task 6 — Assets Laravel

- [x] `npm run build` executado no projeto raiz
- [x] `public/build/` atualizado com novos assets

---

## O que NÃO foi implementado (itens do spec não realizados)

- [ ] **termo-react — imagem do header**: O spec menciona "verificar qual imagem está incorreta e substituir pelo SVG de grid de quadrados coloridos". O `App.tsx` atual não possui nenhum elemento `<img>` no header, então este item foi pulado por não haver imagem a substituir.

---

## Commits realizados

```
f8f8e5d feat: reusar mesma aba para todos os minijogos
<hash>   feat: paleta violet, ícones JS/Node, stats compactos e responsividade no memory-vue
557ffbc fix: grid 2 colunas em mobile no memory-vue
<hash>   feat: paleta verde, overlay fim de jogo, badges e fix resetGame no termo-react
a93f576 feat: paleta âmbar, dino animado, 5 tipos de insetos, velocidade progressiva e lastScore no runner-vanilla
e11a453 feat: paleta ciano, 7 aliens coloridos, mobile input, velocidade progressiva e 5 vidas no typing-svelte
e18c2a5 fix: título da aba Defesa Espacial no typing-svelte
3f4185b feat: rebuild assets do portfólio com melhorias dos minijogos
```
