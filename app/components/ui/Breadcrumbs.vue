<script setup lang="ts">
import { RouterLink } from 'vue-router'

interface Crumb {
  label: string
  to?: string
}

defineProps<{ items: Crumb[] }>()
</script>

<template>
  <nav class="crumbs" aria-label="Хлебные крошки">
    <ol itemscope itemtype="https://schema.org/BreadcrumbList">
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <RouterLink to="/" itemprop="item"><span itemprop="name">Главная</span></RouterLink>
        <meta itemprop="position" content="1" />
        <span class="sep" aria-hidden="true">
          <svg viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
      </li>
      <li
        v-for="(c, i) in items"
        :key="i"
        itemprop="itemListElement"
        itemscope
        itemtype="https://schema.org/ListItem"
      >
        <RouterLink
          v-if="c.to && i !== items.length - 1"
          :to="c.to"
          itemprop="item"
        >
          <span itemprop="name">{{ c.label }}</span>
        </RouterLink>
        <span v-else class="current" itemprop="name" aria-current="page">{{ c.label }}</span>
        <meta :content="String(i + 2)" itemprop="position" />
        <span v-if="i !== items.length - 1" class="sep" aria-hidden="true">
          <svg viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.crumbs {
  margin: var(--space-5) 0 var(--space-4);
  font-size: 13px;
  color: var(--color-text-muted);
}
ol {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}
li {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
a {
  color: var(--color-text-muted);
}
a:hover {
  color: var(--color-primary);
}
.current {
  color: var(--color-text);
  font-weight: 500;
}
.sep {
  color: var(--color-border-strong);
  display: inline-flex;
  align-items: center;
}

.sep svg {
  width: 12px;
  height: 12px;
}
</style>
