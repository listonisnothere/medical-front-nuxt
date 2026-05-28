<script setup lang="ts">
import AppContainer from '@/components/ui/AppContainer.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import { useMeta } from '@/composables/useMeta'

useMeta({
  title: () => 'Политика конфиденциальности',
  description: () =>
    'Политика конфиденциальности ТОО «MedCore Group». Условия сбора, обработки и защиты персональных данных пользователей сайта.',
  noindex: true,
})
</script>

<template>
  <AppContainer>
    <div class="page">
      <Breadcrumbs :items="[{ label: $t('privacy.breadcrumb') }]" />
      <SectionHeading :eyebrow="$t('privacy.eyebrow')" :level="1">{{ $t('privacy.title') }}</SectionHeading>

      <div class="doc">
        <p class="updated">{{ $t('privacy.updated') }}</p>

        <section>
          <h2>{{ $t('privacy.s1h') }}</h2>
          <p>{{ $t('privacy.s1p') }}</p>
        </section>

        <section>
          <h2>{{ $t('privacy.s2h') }}</h2>
          <ul>
            <li>{{ $t('privacy.s2i1') }}</li>
            <li>{{ $t('privacy.s2i2') }}</li>
            <li>{{ $t('privacy.s2i3') }}</li>
          </ul>
        </section>

        <section>
          <h2>{{ $t('privacy.s3h') }}</h2>
          <ul>
            <li>{{ $t('privacy.s3i1') }}</li>
            <li>{{ $t('privacy.s3i2') }}</li>
            <li>{{ $t('privacy.s3i3') }}</li>
          </ul>
        </section>

        <section>
          <h2>{{ $t('privacy.s4h') }}</h2>
          <p>{{ $t('privacy.s4p') }}</p>
        </section>

        <section>
          <h2>{{ $t('privacy.s5h') }}</h2>
          <p>{{ $t('privacy.s5p') }}</p>
        </section>

        <section>
          <h2>{{ $t('privacy.s6h') }}</h2>
          <p>
            {{ $t('privacy.s6p1') }}
            <a href="https://yandex.ru/legal/metrica_termsofuse/" target="_blank" rel="noopener">
              {{ $t('privacy.s6link') }}
            </a>.
          </p>
          <p>{{ $t('privacy.s6p2') }}</p>
        </section>

        <section>
          <h2>{{ $t('privacy.s7h') }}</h2>
          <ul>
            <li>{{ $t('privacy.s7i1') }}</li>
            <li>{{ $t('privacy.s7i2') }}</li>
            <li>{{ $t('privacy.s7i3') }}</li>
          </ul>
          <p>
            {{ $t('privacy.s7contact') }}
            <a href="mailto:MedCore_Group@mail.ru">MedCore_Group@mail.ru</a>
          </p>
        </section>

        <section>
          <h2>{{ $t('privacy.s8h') }}</h2>
          <p>
            ТОО «MedCore Group»<br />
            г. Усть-Каменогорск, ВКО, Республика Казахстан<br />
            Тел.: <a href="tel:+77752540351">+7 775 254 03 51</a><br />
            E-mail: <a href="mailto:MedCore_Group@mail.ru">MedCore_Group@mail.ru</a>
          </p>
        </section>
      </div>
    </div>
  </AppContainer>
</template>

<style scoped>
.page {
  margin-top: var(--space-7);
}

.doc {
  max-width: 760px;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.updated {
  font-size: 14px;
  color: var(--color-text-muted);
}

section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

h2 {
  font-size: 20px;
  font-weight: 600;
}

p, li {
  font-size: 15px;
  line-height: 1.7;
  color: var(--color-text);
}

ul {
  padding-left: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  list-style: disc;
}

a {
  color: var(--color-primary);
}

a:hover {
  text-decoration: underline;
}
</style>
