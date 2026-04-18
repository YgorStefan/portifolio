<script setup>
import Card from './Card.vue'
defineProps({ cards: Array, disabled: Boolean })
defineEmits(['flip'])
</script>

<template>
  <div class="board">
    <Card
      v-for="card in cards"
      :key="card.uid"
      :card="card"
      :disabled="disabled"
      @flip="$emit('flip', $event)"
    />
  </div>
</template>

<style scoped>
.board {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
}
@media (max-width: 480px) {
  .board { gap: 8px; }
}
</style>
