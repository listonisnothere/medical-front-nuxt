<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BaseButton from './BaseButton.vue'
import { useUiStore } from '@/stores/ui'
import { useCitiesDataStore, type City } from '@/stores/citiesData'
import api from '@/composables/useApi'
import { trackGoal } from '@/composables/useAnalytics'
import { formatQuizSummary } from '@/composables/useQuiz'

const ui = useUiStore()
const citiesStore = useCitiesDataStore()
const { t } = useI18n()
const form = ref({ name: '', phone: '', email: '', citySlug: '', message: '' })
const sent = ref(false)
const submitting = ref(false)
const loadingCities = ref(false)
const availableCities = ref<Array<City & { stockStatus?: string }>>([])
const error = ref('')

const hasCityChoices = computed(() => availableCities.value.length > 0)

const allowedSources = new Set(['product', 'cart', 'service', 'contact'])

const resolvedSource = () => {
  const source = ui.quoteSource ?? (ui.quoteProduct ? 'product' : ui.quoteProductIds.length ? 'cart' : 'contact')
  if (allowedSources.has(source)) return source
  return ui.quoteProduct ? 'product' : 'contact'
}

const close = () => {
  ui.closeQuote()
  sent.value = false
  error.value = ''
}

const fetchProductCities = async (productId: string): Promise<Array<City & { stockStatus?: string }>> => {
  const { data } = await api.get(`/products/${productId}/available-cities`)
  return Array.isArray(data) ? data : []
}

const loadAvailableCities = async () => {
  loadingCities.value = true
  error.value = ''
  try {
    await citiesStore.load()
    const allCities = citiesStore.items

    if (ui.quoteProduct) {
      availableCities.value = await fetchProductCities(ui.quoteProduct.id)
    } else if (ui.quoteProductIds.length) {
      const lists = await Promise.all(ui.quoteProductIds.map((id) => fetchProductCities(id)))
      const [first = []] = lists
      availableCities.value = first.filter((city) => lists.every((list) => list.some((item) => item.slug === city.slug)))
    } else {
      availableCities.value = allCities
    }

    const currentStillAvailable = availableCities.value.some((city) => city.slug === form.value.citySlug)
    if (!currentStillAvailable) {
      const defaultCity = availableCities.value.find((city) => city.isDefault) ?? availableCities.value[0]
      form.value.citySlug = defaultCity?.slug ?? ''
    }
  } catch {
    availableCities.value = []
    form.value.citySlug = ''
    error.value = t('quoteModal.cityLoadError')
  } finally {
    loadingCities.value = false
  }
}

const submit = async (e: Event) => {
  e.preventDefault()
  if (!hasCityChoices.value || !form.value.citySlug) return
  submitting.value = true
  error.value = ''
  try {
    const source = resolvedSource()
    await api.post('/quotes', {
      name: form.value.name,
      phone: form.value.phone,
      email: form.value.email,
      citySlug: form.value.citySlug,
      message: form.value.message || undefined,
      productId: ui.quoteProduct?.id,
      productIds: ui.quoteProduct ? undefined : ui.quoteProductIds,
      source,
    })
    sent.value = true
    trackGoal('quote_request', {
      product_id: ui.quoteProduct?.id ?? null,
      product_name: ui.quoteProduct?.name ?? null,
      product_ids: ui.quoteProductIds,
      city: form.value.citySlug,
      source,
    })
    setTimeout(close, 1800)
  } catch {
    error.value = t('quoteModal.submitError')
  } finally {
    submitting.value = false
  }
}

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && ui.quoteOpen) close()
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))

watch(
  () => ui.quoteOpen,
  (open) => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) {
      sent.value = false
      error.value = ''
      loadAvailableCities()
      if (ui.quoteQuizAnswers) {
        form.value.message = `Подбор: ${formatQuizSummary(ui.quoteQuizAnswers)}`
      }
    } else {
      form.value = { name: '', phone: '', email: '', citySlug: '', message: '' }
      availableCities.value = []
    }
  },
)
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="ui.quoteOpen" class="overlay" @click.self="close">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="quote-title">
          <button class="close" :aria-label="$t('quoteModal.closeAria')" @click="close">×</button>

          <div v-if="!sent">
            <h2 id="quote-title">{{ $t('quoteModal.title') }}</h2>
            <p class="hint">{{ $t('quoteModal.hint') }}</p>

            <div v-if="ui.quoteProduct" class="product">
              <img :src="ui.quoteProduct.image" :alt="ui.quoteProduct.name" />
              <div>
                <span class="brand">{{ ui.quoteProduct.brand }}</span>
                <strong>{{ ui.quoteProduct.name }}</strong>
              </div>
            </div>

            <form @submit="submit">
              <label>
                <span>{{ $t('quoteModal.labelName') }}</span>
                <input v-model="form.name" required type="text" :placeholder="$t('quoteModal.placeholderName')" />
              </label>
              <div class="row">
                <label>
                  <span>{{ $t('quoteModal.labelPhone') }}</span>
                  <input
                    v-model="form.phone"
                    required
                    type="tel"
                    :placeholder="$t('quoteModal.placeholderPhone')"
                  />
                </label>
                <label>
                  <span>{{ $t('quoteModal.labelEmail') }}</span>
                  <input v-model="form.email" required type="email" :placeholder="$t('quoteModal.placeholderEmail')" />
                </label>
              </div>
              <label>
                <span>{{ $t('quoteModal.labelCity') }}</span>
                <select v-model="form.citySlug" required :disabled="loadingCities || !hasCityChoices">
                  <option value="" disabled>
                    {{ loadingCities ? $t('quoteModal.loadingCities') : $t('quoteModal.placeholderCity') }}
                  </option>
                  <option v-for="city in availableCities" :key="city.slug" :value="city.slug">
                    {{ city.name }}{{ city.stockStatus === 'on_order' ? ` — ${$t('quoteModal.onOrder')}` : '' }}
                  </option>
                </select>
                <small v-if="!loadingCities && !hasCityChoices" class="city-note">
                  {{ $t('quoteModal.noCities') }}
                </small>
              </label>
              <label>
                <span>{{ $t('quoteModal.labelMessage') }}</span>
                <textarea
                  v-model="form.message"
                  rows="3"
                  :placeholder="$t('quoteModal.placeholderMessage')"
                />
              </label>

              <p class="agree">
                {{ $t('quoteModal.agree') }}
                <RouterLink to="/privacy">{{ $t('quoteModal.agreeLink') }}</RouterLink>.
              </p>

              <p v-if="error" class="error">{{ error }}</p>

              <BaseButton variant="primary" size="lg" :disabled="submitting || loadingCities || !hasCityChoices">
                {{ submitting ? $t('quoteModal.sending') : $t('quoteModal.submit') }}
              </BaseButton>
            </form>
          </div>

          <div v-else class="success">
            <div class="check">✓</div>
            <h2>{{ $t('quoteModal.successTitle') }}</h2>
            <p>{{ $t('quoteModal.successText') }}</p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(11, 25, 41, 0.65);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: grid;
  place-items: center;
  padding: var(--space-4);
}

.modal {
  position: relative;
  background: #fff;
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 520px;
  padding: var(--space-6);
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
}

.close {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 24px;
  color: var(--color-text-muted);
  line-height: 1;
}

.close:hover {
  background: var(--color-surface);
  color: var(--color-text);
}

h2 {
  font-size: 22px;
  margin-bottom: var(--space-2);
}

.hint {
  color: var(--color-text-muted);
  font-size: 14px;
  margin-bottom: var(--space-4);
}

.product {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--color-surface);
  border-radius: var(--radius);
  margin-bottom: var(--space-4);
}

.product img {
  width: 64px;
  aspect-ratio: 4/3;
  object-fit: cover;
  border-radius: var(--radius-sm);
}

.product .brand {
  display: block;
  font-size: 12px;
  text-transform: uppercase;
  color: var(--color-text-muted);
  letter-spacing: 0.06em;
  margin-bottom: 2px;
}

.product strong {
  font-weight: 600;
  font-size: 14px;
  line-height: 1.35;
}

form {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}

label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  color: var(--color-text-muted);
}

input,
select,
textarea {
  font: inherit;
  font-size: 15px;
  padding: 11px 14px;
  background: #fff;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius);
  color: var(--color-text);
  resize: vertical;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-soft);
}

.city-note {
  font-size: 12px;
  color: var(--color-danger);
}

.error {
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  background: #fff1f1;
  color: var(--color-danger);
  font-size: 13px;
}

.agree {
  font-size: 12px;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.agree a {
  color: var(--color-primary);
  text-decoration: underline;
}

.success {
  text-align: center;
  padding: var(--space-5) 0;
}

.check {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--space-3);
  border-radius: 50%;
  background: var(--color-primary-soft);
  color: var(--color-primary);
  display: grid;
  place-items: center;
  font-size: 36px;
  font-weight: 700;
}

.success p {
  color: var(--color-text-muted);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 540px) {
  .row {
    grid-template-columns: 1fr;
  }
  .modal {
    padding: var(--space-5);
  }
}
</style>
