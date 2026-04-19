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
