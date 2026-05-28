<script setup lang="ts">
const team = [
  { initials: 'ГД', role: 'Генеральный директор' },
  { initials: 'ОП', role: 'Руководитель отдела продаж' },
  { initials: 'СИ', role: 'Сервисный инженер' },
  { initials: 'ТМ', role: 'Менеджер по тендерам' },
]
</script>

<template>
  <div class="team">
    <div v-for="member in team" :key="member.role" class="card">
      <div class="avatar" aria-hidden="true">{{ member.initials }}</div>
      <div class="info">
        <div class="role">{{ member.role }}</div>
        <div class="name">имя будет указано</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.team {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-3);
  padding: var(--space-5);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.role {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.3;
}

.name {
  font-size: 13px;
  color: var(--color-text-muted);
  font-style: italic;
}

@media (max-width: 900px) {
  .team {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 500px) {
  .team {
    grid-template-columns: 1fr;
  }
}
</style>
