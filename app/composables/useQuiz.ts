export interface QuizAnswers {
  institutionType: 'multi' | 'pediatrics' | 'dentistry' | 'diagnostics'
  department: 'ultrasound' | 'anesthesia' | 'radiology' | 'endoscopy'
  budget: 'under_5m' | '5_15m' | '15_50m' | 'over_50m'
  urgency: 'urgent_2w' | '1_3m' | 'no_rush' | 'building'
}

const STORAGE_KEY = 'mst:quiz:v1'

export const INSTITUTION_LABELS: Record<QuizAnswers['institutionType'], string> = {
  multi: 'Многопрофильная клиника',
  pediatrics: 'Педиатрия',
  dentistry: 'Стоматология',
  diagnostics: 'Диагностический центр',
}

export const DEPARTMENT_LABELS: Record<QuizAnswers['department'], string> = {
  ultrasound: 'УЗИ',
  anesthesia: 'Анестезиология',
  radiology: 'Лучевая диагностика',
  endoscopy: 'Эндоскопия',
}

export const BUDGET_LABELS: Record<QuizAnswers['budget'], string> = {
  under_5m: 'до 5 млн ₸',
  '5_15m': '5–15 млн ₸',
  '15_50m': '15–50 млн ₸',
  over_50m: 'свыше 50 млн ₸',
}

export const URGENCY_LABELS: Record<QuizAnswers['urgency'], string> = {
  urgent_2w: 'до 2 недель',
  '1_3m': '1–3 месяца',
  no_rush: 'не срочно',
  building: 'строимся',
}

export function formatQuizSummary(answers: QuizAnswers): string {
  return [
    INSTITUTION_LABELS[answers.institutionType],
    DEPARTMENT_LABELS[answers.department],
    BUDGET_LABELS[answers.budget],
    URGENCY_LABELS[answers.urgency],
  ].join(' / ')
}

export function useQuiz() {
  function load(): Partial<QuizAnswers> {
    if (!import.meta.client) return {}
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  }

  function save(answers: Partial<QuizAnswers>) {
    if (!import.meta.client) return
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
  }

  function clear() {
    if (!import.meta.client) return
    sessionStorage.removeItem(STORAGE_KEY)
  }

  async function fetchRecommendations(answers: QuizAnswers) {
    const config = useRuntimeConfig()
    return $fetch<any[]>(`${config.public.apiBase}/products/recommendations`, {
      method: 'POST',
      body: answers,
    })
  }

  return { load, save, clear, fetchRecommendations }
}
