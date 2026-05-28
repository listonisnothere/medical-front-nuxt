<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

type IconKey = 'heart' | 'pulse' | 'stethoscope' | 'hospital'

interface Direction {
  icon: IconKey
  title: string
  desc: string
}

const items = computed<Direction[]>(() => [
  { icon: 'heart', title: t('home.directions.diagTitle'), desc: t('home.directions.diagDesc') },
  { icon: 'pulse', title: t('home.directions.monTitle'), desc: t('home.directions.monDesc') },
  { icon: 'stethoscope', title: t('home.directions.resTitle'), desc: t('home.directions.resDesc') },
  { icon: 'hospital', title: t('home.directions.equipTitle'), desc: t('home.directions.equipDesc') },
])
</script>

<template>
  <div>
    <header class="section-header">
      <span class="eyebrow">{{ $t('home.directions.eyebrow') }}</span>
    </header>
    <div class="grid">
      <article v-for="d in items" :key="d.title" class="card">
        <div class="icon" aria-hidden="true">
          <svg v-if="d.icon === 'heart'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
            <path d="M3.22 12H9.5l.5-1 2 4 2-6 1.5 3h5.27" />
          </svg>
          <svg v-else-if="d.icon === 'pulse'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12h4l3-9 4 18 3-9h4" />
          </svg>
          <svg v-else-if="d.icon === 'stethoscope'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .2.3" />
            <path d="M8 15v3a4 4 0 0 0 8 0v-3" />
            <circle cx="20" cy="10" r="2" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 6v4M10 8h4M18 22V8l-6-4-6 4v14" />
            <path d="M2 22h20" />
            <path d="M10 22V16h4v6" />
          </svg>
        </div>
        <h3>{{ d.title }}</h3>
        <p>{{ d.desc }}</p>
      </article>
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
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow);
}

.icon {
  color: var(--color-primary);
  width: 32px;
  height: 32px;
}

.icon svg {
  width: 100%;
  height: 100%;
}

h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
  margin-top: var(--space-4);
}

p {
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text-muted);
}

@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 560px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
