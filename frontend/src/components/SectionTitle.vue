<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <h2 class="text-center text-warning mb-4">{{ title }}</h2>
</template>
