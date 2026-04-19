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
