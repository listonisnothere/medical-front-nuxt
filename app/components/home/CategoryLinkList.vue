<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useCategoriesDataStore } from '@/stores/categoriesData'

const store = useCategoriesDataStore()
onMounted(() => store.load())
</script>

<template>
  <ul class="cats">
    <li v-for="c in store.items" :key="c.slug">
      <RouterLink :to="`/catalog/${c.slug}`">
        <span class="cat-label">{{ c.title }}</span>
        <span class="cat-arrow">
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </RouterLink>
    </li>
  </ul>
</template>

<style scoped>
.cats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-2);
}

.cats a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: 14px var(--space-4);
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  font-weight: 500;
  font-size: 14.5px;
  color: var(--color-text);
  transition: background 0.15s, border-color 0.15s, color 0.15s, box-shadow 0.15s;
}

.cats a:hover {
  background: var(--color-primary-soft);
  border-color: var(--color-primary);
  color: var(--color-primary);
  box-shadow: 0 2px 12px -6px rgba(26, 79, 156, 0.2);
}

.cat-arrow {
  width: 16px;
  height: 16px;
  color: var(--color-primary);
  flex-shrink: 0;
  transition: transform 0.2s;
}

.cat-arrow svg {
  width: 16px;
  height: 16px;
}

.cats a:hover .cat-arrow {
  transform: translateX(3px);
}
</style>
