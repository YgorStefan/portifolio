# Minijogos — Correção de Bugs e Qualidade Sênior

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corrigir 10 bugs e gaps de qualidade nos 4 minijogos do portfólio, elevando código e visual a nível sênior.

**Architecture:** Cada jogo é uma SPA independente buildada com Vite. As correções são isoladas por jogo — sem dependências cruzadas. O deploy final usa `node games/deploy.js` para copiar todos os dists para `public/games/`.

**Tech Stack:** Vue 3 (memory-vue), React 19 + TypeScript + Tailwind v4 (termo-react), Vanilla JS + Canvas (runner-vanilla), Svelte 5 (typing-svelte), Vite 8, Vitest (testes unitários novos)

---

## Mapa de Arquivos

| Arquivo | Operação | Motivo |
|---|---|---|
| `resources/views/pages/home.blade.php` | Modificar | Remover `rel="noopener noreferrer"` dos 4 links |
| `games/memory-vue/src/App.vue` | Modificar | Fix back button + win overlay + stats |
| `games/memory-vue/src/style.css` | Modificar | Estilos do win overlay |
| `games/termo-react/src/index.css` | Modificar | Adicionar `@import "tailwindcss"` |
| `games/termo-react/src/components/GameOverlay.tsx` | Modificar | Letras neutras na derrota |
| `games/runner-vanilla/src/physics.js` | Criar | Funções puras de física testáveis |
| `games/runner-vanilla/src/Player.js` | Modificar | Receber `delta` no `update()` |
| `games/runner-vanilla/src/Obstacle.js` | Modificar | Receber `delta` no `update()` |
| `games/runner-vanilla/src/GameLoop.js` | Modificar | Delta time + spawn por acumulador |
| `games/runner-vanilla/src/physics.test.js` | Criar | Testes vitest das funções de física |
| `games/runner-vanilla/package.json` | Modificar | Adicionar vitest |
| `games/runner-vanilla/vite.config.js` | Criar | Config vitest |
| `games/typing-svelte/src/components/Enemy.svelte` | Modificar | SVG de OVNI |
| `games/typing-svelte/src/data/commands.js` | Modificar | Expandir para 33 comandos |
| `games/typing-svelte/src/App.svelte` | Modificar | Velocidade + HUD |

---

## Task 1: Fix back button — home.blade.php

**Files:**
- Modify: `resources/views/pages/home.blade.php`

Remover `rel="noopener noreferrer"` dos 4 links "Jogar". Os jogos estão na mesma origem (`/games/*`), então não há risco de segurança. Sem esse atributo, `window.opener` ficará disponível dentro de cada jogo.

- [ ] **Abrir o arquivo e localizar os 4 links**

```bash
grep -n 'target="game-window"' resources/views/pages/home.blade.php
```

Esperado: 4 linhas (linhas ~324, ~400, ~458, ~516).

- [ ] **Remover `rel="noopener noreferrer"` dos 4 links**

Cada link tem o padrão abaixo. Trocar em todos os 4:

```html
<!-- ANTES -->
<a href="/games/memory-vue/" target="game-window" rel="noopener noreferrer"

<!-- DEPOIS -->
<a href="/games/memory-vue/" target="game-window"
```

Fazer o mesmo para `/games/termo-react/`, `/games/runner-vanilla/` e `/games/typing-svelte/`.

- [ ] **Verificar que ficaram exatamente 0 ocorrências**

```bash
grep 'rel="noopener noreferrer"' resources/views/pages/home.blade.php
```

Esperado: nenhuma saída.

- [ ] **Commit**

```bash
git add resources/views/pages/home.blade.php
git commit -m "fix: remove noopener dos links de jogos para window.opener funcionar"
```

---

## Task 2: Fix back buttons — todos os jogos

**Files:**
- Modify: `games/memory-vue/src/App.vue:77`
- Modify: `games/termo-react/src/App.tsx:131-142`
- Modify: `games/typing-svelte/src/App.svelte:133-134`
- Modify: `games/runner-vanilla/index.html:10-12`

Simplificar a lógica de "Voltar" para `window.close()` com fallback. Quando o jogo for aberto via `target="game-window"`, `window.close()` fecha a aba e o foco retorna ao portfólio automaticamente. O fallback `location.href = '/'` cobre o caso de o usuário abrir o jogo diretamente pela URL.

- [ ] **Substituir o back link no memory-vue**

Em `games/memory-vue/src/App.vue`, linha 77:

```html
<!-- ANTES -->
<a href="javascript:void(0)" class="back-link" onclick="if(window.opener&&!window.opener.closed){window.opener.focus();window.close();}else{location.href='/';}">← Voltar para o Portfólio</a>

<!-- DEPOIS -->
<a href="javascript:void(0)" class="back-link" onclick="window.close(); setTimeout(()=>{ if(!window.closed) location.href='/'; }, 300)">← Voltar para o Portfólio</a>
```

- [ ] **Substituir o back link no termo-react**

Em `games/termo-react/src/App.tsx`, substituir o handler `onClick` do link "Voltar":

```tsx
<a
  href="javascript:void(0)"
  className="text-sm"
  style={{ color: '#4ade80' }}
  onClick={() => {
    window.close()
    setTimeout(() => { if (!window.closed) location.href = '/' }, 300)
  }}
>
  ← Voltar para o Portfólio
</a>
```

- [ ] **Substituir o back link no typing-svelte**

Em `games/typing-svelte/src/App.svelte`, linha 133-134:

```svelte
<a href="javascript:void(0)" class="back-link"
  on:click={() => { window.close(); setTimeout(() => { if (!window.closed) location.href = '/' }, 300) }}>
  ← Voltar para o Portfólio
</a>
```

- [ ] **Substituir o back link no runner-vanilla**

Em `games/runner-vanilla/index.html`, linhas 10-12:

```html
<a href="javascript:void(0)" class="back-link"
  onclick="window.close(); setTimeout(function(){ if(!window.closed) location.href='/'; }, 300)">
  ← Voltar para o Portfólio
</a>
```

- [ ] **Commit**

```bash
git add games/memory-vue/src/App.vue games/termo-react/src/App.tsx games/typing-svelte/src/App.svelte games/runner-vanilla/index.html
git commit -m "fix: simplifica botao voltar para window.close() em todos os jogos"
```

---

## Task 3: Wordle Tech — Tailwind import

**Files:**
- Modify: `games/termo-react/src/index.css`

O Tailwind v4 com `@tailwindcss/vite` só gera utilitários se o CSS importar `"tailwindcss"`. Sem isso, o CSS buildado tem ~382 bytes e nenhuma classe como `w-14`, `flex`, `border-2` funciona.

- [ ] **Adicionar o import no topo do index.css**

`games/termo-react/src/index.css` deve ficar:

```css
@import "tailwindcss";

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

- [ ] **Commit**

```bash
git add games/termo-react/src/index.css
git commit -m "fix: adiciona @import tailwindcss no termo-react para gerar utilitarios CSS"
```

---

## Task 4: Wordle Tech — GameOverlay derrota

**Files:**
- Modify: `games/termo-react/src/components/GameOverlay.tsx`

Na derrota, o overlay atual exibe todas as letras da palavra em verde — visualmente incorreto (o verde indica "acertou"). Na derrota, as letras devem aparecer em cinza neutro com um texto claro "A palavra era:".

- [ ] **Substituir GameOverlay.tsx**

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backdropFilter: 'blur(4px)', background: isWin ? 'rgba(2,44,14,0.85)' : 'rgba(44,2,2,0.85)' }}
    >
      <div
        className="flex flex-col items-center gap-6 p-8 rounded-2xl"
        style={{ border: `2px solid ${isWin ? '#22c55e' : '#ef4444'}`, background: isWin ? '#071a0d' : '#1a0707' }}
      >
        <p className="text-4xl font-bold" style={{ color: isWin ? '#22c55e' : '#ef4444' }}>
          {isWin ? '🎉 Você acertou!' : '😞 Fim de Jogo'}
        </p>

        <div className="flex flex-col items-center gap-2">
          <p className="text-sm" style={{ color: '#9ca3af' }}>
            {isWin ? `Em ${attempts} tentativas` : 'A palavra era:'}
          </p>
          <div className="flex gap-2">
            {target.split('').map((letter, i) => (
              <div
                key={i}
                className="w-12 h-12 flex items-center justify-center rounded font-bold text-xl text-white"
                style={{
                  background: isWin ? '#22c55e' : '#374151',
                  border: `2px solid ${isWin ? '#16a34a' : '#4b5563'}`,
                }}
              >
                {letter}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onNext}
          className="px-6 py-2 rounded font-semibold text-white"
          style={{ background: isWin ? '#22c55e' : '#ef4444' }}
        >
          {isWin ? 'Próxima Palavra' : 'Tentar Novamente'}
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add games/termo-react/src/components/GameOverlay.tsx
git commit -m "fix: GameOverlay exibe letras neutras na derrota em vez de verde"
```

---

## Task 5: runner-vanilla — Extrair funções de física puras

**Files:**
- Create: `games/runner-vanilla/src/physics.js`

Antes de modificar Player e GameLoop, extrair as funções de física para um módulo puro — isso torna o código testável sem canvas e deixa as responsabilidades claras.

- [ ] **Criar games/runner-vanilla/src/physics.js**

```js
export const FRAME_MS = 16.667

/** Normaliza delta para fator equivalente a 60fps */
export function normalizeDelta(deltaMs) {
  return deltaMs / FRAME_MS
}

/** Calcula multiplicador de velocidade baseado no score */
export function calcSpeedMultiplier(score) {
  return 1.0 + Math.floor(score / 1500) * 0.5
}

/** Acumula tempo e retorna true quando o intervalo foi atingido */
export function shouldSpawn(accumulator, intervalMs) {
  return accumulator >= intervalMs
}
```

- [ ] **Commit**

```bash
git add games/runner-vanilla/src/physics.js
git commit -m "refactor: extrai funcoes puras de fisica para physics.js no runner-vanilla"
```

---

## Task 6: runner-vanilla — Configurar Vitest e escrever testes

**Files:**
- Modify: `games/runner-vanilla/package.json`
- Create: `games/runner-vanilla/vite.config.js`
- Create: `games/runner-vanilla/src/physics.test.js`

- [ ] **Adicionar vitest ao package.json**

`games/runner-vanilla/package.json`:

```json
{
  "name": "runner-vanilla",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "devDependencies": {
    "vite": "^8.0.4",
    "vitest": "^3.2.3"
  }
}
```

- [ ] **Instalar vitest**

```bash
cd games/runner-vanilla && npm install
```

Esperado: `vitest` aparece em `node_modules/.bin/vitest`.

- [ ] **Criar vite.config.js com configuração vitest**

`games/runner-vanilla/vite.config.js`:

```js
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/games/runner-vanilla/',
  test: {
    environment: 'node',
  },
})
```

- [ ] **Escrever os testes em physics.test.js**

`games/runner-vanilla/src/physics.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { FRAME_MS, normalizeDelta, calcSpeedMultiplier, shouldSpawn } from './physics.js'

describe('normalizeDelta', () => {
  it('retorna 1.0 para um frame perfeito de 60fps', () => {
    expect(normalizeDelta(FRAME_MS)).toBeCloseTo(1.0)
  })

  it('retorna ~2.4 para monitor 144Hz (delta ~6.94ms)', () => {
    expect(normalizeDelta(1000 / 144)).toBeCloseTo(2.4, 1)
  })

  it('retorna 0.5 para delta de metade do frame', () => {
    expect(normalizeDelta(FRAME_MS / 2)).toBeCloseTo(0.5)
  })
})

describe('calcSpeedMultiplier', () => {
  it('começa em 1.0 com score zero', () => {
    expect(calcSpeedMultiplier(0)).toBe(1.0)
  })

  it('permanece 1.0 antes de 1500 pontos', () => {
    expect(calcSpeedMultiplier(1499)).toBe(1.0)
  })

  it('sobe para 1.5 ao atingir 1500 pontos', () => {
    expect(calcSpeedMultiplier(1500)).toBe(1.5)
  })

  it('sobe para 2.0 ao atingir 3000 pontos', () => {
    expect(calcSpeedMultiplier(3000)).toBe(2.0)
  })

  it('aumenta em 0.5 a cada 1500 pontos', () => {
    const values = [0, 1500, 3000, 4500].map(calcSpeedMultiplier)
    expect(values).toEqual([1.0, 1.5, 2.0, 2.5])
  })
})

describe('shouldSpawn', () => {
  it('retorna false quando acumulador ainda não atingiu o intervalo', () => {
    expect(shouldSpawn(1499, 1500)).toBe(false)
  })

  it('retorna true quando acumulador atinge exatamente o intervalo', () => {
    expect(shouldSpawn(1500, 1500)).toBe(true)
  })

  it('retorna true quando acumulador passa do intervalo', () => {
    expect(shouldSpawn(1600, 1500)).toBe(true)
  })
})
```

- [ ] **Rodar os testes — devem passar**

```bash
cd games/runner-vanilla && npm test
```

Esperado:
```
✓ src/physics.test.js (9)
  ✓ normalizeDelta (3)
  ✓ calcSpeedMultiplier (5)
  ✓ shouldSpawn (3)

Test Files  1 passed (1)
Tests       9 passed (9)
```

- [ ] **Commit**

```bash
cd ../..
git add games/runner-vanilla/package.json games/runner-vanilla/vite.config.js games/runner-vanilla/src/physics.test.js games/runner-vanilla/package-lock.json
git commit -m "test: adiciona vitest e testes das funcoes de fisica no runner-vanilla"
```

---

## Task 7: runner-vanilla — Delta time em Player e Obstacle

**Files:**
- Modify: `games/runner-vanilla/src/Player.js`
- Modify: `games/runner-vanilla/src/Obstacle.js`

- [ ] **Substituir Player.js**

```js
import { normalizeDelta } from './physics.js'

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

  update(delta) {
    const dt = normalizeDelta(delta)
    this.vy += this.gravity * dt
    this.y += this.vy * dt
    if (this.y >= this.groundY) {
      this.y = this.groundY
      this.vy = 0
      this.isOnGround = true
    }
    if (this.isOnGround) {
      this.frameTimer += dt
      if (this.frameTimer >= 8) { this.frame = (this.frame + 1) % 2; this.frameTimer = 0 }
    }
  }

  draw(ctx) {
    const { x, y, width: w, height: h } = this
    ctx.fillStyle = '#2d6a1f'
    ctx.fillRect(x + 4, y + 14, w - 8, h - 14)
    ctx.fillRect(x + 8, y, w - 10, 18)
    ctx.fillStyle = '#fff'
    ctx.fillRect(x + w - 10, y + 4, 8, 8)
    ctx.fillStyle = '#111'
    ctx.fillRect(x + w - 8, y + 6, 4, 4)
    ctx.fillStyle = '#3a8a28'
    if (!this.isOnGround) {
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

- [ ] **Substituir Obstacle.js**

Apenas o método `update` muda — recebe `delta` agora:

```js
import { normalizeDelta } from './physics.js'

// ... (manter todas as funções drawBeetle, drawMosquito, etc. inalteradas)

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

  update(delta) { this.x -= this.speed * normalizeDelta(delta) }
  isOffScreen() { return this.x + this.width < 0 }

  draw(ctx) {
    DRAW_FNS[this.type](ctx, this.x, this.y, this.width, this.height)
  }
}
```

**Importante:** o início do arquivo Obstacle.js (as funções `drawBeetle`, `drawMosquito`, `drawCockroach`, `drawCricket`, `drawSpider`, os arrays `INSECT_TYPES`, `SCALES`, `DRAW_FNS`) deve ser mantido exatamente igual. Só adicionar o import de `normalizeDelta` no topo e modificar a classe `Obstacle`.

- [ ] **Commit**

```bash
git add games/runner-vanilla/src/Player.js games/runner-vanilla/src/Obstacle.js
git commit -m "fix: aplica delta time em Player e Obstacle no runner-vanilla"
```

---

## Task 8: runner-vanilla — GameLoop com delta time e spawn temporal

**Files:**
- Modify: `games/runner-vanilla/src/GameLoop.js`

- [ ] **Substituir GameLoop.js**

```js
import { Player } from './Player.js'
import { Obstacle } from './Obstacle.js'
import { normalizeDelta, calcSpeedMultiplier, shouldSpawn } from './physics.js'

const SPAWN_INTERVAL_MS = 1500

export class GameLoop {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.player = new Player(canvas)
    this.obstacles = []
    this.score = 0
    this.speedMultiplier = 1.0
    this.spawnAccumulator = 0
    this.lastTime = 0
    this.running = false
    this.isGameOver = false
    this.animId = null
    this.lastScore = parseInt(localStorage.getItem('dino_last_score') || '0')
  }

  get speed() { return this.speedMultiplier * 5 }

  _updateSpeed() {
    this.speedMultiplier = calcSpeedMultiplier(this.score)
  }

  _checkCollision(a, b) {
    return (
      a.x              < b.x + b.width  &&
      a.x + a.width    > b.x            &&
      a.y              < b.y + b.height &&
      a.y + a.height   > b.y
    )
  }

  _update(delta) {
    const dt = normalizeDelta(delta)
    this.score += dt
    this._updateSpeed()
    this.player.update(delta)

    this.spawnAccumulator += delta
    if (shouldSpawn(this.spawnAccumulator, SPAWN_INTERVAL_MS)) {
      this.obstacles.push(new Obstacle(this.canvas, this.speed))
      this.spawnAccumulator -= SPAWN_INTERVAL_MS
    }

    this.obstacles.forEach(o => o.update(delta))
    this.obstacles = this.obstacles.filter(o => !o.isOffScreen())

    for (const obs of this.obstacles) {
      if (this._checkCollision(this.player, obs)) {
        this.isGameOver = true
        this.running = false
        localStorage.setItem('dino_last_score', String(Math.floor(this.score)))
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
    ctx.fillText(`Score: ${Math.floor(this.score)}`, 16, 28)
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
      ctx.fillText(`Score: ${Math.floor(this.score)} | Último: ${this.lastScore}`, canvas.width / 2, canvas.height / 2 + 8)
      ctx.fillText('Espaço / Toque para reiniciar', canvas.width / 2, canvas.height / 2 + 36)
      ctx.textAlign = 'left'
    }
  }

  _loop(timestamp) {
    if (!this.running) return
    const delta = this.lastTime === 0 ? FRAME_MS : timestamp - this.lastTime
    this.lastTime = timestamp
    this._update(delta)
    this._draw()
    this.animId = requestAnimationFrame(ts => this._loop(ts))
  }

  start() {
    this.running = true
    this.lastTime = 0
    this.animId = requestAnimationFrame(ts => this._loop(ts))
  }

  stop() { this.running = false; cancelAnimationFrame(this.animId) }
}
```

- [ ] **Verificar que o `main.js` chama `loop.start()` corretamente**

```bash
grep -n "start\|loop\|restart" games/runner-vanilla/src/main.js | head -20
```

O `start()` não precisa de alterações — o `lastTime = 0` é resetado internamente.

- [ ] **Rodar os testes para garantir que physics.js ainda passa**

```bash
cd games/runner-vanilla && npm test
```

Esperado: 9 testes passando.

- [ ] **Commit**

```bash
cd ../..
git add games/runner-vanilla/src/GameLoop.js
git commit -m "fix: delta time e spawn temporal no GameLoop do runner-vanilla"
```

---

## Task 9: memory-vue — Stats persistentes e win overlay

**Files:**
- Modify: `games/memory-vue/src/App.vue`
- Modify: `games/memory-vue/src/style.css`

Substituir o `.win-banner` inline por um overlay fullscreen consistente com os outros jogos. Adicionar persistência de best time e best tentativas via localStorage.

- [ ] **Substituir App.vue completo**

```vue
<script setup>
import { ref, computed, onUnmounted } from 'vue'
import Board from './components/Board.vue'
import { createDeck } from './data/cards.js'

const STORAGE_KEY = 'memoryvue_stats'

function loadStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { gamesPlayed: 0, bestTime: null, bestAttempts: null }
  } catch {
    return { gamesPlayed: 0, bestTime: null, bestAttempts: null }
  }
}

function saveStats(s) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
}

const cards = ref(createDeck())
const flippedUids = ref([])
const attempts = ref(0)
const seconds = ref(0)
const gameStarted = ref(false)
const showWinOverlay = ref(false)
const stats = ref(loadStats())

let timerInterval = null

function startTimer() {
  if (!gameStarted.value) {
    gameStarted.value = true
    timerInterval = setInterval(() => { seconds.value++ }, 1000)
  }
}

function stopTimer() {
  clearInterval(timerInterval)
  timerInterval = null
}

onUnmounted(stopTimer)

const matchedCount = computed(() => cards.value.filter(c => c.isMatched).length)
const allMatched = computed(() => matchedCount.value === cards.value.length)
// isBlocked congela cliques enquanto 2 cartas estão viradas, dando tempo ao jogador de memorizá-las
const isBlocked = computed(() => flippedUids.value.length === 2)

const timeFormatted = computed(() => {
  const m = Math.floor(seconds.value / 60).toString().padStart(2, '0')
  const s = (seconds.value % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})

const isNewBestTime = computed(() =>
  stats.value.bestTime === null || seconds.value < stats.value.bestTime
)
const isNewBestAttempts = computed(() =>
  stats.value.bestAttempts === null || attempts.value < stats.value.bestAttempts
)

function flipCard(uid) {
  startTimer()
  flippedUids.value = [...flippedUids.value, uid]
  const card = cards.value.find(c => c.uid === uid)
  card.isFlipped = true

  if (flippedUids.value.length === 2) {
    attempts.value++
    const [a, b] = flippedUids.value.map(id => cards.value.find(c => c.uid === id))
    if (a.id === b.id) {
      a.isMatched = true
      b.isMatched = true
      flippedUids.value = []
      if (allMatched.value) {
        stopTimer()
        const newStats = {
          gamesPlayed: stats.value.gamesPlayed + 1,
          bestTime: isNewBestTime.value ? seconds.value : stats.value.bestTime,
          bestAttempts: isNewBestAttempts.value ? attempts.value : stats.value.bestAttempts,
        }
        stats.value = newStats
        saveStats(newStats)
        showWinOverlay.value = true
      }
    } else {
      setTimeout(() => {
        a.isFlipped = false
        b.isFlipped = false
        flippedUids.value = []
      }, 1000)
    }
  }
}

function resetGame() {
  stopTimer()
  cards.value = createDeck()
  flippedUids.value = []
  attempts.value = 0
  seconds.value = 0
  gameStarted.value = false
  showWinOverlay.value = false
}
</script>

<template>
  <div class="app">
    <header class="header">
      <div class="header-left">
        <a href="javascript:void(0)" class="back-link"
          onclick="window.close(); setTimeout(()=>{ if(!window.closed) location.href='/'; }, 300)">
          ← Voltar para o Portfólio
        </a>
      </div>
      <div class="title-area">
        <h1>🃏 Jogo da Memória Tech</h1>
        <div class="badges">
          <span class="badge">Vue 3</span>
          <span class="badge">Vite</span>
          <span class="badge">CSS Puro</span>
        </div>
      </div>
      <div class="header-right">
        <span v-if="stats.gamesPlayed > 0" class="stats-mini">
          🏆 {{ stats.gamesPlayed }} partidas
          <template v-if="stats.bestTime !== null">
            · ⏱ {{ Math.floor(stats.bestTime/60).toString().padStart(2,'0') }}:{{ (stats.bestTime%60).toString().padStart(2,'0') }}
          </template>
        </span>
      </div>
    </header>

    <main>
      <div class="stats">
        <span>⏱ {{ timeFormatted }}</span>
        <span>🃏 {{ matchedCount / 2 }}/8 pares</span>
        <button class="btn btn-sm" @click="resetGame">↺ Reiniciar</button>
      </div>

      <Board :cards="cards" :disabled="isBlocked" @flip="flipCard" />
    </main>

    <!-- Win overlay -->
    <Transition name="overlay">
      <div v-if="showWinOverlay" class="win-overlay" @click.self="showWinOverlay = false">
        <div class="win-modal">
          <p class="win-emoji">🎉</p>
          <h2 class="win-title">Você venceu!</h2>
          <div class="win-stats">
            <div class="win-stat">
              <span class="win-stat-value">{{ attempts }}</span>
              <span class="win-stat-label">tentativas</span>
            </div>
            <div class="win-stat">
              <span class="win-stat-value">{{ timeFormatted }}</span>
              <span class="win-stat-label">tempo</span>
            </div>
          </div>
          <div v-if="isNewBestTime || isNewBestAttempts" class="win-records">
            <span v-if="isNewBestTime" class="record-badge">🥇 Melhor tempo!</span>
            <span v-if="isNewBestAttempts" class="record-badge">🥇 Menos tentativas!</span>
          </div>
          <div v-if="stats.gamesPlayed > 1" class="win-history">
            <span>Melhor: {{ Math.floor(stats.bestTime/60).toString().padStart(2,'0') }}:{{ (stats.bestTime%60).toString().padStart(2,'0') }} · {{ stats.bestAttempts }} tentativas</span>
          </div>
          <button class="btn" @click="resetGame">Jogar novamente</button>
        </div>
      </div>
    </Transition>
  </div>
</template>
```

- [ ] **Adicionar estilos do win overlay no style.css**

Adicionar ao final de `games/memory-vue/src/style.css`:

```css
.header-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}
.stats-mini {
  font-size: 0.75rem;
  color: #8b5cf6;
  white-space: nowrap;
}

/* Win overlay */
.win-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(13,10,26,0.88);
  backdrop-filter: blur(4px);
}
.win-modal {
  background: #1a1230;
  border: 2px solid #22c55e;
  border-radius: 1.25rem;
  padding: 2.5rem 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  max-width: 340px;
  width: 90%;
}
.win-emoji { font-size: 3rem; line-height: 1; }
.win-title { font-size: 1.75rem; font-weight: 800; color: #22c55e; margin: 0; }
.win-stats {
  display: flex;
  gap: 2rem;
  margin: 0.5rem 0;
}
.win-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.win-stat-value { font-size: 1.5rem; font-weight: 700; color: #f1f5f9; }
.win-stat-label { font-size: 0.7rem; color: #8b5cf6; text-transform: uppercase; letter-spacing: 0.05em; }
.win-records { display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center; }
.record-badge {
  background: rgba(234,179,8,0.15);
  border: 1px solid #eab308;
  color: #eab308;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 999px;
}
.win-history { font-size: 0.8rem; color: #6b7280; }

/* Transition */
.overlay-enter-active, .overlay-leave-active { transition: opacity 0.2s ease; }
.overlay-enter-from, .overlay-leave-to { opacity: 0; }
```

- [ ] **Commit**

```bash
git add games/memory-vue/src/App.vue games/memory-vue/src/style.css
git commit -m "feat: win overlay com stats persistentes no memory-vue"
```

---

## Task 10: typing-svelte — UFO Enemy redesign

**Files:**
- Modify: `games/typing-svelte/src/components/Enemy.svelte`

O alien passa a aparecer "sentado" em cima de um disco voador. A variável `color` (já existente, por `enemy.type`) aplica no corpo do alien, no disco e nas 5 luzes — mantendo os 7 visuais distintos.

- [ ] **Substituir Enemy.svelte**

```svelte
<script>
  export let enemy

  const COLORS = [
    '#06b6d4',
    '#22c55e',
    '#a855f7',
    '#f97316',
    '#ec4899',
    '#ef4444',
    '#eab308',
  ]

  $: color = COLORS[enemy.type ?? 0]
</script>

<div class="enemy" style="left: {enemy.x}px; top: {enemy.y}px">
  <svg width="60" height="50" viewBox="0 0 60 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Antenas -->
    <line x1="23" y1="13" x2="17" y2="4" stroke={color} stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="16" cy="3" r="2.5" fill={color}/>
    <line x1="37" y1="13" x2="43" y2="4" stroke={color} stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="44" cy="3" r="2.5" fill={color}/>

    <!-- Corpo do alien -->
    <ellipse cx="30" cy="21" rx="13" ry="11" fill={color} opacity="0.9"/>
    <!-- Olhos -->
    <circle cx="25" cy="18" r="3.5" fill="white"/>
    <circle cx="35" cy="18" r="3.5" fill="white"/>
    <circle cx="26" cy="19" r="1.8" fill="#111"/>
    <circle cx="36" cy="19" r="1.8" fill="#111"/>
    <!-- Sorriso -->
    <path d="M24 26 Q30 30 36 26" stroke="white" stroke-width="1.5" fill="none" stroke-linecap="round"/>

    <!-- Disco — sombra de profundidade -->
    <ellipse cx="30" cy="39" rx="28" ry="8" fill={color} opacity="0.18"/>
    <!-- Disco — superfície principal -->
    <ellipse cx="30" cy="37" rx="28" ry="8" fill="#0f172a" stroke={color} stroke-width="1.5"/>
    <!-- Luzes do disco -->
    <circle cx="10" cy="37" r="2.5" fill={color} opacity="0.9"/>
    <circle cx="20" cy="41" r="2.5" fill={color} opacity="0.75"/>
    <circle cx="30" cy="42" r="2.5" fill={color}/>
    <circle cx="40" cy="41" r="2.5" fill={color} opacity="0.75"/>
    <circle cx="50" cy="37" r="2.5" fill={color} opacity="0.9"/>
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

- [ ] **Commit**

```bash
git add games/typing-svelte/src/components/Enemy.svelte
git commit -m "feat: redesenha aliens como OVNIs coloridos no typing-svelte"
```

---

## Task 11: typing-svelte — Expandir comandos

**Files:**
- Modify: `games/typing-svelte/src/data/commands.js`

- [ ] **Substituir commands.js**

```js
export const COMMANDS = [
  // Git
  'git push',
  'git commit',
  'git status',
  'git pull',
  'git clone',
  'git merge',
  'git stash',
  'git log',
  'git diff',
  'git reset',
  'git fetch',
  // npm
  'npm install',
  'npm run dev',
  'npm run build',
  'npm start',
  'npm test',
  'npm init',
  'npm audit',
  // Docker
  'docker run',
  'docker build',
  'docker pull',
  'docker ps',
  // Python
  'pip install',
  'python -m venv',
  // Rust / Cargo
  'cargo build',
  'cargo run',
  'cargo test',
  // Go
  'go build',
  'go test',
  // Yarn
  'yarn dev',
  'yarn build',
  'yarn add',
  // Misc
  'make build',
]

export function shuffleCommands() {
  const arr = [...COMMANDS]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
```

- [ ] **Commit**

```bash
git add games/typing-svelte/src/data/commands.js
git commit -m "feat: expande lista de comandos para 33 no typing-svelte"
```

---

## Task 12: typing-svelte — Velocidade progressiva e HUD

**Files:**
- Modify: `games/typing-svelte/src/App.svelte`

Aumentar incremento de velocidade para `+0.1 a cada 10s`, adicionar cap em `3.0`, e exibir indicador de velocidade no HUD com cor dinâmica.

- [ ] **Atualizar constantes e timer de velocidade**

Em `games/typing-svelte/src/App.svelte`, localizar e alterar:

```js
// ANTES
speedTimerId = setInterval(() => { fallSpeed += 0.05 }, 15000)

// DEPOIS
speedTimerId = setInterval(() => { fallSpeed = Math.min(fallSpeed + 0.1, 3.0) }, 10000)
```

Aplicar em ambos os locais: no `onMount` e no `restart`.

- [ ] **Adicionar computed de cor de velocidade e multiplicador visível**

Após a declaração de `fallSpeed`, adicionar:

```js
const INITIAL_SPEED = 0.4
$: speedMultiplier = fallSpeed / INITIAL_SPEED
$: speedColor = speedMultiplier < 2 ? '#22c55e' : speedMultiplier < 3 ? '#eab308' : '#ef4444'
```

- [ ] **Atualizar o HUD no template**

Localizar a div `.hud` e substituir:

```svelte
<!-- ANTES -->
<div class="hud">
  <span>❤️ {$lives}</span>
  <span>🏆 {$score}</span>
</div>

<!-- DEPOIS -->
<div class="hud">
  <span>❤️ {$lives}</span>
  <span>🏆 {$score}</span>
  <span style="color: {speedColor}">⚡ {speedMultiplier.toFixed(1)}×</span>
</div>
```

- [ ] **Commit**

```bash
git add games/typing-svelte/src/App.svelte
git commit -m "feat: velocidade progressiva perceptivel e indicador no HUD do typing-svelte"
```

---

## Task 13: Build e Deploy

**Files:**
- Rodar builds e deploy script

- [ ] **Rodar build de todos os jogos**

```bash
cd games && npm run build:all
```

Esperado — saída sem erros, seguida de:
```
✓ memory-vue → public/games/memory-vue
✓ termo-react → public/games/termo-react
✓ runner-vanilla → public/games/runner-vanilla
✓ typing-svelte → public/games/typing-svelte
```

Se algum build falhar, verificar o erro antes de prosseguir.

- [ ] **Verificar tamanho do CSS do termo-react (deve ser >> 382 bytes)**

```bash
ls -lh public/games/termo-react/assets/*.css
```

Esperado: arquivo CSS > 10KB (Tailwind gerado com utilitários).

- [ ] **Verificar que os 4 dists estão em public/games/**

```bash
ls public/games/
```

Esperado: `memory-vue  runner-vanilla  termo-react  typing-svelte`

- [ ] **Commit final**

```bash
git add public/games/
git commit -m "build: rebuild todos os minijogos com correcoes e melhorias"
```

---

## Testes Manuais de Aceitação

Após o deploy, verificar cada item:

**Abas:**
- [ ] Portfólio → clicar "Jogar" (qualquer jogo) → 1 aba nova abre
- [ ] Na aba do jogo → clicar "← Voltar para o Portfólio" → aba fecha, portfólio fica em foco → **1 aba total**
- [ ] Abrir jogo diretamente pela URL `/games/memory-vue/` → clicar "Voltar" → navega para `/`

**Wordle Tech:**
- [ ] Grid 6×5 renderiza com células quadradas bem espaçadas
- [ ] Teclado visível com todas as teclas
- [ ] Letras corretas aparecem verdes, presentes amarelas, ausentes cinzas
- [ ] Game over mostra letras em cinza neutro (não verde)

**Fuga do Dino:**
- [ ] Jogar por 30s em monitor 60Hz e 144Hz — score e velocidade visualmente equivalentes
- [ ] Obstáculos aparecem em intervalos regulares (~1.5s) independente do Hz

**Memory Vue:**
- [ ] Ao completar os 8 pares, overlay fullscreen aparece com animação
- [ ] Stats (tentativas, tempo) exibidas no overlay
- [ ] Badge "🥇 Melhor tempo!" aparece quando bate o recorde
- [ ] Stats persistem após refresh da página

**Defesa Espacial:**
- [ ] 7 tipos de OVNI com cores distintas (ciano, verde, roxo, laranja, rosa, vermelho, amarelo)
- [ ] Comandos de docker, python, cargo, go, yarn aparecem além de git e npm
- [ ] HUD mostra `⚡ 1.0×` no início
- [ ] Após ~10s, indicador sobe para `⚡ 1.3×` e muda de cor
- [ ] Após ~30s, velocidade claramente mais alta que no início
