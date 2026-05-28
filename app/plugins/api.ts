import { setApiBase } from '@/composables/useApi'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  setApiBase(config.public.apiBase)
})
