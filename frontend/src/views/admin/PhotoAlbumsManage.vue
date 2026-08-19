<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAdmin } from '../../composables/useApi'
import type { PhotoAlbum } from '../../types'

const { getAll, create, update, remove } = useAdmin()

const items = ref<PhotoAlbum[]>([])
const search = ref('')
const showModal = ref(false)
const editingItem = ref<Partial<PhotoAlbum>>({})
const loading = ref(true)

const filteredItems = computed(() => {
  if (!search.value) return items.value
  const q = search.value.toLowerCase()
  return items.value.filter(item => item.title.toLowerCase().includes(q))
})

const fetchData = async () => {
  try {
    items.value = await getAll<PhotoAlbum>('photo-albums')
  } catch (e: any) {
    alert('載入失敗：' + (e.message || '未知錯誤'))
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  editingItem.value = { title: '', url: '', image_url: '' }
  showModal.value = true
}

const openEdit = (item: PhotoAlbum) => {
  editingItem.value = { ...item }
  showModal.value = true
}

const handleSave = async () => {
  try {
    if (editingItem.value.id) {
      await update<PhotoAlbum>('photo-albums', editingItem.value.id, editingItem.value)
    } else {
      await create<PhotoAlbum>('photo-albums', editingItem.value)
    }
    showModal.value = false
    await fetchData()
  } catch (e: any) {
    alert('儲存失敗：' + (e.message || '未知錯誤'))
  }
}

const handleDelete = async (item: PhotoAlbum) => {
  if (!confirm(`確定要刪除「${item.title}」嗎？`)) return
  try {
    await remove('photo-albums', item.id)
    await fetchData()
  } catch (e: any) {
    alert('刪除失敗：' + (e.message || '未知錯誤'))
  }
}

onMounted(fetchData)
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>活動花絮</h2>
      <button class="btn btn-primary" @click="openCreate">新增花絮</button>
    </div>

    <div class="mb-3">
      <input v-model="search" type="text" class="form-control" placeholder="搜尋標題..." />
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status"></div>
    </div>
    <div v-else class="table-responsive">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>標題</th>
            <th>連結</th>
            <th style="width: 150px">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredItems" :key="item.id">
            <td>{{ item.title }}</td>
            <td>
              <a :href="item.url" target="_blank" class="text-truncate d-inline-block" style="max-width: 300px">
                {{ item.url }}
              </a>
            </td>
            <td>
              <button class="btn btn-sm btn-outline-primary me-1" @click="openEdit(item)">編輯</button>
              <button class="btn btn-sm btn-outline-danger" @click="handleDelete(item)">刪除</button>
            </td>
          </tr>
          <tr v-if="filteredItems.length === 0">
            <td colspan="3" class="text-center text-muted py-4">尚無資料</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingItem.id ? '編輯花絮' : '新增花絮' }}</h5>
            <button type="button" class="btn-close" @click="showModal = false"></button>
          </div>
          <form @submit.prevent="handleSave">
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">標題</label>
                <input v-model="editingItem.title" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Facebook 相簿連結</label>
                <input v-model="editingItem.url" type="url" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">封面圖片網址</label>
                <input v-model="editingItem.image_url" type="text" class="form-control" />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showModal = false">取消</button>
              <button type="submit" class="btn btn-primary">儲存</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
