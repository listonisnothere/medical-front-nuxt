<script setup lang="ts">
import { computed } from 'vue'
import AppContainer from '@/components/ui/AppContainer.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import ProductCard from '@/components/ui/ProductCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useWishlistStore } from '@/stores/wishlist'
import { useProductsDataStore } from '@/stores/productsData'
import { useMeta } from '@/composables/useMeta'

useMeta({ title: () => 'Избранное', noindex: true })
const wishlist = useWishlistStore()
const store = useProductsDataStore()

const items = computed(() => store.items.filter((p) => wishlist.has(p.id)))

await useAsyncData('productsData', () => store.load())
</script>

<template>
  <AppContainer>
    <Breadcrumbs :items="[{ label: $t('wishlist.breadcrumb') }]" />
    <SectionHeading :level="1">
      {{ $t('wishlist.title') }}
      <template #sub>{{ items.length }} {{ items.length === 1 ? $t('wishlist.countOne') : $t('wishlist.countMany') }}</template>
    </SectionHeading>

    <div v-if="store.loading" class="loading">{{ $t('wishlist.loading') }}</div>
    <div v-else-if="items.length" class="grid">
      <ProductCard v-for="p in items" :key="p.id" :product="p" />
    </div>
    <div v-else class="empty">
      <p>{{ $t('wishlist.empty') }}</p>
      <BaseButton to="/catalog" variant="primary">{{ $t('wishlist.toCatalog') }}</BaseButton>
    </div>
  </AppContainer>
</template>

<style scoped>
.loading {
  padding: var(--space-7);
  text-align: center;
  color: var(--color-text-muted);
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--space-4);
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
