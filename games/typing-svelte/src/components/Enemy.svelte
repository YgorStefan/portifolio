<script>
  export let enemy

  const COLORS = [
    '#06b6d4',
    '#22c55e',
    '#a855f7',
    '#f97316',
    '#ec4899',
    '#ef4444',
    '#eab308',
  ]

  $: color = COLORS[enemy.type ?? 0]
</script>

<div class="enemy" style="left: {enemy.x}px; top: {enemy.y}px">
  <svg width="40" height="36" viewBox="0 0 40 36" fill="none">
    <ellipse cx="20" cy="20" rx="14" ry="12" fill={color} opacity="0.9"/>
    <circle cx="13" cy="16" r="4" fill="white"/>
    <circle cx="27" cy="16" r="4" fill="white"/>
    <circle cx="14" cy="17" r="2" fill="#111"/>
    <circle cx="28" cy="17" r="2" fill="#111"/>
    <line x1="13" y1="8" x2="8" y2="2" stroke={color} stroke-width="2"/>
    <circle cx="7" cy="1" r="2" fill={color}/>
    <line x1="27" y1="8" x2="32" y2="2" stroke={color} stroke-width="2"/>
    <circle cx="33" cy="1" r="2" fill={color}/>
    <line x1="6" y1="22" x2="0" y2="18" stroke={color} stroke-width="2"/>
    <line x1="6" y1="26" x2="0" y2="26" stroke={color} stroke-width="2"/>
    <line x1="6" y1="30" x2="0" y2="34" stroke={color} stroke-width="2"/>
    <line x1="34" y1="22" x2="40" y2="18" stroke={color} stroke-width="2"/>
    <line x1="34" y1="26" x2="40" y2="26" stroke={color} stroke-width="2"/>
    <line x1="34" y1="30" x2="40" y2="34" stroke={color} stroke-width="2"/>
    <path d="M14 26 Q20 30 26 26" stroke="white" stroke-width="1.5" fill="none"/>
  </svg>
  <div class="command">{enemy.command}</div>
</div>

<style>
.enemy {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  pointer-events: none;
}
.command {
  background: #011520;
  border: 1px solid #0a3a50;
  color: #06b6d4;
  font-family: 'Courier New', monospace;
  font-size: 0.78rem;
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap;
}
</style>
