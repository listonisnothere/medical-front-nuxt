<script setup lang="ts">
import { computed, ref } from 'vue'
import AppContainer from '@/components/ui/AppContainer.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useCompareStore } from '@/stores/compare'
import { useProductsDataStore } from '@/stores/productsData'
import { useUiStore } from '@/stores/ui'
import { useMeta } from '@/composables/useMeta'
import { useLocale } from '@/composables/useLocale'
import { trackGoal } from '@/composables/useAnalytics'
import api from '@/composables/useApi'

useMeta({ title: () => 'Сравнение товаров', noindex: true })
const compare = useCompareStore()
const store = useProductsDataStore()
const ui = useUiStore()
const { currentLocale } = useLocale()

const items = computed(() => store.items.filter((p) => compare.has(p.id)))

await useAsyncData('productsData', () => store.load())

// AI compare state
const aiLoading = ref(false)
const aiResult = ref<null | {
  scores: Array<{ criterion: string; label: string; scoreA: number; scoreB: number; comment: string }>
  verdict: string
  whenChooseA: string
  whenChooseB: string
}>(null)
const aiError = ref<string | null>(null)
const aiCached = ref(false)
const aiGeneratedAt = ref<string | null>(null)

const canAiCompare = computed(() => items.value.length === 2)

async function runAiCompare(refresh = false) {
  if (!canAiCompare.value) return
  aiLoading.value = true
  aiError.value = null
  if (!refresh) aiResult.value = null

  const [a, b] = items.value
  trackGoal('ai_compare_clicked', { productA: a.id, productB: b.id })

  try {
    const { data } = await api.post('/products/compare', {
      productAId: a.id,
      productBId: b.id,
      lang: currentLocale.value,
      refresh,
    })
    aiResult.value = data
    aiCached.value = data.cached ?? false
    aiGeneratedAt.value = data.generatedAt ?? null
  } catch {
    aiError.value = 'error'
  } finally {
    aiLoading.value = false
  }
}

function formatDate(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(currentLocale.value === 'en' ? 'en-US' : 'ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
</script>

<template>
  <AppContainer>
    <Breadcrumbs :items="[{ label: $t('compare.breadcrumb') }]" />
    <SectionHeading :level="1">
      {{ $t('compare.title') }}
      <template #sub>{{ items.length }} {{ $t('compare.inCompare') }}</template>
    </SectionHeading>

    <div v-if="store.loading" class="loading">{{ $t('compare.loading') }}</div>
    <div v-else-if="items.length" class="table-wrap">
      <table class="cmp">
        <thead>
          <tr>
            <th></th>
            <th v-for="p in items" :key="p.id">
              <img :src="p.image" :alt="p.name" />
              <strong>{{ p.name }}</strong>
              <button class="remove" @click="compare.remove(p.id)">{{ $t('compare.remove') }}</button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>{{ $t('compare.brand') }}</th>
            <td v-for="p in items" :key="p.id">{{ p.brand }}</td>
          </tr>
          <tr>
            <th>{{ $t('compare.class') }}</th>
            <td v-for="p in items" :key="p.id">{{ p.productClass }}</td>
          </tr>
          <tr>
            <th>{{ $t('compare.price') }}</th>
            <td v-for="p in items" :key="p.id">{{ p.price }}</td>
          </tr>
          <tr>
            <th>{{ $t('compare.availability') }}</th>
            <td v-for="p in items" :key="p.id">{{ p.badge ?? $t('compare.onOrder') }}</td>
          </tr>
        </tbody>
      </table>

      <div class="actions">
        <BaseButton variant="ghost" @click="compare.clear()">{{ $t('compare.clear') }}</BaseButton>
        <div class="ai-action">
          <BaseButton
            variant="primary"
            :disabled="!canAiCompare || aiLoading"
            @click="runAiCompare(false)"
          >
            <span v-if="aiLoading">{{ $t('compare.aiLoading') }}</span>
            <span v-else>{{ $t('compare.aiCompare') }}</span>
          </BaseButton>
          <p v-if="!canAiCompare" class="ai-hint">{{ $t('compare.aiCompareNeedTwo') }}</p>
        </div>
      </div>

      <!-- AI result -->
      <div v-if="aiResult" class="ai-result">
        <div class="ai-result__header">
          <h2 class="ai-result__title">{{ $t('compare.aiTitle') }}</h2>
          <div class="ai-result__meta">
            <span v-if="aiCached" class="badge-cached">
              {{ $t('compare.aiCached') }} · {{ formatDate(aiGeneratedAt) }}
            </span>
            <button class="btn-regen" @click="runAiCompare(true)">
              {{ $t('compare.aiRegenerate') }}
            </button>
          </div>
        </div>

        <!-- Scores table -->
        <div class="ai-scores">
          <div class="ai-scores__labels">
            <span></span>
            <span class="ai-scores__product-name">{{ items[0]?.name }}</span>
            <span class="ai-scores__product-name">{{ items[1]?.name }}</span>
          </div>
          <div v-for="score in aiResult.scores" :key="score.criterion" class="ai-score-row">
            <div class="ai-score-row__label">{{ score.label }}</div>
            <div class="ai-score-row__bar-wrap">
              <div class="ai-score-row__bar" :style="{ width: score.scoreA * 10 + '%' }"></div>
              <span class="ai-score-row__num">{{ score.scoreA }}/10</span>
            </div>
            <div class="ai-score-row__bar-wrap">
              <div class="ai-score-row__bar ai-score-row__bar--b" :style="{ width: score.scoreB * 10 + '%' }"></div>
              <span class="ai-score-row__num">{{ score.scoreB }}/10</span>
            </div>
            <p class="ai-score-row__comment">{{ score.comment }}</p>
          </div>
        </div>

        <!-- Verdict -->
        <div class="ai-card">
          <h3 class="ai-card__title">{{ $t('compare.aiVerdict') }}</h3>
          <p>{{ aiResult.verdict }}</p>
        </div>

        <!-- When to choose -->
        <div class="ai-when">
          <div v-for="(item, idx) in items" :key="item.id" class="ai-card">
            <h3 class="ai-card__title">{{ $t('compare.aiWhenChoose', { name: item.name }) }}</h3>
            <p>{{ idx === 0 ? aiResult.whenChooseA : aiResult.whenChooseB }}</p>
            <BaseButton
              variant="primary"
              class="ai-card__cta"
              @click="ui.openQuote({ product: item, source: 'compare-ai' })"
            >
              {{ $t('compare.aiRequestQuote', { name: item.name }) }}
            </BaseButton>
          </div>
        </div>
      </div>

      <div v-if="aiError" class="ai-error">{{ $t('compare.aiError') }}</div>
    </div>

    <div v-else class="empty">
      <p>{{ $t('compare.empty') }}</p>
      <BaseButton to="/catalog" variant="primary">{{ $t('compare.toCatalog') }}</BaseButton>
    </div>
  </AppContainer>
</template>

<style scoped>
.loading {
  padding: var(--space-7);
  text-align: center;
  color: var(--color-text-muted);
}
.table-wrap {
  overflow-x: auto;
}
.cmp {
  width: 100%;
  border-collapse: collapse;
  min-width: 640px;
}
.cmp th,
.cmp td {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border);
  text-align: left;
  font-size: 14px;
  vertical-align: top;
}
.cmp thead th {
  width: 220px;
  border-bottom: 1px solid var(--color-border-strong);
}
.cmp thead img {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  border-radius: var(--radius);
  margin-bottom: var(--space-2);
}
.cmp thead strong {
  display: block;
  font-weight: 600;
  margin-bottom: var(--space-2);
}
.remove {
  font-size: 12px;
  color: var(--color-text-muted);
  transition: color 0.15s;
}
.remove:hover {
  color: var(--color-danger);
}
.cmp tbody th {
  width: 180px;
  color: var(--color-text-muted);
  font-weight: 500;
}
.actions {
  margin-top: var(--space-5);
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  flex-wrap: wrap;
}
.ai-action {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
.ai-hint {
  font-size: 12px;
  color: var(--color-text-muted);
}
.empty {
  text-align: center;
  padding: var(--space-8) 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  color: var(--color-text-muted);
}

/* AI Result */
.ai-result {
  margin-top: var(--space-8);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
.ai-result__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-3);
}
.ai-result__title {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}
.ai-result__meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.badge-cached {
  font-size: 12px;
  background: var(--color-bg-subtle, #f3f4f6);
  color: var(--color-text-muted);
  padding: 2px 8px;
  border-radius: 999px;
}
.btn-regen {
  font-size: 13px;
  color: var(--color-primary, #2563eb);
  text-decoration: underline;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
}
.btn-regen:hover {
  opacity: 0.75;
}

/* Scores */
.ai-scores {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.ai-scores__labels {
  display: grid;
  grid-template-columns: 200px 1fr 1fr;
  gap: var(--space-3);
}
.ai-scores__product-name {
  font-weight: 600;
  font-size: 13px;
  color: var(--color-text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ai-score-row {
  display: grid;
  grid-template-columns: 200px 1fr 1fr;
  gap: var(--space-3);
  align-items: center;
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--color-border);
}
.ai-score-row__label {
  font-size: 14px;
  font-weight: 500;
}
.ai-score-row__bar-wrap {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.ai-score-row__bar {
  height: 8px;
  background: var(--color-primary, #2563eb);
  border-radius: 4px;
  min-width: 4px;
  transition: width 0.4s ease;
  flex-shrink: 0;
}
.ai-score-row__bar--b {
  background: var(--color-secondary, #7c3aed);
}
.ai-score-row__num {
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}
.ai-score-row__comment {
  grid-column: 1 / -1;
  font-size: 13px;
  color: var(--color-text-muted);
  margin: 0;
  margin-top: calc(-1 * var(--space-2));
}

/* Cards */
.ai-card {
  background: var(--color-bg-subtle, #f9fafb);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.ai-card__title {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}
.ai-card p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
}
.ai-card__cta {
  align-self: flex-start;
  margin-top: var(--space-2);
}
.ai-when {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}
@media (max-width: 640px) {
  .ai-when {
    grid-template-columns: 1fr;
  }
  .ai-scores__labels,
  .ai-score-row {
    grid-template-columns: 140px 1fr 1fr;
  }
}
.ai-error {
  margin-top: var(--space-4);
  color: var(--color-danger, #dc2626);
  font-size: 14px;
}
</style>
