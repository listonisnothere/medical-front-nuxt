<script setup lang="ts">
import { useCitiesDataStore } from '@/stores/citiesData'
import { useSelectedCity } from '@/composables/useSelectedCity'

const citiesStore = useCitiesDataStore()
const { selectedCity, geoDetectedSlug, isAutoDetected, setSelectedCity, dismissGeoBar } = useSelectedCity()

const detectedCity = computed(
  () => citiesStore.items.find((c) => c.slug === geoDetectedSlug.value) ?? null,
)

function confirm() {
  if (geoDetectedSlug.value) setSelectedCity(geoDetectedSlug.value, { silent: true })
}

function decline() {
  dismissGeoBar()
}
</script>

<template>
  <div v-if="isAutoDetected && detectedCity" class="city-bar" role="alert">
    <span class="city-bar-text">
      Похоже, вы из <strong>{{ detectedCity.name }}</strong>. Показать каталог {{ detectedCity.namePrep }}?
    </span>
    <div class="city-bar-actions">
      <button type="button" class="btn-confirm" @click="confirm">Да, {{ detectedCity.name }}</button>
      <button type="button" class="btn-decline" @click="decline">Нет, оставить {{ selectedCity?.name ?? 'Алматы' }}</button>
    </div>
  </div>
</template>

<style scoped>
.city-bar {
  background: var(--color-primary);
  color: #fff;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 13px;
  z-index: 49;
}

.city-bar-actions {
  display: flex;
  gap: 8px;
}

.btn-confirm {
  padding: 5px 14px;
  background: #fff;
  color: var(--color-primary);
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 700;
  transition: filter 0.15s;
}

.btn-confirm:hover {
  filter: brightness(0.95);
}

.btn-decline {
  padding: 5px 14px;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  border-radius: 999px;
  font-size: 12.5px;
  transition: background 0.15s;
}

.btn-decline:hover {
  background: rgba(255, 255, 255, 0.25);
}
</style>
