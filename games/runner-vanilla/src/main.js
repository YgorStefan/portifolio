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
