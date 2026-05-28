<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const items = computed(() => [
  { title: t('home.whyUs.certifiedTitle'), desc: t('home.whyUs.certifiedDesc') },
  { title: t('home.whyUs.serviceTitle'), desc: t('home.whyUs.serviceDesc') },
  { title: t('home.whyUs.tailoredTitle'), desc: t('home.whyUs.tailoredDesc') },
  { title: t('home.whyUs.coverageTitle'), desc: t('home.whyUs.coverageDesc') },
])
</script>

<template>
  <div>
    <header class="section-header">
      <span class="eyebrow">{{ $t('home.whyUs.eyebrow') }}</span>
    </header>
    <div class="grid">
      <div v-for="it in items" :key="it.title" class="item">
        <div class="check" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>
        <div class="body">
          <h3>{{ it.title }}</h3>
          <p>{{ it.desc }}</p>
        </div>
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
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6) var(--space-7);
}

.item {
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
}

.check {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  color: var(--color-primary);
  margin-top: 2px;
}

.check svg {
  width: 100%;
  height: 100%;
}

h3 {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--space-1);
}

p {
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text-muted);
}

@media (max-width: 900px) {
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
