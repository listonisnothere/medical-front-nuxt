<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import BaseButton from './BaseButton.vue'

const KEY = 'mst:cookies-accepted'
const visible = ref(false)

onMounted(() => {
  if (typeof localStorage !== 'undefined' && !localStorage.getItem(KEY)) {
    visible.value = true
  }
})

const accept = () => {
  if (typeof localStorage !== 'undefined') localStorage.setItem(KEY, '1')
  visible.value = false
}
</script>

<template>
  <Transition name="slide">
    <div v-if="visible" class="cookie">
      <p>
        {{ $t('cookieBanner.text') }}
        <RouterLink to="/privacy">{{ $t('cookieBanner.privacyLink') }}</RouterLink>.
      </p>
      <BaseButton variant="primary" size="sm" @click="accept">{{ $t('cookieBanner.accept') }}</BaseButton>
    </div>
  </Transition>
</template>

<style scoped>
.cookie {
  position: fixed;
  left: var(--space-4);
  right: var(--space-4);
  bottom: var(--space-4);
  z-index: 90;
  background: var(--color-text);
  color: rgba(255, 255, 255, 0.8);
  padding: var(--space-4) var(--space-5);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  gap: var(--space-5);
  box-shadow: var(--shadow-lg);
  max-width: 680px;
  margin: 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.cookie p {
  flex: 1;
  font-size: 13.5px;
  line-height: 1.55;
}

.cookie a {
  color: #c8b87a;
  text-decoration: underline;
}

.slide-enter-active,
.slide-leave-active {
  transition:
    transform 0.25s,
    opacity 0.25s;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(120%);
  opacity: 0;
}

@media (max-width: 600px) {
  .cookie {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
}
</style>
