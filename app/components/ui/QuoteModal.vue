<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import BaseButton from './BaseButton.vue'
import { useUiStore } from '@/stores/ui'
import api from '@/composables/useApi'
import { trackGoal } from '@/composables/useAnalytics'
import { formatQuizSummary } from '@/composables/useQuiz'

const ui = useUiStore()
const form = ref({ name: '', phone: '', email: '', message: '' })
const sent = ref(false)
const submitting = ref(false)

const close = () => {
  ui.closeQuote()
  sent.value = false
}

const submit = async (e: Event) => {
  e.preventDefault()
  submitting.value = true
  try {
    const resolvedSource = ui.quoteSource ?? (ui.quoteProduct ? 'product' : 'contact')
    await api.post('/quotes', {
      name: form.value.name,
      phone: form.value.phone,
      email: form.value.email || undefined,
      message: form.value.message || undefined,
      productId: ui.quoteProduct?.id,
      source: resolvedSource,
    })
  } catch {
    // show success regardless — lead is best-effort
  } finally {
    submitting.value = false
  }
  sent.value = true
  const resolvedSource2 = ui.quoteSource ?? (ui.quoteProduct ? 'product' : 'contact')
  trackGoal('quote_request', {
    product_id: ui.quoteProduct?.id ?? null,
    product_name: ui.quoteProduct?.name ?? null,
    source: resolvedSource2,
  })
  setTimeout(close, 1800)
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
      if (ui.quoteQuizAnswers) {
        form.value.message = `Подбор: ${formatQuizSummary(ui.quoteQuizAnswers)}`
      }
    } else {
      form.value = { name: '', phone: '', email: '', message: '' }
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
                  <input v-model="form.email" type="email" :placeholder="$t('quoteModal.placeholderEmail')" />
                </label>
              </div>
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

              <BaseButton variant="primary" size="lg" :disabled="submitting">
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
textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-soft);
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
