import { WORDS } from './wordList'
import type { LetterState, Stats } from '../types'

export function getDailyWord(): string {
  const start = new Date(new Date().getFullYear(), 0, 0)
  const diff = +new Date() - +start
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24))
  return WORDS[dayOfYear % WORDS.length]
}

// Uso duas passagens: na primeira marco as posições exatas; na segunda verifico
// as letras restantes para evitar contar duplicatas duas vezes.
export function validateGuess(guess: string, target: string): LetterState[] {
  const result: LetterState[] = Array(5).fill('absent')
  const targetArr = target.split('')
  const guessArr = guess.split('')

  guessArr.forEach((letter, i) => {
    if (letter === targetArr[i]) {
      result[i] = 'correct'
      targetArr[i] = ''
    }
  })

  guessArr.forEach((letter, i) => {
    if (result[i] !== 'correct') {
      const idx = targetArr.indexOf(letter)
      if (idx !== -1) {
        result[i] = 'present'
        targetArr[idx] = ''
      }
    }
  })

  return result
}

export function loadStats(): Stats {
  return { wins: 0, losses: 0, streak: 0, lastPlayed: '', lastResult: null }
}

export function saveStats(_stats: object) {}
