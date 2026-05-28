<script setup lang="ts">
import { useLocale } from '@/composables/useLocale'

const { currentLocale, availableLocales, setLocale } = useLocale()
</script>

<template>
  <div class="lang-switcher" role="group" :aria-label="$t('common.language')">
    <button
      v-for="loc in availableLocales"
      :key="loc.code"
      type="button"
      :class="{ active: currentLocale === loc.code }"
      @click="setLocale(loc.code)"
    >
      {{ loc.name }}
    </button>
  </div>
</template>

<style scoped>
.lang-switcher {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 2px;
  gap: 2px;
}

.lang-switcher button {
  padding: 3px 9px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.65);
  border-radius: 4px;
  transition: background 0.15s, color 0.15s;
  line-height: 1.4;
}

.lang-switcher button:hover {
  color: #fff;
}

.lang-switcher button.active {
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
}
</style>
