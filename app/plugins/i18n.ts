import { createI18n } from 'vue-i18n'
import ru from '@/locales/ru.json'
import kk from '@/locales/kk.json'

type MessageSchema = typeof ru

const messages = { ru, kk }

export default defineNuxtPlugin((nuxtApp) => {
  const i18n = createI18n<{ message: MessageSchema }, keyof typeof messages>({
    legacy: false,
    locale: 'ru',
    fallbackLocale: 'ru',
    messages,
    globalInjection: true,
    missingWarn: false,
    fallbackWarn: false,
  })

  nuxtApp.vueApp.use(i18n)
})
