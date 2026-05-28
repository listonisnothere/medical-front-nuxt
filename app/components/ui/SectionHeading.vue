<script setup lang="ts">
defineProps<{
  eyebrow?: string
  align?: 'left' | 'center'
}>()
</script>

<template>
  <header class="section-heading" :class="`section-heading--${align ?? 'left'}`">
    <span v-if="eyebrow" class="eyebrow">
      <span class="eyebrow-line" />
      {{ eyebrow }}
    </span>
    <h2><slot /></h2>
    <p v-if="$slots.sub" class="sub"><slot name="sub" /></p>
  </header>
</template>

<style scoped>
.section-heading {
  margin-bottom: var(--space-7);
}

.section-heading--center {
  text-align: center;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: var(--space-3);
}

.section-heading--center .eyebrow {
  justify-content: center;
}

.eyebrow-line {
  display: inline-block;
  width: 28px;
  height: 2px;
  background: var(--color-accent);
  border-radius: 2px;
  flex-shrink: 0;
}

.section-heading--center .eyebrow-line {
  display: none;
}

h2 {
  font-family: var(--font-display);
  font-size: clamp(28px, 3.5vw, 42px);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-text);
  line-height: 1.15;
}

.sub {
  margin-top: var(--space-3);
  color: var(--color-text-muted);
  font-size: 16px;
  line-height: 1.65;
  max-width: 680px;
}

.section-heading--center .sub {
  margin-left: auto;
  margin-right: auto;
}
</style>
