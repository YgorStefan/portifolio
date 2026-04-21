const CDN = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons'

export const TECHS = [
  { id: 'js',     label: 'JavaScript', img: `${CDN}/javascript/javascript-original.svg` },
  { id: 'react',  label: 'React',      emoji: '⚛️' },
  { id: 'python', label: 'Python',     emoji: '🐍' },
  { id: 'vue',    label: 'Vue',        emoji: '💚' },
  { id: 'css',    label: 'CSS',        emoji: '🎨' },
  { id: 'docker', label: 'Docker',     emoji: '🐳' },
  { id: 'git',    label: 'Git',        emoji: '🔀' },
  { id: 'node',   label: 'Node.js',    img: `${CDN}/nodejs/nodejs-original.svg` },
]

export function createDeck() {
  const deck = [...TECHS, ...TECHS]
    .map((tech, i) => ({ uid: i, ...tech, isFlipped: false, isMatched: false }))
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}
