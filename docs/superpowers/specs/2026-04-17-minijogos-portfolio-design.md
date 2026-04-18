# Design Spec: 4 Minijogos para o Portfólio

**Data:** 2026-04-17  
**Autor:** Ygor Stefankowski da Silva  
**Objetivo:** Construir 4 minijogos standalone para demonstrar versatilidade com diferentes stacks Front-end, integrá-los ao portfólio Laravel com cartões e servi-los via `public/games/` na Hostinger.

---

## 1. Arquitetura Geral

Monorepo leve dentro do repositório Laravel existente:

```
portfolio/
├── games/
│   ├── package.json          ← scripts build:all e deploy.js
│   ├── deploy.js             ← copia dist/ para public/games/
│   ├── memory-vue/           ← Projeto 1
│   ├── termo-react/          ← Projeto 2
│   ├── runner-vanilla/       ← Projeto 3
│   └── typing-svelte/        ← Projeto 4
└── public/
    └── games/
        ├── memory-vue/
        ├── termo-react/
        ├── runner-vanilla/
        └── typing-svelte/
```

Cada jogo é um app Vite independente com `base: '/games/<nome>/'` no `vite.config`. Um único `npm run build:all` na raiz de `games/` constrói todos e copia para `public/games/`.

URLs finais em produção:
- `seudominio.com/games/memory-vue/`
- `seudominio.com/games/termo-react/`
- `seudominio.com/games/runner-vanilla/`
- `seudominio.com/games/typing-svelte/`

---

## 2. Header Compartilhado

Cada jogo implementa seu próprio header com estrutura consistente:
- Nome do jogo + emoji
- Badges da stack usada (ex: `Vue 3`, `Vite`, `CSS Puro`)
- Link "← Voltar ao Portfólio" apontando para o domínio principal
- Cada jogo tem liberdade total de tema visual abaixo do header

---

## 3. Seção de Jogos no Portfólio Laravel

Nova seção `#minijogos` adicionada ao Blade existente do portfólio com 4 cartões contendo:
- Emoji + nome do jogo
- Badges da stack usada
- Descrição curta do jogo (~2 linhas)
- Botão "▶ Jogar" que abre `/games/<nome>/` em nova aba

---

## 4. Jogos

### 4.1 Projeto 1 — Tech Match
- **Diretório:** `games/memory-vue/`
- **Stack:** Vue 3 (Composition API) + Vite + CSS puro
- **Estrutura:**
  - `App.vue` — orquestra estado global
  - `components/Card.vue` — flip animation com `transform: rotateY` em CSS puro
  - `components/Board.vue` — grid responsivo 4×4
- **Estado:** `ref()` para cartas viradas, pares encontrados, contador de tentativas, cronômetro
- **Cartas:** logotipos/nomes de tecnologias (JS, React, Python, Vue, CSS, Docker, Git, Node)
- **Extra:** contador de tentativas visível + cronômetro simples

### 4.2 Projeto 2 — Techdle
- **Diretório:** `games/termo-react/`
- **Stack:** React + TypeScript + Tailwind CSS
- **Estrutura:**
  - `App.tsx` — estado do jogo (palavra do dia, tentativas, teclado)
  - `components/Grid.tsx` — matriz 6×5 com cores (verde/amarelo/cinza)
  - `components/Keyboard.tsx` — teclado virtual responsivo
  - `utils/wordList.ts` — banco de palavras tech de 5 letras (PLACA, MOUSE, LINUX, DADOS, VETOR, etc.)
- **Validação:** letra correta na posição certa (verde), letra correta na posição errada (amarelo), letra ausente (cinza)
- **Extra:** histórico de vitórias/derrotas salvo em LocalStorage; interface responsiva com teclado virtual

### 4.3 Projeto 3 — Dino Bug Run
- **Diretório:** `games/runner-vanilla/`
- **Stack:** JavaScript Vanilla (ES6+) + HTML5 `<canvas>` + CSS básico
- **Estrutura:**
  - `src/Player.js` — classe com física de pulo
  - `src/Obstacle.js` — classe com velocidade progressiva
  - `src/GameLoop.js` — `requestAnimationFrame`, detecção de colisão AABB, score
  - `main.js` — inicializa canvas e loop
- **Controles:** Espaço / Seta para cima para pular
- **Extra:** velocidade dos obstáculos aumenta gradativamente com o score; game over com reinício

### 4.4 Projeto 4 — Typing Defense
- **Diretório:** `games/typing-svelte/`
- **Stack:** Svelte + Vite + CSS Animations
- **Estrutura:**
  - `App.svelte` — loop do jogo, vidas, score
  - `components/Enemy.svelte` — inimigo com comando de terminal, animação CSS de descida
  - `stores/game.js` — estado reativo com Svelte stores
- **Lógica:** inimigos caem do topo com comandos de terminal (ex: `git push`, `npm install`); o usuário digita o comando corretamente para destruir o inimigo via `keydown` em tempo real
- **Extra:** cada inimigo que toca o fundo remove uma vida; game over ao perder todas as vidas

---

## 5. Pipeline de Build e Deploy

**`games/package.json`:**
```json
{
  "scripts": {
    "build:all": "npm run build --prefix memory-vue && npm run build --prefix termo-react && npm run build --prefix runner-vanilla && npm run build --prefix typing-svelte && node deploy.js"
  }
}
```

**`games/deploy.js`** usa `fs.cpSync` para copiar cada `dist/` para `public/games/<nome>/`.

**Deploy na Hostinger:**
```bash
cd games && npm run build:all
```

---

## 6. Comentários no Código

Comentários curtos em primeira pessoa explicando lógicas complexas:
- Detecção de colisão AABB no Canvas (runner-vanilla)
- Validação da matriz de letras no React (termo-react)
- Sincronização do estado de flip no Vue (memory-vue)
- Captura de digitação em tempo real no Svelte (typing-svelte)

---

## 7. Ordem de Implementação

1. `memory-vue` — scaffold → código → build → validar
2. `termo-react` — scaffold → código → build → validar
3. `runner-vanilla` — scaffold → código → build → validar
4. `typing-svelte` — scaffold → código → build → validar
5. Seção `#minijogos` no portfólio Laravel
6. `games/deploy.js` + `build:all`
