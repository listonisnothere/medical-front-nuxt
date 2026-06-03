<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useBannersDataStore } from '@/stores/bannersData'

const store = useBannersDataStore()
const current = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

onMounted(async () => {
  await store.load()
  startAuto()
})

onUnmounted(stopAuto)

function startAuto() {
  stopAuto()
  if (store.items.length > 1) {
    timer = setInterval(next, 5000)
  }
}

function stopAuto() {
  if (timer) { clearInterval(timer); timer = null }
}

function next() {
  current.value = (current.value + 1) % store.items.length
}

function prev() {
  current.value = (current.value - 1 + store.items.length) % store.items.length
}

function go(i: number) {
  current.value = i
  startAuto()
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') { prev(); startAuto() }
  if (e.key === 'ArrowRight') { next(); startAuto() }
}
</script>

<template>
  <div
    v-if="store.items.length"
    class="banners-carousel"
    tabindex="0"
    role="region"
    aria-label="Баннеры"
    @keydown="onKey"
    @mouseenter="stopAuto"
    @mouseleave="startAuto"
  >
    <div
      v-for="(b, i) in store.items"
      :key="b.id"
      class="slide"
      :class="{ active: i === current }"
      :aria-hidden="i !== current"
    >
      <NuxtImg class="slide-img" :src="b.imageUrl" :alt="b.title" loading="eager" fetchpriority="high" decoding="async" format="webp" quality="85" width="1200" height="400" sizes="100vw" />
      <div class="slide-content">
        <h2>{{ b.title }}</h2>
        <p v-if="b.subtitle">{{ b.subtitle }}</p>
        <RouterLink v-if="b.linkUrl" :to="b.linkUrl" class="slide-cta">
          {{ b.linkLabel || 'Подробнее' }}
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </RouterLink>
      </div>
    </div>

    <div v-if="store.items.length > 1" class="dots" aria-label="Навигация по слайдам">
      <button
        v-for="(_, i) in store.items"
        :key="i"
        class="dot"
        :class="{ active: i === current }"
        :aria-label="`Слайд ${i + 1}`"
        :aria-pressed="i === current"
        @click="go(i)"
      />
    </div>
  </div>
</template>

<style scoped>
.banners-carousel {
  position: relative;
  width: 100%;
  border-radius: var(--radius-lg);
  overflow: hidden;
  aspect-ratio: 21 / 7;
  background: var(--color-surface, #efece5);
  outline: none;
}

.slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.55s ease;
  pointer-events: none;
}

.slide.active {
  opacity: 1;
  pointer-events: auto;
}

.slide-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.slide-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--space-7) var(--space-9);
  gap: var(--space-3);
  max-width: 580px;
  color: #0e1f35;
}

.slide-content h2 {
  font-family: var(--font-display);
  font-size: clamp(22px, 2.8vw, 40px);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  margin: 0;
}

.slide-content p {
  font-size: clamp(14px, 1.1vw, 16px);
  line-height: 1.55;
  opacity: 0.88;
  margin: 0;
}

.slide-cta {
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  gap: 10px;
  margin-top: var(--space-2);
  padding: 10px 22px;
  font-size: 14px;
  font-weight: 500;
  color: #0e1f35;
  border: 1px solid rgba(14, 31, 53, 0.35);
  border-radius: 999px;
  text-decoration: none;
  background: rgba(14, 31, 53, 0.07);
  backdrop-filter: blur(4px);
  transition: background 0.2s, border-color 0.2s;
}

.slide-cta:hover {
  background: rgba(14, 31, 53, 0.14);
  border-color: rgba(14, 31, 53, 0.7);
}

.slide-cta svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  transition: transform 0.2s;
}

.slide-cta:hover svg {
  transform: translateX(3px);
}

.dots {
  position: absolute;
  bottom: var(--space-4);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 7px;
  z-index: 1;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  border: none;
  cursor: pointer;
  padding: 0;
  transition: background 0.2s, transform 0.2s;
}

.dot.active {
  background: #fff;
  transform: scale(1.3);
}

.dot:hover:not(.active) {
  background: rgba(255, 255, 255, 0.65);
}

@media (max-width: 768px) {
  .banners-carousel {
    aspect-ratio: 16 / 9;
  }
  .slide-content {
    padding: var(--space-5);
  }
}

@media (max-width: 480px) {
  .banners-carousel {
    aspect-ratio: 4 / 3;
  }
}
</style>
