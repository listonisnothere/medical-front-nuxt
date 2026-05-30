<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import ProductCard from '@/components/ui/ProductCard.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { useUiStore } from '@/stores/ui'
import { trackGoal } from '@/composables/useAnalytics'
import {
  useQuiz,
  type QuizAnswers,
  INSTITUTION_LABELS,
  DEPARTMENT_LABELS,
  BUDGET_LABELS,
  URGENCY_LABELS,
} from '@/composables/useQuiz'

defineProps<{ variant?: 'default' | 'compact' }>()

const ui = useUiStore()
const quiz = useQuiz()

type Step = 1 | 2 | 3 | 4 | 'result'

const STEPS: Array<{
  key: keyof QuizAnswers
  title: string
  options: { value: string; label: string; icon: string }[]
}> = [
  {
    key: 'institutionType',
    title: 'Тип учреждения',
    options: [
      { value: 'multi', label: 'Многопрофильная клиника', icon: '🏥' },
      { value: 'pediatrics', label: 'Педиатрия', icon: '👶' },
      { value: 'dentistry', label: 'Стоматология', icon: '🦷' },
      { value: 'diagnostics', label: 'Диагностический центр', icon: '🔬' },
    ],
  },
  {
    key: 'department',
    title: 'Отделение',
    options: [
      { value: 'ultrasound', label: 'УЗИ', icon: '📡' },
      { value: 'anesthesia', label: 'Анестезиология', icon: '💉' },
      { value: 'radiology', label: 'Лучевая диагностика', icon: '☢️' },
      { value: 'endoscopy', label: 'Эндоскопия', icon: '🔭' },
    ],
  },
  {
    key: 'budget',
    title: 'Бюджет',
    options: [
      { value: 'under_5m', label: 'до 5 млн ₸', icon: '💰' },
      { value: '5_15m', label: '5–15 млн ₸', icon: '💰💰' },
      { value: '15_50m', label: '15–50 млн ₸', icon: '💰💰💰' },
      { value: 'over_50m', label: 'свыше 50 млн ₸', icon: '💎' },
    ],
  },
  {
    key: 'urgency',
    title: 'Срочность',
    options: [
      { value: 'urgent_2w', label: 'до 2 недель', icon: '🚀' },
      { value: '1_3m', label: '1–3 месяца', icon: '📅' },
      { value: 'no_rush', label: 'Не срочно', icon: '🌿' },
      { value: 'building', label: 'Строимся', icon: '🏗️' },
    ],
  },
]

const currentStep = ref<Step>(1)
const answers = reactive<Partial<QuizAnswers>>({})
const recommendations = ref<any[]>([])
const loading = ref(false)
const started = ref(false)

const stepIndex = computed(() => {
  if (currentStep.value === 'result') return 4
  return (currentStep.value as number) - 1
})

const currentStepDef = computed(() =>
  currentStep.value !== 'result' ? STEPS[(currentStep.value as number) - 1] : null,
)

onMounted(() => {
  const saved = quiz.load()
  if (saved.institutionType && saved.department && saved.budget && saved.urgency) {
    Object.assign(answers, saved)
    loadResults(saved as QuizAnswers)
  }
})

async function select(value: string) {
  const step = currentStep.value as number
  const key = STEPS[step - 1].key

  if (!started.value) {
    started.value = true
    trackGoal('quiz_started')
  }

  ;(answers as any)[key] = value
  quiz.save(answers)
  trackGoal('quiz_step_completed', { step, value })

  if (step < 4) {
    currentStep.value = (step + 1) as Step
  } else {
    await loadResults(answers as QuizAnswers)
  }
}

async function loadResults(a: QuizAnswers) {
  loading.value = true
  currentStep.value = 'result'
  try {
    recommendations.value = await quiz.fetchRecommendations(a)
    trackGoal('quiz_completed', { answers: a })
  } catch {
    recommendations.value = []
  } finally {
    loading.value = false
  }
}

function goBack() {
  if (currentStep.value === 'result') {
    currentStep.value = 4
    recommendations.value = []
  } else if ((currentStep.value as number) > 1) {
    currentStep.value = ((currentStep.value as number) - 1) as Step
  }
}

function reset() {
  Object.keys(answers).forEach((k) => delete (answers as any)[k])
  quiz.clear()
  recommendations.value = []
  currentStep.value = 1
  started.value = false
}

function openQuote() {
  trackGoal('quiz_quote_clicked', {
    answers: { ...answers },
    productIds: recommendations.value.map((p) => p.id),
  })
  ui.openQuote({
    source: 'quiz',
    quizAnswers: answers as QuizAnswers,
  })
}

const answerSummary = computed(() => {
  const parts: string[] = []
  if (answers.institutionType) parts.push(INSTITUTION_LABELS[answers.institutionType])
  if (answers.department) parts.push(DEPARTMENT_LABELS[answers.department])
  if (answers.budget) parts.push(BUDGET_LABELS[answers.budget])
  if (answers.urgency) parts.push(URGENCY_LABELS[answers.urgency])
  return parts.join(' · ')
})
</script>

<template>
  <div :class="['quiz', variant === 'compact' ? 'quiz--compact' : '']">
    <div class="quiz-inner">
      <!-- Header -->
      <div class="quiz-header">
        <div class="quiz-eyebrow">Подбор оборудования</div>
        <SectionHeading :level="variant === 'compact' ? 3 : 2" class="quiz-title">
          Подберём оборудование под вашу клинику
        </SectionHeading>
        <p class="quiz-subtitle">
          4 вопроса — и мы покажем подходящие позиции из нашего каталога
        </p>
      </div>

      <!-- Progress -->
      <div v-if="currentStep !== 'result'" class="quiz-progress">
        <div
          v-for="i in 4"
          :key="i"
          :class="['progress-dot', i <= (currentStep as number) ? 'progress-dot--active' : '']"
        />
        <span class="progress-label">{{ currentStep }} / 4</span>
      </div>

      <!-- Step -->
      <Transition name="slide" mode="out-in">
        <div v-if="currentStep !== 'result'" :key="currentStep" class="quiz-step">
          <h3 class="step-question">{{ currentStepDef?.title }}</h3>
          <div class="options-grid">
            <button
              v-for="opt in currentStepDef?.options"
              :key="opt.value"
              type="button"
              :class="[
                'option-card',
                (answers as any)[currentStepDef!.key] === opt.value ? 'option-card--selected' : '',
              ]"
              @click="select(opt.value)"
            >
              <span class="option-icon">{{ opt.icon }}</span>
              <span class="option-label">{{ opt.label }}</span>
            </button>
          </div>
          <div class="step-nav">
            <button v-if="(currentStep as number) > 1" type="button" class="btn-back" @click="goBack">
              ← Назад
            </button>
          </div>
        </div>

        <!-- Results -->
        <div v-else key="result" class="quiz-result">
          <div class="result-summary">
            <span class="result-check">✓</span>
            <div>
              <p class="result-label">Ваш профиль</p>
              <p class="result-answers">{{ answerSummary }}</p>
            </div>
            <button type="button" class="btn-reset" @click="reset">Начать заново</button>
          </div>

          <div v-if="loading" class="result-loading">
            <div class="spinner" />
            <span>Подбираем позиции…</span>
          </div>

          <div v-else-if="recommendations.length" class="result-products">
            <p class="result-title">Рекомендуем для вас</p>
            <div class="products-grid">
              <ProductCard v-for="p in recommendations" :key="p.id" :product="p" />
            </div>
          </div>

          <div v-else class="result-empty">
            Точных совпадений нет — наш менеджер подберёт вручную.
          </div>

          <div class="result-cta">
            <button type="button" class="btn-primary" @click="openQuote">
              Запросить КП по этим позициям
            </button>
            <button type="button" class="btn-back" @click="goBack">← Изменить ответы</button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.quiz {
  background: var(--color-surface, #f8f7f4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.quiz-inner {
  padding: var(--space-8) var(--space-8);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.quiz--compact .quiz-inner {
  padding: var(--space-5) var(--space-6);
  gap: var(--space-4);
}

/* Header */
.quiz-eyebrow {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-primary);
  margin-bottom: var(--space-2);
}

.quiz-title {
  margin: 0 0 var(--space-2);
}

.quiz--compact .quiz-title {
  font-size: 18px;
}

.quiz-subtitle {
  font-size: 14px;
  color: var(--color-text-muted);
  margin: 0;
}

/* Progress */
.quiz-progress {
  display: flex;
  align-items: center;
  gap: 6px;
}

.progress-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-border);
  transition: background 0.2s;
}

.progress-dot--active {
  background: var(--color-primary);
}

.progress-label {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-left: var(--space-2);
}

/* Step */
.step-question {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 var(--space-4);
}

.quiz--compact .step-question {
  font-size: 15px;
  margin-bottom: var(--space-3);
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
}

@media (min-width: 640px) {
  .options-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.option-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-3);
  background: #fff;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, transform 0.1s;
  text-align: center;
}

.quiz--compact .option-card {
  padding: var(--space-3);
  font-size: 13px;
}

.option-card:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-soft, #e8f0fd);
}

.option-card--selected {
  border-color: var(--color-primary);
  background: var(--color-primary-soft, #e8f0fd);
}

.option-icon {
  font-size: 28px;
  line-height: 1;
}

.quiz--compact .option-icon {
  font-size: 22px;
}

.option-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.3;
}

.step-nav {
  margin-top: var(--space-4);
  display: flex;
  gap: var(--space-3);
}

/* Buttons */
.btn-back {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  color: var(--color-text-muted);
  padding: 0;
  transition: color 0.15s;
}

.btn-back:hover {
  color: var(--color-text);
}

.btn-reset {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  cursor: pointer;
  font-size: 12px;
  color: var(--color-text-muted);
  padding: 4px 12px;
  white-space: nowrap;
  transition: background 0.15s;
}

.btn-reset:hover {
  background: var(--color-surface);
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  padding: 12px 28px;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: filter 0.15s;
}

.btn-primary:hover {
  filter: brightness(1.08);
}

/* Results */
.result-summary {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: #fff;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  flex-wrap: wrap;
}

.result-check {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #dcf5e7;
  color: #16a34a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
}

.result-label {
  font-size: 11px;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 2px;
}

.result-answers {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.result-loading {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--color-text-muted);
  font-size: 14px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.result-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 var(--space-4);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--space-4);
  align-items: start;
}

.result-empty {
  font-size: 14px;
  color: var(--color-text-muted);
  padding: var(--space-4) 0;
}

.result-cta {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
  padding-top: var(--space-2);
}

/* Transition */
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(16px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-16px);
}
</style>
