<template>
  <div class="credentials">
    <article class="card">
      <div class="card-num">17</div>
      <div class="card-body">
        <h3>{{ $t('credentials.card1h') }}</h3>
        <p>{{ $t('credentials.card1p') }}</p>
      </div>
    </article>
    <article class="card">
      <div class="card-num">100%</div>
      <div class="card-body">
        <h3>{{ $t('credentials.card2h') }}</h3>
        <p>{{ $t('credentials.card2p') }}</p>
      </div>
    </article>
    <article class="card card--accent">
      <div class="card-num">500+</div>
      <div class="card-body">
        <h3>{{ $t('credentials.card3h') }}</h3>
        <p>{{ $t('credentials.card3p') }}</p>
      </div>
    </article>
    <article class="card">
      <div class="card-num">6</div>
      <div class="card-body">
        <h3>{{ $t('credentials.card4h') }}</h3>
        <p>{{ $t('credentials.card4p') }}</p>
      </div>
    </article>
  </div>
</template>

<style scoped>
.credentials {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}

.card {
  display: flex;
  gap: var(--space-5);
  padding: var(--space-6);
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  align-items: flex-start;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow);
}

.card--accent {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.card--accent .card-num {
  color: #c8881a;
}

.card--accent h3 {
  color: #fff;
}

.card--accent p {
  color: rgba(255, 255, 255, 0.72);
}

.card-num {
  font-family: var(--font-display);
  font-size: 52px;
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: -0.03em;
  line-height: 1;
  flex-shrink: 0;
  min-width: 80px;
}

.card-body {
  flex: 1;
}

h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: var(--space-2);
  color: var(--color-text);
}

p {
  color: var(--color-text-muted);
  font-size: 14px;
  line-height: 1.65;
}

@media (max-width: 700px) {
  .credentials {
    grid-template-columns: 1fr;
  }
}
</style>
