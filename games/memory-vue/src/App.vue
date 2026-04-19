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
