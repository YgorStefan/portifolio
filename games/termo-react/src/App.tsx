import { useState, useEffect, useCallback } from 'react'
import Grid from './components/Grid'
import Keyboard from './components/Keyboard'
import GameOverlay from './components/GameOverlay'
import type { GuessRow, LetterState, Stats } from './types'
import { validateGuess, loadStats, saveStats, resetStats } from './utils/gameLogic'
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
      <header className="flex items-center justify-between px-6 py-4" style={{ background: '#0f2a18', borderBottom: '1px solid #14532d', position: 'relative' }}>
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
        <div className="flex flex-col items-center gap-2" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}>
          <h1 className="text-xl font-bold">🟩 Wordle Tech</h1>
          <div className="flex gap-2">
            {['React', 'TypeScript', 'Tailwind'].map(b => (
              <span key={b} className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ border: '1px solid rgba(34,197,94,0.4)', background: 'rgba(34,197,94,0.1)', color: '#4ade80' }}>{b}</span>
            ))}
          </div>
        </div>
        <div />
      </header>

      <main className="flex flex-1 items-center justify-center gap-8 px-4 py-6">
        <div className="flex flex-col items-center">
          {message && (
            <div className="mb-4 px-4 py-2 rounded text-sm font-semibold" style={{ background: '#0f2a18', color: '#f1f5f9' }}>{message}</div>
          )}
          <Grid rows={rows} currentRow={currentRow} currentLetters={currentLetters} />
          <Keyboard letterStates={letterStates} onKey={handleKey} />
        </div>

        <div className="flex flex-col gap-3 text-sm" style={{ minWidth: '110px' }}>
          <span className="px-3 py-1.5 rounded font-semibold text-center" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid #22c55e' }}>✓ {stats.wins}<br/><span className="text-xs font-normal opacity-75">vitórias</span></span>
          <span className="px-3 py-1.5 rounded font-semibold text-center" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid #ef4444' }}>✗ {stats.losses}<br/><span className="text-xs font-normal opacity-75">derrotas</span></span>
          {stats.streak > 0 && <span className="px-3 py-1.5 rounded font-semibold text-center" style={{ background: 'rgba(234,179,8,0.15)', color: '#eab308', border: '1px solid #eab308' }}>🔥 {stats.streak}<br/><span className="text-xs font-normal opacity-75">seguidas</span></span>}
          <button
            onClick={() => { resetStats(); setStats({ wins: 0, losses: 0, streak: 0, lastPlayed: '', lastResult: null }) }}
            className="px-3 py-1.5 rounded font-semibold text-xs"
            style={{ background: 'rgba(107,114,128,0.15)', color: '#9ca3af', border: '1px solid #4b5563' }}
          >
            Resetar
          </button>
        </div>
      </main>
    </div>
  )
}
