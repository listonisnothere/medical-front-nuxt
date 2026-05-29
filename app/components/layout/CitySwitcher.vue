<script setup lang="ts">
import { ref } from 'vue'
import { useCitiesDataStore } from '@/stores/citiesData'
import { useSelectedCity } from '@/composables/useSelectedCity'

const citiesStore = useCitiesDataStore()
const { selectedCity, setSelectedCity } = useSelectedCity()

const open = ref(false)

const visibleCities = computed(() =>
  citiesStore.items.filter((c) => c.isVisible).sort((a, b) => a.sortOrder - b.sortOrder),
)

function select(slug: string) {
  setSelectedCity(slug)
  open.value = false
}
</script>

<template>
  <div class="city-switcher" role="group">
    <button type="button" class="trigger" @click="open = !open" :aria-expanded="open">
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M8 1.5A4.5 4.5 0 018 10.5M8 1.5A4.5 4.5 0 018 10.5M8 1.5v9M3.5 6a4.5 4.5 0 009 0" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        <circle cx="8" cy="13" r="1.5" fill="currentColor"/>
      </svg>
      <span class="city-name">{{ selectedCity?.name ?? 'Казахстан' }}</span>
      <svg class="chevron" :class="{ open }" viewBox="0 0 12 12" fill="none">
        <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <div v-if="open" class="dropdown" role="listbox">
      <button
        v-for="city in visibleCities"
        :key="city.slug"
        type="button"
        role="option"
        :aria-selected="selectedCity?.slug === city.slug"
        :class="{ active: selectedCity?.slug === city.slug }"
        @click="select(city.slug)"
      >
        {{ city.name }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.city-switcher {
  position: relative;
  display: inline-block;
}

.trigger {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.75);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
}

.trigger:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.trigger svg:first-child {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.city-name {
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chevron {
  width: 10px;
  height: 10px;
  flex-shrink: 0;
  transition: transform 0.2s;
}

.chevron.open {
  transform: rotate(180deg);
}

.dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  min-width: 160px;
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  z-index: 100;
  padding: 4px 0;
  max-height: 320px;
  overflow-y: auto;
}

.dropdown button {
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 14px;
  font-size: 13px;
  color: var(--color-text);
  transition: background 0.1s;
}

.dropdown button:hover {
  background: var(--color-surface);
}

.dropdown button.active {
  color: var(--color-primary);
  font-weight: 600;
  background: var(--color-primary-soft);
}
</style>
