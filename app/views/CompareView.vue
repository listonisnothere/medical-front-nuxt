<script setup lang="ts">
import { computed } from 'vue'
import AppContainer from '@/components/ui/AppContainer.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useCompareStore } from '@/stores/compare'
import { useProductsDataStore } from '@/stores/productsData'
import { useMeta } from '@/composables/useMeta'

useMeta({ title: () => 'Сравнение товаров', noindex: true })
const compare = useCompareStore()
const store = useProductsDataStore()

const items = computed(() => store.items.filter((p) => compare.has(p.id)))

await useAsyncData('productsData', () => store.load())
</script>

<template>
  <AppContainer>
    <Breadcrumbs :items="[{ label: $t('compare.breadcrumb') }]" />
    <SectionHeading :level="1">
      {{ $t('compare.title') }}
      <template #sub>{{ items.length }} {{ $t('compare.inCompare') }}</template>
    </SectionHeading>

    <div v-if="store.loading" class="loading">{{ $t('compare.loading') }}</div>
    <div v-else-if="items.length" class="table-wrap">
      <table class="cmp">
        <thead>
          <tr>
            <th></th>
            <th v-for="p in items" :key="p.id">
              <img :src="p.image" :alt="p.name" />
              <strong>{{ p.name }}</strong>
              <button class="remove" @click="compare.remove(p.id)">{{ $t('compare.remove') }}</button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>{{ $t('compare.brand') }}</th>
            <td v-for="p in items" :key="p.id">{{ p.brand }}</td>
          </tr>
          <tr>
            <th>{{ $t('compare.class') }}</th>
            <td v-for="p in items" :key="p.id">{{ p.productClass }}</td>
          </tr>
          <tr>
            <th>{{ $t('compare.price') }}</th>
            <td v-for="p in items" :key="p.id">{{ p.price }}</td>
          </tr>
          <tr>
            <th>{{ $t('compare.availability') }}</th>
            <td v-for="p in items" :key="p.id">{{ p.badge ?? $t('compare.onOrder') }}</td>
          </tr>
        </tbody>
      </table>

      <div class="actions">
        <BaseButton variant="ghost" @click="compare.clear()">{{ $t('compare.clear') }}</BaseButton>
      </div>
    </div>

    <div v-else class="empty">
      <p>{{ $t('compare.empty') }}</p>
      <BaseButton to="/catalog" variant="primary">{{ $t('compare.toCatalog') }}</BaseButton>
    </div>
  </AppContainer>
</template>

<style scoped>
.loading {
  padding: var(--space-7);
  text-align: center;
  color: var(--color-text-muted);
}
.table-wrap {
  overflow-x: auto;
}
.cmp {
  width: 100%;
  border-collapse: collapse;
  min-width: 640px;
}
.cmp th,
.cmp td {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border);
  text-align: left;
  font-size: 14px;
  vertical-align: top;
}
.cmp thead th {
  width: 220px;
  border-bottom: 1px solid var(--color-border-strong);
}
.cmp thead img {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  border-radius: var(--radius);
  margin-bottom: var(--space-2);
}
.cmp thead strong {
  display: block;
  font-weight: 600;
  margin-bottom: var(--space-2);
}
.remove {
  font-size: 12px;
  color: var(--color-text-muted);
  transition: color 0.15s;
}
.remove:hover {
  color: var(--color-danger);
}
.cmp tbody th {
  width: 180px;
  color: var(--color-text-muted);
  font-weight: 500;
}
.actions {
  margin-top: var(--space-5);
}
.empty {
  text-align: center;
  padding: var(--space-8) 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  color: var(--color-text-muted);
}
</style>
