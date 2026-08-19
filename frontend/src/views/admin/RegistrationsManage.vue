<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAdmin } from '../../composables/useApi'
import type { Registration } from '../../types'

const { getAll, remove } = useAdmin()

const items = ref<Registration[]>([])
const search = ref('')
const loading = ref(true)

const filteredItems = computed(() => {
  if (!search.value) return items.value
  const q = search.value.toLowerCase()
  return items.value.filter(
    item =>
      item.name.toLowerCase().includes(q) ||
      (item.course_title && item.course_title.toLowerCase().includes(q)) ||
      item.email.toLowerCase().includes(q)
  )
})

const fetchData = async () => {
  try {
    items.value = await getAll<Registration>('registrations')
  } catch (e: any) {
    alert('載入失敗：' + (e.message || '未知錯誤'))
  } finally {
    loading.value = false
  }
}

const handleDelete = async (item: Registration) => {
  if (!confirm(`確定要刪除「${item.name}」的報名紀錄嗎？`)) return
  try {
    await remove('registrations', item.id)
    await fetchData()
  } catch (e: any) {
    alert('刪除失敗：' + (e.message || '未知錯誤'))
  }
}

const formatDate = (d: string) => new Date(d).toLocaleDateString('zh-TW')

onMounted(fetchData)
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>報名管理</h2>
    </div>

    <div class="mb-3">
      <input v-model="search" type="text" class="form-control" placeholder="搜尋姓名、課程或 Email..." />
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status"></div>
    </div>
    <div v-else class="table-responsive">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>課程</th>
            <th>姓名</th>
            <th>Email</th>
            <th>電話</th>
            <th>報名日期</th>
            <th style="width: 80px">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredItems" :key="item.id">
            <td>{{ item.course_title || '-' }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.email }}</td>
            <td>{{ item.phone }}</td>
            <td>{{ formatDate(item.created_at) }}</td>
            <td>
              <button class="btn btn-sm btn-outline-danger" @click="handleDelete(item)">刪除</button>
            </td>
          </tr>
          <tr v-if="filteredItems.length === 0">
            <td colspan="6" class="text-center text-muted py-4">尚無資料</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
