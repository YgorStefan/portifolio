export const COMMANDS = [
  'git push',
  'npm install',
  'git commit',
  'npm run dev',
  'git status',
  'npm run build',
  'git pull',
  'npm start',
  'git clone',
  'git merge',
  'git stash',
  'npm test',
  'git log',
  'npm init',
  'git diff',
  'git reset',
  'npm audit',
  'git fetch',
]

export function shuffleCommands() {
  const arr = [...COMMANDS]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
