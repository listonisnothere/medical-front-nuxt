<script setup lang="ts">
import type { City } from '@/stores/citiesData'

defineProps<{ city: City }>()
</script>

<template>
  <div class="city-delivery-banner">
    <span class="icon" aria-hidden="true">🚚</span>
    <span>Доставка по <strong>{{ city.namePrep }}</strong> за 2–5 рабочих дней. КП за 2 часа.</span>
  </div>
</template>

<style scoped>
.city-delivery-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  font-size: 13.5px;
  color: var(--color-text-muted);
  margin-bottom: var(--space-4);
}

.icon {
  font-size: 18px;
  flex-shrink: 0;
}
</style>
