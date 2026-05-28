<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Service } from '@/data/services'
defineProps<{ service: Service }>()
</script>

<template>
  <RouterLink :to="`/services/${service.slug}`" class="card">
    <div class="card-inner">
      <div class="icon-wrap">
        <span class="icon">{{ service.icon }}</span>
      </div>
      <div class="body">
        <h3>{{ service.title }}</h3>
        <p>{{ service.description }}</p>
        <span class="more">
          {{ $t('serviceCard.more') }}
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </div>
    </div>
    <div class="accent-bar" />
  </RouterLink>
</template>

<style scoped>
.card {
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  color: var(--color-text);
  text-decoration: none;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
  position: relative;
}

.card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 12px 36px -12px rgba(26, 79, 156, 0.22);
  transform: translateY(-3px);
}

.card-inner {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-6);
  flex: 1;
}

.icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: var(--color-primary-soft);
  display: grid;
  place-items: center;
  transition: background 0.2s;
}

.card:hover .icon-wrap {
  background: var(--color-primary);
}

.icon {
  font-size: 24px;
  filter: saturate(0.9);
  transition: filter 0.2s;
}

.card:hover .icon {
  filter: saturate(0) brightness(10);
}

.body {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  flex: 1;
}

h3 {
  font-size: 17px;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.3;
}

p {
  color: var(--color-text-muted);
  font-size: 14px;
  line-height: 1.6;
  flex: 1;
}

.more {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--color-primary);
  font-size: 13.5px;
  font-weight: 600;
  margin-top: var(--space-2);
  transition: gap 0.2s;
}

.more svg {
  width: 14px;
  height: 14px;
  transition: transform 0.2s;
}

.card:hover .more {
  gap: 10px;
}

.card:hover .more svg {
  transform: translateX(2px);
}

.accent-bar {
  height: 3px;
  background: var(--color-primary);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.25s ease;
}

.card:hover .accent-bar {
  transform: scaleX(1);
}
</style>
