<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useProductsDataStore } from '@/stores/productsData'
import ProductCard from '../ui/ProductCard.vue'

const store = useProductsDataStore()
onMounted(() => store.load())

const tabs = [
  { id: 'ultrasound', label: 'Ультразвуковая диагностика' },
  { id: 'anesthesia', label: 'Реанимация и анестезиология' },
  { id: 'ct', label: 'Лучевая диагностика' },
  { id: 'endoscopy', label: 'Гибкая эндоскопия' },
  { id: 'sale', label: 'Спецпредложения' },
]

const active = ref(tabs[0]!.id)

const filtered = computed(() => {
  if (active.value === 'sale') return store.items.filter((p) => p.badge === 'Акция')
  if (active.value === 'ct') return store.items.filter((p) => p.category === 'ct' || p.category === 'mri')
  return store.items.filter((p) => p.category === active.value).slice(0, 4)
})
</script>

<template>
  <div>
    <div class="tabs" role="tablist">
      <button
        v-for="t in tabs"
        :key="t.id"
        role="tab"
        :aria-selected="active === t.id"
        :class="{ active: active === t.id }"
        @click="active = t.id"
      >
        {{ t.label }}
      </button>
    </div>

    <div v-if="store.loading" class="loading">Загрузка...</div>
    <div v-else class="grid">
      <ProductCard v-for="p in filtered" :key="p.id" :product="p" />
    </div>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-5);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--space-3);
}
.tabs button {
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-muted);
  border: 1px solid transparent;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.tabs button:hover {
  color: var(--color-primary);
}
.tabs button.active {
  background: var(--color-primary);
  color: #fff;
}
.loading {
  padding: var(--space-6);
  text-align: center;
  color: var(--color-text-muted);
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--space-4);
}
</style>
