<script setup lang="ts">
import { computed } from 'vue'
import AppContainer from '@/components/ui/AppContainer.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useCartStore } from '@/stores/cart'
import { useUiStore } from '@/stores/ui'
import { useProductsDataStore } from '@/stores/productsData'
import { useMeta } from '@/composables/useMeta'

useMeta({ title: () => 'Корзина', noindex: true })

const cart = useCartStore()
const ui = useUiStore()
const store = useProductsDataStore()

const items = computed(() => store.items.filter((p) => cart.has(p.id)))

await useAsyncData('productsData', () => store.load())
</script>

<template>
  <AppContainer>
    <Breadcrumbs :items="[{ label: $t('cart.breadcrumb') }]" />
    <SectionHeading :level="1">
      {{ $t('cart.title') }}
      <template #sub>{{ $t('cart.positions', { n: items.length }) }}</template>
    </SectionHeading>

    <div v-if="store.loading" class="loading">{{ $t('cart.loading') }}</div>
    <div v-else-if="items.length" class="layout">
      <ul class="lines">
        <li v-for="p in items" :key="p.id" class="line">
          <img :src="p.image" :alt="p.name" />
          <div class="meta">
            <span class="brand">{{ p.brand }}</span>
            <strong>{{ p.name }}</strong>
            <span class="price">{{ p.price }}</span>
          </div>
          <button class="rm" @click="cart.remove(p.id)">{{ $t('cart.remove') }}</button>
        </li>
      </ul>

      <aside class="summary">
        <h3>{{ $t('cart.summaryTitle') }}</h3>
        <p>{{ $t('cart.summaryText') }}</p>
        <BaseButton
          variant="primary"
          size="lg"
          @click="ui.openQuote({ productIds: items.map((p) => p.id), source: 'cart' })"
        >
          {{ $t('cart.checkout') }}
        </BaseButton>
        <button class="clear" @click="cart.clear()">{{ $t('cart.clear') }}</button>
      </aside>
    </div>

    <div v-else class="empty">
      <p>{{ $t('cart.empty') }}</p>
      <BaseButton to="/catalog" variant="primary">{{ $t('cart.toCatalog') }}</BaseButton>
    </div>
  </AppContainer>
</template>

<style scoped>
.loading {
  padding: var(--space-7);
  text-align: center;
  color: var(--color-text-muted);
}
.layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: var(--space-7);
  align-items: start;
}
.lines {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.line {
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: var(--space-4);
  padding: var(--space-4);
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  align-items: center;
  transition: border-color 0.15s;
}
.line:hover {
  border-color: var(--color-primary);
}
.line img {
  width: 120px;
  aspect-ratio: 4/3;
  object-fit: cover;
  border-radius: var(--radius-sm);
}
.meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.brand {
  font-size: 12px;
  text-transform: uppercase;
  color: var(--color-text-muted);
  letter-spacing: 0.06em;
}
.meta strong {
  font-weight: 600;
}
.price {
  font-weight: 600;
  color: var(--color-primary-dark);
}
.rm {
  font-size: 13px;
  color: var(--color-text-muted);
  transition: color 0.15s;
}
.rm:hover {
  color: var(--color-danger);
}
.summary {
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  position: sticky;
  top: 120px;
  box-shadow: var(--shadow-sm);
}
.summary h3 {
  font-size: 18px;
}
.summary p {
  font-size: 14px;
  color: var(--color-text-muted);
}
.clear {
  font-size: 13px;
  color: var(--color-text-muted);
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
@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .line {
    grid-template-columns: 80px 1fr auto;
  }
  .line img {
    width: 80px;
  }
}
</style>
