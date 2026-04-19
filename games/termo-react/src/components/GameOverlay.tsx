interface Props {
  status: 'won' | 'lost'
  target: string
  attempts: number
  onNext: () => void
}

export default function GameOverlay({ status, target, attempts, onNext }: Props) {
  const isWin = status === 'won'
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backdropFilter: 'blur(4px)', background: isWin ? 'rgba(2,44,14,0.85)' : 'rgba(44,2,2,0.85)' }}>
      <div className="flex flex-col items-center gap-6 p-8 rounded-2xl"
        style={{ border: `2px solid ${isWin ? '#22c55e' : '#ef4444'}`, background: isWin ? '#071a0d' : '#1a0707' }}>
        <p className="text-4xl font-bold" style={{ color: isWin ? '#22c55e' : '#ef4444' }}>
          {isWin ? '🎉 Você acertou!' : '😞 Fim de Jogo'}
        </p>
        <div className="flex gap-2">
          {target.split('').map((letter, i) => (
            <div key={i} className="w-12 h-12 flex items-center justify-center rounded font-bold text-xl text-white"
              style={{ background: '#22c55e', border: '2px solid #16a34a' }}>
              {letter}
            </div>
          ))}
        </div>
        {isWin && <p className="text-gray-300 text-sm">Em {attempts} tentativas</p>}
        <button onClick={onNext}
          className="px-6 py-2 rounded font-semibold text-white"
          style={{ background: isWin ? '#22c55e' : '#ef4444' }}>
          {isWin ? 'Próxima Palavra' : 'Tentar Novamente'}
        </button>
      </div>
    </div>
  )
}
