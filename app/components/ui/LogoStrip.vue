<script setup lang="ts">
defineProps<{ items: { name: string; slug?: string }[] }>()
</script>

<template>
  <div class="strip">
    <div v-for="item in items" :key="item.name" class="logo-tile">
      <span>{{ item.name }}</span>
    </div>
  </div>
</template>

<style scoped>
.strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--space-3);
}

.logo-tile {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 76px;
  padding: 0 var(--space-4);
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  color: var(--color-text-muted);
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.02em;
  text-align: center;
  transition: color 0.2s, border-color 0.2s, box-shadow 0.2s;
}

.logo-tile:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
  box-shadow: 0 4px 16px -8px rgba(26, 79, 156, 0.25);
}
</style>
