<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const stats = computed(() => [
  { value: '100+', label: t('home.stats.unitsSupplied') },
  { value: '20+', label: t('home.stats.partners') },
  { value: '5+', label: t('home.stats.regions') },
  { value: '10+', label: t('home.stats.brands') },
])
</script>

<template>
  <div>
    <header class="section-header">
      <span class="eyebrow">{{ $t('home.stats.eyebrow') }}</span>
    </header>
    <div class="grid">
      <div v-for="s in stats" :key="s.label" class="card">
        <div class="value">{{ s.value }}</div>
        <p>{{ s.label }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.section-header {
  margin-bottom: var(--space-5);
}

.eyebrow {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
}

.card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.value {
  font-family: var(--font-display);
  font-size: clamp(36px, 4vw, 48px);
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.03em;
  line-height: 1;
}

p {
  font-size: 14px;
  line-height: 1.5;
  color: var(--color-text-muted);
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
