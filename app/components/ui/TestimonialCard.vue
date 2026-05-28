<script setup lang="ts">
import type { Testimonial } from '@/data/testimonials'
defineProps<{ testimonial: Testimonial }>()
</script>

<template>
  <article class="card">
    <div class="quote-mark">
      <svg viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 32V19.2C0 8.533 5.867 2.4 17.6 0l2.133 3.733C13.6 5.333 10.4 8.8 9.6 13.867H16V32H0zm24 0V19.2C24 8.533 29.867 2.4 41.6 0l2.133 3.733C37.6 5.333 34.4 8.8 33.6 13.867H40V32H24z" fill="currentColor" opacity="0.12"/>
      </svg>
    </div>
    <p class="text">{{ testimonial.text }}</p>
    <footer>
      <div class="author-avatar">{{ testimonial.author.charAt(0) }}</div>
      <div class="author-info">
        <strong>{{ testimonial.author }}</strong>
        <span>{{ testimonial.role }}</span>
      </div>
    </footer>
  </article>
</template>

<style scoped>
.card {
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  height: 100%;
  position: relative;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow);
}

.quote-mark {
  color: var(--color-primary);
  width: 44px;
  height: auto;
  flex-shrink: 0;
}

.quote-mark svg {
  width: 44px;
  height: auto;
}

.text {
  font-size: 15px;
  line-height: 1.7;
  color: var(--color-text);
  flex: 1;
  font-style: italic;
}

footer {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-4);
  margin-top: auto;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-primary-soft);
  color: var(--color-primary);
  font-weight: 700;
  font-size: 16px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

footer strong {
  font-weight: 700;
  font-size: 14px;
  color: var(--color-text);
}

footer span {
  color: var(--color-text-muted);
  font-size: 13px;
}
</style>
