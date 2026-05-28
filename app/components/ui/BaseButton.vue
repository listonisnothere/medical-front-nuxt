<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'outline' | 'ghost' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  to?: string
}>()
</script>

<template>
  <RouterLink
    v-if="to"
    :to="to"
    class="btn"
    :class="[`btn--${variant ?? 'primary'}`, `btn--${size ?? 'md'}`]"
  >
    <slot />
  </RouterLink>
  <button v-else class="btn" :class="[`btn--${variant ?? 'primary'}`, `btn--${size ?? 'md'}`]">
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  border-radius: var(--radius);
  font-weight: 600;
  transition:
    background-color 0.15s,
    color 0.15s,
    border-color 0.15s,
    box-shadow 0.15s,
    transform 0.05s;
  white-space: nowrap;
  border: 1.5px solid transparent;
  text-align: center;
  letter-spacing: 0.01em;
}

.btn:active {
  transform: translateY(1px);
}

.btn--sm {
  padding: 6px 12px;
  font-size: 14px;
}

.btn--md {
  padding: 10px 18px;
  font-size: 15px;
}

.btn--lg {
  padding: 14px 26px;
  font-size: 16px;
}

.btn--primary {
  background: var(--color-primary);
  color: #fff;
}

.btn--primary:hover {
  background: var(--color-primary-dark);
  box-shadow: 0 4px 16px -6px rgba(26, 79, 156, 0.5);
}

.btn--outline {
  background: transparent;
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.btn--outline:hover {
  background: var(--color-primary-soft);
}

.btn--ghost {
  background: transparent;
  color: var(--color-text);
}

.btn--ghost:hover {
  background: var(--color-surface);
}

.btn--accent {
  background: var(--color-accent);
  color: #fff;
}

.btn--accent:hover {
  filter: brightness(0.92);
}
</style>
