<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'

const route = useRoute()
const isAdmin = computed(() => route.path.startsWith('/admin'))
</script>

<template>
  <SiteHeader v-if="!isAdmin" />
  <main>
    <RouterView />
  </main>
  <SiteFooter v-if="!isAdmin" />
</template>
