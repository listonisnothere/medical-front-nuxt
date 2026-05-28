<script setup lang="ts">
import AppContainer from '@/components/ui/AppContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useMeta } from '@/composables/useMeta'

useMeta({ title: () => '404 — Страница не найдена', noindex: true })
</script>

<template>
  <AppContainer>
    <div class="page">
      <div class="num">404</div>
      <h1>{{ $t('notFound.heading') }}</h1>
      <p>{{ $t('notFound.text') }}</p>
      <div class="btns">
        <BaseButton to="/" variant="primary">{{ $t('notFound.toMain') }}</BaseButton>
        <BaseButton to="/catalog" variant="outline">{{ $t('notFound.toCatalog') }}</BaseButton>
      </div>
    </div>
  </AppContainer>
</template>

<style scoped>
.page {
  margin: var(--space-9) auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  max-width: 520px;
}

.num {
  font-family: var(--font-display);
  font-size: clamp(96px, 16vw, 160px);
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: -0.04em;
  line-height: 1;
  opacity: 0.15;
  margin-bottom: -var(--space-4);
}

h1 {
  font-family: var(--font-display);
  font-size: clamp(24px, 4vw, 36px);
  letter-spacing: -0.02em;
  margin-top: calc(-1 * var(--space-7));
}

p {
  color: var(--color-text-muted);
  font-size: 16px;
  line-height: 1.65;
}

.btns {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
  justify-content: center;
  margin-top: var(--space-2);
}
</style>
