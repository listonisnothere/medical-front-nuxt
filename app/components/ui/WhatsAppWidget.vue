<template>
  <a
    class="whatsapp-widget"
    href="https://wa.me/77752540351"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Написать в WhatsApp"
    title="Написать в WhatsApp"
  >
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M16.03 3.2C9.06 3.2 3.4 8.83 3.4 15.75c0 2.21.59 4.38 1.72 6.28L3.3 28.8l6.96-1.78a12.74 12.74 0 0 0 5.77 1.38c6.97 0 12.63-5.63 12.63-12.55S23 3.2 16.03 3.2Zm0 22.98c-1.83 0-3.62-.49-5.18-1.42l-.37-.22-4.12 1.05 1.09-4-.24-.41a10.2 10.2 0 0 1-1.58-5.43c0-5.7 4.66-10.33 10.4-10.33s10.4 4.63 10.4 10.33-4.66 10.43-10.4 10.43Zm5.7-7.81c-.31-.16-1.85-.91-2.14-1.01-.29-.11-.5-.16-.71.16-.21.31-.82 1.01-1 1.22-.18.21-.37.24-.68.08-.31-.16-1.32-.48-2.52-1.54-.93-.83-1.56-1.85-1.74-2.16-.18-.31-.02-.48.14-.64.14-.14.31-.37.47-.55.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.71-1.7-.97-2.33-.26-.61-.52-.53-.71-.54h-.61c-.21 0-.55.08-.84.39-.29.31-1.1 1.07-1.1 2.6s1.13 3.02 1.29 3.23c.16.21 2.23 3.38 5.4 4.74.75.32 1.34.51 1.8.66.76.24 1.45.21 1.99.13.61-.09 1.85-.75 2.11-1.48.26-.73.26-1.35.18-1.48-.08-.13-.29-.21-.61-.37Z"
      />
    </svg>
  </a>
</template>

<style scoped>
.whatsapp-widget {
  position: fixed;
  left: clamp(16px, 4vw, 32px);
  bottom: calc(clamp(16px, 4vw, 32px) + env(safe-area-inset-bottom));
  z-index: 70;
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  color: #fff;
  background: #25d366;
  border-radius: 50%;
  box-shadow: 0 14px 34px rgba(11, 25, 41, 0.24);
  transition:
    background 0.15s,
    box-shadow 0.15s,
    transform 0.15s;
}

.whatsapp-widget:hover {
  background: #1fbd5a;
  box-shadow: 0 18px 42px rgba(11, 25, 41, 0.28);
  transform: translateY(-2px);
}

.whatsapp-widget:focus-visible {
  outline: 3px solid rgba(37, 211, 102, 0.35);
  outline-offset: 4px;
}

.whatsapp-widget svg {
  width: 34px;
  height: 34px;
}

@media (max-width: 520px) {
  .whatsapp-widget {
    width: 54px;
    height: 54px;
  }

  .whatsapp-widget svg {
    width: 32px;
    height: 32px;
  }
}
</style>
