<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()
const route = useRoute()
const router = useRouter()
const now = ref(Date.now())

let timer: number | undefined

const isCartRoute = computed(() => route.path === '/cart' || route.path.startsWith('/cart/'))
const visible = computed(() => !isCartRoute.value && cart.canRemind(now.value))

function refreshNow() {
  now.value = Date.now()
}

function dismiss() {
  cart.markReminderShown()
  refreshNow()
}

function openCart() {
  cart.markReminderShown()
  router.push('/cart')
}

onMounted(() => {
  refreshNow()
  timer = window.setInterval(refreshNow, 60_000)
  document.addEventListener('visibilitychange', refreshNow)
})

onUnmounted(() => {
  if (timer) window.clearInterval(timer)
  document.removeEventListener('visibilitychange', refreshNow)
})
</script>

<template>
  <Transition name="cart-reminder">
    <aside v-if="visible" class="cart-reminder" role="status" aria-live="polite">
      <div class="cart-reminder__body">
        <strong>{{ $t('cartReminder.title') }}</strong>
        <p>{{ $t('cartReminder.text', { n: cart.count }) }}</p>
      </div>
      <button type="button" class="cart-reminder__action" @click="openCart">
        {{ $t('cartReminder.open') }}
      </button>
      <button
        type="button"
        class="cart-reminder__close"
        :aria-label="$t('cartReminder.dismiss')"
        @click="dismiss"
      >
        ×
      </button>
    </aside>
  </Transition>
</template>

<style scoped>
.cart-reminder {
  position: fixed;
  right: clamp(16px, 4vw, 32px);
  bottom: clamp(16px, 4vw, 32px);
  z-index: 80;
  width: min(420px, calc(100vw - 32px));
  display: grid;
  grid-template-columns: 1fr auto 36px;
  gap: 12px;
  align-items: center;
  padding: 14px;
  color: #fff;
  background: #16304f;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: var(--radius-lg);
  box-shadow: 0 18px 48px rgba(11, 25, 41, 0.28);
}

.cart-reminder__body {
  min-width: 0;
}

.cart-reminder__body strong {
  display: block;
  font-size: 14px;
  line-height: 1.25;
  margin-bottom: 3px;
}

.cart-reminder__body p {
  color: rgba(255, 255, 255, 0.78);
  font-size: 13px;
  line-height: 1.35;
  margin: 0;
}

.cart-reminder__action,
.cart-reminder__close {
  min-height: 36px;
  border-radius: var(--radius-sm);
  font-weight: 700;
  transition:
    background 0.15s,
    color 0.15s,
    transform 0.05s;
}

.cart-reminder__action:active,
.cart-reminder__close:active {
  transform: translateY(1px);
}

.cart-reminder__action {
  padding: 0 14px;
  color: #16304f;
  background: #fff;
  white-space: nowrap;
}

.cart-reminder__action:hover {
  background: #e9f5f2;
}

.cart-reminder__close {
  width: 36px;
  display: grid;
  place-items: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 24px;
  line-height: 1;
}

.cart-reminder__close:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
}

.cart-reminder-enter-active,
.cart-reminder-leave-active {
  transition:
    opacity 0.18s,
    transform 0.18s;
}

.cart-reminder-enter-from,
.cart-reminder-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

@media (max-width: 520px) {
  .cart-reminder {
    grid-template-columns: 1fr 36px;
  }

  .cart-reminder__action {
    grid-column: 1 / -1;
    order: 3;
    width: 100%;
  }

  .cart-reminder__close {
    align-self: start;
  }
}
</style>
