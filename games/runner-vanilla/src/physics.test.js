import { describe, it, expect } from 'vitest'
import { FRAME_MS, normalizeDelta, calcSpeedMultiplier, shouldSpawn } from './physics.js'

describe('normalizeDelta', () => {
  it('retorna 1.0 para um frame perfeito de 60fps', () => {
    expect(normalizeDelta(FRAME_MS)).toBeCloseTo(1.0)
  })

  it('retorna ~0.42 para monitor 144Hz (delta ~6.94ms)', () => {
    expect(normalizeDelta(1000 / 144)).toBeCloseTo(1000 / 144 / FRAME_MS, 2)
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
