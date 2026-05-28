<template>
  <div class="container"><slot /></div>
</template>

<style scoped>
.container {
  width: 100%;
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 var(--space-5);
}

@media (max-width: 640px) {
  .container {
    padding: 0 var(--space-4);
  }
}
</style>
