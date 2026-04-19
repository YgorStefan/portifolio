# Games Improvement — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplicar melhorias visuais, correções de bugs e responsividade mobile nos 4 minijogos e na página do portfólio.

**Architecture:** Cada jogo tem seu próprio diretório em `games/<name>/` com stack independente (Vue 3, React/Tailwind, Vanilla JS, Svelte). As mudanças são locais a cada jogo; após cada task o build é copiado para `public/games/<name>/`. O portfólio (`home.blade.php`) recebe apenas mudanças de atributos HTML.

**Tech Stack:** Vue 3 + Vite, React + TypeScript + Tailwind CSS, Vanilla JS + Canvas, Svelte + Vite, Laravel Blade

---

## Arquivos que serão modificados

| Arquivo | Responsabilidade |
|---|---|
| `resources/views/pages/home.blade.php` | target="game-window" nos 4 botões Jogar |
| `games/memory-vue/index.html` | título da aba |
| `games/memory-vue/src/App.vue` | paleta, header, stats+reiniciar inline, back-link |
| `games/memory-vue/src/style.css` | paleta violet, responsividade 2-col mobile |
| `games/memory-vue/src/data/cards.js` | ícones JS e Node.js como SVG |
| `games/memory-vue/src/components/Card.vue` | renderizar SVG quando disponível |
| `games/runner-vanilla/index.html` | título, header, back-link, paleta âmbar |
| `games/runner-vanilla/src/style.css` | paleta âmbar |
| `games/runner-vanilla/src/GameLoop.js` | velocidade, último score, dino/insetos, "Fim de Jogo", canvas responsivo |
| `games/runner-vanilla/src/Player.js` | sprite do dinossauro animado |
| `games/runner-vanilla/src/Obstacle.js` | 5 tipos de insetos com 5 tamanhos cada |
| `games/termo-react/index.html` | título da aba |
| `games/termo-react/src/App.tsx` | paleta, header, overlay, badges, back-link, resetGame fix |
| `games/termo-react/src/index.css` | variáveis de cor verde |
| `games/termo-react/src/utils/wordList.ts` | expandir para ~40 palavras |
| `games/termo-react/src/components/GameOverlay.tsx` | **novo** — overlay fullscreen vitória/derrota |
| `games/typing-svelte/src/App.svelte` | paleta, mobile input, vidas=5, velocidade progressiva, "Fim de Jogo", back-link |
| `games/typing-svelte/src/app.css` | paleta ciano, responsividade |
| `games/typing-svelte/src/components/Enemy.svelte` | 7 tipos de aliens coloridos |
| `games/typing-svelte/src/stores/game.js` | vidas=5 |
| `games/typing-svelte/src/data/commands.js` | Fisher-Yates shuffle |

---

## Task 1: home.blade.php — target="game-window"

**Files:**
- Modify: `resources/views/pages/home.blade.php` (linhas 324, 400, 458, 516)

- [ ] **Step 1: Substituir target="_blank" por target="game-window" nos 4 botões Jogar**

Encontre as 4 ocorrências do padrão `href="/games/<name>/" target="_blank" rel="noopener noreferrer"` e substitua `target="_blank"` por `target="game-window"`. Mantenha `rel="noopener noreferrer"`.

As linhas exatas são 324, 400, 458, 516 de `resources/views/pages/home.blade.php`. Faça a substituição com replace_all nas 4 âncoras de "Jogar" (não as de "Como Jogar").

Resultado esperado — cada link de "Jogar" deve ficar assim:
```html
<a href="/games/memory-vue/" target="game-window" rel="noopener noreferrer"
```
```html
<a href="/games/termo-react/" target="game-window" rel="noopener noreferrer"
```
```html
<a href="/games/runner-vanilla/" target="game-window" rel="noopener noreferrer"
```
```html
<a href="/games/typing-svelte/" target="game-window" rel="noopener noreferrer"
```

- [ ] **Step 2: Commit**

```bash
git add resources/views/pages/home.blade.php
git commit -m "feat: reusar mesma aba para todos os minijogos"
```

---

## Task 2: memory-vue — Paleta, ícones, stats, responsividade

**Files:**
- Modify: `games/memory-vue/index.html`
- Modify: `games/memory-vue/src/App.vue`
- Modify: `games/memory-vue/src/style.css`
- Modify: `games/memory-vue/src/data/cards.js`
- Modify: `games/memory-vue/src/components/Card.vue`

### Step 2.1 — Título da aba e paleta CSS

- [ ] **Step 2.1: Atualizar index.html e style.css**

Em `games/memory-vue/index.html`, mude o `<title>`:
```html
<title>Jogo da Memória Tech</title>
```

Em `games/memory-vue/src/style.css`, substitua TODAS as cores da paleta atual (blues/slates) pela paleta violet. Use replace_all onde aplicável:

```css
/* Substituições exatas */
/* #0f172a  →  #0d0a1a  (body bg) */
/* #1e293b  →  #1a1230  (header bg) */
/* #334155  →  #2d1f5e  (border) */
/* #38bdf8  →  #8b5cf6  (accent azul → violet) */
/* rgba(56,189,248,0.1)  →  rgba(139,92,246,0.1) */
/* rgba(56,189,248,0.3)  →  rgba(139,92,246,0.3) */
/* #94a3b8  →  #a78bfa  (texto secundário) */
/* #7dd3fc  →  #a78bfa  (btn hover) */
```

Adicione ao final do arquivo as regras de responsividade mobile:
```css
@media (max-width: 480px) {
  .header {
    padding: 0.75rem 1rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .header-left, .header-right { flex: 0 0 auto; }
  .title-area { width: 100%; order: -1; }
  h1 { font-size: 1.2rem; }
}
```

### Step 2.2 — Header e stats no App.vue

- [ ] **Step 2.2: Atualizar App.vue — header, back-link, stats+reiniciar inline**

No `<template>` de `games/memory-vue/src/App.vue`:

1. Altere o `<h1>` para:
```html
<h1>🃏 Jogo da Memória Tech</h1>
```

2. Altere o `<a class="back-link">` para:
```html
<a href="javascript:void(0)" class="back-link" onclick="if(window.opener&&!window.opener.closed){window.opener.focus();window.close();}else{location.href='/';}">← Voltar para o Portfólio</a>
```

3. Substitua o bloco `<div class="stats">` e o `<button class="btn" @click="resetGame">🔄 Reiniciar</button>` isolado (que está FORA do win-banner) por um único bloco combinado:
```html
<div class="stats">
  <span>⏱ {{ timeFormatted }}</span>
  <span>🃏 {{ matchedCount / 2 }}/8 pares</span>
  <button class="btn btn-sm" @click="resetGame">↺ Reiniciar</button>
</div>
```

Remova o `<button class="btn" @click="resetGame">🔄 Reiniciar</button>` que estava separado fora do win-banner (mantenha apenas o botão dentro do win-banner).

4. Adicione no `<style>` ou em style.css:
```css
.btn-sm {
  padding: 3px 12px;
  font-size: 0.8rem;
  background: transparent;
  color: #8b5cf6;
  border: 1px solid #8b5cf6;
}
.btn-sm:hover { background: rgba(139,92,246,0.15); color: #a78bfa; }
```

### Step 2.3 — Ícones JS e Node.js como SVG

- [ ] **Step 2.3: Adicionar campo svg em cards.js para JS e Node**

Em `games/memory-vue/src/data/cards.js`, adicione `svg` nos dois cards:

```js
export const TECHS = [
  { id: 'js',     label: 'JavaScript', emoji: '🟨', svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#f7df1e"/><path d="M20.3 24.5c.4.7.95 1.2 1.9 1.2.8 0 1.3-.4 1.3-1 0-.67-.52-1-1.4-1.4l-.48-.2c-1.4-.6-2.3-1.35-2.3-2.94 0-1.46 1.1-2.57 2.85-2.57 1.24 0 2.13.43 2.77 1.56l-1.52.97c-.33-.6-.7-.83-1.25-.83-.57 0-.93.36-.93.83 0 .58.36.82 1.2 1.18l.48.2c1.65.7 2.56 1.44 2.56 3.07 0 1.76-1.38 2.7-3.24 2.7-1.82 0-2.99-.87-3.56-2.0l1.62-.93zm-8.1.17c.3.52.57.96 1.22.96.63 0 1.0-.24 1.0-.93v-5.02h1.9v5.06c0 1.54-.9 2.24-2.22 2.24-1.2 0-1.88-.62-2.23-1.37l1.33-.94z" fill="#000"/></svg>` },
  { id: 'react',  label: 'React',      emoji: '⚛️' },
  { id: 'python', label: 'Python',     emoji: '🐍' },
  { id: 'vue',    label: 'Vue',        emoji: '💚' },
  { id: 'css',    label: 'CSS',        emoji: '🎨' },
  { id: 'docker', label: 'Docker',     emoji: '🐳' },
  { id: 'git',    label: 'Git',        emoji: '🔀' },
  { id: 'node',   label: 'Node.js',    emoji: '🟩', svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="4" fill="#215732"/><path d="M16 4l10.4 6v12L16 28 5.6 22V10L16 4zm0 2.3L7.4 11v10l8.6 4.97L24.6 21V11L16 6.3zm0 3.3l6.2 3.58v7.16L16 23.9l-6.2-3.57V13.2L16 9.6zm0 2.3l-3.6 2.08v4.16L16 20.22l3.6-2.08v-4.16L16 11.9z" fill="#6cc24a"/></svg>` },
]
```

### Step 2.4 — Card.vue renderiza SVG quando disponível

- [ ] **Step 2.4: Atualizar Card.vue**

Leia `games/memory-vue/src/components/Card.vue` e substitua a área que exibe o ícone/emoji. Adicione suporte ao campo `svg`:

Onde o card exibe o conteúdo frontal (geralmente um `<span>` com o emoji), substitua por:
```html
<span v-if="card.svg" class="card-svg" v-html="card.svg"></span>
<span v-else class="card-emoji">{{ card.emoji }}</span>
```

Adicione CSS para o SVG:
```css
.card-svg { display: flex; align-items: center; justify-content: center; }
.card-svg svg { width: 48px; height: 48px; }
```

### Step 2.5 — Build e copiar para public

- [ ] **Step 2.5: Build memory-vue**

```bash
cd games/memory-vue && npm run build
```
Esperado: sem erros, `dist/` gerado.

- [ ] **Step 2.6: Copiar dist para public**

```bash
cp -r games/memory-vue/dist/. public/games/memory-vue/
```

- [ ] **Step 2.7: Commit**

```bash
git add games/memory-vue/ public/games/memory-vue/
git commit -m "feat: paleta violet, ícones JS/Node, stats compactos e responsividade no memory-vue"
```

---

## Task 3: termo-react — Paleta, overlay, badges, wordList, bug resetGame

**Files:**
- Modify: `games/termo-react/index.html`
- Modify: `games/termo-react/src/App.tsx`
- Modify: `games/termo-react/src/index.css`
- Modify: `games/termo-react/src/utils/wordList.ts`
- Create: `games/termo-react/src/components/GameOverlay.tsx`

### Step 3.1 — Título, paleta CSS e responsividade

- [ ] **Step 3.1: index.html e index.css**

Em `games/termo-react/index.html`, mude o `<title>`:
```html
<title>Wordle Tech</title>
```

Em `games/termo-react/src/index.css`, adicione (ou substitua o conteúdo existente):
```css
:root {
  --bg: #071a0d;
  --header-bg: #0f2a18;
  --accent: #22c55e;
  --border: #14532d;
  --text-muted: #4ade80;
}
body { background: var(--bg); color: #f1f5f9; font-family: system-ui, sans-serif; }

@media (max-width: 480px) {
  .keyboard-row { gap: 3px !important; }
  .key { min-width: 26px !important; height: 48px !important; font-size: 0.7rem !important; }
  .grid-cell { width: 48px !important; height: 48px !important; font-size: 1.4rem !important; }
}
```

### Step 3.2 — Expandir wordList.ts

- [ ] **Step 3.2: Expandir para ~40 palavras em wordList.ts**

Substitua o conteúdo de `games/termo-react/src/utils/wordList.ts` por:
```ts
export const WORDS: string[] = [
  'PLACA', 'MOUSE', 'LINUX', 'DADOS', 'VETOR',
  'PIXEL', 'CACHE', 'DISCO', 'PILHA', 'PORTA',
  'LOOPS', 'MACRO', 'FETCH', 'CLONE', 'MERGE',
  'STACK', 'PRINT', 'QUERY', 'TOKEN', 'INPUT',
  'DEBUG', 'SHELL', 'ARRAY', 'CLASS', 'PROXY',
  'FILA',  'BUILD', 'TESTE', 'BANCO', 'CHAVE',
  'REDES', 'NUVEM', 'FRAME', 'CICLO', 'FLUXO',
  'TROCA', 'BLOCO', 'SENHA', 'CAMPO', 'AGILE',
]
```

### Step 3.3 — GameOverlay component

- [ ] **Step 3.3: Criar games/termo-react/src/components/GameOverlay.tsx**

```tsx
interface Props {
  status: 'won' | 'lost'
  target: string
  attempts: number
  onNext: () => void
}

export default function GameOverlay({ status, target, attempts, onNext }: Props) {
  const isWin = status === 'won'
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backdropFilter: 'blur(4px)', background: isWin ? 'rgba(2,44,14,0.85)' : 'rgba(44,2,2,0.85)' }}>
      <div className="flex flex-col items-center gap-6 p-8 rounded-2xl"
        style={{ border: `2px solid ${isWin ? '#22c55e' : '#ef4444'}`, background: isWin ? '#071a0d' : '#1a0707' }}>
        <p className="text-4xl font-bold" style={{ color: isWin ? '#22c55e' : '#ef4444' }}>
          {isWin ? '🎉 Você acertou!' : '😞 Fim de Jogo'}
        </p>
        <div className="flex gap-2">
          {target.split('').map((letter, i) => (
            <div key={i} className="w-12 h-12 flex items-center justify-center rounded font-bold text-xl text-white"
              style={{ background: '#22c55e', border: '2px solid #16a34a' }}>
              {letter}
            </div>
          ))}
        </div>
        {isWin && <p className="text-gray-300 text-sm">Em {attempts} tentativas</p>}
        <button onClick={onNext}
          className="px-6 py-2 rounded font-semibold text-white"
          style={{ background: isWin ? '#22c55e' : '#ef4444' }}>
          {isWin ? 'Próxima Palavra' : 'Tentar Novamente'}
        </button>
      </div>
    </div>
  )
}
```

### Step 3.4 — App.tsx: paleta, overlay, badges, back-link, resetGame fix

- [ ] **Step 3.4: Atualizar App.tsx completamente**

Substitua o conteúdo de `games/termo-react/src/App.tsx` por:

```tsx
import { useState, useEffect, useCallback } from 'react'
import Grid from './components/Grid'
import Keyboard from './components/Keyboard'
import GameOverlay from './components/GameOverlay'
import type { GuessRow, LetterState, Stats } from '../types'
import { validateGuess, loadStats, saveStats } from './utils/gameLogic'
import { WORDS } from './utils/wordList'

const MAX_ATTEMPTS = 6
const WORD_LENGTH = 5

function getInitialWordIndex(): number {
  const start = new Date(new Date().getFullYear(), 0, 0)
  const diff = +new Date() - +start
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

function createEmptyRows(): GuessRow[] {
  return Array(MAX_ATTEMPTS).fill(null).map(() => ({
    letters: [],
    states: [],
    submitted: false,
  }))
}

export default function App() {
  const [wordIndex, setWordIndex] = useState(getInitialWordIndex)
  const [target, setTarget] = useState(() => WORDS[getInitialWordIndex() % WORDS.length])
  const [rows, setRows] = useState<GuessRow[]>(createEmptyRows)
  const [currentRow, setCurrentRow] = useState(0)
  const [currentLetters, setCurrentLetters] = useState<string[]>([])
  const [letterStates, setLetterStates] = useState<Record<string, LetterState>>({})
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing')
  const [stats, setStats] = useState<Stats>(loadStats)
  const [message, setMessage] = useState('')

  function resetGame() {
    const nextIdx = wordIndex + 1
    setWordIndex(nextIdx)
    setTarget(WORDS[nextIdx % WORDS.length])
    setRows(createEmptyRows())
    setCurrentRow(0)
    setCurrentLetters([])
    setLetterStates({})
    setStatus('playing')
    setMessage('')
  }

  function showMessage(msg: string) {
    setMessage(msg)
    setTimeout(() => setMessage(''), 2500)
  }

  function updateLetterStates(guess: string, states: LetterState[]) {
    setLetterStates(prev => {
      const next = { ...prev }
      const priority: LetterState[] = ['correct', 'present', 'absent']
      guess.split('').forEach((letter, i) => {
        const cur = next[letter]
        const newState = states[i]
        if (!cur || priority.indexOf(newState) < priority.indexOf(cur)) {
          next[letter] = newState
        }
      })
      return next
    })
  }

  const handleKey = useCallback((key: string) => {
    if (status !== 'playing') return

    if (key === '⌫' || key === 'Backspace') {
      setCurrentLetters(prev => prev.slice(0, -1))
      return
    }

    if (key === 'ENTER' || key === 'Enter') {
      if (currentLetters.length < WORD_LENGTH) {
        showMessage('Palavra incompleta')
        return
      }
      const guess = currentLetters.join('')
      const states = validateGuess(guess, target)

      setRows(prev => {
        const next = [...prev]
        next[currentRow] = { letters: currentLetters, states, submitted: true }
        return next
      })
      updateLetterStates(guess, states)
      setCurrentLetters([])

      if (guess === target) {
        const newStats: Stats = { ...stats, wins: stats.wins + 1, streak: stats.streak + 1, lastPlayed: new Date().toDateString(), lastResult: 'win' }
        setStats(newStats)
        saveStats(newStats)
        setStatus('won')
      } else if (currentRow + 1 >= MAX_ATTEMPTS) {
        const newStats: Stats = { ...stats, losses: stats.losses + 1, streak: 0, lastPlayed: new Date().toDateString(), lastResult: 'loss' }
        setStats(newStats)
        saveStats(newStats)
        setStatus('lost')
      } else {
        setCurrentRow(r => r + 1)
      }
      return
    }

    if (/^[A-Za-z]$/.test(key) && currentLetters.length < WORD_LENGTH) {
      setCurrentLetters(prev => [...prev, key.toUpperCase()])
    }
  }, [status, currentLetters, currentRow, target, stats])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => handleKey(e.key)
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleKey])

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#071a0d', color: '#f1f5f9' }}>
      {status !== 'playing' && (
        <GameOverlay
          status={status}
          target={target}
          attempts={currentRow + (status === 'won' ? 1 : MAX_ATTEMPTS)}
          onNext={resetGame}
        />
      )}
      <header className="flex items-center justify-between px-6 py-4" style={{ background: '#0f2a18', borderBottom: '1px solid #14532d' }}>
        <a href="javascript:void(0)" className="text-sm"
          style={{ color: '#4ade80' }}
          onClick={() => { if (window.opener && !window.opener.closed) { window.opener.focus(); window.close() } else { location.href = '/' } }}>
          ← Voltar para o Portfólio
        </a>
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-xl font-bold">🟩 Wordle Tech</h1>
          <div className="flex gap-2">
            {['React', 'TypeScript', 'Tailwind'].map(b => (
              <span key={b} className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ border: '1px solid rgba(34,197,94,0.4)', background: 'rgba(34,197,94,0.1)', color: '#4ade80' }}>{b}</span>
            ))}
          </div>
        </div>
        <div className="flex gap-2 text-sm">
          <span className="px-2 py-0.5 rounded font-semibold" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid #22c55e' }}>✓ {stats.wins} vitórias</span>
          <span className="px-2 py-0.5 rounded font-semibold" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid #ef4444' }}>✗ {stats.losses} derrotas</span>
          {stats.streak > 0 && <span className="px-2 py-0.5 rounded font-semibold" style={{ background: 'rgba(234,179,8,0.15)', color: '#eab308', border: '1px solid #eab308' }}>🔥 {stats.streak} seguidas</span>}
        </div>
      </header>

      <main className="flex flex-col items-center justify-center flex-1 px-4 py-6">
        {message && (
          <div className="mb-4 px-4 py-2 rounded text-sm font-semibold" style={{ background: '#0f2a18', color: '#f1f5f9' }}>{message}</div>
        )}
        <Grid rows={rows} currentRow={currentRow} currentLetters={currentLetters} />
        <Keyboard letterStates={letterStates} onKey={handleKey} />
      </main>
    </div>
  )
}
```

### Step 3.5 — Build e copiar

- [ ] **Step 3.5: Build termo-react**

```bash
cd games/termo-react && npm run build
```
Esperado: sem erros TypeScript, `dist/` gerado.

- [ ] **Step 3.6: Copiar dist para public**

```bash
cp -r games/termo-react/dist/. public/games/termo-react/
```

- [ ] **Step 3.7: Commit**

```bash
git add games/termo-react/ public/games/termo-react/
git commit -m "feat: paleta verde, overlay fim de jogo, badges e fix resetGame no termo-react"
```

---

## Task 4: runner-vanilla — Paleta, velocidade, dino, insetos

**Files:**
- Modify: `games/runner-vanilla/index.html`
- Modify: `games/runner-vanilla/src/style.css`
- Modify: `games/runner-vanilla/src/GameLoop.js`
- Modify: `games/runner-vanilla/src/Player.js`
- Modify: `games/runner-vanilla/src/Obstacle.js`

### Step 4.1 — index.html: título, header e paleta âmbar

- [ ] **Step 4.1: Atualizar index.html do runner-vanilla**

Substitua o conteúdo completo de `games/runner-vanilla/index.html` por:

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Fuga do Dino</title>
  </head>
  <body>
    <header class="game-header">
      <a href="javascript:void(0)" class="back-link"
        onclick="if(window.opener&&!window.opener.closed){window.opener.focus();window.close();}else{location.href='/';}">
        ← Voltar para o Portfólio
      </a>
      <div class="title-area">
        <h1>🦖 Fuga do Dino</h1>
        <div class="badges">
          <span class="badge">JavaScript</span>
          <span class="badge">Canvas</span>
          <span class="badge">ES6+</span>
        </div>
      </div>
      <div></div>
    </header>
    <main>
      <p class="hint">Pressione <kbd>Espaço</kbd> ou <kbd>↑</kbd> para pular · Toque na tela no mobile</p>
      <canvas id="game-canvas"></canvas>
    </main>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

### Step 4.2 — style.css: paleta âmbar

- [ ] **Step 4.2: Substituir paleta no style.css do runner-vanilla**

Substitua o conteúdo de `games/runner-vanilla/src/style.css` por:

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #1a1005; color: #f1f5f9; font-family: system-ui, sans-serif; min-height: 100vh; }

.game-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: #2a1a08;
  border-bottom: 1px solid #3d2510;
}
.title-area { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.back-link { color: #fbbf24; text-decoration: none; font-size: 0.9rem; }
.back-link:hover { color: #f59e0b; }
h1 { font-size: 1.5rem; font-weight: 700; }
.badges { display: flex; gap: 6px; }
.badge {
  background: rgba(245,158,11,0.1);
  border: 1px solid rgba(245,158,11,0.3);
  color: #f59e0b;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

main { display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 1.5rem 1rem; }
.hint { color: #92400e; font-size: 0.85rem; }
kbd { background: #2a1a08; border: 1px solid #3d2510; padding: 1px 6px; border-radius: 4px; color: #f59e0b; }
#game-canvas { border: 2px solid #f59e0b; border-radius: 8px; display: block; }
```

### Step 4.3 — main.js: altura do canvas proporcional

- [ ] **Step 4.3: Atualizar games/runner-vanilla/src/main.js — altura dinâmica**

Substitua o conteúdo de `games/runner-vanilla/src/main.js` por:

```js
import './style.css'
import { GameLoop } from './GameLoop.js'

function calcHeight(width) {
  return Math.max(Math.round(width * 0.25), 140)
}

const canvas = document.getElementById('game-canvas')
canvas.width = Math.min(window.innerWidth - 32, 800)
canvas.height = calcHeight(canvas.width)

let game = new GameLoop(canvas)
game.start()

function handleJump() {
  if (game.isGameOver) {
    game.stop()
    game = new GameLoop(canvas)
    game.start()
  } else {
    game.player.jump()
  }
}

document.addEventListener('keydown', e => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    e.preventDefault()
    handleJump()
  }
})

canvas.addEventListener('click', handleJump)
canvas.addEventListener('touchstart', e => { e.preventDefault(); handleJump() }, { passive: false })

window.addEventListener('resize', () => {
  canvas.width = Math.min(window.innerWidth - 32, 800)
  canvas.height = calcHeight(canvas.width)
  game.stop()
  game = new GameLoop(canvas)
  game.start()
})
```

### Step 4.4 — Player.js: sprite dinossauro animado

- [ ] **Step 4.3: Substituir Player.js com sprite do dino**

Substitua o conteúdo de `games/runner-vanilla/src/Player.js` por:

```js
export class Player {
  constructor(canvas) {
    this.canvas = canvas
    this.width = 40
    this.height = 50
    this.x = 80
    this.groundY = canvas.height - 20 - this.height
    this.y = this.groundY
    this.vy = 0
    this.gravity = 0.7
    this.jumpForce = -15
    this.isOnGround = true
    this.frame = 0
    this.frameTimer = 0
  }

  jump() {
    if (this.isOnGround) {
      this.vy = this.jumpForce
      this.isOnGround = false
    }
  }

  update() {
    this.vy += this.gravity
    this.y += this.vy
    if (this.y >= this.groundY) {
      this.y = this.groundY
      this.vy = 0
      this.isOnGround = true
    }
    if (this.isOnGround) {
      this.frameTimer++
      if (this.frameTimer >= 8) { this.frame = (this.frame + 1) % 2; this.frameTimer = 0 }
    }
  }

  draw(ctx) {
    const { x, y, width: w, height: h } = this
    // corpo
    ctx.fillStyle = '#2d6a1f'
    ctx.fillRect(x + 4, y + 14, w - 8, h - 14)
    // cabeça
    ctx.fillRect(x + 8, y, w - 10, 18)
    // olho
    ctx.fillStyle = '#fff'
    ctx.fillRect(x + w - 10, y + 4, 8, 8)
    ctx.fillStyle = '#111'
    ctx.fillRect(x + w - 8, y + 6, 4, 4)
    // pernas (2 frames de corrida / frame de pulo)
    ctx.fillStyle = '#3a8a28'
    if (!this.isOnGround) {
      // pernas estendidas para baixo no pulo
      ctx.fillRect(x + 8,  y + h - 12, 8, 16)
      ctx.fillRect(x + 22, y + h - 12, 8, 16)
    } else if (this.frame === 0) {
      ctx.fillRect(x + 8,  y + h - 6,  8, 14)
      ctx.fillRect(x + 22, y + h - 14, 8, 8)
    } else {
      ctx.fillRect(x + 8,  y + h - 14, 8, 8)
      ctx.fillRect(x + 22, y + h - 6,  8, 14)
    }
  }
}
```

### Step 4.4 — Obstacle.js: 5 tipos de insetos

- [ ] **Step 4.4: Substituir Obstacle.js com 5 tipos de insetos**

Substitua o conteúdo de `games/runner-vanilla/src/Obstacle.js` por:

```js
const INSECT_TYPES = ['beetle', 'mosquito', 'cockroach', 'cricket', 'spider']

function drawBeetle(ctx, x, y, w, h) {
  ctx.fillStyle = '#7c3aed'
  ctx.beginPath(); ctx.ellipse(x + w/2, y + h*0.55, w*0.45, h*0.35, 0, 0, Math.PI*2); ctx.fill()
  ctx.fillStyle = '#6d28d9'
  ctx.beginPath(); ctx.ellipse(x + w/2, y + h*0.28, w*0.3, h*0.25, 0, 0, Math.PI*2); ctx.fill()
  ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 1.5
  for (let i = 0; i < 3; i++) {
    const ly = y + h*0.45 + i * h*0.12
    ctx.beginPath(); ctx.moveTo(x + w*0.15, ly); ctx.lineTo(x - w*0.2, ly + h*0.1); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(x + w*0.85, ly); ctx.lineTo(x + w*1.2, ly + h*0.1); ctx.stroke()
  }
  ctx.strokeStyle = '#a78bfa'; ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(x + w*0.4, y + h*0.05); ctx.lineTo(x + w*0.2, y - h*0.2); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(x + w*0.6, y + h*0.05); ctx.lineTo(x + w*0.8, y - h*0.2); ctx.stroke()
}

function drawMosquito(ctx, x, y, w, h) {
  ctx.fillStyle = '#6b7280'
  ctx.beginPath(); ctx.ellipse(x + w/2, y + h*0.5, w*0.12, h*0.42, 0, 0, Math.PI*2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(x + w/2, y + h*0.2, w*0.14, h*0.16, 0, 0, Math.PI*2); ctx.fill()
  ctx.fillStyle = 'rgba(156,163,175,0.5)'
  ctx.beginPath(); ctx.moveTo(x + w/2, y + h*0.3); ctx.lineTo(x, y + h*0.1); ctx.lineTo(x + w*0.2, y + h*0.5); ctx.fill()
  ctx.beginPath(); ctx.moveTo(x + w/2, y + h*0.3); ctx.lineTo(x + w, y + h*0.1); ctx.lineTo(x + w*0.8, y + h*0.5); ctx.fill()
  ctx.strokeStyle = '#9ca3af'; ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(x + w/2, y + h*0.1); ctx.lineTo(x + w/2, y - h*0.25); ctx.stroke()
  for (let i = 0; i < 3; i++) {
    ctx.beginPath(); ctx.moveTo(x + w/2 - w*0.08, y + h*(0.45 + i*0.12))
    ctx.lineTo(x - w*0.3, y + h*(0.4 + i*0.12)); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(x + w/2 + w*0.08, y + h*(0.45 + i*0.12))
    ctx.lineTo(x + w*1.3, y + h*(0.4 + i*0.12)); ctx.stroke()
  }
}

function drawCockroach(ctx, x, y, w, h) {
  ctx.fillStyle = '#92400e'
  ctx.beginPath(); ctx.ellipse(x + w/2, y + h*0.5, w*0.48, h*0.3, 0, 0, Math.PI*2); ctx.fill()
  ctx.fillStyle = '#78350f'
  ctx.beginPath(); ctx.ellipse(x + w/2, y + h*0.22, w*0.28, h*0.2, 0, 0, Math.PI*2); ctx.fill()
  ctx.strokeStyle = '#b45309'; ctx.lineWidth = 1.5
  for (let i = 0; i < 3; i++) {
    const lx = x + w*(0.2 + i*0.25)
    ctx.beginPath(); ctx.moveTo(lx, y + h*0.65); ctx.lineTo(lx - w*0.15, y + h); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(lx, y + h*0.65); ctx.lineTo(lx + w*0.05, y + h); ctx.stroke()
  }
  ctx.strokeStyle = '#d97706'; ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(x + w*0.45, y + h*0.1); ctx.lineTo(x + w*0.2, y - h*0.15); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(x + w*0.55, y + h*0.1); ctx.lineTo(x + w*0.8, y - h*0.15); ctx.stroke()
}

function drawCricket(ctx, x, y, w, h) {
  ctx.fillStyle = '#16a34a'
  ctx.beginPath(); ctx.ellipse(x + w*0.35, y + h*0.5, w*0.35, h*0.28, -0.2, 0, Math.PI*2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(x + w*0.72, y + h*0.45, w*0.2, h*0.22, 0, 0, Math.PI*2); ctx.fill()
  ctx.strokeStyle = '#15803d'; ctx.lineWidth = 1.5
  for (let i = 0; i < 2; i++) {
    const lx = x + w*(0.18 + i*0.25)
    ctx.beginPath(); ctx.moveTo(lx, y + h*0.65); ctx.lineTo(lx - w*0.15, y + h*0.9); ctx.stroke()
  }
  ctx.lineWidth = 2
  ctx.beginPath(); ctx.moveTo(x + w*0.08, y + h*0.7); ctx.lineTo(x - w*0.1, y + h); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(x + w*0.22, y + h*0.7); ctx.lineTo(x + w*0.05, y + h); ctx.stroke()
  ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(x + w*0.72, y + h*0.3); ctx.lineTo(x + w*0.65, y - h*0.1); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(x + w*0.82, y + h*0.3); ctx.lineTo(x + w*0.95, y - h*0.1); ctx.stroke()
}

function drawSpider(ctx, x, y, w, h) {
  ctx.fillStyle = '#1e1b4b'
  ctx.beginPath(); ctx.ellipse(x + w/2, y + h*0.5, w*0.35, h*0.32, 0, 0, Math.PI*2); ctx.fill()
  ctx.fillStyle = '#312e81'
  ctx.beginPath(); ctx.ellipse(x + w/2, y + h*0.18, w*0.22, h*0.18, 0, 0, Math.PI*2); ctx.fill()
  ctx.fillStyle = '#e11d48'
  ctx.fillRect(x + w*0.38, y + h*0.44, w*0.24, h*0.12)
  ctx.strokeStyle = '#4338ca'; ctx.lineWidth = 1.5
  const legAngles = [-0.6, -0.2, 0.2, 0.6]
  legAngles.forEach(a => {
    ctx.beginPath()
    ctx.moveTo(x + w*0.15, y + h*0.5)
    ctx.quadraticCurveTo(x, y + h*(0.5 + a*0.3), x - w*0.25, y + h*(0.5 + a*0.5))
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x + w*0.85, y + h*0.5)
    ctx.quadraticCurveTo(x + w, y + h*(0.5 + a*0.3), x + w*1.25, y + h*(0.5 + a*0.5))
    ctx.stroke()
  })
}

const DRAW_FNS = { beetle: drawBeetle, mosquito: drawMosquito, cockroach: drawCockroach, cricket: drawCricket, spider: drawSpider }
const SCALES = [0.6, 0.8, 1.0, 1.2, 1.4]

export class Obstacle {
  constructor(canvas, speed) {
    this.canvas = canvas
    const type = INSECT_TYPES[Math.floor(Math.random() * INSECT_TYPES.length)]
    const scale = SCALES[Math.floor(Math.random() * SCALES.length)]
    this.type = type
    this.baseW = 30
    this.baseH = 40
    this.width = this.baseW * scale
    this.height = this.baseH * scale
    this.x = canvas.width + 10
    this.y = canvas.height - 20 - this.height
    this.speed = speed
  }

  update() { this.x -= this.speed }

  isOffScreen() { return this.x + this.width < 0 }

  draw(ctx) {
    DRAW_FNS[this.type](ctx, this.x, this.y, this.width, this.height)
  }
}
```

### Step 4.5 — GameLoop.js: velocidade, lastScore, "Fim de Jogo", canvas responsivo

- [ ] **Step 4.5: Atualizar GameLoop.js**

Substitua o conteúdo de `games/runner-vanilla/src/GameLoop.js` por:

```js
import { Player } from './Player.js'
import { Obstacle } from './Obstacle.js'

export class GameLoop {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.player = new Player(canvas)
    this.obstacles = []
    this.score = 0
    this.speedMultiplier = 1.0
    this.frameCount = 0
    this.running = false
    this.isGameOver = false
    this.animId = null
    this.spawnInterval = 90
    this.lastScore = parseInt(localStorage.getItem('dino_last_score') || '0')
  }

  get speed() { return this.speedMultiplier * 5 }

  _updateSpeed() {
    this.speedMultiplier = 1.0 + Math.floor(this.score / 1500) * 0.5
  }

  _checkCollision(a, b) {
    return (
      a.x              < b.x + b.width  &&
      a.x + a.width    > b.x            &&
      a.y              < b.y + b.height &&
      a.y + a.height   > b.y
    )
  }

  _update() {
    this.frameCount++
    this.score++
    this._updateSpeed()
    this.player.update()

    if (this.frameCount % this.spawnInterval === 0) {
      this.obstacles.push(new Obstacle(this.canvas, this.speed))
    }

    this.obstacles.forEach(o => o.update())
    this.obstacles = this.obstacles.filter(o => !o.isOffScreen())

    for (const obs of this.obstacles) {
      if (this._checkCollision(this.player, obs)) {
        this.isGameOver = true
        this.running = false
        localStorage.setItem('dino_last_score', String(this.score))
        return
      }
    }
  }

  _draw() {
    const { ctx, canvas } = this

    ctx.fillStyle = '#1a1005'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#3d2510'
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20)

    this.player.draw(ctx)
    this.obstacles.forEach(o => o.draw(ctx))

    ctx.fillStyle = '#fbbf24'
    ctx.font = 'bold 14px monospace'
    ctx.fillText(`Score: ${this.score}`, 16, 28)
    ctx.fillText(`Vel: ${this.speedMultiplier.toFixed(1)}x`, 16, 48)

    if (this.isGameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.78)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.textAlign = 'center'
      ctx.fillStyle = '#f59e0b'
      ctx.font = 'bold 28px monospace'
      ctx.fillText('Fim de Jogo', canvas.width / 2, canvas.height / 2 - 28)
      ctx.fillStyle = '#f1f5f9'
      ctx.font = '16px monospace'
      ctx.fillText(`Score: ${this.score} | Último: ${this.lastScore}`, canvas.width / 2, canvas.height / 2 + 8)
      ctx.fillText('Espaço / Toque para reiniciar', canvas.width / 2, canvas.height / 2 + 36)
      ctx.textAlign = 'left'
    }
  }

  _loop() {
    if (!this.running) return
    this._update()
    this._draw()
    this.animId = requestAnimationFrame(() => this._loop())
  }

  start() { this.running = true; this._loop() }

  stop() { this.running = false; cancelAnimationFrame(this.animId) }
}
```

### Step 4.6 — Build e copiar

- [ ] **Step 4.6: Build runner-vanilla**

```bash
cd games/runner-vanilla && npm run build
```
Esperado: sem erros, `dist/` gerado.

- [ ] **Step 4.7: Copiar dist para public**

```bash
cp -r games/runner-vanilla/dist/. public/games/runner-vanilla/
```

- [ ] **Step 4.8: Commit**

```bash
git add games/runner-vanilla/ public/games/runner-vanilla/
git commit -m "feat: paleta âmbar, dino animado, 5 tipos de insetos, velocidade progressiva e lastScore no runner-vanilla"
```

---

## Task 5: typing-svelte — Paleta, mobile input, aliens, velocidade, vidas

**Files:**
- Modify: `games/typing-svelte/src/App.svelte`
- Modify: `games/typing-svelte/src/app.css`
- Modify: `games/typing-svelte/src/components/Enemy.svelte`
- Modify: `games/typing-svelte/src/stores/game.js`
- Modify: `games/typing-svelte/src/data/commands.js`

### Step 5.1 — app.css: paleta ciano

- [ ] **Step 5.1: Substituir paleta no app.css**

Substitua as cores no `games/typing-svelte/src/app.css`:
- `#0f172a` → `#01101a` (body bg)
- `#1e293b` → `#021828` (header bg)
- `#334155` → `#0a3a50` (border/secondary)
- `#38bdf8` → `#06b6d4` (accent)
- `rgba(56,189,248,0.1)` → `rgba(6,182,212,0.1)`
- `rgba(56,189,248,0.3)` → `rgba(6,182,212,0.3)`
- `#94a3b8` → `#67e8f9` (texto mutado)

Adicione ao final do app.css:
```css
.mobile-input-field {
  display: none;
  width: 100%;
  max-width: 400px;
  background: #011520;
  border: 1px solid #06b6d4;
  color: #f1f5f9;
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  padding: 6px 12px;
  border-radius: 6px;
  outline: none;
  margin-top: 6px;
}
@media (pointer: coarse), (max-width: 767px) {
  .mobile-input-field { display: block; }
}
```

### Step 5.2 — stores/game.js: vidas = 5

- [ ] **Step 5.2: Mudar vidas iniciais para 5**

Em `games/typing-svelte/src/stores/game.js`, altere:
```js
export const lives = writable(5)
```

### Step 5.3 — commands.js: Fisher-Yates shuffle

- [ ] **Step 5.3: Adicionar shuffle em commands.js**

Adicione ao final de `games/typing-svelte/src/data/commands.js`:
```js
export function shuffleCommands() {
  const arr = [...COMMANDS]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
```

### Step 5.4 — Enemy.svelte: 7 aliens coloridos

- [ ] **Step 5.4: Substituir Enemy.svelte com 7 variantes SVG**

Substitua o conteúdo de `games/typing-svelte/src/components/Enemy.svelte` por:

```svelte
<script>
  export let enemy

  const COLORS = [
    '#06b6d4', // ciano
    '#22c55e', // verde
    '#a855f7', // roxo
    '#f97316', // laranja
    '#ec4899', // rosa
    '#ef4444', // vermelho
    '#eab308', // amarelo
  ]

  $: color = COLORS[enemy.type ?? 0]
</script>

<div class="enemy" style="left: {enemy.x}px; top: {enemy.y}px">
  <svg width="40" height="36" viewBox="0 0 40 36" fill="none">
    <!-- corpo -->
    <ellipse cx="20" cy="20" rx="14" ry="12" fill={color} opacity="0.9"/>
    <!-- olhos -->
    <circle cx="13" cy="16" r="4" fill="white"/>
    <circle cx="27" cy="16" r="4" fill="white"/>
    <circle cx="14" cy="17" r="2" fill="#111"/>
    <circle cx="28" cy="17" r="2" fill="#111"/>
    <!-- antenas -->
    <line x1="13" y1="8" x2="8" y2="2" stroke={color} stroke-width="2"/>
    <circle cx="7" cy="1" r="2" fill={color}/>
    <line x1="27" y1="8" x2="32" y2="2" stroke={color} stroke-width="2"/>
    <circle cx="33" cy="1" r="2" fill={color}/>
    <!-- patas -->
    <line x1="6" y1="22" x2="0" y2="18" stroke={color} stroke-width="2"/>
    <line x1="6" y1="26" x2="0" y2="26" stroke={color} stroke-width="2"/>
    <line x1="6" y1="30" x2="0" y2="34" stroke={color} stroke-width="2"/>
    <line x1="34" y1="22" x2="40" y2="18" stroke={color} stroke-width="2"/>
    <line x1="34" y1="26" x2="40" y2="26" stroke={color} stroke-width="2"/>
    <line x1="34" y1="30" x2="40" y2="34" stroke={color} stroke-width="2"/>
    <!-- boca -->
    <path d="M14 26 Q20 30 26 26" stroke="white" stroke-width="1.5" fill="none"/>
  </svg>
  <div class="command">{enemy.command}</div>
</div>

<style>
.enemy {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  pointer-events: none;
}
.command {
  background: #011520;
  border: 1px solid #0a3a50;
  color: #06b6d4;
  font-family: 'Courier New', monospace;
  font-size: 0.78rem;
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap;
}
</style>
```

### Step 5.5 — App.svelte: paleta, mobile input, velocidade progressiva, vidas, "Fim de Jogo", back-link

- [ ] **Step 5.5: Atualizar App.svelte**

Substitua o conteúdo completo de `games/typing-svelte/src/App.svelte` por:

```svelte
<script>
  import { onMount, onDestroy } from 'svelte'
  import Enemy from './components/Enemy.svelte'
  import { enemies, lives, score, typed, gameOver, activeEnemy } from './stores/game.js'
  import { shuffleCommands } from './data/commands.js'
  import './app.css'

  let inputValue = ''
  let mobileInputEl = null
  let loopId = null
  let spawnId = null
  let speedTimerId = null
  let enemyId = 0
  let arenaHeight = 400
  let lastTime = 0
  let fallSpeed = 0.4
  let shuffledCommands = shuffleCommands()
  let cmdIndex = 0

  const SPAWN_INTERVAL_MS = 3500
  const GROUND_OFFSET = 82

  function getArenaHeight() {
    return window.innerHeight - 120
  }

  function nextCommand() {
    const cmd = shuffledCommands[cmdIndex % shuffledCommands.length]
    cmdIndex++
    if (cmdIndex % shuffledCommands.length === 0) shuffledCommands = shuffleCommands()
    return cmd
  }

  function spawnEnemy() {
    if ($gameOver) return
    const command = nextCommand()
    const maxX = Math.max(window.innerWidth - 200, 100)
    const x = 40 + Math.random() * maxX
    const type = Math.floor(Math.random() * 7)
    enemies.update(list => [...list, { id: enemyId++, command, x, y: -60, destroyed: false, type }])
  }

  function gameLoop(timestamp = 0) {
    if ($gameOver) return
    const delta = lastTime === 0 ? 16.67 : timestamp - lastTime
    lastTime = timestamp
    enemies.update(list =>
      list.map(e => {
        if (e.destroyed) return e
        const newY = e.y + fallSpeed * (delta / 16.67)
        if (newY > arenaHeight - GROUND_OFFSET) {
          lives.update(l => l - 1)
          return { ...e, destroyed: true }
        }
        return { ...e, y: newY }
      }).filter(e => !e.destroyed || e.y < arenaHeight)
    )

    if ($lives <= 0) {
      gameOver.set(true)
      clearInterval(spawnId)
      clearInterval(speedTimerId)
      return
    }

    loopId = requestAnimationFrame(gameLoop)
  }

  function handleInput(value) {
    inputValue = value
    typed.set(inputValue)
    const target = $activeEnemy
    if (target && inputValue === target.command) {
      enemies.update(list => list.map(e => e.id === target.id ? { ...e, destroyed: true } : e))
      score.update(s => s + 100 + target.command.length * 5)
      inputValue = ''
      typed.set('')
      if (mobileInputEl) mobileInputEl.value = ''
    }
  }

  function handleKeydown(e) {
    if ($gameOver) return
    if (e.key === 'Backspace') {
      handleInput(inputValue.slice(0, -1))
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      handleInput(inputValue + e.key)
    }
  }

  function handleMobileInput(e) {
    handleInput(e.target.value)
  }

  function restart() {
    enemies.set([])
    lives.set(5)
    score.set(0)
    typed.set('')
    gameOver.set(false)
    inputValue = ''
    enemyId = 0
    fallSpeed = 0.4
    lastTime = 0
    shuffledCommands = shuffleCommands()
    cmdIndex = 0
    if (mobileInputEl) mobileInputEl.value = ''
    spawnEnemy()
    spawnId = setInterval(spawnEnemy, SPAWN_INTERVAL_MS)
    speedTimerId = setInterval(() => { fallSpeed += 0.05 }, 15000)
    loopId = requestAnimationFrame(gameLoop)
  }

  onMount(() => {
    arenaHeight = getArenaHeight()
    window.addEventListener('keydown', handleKeydown)
    spawnEnemy()
    spawnId = setInterval(spawnEnemy, SPAWN_INTERVAL_MS)
    speedTimerId = setInterval(() => { fallSpeed += 0.05 }, 15000)
    loopId = requestAnimationFrame(gameLoop)
  })

  onDestroy(() => {
    window.removeEventListener('keydown', handleKeydown)
    cancelAnimationFrame(loopId)
    clearInterval(spawnId)
    clearInterval(speedTimerId)
  })
</script>

<div class="app">
  <header class="header">
    <a href="javascript:void(0)" class="back-link"
      on:click={() => { if (window.opener && !window.opener.closed) { window.opener.focus(); window.close() } else { location.href = '/' } }}>
      ← Voltar para o Portfólio
    </a>
    <div class="title-area">
      <h1>⌨️ Defesa Espacial</h1>
      <div class="badges">
        <span class="badge">Svelte</span>
        <span class="badge">Vite</span>
        <span class="badge">CSS Animations</span>
      </div>
    </div>
    <div></div>
  </header>

  <div class="hud">
    <span>❤️ {$lives}</span>
    <span>🏆 {$score}</span>
  </div>

  <div class="arena" style="height: {arenaHeight}px">
    {#each $enemies as enemy (enemy.id)}
      {#if !enemy.destroyed}
        <Enemy {enemy} />
      {/if}
    {/each}

    <div class="ground"></div>

    <div class="server">
      <span class="hint-text">Digite o comando do inimigo para destruí-lo</span>
      <div class="input-display">
        <span style="color:#0a3a50">$ </span>{$typed}<span class="cursor">_</span>
      </div>
      <input
        bind:this={mobileInputEl}
        class="mobile-input-field"
        type="text"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        placeholder="Digite aqui..."
        on:input={handleMobileInput}
      />
    </div>

    {#if $gameOver}
      <div class="game-over-overlay">
        <h2>💀 Fim de Jogo</h2>
        <p>Score final: {$score}</p>
        <button class="btn" on:click={restart}>Reiniciar</button>
      </div>
    {/if}
  </div>
</div>
```

### Step 5.6 — Build e copiar

- [ ] **Step 5.6: Build typing-svelte**

```bash
cd games/typing-svelte && npm run build
```
Esperado: sem erros Svelte, `dist/` gerado.

- [ ] **Step 5.7: Copiar dist para public**

```bash
cp -r games/typing-svelte/dist/. public/games/typing-svelte/
```

- [ ] **Step 5.8: Commit**

```bash
git add games/typing-svelte/ public/games/typing-svelte/
git commit -m "feat: paleta ciano, 7 aliens coloridos, mobile input, velocidade progressiva e 5 vidas no typing-svelte"
```

---

## Task 6: Rebuild assets CSS do portfólio

- [ ] **Step 6.1: Rebuild assets Laravel**

```bash
npm run build
```
Esperado: `public/build/assets/` atualizado sem erros.

- [ ] **Step 6.2: Commit final**

```bash
git add public/build/ resources/views/pages/home.blade.php
git commit -m "feat: rebuild assets do portfólio com melhorias dos minijogos"
```
