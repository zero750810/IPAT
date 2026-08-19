<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAdmin } from '../../composables/useApi'
import type { AdminStats } from '../../types'

const { getStats } = useAdmin()

const stats = ref<AdminStats | null>(null)
const loading = ref(true)

const cards = [
  { key: 'news' as const, label: '新聞', icon: 'bi-newspaper', color: 'primary' },
  { key: 'courses' as const, label: '課程', icon: 'bi-book', color: 'success' },
  { key: 'members' as const, label: '成員', icon: 'bi-people', color: 'info' },
  { key: 'registrations' as const, label: '報名', icon: 'bi-clipboard-check', color: 'warning' },
]

onMounted(async () => {
  try {
    stats.value = await getStats()
  } catch (e: any) {
    alert('無法載入統計資料：' + (e.message || '未知錯誤'))
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <h2 class="mb-4">儀表板</h2>
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status"></div>
    </div>
    <div v-else-if="stats" class="row g-4">
      <div v-for="card in cards" :key="card.key" class="col-md-3 col-sm-6">
        <div class="card border-0 shadow-sm">
          <div class="card-body text-center">
            <i :class="['bi', card.icon, 'fs-1', `text-${card.color}`]"></i>
            <h5 class="mt-2">{{ card.label }}</h5>
            <p class="display-6 fw-bold mb-0">{{ stats[card.key] }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
