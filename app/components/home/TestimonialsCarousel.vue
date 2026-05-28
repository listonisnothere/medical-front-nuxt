<script setup lang="ts">
import { onMounted } from 'vue'
import { useTestimonialsDataStore } from '@/stores/testimonialsData'
import TestimonialCard from '../ui/TestimonialCard.vue'

const store = useTestimonialsDataStore()
onMounted(() => store.load())
</script>

<template>
  <div class="scroller">
    <div v-for="t in store.items" :key="t.author" class="item">
      <TestimonialCard :testimonial="t" />
    </div>
  </div>
</template>

<style scoped>
.scroller {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(320px, 380px);
  gap: var(--space-4);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: var(--space-4);
  scrollbar-color: var(--color-border-strong) transparent;
}

.item {
  scroll-snap-align: start;
}
</style>
