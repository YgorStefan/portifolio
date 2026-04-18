<script setup>
const props = defineProps({ card: Object, disabled: Boolean })
const emit = defineEmits(['flip'])

function handleClick() {
  if (!props.disabled && !props.card.isFlipped && !props.card.isMatched) {
    emit('flip', props.card.uid)
  }
}
</script>

<template>
  <div
    class="card"
    :class="{ flipped: card.isFlipped || card.isMatched, matched: card.isMatched }"
    @click="handleClick"
  >
    <div class="card-inner">
      <div class="card-front">❓</div>
      <div class="card-back">
        <span class="emoji">{{ card.emoji }}</span>
        <span class="label">{{ card.label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  perspective: 1000px;
  cursor: pointer;
  aspect-ratio: 1;
}
.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.5s ease;
}
.card.flipped .card-inner {
  transform: rotateY(180deg);
}
.card-front,
.card-back {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
  border-radius: 12px;
  font-size: 2rem;
  border: 2px solid #334155;
  background: #1e293b;
  user-select: none;
}
.card-back {
  transform: rotateY(180deg);
  background: #0f172a;
  gap: 6px;
}
.card.matched .card-front,
.card.matched .card-back {
  border-color: #22c55e;
  background: #052e16;
}
.label {
  font-size: 0.65rem;
  color: #94a3b8;
}
</style>
