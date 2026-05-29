import type { FaqItem } from '@/composables/useMeta'

interface SeoParts {
  title?: string
  description?: string
  keywords?: string
  faq?: FaqItem[]
}

// Backend wins field-by-field when non-empty; otherwise fallback fills the gap
export function mergeSeo(fallback: SeoParts, override?: SeoParts | null): Required<SeoParts> {
  return {
    title: override?.title?.trim() || fallback.title || '',
    description: override?.description?.trim() || fallback.description || '',
    keywords: override?.keywords?.trim() || fallback.keywords || '',
    faq: override?.faq?.length ? override.faq : (fallback.faq ?? []),
  }
}
