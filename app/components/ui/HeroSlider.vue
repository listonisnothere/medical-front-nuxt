<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import api from '@/composables/useApi'

interface Banner {
  id: string
  title: string
  subtitle: string
  imageUrl: string | null
  linkUrl: string | null
  linkLabel: string | null
}

const slides = ref<Banner[]>([])
const active = ref(0)
let timer: number | undefined

const GRADIENTS = [
  'linear-gradient(135deg, #0b1929 0%, #1a4f9c 100%)',
  'linear-gradient(135deg, #0f3577 0%, #1a4f9c 60%, #2563b8 100%)',
  'linear-gradient(135deg, #07101f 0%, #0f3577 100%)',
]

const go = (i: number) => {
  active.value = (i + slides.value.length) % slides.value.length
}

onMounted(async () => {
  try {
    const { data } = await api.get('/banners')
    slides.value = Array.isArray(data) ? data : []
  } catch {
    // keep empty — fallback handled in template
  }
  timer = window.setInterval(() => {
    if (slides.value.length) go(active.value + 1)
  }, 6000)
})

onUnmounted(() => {
  if (timer) window.clearInterval(timer)
})
</script>

<template>
  <section class="hero">
    <div
      v-for="(slide, i) in slides"
      :key="slide.id"
      class="slide"
      :class="{ active: i === active }"
      :style="slide.imageUrl
        ? { backgroundImage: `url(${slide.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : { background: GRADIENTS[i % GRADIENTS.length] }"
    >
      <div v-if="slide.imageUrl" class="overlay" />
      <div class="content">
        <span class="kicker">MedCore Group</span>
        <h1>{{ slide.title }}</h1>
        <p v-if="slide.subtitle">{{ slide.subtitle }}</p>
        <div class="cta-row">
          <RouterLink
            v-if="slide.linkUrl && slide.linkLabel"
            :to="slide.linkUrl"
            class="cta-btn cta-btn--primary"
          >
            {{ slide.linkLabel }}
            <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </RouterLink>
          <RouterLink to="/contacts" class="cta-btn cta-btn--outline">Получить КП</RouterLink>
        </div>
      </div>

      <div class="hero-decoration">
        <div class="deco-circle deco-circle--1" />
        <div class="deco-circle deco-circle--2" />
      </div>
    </div>

    <div v-if="slides.length > 1" class="controls">
      <button
        v-for="(_, i) in slides"
        :key="i"
        class="dot"
        :class="{ active: i === active }"
        :aria-label="`Слайд ${i + 1}`"
        @click="go(i)"
      />
    </div>

    <div v-if="slides.length > 1" class="nav-arrows">
      <button class="arrow" aria-label="Назад" @click="go(active - 1)">
        <svg viewBox="0 0 20 20" fill="none"><path d="M13 4l-6 6 6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <button class="arrow" aria-label="Вперёд" @click="go(active + 1)">
        <svg viewBox="0 0 20 20" fill="none"><path d="M7 4l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 520px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  isolation: isolate;
  background: #0b1929;
}

.slide {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  padding: var(--space-9) var(--space-8);
  opacity: 0;
  transition: opacity 0.7s ease;
  color: #fff;
}

.slide.active {
  opacity: 1;
  z-index: 1;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    rgba(11, 25, 41, 0.82) 0%,
    rgba(11, 25, 41, 0.5) 55%,
    transparent 100%
  );
  pointer-events: none;
}

.hero-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.deco-circle {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.deco-circle--1 {
  width: 420px;
  height: 420px;
  right: -100px;
  top: -100px;
}

.deco-circle--2 {
  width: 280px;
  height: 280px;
  right: 60px;
  top: 60px;
  border-color: rgba(200, 136, 26, 0.12);
}

.content {
  position: relative;
  z-index: 2;
  max-width: 640px;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #c8881a;
}

.kicker::before {
  content: '';
  display: inline-block;
  width: 24px;
  height: 2px;
  background: #c8881a;
  border-radius: 2px;
}

h1 {
  font-family: var(--font-display);
  font-size: clamp(28px, 4.5vw, 52px);
  color: #fff;
  letter-spacing: -0.025em;
  line-height: 1.1;
  font-weight: 700;
}

p {
  font-size: 16px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.75);
  max-width: 500px;
}

.cta-row {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
  margin-top: var(--space-2);
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 26px;
  font-weight: 600;
  font-size: 15px;
  border-radius: var(--radius);
  text-decoration: none;
  transition: all 0.2s;
}

.cta-btn svg {
  width: 14px;
  height: 14px;
  transition: transform 0.2s;
}

.cta-btn--primary {
  background: #c8881a;
  color: #fff;
}

.cta-btn--primary:hover {
  background: #a96d0f;
}

.cta-btn--primary:hover svg {
  transform: translateX(3px);
}

.cta-btn--outline {
  background: transparent;
  color: #fff;
  border: 1.5px solid rgba(255, 255, 255, 0.35);
}

.cta-btn--outline:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.6);
}

/* CONTROLS */
.controls {
  position: absolute;
  bottom: var(--space-6);
  left: var(--space-8);
  display: flex;
  gap: var(--space-2);
  z-index: 3;
}

.dot {
  width: 32px;
  height: 3px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.3);
  transition: background 0.25s, width 0.25s;
}

.dot.active {
  background: #c8881a;
  width: 48px;
}

/* ARROWS */
.nav-arrows {
  position: absolute;
  bottom: var(--space-5);
  right: var(--space-6);
  display: flex;
  gap: var(--space-2);
  z-index: 3;
}

.arrow {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: grid;
  place-items: center;
  color: #fff;
  transition: background 0.2s;
}

.arrow svg {
  width: 20px;
  height: 20px;
}

.arrow:hover {
  background: rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {
  .hero {
    min-height: 420px;
  }
  .slide {
    padding: var(--space-7) var(--space-5);
  }
  .controls {
    left: var(--space-5);
  }
  .nav-arrows {
    display: none;
  }
  .cta-btn--outline {
    display: none;
  }
}
</style>
