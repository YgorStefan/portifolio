export const TECHS = [
  { id: 'js',     label: 'JavaScript', emoji: '🟨' },
  { id: 'react',  label: 'React',      emoji: '⚛️' },
  { id: 'python', label: 'Python',     emoji: '🐍' },
  { id: 'vue',    label: 'Vue',        emoji: '💚' },
  { id: 'css',    label: 'CSS',        emoji: '🎨' },
  { id: 'docker', label: 'Docker',     emoji: '🐳' },
  { id: 'git',    label: 'Git',        emoji: '🔀' },
  { id: 'node',   label: 'Node.js',    emoji: '🟩' },
]

export function createDeck() {
  return [...TECHS, ...TECHS]
    .map((tech, i) => ({ uid: i, ...tech, isFlipped: false, isMatched: false }))
    .sort(() => Math.random() - 0.5)
}
