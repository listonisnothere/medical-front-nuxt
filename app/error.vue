<script setup lang="ts">
import type { NuxtError } from '#app'
import NotFoundView from '@/views/NotFoundView.vue'

defineProps<{ error: NuxtError }>()
</script>

<template>
  <NotFoundView />
</template>
