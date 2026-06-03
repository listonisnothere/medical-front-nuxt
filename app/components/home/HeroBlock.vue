<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="hero">
    <div class="content">
      <span class="pill">{{ $t('home.hero.pill') }}</span>
      <h1>{{ $t('home.hero.title') }}</h1>
      <p class="lead">{{ $t('home.hero.lead') }}</p>
      <RouterLink to="/contacts" class="cta">
        {{ $t('home.hero.cta') }}
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </RouterLink>
    </div>

    <div class="media" aria-hidden="true">
      <NuxtImg
        src="/hero.png"
        alt=""
        loading="eager"
        fetchpriority="high"
        decoding="async"
        format="webp"
        quality="85"
        sizes="(max-width: 900px) 100vw, 50vw"
        width="640"
        height="640"
      />
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding: var(--space-9) var(--space-8);
  background: var(--color-bg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: var(--space-8);
  align-items: center;
}

.content {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  min-width: 0;
}

.pill {
  display: inline-flex;
  align-self: flex-start;
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary);
  background: rgba(26, 79, 156, 0.1);
}

h1 {
  font-family: var(--font-display);
  font-size: clamp(32px, 4.4vw, 52px);
  line-height: 1.1;
  letter-spacing: -0.025em;
  font-weight: 700;
  color: var(--color-text);
  margin: var(--space-3) 0 var(--space-2);
}

.lead {
  font-size: 17px;
  line-height: 1.65;
  color: var(--color-text-muted);
}

.cta {
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  gap: 10px;
  margin-top: var(--space-4);
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text);
  background: transparent;
  border: 1px solid var(--color-border-strong, #c8c2b6);
  border-radius: 999px;
  text-decoration: none;
  transition: background 0.2s, border-color 0.2s;
}

.cta:hover {
  background: #fff;
  border-color: var(--color-text);
}

.cta svg {
  width: 14px;
  height: 14px;
  transition: transform 0.2s;
}

.cta:hover svg {
  transform: translateX(3px);
}

.media {
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: var(--color-surface, #efece5);
}

.media :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }
  .media {
    aspect-ratio: 16 / 10;
    order: -1;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: var(--space-7) var(--space-5);
  }
}
</style>
